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
          design_json: parsed.data.designJson || {},
          is_downloaded: false,
        },
      ] as unknown as never[])
      .select("id, design_url, preview_url")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Gagal menyimpan desain." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, item: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
