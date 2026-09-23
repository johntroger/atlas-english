import assert from "node:assert/strict";
import test from "node:test";

process.env.ATLAS_ALPHA_ACCESS_SECRET = "alpha-test-secret";
const { createAlphaSession, isValidAlphaSession } = await import(
  "../src/infrastructure/http/alpha-access.ts"
);

test("Owner Alpha session is signed, expires after twelve hours and rejects tampering", () => {
  const now = Date.parse("2026-09-23T00:00:00.000Z");
  const session = createAlphaSession(now);
  assert.equal(isValidAlphaSession(session, now), true);
  assert.equal(isValidAlphaSession(session, now + 12 * 60 * 60 * 1000), false);
  assert.equal(isValidAlphaSession(`${session}x`, now), false);
});
