# Multidisciplinary pre-code review — 2026-09-21

> Lần rà soát hiện hành: sau khi hoàn thành P-029 và chấp nhận đủ năm wireframe  
> Phạm vi: game design, IELTS learning, software architecture, UI/UX và vận hành  
> Kết luận hiện hành: **P-031–P-033 đã đóng 9/9 P0; dự án đủ điều kiện trình owner quyết định riêng về `APPROVED — VERTICAL SLICE ONLY`**  
> Không có thay đổi ứng dụng, dependency, database hay deployment trong đợt review này

## 1. Kết luận điều hành

Atlas English không cần đổi stack, thêm microservice, AI, prototype high-fidelity hay mở rộng Season 1 trước khi code. Phương án đúng vẫn là một modular monolith, website responsive online-only, Vertical Slice ba mission và Owner Alpha chỉ dành cho chủ dự án.

Điểm mạnh hiện tại là các ranh giới đã rõ: game không tự nhận thay thế khóa IELTS đầy đủ; mastery tách khỏi XP; hint/self-review không tạo mastery; server quyết định scoring; content/narrative có version; guest và account có vòng đời riêng; câu chuyện có kết thúc thật và không dùng FOMO.

Điểm yếu tại thời điểm P-030 không phải thiếu ý tưởng mà là thiếu bằng chứng nhỏ, chạy xuyên suốt: nội dung first run, fixture semantic, trust boundary dữ liệu và procedure restore chính xác. P-031 đã hoàn tất proof content/fixture, P-032 đã đóng trust boundary và P-033 đã hoàn tất recovery procedure cùng final audit. Quyết định `APPROVED — VERTICAL SLICE ONLY` vẫn thuộc riêng owner và chưa được suy diễn từ kết quả này.

## 2. Scorecard khách quan

| Góc nhìn | Chất lượng thiết kế | Mức sẵn sàng có bằng chứng | Nhận định |
|---|---:|---:|---|
| Game design | 8/10 | 6/10 | Core loop ngắn, fail-forward và narrative mở rộng tốt; cần chứng minh từng mission thực sự làm hồ sơ thay đổi thay vì chỉ bọc story quanh worksheet |
| IELTS/learning | 8/10 | 6.5/10 | Evidence contract, claim boundary và 12-item proof pack chứng minh ba construct đầu; đủ 30 item và human review vẫn là pre-public gate |
| Architecture | 8.5/10 | 7/10 | Modular monolith, server authority, idempotency, environment isolation và DB/RLS/state/scoring specification đã review; executable evidence chờ approval |
| UI/UX | 8.5/10 | 3/10 triển khai thật | Năm wireframe, state/recovery và accessibility contract đã chấp nhận; con số thấp phản ánh chưa có browser implementation, không phải cần thêm tài liệu high-fidelity |
| Security/operations | 7.5/10 | 6.5/10 | Có least privilege, backup separation, exact isolated-restore procedure và release controls; executable drill vẫn chờ môi trường được phép |

Điểm số là đánh giá planning readiness, không phải chứng nhận IELTS, accessibility hay security.

## 3. Tiến bộ đã xác minh từ lần review trước

- Cả năm flow Landing, Question, Feedback, Checkpoint/safe stop và Sign-in/guest import đã có wireframe responsive, state/recovery map và accessibility contract.
- Toàn bộ 42 finding heuristic của năm flow đã được giải quyết; không còn P0/P1 ở artifact wireframe.
- Visual token contrast đã được đo và normal-text pairing dưới 4.5:1 bị cấm.
- Owner Alpha được xác định là prototype tương tác đầu tiên; không cần Figma/clickable prototype riêng.
- Human IELTS review, operator facts, provider-region disclosure và legal review vẫn ở đúng pre-public gate, không bị kéo sớm để làm chậm Owner Alpha.

## 4. Chín P0 được xác định tại P-030

### Content/narrative — 4

**Trạng thái sau P-031: đã đóng cả 4 bằng proof pack và validation evidence.**

