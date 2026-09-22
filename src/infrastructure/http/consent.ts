import { createHash } from "node:crypto";

export const POLICY_VERSIONS = {
  privacy: "privacy-2026-09-22-v1",
  terms: "terms-2026-09-22-v1",
} as const;

export function guestSessionHash(guestId: string): string {
  return createHash("sha256").update(`atlas-guest:${guestId}`).digest("hex");
}
