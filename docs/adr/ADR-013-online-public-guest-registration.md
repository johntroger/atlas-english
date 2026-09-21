# ADR-013: Website online-only, khách công khai và đăng ký mở

- Trạng thái: Accepted
- Ngày: 2026-09-20
- Thay thế: ADR-002, ADR-009, ADR-012

## Bối cảnh

Kế hoạch cũ giả định PWA offline-first, IndexedDB là nguồn dữ liệu thiết bị, triển khai local trước cloud và beta chỉ dành cho 10–30 tài khoản được mời. Sau vòng quyết định sản phẩm, mục tiêu đã đổi thành website cần Internet, ai cũng có thể chơi thử và tự đăng ký.

## Quyết định

1. Atlas English là responsive website, không phải PWA hay native app.
2. Website cần kết nối Internet để bắt đầu câu mới, nộp kết quả và xem tiến độ tài khoản.
3. Supabase là nguồn dữ liệu chính cho tài khoản; không có IndexedDB primary store, offline outbox hoặc conflict merge.
4. Trình duyệt chỉ giữ đáp án hiện tại tối đa 30 phút, guest state tối đa 24 giờ và cache HTTP thông thường không mang nghĩa nguồn dữ liệu.
5. Khách được dùng Quick Start/core practice mà không đăng nhập. Mastery, streak, roadmap, lịch sử dài hạn và full assessment cần tài khoản.
6. Khi đăng nhập, hệ thống xin phép trước khi import các kết quả khách hoàn thành còn hợp lệ.
7. Đăng ký tự phục vụ mở công khai; không invite, allowlist hoặc giới hạn cohort ở tầng sản phẩm.
8. Có emergency switch để tạm dừng signup khi quota/sự cố, trong khi ưu tiên giữ guest core hoạt động.
9. Attempt vẫn là append-only event với UUID phía client và idempotency key để retry an toàn.
10. Mất mạng giữa câu không được tính sai; giữ đáp án tạm, chặn câu mới và yêu cầu kết nối lại.

## Hệ quả

- Kiến trúc và kiểm thử đơn giản hơn offline-first nhưng phụ thuộc mạng rõ ràng.
- Cần auth abuse/rate limiting và capacity control cho đăng ký công khai.
- Cần bảo vệ guest state và xóa đúng hạn.
- Các tài liệu nhắc IndexedDB, service worker, offline queue, invite-only hoặc staged local/cloud phải coi ADR này là quyết định mới hơn.

## Không thuộc quyết định

ADR này không tự phê duyệt việc triển khai. Gate trong `PLAN.md` vẫn áp dụng.