1. Chưa có first-run proof pack khoảng 12 item, gồm valid/invalid evaluator và schema fixtures.
2. Chưa có provisional Prologue và ba mission đủ copy để kiểm tra contract/trải nghiệm.
3. Chưa có bằng chứng Content/Narrative/Learning-node schemas chấp nhận fixture đúng và từ chối fixture sai theo semantic rules.
4. Chưa ghi đầy đủ provenance, license, immutable hash và rollback target cho proof pack.

### Data/security/operations — 5

**Trạng thái hiện tại: mục 5–8 đã đóng bởi P-032; mục 9 đã đóng ở mức đặc tả bởi P-033.**

5. Typed tables, constraints, indexes và migration order chưa review đóng.
6. RLS allow/deny matrix cùng test specification per-role/per-operation chưa review đóng.
7. Guest/account/attempt/story state machines và recovery/expiry transitions chưa phê duyệt cuối.
8. Server scoring authority, acknowledgement và same-key idempotent retry sequence chưa phê duyệt cuối.
9. Exact secret-safe backup/isolated-restore command templates, pinned/fail-closed tool manifest, verification queries và evidence form nằm trong `BACKUP-RESTORE-RUNBOOK.md`.

Đây là toàn bộ P0 trước khi xin quyền code. Browser conformance, live restore drill, human academic approval và legal/provider/operator completion là gate của implementation hoặc non-owner release, không được dùng để tăng giả tạo số P0 pre-code.

## 5. Cải tiến được chấp nhận trong tài liệu

### Story phải là hệ quả của việc học

Mỗi mission giờ có một biến đổi quan sát được trong cùng hồ sơ:

- Mission 1 sửa sentence boundaries để khôi phục quan hệ logic giữa các ý;
- Mission 2 sửa countability/quantifier để xác định đúng tập người và phạm vi khảo sát;
- Mission 3 sửa cause/effect wording để đưa độ mạnh của kết luận về đúng mức bằng chứng hỗ trợ.

Checkpoint phải cho thấy đoạn hồ sơ trước/sau; generic success copy không đủ. Sai, bỏ qua hoặc dùng hint vẫn fail-forward về truyện nhưng không được giả lập mastery.

### Content proof trước số lượng lớn

P-031 dùng khoảng 12 item first run, là tập con của blueprint 30 item. Mục tiêu là chứng minh ba construct, các evidence channel, hai format phù hợp mỗi node, explanation, provenance, semantic validation và rollback. Proof pack không thay thế đủ 30 item hay qualified-human review trước Public Preview.

### Đóng trust boundary trước framework

P-032 review dữ liệu ở mức đặc tả: bảng/constraint/index/migration, grants/RLS/views/functions, state/recovery và scoring/idempotency sequence. Việc chạy migration/test thật chỉ bắt đầu sau khi PLAN được phê duyệt đúng phạm vi.

### Recovery phải có procedure tái lập được

P-033 yêu cầu command template chính xác nhưng không chứa secret, pin tool version, chỉ rõ môi trường đích, checksum/integrity query, timing, failure handling và evidence record. Live drill vẫn là bước sau khi có môi trường được phép dùng.

## 6. Trình tự đóng kế hoạch

1. **P-031 — Content-contract proof — complete:** 12 item + Prologue/3 mission + fixtures + provenance/rollback.
2. **P-032 — Data trust boundary — complete:** DB/RLS/state/scoring/idempotency review.
3. **P-033 — Recovery và final audit — complete:** exact restore template, contradiction/traceability/schema review cuối.
4. Checklist hiện không còn P0 pre-approval; trình owner các rủi ro còn lại và xin một quyết định riêng: `APPROVED — VERTICAL SLICE ONLY`.

## 7. Go/no-go

**Hiện tại: NO-GO cho code cho tới khi owner phê duyệt rõ; GO để trình quyết định `APPROVED — VERTICAL SLICE ONLY`.**

Không nên bổ sung AI, microservice, full Season 1, Pronunciation Studio hoàn chỉnh, dark-mode implementation, prototype high-fidelity hoặc cohort người dùng trước bước này. Sau khi P-033 có bằng chứng và owner phê duyệt rõ phạm vi, dự án có thể bắt đầu Vertical Slice mà không cần một vòng thiết kế lại tổng thể.
