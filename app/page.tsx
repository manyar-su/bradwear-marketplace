import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, MapPin, Palette, Shirt, Truck } from "lucide-react";
import { fallbackProducts } from "@/lib/fallback-products";

const categories = [
  {
    title: "Brad V1",
    href: "/desain/brad-v1-custom",
    image: "/assets/katalog/Model Kemeja/Brad-v1/(brad v-1)navi.png",
  },
  {
    title: "Brad V2",
    href: "/desain/brad-v2-custom",
    image: "/assets/katalog/Model Kemeja/Brad-v2/(brad v-2)warna hitam.png",
  },
  {
    title: "Brad V3",
    href: "/desain/brad-v3-custom",
    image: "/assets/katalog/Model Kemeja/Brad-V3/(brad v-3)cream.png",
  },
  {
    title: "Jaket",
    href: "/desain/jaket-custom",
    image: "/assets/katalog/jaket/jaket-depan-navi.jpeg",
  },
  {
    title: "Celana",
    href: "/katalog",
    image: "/assets/katalog/Celana/Armour/armour-depan-hitam.jpeg",
  },
];

const colorCollections = [
  { name: "Oxford", image: "/assets/katalog/Katalog warna/Oxford/2. Oxford Sari Warna.jpg" },
  { name: "Nagata", image: "/assets/katalog/Katalog warna/Nagata/2. Nagata.jpg" },
  { name: "Ripstop", image: "/assets/katalog/Katalog warna/Ripstop/WhatsApp Image 2026-02-12 at 09.14.53.jpeg" },
  { name: "Soft Denim", image: "/assets/katalog/Katalog warna/Soft denim/WhatsApp Image 2026-02-12 at 09.13.31.jpeg" },
];

const partners = [
  "/assets/katalog/Logo our partner/GKL14_Kemendagri (Kementerian Dalam Negeri) - koleksilogo.com (1).png",
  "/assets/katalog/Logo our partner/GKL15_Tut Wuri Handayani - koleksilogo.com.png",
  "/assets/katalog/Logo our partner/GKL29_BMKG - Koleksilogo.com.png",
  "/assets/katalog/Logo our partner/Logo Kementerian Perhubungan Indonesia (Kemenhub)  (PNG-2160p) - Logopedia.png",
];

export default function Home() {
  return (
    <div className="bg-[#f7f7f4]">
      <section className="relative min-h-[560px] overflow-hidden bg-neutral-950 text-white">
        <img
          src="/assets/katalog/factory_hero.jpg"
          alt="Produksi Bradwear"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/15" />
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-16 md:px-6">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-lime-300">
              Custom kemeja satuan dan batch produksi
            </p>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              Bradwear Marketplace
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/80 md:text-lg">
              Pilih model, tentukan warna, desain logo atau teks, lalu pesanan langsung masuk ke dashboard produksi Bradwear.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/katalog"
                className="inline-flex items-center gap-2 rounded-md bg-lime-400 px-5 py-3 text-sm font-bold text-neutral-950 hover:bg-lime-300"
              >
                Belanja Koleksi <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/desain/brad-v2-custom"
                className="inline-flex items-center gap-2 rounded-md border border-white/40 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                Mulai Design Custom
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-0 px-4 md:grid-cols-4 md:px-6">
          {[
            { icon: Shirt, title: "Tidak ada minimum", text: "Pesan satuan atau produksi batch." },
            { icon: Clock3, title: "Flow cepat", text: "Data order masuk ke CS dashboard." },
            { icon: MapPin, title: "Produksi lokal", text: "Tim jahit dan kontrol produksi aktif." },
            { icon: BadgeCheck, title: "Model lengkap", text: "Brad V1, V2, V3, jaket, celana." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-3 border-neutral-100 py-4 md:border-r md:px-5">
                <Icon className="h-6 w-6 shrink-0 text-lime-600" />
                <div>
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="text-xs text-neutral-500">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-neutral-500">Kategori</p>
            <h2 className="text-2xl font-black">Pakaian Custom berdasarkan Model</h2>
          </div>
          <Link href="/katalog" className="hidden text-sm font-bold text-lime-700 hover:text-lime-800 md:inline">
            Lihat Semua
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {categories.map((item) => (
            <Link key={item.title} href={item.href} className="group overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <div className="h-40 bg-neutral-100 p-3 md:h-52">
                <img src={item.image} alt={item.title} className="h-full w-full object-contain transition-transform group-hover:scale-105" />
              </div>
              <div className="flex items-center justify-between p-3">
                <p className="text-sm font-bold">{item.title}</p>
                <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-lime-600" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-neutral-500">Paling Populer</p>
            <h2 className="text-2xl font-black">Model yang Sering Dipesan</h2>
          </div>
          <Link href="/katalog" className="hidden text-sm font-bold text-lime-700 hover:text-lime-800 md:inline">
            Lihat Semua
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fallbackProducts.map((item) => (
            <Link key={item.id} href={`/desain/${item.slug}`} className="group overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <div className="relative h-72 bg-neutral-50 p-4">
                <span className="absolute left-3 top-3 rounded bg-lime-400 px-2 py-1 text-xs font-bold text-neutral-950">
                  Custom
                </span>
                <img src={item.thumbnail_url} alt={item.name} className="h-full w-full object-contain transition-transform group-hover:scale-105" />
              </div>
              <div className="space-y-2 p-4">
                <p className="text-xs text-neutral-500">10+ warna S-4XL</p>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-neutral-600">Mulai Rp {item.base_price.toLocaleString("id-ID")}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-neutral-500">Warna Bahan</p>
              <h2 className="text-2xl font-black">Belanja Berdasarkan Warna</h2>
            </div>
            <Palette className="h-7 w-7 text-lime-600" />
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {colorCollections.map((item) => (
              <div key={item.name} className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
                <div className="h-48 bg-neutral-100">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-bold">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-[1.3fr,0.7fr] md:px-6">
        <div className="overflow-hidden rounded-lg bg-neutral-950 p-7 text-white md:p-10">
          <p className="text-sm font-semibold uppercase text-lime-300">Design Studio</p>
          <h2 className="mt-2 text-3xl font-black">Buat desain, download preview, lalu checkout.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
            Upload logo, tambahkan teks, dan simpan desain ke akun marketplace sebelum masuk ke dashboard produksi.
          </p>
          <Link href="/desain/brad-v2-custom" className="mt-6 inline-flex rounded-md bg-lime-400 px-5 py-3 text-sm font-bold text-neutral-950">
            Mulai Design Custom
          </Link>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <Truck className="h-8 w-8 text-lime-600" />
          <p className="mt-4 text-xl font-black">Order masuk otomatis</p>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Setelah checkout, data konsumen dan order masuk ke Supabase yang sama dengan dashboard Bradwear.
          </p>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="mb-5 text-center text-xl font-black">Dipercaya untuk kebutuhan seragam dan produksi</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {partners.map((src) => (
              <div key={src} className="grid h-24 place-items-center rounded-lg border border-neutral-100 bg-neutral-50 p-4">
                <img src={src} alt="Partner Bradwear" className="max-h-14 max-w-full object-contain grayscale" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
