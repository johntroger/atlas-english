# State and recovery

## Mục tiêu

Website cần Internet nhưng không được làm mất câu trả lời đang nhập do gián đoạn ngắn. Recovery không biến thành chế độ offline.

## Phân loại state

| State | Nơi giữ | Thời hạn |
|---|---|---|
| UI tạm thời | memory | đến khi reload |
| Current answer | `sessionStorage` | tối đa 30 phút |
| Guest session/result | `localStorage` tối thiểu, có TTL | tối đa 24 giờ từ hoạt động gần nhất |
| Account progress | Supabase | theo retention policy |
| Writing draft | Supabase | 30 ngày từ lần sửa cuối |
| Audio pronunciation | memory/media buffer | đến khi thoát exercise/session |

`sessionStorage` chỉ dùng cho current answer; `localStorage` chỉ dùng cho guest ID ngẫu nhiên, completed-result references tối thiểu, content/version IDs, story checkpoint và consent/import state cần thiết. Không lưu raw free-form answer, secret, Gemini key của giai đoạn tương lai, private answer key, audio, email hay lịch sử tài khoản trong recovery buffer. Mọi lần đọc phải kiểm tra TTL; dữ liệu hết hạn bị xóa trước khi dùng. Guest state được xóa khi hết hạn hoặc sau import thành công; nếu từ chối import, nó được giữ đến TTL rồi xóa.

## Mất kết nối

1. Phát hiện request fail/offline.
2. Giữ current answer cùng item/content version và timestamp.
3. Hiển thị trạng thái mất mạng và nút thử lại; không phát item mới.
4. Khi online, kiểm tra session/content validity và submit bằng idempotency key.
5. Nếu item hết hiệu lực, giữ câu trả lời để hiển thị cho người dùng nhưng không chấm; thay item tương đương.
6. Technical failure không tạo wrong attempt/mastery penalty.

## Guest → account

- Chỉ import completed result còn trong 24 giờ.
- Hiển thị preview số kết quả và xin consent.
- Import idempotent, ghi provenance và không nhập partial answer.
- Từ chối import thì guest data tiếp tục đến expiry và sau đó xóa.

## Owner Alpha → môi trường công khai

- Mặc định bắt đầu sạch; không copy database, auth user hoặc session từ Preview.
- Nếu owner chọn giữ lịch sử, hiển thị manifest/category/count trước khi consent.
- Import chỉ nhận dữ liệu học đã hoàn thành và compatible; mọi record giữ source environment/version/provenance.
- ID mapping và import receipt làm thao tác idempotent; retry không nhân đôi attempt, reward hoặc evidence.
- Mastery/review projections được rebuild ở đích, không chép nguyên projection Alpha.
- Partial failure rollback toàn transaction hoặc cô lập batch có receipt rõ; không để trạng thái nửa nhập mà không thể audit.

## Owner Alpha reset

```text
breaking_change_detected
→ migration_assessed
→ migrate_or_rebuild
   | reset_proposed
     → backup_verified
     → impact_previewed
     → owner_confirmed | cancelled
     → reset_executed
     → smoke_tested
```

Không có transition tự động từ `reset_proposed` sang `reset_executed`. Xác nhận phải nêu đúng môi trường, bảng/phạm vi, dữ liệu sẽ mất và backup reference. Nếu owner không xác nhận, công việc dừng ở proposal và dữ liệu giữ nguyên.

## Writing

- Autosave server sau debounce và báo `Đã lưu`/`Đang lưu`/`Mất kết nối`.
- Local current draft buffer chỉ là recovery ngắn, không là nguồn chính.
- Một active editor. Thiết bị khác xem read-only cho đến khi takeover.
- Takeover thông báo thiết bị cũ; version conflict không bị ghi đè im lặng.
- Submitted version bất biến.

## Release/content recovery

