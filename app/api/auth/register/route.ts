import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, hashPassword } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Data pendaftaran tidak valid." }, { status: 400 });
    }

    const email = parsed.data.email.trim().toLowerCase();
    const supabase = getSupabaseAdmin();
    const { data: exists } = await supabase
      .from("marketplace_users")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (exists) {
      return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 409 });
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const { data, error } = await supabase
      .from("marketplace_users")
      .insert([
        {
          full_name: parsed.data.fullName.trim(),
          email,
          phone: parsed.data.phone.trim(),
          password_hash: passwordHash,
          is_active: true,
        },
      ] as unknown as never[])
      .select("id, full_name, email, phone")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Gagal membuat akun marketplace." },
        { status: 500 }
      );
    }

    await createSession((data as { id: string }).id);
    return NextResponse.json({ ok: true, user: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
