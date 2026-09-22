import assert from "node:assert/strict";
import test from "node:test";

process.env.ATLAS_GUEST_COOKIE_SECRET = "test-secret-only-not-production";

const { getGuestActor } = await import("../src/infrastructure/http/guest-actor.ts");

test("a guest binding is signed, HTTP-only-ready and remains stable before expiry", () => {
  const now = new Date("2026-09-22T01:00:00.000Z");
  const created = getGuestActor(undefined, now);
  const recovered = getGuestActor(created.cookieValue, new Date("2026-09-22T02:00:00.000Z"));
  assert.ok(created.cookieValue);
  assert.equal(recovered.id, created.id);
  assert.equal(recovered.cookieValue, undefined);
});

test("a tampered or expired guest binding is replaced", () => {
  const now = new Date("2026-09-22T01:00:00.000Z");
  const created = getGuestActor(undefined, now);
  const tampered = `${created.cookieValue}x`;
  assert.notEqual(getGuestActor(tampered, now).id, created.id);
  assert.notEqual(
    getGuestActor(created.cookieValue, new Date("2026-09-23T01:00:01.000Z")).id,
    created.id,
  );
});
