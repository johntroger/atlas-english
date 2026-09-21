# Open beta test plan

## Điều kiện vào beta

- PLAN/implementation gates đã được phê duyệt.
- Legal/privacy release blocker đã đóng hoặc beta được giới hạn hợp pháp bằng quyết định rõ.
- Core acceptance, RLS, retention, backup/restore, rollback và accessibility checks đạt.
- Nội dung beta được IELTS reviewer độc lập duyệt.
- Signup pause, guest continuity và incident communication đã rehearsal.
- Provider quota email, rate limits, request-size controls và signup/assessment kill switch đã được bật và kiểm thử.

## Mô hình beta

- Public guest play và open self-service registration.
- Không invite/allowlist/user cap ở tầng sản phẩm.
- Không cam kết uptime.
- Emergency switch có thể tạm dừng signup/tính năng không thiết yếu khi quota/sự cố.
- Feedback prompt tối đa một lần/tuần và luôn tùy chọn.

Trước beta có thể có một publicly reachable Vertical Slice Preview với expected cohort dưới 10 người. Preview này không được gọi là public beta hoặc dùng Production data, nhưng vì không có access gate nên vẫn phải có privacy notice, rate limits, quota monitoring và emergency switches.

Vertical Slice Preview chỉ dùng essential operational logs giữ 30 ngày và qualitative feedback tự nguyện; không product analytics/session replay. Opt-in event analytics chỉ được cân nhắc lại cho broader beta.

## Giai đoạn

1. Technical test: dữ liệu giả, tập trung auth/RLS/recovery/release.
2. Academic review: content, claims, feedback và assessment wording.
3. Open beta: quan sát usability/reliability/content defects.
4. Learning validation 4–8 tuần hoặc đủ evidence: retention/transfer/calibration.

## Kịch bản bắt buộc

- chơi khách, hết hạn, login và import/decline;
- signup/verification abuse và quota pause;
- disconnect/reconnect giữa câu;
- Writing autosave/takeover;
- mic denied, low confidence và unsupported browser;
- content report/retire/recompute;
- export, reset, deletion và inactivity job;
- release all-at-once, health check và rollback.

## Chỉ số

- activation và cluster completion;
- safe-stop vs abandonment;
- weekly return/consistency, không dùng thời gian app làm learning claim;
- review due/completion và delayed evidence;
- technical failure/retry/duplicate prevention;
- content report rate và correction time;
- accessibility/support/privacy request;
- calibration coverage và claim eligibility.

## Điều kiện dừng

Dừng signup hoặc rollback khi có data leak/cross-account access, private-bank exposure, mất dữ liệu, incorrect scoring diện rộng, retention failure, inaccessible critical flow hoặc quota đe dọa dữ liệu. Guest core chỉ giữ nếu an toàn.

## Điều kiện thoát beta

Không còn blocker nghiêm trọng; restore/release rehearsal đạt; academic/legal gates đóng; trend reliability ổn định; claims đúng evidence; support/incident process vận hành được.
