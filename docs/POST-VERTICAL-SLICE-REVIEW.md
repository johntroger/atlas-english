# Rà soát sau Vertical Slice

> Trạng thái: **COMPLETE — documentation only; không cấp quyền triển khai**  
> Cập nhật: 2026-09-23  
> Phạm vi: game design, IELTS learning, architecture, UI/UX và vận hành Owner Alpha

## Kết luận

Atlas English đã chứng minh được một **Vertical Slice kỹ thuật cho Owner Alpha**: người học có thể hoàn thành mini-episode, nhận phản hồi xác định, lưu attempt, đăng nhập và nhập dữ liệu khách, nhận checkpoint/phần thưởng, rồi khôi phục câu trả lời dạng cấu trúc sau khi tải lại. Đây chưa phải bằng chứng rằng sản phẩm là game IELTS đầy đủ, hiệu quả cho mục tiêu band 6.5, hoặc sẵn sàng mở công khai.

Không có mục nào dưới đây tự mở deployment, Owner Alpha hosting, Public Preview, Beta hay code cho phạm vi kế tiếp. Quyền vẫn do `PLAN.md` và quy trình approval quyết định.

| Góc nhìn | Mức trưởng thành hiện tại | Bằng chứng | Khoảng trống quyết định |
|---|---|---|---|
| Game design | Nền tảng khả dụng | Dossier ba mission, checkpoint/safe stop, reward không nhân đôi, replay an toàn | Chưa có campaign map, nhịp đa dạng dài hạn hoặc bằng chứng retention thực tế |
| IELTS learning | Nguyên tắc đáng tin cậy, độ phủ hẹp | Hints/self-review không tạo mastery; phản hồi xác định; không claim Writing/Speaking band | Slice chỉ có ba node grammar/vocabulary; chưa chứng minh lộ trình 6.5 hay transfer bốn kỹ năng |
| Kiến trúc | Tốt cho slice | Modular monolith, domain thuần, attempt append-only, idempotency, content validation, account/guest boundary | Chưa kiểm chứng hosting HTTPS, backup/restore thực thi, RLS matrix đầy đủ và vận hành nhiều instance |
| UI/UX | Cốt lõi rõ, đã kiểm tra hẹp | UI tiếng Việt/nội dung Anh, 390×844 review, focus/status, answer recovery | Chưa có device/browser/accessibility matrix và chưa đủ hệ thống game dài hạn |
| Public readiness | Chưa sẵn sàng | Có release/backup/privacy design và Alpha gate source | Chưa deploy; chưa cấu hình secret; backup chưa chạy; 18 item và human review còn thiếu; legal/provider gates còn mở |

## Điểm đã xác nhận

- Vòng học ngắn và có điểm dừng phù hợp tải nhận thức: mission bốn câu, checkpoint và safe stop rõ ràng.
- Story `Missing Context` làm nhiệm vụ ngôn ngữ phục vụ giải hồ sơ thay vì dùng phần thưởng tách rời IELTS.
- Learning integrity tốt: technical failure, hint, pronunciation self-review và Writing mở không bị biến thành bằng chứng mastery.
- Dữ liệu có biên giới hợp lý: UI không gọi Supabase trực tiếp; server đánh giá/lưu attempt; replay cùng request không tạo attempt hay reward mới.
- Owner Alpha protections đã được kiểm tra ở local: gate fail-closed khi thiếu secret, cookie ký, baseline security headers, recovery 30 phút cho câu trả lời cấu trúc và submit an toàn khi offline.

## Rủi ro và ưu tiên sau slice

### R-PS-01 — Hiệu quả IELTS chưa thể được suy ra từ slice

Không được mô tả mini-episode hiện tại như lộ trình đạt band 6.5. Chỉ có ba node được chơi và 12 item first-run; blueprint 30 item chưa hoàn chỉnh/human-review. Mở rộng sau Alpha phải đi theo curriculum matrix, evidence contract và content-review gate, không chỉ tăng số lượng câu.

**Điều kiện giảm rủi ro:** content pack đủ độ phủ theo node/mode/biến thể; review độc lập tất cả learner-facing English; sau đó mới đánh giá delayed review/transfer bằng dữ liệu đủ lớn.

### R-PS-02 — Retention game mới ở mức giả thuyết

Cơ chế dossier có chủ đề và phần thưởng `Context Restored` tạo hướng đi đúng, nhưng chưa chứng minh người học sẽ quay lại. Không nên thêm currency, random reward, leaderboard hoặc FOMO để bù cho khoảng trống này.

