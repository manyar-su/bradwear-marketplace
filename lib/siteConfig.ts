import {
  Article,
  BradAiContextSection,
  ContactChannel,
  CourierProvider,
  CustomerServiceContact,
  HowToOrderStep,
  NavItem,
  Product,
  RouteKey,
  SeoMeta,
  SiteFaqItem,
} from '../types';

const arisAvatar = new URL('../assets/CSavatar/Aris.jpeg', import.meta.url).href;
const ayangAvatar = new URL('../assets/CSavatar/ayang.jpeg', import.meta.url).href;
const bayuAvatar = new URL('../assets/CSavatar/bayu.png', import.meta.url).href;
const edeAvatar = new URL('../assets/CSavatar/ede.png', import.meta.url).href;
const elshaAvatar = new URL('../assets/CSavatar/Elsha.jpeg', import.meta.url).href;
const fikriAvatar = new URL('../assets/CSavatar/fikri.png', import.meta.url).href;
const gilangAvatar = new URL('../assets/CSavatar/gilang.png', import.meta.url).href;
const nadhifaAvatar = new URL('../assets/CSavatar/nadhifa.png', import.meta.url).href;
const rismaAvatar = new URL('../assets/CSavatar/risma.jpeg', import.meta.url).href;
const ucuAvatar = new URL('../assets/CSavatar/ucu.png', import.meta.url).href;

