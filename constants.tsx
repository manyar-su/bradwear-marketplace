
import { Product, WorkflowStage } from './types';
import { ASSETS } from './assets';

const getRandomSold = () => Math.floor(Math.random() * (4500 - 2000 + 1)) + 2000;

export const PRODUCTS: Product[] = [
  {
    id: 'k2',
    name: 'Brad-v1',
    category: 'Kemeja',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.BRAD_V1.FRONT,
    images: {
      front: ASSETS.KEMEJA.BRAD_V1.FRONT,
      back: ASSETS.KEMEJA.BRAD_V1.BACK,
      leftSleeve: ASSETS.KEMEJA.BRAD_V1.FRONT,
      rightSleeve: ASSETS.KEMEJA.BRAD_V1.FRONT
    },
    gallery: ASSETS.KEMEJA.BRAD_V1.GALLERY,
    description: 'Seri Brad-V1: Keseimbangan sempurna antara gaya kantor dan fungsionalitas taktis.'
  },
  {
    id: 'k3',
    name: 'Brad-v2',
    category: 'Kemeja',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.BRAD_V2.FRONT,
    images: {
      front: ASSETS.KEMEJA.BRAD_V2.FRONT,
      back: ASSETS.KEMEJA.BRAD_V2.BACK,
      leftSleeve: ASSETS.KEMEJA.BRAD_V2.FRONT,
      rightSleeve: ASSETS.KEMEJA.BRAD_V2.FRONT
    },
    gallery: ASSETS.KEMEJA.BRAD_V2.GALLERY,
    description: 'Seri Brad-V2 dengan potongan modern dan material premium.'
  },
  {
    id: 'k1',
    name: 'Brad-V3',
    category: 'Kemeja',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.BRAD_V3.FRONT,
    images: {
      front: ASSETS.KEMEJA.BRAD_V3.FRONT,
      back: ASSETS.KEMEJA.BRAD_V3.BACK,
      leftSleeve: ASSETS.KEMEJA.BRAD_V3.FRONT,
      rightSleeve: ASSETS.KEMEJA.BRAD_V3.FRONT
    },
    gallery: ASSETS.KEMEJA.BRAD_V3.GALLERY,
    description: 'Seri Brad-V3 dengan material Ripstop Tornado premium dan ventilasi udara punggung.'
  },
  {
    id: 'k11',
    name: 'Yoroi',
    category: 'Kemeja',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.YOROI.FRONT,
    images: {
      front: ASSETS.KEMEJA.YOROI.FRONT,
      back: ASSETS.KEMEJA.YOROI.BACK,
      leftSleeve: ASSETS.KEMEJA.YOROI.FRONT,
      rightSleeve: ASSETS.KEMEJA.YOROI.FRONT
    },
    gallery: ASSETS.KEMEJA.YOROI.GALLERY,
    description: 'Seri Yoroi: Desain tactical tangguh dengan pilihan berbagai variasi warna.'
  },
  {
    id: 'k5',
    name: 'Brad-V4',
    category: 'Kemeja',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.BRAD_V4.FRONT,
    images: {
      front: ASSETS.KEMEJA.BRAD_V4.FRONT,
      back: ASSETS.KEMEJA.BRAD_V4.BACK,
      leftSleeve: ASSETS.KEMEJA.BRAD_V4.FRONT,
      rightSleeve: ASSETS.KEMEJA.BRAD_V4.FRONT
    },
    gallery: ASSETS.KEMEJA.BRAD_V4.GALLERY,
    description: 'Seri Brad-V4: Standar baru untuk seragam tangguh dengan desain kantong terbaru.'
  },
  {
    id: 'k6',
    name: 'Ventura',
    category: 'Kemeja',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.VENTURA.FRONT,
    images: {
      front: ASSETS.KEMEJA.VENTURA.FRONT,
      back: ASSETS.KEMEJA.VENTURA.BACK,
      leftSleeve: ASSETS.KEMEJA.VENTURA.FRONT,
      rightSleeve: ASSETS.KEMEJA.VENTURA.FRONT
    },
    gallery: ASSETS.KEMEJA.VENTURA.GALLERY,
    description: 'Seri Ventura dengan desain sleek dan minimalis.'
  },
  {
    id: 'k8',
    name: 'PDH',
    category: 'Kemeja',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.PDH.FRONT,
    images: {
      front: ASSETS.KEMEJA.PDH.FRONT,
      back: ASSETS.KEMEJA.PDH.BACK,
      leftSleeve: ASSETS.KEMEJA.PDH.FRONT,
      rightSleeve: ASSETS.KEMEJA.PDH.FRONT
    },
    gallery: ASSETS.KEMEJA.PDH.GALLERY,
    description: 'Pakaian Dinas Harian (PDH) klasik dengan kenyamanan katun drill.'
  },
  {
    id: 'k10',
    name: 'Strazard',
    category: 'Kemeja',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.STRAZAR.DISPLAY,
    images: {
      front: ASSETS.KEMEJA.STRAZAR.FRONT,
      back: ASSETS.KEMEJA.STRAZAR.BACK,
      leftSleeve: ASSETS.KEMEJA.STRAZAR.FRONT,
      rightSleeve: ASSETS.KEMEJA.STRAZAR.FRONT
    },
    gallery: ASSETS.KEMEJA.STRAZAR.GALLERY,
    description: 'Strazard: Kemeja premium dengan standar kualitas ekspor.'
  },
  {
    id: 'j1',
    name: 'Jacket',
    category: 'Jaket',
    soldCount: getRandomSold(),
    image: ASSETS.JAKET.BOMBER,
    images: {
      front: ASSETS.JAKET.BOMBER,
      back: ASSETS.JAKET.BACK,
      leftSleeve: ASSETS.JAKET.BOMBER,
      rightSleeve: ASSETS.JAKET.BOMBER
    },
    gallery: ASSETS.JAKET.GALLERY,
    description: 'Jaket Bomber premium industri dengan pilihan warna lengkap.'
  },
  {
    id: 'k12',
    name: 'Executive Series',
    category: 'Kemeja',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.EXECUTIVE.FRONT,
    images: {
      front: ASSETS.KEMEJA.EXECUTIVE.FRONT,
      back: ASSETS.KEMEJA.EXECUTIVE.BACK,
      leftSleeve: ASSETS.KEMEJA.EXECUTIVE.FRONT,
      rightSleeve: ASSETS.KEMEJA.EXECUTIVE.FRONT
    },
    gallery: ASSETS.KEMEJA.EXECUTIVE.GALLERY,
    description: 'Executive Series: Seri kemeja formal tactical dengan material premium dan desain elegan.'
  },
  {
    id: 'r1',
    name: 'Tactical Vest',
    category: 'Rompi',
    soldCount: getRandomSold(),
    image: ASSETS.ROMPI.TACTICAL,
    images: {
      front: ASSETS.ROMPI.TACTICAL,
      back: ASSETS.ROMPI.BACK,
      leftSleeve: ASSETS.ROMPI.TACTICAL,
      rightSleeve: ASSETS.ROMPI.TACTICAL
    },
    gallery: ASSETS.ROMPI.GALLERY,
    description: 'Vest tactical kualitas premium.'
  },
  {
    id: 'r2',
    name: 'Vest Parasute',
    category: 'Rompi',
    soldCount: getRandomSold(),
    image: ASSETS.ROMPI.PARASUTE,
    images: {
      front: ASSETS.ROMPI.PARASUTE,
      back: ASSETS.ROMPI.PARASUTE_BACK,
      leftSleeve: ASSETS.ROMPI.PARASUTE,
      rightSleeve: ASSETS.ROMPI.PARASUTE
    },
    gallery: ASSETS.ROMPI.PARASUTE_GALLERY,
    description: 'Vest parasut ringan dengan desain modern.'
  },
  {
    id: 'c1',
    name: 'Warrior',
    category: 'Celana',
    soldCount: getRandomSold(),
    image: ASSETS.CELANA.WARRIOR,
    images: {
      front: ASSETS.CELANA.WARRIOR,
      back: ASSETS.CELANA.WARRIOR_BACK || ASSETS.CELANA.WARRIOR
    },
    gallery: ASSETS.CELANA.GALLERY,
    description: 'Celana Warrior: Desain tactical tangguh untuk aktivitas outdoor berat.'
  },
  {
    id: 'c2',
    name: 'Armour',
    category: 'Celana',
    soldCount: getRandomSold(),
    image: ASSETS.CELANA.ARMOUR,
    images: {
      front: ASSETS.CELANA.ARMOUR,
      back: ASSETS.CELANA.ARMOUR_BACK || ASSETS.CELANA.ARMOUR
    },
    description: 'Celana Armour: Perlindungan maksimal dengan material durabilitas tinggi.'
  },
  {
    id: 'c3',
    name: 'Bradwear V3',
    category: 'Celana',
    soldCount: getRandomSold(),
    image: ASSETS.CELANA.BRADWEAR_V3,
    images: {
      front: ASSETS.CELANA.BRADWEAR_V3,
      back: ASSETS.CELANA.BRADWEAR_V3_BACK || ASSETS.CELANA.BRADWEAR_V3
    },
    description: 'Celana Bradwear V3: Desain fungsional dengan kenyamanan maksimal.'
  },
  {
    id: 'c4',
    name: 'Bradwear V1',
    category: 'Celana',
    soldCount: getRandomSold(),
    image: ASSETS.CELANA.BRADWEAR_V1,
    images: {
      front: ASSETS.CELANA.BRADWEAR_V1,
      back: ASSETS.CELANA.BRADWEAR_V1_BACK || ASSETS.CELANA.BRADWEAR_V1
    },
    gallery: ASSETS.CELANA.BRADWEAR_V1_GALLERY,
    description: 'Seri Bradwear-V1: Celana tactical tangguh dengan pilihan berbagai variasi warna.'
  },
  {
    id: 'p1',
    name: '(Polo Shirt)',
    category: 'Polo',
    soldCount: getRandomSold(),
    image: ASSETS.POLO.BASIC,
    images: {
      front: ASSETS.POLO.BASIC,
      back: ASSETS.POLO.BACK
    },
    gallery: ASSETS.POLO.GALLERY,
    description: 'Kaos polo premium untuk seragam santai namun tetap profesional.'
  }
];

