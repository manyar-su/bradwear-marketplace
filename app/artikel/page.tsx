import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { ARTICLES } from "@/lib/articles";
import { articleListSchema, breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Artikel Pemesanan Kemeja, Seragam Kantor, Dinas, dan Komunitas",
  description:
    "Baca artikel SEO friendly seputar pemesanan kemeja custom, seragam kantor, seragam dinas, seragam komunitas, pilihan bahan, ukuran, dan proses produksi.",
  path: "/artikel",
  keywords: ["artikel seragam", "pemesanan kemeja", "seragam kantor", "konveksi seragam"],
});

export default function ArtikelPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", path: "/" },
          { name: "Artikel", path: "/artikel" },
        ])}
      />
      <JsonLd data={articleListSchema(ARTICLES)} />

      <section className="rounded-[40px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Artikel Bradflow</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-neutral-950">
          Konten untuk membantu pemesanan kemeja dan seragam custom lebih terarah
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-neutral-600 md:text-base">
          Kumpulan artikel ini membahas pemesanan kemeja, seragam kantor, seragam dinas, seragam komunitas, pemilihan bahan, ukuran, dan estimasi proses produksi dengan bahasa yang lebih praktis dan mudah dipahami.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {ARTICLES.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </section>
    </div>
  );
}
