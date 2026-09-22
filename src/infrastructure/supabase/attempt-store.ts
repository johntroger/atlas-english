import type { AttemptReceipt, AttemptStore } from "@/application/attempts/submit-attempt";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server-client";

export type StoredAttemptActor = Readonly<{
  kind: "account" | "guest";
  id: string;
}>;

type AttemptRow = Readonly<{
  id: string;
  idempotency_key: string;
  request_hash: string;
  server_outcome: AttemptReceipt["outcome"];
  submitted_at: string;
}>;

function receiptFrom(row: AttemptRow): AttemptReceipt {
  return {
    attemptId: row.id,
    idempotencyKey: row.idempotency_key,
    requestHash: row.request_hash.trim(),
    outcome: row.server_outcome,
    submittedAt: row.submitted_at,
  };
}

export function createSupabaseAttemptStore(actor: StoredAttemptActor): AttemptStore {
  const client = createSupabaseServerClient();
  const findByActorAndKey = async (actorId: string, idempotencyKey: string) => {
    let query = client
      .from("attempts")
      .select("id, idempotency_key, request_hash, server_outcome, submitted_at")
      .eq("idempotency_key", idempotencyKey);
    query = query.eq(actor.kind === "account" ? "actor_user_id" : "guest_provenance_id", actorId);
    const { data, error } = await query.maybeSingle<AttemptRow>();
    if (error) throw new Error("Could not read the attempt receipt.");
    return data ? receiptFrom(data) : undefined;
  };

  return {
    findByActorAndKey,
    async persistOrReadExisting(actorId, receipt, command) {
      const { error } = await client.from("attempts").insert({
        id: receipt.attemptId,
        actor_user_id: actor.kind === "account" ? actorId : null,
        guest_provenance_id: actor.kind === "guest" ? actorId : null,
        idempotency_key: receipt.idempotencyKey,
        request_hash: receipt.requestHash,
        item_id: command.itemId,
        item_version: "vs-05.1",
        node_id: "slice.first-run",
        content_pack_id: "atlas-first-run",
        content_pack_version: "vs-05.1",
        evaluation_algorithm_version: "deterministic-v0.1",
        scoring_contract_version: "first-run-v0.1",
        answer_payload: command.response,
        server_outcome: receipt.outcome,
        hint_count: command.hintUsed ? 1 : 0,
        progress_channel: "practice",
        evidence_eligible: false,
        ineligibility_reason: "vertical_slice_no_mastery_projection",
        technical_status: "ok",
        submitted_at: receipt.submittedAt,
        guest_expires_at:
          actor.kind === "guest" ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null,
      });
      if (!error) return { receipt, inserted: true };
      if (error.code !== "23505") throw new Error("Could not store the attempt.");
      const existing = await findByActorAndKey(actorId, receipt.idempotencyKey);
      if (!existing) throw new Error("Could not recover the attempt receipt.");
      return { receipt: existing, inserted: false };
    },
  };
}
