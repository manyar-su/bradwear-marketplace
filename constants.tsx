
import { Product, CustomerService, WorkflowStage } from './types';
import { ASSETS } from './assets';

const getRandomSold = () => Math.floor(Math.random() * (4500 - 2000 + 1)) + 2000;

export const PRODUCTS: Product[] = [
  {
    id: 'k1',
    name: 'Gatam',
    category: 'Kemeja',
    price: 185000,
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.GATAM_FRONT,
    images: {
      front: ASSETS.KEMEJA.GATAM_FRONT,
      back: ASSETS.KEMEJA.GATAM_BACK,
      leftSleeve: ASSETS.KEMEJA.GATAM_FRONT,
      rightSleeve: ASSETS.KEMEJA.GATAM_FRONT
    },
    description: 'Seri Gatam dengan material Ripstop Tornado premium dan ventilasi udara punggung.'
  },
  {
    id: 'k2',
    name: 'Brad-V1',
    category: 'Kemeja',
    price: 165000,
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.MTAC_FRONT,
    images: {
      front: ASSETS.KEMEJA.MTAC_FRONT,
      back: ASSETS.KEMEJA.GATAM_BACK,
      leftSleeve: ASSETS.KEMEJA.MTAC_FRONT,
      rightSleeve: ASSETS.KEMEJA.MTAC_FRONT
    },
    description: 'Seri Brad-V1: Keseimbangan sempurna antara gaya kantor dan fungsionalitas taktis.'
  },
  {
    id: 'k3',
    name: 'Brad-V2',
    category: 'Kemeja',
    price: 175000,
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.YOROI_FRONT,
    images: {
      front: ASSETS.KEMEJA.YOROI_FRONT,
      back: ASSETS.KEMEJA.YOROI_BACK,
      leftSleeve: ASSETS.KEMEJA.YOROI_FRONT,
      rightSleeve: ASSETS.KEMEJA.YOROI_FRONT
    },
    description: 'Seri Brad-V2 dengan potongan modern dan material premium.'
  },
  {
    id: 'k4',
    name: 'Brad-V3',
    category: 'Kemeja',
    price: 175000,
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.MTAC_FRONT,
    images: {
      front: ASSETS.KEMEJA.MTAC_FRONT,
      back: ASSETS.KEMEJA.GATAM_BACK,
      leftSleeve: ASSETS.KEMEJA.MTAC_FRONT,
      rightSleeve: ASSETS.KEMEJA.MTAC_FRONT
    },
    description: 'Seri Brad-V3 untuk durabilitas maksimal di lapangan.'
  },
  {
    id: 'k5',
    name: 'Brad-V4',
    category: 'Kemeja',
    price: 175000,
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.GATAM_FRONT,
    images: {
      front: ASSETS.KEMEJA.GATAM_FRONT,
      back: ASSETS.KEMEJA.GATAM_BACK,
      leftSleeve: ASSETS.KEMEJA.GATAM_FRONT,
      rightSleeve: ASSETS.KEMEJA.GATAM_FRONT
    },
    description: 'Seri Brad-V4: Standar baru untuk seragam tangguh.'
  },
  {
    id: 'k6',
    name: 'Ventura',
    category: 'Kemeja',
    price: 195000,
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.VENTURA,
    images: {
      front: ASSETS.KEMEJA.VENTURA,
      back: ASSETS.KEMEJA.GATAM_BACK,
      leftSleeve: ASSETS.KEMEJA.VENTURA,
      rightSleeve: ASSETS.KEMEJA.VENTURA
    },
    description: 'Seri Ventura dengan desain sleek dan minimalis.'
  },
  {
    id: 'k7',
    name: 'Robotic',
    category: 'Kemeja',
    price: 205000,
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.MTAC_FRONT,
    images: {
      front: ASSETS.KEMEJA.MTAC_FRONT,
      back: ASSETS.KEMEJA.GATAM_BACK,
      leftSleeve: ASSETS.KEMEJA.MTAC_FRONT,
      rightSleeve: ASSETS.KEMEJA.MTAC_FRONT
    },
    description: 'Seri Robotic dengan saku multifungsi modular.'
  },
  {
    id: 'k8',
    name: 'PDH',
    category: 'Kemeja',
    price: 155000,
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.PDH,
    images: {
      front: ASSETS.KEMEJA.PDH,
      back: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/PDH-White-2.jpg',
      leftSleeve: ASSETS.KEMEJA.PDH,
      rightSleeve: ASSETS.KEMEJA.PDH
    },
    description: 'Pakaian Dinas Harian (PDH) klasik dengan kenyamanan katun drill.'
  },
  {
    id: 'k9',
    name: 'PDH baru',
    category: 'Kemeja',
    price: 155000,
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.PDH,
    images: {
      front: ASSETS.KEMEJA.PDH,
      back: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/PDH-White-2.jpg',
      leftSleeve: ASSETS.KEMEJA.PDH,
      rightSleeve: ASSETS.KEMEJA.PDH
    },
    description: 'Evolusi terbaru PDH dengan material lebih lembut dan sejuk.'
  },
  {
    id: 'k10',
    name: 'Strazar',
    category: 'Kemeja',
    price: 225000,
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.YOROI_FRONT,
    images: {
      front: ASSETS.KEMEJA.YOROI_FRONT,
      back: ASSETS.KEMEJA.YOROI_BACK,
      leftSleeve: ASSETS.KEMEJA.YOROI_FRONT,
      rightSleeve: ASSETS.KEMEJA.YOROI_FRONT
    },
    description: 'Strazar: Kemeja premium dengan standar kualitas ekspor.'
  },
  {
    id: 'j1',
    name: 'Bomber Brad',
    category: 'Jaket',
    price: 285000,
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
    name: 'Tactical Bupati',
    category: 'Rompi',
    price: 195000,
    soldCount: getRandomSold(),
    image: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/Rompi-Bupati-Tan-1.jpg',
    images: {
      front: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/Rompi-Bupati-Tan-1.jpg',
      back: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/Rompi-Bupati-Tan-2.jpg',
      leftSleeve: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/Rompi-Bupati-Tan-1.jpg',
      rightSleeve: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/Rompi-Bupati-Tan-1.jpg'
    },
    description: 'Rompi tactical untuk instansi pemerintah.'
  },
  {
    id: 'r2',
    name: 'Rompi Lapangan',
    category: 'Rompi',
    price: 175000,
    soldCount: getRandomSold(),
    image: ASSETS.ROMPI.BUPATI,
    images: {
      front: ASSETS.ROMPI.BUPATI,
      back: ASSETS.ROMPI.BUPATI
    },
    description: 'Rompi lapangan multifungsi.'
  },
  {
    id: 'c1',
    name: 'Cargo Tactical',
    category: 'Celana',
    price: 185000,
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
    price: 155000,
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
    price: 95000,
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.GATAM_FRONT,
    images: {
      front: ASSETS.KEMEJA.GATAM_FRONT,
      back: ASSETS.KEMEJA.GATAM_BACK
    },
    description: 'Kemeja anak untuk seragam TK/PAUD.'
  },
  {
    id: 'kid2',
    name: 'Kemeja Anak SD',
    category: 'Kids',
    price: 105000,
    soldCount: getRandomSold(),
    image: ASSETS.KEMEJA.MTAC_FRONT,
    images: {
      front: ASSETS.KEMEJA.MTAC_FRONT,
      back: ASSETS.KEMEJA.GATAM_BACK
    },
    description: 'Kemeja anak untuk seragam SD.'
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

export const COLORS = [
  { name: 'Hitam (Black)', hex: '#1A1A1B' },
  { name: 'Putih (White)', hex: '#FFFFFF' },
  { name: 'Navy (Dongker)', hex: '#1B263B' },
  { name: 'Abu SMA (Grey)', hex: '#808080' },
  { name: 'Hijau Army (TNI)', hex: '#4b5320' },
  { name: 'Hijau Toska', hex: '#008080' },
  { name: 'Burgundi', hex: '#800020' },
  { name: 'Maroon', hex: '#5E1916' },
  { name: 'Mocha', hex: '#6F4E37' },
  { name: 'Khaki (Pemda)', hex: '#C3B091' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Kuning Golkar', hex: '#FACC15' },
  { name: 'Merah Cabe', hex: '#B91C1C' },
  { name: 'Benhur (Royal Blue)', hex: '#1E40AF' }
];

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', 'Kustom'];

export const CS_TEAM: CustomerService[] = [
  { id: 'cs1', name: 'Gilang', avatar: 'https://i.pravatar.cc/150?u=gilang', isOnline: true, phone: '6282232133926', loginKey: 'brad01' },
  { id: 'cs2', name: 'Bayu', avatar: 'https://i.pravatar.cc/150?u=bayu', isOnline: true, phone: '6287736834454', loginKey: 'brad02' },
  { id: 'cs3', name: 'Fikri', avatar: 'https://i.pravatar.cc/150?u=fikri', isOnline: true, phone: '6281234567803', loginKey: 'brad03' },
  { id: 'cs4', name: 'Aris', avatar: 'https://i.pravatar.cc/150?u=aris', isOnline: true, phone: '6281234567804', loginKey: 'brad04' },
  { id: 'cs5', name: 'Ede', avatar: 'https://i.pravatar.cc/150?u=ede', isOnline: true, phone: '6281234567805', loginKey: 'brad05' },
  { id: 'cs6', name: 'Elsa', avatar: 'https://i.pravatar.cc/150?u=elsa', isOnline: true, phone: '6285722733889', loginKey: 'brad06' },
  { id: 'cs7', name: 'Nadhifa', avatar: 'https://i.pravatar.cc/150?u=nadhifa', isOnline: true, phone: '6282316067692', loginKey: 'brad07' },
  { id: 'cs8', name: 'Eris', avatar: 'https://i.pravatar.cc/150?u=eris', isOnline: true, phone: '6285846989608', loginKey: 'brad08' },
  { id: 'cs9', name: 'Risma', avatar: 'https://i.pravatar.cc/150?u=risma', isOnline: true, phone: '6282232133926', loginKey: 'brad09' },
];