- Release mới phải backward-compatible với phiên trước trong cửa sổ rollout.
- Owner Alpha version handshake may move `current → update_pending → reload_at_safe_boundary → current`. `update_pending` never interrupts `answering` or `submit_pending`; P0 can instead move the affected feature to `blocked_for_safety` without turning the answer into a wrong attempt.
- Content pack bất biến; rollback đổi active pointer, không sửa pack.
- Content incident đánh dấu evidence liên quan không hợp lệ và rebuild projection.
- Database backup rolling 30 ngày; isolated restore phải đạt trước Public Preview, chạy hằng tháng trong ba tháng public đầu tiên rồi hằng quý.

## UX bắt buộc

Phải phân biệt: chưa lưu, đang retry, hết phiên, content đã thay đổi, draft bị takeover, guest sắp hết hạn và server unavailable. Không dùng thông báo “đã đồng bộ” vì không có mô hình local/cloud mirror.

## State machines trước implementation

### Identity

```text
guest
→ pending_verification (vẫn có quyền như guest)
→ verified_account
→ deletion_locked
→ recovered | permanently_deleted
```

Mỗi verification challenge hết hạn sau 60 phút hoặc bị vô hiệu sau 5 lần sai; pending account vẫn tồn tại đến giới hạn 24 giờ và có thể xin challenge mới khi rate limit cho phép. Pending account hết 24h → guest-only state còn theo guest expiry; không tạo verified profile. Sensitive actions từ verified account → `reauth_required` → success/failure.

### Attempt

```text
started
→ answering
→ submit_pending
→ acknowledged
→ evidence_projected | practice_recorded | technically_invalid
```

Retry từ `submit_pending` dùng cùng idempotency key. Session/content hết hạn → `not_submittable`, cho copy answer phù hợp; không tạo wrong attempt.

### Story mission

```text
locked → available → active → first_completed → replayable
```

Reward chỉ ở transition `active → first_completed`. Replay không cấp lại story reward/progress; learning attempt tuân `LEARNING-CONTRACT.md`.

### Guest import

```text
eligible_guest_results
→ previewed
→ consented | declined
→ importing
→ imported | failed_without_partial_commit
```

Import unique theo verified user + guest session hash, chỉ completed results còn hạn.

### Content/Narrative release

```text
draft → validated → codex_pre_reviewed (optional) → reviewed → approved → preview → active → deprecated → retired
```

`codex_pre_reviewed` chỉ hợp lệ cho nội bộ/Owner Alpha; non-owner release cần `approved`. Artifact immutable. Rollback đổi active pointer. Attempt snapshot giữ resolved item/mission/version.

## P-032 authoritative state contract

### State ownership

| State | Authority | Persisted form | Client may propose | Client may never decide |
|---|---|---|---|---|
| current answer/UI submit | browser until acknowledgement | 30-minute recovery buffer only | answer, attempt UUID, idempotency key | correctness, evidence eligibility, actor ownership |
| guest identity/expiry | server-bound guest provenance plus limited browser state | hashed provenance on server attempt; guest state expires in 24h | continue same bound guest session | user ID, extended expiry, imported status |
| account identity | auth provider + server verified context | `auth.users`/`profiles` | start verification, reauthenticate | verified/deleted/elevated state |
| attempt/result | application/server | append-only `attempts` | answer command and snapshot IDs | outcome, scoring version, technical/evidence state |
| mastery/review | domain + server transaction | projections rebuilt from evidence | none | score/confidence/due date |
| mission/reward | server mission-completion transaction | `story_progress`/`reward_grants` | choice flag from allowed set, completion request | first completion, unlock, reward grant |
| release | release tooling/environment | release catalogs + active pointer | none | audience/review status/active version |

### Identity transitions

| From | Event/guard | To | Persisted effect |
|---|---|---|---|
| `guest` | user requests email verification; rate/size checks pass | `pending_verification` | auth-provider pending state; product permissions remain guest |
| `pending_verification` | one-use link/code valid, confirmations valid | `verified_account` | create/ensure profile and versioned consent events transactionally |
| `pending_verification` | challenge hết 60 phút hoặc lần nhập sai thứ năm | `pending_verification` | challenge bị vô hiệu; cho xin challenge mới nếu pending account còn hạn và rate limit cho phép |
| `pending_verification` | pending account hết 24 giờ | `guest` | pending auth state bị xóa; existing guest state keeps its own expiry |
| `verified_account` | session expiry/sensitive action | `reauth_required` | no learning-state mutation |
| `reauth_required` | successful fresh authentication | `verified_account` | refreshed secure session only |

