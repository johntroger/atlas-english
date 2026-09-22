import { createClient } from "@supabase/supabase-js";

/** Creates a server-only client. This module must never be imported by client UI. */
export function createSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) throw new Error("Supabase server configuration is missing.");

  return createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    // New Supabase secret keys reject requests that look like browser traffic.
    // This client is imported only by Route Handlers/server infrastructure.
    global: { headers: { "User-Agent": "atlas-english-server/0.1" } },
  });
}
