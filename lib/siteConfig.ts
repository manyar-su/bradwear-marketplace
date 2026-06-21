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
export const SITE_TAGLINE = 'Konveksi kemeja custom, kemeja dinas, dan seragam kerja untuk instansi, perusahaan, dan komunitas di seluruh Indonesia.';
export const WHATSAPP_NUMBER = '6287736834454';
export const STORE_ADDRESS = 'Karisma Residence, Blok C.46, RT.008/RW.003, Margajaya, Kec. Mangunreja, Kabupaten Tasikmalaya, Jawa Barat 46462';
export const STORE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`;

export const ROUTE_PATHS: Record<RouteKey, string> = {
  [RouteKey.HOME]: '/',
  [RouteKey.THREE_D]: '/3d',
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
  RouteKey.THREE_D,
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
  { label: 'Beranda', route: RouteKey.HOME, description: 'Halaman utama Bradwear Indonesia.' },
  { label: 'Studio 3D', route: RouteKey.THREE_D, description: 'Halaman khusus preview dan custom seragam 3D Bradwear.' },
  { label: 'Katalog', route: RouteKey.KATALOG, description: 'Koleksi seragam kustom untuk berbagai kebutuhan instansi.' },
  { label: 'Galeri Klien', route: RouteKey.CLIENT, description: 'Galeri hasil jadi dan dokumentasi klien Bradwear Indonesia.' },
  { label: 'Artikel', route: RouteKey.ARTIKEL, description: 'Konten panduan bahan, proses order, dan insight seragam.' },
  { label: 'Cara Order', route: RouteKey.CARA_ORDER, description: 'Panduan visual memesan seragam custom di Bradwear.' },
  { label: 'Layanan Pelanggan', route: RouteKey.LAYANAN_PELANGGAN, description: 'Bantuan konsultasi, revisi, dan tindak lanjut order.' },
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
  [RouteKey.HOME]: 'Beranda',
  [RouteKey.THREE_D]: 'Beranda / Studio 3D',
  [RouteKey.KATALOG]: 'Beranda / Katalog',
  [RouteKey.CLIENT]: 'Beranda / Galeri Klien',
  [RouteKey.PANTS]: 'Beranda / Celana',
  [RouteKey.ARTIKEL]: 'Beranda / Artikel',
  [RouteKey.CARA_ORDER]: 'Beranda / Cara Order',
  [RouteKey.LAYANAN_PELANGGAN]: 'Beranda / Layanan Pelanggan',
  [RouteKey.LACAK_PESANAN]: 'Beranda / Lacak Pesanan',
  [RouteKey.TEMUKAN_TOKO]: 'Beranda / Temukan Toko',
  [RouteKey.BRAD_AI]: 'Beranda / Brodi',
  [RouteKey.EDITOR]: 'Beranda / Editor Desain',
  [RouteKey.SUMMARY]: 'Beranda / Ringkasan Pesanan',
};

export const CONTACT_CHANNELS: ContactChannel[] = [
  { label: 'WhatsApp Konsultasi', value: '+62 877-3683-4454', note: 'Respon untuk konsultasi model, bahan, dan estimasi order.' },
  { label: 'Area Layanan', value: 'Seluruh Indonesia', note: 'Melayani pengiriman seragam custom ke instansi, perusahaan, dan komunitas.' },
  { label: 'Workshop', value: 'Tasikmalaya, Jawa Barat', note: 'Titik konsultasi dan pengembangan sampel berada di Karisma Residence.' },
];

export const CUSTOMER_SERVICE_HOURS = [
  'Senin - Jumat: 08.00 - 17.00 WIB',
  'Sabtu: 08.00 - 14.00 WIB',
  'Minggu / hari libur: tindak lanjut via WhatsApp',
];

export const SITE_FAQS: SiteFaqItem[] = [
  {
    slug: 'minimal-order',
    title: 'Minimal order bisa satuan untuk sampel.',
    answer: 'Bradwear dapat membantu pembuatan satuan untuk sampel, contoh ukuran, atau persetujuan model sebelum masuk ke produksi utama. Untuk produksi reguler, jumlah ideal tetap disesuaikan dengan model, bahan, tingkat detail, dan kebutuhan instansi agar harga, timeline, serta kontrol kualitas lebih rapi sejak awal.',
  },
  {
    slug: 'logo-custom',
    title: 'Logo instansi dan nama personel bisa dikustom.',
    answer: 'Tim Bradwear membantu penempatan bordir, sablon, dan layout nama personel agar identitas instansi tetap rapi saat diproduksi dan saat dipakai.',
  },
  {
    slug: 'lead-time',
    title: 'Estimasi produksi normal 14-21 hari kerja.',
    answer: 'Estimasi dapat lebih cepat atau lebih panjang tergantung jumlah order, revisi desain, ketersediaan bahan, dan antrean produksi saat pesanan masuk.',
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
      'Kesalahan memilih tipe model di awal akan memengaruhi bahan, biaya, dan waktu persetujuan desain. Karena itu, Bradwear menyiapkan katalog terstruktur agar pelanggan bisa membedakan fungsi tiap seri dengan lebih cepat.',
      'Saat konsultasi, jelaskan konteks penggunaan seragam: di kantor, perjalanan dinas, kegiatan teknis, atau operasional lapangan. Informasi ini akan mempermudah penentuan model terbaik.',
    ],
  },
  {
    slug: 'tips-order-seragam-instansi',
    category: 'Pemesanan',
    readTime: '6 menit',
    title: 'Tips order seragam instansi agar proses revisi dan produksi lebih cepat',
    excerpt: 'Kejelasan data ukuran, identitas instansi, jumlah item, dan target waktu akan sangat mempercepat persetujuan.',
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
  'kemeja custom',
  'kemeja dinas',
  'kemeja kerja custom',
  'kemeja lapangan',
  'kemeja tactical',
  'kemeja pdh',
  'kemeja pdl',
  'seragam kerja',
  'seragam kantor',
  'seragam perusahaan',
  'seragam dinas',
  'seragam operasional',
  'seragam lapangan',
  'baju dinas custom',
  'bikin kemeja custom',
  'vendor kemeja custom',
  'konveksi kemeja dinas',
  'konveksi seragam kerja',
  'konveksi seragam kantor',
  'konveksi seragam perusahaan',
  'bordir logo kemeja',
  'bordir nama seragam',
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
  'pengadaan kemeja dinas',
  'seragam security custom',
  'seragam event custom',
  'seragam komunitas',
  'kemeja bordir custom',
  'vendor seragam dinas',
  'vendor kemeja dinas',
  'workshirt custom indonesia',
  'custom uniform manufacturer indonesia',
  'brodi bradwear',
  'bradwear ai assistant',
];

const dedupeKeywords = (keywords: string[]) => Array.from(new Set(keywords.map((keyword) => keyword.trim()).filter(Boolean)));

const makeMeta = (route: RouteKey, title: string, description: string, extraKeywords: string[] = []): SeoMeta => ({
  title,
  description,
  path: ROUTE_PATHS[route],
  keywords: dedupeKeywords([...BASE_KEYWORDS, ...extraKeywords]),
  schema: [],
});

export const SEO_META: Record<RouteKey, SeoMeta> = {
  [RouteKey.HOME]: makeMeta(
    RouteKey.HOME,
    'Bradwear Indonesia | Kemeja Custom, Kemeja Dinas, dan Seragam Kerja Tasikmalaya',
    'Bradwear Indonesia melayani pembuatan kemeja custom, kemeja dinas, seragam kerja, PDH, PDL, rompi, jaket, dan bordir logo untuk instansi, perusahaan, serta komunitas. Berbasis di Tasikmalaya dengan pengiriman ke seluruh Indonesia.',
    ['seragam instansi', 'konveksi seragam tasikmalaya', 'custom seragam perusahaan', 'vendor seragam indonesia', 'seragam kerja kantor', 'kemeja custom tasikmalaya', 'kemeja dinas custom', 'seragam kerja custom', 'vendor pdh pdl']
  ),
  [RouteKey.THREE_D]: makeMeta(
    RouteKey.THREE_D,
    'Studio 3D Seragam | Bradwear Indonesia',
    'Buka halaman khusus 3D Bradwear untuk melihat preview seragam secara terpisah dan fokus pada pengalaman visual custom.',
    ['studio 3d seragam', 'preview seragam 3d', 'custom seragam 3d', '3d uniform viewer']
  ),
  [RouteKey.KATALOG]: makeMeta(
    RouteKey.KATALOG,
    'Katalog Kemeja Custom dan Seragam Dinas | Bradwear Indonesia',
    'Lihat katalog kemeja custom, kemeja dinas, PDH, PDL, jaket, rompi, polo, dan celana kerja Bradwear Indonesia untuk kebutuhan kantor, lapangan, operasional, dan pengadaan instansi.',
    ['katalog seragam custom', 'kemeja dinas', 'jaket bomber custom', 'rompi lapangan', 'polo custom', 'pants tactical', 'katalog kemeja custom', 'katalog kemeja dinas', 'seragam kantor custom', 'seragam kerja lapangan']
  ),
  [RouteKey.CLIENT]: makeMeta(
    RouteKey.CLIENT,
    'Galeri Klien Kemeja Custom dan Seragam Dinas | Bradwear Indonesia',
    'Lihat dokumentasi hasil produksi kemeja custom, kemeja dinas, dan seragam kerja Bradwear Indonesia untuk kebutuhan instansi, medis, operasional, kejaksaan, dan pemerintah daerah.',
    ['client gallery', 'galeri klien bradwear', 'hasil jadi seragam', 'portofolio seragam custom', 'dokumentasi klien', 'hasil jadi kemeja dinas', 'galeri kemeja custom']
  ),
  [RouteKey.PANTS]: makeMeta(
    RouteKey.PANTS,
    'Celana Tactical dan Celana Kerja Custom | Bradwear Indonesia',
    'Halaman khusus celana Bradwear Indonesia berisi pilihan celana tactical, celana kerja, dan celana lapangan custom untuk kebutuhan tim operasional, seragam dinas, dan aktivitas lapangan.',
    ['pants custom', 'celana tactical', 'celana kerja custom', 'celana lapangan pria', 'celana operasional instansi', 'celana dinas custom', 'celana seragam kerja']
  ),
  [RouteKey.ARTIKEL]: makeMeta(
    RouteKey.ARTIKEL,
    'Artikel Bradwear | Panduan Bahan, Kemeja Dinas, dan Order Seragam',
    'Baca artikel Bradwear seputar pemilihan bahan, model kemeja dinas, checklist produksi, dan tips order seragam kerja agar proses approval dan produksi lebih efisien.',
    ['artikel seragam', 'tips order seragam', 'panduan bahan seragam', 'edukasi seragam kerja', 'faq konveksi seragam', 'panduan kemeja dinas', 'tips order kemeja custom']
  ),
  [RouteKey.CARA_ORDER]: makeMeta(
    RouteKey.CARA_ORDER,
    'Cara Order Kemeja Custom dan Seragam Dinas | Bradwear Indonesia',
    'Pelajari cara order kemeja custom dan seragam dinas di Bradwear mulai dari pilih katalog, atur desain, isi ukuran, sampai konsultasi dengan layanan pelanggan.',
    ['cara order seragam', 'tutorial order custom', 'alur pemesanan seragam', 'cara pesan seragam instansi', 'workflow order seragam', 'cara order kemeja custom', 'cara pesan kemeja dinas']
  ),
  [RouteKey.LAYANAN_PELANGGAN]: makeMeta(
    RouteKey.LAYANAN_PELANGGAN,
    'Layanan Pelanggan Kemeja Custom Bradwear Indonesia',
    'Hubungi layanan pelanggan Bradwear Indonesia untuk konsultasi kemeja custom, bahan, bordir logo, revisi desain, estimasi produksi, dan tindak lanjut pengiriman.',
    ['customer service bradwear', 'whatsapp konveksi', 'konsultasi seragam', 'tindak lanjut order seragam', 'admin seragam custom', 'whatsapp kemeja custom', 'cs kemeja dinas']
  ),
  [RouteKey.LACAK_PESANAN]: makeMeta(
    RouteKey.LACAK_PESANAN,
    'Lacak Pesanan Bradwear dan Resi Ekspedisi Indonesia',
    'Pantau status order kemeja custom dan lanjutkan cek resi resmi JNE, J&T Express, SiCepat, TIKI, Pos Indonesia, AnterAja, Ninja Xpress, dan ID Express.',
    ['lacak pesanan', 'cek resi jne', 'cek resi j&t', 'tracking kurir indonesia', 'status produksi seragam', 'tracking order bradwear', 'lacak order kemeja custom']
  ),
  [RouteKey.TEMUKAN_TOKO]: makeMeta(
    RouteKey.TEMUKAN_TOKO,
    'Workshop Kemeja Custom Bradwear Indonesia di Tasikmalaya',
    'Kunjungi workshop Bradwear Indonesia di Karisma Residence, Mangunreja, Kabupaten Tasikmalaya, Jawa Barat untuk konsultasi kemeja custom, seragam dinas, dan pengembangan sampel.',
    ['alamat bradwear', 'konveksi tasikmalaya', 'workshop seragam jawa barat', 'lokasi workshop seragam', 'toko seragam tasikmalaya', 'workshop kemeja custom', 'konveksi kemeja dinas tasikmalaya']
  ),
  [RouteKey.BRAD_AI]: makeMeta(
    RouteKey.BRAD_AI,
    'Brodi | Asisten AI Bradwear Indonesia',
    'Tanya Brodi tentang bahan, model, cara order, pengiriman, FAQ, dan layanan Bradwear Indonesia dengan jawaban natural dan informatif.',
    ['ai seragam', 'chatbot bradwear', 'asisten ai custom seragam', 'brodi', 'bradwear assistant']
  ),
  [RouteKey.EDITOR]: makeMeta(
    RouteKey.EDITOR,
    'Editor Desain Kemeja Custom | Bradwear Indonesia',
    'Atur warna, bahan, posisi atribut, dan detail desain kemeja custom atau seragam dinas langsung dari editor Bradwear Indonesia.',
    ['editor desain seragam', 'custom uniform editor', 'simulasi seragam custom', 'desain kemeja custom', 'editor kemeja dinas']
  ),
  [RouteKey.SUMMARY]: makeMeta(
    RouteKey.SUMMARY,
    'Ringkasan Pesanan Kemeja Custom | Bradwear Indonesia',
    'Periksa ukuran, jumlah item, dan ringkasan akhir sebelum mengirim order kemeja custom atau seragam dinas ke layanan pelanggan Bradwear.',
    ['ringkasan order seragam', 'checkout seragam custom', 'form pesanan seragam', 'order summary uniform', 'ringkasan order kemeja custom']
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
