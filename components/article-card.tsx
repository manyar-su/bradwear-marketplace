import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/lib/articles";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="overflow-hidden rounded-[30px] border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-56 bg-neutral-100">
        <Image src={article.heroImage} alt={article.title} fill className="object-cover" />
      </div>
      <div className="space-y-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            {article.category}
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-neutral-950">
            {article.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-neutral-600">{article.excerpt}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{article.publishedAt}</p>
          <Link
            href={`/artikel/${article.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-3 text-sm font-bold text-white"
          >
            Baca Artikel
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
