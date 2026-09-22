import assert from "node:assert/strict";
import test from "node:test";

process.env.ATLAS_GUEST_COOKIE_SECRET = "test-secret-only-not-production";

const { createGuestFinalCompletion, hasGuestFinalCompletion } = await import(
  "../src/infrastructure/http/guest-story.ts"
);

test("a guest final completion is valid only for its signed guest and before expiry", () => {
  const now = Date.parse("2026-09-22T01:00:00.000Z");
  const completion = createGuestFinalCompletion("guest-1", now);

  assert.equal(hasGuestFinalCompletion(completion, "guest-1", now), true);
  assert.equal(hasGuestFinalCompletion(completion, "another-guest", now), false);
  assert.equal(hasGuestFinalCompletion(completion, "guest-1", now + 24 * 60 * 60 * 1000), false);
});

test("a tampered guest final completion cannot unlock a replay state", () => {
  const now = Date.parse("2026-09-22T01:00:00.000Z");
  const completion = createGuestFinalCompletion("guest-1", now);

  assert.equal(hasGuestFinalCompletion(`${completion}x`, "guest-1", now), false);
});
