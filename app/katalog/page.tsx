import { CatalogBrowser } from "@/components/catalog-browser";
import { JsonLd } from "@/components/json-ld";
import { getCatalogProducts } from "@/lib/catalog";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Katalog Kemeja Custom, Polo Custom, Jaket Custom, dan Celana Seragam",
  description:
    "Jelajahi katalog Bradflow untuk pemesanan kemeja custom, seragam kantor, seragam dinas, seragam komunitas, polo custom, jaket custom, dan celana seragam.",
  path: "/katalog",
  keywords: [
    "pemesanan kemeja",
    "kemeja custom",
    "polo custom",
    "jaket custom",
    "celana seragam",
    "seragam kantor",
  ],
});

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { items, source } = await getCatalogProducts();
  const params = await searchParams;

  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", path: "/" },
          { name: "Katalog", path: "/katalog" },
        ])}
      />
      <CatalogBrowser
        items={items}
        source={source}
        initialQuery={params.q || ""}
        showSourceLabel
        title="Katalog SEO Friendly untuk pemesanan kemeja, polo, jaket, dan celana seragam"
        description="Halaman katalog ini dirancang agar mudah ditemukan Google dan penelusuran AI untuk pencarian produk seperti kemeja custom, seragam kantor, seragam dinas, seragam komunitas, polo custom, jaket custom, dan celana seragam."
      />
    </div>
  );
}
