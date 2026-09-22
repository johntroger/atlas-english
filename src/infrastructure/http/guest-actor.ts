import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const GUEST_ACTOR_COOKIE = "atlas_guest_actor";
const DAY_SECONDS = 24 * 60 * 60;

type GuestActor = Readonly<{
  id: string;
  cookieValue?: string;
}>;

function signature(payload: string): string {
  const secret = process.env.ATLAS_GUEST_COOKIE_SECRET;
  if (!secret) throw new Error("Guest cookie configuration is missing.");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function verify(value: string, now: Date): string | undefined {
  const [id, expiresAtText, receivedSignature] = value.split(".");
  if (!id || !expiresAtText || !receivedSignature || !UUID.test(id)) return undefined;
  const expiresAt = Number(expiresAtText);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now.getTime()) return undefined;
  const expected = signature(`${id}.${expiresAtText}`);
  const expectedBytes = Buffer.from(expected);
  const receivedBytes = Buffer.from(receivedSignature);
  if (
    expectedBytes.length !== receivedBytes.length ||
    !timingSafeEqual(expectedBytes, receivedBytes)
  ) {
    return undefined;
  }
  return id;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getGuestActor(cookieValue: string | undefined, now = new Date()): GuestActor {
  const existingId = cookieValue ? verify(cookieValue, now) : undefined;
  if (existingId) return { id: existingId };

  const id = randomUUID();
  const expiresAt = now.getTime() + DAY_SECONDS * 1000;
  const payload = `${id}.${expiresAt}`;
  return { id, cookieValue: `${payload}.${signature(payload)}` };
}

/** Returns only a still-valid guest binding and never creates a replacement. */
export function findGuestActor(
  cookieValue: string | undefined,
  now = new Date(),
): GuestActor | undefined {
  const id = cookieValue ? verify(cookieValue, now) : undefined;
  return id ? { id } : undefined;
}

export const guestActorCookieOptions = {
  httpOnly: true,
  maxAge: DAY_SECONDS,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
