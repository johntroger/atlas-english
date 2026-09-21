# Data model

## Nguyên tắc

- Supabase/PostgreSQL là nguồn dữ liệu chính cho tài khoản.
- Owner Alpha Preview và Public/Production là các data boundary khác nhau. Alpha data không tự động trở thành Production data.
- Attempt và consent event là append-only.
- Mọi projection học tập ghi `algorithm_version` và `content_version`.
- Guest state là ngắn hạn và không phải mastery chính thức.
- Private assessment content tách khỏi public practice content.

## Định danh

- ID dùng UUID.
- `user_id` chỉ tồn tại sau xác minh.
- `guest_session_id` ngẫu nhiên, không fingerprint thiết bị, hết hạn sau 24 giờ hoạt động gần nhất.
- Client tạo `attempt_id` và `idempotency_key` trước submit.

## Thực thể chính

### Identity

- `pending_accounts`: email chuẩn hóa/băm phù hợp, thời điểm tạo/hết hạn, số lần xác minh sai; xóa sau 24 giờ.
- `profiles`: user, locale, timezone, accessibility preferences, goal settings.
- `sessions`: do auth provider quản lý, tối đa 30 ngày.
- `consent_events`: loại, version, quyết định, timestamp, source.

### Learning

- `attempts`: append-only; exactly one account/guest actor, actor-scoped idempotency key, server request hash, node/item/content/narrative/evaluation versions, answer payload, server outcome, hints, timing, technical status and evidence eligibility. Guest retention purge is controlled and audited.
- `evidence_events`: append-only derivation record từ attempt hợp lệ.
- `mastery_projections`: user/node, mastery state, confidence, next review, algorithm version.
- `review_queue`: due item/node, reason, priority, cooldown.
- `mistake_focus`: tối đa 5 focus active, state và resolved timestamp.
- `quest_plans`: đề xuất theo ngày; không tạo debt.
- `external_score_events`: skill, score, date, source, self-reported, supersedes ID.

### Writing và pronunciation

- `writing_drafts`: owner, prompt, encrypted/controlled content, version, last edited, active editor lease, expires at.
- `writing_submissions`: immutable version; first-submission mastery eligibility.
- `pronunciation_results`: category/level, general error group, confidence band và practice milestone; không mastery eligibility, audio/fingerprint/raw feature.

### Content/assessment

- `content_releases`: pack ID/version/hash/status/review/provenance.
- `narrative_releases`, `story_progress`, `reward_grants`: immutable pack metadata, mission state/allowlisted choice flags, unique first-completion ID and at most one `(user,reward)` grant.
- `assessment_forms`, `assessment_sessions`, `item_exposures`: private schema/permission.
- `content_incidents`: affected versions/items, evidence invalidation and recompute status.

### Operations/privacy

- `analytics_events`: bảng deferred cho broader beta được phê duyệt riêng; Public Vertical Slice không ghi product analytics. Khi bật ở giai đoạn sau: opt-in identity/session, minimal payload, expires at 90 days.
- `error_events`: essential technical metadata, expires at 30 days.
- `data_exports`, `deletion_requests`, `progress_reset_requests`, `audit_events`.

## Retention

| Data | Retention |
|---|---|
| Guest state | 24h từ hoạt động gần nhất |
| Current answer buffer | 30 phút |
| Pending unverified account | 24h |
| Writing draft | 30 ngày từ lần sửa cuối |
| Broader-beta analytics nếu được phê duyệt/opt-in | 90 ngày; không áp dụng trong Public Vertical Slice |
| Error metadata | 30 ngày |
| Export link | 24h |
| Deleted account recovery | 30 ngày |
| Reset undo | 7 ngày |
| Inactive account | cảnh báo/xử lý ở 24 tháng |
| Admin audit | 12 tháng, append-only |

## Quy tắc xóa

- Xóa tài khoản khóa truy cập ngay, phục hồi trong 30 ngày, sau đó xóa/ẩn danh theo policy.
- Backup hết vòng đời không quá 30 ngày sau permanent deletion.
- Aggregate không thể đảo ngược có thể giữ nếu không tái định danh và được công bố.
- Reset progress không xóa exposure metadata cho đến khi account deletion, nhằm bảo vệ assessment.

## Chuyển lịch sử Owner Alpha

Mặc định không chuyển dữ liệu. Nếu chủ dự án yêu cầu giữ lịch sử khi mở môi trường mới, hệ thống tạo preview manifest và chỉ cho phép tập dữ liệu tối thiểu: profile/preferences được chọn, completed attempts, eligible evidence, story completion/choice flags, reward grants và consent/provenance cần thiết để audit việc nhập.

Không chuyển auth session/token, passwordless code, pending account, guest/current-answer state, Alpha access secret, test flag, error/analytics/audit logs, backup metadata hoặc derived projection cũ. Destination tạo user/ID mapping mới, kiểm content/algorithm compatibility, import idempotent, rồi rebuild mastery/review queue. Trước import phải có destination backup/restore point; kết quả gồm checksum, số record accepted/rejected và rollback reference. Không có blind overwrite.

Guest Quick Start import cũng là one-destination: một `guest_session_id_hash` chỉ được claim bởi một verified account. Server recompute evidence/story/reward từ acknowledged guest attempts và exact version snapshots; client summary không có authority.

## Thay đổi phá vỡ trong Owner Alpha

Ưu tiên theo thứ tự: backward-compatible migration → projection rebuild từ append-only evidence → narrow transformation có dry run → reset được owner xác nhận. Trước reset phải khóa ghi, tạo và xác minh encrypted backup/checksum, xuất impact manifest theo bảng/số record/version, giải thích vì sao các phương án bảo toàn không phù hợp và ghi exact reset target.

Không được dùng chấp thuận Alpha chung làm quyền reset. Mỗi reset cần xác nhận riêng sau impact preview. Sau reset, lưu migration/reset receipt không chứa learner content và kiểm tra lại identity, attempt idempotency, content versions, mastery initialization và backup schedule. Public/Production luôn cần migration/recovery plan riêng và không kế thừa ngoại lệ này.
