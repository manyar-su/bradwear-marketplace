
import { Product, CustomerService, WorkflowStage } from './types';
import { ASSETS } from './assets';

const getRandomSold = () => Math.floor(Math.random() * (4500 - 2000 + 1)) + 2000;

export const PRODUCTS: Product[] = [
  {
    id: 'k1',
    name: 'KEMEJA GATAM TACTICAL',
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
    description: 'Kemeja tactical seri Gatam dengan material Ripstop Tornado premium, ventilasi udara di punggung, dan saku fungsional.'
  },
  {
    id: 'k2',
    name: 'KEMEJA M-TAC SERIES',
    category: 'Kemeja',
    price: 165000,
    soldCount: getRandomSold(),
    image: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/M-Tac-Grey-1.jpg',
    images: {
      front: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/M-Tac-Grey-1.jpg',
      back: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/M-Tac-Grey-2.jpg',
      leftSleeve: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/M-Tac-Grey-1.jpg',
      rightSleeve: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/M-Tac-Grey-1.jpg'
    },
    description: 'Kemeja lapangan M-Tac dengan desain elegan, sangat cocok untuk seragam kantor maupun kegiatan outdoor.'
  },
  {
    id: 'k3',
    name: 'KEMEJA PDH PREMIUM',
    category: 'Kemeja',
    price: 155000,
    soldCount: getRandomSold(),
    image: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/PDH-White-1.jpg',
    images: {
      front: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/PDH-White-1.jpg',
      back: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/PDH-White-2.jpg',
      leftSleeve: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/PDH-White-1.jpg',
      rightSleeve: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/PDH-White-1.jpg'
    },
    description: 'Pakaian Dinas Harian (PDH) dengan bahan American Drill pilihan yang tidak panas dan tidak mudah kusut.'
  },
  {
    id: 'j1',
    name: 'JAKET BOMBER BRAD',
    category: 'Jaket',
    price: 285000,
    soldCount: getRandomSold(),
    image: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/Bomber-Navy-1.jpg',
    images: {
      front: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/Bomber-Navy-1.jpg',
      back: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/Bomber-Navy-2.jpg',
      leftSleeve: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/Bomber-Navy-1.jpg',
      rightSleeve: 'https://www.bradwearindonesia.com/wp-content/uploads/2023/05/Bomber-Navy-1.jpg'
    },
    description: 'Jaket Bomber premium dengan furing parasit dan padding yang nyaman untuk cuaca dingin.'
  },
  {
    id: 'r1',
    name: 'ROMPI TACTICAL BUPATI',
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
    description: 'Rompi multifungsi dengan banyak saku (utility pockets), ideal untuk instansi pemerintah dan pengawas lapangan.'
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
];

export const TESTIMONIALS = [
  { name: 'Bp. Hendra', text: 'Kualitas jahitannya sangat rapi, benar-benar standar dinas.', agency: 'DISHUB' },
  { name: 'Ibu Siska', text: 'Proses kustomisasinya sangat mudah dan admin sangat responsif.', agency: 'KEMENKES' },
  { name: 'Bripda Rizky', text: 'Bahan Ripstop-nya juara, sangat tangguh untuk lapangan.', agency: 'POLRI' },
  { name: 'Bp. Ahmad', text: 'Sudah langganan untuk seragam operasional, selalu puas dengan hasilnya.', agency: 'BASARNAS' },
  { name: 'Ibu Maya', text: 'Material Nagata Drill-nya adem sekali, nyaman dipakai seharian di kantor.', agency: 'DINKES' },
  { name: 'Bp. Toto', text: 'Pengerjaan bordir komputernya sangat detail dan presisi.', agency: 'SATPOL PP' },
  { name: 'Serda Danu', text: 'Kemeja Tactical-nya kuat, cocok untuk medan berat.', agency: 'TNI AD' },
  { name: 'Ibu Rani', text: 'Warna kain tidak mudah pudar walau sudah sering dicuci.', agency: 'DAMKAR' },
  { name: 'Bp. Guntur', text: 'Solusi terbaik untuk seragam instansi skala besar.', agency: 'KEMENHUB' },
  { name: 'Bp. Farhan', text: 'Pengiriman tepat waktu dan packing sangat aman.', agency: 'PLN' }
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
  { name: 'Navy 391', hex: '#1B263B' },
  { name: 'Black 001', hex: '#1A1A1B' },
  { name: 'Khaki 328', hex: '#96856C' },
  { name: 'Grey 332', hex: '#3D3D3D' },
  { name: 'Maroon 016', hex: '#5E1916' },
  { name: 'Army 117', hex: '#3E4235' },
  { name: 'White 000', hex: '#FFFFFF' },
  { name: 'Royal Blue 384', hex: '#1E40AF' },
  { name: 'Red 010', hex: '#B91C1C' },
  { name: 'Orange 020', hex: '#EA580C' },
  { name: 'Cream 321', hex: '#E6DCC5' },
  { name: 'Dark Brown 389', hex: '#3D2B1F' },
  { name: 'Yellow 030', hex: '#FACC15' }
];

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', 'Kustom'];

export const CS_TEAM: CustomerService[] = [
  { id: 'cs1', name: 'Gilang', avatar: 'https://i.pravatar.cc/150?u=gilang', isOnline: true, phone: '6281234567801', loginKey: 'brad01' },
  { id: 'cs2', name: 'Bayu', avatar: 'https://i.pravatar.cc/150?u=bayu', isOnline: true, phone: '6281234567802', loginKey: 'brad02' },
  { id: 'cs3', name: 'Fikri', avatar: 'https://i.pravatar.cc/150?u=fikri', isOnline: true, phone: '6281234567803', loginKey: 'brad03' },
  { id: 'cs4', name: 'Aris', avatar: 'https://i.pravatar.cc/150?u=aris', isOnline: true, phone: '6281234567804', loginKey: 'brad04' },
  { id: 'cs5', name: 'Ede', avatar: 'https://i.pravatar.cc/150?u=ede', isOnline: true, phone: '6281234567805', loginKey: 'brad05' },
  { id: 'cs6', name: 'Elsa', avatar: 'https://i.pravatar.cc/150?u=elsa', isOnline: true, phone: '6281234567806', loginKey: 'brad06' },
  { id: 'cs7', name: 'Nadhifa', avatar: 'https://i.pravatar.cc/150?u=nadhifa', isOnline: true, phone: '6281234567807', loginKey: 'brad07' },
  { id: 'cs8', name: 'Eris', avatar: 'https://i.pravatar.cc/150?u=eris', isOnline: true, phone: '6281234567808', loginKey: 'brad08' },
];
