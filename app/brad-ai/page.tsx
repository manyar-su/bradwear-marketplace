import { BradAiPageChat } from "@/components/brad-ai-page-chat";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Brad AI untuk Konsultasi Pemesanan Kemeja dan Seragam Custom",
  description:
    "Gunakan Brad AI untuk bertanya seputar pemesanan kemeja, seragam kantor, seragam dinas, seragam komunitas, bahan, cara order, dan estimasi awal harga atau pengerjaan.",
  path: "/brad-ai",
  keywords: ["Brad AI", "pemesanan kemeja", "seragam kantor", "estimasi harga seragam"],
});

export default function BradAiPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", path: "/" },
          { name: "Brad AI", path: "/brad-ai" },
        ])}
      />
      <BradAiPageChat />
    </div>
  );
}
