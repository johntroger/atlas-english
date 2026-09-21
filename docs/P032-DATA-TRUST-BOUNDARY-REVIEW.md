# P-032 — Data trust-boundary review

> Trạng thái: **COMPLETED AT SPECIFICATION LEVEL — implementation evidence pending after approval**  
> Ngày: 2026-09-21  
> Phạm vi: Vertical Slice database contract, RLS/grants, state machines, scoring acknowledgement và idempotency  
> Không có database, migration file, credential, application code hoặc deployment được tạo

## 1. Kết luận

Trust boundary của Vertical Slice đã đủ cụ thể để chuyển sang P-033. Browser vẫn là untrusted; Supabase/account state và server acknowledgement là authoritative. Mutation quan trọng không có direct browser table grant. Mọi attempt/import command có actor-scoped idempotency key và server-computed request hash; story reward được khóa theo `(user,reward)`; một guest provenance chỉ được nhập vào một account.

P-032 đóng bốn P0 về typed database/migration, RLS allow-deny, state machines và scoring/idempotency ở mức tài liệu. Nó không chứng minh migration/RLS chạy thật; executable tests chỉ hợp lệ sau `APPROVED — VERTICAL SLICE ONLY`.

## 2. Trust boundaries

```text
Browser (untrusted)
  ├─ answer + attempt UUID + idempotency key
  ├─ optional allowlisted story choice
  └─ never authoritative for actor/correctness/evidence/reward/release
        │
        ▼
Application boundary
  ├─ auth or server-bound guest provenance
  ├─ size/rate/CSRF/origin checks
  ├─ exact content/version lookup
  ├─ deterministic evaluation + eligibility
  └─ canonical request hash / authorization
        │
        ▼
PostgreSQL boundary
  ├─ grants + RLS + constraints + unique indexes
  ├─ atomic attempt/evidence/projection transaction
  ├─ atomic mission/reward transition
  └─ append-only events and rebuildable projections
```

## 3. Findings đã giải quyết

| ID | Mức | Finding trước review | Resolution |
|---|---|---|---|
| P032-01 | P0 | Same idempotency key chưa phân biệt retry thật với payload khác | thêm server `request_hash`; same key/different hash trả `409` và không ghi |
| P032-02 | P0 | `guest_imports` unique theo user+guest cho phép cùng guest bị nhập vào user thứ hai | unique toàn cục `guest_session_id_hash` + account-scoped retry receipt |
| P032-03 | P0 | reward unique theo source completion vẫn cho cùng reward qua completion ID khác | unique `(user_id,reward_id)` và source completion liên kết `story_progress` |
| P032-04 | P0 | RLS matrix chưa tách grant theo operation/role và chưa khóa view/function bypass | thêm deny-by-default operation matrix, function hardening và positive/negative tests |
| P032-05 | P1 | Attempt timestamp/guest retention và narrative snapshot chưa đủ invariant | tách client/server time, guest expiry, actor XOR và all-or-none narrative fields |
| P032-06 | P1 | Release catalog chưa chặn hai active versions/cross-audience activation | partial unique active version + `review_status/audience` environment guard |
| P032-07 | P1 | State diagram chưa phân biệt local submit state với committed acknowledgement | thêm authoritative state ownership và guarded transition tables |
| P032-08 | P1 | “projection eventual” mơ hồ với acknowledgement của slice | attempt/evidence/mastery-review projection commit cùng transaction; chỉ rebuild/incident recompute asynchronous |

Không finding nào yêu cầu microservice, queue/outbox table, direct Supabase UI calls hoặc database ngoài Supabase/PostgreSQL.

## 4. Physical contract review

Vertical Slice vẫn dùng đúng 11 bảng đã cho phép:

`profiles`, `attempts`, `evidence_events`, `mastery_projections`, `review_queue`, `guest_imports`, `consent_events`, `content_releases`, `narrative_releases`, `story_progress`, `reward_grants`.

### Invariant quan trọng

- `attempts`: account XOR guest actor; two partial actor/key unique indexes; server request hash; append-only; exact content/narrative/evaluation snapshots.
- `evidence_events`: tối đa một event/attempt, account-bound, invalidation metadata không viết lại score.
- projections: bounded score/confidence, versioned, có last attempt/update evidence để rebuild.
- `guest_imports`: một guest → tối đa một destination account; retry cùng user/key/hash trả một receipt.
- releases: một active version/pack; Public chỉ `approved/public`, Owner Alpha cho phép `codex_pre_reviewed/owner_alpha`.
- story: first-completion ID immutable; reward tối đa một row/user/reward; replay không cấp lại.
- FK tới release/snapshot là `RESTRICT`; không hard-delete artifact còn được lịch sử tham chiếu.

### Migration order đã review

1. types/guards;
2. release catalogs;
3. profile/consent;
4. attempt ledger;
5. evidence/projections;
6. story/rewards;
7. guest import receipt;
8. RLS/grants/functions;
9. synthetic negative/compatibility tests.

Grant/RLS không được mở trước khi invariant table/constraint tồn tại. Beta tables, private assessment, Writing, analytics và lifecycle automation không được lén thêm vào migration đầu.

## 5. RLS/grant approval

Authoritative operation matrix nằm trong [`DATABASE-SPEC.md`](DATABASE-SPEC.md), mục “Grant + RLS operation matrix — vertical slice”. Các nguyên tắc được chấp nhận:

