# Owner Alpha feedback and triage

> Trạng thái: DRAFT — dùng khi Owner Alpha bắt đầu  
> Người dùng Alpha: chỉ chủ dự án

## Mục đích

Chủ dự án chỉ cần mô tả vấn đề bằng ngôn ngữ bình thường và có thể gửi ảnh khi hữu ích. Codex chịu trách nhiệm chuyển mô tả thành finding có thể tái hiện, phân loại, sửa và kiểm tra lại. Không yêu cầu chủ dự án tự viết issue kỹ thuật.

Tài liệu này là nguồn chuẩn cho mức độ và vòng đời finding Owner Alpha. Nó không thay thế `BACKLOG.md`: backlog quản lý công việc dự án; file này giữ bằng chứng dogfooding theo từng lỗi/trải nghiệm.

## Mức độ

| Mức | Định nghĩa | Hành động |
|---|---|---|
| P0 — Critical | Mất/hỏng dữ liệu, lộ bí mật hoặc dữ liệu, vượt quyền truy cập, chấm sai tạo evidence/mastery sai, hoặc không bảo đảm tính toàn vẹn | Dừng ngay tính năng/luồng bị ảnh hưởng; bảo toàn bằng chứng và dữ liệu; sửa và chạy kiểm tra trọng yếu trước khi tiếp tục dùng |
| P1 — Blocking | Chủ dự án không thể hoàn thành luồng học chính, đăng nhập, lưu/khôi phục hoặc checkpoint; chưa có workaround an toàn hợp lý | Sửa trước lần phát hành Alpha tiếp theo; không đóng nếu critical journey chưa retest |
| P2 — Usability/content | Khó hiểu, bất tiện, phản hồi học tập chưa tốt, lỗi nội dung không tạo claim/evidence nguy hiểm hoặc có workaround an toàn | Xếp hàng theo nhóm/chủ đề; sửa theo ưu tiên và kiểm tra hồi quy liên quan |
| P3 — Cosmetic | Lệch nhỏ về spacing, animation, copy hoặc thẩm mỹ không cản trở học và không làm sai nghĩa | Gom xử lý khi thuận tiện; không được dùng để trì hoãn P0/P1 |

Nếu chưa rõ mức, chọn mức nghiêm trọng hơn trong lúc điều tra. Content issue làm đáp án hoặc mastery sai là P0, không phải P2.

## Vòng đời

```text
reported → triaged → reproduced
→ fixing → ready_for_retest
→ verified → closed
          ↘ reopened
```

- P0 có thêm trạng thái `contained` ngay sau triage; feature flag/kill switch được dùng nếu cần.
- `cannot_reproduce` không đồng nghĩa `closed`: phải ghi môi trường đã thử, bằng chứng và câu hỏi còn thiếu.
- Codex chạy kiểm tra kỹ thuật phù hợp và ghi kết quả. Chủ dự án có thể xác nhận trải nghiệm đã ổn hoặc mở lại bằng mô tả ngắn.
- Finding liên quan reset/xóa vẫn tuân xác nhận phá hủy riêng trong `STATE-AND-RECOVERY.md`.

## Mẫu bản ghi

```yaml
id: ALPHA-YYYYMMDD-NN
reportedAt: ISO-8601
status: reported
severity: P0 | P1 | P2 | P3
summary: ""
ownerDescription: ""
environment:
  appBuild: ""
  contentVersion: ""
  algorithmVersion: ""
  device: ""
  browser: ""
  viewport: ""
location: "route/mission/item if known"
reproductionSteps: []
expected: ""
actual: ""
impact:
  learningCorrectness: none | possible | confirmed
  dataIntegrity: none | possible | confirmed
  securityPrivacy: none | possible | confirmed
workaround: ""
evidenceRefs: []
rootCause: ""
fixRefs: []
checksRun: []
retestResult: ""
residualRisk: ""
```

## Quy tắc bằng chứng

- Ảnh/log phải được kiểm tra và che email, token, secret, mã đăng nhập, raw answer không cần thiết hoặc dữ liệu nhạy cảm trước khi đưa vào repository.
- Không chép raw production/Alpha database row vào issue công khai.
- Finding gắn build, content và algorithm version khi có thể để tránh sửa nhầm phiên bản.
- Một finding chỉ `closed` khi có fix/decision rõ, kiểm tra phù hợp và không còn P0/P1 residual risk chưa được chấp nhận.

## Nhật ký finding

```yaml
id: ALPHA-20260923-01
reportedAt: 2026-09-23T09:17:00+07:00
status: verified
severity: P1
summary: "Owner Alpha gate was absent from the first Vercel deployment"
ownerDescription: "Website opened directly instead of requiring Owner Alpha access."
environment:
  appBuild: "8ca36ca (affected); fa6eb4c (fixed)"
  contentVersion: "vertical-slice proof pack"
  algorithmVersion: "mastery-v0.1"
  device: "Vercel Production / browser verification"
  browser: "Codex in-app browser"
  viewport: "default"
location: "/"
reproductionSteps:
  - "Open https://atlas-english-five.vercel.app/ without an Alpha cookie."
expected: "Redirect to /alpha-access before rendering a product route."
actual: "The initial deployment rendered the game directly; the build log contained no Proxy entry."
impact:
  learningCorrectness: none
  dataIntegrity: none
  securityPrivacy: possible
workaround: "Do not share the initial deployment URL."
evidenceRefs:
  - "Vercel build log for 8ca36ca"
  - "Vercel deployment and unauthenticated redirect verification for fa6eb4c"
rootCause: "Proxy file was not colocated with the src/app router."
fixRefs:
  - "fa6eb4c"
checksRun:
  - "npm run check (53 tests)"
  - "production build reports Proxy (Middleware)"
  - "unauthenticated Vercel visit redirects to /alpha-access"
retestResult: "Verified; the owner also entered the gated environment."
residualRisk: "The in-memory rate limit is suitable only for Owner Alpha, not public traffic."
```
