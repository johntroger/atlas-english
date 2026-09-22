import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { submitAttempt, type AttemptCommand } from "@/application/attempts/submit-attempt";
import {
  GUEST_ACTOR_COOKIE,
  getGuestActor,
  guestActorCookieOptions,
} from "@/infrastructure/http/guest-actor";
import { getCurrentAccount } from "@/infrastructure/http/current-account";
import { createSupabaseAttemptStore } from "@/infrastructure/supabase/attempt-store";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 32 * 1024;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isResponse(value: unknown): value is AttemptCommand["response"] {
  if (typeof value === "string") return value.length <= 500;
  if (!Array.isArray(value) || value.length > 12) return false;
  return value.every(
    (item) =>
      (typeof item === "string" && item.length <= 100) ||
      (typeof item === "number" && Number.isSafeInteger(item)),
  );
}

function parseCommand(value: unknown): AttemptCommand | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const command = value as Record<string, unknown>;
  if (
    typeof command.itemId !== "string" ||
    command.itemId.length === 0 ||
    command.itemId.length > 120 ||
    typeof command.hintUsed !== "boolean" ||
    !isResponse(command.response)
  ) {
    return undefined;
  }
  return {
    attemptId:
      typeof command.attemptId === "string" && UUID.test(command.attemptId)
        ? command.attemptId
        : "",
    idempotencyKey:
      typeof command.idempotencyKey === "string" && UUID.test(command.idempotencyKey)
        ? command.idempotencyKey
        : "",
    itemId: command.itemId,
    response: command.response,
    hintUsed: command.hintUsed,
  };
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const command = parseCommand(body);
  if (!command?.attemptId || !command.idempotencyKey) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const account = await getCurrentAccount(cookieStore.get("atlas_account_session")?.value);
  const guest = account ? undefined : getGuestActor(cookieStore.get(GUEST_ACTOR_COOKIE)?.value);
  const actor = account
    ? account
    : {
        kind: "guest" as const,
        id: guest?.id ?? "",
      };
  try {
    const result = await submitAttempt(actor.id, command, createSupabaseAttemptStore(actor));
    if (result.kind === "invalid") {
      return NextResponse.json({ error: "unknown_item" }, { status: 422 });
    }
    if (result.kind === "idempotency_conflict") {
      return NextResponse.json({ error: "idempotency_conflict" }, { status: 409 });
    }
    const response = NextResponse.json({ kind: result.kind, receipt: result.receipt });
    if (guest?.cookieValue)
      response.cookies.set(GUEST_ACTOR_COOKIE, guest.cookieValue, guestActorCookieOptions);
    return response;
  } catch (error) {
    console.error(
      "Attempt submission failed",
      error instanceof Error ? error.message : "unknown error",
    );
    return NextResponse.json({ error: "attempt_unavailable" }, { status: 503 });
  }
}
