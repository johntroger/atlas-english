import assert from "node:assert/strict";
import test from "node:test";

import { requestHash, submitAttempt } from "../src/application/attempts/submit-attempt.ts";
import { FIRST_RUN_MISSIONS } from "../src/domain/vertical-slice/mission-catalog.ts";

const actorId = "a7c8377e-8ad9-4f86-9714-8f0b0668c7f8";
const baseCommand = Object.freeze({
  attemptId: "f017fcb1-5f6c-48a4-9637-7d89186218d4",
  idempotencyKey: "2b4124bd-6d0e-4d62-a4ef-ba94fb84c1b7",
  itemId: FIRST_RUN_MISSIONS[0].questions[0].id,
  response: ["c"],
  hintUsed: false,
});

function memoryStore() {
  const values = new Map();
  return {
    values,
    async findByActorAndKey(actor, key) {
      return values.get(`${actor}:${key}`);
    },
    async persistOrReadExisting(actor, receipt) {
      const key = `${actor}:${receipt.idempotencyKey}`;
      const existing = values.get(key);
      if (existing) return { receipt: existing, inserted: false };
      values.set(key, receipt);
      return { receipt, inserted: true };
    },
  };
}

test("attempt request hash is stable for equivalent command objects", () => {
  const reordered = {
    response: ["c"],
    hintUsed: false,
    itemId: baseCommand.itemId,
    idempotencyKey: baseCommand.idempotencyKey,
    attemptId: baseCommand.attemptId,
  };
  assert.equal(requestHash(actorId, baseCommand), requestHash(actorId, reordered));
});

test("a first submission stores a server-evaluated acknowledgement", async () => {
  const store = memoryStore();
  const result = await submitAttempt(
    actorId,
    baseCommand,
    store,
    new Date("2026-09-22T01:00:00.000Z"),
  );
  assert.equal(result.kind, "acknowledged");
  assert.equal(result.receipt?.outcome.isCorrect, true);
  assert.equal(result.receipt?.outcome.practiceOnly, false);
  assert.equal(store.values.size, 1);
});

test("same actor, key and hash replays the original acknowledgement without a second attempt", async () => {
  const store = memoryStore();
  const first = await submitAttempt(
    actorId,
    baseCommand,
    store,
    new Date("2026-09-22T01:00:00.000Z"),
  );
  const retry = await submitAttempt(
    actorId,
    baseCommand,
    store,
    new Date("2026-09-22T01:05:00.000Z"),
  );
  assert.equal(first.kind, "acknowledged");
  assert.equal(retry.kind, "replayed");
  assert.deepEqual(retry.receipt, first.receipt);
  assert.equal(store.values.size, 1);
});

test("same actor/key with another payload is rejected without another attempt", async () => {
  const store = memoryStore();
  await submitAttempt(actorId, baseCommand, store);
  const result = await submitAttempt(actorId, { ...baseCommand, response: ["a"] }, store);
  assert.equal(result.kind, "idempotency_conflict");
  assert.equal(store.values.size, 1);
});

test("concurrent retries receive one acknowledgement and one replay", async () => {
  const store = memoryStore();
  const results = await Promise.all([
    submitAttempt(actorId, baseCommand, store),
    submitAttempt(actorId, baseCommand, store),
  ]);
  assert.deepEqual(results.map((result) => result.kind).sort(), ["acknowledged", "replayed"]);
  assert.equal(store.values.size, 1);
});

test("an unknown item is not persisted", async () => {
  const store = memoryStore();
  const result = await submitAttempt(actorId, { ...baseCommand, itemId: "unknown-item" }, store);
  assert.equal(result.kind, "invalid");
  assert.equal(store.values.size, 0);
});