- `anon`: không direct table access; guest play đi qua server-bound endpoint.
- `authenticated`: chỉ SELECT row của chính mình ở các bảng user-facing; không direct mutation.
- browser: không direct base-table read cho release catalogs; content adapter chỉ trả artifact/metadata đã allowlist.
- operator: server-only, MFA/elevated-session ở application layer, không tin user-editable JWT metadata.
- service/recovery: environment-scoped secret, application authorization vẫn bắt buộc, không xuất hiện trong browser/log.
- view/function: deny-by-default; security-definer hardening hoặc `security_invoker` proof; explicit revoke/grant; fixed safe `search_path`.

### Test families đã chỉ định

| Family | Roles/cases | Expected |
|---|---|---|
| RLS-READ | anon, owner, other user, expired actor | owner-only rows visible; all others denied |
| RLS-MUTATE | direct insert/update/delete for browser roles | all denied |
| RPC-ACTOR | body owner spoof, guest UUID guess, fake operator claim | denied before mutation |
| RPC-IDEMPOTENCY | sequential/concurrent same hash; different hash | one receipt/transaction; conflict on mismatch |
| IMPORT-CLAIM | same guest → same/different user concurrently | one destination and one receipt only |
| STORY-REWARD | concurrent last-slot completion + replay | one completion ID and one reward only |
| RELEASE-AUDIENCE | Alpha/public/wrong environment and review state | only compatible review/audience may activate |
| BYPASS | view/function/service wrong environment | no cross-user/audience bypass |

## 6. Approved state machines

Authoritative transition tables nằm trong [`STATE-AND-RECOVERY.md`](STATE-AND-RECOVERY.md#p-032-authoritative-state-contract).

- Identity: pending account vẫn có guest permissions; verified only after valid one-use verification and confirmations; deletion lifecycle remains deferred.
- Attempt: acknowledgement means committed transaction; lost response is recovered by exact retry; incompatible/expired command is non-submittable, never wrong.
- Mission: first completion requires acknowledged compatible slots; completion/reward/unlock are atomic and concurrency-safe.
- Guest import: preview is read-only, consent is append-only, import is one transaction, failure has no partial learning/story/reward state.
- Release: one active pointer, audience guard, safe-boundary activation and immutable history.

## 7. Scoring and acknowledgement sequence

Authoritative 14-step sequence nằm trong [`SYNC-PROTOCOL.md`](SYNC-PROTOCOL.md#authoritative-sequence). Critical order:

`bind actor → validate environment/version → load exact scoring contract → compute request hash → resolve idempotency → evaluate → determine eligibility → insert attempt → insert evidence/update projection → optional mission transaction → commit → acknowledge`.

Server never trusts client `correct`, `score`, evidence channel, mastery, reward or release status. Client answer buffer is removed only after acknowledged receipt. A lost response after commit is safe because retry returns the stored result.

## 8. Compatibility and failure behavior

- Same current and previous client version are supported during rollout; unsafe incompatibility requires reload before new answer, never mid-submit.
- DB constraint or projection failure before commit returns retryable failure and rolls back all attempt/evidence/story/reward writes.
- Same key/different payload is a user-visible recovery conflict, not silently treated as success.
- Technical/content invalidation never creates a wrong/mastery/reward penalty.
- Rebuild reads immutable attempts/evidence and creates versioned projections; it does not rewrite history.
- Guest expiry cleanup is controlled retention deletion, not a general attempt-delete endpoint.

## 9. Review evidence and remaining work

P-032 reviewed the active contracts in `DATABASE-SPEC.md`, `DATA-MODEL.md`, `SECURITY.md`, `STATE-AND-RECOVERY.md`, `SYNC-PROTOCOL.md`, `ARCHITECTURE.md`, `LEARNING-CONTRACT.md`, `LEARNING-ENGINE.md` and `TESTING.md`.

### Standards verification

Review ngày 2026-09-21 đã đối chiếu với tài liệu chính thức:

- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security): grants và policies phải được cấu hình như hai lớp độc lập; service role có thể bypass RLS nên chỉ được giữ phía server; view/function exposed cần review bypass riêng.
- [PostgreSQL Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html): khi bật RLS mà không có policy phù hợp, hành vi là default-deny; policy theo operation/role và `USING`/`WITH CHECK` phải được kiểm thử riêng.
- [PostgreSQL `CREATE FUNCTION`](https://www.postgresql.org/docs/current/sql-createfunction.html): function chạy với đặc quyền chủ sở hữu cần `search_path` an toàn và quyền `EXECUTE` tối thiểu.

Các nguồn này xác nhận hướng deny-by-default, operation-specific policies, explicit grants và function hardening trong `DATABASE-SPEC.md`; chúng không thay thế executable evidence sau phê duyệt.

Remaining implementation evidence after approval:

- real migrations, rollback/forward-fix and compatibility run;
- PostgreSQL constraint/index inspection and query plans;
- Supabase role/grant/RLS/function tests;
- transaction/concurrency/failure-injection tests;
- secret/environment verification.

Remaining pre-code P0 is now only P-033’s exact backup/isolated-restore procedure. PLAN remains DRAFT until that evidence exists and the owner separately approves the Vertical Slice.
