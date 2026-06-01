import { createClient } from "@supabase/supabase-js";
import { assertServerEnv, env } from "@/lib/env";

let client: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
  if (client) return client;
  assertServerEnv();
  client = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return client;
}
