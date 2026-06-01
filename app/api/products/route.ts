import { NextResponse } from "next/server";
import { fallbackProducts } from "@/lib/fallback-products";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("marketplace_products")
      .select("id, slug, name, category, base_price, thumbnail_url, is_active, canvas_config")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ items: fallbackProducts, source: "fallback", warning: error.message });
    }
    const items = (data || []) as Array<Record<string, unknown>>;
    if (items.length === 0) {
      return NextResponse.json({ items: fallbackProducts, source: "fallback" });
    }
    return NextResponse.json({ items, source: "supabase" });
  } catch {
    return NextResponse.json({ items: fallbackProducts, source: "fallback" });
  }
}

