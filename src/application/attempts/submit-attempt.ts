import { createHash } from "node:crypto";

import {
  evaluateMissionAnswer,
  findFirstRunQuestion,
  type MissionResponse,
} from "../../domain/vertical-slice/mission-catalog.ts";

export type AttemptCommand = Readonly<{
  attemptId: string;
  idempotencyKey: string;
  itemId: string;
  response: MissionResponse;
  hintUsed: boolean;
}>;

export type AttemptReceipt = Readonly<{
  attemptId: string;
  idempotencyKey: string;
  requestHash: string;
  outcome: ReturnType<typeof evaluateMissionAnswer>;
  submittedAt: string;
}>;

export type AttemptStore = Readonly<{
  findByActorAndKey(actorId: string, idempotencyKey: string): Promise<AttemptReceipt | undefined>;
  /**
   * Atomically writes the receipt or returns the existing receipt for this actor/key.
   * The database unique index, rather than this use case's pre-read, is the concurrency guard.
   */
  persistOrReadExisting(
    actorId: string,
    receipt: AttemptReceipt,
    command: AttemptCommand,
  ): Promise<Readonly<{ receipt: AttemptReceipt; inserted: boolean }>>;
}>;

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function requestHash(actorId: string, command: AttemptCommand): string {
  return createHash("sha256")
    .update(canonical({ actorId, ...command }))
    .digest("hex");
}

export async function submitAttempt(
  actorId: string,
  command: AttemptCommand,
  store: AttemptStore,
  now = new Date(),
): Promise<{
  kind: "acknowledged" | "replayed" | "idempotency_conflict" | "invalid";
  receipt?: AttemptReceipt;
}> {
  const existing = await store.findByActorAndKey(actorId, command.idempotencyKey);
  const hash = requestHash(actorId, command);
  if (existing) {
    return existing.requestHash === hash
      ? { kind: "replayed", receipt: existing }
      : { kind: "idempotency_conflict" };
  }

  const resolved = findFirstRunQuestion(command.itemId);
  if (!resolved) return { kind: "invalid" };

  const receipt: AttemptReceipt = {
    attemptId: command.attemptId,
    idempotencyKey: command.idempotencyKey,
    requestHash: hash,
    outcome: evaluateMissionAnswer(resolved.question, command.response, command.hintUsed),
    submittedAt: now.toISOString(),
  };
  const persisted = await store.persistOrReadExisting(actorId, receipt, command);
  return persisted.receipt.requestHash === hash
    ? {
        kind: persisted.inserted ? "acknowledged" : "replayed",
        receipt: persisted.receipt,
      }
    : { kind: "idempotency_conflict" };
}
