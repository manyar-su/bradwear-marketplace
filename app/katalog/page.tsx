"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Filter, Search } from "lucide-react";

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  base_price: number;
  thumbnail_url: string;
  canvas_config?: {
    color?: string;
    label?: string;
  };
};

export default function KatalogPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [source, setSource] = useState("...");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      setItems(data.items || []);
      setSource(data.source || "unknown");
    })();
  }, []);

  const categories = ["Semua", ...Array.from(new Set(items.map((item) => item.category)))];
  const filtered = items.filter((item) => {
    const matchQuery = item.name.toLowerCase().includes(query.toLowerCase());
    const matchCategory = category === "Semua" || item.category === category;
    return matchQuery && matchCategory;
  });

  return (
    <div className="bg-[#f7f7f4]">
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <p className="text-sm font-semibold uppercase text-neutral-500">Koleksi</p>
          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black">Katalog Bradwear Custom</h1>
              <p className="mt-2 text-sm text-neutral-600">
                Pilih model, lanjutkan ke design studio, lalu checkout ke dashboard produksi.
              </p>
            </div>
            <span className="w-fit rounded-md bg-neutral-100 px-3 py-1 text-xs text-neutral-600">
              Source: {source}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="mb-5 flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-3 md:flex-row md:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              className="h-10 w-full rounded-md border border-neutral-200 bg-neutral-50 pl-10 pr-3 text-sm outline-none focus:border-neutral-500 focus:bg-white"
              placeholder="Cari model kemeja..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="h-4 w-4 shrink-0 text-neutral-500" />
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold ${
                  category === item
                    ? "bg-neutral-950 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((item) => (
            <Link key={item.id} href={`/desain/${item.slug}`} className="group overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <div className="relative h-72 bg-neutral-50 p-4">
                <span className="absolute left-3 top-3 rounded bg-lime-400 px-2 py-1 text-xs font-bold text-neutral-950">
                  {item.category}
                </span>
                <img
                  src={item.thumbnail_url}
                  alt={item.name}
                  className="h-full w-full object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 p-4">
                <p className="text-xs text-neutral-500">10+ warna S-4XL</p>
                <p className="min-h-12 font-bold">{item.name}</p>
                <p className="text-sm text-neutral-600">
                  Mulai Rp {item.base_price.toLocaleString("id-ID")}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-lime-700">
                  Desain Sekarang <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-600">
            Produk tidak ditemukan.
          </div>
        ) : null}
      </section>
    </div>
  );
}
