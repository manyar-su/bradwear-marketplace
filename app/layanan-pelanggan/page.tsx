import { Headset, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { FAQ_ITEMS, getWhatsAppHref } from "@/lib/site-content";
import { breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Layanan Pelanggan untuk Pemesanan Kemeja dan Seragam Custom",
  description:
    "Butuh bantuan pemesanan kemeja, seragam kantor, seragam dinas, atau seragam komunitas? Gunakan layanan pelanggan Bradflow untuk konsultasi produk, bahan, ukuran, dan estimasi awal.",
  path: "/layanan-pelanggan",
  keywords: ["layanan pelanggan", "pemesanan kemeja", "seragam kantor", "seragam komunitas"],
});

export default function LayananPelangganPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", path: "/" },
          { name: "Layanan Pelanggan", path: "/layanan-pelanggan" },
        ])}
      />
      <JsonLd data={faqSchema(FAQ_ITEMS.slice(0, 3))} />

      <section className="rounded-[40px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Layanan Pelanggan</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-neutral-950">
          Konsultasi pemesanan kemeja dan seragam custom jadi lebih jelas
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-neutral-600 md:text-base">
          Halaman layanan pelanggan ini membantu Anda yang sedang mencari pemesanan kemeja untuk seragam kantor, seragam dinas, seragam komunitas, polo custom, jaket custom, atau celana seragam. Anda bisa memilih jalur konsultasi yang paling nyaman sebelum order diproses.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={getWhatsAppHref()}
            className="rounded-full bg-neutral-950 px-6 py-4 text-sm font-black text-white"
          >
            Konsultasi via WhatsApp
          </a>
          <a
            href="/brad-ai"
            className="rounded-full border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm font-bold text-emerald-800"
          >
            Mulai dengan Brad AI
          </a>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          {
            icon: Headset,
            title: "Bantuan memilih produk",
            text: "Kami membantu Anda menentukan apakah kebutuhan lebih cocok menggunakan kemeja custom, polo custom, jaket custom, atau kombinasi paket seragam.",
          },
          {
            icon: ShieldCheck,
            title: "Brief lebih rapi",
            text: "Informasi seperti ukuran, warna, logo, dan target deadline bisa dirangkum lebih rapi agar estimasi awal lebih cepat diberikan.",
          },
          {
            icon: Sparkles,
            title: "AI plus human handoff",
            text: "Brad AI membantu penyaringan awal, lalu tim Bradwear menangani finalisasi penawaran, bahan, dan jadwal produksi.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-sm">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Icon className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-neutral-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">{item.text}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-[36px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Pertanyaan yang sering dibantu</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {FAQ_ITEMS.slice(0, 4).map((item) => (
            <article key={item.question} className="rounded-[24px] border border-neutral-200 bg-neutral-50 p-4">
              <h3 className="text-lg font-black tracking-tight text-neutral-950">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-600">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[36px] border border-emerald-200 bg-[linear-gradient(135deg,#f3fbf6,#ffffff)] p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">CTA</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950">
              Sampaikan kebutuhan seragam kantor, dinas, atau komunitas Anda sekarang
            </h2>
          </div>
          <a
            href={getWhatsAppHref()}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-4 text-sm font-black text-white"
          >
            <MessageSquareText className="h-4 w-4" />
            Buka WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
