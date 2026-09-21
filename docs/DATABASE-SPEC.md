# Database specification

## Phạm vi

PostgreSQL/Supabase cho dữ liệu tài khoản online. Không có local database hay sync mirror trong MVP.

## Mô hình dữ liệu mục tiêu theo giai đoạn

Danh sách dưới đây là kiến trúc đích, không phải danh sách migration đầu tiên. Vertical slice chỉ được tạo các bảng ghi rõ ở phần `Vertical-slice physical contract`; các nhóm Writing, Pronunciation, private assessment và privacy/ops mở rộng thuộc phase sau.

| Nhóm | Bảng |
|---|---|
| Identity | `pending_accounts`, `profiles`, `consent_events` |
| Learning events | `attempts`, `evidence_events`, `external_score_events` |
| Projections | `mastery_projections`, `review_queue`, `mistake_focus`, `quest_plans` |
| Writing | `writing_drafts`, `writing_submissions` |
| Pronunciation | `pronunciation_results` |
| Content | `content_releases`, `content_incidents` |
| Private assessment | `assessment_forms`, `assessment_sessions`, `item_exposures` |
| Privacy/ops | `analytics_events`, `error_events`, `data_exports`, `deletion_requests`, `progress_reset_requests`, `audit_events` |

Vertical slice dùng đúng các bảng: `profiles`, `attempts`, `evidence_events`, `mastery_projections`, `review_queue`, `guest_imports`, `consent_events`, `content_releases`, `narrative_releases`, `story_progress`, `reward_grants`. Không được suy diễn các bảng mục tiêu khác vào migration đầu tiên.

## Hợp đồng attempt

Trường bắt buộc:

- `id uuid primary key` do client tạo;
- `idempotency_key text`, unique theo actor scope bằng hai partial unique indexes cho account và guest;
- `user_id uuid null` hoặc provenance import guest;
- `item_id`, `node_id`, `content_pack_version`;
- `mode` (`practice`, `assessment`, `diagnostic`);
- `started_at`, `submitted_at` theo server;
- `answer_payload` tối thiểu, không chứa secret/audio;
- `outcome`, `hint_count`, `technical_status`;
- `evidence_eligible boolean` và `ineligibility_reason`;
- `evaluation_algorithm_version` và `scoring_contract_version`; nếu có chọn bài thích ứng thì lưu thêm `selection_algorithm_version`.

Attempt không update/delete bằng luồng nghiệp vụ thông thường. Sửa lỗi dùng compensating/evidence invalidation event.

## RLS

- Người dùng chỉ đọc dữ liệu sở hữu; service role chỉ ở server.
- Public role chỉ đọc public content đã publish và endpoint guest được giới hạn.
- Private assessment tables không có client-direct read.
- Admin/editor/reviewer tách role; thay đổi nhạy cảm cần MFA/elevated session.
- RLS tests bắt buộc cho cross-user access, guest escalation và private bank.

## Writing concurrency

- Draft có `version`, `lease_owner`, `lease_expires_at`, `updated_at`, `expires_at`.
- Autosave dùng optimistic concurrency và debounce.
- Conflict trả trạng thái takeover/refresh; không merge im lặng.
- Submission bất biến và tham chiếu snapshot/version của draft.

## Idempotency và transaction

- Submit attempt dùng unique constraint actor + idempotency key. Account scope là `(actor_user_id, idempotency_key)`; guest scope là `(guest_provenance_id, idempotency_key)`.
- Server lưu `request_hash` chuẩn hóa để phân biệt retry thật với tái sử dụng key cho payload khác.
- Vertical Slice ghi attempt, evidence đủ điều kiện, mastery/review projection cần thiết và acknowledgement snapshot trong cùng database transaction; không thêm outbox table khi chưa có nhu cầu đã đo. Đây không phải offline client outbox.
- Retry cùng key/hash trả cùng acknowledgement logic; cùng key nhưng khác hash bị từ chối, không nhân đôi XP/evidence/story/reward.

## Lifecycle jobs

Job có audit và idempotency cho: pending-account expiry, guest cleanup, draft expiry, analytics/error expiry, reset finalization, inactive-account warning/deletion, export expiry và deletion finalization.

