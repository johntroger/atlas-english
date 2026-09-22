# Learning evidence contract

> Trạng thái: APPROVED FOR VERTICAL SLICE — 2026-09-20  
> Nguồn quyết định cho eligibility, mastery, practice và external evidence

Phê duyệt này chỉ áp dụng cho ba node và phạm vi trong `VERTICAL-SLICE.md`. Spelling, Pronunciation, Writing, Listening/Reading assessment và các phase sau vẫn cần review riêng. Đây không phải quyền bắt đầu code khi `PLAN.md` còn DRAFT.

## 1. Kênh tiến bộ

| Kênh | Ý nghĩa | Có đổi mastery? |
|---|---|---|
| `mastery` | bằng chứng auto/controlled-scored đủ điều kiện | Có |
| `practice` | hoàn thành, hint, retry, recording, self-review, revision | Không |
| `external` | điểm/nhận xét từ nguồn ngoài được ghi riêng | Không |
| `technical` | lỗi mạng/mic/audio/content | Không; không tính sai |

Một event chỉ tác động theo các kênh được node/exercise khai báo. UI không được trộn practice completion với mastery.

## 2. Eligibility trước khi tính mastery

Attempt chỉ đủ điều kiện khi đồng thời:

- node cho phép `mastery`;
- exercise có answer/scoring contract xác định;
- không dùng hint;
- không phải retry/revision bị đánh dấu practice-only;
- không có technical/content incident;
- content/schema/algorithm version được hỗ trợ;
- chưa vi phạm first-attempt rule của prompt/recording family;
- assessment mode cho phép auto/controlled score.

Attempt không đủ điều kiện vẫn được lưu để phản hồi, mistake tag và scheduling nhưng không đi vào mastery formula.

Eligible correctness may be `0–1` only when the exercise declares an approved deterministic partial-credit contract. In the slice, single-answer/text/reorder/dictation/error-correction items are binary. Multiple-choice can award proportional subset credit only when the learner selects no incorrect option; any incorrect selection makes that item `0`. Fuzzy text similarity never creates partial mastery credit.

## 3. Hint

- Bất kỳ hint nào làm attempt thành `practice-only`.
- Câu đúng sau hint không tăng hoặc giảm mastery.
- Nó có thể cập nhật mistake tags, review priority và lựa chọn Rescue Lesson.
- UI báo rõ trước khi mở hint: `Gợi ý giúp bạn luyện tập; lượt này sẽ không tính vào mức độ thành thạo.`
- Một independent variant sau đó có thể tạo mastery nếu đáp ứng eligibility và cooldown.

Vertical Slice dùng đúng một optional hint cho mỗi item. Trước khi mở, UI báo lượt hiện tại chuyển thành practice-only. Hint chỉ được nhắc quy tắc hoặc khoanh vùng phần cần chú ý, không chứa đáp án hay thao tác gần như hoàn tất câu. Sau lỗi, hệ thống đưa giải thích ngắn và lên lịch independent variant thay vì bắt lặp lại ngay. Owner approved this policy on 2026-09-20.

`hint_weight` không thuộc mastery algorithm MVP. Nếu sau này muốn dùng graded hints làm evidence, cần superseding decision, calibration và copy mới.

## 4. Pronunciation và Speaking

- Recording, playback, signal heuristic và self-review luôn thuộc `practice`.
- Recording hợp lệ đầu tiên có thể nhận XP/practice milestone; không tạo mastery.
- Retry có thể nhận reward giảm dần nhưng không tạo mastery.
- Chỉ perception/discrimination/classification task có đáp án rõ và đã review mới được cập nhật mastery của node pronunciation tương ứng.
- Không suy pronunciation accuracy, phoneme correctness, accent quality hoặc Speaking band từ local signals.
- Speaking fluency, Part 2 và Part 3 nằm ngoài core MVP. Nếu được giữ như future/self-review content, chúng chỉ dùng `practice` hoặc `external`.

## 5. Writing

- Closed/controlled mechanics task có answer contract có thể tạo mastery cho grammar/spelling/vocabulary node.
- Open Writing submission chỉ thuộc `practice` trong MVP.
- Bản nộp đầu tiên của prompt được dùng làm practice baseline; revision không tăng mastery.
- Writing mechanics observation, word count, repetition và heuristic không trực tiếp thay đổi mastery.
- External Writing result được lưu ở kênh `external`, không ghi đè mastery.

## 6. Listening và Reading

- Practice item có answer contract rõ có thể tạo node mastery.
- Hinted, repeated hoặc content-exposed attempt là practice-only theo rule.
- Band chỉ từ calibrated timed form; form chưa calibration chỉ raw result.
- Technical audio failure làm item invalid/replaced, không wrong.

## 7. External score và Diagnostic

- External/self-reported score tạo provisional baseline/priority, không node mastery.
- Người dùng có thể bỏ Diagnostic; node chưa có evidence giữ `null`.
- Sau 1–2 tuần sử dụng, hệ thống có thể đề xuất confirmation task cho node thiếu evidence nhưng không ép làm lại full Diagnostic.
- External score cũ giảm confidence của roadmap evidence, không tự giảm mastery.

## 8. Attempt evaluation authority

