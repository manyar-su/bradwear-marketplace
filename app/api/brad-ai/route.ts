import { NextResponse } from "next/server";
import { z } from "zod";
import { ARTICLES } from "@/lib/articles";
import { CATEGORY_PAGES, FAQ_ITEMS, STORE, CONTACT } from "@/lib/site-content";

const schema = z.object({
  message: z.string().min(2),
});

function buildContextPrompt() {
  const categories = CATEGORY_PAGES.map(
    (item) => `- ${item.label}: ${item.description}`
  ).join("\n");
  const faqs = FAQ_ITEMS.map((item) => `Q: ${item.question}\nA: ${item.answer}`).join("\n\n");
  const articleTopics = ARTICLES.map((article) => `- ${article.title}`).join("\n");

  return `
Anda adalah Brad AI untuk website Bradflow.

Konteks bisnis:
- Website membantu pemesanan kemeja custom, seragam kantor, seragam dinas, seragam komunitas, polo custom, jaket custom, dan celana seragam.
- Lokasi referensi: ${STORE.address}
- Kontak utama WhatsApp: ${CONTACT.phoneDisplay}

Kategori utama:
${categories}

FAQ penting:
${faqs}

Topik artikel:
${articleTopics}

Aturan jawaban:
- Jawab dalam bahasa Indonesia yang natural, hangat, dan informatif.
- Fokus hanya pada konteks website, produk, bahan, pemesanan, pelacakan, lokasi, dan konsultasi.
- Jika user menanyakan estimasi harga atau waktu pengerjaan, berikan hanya estimasi indikatif, bukan janji final.
- Untuk estimasi, sebutkan bahwa angka final bergantung pada jumlah, bahan, ukuran, detail logo, dan deadline.
- Selalu arahkan user ke WhatsApp untuk finalisasi penawaran atau jadwal produksi.
- Jangan mengarang data teknis yang tidak ada. Jika tidak yakin, katakan perlu dikonfirmasi tim Bradwear.
- Jangan menyebut diri Anda sebagai model umum. Anda adalah Brad AI di website Bradflow.
`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Pesan untuk Brad AI tidak valid." }, { status: 400 });
    }

    const apiKey = process.env.SUMOPOD_API_KEY;
    const baseUrl = process.env.SUMOPOD_BASE_URL || "https://ai.sumopod.com";
    const model = process.env.SUMOPOD_MODEL || "gemini/gemini-2.5-flash-lite";

    if (!apiKey) {
      return NextResponse.json(
        {
          reply:
            "Brad AI belum aktif di server ini. Untuk konsultasi tercepat, silakan lanjut ke WhatsApp tim Bradwear agar kebutuhan seragam Anda dibantu langsung.",
        },
        { status: 200 }
      );
    }

    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        messages: [
          { role: "system", content: buildContextPrompt() },
          { role: "user", content: parsed.data.message },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: `Brad AI gagal merespons: ${errorText}`,
        },
        { status: 502 }
      );
    }

    const payload = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string | Array<{ type?: string; text?: string }>;
        };
      }>;
    };

    const content = payload.choices?.[0]?.message?.content;
    let reply = "";

    if (typeof content === "string") {
      reply = content.trim();
    } else if (Array.isArray(content)) {
      reply = content
        .map((item) => item.text || "")
        .join(" ")
        .trim();
    }

    if (!reply) {
      reply =
        "Saya bisa bantu menjelaskan kebutuhan pemesanan kemeja, seragam kantor, bahan, dan estimasi awal. Jika Anda ingin penawaran final, silakan lanjutkan ke WhatsApp tim Bradwear.";
    }

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
