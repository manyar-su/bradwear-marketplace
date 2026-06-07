import { TrackingLauncher } from "@/components/tracking-launcher";
import { JsonLd } from "@/components/json-ld";
import { TRACKING_CARRIERS } from "@/lib/site-content";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Lacak Pesanan JNE, J&T, dan Kurir Indonesia Lainnya",
  description:
    "Lacak pengiriman hasil pemesanan kemeja, seragam kantor, seragam dinas, dan seragam komunitas melalui halaman resmi JNE, J&T, SiCepat, AnterAja, Pos Indonesia, dan lainnya.",
  path: "/lacak-pesanan",
  keywords: ["lacak pesanan", "JNE", "J&T", "cek resi", "seragam kantor"],
});

export default function LacakPesananPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", path: "/" },
          { name: "Lacak Pesanan", path: "/lacak-pesanan" },
        ])}
      />
      <TrackingLauncher />
      <section className="grid gap-4 md:grid-cols-3">
        {TRACKING_CARRIERS.map((carrier) => (
          <article key={carrier.slug} className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black tracking-tight text-neutral-950">{carrier.name}</h2>
            <p className="mt-3 text-sm leading-7 text-neutral-600">{carrier.description}</p>
            <a
              href={carrier.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex text-sm font-bold text-emerald-700"
            >
              Buka tracker resmi
            </a>
          </article>
        ))}
      </section>
    </div>
  );
}
