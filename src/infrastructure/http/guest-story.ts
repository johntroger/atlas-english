import { createHmac, timingSafeEqual } from "node:crypto";

export const GUEST_STORY_COOKIE = "atlas_guest_story";

function sign(payload: string): string {
  const secret = process.env.ATLAS_GUEST_COOKIE_SECRET;
  if (!secret) throw new Error("Guest story configuration is missing.");
  return createHmac("sha256", secret).update(`story:${payload}`).digest("base64url");
}

export function hasGuestFinalCompletion(
  value: string | undefined,
  guestId: string,
  now = Date.now(),
): boolean {
  if (!value) return false;
  const [id, mission, expiryText, received] = value.split(".");
  if (!id || mission !== "m3" || !expiryText || !received || id !== guestId) return false;
  const expiry = Number(expiryText);
  const expected = sign(`${id}.${mission}.${expiryText}`);
  const a = Buffer.from(expected);
  const b = Buffer.from(received);
  return (
    Number.isSafeInteger(expiry) && expiry > now && a.length === b.length && timingSafeEqual(a, b)
  );
}

export function createGuestFinalCompletion(guestId: string, now = Date.now()): string {
  const expiry = now + 24 * 60 * 60 * 1000;
  const payload = `${guestId}.m3.${expiry}`;
  return `${payload}.${sign(payload)}`;
}

export const guestStoryCookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
