import {
  AssetResolverMap,
  CatalogColor,
  DesignCategory,
  DesignViewLabel,
  ProductCatalogModel,
} from "@/lib/design-editor-types";

const COLORS: CatalogColor[] = [
  { name: "Putih", hex: "#FFFFFF" },
  { name: "Khaki", hex: "#C5CAE9" },
  { name: "Kuning", hex: "#FFEB3B" },
  { name: "Oren", hex: "#FF9800" },
  { name: "Merah Cabe", hex: "#D32F2F" },
  { name: "Ungu Muda", hex: "#D1C4E9" },
  { name: "Biru Muda", hex: "#87CEEB" },
  { name: "Sage", hex: "#81C784" },
  { name: "Hijau", hex: "#2E7D32" },
  { name: "Hijau Bunglon", hex: "#006400" },
  { name: "Mocha", hex: "#A1887F" },
  { name: "Coklat", hex: "#795548" },
  { name: "Maroon", hex: "#B71C1C" },
  { name: "Ungu Tua", hex: "#4A148C" },
  { name: "Denim", hex: "#1560BD" },
  { name: "Navy", hex: "#1A237E" },
  { name: "Hijau Army", hex: "#4B5320" },
  { name: "Coklat Tua", hex: "#3E2723" },
  { name: "Hitam", hex: "#212121" },
];

export const MATERIALS_BY_CATEGORY: Record<DesignCategory, string[]> = {
  Kemeja: [
    "TROPICAL",
    "NAGATA DRILL",
    "AMERICAN DRILL",
    "STF",
    "RIPSTOP PERNUSA",
    "OXFORD",
    "BABY CANVAS",
    "SOFT DENIM",
  ],
  Polo: ["PIQUE COTTON", "LACOSTE CVC", "PIQUE PE", "DRI-FIT", "WAFFLE KNIT", "VISCOSE"],
  Jaket: ["RIPSTOP PERNUSA", "SOFT DENIM", "BABY CANVAS"],
  Celana: ["RIPSTOP PERNUSA", "AMERICAN DRILL", "BABY CANVAS"],
  Rompi: ["AMERICAN DRILL", "BABY CANVAS", "OXFORD"],
};

const CATALOGS: Record<string, string[]> = {
  "Tropical (Best Seller)": [
    "/assets/katalog/Katalog warna/Tropical/WhatsApp Image 2026-02-12 at 08.57.04.jpeg",
  ],
  Nagata: ["/assets/katalog/Katalog warna/Nagata/2. Nagata.jpg"],
  "American Drill": [
    "/assets/katalog/Katalog warna/American drill/WhatsApp Image 2026-02-12 at 09.22.21.jpeg",
  ],
  STF: ["/assets/katalog/Katalog warna/STF/WhatsApp Image 2026-02-12 at 09.11.33.jpeg"],
  "Soft Denim": ["/assets/katalog/Katalog warna/Soft denim/WhatsApp Image 2026-02-12 at 09.13.31.jpeg"],
  Oxford: ["/assets/katalog/Katalog warna/Oxford/2. Oxford Sari Warna.jpg"],
  Ripstop: ["/assets/katalog/Katalog warna/Ripstop/WhatsApp Image 2026-02-12 at 09.14.53.jpeg"],
  Polo: ["/assets/katalog/Katalog warna/Polo/E-Catalog Version 2023.01 5_page-0046.jpg"],
  "Baby Canvas": [
    "/assets/katalog/Katalog warna/Baby canvas/WhatsApp Image 2026-02-12 at 09.23.22.jpeg",
  ],
};

function viewsByCategory(category: DesignCategory): DesignViewLabel[] {
  if (category === "Celana") return ["Depan", "Belakang"];
  return ["Depan", "Belakang", "Kanan", "Kiri"];
}

function createModel(
  id: string,
  slug: string,
  name: string,
  category: DesignCategory,
  front: string,
  back?: string
): ProductCatalogModel {
  return {
    id,
    slug,
    name,
    category,
    image: front,
    images: {
      front,
      back: back || front,
      leftSleeve: front,
      rightSleeve: front,
    },
    defaultMaterial: MATERIALS_BY_CATEGORY[category][0],
  };
}

