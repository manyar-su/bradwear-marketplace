import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentMarketplaceUser } from "@/lib/auth";
import { uploadDataUrl } from "@/lib/cloudinary";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const schema = z.object({
  productId: z.string().min(1),
  designDataUrl: z.string().min(20),
  designJson: z.record(z.string(), z.any()).optional(),
});

const v2Schema = z.object({
  schema_version: z.literal("bradmock_v2"),
  productSlug: z.string().min(1),
  productName: z.string().min(1),
  category: z.enum(["Kemeja", "Polo", "Jaket", "Celana", "Rompi"]),
  material: z.string().min(1),
  color: z.string().min(1),
  view: z.enum(["Depan", "Belakang", "Kanan", "Kiri"]),
  elements: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["text", "image"]),
      content: z.string(),
      pos: z.object({ x: z.number(), y: z.number() }),
      scale: z.number(),
      view: z.enum(["Depan", "Belakang", "Kanan", "Kiri"]),
      color: z.string().optional(),
    })
  ),
  orderItems: z.array(
    z.object({
      id: z.string(),
      modelSlug: z.string(),
      modelName: z.string(),
      colorHex: z.string(),
      colorCode: z.string(),
      size: z.string(),
      gender: z.enum(["Pria", "Wanita"]),
      sleeve: z.enum(["Panjang", "Pendek"]),
      qty: z.number(),
      note: z.string().optional(),
    })
  ),
  scanMetadata: z
    .object({
      rawText: z.string(),
      normalizedColorName: z.string().nullable(),
      normalizedColorHex: z.string().nullable(),
      colorCode: z.string().nullable(),
      confidence: z.number(),
      warnings: z.array(z.string()),
    })
    .nullable()
    .optional(),
});

export async function POST(request: Request) {
  const user = await getCurrentMarketplaceUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Data desain tidak valid." }, { status: 400 });
    }

    const rawDesignJson = parsed.data.designJson || {};
    const parsedV2 = v2Schema.safeParse(rawDesignJson);
    const storedFormat = parsedV2.success ? "bradmock_v2" : "legacy";
    const finalDesignJson = parsedV2.success
      ? parsedV2.data
      : {
          ...rawDesignJson,
          schema_version: "legacy",
        };

    const upload = await uploadDataUrl(
      parsed.data.designDataUrl,
      `bradwear-marketplace/designs/${user.id}`
    );

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("marketplace_designs")
      .insert([
        {
          user_id: user.id,
          product_id: parsed.data.productId,
          design_url: upload.secureUrl,
          preview_url: upload.secureUrl,
          design_json: finalDesignJson,
          is_downloaded: false,
        },
      ] as unknown as never[])
      .select("id, design_url, preview_url, design_json")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Gagal menyimpan desain." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, item: data, stored_format: storedFormat }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
