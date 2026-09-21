# Observability and operations

## Nguyên tắc

Không session replay, không nội dung học nhạy cảm trong telemetry và không uptime commitment trong beta. Vertical slice dùng kiểm tra thủ công; trước public beta phải bật tối thiểu email cảnh báo quota từ nhà cung cấp. Vẫn phải đủ dữ liệu để tìm lỗi, bảo vệ dữ liệu và rollback.

Public Vertical Slice không thu product-behavior analytics, kể cả opt-in events. Chỉ essential operational metadata cho lỗi kỹ thuật, failed submit, retry/idempotency và quota được giữ tối đa 30 ngày. Qualitative feedback dùng biểu mẫu tự nguyện tách khỏi learning record. Broader beta có thể đề xuất opt-in analytics bằng quyết định riêng.

## Tín hiệu tối thiểu

- request rate/error/latency theo route class;
- auth verification/rate-limit/pending expiry aggregate;
- attempt submit/idempotency/retry/technical-failure;
- guest import/expiry aggregate;
- writing autosave/conflict/takeover aggregate;
- content version/validation/incident;
- assessment delivery/exposure violations;
- retention/export/delete/reset job success;
- backup/restore and release health.

Không ghi raw email, answer, Writing body, audio, token, secret, answer key hoặc future AI key/prompt.

## Retention

- Essential error metadata: 30 ngày.
- Opt-in analytics ở broader beta: 90 ngày; withdrawal xóa liên kết. Vertical Slice không bật analytics này.
- Admin audit: 12 tháng, append-only.
- Incident/support report đã giải quyết: tối đa 90 ngày trừ nghĩa vụ khác được công bố.

## Operations

- Manual dashboard/status check theo lịch trong beta.
- Provider quota email phải được kiểm thử trước public beta; đây là cảnh báo tự động tối thiểu, không thay thế quan sát thủ công.
- Feature flags/circuit breakers cho signup, assessment và tính năng không thiết yếu.
- Rate limits và giới hạn kích thước request áp dụng cho auth, ghi attempt, import và assessment endpoints.
- Vertical Slice baseline with Supabase's built-in email provider: auth 2/email/hour and 10/IP/hour; attempt 30/actor/minute and 60/IP/minute; import 3/account/hour; payload 32 KB/attempt and 256 KB/import. A higher email limit requires verified custom SMTP/provider capacity, abuse testing and a documented configuration change. Limit hits are operational events, never learning failures.
- Quota/incident degradation order: pause new signup and auth-email sends first; then disable guest import, history refresh and other nonessential account features; preserve guest practice only while scoring and minimum persistence remain safe; switch the whole site to maintenance when correctness, idempotency or data integrity cannot be guaranteed.
- Release all-at-once chỉ sau health check; automatic rollback khi threshold nghiêm trọng.
- Daily encrypted logical backup rolling 30 days starts when Owner Alpha first stores real progress and continues for public environments. Alpha and Public/Production use distinct source identifiers/object prefixes/credential scopes; a failed, missing or environment-mislabeled backup is an operational incident. Restore into an isolated target before public release, monthly for the first three public months and quarterly thereafter.
- Exact backup/restore health semantics, command guards and redacted evidence fields follow [`BACKUP-RESTORE-RUNBOOK.md`](BACKUP-RESTORE-RUNBOOK.md); a green scheduled job without verified object metadata is not `backup_verified`, and a successful decrypt without database invariants is not a passed restore drill.

## Runbook ưu tiên

Auth abuse, RLS/data exposure, private-bank leak, duplicate/lost attempt, content scoring incident, provider/database outage, quota exhaustion, retention job failure và failed release.

Every emergency mode has an owner-visible status, user-facing Vietnamese message, activation reason, start time and manual recovery check. Degradation never converts an unsaved/technical result into a wrong answer.

Public Slice quota thresholds are evaluated separately for database, file storage, uncached egress and cached egress:

- 75%: owner warning plus daily manual review until usage falls;
- 90%: activate the first applicable degradation step and freeze nonessential growth;
- 95% or provider safety/read-only warning: advance to the next degradation step;
- actual read-only state or uncertain integrity/correctness: full maintenance.

The owner selected these utilization-focused thresholds on 2026-09-20 and accepted the shorter response window relative to a 60% warning policy.

## Status communication

Thông báo ngắn bằng tiếng Việt, nêu ảnh hưởng và hành động người dùng. Không khẳng định dữ liệu an toàn khi chưa xác minh. Security/data request được acknowledge trong 24 giờ; support thường trong 3 ngày làm việc.
