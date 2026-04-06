
export enum View {
  HOME = 'HOME',
  EDITOR = 'EDITOR',
  SUMMARY = 'SUMMARY'
}

export type Category = 'Kemeja' | 'Celana' | 'Rompi' | 'Jaket' | 'Polo';

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
}