**Hướng thiết kế sau Alpha:** mô hình `case system` có thể lặp lại: mỗi case có mục tiêu IELTS đơn, 3–5 phút, một thay đổi quan sát được trong hồ sơ/bản đồ, choice chỉ đổi góc nhìn chứ không khóa kiến thức. Campaign map, Field Case và progression chỉ nên mở khi case đầu chứng minh dễ hiểu và không làm loãng mục tiêu học.

### R-PS-03 — Cá nhân hóa chưa thành trải nghiệm hoàn chỉnh

Thuật toán và hợp đồng đã có, nhưng slice chưa cho thấy đầy đủ Today, mistake book, review queue, tiến độ mastery và lý do chọn nhiệm vụ. Đây là khoảng cách sản phẩm, không phải lỗi của thuật toán hiện hữu.

**Hướng sau Alpha:** trước các tính năng game diện rộng, ưu tiên learning loop nhìn thấy được: baseline hạn chế → nhiệm vụ hôm nay có lý do → feedback → review đúng hạn → màn hình giải thích tiến độ/thiếu bằng chứng.

### R-PS-04 — Owner Alpha hosting/operations chưa có bằng chứng thực thi

Runbook hiện là đặc tả, không phải backup hay restore đã chạy. Local HTTP không xác minh cookie `Secure`, magic-link redirect hay behavior HTTPS. Rate limiter trong memory của Alpha gate phù hợp một owner/một instance, không phải Public Preview.

**Điều kiện trước Owner Alpha online:** có yêu cầu triển khai riêng; cấu hình server secret ngoài repository; deploy Vercel Preview/Alpha; bật backup Alpha từ ngày có real progress; kiểm tra HTTPS, magic link, gate, logout/session expiry, rollback và một restore cô lập theo runbook trước khi mở công khai.

### R-PS-05 — UX/accessibility mới được kiểm tra theo smoke path

Kết quả 390×844 quan trọng nhưng không thay thế matrix thiết bị. Cần kiểm tra mobile Safari, Android Chrome, desktop Chrome/Edge, keyboard-only, zoom/text size và reduced motion trước mở rộng truy cập.

## Thứ tự khuyến nghị, không phải quyền thực hiện

1. **Owner Alpha deployment có khóa truy cập** — chỉ khi chủ dự án yêu cầu rõ; dùng Preview/Alpha data, HTTPS thật, biến môi trường server-only và backup scope riêng.
2. **Dogfood một người theo kịch bản** — guest episode/safe stop, login/import/history, completion/replay, reload/recovery, mạng yếu/gián đoạn, desktop/mobile/accessibility. Finding ghi theo `ALPHA-FEEDBACK.md`.
3. **Khép learning/content loop** — bổ sung content theo curriculum và review queue/progress UX; không chuyển claim band trước khi có bằng chứng thích hợp.
4. **Public Preview readiness** — chỉ sau 30 item hoàn chỉnh, qualified-human review, privacy/legal/provider/contact completion, backup/restore drill, quota/kill switch và quyền phát hành riêng.

## Tiêu chí quyết định chuyển giai đoạn

| Chuyển từ | Sang | Điều kiện tối thiểu |
|---|---|---|
| Slice local | Owner Alpha online | Owner yêu cầu deploy riêng; environment Alpha tách biệt; secret/gate/HTTPS verified; backup scope kích hoạt khi có dữ liệu thật |
| Owner Alpha | Mở rộng code/content | Không còn P0/P1 đang mở trong journey cốt lõi; owner có finding/retest evidence; phạm vi kế tiếp được phê duyệt rõ |
| Owner Alpha | Public Preview | Release gates trong `PLAN.md`, `ACCEPTANCE-CRITERIA.md`, `RELEASE-RUNBOOK.md` và academic review gate đạt; owner phê duyệt phát hành riêng |

## Liên kết nguồn chuẩn

- Phạm vi và quyền: [`../PLAN.md`](../PLAN.md)
- Trạng thái: [`STATUS.md`](STATUS.md)
- Hợp đồng học tập: [`LEARNING-CONTRACT.md`](LEARNING-CONTRACT.md)
- Nội dung/curriculum: [`CURRICULUM.md`](CURRICULUM.md), [`CONTENT-SYSTEM.md`](CONTENT-SYSTEM.md)
- Vận hành: [`RELEASE-RUNBOOK.md`](RELEASE-RUNBOOK.md), [`BACKUP-RESTORE-RUNBOOK.md`](BACKUP-RESTORE-RUNBOOK.md)
- Dogfood finding: [`ALPHA-FEEDBACK.md`](ALPHA-FEEDBACK.md)
