import { BRAD_AI_CONTEXT } from '../lib/siteConfig';

type RequestLike = {
  method?: string;
  body?: {
    messages?: Array<{ role: string; content: string }>;
  };
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
  setHeader: (key: string, value: string) => void;
};

const BASE_URL = (process.env.SUMOPOD_BASE_URL || 'https://ai.sumopod.com').replace(/\/+$/, '');
const MODEL = process.env.SUMOPOD_MODEL || 'gemini/gemini-2.5-flash-lite';
const API_KEY = process.env.SUMOPOD_API_KEY;

const SYSTEM_PROMPT = [
  'Anda adalah Brad Ai, asisten resmi untuk website Bradwear Indonesia.',
  'Tugas Anda adalah menjawab dengan bahasa Indonesia yang natural, ringkas, informatif, dan fokus pada konteks website Bradwear.',
  'Jawaban hanya boleh membahas layanan, katalog produk, bahan, cara order, tracking, layanan pelanggan, lokasi toko, dan FAQ Bradwear.',
  'Jika informasi tidak tersedia, katakan dengan jujur dan arahkan pengguna untuk konsultasi ke WhatsApp Bradwear.',
  'Jangan mengarang harga, stok, timeline pasti, atau kebijakan yang tidak disebutkan dalam konteks.',
  'Gunakan nada profesional, membantu, dan mudah dipahami user umum.',
  '',
  'Konteks Bradwear:',
  ...BRAD_AI_CONTEXT.map((section) => `- ${section.heading}: ${section.body}`),
].join('\n');

const callSumopod = async (messages: Array<{ role: string; content: string }>) => {
  const payload = {
    model: MODEL,
    temperature: 0.4,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((message) => ({
        role: message.role === 'assistant' ? 'assistant' : 'user',
        content: message.content,
      })),
    ],
  };

  const candidates = [`${BASE_URL}/chat/completions`, `${BASE_URL}/v1/chat/completions`];
  let lastError: Error | null = null;

  for (const endpoint of candidates) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Upstream ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      return data?.choices?.[0]?.message?.content || '';
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown Sumopod error');
    }
  }

  throw lastError || new Error('Brad Ai gagal terhubung ke Sumopod.');
};

export default async function handler(req: RequestLike, res: ResponseLike) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!API_KEY) {
    res.status(500).json({ error: 'SUMOPOD_API_KEY belum dikonfigurasi di environment.' });
    return;
  }

  const messages = req.body?.messages ?? [];
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Payload messages wajib diisi.' });
    return;
  }

  try {
    const answer = await callSumopod(messages);
    res.status(200).json({ answer });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Brad Ai gagal memproses permintaan.';
    res.status(500).json({ error: message });
  }
}
