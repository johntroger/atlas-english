# Pre-code approval checklist

> Trạng thái: DRAFT  
> Mọi ô P0 pre-approval phải hoàn thành trước khi người dùng được mời phê duyệt. Việc phê duyệt và đổi trạng thái PLAN là hành động cuối, không phải điều kiện tiên quyết của chính nó.

## P0 — Scope và governance (pre-approval)

- [x] `VERTICAL-SLICE.md` acceptance and exclusions approved for planning on 2026-09-20; this is not implementation authorization.
- [x] No unresolved source-of-truth contradiction after the P-034 multidisciplinary active-document rescan on 2026-09-21; historical/superseded wording remains labelled as such.

## P0 — Learning

- [x] `LEARNING-CONTRACT.md` approved for Vertical Slice only; later modules/phases require separate review.
- [x] Hint/pronunciation/Writing/Speaking channel rules are aligned across active docs/schemas: hinted attempts, recording/self-review and open Writing are practice-only; core MVP Speaking is pronunciation only.
- [x] Three slice nodes selected with no prerequisites; all use `hybrid` assessment with separate `mastery` and `practice` channels.
- [x] Mastery/review golden vectors approved at specification level with exact v0.1 numeric outputs and no-op/idempotency cases; executable golden tests remain the first domain implementation check after approval.
- [x] Accepted-answer normalization and deterministic partial-credit rules approved; schema fixtures still belong to content-contract review.

## P0 — Content/narrative

- [x] A first-run proof pack of 12 draft/Codex-pre-reviewed items exists across all three nodes, with at least two suitable formats per node, mastery-eligible/hinted/review paths and invalid evaluator/schema fixtures; it is a subset of the approved 30-item blueprint, and human approval is not a pre-code requirement. Evidence: `content/vertical-slice/P031-PROOF-PACK.md`.
- [x] Vertical Slice reviewer qualification, independence and item-level evidence standard approved; finding the reviewer and completing 30 approvals are deferred to the pre-public-release gate.
- [x] The same qualified reviewer may cover all slice learner-facing English; Product Owner story/tone and accessibility approvals remain separate.
- [x] Prologue + 3 mission provisional copy is sufficient for prototype/contract review and each mission produces the observable dossier/Notebook change defined in `NARRATIVE-DESIGN.md`; final IELTS, narrative and accessibility approvals are pre-public-release gates.
- [x] Content, Narrative Pack and learning-node schemas accept intended valid fixtures and reject invalid reference, slot-count, answer-policy, evidence-eligibility and completion-channel fixtures. Evidence: `content/vertical-slice/P031-VALIDATION-EVIDENCE.md`.
- [x] Content, Narrative Pack and learning-node schemas distinguish `codex_pre_reviewed` from human `reviewed`/`approved`; provisional states are allowed only in owner-restricted Alpha and forbidden for every non-owner release.
- [x] Every proof-pack artifact records origin/provenance, license, immutable version/hash and an explicit rollback target.

## P0 — Data/security

- [x] Typed tables, constraints, indexes and migration order reviewed at document/specification level; executable migration checks remain an implementation requirement after approval. Evidence: `P032-DATA-TRUST-BOUNDARY-REVIEW.md`.
- [x] RLS allow/deny matrix reviewed with per-role/per-operation tests specified; execution remains blocked until implementation approval.
- [x] Guest/account/attempt/story state machines approved with recovery and expiry transitions.
- [x] Auth lifetime is split explicitly: one-use challenge 60 minutes/five failed entries, pending account 24 hours; current answer uses 30-minute `sessionStorage`, minimal guest state uses TTL-enforced 24-hour `localStorage`.
- [x] Client/server scoring authority, attempt acknowledgement and same-key idempotent retry sequence approved, including server request hash and different-payload conflict behavior.
- [x] Dev/Owner-Alpha Preview/Public-Production isolation documented; Alpha uses a dedicated Supabase Preview project and is never promoted or cloned wholesale.
- [x] Secret-safe exact backup/isolated-restore templates, pinned/fail-closed tool manifest, target guards, verification queries, failure handling and evidence fields are specified in `BACKUP-RESTORE-RUNBOOK.md`; live execution remains an Owner Alpha/Public gate.
- [x] Two-layer Public Preview privacy notice structure and draft copy specified; rate limits, request-size limits, 75/90/95% quota thresholds and layered kill-switch behavior are approved.
- [x] Public Vertical Slice measurement contract forbids a separate analytics-event pipeline, permits privacy-safe aggregates from functionally required records, does not infer guest return and suppresses undersized results.
- [x] Early-access account policy approved: 18+ self-declaration, no date-of-birth storage, no minor accounts; later expansion requires separate legal review.
- [x] Initial Preview audience limited by stated purpose to adult residents of Vietnam, without precise-location collection, IP geoblocking or international marketing; geographic expansion requires separate review.
- [x] Account creation uses two separate unchecked confirmations for age/residency and Terms acceptance + Privacy acknowledgement; refusal preserves guest access and Vertical Slice has no marketing consent UI.
- [x] Terms dispute direction selected: Vietnamese law, online contact/negotiation first, no mandatory arbitration and no restriction of lawful dispute methods.
- [x] Material policy changes use email plus next-sign-in reacceptance; refusal preserves export/delete and guest play, while non-material edits use version history only.
- [x] Planned material-policy changes use at least 7 calendar days' notice; immediate effect is restricted to documented security/legal emergencies.
- [x] Policy versions use immutable date-based IDs with separate announcement/effective timestamps, UTC storage and Vietnam-local display; published text is never overwritten.
- [x] Vietnamese is the sole authoritative Terms/Privacy language for the Vertical Slice; any future translation requires review, version parity and an explicit precedence rule.

