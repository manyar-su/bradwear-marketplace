
export enum View {
  HOME = 'HOME',
  EDITOR = 'EDITOR',
  SUMMARY = 'SUMMARY',
  ADMIN = 'ADMIN'
}

export type Category = 'Kemeja' | 'Celana' | 'Rompi';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  description: string;
}

export interface DesignData {
  productId: string;
  color: string;
  material: string;
  logoUrl?: string;
  customName?: string;
  view: 'Depan' | 'Belakang' | 'Lengan Kanan' | 'Lengan Kiri';
}

export interface OrderItem {
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  quantity: number;
}

export interface CustomerService {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  phone: string;
}

export interface WorkflowStage {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'pending';
  description: string;
}
