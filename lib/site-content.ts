export const SITE_NAME = "Bradflow";
export const SITE_TAGLINE = "Pemesanan Kemeja, Polo, Jaket, dan Celana Seragam Custom";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bradflow.vercel.app";

export const CONTACT = {
  phoneDisplay: "+62 877-3683-4454",
  phoneDigits: "6287736834454",
  whatsappMessage:
    "Halo tim Bradwear, saya datang dari website Bradflow dan ingin konsultasi mengenai pembuatan kemeja/seragam custom. Mohon bantu rekomendasi model, estimasi harga, dan perkiraan waktu pengerjaan untuk kebutuhan saya.",
  email: "halo@bradflow.id",
};

export const STORE = {
  name: "Bradwear Tasikmalaya",
  address:
    "Karisma Residence, Blok C.46, RT.008/RW.003, Margajaya, Kec. Mangunreja, Kabupaten Tasikmalaya, Jawa Barat 46462",
  city: "Tasikmalaya",
  province: "Jawa Barat",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Karisma%20Residence%2C%20Blok%20C.46%2C%20RT.008%2FRW.003%2C%20Margajaya%2C%20Kec.%20Mangunreja%2C%20Kabupaten%20Tasikmalaya%2C%20Jawa%20Barat%2046462",
};

export function getWhatsAppHref(message = CONTACT.whatsappMessage) {
  return `https://wa.me/${CONTACT.phoneDigits}?text=${encodeURIComponent(message)}`;
}

type OrderWhatsAppLineItem = {
  modelName?: string;
  size?: string;
  qty?: number;
  gender?: string;
  sleeve?: string;
  colorCode?: string;
  note?: string;
};

type OrderWhatsAppSummaryInput = {
  orderCode?: string | null;
  productName?: string | null;
  category?: string | null;
  model?: string | null;
  material?: string | null;
  warna?: string | null;
  qty?: number | null;
  sizeDetails?: Array<{ size?: string; qty?: number; gender?: string; sleeve?: string }> | null;
  orderItems?: OrderWhatsAppLineItem[] | null;
  scanColorName?: string | null;
  scanColorCode?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  address?: string | null;
  notes?: string | null;
};

function cleanValue(value?: string | number | null) {
  if (value === null || value === undefined) return "-";
  const next = String(value).trim();
  return next.length > 0 ? next : "-";
}

function summarizeSizeDetails(
  sizeDetails?: Array<{ size?: string; qty?: number; gender?: string; sleeve?: string }> | null
) {
  if (!sizeDetails || sizeDetails.length === 0) return "-";

  const lines = sizeDetails
    .filter((item) => Number(item.qty || 0) > 0)
    .map((item) => {
      const descriptors = [item.gender, item.sleeve].filter(Boolean).join(", ");
      return descriptors
        ? `${cleanValue(item.size)} x${Number(item.qty || 0)} (${descriptors})`
        : `${cleanValue(item.size)} x${Number(item.qty || 0)}`;
    });

  return lines.length > 0 ? lines.join("; ") : "-";
}

function summarizeOrderItems(orderItems?: OrderWhatsAppLineItem[] | null) {
  if (!orderItems || orderItems.length === 0) return [];

  return orderItems.map((item, index) => {
    const parts = [
      cleanValue(item.modelName),
      cleanValue(item.size),
      `${Number(item.qty || 0)} pcs`,
      cleanValue(item.gender),
      cleanValue(item.sleeve),
      `kode ${cleanValue(item.colorCode)}`,
    ];
    const note = item.note?.trim() ? ` | catatan: ${item.note.trim()}` : "";
    return `${index + 1}. ${parts.join(" | ")}${note}`;
  });
}

