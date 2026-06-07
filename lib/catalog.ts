import { cache } from "react";
import { DESIGN_MODELS } from "@/lib/design-catalog";
import { fallbackProducts } from "@/lib/fallback-products";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  base_price: number;
  thumbnail_url: string;
  canvas_config?: {
    color?: string;
    label?: string;
  };
};

function isAssetCatalogReady(items: CatalogProduct[]) {
  return items.every((item) => String(item.thumbnail_url || "").startsWith("/assets/katalog/"));
}

const localCatalogProducts = DESIGN_MODELS.map((item, index) => ({
  id: `local-${index + 1}`,
  slug: item.slug,
  name: `${item.name} Custom`,
  category: item.category,
  base_price: 0,
  thumbnail_url: item.image,
  canvas_config: {
    color: "#1A237E",
    label: item.name,
  },
}));

const productsFallback = [...localCatalogProducts, ...fallbackProducts];

export const getCatalogProducts = cache(async (): Promise<{
  items: CatalogProduct[];
  source: string;
}> => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("marketplace_products")
      .select("id, slug, name, category, base_price, thumbnail_url, is_active, canvas_config")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) {
      return { items: productsFallback, source: "fallback" };
    }

    const items = ((data || []) as CatalogProduct[]).map((item) => ({
      ...item,
      category: normalizeCategory(item.category),
    }));

    if (items.length === 0 || !isAssetCatalogReady(items)) {
      return { items: productsFallback, source: "fallback" };
    }

    return { items, source: "supabase" };
  } catch {
    return { items: productsFallback, source: "fallback" };
  }
});

export function normalizeCategory(category: string) {
  if (category.toLowerCase().includes("kemeja")) return "Kemeja";
  if (category.toLowerCase().includes("outerwear")) return "Jaket";
  if (category.toLowerCase().includes("polo")) return "Polo";
  if (category.toLowerCase().includes("celana")) return "Celana";
  return category;
}

export function getProductsForLanding(slugs: string[], items: CatalogProduct[]) {
  const slugSet = new Set(slugs);
  return items.filter((item) => slugSet.has(item.slug));
}
