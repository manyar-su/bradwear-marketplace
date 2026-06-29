import {
  Article,
  BradAiContextSection,
  ContactChannel,
  CourierProvider,
  CustomerServiceContact,
  HowToOrderStep,
  NavItem,
  RouteKey,
  SeoMeta,
  SiteFaqItem,
} from '../types';

const arisAvatar = new URL('../assets/CSavatar/aris.svg', import.meta.url).href;
const ayangAvatar = new URL('../assets/CSavatar/ayang.svg', import.meta.url).href;
const bayuAvatar = new URL('../assets/CSavatar/bayu.png', import.meta.url).href;
const edeAvatar = new URL('../assets/CSavatar/ede.png', import.meta.url).href;
const elshaAvatar = new URL('../assets/CSavatar/elsha.svg', import.meta.url).href;
const fikriAvatar = new URL('../assets/CSavatar/fikri.png', import.meta.url).href;
const gilangAvatar = new URL('../assets/CSavatar/gilang.png', import.meta.url).href;
const nadhifaAvatar = new URL('../assets/CSavatar/nadhifa.png', import.meta.url).href;
const rismaAvatar = new URL('../assets/CSavatar/risma.svg', import.meta.url).href;
const ucuAvatar = new URL('../assets/CSavatar/ucu.png', import.meta.url).href;

