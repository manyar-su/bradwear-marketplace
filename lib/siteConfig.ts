import {
  Article,
  BradAiContextSection,
  ContactChannel,
  CourierProvider,
  HowToOrderStep,
  NavItem,
  RouteKey,
  SeoMeta,
  SiteFaqItem,
} from '../types';

export const SITE_URL = 'https://bradwear.store';
export const SITE_NAME = 'Bradwear Indonesia';
export const SITE_TAGLINE = 'Konveksi seragam custom untuk instansi, perusahaan, dan komunitas di seluruh Indonesia.';
export const WHATSAPP_NUMBER = '6287736834454';
export const STORE_ADDRESS = 'Karisma Residence, Blok C.46, RT.008/RW.003, Margajaya, Kec. Mangunreja, Kabupaten Tasikmalaya, Jawa Barat 46462';
export const STORE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`;

export const ROUTE_PATHS: Record<RouteKey, string> = {
  [RouteKey.HOME]: '/',
  [RouteKey.KATALOG]: '/katalog',
  [RouteKey.CLIENT]: '/client',
  [RouteKey.PANTS]: '/pants',
  [RouteKey.ARTIKEL]: '/artikel',
  [RouteKey.CARA_ORDER]: '/cara-order',
  [RouteKey.LAYANAN_PELANGGAN]: '/layanan-pelanggan',
  [RouteKey.LACAK_PESANAN]: '/lacak-pesanan',
  [RouteKey.TEMUKAN_TOKO]: '/temukan-toko',
  [RouteKey.BRAD_AI]: '/brad-ai',
  [RouteKey.EDITOR]: '/editor',
  [RouteKey.SUMMARY]: '/summary',
};

export const PUBLIC_ROUTES = new Set<RouteKey>([
  RouteKey.HOME,
  RouteKey.KATALOG,
  RouteKey.CLIENT,
  RouteKey.PANTS,
  RouteKey.ARTIKEL,
  RouteKey.CARA_ORDER,
  RouteKey.LAYANAN_PELANGGAN,
  RouteKey.LACAK_PESANAN,
  RouteKey.TEMUKAN_TOKO,
  RouteKey.BRAD_AI,
]);

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: 'Home', route: RouteKey.HOME, description: 'Landing page utama Bradwear Indonesia.' },
  { label: 'Katalog', route: RouteKey.KATALOG, description: 'Koleksi seragam kustom untuk berbagai kebutuhan instansi.' },
  { label: 'Client', route: RouteKey.CLIENT, description: 'Galeri hasil jadi dan dokumentasi client Bradwear Indonesia.' },
  { label: 'Artikel', route: RouteKey.ARTIKEL, description: 'Konten panduan bahan, proses order, dan insight seragam.' },
  { label: 'Cara Order', route: RouteKey.CARA_ORDER, description: 'Panduan visual memesan seragam custom di Bradwear.' },
  { label: 'Layanan Pelanggan', route: RouteKey.LAYANAN_PELANGGAN, description: 'Bantuan konsultasi, revisi, dan follow up order.' },
  { label: 'Lacak Pesanan', route: RouteKey.LACAK_PESANAN, description: 'Pantau status produksi dan pengiriman order Anda.' },
  { label: 'Temukan Toko', route: RouteKey.TEMUKAN_TOKO, description: 'Alamat workshop dan titik konsultasi Bradwear Tasikmalaya.' },
  { label: 'Brodi', route: RouteKey.BRAD_AI, description: 'Asisten AI untuk menjawab pertanyaan seputar layanan Bradwear.' },
];

export const UTILITY_NAV_ITEMS: NavItem[] = [
  { label: 'Layanan Pelanggan', route: RouteKey.LAYANAN_PELANGGAN },
  { label: 'Lacak Pesanan', route: RouteKey.LACAK_PESANAN },
  { label: 'Temukan Toko', route: RouteKey.TEMUKAN_TOKO },
  { label: 'Brodi', route: RouteKey.BRAD_AI },
];

export const ROUTE_LABELS: Record<RouteKey, string> = {
  [RouteKey.HOME]: 'Home / Beranda',
  [RouteKey.KATALOG]: 'Home / Katalog',
  [RouteKey.CLIENT]: 'Home / Client Gallery',
  [RouteKey.PANTS]: 'Home / Pants',
  [RouteKey.ARTIKEL]: 'Home / Artikel',
  [RouteKey.CARA_ORDER]: 'Home / Cara Order',
  [RouteKey.LAYANAN_PELANGGAN]: 'Home / Layanan Pelanggan',
  [RouteKey.LACAK_PESANAN]: 'Home / Lacak Pesanan',
  [RouteKey.TEMUKAN_TOKO]: 'Home / Temukan Toko',
  [RouteKey.BRAD_AI]: 'Home / Brodi',
  [RouteKey.EDITOR]: 'Home / Editor Desain',
  [RouteKey.SUMMARY]: 'Home / Ringkasan Pesanan',
};

export const CONTACT_CHANNELS: ContactChannel[] = [
  { label: 'WhatsApp Konsultasi', value: '+62 877-3683-4454', note: 'Respon untuk konsultasi model, bahan, dan estimasi order.' },
  { label: 'Area Layanan', value: 'Seluruh Indonesia', note: 'Melayani pengiriman seragam custom ke instansi, perusahaan, dan komunitas.' },
  { label: 'Workshop', value: 'Tasikmalaya, Jawa Barat', note: 'Titik konsultasi dan pengembangan sample berada di Karisma Residence.' },
];

export const CUSTOMER_SERVICE_HOURS = [
  'Senin - Jumat: 08.00 - 17.00 WIB',
  'Sabtu: 08.00 - 14.00 WIB',
  'Minggu / hari libur: follow up via WhatsApp',
];

export const SITE_FAQS: SiteFaqItem[] = [
  {
    slug: 'minimal-order',
    title: 'Minimal order bisa satuan untuk sample.',
    answer: 'Bradwear bisa membantu pembuatan satuan khusus untuk sample, contoh ukuran, atau approval model sebelum produksi lebih banyak. Untuk produksi utama, jumlah ideal tetap disesuaikan dengan model, bahan, tingkat detail, dan kebutuhan instansi agar harga, timeline, serta kontrol kualitas lebih rapi sejak awal.',
  },
  {
    slug: 'logo-custom',
    title: 'Logo instansi dan nama personel bisa dikustom.',
    answer: 'Tim Bradwear membantu penempatan bordir, sablon, dan layout agar tetap rapi saat produksi.',
  },
  {
    slug: 'lead-time',
    title: 'Estimasi produksi normal 14-21 hari kerja.',
    answer: 'Timeline dapat lebih cepat atau lebih panjang tergantung volume, revisi desain, dan antrean produksi.',
  },
  {
    slug: 'tracking',
    title: 'Status produksi dan ekspedisi bisa dilacak.',
    answer: 'Pelanggan dapat memantau order code internal Bradwear dan melanjutkan tracking ke situs resmi kurir.',
  },
];

export const ARTICLES: Article[] = [
  {
    slug: 'panduan-memilih-bahan-seragam',
    category: 'Bahan',
    readTime: '5 menit',
    title: 'Panduan memilih bahan seragam agar nyaman dipakai dan tetap rapi',
    excerpt: 'Perbedaan material seperti Tropical, Nagata Drill, Ripstop, dan Oxford perlu disesuaikan dengan ritme kerja, lokasi lapangan, dan tampilan yang diinginkan.',
    body: [
      'Seragam yang baik tidak hanya terlihat formal, tetapi juga mendukung mobilitas pemakainya. Untuk kebutuhan kantor dengan pemakaian harian, bahan yang ringan dan tidak panas seperti Tropical atau Oxford sering menjadi pilihan aman.',
      'Jika kebutuhan lebih berat, misalnya untuk lapangan atau operasional yang aktif, bahan seperti Ripstop dan Nagata Drill memberi struktur yang lebih kokoh serta ketahanan lebih baik terhadap gesekan.',
      'Bradwear membantu pelanggan mencocokkan bahan, warna, dan model sebelum masuk tahap produksi agar hasil akhir tetap nyaman sekaligus profesional.',
    ],
  },
  {
    slug: 'beda-pdh-pdl-dan-lapangan',
    category: 'Model',
    readTime: '4 menit',
    title: 'Memahami beda PDH, PDL, dan seragam lapangan sebelum order produksi',
    excerpt: 'Jenis seragam yang terlihat mirip sering punya kebutuhan pola, bahan, dan detail finishing yang berbeda.',
    body: [
      'PDH biasanya dipakai untuk kebutuhan dinas harian sehingga tampilannya lebih rapi dan formal. PDL dan model lapangan umumnya membutuhkan potongan yang lebih fungsional dengan kantong, penguat jahitan, atau bahan yang lebih tangguh.',
      'Kesalahan memilih tipe model di awal akan memengaruhi bahan, biaya, dan waktu approval desain. Karena itu, Bradwear menyiapkan katalog terstruktur agar pelanggan bisa membedakan fungsi tiap seri dengan lebih cepat.',
      'Saat konsultasi, jelaskan konteks penggunaan seragam: di kantor, perjalanan dinas, kegiatan teknis, atau operasional lapangan. Informasi ini akan mempermudah penentuan model terbaik.',
    ],
  },
  {
    slug: 'tips-order-seragam-instansi',
    category: 'Pemesanan',
    readTime: '6 menit',
    title: 'Tips order seragam instansi agar proses revisi dan produksi lebih cepat',
    excerpt: 'Kejelasan data ukuran, identitas instansi, jumlah item, dan target waktu akan sangat mempercepat approval.',
    body: [
      'Sebelum order, siapkan daftar ukuran, pembagian gender, kebutuhan lengan, dan target tanggal pemakaian. Langkah sederhana ini membantu tim CS dan produksi menyusun estimasi dengan lebih akurat.',
      'Untuk seragam yang membutuhkan bordir logo, file referensi berkualitas baik akan mempersingkat proses penyesuaian. Jika ada panduan warna resmi instansi, lampirkan sejak awal.',
      'Bradwear juga menyarankan pelanggan menentukan PIC internal agar revisi tidak berjalan dari banyak jalur komunikasi sekaligus. Dengan begitu, desain dapat disetujui lebih cepat dan produksi lebih stabil.',
    ],
  },
  {
    slug: 'checklist-sebelum-produksi',
    category: 'Checklist',
    readTime: '4 menit',
    title: 'Checklist sebelum produksi seragam custom dimulai',
    excerpt: 'Approval akhir sebaiknya mencakup model, ukuran, material, warna, logo, nama, dan alamat pengiriman.',
    body: [
      'Pastikan kode model, warna kain, serta jenis bahan yang dipilih sudah final. Perubahan setelah proses cutting biasanya memengaruhi waktu produksi.',
      'Cek ulang penulisan nama personel, jabatan, atau divisi yang akan dibordir. Kesalahan data kecil justru sering menyebabkan penundaan produksi di tahap akhir.',
      'Konfirmasi alamat kirim, PIC penerima, dan kurir yang diinginkan jika ada preferensi tertentu. Bradwear lalu dapat menyiapkan update tracking yang lebih rapi sampai barang diterima.',
    ],
  },
];

export const HOW_TO_ORDER_STEPS: HowToOrderStep[] = [
  {
    id: 'discover',
    title: 'Pilih model dari katalog',
    description: 'Mulai dari kategori kemeja, rompi, jaket, polo, atau pants lalu pilih model yang paling dekat dengan kebutuhan instansi Anda.',
    detail: 'Halaman katalog dirancang agar user cepat membandingkan model, fungsi, dan tampilan tanpa harus berpindah terlalu jauh.',
  },
  {
    id: 'customize',
    title: 'Atur desain dan spesifikasi',
    description: 'Masuk ke editor untuk menentukan bahan, warna, identitas personel, posisi logo, dan referensi visual yang dibutuhkan.',
    detail: 'Tahap ini membantu pelanggan menyamakan ekspektasi sejak awal sebelum produksi dimulai.',
  },
  {
    id: 'summary',
    title: 'Lengkapi ukuran dan ringkasan order',
    description: 'Masukkan kombinasi ukuran, gender, jumlah item, dan catatan khusus agar admin bisa menindaklanjuti lebih cepat.',
    detail: 'Jika ada kebutuhan ukuran khusus, detail ukuran dapat diisikan langsung pada tahap ringkasan.',
  },
  {
    id: 'consult',
    title: 'Kirim ke layanan pelanggan',
    description: 'Detail order dikirim ke WhatsApp konsultasi agar tim Bradwear dapat memvalidasi biaya, timeline, dan kebutuhan revisi.',
    detail: 'Alur ini dibuat supaya pelanggan tetap punya jalur komunikasi manusia setelah konfigurasi produk selesai.',
  },
  {
    id: 'track',
    title: 'Pantau produksi sampai pengiriman',
    description: 'Gunakan order code internal untuk melihat tahap kerja, lalu lanjutkan cek resi di kurir resmi saat barang dikirim.',
    detail: 'Transparansi ini membantu pelanggan mengetahui posisi pesanan tanpa menunggu update manual setiap saat.',
  },
];

export const COURIER_PROVIDERS: CourierProvider[] = [
  {
    id: 'jne',
    name: 'JNE',
    helperText: 'Tracking resmi JNE untuk satu nomor resi.',
    trackingUrl: 'https://www.jne.co.id/tracking-package',
    prefillMode: 'none',
  },
  {
    id: 'jnt',
    name: 'J&T Express',
    helperText: 'Tracking resmi J&T Express Indonesia.',
    trackingUrl: 'https://www.jet.co.id/track',
    prefillMode: 'none',
  },
  {
    id: 'sicepat',
    name: 'SiCepat',
    helperText: 'Halaman cek resi resmi SiCepat.',
    trackingUrl: 'https://www.sicepat.com/checkAwb?previousPage=other+articles',
    prefillMode: 'none',
  },
  {
    id: 'tiki',
    name: 'TIKI',
    helperText: 'Cek resi resmi TIKI.',
    trackingUrl: 'https://www.tiki.id/id/track',
    prefillMode: 'none',
  },
  {
    id: 'pos',
    name: 'Pos Indonesia',
    helperText: 'Lacak kiriman Pos Indonesia.',
    trackingUrl: 'https://www.posindonesia.co.id/id/tracking',
    prefillMode: 'none',
  },
  {
    id: 'anteraja',
    name: 'AnterAja',
    helperText: 'Tracking resmi AnterAja.',
    trackingUrl: 'https://anteraja.id/tracking',
    prefillMode: 'none',
  },
  {
    id: 'ninja',
    name: 'Ninja Xpress',
    helperText: 'Tracking resmi Ninja Xpress Indonesia.',
    trackingUrl: 'https://www.ninjaxpress.co/id-id/tracking',
    prefillMode: 'none',
  },
  {
    id: 'idexpress',
    name: 'ID Express',
    helperText: 'Lacak paket resmi iDexpress.',
    trackingUrl: 'https://idexpress.com/lacak-paket',
    prefillMode: 'none',
  },
];

export const BRAD_AI_CONTEXT: BradAiContextSection[] = [
  {
    heading: 'Profil usaha',
    body: 'Bradwear Indonesia adalah layanan konveksi dan custom seragam yang berbasis di Tasikmalaya, Jawa Barat, melayani instansi, perusahaan, komunitas, dan kebutuhan operasional di seluruh Indonesia.',
  },
  {
    heading: 'Produk utama',
    body: 'Produk utama meliputi kemeja dinas, jaket, rompi, polo shirt, dan celana tactical atau pants custom. Pengguna dapat memilih model dari katalog lalu masuk ke editor desain.',
  },
  {
    heading: 'Proses order',
    body: 'Alur order dimulai dari memilih model, mengatur bahan dan warna, melengkapi ukuran dan jumlah, lalu mengirim detail ke layanan pelanggan melalui WhatsApp untuk validasi harga, timeline, dan revisi.',
  },
  {
    heading: 'Pengiriman dan pelacakan',
    body: 'Bradwear menyediakan pelacakan tahap produksi internal dan mengarahkan pelanggan ke situs resmi kurir seperti JNE, J&T Express, SiCepat, TIKI, Pos Indonesia, AnterAja, Ninja Xpress, dan ID Express setelah nomor resi tersedia.',
  },
  {
    heading: 'Batasan jawaban',
    body: 'Brodi hanya menjawab pertanyaan yang relevan dengan layanan, produk, bahan, cara order, pengiriman, FAQ, lokasi toko, dan penggunaan website. Jika informasi spesifik tidak tersedia, Brodi harus jujur, tidak mengarang, dan mengarahkan pengguna untuk konsultasi ke WhatsApp.',
  },
];

export const BASE_KEYWORDS = [
  'bradwear indonesia',
  'bradwear store',
  'konveksi tasikmalaya',
  'seragam custom instansi',
  'kemeja dinas custom',
  'celana tactical custom',
  'rompi lapangan custom',
  'jaket instansi',
  'polo shirt custom',
  'garment jawa barat',
  'pengiriman seragam seluruh indonesia',
  'vendor seragam perusahaan',
  'konveksi seragam lapangan',
  'uniform supplier indonesia',
  'workwear custom tasikmalaya',
  'pdh pdl custom',
  'bordir logo instansi',
  'seragam operasional custom',
  'seragam komunitas custom',
  'vendor seragam tasikmalaya',
  'seragam kerja custom indonesia',
  'konveksi seragam perusahaan',
  'pabrik seragam custom jawa barat',
  'workshop seragam tasikmalaya',
  'seragam kantor custom',
  'seragam lapangan custom',
  'seragam dinas instansi',
  'pengadaan seragam perusahaan',
  'custom uniform manufacturer indonesia',
  'brodi bradwear',
  'bradwear ai assistant',
];

const makeMeta = (route: RouteKey, title: string, description: string, extraKeywords: string[] = []): SeoMeta => ({
  title,
  description,
  path: ROUTE_PATHS[route],
  keywords: [...BASE_KEYWORDS, ...extraKeywords],
  schema: [],
});

export const SEO_META: Record<RouteKey, SeoMeta> = {
  [RouteKey.HOME]: makeMeta(
    RouteKey.HOME,
    'Bradwear Indonesia | Konveksi Seragam Custom Tasikmalaya',
    'Bradwear Indonesia melayani pembuatan seragam custom untuk instansi, perusahaan, dan komunitas. Berbasis di Tasikmalaya dengan pengiriman ke seluruh Indonesia.',
    ['seragam instansi', 'konveksi seragam tasikmalaya', 'custom seragam perusahaan', 'vendor seragam indonesia', 'seragam kerja kantor']
  ),
  [RouteKey.KATALOG]: makeMeta(
    RouteKey.KATALOG,
    'Katalog Seragam Custom Bradwear Indonesia',
    'Lihat katalog kemeja, jaket, rompi, polo, dan model seragam custom Bradwear Indonesia untuk kebutuhan dinas, lapangan, dan perusahaan.',
    ['katalog seragam custom', 'kemeja dinas', 'jaket bomber custom', 'rompi lapangan', 'polo custom', 'pants tactical']
  ),
  [RouteKey.CLIENT]: makeMeta(
    RouteKey.CLIENT,
    'Client Gallery Bradwear Indonesia',
    'Lihat dokumentasi hasil produksi dan galeri client Bradwear Indonesia untuk kebutuhan instansi, medis, kejaksaan, dan pemerintah daerah.',
    ['client gallery', 'galeri client bradwear', 'hasil jadi seragam', 'portfolio seragam custom', 'dokumentasi client']
  ),
  [RouteKey.PANTS]: makeMeta(
    RouteKey.PANTS,
    'Pants dan Celana Tactical Custom | Bradwear Indonesia',
    'Halaman khusus pants Bradwear Indonesia berisi pilihan celana tactical, celana kerja, dan celana lapangan custom untuk kebutuhan tim operasional.',
    ['pants custom', 'celana tactical', 'celana kerja custom', 'celana lapangan pria', 'celana operasional instansi']
  ),
  [RouteKey.ARTIKEL]: makeMeta(
    RouteKey.ARTIKEL,
    'Artikel Bradwear | Panduan Bahan, Model, dan Order Seragam',
    'Baca artikel Bradwear seputar pemilihan bahan, model seragam, checklist produksi, dan tips order seragam instansi agar proses lebih efisien.',
    ['artikel seragam', 'tips order seragam', 'panduan bahan seragam', 'edukasi seragam kerja', 'faq konveksi seragam']
  ),
  [RouteKey.CARA_ORDER]: makeMeta(
    RouteKey.CARA_ORDER,
    'Cara Order Seragam Custom Bradwear Indonesia',
    'Pelajari cara order seragam custom di Bradwear mulai dari pilih katalog, atur desain, isi ukuran, hingga konsultasi dengan layanan pelanggan.',
    ['cara order seragam', 'tutorial order custom', 'alur pemesanan seragam', 'cara pesan seragam instansi', 'workflow order seragam']
  ),
  [RouteKey.LAYANAN_PELANGGAN]: makeMeta(
    RouteKey.LAYANAN_PELANGGAN,
    'Layanan Pelanggan Bradwear Indonesia',
    'Hubungi layanan pelanggan Bradwear Indonesia untuk konsultasi model, bahan, revisi desain, estimasi produksi, dan follow up pengiriman.',
    ['customer service bradwear', 'whatsapp konveksi', 'konsultasi seragam', 'follow up order seragam', 'admin seragam custom']
  ),
  [RouteKey.LACAK_PESANAN]: makeMeta(
    RouteKey.LACAK_PESANAN,
    'Lacak Pesanan Bradwear dan Resi Ekspedisi Indonesia',
    'Pantau status order Bradwear dan lanjutkan cek resi resmi JNE, J&T Express, SiCepat, TIKI, Pos Indonesia, AnterAja, Ninja Xpress, dan ID Express.',
    ['lacak pesanan', 'cek resi jne', 'cek resi j&t', 'tracking kurir indonesia', 'status produksi seragam', 'tracking order bradwear']
  ),
  [RouteKey.TEMUKAN_TOKO]: makeMeta(
    RouteKey.TEMUKAN_TOKO,
    'Temukan Toko Bradwear Indonesia di Tasikmalaya',
    'Kunjungi lokasi Bradwear Indonesia di Karisma Residence, Mangunreja, Kabupaten Tasikmalaya, Jawa Barat untuk konsultasi dan pengembangan sample.',
    ['alamat bradwear', 'konveksi tasikmalaya', 'workshop seragam jawa barat', 'lokasi workshop seragam', 'toko seragam tasikmalaya']
  ),
  [RouteKey.BRAD_AI]: makeMeta(
    RouteKey.BRAD_AI,
    'Brodi | Asisten AI Bradwear Indonesia',
    'Tanya Brodi tentang bahan, model, cara order, pengiriman, FAQ, dan layanan Bradwear Indonesia dengan jawaban natural dan informatif.',
    ['ai seragam', 'chatbot bradwear', 'asisten ai custom seragam', 'brodi', 'bradwear assistant']
  ),
  [RouteKey.EDITOR]: makeMeta(
    RouteKey.EDITOR,
    'Editor Desain Seragam | Bradwear Indonesia',
    'Atur warna, bahan, posisi atribut, dan detail desain seragam custom langsung dari editor Bradwear Indonesia.',
    ['editor desain seragam', 'custom uniform editor', 'simulasi seragam custom', 'desain kemeja custom']
  ),
  [RouteKey.SUMMARY]: makeMeta(
    RouteKey.SUMMARY,
    'Ringkasan Pesanan Seragam | Bradwear Indonesia',
    'Periksa ukuran, jumlah item, dan ringkasan akhir sebelum mengirim order seragam custom ke layanan pelanggan Bradwear.',
    ['ringkasan order seragam', 'checkout seragam custom', 'form pesanan seragam', 'order summary uniform']
  ),
};

export const buildWhatsAppUrl = (message: string) =>
  `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;

