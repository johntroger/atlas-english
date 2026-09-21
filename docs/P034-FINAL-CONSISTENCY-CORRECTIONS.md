# P-034 — Final consistency corrections before implementation approval

> Ngày rà soát: 2026-09-21  
> Trạng thái: **COMPLETE AT SPECIFICATION LEVEL**  
> Phạm vi: tài liệu trước code; không tạo application, dependency, database, environment hoặc deployment

## Kết luận

Vertical Slice không cần thêm framework, service hay module sản phẩm trước khi code. Kiến trúc modular monolith, phạm vi ba mission/ba node và cổng Owner Alpha vẫn phù hợp. Đợt rà soát này sửa năm hợp đồng có thể gây triển khai sai và ghi rõ thứ tự triển khai giảm rủi ro.

`PLAN.md` vẫn là `DRAFT — CHƯA PHÊ DUYỆT ĐỂ CODE`. P-034 không cấp quyền triển khai.

## Các correction đã áp dụng

| ID | Finding | Quyết định hiện hành | Nguồn sự thật |
|---|---|---|---|
| P034-01 | Challenge và pending account cùng bị mô tả 24 giờ | Mỗi magic link/code one-use: 60 phút, vô hiệu sau 5 lần sai; pending account: 24 giờ và có thể xin challenge mới theo rate limit | `PLAN.md`, `SECURITY.md`, `STATE-AND-RECOVERY.md` |
| P034-02 | `sessionStorage` bị giao cả answer và guest state | Current answer: `sessionStorage` 30 phút; minimal guest state: TTL-enforced `localStorage` 24 giờ, không PII/raw free-form answer/secret/audio/private key/history | `PLAN.md`, `STATE-AND-RECOVERY.md` |
| P034-03 | Một số file cho open Writing submission tạo mastery | Open Writing và revision đều practice-only; chỉ controlled mechanics có deterministic answer contract mới tạo mastery cho node phù hợp | `LEARNING-CONTRACT.md` |
| P034-04 | Public Slice cấm analytics nhưng success metrics thiếu nguồn | Không có event pipeline; aggregate account metrics chỉ từ functionally required records, không raw answer, không suy guest return, dưới ngưỡng ghi `insufficient data` | `LEARNING-ANALYTICS.md` |
| P034-05 | “Golden cases pending” mâu thuẫn với checklist | Vector và phép tính đã approved ở mức spec; executable golden tests vẫn là post-approval implementation evidence | `LEARNING-CONTRACT.md`, `PRE-CODE-CHECKLIST.md` |

Auth defaults được chọn theo giới hạn và hướng dẫn hiện hành của Supabase: email OTP/magic-link expiry mặc định 1 giờ và built-in email provider có giới hạn thấp, vì vậy Vertical Slice dùng 60 phút và 2 request/email/hour cho tới khi custom SMTP/provider được kiểm chứng. Nguồn kiểm tra ngày 2026-09-21: [Passwordless email logins](https://supabase.com/docs/guides/auth/auth-email-passwordless) và [Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits).

Không cần ADR mới: các correction làm rõ implementation contract trong ranh giới ADR-013, không thay đổi stack, architecture style, online-only direction hay product scope.

## Trình tự triển khai được khuyến nghị

Trình tự authoritative nằm trong `VERTICAL-SLICE.md`: foundation → pure domain/golden tests → schema validation → one-mission thin slice → three-mission proof pack → server persistence/idempotency → auth/import/history → story reward/checkpoint → accessibility/security/Alpha gate. Mọi bước vẫn bị khóa cho tới khi owner phê duyệt đúng câu `APPROVED — VERTICAL SLICE ONLY`.

## Rủi ro còn lại

- Git/GitHub và framework chưa được khởi tạo; đây là I-001 sau phê duyệt, không phải thiếu sót planning.
- Executable golden, schema, RLS, concurrency, browser-storage và E2E tests chưa thể có trước khi code.
- Custom SMTP chưa được chọn; giới hạn 2 email/hour là default an toàn cho Alpha/Slice.
- Ngưỡng tối thiểu cho group analytics chỉ được chốt khi biết audience thật; dưới ngưỡng phải hiển thị `insufficient data`.
- Human academic review, operator/contact, provider-region disclosure, legal review và live restore vẫn là pre-public-release gates, không phải pre-code blockers.

## Điều kiện kết thúc P-034

- Active documents không còn câu challenge 24 giờ, open-Writing mastery, guest-in-`sessionStorage` hoặc “golden cases pending”.
- P-020 restore item phản ánh đúng bằng chứng P-033.
- JSON/schema/semantic/link/conflict scans đạt và PLAN vẫn DRAFT.

## Bằng chứng kiểm tra

- 30/30 JSON documents parse thành công.
- 22/22 fixture/schema expected outcomes đạt, gồm schema-valid semantic-invalid và schema-rejected invalid fixtures.
- Proof pack có 12/12 exercise ID duy nhất, phân bố `4/4/4` qua ba node.
- Positive Narrative Pack có 0 reference error; negative fixture phát hiện đúng 7 broken references.
- 70 Markdown files không có local link bị gãy; không có merge-conflict marker.
- Active-contract stale phrase scan: 0; P0 pre-code unchecked: 0.
- `PLAN.md` vẫn DRAFT; không có application/database/migration directory được tạo.
