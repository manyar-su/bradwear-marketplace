import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { getArticleBySlug } from "@/lib/articles";
import { buildMetadata, articleSchema, breadcrumbSchema } from "@/lib/seo";
import { getWhatsAppHref } from "@/lib/site-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { ARTICLES } = await import("@/lib/articles");
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `/artikel/${article.slug}`,
    keywords: article.keywords,
    image: article.heroImage,
  });
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article className="space-y-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", path: "/" },
          { name: "Artikel", path: "/artikel" },
          { name: article.title, path: `/artikel/${article.slug}` },
        ])}
      />
      <JsonLd data={articleSchema(article)} />

      <header className="rounded-[40px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">{article.category}</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight text-neutral-950">
          {article.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-neutral-600 md:text-base">
          {article.description}
        </p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
          Dipublikasikan {article.publishedAt}
        </p>
      </header>

      <div className="relative h-[340px] overflow-hidden rounded-[36px] border border-neutral-200 bg-white shadow-sm">
        <Image src={article.heroImage} alt={article.title} fill className="object-cover" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,0.34fr]">
        <div className="space-y-6">
          {article.sections.map((section) => (
            <section key={section.heading} className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-3xl font-black tracking-tight text-neutral-950">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-sm leading-8 text-neutral-600 md:text-base">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-[36px] border border-emerald-200 bg-[linear-gradient(135deg,#f3fbf6,#ffffff)] p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">CTA Artikel</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950">
              {article.ctaTitle}
            </h2>
            <p className="mt-4 text-sm leading-8 text-neutral-600 md:text-base">{article.ctaBody}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={getWhatsAppHref()}
                className="rounded-full bg-neutral-950 px-6 py-4 text-sm font-black text-white"
              >
                Konsultasi via WhatsApp
              </a>
              <Link
                href="/katalog"
                className="rounded-full border border-neutral-200 bg-white px-6 py-4 text-sm font-bold text-neutral-700"
              >
                Lihat Katalog
              </Link>
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-[32px] border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Kata kunci utama</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {article.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-600"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </section>
          <section className="rounded-[32px] border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Aksi cepat</p>
            <div className="mt-4 space-y-3 text-sm font-bold">
              <Link href="/cara-order" className="block rounded-2xl bg-neutral-50 px-4 py-3 text-neutral-700">
                Pelajari cara order
              </Link>
              <Link href="/faq" className="block rounded-2xl bg-neutral-50 px-4 py-3 text-neutral-700">
                Buka FAQ
              </Link>
              <Link href="/brad-ai" className="block rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-800">
                Tanya Brad AI
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </article>
  );
}