`deletion_locked/recovered/permanently_deleted` remain target-model states but are outside the first migration. No slice state or UI may pretend the full deletion lifecycle exists before its separately approved phase.

### Attempt command transitions

| From | Event/guard | To | Server/database result |
|---|---|---|---|
| `answering` | submit pressed; local command complete | `submit_pending` | buffer retained; no correctness shown as authoritative |
| `submit_pending` | no server response/network failure | `retryable_interruption` | no wrong result; retry keeps exact attempt ID/key/payload |
| `retryable_interruption` | online, session/content still valid | `submit_pending` | resend same command |
| `submit_pending` | same actor/key and same server request hash already committed | `acknowledged` | return stored acknowledgement; zero new rows/grants |
| `submit_pending` | same actor/key but different request hash | `idempotency_conflict` | `409`; no write; preserve answer and require a new command/key after user-visible recovery |
| `submit_pending` | actor/content/answer valid | `acknowledged` | commit attempt + eligible evidence + projections atomically, then return receipt |
| `submit_pending` | expired session, retired/incompatible content, invalid actor or payload | `not_submittable` | no learning attempt/wrong result; safe reason and replacement/reauth path |
| `submit_pending` | accepted technical/content incident worth recording | `technically_invalid` | optional append-only non-evidentiary attempt; no mastery/reward penalty |

`acknowledged` is a commit boundary, not a loading label. Feedback/history may use the server outcome only after that boundary. A client-side evaluator may render an explicitly optimistic preview for public practice but must reconcile to the acknowledgement and must never write evidence.

### Mission/reward transitions

| From | Guard | To | Atomic effects |
|---|---|---|---|
| `locked` | prerequisite mission first-completed | `available` | progress projection may be created |
| `available` | learner starts mission | `active` | no reward |
| `active` | required slots have acknowledged compatible attempts; completion key valid | `first_completed` | set immutable `first_completion_id/at`, store allowlisted choice, insert at most one `(user,reward)` grant and unlock next mission |
| `first_completed` | response/read acknowledgement | `replayable` | no new first-completion reward |
| `replayable` | replay starts/completes | `replayable` | learning attempts follow normal eligibility; story/reward grant unchanged |

Concurrent completion requests lock the same progress row or use equivalent compare-and-set semantics. The winner creates the completion/reward; the loser returns the same first-completion receipt. Choice flags can affect dialogue/Notebook only and cannot enter scoring, unlock or reward-value predicates.

### Guest import transitions

| From | Guard | To | Atomic effects |
|---|---|---|---|
| `eligible_guest_results` | verified user asks for preview with bound, unexpired guest provenance | `previewed` | count compatible completed attempts; no mutation |
| `previewed` | explicit import consent + policy version | `consented` | append consent event |
| `consented` | same guest not imported elsewhere; key/hash valid | `importing` | begin one transaction and lock/claim guest provenance |
| `importing` | all references compatible | `imported` | receipt, eligible evidence, rebuilt projections, compatible story completion and one-time reward commit together |
| `importing` | any validation/write fails | `failed_without_partial_commit` | full rollback; consent remains, learning/story/reward rows unchanged; retry same key/hash allowed |
| `previewed` | declined | `declined` | no import; guest state remains until its normal expiry |

Client-provided correctness, mastery, story completion and reward flags are ignored during import. Server recomputes from acknowledged guest attempts and exact supported pack/algorithm snapshots. `guest_session_id_hash` can have only one destination account.

### Release transition guards

- Only one active version per pack ID; activation and rollback serialize on that pack.
- Owner Alpha project may activate `codex_pre_reviewed + owner_alpha`; Public/Production may activate only `approved + public`.
- Activation cannot occur while a question is being answered/submitted; client receives `update_pending` and changes at checkpoint/safe stop.
- Retire/deactivate never mutates an acknowledged attempt snapshot. Content incident invalidates derived evidence through an explicit event/metadata path and rebuilds projections.
