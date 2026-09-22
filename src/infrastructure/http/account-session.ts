import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export const ACCOUNT_SESSION_COOKIE = "atlas_account_session";
const SESSION_SECONDS = 30 * 24 * 60 * 60;
const AAD = Buffer.from("atlas-account-session-v1");

type SessionPayload = Readonly<{ accessToken: string; expiresAt: number }>;

function key(): Buffer {
  const secret = process.env.ATLAS_GUEST_COOKIE_SECRET;
  if (!secret) throw new Error("Account session configuration is missing.");
  return createHash("sha256").update(`account-session:${secret}`).digest();
}

function encode(value: Buffer): string {
  return value.toString("base64url");
}

function decode(value: string): Buffer | undefined {
  try {
    return Buffer.from(value, "base64url");
  } catch {
    return undefined;
  }
}

export function createAccountSession(accessToken: string, now = new Date()): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  cipher.setAAD(AAD);
  const plaintext = Buffer.from(
    JSON.stringify({ accessToken, expiresAt: now.getTime() + SESSION_SECONDS * 1000 }),
  );
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return [encode(iv), encode(ciphertext), encode(cipher.getAuthTag())].join(".");
}

export function readAccountSession(
  value: string | undefined,
  now = new Date(),
): SessionPayload | undefined {
  if (!value) return undefined;
  const [ivText, ciphertextText, tagText, extra] = value.split(".");
  if (!ivText || !ciphertextText || !tagText || extra) return undefined;
  const iv = decode(ivText);
  const ciphertext = decode(ciphertextText);
  const tag = decode(tagText);
  if (!iv || !ciphertext || !tag || iv.length !== 12 || tag.length !== 16) return undefined;
  try {
    const decipher = createDecipheriv("aes-256-gcm", key(), iv);
    decipher.setAAD(AAD);
    // GCM authentication is verified by final(); invalid ciphertext never yields a session.
    decipher.setAuthTag(tag);
    const parsed: unknown = JSON.parse(
      Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8"),
    );
    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof (parsed as SessionPayload).accessToken !== "string" ||
      (parsed as SessionPayload).accessToken.length === 0 ||
      typeof (parsed as SessionPayload).expiresAt !== "number" ||
      (parsed as SessionPayload).expiresAt <= now.getTime()
    ) {
      return undefined;
    }
    return parsed as SessionPayload;
  } catch {
    return undefined;
  }
}

export const accountSessionCookieOptions = {
  httpOnly: true,
  maxAge: SESSION_SECONDS,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
