import {
  ARTICLES,
  BRAD_AI_CONTEXT,
  CUSTOMER_SERVICE_HOURS,
  HOW_TO_ORDER_STEPS,
  SITE_FAQS,
  STORE_ADDRESS,
  STORE_MAP_URL,
  buildConsultationMessage,
  buildWhatsAppUrl,
} from './siteConfig';

export type BradAiMessage = {
  role: string;
  content: string;
};

const BASE_URL = (process.env.SUMOPOD_BASE_URL || 'https://ai.sumopod.com').replace(/\/+$/, '');
const MODEL = process.env.SUMOPOD_MODEL || 'gemini/gemini-2.5-flash-lite';
const API_KEY = process.env.SUMOPOD_API_KEY;

const SYSTEM_PROMPT = [
  'Anda adalah Brad Ai, asisten resmi untuk website Bradwear Indonesia.',
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

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const latestUserMessage = (messages: BradAiMessage[]) =>
  [...messages].reverse().find((message) => message.role === 'user')?.content?.trim() || '';

const formatOrderSteps = () =>
  HOW_TO_ORDER_STEPS.map((step, index) => `${index + 1}. ${step.title}: ${step.description}`).join('\n');

const buildWhatsAppHelp = (subject: string) =>
  `Jika Anda ingin dibantu lebih lanjut, lanjutkan ke WhatsApp Bradwear: ${buildWhatsAppUrl(buildConsultationMessage(subject))}`;

const buildLocalAnswer = (messages: BradAiMessage[]) => {
  const question = latestUserMessage(messages);
  const q = normalize(question);

  if (!q) {
    return 'Halo, saya Brad Ai. Saya bisa bantu jelaskan bahan, model, cara order, tracking, lokasi workshop, dan layanan Bradwear Indonesia.';
  }

  if (/(halo|hai|hi|selamat)/.test(q)) {
    return 'Halo, saya Brad Ai. Saya siap bantu jelaskan katalog, bahan, alur order, tracking, dan layanan Bradwear Indonesia.';
  }

  if (/(bahan|material).*(lapangan|outdoor|operasional)/.test(q) || /(lapangan|outdoor|operasional).*(bahan|material)/.test(q)) {
    return [
      'Untuk seragam lapangan atau operasional aktif, bahan yang umumnya lebih cocok adalah Ripstop atau Nagata Drill karena lebih kokoh dan siap dipakai untuk aktivitas yang lebih berat.',
      'Jika kebutuhannya tetap rapi tetapi lebih ringan untuk pemakaian harian, Tropical atau Oxford biasanya lebih nyaman.',
      buildWhatsAppHelp('pemilihan bahan seragam lapangan yang paling cocok'),
    ].join('\n\n');
  }

  if (/(cara order|alur order|bagaimana order|pesan|pemesanan)/.test(q)) {
    return [
      'Alur order di Bradwear dibuat singkat dan jelas:',
      formatOrderSteps(),
      buildWhatsAppHelp('alur order seragam custom'),
    ].join('\n\n');
  }

  if (/(kirim|pengiriman|luar jawa|seluruh indonesia|antar)/.test(q)) {
    return [
      'Bradwear melayani pengiriman ke seluruh Indonesia, termasuk luar Jawa.',
      'Untuk tracking, pelanggan bisa memantau tahap produksi internal terlebih dahulu, lalu lanjut ke situs resmi kurir setelah nomor resi tersedia.',
      buildWhatsAppHelp('pengiriman seragam ke lokasi saya'),
    ].join('\n\n');
  }

  if (/(tracking|resi|lacak|status order)/.test(q)) {
    return [
      'Tracking di Bradwear terdiri dari dua tahap:',
      '1. Cek status produksi internal dengan order code di halaman Lacak Pesanan.',
      '2. Jika resi sudah tersedia, lanjutkan ke tracking resmi kurir seperti JNE, J&T Express, SiCepat, TIKI, Pos Indonesia, AnterAja, Ninja Xpress, atau ID Express.',
      buildWhatsAppHelp('status order dan tracking pengiriman'),
    ].join('\n\n');
  }

  if (/(alamat|lokasi|toko|workshop|tasikmalaya|maps)/.test(q)) {
    return [
      `Workshop Bradwear berada di ${STORE_ADDRESS}.`,
      `Google Maps: ${STORE_MAP_URL}`,
      buildWhatsAppHelp('kunjungan atau konsultasi ke workshop Bradwear'),
    ].join('\n\n');
  }

  if (/(pdh|pdl|lapangan|model|katalog|produk)/.test(q)) {
    const articleHint = ARTICLES.find((article) => article.slug === 'beda-pdh-pdl-dan-lapangan');
    return [
      'Bradwear menyiapkan katalog untuk kemeja, jaket, rompi, polo, dan pants custom.',
      'Secara umum, PDH lebih rapi untuk dinas harian, sedangkan model lapangan atau operasional biasanya lebih fungsional dengan detail yang lebih tangguh.',
      articleHint ? articleHint.excerpt : 'Jika Anda sudah punya kebutuhan tertentu, Bradwear bisa bantu arahkan model yang paling sesuai.',
      buildWhatsAppHelp('memilih model seragam yang paling cocok'),
    ].join('\n\n');
  }

  if (/(minimal|minimum).*(order|pesan)/.test(q)) {
    return `${SITE_FAQS[0].title} ${SITE_FAQS[0].answer}\n\n${buildWhatsAppHelp('minimal order seragam custom')}`;
  }

  if (/(estimasi|berapa lama|lead time|produksi)/.test(q)) {
    return `${SITE_FAQS[2].title} ${SITE_FAQS[2].answer}\n\n${buildWhatsAppHelp('estimasi produksi seragam custom')}`;
  }

  if (/(logo|bordir|nama personel|custom nama)/.test(q)) {
    return `${SITE_FAQS[1].title} ${SITE_FAQS[1].answer}\n\n${buildWhatsAppHelp('bordir logo dan nama personel')}`;
  }

  if (/(cs|whatsapp|kontak|hubungi|admin)/.test(q)) {
    return [
      `WhatsApp konsultasi Bradwear: ${buildWhatsAppUrl(buildConsultationMessage('konsultasi layanan Bradwear'))}`,
      `Jam operasional: ${CUSTOMER_SERVICE_HOURS.join(' | ')}`,
      buildWhatsAppHelp('konsultasi seragam custom'),
    ].join('\n\n');
  }

  const matchedContext = BRAD_AI_CONTEXT.find((section) =>
    normalize(section.heading)
      .split(' ')
      .some((token) => token.length > 3 && q.includes(token)),
  );

  if (matchedContext) {
    return [
      matchedContext.body,
      buildWhatsAppHelp(question || 'kebutuhan seragam custom'),
    ].join('\n\n');
  }

  return [
    'Saya bisa bantu untuk topik katalog, bahan, model, cara order, tracking, lokasi workshop, dan layanan Bradwear Indonesia.',
    'Kalau Anda mau, kirim pertanyaan yang lebih spesifik, misalnya bahan untuk lapangan, perbedaan model, estimasi produksi, atau cara order.',
    buildWhatsAppHelp(question || 'kebutuhan seragam custom'),
  ].join('\n\n');
};

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

  throw new Error('Brad Ai gagal terhubung ke layanan AI upstream.');
};

export const getBradAiAnswer = async (messages: BradAiMessage[]) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    return buildLocalAnswer([]);
  }

  if (!API_KEY) {
    return buildLocalAnswer(messages);
  }

  try {
    return await callSumopod(messages);
  } catch {
    return buildLocalAnswer(messages);
  }
};
