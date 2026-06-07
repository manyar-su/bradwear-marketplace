import { FAQ_ITEMS, getWhatsAppHref } from "@/lib/site-content";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "FAQ Pemesanan Kemeja, Seragam Kantor, Dinas, dan Komunitas",
  description:
    "Baca FAQ Bradflow tentang pemesanan kemeja custom, seragam kantor, seragam dinas, seragam komunitas, konsultasi desain, estimasi harga, dan tracking pesanan.",
  path: "/faq",
  keywords: ["faq", "pemesanan kemeja", "seragam kantor", "seragam komunitas"],
});

export default function FaqPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
      <JsonLd data={faqSchema(FAQ_ITEMS)} />

      <section className="rounded-[40px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">FAQ</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-neutral-950">
          Pertanyaan umum seputar pemesanan kemeja dan seragam custom
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-neutral-600 md:text-base">
          FAQ ini dibuat agar calon pelanggan lebih cepat memahami alur pemesanan kemeja custom, seragam kantor, seragam dinas, seragam komunitas, serta penggunaan Brad AI dan tracking pesanan.
        </p>
      </section>

      <section className="grid gap-4">
        {FAQ_ITEMS.map((item) => (
          <article key={item.question} className="rounded-[30px] border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black tracking-tight text-neutral-950">{item.question}</h2>
            <p className="mt-3 text-sm leading-8 text-neutral-600">{item.answer}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[36px] border border-emerald-200 bg-[linear-gradient(135deg,#f3fbf6,#ffffff)] p-6 shadow-sm md:p-8">
        <h2 className="text-3xl font-black tracking-tight text-neutral-950">
          Masih ada pertanyaan khusus?
        </h2>
        <p className="mt-4 text-sm leading-8 text-neutral-600">
          Jika pertanyaan Anda belum terjawab di halaman FAQ ini, lanjutkan ke WhatsApp agar tim Bradwear membantu berdasarkan kebutuhan seragam kantor, dinas, atau komunitas yang lebih spesifik.
        </p>
        <a
          href={getWhatsAppHref()}
          className="mt-6 inline-flex rounded-full bg-neutral-950 px-6 py-4 text-sm font-black text-white"
        >
          Tanya via WhatsApp
        </a>
      </section>
    </div>
  );
}