- Client có thể chạy shared deterministic evaluator để phản hồi nhanh cho public practice.
- Server xác minh actor, content/item version, answer contract, eligibility và idempotency trước khi ghi evidence.
- Client không được gửi `correct=true` như nguồn đáng tin duy nhất.
- Assessment/private-key scoring luôn server-side.
- Attempt snapshot đủ item/content/algorithm/scoring-contract version để replay/audit.
- Acknowledgement chỉ authoritative sau database transaction commit. Retry cùng actor/key/hash trả cùng stored result; cùng key nhưng payload/hash khác bị từ chối và không tạo evidence.
- Guest attempt có thể lưu deterministic outcome nhưng không tạo account mastery trước explicit import consent; import recompute eligibility từ acknowledged snapshot thay vì tin client progress.

## 9. Candidate mastery boundary

Mastery formula trong `LEARNING-ENGINE.md` chỉ nhận eligible attempt với `hints_used=0`. Formula không quyết định eligibility; application use case phải kiểm tra contract này trước.

Owner selected a versioned weighted-evidence model rather than recent-accuracy percentage or star-only progression. The v0.1 factors in `LEARNING-ENGINE.md` are approved as the initial contract: same-day repetition carries 40% spacing weight, eligible gains are capped at 12 points and one eligible failure cannot reduce mastery by more than 15 points. Golden-case verification remains mandatory before implementation approval.

Untested nodes remain `null`. The first eligible non-Diagnostic attempt initializes the internal calculation from 20, while the learner sees `Cần thêm bằng chứng` rather than a numeric score. Owner approved this cautious initialization on 2026-09-20.

Confidence is separate from mastery. Diagnostic initialization is capped at `0.45`; missing supported production/transfer evidence caps confidence at `0.69`; no recent successful evidence caps it at `0.69` after 30 days and `0.49` after 60 days. Recency caps do not erase the historical mastery score. Owner approved these limits on 2026-09-20.

Mastery score là internal projection. UI ưu tiên trạng thái bằng lời:

- Đang làm quen.
- Đang luyện có hướng dẫn.
- Có thể dùng độc lập.
- Đến lịch ôn lại.
- Cần thêm bằng chứng.

Không hiển thị 0–100 như IELTS score.

## 10. Golden cases bắt buộc

- Correct first attempt, no hint.
- Correct after hint: mastery unchanged.
- Incorrect then controlled variant correct: only independent variant eligible.
- Recording valid/retry: practice only.
- Pronunciation discrimination correct: eligible if node contract permits.
- Open Writing first submission/revision: practice only.
- Controlled grammar edit inside Writing context: eligible for grammar node only.
- External score import: priority changes, mastery unchanged.
- Technical failure: no wrong/evidence/reward penalty.
- Retired content: historical attempt preserved, evidence invalidated/recomputed.
- Duplicate idempotency retry: one attempt/reward/evidence event.

The exact numeric vectors for initialization, controlled production, transfer, bounded failure and same-day repetition are authoritative in `LEARNING-ENGINE.md`. Owner approved the full eight-case set on 2026-09-20.

VS-02 implements this boundary as a framework-independent domain module with executable evidence in [`tests/learning-evaluator.test.mjs`](../tests/learning-evaluator.test.mjs). The tests distinguish answer correctness from mastery eligibility and verify that hint, technical incident, content incident, self-review, unsupported version and practice-only retry paths cannot update mastery. Idempotency is classified purely here; durable enforcement remains in VS-06.

## 11. Change control

Eligibility/scoring changes require version bump, golden-test update, shadow comparison and documented recompute impact. Historical attempt payloads are never rewritten.

## 12. Vertical-slice node routing

Ba node `grammar.sentence.boundaries`, `grammar.nouns.countability` và `vocabulary.cause_effect` đều dùng:

- `assessmentMode: hybrid`;
- `progressChannels: [mastery, practice]`;
- independent, answer-contract-valid attempts có thể đi qua mastery eligibility gate;
- hinted/guided attempts chỉ cập nhật practice status;
- mastery và practice không được cộng thành một điểm tổng hợp.

Owner approved this routing on 2026-09-20. Các vector golden ở mức đặc tả đã được phê duyệt và kiểm tra số học; executable golden tests vẫn phải được tạo và chạy sau khi Vertical Slice được cho phép triển khai.

### Completion contract đã chọn

Một trong ba node chỉ được hiển thị `Đã nắm vững` khi đồng thời:

- mastery score `>= 85`;
- có successful eligible evidence trên ít nhất 3 ngày học khác nhau;
- evidence bao phủ ít nhất 2 exercise formats;
- có ít nhất 1 independent review hoặc transfer item thành công.

Điểm 70–84 chỉ được gọi là `Có thể dùng độc lập`, chưa phải `Đã nắm vững`. Owner approved this conservative contract on 2026-09-20.

### Review contract đã chọn

- independent failure: due lại sau 1 ngày và xét Rescue Lesson;
- guided-practice success: 2 ngày;
- independent-practice success: 4 ngày, sau đó 7 ngày;
- mastered/spaced-review success: 7, 14, sau đó 30 ngày;
- success sau rescue: một nửa interval thành công gần nhất, tối thiểu 2 ngày.

Overdue làm tăng ưu tiên nhưng không tự tạo mastery credit. Owner approved this adaptive schedule on 2026-09-20.