export function buildOrderWhatsAppMessage(input: OrderWhatsAppSummaryInput) {
  const lines = [
    "Halo tim Bradwear, saya sudah menyelesaikan desain dan checkout dari website Bradflow.",
    "",
    "Ringkasan pesanan:",
    `- Kode order: ${cleanValue(input.orderCode)}`,
    `- Produk: ${cleanValue(input.productName)}`,
    `- Kategori: ${cleanValue(input.category)}`,
    `- Model: ${cleanValue(input.model)}`,
    `- Material: ${cleanValue(input.material)}`,
    `- Warna: ${cleanValue(input.warna)}`,
    `- Total qty: ${cleanValue(input.qty)}`,
    `- Breakdown ukuran: ${summarizeSizeDetails(input.sizeDetails)}`,
  ];

  if (input.scanColorName || input.scanColorCode) {
    lines.push(
      `- Referensi scan warna: ${cleanValue(input.scanColorName)} / kode ${cleanValue(input.scanColorCode)}`
    );
  }

  const orderLines = summarizeOrderItems(input.orderItems);
  if (orderLines.length > 0) {
    lines.push("", "Detail item:");
    lines.push(...orderLines);
  }

  lines.push(
    "",
    "Data pemesan:",
    `- Nama: ${cleanValue(input.customerName)}`,
    `- WhatsApp: ${cleanValue(input.customerPhone)}`,
    `- Email: ${cleanValue(input.customerEmail)}`,
    `- Alamat: ${cleanValue(input.address)}`
  );

  if (input.notes?.trim()) {
    lines.push(`- Catatan: ${input.notes.trim()}`);
  }

  lines.push("", "Mohon bantu konfirmasi pesanan, estimasi harga final, dan perkiraan waktu pengerjaannya.");

  return lines.join("\n");
}

export type CategoryLanding = {
  slug: string;
  label: string;
  navLabel: string;
  href: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  keywords: string[];
  productSlugs: string[];
};

