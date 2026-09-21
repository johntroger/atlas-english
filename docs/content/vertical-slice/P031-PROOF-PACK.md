# P-031 — Vertical Slice content-contract proof pack

> Trạng thái: **Codex pre-reviewed — chỉ dùng cho planning, schema/evaluator work và Owner Alpha sau khi có quyền code**  
> Ngày: 2026-09-21  
> Phạm vi: 12 item first run, Prologue, ba mission, ba learning-node fixture và invalid fixtures  
> Không phải academic approval; không được phát hành cho người dùng ngoài owner

## 1. Mục đích

Proof pack này chứng minh rằng một vòng first run có thể nối nội dung IELTS, deterministic answer contract và thay đổi cốt truyện quan sát được mà không mở rộng khỏi Vertical Slice. Mười hai item là tập con đại diện của blueprint 30 item; chúng không làm giảm yêu cầu phải hoàn thiện và qualified-human review đủ 30 item trước Public Preview.

## 2. Artifact manifest

| Artifact | Vai trò | Version | Canonical content hash | Rollback target |
|---|---|---:|---|---|
| [`vertical-slice-grammar-proof-pack.valid.json`](../../schemas/fixtures/vertical-slice-grammar-proof-pack.valid.json) | 8 item cho Mission 1–2 | 0.1.0 | `78cc12b63a9ed7e0d660e87a7123caae09b709ce282c03ee30cc49129357ebfe` | Deactivate; chưa có bản active trước đó |
| [`vertical-slice-vocabulary-proof-pack.valid.json`](../../schemas/fixtures/vertical-slice-vocabulary-proof-pack.valid.json) | 4 item cho Mission 3 | 0.1.0 | `2c0acd6415de509eee6fb456159fee84d9fc31788b3bc5a30d2abb17894de338` | Deactivate; chưa có bản active trước đó |
| [`vertical-slice-narrative-pack.valid.json`](../../schemas/fixtures/vertical-slice-narrative-pack.valid.json) | Prologue + 3 mission | 0.1.0 | `2a02f2978003df567695c52c46be0909c0ae7ed18e91fe333443a22812da322b` | Deactivate; chưa có Narrative Pack active trước đó |
| Ba `learning-node-*.valid.json` | Completion/evidence contract cho ba node | schema 4 | Không phải pack phát hành | Remove fixture; không đổi curriculum production |

Hash được tính bằng SHA-256 trên UTF-8 compact JSON sau khi đặt trường `contentHash` thành 64 số `0`. Quy tắc này tránh self-reference và phải được dùng lại khi xác minh hoặc tạo version mới. Mọi thay đổi nội dung làm hash cũ hết hiệu lực.

## 3. First-run matrix

| Mission | Item | Format | Evidence | Role | Hành vi quan sát được |
|---|---|---|---|---|---|
| M1 | `slice.m1.boundaries.001` | single choice | mastery | core | nhận ra full stop hợp lệ giữa hai mệnh đề |
| M1 | `slice.m1.boundaries.002` | reorder | mastery | core | tạo câu ghép tương phản bằng comma + `but` |
| M1 | `slice.m1.boundaries.003` | error correction | practice | hinted | sửa comma splice sau cảnh báo practice-only |
| M1 | `slice.m1.boundaries.004` | error correction | mastery | review/transfer | sửa dependent-clause fragment mà không đổi claim |
| M2 | `slice.m2.countability.001` | single choice | mastery | core | chọn quantifier phù hợp với `information` |
| M2 | `slice.m2.countability.002` | single choice | mastery | core | ánh xạ 72/120 thành `most`, không phải `all` |
| M2 | `slice.m2.countability.003` | error correction | practice | hinted | sửa `many advice` sau cảnh báo practice-only |
| M2 | `slice.m2.countability.004` | text input | mastery | review/transfer | dùng `some` cho 48/120 trong tập lựa chọn đã khóa |
| M3 | `slice.m3.cause-effect.001` | single choice | mastery | core | phân biệt association với causal overclaim |
| M3 | `slice.m3.cause-effect.002` | multiple choice | mastery | core | loại claim tuyệt đối/only-cause |
| M3 | `slice.m3.cause-effect.003` | error correction | practice | hinted | thay `led to` bằng `was associated with` |
| M3 | `slice.m3.cause-effect.004` | text input | mastery | review/transfer | tạo collocation hai từ `contribute to` |

Mỗi node có 4 item, ít nhất 3 format, hai core mastery, một hinted practice-only và một independent review/transfer. First run có đúng 12 item và mỗi checkpoint nằm sau 4 item.

## 4. Story-to-learning contract

| Mission | Trạng thái hồ sơ trước | Hành động ngôn ngữ | Thay đổi hồ sơ sau checkpoint |
|---|---|---|---|
| M1 — Broken Connections | Các phát hiện bị tách/nối sai nên quan hệ ý mơ hồ | sửa fragment, run-on và comma splice | quan hệ logic và nhượng bộ giữa response rate với sample limitation được khôi phục |
| M2 — The Missing Scope | Bản sau mở rộng một phần mẫu thành toàn bộ sinh viên | sửa countability và quantifier theo 72/120, 48/120 | tập người và phạm vi kết luận khớp số liệu |
| M3 — A Claim Too Strong | Tương quan bị viết thành nguyên nhân đã chứng minh | đổi claim strength và cause/effect collocation | kết luận chỉ còn mức association/possible contribution mà dữ liệu hỗ trợ |

