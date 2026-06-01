import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentMarketplaceUser } from "@/lib/auth";
import { uploadDataUrl } from "@/lib/cloudinary";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const schema = z.object({
  productId: z.string().min(1),
  designId: z.string().optional(),
  designDataUrl: z.string().optional(),
  designJson: z.record(z.string(), z.any()).optional(),
  fullName: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email(),
  address: z.string().min(8),
  notes: z.string().optional(),
  qty: z.number().int().min(1),
  warna: z.string().min(2),
  model: z.string().min(2),
  sizeDetails: z.array(z.object({ size: z.string(), qty: z.number().int().min(0) })),
  paymentProofDataUrl: z.string().optional(),
});

function generateOrderCode() {
  const seed = Date.now().toString().slice(-6);
  return `MKT-${seed}`;
}

export async function POST(request: Request) {
  const user = await getCurrentMarketplaceUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Data checkout tidak lengkap." }, { status: 400 });
    }

    const payload = parsed.data;
    const supabase = getSupabaseAdmin();
    const kodeBarang = generateOrderCode();

    let designUrl: string | null = null;
    let designId: string | null = payload.designId || null;

    if (designId) {
      const { data: designRow } = await supabase
        .from("marketplace_designs")
        .select("id, design_url")
        .eq("id", designId)
        .eq("user_id", user.id)
        .maybeSingle();
      const selected = (designRow || null) as { id: string; design_url: string } | null;
      designUrl = selected?.design_url || null;
    }

    if (!designUrl && payload.designDataUrl) {
      const upload = await uploadDataUrl(
        payload.designDataUrl,
        `bradwear-marketplace/designs/${user.id}`
      );
      designUrl = upload.secureUrl;

      const { data: insertedDesign } = await supabase
        .from("marketplace_designs")
        .insert([
          {
            user_id: user.id,
            product_id: payload.productId,
            design_url: upload.secureUrl,
            preview_url: upload.secureUrl,
            design_json: payload.designJson || { generated_from: "checkout" },
            is_downloaded: false,
          },
        ] as unknown as never[])
        .select("id")
        .single();
      const inserted = (insertedDesign || null) as { id: string } | null;
      designId = inserted?.id || null;
    }

    let paymentProofUrl: string | null = null;
    if (payload.paymentProofDataUrl) {
      const upload = await uploadDataUrl(
        payload.paymentProofDataUrl,
        `bradwear-marketplace/payment-proof/${user.id}`
      );
      paymentProofUrl = upload.secureUrl;
    }

    const { data: konsumenData, error: konsumenError } = await supabase
      .from("konsumen")
      .insert([
        {
          kode_barang: kodeBarang,
          nama: payload.fullName,
          telepon: payload.phone,
          email: payload.email,
          alamat: payload.address,
          catatan: payload.notes || null,
          status: "aktif",
          created_by_email: "marketplace@system",
          pic_name: payload.fullName,
          pic_phone: payload.phone,
          pic_email: payload.email,
          assigned_cs: "Marketplace",
          updated_by_email: "marketplace@system",
        },
      ] as unknown as never[])
      .select("id, nama")
      .single();

    if (konsumenError || !konsumenData) {
      return NextResponse.json(
        { error: konsumenError?.message || "Gagal menyimpan konsumen." },
        { status: 500 }
      );
    }

    const konsumen = konsumenData as { id: string; nama: string };
    const orderPayload = {
      kode_barang: kodeBarang,
      konsumen_id: konsumen.id,
      nama_penjahit: null,
      model: payload.model,
      model_detail: `Marketplace ${payload.productId}`,
      jumlah_pesanan: payload.qty,
      status: "Menunggu",
      payment_status: paymentProofUrl ? "Menunggu Verifikasi" : "Belum Bayar",
      priority: "Medium",
      cs: "Marketplace",
      konsumen: konsumen.nama,
      warna: payload.warna,
      deskripsi_pekerjaan: [
        "Pesanan dari Bradwear Marketplace",
        `Design URL: ${designUrl || "-"}`,
        `Design Schema: ${payload.designJson?.schema_version || "legacy"}`,
        `Alamat: ${payload.address}`,
        `Catatan: ${payload.notes || "-"}`,
      ].join("\n"),
      size_details: payload.sizeDetails,
    };

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([orderPayload] as unknown as never[])
      .select("id, kode_barang, status")
      .single();

    if (orderError || !orderData) {
      return NextResponse.json(
        { error: orderError?.message || "Gagal membuat order." },
        { status: 500 }
      );
    }

    const order = orderData as { id: string; kode_barang: string; status: string };
    await supabase.from("marketplace_orders").insert([
      {
        user_id: user.id,
        design_id: designId,
        konsumen_id: konsumen.id,
        order_id: order.id,
        payment_proof_url: paymentProofUrl,
        payment_status_marketplace: paymentProofUrl ? "pending_verification" : "unpaid",
        notes: payload.notes || null,
      },
    ] as unknown as never[]);

    return NextResponse.json({
      ok: true,
      order: {
        id: order.id,
        kode_barang: order.kode_barang,
        status: order.status,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
