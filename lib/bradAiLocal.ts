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

export type BradAiLocalMessage = {
  role: string;
  content: string;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const latestUserMessage = (messages: BradAiLocalMessage[]) =>
  [...messages].reverse().find((message) => message.role === 'user')?.content?.trim() || '';

const formatOrderSteps = () =>
  HOW_TO_ORDER_STEPS.map((step, index) => `${index + 1}. ${step.title}: ${step.description}`).join('\n');

const buildWhatsAppHelp = (subject: string) =>
  `Jika Anda ingin dibantu lebih lanjut, lanjutkan ke WhatsApp Bradwear: ${buildWhatsAppUrl(buildConsultationMessage(subject))}`;

export const getBradAiLocalAnswer = (messages: BradAiLocalMessage[]) => {
  const question = latestUserMessage(messages);
  const q = normalize(question);

  if (!q) {
    return 'Halo, saya Brodi. Saya bisa bantu jelaskan bahan, model, cara order, tracking, lokasi workshop, dan layanan Bradwear Indonesia.';
  }

  if (/(halo|hai|hi|selamat)/.test(q)) {
    return 'Halo, saya Brodi. Saya siap bantu jelaskan katalog, bahan, alur order, tracking, dan layanan Bradwear Indonesia.';
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