## P0 — UX

- [x] Pre-code artifact scope approved: low-fidelity responsive wireframes/state maps only; the coded Owner Alpha is the first interactive prototype.
- [x] Wireframe format approved: repository-native Markdown in `WIREFRAMES.md`, with text diagrams, Mermaid state maps and no Figma/PNG/PDF dependency.
- [x] Wireframes are authored and Codex-reviewed sequentially in flow order, starting with Landing; each flow clears P0/P1 before the next opens. Owner input is requested only for material scope/cost/legal/data/claim decisions and remains welcome at any time.
- [x] Mobile/desktop wireframes for Landing, Question, Feedback, Checkpoint/safe stop and Sign-in/guest import are complete.
- [x] Relevant loading/error/empty/interruption states, responsive rules and keyboard/focus notes are mapped for those five flows.
- [x] Codex heuristic walkthrough completed; no unresolved P0/P1 remains and no external 3–5-person test is required before implementation.
- [x] UI states, design tokens and pre-code accessibility contract accepted; measured token contrast and usage restrictions are recorded, while browser conformance remains an implementation check.

## Owner Alpha gate — before the owner's first online use

- [ ] Access is limited to the project owner; public guest discovery and open signup are disabled for this environment.
- [ ] Hosting-level protection availability is verified; otherwise the documented server-side secret/cookie/rate-limit fallback is implemented and tested without exposing the secret.
- [ ] Owner can exercise guest, account, import and recovery paths without granting access to other real users.
- [ ] Critical correctness, data-loss, authentication and secret-exposure checks pass.
- [x] Owner Alpha feedback log, P0–P3 severity model and fix/retest lifecycle are specified; no external participant count is required.
- [ ] Owner confirms clean start or explicitly requests the narrow Alpha-history transfer; no automatic carry-over is allowed.
- [ ] Encrypted daily logical backup is active before the owner account stores real Alpha progress; Alpha prefix/scope is distinct and backup health is visible.
- [x] Owner Alpha breaking-change policy approved: migrate/rebuild first; reset only after verified backup, exact impact preview and separate owner confirmation; never applies to Public/Production.
- [x] Alpha auto-delivery policy approved: required checks first, safe-boundary reload, immediate P0 kill switch when necessary, last-known-good rollback and no authority over Public/Production.

## P1 — Before broader public beta

- [ ] Legal/minor-consent/privacy blocker resolved.
- [ ] Public content independently reviewed.
- [ ] Rate limits, provider quota email and emergency switches tested.
- [ ] Export/delete/reset/inactivity lifecycle implemented and tested.
- [ ] Backup/restore, rollback, RLS/security and content-incident rehearsal pass.
- [ ] Browser/device/accessibility evidence complete.

## Release gate — before publicly reachable Vertical Slice Preview

- [ ] Confirmed operator legal name and tested project privacy/support mailbox replace every placeholder.
- [ ] Actual provider regions/transfers and policy links are disclosed accurately.
- [ ] Terms/Privacy legal review covers governing law, consumer rights, consent, liability, dispute wording and the 18+/Vietnam scope.
- [ ] All 30 items and every learner-facing English narrative string have qualified-human academic approval bound to exact Content/Narrative Pack hashes.
- [ ] Product Owner story/tone approval and accessibility evidence pass for the release candidate.
- [ ] Draft or `codex_pre_reviewed` content cannot be selected by any user outside the owner-restricted Alpha.
- [ ] Owner explicitly approves expansion beyond Owner Alpha; there is no automatic promotion based on time or issue count.

## Approval record

Sau khi toàn bộ P0 pre-approval đạt, trình bày các rủi ro còn lại để người dùng quyết định. Chỉ khi người dùng yêu cầu rõ ràng mới:

1. ghi approver, date, exact scope, unresolved risks và prohibited next phases;
2. đổi trạng thái PLAN thành `APPROVED — VERTICAL SLICE ONLY`;
3. chỉ mở `VS-01`; mỗi `VS-02`–`VS-09` cần completion report đạt và phê duyệt riêng cho bước kế tiếp theo `VERTICAL-SLICE.md`.

Approval hết hiệu lực nếu một quyết định thay thế làm đổi scope, evidence hoặc trust boundaries.
