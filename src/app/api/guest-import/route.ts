import { createHash, randomUUID } from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCOUNT_SESSION_COOKIE } from "@/infrastructure/http/account-session";
import { POLICY_VERSIONS, guestSessionHash } from "@/infrastructure/http/consent";
import { getCurrentAccount } from "@/infrastructure/http/current-account";
import { findGuestActor, GUEST_ACTOR_COOKIE } from "@/infrastructure/http/guest-actor";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function requestHash(userId: string, guestId: string, key: string): string {
  return createHash("sha256").update(`${userId}:${guestId}:${key}:guest-import-v1`).digest("hex");
}

export async function POST(request: Request) {
  let body: { consent?: unknown; idempotencyKey?: unknown };
  try {
    body = (await request.json()) as { consent?: unknown; idempotencyKey?: unknown };
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  if (
    body.consent !== true ||
    typeof body.idempotencyKey !== "string" ||
    !UUID.test(body.idempotencyKey)
  ) {
    return NextResponse.json({ error: "consent_required" }, { status: 422 });
  }

  const cookieStore = await cookies();
  const account = await getCurrentAccount(cookieStore.get(ACCOUNT_SESSION_COOKIE)?.value);
  if (!account) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const guest = findGuestActor(cookieStore.get(GUEST_ACTOR_COOKIE)?.value);
  if (!guest) return NextResponse.json({ error: "guest_history_expired" }, { status: 410 });

  const client = createSupabaseServerClient();
  const guestHash = guestSessionHash(guest.id);
  const hash = requestHash(account.id, guest.id, body.idempotencyKey);
  const consentId = randomUUID();
  try {
    const { error: consentError } = await client.from("consent_events").insert({
      id: consentId,
      user_id: account.id,
      consent_type: "guest_import",
      policy_version: `${POLICY_VERSIONS.privacy}:guest-import-v1`,
      decision: true,
      source: "web",
    });
    if (consentError) throw consentError;

    const { data, error } = await client.rpc("import_guest_attempts", {
      p_user_id: account.id,
      p_guest_provenance_id: guest.id,
      p_guest_session_id_hash: guestHash,
      p_idempotency_key: body.idempotencyKey,
      p_request_hash: hash,
      p_consent_event_id: consentId,
    });
    if (error) {
      if (error.message.includes("idempotency_conflict"))
        return NextResponse.json({ error: "idempotency_conflict" }, { status: 409 });
      if (error.message.includes("guest_history_already_imported"))
        return NextResponse.json({ error: "guest_history_already_imported" }, { status: 409 });
      if (error.message.includes("no_eligible_guest_history"))
        return NextResponse.json({ error: "guest_history_expired" }, { status: 410 });
      throw error;
    }
    const receipt = Array.isArray(data) ? data[0] : undefined;
    if (!receipt) throw new Error("No import receipt.");
    return NextResponse.json({ status: "imported", receipt });
  } catch {
    return NextResponse.json({ error: "import_unavailable" }, { status: 503 });
  }
}
