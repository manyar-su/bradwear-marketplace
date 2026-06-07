import { MapPin } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { STORE } from "@/lib/site-content";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Temukan Toko dan Lokasi Konsultasi Bradwear Tasikmalaya",
  description:
    "Buka alamat Bradwear di Google Maps untuk konsultasi kebutuhan pemesanan kemeja custom, seragam kantor, seragam dinas, dan seragam komunitas.",
  path: "/temukan-toko",
  keywords: ["temukan toko", "google maps", "seragam kantor", "kemeja custom tasikmalaya"],
});

export default function TemukanTokoPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", path: "/" },
          { name: "Temukan Toko", path: "/temukan-toko" },
        ])}
      />

      <section className="rounded-[40px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Temukan Toko</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-neutral-950">
          Lokasi konsultasi dan titik koordinasi Bradwear di Tasikmalaya
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-neutral-600 md:text-base">
          Gunakan halaman ini untuk membuka alamat kami langsung di Google Maps. Cocok bagi Anda yang ingin berdiskusi langsung mengenai pemesanan kemeja, seragam kantor, seragam dinas, atau seragam komunitas.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr,0.95fr]">
        <article className="rounded-[36px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3 text-emerald-700">
            <MapPin className="h-5 w-5" />
            <p className="text-sm font-semibold uppercase tracking-[0.22em]">Alamat Google Maps</p>
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-neutral-950">{STORE.name}</h2>
          <p className="mt-4 text-sm leading-8 text-neutral-600 md:text-base">{STORE.address}</p>
          <a
            href={STORE.googleMapsUrl}
            className="mt-6 inline-flex rounded-full bg-neutral-950 px-6 py-4 text-sm font-black text-white"
          >
            Buka di Google Maps
          </a>
        </article>
        <article className="rounded-[36px] border border-neutral-200 bg-[linear-gradient(135deg,#f3fbf6,#ffffff)] p-6 shadow-sm md:p-8">
          <h2 className="text-3xl font-black tracking-tight text-neutral-950">
            Cocok untuk konsultasi kebutuhan yang perlu briefing lebih detail
          </h2>
          <p className="mt-4 text-sm leading-8 text-neutral-600">
            Jika Anda membutuhkan diskusi lebih rinci tentang pemesanan kemeja custom, pilihan bahan, ukuran tim, atau kombinasi seragam kantor dan seragam lapangan, alamat ini bisa menjadi titik referensi untuk koordinasi lebih lanjut.
          </p>
        </article>
      </section>
    </div>
  );
}
