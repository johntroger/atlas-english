# UX flows

## Navigation

- Mobile: Trang chủ / Học / Tiến độ / Cá nhân.
- Desktop: cùng information architecture, không thêm luồng riêng.
- Guest thấy tab Tiến độ với giải thích đăng nhập; không bị chặn Quick Start.

## First visit

`Landing → Chơi ngay hoặc Đăng nhập → privacy notice ngắn → chọn kỹ năng/mức → cluster 3–5 phút → checkpoint`

Primary path is guest-first. Landing may show `Đăng nhập` as a secondary action but does not interrupt Quick Start. The first contextual sign-in invitation appears only after the first checkpoint, explains history/progress value, and requires explicit consent before importing eligible guest results.

Account creation shows two separate required checkboxes, both unchecked by default: `Tôi xác nhận mình từ 18 tuổi và đang cư trú tại Việt Nam`; and `Tôi đồng ý Điều khoản sử dụng và xác nhận đã đọc Thông báo quyền riêng tư`. Terms and Privacy open without losing entered email or guest progress. If either remains unchecked, no pending account is created and the user can return to guest play. Vertical Slice shows no marketing checkbox.

Onboarding account tối đa 5 câu. Diagnostic tùy chọn theo module 5 phút và có thể bỏ qua khi nhập external score.

## Learning cluster

- Một nhiệm vụ trên màn hình; progress `x/5` hoặc thời lượng ngắn.
- Skip trong practice; unanswered không tạo mastery.
- Hint làm practice-only và được báo trước.
- Hint là tùy chọn và không tự bật sau câu sai. Sau submit, feedback mặc định gồm đúng/sai, một câu giải thích và hành động tiếp theo; `Xem chi tiết` mở rule/example/IELTS relevance.
- Câu sai được lên lịch independent variant; không buộc lặp lại ngay trong cùng màn hình.
- Checkpoint sau tối đa 5 câu: tiến độ, một điều hữu ích, `Tiếp tục`/`Dừng tại đây`.

## Authentication

- Trang riêng, chỉ email.
- Guest state được giữ khi mở login.
- Pending chưa verify vẫn chơi như guest.
- Magic link/code states: sent, expired, invalid, too-many-attempts, verified; wording không dò email.
- Sau verify: preview kết quả guest còn hạn → Import / Không import.

## Mất kết nối

- Banner/screen rõ: đáp án đang được giữ tạm, không mở câu mới.
- Nút `Thử lại`; technical failure không tính sai.
- Hết 30 phút/content đổi/session hết: cho copy câu trả lời dài và giải thích vì sao không thể nộp.

## Writing

States: đang viết, đang lưu, đã lưu, mất kết nối, conflict, read-only, takeover, submitted. Autosave server; draft 30 ngày; cảnh báo expiry. Open Writing submission và revision đều là practice-only; chỉ controlled mechanics task có answer contract xác định mới có thể tạo mastery cho node tương ứng.

## Pronunciation

Precheck mic/noise/volume → reference → record → playback → local result/self-review → retry. Low confidence không chấm. Unsupported browser cung cấp listen/repeat/self-review và không mastery. Audio biến mất khi rời bài.

## Assessment

- Timed mode tách rõ khỏi practice và cảnh báo trước khi bắt đầu/rời.
- Transcript/feedback theo policy sau submit.
- Uncalibrated form có nhãn thử nghiệm/raw result.
- Rời giữa mock → incomplete, không readiness.

## Privacy flows

Analytics consent riêng; reminder/product email riêng và mặc định off. Vertical Slice has neither behavioral analytics nor marketing consent UI. Age/residency attestation, Terms acceptance and Privacy acknowledgement are versioned append-only events. Export link 24h. Delete lock ngay + 30-day recovery. Reset ẩn ngay + 7-day undo. Sensitive actions reauth.

Material policy update: `email notice → next account sign-in summary/full links → accept/acknowledge or limited account`. Limited account permits policy viewing, export and deletion only; it cannot create attempts, imports, mastery or story progress. `Chơi với tư cách khách` remains available without importing account data. Editorial-only updates appear in version history and do not interrupt the user.

Planned material changes have `announced_at` at least 7 calendar days before `effective_at`. Existing users continue under the current version until `effective_at`; afterward the next account action requires the new decision. An immediate `security_or_legal_emergency` release requires a reason, scope, approver and audit event plus email/in-product notice as soon as practicable.

## Required error/empty states

No history, no due review, guest expiry, pending verification, offline, server unavailable, retrying, session expired, content retired, draft takeover, mic denied, analyzer unsupported, low confidence, quota/signup paused, export processing/expired và deletion pending.

Owner Alpha update state: while answering, show at most a quiet `Bản cập nhật sẽ được áp dụng sau phần này` notice and never steal focus. At an acknowledged answer/checkpoint, offer or perform the safe reload with progress preserved. For a P0 safety block, disable only the affected action when possible, explain that the answer was not marked wrong and provide retry/exit; full maintenance is used when correctness or integrity cannot be guaranteed.
