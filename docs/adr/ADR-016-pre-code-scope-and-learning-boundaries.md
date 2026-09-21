# ADR-016: Thu hẹp quyền triển khai đầu tiên và khóa ranh giới learning evidence

- Trạng thái: Accepted
- Ngày: 2026-09-20

## Bối cảnh

Review đa chuyên môn trước code cho thấy MVP quá rộng và ba nguồn sự thật mâu thuẫn về hinted attempt, pronunciation recording và Speaking scope. Physical data/UX/content contracts cũng chưa đủ để phê duyệt toàn bộ MVP.

## Quyết định

1. Lần phê duyệt code đầu tiên chỉ có thể là `APPROVED — VERTICAL SLICE ONLY` theo `VERTICAL-SLICE.md`.
2. Vertical slice giới hạn ở guest/account learning loop, mini-episode 3 mission, 2–3 Grammar/Vocabulary nodes và 24–36 item đã duyệt.
3. Bất kỳ hint nào làm attempt practice-only; không cập nhật mastery.
4. Pronunciation recording, local signal và self-review chỉ là practice; mastery chỉ đến từ approved perception/discrimination task có đáp án xác định.
5. Open Writing submission/revision chỉ là practice; controlled mechanics task có thể cập nhật node tương ứng.
6. Core MVP Speaking chỉ hỗ trợ pronunciation. Fluency, Part 2, Part 3 và speaking-extension curriculum được defer.
7. Calibrated LR band và production private assessment bank được defer đến sau core-learning validation.
8. Public beta cần minimum quota email/rate limits/emergency switches dù không xây alerting platform riêng.
9. Trước code phải hoàn thành learning contract, selected nodes/content, Narrative Pack schema, physical slice ERD/RLS, state machines và prototype evidence.

## Hệ quả

- Giảm rủi ro xây nhiều hệ thống trước khi chứng minh learning loop.
- Một số đặc tả Beta MVP vẫn tồn tại nhưng không cho phép migration/UI/dependency trong slice.
- Story, content và evaluator được thử end-to-end sớm với phạm vi kiểm soát.
- Phê duyệt slice không tự động mở Beta MVP, assessment, AI hoặc Production.
