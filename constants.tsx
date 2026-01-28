
import { Product, CustomerService, WorkflowStage } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Kemeja Lengan Panjang',
    category: 'Kemeja',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=400',
    description: 'Kemeja formal dengan bahan berkualitas tinggi.'
  },
  {
    id: '2',
    name: 'Kemeja Lengan Pendek',
    category: 'Kemeja',
    price: 135000,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400',
    description: 'Kemeja santai nan elegan untuk harian.'
  },
  {
    id: '5',
    name: 'Kemeja Batik Modern',
    category: 'Kemeja',
    price: 185000,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=400',
    description: 'Kemeja batik dengan potongan slim-fit kekinian.'
  },
  {
    id: '6',
    name: 'Kemeja Flanel Casual',
    category: 'Kemeja',
    price: 165000,
    image: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&q=80&w=400',
    description: 'Bahan flanel lembut untuk tampilan santai namun berkelas.'
  },
  {
    id: '7',
    name: 'Kemeja Tactical PDL',
    category: 'Kemeja',
    price: 225000,
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=400',
    description: 'Kemeja lapangan dengan saku multifungsi dan bahan Ripstop.'
  },
  {
    id: '8',
    name: 'Kemeja Linen Premium',
    category: 'Kemeja',
    price: 195000,
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400',
    description: 'Kemeja bahan linen yang breathable dan sangat nyaman.'
  },
  {
    id: '3',
    name: 'Celana Chinos Slim Fit',
    category: 'Celana',
    price: 210000,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=400',
    description: 'Celana chinos modern untuk tampilan profesional.'
  },
  {
    id: '4',
    name: 'Rompi Safety Premium',
    category: 'Rompi',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=400',
    description: 'Rompi pelindung dengan reflektor standar industri.'
  }
];

export const WORKFLOW_STAGES: WorkflowStage[] = [
  { id: '1', label: 'Desain', status: 'completed', description: 'User membuat mockup' },
  { id: '2', label: 'Approve', status: 'completed', description: 'Admin menyetujui detail' },
  { id: '3', label: 'Cutting', status: 'current', description: 'Proses potong bahan' },
  { id: '4', label: 'Sewing', status: 'pending', description: 'Proses jahit' },
  { id: '5', label: 'QC', status: 'pending', description: 'Quality control internal' },
  { id: '6', label: 'Shipping', status: 'pending', description: 'Pengiriman ke user' },
];

export const MATERIALS = ['Drill', 'Katun', 'Oxford', 'Ripstop', 'Linen', 'Flanel'];

export const COLORS = [
  { name: 'Putih', hex: '#FFFFFF' },
  { name: 'Hitam', hex: '#000000' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Abu-abu', hex: '#808080' },
  { name: 'Mustard', hex: '#EAB308' },
  { name: 'Maroon', hex: '#800000' }
];

export const CS_TEAM: CustomerService[] = [
  {
    id: 'cs1',
    name: 'Daffa Riwulan',
    avatar: 'https://i.pravatar.cc/150?u=daffa',
    isOnline: true,
    phone: '6281234567890'
  },
  {
    id: 'cs2',
    name: 'Siska Amelia',
    avatar: 'https://i.pravatar.cc/150?u=siska',
    isOnline: true,
    phone: '6281234567891'
  }
];
