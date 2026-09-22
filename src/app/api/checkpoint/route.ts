import { createHash, randomUUID } from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  CURRENT_ROUTE_RELEASE,
  checkpointState,
  resolveReleaseBoundary,
} from "@/application/checkpoints/release-boundary";
import { ACCOUNT_SESSION_COOKIE } from "@/infrastructure/http/account-session";
import { getCurrentAccount } from "@/infrastructure/http/current-account";
import {
  GUEST_ACTOR_COOKIE,
  getGuestActor,
  guestActorCookieOptions,
} from "@/infrastructure/http/guest-actor";
import {
  createGuestFinalCompletion,
  GUEST_STORY_COOKIE,
  guestStoryCookieOptions,
  hasGuestFinalCompletion,
} from "@/infrastructure/http/guest-story";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

export const runtime = "nodejs";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  let body: { missionId?: unknown; idempotencyKey?: unknown; clientRelease?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  if (
    !["m1", "m2", "m3"].includes(String(body.missionId)) ||
    typeof body.idempotencyKey !== "string" ||
    !UUID.test(body.idempotencyKey)
  )
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const missionId = body.missionId as "m1" | "m2" | "m3";
  const boundary = resolveReleaseBoundary(
    typeof body.clientRelease === "string" ? body.clientRelease : undefined,
  );
  const cookieStore = await cookies();
  const account = await getCurrentAccount(cookieStore.get(ACCOUNT_SESSION_COOKIE)?.value);
  const finalMission = missionId === "m3";
  if (!account) {
    const guest = getGuestActor(cookieStore.get(GUEST_ACTOR_COOKIE)?.value);
    const replay =
      finalMission && hasGuestFinalCompletion(cookieStore.get(GUEST_STORY_COOKIE)?.value, guest.id);
    const response = NextResponse.json({
      state: checkpointState(finalMission, replay),
      ...boundary,
      guest: true,
    });
    if (guest.cookieValue)
      response.cookies.set(GUEST_ACTOR_COOKIE, guest.cookieValue, guestActorCookieOptions);
    if (finalMission && !replay)
      response.cookies.set(
        GUEST_STORY_COOKIE,
        createGuestFinalCompletion(guest.id),
        guestStoryCookieOptions,
      );
    return response;
  }
  const hash = createHash("sha256")
    .update(`${account.id}:${missionId}:${body.idempotencyKey}:${CURRENT_ROUTE_RELEASE}`)
    .digest("hex");
  const { data, error } = await createSupabaseServerClient().rpc("complete_vs08_mission", {
    p_user_id: account.id,
    p_mission_id: missionId,
    p_completion_id: randomUUID(),
    p_idempotency_key: body.idempotencyKey,
    p_request_hash: hash,
  });
  if (error)
    return NextResponse.json(
      {
        error: error.message.includes("mission_not_ready")
          ? "mission_not_ready"
          : "checkpoint_unavailable",
      },
      { status: error.message.includes("mission_not_ready") ? 422 : 503 },
    );
  const result = Array.isArray(data) ? data[0] : undefined;
  return NextResponse.json({
    state: finalMission
      ? result?.state === "replayable"
        ? "final_replay"
        : "final_first_completion"
      : "interim_ready",
    ...boundary,
    guest: false,
  });
}
