import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Bot, Layers3, MapPin, MessageCircleMore, Palette, Shirt, Sparkles, Truck } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { getCatalogProducts, getProductsForLanding } from "@/lib/catalog";
import { ARTICLES } from "@/lib/articles";
import { FAQ_ITEMS, HOME_USE_CASES, STORE, CATEGORY_PAGES, getWhatsAppHref } from "@/lib/site-content";
import { breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Bradflow untuk Pemesanan Kemeja, Seragam Kantor, Dinas, dan Komunitas",
  description:
    "Bradflow adalah website pemesanan kemeja custom yang memudahkan seragam kantor, seragam dinas, seragam komunitas, polo custom, jaket custom, dan celana seragam dengan CTA konsultasi yang jelas.",
  path: "/",
  keywords: [
    "pemesanan kemeja",
    "kemeja custom",
    "seragam kantor",
    "seragam dinas",
    "seragam komunitas",
    "konveksi seragam",
    "polo custom",
    "jaket custom",
    "celana seragam",
  ],
  image: "/assets/katalog/factory_hero.jpg",
});

export default async function HomePage() {
  const { items } = await getCatalogProducts();
  const featuredKemeja = getProductsForLanding(CATEGORY_PAGES[0].productSlugs.slice(0, 4), items);
  const featuredOuterwear = getProductsForLanding(CATEGORY_PAGES[1].productSlugs, items);
  const featuredArticles = ARTICLES.slice(0, 3);

  return (
    <div className="space-y-12 pb-16">
      <JsonLd data={breadcrumbSchema([{ name: "Beranda", path: "/" }])} />
      <JsonLd data={faqSchema(FAQ_ITEMS.slice(0, 4))} />

      <section className="relative overflow-hidden rounded-[40px] bg-neutral-950 text-white">
        <div className="absolute inset-0">
          <Image
            src="/assets/katalog/factory_hero.jpg"
            alt="Produksi seragam custom Bradflow"
            fill
            className="object-cover opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.92),rgba(0,0,0,0.62),rgba(0,0,0,0.45))]" />
        </div>
        <div className="relative grid gap-8 px-6 py-14 md:px-10 md:py-20 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Pemesanan kemeja, seragam kantor, seragam dinas, dan seragam komunitas
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
              Website pemesanan kemeja custom untuk identitas tim yang lebih profesional
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-white/78 md:text-base">
              Bradflow membantu Anda mengelola pemesanan kemeja custom, polo custom, jaket custom, dan celana seragam dengan alur yang lebih mudah. Cocok untuk kebutuhan seragam kantor, seragam dinas, dan seragam komunitas yang ingin tampil rapi, konsisten, dan siap diproduksi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={getWhatsAppHref()}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-4 text-sm font-black text-neutral-950"
              >
                Konsultasi Pemesanan Kemeja Seragam
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/desain/brad-v2-custom"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-4 text-sm font-bold text-white"
              >
                Mulai Design Custom
              </Link>
              <Link
                href="/brad-ai"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/15 px-6 py-4 text-sm font-bold text-emerald-100"
              >
                <Bot className="h-4 w-4" />
                Tanya Brad AI
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            {HOME_USE_CASES.map((item) => (
              <article key={item.title} className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">Use Case</p>
                <h2 className="mt-3 text-2xl font-black tracking-tight">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/72">{item.description}</p>
                <Link
                  href={item.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-200"
                >
                  {item.ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          {
            icon: Shirt,
            title: "Kemeja dan seragam custom",
            text: "Pilih model untuk pemesanan kemeja, polo custom, jaket custom, atau celana seragam dalam satu alur.",
          },
          {
            icon: Palette,
            title: "Bahan dan warna lebih fleksibel",
            text: "Tentukan bahan untuk seragam kantor, seragam dinas, dan seragam komunitas dengan brief yang lebih rapi.",
          },
          {
            icon: Truck,
            title: "Lacak pesanan lebih mudah",
            text: "Akses halaman lacak pesanan untuk JNE, J&T, SiCepat, AnterAja, dan kurir Indonesia lainnya.",
          },
          {
            icon: MessageCircleMore,
            title: "Konsultasi cepat",
            text: "Gunakan WhatsApp atau Brad AI untuk estimasi awal sebelum penawaran final dikonfirmasi tim produksi.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Icon className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-xl font-black tracking-tight text-neutral-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">{item.text}</p>
            </article>
          );
        })}
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Kategori Prioritas SEO</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950">
              Temukan kategori produk yang paling sering dicari pelanggan
            </h2>
          </div>
          <Link href="/katalog" className="text-sm font-bold text-emerald-700">
            Lihat semua koleksi
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {CATEGORY_PAGES.map((item) => (
            <article key={item.slug} className="overflow-hidden rounded-[30px] border border-neutral-200 bg-white shadow-sm">
              <div className="relative h-56 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_32%),linear-gradient(160deg,#fafaf9,#eef8f2)]">
                <Image src={item.heroImage} alt={item.label} fill className="object-contain p-5" />
              </div>
              <div className="space-y-3 p-5">
                <h3 className="text-2xl font-black tracking-tight text-neutral-950">{item.label}</h3>
                <p className="text-sm leading-7 text-neutral-600">{item.description}</p>
                <Link href={item.href} className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
                  Jelajahi kategori
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-[36px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Pemesanan kemeja populer</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950">
            Model kemeja custom yang sering dipilih untuk seragam kantor dan seragam dinas
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {featuredKemeja.map((item) => (
              <article key={item.slug} className="overflow-hidden rounded-[28px] border border-neutral-200 bg-neutral-50">
                <div className="relative h-64">
                  <Image src={item.thumbnail_url} alt={item.name} fill className="object-contain p-5" />
                </div>
                <div className="space-y-3 bg-white p-5">
                  <h3 className="text-xl font-black tracking-tight text-neutral-950">{item.name}</h3>
                  <p className="text-sm leading-7 text-neutral-600">
                    Cocok untuk seragam kantor, seragam dinas, dan kebutuhan pemesanan kemeja custom yang ingin tetap terlihat formal.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-neutral-950">
                      Mulai Rp {item.base_price.toLocaleString("id-ID")}
                    </span>
                    <Link href={`/desain/${item.slug}`} className="text-sm font-bold text-emerald-700">
                      Mulai desain
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <article className="rounded-[36px] border border-neutral-200 bg-neutral-950 p-6 text-white shadow-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">CTA Utama</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              Minta estimasi seragam kantor, seragam dinas, atau seragam komunitas
            </h2>
            <p className="mt-4 text-sm leading-8 text-white/75">
              Jelaskan jumlah tim, kategori produk, kebutuhan bordir atau logo, dan target deadline. Tim kami akan membantu menyusun arah desain dan estimasi awal secara lebih terstruktur.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={getWhatsAppHref()}
                className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-black text-neutral-950"
              >
                Konsultasi via WhatsApp
              </a>
              <Link
                href="/brad-ai"
                className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white"
              >
                Tanya Brad AI
              </Link>
            </div>
          </article>

          <article className="rounded-[36px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Temukan Toko</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-neutral-950">
              Kunjungi titik konsultasi dan lokasi operasional kami di Tasikmalaya
            </h2>
            <p className="mt-4 text-sm leading-8 text-neutral-600">
              {STORE.address}
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-neutral-700">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <a href={STORE.googleMapsUrl} className="text-emerald-700">
                Buka alamat di Google Maps
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="rounded-[40px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Outerwear dan lapangan</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950">
              Jaket custom, vest lapangan, dan rompi kerja untuk operasional yang lebih siap
            </h2>
            <p className="mt-4 text-sm leading-8 text-neutral-600">
              Selain pemesanan kemeja, Bradflow juga mendukung kebutuhan outerwear untuk tim lapangan, panitia event, dan seragam komunitas yang membutuhkan mobilitas tinggi.
            </p>
          </div>
          <Link href="/kategori/jacket-hoodies" className="text-sm font-bold text-emerald-700">
            Lihat kategori outerwear
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {featuredOuterwear.map((item) => (
            <article key={item.slug} className="overflow-hidden rounded-[28px] border border-neutral-200 bg-neutral-50">
              <div className="relative h-64">
                <Image src={item.thumbnail_url} alt={item.name} fill className="object-contain p-5" />
              </div>
              <div className="space-y-3 bg-white p-5">
                <h3 className="text-xl font-black tracking-tight text-neutral-950">{item.name}</h3>
                <p className="text-sm leading-7 text-neutral-600">
                  Relevan untuk seragam dinas, operasional lapangan, dan kebutuhan seragam komunitas dengan karakter visual yang lebih kuat.
                </p>
                <Link href={`/desain/${item.slug}`} className="text-sm font-bold text-emerald-700">
                  Buka desain produk
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.95fr,1.05fr]">
        <article className="rounded-[36px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Cara Order</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950">
            Pelajari langkah pemesanan kemeja custom agar briefing ke tim produksi lebih cepat
          </h2>
          <div className="mt-6 space-y-4">
            {[
              "Pilih kategori produk sesuai kebutuhan seragam kantor, dinas, atau komunitas.",
              "Eksplorasi model, simpan brief, dan tentukan bahan atau warna yang paling sesuai.",
              "Konsultasikan estimasi harga, ukuran tim, dan deadline melalui Brad AI atau WhatsApp.",
            ].map((item, index) => (
              <div key={item} className="flex gap-4 rounded-[28px] bg-neutral-50 px-4 py-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-950 text-sm font-black text-white">
                  0{index + 1}
                </span>
                <p className="text-sm leading-7 text-neutral-600">{item}</p>
              </div>
            ))}
          </div>
          <Link
            href="/cara-order"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white"
          >
            Lihat Cara Order Lengkap
            <Layers3 className="h-4 w-4" />
          </Link>
        </article>

        <article className="rounded-[36px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">FAQ Ringkas</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950">
            Pertanyaan yang sering muncul sebelum order seragam custom
          </h2>
          <div className="mt-6 space-y-4">
            {FAQ_ITEMS.slice(0, 4).map((item) => (
              <div key={item.question} className="rounded-[24px] border border-neutral-200 bg-neutral-50 px-4 py-4">
                <p className="font-bold text-neutral-950">{item.question}</p>
                <p className="mt-2 text-sm leading-7 text-neutral-600">{item.answer}</p>
              </div>
            ))}
          </div>
          <Link href="/faq" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
            Buka halaman FAQ lengkap
            <ArrowRight className="h-4 w-4" />
          </Link>
        </article>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Artikel SEO Friendly</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950">
              Konten informatif seputar pemesanan kemeja dan seragam custom
            </h2>
          </div>
          <Link href="/artikel" className="text-sm font-bold text-emerald-700">
            Lihat semua artikel
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {featuredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <section className="rounded-[40px] border border-emerald-200 bg-[linear-gradient(135deg,#f3fbf6,#ffffff)] p-6 shadow-sm md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr,0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">CTA Penutup</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950">
              Siap mulai pemesanan kemeja untuk seragam kantor, dinas, atau komunitas?
            </h2>
            <p className="mt-4 text-sm leading-8 text-neutral-600">
              Gunakan Brad AI untuk penyaringan kebutuhan awal, lalu teruskan ke konsultasi WhatsApp agar estimasi harga, bahan, dan timeline produksi bisa dibahas lebih akurat bersama tim Bradwear.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <a
              href={getWhatsAppHref()}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-4 text-sm font-black text-white"
            >
              <BadgeCheck className="h-4 w-4" />
              Minta Estimasi Sekarang
            </a>
            <Link
              href="/brad-ai"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm font-bold text-emerald-800"
            >
              <Sparkles className="h-4 w-4" />
              Mulai dengan Brad AI
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
