const BASE_URL = (process.env.SUMOPOD_BASE_URL || 'https://ai.sumopod.com').replace(/\/+$/, '');
const MODEL = process.env.SUMOPOD_OCR_MODEL || process.env.SUMOPOD_MODEL || 'gemini/gemini-2.5-flash-lite';
const API_KEY = process.env.SUMOPOD_API_KEY;

const OCR_PROMPT = [
  'Anda membaca gambar katalog warna kain.',
  'Gambar yang diberikan adalah hasil crop area scan.',
  'Ekstrak hanya kode warna atau label katalog yang paling jelas berada di tengah area scan.',
  'Abaikan garis dekoratif, ikon, overlay, atau teks lain di luar label utama.',
  'Prioritaskan kode seperti 003, 59-M, 118, atau kombinasi huruf-angka yang serupa.',
  'Balas hanya dengan satu kode terbaik tanpa kalimat tambahan.',
].join(' ');

const extractBestCode = (rawText: string) => {
  const normalized = rawText.toUpperCase().replace(/\s+/g, ' ').trim();
  const matches: string[] = normalized.match(/[A-Z0-9]{2,}(?:-[A-Z0-9]+)*/g) ?? [];

  const prioritized = matches.find((token) => /\d/.test(token) && token.length <= 12);
  if (prioritized) {
    return prioritized;
  }

  return matches[0] || normalized;
};

const callSumopodColorScan = async (imageDataUrl: string) => {
  const payload = {
    model: MODEL,
    temperature: 0,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: OCR_PROMPT },
          { type: 'image_url', image_url: { url: imageDataUrl } },
        ],
      },
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
      return extractBestCode(content);
    }
  }

  throw new Error('OCR kode warna gagal terhubung ke layanan AI upstream.');
};

export const scanColorCode = async (imageDataUrl: string) => {
  if (!imageDataUrl?.startsWith('data:image/')) {
    throw new Error('Payload gambar scan tidak valid.');
  }

  if (!API_KEY) {
    throw new Error('SUMOPOD_API_KEY belum tersedia untuk OCR kode warna.');
  }

  return callSumopodColorScan(imageDataUrl);
};
