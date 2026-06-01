import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearSessionCookie, hashSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const supabase = getSupabaseAdmin();
    await supabase
      .from("marketplace_sessions")
      .delete()
      .eq("session_token_hash", hashSessionToken(token));
  }

  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}