export const INITIAL_WORKFLOW_STAGES: WorkflowStage[] = [
  { id: '1', label: 'Desain', status: 'completed', description: 'Mockup sedang dibuat oleh pemesan' },
  { id: '2', label: 'Persetujuan', status: 'completed', description: 'Detail pesanan disetujui admin' },
  { id: '3', label: 'Pemotongan', status: 'pending', description: 'Bahan sedang dipotong sesuai pola' },
  { id: '4', label: 'Penjahitan', status: 'pending', description: 'Proses perakitan dan jahit' },
  { id: '5', label: 'QC & Packing', status: 'pending', description: 'Pemeriksaan kualitas dan pengemasan' },
  { id: '6', label: 'Pengiriman', status: 'pending', description: 'Pesanan dikirim ke alamat tujuan' },
];

export const CLIENT_LOGOS = [
  { name: 'KEMENDAGRI', logo: ASSETS.PARTNERS[0] },
  { name: 'KEMENHAM', logo: ASSETS.PARTNERS[1] },
  { name: 'DPR RI', logo: ASSETS.PARTNERS[2] },
  { name: 'BMKG', logo: ASSETS.PARTNERS[3] },
  { name: 'BAPPENAS', logo: ASSETS.PARTNERS[4] },
  { name: 'KPI', logo: ASSETS.PARTNERS[5] },
  { name: 'BUMN', logo: ASSETS.PARTNERS[6] },
  { name: 'PUPR', logo: ASSETS.PARTNERS[7] },
  { name: 'KEMENHUB', logo: ASSETS.PARTNERS[8] },
  { name: 'KEMENPERIN', logo: ASSETS.PARTNERS[9] },
  { name: 'TUT WURI', logo: ASSETS.PARTNERS[10] },
].filter((client) => client.logo);