Prologue và toàn bộ learner-facing copy nằm trong Narrative Pack. Story choice duy nhất ở M2 chỉ đổi Notebook flag/đoạn hội thoại; hai nhánh hội tụ trước ending và không đổi item, mastery, reward hay quyền truy cập.

## 5. Answer và feedback contract

- Single-choice lưu option ID chính xác; multiple-choice dùng `subset_no_incorrect`, nên chọn thiếu đáp án đúng có thể nhận tỷ lệ nhưng chọn bất kỳ đáp án sai nào đưa item về 0 theo `LEARNING-CONTRACT.md`.
- Text/error-correction/reorder chỉ nhận declared variants; Unicode NFC, trim/collapse whitespace và case/punctuation behavior được khai báo. Fuzzy matching luôn `false`.
- Hint copy nói rõ mục tiêu chú ý và trường `changesAttemptToPracticeOnly` luôn là `true`; mọi item role `hinted_practice` khai `evidenceEligibility: practice`.
- Default feedback là một câu tiếng Việt; detailed explanation, correct-answer rationale, distractor rationale, IELTS relevance và additional example được lưu riêng.
- Dữ liệu 120/72/48 là synthetic story data, không được trình bày như kết quả nghiên cứu thật.

## 6. Provenance, license và review

### Provenance

- Toàn bộ câu hỏi, story copy và số liệu là nội dung gốc được tạo riêng cho Atlas English trong P-031; không sao chép đề IELTS thương mại hoặc dataset bên ngoài.
- `p031.original.*` chỉ câu/collocation do dự án tự viết; `p031.synthetic.*` chỉ câu gắn với số liệu khảo sát hư cấu.
- Frequency/register/collocation claims hiện dựa trên standard-English author judgment; qualified human reviewer phải xác nhận trước Public Preview.

### License

- Proof content dự kiến thuộc public practice content và được gắn `CC-BY-NC-SA-4.0`.
- Invalid fixtures dùng `project-original-internal` khi không có ý nghĩa learner-facing.
- Việc ghi license trong fixture không tự phát hành pack; publish vẫn cần release gate.

### Review state

- Item và Narrative Pack chỉ là `codex_pre_reviewed`.
- Chưa có independent language/IELTS reviewer, Product Owner story/tone approval hoặc accessibility evidence trên bản hash này.
- Bất kỳ chỉnh sửa learner-facing English hoặc answer contract nào tạo version/hash mới và làm mọi review gắn hash cũ không còn hiệu lực.

## 7. Invalid-fixture matrix

| Fixture | Lớp kiểm tra | Kết quả bắt buộc |
|---|---|---|
| [`exercise-fuzzy-answer.invalid.json`](../../schemas/fixtures/exercise-fuzzy-answer.invalid.json) | JSON Schema | Reject vì `fuzzyMatching` phải là `false` |
| [`exercise-hinted-mastery.semantic-invalid.json`](../../schemas/fixtures/exercise-hinted-mastery.semantic-invalid.json) | Semantic | Schema-valid nhưng reject vì `hinted_practice` khai mastery |
| [`exercise-ambiguous.semantic-invalid.json`](../../schemas/fixtures/exercise-ambiguous.semantic-invalid.json) | Semantic/content | Schema-valid nhưng reject vì hai option hợp lý trong single-choice |
| [`narrative-pack-broken-reference.semantic-invalid.json`](../../schemas/fixtures/narrative-pack-broken-reference.semantic-invalid.json) | Semantic/reference | Schema-valid nhưng reject vì mission/episode/character/node/prerequisite refs bị gãy |
| [`narrative-pack-too-many-slots.invalid.json`](../../schemas/fixtures/narrative-pack-too-many-slots.invalid.json) | JSON Schema | Reject vì mission vượt 5 exercise slots |
| [`learning-node-self-review-mastery.invalid.json`](../../schemas/fixtures/learning-node-self-review-mastery.invalid.json) | JSON Schema | Reject completion/evidence channel không phù hợp |

## 8. Semantic acceptance rules

P-031 chỉ hoàn tất khi validation evidence chứng minh:

1. JSON của mọi fixture parse được, kể cả fixture chủ ý invalid về schema/semantic.
2. Hai Content Pack, Narrative Pack và ba selected learning node pass schema.
3. Fixture `.invalid.json` bị schema từ chối đúng lý do; fixture `.semantic-invalid.json` pass schema nhưng bị semantic contract từ chối.
4. Exercise ID duy nhất; mỗi learning-node reference tồn tại; skill/node và slot/item format/channel khớp.
5. Narrative episode/mission/character/prerequisite reference tồn tại; order là 1–3; mỗi mission có 4 slots và một primary objective.
6. Có đúng 12 proof items, 4/node; mỗi node có ít nhất hai format và đủ ba content role.
7. Hinted practice không tạo mastery; accepted choice IDs tồn tại; mastery text scoring không fuzzy.
8. Canonical hash trong file khớp thuật toán ở mục 2; rollback target là explicit deactivate.
9. Copy budgets và story-to-learning dossier change đều hiện diện; không có band claim, runtime AI hoặc empirical claim giả.

## 9. Những gì P-031 không hoàn tất

- 18 item còn lại của blueprint 30 item.
- Qualified-human academic approval và Product Owner story/tone approval.
- Browser implementation, evaluator code, database hoặc deployment.
- Public Preview, production release hoặc quyền sử dụng nội dung cho người ngoài owner.

Các phần này giữ nguyên gate trong `PLAN.md`, `VERTICAL-SLICE.md` và `PRE-CODE-CHECKLIST.md`.
