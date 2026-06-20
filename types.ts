
export enum RouteKey {
  HOME = 'HOME',
  THREE_D = 'THREE_D',
  KATALOG = 'KATALOG',
  CLIENT = 'CLIENT',
  PANTS = 'PANTS',
  ARTIKEL = 'ARTIKEL',
  CARA_ORDER = 'CARA_ORDER',
  LAYANAN_PELANGGAN = 'LAYANAN_PELANGGAN',
  LACAK_PESANAN = 'LACAK_PESANAN',
  TEMUKAN_TOKO = 'TEMUKAN_TOKO',
  BRAD_AI = 'BRAD_AI',
  EDITOR = 'EDITOR',
  SUMMARY = 'SUMMARY'
}

export type Category = 'Kemeja' | 'Celana' | 'Rompi' | 'Jaket' | 'Polo';

export interface NavItem {
  label: string;
  route: RouteKey;
  description?: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  body: string[];
}

export interface CourierProvider {
  id: string;
  name: string;
  helperText: string;
  trackingUrl: string;
  prefillMode: 'none' | 'query';
  queryParam?: string;
}

export interface SeoMeta {
  title: string;
  description: string;
  path: string;
  keywords: string[];
  schema: Record<string, unknown>[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status?: 'idle' | 'loading' | 'error';
}

export interface BradAiContextSection {
  heading: string;
  body: string;
}

export interface SiteFaqItem {
  slug: string;
  title: string;
  answer: string;
}

export interface ContactChannel {
  label: string;
  value: string;
  note: string;
}

export interface HowToOrderStep {
  id: string;
  title: string;
  description: string;
  detail: string;
}

export interface ProductImages {
  front: string;
  back?: string;
  leftSleeve?: string;
  rightSleeve?: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  soldCount: number;
  image: string;
  images?: ProductImages;
  description: string;
  isHidden?: boolean;
  gallery?: string[];
}

export interface DesignElement {
  id: string;
  type: 'text' | 'image';
  content: string;
  pos: { x: number; y: number };
  scale: number;
  view: 'Depan' | 'Belakang' | 'Kanan' | 'Kiri';
  borderRadius?: string;
}

export interface DesignData {
  productId: string;
  color: string;
  material: string;
  elements: DesignElement[];
  view: 'Depan' | 'Belakang' | 'Kanan' | 'Kiri';
  customName?: string;
  namePos: { x: number; y: number };
  logoPos: { x: number; y: number };
  customMeasurements?: CustomMeasurements;
}

export interface CustomMeasurements {
  tinggi: string;
  lebarDada: string;
  panjangLengan: string;
  kerah: string;
  manset: string;
}

export interface OrderItem {
  size: string;
  quantity: number;
  gender: 'L' | 'P' | 'Pria' | 'Wanita';
  sleeve?: 'Panjang' | 'Pendek';
  name?: string;
  color?: string;
  colorCode?: string;
  catalogMaterial?: string;
  customDetail?: string;
  productId?: string;
  productName?: string;
  productCategory?: Category;
  productImage?: string;
  colorCodeImage?: string;
}



export interface WorkflowStage {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'pending';
  description: string;
}

export interface ProductionOrder {
  orderCode: string;
  productCode: string; // Kode Barang manual
  customerName: string;
  productName: string;
  category: Category;
  totalQty: number;
  orderItems: OrderItem[]; // Detail ukuran & gender
  stages: WorkflowStage[];
  createdAt: string;
  courier?: string;
  resi?: string;
  trackingUrl?: string;
}

export interface CompletedOrder {
  code: string;
  productName: string;
  completedAt: string;
  resi: string;
  courier?: string;
  trackingUrl?: string;
}
