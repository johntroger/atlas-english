# Acceptance criteria

## Gate chung

- Lần triển khai đầu tiên chỉ bắt đầu khi người dùng chuyển `PLAN.md` sang đúng `APPROVED — VERTICAL SLICE ONLY`; beta MVP và Production cần phê duyệt riêng.
- Không release Production nếu legal/privacy blocker còn mở.
- Mọi user-visible change có test, docs, status và changelog.
- Owner Alpha is accessible only after an owner-only outer gate; a hard-to-guess URL alone fails. Expanding access requires separate explicit approval and the Public Preview release gates.
- An Alpha breaking reset is blocked until migration/rebuild assessment, verified backup, impact preview and separate owner confirmation pass; Public/Production has no equivalent shortcut.
- Alpha auto-deploy occurs only after required checks pass; update activation never interrupts an in-flight answer/submit, and P0 safety blocking never creates a wrong attempt. Public/Production still require separate release approval.

## Guest và account

- Khách vào Quick Start không cần đăng nhập.
- Guest state hết hạn đúng 24 giờ; không tạo mastery/streak/history chính thức.
- Import guest result chỉ sau preview + consent, idempotent và chỉ gồm completed result.
- Mỗi magic link/code one-use hết hạn sau 60 phút và bị vô hiệu sau 5 lần sai; pending account vẫn có tuổi thọ riêng 24 giờ, có thể xin challenge mới theo rate limit và mọi phản hồi vẫn generic.
- Pending account chưa xác minh bị xóa sau 24h.
- Session tối đa 30 ngày; thao tác nhạy cảm reauth.
- RLS chặn cross-account và client không truy cập private assessment bank.

## Learning loop

- Câu thường 30–90 giây; cluster 3–5 phút; checkpoint chậm nhất sau 5 câu.
- Safe stop không làm mất attempt đã acknowledge.
- Hint làm attempt practice-only.
- Sai lần 1/2 và review scheduling đúng hợp đồng.
- Mastery deterministic, versioned và rebuild được từ evidence hợp lệ.
- Daily Quest có lý do, đổi khi hoàn cảnh thay đổi và không tạo debt.

## Online interruption

- Mất mạng giữa câu giữ current answer tối đa 30 phút, chặn câu mới và cho retry.
- Retry cùng actor/key/request hash trả acknowledgement cũ và không nhân đôi attempt/XP/evidence; cùng key nhưng command khác bị từ chối không ghi.
- Lỗi mạng/audio/mic không bị tính sai.
- Writing autosave hiển thị trạng thái; conflict cần takeover rõ, không ghi đè im lặng.

## Pronunciation/Writing

- Audio chỉ trong phiên, bị xóa khi thoát, không log/export/upload.
- Confidence thấp hoặc fallback self-review không cập nhật mastery.
- Không có phoneme/accent/Speaking-band claim; chỉ ba mức đã duyệt.
- Writing chỉ báo mechanics, tối đa 3 nhóm ưu tiên, không Writing band.
- Pronunciation recording/self-review và open Writing submission chỉ cập nhật practice status, không mastery. Chỉ approved perception/discrimination hoặc controlled mechanics task có answer contract mới đủ điều kiện cho node tương ứng.

## Assessment/content

- Form chưa hiệu chuẩn chỉ raw result + experimental label.
- Band L/R chỉ từ form qua calibration gate; overall thiếu W/S evidence hiện hành phải báo chưa đủ.
- Public practice pack và private bank tách kho/quyền/pipeline.
- Content pack immutable, schema-valid, provenance đầy đủ và independent review.
- Public Vertical Slice has item-level qualified-human approval for all 30 items; author/Codex self-approval or approval against a stale content hash fails the gate.
- The same qualified reviewer approves all learner-facing English in the Prologue/three missions against the Narrative Pack hash; separate Product Owner story/tone and accessibility approvals also pass.
- Content incident có retire, non-evidentiary attempts, recompute và thông báo.

## Privacy/security/operations

- Public Vertical Slice has no product-behavior analytics; essential operational metadata obeys the 30-day limit. Any later beta analytics is separately approved and opt-in; session replay remains prohibited.
- Public Vertical Slice metrics, nếu báo cáo, chỉ là aggregate từ records cần thiết để vận hành sản phẩm; không có raw answer, không suy guest return từ local state và hiển thị `insufficient data` khi mẫu không đủ.
- Public Slice enforces the approved auth/attempt/import/payload limits; a limited request preserves the current answer and creates no wrong attempt/evidence event.
- Kill-switch rehearsal proves the order signup/email → import/history → safe guest core → full maintenance; unsafe scoring or persistence must never remain publicly playable.
- Export ZIP có summary/CSV/JSON; link 24h.
- Delete/reset/inactivity lifecycle có test và audit.
- Không secret, audio, raw sensitive writing, answer key hoặc PII không cần thiết trong log/bundle/repo.
- Backup/restore drill, health check, feature flag, circuit breaker và auto rollback được diễn tập.

## UX/accessibility

- Trước code, năm low-fidelity responsive wireframe/state map bắt buộc đã qua Codex heuristic review; không yêu cầu một prototype clickable/high-fidelity riêng.
- Trong Owner Alpha, năm luồng tương ứng được kiểm tra tương tác thật trên điện thoại và desktop trước khi xem xét mở rộng truy cập.
- UI tiếng Việt, learning content tiếng Anh, giải thích Việt thu gọn.
- Luồng chính keyboard-usable, WCAG AA, reduced motion, 3 cỡ chữ, light/dark.
- Responsive trên phone/tablet/desktop và hai bản mới nhất Chrome/Edge/Safari.
- Guest thấy lợi ích đăng nhập nhưng không gặp dark pattern/guilt.
