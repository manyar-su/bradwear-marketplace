import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HowItWorksParallax } from "@/components/how-it-works-parallax";
import { JsonLd } from "@/components/json-ld";
import { getWhatsAppHref } from "@/lib/site-content";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cara Order Kemeja Custom untuk Seragam Kantor, Dinas, dan Komunitas",
  description:
    "Pelajari cara order pemesanan kemeja custom, seragam kantor, seragam dinas, dan seragam komunitas lewat website Bradflow dengan alur yang mudah dipahami.",
  path: "/cara-order",
  keywords: ["cara order", "pemesanan kemeja", "seragam kantor", "seragam dinas"],
});

export default function CaraOrderPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", path: "/" },
          { name: "Cara Order", path: "/cara-order" },
        ])}
      />

      <section className="rounded-[40px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Cara Order</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-neutral-950">
          Cara order pemesanan kemeja yang lebih mudah dipahami pengguna
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-neutral-600 md:text-base">
          Halaman ini dirancang untuk membantu pengguna memahami alur pemesanan kemeja custom, seragam kantor, seragam dinas, dan seragam komunitas dengan penjelasan yang visual, ringkas, dan tetap SEO friendly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/katalog"
            className="rounded-full bg-neutral-950 px-6 py-4 text-sm font-black text-white"
          >
            Jelajahi Katalog
          </Link>
          <a
            href={getWhatsAppHref()}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm font-bold text-emerald-800"
          >
            Konsultasi Order
          </a>
        </div>
      </section>

      <HowItWorksParallax />

      <section className="rounded-[36px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-3xl font-black tracking-tight text-neutral-950">
          Rekomendasi alur tercepat untuk seragam kantor dan seragam dinas
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            "Mulai dari kategori produk agar pilihan model lebih terarah.",
            "Kirim jumlah, deadline, dan gambaran logo agar estimasi awal lebih cepat.",
            "Lanjutkan ke WhatsApp untuk penawaran final dan penjadwalan produksi.",
          ].map((item) => (
            <div key={item} className="rounded-[24px] border border-neutral-200 bg-neutral-50 p-4 text-sm leading-7 text-neutral-600">
              {item}
            </div>
          ))}
        </div>
        <Link
          href="/layanan-pelanggan"
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
        >
          Buka layanan pelanggan
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
