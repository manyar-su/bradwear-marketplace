import { NextResponse } from "next/server";
import { fallbackProducts } from "@/lib/fallback-products";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { DESIGN_MODELS } from "@/lib/design-catalog";

function isAssetCatalogReady(items: Array<Record<string, unknown>>) {
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

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("marketplace_products")
      .select("id, slug, name, category, base_price, thumbnail_url, is_active, canvas_config")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ items: productsFallback, source: "fallback", warning: error.message });
    }
    const items = (data || []) as Array<Record<string, unknown>>;
    if (items.length === 0) {
      return NextResponse.json({ items: productsFallback, source: "fallback" });
    }
    if (!isAssetCatalogReady(items)) {
      return NextResponse.json({ items: productsFallback, source: "assets-fallback" });
    }
    return NextResponse.json({ items, source: "supabase" });
  } catch {
    return NextResponse.json({ items: productsFallback, source: "fallback" });
  }
}
