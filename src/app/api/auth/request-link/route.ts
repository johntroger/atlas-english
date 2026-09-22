import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { POLICY_VERSIONS, guestSessionHash } from "@/infrastructure/http/consent";
import {
  GUEST_ACTOR_COOKIE,
  getGuestActor,
  guestActorCookieOptions,
} from "@/infrastructure/http/guest-actor";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RequestLinkBody = Readonly<{
  email?: unknown;
  ageResidencyAttested?: unknown;
  termsAccepted?: unknown;
  privacyAcknowledged?: unknown;
}>;

function isEligible(body: RequestLinkBody): boolean {
  return (
    typeof body.email === "string" &&
    body.email.length <= 254 &&
    EMAIL.test(body.email) &&
    body.ageResidencyAttested === true &&
    body.termsAccepted === true &&
    body.privacyAcknowledged === true
  );
}

function safeFailureCode(error: { code?: string | null } | null): string {
  const code = error?.code;
  return typeof code === "string" && /^[A-Z0-9_]{1,32}$/i.test(code) ? code : "UNKNOWN";
}

export async function POST(request: Request) {
  let body: RequestLinkBody;
  try {
    body = (await request.json()) as RequestLinkBody;
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  if (!isEligible(body) || typeof body.email !== "string")
    return NextResponse.json({ error: "consent_required" }, { status: 422 });
  const email = body.email.trim().toLowerCase();

  const cookieStore = await cookies();
  const guest = getGuestActor(cookieStore.get(GUEST_ACTOR_COOKIE)?.value);
  const client = createSupabaseServerClient();
  try {
    const guestHash = guestSessionHash(guest.id);
    const { error: consentError } = await client.from("consent_events").insert([
      {
        id: randomUUID(),
        guest_session_id_hash: guestHash,
        consent_type: "age_residency_attestation",
        policy_version: "preview-18plus-vietnam-2026-09-22-v1",
        decision: true,
        source: "web",
      },
      {
        id: randomUUID(),
        guest_session_id_hash: guestHash,
        consent_type: "terms_acceptance",
        policy_version: POLICY_VERSIONS.terms,
        decision: true,
        source: "web",
      },
      {
        id: randomUUID(),
        guest_session_id_hash: guestHash,
        consent_type: "privacy_acknowledgement",
        policy_version: POLICY_VERSIONS.privacy,
        decision: true,
        source: "web",
      },
    ]);
    if (consentError)
      return NextResponse.json(
        { error: "consent_storage_unavailable", diagnostic: safeFailureCode(consentError) },
        { status: 503 },
      );

    const { error: authError } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: new URL("/auth/callback", request.url).toString() },
    });
    if (authError)
      return NextResponse.json(
        { error: "magic_link_unavailable", diagnostic: safeFailureCode(authError) },
        { status: 503 },
      );
  } catch {
    return NextResponse.json({ error: "sign_in_unavailable" }, { status: 503 });
  }

  const response = NextResponse.json({ status: "check_email" });
  if (guest.cookieValue)
    response.cookies.set(GUEST_ACTOR_COOKIE, guest.cookieValue, guestActorCookieOptions);
  return response;
}