export const buildConsultationMessage = (subject?: string) => {
  const topic = subject?.trim() ? subject.trim() : 'kebutuhan seragam custom';
  return `Halo tim Bradwear Indonesia, saya konsumen dari website Bradwear dan ingin berkonsultasi mengenai ${topic}. Mohon bantuannya untuk informasi model, bahan, estimasi produksi, dan langkah order berikutnya. Terima kasih.`;
};

export const getTrackingProviderById = (id: string) =>
  COURIER_PROVIDERS.find((provider) => provider.id === id) ?? COURIER_PROVIDERS[0];

export const buildTrackingUrl = (provider: CourierProvider, receiptNumber: string) => {
  const cleanReceipt = receiptNumber.trim();
  if (!cleanReceipt || provider.prefillMode === 'none' || !provider.queryParam) {
    return provider.trackingUrl;
  }

  const separator = provider.trackingUrl.includes('?') ? '&' : '?';
  return `${provider.trackingUrl}${separator}${provider.queryParam}=${encodeURIComponent(cleanReceipt)}`;
};

export const normalizePathname = (pathname: string) => {
  if (!pathname) return '/';
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
};

export const pathToRoute = (pathname: string): RouteKey => {
  const normalized = normalizePathname(pathname.toLowerCase());
  const match = Object.entries(ROUTE_PATHS).find(([, routePath]) => routePath.toLowerCase() === normalized);
  return (match?.[0] as RouteKey) ?? RouteKey.HOME;
};

export const isPublicRoute = (route: RouteKey) => PUBLIC_ROUTES.has(route);
