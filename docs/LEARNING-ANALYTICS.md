# Learning analytics and evaluation

> Trạng thái: DRAFT

## Nguyên tắc

Analytics phải trả lời người học có ghi nhớ/chuyển giao kiến thức và sản phẩm có đáng tin cậy không. XP, streak, level và time-on-app không phải bằng chứng IELTS.

## Learning measures

First-attempt accuracy, delayed-review accuracy, error recurrence, recognition–production gap, transfer accuracy, rescue success, mastery calibration và evidence coverage/confidence.

## Product measures

Guest/account activation, cluster completion/safe stop, weekly return, review adherence, content repetition/report, microphone fallback, online interruption/retry, duplicate prevention, autosave health và assessment technical invalidation.

Danh sách trên là measurement catalog, không đồng nghĩa mọi chỉ số đều khả dụng ở mọi giai đoạn. Public Vertical Slice không có nguồn hợp lệ để tính guest weekly return hoặc guest activation xuyên phiên; các chỉ số đó phải để `not collected` thay vì suy từ local state.

## Privacy contract

- Public Vertical Slice không phát sinh product/learning analytics events; chỉ essential operational metadata theo `OBSERVABILITY-OPERATIONS.md`.
- Account-level aggregate cho completion, evidence/review health có thể được tính từ auth/attempt/evidence/review records vốn cần để cung cấp chức năng. Không tạo event copy, không đưa raw answer vào report và không truy vấn per-user cho mục đích sản phẩm ngoài hỗ trợ do chính người học yêu cầu.
- Báo cáo nhóm phải áp dụng ngưỡng tối thiểu đã cấu hình; dưới ngưỡng hiển thị `insufficient data`, không xuất tỷ lệ có thể làm lộ hành vi của một vài người. Ngưỡng cụ thể được chốt khi biết audience thật và trước Public Preview.
- Các event dưới đây là thiết kế deferred cho broader beta và chỉ được bật sau phê duyệt giai đoạn riêng với analytics opt-in riêng.
- Actor là account ID hoặc random guest session ID; không fingerprint.
- Chỉ metadata có cấu trúc: event, node/item ID, eligible outcome, hint count, duration bucket, navigation state và versions/error code.
- Cấm email/auth data, raw/free-form answer, Writing/Speaking text, audio, self-review note, full external result và export body.
- Detailed events tối đa 90 ngày; sau đó xóa hoặc aggregate không thể tái định danh.
- Rút consent xóa linkable events; account deletion thực hiện cùng policy.
- Admin mặc định chỉ xem aggregate; per-user support access phải do learner yêu cầu, time-limited và audited.

## Reporting

Trong Public Vertical Slice, learner-facing progress được tạo trực tiếp từ dữ liệu học của chính tài khoản, không phải một analytics pipeline. Owner evaluation dùng quan sát trực tiếp, phản hồi định tính tự nguyện, essential operational totals và aggregate account metrics đủ ngưỡng; guest return/activation định lượng được ghi `not collected`. Nếu broader-beta analytics được phê duyệt, weekly aggregate report có thể gồm: mạnh/yếu với evidence count, recurring errors, review due/completed, production gap, transfer trend, next-week allocation và uncertainty.

## Evaluation cadence

Daily operational review; weekly learning/content review; 4-week calibration review; 8-week broader validation; 90-day retention verification. Open beta và learning validation có báo cáo riêng.