export const DESIGN_MODELS: ProductCatalogModel[] = [
  createModel(
    "k2",
    "brad-v1-custom",
    "Brad-v1",
    "Kemeja",
    "/assets/katalog/Model Kemeja/Brad-v1/(brad v-1)hitam.png",
    "/assets/katalog/Model Kemeja/Brad-v1/(brad v-1)belakang-hitam.png"
  ),
  createModel(
    "k3",
    "brad-v2-custom",
    "Brad-v2",
    "Kemeja",
    "/assets/katalog/Model Kemeja/Brad-v2/(brad v-2)warna hitam.png",
    "/assets/katalog/Model Kemeja/Brad-v2/navi belakang.png"
  ),
  createModel(
    "k1",
    "brad-v3-custom",
    "Brad-v3",
    "Kemeja",
    "/assets/katalog/Model Kemeja/Brad-V3/(brad v-3)hitam.png",
    "/assets/katalog/Model Kemeja/Brad-V3/hitam belakang.png"
  ),
  createModel(
    "k5",
    "brad-v4-custom",
    "Brad-v4",
    "Kemeja",
    "/assets/katalog/Model Kemeja/Brad-V4/brad v4 depan hitam.png",
    "/assets/katalog/Model Kemeja/Brad-V4/brad v4 hitam belakang.png"
  ),
  createModel(
    "k6",
    "ventura-custom",
    "Ventura",
    "Kemeja",
    "/assets/katalog/Model Kemeja/Ventura/Ventura Hitam.png",
    "/assets/katalog/Model Kemeja/Ventura/ventura hitam belakang.png"
  ),
  createModel(
    "k11",
    "yoroi-custom",
    "Yoroi",
    "Kemeja",
    "/assets/katalog/Model Kemeja/Yoroi/hitam.jpeg",
    "/assets/katalog/Model Kemeja/Yoroi/hitam belakang.png"
  ),
  createModel(
    "k10",
    "strazard-custom",
    "Strazard",
    "Kemeja",
    "/assets/katalog/Model Kemeja/Strazard/strazard-depan-hitam.jpeg",
    "/assets/katalog/Model Kemeja/Strazard/strazard-belakang-hitam.png"
  ),
  createModel(
    "k12",
    "executive-custom",
    "Executive Series",
    "Kemeja",
    "/assets/katalog/Model Kemeja/Executive Series/executive-depan-hitam.jpeg",
    "/assets/katalog/Model Kemeja/Executive Series/hitam belakang.png"
  ),
  createModel(
    "k8",
    "pdh-custom",
    "PDH",
    "Kemeja",
    "/assets/katalog/Model Kemeja/Pdh/Pdh Depan hitam.png",
    "/assets/katalog/Model Kemeja/Pdh/PDH hitam belakang.png"
  ),
  createModel(
    "j1",
    "jaket-custom",
    "Jacket",
    "Jaket",
    "/assets/katalog/jaket/jaket-depan-hitam.jpeg",
    "/assets/katalog/jaket/jaket-depan-hitam.jpeg"
  ),
  createModel(
    "r1",
    "rompi-tactical-custom",
    "Tactical Vest",
    "Rompi",
    "/assets/katalog/Rompi/Tactical Vest/Vest-hitam.jpeg",
    "/assets/katalog/Rompi/Tactical Vest/Vest-hitam.jpeg"
  ),
  createModel(
    "r2",
    "rompi-parasute-custom",
    "Vest Parasute",
    "Rompi",
    "/assets/katalog/Rompi/Parasute/Vest-parasute-1.jpeg",
    "/assets/katalog/Rompi/Parasute/Vest-parasute-2.jpeg"
  ),
  createModel(
    "c1",
    "warrior-custom",
    "Warrior",
    "Celana",
    "/assets/katalog/Celana/Warrior/warior-depan-hitam.jpeg",
    "/assets/katalog/Celana/Warrior/warior-belakang-hitam.jpeg"
  ),
  createModel(
    "c2",
    "armour-custom",
    "Armour",
    "Celana",
    "/assets/katalog/Celana/Armour/armour-depan-hitam.jpeg",
    "/assets/katalog/Celana/Armour/armour-depan-hitam.jpeg"
  ),
  createModel(
    "c3",
    "celana-bradwear-v3-custom",
    "Bradwear V3",
    "Celana",
    "/assets/katalog/Celana/Bradwear V3/bradwear V-3 coklat.jpeg",
    "/assets/katalog/Celana/Bradwear V3/bradwear v-3 abu.jpeg"
  ),
  createModel(
    "p1",
    "polo-custom",
    "Polo Shirt",
    "Polo",
    "/assets/katalog/Polo shirt/Kaospolo-hitam.png",
    "/assets/katalog/Polo shirt/Kaospolo-hitam.png"
  ),
];

export const DESIGN_ASSET_MAP: AssetResolverMap = {
  models: DESIGN_MODELS,
  colors: COLORS,
  catalogs: CATALOGS,
};

const MODEL_BY_SLUG = new Map(DESIGN_MODELS.map((item) => [item.slug, item]));
const MODEL_BY_NAME = new Map(DESIGN_MODELS.map((item) => [item.name.toLowerCase(), item]));

export function getModelBySlug(slug: string) {
  return MODEL_BY_SLUG.get(slug);
}

export function getModelByName(name?: string) {
  if (!name) return undefined;
  return MODEL_BY_NAME.get(name.toLowerCase());
}

export function getAvailableViews(category: DesignCategory): DesignViewLabel[] {
  return viewsByCategory(category);
}

export function findColorByHex(hex: string) {
  return COLORS.find((item) => item.hex.toLowerCase() === hex.toLowerCase());
}

export function findColorByName(name: string) {
  return COLORS.find((item) => item.name.toLowerCase() === name.toLowerCase());
}