## Migrations

- Tất cả schema change qua migration trong repository.
- Expand/contract và backward compatibility trong rollout.
- Không chỉnh production dashboard mà không có migration tương ứng.
- Preview/test không được trỏ Production.
- Owner Alpha and Public/Production use different Supabase projects. No whole-database clone or in-place promotion is permitted; any owner-history transfer uses an explicit versioned migration/import with ID mapping, idempotency receipt and projection rebuild.

## Private bank

Chi tiết key/calibration có schema riêng trong private repository. Public repo chỉ giữ interface, fixture giả và security tests; không giữ production item/answer.

## Vertical-slice physical contract

Đây là physical contract đã hoàn tất document review trong P-032. Nó vẫn chưa phải migration và không cho phép tạo database khi PLAN còn DRAFT. Beta-only tables không được tạo sớm.

### Quan hệ

```text
auth.users 1—1 profiles
profiles 1—N account attempts; guest attempts use guest provenance instead
attempts 1—0..1 evidence_events
profiles 1—N mastery_projections
profiles 1—N review_queue
profiles 1—N story_progress
story_progress 1—0..N reward_grants through a first-completion identifier
content_releases 1—N attempts
narrative_releases 1—N story_progress
guest_imports links guest_session_id to verified user_id
```

### Cột tối thiểu

| Bảng | Cột/constraint chính |
|---|---|
| `profiles` | `user_id uuid PK/FK auth.users`, `locale text`, `timezone text`, `created_at timestamptz`, `updated_at timestamptz`; locale/timezone allowlist/check |
| `attempts` | `id uuid PK client`, `actor_user_id uuid null`, `guest_provenance_id uuid null`, `idempotency_key text`, `request_hash char(64)`, `item_id text`, `item_version text`, `node_id text`, `content_pack_id/version text`, `narrative_pack_id/version text null`, `mission_id/version text null`, `slot_id/version text null`, `evaluation_algorithm_version text`, `scoring_contract_version text`, `selection_algorithm_version text null`, `answer_payload jsonb`, `server_outcome jsonb`, `hint_count int>=0`, `progress_channel text`, `evidence_eligible bool`, `ineligibility_reason text null`, `technical_status text`, `client_started_at timestamptz null`, `received_at/submitted_at timestamptz server`, `guest_expires_at timestamptz null`; CHECK đúng một trong `actor_user_id`/`guest_provenance_id` có giá trị; partial unique account `(actor_user_id,idempotency_key) WHERE actor_user_id IS NOT NULL`; partial unique guest `(guest_provenance_id,idempotency_key) WHERE guest_provenance_id IS NOT NULL` |
| `evidence_events` | `id uuid PK`, `attempt_id uuid UNIQUE FK`, `user_id uuid`, `node_id text`, `score numeric`, `algorithm_version text`, `created_at timestamptz`, `invalidated_at/reason null`; append-only except controlled invalidation metadata |
| `mastery_projections` | `user_id uuid`, `node_id text`, `score numeric 0..100`, `confidence numeric 0..1`, `algorithm_version text`, `last_evidence_at`, `next_review_at`; PK `(user_id,node_id)` |
| `review_queue` | `user_id uuid`, `node_id text`, `due_at`, `reason_code text`, `recommended_exercise_type text`, `scheduler_version text`, `updated_at`; PK `(user_id,node_id)` |
| `guest_imports` | `id uuid PK`, `user_id uuid`, `guest_session_id_hash char(64)`, `idempotency_key text`, `request_hash char(64)`, `consent_event_id uuid`, `imported_attempt_count int`, `imported_evidence_count int`, `result_hash char(64)`, `created_at`; UNIQUE `guest_session_id_hash` prevents one guest history being imported into two accounts; unique `(user_id,idempotency_key)` makes same-account retry stable |
| `consent_events` | `id uuid PK`, `user_id uuid null`, `guest_session_id_hash text null`, `consent_type text`, `policy_version text`, `decision bool`, `source text`, `created_at timestamptz`; append-only; `policy_version` stores an immutable date-based identifier such as `terms-YYYY-MM-DD-vN` or `privacy-YYYY-MM-DD-vN`; Vertical Slice types include separate `age_residency_attestation`, `terms_acceptance`, `privacy_acknowledgement` and `guest_import` events |
| `content_releases` | `pack_id/version`, `schema_version int`, `content_hash char(64)`, `review_status text`, `audience text`, `status text`, `activated_at`; PK `(pack_id,version)`; partial unique `(pack_id) WHERE status='active'` |
| `narrative_releases` | `pack_id/version`, `schema_version int`, `content_hash char(64)`, `review_status text`, `audience text`, `status text`, `activated_at`; PK `(pack_id,version)`; partial unique `(pack_id) WHERE status='active'` |
| `story_progress` | `user_id uuid`, `mission_id text`, `mission_version text`, `state text`, `first_completion_id uuid null`, `first_completed_at timestamptz null`, `choice_flags jsonb`, `narrative_pack_id/version text`; PK `(user_id,mission_id)`; `first_completion_id` globally unique when present; UNIQUE `(user_id,mission_id,first_completion_id)` supports the reward source FK |
| `reward_grants` | `user_id uuid`, `reward_id text`, `source_mission_id text`, `source_completion_id uuid`, `granted_at timestamptz`; UNIQUE `(user_id,reward_id)` prevents the same first-completion reward through another completion ID; composite FK ties source mission/completion to `story_progress` |

