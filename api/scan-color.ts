import { scanColorCode } from '../lib/colorScan';

type RequestLike = {
  method?: string;
  body?: {
    image?: string;
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

  const image = req.body?.image;
  if (!image) {
    res.status(400).json({ error: 'Payload image wajib diisi.' });
    return;
  }

  try {
    const code = await scanColorCode(image);
    res.status(200).json({ code });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OCR kode warna gagal diproses.';
    res.status(500).json({ error: message });
  }
}
