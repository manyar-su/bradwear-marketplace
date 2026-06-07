"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog";
import { getWhatsAppHref } from "@/lib/site-content";

type Props = {
  items: CatalogProduct[];
  title: string;
  description: string;
  allowFilter?: boolean;
  showSourceLabel?: boolean;
  source?: string;
  initialQuery?: string;
};

export function CatalogBrowser({
  items,
  title,
  description,
  allowFilter = true,
  showSourceLabel = false,
  source,
  initialQuery = "",
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("Semua");

  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(items.map((item) => item.category)))],
    [items]
  );

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const normalized = `${item.name} ${item.category}`.toLowerCase();
        const matchQuery = normalized.includes(query.toLowerCase());
        const matchCategory = category === "Semua" || item.category === category;
        return matchQuery && matchCategory;
      }),
    [category, items, query]
  );

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Katalog Bradflow</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-neutral-600 md:text-base">{description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={getWhatsAppHref()}
              className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white"
            >
              Konsultasi Pemesanan Kemeja
            </a>
            <Link
              href="/cara-order"
              className="rounded-full border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm font-semibold text-neutral-700"
            >
              Lihat Cara Order
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-neutral-200 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-12 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
              placeholder="Cari kemeja custom, seragam kantor, polo custom, jaket custom..."
            />
          </div>
          {showSourceLabel && source ? (
            <span className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Source {source}
            </span>
          ) : null}
        </div>

        {allowFilter ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  item === category
                    ? "bg-neutral-950 text-white"
                    : "border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-[30px] border border-neutral-200 bg-neutral-50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-72 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_40%),linear-gradient(160deg,#fafaf9,#eef8f2)]">
                <span className="absolute left-4 top-4 z-10 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
                  {item.category}
                </span>
                <Image
                  src={item.thumbnail_url}
                  alt={item.name}
                  fill
                  className="object-contain p-5 transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-4 bg-white p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Seragam custom untuk kantor, dinas, dan komunitas
                  </p>
                  <h2 className="mt-2 text-xl font-black text-neutral-950">{item.name}</h2>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">
                    Cocok untuk pemesanan kemeja, seragam kantor, seragam dinas, atau seragam komunitas dengan desain yang bisa disesuaikan kebutuhan tim Anda.
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Estimasi mulai</p>
                    <p className="text-lg font-black text-neutral-950">
                      Rp {item.base_price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <Link
                    href={`/desain/${item.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-3 text-sm font-bold text-white"
                  >
                    Mulai Design
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center text-sm text-neutral-600">
            Belum ada produk yang cocok dengan pencarian Anda. Coba kata kunci seperti `kemeja custom`, `seragam kantor`, atau `polo custom`.
          </div>
        ) : null}
      </section>
    </div>
  );
}
