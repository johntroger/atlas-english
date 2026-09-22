import { createClient } from "@supabase/supabase-js";

import type { AttemptReceipt, AttemptStore } from "@/application/attempts/submit-attempt";

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

function createServerClient() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) throw new Error("Supabase server configuration is missing.");
  return createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function createSupabaseAttemptStore(): AttemptStore {
  const client = createServerClient();
  const findByActorAndKey = async (actorId: string, idempotencyKey: string) => {
    const { data, error } = await client
      .from("attempts")
      .select("id, idempotency_key, request_hash, server_outcome, submitted_at")
      .eq("guest_provenance_id", actorId)
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle<AttemptRow>();
    if (error) throw new Error("Could not read the attempt receipt.");
    return data ? receiptFrom(data) : undefined;
  };

  return {
    findByActorAndKey,
    async persistOrReadExisting(actorId, receipt, command) {
      const { error } = await client.from("attempts").insert({
        id: receipt.attemptId,
        guest_provenance_id: actorId,
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
        guest_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
      if (!error) return { receipt, inserted: true };
      if (error.code !== "23505") throw new Error("Could not store the attempt.");
      const existing = await findByActorAndKey(actorId, receipt.idempotencyKey);
      if (!existing) throw new Error("Could not recover the attempt receipt.");
      return { receipt: existing, inserted: false };
    },
  };
}