`answer_payload` và `server_outcome` phải có typed application schema; JSONB không cho phép payload tùy ý. Raw audio và private answer key không có cột nào trong slice.

### Kiểu, constraint và delete policy bắt buộc

- Mọi business text ID/version dùng non-empty trimmed text; semantic version dùng application validation plus database CHECK; hash dùng 64 lowercase hex characters.
- `request_hash` là SHA-256 do server tính trên canonical actor scope + attempt/import command, không tin hash do client gửi. Cùng actor/key + cùng hash trả receipt cũ; cùng actor/key + hash khác trả `409 idempotency_conflict` và không ghi gì.
- `attempts.progress_channel` chỉ `mastery|practice|technical`; `technical_status` chỉ `ok|client_interrupted|server_error|content_invalid|session_invalid`; `evidence_eligible=true` yêu cầu `progress_channel='mastery'`, `technical_status='ok'`, `hint_count=0` và `ineligibility_reason IS NULL`.
- Guest attempt bắt buộc có `guest_expires_at`; account attempt bắt buộc không có. Retention purge sau expiry là ngoại lệ có kiểm soát duy nhất đối với append-only guest attempts và phải audit số lượng, không biến thành business update/delete API.
- Narrative fields là all-or-none: nếu có `mission_id` thì phải có narrative pack/mission/slot ID và version; nếu không có mission thì toàn bộ narrative snapshot fields phải null.
- Composite FK từ attempt tới `(content_pack_id, content_pack_version)` là `RESTRICT`; narrative snapshot FK cũng `RESTRICT`. Release metadata không hard-delete khi còn attempt/progress tham chiếu; chỉ deprecate/retire.
- `evidence_events.attempt_id` UNIQUE và FK `ON DELETE RESTRICT`; chỉ account/consented-import evidence có `user_id`. Controlled invalidation chỉ điền `invalidated_at/reason`, không sửa score lịch sử.
- `score`, `confidence`, mastery/review dates và version fields có NOT NULL/CHECK phù hợp; projection rows có `updated_at` và `last_attempt_id` để audit/rebuild.
- `consent_events` CHECK đúng một actor (`user_id` XOR `guest_session_id_hash`), immutable, và policy/consent enum allowlist. Không cascade delete consent/evidence cần cho audit trong retention window.
- `story_progress.state` chỉ `available|active|first_completed|replayable`; `first_completion_id/at` cùng null trước completion và cùng non-null sau completion. `choice_flags` phải là JSON object với allowlisted keys từ Narrative Pack.
- Public project chỉ activate release có `review_status='approved'` và `audience='public'`. Owner Alpha Preview có thể activate `codex_pre_reviewed` với `audience='owner_alpha'`; environment constraint/release tooling từ chối cross-audience activation.
- Không dùng database cascade từ `auth.users` để âm thầm xóa learning history trong slice. Account deletion lifecycle ở phase sau dùng explicit audited workflow; Alpha reset theo contract riêng.