export const TESTIMONIALS = [
  { name: 'Bp. Hendra', text: 'Kualitas jahitannya sangat rapi, benar-benar standar dinas.', agency: 'DISHUB', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
  { name: 'Ibu Siska', text: 'Proses kustomisasinya sangat mudah dan admin sangat responsif.', agency: 'KEMENKES', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face' },
  { name: 'Bripda Rizky', text: 'Bahan Ripstop-nya juara, sangat tangguh untuk lapangan.', agency: 'POLRI', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
  { name: 'Bp. Ahmad', text: 'Sudah langganan untuk seragam operasional, selalu puas dengan hasilnya.', agency: 'BASARNAS', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face' },
  { name: 'Ibu Maya', text: 'Material Nagata Drill-nya adem sekali, nyaman dipakai seharian di kantor.', agency: 'DINKES', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face' },
  { name: 'Bp. Toto', text: 'Pengerjaan bordir komputernya sangat detail dan presisi.', agency: 'SATPOL PP', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face' },
  { name: 'Serda Danu', text: 'Kemeja Tactical-nya kuat, cocok untuk medan berat.', agency: 'TNI AD', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
  { name: 'Ibu Rani', text: 'Warna kain tidak mudah pudar walau sudah sering dicuci.', agency: 'DAMKAR', avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&h=150&fit=crop&crop=face' },
  { name: 'Bp. Guntur', text: 'Solusi terbaik untuk seragam instansi skala besar.', agency: 'KEMENHUB', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face' },
  { name: 'Bp. Farhan', text: 'Pengiriman tepat waktu dan packing sangat aman.', agency: 'PLN', avatar: 'https://images.unsplash.com/photo-1556157382-97edd2f9e1c4?w=150&h=150&fit=crop&crop=face' }
];

export interface FaqItem {
  slug: string;
  category: 'Pemesanan' | 'Produksi' | 'Kustomisasi' | 'Pengiriman' | 'Pembayaran';
  q: string;
  a: string;
}

export const FAQS: FaqItem[] = [
  {
    slug: 'minimal-order',
    category: 'Pemesanan',
    q: 'Berapa minimal order di Bradwear?',
    a: 'Minimal pemesanan kustom adalah 12 pcs per model agar proses produksi dan quality control tetap optimal.',
  },
  {
    slug: 'custom-logo-instansi',
    category: 'Kustomisasi',
    q: 'Apakah bisa kustom logo instansi?',
    a: 'Bisa. Kami melayani bordir komputer dan penempatan logo sesuai guideline instansi Anda.',
  },
  {
    slug: 'estimasi-produksi',
    category: 'Produksi',
    q: 'Berapa lama proses produksi?',
    a: 'Estimasi produksi normal 14-21 hari kerja, disesuaikan dengan volume dan antrean aktif.',
  },
  {
    slug: 'revisi-desain',
    category: 'Kustomisasi',
    q: 'Apakah desain bisa direvisi sebelum produksi?',
    a: 'Bisa. Revisi dapat dilakukan pada tahap approval sebelum order masuk jadwal cutting.',
  },
  {
    slug: 'warna-kain-sesuai',
    category: 'Kustomisasi',
    q: 'Bagaimana memastikan warna kain sesuai kebutuhan?',
    a: 'Tim kami akan melakukan konfirmasi kode warna dan referensi material sebelum produksi dimulai.',
  },
  {
    slug: 'kombinasi-ukuran',
    category: 'Pemesanan',
    q: 'Apakah satu order boleh campur ukuran?',
    a: 'Boleh. Anda bisa mengisi kombinasi ukuran dalam satu model sesuai kebutuhan tim atau instansi.',
  },
  {
    slug: 'ukuran-kustom',
    category: 'Pemesanan',
    q: 'Apakah tersedia ukuran kustom di luar size chart?',
    a: 'Tersedia. Untuk kebutuhan khusus, Anda dapat input detail ukuran kustom saat checkout desain.',
  },
  {
    slug: 'material-tersedia',
    category: 'Produksi',
    q: 'Material apa saja yang paling sering digunakan?',
    a: 'Material favorit meliputi Tropical, Nagata Drill, American Drill, Ripstop, dan Oxford sesuai fungsi seragam.',
  },
  {
    slug: 'pembayaran-dp',
    category: 'Pembayaran',
    q: 'Apakah bisa sistem DP terlebih dahulu?',
    a: 'Bisa. Skema pembayaran akan diinformasikan admin sesuai nilai order dan timeline produksi.',
  },
  {
    slug: 'invoice-dokumen',
    category: 'Pembayaran',
    q: 'Apakah tersedia invoice resmi untuk instansi?',
    a: 'Ya, kami menyediakan invoice dan dokumen pendukung administrasi sesuai kebutuhan pemesanan.',
  },
  {
    slug: 'pengiriman-luar-kota',
    category: 'Pengiriman',
    q: 'Apakah melayani pengiriman luar kota?',
    a: 'Melayani pengiriman seluruh Indonesia melalui ekspedisi yang disepakati bersama.',
  },
  {
    slug: 'tracking-order',
    category: 'Pengiriman',
    q: 'Bagaimana cara melacak status pesanan?',
    a: 'Status dapat dipantau melalui update workflow produksi dan konfirmasi admin hingga tahap pengiriman.',
  },
  {
    slug: 'jadwal-prioritas',
    category: 'Produksi',
    q: 'Bisakah order diprioritaskan untuk kebutuhan event tertentu?',
    a: 'Bisa diajukan. Tim produksi akan mengevaluasi kapasitas agar jadwal event tetap bisa terkejar.',
  },
  {
    slug: 'quality-control',
    category: 'Produksi',
    q: 'Apakah ada quality control sebelum barang dikirim?',
    a: 'Ada. Semua produk melewati tahapan QC sebelum packing dan diserahkan ke ekspedisi.',
  },
];

export const RANDOM_ORDERS = Array.from({ length: 30 }, (_, i) => ({
  user: ['Andi', 'Budi', 'Chandra', 'Dedi', 'Eko', 'Fajar', 'Gani', 'Hendra', 'Ivan', 'Joko'][Math.floor(Math.random() * 10)] + " dari " + ['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Makassar'][Math.floor(Math.random() * 5)],
  product: ['Kemeja Tactical', 'Jaket Bomber', 'Rompi PDH', 'Celana Cargo'][Math.floor(Math.random() * 4)],
  qty: Math.floor(Math.random() * 50) + 12
}));

export const MATERIALS = [
  'TROPICAL',
  'NAGATA DRILL',
  'AMERICAN DRILL',
  'STF',
  'RIPSTOP PERNUSA',
  'OXFORD',
  'BABY CANVAS',
  'SOFT DENIM'
];

export const POLO_MATERIALS = [
  'PIQUE COTTON',
  'LACOSTE CVC',
  'PIQUE PE',
  'DRI-FIT',
  'WAFFLE KNIT',
  'VISCOSE'
];

export const MATERIAL_SPECS: Record<string, { title: string; desc: string; points?: string[] }> = {
  'TROPICAL': {
    title: 'TROPICAL',
    desc: 'Bahan tropical adalah jenis kain yang sering digunakan untuk pakaian, terutama di daerah beriklim panas karena sifatnya yang ringan, adem, dan nyaman dipakai.',
    points: ['Ringan dan Adem', 'Serat Halus dan Lembut', 'Warna Tahan Lama', 'Rapi dan mudah distrika serta perawatannya mudah']
  },
  'BABY CANVAS': {
    title: 'BABY CANVAS',
    desc: 'Bahan baby canvas adalah jenis kain kanvas yang lebih tipis dan lembut dibandingkan kain kanvas pada umumnya. Kain ini terbuat dari serat katun murni.',
    points: ['Karakteristiknya yang ringan', 'Sangat lembut dan permukaannya sedikit berbulu', 'Handfeel permukaannya sangat nyaman disentuh', 'Populer untuk berbagai produk fashion']
  },
  'RIPSTOP PERNUSA': {
    title: 'RIPSTOP PERNUSA',
    desc: 'Ripstop adalah jenis teknik penenunan kain, khususnya nilon, yang diperkuat dengan pola kotak-kotak untuk meningkatkan ketahanan terhadap robekan dan tusukan.',
    points: ['Tidak kasar, dan tidak terlalu panas', 'Tahan Robek dan Tusukan', 'Ringan dan Kuat', 'Tahan Lama tidak mudah pudar']
  },
  'NAGATA DRILL': {
    title: 'NAGATA DRILL',
    desc: 'Bahan Nagata Drill terbuat dari campuran serat katun dan polyester (dominasi katun). Kain lebih tebal dan warna lebih mengkilat.',
    points: ['Serat permukaan lebih besar dari American Drill', 'Kain lebih kuat tapi lebih lembut']
  },
  'SOFT DENIM': {
    title: 'SOFT DENIM',
    desc: 'Soft jeans adalah jenis denim yang didesain khusus untuk memberikan kenyamanan ekstra. Dibuat dari campuran bahan katun, polyester, dengan anyaman two tone.',
    points: ['Tekstur lebih halus dibanding denim biasa', 'Permukaan sangat soft sedikit berbulu', 'Warnanya awet tidak mudah pudar']
  },
  'OXFORD': {
    title: 'OXFORD',
    desc: 'Bahan oxford terbuat dari campuran serat katun dan polyester. Kain ini dikenal karena keawetan dan kekuatannya.',
    points: ['Sering digunakan untuk kemeja dan seragam', 'Teksturnya yang lembut', 'Tampilannya seperti titik-titik kecil mirip piksel']
  },
  'STF': {
    title: 'STF',
    desc: 'Bahan STF (Oxford Premium) memiliki kualitas premium dengan komposisi unik campuran katun, rayon, dan polyester.',
    points: ['Bahannya lebih ringan', 'Sangat adem dikenakan']
  },
  'AMERICAN DRILL': {
    title: 'AMERICAN DRILL',
    desc: 'Kain American Drill terbuat dari campuran serat polyester and viscose (dominasi polyester). Memiliki tekstur diagonal khas yang disebut "twill".',
    points: ['Kekuatan dan daya tahan tinggi', 'Kemampuan menahan bentuk (tidak mudah kusut/menyusut)', 'Cocok untuk seragam kerja dan formal']
  }
};

export const POLO_MATERIAL_SPECS: Record<string, { title: string; desc: string; points?: string[] }> = {
  'PIQUE COTTON': {
    title: 'Pique Cotton (Katun Pique)',
    desc: 'Terbuat dari 100% katun, bertekstur berpori seperti sarang lebah (pique), sangat adem, lembut, dan menyerap keringat dengan baik, cocok untuk polo premium.',
    points: ['100% Katun Murni', 'Tekstur Pique Sarang Lebah', 'Sangat Adem & Lembut', 'Daya Serap Keringat Tinggi']
  },
  'LACOSTE CVC': {
    title: 'Lacoste CVC (Chief Value Cotton)',
    desc: 'Campuran katun dan polyester (biasanya 60:40 atau 50:50). Bahan ini lebih kokoh, tahan lama, dan tidak mudah menyusut dibandingkan katun murni, namun tetap nyaman.',
    points: ['Campuran Katun & Polyester', 'Lebih Kokoh & Tahan Lama', 'Minimal Menyusut', 'Tetap Nyaman Digunakan']
  },
  'PIQUE PE': {
    title: 'Pique PE (Polyester)',
    desc: 'Terbuat dari 100% polyester. Bahannya cenderung kaku, lebih tipis, dan kurang menyerap keringat, namun tahan lama, cepat kering, dan harganya ekonomis.',
    points: ['100% Polyester', 'Cepat Kering', 'Tahan Lama', 'Harga Ekonomis']
  },
  'DRI-FIT': {
    title: 'Dri-fit (Performance)',
    desc: 'Bahan sintetis yang sangat ringan, cepat menyerap keringat, dan melepaskan panas. Sangat cocok untuk polo olahraga karena memberikan sirkulasi udara yang baik, namun cenderung lebih lemas.',
    points: ['Sangat Ringan', 'Sirkulasi Udara Maksimal', 'Melepaskan Panas', 'Cocok untuk Olahraga']
  },
  'WAFFLE KNIT': {
    title: 'Waffle Knit',
    desc: 'Memiliki tekstur lebih menonjol daripada pique, memberikan kesan unik, kuat, dan tetap nyaman untuk digunakan sehari-hari.',
    points: ['Tekstur Unik Menonjol', 'Kuat & Kokoh', 'Tampilan Modern', 'Nyaman Harian']
  },
  'VISCOSE': {
    title: 'Viscose',
    desc: 'Bahan yang lembut, berkilau, dan memberikan kesan elegan, sering digunakan untuk polo premium.',
    points: ['Lembut & Berkilau', 'Kesan Mewah/Elegan', 'Jatuh dengan Indah (Drape)', 'Kualitas Premium']
  }
};

export const COLORS = [
  { name: 'Putih', hex: '#FFFFFF', image: ASSETS.COLORS.PUTIH, backImage: ASSETS.COLORS_BACK.PUTIH },
  { name: 'Khaki', hex: '#C5CAE9', image: ASSETS.COLORS.KHAKI, backImage: ASSETS.COLORS_BACK.KHAKI },
  { name: 'Kuning', hex: '#FFEB3B', image: ASSETS.COLORS.KUNING, backImage: ASSETS.COLORS_BACK.KUNING },
  { name: 'Oren', hex: '#FF9800', image: ASSETS.COLORS.OREN, backImage: ASSETS.COLORS_BACK.OREN },
  { name: 'Merah Cabe', hex: '#D32F2F', image: ASSETS.COLORS.MERAH_CABE, backImage: ASSETS.COLORS_BACK.MERAH_CABE },
  { name: 'Ungu Muda', hex: '#D1C4E9', image: ASSETS.COLORS.UNGU_MUDA, backImage: ASSETS.COLORS_BACK.UNGU_MUDA },
  { name: 'Biru Muda', hex: '#87CEEB', image: ASSETS.COLORS.BIRU_MUDA, backImage: ASSETS.COLORS_BACK.BIRU_MUDA },
  { name: 'Sage', hex: '#81C784', image: ASSETS.COLORS.SAGE, backImage: ASSETS.COLORS_BACK.SAGE },
  { name: 'Hijau', hex: '#2E7D32', image: ASSETS.COLORS.HIJAU, backImage: ASSETS.COLORS_BACK.HIJAU },
  { name: 'Hijau Bunglon', hex: '#006400', image: ASSETS.COLORS.HIJAU_BUNGLON, backImage: ASSETS.COLORS_BACK.HIJAU_BUNGLON },
  { name: 'Mocha', hex: '#A1887F', image: ASSETS.COLORS.MOCHA, backImage: ASSETS.COLORS_BACK.MOCHA },
  { name: 'Coklat', hex: '#795548', image: ASSETS.COLORS.COKLAT, backImage: ASSETS.COLORS_BACK.COKLAT },
  { name: 'Maroon', hex: '#B71C1C', image: ASSETS.COLORS.MAROON, backImage: ASSETS.COLORS_BACK.MAROON },
  { name: 'Ungu Tua', hex: '#4A148C', image: ASSETS.COLORS.UNGU_TUA, backImage: ASSETS.COLORS_BACK.UNGU_TUA },
  { name: 'Denim', hex: '#1560BD', image: ASSETS.COLORS.DENIM, backImage: ASSETS.COLORS_BACK.DENIM },
  { name: 'Navy', hex: '#1A237E', image: ASSETS.COLORS.NAVI, backImage: ASSETS.COLORS_BACK.NAVI },
  { name: 'Hijau Army', hex: '#4B5320', image: ASSETS.COLORS.HIJAU_ARMY, backImage: ASSETS.COLORS_BACK.HIJAU_ARMY },
  { name: 'Coklat Tua', hex: '#3E2723', image: ASSETS.COLORS.COKLAT_TUA, backImage: ASSETS.COLORS_BACK.COKLAT_TUA },
  { name: 'Hitam', hex: '#212121', image: ASSETS.COLORS.HITAM, backImage: ASSETS.COLORS_BACK.HITAM }
];

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', 'Kustom'];


