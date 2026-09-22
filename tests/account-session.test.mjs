import assert from "node:assert/strict";
import test from "node:test";

process.env.ATLAS_GUEST_COOKIE_SECRET = "test-secret-only-not-production";

const { createAccountSession, readAccountSession } = await import(
  "../src/infrastructure/http/account-session.ts"
);

test("an account session encrypts its access token and has a fixed 30-day maximum lifetime", () => {
  const now = new Date("2026-09-22T01:00:00.000Z");
  const accessToken = "test-access-token-that-must-not-appear-in-cleartext";
  const cookie = createAccountSession(accessToken, now);
  assert.equal(cookie.includes(accessToken), false);
  assert.deepEqual(readAccountSession(cookie, new Date("2026-09-22T02:00:00.000Z")), {
    accessToken,
    expiresAt: new Date("2026-10-22T01:00:00.000Z").getTime(),
  });
  assert.equal(readAccountSession(cookie, new Date("2026-10-22T01:00:01.000Z")), undefined);
});

test("a modified encrypted account session never yields a usable access token", () => {
  const cookie = createAccountSession("test-access-token", new Date("2026-09-22T01:00:00.000Z"));
  assert.equal(readAccountSession(`${cookie}x`, new Date("2026-09-22T01:01:00.000Z")), undefined);
});
