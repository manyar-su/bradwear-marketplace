import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, verifyPassword } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Email atau password tidak valid." }, { status: 400 });
    }

    const email = parsed.data.email.trim().toLowerCase();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("marketplace_users")
      .select("id, full_name, email, phone, password_hash, is_active")
      .eq("email", email)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: "Akun tidak ditemukan." }, { status: 404 });
    }

    const user = data as {
      id: string;
      password_hash: string;
      is_active: boolean;
    };
    if (!user.is_active) {
      return NextResponse.json({ error: "Akun dinonaktifkan." }, { status: 403 });
    }

    const passwordOk = await verifyPassword(parsed.data.password, user.password_hash);
    if (!passwordOk) {
      return NextResponse.json({ error: "Password salah." }, { status: 401 });
    }

    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

