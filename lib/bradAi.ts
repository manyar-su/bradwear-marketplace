import { BRAD_AI_CONTEXT, SITE_FAQS } from './siteConfig';
import { getBradAiLocalAnswer } from './bradAiLocal';

export type BradAiMessage = {
  role: string;
  content: string;
};

const BASE_URL = (process.env.SUMOPOD_BASE_URL || 'https://ai.sumopod.com').replace(/\/+$/, '');
const MODEL = process.env.SUMOPOD_MODEL || 'gemini/gemini-2.5-flash-lite';
const API_KEY = process.env.SUMOPOD_API_KEY;

const SYSTEM_PROMPT = [
  'Anda adalah Brodi, asisten resmi untuk website Bradwear Indonesia.',
  'Jawab dalam bahasa Indonesia yang natural, ringkas, jelas, dan fokus pada konteks website Bradwear.',
  'Topik yang boleh dibahas: katalog produk, bahan, model, cara order, tracking, layanan pelanggan, FAQ, dan lokasi toko.',
  'Jika data spesifik belum tersedia, katakan dengan jujur dan arahkan user ke WhatsApp Bradwear.',
  'Jangan mengarang harga, stok, timeline pasti, atau kebijakan di luar konteks.',
  '',
  'Konteks Bradwear:',
  ...BRAD_AI_CONTEXT.map((section) => `- ${section.heading}: ${section.body}`),
  '',
  'FAQ utama:',
  ...SITE_FAQS.map((faq) => `- ${faq.title} ${faq.answer}`),
].join('\n');

const callSumopod = async (messages: BradAiMessage[]) => {
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

  for (const endpoint of candidates) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      continue;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (content) {
      return content;
    }
  }

  throw new Error('Brodi gagal terhubung ke layanan AI upstream.');
};

export const getBradAiAnswer = async (messages: BradAiMessage[]) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    return getBradAiLocalAnswer([]);
  }

  if (!API_KEY) {
    return getBradAiLocalAnswer(messages);
  }

  try {
    return await callSumopod(messages);
  } catch {
    return getBradAiLocalAnswer(messages);
  }
};
