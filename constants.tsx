
import { Product, WorkflowStage } from './types';
import { ASSETS } from './assets';

const getRandomSold = () => Math.floor(Math.random() * (4500 - 2000 + 1)) + 2000;

export const PRODUCTS: Product[] = [
  {
    id: 'k2',
    name: 'Brad-V1',
    category: 'Kemeja',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.BRAD_V1.FRONT,
    images: {
      front: ASSETS.KEMEJA.BRAD_V1.FRONT,
      back: ASSETS.KEMEJA.BRAD_V3.BACK,
      leftSleeve: ASSETS.KEMEJA.BRAD_V1.FRONT,
      rightSleeve: ASSETS.KEMEJA.BRAD_V1.FRONT
    },
    gallery: ASSETS.KEMEJA.BRAD_V1.GALLERY,
    description: 'Seri Brad-V1: Keseimbangan sempurna antara gaya kantor dan fungsionalitas taktis.'
  },
  {
    id: 'k3',
    name: 'Brad-V2',
    category: 'Kemeja',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.BRAD_V2.FRONT,
    images: {
      front: ASSETS.KEMEJA.BRAD_V2.FRONT,
      back: ASSETS.KEMEJA.YOROI.BACK,
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
    id: 'k7',
    name: 'Robotic',
    category: 'Kemeja',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.ROBOTIC.FRONT,
    images: {
      front: ASSETS.KEMEJA.ROBOTIC.FRONT,
      back: ASSETS.KEMEJA.BRAD_V3.BACK,
      leftSleeve: ASSETS.KEMEJA.ROBOTIC.FRONT,
      rightSleeve: ASSETS.KEMEJA.ROBOTIC.FRONT
    },
    gallery: ASSETS.KEMEJA.ROBOTIC.GALLERY,
    description: 'Seri Robotic dengan saku multifungsi modular.'
  },
  /* 
  // MODEL DISEMBUNYIKAN (V3 PRO & V4)
  // Lokasi Script: constants.tsx (dalam array PRODUCTS)
  {
    id: 'k4',
    name: 'Brad-V3 PRO',
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
    description: 'Seri Brad-V3 PRO untuk durabilitas maksimal di lapangan.'
  },
  {
    id: 'k5',
    name: 'Brad-V4',
    category: 'Kemeja',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.BRAD_V3.FRONT,
    images: {
      front: ASSETS.KEMEJA.BRAD_V3.FRONT,
      back: ASSETS.KEMEJA.BRAD_V3.BACK,
      leftSleeve: ASSETS.KEMEJA.BRAD_V3.FRONT,
      rightSleeve: ASSETS.KEMEJA.BRAD_V3.FRONT
    },
    description: 'Seri Brad-V4: Standar baru untuk seragam tangguh.'
  },
  */
  {
    id: 'k6',
    name: 'Ventura',
    category: 'Kemeja',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.VENTURA.FRONT,
    images: {
      front: ASSETS.KEMEJA.VENTURA.FRONT,
      back: ASSETS.KEMEJA.BRAD_V3.BACK,
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
      back: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/PDH-White-2.jpg',
      leftSleeve: ASSETS.KEMEJA.PDH.FRONT,
      rightSleeve: ASSETS.KEMEJA.PDH.FRONT
    },
    gallery: ASSETS.KEMEJA.PDH.GALLERY,
    description: 'Pakaian Dinas Harian (PDH) klasik dengan kenyamanan katun drill.'
  },
  {
    id: 'k9',
    name: 'PDH baru',
    category: 'Kemeja',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.PDH_BARU.FRONT,
    images: {
      front: ASSETS.KEMEJA.PDH_BARU.FRONT,
      back: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/PDH-White-2.jpg',
      leftSleeve: ASSETS.KEMEJA.PDH_BARU.FRONT,
      rightSleeve: ASSETS.KEMEJA.PDH_BARU.FRONT
    },
    gallery: ASSETS.KEMEJA.PDH_BARU.GALLERY,
    description: 'Evolusi terbaru PDH dengan material lebih lembut dan sejuk.'
  },
  {
    id: 'k10',
    name: 'Strazar',
    category: 'Kemeja',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.STRAZAR.FRONT,
    images: {
      front: ASSETS.KEMEJA.STRAZAR.FRONT,
      back: ASSETS.KEMEJA.YOROI.BACK,
      leftSleeve: ASSETS.KEMEJA.STRAZAR.FRONT,
      rightSleeve: ASSETS.KEMEJA.STRAZAR.FRONT
    },
    gallery: ASSETS.KEMEJA.STRAZAR.GALLERY,
    description: 'Strazar: Kemeja premium dengan standar kualitas ekspor.'
  },
  {
    id: 'j1',
    name: 'Bomber Brad',
    category: 'Jaket',
    soldCount: getRandomSold(),
    image: ASSETS.JAKET.BOMBER,
    images: {
      front: ASSETS.JAKET.BOMBER,
      back: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/Bomber-Navy-2.jpg',
      leftSleeve: ASSETS.JAKET.BOMBER,
      rightSleeve: ASSETS.JAKET.BOMBER
    },
    description: 'Jaket Bomber premium industri.'
  },
  {
    id: 'r1',
    name: 'Vest Bupati',
    category: 'Rompi',
    soldCount: getRandomSold(),
    image: ASSETS.ROMPI.BUPATI,
    images: {
      front: ASSETS.ROMPI.BUPATI,
      back: ASSETS.ROMPI.BACK,
      leftSleeve: ASSETS.ROMPI.BUPATI,
      rightSleeve: ASSETS.ROMPI.BUPATI
    },
    gallery: ASSETS.ROMPI.GALLERY,
    description: 'Vest tactical untuk instansi pemerintah.'
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
    name: 'Cargo Tactical',
    category: 'Celana',
    soldCount: getRandomSold(),
    image: ASSETS.CELANA.WARRIOR,
    images: {
      front: ASSETS.CELANA.WARRIOR,
      back: ASSETS.CELANA.WARRIOR
    },
    description: 'Celana cargo tactical dengan banyak saku.'
  },
  {
    id: 'c2',
    name: 'PDL Formal',
    category: 'Celana',
    soldCount: getRandomSold(),
    image: ASSETS.CELANA.FORMAL,
    images: {
      front: ASSETS.CELANA.FORMAL,
      back: ASSETS.CELANA.FORMAL
    },
    description: 'Celana PDL formal untuk dinas harian.'
  },
  {
    id: 'kid1',
    name: 'Kemeja Anak TK',
    category: 'Kids',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.BRAD_V3.FRONT,
    images: {
      front: ASSETS.KEMEJA.BRAD_V3.FRONT,
      back: ASSETS.KEMEJA.BRAD_V3.BACK
    },
    description: 'Kemeja anak untuk seragam TK/PAUD.'
  },
  {
    id: 'kid2',
    name: 'Kemeja Anak SD',
    category: 'Kids',
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.MTAC_FRONT,
    images: {
      front: ASSETS.KEMEJA.MTAC_FRONT,
      back: ASSETS.KEMEJA.BRAD_V3.BACK
    },
    description: 'Kemeja anak untuk seragam SD.'
  },
  {
    id: 'p1',
    name: 'Kaos Polo',
    category: 'Polo',
    soldCount: getRandomSold(),
    image: ASSETS.POLO.BASIC,
    images: {
      front: ASSETS.POLO.BASIC,
      back: ASSETS.POLO.BASIC
    },
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
  { name: 'DISHUB', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Logo_Perhubungan.png' },
  { name: 'SATPOL PP', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Logo_Satpol_PP.png/800px-Logo_Satpol_PP.png' },
  { name: 'DAMKAR', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Logo_Pemadam_Kebakaran_Indonesia.png/800px-Logo_Pemadam_Kebakaran_Indonesia.png' },
  { name: 'POLRI', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Logo_Polri.png/1200px-Logo_Polri.png' },
  { name: 'TNI AD', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Logo_TNI_AD.png/800px-Logo_TNI_AD.png' },
  { name: 'KEMENHUB', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_Kementerian_Perhubungan.png/1200px-Logo_Kementerian_Perhubungan.png' },
  { name: 'BASARNAS', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Logo_BASARNAS.png/800px-Logo_BASARNAS.png' },
  { name: 'BNPB', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Logo_BNPB.png/800px-Logo_BNPB.png' },
  { name: 'BMKG', logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/d/d4/Logo_BMKG.png/800px-Logo_BMKG.png' },
  { name: 'KEMENKES', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Logo_Kementrian_Kesehatan.png/800px-Logo_Kementrian_Kesehatan.png' },
  { name: 'PLN', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Logo_PLN.svg/1200px-Logo_PLN.svg.png' },
  { name: 'SATGAS', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Logo_Satuan_Tugas_Penanganan_COVID-19_Indonesia.png/800px-Logo_Satuan_Tugas_Penanganan_COVID-19_Indonesia.png' }
];

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

export const FAQS = [
  { q: 'Berapa minimal order di Bradwear?', a: 'Minimal pemesanan kustom adalah 12 pcs per model untuk hasil produksi yang maksimal.' },
  { q: 'Apakah bisa kustom logo instansi?', a: 'Tentu! Kami melayani bordir komputer berkualitas tinggi untuk semua logo instansi Anda.' },
  { q: 'Berapa lama proses produksi?', a: 'Proses produksi memakan waktu 14-21 hari kerja tergantung jumlah antrian.' },
];

export const RANDOM_ORDERS = Array.from({ length: 30 }, (_, i) => ({
  user: ['Andi', 'Budi', 'Chandra', 'Dedi', 'Eko', 'Fajar', 'Gani', 'Hendra', 'Ivan', 'Joko'][Math.floor(Math.random() * 10)] + " dari " + ['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Makassar'][Math.floor(Math.random() * 5)],
  product: ['Kemeja Tactical', 'Jaket Bomber', 'Rompi PDH', 'Celana Cargo'][Math.floor(Math.random() * 4)],
  qty: Math.floor(Math.random() * 50) + 12
}));

export const MATERIALS = [
  'TROPICAL',
  'BABY CANVAS',
  'RIPSTOP PERNUSA',
  'NAGATA DRILL',
  'SOFT DENIM',
  'OXFORD',
  'STF',
  'AMERICAN DRILL'
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