export const SITE_URL = 'https://www.bradwearindonesia.com';
export const SITE_NAME = 'Bradwear Indonesia';
export const SITE_TAGLINE = 'Konveksi kemeja custom, kemeja dinas, dan seragam kerja untuk instansi, perusahaan, dan komunitas di seluruh Indonesia.';
export const WHATSAPP_NUMBER = '6287736834454';
export const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.bradwear.app';
export const STORE_ADDRESS = 'Karisma Residence, Blok C.46, RT.008/RW.003, Margajaya, Kec. Mangunreja, Kabupaten Tasikmalaya, Jawa Barat 46462';
export const STORE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`;

export const ROUTE_PATHS: Record<RouteKey, string> = {
  [RouteKey.HOME]: '/',
  [RouteKey.THREE_D]: '/3d',
  [RouteKey.KATALOG]: '/katalog',
  [RouteKey.DOWNLOAD]: '/download',
  [RouteKey.CLIENT]: '/client',
  [RouteKey.TESTIMONI]: '/testimoni',
  [RouteKey.ABOUT]: '/tentang-kami',
  [RouteKey.VISION_MISSION]: '/visi-misi',
  [RouteKey.PRODUCTS_SERVICES]: '/produk-dan-jasa',
  [RouteKey.COMPETITIVE_ADVANTAGE]: '/keunggulan',
  [RouteKey.CLIENT_REACH]: '/klien-dan-jangkauan',
  [RouteKey.LEGAL_LICENSE]: '/legal-dan-lisensi',
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
  RouteKey.DOWNLOAD,
  RouteKey.CLIENT,
  RouteKey.TESTIMONI,
  RouteKey.ABOUT,
  RouteKey.VISION_MISSION,
  RouteKey.PRODUCTS_SERVICES,
  RouteKey.COMPETITIVE_ADVANTAGE,
  RouteKey.CLIENT_REACH,
  RouteKey.LEGAL_LICENSE,
  RouteKey.PANTS,
  RouteKey.ARTIKEL,
  RouteKey.CARA_ORDER,
  RouteKey.LAYANAN_PELANGGAN,
  RouteKey.LACAK_PESANAN,
  RouteKey.TEMUKAN_TOKO,
  RouteKey.BRAD_AI,
]);

// Label navigasi utama yang tampil di permukaan publik website.
export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: 'Beranda', route: RouteKey.HOME, description: 'Halaman utama Bradwear Indonesia.' },
  { label: 'Studio 3D', route: RouteKey.THREE_D, description: 'Halaman khusus preview dan custom seragam 3D Bradwear.' },
  { label: 'Katalog', route: RouteKey.KATALOG, description: 'Koleksi seragam kustom untuk berbagai kebutuhan instansi.' },
  { label: 'Download', route: RouteKey.DOWNLOAD, description: 'Hub akses cepat ke katalog, artikel, dan konsultasi web Bradwear.' },
  { label: 'Portofolio', route: RouteKey.CLIENT, description: 'Portofolio hasil jadi dan dokumentasi proyek klien Bradwear Indonesia.' },
  { label: 'Testimoni', route: RouteKey.TESTIMONI, description: 'Ulasan klien dan rangkuman kepuasan layanan Bradwear Indonesia.' },
  { label: 'Artikel', route: RouteKey.ARTIKEL, description: 'Konten panduan bahan, proses order, dan insight seragam.' },
  { label: 'Cara Order', route: RouteKey.CARA_ORDER, description: 'Panduan visual memesan seragam custom di Bradwear.' },
  { label: 'Layanan Pelanggan', route: RouteKey.LAYANAN_PELANGGAN, description: 'Bantuan konsultasi, revisi, dan tindak lanjut order.' },
  { label: 'Lacak Pesanan', route: RouteKey.LACAK_PESANAN, description: 'Pantau status produksi dan pengiriman order Anda.' },
  { label: 'Temukan Toko', route: RouteKey.TEMUKAN_TOKO, description: 'Alamat workshop dan titik konsultasi Bradwear Tasikmalaya.' },
  { label: 'Brodi', route: RouteKey.BRAD_AI, description: 'Asisten AI untuk menjawab pertanyaan seputar layanan Bradwear.' },
];

// Label shortcut utilitas untuk area publik.
export const UTILITY_NAV_ITEMS: NavItem[] = [
  { label: 'Layanan Pelanggan', route: RouteKey.LAYANAN_PELANGGAN },
  { label: 'Lacak Pesanan', route: RouteKey.LACAK_PESANAN },
  { label: 'Temukan Toko', route: RouteKey.TEMUKAN_TOKO },
  { label: 'Brodi', route: RouteKey.BRAD_AI },
];

// Label route/breadcrumb yang dipakai di beberapa konteks UI publik.
export const ROUTE_LABELS: Record<RouteKey, string> = {
  [RouteKey.HOME]: 'Beranda',
  [RouteKey.THREE_D]: 'Beranda / Studio 3D',
  [RouteKey.KATALOG]: 'Beranda / Katalog',
  [RouteKey.DOWNLOAD]: 'Beranda / Download',
  [RouteKey.CLIENT]: 'Beranda / Portofolio',
  [RouteKey.TESTIMONI]: 'Beranda / Testimoni',
  [RouteKey.ABOUT]: 'Beranda / Tentang Kami',
  [RouteKey.VISION_MISSION]: 'Beranda / Visi dan Misi',
  [RouteKey.PRODUCTS_SERVICES]: 'Beranda / Produk dan Jasa',
  [RouteKey.COMPETITIVE_ADVANTAGE]: 'Beranda / Keunggulan',
  [RouteKey.CLIENT_REACH]: 'Beranda / Klien dan Jangkauan',
  [RouteKey.LEGAL_LICENSE]: 'Beranda / Legal dan Lisensi',
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

// Teks kontak utama untuk halaman bantuan/layanan pelanggan.
export const CONTACT_CHANNELS: ContactChannel[] = [
  { label: 'WhatsApp Konsultasi', value: '+62 877-3683-4454', note: 'Respon untuk konsultasi model, bahan, dan estimasi order.' },
  { label: 'Area Layanan', value: 'Seluruh Indonesia', note: 'Melayani pengiriman seragam custom ke instansi, perusahaan, dan komunitas.' },
  { label: 'Workshop', value: 'Tasikmalaya, Jawa Barat', note: 'Titik konsultasi dan pengembangan sampel berada di Karisma Residence.' },
];

// Teks jam operasional yang tampil di halaman layanan pelanggan.
export const CUSTOMER_SERVICE_HOURS = [
  'Senin - Jumat: 08.00 - 17.00 WIB',
  'Sabtu: 08.00 - 14.00 WIB',
  'Minggu / hari libur: tindak lanjut via WhatsApp',
];

// FAQ utama website; dipakai ulang di home, layanan pelanggan, dan konteks AI.
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

// Folder `assets/artikel` disiapkan untuk penggantian asset lokal.
// Selama folder itu belum diisi gambar final, artikel memakai fallback foto online gratis yang relevan.
const ARTICLE_IMAGE_FALLBACKS = {
  fabric: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80',
  garmentRack: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80',
  procurementDesk: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80',
  productionFloor: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',
  customShirt: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
  formalUniform: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
  communityEvent: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80',
} as const;

// Sumber teks halaman artikel publik.
export const ARTICLES: Article[] = [
  {
    slug: 'panduan-memilih-bahan-seragam',
    category: 'Bahan',
    highlight: 'Tentukan bahan dari ritme kerja, suhu lapangan, dan target tampilan akhir.',
    highlights: ['Bandingkan Tropical, Oxford, Ripstop, dan Nagata Drill.', 'Pilih bahan yang seimbang antara adem, rapi, dan tahan gesek.', 'Finalkan bahan sebelum mockup dan bordir masuk approval.'],
    coverImage: ARTICLE_IMAGE_FALLBACKS.fabric,
    coverAlt: 'Foto kain dan pakaian gantung untuk panduan bahan seragam Bradwear',
    readTime: '7 menit',
    author: 'Tim Editorial Bradwear',
    authorRole: 'Riset bahan dan produksi',
    publishedAt: '2026-06-03',
    updatedAt: '2026-06-24',
    title: 'Panduan memilih bahan seragam agar nyaman dipakai dan tetap rapi',
    excerpt: 'Perbedaan material seperti Tropical, Nagata Drill, Ripstop, dan Oxford perlu disesuaikan dengan ritme kerja, lokasi lapangan, dan tampilan yang diinginkan.',
    seoTitle: 'Panduan Memilih Bahan Seragam Kerja dan Kemeja Dinas | Bradwear Indonesia',
    seoDescription: 'Pelajari cara memilih bahan seragam kerja, kemeja dinas, dan kemeja custom seperti Tropical, Oxford, Ripstop, dan Nagata Drill sesuai fungsi lapangan maupun kantor.',
    keywords: ['panduan bahan seragam', 'bahan kemeja dinas', 'bahan seragam kerja', 'bahan kemeja custom', 'tropical oxford ripstop nagata drill'],
    body: [
      'Seragam yang baik tidak hanya terlihat formal, tetapi juga mendukung mobilitas pemakainya. Untuk kebutuhan kantor dengan pemakaian harian, bahan yang ringan dan tidak panas seperti Tropical atau Oxford sering menjadi pilihan aman.',
      'Jika kebutuhan lebih berat, misalnya untuk lapangan atau operasional yang aktif, bahan seperti Ripstop dan Nagata Drill memberi struktur yang lebih kokoh serta ketahanan lebih baik terhadap gesekan.',
      'Dalam konteks pengadaan seragam kerja dan kemeja dinas, pemilihan bahan sebaiknya tidak hanya melihat tekstur saat dipegang. User perlu melihat apakah kain mudah kusut, bagaimana jatuh kain saat dipakai, serta seberapa kuat bahan itu menghadapi siklus cuci berulang.',
      'Untuk seragam kantor, banyak instansi memilih bahan yang tampil rapi di ruang meeting tetapi tetap nyaman ketika dipakai penuh dari pagi sampai sore. Sementara untuk seragam operasional, kebutuhan utamanya sering bergeser ke daya tahan, ketebalan yang pas, dan kemampuan bahan menjaga bentuk ketika dipakai aktif.',
      'Bradwear biasanya memetakan pilihan bahan dari tiga hal: konteks pemakaian, target tampilan, dan anggaran produksi. Dengan pendekatan ini, rekomendasi bahan seragam kerja, kemeja custom, atau kemeja dinas tidak berhenti di nama kain, tetapi benar-benar disesuaikan dengan ritme kerja tim.',
      'Langkah paling aman sebelum produksi adalah meminta contoh visual bahan, mencocokkan warna dengan bordir logo, lalu membandingkan opsi yang paling relevan dengan kebutuhan lapangan maupun kantor. Keputusan bahan yang benar di awal akan mempercepat approval desain dan menekan revisi saat produksi dimulai.',
    ],
    comments: [
      {
        id: 'comment-bahan-1',
        author: 'Rudi Pratama',
        role: 'PIC procurement sekolah swasta',
        publishedAt: '2026-06-08',
        body: 'Penjelasan bahan seperti ini membantu saat kami harus memilih antara kain yang adem untuk harian dan opsi yang lebih kokoh untuk kegiatan lapangan.',
      },
      {
        id: 'comment-bahan-2',
        author: 'Sinta Maharani',
        role: 'Staf GA perusahaan logistik',
        publishedAt: '2026-06-10',
        body: 'Bagian pembanding Tropical, Oxford, dan Ripstop cukup membantu karena tim kami memang butuh bahan seragam kerja yang tetap rapi walau dipakai mobilitas tinggi.',
      },
      {
        id: 'comment-bahan-3',
        author: 'Yusuf Prabowo',
        role: 'Koordinator seragam operasional',
        publishedAt: '2026-06-12',
        body: 'Artikel seperti ini relevan untuk pengadaan kemeja dinas karena keputusan bahan sering berpengaruh ke budget, kenyamanan, dan kecepatan approval internal.',
      },
    ],
  },
  {
    slug: 'beda-pdh-pdl-dan-lapangan',
    category: 'Model',
    highlight: 'PDH, PDL, dan model lapangan terlihat mirip, tetapi fungsi dan detail produksinya berbeda.',
    highlights: ['PDH cocok untuk kebutuhan dinas harian yang lebih formal.', 'PDL dan model lapangan menuntut bahan serta detail yang lebih tangguh.', 'Pemilihan tipe model di awal mempercepat approval visual.'],
    coverImage: ARTICLE_IMAGE_FALLBACKS.garmentRack,
    coverAlt: 'Rak pakaian kerja untuk artikel perbedaan PDH, PDL, dan seragam lapangan',
    readTime: '7 menit',
    author: 'Tim Editorial Bradwear',
    authorRole: 'Riset model seragam',
    publishedAt: '2026-06-05',
    title: 'Memahami beda PDH, PDL, dan seragam lapangan sebelum order produksi',
    excerpt: 'Jenis seragam yang terlihat mirip sering punya kebutuhan pola, bahan, dan detail finishing yang berbeda.',
    seoTitle: 'Beda PDH, PDL, dan Seragam Lapangan untuk Instansi | Bradwear Indonesia',
    seoDescription: 'Pahami perbedaan model PDH, PDL, dan seragam lapangan agar instansi, perusahaan, dan komunitas lebih tepat memilih potongan, bahan, dan detail custom.',
    keywords: ['beda pdh pdl', 'seragam lapangan instansi', 'model kemeja dinas', 'seragam dinas lapangan', 'pdh pdl custom'],
    body: [
      'PDH biasanya dipakai untuk kebutuhan dinas harian sehingga tampilannya lebih rapi dan formal. PDL dan model lapangan umumnya membutuhkan potongan yang lebih fungsional dengan kantong, penguat jahitan, atau bahan yang lebih tangguh.',
      'Kesalahan memilih tipe model di awal akan memengaruhi bahan, biaya, dan waktu persetujuan desain. Karena itu, Bradwear menyiapkan katalog terstruktur agar pelanggan bisa membedakan fungsi tiap seri dengan lebih cepat.',
      'Dalam praktik pengadaan seragam instansi, istilah PDH, PDL, dan seragam lapangan sering dipakai bergantian padahal kebutuhan produksinya berbeda. Perbedaan itu biasanya muncul pada struktur kantong, detail manset, kekuatan bahan, hingga seberapa formal seragam harus terlihat di lingkungan kerja.',
      'PDH lebih dekat ke kemeja dinas yang rapi, cocok untuk kebutuhan administrasi, pelayanan, dan aktivitas kantor. PDL lebih siap untuk aktivitas semi-teknis hingga lapangan ringan, sedangkan model lapangan sering menuntut detail yang lebih utilitarian dan bahan yang lebih tahan gesek.',
      'Saat tim internal sudah memahami perbedaan model sejak awal, proses desain akan jauh lebih efisien. User bisa lebih cepat menentukan referensi warna, bordir identitas, posisi emblem, dan pemetaan item untuk tiap divisi tanpa revisi model yang berulang.',
      'Vendor seragam custom seperti Bradwear biasanya akan lebih mudah memberi rekomendasi jika fungsi pemakaian dijelaskan dengan rinci. Informasi itu membuat hasil akhir tidak hanya bagus di visual, tetapi juga relevan untuk kebutuhan kerja harian dan operasional lapangan.',
    ],
    comments: [
      {
        id: 'comment-model-1',
        author: 'Fajar Nugraha',
        role: 'Koordinator lapangan komunitas',
        publishedAt: '2026-06-07',
        body: 'Bagian pembeda fungsi PDH dan PDL paling membantu karena tim kami sering menyamakan dua kebutuhan yang sebenarnya berbeda.',
      },
      {
        id: 'comment-model-2',
        author: 'Hani Melati',
        role: 'Sekretariat instansi daerah',
        publishedAt: '2026-06-09',
        body: 'Penjelasan model seragam dinas dan seragam lapangan seperti ini memudahkan saat kami menyusun brief ke vendor kemeja kerja.',
      },
      {
        id: 'comment-model-3',
        author: 'Rangga Putra',
        role: 'PIC perlengkapan komunitas',
        publishedAt: '2026-06-11',
        body: 'Sebelumnya kami fokus ke warna saja. Setelah baca ini, kami jadi lebih paham bahwa struktur model dan bahan juga menentukan hasil akhir seragam custom.',
      },
    ],
  },
  {
    slug: 'tips-order-seragam-instansi',
    category: 'Pemesanan',
    highlight: 'Order lebih cepat jika data ukuran, logo, PIC, dan target pemakaian sudah siap dari awal.',
    highlights: ['Siapkan jumlah item, ukuran, gender, dan target tanggal pakai.', 'Lampirkan file logo yang jelas supaya bordir lebih cepat disesuaikan.', 'Gunakan satu PIC internal agar revisi tidak bercabang.'],
    coverImage: ARTICLE_IMAGE_FALLBACKS.procurementDesk,
    coverAlt: 'Meja kerja dengan dokumen untuk artikel tips order seragam instansi',
    readTime: '8 menit',
    author: 'Tim Editorial Bradwear',
    authorRole: 'Riset alur order',
    publishedAt: '2026-06-09',
    updatedAt: '2026-06-26',
    title: 'Tips order seragam instansi agar proses revisi dan produksi lebih cepat',
    excerpt: 'Kejelasan data ukuran, identitas instansi, jumlah item, dan target waktu akan sangat mempercepat persetujuan.',
    seoTitle: 'Tips Order Seragam Instansi dan Perusahaan | Bradwear Indonesia',
    seoDescription: 'Simak tips order seragam instansi, perusahaan, dan komunitas agar approval desain, pengumpulan ukuran, bordir logo, dan produksi berjalan lebih cepat.',
    keywords: ['tips order seragam instansi', 'order kemeja dinas', 'pengadaan seragam perusahaan', 'order seragam komunitas', 'konsultasi seragam custom'],
    body: [
      'Sebelum order, siapkan daftar ukuran, pembagian gender, kebutuhan lengan, dan target tanggal pemakaian. Langkah sederhana ini membantu tim CS dan produksi menyusun estimasi dengan lebih akurat.',
      'Untuk seragam yang membutuhkan bordir logo, file referensi berkualitas baik akan mempersingkat proses penyesuaian. Jika ada panduan warna resmi instansi, lampirkan sejak awal.',
      'Bradwear juga menyarankan pelanggan menentukan PIC internal agar revisi tidak berjalan dari banyak jalur komunikasi sekaligus. Dengan begitu, desain dapat disetujui lebih cepat dan produksi lebih stabil.',
      'Dalam proses order seragam instansi dan perusahaan, hambatan paling sering justru bukan di produksi, tetapi di data awal yang tidak lengkap. Ukuran belum terkumpul, pembagian item berubah, atau file logo belum final membuat desain sulit dikunci dalam satu jalur approval.',
      'Karena itu, user sebaiknya menyiapkan brief ringkas berisi jumlah item, nama divisi, model yang dipilih, bahan yang diinginkan, serta deadline pemakaian. Brief ini membuat vendor kemeja dinas atau vendor seragam custom lebih cepat memahami konteks pekerjaan dan menyusun estimasi yang realistis.',
      'Jika seragam akan dipakai untuk pengadaan skala besar, koordinasi internal menjadi faktor penting. Satu PIC yang memusatkan komunikasi akan sangat membantu agar revisi desain, pemilihan warna, dan validasi bordir logo tidak bercabang ke banyak arah.',
      'Order yang rapi dari awal biasanya menghasilkan timeline yang lebih terukur. Ini penting untuk perusahaan, instansi, dan komunitas yang mengejar kepastian produksi tanpa harus mengulang diskusi teknis yang sama beberapa kali.',
    ],
    comments: [
      {
        id: 'comment-order-1',
        author: 'Laras Widuri',
        role: 'Admin pengadaan perusahaan',
        publishedAt: '2026-06-11',
        body: 'Tips menunjuk satu PIC internal benar-benar relevan. Setelah kami pakai cara itu, revisi desain jauh lebih cepat.',
      },
      {
        id: 'comment-order-2',
        author: 'Fikri Hidayat',
        role: 'Tim HR perusahaan manufaktur',
        publishedAt: '2026-06-13',
        body: 'Artikel ini cocok untuk tim yang baru pertama kali order kemeja custom karena urutan persiapannya jelas dan mudah diikuti.',
      },
      {
        id: 'comment-order-3',
        author: 'Nabila Putri',
        role: 'PIC event kampus',
        publishedAt: '2026-06-15',
        body: 'Bagian file logo dan data ukuran sangat membantu. Dua hal itu memang paling sering membuat order seragam komunitas kami melambat.',
      },
    ],
  },
  {
    slug: 'checklist-sebelum-produksi',
    category: 'Checklist',
    highlight: 'Checklist akhir membantu tim produksi bergerak tanpa revisi mendadak saat jahit dimulai.',
    highlights: ['Kunci model, warna, bahan, dan bordir sebelum cutting.', 'Validasi ulang nama personel, jabatan, dan detail pengiriman.', 'Pastikan PIC penerima dan preferensi kurir sudah final.'],
    coverImage: ARTICLE_IMAGE_FALLBACKS.productionFloor,
    coverAlt: 'Area produksi garmen untuk artikel checklist sebelum produksi seragam custom',
    readTime: '7 menit',
    author: 'Tim Editorial Bradwear',
    authorRole: 'Kontrol kualitas',
    publishedAt: '2026-06-12',
    title: 'Checklist sebelum produksi seragam custom dimulai',
    excerpt: 'Approval akhir sebaiknya mencakup model, ukuran, material, warna, logo, nama, dan alamat pengiriman.',
    seoTitle: 'Checklist Sebelum Produksi Seragam Custom Dimulai | Bradwear Indonesia',
    seoDescription: 'Gunakan checklist produksi seragam custom untuk memastikan model, bahan, warna, bordir logo, nama personel, dan alamat pengiriman sudah final sebelum jahit dimulai.',
    keywords: ['checklist seragam custom', 'produksi kemeja custom', 'approval seragam dinas', 'bordir nama personel', 'persiapan produksi seragam'],
    body: [
      'Pastikan kode model, warna kain, serta jenis bahan yang dipilih sudah final. Perubahan setelah proses cutting biasanya memengaruhi waktu produksi.',
      'Cek ulang penulisan nama personel, jabatan, atau divisi yang akan dibordir. Kesalahan data kecil justru sering menyebabkan penundaan produksi di tahap akhir.',
      'Konfirmasi alamat kirim, PIC penerima, dan kurir yang diinginkan jika ada preferensi tertentu. Bradwear lalu dapat menyiapkan update tracking yang lebih rapi sampai barang diterima.',
      'Checklist sebelum produksi seragam custom sangat penting karena tahap ini menjadi titik akhir sebelum barang benar-benar masuk proses jahit. Jika ada data yang belum final, revisi setelah cutting biasanya jauh lebih berat dibanding perbaikan di tahap mockup.',
      'Untuk kemeja dinas, seragam kerja, atau rompi lapangan, validasi akhir sebaiknya mencakup model, warna, bahan, ukuran, posisi logo, penulisan nama, dan aksesoris tambahan bila ada. Semakin rinci daftar cek yang dipakai, semakin kecil risiko salah produksi.',
      'User juga perlu memastikan bahwa file bordir, data ukuran per personel, dan pembagian item per divisi sudah sinkron dengan approval terakhir. Banyak keterlambatan pengadaan muncul karena ada versi data lama yang masih ikut dipakai saat produksi dimulai.',
      'Vendor yang disiplin akan meminta final check sebelum tahap jahit. Namun tim internal tetap perlu menyiapkan data yang rapi agar komunikasi produksi berjalan presisi dan tidak bergeser ketika deadline mulai dekat.',
    ],
    comments: [
      {
        id: 'comment-checklist-1',
        author: 'Meysa Putri',
        role: 'Sekretariat organisasi daerah',
        publishedAt: '2026-06-14',
        body: 'Checklist ini cocok dijadikan daftar final sebelum kami kirim data bordir nama dan alamat penerima ke vendor.',
      },
      {
        id: 'comment-checklist-2',
        author: 'Ridwan Hakim',
        role: 'Admin operasional lapangan',
        publishedAt: '2026-06-16',
        body: 'Poin verifikasi nama personel sangat penting. Kesalahan kecil di bordir justru paling sulit diperbaiki kalau produksi sudah berjalan.',
      },
      {
        id: 'comment-checklist-3',
        author: 'Tiara Lestari',
        role: 'Staf procurement lembaga',
        publishedAt: '2026-06-18',
        body: 'Ini membantu kami membuat approval sheet internal untuk order seragam kerja dan kemeja custom dalam jumlah besar.',
      },
    ],
  },
  {
    slug: 'kemeja-custom-untuk-perusahaan-dan-komunitas',
    category: 'Kemeja Custom',
    highlight: 'Brief desain yang jelas membuat kemeja custom lebih cepat masuk mockup dan produksi.',
    highlights: ['Tentukan fungsi pemakaian: formal, promosi, teknis, atau event.', 'Kunci warna utama, posisi logo, dan pembagian item per divisi.', 'Susun brief agar tim desain dan CS bekerja di jalur yang sama.'],
    coverImage: ARTICLE_IMAGE_FALLBACKS.customShirt,
    coverAlt: 'Foto kemeja fashion untuk artikel kemeja custom perusahaan dan komunitas',
    readTime: '9 menit',
    author: 'Tim Editorial Bradwear',
    authorRole: 'Strategi produk custom',
    publishedAt: '2026-06-15',
    updatedAt: '2026-06-25',
    title: 'Kemeja custom untuk perusahaan dan komunitas: hal yang perlu disiapkan sebelum produksi',
    excerpt: 'Kemeja custom untuk perusahaan, organisasi, dan komunitas akan lebih cepat diproduksi jika brief desain, fungsi pemakaian, dan identitas visual sudah jelas sejak awal.',
    seoTitle: 'Kemeja Custom untuk Perusahaan dan Komunitas | Bradwear Indonesia',
    seoDescription: 'Panduan menyiapkan kemeja custom untuk perusahaan, komunitas, organisasi, dan event agar desain, bahan, bordir, serta approval produksi lebih rapi.',
    keywords: ['kemeja custom perusahaan', 'kemeja custom komunitas', 'vendor kemeja custom', 'kemeja kostum custom', 'kemeja event custom'],
    body: [
      'Kemeja custom sering dipakai untuk kebutuhan branding internal, event, operasional lapangan, sampai identitas komunitas. Karena itu, poin paling awal yang harus jelas adalah konteks pemakaian: formal, santai, teknis, atau promosi.',
      'Untuk perusahaan dan komunitas, referensi warna utama, posisi logo, jenis identitas personel, dan jumlah item per divisi perlu dikunci lebih cepat. Langkah ini mempercepat diskusi desain dan mencegah revisi berulang di tengah proses approval.',
      'Bradwear membantu pelanggan menyusun kebutuhan kemeja custom agar lebih mudah diterjemahkan ke mockup, pilihan bahan, dan estimasi produksi. Dengan data yang rapi sejak awal, hasil akhirnya lebih konsisten dan proses order lebih efisien.',
      'Pada banyak proyek kemeja custom perusahaan, kendala terbesar biasanya muncul saat identitas visual belum diterjemahkan ke format produksi. Logo sudah ada, tetapi posisi bordir belum jelas, warna perusahaan belum dipetakan ke warna kain, atau pembagian item per divisi belum final.',
      'Untuk komunitas, tantangannya sedikit berbeda. Model harus tetap menarik, nyaman dipakai dalam durasi panjang, dan cukup fleksibel untuk kegiatan formal maupun santai. Karena itu, pemilihan bahan, jenis kerah, panjang lengan, dan komposisi warna sebaiknya dibahas sejak awal bersama vendor.',
      'Kemeja custom yang kuat bukan hanya soal desain yang keren di mockup. Hasil akhirnya harus tetap terlihat rapi ketika dipakai tim, difoto di lapangan, dan dicuci berulang untuk penggunaan harian. Ini yang membuat tahap brief menjadi sangat penting sebelum produksi dimulai.',
      'Jika kebutuhan sudah dipetakan dengan jelas, vendor kemeja custom bisa memberi rekomendasi model yang lebih tepat dan estimasi kerja yang lebih realistis. Hasilnya, proses approval lebih cepat dan kualitas produksi lebih konsisten.',
    ],
    comments: [
      {
        id: 'comment-kemeja-custom-1',
        author: 'Dian Kurnia',
        role: 'Ketua komunitas otomotif',
        publishedAt: '2026-06-17',
        body: 'Poin tentang fungsi pemakaian sangat kena. Untuk komunitas, beda kebutuhan touring dan kebutuhan event memang berpengaruh ke pilihan model.',
      },
      {
        id: 'comment-kemeja-custom-2',
        author: 'Bima Sapra',
        role: 'Supervisor branding perusahaan',
        publishedAt: '2026-06-18',
        body: 'Penjelasan soal brief desain dan posisi logo membantu sekali karena itu yang paling sering kami revisi saat order kemeja kerja custom.',
      },
      {
        id: 'comment-kemeja-custom-3',
        author: 'Wulan Ayu',
        role: 'Koordinator merchandise komunitas',
        publishedAt: '2026-06-20',
        body: 'Kontennya cocok untuk tim komunitas yang ingin bikin kemeja custom tapi belum pernah menyiapkan data produksi secara lengkap.',
      },
    ],
  },
  {
    slug: 'seragam-dinas-dan-komunitas-pilih-model-yang-tepat',
    category: 'Seragam Dinas',
    highlight: 'Model seragam yang tepat harus menjawab kebutuhan kantor, lapangan, dan citra tim sekaligus.',
    highlights: ['Potongan formal lebih cocok untuk ritme kerja kantor harian.', 'Seragam lapangan memerlukan detail kantong dan material yang tangguh.', 'Bordir, kerah, dan panjang lengan ikut memengaruhi persepsi profesional.'],
    coverImage: ARTICLE_IMAGE_FALLBACKS.formalUniform,
    coverAlt: 'Busana formal untuk artikel pemilihan model seragam dinas dan komunitas',
    readTime: '8 menit',
    author: 'Tim Editorial Bradwear',
    authorRole: 'Riset seragam dinas',
    publishedAt: '2026-06-18',
    title: 'Seragam dinas dan komunitas: cara memilih model yang tepat untuk kerja formal dan lapangan',
    excerpt: 'Pemilihan model seragam dinas dan komunitas perlu disesuaikan dengan ritme kerja, kebutuhan identitas, serta citra yang ingin ditampilkan di lapangan maupun kantor.',
    seoTitle: 'Seragam Dinas dan Seragam Komunitas: Pilih Model yang Tepat | Bradwear Indonesia',
    seoDescription: 'Cari model seragam dinas, seragam komunitas, dan kemeja kerja custom yang sesuai kebutuhan kantor, lapangan, operasional, dan event organisasi.',
    keywords: ['seragam dinas', 'seragam komunitas', 'kemeja kerja custom', 'vendor seragam dinas', 'seragam kantor custom'],
    body: [
      'Seragam dinas yang dipakai harian biasanya membutuhkan tampilan lebih formal dengan potongan rapi dan bahan yang nyaman untuk durasi panjang. Sebaliknya, seragam komunitas atau lapangan cenderung memerlukan fleksibilitas gerak, detail kantong, dan material yang lebih tangguh.',
      'Model yang tepat bukan hanya soal tampilan. Bentuk kerah, komposisi warna, bahan, bordir logo, dan panjang lengan akan memengaruhi kenyamanan pemakai sekaligus kesan profesional saat dipresentasikan ke pimpinan atau anggota tim.',
      'Bradwear memudahkan proses pemilihan model lewat katalog visual dan konsultasi WhatsApp sehingga user bisa membandingkan opsi untuk dinas, perusahaan, komunitas, dan kebutuhan custom lainnya sebelum produksi dimulai.',
      'Untuk kebutuhan seragam dinas, banyak tim memilih model yang aman secara visual tetapi kurang relevan untuk aktivitas lapangan. Akibatnya, seragam terlihat formal namun kurang nyaman ketika dipakai untuk mobilitas tinggi atau kerja teknis di luar ruangan.',
      'Sebaliknya, seragam komunitas kadang terlalu fokus pada gaya visual dan melupakan kenyamanan bahan. Padahal kegiatan touring, gathering, atau event membutuhkan pakaian yang tetap nyaman dipakai berjam-jam dan tetap terlihat rapi ketika difoto bersama.',
      'Memilih model yang tepat berarti menyeimbangkan identitas visual, kenyamanan, dan konteks kerja. Vendor seragam yang memahami alur ini dapat membantu user memilih model kemeja dinas, rompi, atau jaket yang lebih akurat untuk kebutuhan tim.',
      'Dengan referensi model yang jelas sejak awal, proses approval desain menjadi lebih cepat, terutama ketika keputusan harus melewati beberapa level internal seperti pimpinan, panitia, atau tim pengadaan.',
    ],
    comments: [
      {
        id: 'comment-seragam-dinas-1',
        author: 'Nur Aini',
        role: 'Staf administrasi instansi',
        publishedAt: '2026-06-20',
        body: 'Artikel ini memudahkan kami membedakan model untuk kebutuhan formal kantor dan kebutuhan lapangan yang lebih aktif.',
      },
      {
        id: 'comment-seragam-dinas-2',
        author: 'Dodi Kurniawan',
        role: 'Koordinator perlengkapan event',
        publishedAt: '2026-06-22',
        body: 'Bagian tentang pengaruh kerah, lengan, dan bordir terhadap kesan profesional sangat membantu saat kami memilih model seragam komunitas.',
      },
      {
        id: 'comment-seragam-dinas-3',
        author: 'Rina Safitri',
        role: 'PIC pengadaan kantor cabang',
        publishedAt: '2026-06-24',
        body: 'Kontennya enak dibaca dan cukup jelas untuk dipakai sebagai referensi awal sebelum konsultasi ke vendor seragam dinas.',
      },
    ],
  },
  {
    slug: 'vendor-seragam-dinas-untuk-pengadaan-instansi',
    category: 'Pengadaan',
    highlight: 'Vendor bisa memberi estimasi lebih akurat saat brief pengadaan sudah lengkap sejak kontak pertama.',
    highlights: ['Gabungkan fungsi seragam, volume item, dan timeline pemakaian.', 'Jangan hanya membandingkan harga, cek juga kesiapan proses approval dan produksi.', 'Pusatkan brief dalam satu dokumen agar komunikasi vendor lebih efisien.'],
    coverImage: ARTICLE_IMAGE_FALLBACKS.procurementDesk,
    coverAlt: 'Dokumen kerja untuk artikel memilih vendor seragam dinas pengadaan instansi',
    readTime: '8 menit',
    author: 'Tim Editorial Bradwear',
    authorRole: 'Riset pengadaan dan vendor',
    publishedAt: '2026-06-21',
    title: 'Memilih vendor seragam dinas untuk pengadaan instansi: data yang perlu disiapkan sejak awal',
    excerpt: 'Vendor seragam dinas lebih mudah memberi estimasi akurat jika instansi menyiapkan data fungsi pemakaian, jumlah item, identitas visual, dan timeline penggunaan.',
    seoTitle: 'Vendor Seragam Dinas untuk Pengadaan Instansi | Bradwear Indonesia',
    seoDescription: 'Panduan memilih vendor seragam dinas, vendor kemeja kerja, dan konveksi seragam instansi agar brief pengadaan lebih jelas, approval lebih cepat, dan produksi lebih terukur.',
    keywords: ['vendor seragam dinas', 'pengadaan seragam instansi', 'vendor kemeja kerja', 'konveksi seragam pemerintah', 'seragam kerja pengadaan'],
    body: [
      'Dalam proses pengadaan, vendor tidak cukup hanya melihat contoh desain. Mereka perlu memahami konteks penggunaan, rentang ukuran, detail bordir, komposisi warna, dan batas waktu pemakaian seragam.',
      'Instansi yang menyiapkan data lebih rapi sejak awal akan lebih mudah membandingkan proposal, estimasi bahan, dan alur revisi. Hal ini penting agar keputusan tidak hanya didasarkan pada harga, tetapi juga kesiapan produksi.',
      'Bradwear menyarankan setiap tim pengadaan menyiapkan satu dokumen ringkas yang memuat jumlah item, fungsi seragam, referensi visual, serta PIC persetujuan internal sebelum menghubungi vendor.',
      'Memilih vendor seragam dinas untuk pengadaan instansi sebaiknya dimulai dari kualitas brief, bukan dari daftar harga semata. Vendor yang baik akan meminta data yang lengkap agar estimasi bahan, model, dan jadwal produksi bisa dihitung dengan lebih akurat.',
      'Instansi yang hanya mengirim foto referensi tanpa penjelasan jumlah item, kebutuhan fungsi, dan target pemakaian biasanya akan menerima estimasi yang masih kasar. Ini membuat proses negosiasi dan approval menjadi lebih panjang karena banyak hal harus diklarifikasi ulang.',
      'Selain mengecek harga, user sebaiknya melihat bagaimana vendor menata alur kerja: apakah konsultasi jelas, approval desain rapi, opsi bahan dijelaskan, dan komunikasi produksi bisa dipantau. Untuk proyek pengadaan seragam kerja, struktur proses seperti ini sama pentingnya dengan hasil visual akhir.',
      'Jika data awal sudah matang, vendor kemeja dinas atau vendor seragam instansi dapat bergerak lebih cepat. Proses itu pada akhirnya membantu tim pengadaan membuat keputusan yang lebih presisi dan minim revisi.',
    ],
    comments: [
      {
        id: 'comment-vendor-1',
        author: 'Agus Firmansyah',
        role: 'Tim pengadaan lembaga pendidikan',
        publishedAt: '2026-06-22',
        body: 'Konten seperti ini berguna untuk menyusun brief awal sebelum kami meminta penawaran ke beberapa vendor seragam dinas.',
      },
      {
        id: 'comment-vendor-2',
        author: 'Lina Permata',
        role: 'Admin procurement BUMD',
        publishedAt: '2026-06-23',
        body: 'Poin bahwa vendor tidak cukup menilai dari foto desain saja sangat tepat. Data fungsi dan timeline memang sangat menentukan saat pengadaan seragam instansi.',
      },
      {
        id: 'comment-vendor-3',
        author: 'Farhan Akbar',
        role: 'Staf pengadaan yayasan',
        publishedAt: '2026-06-25',
        body: 'Artikel ini membantu kami membuat checklist penawaran supaya vendor kemeja kerja yang dibandingkan punya acuan data yang sama.',
      },
    ],
  },
  {
    slug: 'seragam-komunitas-dan-event-agar-branding-lebih-rapi',
    category: 'Komunitas',
    highlight: 'Branding event akan lebih kuat jika model, warna, dan kenyamanan dipikirkan sebagai satu paket.',
    highlights: ['Bedakan item untuk panitia inti, peserta, dan divisi pendukung.', 'Sesuaikan kain dengan durasi pemakaian dan lokasi acara.', 'Pastikan logo dan warna utama tetap terbaca kuat di foto lapangan.'],
    coverImage: ARTICLE_IMAGE_FALLBACKS.communityEvent,
    coverAlt: 'Foto fashion komunitas untuk artikel seragam komunitas dan event Bradwear',
    readTime: '8 menit',
    author: 'Tim Editorial Bradwear',
    authorRole: 'Riset komunitas dan event',
    publishedAt: '2026-06-23',
    title: 'Seragam komunitas dan event agar branding lebih rapi tanpa mengorbankan kenyamanan',
    excerpt: 'Seragam komunitas, gathering, dan event akan terlihat lebih kuat jika logo, warna utama, dan model dipilih sesuai situasi pemakaian.',
    seoTitle: 'Seragam Komunitas dan Kemeja Event Custom | Bradwear Indonesia',
    seoDescription: 'Pelajari cara menyiapkan seragam komunitas, kemeja event custom, dan kemeja kostum custom agar branding tim lebih rapi, nyaman dipakai, dan mudah diproduksi.',
    keywords: ['seragam komunitas', 'kemeja event custom', 'kemeja kostum custom', 'seragam gathering', 'vendor kemeja komunitas'],
    body: [
      'Komunitas dan penyelenggara event sering memerlukan seragam yang terlihat kuat di foto, mudah dikenali, tetapi tetap nyaman dipakai berjam-jam. Karena itu, pemilihan kain dan warna tidak bisa hanya mengikuti tren visual.',
      'Untuk event di ruang luar, model yang lebih ringan dan cepat kering sering menjadi pilihan aman. Sementara untuk komunitas yang ingin tampil lebih formal, potongan kemeja dengan bordir identitas masih menjadi opsi paling fleksibel.',
      'Sebelum produksi, cocokkan dulu warna utama, ukuran logo, serta pembagian item untuk panitia, peserta inti, dan divisi pendukung agar hasil branding tetap konsisten.',
      'Seragam komunitas yang berhasil biasanya punya keseimbangan antara identitas visual dan kenyamanan. Warna utama harus tetap menonjol, tetapi bahan dan pola juga perlu disesuaikan dengan cuaca, durasi acara, dan jenis aktivitas di lapangan.',
      'Untuk kemeja event custom, pembagian peran sering menjadi faktor desain yang penting. Panitia inti, kru teknis, peserta VIP, dan divisi dokumentasi kadang memerlukan pembeda warna atau detail identitas agar koordinasi di lapangan lebih mudah.',
      'Branding yang kuat tidak harus rumit. Bahkan desain yang sederhana bisa terlihat premium jika ukuran logo proporsional, bahan sesuai, dan warna tetap terbaca jelas di kamera maupun saat dipakai dalam kerumunan.',
      'Vendor yang memahami kebutuhan komunitas akan membantu user menyesuaikan model dengan ritme acara. Dengan begitu, seragam tidak hanya bagus di desain, tetapi juga efektif mendukung pengalaman event secara keseluruhan.',
    ],
    comments: [
      {
        id: 'comment-komunitas-1',
        author: 'Aldo Saputra',
        role: 'Panitia event komunitas daerah',
        publishedAt: '2026-06-24',
        body: 'Kami sering fokus ke desain depan saja. Artikel ini mengingatkan bahwa pembagian item per divisi juga harus dihitung dari awal.',
      },
      {
        id: 'comment-komunitas-2',
        author: 'Niken Saraswati',
        role: 'Koordinator gathering alumni',
        publishedAt: '2026-06-26',
        body: 'Bagian soal bahan dan foto lapangan sangat relevan karena seragam komunitas kami memang perlu tetap bagus saat dipakai outdoor.',
      },
      {
        id: 'comment-komunitas-3',
        author: 'Gema Prasetyo',
        role: 'PIC merchandise event nasional',
        publishedAt: '2026-06-28',
        body: 'Konten ini membantu kami melihat bahwa branding event bukan cuma soal warna, tapi juga soal pembagian item dan kenyamanan pemakaian.',
      },
    ],
  },
  {
    slug: 'bordir-logo-instansi-pada-kemeja-dinas',
    category: 'Bordir',
    highlight: 'Logo instansi yang rapi dimulai dari file yang benar, ukuran proporsional, dan penempatan yang konsisten.',
    highlights: ['Gunakan file logo yang bersih agar digitizing bordir lebih presisi.', 'Tentukan ukuran logo berdasarkan area dada, lengan, atau punggung.', 'Samakan panduan warna logo dengan warna benang sejak awal approval.'],
    coverImage: ARTICLE_IMAGE_FALLBACKS.formalUniform,
    coverAlt: 'Kemeja formal untuk artikel bordir logo instansi pada kemeja dinas Bradwear',
    readTime: '8 menit',
    author: 'Tim Editorial Bradwear',
    authorRole: 'Riset bordir identitas instansi',
    publishedAt: '2026-06-26',
    updatedAt: '2026-07-01',
    title: 'Bordir logo instansi pada kemeja dinas: cara menjaga hasil tetap rapi dan terbaca',
    excerpt: 'Bordir logo instansi pada kemeja dinas perlu dipersiapkan dari file, ukuran, warna benang, dan posisi agar identitas visual tetap rapi saat dipakai harian.',
    seoTitle: 'Bordir Logo Instansi pada Kemeja Dinas | Bradwear Indonesia',
    seoDescription: 'Pelajari cara menyiapkan bordir logo instansi pada kemeja dinas, seragam kerja, dan kemeja custom agar hasil tetap presisi, terbaca, dan konsisten saat produksi.',
    keywords: ['bordir logo instansi', 'bordir kemeja dinas', 'logo bordir seragam kerja', 'bordir nama dan logo', 'ukuran bordir kemeja custom'],
    body: [
      'Bordir logo instansi pada kemeja dinas tidak cukup hanya mengandalkan file gambar yang terlihat jelas di layar. Tim produksi tetap perlu file yang bersih, kontras yang cukup, dan bentuk detail yang masih masuk akal untuk diterjemahkan ke jalur benang.',
      'Masalah yang paling sering muncul biasanya ada pada ukuran logo yang terlalu kecil atau terlalu padat. Ketika detail terlalu rapat, hasil bordir bisa terlihat penuh, garis tipis hilang, dan identitas visual justru sulit dibaca dari jarak normal.',
      'Karena itu, user sebaiknya menyiapkan satu panduan sederhana yang berisi file logo final, warna acuan, posisi penempatan, dan perkiraan ukuran pada tiap area seragam. Langkah ini membantu vendor kemeja dinas atau vendor seragam kerja menjaga konsistensi hasil sejak sample sampai produksi massal.',
      'Untuk kemeja dinas kantor, area dada kiri biasanya menjadi titik utama karena paling mudah dibaca dan tetap terlihat formal. Pada seragam lapangan atau rompi, posisi tambahan di lengan atau punggung kadang diperlukan agar identitas tim tetap terlihat jelas di area kerja yang lebih dinamis.',
      'Warna benang juga perlu dibahas sejak awal, terutama jika logo instansi memiliki gradasi atau warna yang sangat spesifik. Tidak semua warna di file digital bisa diterjemahkan persis ke benang, jadi approval visual sebaiknya selalu membandingkan warna kain dan warna bordir secara bersamaan.',
      'Vendor yang berpengalaman biasanya akan membantu menyederhanakan detail tertentu tanpa menghilangkan identitas utama logo. Pendekatan ini penting agar hasil bordir logo instansi pada kemeja custom tetap premium, terbaca, dan tahan untuk pemakaian rutin.',
      'Jika file, ukuran, dan penempatan sudah dikunci sejak tahap approval, proses produksi menjadi lebih cepat dan risiko revisi turun drastis. Ini sangat membantu untuk proyek pengadaan seragam dinas, seragam kerja perusahaan, maupun kebutuhan komunitas yang memakai banyak identitas personel.',
    ],
    comments: [
      {
        id: 'comment-bordir-1',
        author: 'Rizky Maulana',
        role: 'PIC atribut instansi',
        publishedAt: '2026-06-27',
        body: 'Artikel ini menjelaskan masalah yang sering kami alami, terutama saat logo terlalu kecil dan detailnya hilang setelah dibordir di kemeja dinas.',
      },
      {
        id: 'comment-bordir-2',
        author: 'Salsa Anindita',
        role: 'Admin pengadaan rumah sakit',
        publishedAt: '2026-06-29',
        body: 'Bagian penjelasan ukuran logo dan warna benang sangat membantu karena tim kami sering harus menyamakan identitas visual dengan aturan instansi.',
      },
      {
        id: 'comment-bordir-3',
        author: 'Rama Prakoso',
        role: 'Koordinator perlengkapan organisasi',
        publishedAt: '2026-06-30',
        body: 'Relevan sekali untuk order seragam kerja custom, terutama saat ada banyak jabatan dan nama personel yang ikut dibordir pada satu batch produksi.',
      },
    ],
  },
  {
    slug: 'celana-tactical-dan-seragam-lapangan-untuk-tim-operasional',
    category: 'Celana Tactical',
    highlight: 'Celana tactical yang tepat harus kuat dipakai aktif, tetapi tetap nyaman untuk jam kerja yang panjang.',
    highlights: ['Pilih bahan sesuai ritme kerja lapangan dan frekuensi pemakaian.', 'Pertimbangkan posisi kantong, fleksibilitas gerak, dan daya tahan jahitan.', 'Samakan warna celana dengan atasan seragam agar hasil tim tetap solid.'],
    coverImage: ARTICLE_IMAGE_FALLBACKS.productionFloor,
    coverAlt: 'Area produksi untuk artikel celana tactical dan seragam lapangan tim operasional',
    readTime: '8 menit',
    author: 'Tim Editorial Bradwear',
    authorRole: 'Riset celana kerja dan lapangan',
    publishedAt: '2026-06-27',
    updatedAt: '2026-07-01',
    title: 'Celana tactical dan seragam lapangan untuk tim operasional: poin yang perlu dicek sebelum order',
    excerpt: 'Celana tactical untuk tim operasional perlu dibahas dari bahan, pola gerak, kantong, dan kekuatan jahitan agar tetap nyaman dipakai dalam mobilitas tinggi.',
    seoTitle: 'Celana Tactical dan Seragam Lapangan Custom | Bradwear Indonesia',
    seoDescription: 'Panduan memilih celana tactical, celana kerja, dan seragam lapangan custom untuk tim operasional agar bahan, potongan, dan detail fungsional sesuai kebutuhan kerja.',
    keywords: ['celana tactical custom', 'celana kerja lapangan', 'seragam lapangan custom', 'pants operasional instansi', 'celana tactical tim operasional'],
    body: [
      'Celana tactical untuk tim operasional tidak bisa dipilih hanya dari tampilan luar. Kebutuhan lapangan biasanya menuntut kombinasi antara bahan yang cukup kuat, pola yang memberi ruang gerak, dan detail kantong yang benar-benar berguna saat bekerja.',
      'Untuk pekerjaan yang sering berpindah titik, naik turun kendaraan, atau bergerak dalam posisi jongkok dan berjalan jauh, struktur potongan celana sangat berpengaruh pada kenyamanan harian. Celana yang terlalu kaku memang terlihat tegas, tetapi cepat melelahkan jika dipakai sepanjang hari.',
      'Karena itu, user perlu menjelaskan konteks kerja sejak awal: apakah celana dipakai untuk inspeksi, patroli, kegiatan teknis, atau kebutuhan operasional umum. Dari sini vendor bisa lebih tepat merekomendasikan bahan dan pola celana kerja custom yang sesuai.',
      'Posisi kantong juga sebaiknya tidak dipilih sembarangan. Banyak tim tertarik ke model cargo, tetapi tidak semua kebutuhan lapangan memerlukan kantong tambahan dalam jumlah banyak. Jika salah pilih, siluet celana terlihat terlalu berat dan justru mengganggu kenyamanan saat duduk atau bergerak cepat.',
      'Warna celana tactical pun perlu dipadukan dengan atasan seragam. Pada banyak proyek seragam kerja, kesan rapi tim justru ditentukan oleh harmoni warna antara kemeja, jaket, rompi, dan celana. Saat kombinasi ini disiapkan sejak awal, hasil branding tim jauh lebih solid.',
      'Vendor seragam lapangan yang baik akan membantu menilai apakah user lebih cocok memakai model tactical penuh, celana kerja formal-operasional, atau celana semi-lapangan yang lebih ringan. Pendekatan seperti ini membuat produk akhir lebih relevan dengan aktivitas nyata di lapangan.',
      'Jika fungsi, bahan, dan detail utilitas dibahas dari awal, proses approval celana tactical custom akan berjalan lebih cepat. Ini membantu instansi, perusahaan, maupun komunitas operasional menghindari revisi model ketika produksi sudah terlalu jauh berjalan.',
    ],
    comments: [
      {
        id: 'comment-celana-1',
        author: 'Feri Setiawan',
        role: 'Koordinator tim operasional',
        publishedAt: '2026-06-28',
        body: 'Poin tentang posisi kantong sangat pas. Tim kami pernah memilih model cargo yang ternyata terlalu berat untuk dipakai kerja harian.',
      },
      {
        id: 'comment-celana-2',
        author: 'Nadia Oktaviani',
        role: 'Staf GA perusahaan distribusi',
        publishedAt: '2026-06-29',
        body: 'Artikel ini membantu saat kami membandingkan celana tactical custom dengan celana kerja lapangan yang lebih ringan untuk divisi berbeda.',
      },
      {
        id: 'comment-celana-3',
        author: 'Teguh Aditya',
        role: 'PIC seragam keamanan',
        publishedAt: '2026-07-01',
        body: 'Relevan untuk pengadaan seragam operasional karena pembahasan fungsi kerja dan warna set seragamnya cukup detail.',
      },
    ],
  },
  {
    slug: 'vendor-seragam-kerja-tasikmalaya-untuk-perusahaan',
    category: 'Vendor Tasikmalaya',
    highlight: 'Vendor lokal yang prosesnya rapi memberi keuntungan pada komunikasi, sample, dan kontrol revisi.',
    highlights: ['Cek alur konsultasi, sample, approval desain, dan tracking produksi.', 'Pastikan vendor memahami kebutuhan perusahaan dan pembagian item antar divisi.', 'Bandingkan vendor dari kualitas proses, bukan harga semata.'],
    coverImage: ARTICLE_IMAGE_FALLBACKS.customShirt,
    coverAlt: 'Kemeja custom untuk artikel vendor seragam kerja Tasikmalaya Bradwear',
    readTime: '9 menit',
    author: 'Tim Editorial Bradwear',
    authorRole: 'Riset vendor dan workflow produksi',
    publishedAt: '2026-06-29',
    updatedAt: '2026-07-01',
    title: 'Vendor seragam kerja Tasikmalaya untuk perusahaan: cara menilai proses sebelum memilih produksi',
    excerpt: 'Memilih vendor seragam kerja di Tasikmalaya sebaiknya tidak berhenti di harga, tetapi juga melihat alur konsultasi, sample, revisi, dan kontrol produksi.',
    seoTitle: 'Vendor Seragam Kerja Tasikmalaya untuk Perusahaan | Bradwear Indonesia',
    seoDescription: 'Panduan memilih vendor seragam kerja Tasikmalaya, vendor kemeja custom, dan konveksi seragam perusahaan agar proses sample, approval, dan produksi lebih terkontrol.',
    keywords: ['vendor seragam kerja tasikmalaya', 'konveksi seragam perusahaan tasikmalaya', 'vendor kemeja custom tasikmalaya', 'seragam kerja custom jawa barat', 'pengadaan seragam perusahaan tasikmalaya'],
    body: [
      'Memilih vendor seragam kerja Tasikmalaya untuk perusahaan tidak cukup hanya melihat portofolio foto atau daftar harga. Tim pengadaan juga perlu memahami bagaimana vendor menangani konsultasi, sample, revisi desain, dan koordinasi produksi dari awal sampai pengiriman.',
      'Vendor yang baik biasanya mampu menerjemahkan kebutuhan perusahaan ke format kerja yang lebih rapi. Mereka tidak hanya menjawab pertanyaan bahan dan model, tetapi juga membantu memecah kebutuhan per divisi, target pemakaian, hingga pembagian item yang berbeda antar tim.',
      'Keuntungan bekerja dengan vendor seragam kerja Tasikmalaya yang prosesnya jelas adalah komunikasi lebih cepat dan approval lebih terkontrol. Ini sangat membantu ketika perusahaan membutuhkan sample, evaluasi bahan, atau penyesuaian bordir logo sebelum masuk ke batch produksi utama.',
      'Dalam banyak proyek seragam perusahaan, masalah justru muncul saat vendor tidak memiliki alur revisi yang rapi. Data perubahan tersebar di banyak chat, file lama masih ikut dipakai, atau jadwal sample tidak dipastikan sejak awal. Hasilnya, timeline bergeser walau desain dasar sudah disepakati.',
      'Karena itu, user sebaiknya menilai vendor dari kualitas proses: bagaimana mereka mengumpulkan brief, menjelaskan opsi bahan, memvalidasi ukuran, dan memberi update produksi. Faktor-faktor ini menentukan apakah seragam kerja custom bisa selesai dengan hasil yang konsisten dan minim koreksi.',
      'Bagi perusahaan di Tasikmalaya dan Jawa Barat, kedekatan workshop juga bisa menjadi nilai tambah ketika perlu melihat sample langsung atau menyamakan ekspektasi desain dengan lebih cepat. Namun kedekatan lokasi tetap perlu disertai disiplin workflow agar proyek berjalan efektif.',
      'Saat vendor seragam kerja memahami konteks perusahaan dan punya sistem komunikasi yang rapi, keputusan pengadaan menjadi lebih presisi. Ini yang biasanya membedakan vendor yang hanya menjual produk dengan vendor yang benar-benar siap mengawal kebutuhan seragam perusahaan dari awal sampai jadi.',
    ],
    comments: [
      {
        id: 'comment-vendor-tasik-1',
        author: 'Mira Anggraini',
        role: 'HR perusahaan jasa',
        publishedAt: '2026-06-30',
        body: 'Penjelasan tentang menilai vendor dari kualitas proses sangat membantu, karena selama ini kami terlalu fokus membandingkan harga penawaran.',
      },
      {
        id: 'comment-vendor-tasik-2',
        author: 'Reza Darmawan',
        role: 'Supervisor GA Tasikmalaya',
        publishedAt: '2026-07-01',
        body: 'Artikel ini cocok untuk tim perusahaan yang mencari vendor seragam kerja Tasikmalaya dan ingin melihat kesiapan sample serta revisinya lebih dulu.',
      },
      {
        id: 'comment-vendor-tasik-3',
        author: 'Indah Permatasari',
        role: 'Admin procurement kantor cabang',
        publishedAt: '2026-07-01',
        body: 'Kontennya relevan untuk pengadaan seragam perusahaan karena benar-benar membahas alur kerja, bukan hanya promosi vendor.',
      },
    ],
  },
  {
    slug: 'tentang-bradwear-indonesia-dan-standar-produksi',
    category: 'Profil Brand',
    highlight: 'Bradwear dibangun sebagai partner pengadaan seragam yang mengutamakan hasil rapi, timeline jelas, dan komunikasi yang bisa dipertanggungjawabkan.',
    highlights: ['Berawal dari kebutuhan seragam instansi dan perusahaan yang butuh vendor lebih disiplin.', 'Menggabungkan kontrol bahan, bordir, jahit, dan komunikasi order dalam satu alur kerja.', 'Founder Bradwear adalah Gilang dengan pengelolaan website oleh Maris Ibrahim.'],
    coverImage: ARTICLE_IMAGE_FALLBACKS.productionFloor,
    coverAlt: 'Suasana area produksi Bradwear Indonesia untuk artikel profil perusahaan',
    readTime: '8 menit',
    author: 'Tim Editorial Bradwear',
    authorRole: 'Profil brand dan produksi',
    publishedAt: '2026-07-02',
    updatedAt: '2026-07-02',
    title: 'Tentang Bradwear Indonesia dan standar produksi yang kami pegang',
    excerpt: 'Bradwear Indonesia tumbuh sebagai partner seragam custom yang menyeimbangkan kualitas bahan, desain, kontrol produksi, dan komunikasi yang lebih terarah untuk instansi maupun perusahaan.',
    seoTitle: 'Tentang Bradwear Indonesia dan Standar Produksi Seragam Custom',
    seoDescription: 'Kenali profil Bradwear Indonesia, standar produksi seragam custom, founder Gilang, pengelola website Maris Ibrahim, serta pendekatan kerja yang rapi untuk instansi dan perusahaan.',
    keywords: ['tentang bradwear indonesia', 'profil bradwear indonesia', 'founder bradwear gilang', 'seragam custom tasikmalaya', 'standar produksi seragam custom', 'vendor kemeja custom indonesia'],
    body: [
      'Bradwear Indonesia dibangun untuk menjawab kebutuhan seragam custom yang tidak hanya bagus di foto, tetapi juga tertata rapi saat masuk ke proses pengadaan. Banyak instansi, perusahaan, dan komunitas membutuhkan vendor yang mampu menjelaskan bahan, model, bordir logo, dan timeline produksi secara lebih jelas sejak awal. Dari kebutuhan inilah Bradwear tumbuh sebagai partner yang mengutamakan ketelitian, konsistensi, dan komunikasi yang lebih mudah diikuti.',
      'Di balik brand ini, Gilang berperan sebagai owner sekaligus founder yang membangun arah kerja Bradwear dari kebutuhan lapangan yang nyata. Fokus utamanya adalah memastikan setiap seragam yang diproduksi tidak berhenti di visual menarik, melainkan benar-benar relevan dengan konteks pemakaian, ritme kerja tim, dan identitas instansi yang memesan. Sementara itu, pengelolaan website Bradwear ditangani oleh Maris Ibrahim agar katalog, artikel, serta jalur konsultasi digital tetap terstruktur dan mudah diakses user dari desktop maupun mobile.',
      'Standar kerja Bradwear dimulai dari brief yang rapi. Tim tidak langsung masuk ke produksi, tetapi memetakan dulu model yang paling dekat dengan kebutuhan, bahan yang sesuai fungsi, warna yang konsisten, lalu detail bordir atau identitas yang harus tampil jelas saat dipakai. Pendekatan ini membantu pelanggan mengurangi revisi berulang dan membuat approval internal berjalan lebih cepat.',
      'Pada sisi produksi, Bradwear menjaga kualitas melalui pemilihan bahan yang lebih relevan, pola yang proporsional, dan jahitan yang presisi. Seragam custom, kemeja dinas, rompi, jaket, celana tactical, hingga polo shirt diproses dengan prinsip yang sama: hasil harus nyaman dipakai, terlihat profesional, dan siap mendukung citra tim di lapangan maupun kantor.',
      'Yang membedakan Bradwear bukan hanya hasil jadi, tetapi juga caranya mengawal proses. Tim berupaya membuat alur konsultasi, sample, revisi, produksi, hingga pengiriman menjadi lebih mudah dipahami pelanggan. Dengan pola kerja seperti ini, user dapat menilai progres lebih jelas dan mengambil keputusan pengadaan dengan rasa aman yang lebih tinggi.',
      'Karena itu, ketika orang mencari vendor seragam custom Tasikmalaya atau partner pengadaan kemeja kerja yang prosesnya disiplin, Bradwear ingin hadir bukan sekadar sebagai produsen, tetapi sebagai partner kerja yang bisa membantu menerjemahkan kebutuhan seragam menjadi produk yang siap dipakai dengan bangga.',
    ],
    comments: [
      {
        id: 'comment-profile-1',
        author: 'Hendra Saputra',
        role: 'PIC pengadaan instansi daerah',
        publishedAt: '2026-07-02',
        body: 'Bagian tentang alur brief dan approval sangat relevan. Vendor seragam yang menjelaskan proses sejak awal memang jauh lebih memudahkan tim pengadaan.',
      },
      {
        id: 'comment-profile-2',
        author: 'Lina Kurniasih',
        role: 'Admin operasional perusahaan',
        publishedAt: '2026-07-02',
        body: 'Informasi tentang founder, standar kerja, dan pengelolaan website membuat profil Bradwear terasa lebih jelas dan kredibel untuk kami jadikan referensi vendor.',
      },
      {
        id: 'comment-profile-3',
        author: 'Ade Firmansyah',
        role: 'Koordinator komunitas',
        publishedAt: '2026-07-02',
        body: 'Artikel ini membantu memahami bahwa kualitas seragam tidak hanya ditentukan bahan, tetapi juga cara vendor mengelola komunikasi dan revisi produksi.',
      },
    ],
  },
  {
    slug: 'produk-dan-jasa-seragam-custom-bradwear',
    category: 'Produk & Jasa',
    highlight: 'Bradwear menyusun layanan dari model dasar yang kuat lalu membuka ruang custom sesuai fungsi, identitas, dan ritme kerja tim.',
    highlights: ['Mencakup kemeja, celana, jaket, rompi, polo, dan kebutuhan lapangan.', 'Layanan custom desain mencakup bahan, warna, bordir, nama personel, dan penyesuaian fungsi.', 'Alur konsultasi dan produksi dirancang agar approval lebih cepat.'],
    coverImage: ARTICLE_IMAGE_FALLBACKS.customShirt,
    coverAlt: 'Produk kemeja custom Bradwear Indonesia untuk artikel produk dan jasa',
    readTime: '8 menit',
    author: 'Tim Editorial Bradwear',
    authorRole: 'Katalog produk dan jasa',
    publishedAt: '2026-07-02',
    updatedAt: '2026-07-02',
    title: 'Produk dan jasa seragam custom Bradwear untuk instansi, perusahaan, dan komunitas',
    excerpt: 'Layanan Bradwear tidak berhenti di penjualan produk, tetapi mencakup konsultasi model, pemilihan bahan, penyesuaian identitas, hingga alur produksi dan pengiriman.',
    seoTitle: 'Produk dan Jasa Seragam Custom Bradwear Indonesia',
    seoDescription: 'Lihat produk dan jasa Bradwear Indonesia untuk kemeja custom, seragam dinas, jaket, rompi, polo, celana tactical, desain custom, dan konsultasi pengadaan seragam.',
    keywords: ['produk seragam custom bradwear', 'jasa kemeja custom', 'seragam dinas custom', 'jasa bordir logo instansi', 'vendor rompi jaket polo custom', 'celana tactical custom'],
    body: [
      'Produk dan jasa Bradwear disusun untuk memudahkan tim pengadaan memilih jalur kerja yang paling sesuai. Di satu sisi, tersedia model dasar seperti kemeja, celana, jaket, rompi, dan polo yang bisa langsung dijadikan fondasi. Di sisi lain, setiap model tetap terbuka untuk penyesuaian bahan, warna, identitas, dan kebutuhan fungsi yang lebih spesifik.',
      'Untuk kebutuhan formal, banyak user memulai dari kemeja dinas atau kemeja kerja custom yang tampil rapi dan profesional. Untuk kebutuhan lapangan, Bradwear juga menangani jaket kerja, rompi, serta celana tactical yang menuntut struktur bahan dan detail utilitas yang lebih tepat. Pendekatan ini membuat produk tidak dipilih dari tampilan semata, tetapi dari fungsi pemakaiannya sehari-hari.',
      'Nilai utama layanan Bradwear ada pada sisi konsultasi dan penyesuaian. Tim membantu membaca kebutuhan instansi atau perusahaan, lalu menerjemahkannya ke pilihan model, material, penempatan bordir logo, warna identitas, hingga penambahan nama personel jika diperlukan. Dengan begitu, pelanggan tidak perlu merakit semua keputusan sendiri dari nol.',
      'Bradwear juga memosisikan layanan desain sebagai bagian dari alur produksi, bukan tahap yang berdiri sendiri. Arahan visual, contoh penempatan identitas, dan ringkasan spesifikasi disusun lebih awal agar approval internal lebih cepat dan kesalahan produksi bisa ditekan. Hal ini penting terutama pada proyek seragam kerja custom dengan banyak divisi atau banyak kombinasi item.',
      'Selain produk fisik, jasa yang diberikan mencakup pengawalan proses: konsultasi kebutuhan, penyesuaian spesifikasi, koordinasi sample bila perlu, validasi detail order, hingga pengiriman hasil akhir. Kombinasi produk dan jasa seperti ini membantu klien yang ingin pengadaan lebih rapi tanpa harus bolak-balik menjelaskan kebutuhan ke banyak pihak berbeda.',
      'Karena itu, ketika user mencari vendor kemeja custom, vendor seragam dinas, atau jasa pengadaan seragam kerja yang lebih terstruktur, Bradwear berusaha menghadirkan sistem layanan yang membuat keputusan lebih cepat, hasil lebih relevan, dan komunikasi tetap ringkas dari awal sampai akhir.',
    ],
    comments: [
      {
        id: 'comment-service-1',
        author: 'Ranti Febriani',
        role: 'Procurement perusahaan jasa',
        publishedAt: '2026-07-02',
        body: 'Penjelasan produk dan jasa seperti ini memudahkan kami membedakan mana item formal dan mana yang lebih cocok untuk operasional lapangan.',
      },
      {
        id: 'comment-service-2',
        author: 'Dimas Kurnia',
        role: 'Supervisor gudang',
        publishedAt: '2026-07-02',
        body: 'Bagian custom desain dan validasi spesifikasi sangat penting karena justru di situ biasanya banyak revisi terjadi saat order seragam kerja.',
      },
      {
        id: 'comment-service-3',
        author: 'Nur Aeni',
        role: 'Koordinator event kampus',
        publishedAt: '2026-07-02',
        body: 'Artikel ini terasa SEO-friendly tapi tetap enak dibaca karena menjelaskan layanan Bradwear dari sudut pandang kebutuhan tim, bukan promosi kosong.',
      },
    ],
  },
  {
    slug: 'keunggulan-bradwear-dalam-produksi-seragam-custom',
    category: 'Keunggulan',
    highlight: 'Keunggulan Bradwear dibangun dari bahan yang tepat, jahitan presisi, komunikasi cepat, dan custom yang tetap realistis untuk diproduksi.',
    highlights: ['Kualitas bahan dipilih dari fungsi pemakaian, bukan sekadar nama kain.', 'Jahitan presisi dan kontrol detail menjadi dasar hasil yang lebih rapi.', 'Custom dibuka luas tetapi tetap dijaga agar timeline dan biaya tetap masuk akal.'],
    coverImage: ARTICLE_IMAGE_FALLBACKS.formalUniform,
    coverAlt: 'Seragam formal Bradwear Indonesia untuk artikel keunggulan produksi',
    readTime: '8 menit',
    author: 'Tim Editorial Bradwear',
    authorRole: 'Kualitas produk dan workflow',
    publishedAt: '2026-07-02',
    updatedAt: '2026-07-02',
    title: 'Keunggulan Bradwear dalam produksi seragam custom untuk instansi dan perusahaan',
    excerpt: 'Keunggulan Bradwear hadir dari kombinasi kualitas bahan, standar jahit, layanan responsif, dan penyesuaian desain yang tetap terukur saat masuk produksi.',
    seoTitle: 'Keunggulan Bradwear dalam Produksi Seragam Custom',
    seoDescription: 'Pelajari keunggulan Bradwear Indonesia dalam produksi seragam custom: bahan berkualitas, jahitan presisi, harga kompetitif, dan layanan custom yang realistis.',
    keywords: ['keunggulan bradwear', 'seragam custom berkualitas', 'jahitan presisi seragam kerja', 'vendor seragam instansi terpercaya', 'harga seragam custom kompetitif', 'bordir logo rapi'],
    body: [
      'Saat memilih vendor seragam custom, banyak user melihat hasil akhir di foto tanpa sempat menilai apa yang membuat kualitas itu bisa konsisten. Di Bradwear, keunggulan justru dibangun dari beberapa lapisan kerja sekaligus: pemilihan bahan yang sesuai fungsi, standar jahit yang rapi, komunikasi yang cepat, dan kemampuan menerjemahkan custom secara realistis ke proses produksi.',
      'Bahan menjadi titik awal yang sangat menentukan. Untuk kebutuhan formal, Bradwear cenderung mengarahkan pelanggan ke opsi yang tampil rapi dan nyaman dipakai penuh seharian. Untuk kebutuhan lapangan atau operasional, tim akan mempertimbangkan material yang lebih kuat, lebih stabil, dan lebih sesuai dengan aktivitas kerja yang intens. Pendekatan ini membantu user menghindari keputusan bahan yang kelihatan bagus di awal tetapi tidak cocok saat dipakai harian.',
      'Keunggulan berikutnya ada pada detail pengerjaan. Jahitan yang presisi, proporsi pola yang pas, dan penempatan identitas yang konsisten membuat seragam terlihat lebih profesional saat dipakai oleh banyak orang sekaligus. Hal seperti ini sering tampak sederhana, tetapi justru menentukan apakah hasil akhirnya terasa premium atau terlihat seadanya.',
      'Di sisi layanan, Bradwear berusaha menjaga komunikasi tetap ringkas dan responsif. Tim membantu menyederhanakan pilihan yang terlalu banyak, mengarahkan model yang lebih masuk akal, lalu merangkum detail order agar approval berjalan lebih cepat. Ini penting karena banyak proyek seragam tertahan bukan di produksi, melainkan di fase diskusi yang terlalu berputar-putar.',
      'Custom juga menjadi bagian dari keunggulan Bradwear, tetapi dilakukan dengan disiplin. User tetap bisa menyesuaikan warna, model, bordir logo, nama personel, atau struktur item, namun setiap penyesuaian dievaluasi dari dampaknya terhadap kenyamanan, biaya, dan timeline. Pendekatan ini membuat hasil akhir tidak hanya unik, tetapi juga tetap realistis untuk diproduksi dengan rapi.',
      'Bila semua unsur itu berjalan bersama, keunggulan vendor tidak lagi sekadar slogan. Ia terasa pada kualitas bahan saat dipakai, pada kerapian seragam ketika dipresentasikan, dan pada ketenangan pelanggan ketika proses order berjalan jelas dari awal sampai pengiriman. Di titik inilah Bradwear ingin memberi nilai yang lebih dari sekadar produk jadi.',
    ],
    comments: [
      {
        id: 'comment-advantage-1',
        author: 'Andi Kusuma',
        role: 'Manager operasional',
        publishedAt: '2026-07-02',
        body: 'Pembahasan keunggulan di artikel ini terasa lebih meyakinkan karena menjelaskan kaitan antara bahan, jahitan, dan komunikasi proyek secara utuh.',
      },
      {
        id: 'comment-advantage-2',
        author: 'Sari Melinda',
        role: 'PIC pengadaan rumah sakit',
        publishedAt: '2026-07-02',
        body: 'Bagian custom yang tetap realistis sangat penting. Banyak vendor menawarkan fleksibilitas, tetapi tidak semua bisa menjaga hasil akhir tetap rapi saat produksi massal.',
      },
      {
        id: 'comment-advantage-3',
        author: 'Rizky Pranata',
        role: 'Koordinator lapangan',
        publishedAt: '2026-07-02',
        body: 'Konten seperti ini membantu kami menilai vendor seragam instansi dari kualitas proses, bukan hanya dari brosur atau feed media sosial.',
      },
    ],
  },
  {
    slug: 'klien-dan-jangkauan-layanan-seragam-bradwear',
    category: 'Jangkauan',
    highlight: 'Bradwear melayani berbagai sektor dari Tasikmalaya dengan alur konsultasi, produksi, dan pengiriman yang tetap sederhana untuk klien lintas daerah.',
    highlights: ['Klien datang dari pemerintahan, perusahaan, pendidikan, medis, dan komunitas.', 'Jangkauan layanan dibangun dari komunikasi yang rapi dan hasil yang konsisten.', 'Pengadaan lintas kota tetap bisa dijalankan dengan ringkasan spesifikasi yang jelas.'],
    coverImage: ARTICLE_IMAGE_FALLBACKS.procurementDesk,
    coverAlt: 'Ruang diskusi pengadaan untuk artikel klien dan jangkauan layanan Bradwear',
    readTime: '8 menit',
    author: 'Tim Editorial Bradwear',
    authorRole: 'Klien dan operasional layanan',
    publishedAt: '2026-07-02',
    updatedAt: '2026-07-02',
    title: 'Klien dan jangkauan layanan seragam Bradwear dari Tasikmalaya ke seluruh Indonesia',
    excerpt: 'Dari basis operasional di Tasikmalaya, Bradwear melayani instansi, perusahaan, sekolah, medis, dan komunitas dengan pola komunikasi yang dibuat tetap ringkas.',
    seoTitle: 'Klien dan Jangkauan Layanan Seragam Bradwear Indonesia',
    seoDescription: 'Lihat jangkauan layanan seragam Bradwear Indonesia untuk instansi, perusahaan, sekolah, rumah sakit, organisasi, dan komunitas di seluruh Indonesia.',
    keywords: ['jangkauan layanan bradwear', 'vendor seragam seluruh indonesia', 'seragam custom tasikmalaya', 'klien bradwear indonesia', 'pengadaan seragam instansi nasional', 'vendor kemeja dinas jawa barat'],
    body: [
      'Jangkauan layanan Bradwear tidak dibangun dari iklan besar semata, tetapi dari proyek yang datang berulang karena hasil dan komunikasinya dinilai memuaskan. Dari Tasikmalaya, Bradwear melayani kebutuhan seragam untuk instansi pemerintahan, perusahaan swasta, sekolah, rumah sakit, organisasi, hingga komunitas yang tersebar di berbagai daerah.',
      'Setiap sektor datang dengan kebutuhannya sendiri. Instansi cenderung membutuhkan struktur identitas yang rapi dan mudah dipertanggungjawabkan. Perusahaan sering fokus pada citra profesional dan pembagian item per divisi. Sementara sekolah, komunitas, dan sektor medis membutuhkan pendekatan yang lebih spesifik pada fungsi pemakaian, kenyamanan, serta kejelasan visual identitas. Karena itu, jangkauan tidak hanya berarti luas secara wilayah, tetapi juga siap menangani banyak konteks kerja yang berbeda.',
      'Kunci agar layanan lintas daerah tetap berjalan baik adalah ringkasan spesifikasi yang jelas. Bradwear berusaha menyederhanakan brief pelanggan menjadi pilihan model, bahan, warna, dan detail identitas yang mudah ditinjau ulang. Dengan cara ini, klien dari luar kota tetap bisa mengambil keputusan tanpa harus kehilangan arah di tengah banyak revisi.',
      'Pada proyek seragam custom jarak jauh, komunikasi sering menjadi penentu utama. Jika jalur follow up tidak rapi, sample tidak jelas, atau detail order tersebar di banyak titik, pengadaan akan cepat melambat. Bradwear berusaha menjaga bagian ini tetap ringkas agar pelanggan dapat fokus pada keputusan penting, bukan sibuk mengulang data yang sama.',
      'Fakta bahwa basis operasional berada di Tasikmalaya justru memberi karakter tersendiri. Workshop dan koordinasi utama berada dekat dengan proses inti, sementara kanal digital digunakan untuk membuka akses konsultasi yang lebih luas. Kombinasi ini membantu Bradwear tetap lincah dalam koordinasi lokal sekaligus responsif terhadap kebutuhan klien dari kota lain.',
      'Karena itu, ketika perusahaan atau instansi mencari vendor seragam seluruh Indonesia yang tetap terasa personal dalam komunikasi, Bradwear ingin menjadi opsi yang kredibel. Bukan hanya karena sanggup mengirim hasil jadi, tetapi karena mampu menjaga kualitas proses sejak konsultasi pertama sampai seragam diterima tim pemesan.',
    ],
    comments: [
      {
        id: 'comment-reach-1',
        author: 'Mega Rahmawati',
        role: 'Admin procurement instansi pusat',
        publishedAt: '2026-07-02',
        body: 'Artikel ini membantu melihat bahwa jangkauan vendor tidak hanya soal bisa kirim ke luar kota, tetapi juga soal kemampuan merapikan komunikasi order.',
      },
      {
        id: 'comment-reach-2',
        author: 'Wahyu Setiadi',
        role: 'Kepala logistik perusahaan nasional',
        publishedAt: '2026-07-02',
        body: 'Bagian tentang spesifikasi dan follow up lintas daerah terasa sangat relevan untuk proyek seragam yang dikoordinasikan dari kantor pusat ke beberapa cabang.',
      },
      {
        id: 'comment-reach-3',
        author: 'Tia Novitasari',
        role: 'Koordinator sekolah swasta',
        publishedAt: '2026-07-02',
        body: 'Kontennya membantu memahami bagaimana vendor seragam custom dari Tasikmalaya tetap bisa melayani kebutuhan sekolah dan institusi di luar daerah dengan rapi.',
      },
    ],
  },
];

export const CUSTOMER_SERVICE_CONTACTS: CustomerServiceContact[] = [
  { id: 'gilang', name: 'Gilang', phone: '6282319226530', avatar: gilangAvatar, statusLabel: 'Online' },
  { id: 'elsha', name: 'Elsha', phone: '6285716486007', avatar: elshaAvatar, statusLabel: 'Online' },
  { id: 'bayu', name: 'Bayu', phone: '6287736834454', avatar: bayuAvatar, statusLabel: 'Online' },
  { id: 'nadhifa', name: 'Nadhifa', phone: '6282316067692', avatar: nadhifaAvatar, statusLabel: 'Online' },
  { id: 'risma', name: 'Risma', phone: '6282232133926', avatar: rismaAvatar, statusLabel: 'Online' },
  { id: 'ede', name: 'Ede', phone: '6285317159575', avatar: edeAvatar, statusLabel: 'Online' },
  { id: 'fikri', name: 'Fikri', phone: '6287788780188', avatar: fikriAvatar, statusLabel: 'Online' },
  { id: 'aris', name: 'Aris', phone: '6281295395823', avatar: arisAvatar, statusLabel: 'Online' },
  { id: 'ayang', name: 'Ayang', phone: '6285900067691', avatar: ayangAvatar, statusLabel: 'Online' },
  { id: 'ucu', name: 'Ucu', phone: '6281462327318', avatar: ucuAvatar, statusLabel: 'Online' },
];

// Sumber teks tahapan halaman Cara Order.
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
    heading: 'Kepemilikan dan pengelolaan',
    body: 'Owner sekaligus founder Bradwear adalah Gilang. Pengelolaan website Bradwear Indonesia ditangani oleh Maris Ibrahim untuk kebutuhan katalog, informasi layanan, dan pengalaman konsultasi digital.',
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
  'bradwearindonesia.com',
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
  'vendor kemeja kerja',
  'vendor seragam komunitas',
  'konveksi kemeja custom indonesia',
  'konveksi seragam dinas indonesia',
  'kemeja kostum custom',
  'kemeja komunitas custom',
  'seragam komunitas lapangan',
  'seragam kantor bordir logo',
  'seragam kerja perusahaan custom',
  'vendor baju dinas custom',
  'kemeja event perusahaan',
  'vendor seragam event komunitas',
  'konveksi seragam operasional',
  'seragam kantor tasikmalaya',
  'jasa bikin kemeja custom',
  'jasa bikin seragam dinas',
  'konveksi kemeja komunitas',
  'seragam custom jawa barat',
  'vendor seragam kerja tasikmalaya',
  'konveksi seragam perusahaan tasikmalaya',
  'bordir logo instansi pada kemeja dinas',
  'vendor celana tactical custom',
  'seragam lapangan untuk tim operasional',
  'vendor kemeja dinas tasikmalaya',
  'seragam kerja perusahaan jawa barat',
  'vendor pengadaan seragam instansi',
  'bordir nama dan logo kemeja kerja',
  'kemeja custom perusahaan tasikmalaya',
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
  [RouteKey.DOWNLOAD]: makeMeta(
    RouteKey.DOWNLOAD,
    'Akses Web Bradwear Indonesia | Katalog, Artikel, dan Konsultasi Cepat',
    'Gunakan halaman akses web Bradwear Indonesia untuk masuk ke katalog, artikel, studio 3D, dan konsultasi seragam custom tanpa bergantung pada aplikasi mobile.',
    ['akses web bradwear', 'katalog web bradwear', 'seragam custom online', 'masuk katalog bradwear', 'konsultasi seragam bradwear']
  ),
  [RouteKey.CLIENT]: makeMeta(
    RouteKey.CLIENT,
    'Portofolio Kemeja Custom dan Seragam Dinas | Bradwear Indonesia',
    'Lihat portofolio hasil produksi kemeja custom, kemeja dinas, dan seragam kerja Bradwear Indonesia untuk kebutuhan instansi, medis, operasional, kejaksaan, dan pemerintah daerah.',
    ['client gallery', 'portofolio bradwear', 'hasil jadi seragam', 'portofolio seragam custom', 'dokumentasi klien', 'hasil jadi kemeja dinas', 'galeri kemeja custom']
  ),
  [RouteKey.TESTIMONI]: makeMeta(
    RouteKey.TESTIMONI,
    'Testimoni Klien Seragam Custom dan Kemeja Dinas | Bradwear Indonesia',
    'Baca testimoni klien Bradwear Indonesia dari instansi, perusahaan, pendidikan, dan layanan operasional yang mempercayakan produksi seragam custom kepada tim kami.',
    ['testimoni klien bradwear', 'review seragam custom', 'kepuasan klien seragam', 'ulasan vendor seragam', 'testimoni kemeja dinas']
  ),
  [RouteKey.ABOUT]: makeMeta(
    RouteKey.ABOUT,
    'Tentang Bradwear Indonesia | Konveksi Kemeja Custom dan Seragam Dinas',
    'Kenali profil resmi CV. ASTHAJAYA BRADERINDO sebagai perusahaan konveksi seragam dinas berizin resmi dengan brand BRADWEAR yang terdaftar di DJKI KEMENKUMHAM.',
    ['tentang bradwear', 'profil cv asthajaya braderindo', 'brand bradwear', 'vendor seragam instansi', 'konveksi seragam dinas resmi']
  ),
  [RouteKey.VISION_MISSION]: makeMeta(
    RouteKey.VISION_MISSION,
    'Visi dan Misi Bradwear Indonesia | Kualitas, Ketepatan, dan Layanan',
    'Lihat visi dan misi Bradwear Indonesia dalam membangun kualitas seragam custom, ketepatan produksi, dan layanan konsultasi yang lebih jelas untuk pelanggan.',
    ['visi misi bradwear', 'visi konveksi seragam', 'misi vendor kemeja custom', 'kualitas seragam kerja']
  ),
  [RouteKey.PRODUCTS_SERVICES]: makeMeta(
    RouteKey.PRODUCTS_SERVICES,
    'Produk dan Jasa Bradwear | Kemeja Dinas, Jaket, Rompi, Polo, dan Celana Custom',
    'Pelajari produk dan jasa resmi Bradwear mulai dari seragam dinas pemerintah, seragam kerja perusahaan, seragam medis, seragam sekolah kedinasan, organisasi, komunitas, wearpack, hingga custom bordir logo.',
    ['produk bradwear', 'jasa konveksi seragam', 'seragam dinas pemerintah', 'jasa bordir logo instansi', 'wearpack custom']
  ),
  [RouteKey.COMPETITIVE_ADVANTAGE]: makeMeta(
    RouteKey.COMPETITIVE_ADVANTAGE,
    'Keunggulan Bradwear Indonesia | Bahan Tepat, Jahitan Rapi, dan Alur Order Jelas',
    'Keunggulan Bradwear Indonesia terletak pada kualitas bahan terbaik, jahitan presisi, harga kompetitif, dan layanan custom desain untuk kebutuhan instansi maupun perusahaan.',
    ['keunggulan bradwear', 'kualitas bahan seragam', 'jahitan seragam rapi', 'vendor seragam berkualitas']
  ),
  [RouteKey.CLIENT_REACH]: makeMeta(
    RouteKey.CLIENT_REACH,
    'Klien dan Jangkauan Bradwear | Workshop Tasikmalaya dan Pengiriman Seluruh Indonesia',
    'Bradwear Indonesia telah dipercaya oleh instansi pemerintah daerah, perusahaan swasta nasional, rumah sakit, sekolah, universitas, dan organisasi kemasyarakatan dengan jangkauan layanan ke seluruh Indonesia.',
    ['klien bradwear', 'jangkauan pengiriman seragam', 'workshop tasikmalaya', 'vendor seragam seluruh indonesia']
  ),
  [RouteKey.LEGAL_LICENSE]: makeMeta(
    RouteKey.LEGAL_LICENSE,
    'Legalitas dan Lisensi Bradwear Indonesia | Informasi Administrasi dan Kerja Sama',
    'Informasi legalitas resmi CV. ASTHAJAYA BRADERINDO, status brand BRADWEAR yang terdaftar di DJKI KEMENKUMHAM, serta kontak perusahaan untuk kebutuhan administrasi dan kerja sama.',
    ['legalitas bradwear', 'cv asthajaya braderindo', 'administrasi pengadaan seragam', 'djkikemenkumham bradwear']
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
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const buildWhatsAppUrlForPhone = (phone: string, message: string) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

export const buildConsultationMessage = (subject?: string) => {
  const topic = subject?.trim() ? subject.trim() : 'kebutuhan seragam custom';
  return `Halo tim Bradwear Indonesia, saya konsumen dari website Bradwear dan ingin berkonsultasi mengenai ${topic}. Mohon bantuannya untuk informasi model, bahan, estimasi produksi, dan langkah order berikutnya. Terima kasih.`;
};

export const buildCustomerServiceMessage = (subject?: string) => {
  const topic = subject?.trim() ? subject.trim() : 'kebutuhan seragam custom';
  return `hallo saya pengunjung website bradwear mau tanya seputar ${topic}`;
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

const slugifyPathToken = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const CATALOG_GUIDE_PATHS = {
  size: `${ROUTE_PATHS[RouteKey.KATALOG]}/panduan-ukuran`,
  material: `${ROUTE_PATHS[RouteKey.KATALOG]}/panduan-jenis-bahan`,
} as const;

export type CatalogGuideKey = keyof typeof CATALOG_GUIDE_PATHS;

const CATALOG_PRODUCT_PATH_PREFIX = `${ROUTE_PATHS[RouteKey.KATALOG]}/model/`;

export const buildCatalogProductSlug = (product: Pick<Product, 'category' | 'name'>) =>
  `${slugifyPathToken(product.category)}-${slugifyPathToken(product.name)}`;

export const getCatalogProductPath = (product: Pick<Product, 'category' | 'name'> | string) => {
  const slug = typeof product === 'string' ? product : buildCatalogProductSlug(product);
  return `${CATALOG_PRODUCT_PATH_PREFIX}${slug}`;
};

export const getCatalogGuideFromPathname = (pathname: string): CatalogGuideKey | null => {
  const normalized = normalizePathname(pathname.toLowerCase());
  const match = Object.entries(CATALOG_GUIDE_PATHS).find(([, path]) => path.toLowerCase() === normalized);
  return (match?.[0] as CatalogGuideKey) ?? null;
};

export const getCatalogProductSlugFromPathname = (pathname: string) => {
  const normalized = normalizePathname(pathname.toLowerCase());
  if (!normalized.startsWith(CATALOG_PRODUCT_PATH_PREFIX)) return null;
  const slug = normalized.slice(CATALOG_PRODUCT_PATH_PREFIX.length).trim();
  return slug || null;
};

export const getArticlePath = (slug: string) => `${ROUTE_PATHS[RouteKey.ARTIKEL]}/${slug}`;

export const getArticleSlugFromPathname = (pathname: string) => {
  const normalized = normalizePathname(pathname.toLowerCase());
  if (!normalized.startsWith(`${ROUTE_PATHS[RouteKey.ARTIKEL]}/`)) return null;
  const slug = normalized.slice(`${ROUTE_PATHS[RouteKey.ARTIKEL]}/`.length).trim();
  return slug || null;
};

export const getArticleBySlug = (slug?: string | null) =>
  ARTICLES.find((article) => article.slug.toLowerCase() === (slug ?? '').toLowerCase()) ?? null;

export const pathToRoute = (pathname: string): RouteKey => {
  const normalized = normalizePathname(pathname.toLowerCase());
  if (normalized.startsWith(`${ROUTE_PATHS[RouteKey.ARTIKEL]}/`)) {
    return RouteKey.ARTIKEL;
  }
  if (normalized.startsWith(`${ROUTE_PATHS[RouteKey.KATALOG]}/`)) {
    return RouteKey.KATALOG;
  }
  const match = Object.entries(ROUTE_PATHS).find(([, routePath]) => routePath.toLowerCase() === normalized);
  return (match?.[0] as RouteKey) ?? RouteKey.HOME;
};

export const getConsultationTopicForPath = (route: RouteKey, pathname: string) => {
  const article = getArticleBySlug(getArticleSlugFromPathname(pathname));
  if (article) {
    return `artikel ${article.title.toLowerCase()}`;
  }

  const catalogGuide = getCatalogGuideFromPathname(pathname);
  if (catalogGuide === 'size') {
    return 'panduan ukuran seragam custom';
  }
  if (catalogGuide === 'material') {
    return 'panduan jenis bahan seragam custom';
  }

  const catalogProductSlug = getCatalogProductSlugFromPathname(pathname);
  if (catalogProductSlug) {
    return `model ${catalogProductSlug.replace(/-/g, ' ')}`;
  }

  const routeTopics: Record<RouteKey, string> = {
    [RouteKey.HOME]: 'kemeja custom dan seragam kerja',
    [RouteKey.THREE_D]: 'preview desain 3d seragam custom',
    [RouteKey.KATALOG]: 'katalog kemeja custom dan seragam dinas',
    [RouteKey.DOWNLOAD]: 'akses web katalog Bradwear',
    [RouteKey.CLIENT]: 'hasil jadi seragam dan referensi klien',
    [RouteKey.TESTIMONI]: 'testimoni klien dan kepuasan layanan seragam',
    [RouteKey.ABOUT]: 'profil dan layanan bradwear indonesia',
    [RouteKey.VISION_MISSION]: 'standar layanan dan kualitas bradwear',
    [RouteKey.PRODUCTS_SERVICES]: 'produk dan jasa seragam custom',
    [RouteKey.COMPETITIVE_ADVANTAGE]: 'keunggulan bahan dan jahitan seragam',
    [RouteKey.CLIENT_REACH]: 'jangkauan pengiriman seragam seluruh indonesia',
    [RouteKey.LEGAL_LICENSE]: 'legalitas dan kerja sama pengadaan',
    [RouteKey.PANTS]: 'celana tactical dan celana kerja custom',
    [RouteKey.ARTIKEL]: 'panduan bahan dan order seragam',
    [RouteKey.CARA_ORDER]: 'cara order seragam custom',
    [RouteKey.LAYANAN_PELANGGAN]: 'layanan pelanggan dan konsultasi order',
    [RouteKey.LACAK_PESANAN]: 'status order dan tracking pengiriman',
    [RouteKey.TEMUKAN_TOKO]: 'alamat workshop dan konsultasi lokasi',
    [RouteKey.BRAD_AI]: 'konsultasi awal bersama brodi',
    [RouteKey.EDITOR]: 'desain seragam custom',
    [RouteKey.SUMMARY]: 'ringkasan pesanan seragam',
  };

  return routeTopics[route] ?? 'kebutuhan seragam custom';
};

export const isPublicRoute = (route: RouteKey) => PUBLIC_ROUTES.has(route);