### Index tối thiểu

- `attempts(actor_user_id, submitted_at desc)`.
- `attempts(guest_provenance_id, submitted_at desc)` với điều kiện guest provenance không null.
- `attempts(item_id, item_version)` cho content incident.
- `evidence_events(user_id, node_id, created_at)`.
- `review_queue(user_id, due_at)`.
- `story_progress(user_id, state)`.
- unique partial `story_progress(first_completion_id) WHERE first_completion_id IS NOT NULL`.
- unique `(user_id,mission_id,first_completion_id)` on `story_progress` for the composite reward-source FK; PostgreSQL permits multiple pre-completion nulls while the PK still separates rows.
- unique `reward_grants(user_id,reward_id)` và lookup `(user_id,granted_at desc)`.
- unique `guest_imports(guest_session_id_hash)` cùng `(user_id,idempotency_key)`.
- partial `attempts(guest_expires_at) WHERE guest_provenance_id IS NOT NULL` cho guest cleanup.
- partial unique `content_releases(pack_id) WHERE status='active'` và tương tự cho narrative.
- partial indexes cho invalidated evidence và pending lifecycle jobs khi các bảng đó được thêm.

Không thêm index chỉ vì một cột tồn tại. Trước migration, mỗi index phải gắn với query/RLS/cleanup path ở trên; implementation dùng `EXPLAIN` trên fixture scale và kiểm write amplification.

### Foreign-key và migration order

Migration đầu tiên được chia theo dependency và mỗi bước phải rollback/forward-fix được mà không dùng Production data:

1. `001_types_and_guard_functions`: enum/check helpers, immutable timestamp/hash/version guards; chưa cấp browser grant.
2. `002_release_catalogs`: `content_releases`, `narrative_releases`, active-version uniqueness và audience/review constraints.
3. `003_identity_and_consent`: `profiles`, `consent_events`; profile chỉ tạo sau verified auth identity.
4. `004_attempt_ledger`: `attempts`, actor XOR, request hash, composite release FKs, two partial idempotency indexes và append-only guard.
5. `005_learning_evidence_and_projections`: `evidence_events`, `mastery_projections`, `review_queue` plus rebuild/audit columns.
6. `006_story_and_rewards`: `story_progress`, completion invariant, `reward_grants` và one-reward uniqueness.
7. `007_guest_import_receipts`: `guest_imports`, one-destination guest uniqueness và import idempotency receipt.
8. `008_rls_grants_and_application_functions`: enable/force RLS where applicable; explicit revoke/grant; hardened submit/profile/mission/import functions and safe read paths.
9. `009_release_and_negative_tests`: synthetic seed metadata for Preview tests only, grants/RLS/function allow-deny checks and migration compatibility evidence; không seed learner data vào Public/Production.

Migration order là contract; implementation có thể tách file nhỏ hơn nhưng không đảo dependency hoặc gom grant/RLS vào trước invariant tables.

### Grant + RLS operation matrix — vertical slice

`anon` và `authenticated` là database/browser roles; “owner” nghĩa là row có `user_id = auth.uid()`. Content/editor/privacy operator là application roles kiểm ở server, không lấy từ user-editable JWT metadata. `service_role` chỉ tồn tại trong server/job secret scope và luôn cần application authorization dù có thể bypass RLS.

