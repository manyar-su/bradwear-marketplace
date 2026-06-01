import { notFound } from "next/navigation";
import { DesignStudio } from "@/components/design-studio";
import { fallbackProducts } from "@/lib/fallback-products";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type Params = {
  params: Promise<{ slug: string }>;
};

export default async function DesainPage({ params }: Params) {
  const { slug } = await params;
  const fallback = fallbackProducts.find((item) => item.slug === slug) || fallbackProducts[0];

  let product = fallback;
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("marketplace_products")
      .select("id, slug, name, category, base_price, thumbnail_url, canvas_config")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    if (data) {
      const row = data as {
        slug: string;
        name: string;
        category: string;
        base_price: number;
        thumbnail_url: string;
        canvas_config: { color?: string } | null;
      };
      product = {
        ...product,
        ...row,
        canvas_config: { ...(product.canvas_config || {}), ...(row.canvas_config || {}) },
      };
    }
  } catch {
    // fallback used
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Design Studio</h1>
      <p className="text-sm text-slate-600">
        Atur desain kemeja Anda. Setelah selesai, download atau langsung checkout.
      </p>
      <DesignStudio
        slug={product.slug}
        productName={product.name}
        color={product.canvas_config?.color || "#dbeafe"}
      />
    </div>
  );
}
