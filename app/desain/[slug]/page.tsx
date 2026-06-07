import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DesignStudio } from "@/components/design-studio";
import { fallbackProducts } from "@/lib/fallback-products";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getModelBySlug } from "@/lib/design-catalog";
import { buildMetadata } from "@/lib/seo";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const fallback =
    fallbackProducts.find((item) => item.slug === slug) ||
    getModelBySlug(slug);

  if (!fallback) {
    return buildMetadata({
      title: "Design Studio Seragam Custom",
      description:
        "Gunakan design studio Bradflow untuk menyiapkan pemesanan kemeja custom, seragam kantor, seragam dinas, dan seragam komunitas.",
      path: `/desain/${slug}`,
    });
  }

  const name = "name" in fallback ? fallback.name : slug;
  const image = "thumbnail_url" in fallback ? fallback.thumbnail_url : fallback.image;

  return buildMetadata({
    title: `${name} untuk Pemesanan Kemeja dan Seragam Custom`,
    description:
      `Buka design studio ${name} untuk pemesanan kemeja custom, seragam kantor, seragam dinas, atau seragam komunitas dengan brief desain yang lebih rapi.`,
    path: `/desain/${slug}`,
    keywords: ["pemesanan kemeja", "kemeja custom", "seragam kantor", name],
    image,
  });
}

export default async function DesainPage({ params }: Params) {
  const { slug } = await params;
  const modelFallback = getModelBySlug(slug);
  const fallback =
    fallbackProducts.find((item) => item.slug === slug) ||
    (modelFallback
      ? {
          id: modelFallback.id,
          slug: modelFallback.slug,
          name: modelFallback.name,
          category: modelFallback.category,
          base_price: modelFallback.basePrice || 0,
          thumbnail_url: modelFallback.image,
          canvas_config: { color: "#1A237E", label: modelFallback.name },
        }
      : fallbackProducts[0]);

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
      <section className="rounded-[28px] border border-neutral-200 bg-gradient-to-r from-neutral-950 via-slate-900 to-neutral-900 px-5 py-6 text-white md:px-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-300">Bradwear Custom Lab</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">Design Studio</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">
          Atur desain kemeja secara live seperti mockup Bradflow untuk pemesanan kemeja custom, seragam kantor, seragam dinas, dan seragam komunitas: ubah teks, upload logo, pilih warna dasar, lalu simpan atau lanjut checkout.
        </p>
      </section>
      <DesignStudio
        slug={product.slug}
        productName={product.name}
        color={product.canvas_config?.color || "#dbeafe"}
        productImage={product.thumbnail_url}
      />
    </div>
  );
}