| Bảng | `anon` direct | `authenticated` direct | Other user | Operator/server path | Service/recovery |
|---|---|---|---|---|---|
| `profiles` | deny all | SELECT own; no direct INSERT/UPDATE/DELETE | deny all | safe-field update use case/RPC validates allowlist | controlled create/recovery only |
| `attempts` | deny all | SELECT own account attempts; no direct mutation | deny all | authenticated submit use case/RPC; guest uses rate-limited server endpoint | retention/rebuild read; no ordinary UPDATE/DELETE |
| `evidence_events` | deny all | SELECT own; no direct mutation | deny all | evaluator/import transaction inserts; incident flow may invalidate | rebuild/incident only |
| `mastery_projections` | deny all | SELECT own | deny all | projection use case only | rebuild/upsert only |
| `review_queue` | deny all | SELECT own | deny all | scheduler projection only | rebuild/upsert only |
| `guest_imports` | deny all | SELECT own receipt; no direct mutation | deny all | consented import transaction only | incident/recovery read |
| `consent_events` | deny all | SELECT own account events; no direct mutation | deny all | versioned consent use case appends; guest endpoint uses server-bound provenance | retention/privacy workflow only |
| `content_releases` | deny base table | deny base table | deny | release tooling and content-delivery adapter return allowlisted safe metadata/content | activate/deactivate/rollback only |
| `narrative_releases` | deny base table | deny base table | deny | release tooling and content-delivery adapter return allowlisted safe metadata/content | activate/deactivate/rollback only |
| `story_progress` | deny all | SELECT own; no direct mutation | deny all | mission completion/choice use case only | rebuild/recovery only |
| `reward_grants` | deny all | SELECT own | deny all | same mission-completion transaction inserts idempotently | recovery verification only |

Không cấp browser `insert/update/delete` trực tiếp chỉ vì RLS có thể lọc owner. Public content được phân phối qua content adapter, không qua một base-table grant. Nếu implementation thêm view, view phải `security_invoker` với column/grant/RLS proof hoặc bị server-only/revoke; không dùng security-definer view như lối tắt.

### Policy/function hardening và allow-deny tests

- Mỗi bảng user-owned enable RLS trước khi có data và `FORCE ROW LEVEL SECURITY` khi tương thích với owner/function strategy. Policy tách `SELECT`, `INSERT`, `UPDATE`, `DELETE`; operation không dùng thì không có policy và bị revoke grant.
- Authenticated SELECT policy dùng `auth.uid()` từ verified request context, không dùng email, profile field hoặc user-editable `raw_user_meta_data`. Update policies (nếu sau review thật sự cần) có cả `USING` cho old row và `WITH CHECK` cho new row.
- Security-definer function bắt buộc: fixed safe `search_path`, schema-qualified object, owner role không đăng nhập, `REVOKE ALL ... FROM PUBLIC`, explicit EXECUTE grant tối thiểu, actor lấy từ trusted context, server recompute request hash và exception không lộ row/secret.
- Guest endpoint không nhận `user_id`, `evidence_eligible`, `correct`, `server_outcome`, release status hoặc expiry từ client như authority. Nó lấy guest provenance từ signed/HttpOnly server binding, áp rate/size limit trước database work và chỉ gọi một command contract.
- Content/editor/privacy operator không có browser-visible Supabase credential. Mọi elevated request kiểm MFA/elevated-session ở application layer, ghi audit tối thiểu và không dùng role claim người dùng tự sửa.
- Test matrix cho từng exposed relation/function phải có `anon`, owner, other-user, expired/deleted actor, malformed actor, operator đúng/sai scope và service job đúng/sai environment. Mỗi role chạy SELECT/INSERT/UPDATE/DELETE hoặc EXECUTE kể cả operation dự kiến deny.
- Negative tests bắt buộc: đổi `actor_user_id`; đổi owner qua UPDATE; đọc row người khác; guest đoán UUID; import cùng guest vào user thứ hai; cùng idempotency key khác payload; gọi function với retired/wrong-audience pack; operator claim giả; view/function bypass; service secret xuất hiện ở browser/log.
- Positive tests bắt buộc: owner đọc dữ liệu mình; retry cùng key/hash trả cùng receipt; guest submit qua endpoint đúng scope; consented import chỉ một destination; release adapter chỉ trả artifact active đúng audience; incident invalidation không sửa attempt gốc.

### Trì hoãn đến Beta MVP/Post-validation

Writing drafts/submissions, full lifecycle/export/delete tables, analytics/error retention tables và private assessment tables chỉ có migration khi phase tương ứng được phê duyệt. Specification logic của chúng vẫn giữ trong tài liệu nhưng không làm phình vertical slice.
