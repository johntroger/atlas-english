# P-033 — Recovery evidence and final pre-code audit

> Trạng thái: **COMPLETED AT SPECIFICATION LEVEL**  
> Ngày: 2026-09-21  
> Phạm vi: secret-safe backup/isolated-restore procedure và final planning audit  
> Không có credential, workflow, project, backup object, database, dependency, application code hoặc deployment được tạo

## 1. Kết luận

P-033 đóng P0 pre-approval cuối cùng bằng [`BACKUP-RESTORE-RUNBOOK.md`](BACKUP-RESTORE-RUNBOOK.md). Toàn bộ chín P0 được P-030 xác định hiện có objective specification/content evidence. Không có gate cần môi trường thật hoặc human/legal release evidence nào bị đánh dấu hoàn thành sớm.

Dự án đã sẵn sàng để **trình owner quyết định** có cấp quyền `APPROVED — VERTICAL SLICE ONLY` hay không. P-033 không tự cấp quyền đó; `PLAN.md` vẫn là DRAFT.

> Correction 2026-09-21: một lần rà soát sâu hơn sau P-033 phát hiện các mâu thuẫn còn sót về auth challenge/pending lifetime, browser storage, open-Writing mastery và nguồn đo lường. P-034 sửa các active contracts và thay thế riêng kết luận “không còn mâu thuẫn” của P-033; bằng chứng backup/restore và 9/9 P0 của P-033 không thay đổi.

## 2. Recovery procedure review

Runbook mới xác định:

- tool/version manifest và fail-closed PostgreSQL pin;
- secret/credential split giữa dump-upload và decrypt-read;
- exact Bash templates cho preflight, Supabase logical dump, internal hash, `age` encryption, R2 upload/head verification, isolated download/decrypt/restore;
- source/target project-ref inequality, explicit confirmation phrase, empty-target check và environment/prefix guard;
- required 11-table counts, index/RLS/policy inventory và domain-invariant queries;
- failure matrix, cadence, 24-hour recovery target và redacted evidence template;
- explicit exclusion of Supabase Storage object bytes and unreviewed `auth`/`storage` customization.

Các command dựa trên tài liệu chính thức của Supabase, Cloudflare R2, `age` và GitHub Actions. Tool pin là planning baseline; binary checksum/container digest và source-compatible PostgreSQL patch vẫn phải được điền và chạy thử sau implementation approval.

## 3. Nine-P0 closure evidence

| # | P0 từ P-030 | Objective evidence | State |
|---:|---|---|---|
| 1 | 12-item first-run proof pack + valid/invalid fixtures | `content/vertical-slice/P031-PROOF-PACK.md`; fixture set | closed by P-031 |
| 2 | Prologue + three mission provisional copy | Vertical Slice Narrative Pack + proof-pack narrative review | closed by P-031 |
| 3 | Content/Narrative/Learning-node validation evidence | `content/vertical-slice/P031-VALIDATION-EVIDENCE.md`; P-033 rerun | closed by P-031/P-033 |
| 4 | provenance, license, immutable hash, rollback | proof-pack metadata and canonical hashes | closed by P-031 |
| 5 | typed tables/constraints/indexes/migration order | `P032-DATA-TRUST-BOUNDARY-REVIEW.md`; `DATABASE-SPEC.md` | closed by P-032 |
| 6 | per-role/per-operation RLS/grant test contract | `DATABASE-SPEC.md`; P-032 review | closed by P-032 |
| 7 | identity/attempt/story/import/release state machines | `STATE-AND-RECOVERY.md` | closed by P-032 |
| 8 | server scoring/ack/idempotency sequence | `SYNC-PROTOCOL.md`; request-hash contract | closed by P-032 |
| 9 | exact secret-safe backup/isolated restore procedure | `BACKUP-RESTORE-RUNBOOK.md` | closed by P-033 |

## 4. Final automated and semantic checks

Run locally on 2026-09-21 without installing dependencies:

- all 30 JSON documents parse;
- all 22 fixture/schema expected outcomes pass, including schema-valid semantic-invalid fixtures and schema-invalid rejection fixtures;
- Vertical Slice proof content contains 12 unique items, distributed `4/4/4` across the three selected nodes;
- positive mission/node/episode/character/prerequisite references have zero semantic errors;
- the negative Narrative Pack exposes exactly seven expected broken references;
- all repository-local Markdown links resolve;
- no merge-conflict marker exists;
- no application/database/migration directory exists;
- pre-code checklist has zero unchecked P0 pre-approval rows after the P-033 evidence link is recorded.

The active-decision phrase scan found no conflicting current requirement. Matches for offline-first, invite-only, native app, runtime AI, human expert and February 2027 are explicit exclusions, superseded backlog history or change history—not active requirements.

## 5. Gates intentionally still open

These are real risks/gates, but none is a pre-code P0:

1. **No executable proof yet:** migrations, RLS, concurrency, browser, backup and restore have not run because implementation is not authorized.
2. **Recovery pins need environment resolution:** PostgreSQL exact patch/image digest depends on the actual Supabase source version; all tool binaries need checksum verification before first run.
3. **Owner Alpha safeguards:** outer access gate, environment isolation, secret scan, critical smoke checks and active daily backup must pass before first real Alpha progress.
4. **Public content:** 18 remaining items and qualified-human approval of all 30 items/learner-facing English remain required before any non-owner access.
5. **Public legal/privacy:** operator identity/contact, provider regions/transfers and legal review remain unresolved release blockers.
6. **Live restore evidence:** a successful isolated restore is still mandatory before Public Preview; a documented command template is not a drill result.
7. **Git/GitHub not established:** repository initialization/connection belongs to the authorized implementation setup, not P-033.
8. **Storage expansion:** any future persisted audio/file object requires a separate object-backup procedure before release.

## 6. Approval boundary

The next action is a separate owner decision. If approved, the exact allowed state is:

`APPROVED — VERTICAL SLICE ONLY`

That approval permits only the scope in `VERTICAL-SLICE.md` and does not authorize Beta MVP, Public Preview, Production, runtime AI, a native app, microservices or later campaign content. Production deployment always requires another explicit request.
