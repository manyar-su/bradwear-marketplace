export type DesignCategory = "Kemeja" | "Polo" | "Jaket" | "Celana" | "Rompi";

export type DesignViewLabel = "Depan" | "Belakang" | "Kanan" | "Kiri";

export type DesignEditorStep = "materials" | "details" | "finish";

export type DesignElementType = "text" | "image";

export type DesignElement = {
  id: string;
  type: DesignElementType;
  content: string;
  pos: { x: number; y: number };
  scale: number;
  view: DesignViewLabel;
  color?: string;
};

export type ProductImages = {
  front: string;
  back?: string;
  leftSleeve?: string;
  rightSleeve?: string;
};

export type ProductCatalogModel = {
  id: string;
  slug: string;
  name: string;
  category: DesignCategory;
  image: string;
  images: ProductImages;
  gallery?: string[];
  defaultMaterial?: string;
  basePrice?: number;
};

export type CatalogColor = {
  name: string;
  hex: string;
  image?: string;
  backImage?: string;
};

export type OrderItemDraft = {
  id: string;
  modelSlug: string;
  modelName: string;
  colorHex: string;
  colorCode: string;
  size: string;
  gender: "Pria" | "Wanita";
  sleeve: "Panjang" | "Pendek";
  qty: number;
  note?: string;
};

export type DesignDataV2 = {
  schema_version: "bradmock_v2";
  productSlug: string;
  productName: string;
  category: DesignCategory;
  material: string;
  color: string;
  view: DesignViewLabel;
  elements: DesignElement[];
  orderItems: OrderItemDraft[];
  scanMetadata?: CatalogScanResult | null;
};

export type CatalogScanResult = {
  rawText: string;
  normalizedColorName: string | null;
  normalizedColorHex: string | null;
  colorCode: string | null;
  confidence: number;
  warnings: string[];
};

export type AssetResolverMap = {
  models: ProductCatalogModel[];
  colors: CatalogColor[];
  catalogs: Record<string, string[]>;
};
