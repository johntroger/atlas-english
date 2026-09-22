import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCOUNT_SESSION_COOKIE } from "@/infrastructure/http/account-session";
import { getCurrentAccount } from "@/infrastructure/http/current-account";
import { findGuestActor, GUEST_ACTOR_COOKIE } from "@/infrastructure/http/guest-actor";
import { guestSessionHash } from "@/infrastructure/http/consent";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const account = await getCurrentAccount(cookieStore.get(ACCOUNT_SESSION_COOKIE)?.value);
  if (!account) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const guest = findGuestActor(cookieStore.get(GUEST_ACTOR_COOKIE)?.value);
  if (!guest) return NextResponse.json({ available: false, count: 0 });

  try {
    const client = createSupabaseServerClient();
    const [{ count, error: countError }, { data: prior, error: priorError }] = await Promise.all([
      client
        .from("attempts")
        .select("id", { count: "exact", head: true })
        .eq("guest_provenance_id", guest.id)
        .eq("technical_status", "ok")
        .gt("guest_expires_at", new Date().toISOString()),
      client
        .from("guest_imports")
        .select("id")
        .eq("guest_session_id_hash", guestSessionHash(guest.id))
        .maybeSingle(),
    ]);
    if (countError || priorError) throw new Error("Could not preview guest history.");
    return NextResponse.json({
      available: !prior && (count ?? 0) > 0,
      count: prior ? 0 : (count ?? 0),
    });
  } catch {
    return NextResponse.json({ error: "preview_unavailable" }, { status: 503 });
  }
}