export const CATEGORY_PAGES: CategoryLanding[] = [
  {
    slug: "kemeja",
    label: "Kemeja",
    navLabel: "Kemeja",
    href: "/kategori/kemeja",
    description:
      "Pemesanan kemeja custom untuk seragam kantor, seragam dinas, dan seragam komunitas dengan banyak pilihan model, bahan, dan warna.",
    seoTitle: "Pemesanan Kemeja Custom untuk Seragam Kantor, Dinas, dan Komunitas",
    seoDescription:
      "Cari layanan pemesanan kemeja custom yang SEO friendly dan mudah konsultasi. Bradflow melayani seragam kantor, seragam dinas, dan seragam komunitas dengan desain fleksibel.",
    heroTitle: "Pemesanan Kemeja Custom untuk Seragam Kantor, Dinas, dan Komunitas",
    heroDescription:
      "Temukan model kemeja lapangan, PDH, hingga kemeja formal custom untuk kebutuhan branding perusahaan, instansi, dan komunitas.",
    heroImage: "/assets/katalog/Model Kemeja/Brad-V3/(brad v-3)hitam.png",
    keywords: [
      "pemesanan kemeja",
      "kemeja custom",
      "seragam kantor",
      "seragam dinas",
      "seragam komunitas",
    ],
    productSlugs: [
      "brad-v1-custom",
      "brad-v2-custom",
      "brad-v3-custom",
      "brad-v4-custom",
      "ventura-custom",
      "yoroi-custom",
      "strazard-custom",
      "executive-custom",
      "pdh-custom",
    ],
  },
  {
    slug: "jacket-hoodies",
    label: "Jacket & Hoodies",
    navLabel: "Jacket & Hoodies",
    href: "/kategori/jacket-hoodies",
    description:
      "Pemesanan jaket custom, vest lapangan, dan outerwear seragam untuk tim operasional, event, dan komunitas.",
    seoTitle: "Jaket Custom, Vest Lapangan, dan Outerwear Seragam untuk Kantor dan Komunitas",
    seoDescription:
      "Butuh jaket custom atau vest lapangan? Bradflow membantu pembuatan outerwear seragam untuk kantor, dinas, dan komunitas dengan proses desain yang mudah.",
    heroTitle: "Jaket Custom dan Vest Lapangan untuk Identitas Tim yang Lebih Kuat",
    heroDescription:
      "Pilih jaket custom, tactical vest, atau rompi kerja yang nyaman untuk mobilitas tinggi, briefing lapangan, dan kebutuhan operasional.",
    heroImage: "/assets/katalog/jaket/jaket-depan-hitam.jpeg",
    keywords: ["jaket custom", "vest lapangan", "seragam komunitas", "seragam dinas"],
    productSlugs: ["jaket-custom", "rompi-tactical-custom", "rompi-parasute-custom"],
  },
  {
    slug: "polo-tshirt",
    label: "Polo T-Shirt",
    navLabel: "Polo T-Shirt",
    href: "/kategori/polo-tshirt",
    description:
      "Polo custom untuk seragam kantor, gathering, merchandise komunitas, dan promosi brand yang lebih santai namun tetap rapi.",
    seoTitle: "Polo Custom untuk Seragam Kantor, Event, dan Komunitas",
    seoDescription:
      "Bradflow menyediakan polo custom untuk seragam kantor, event perusahaan, dan komunitas dengan warna yang fleksibel dan desain logo yang rapi.",
    heroTitle: "Polo Custom yang Ringkas, Rapi, dan Mudah Disesuaikan dengan Brand",
    heroDescription:
      "Gunakan polo custom untuk kebutuhan event, seragam frontliner, merchandise komunitas, dan seragam kerja semi-formal.",
    heroImage: "/assets/katalog/Polo shirt/Kaospolo-hitam.png",
    keywords: ["polo custom", "seragam kantor", "merchandise komunitas"],
    productSlugs: ["polo-custom"],
  },
  {
    slug: "pants",
    label: "Pants",
    navLabel: "Pants",
    href: "/kategori/pants",
    description:
      "Celana seragam custom untuk kebutuhan lapangan, kerja harian, operasional, dan set seragam kantor atau komunitas.",
    seoTitle: "Celana Seragam Custom untuk Kantor, Lapangan, dan Komunitas",
    seoDescription:
      "Temukan celana seragam custom yang cocok dipadukan dengan kemeja, polo, atau jaket custom untuk kebutuhan kantor, dinas, dan komunitas.",
    heroTitle: "Celana Seragam Custom untuk Setelan Kerja dan Lapangan",
    heroDescription:
      "Tambahkan celana seragam ke paket pemesanan kemeja atau jaket agar identitas tim lebih konsisten dan profesional.",
    heroImage: "/assets/katalog/Celana/Warrior/warior-depan-hitam.jpeg",
    keywords: ["celana seragam", "pemesanan kemeja", "seragam dinas"],
    productSlugs: ["warrior-custom", "armour-custom", "celana-bradwear-v3-custom"],
  },
];

export const MAIN_NAV = [
  { label: "Beranda", href: "/" },
  ...CATEGORY_PAGES.map((item) => ({ label: item.navLabel, href: item.href })),
  { label: "Cara Order", href: "/cara-order" },
  { label: "Artikel", href: "/artikel" },
  { label: "Brad AI", href: "/brad-ai" },
];

export const UTILITY_NAV = [
  { label: "Layanan Pelanggan", href: "/layanan-pelanggan" },
  { label: "Lacak Pesanan", href: "/lacak-pesanan" },
  { label: "Temukan Toko", href: "/temukan-toko" },
];

export const HOME_USE_CASES = [
  {
    title: "Pemesanan Kemeja untuk Seragam Kantor",
    description:
      "Solusi untuk tim sales, front office, admin, dan operasional yang membutuhkan seragam kantor dengan tampilan profesional.",
    ctaLabel: "Konsultasi Seragam Kantor",
    href: "/kategori/kemeja",
  },
  {
    title: "Pemesanan Kemeja untuk Seragam Dinas",
    description:
      "Cocok untuk instansi, proyek lapangan, dan kebutuhan seragam dinas dengan material yang kuat serta desain identitas yang jelas.",
    ctaLabel: "Minta Estimasi Seragam Dinas",
    href: "/layanan-pelanggan",
  },
  {
    title: "Pemesanan Kemeja untuk Seragam Komunitas",
    description:
      "Buat seragam komunitas, panitia event, dan klub organisasi dengan desain yang konsisten dan mudah disesuaikan.",
    ctaLabel: "Diskusikan Seragam Komunitas",
    href: "/brad-ai",
  },
];

