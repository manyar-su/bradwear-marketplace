import { BradAiMessage, getBradAiAnswer } from '../lib/bradAi';

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

export default async function handler(req: RequestLike, res: ResponseLike) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const messages = (req.body?.messages ?? []) as BradAiMessage[];
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Payload messages wajib diisi.' });
    return;
  }

  try {
    const answer = await getBradAiAnswer(messages);
    res.status(200).json({ answer });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Brad Ai gagal memproses permintaan.';
    res.status(500).json({ error: message });
  }
}
