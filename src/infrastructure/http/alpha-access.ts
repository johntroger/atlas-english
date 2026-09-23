import { createHmac, timingSafeEqual } from "node:crypto";

export const ALPHA_COOKIE = "atlas_alpha_access";
const SESSION_SECONDS = 12 * 60 * 60;

function signature(payload: string): string {
  const secret = process.env.ATLAS_ALPHA_ACCESS_SECRET;
  if (!secret) throw new Error("Owner Alpha access is not configured.");
  return createHmac("sha256", secret).update(`alpha:${payload}`).digest("base64url");
}

export function createAlphaSession(now = Date.now()): string {
  const expiry = now + SESSION_SECONDS * 1000;
  const payload = String(expiry);
  return `${payload}.${signature(payload)}`;
}

export function isValidAlphaSession(value: string | undefined, now = Date.now()): boolean {
  if (!value) return false;
  const [expiryText, received, extra] = value.split(".");
  if (!expiryText || !received || extra) return false;
  const expiry = Number(expiryText);
  const expected = signature(expiryText);
  const a = Buffer.from(expected);
  const b = Buffer.from(received);
  return (
    Number.isSafeInteger(expiry) && expiry > now && a.length === b.length && timingSafeEqual(a, b)
  );
}

export const alphaCookieOptions = {
  httpOnly: true,
  maxAge: SESSION_SECONDS,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
