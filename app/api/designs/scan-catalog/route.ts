import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentMarketplaceUser } from "@/lib/auth";
import { DESIGN_ASSET_MAP } from "@/lib/design-catalog";
import { parseScanText } from "@/lib/design-scan";
import { env } from "@/lib/env";

const scanSchema = z.object({
  imageDataUrl: z.string().min(30),
  material: z.string().optional(),
  model: z.string().optional(),
});

function extractTextFromProvider(payload: unknown): string {
  const data = payload as {
    choices?: Array<{
      message?: { content?: string | Array<{ type?: string; text?: string }> };
    }>;
  };
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    const textPart = content.find((item) => item?.type === "text" && item?.text);
    return (textPart?.text || "").trim();
  }
  return "";
}

export async function POST(request: Request) {
  const user = await getCurrentMarketplaceUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = scanSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Gambar scan tidak valid." }, { status: 400 });
    }

    const endpoint = env.ocrEndpoint || "https://ai.sumopod.com/v1/chat/completions";
    const model = env.ocrModel || "gemini/gemini-2.0-flash";
    const prompt =
      "Extract text from this catalog image. Return short plain text containing color name and color code only.";

    if (!env.ocrApiKey) {
      const fallback = parseScanText(parsed.data.imageDataUrl, DESIGN_ASSET_MAP.colors);
      return NextResponse.json(
        {
          ok: true,
          mode: "fallback_no_ai_key",
          result: {
            ...fallback,
            warnings: [
              "AI key belum di-set. Gunakan OCR endpoint agar hasil scan akurat.",
              ...fallback.warnings,
            ],
          },
        },
        { status: 200 }
      );
    }

    const providerRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.ocrApiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: parsed.data.imageDataUrl } },
            ],
          },
        ],
        temperature: 0,
      }),
    });

    if (!providerRes.ok) {
      const providerError = await providerRes.text();
      return NextResponse.json(
        {
          error: "OCR provider gagal merespons.",
          providerStatus: providerRes.status,
          providerError,
        },
        { status: 502 }
      );
    }

    const providerJson = (await providerRes.json()) as unknown;
    const extracted = extractTextFromProvider(providerJson);
    if (!extracted) {
      return NextResponse.json(
        { error: "Teks tidak terdeteksi dari gambar scan." },
        { status: 422 }
      );
    }

    const scanResult = parseScanText(extracted, DESIGN_ASSET_MAP.colors);
    return NextResponse.json({ ok: true, mode: "ai", result: scanResult }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