export const FAQ_ITEMS = [
  {
    question: "Apakah Bradflow melayani pemesanan kemeja satuan dan partai kecil?",
    answer:
      "Ya. Kami tetap membuka konsultasi untuk kebutuhan satuan, sampel, maupun pemesanan seragam kantor, seragam dinas, dan seragam komunitas dalam jumlah yang lebih besar.",
  },
  {
    question: "Produk apa saja yang bisa dipesan melalui website Bradflow?",
    answer:
      "Anda bisa memesan kemeja custom, polo custom, jaket custom, tactical vest, rompi kerja, dan celana seragam yang disesuaikan dengan kebutuhan tim atau organisasi.",
  },
  {
    question: "Apakah saya bisa konsultasi desain sebelum order?",
    answer:
      "Bisa. Kami menyediakan konsultasi lewat WhatsApp dan Brad AI untuk membantu memilih model, bahan, warna, dan estimasi awal sebelum produksi dimulai.",
  },
  {
    question: "Bagaimana cara order seragam kantor melalui website ini?",
    answer:
      "Pilih kategori produk, masuk ke halaman desain jika perlu, simpan kebutuhan Anda, lalu lanjutkan ke checkout atau konsultasi WhatsApp untuk finalisasi detail pesanan.",
  },
  {
    question: "Apakah estimasi harga di Brad AI bersifat final?",
    answer:
      "Tidak. Brad AI hanya memberikan estimasi indikatif berdasarkan harga dasar produk dan asumsi umum. Harga final tetap mengikuti detail desain, jumlah, bahan, dan deadline produksi.",
  },
  {
    question: "Bisakah saya melacak pengiriman pesanan JNE atau J&T dari website ini?",
    answer:
      "Bisa. Halaman lacak pesanan menyediakan pilihan kurir Indonesia seperti JNE dan J&T, lalu Anda akan diarahkan ke halaman tracking resminya untuk cek resi.",
  },
];

export const TRACKING_CARRIERS = [
  {
    slug: "jne",
    name: "JNE",
    description: "Lacak kiriman JNE reguler, YES, atau trucking langsung ke halaman resmi.",
    trackingUrl: "https://www.jne.co.id/id/tracking/trace",
  },
  {
    slug: "jnt",
    name: "J&T Express",
    description: "Cek resi J&T Express Indonesia melalui portal resmi pelacakan.",
    trackingUrl: "https://www.jet.co.id/track",
  },
  {
    slug: "sicepat",
    name: "SiCepat",
    description: "Arahkan ke halaman cek resi resmi SiCepat untuk pengiriman retail dan bisnis.",
    trackingUrl: "https://www.sicepat.com/checkAwb",
  },
  {
    slug: "anteraja",
    name: "AnterAja",
    description: "Gunakan halaman tracking AnterAja untuk memantau status pengiriman order Anda.",
    trackingUrl: "https://anteraja.id/tracking",
  },
  {
    slug: "pos",
    name: "Pos Indonesia",
    description: "Pantau pengiriman Pos Indonesia melalui halaman lacak resmi.",
    trackingUrl: "https://www.posindonesia.co.id/id/tracking",
  },
  {
    slug: "ninja",
    name: "Ninja Xpress",
    description: "Buka portal Ninja Xpress untuk tracking resi paket seragam custom Anda.",
    trackingUrl: "https://www.ninjaxpress.co/id-id/tracking",
  },
];

export const BRAD_AI_QUICK_PROMPTS = [
  "Saya butuh seragam kantor dengan desain formal dan rapi.",
  "Berapa estimasi harga pembuatan seragam dinas custom?",
  "Tolong rekomendasikan bahan untuk seragam komunitas outdoor.",
  "Bagaimana cara order kemeja custom dari website Bradflow?",
  "Berapa estimasi waktu pengerjaan untuk pesanan seragam tim?",
  "Saya ingin konsultasi logo dan bordir untuk polo custom.",
];