export const SITE_URL = 'https://www.bradwearindonesia.com';
export const SITE_NAME = 'Bradwear Indonesia';
export const SITE_TAGLINE = 'Konveksi kemeja custom, kemeja dinas, dan seragam kerja untuk instansi, perusahaan, dan komunitas di seluruh Indonesia.';
export const WHATSAPP_NUMBER = '6287736834454';
export const GOOGLE_PLAY_URL = '';
export const STORE_ADDRESS = 'Karisma Residence, Blok C.46, RT.008/RW.003, Margajaya, Kec. Mangunreja, Kabupaten Tasikmalaya, Jawa Barat 46462';
export const STORE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`;

export const ROUTE_PATHS: Record<RouteKey, string> = {
  [RouteKey.HOME]: '/',
  [RouteKey.THREE_D]: '/3d',
  [RouteKey.KATALOG]: '/katalog',
  [RouteKey.DOWNLOAD]: '/download',
  [RouteKey.CLIENT]: '/client',
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
  { label: 'Download', route: RouteKey.DOWNLOAD, description: 'Halaman download aplikasi Android dan akses cepat Bradwear.' },
  { label: 'Galeri Klien', route: RouteKey.CLIENT, description: 'Galeri hasil jadi dan dokumentasi klien Bradwear Indonesia.' },
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
  [RouteKey.CLIENT]: 'Beranda / Galeri Klien',
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

// Sumber teks halaman artikel publik.
export const ARTICLES: Article[] = [
  {
    slug: 'panduan-memilih-bahan-seragam',
    category: 'Bahan',
    readTime: '5 menit',
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
      'Bradwear membantu pelanggan mencocokkan bahan, warna, dan model sebelum masuk tahap produksi agar hasil akhir tetap nyaman sekaligus profesional.',
    ],
    comments: [
      {
        id: 'comment-bahan-1',
        author: 'Rudi Pratama',
        role: 'PIC procurement sekolah swasta',
        publishedAt: '2026-06-08',
        body: 'Penjelasan bahan seperti ini membantu saat kami harus memilih antara kain yang adem untuk harian dan opsi yang lebih kokoh untuk kegiatan lapangan.',
      },
    ],
  },
  {
    slug: 'beda-pdh-pdl-dan-lapangan',
    category: 'Model',
    readTime: '4 menit',
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
      'Saat konsultasi, jelaskan konteks penggunaan seragam: di kantor, perjalanan dinas, kegiatan teknis, atau operasional lapangan. Informasi ini akan mempermudah penentuan model terbaik.',
    ],
    comments: [
      {
        id: 'comment-model-1',
        author: 'Fajar Nugraha',
        role: 'Koordinator lapangan komunitas',
        publishedAt: '2026-06-07',
        body: 'Bagian pembeda fungsi PDH dan PDL paling membantu karena tim kami sering menyamakan dua kebutuhan yang sebenarnya berbeda.',
      },
    ],
  },
  {
    slug: 'tips-order-seragam-instansi',
    category: 'Pemesanan',
    readTime: '6 menit',
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
    ],
    comments: [
      {
        id: 'comment-order-1',
        author: 'Laras Widuri',
        role: 'Admin pengadaan perusahaan',
        publishedAt: '2026-06-11',
        body: 'Tips menunjuk satu PIC internal benar-benar relevan. Setelah kami pakai cara itu, revisi desain jauh lebih cepat.',
      },
    ],
  },
  {
    slug: 'checklist-sebelum-produksi',
    category: 'Checklist',
    readTime: '4 menit',
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
    ],
    comments: [
      {
        id: 'comment-checklist-1',
        author: 'Meysa Putri',
        role: 'Sekretariat organisasi daerah',
        publishedAt: '2026-06-14',
        body: 'Checklist ini cocok dijadikan daftar final sebelum kami kirim data bordir nama dan alamat penerima ke vendor.',
      },
    ],
  },
  {
    slug: 'kemeja-custom-untuk-perusahaan-dan-komunitas',
    category: 'Kemeja Custom',
    readTime: '7 menit',
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
    ],
    comments: [
      {
        id: 'comment-kemeja-custom-1',
        author: 'Dian Kurnia',
        role: 'Ketua komunitas otomotif',
        publishedAt: '2026-06-17',
        body: 'Poin tentang fungsi pemakaian sangat kena. Untuk komunitas, beda kebutuhan touring dan kebutuhan event memang berpengaruh ke pilihan model.',
      },
    ],
  },
  {
    slug: 'seragam-dinas-dan-komunitas-pilih-model-yang-tepat',
    category: 'Seragam Dinas',
    readTime: '6 menit',
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
    ],
    comments: [
      {
        id: 'comment-seragam-dinas-1',
        author: 'Nur Aini',
        role: 'Staf administrasi instansi',
        publishedAt: '2026-06-20',
        body: 'Artikel ini memudahkan kami membedakan model untuk kebutuhan formal kantor dan kebutuhan lapangan yang lebih aktif.',
      },
    ],
  },
  {
    slug: 'vendor-seragam-dinas-untuk-pengadaan-instansi',
    category: 'Pengadaan',
    readTime: '6 menit',
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
    ],
    comments: [
      {
        id: 'comment-vendor-1',
        author: 'Agus Firmansyah',
        role: 'Tim pengadaan lembaga pendidikan',
        publishedAt: '2026-06-22',
        body: 'Konten seperti ini berguna untuk menyusun brief awal sebelum kami meminta penawaran ke beberapa vendor seragam dinas.',
      },
    ],
  },
  {
    slug: 'seragam-komunitas-dan-event-agar-branding-lebih-rapi',
    category: 'Komunitas',
    readTime: '5 menit',
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
    ],
    comments: [
      {
        id: 'comment-komunitas-1',
        author: 'Aldo Saputra',
        role: 'Panitia event komunitas daerah',
        publishedAt: '2026-06-24',
        body: 'Kami sering fokus ke desain depan saja. Artikel ini mengingatkan bahwa pembagian item per divisi juga harus dihitung dari awal.',
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
    'Download Aplikasi Bradwear Indonesia | Android, Play Store, dan Konsultasi Cepat',
    'Akses halaman download aplikasi Bradwear Indonesia untuk Android, informasi Play Store, konsultasi cepat WhatsApp, dan jalur masuk paling ringkas ke katalog serta artikel seragam custom.',
    ['download aplikasi bradwear', 'bradwear android', 'google play bradwear', 'download app seragam custom', 'aplikasi bradwear indonesia']
  ),
  [RouteKey.CLIENT]: makeMeta(
    RouteKey.CLIENT,
    'Galeri Klien Kemeja Custom dan Seragam Dinas | Bradwear Indonesia',
    'Lihat dokumentasi hasil produksi kemeja custom, kemeja dinas, dan seragam kerja Bradwear Indonesia untuk kebutuhan instansi, medis, operasional, kejaksaan, dan pemerintah daerah.',
    ['client gallery', 'galeri klien bradwear', 'hasil jadi seragam', 'portofolio seragam custom', 'dokumentasi klien', 'hasil jadi kemeja dinas', 'galeri kemeja custom']
  ),
  [RouteKey.ABOUT]: makeMeta(
    RouteKey.ABOUT,
    'Tentang Bradwear Indonesia | Konveksi Kemeja Custom dan Seragam Dinas',
    'Kenali profil Bradwear Indonesia sebagai konveksi kemeja custom, kemeja dinas, dan seragam kerja untuk instansi, perusahaan, sekolah, dan komunitas di seluruh Indonesia.',
    ['tentang bradwear', 'profil bradwear indonesia', 'konveksi kemeja custom indonesia', 'vendor seragam instansi', 'tentang konveksi seragam']
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
    'Pelajari produk dan jasa Bradwear Indonesia mulai dari kemeja dinas, jaket, rompi, polo shirt, celana tactical, sampai layanan custom bordir dan identitas personel.',
    ['produk bradwear', 'jasa konveksi seragam', 'kemeja dinas custom', 'jasa bordir logo instansi', 'produk seragam kerja']
  ),
  [RouteKey.COMPETITIVE_ADVANTAGE]: makeMeta(
    RouteKey.COMPETITIVE_ADVANTAGE,
    'Keunggulan Bradwear Indonesia | Bahan Tepat, Jahitan Rapi, dan Alur Order Jelas',
    'Keunggulan Bradwear Indonesia ada pada pemilihan bahan yang sesuai fungsi, jahitan rapi, kontrol detail, dan alur order yang membantu approval lebih cepat.',
    ['keunggulan bradwear', 'kualitas kemeja custom', 'jahitan seragam rapi', 'vendor seragam berkualitas']
  ),
  [RouteKey.CLIENT_REACH]: makeMeta(
    RouteKey.CLIENT_REACH,
    'Klien dan Jangkauan Bradwear | Workshop Tasikmalaya dan Pengiriman Seluruh Indonesia',
    'Bradwear Indonesia melayani berbagai instansi, perusahaan, dan komunitas dengan basis workshop di Tasikmalaya serta pengiriman seragam custom ke seluruh Indonesia.',
    ['klien bradwear', 'jangkauan pengiriman seragam', 'workshop tasikmalaya', 'vendor seragam seluruh indonesia']
  ),
  [RouteKey.LEGAL_LICENSE]: makeMeta(
    RouteKey.LEGAL_LICENSE,
    'Legalitas dan Lisensi Bradwear Indonesia | Informasi Administrasi dan Kerja Sama',
    'Informasi legalitas, lisensi, dan kebutuhan administrasi pengadaan Bradwear Indonesia untuk kerja sama seragam custom instansi dan perusahaan.',
    ['legalitas bradwear', 'lisensi hukum konveksi', 'administrasi pengadaan seragam', 'syarat kerja sama seragam']
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
  const match = Object.entries(ROUTE_PATHS).find(([, routePath]) => routePath.toLowerCase() === normalized);
  return (match?.[0] as RouteKey) ?? RouteKey.HOME;
};

export const getConsultationTopicForPath = (route: RouteKey, pathname: string) => {
  const article = getArticleBySlug(getArticleSlugFromPathname(pathname));
  if (article) {
    return `artikel ${article.title.toLowerCase()}`;
  }

  const routeTopics: Record<RouteKey, string> = {
    [RouteKey.HOME]: 'kemeja custom dan seragam kerja',
    [RouteKey.THREE_D]: 'preview desain 3d seragam custom',
    [RouteKey.KATALOG]: 'katalog kemeja custom dan seragam dinas',
    [RouteKey.DOWNLOAD]: 'download aplikasi android bradwear',
    [RouteKey.CLIENT]: 'hasil jadi seragam dan referensi klien',
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
