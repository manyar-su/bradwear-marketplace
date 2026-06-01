import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { hash, compare } from "bcryptjs";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const SESSION_COOKIE = "bradwear_marketplace_session";
const SESSION_DAYS = 30;

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function newSessionToken() {
  return randomBytes(32).toString("hex");
}

export async function createSession(userId: string) {
  const token = newSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("marketplace_sessions").insert([
    {
      user_id: userId,
      session_token_hash: tokenHash,
      expires_at: expiresAt.toISOString(),
      last_seen_at: new Date().toISOString(),
    },
  ] as unknown as never[]);

  if (error) throw new Error(error.message);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

type MarketplaceUser = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
};

export async function getCurrentMarketplaceUser(): Promise<MarketplaceUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const nowIso = new Date().toISOString();
  const supabase = getSupabaseAdmin();

  const { data: sessionData, error: sessionErr } = await supabase
    .from("marketplace_sessions")
    .select("id, user_id, expires_at")
    .eq("session_token_hash", tokenHash)
    .gt("expires_at", nowIso)
    .maybeSingle();

  if (sessionErr || !sessionData) return null;

  const session = sessionData as { id: string; user_id: string; expires_at: string };

  const { data: userData, error: userErr } = await supabase
    .from("marketplace_users")
    .select("id, full_name, email, phone, is_active")
    .eq("id", session.user_id)
    .maybeSingle();

  if (userErr || !userData) return null;
  const user = userData as {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
  };
  if (!user.is_active) return null;

  await supabase
    .from("marketplace_sessions")
    .update({ last_seen_at: new Date().toISOString() } as never)
    .eq("id", session.id);

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
  };
}
