import { notFound } from "next/navigation";
import { CatalogBrowser } from "@/components/catalog-browser";
import { JsonLd } from "@/components/json-ld";
import { getCatalogProducts, getProductsForLanding } from "@/lib/catalog";
import { CATEGORY_PAGES } from "@/lib/site-content";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return CATEGORY_PAGES.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = CATEGORY_PAGES.find((item) => item.slug === slug);
  if (!page) return {};

  return buildMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: page.href,
    keywords: page.keywords,
    image: page.heroImage,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const page = CATEGORY_PAGES.find((item) => item.slug === slug);
  if (!page) notFound();

  const { items } = await getCatalogProducts();
  const categoryItems = getProductsForLanding(page.productSlugs, items);

  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", path: "/" },
          { name: "Kategori", path: "/katalog" },
          { name: page.label, path: page.href },
        ])}
      />
      <CatalogBrowser
        items={categoryItems}
        allowFilter={false}
        title={page.heroTitle}
        description={page.heroDescription}
      />
    </div>
  );
}
