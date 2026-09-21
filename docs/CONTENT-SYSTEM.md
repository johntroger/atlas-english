# Content system

> Trạng thái: DRAFT

## Mục tiêu

Nội dung thêm được mà không sửa engine; mọi item có version/provenance/review; attempt tái lập theo content version; pack rollback được; runtime không sinh nội dung bằng AI.

## Lifecycle

`Draft → schema-valid → academic-reviewed → Preview → published → deprecated → retired`

Published pack bất biến; sửa lỗi tạo version mới. Pack mới chỉ activate giữa session.

## Hai kênh nội dung

### Public practice

- Trong public Git repository, giấy phép CC BY-NC-SA 4.0.
- Chia theo skill/level/topic; audio tải theo nhu cầu.
- Content được server/CDN cung cấp khi online; không có offline pack.

### Private assessment

- Repository/storage riêng, quyền hạn chế, không thuộc public license.
- Chứa item, keys, blueprint, calibration và exposure data.
- Client chỉ nhận item payload cần thiết; không nhận key sớm.
- Form rotation, exposure threshold và retirement bắt buộc.

## Validation

Schema/references, deterministic answers, normalization, duplicates, prerequisite/coverage, explanation, audio/transcript, provenance/license, sensitive-topic safety, academic review và Preview smoke test.

Người viết không tự duyệt thay đổi học thuật của mình. Contributor khai quyền đối với nội dung. Private bank không được upload lên công cụ tương đồng bên ngoài nếu chưa được duyệt.

### Chuẩn reviewer cho Vertical Slice

Đây là chuẩn quản trị nội bộ của Atlas English, không phải chuẩn chứng nhận chính thức của IELTS.

- Cùng một reviewer đủ chuẩn được phép duyệt toàn bộ slice nhưng phải duyệt từng artifact, không dùng lấy mẫu: cả 30 item và toàn bộ learner-facing English trong Prologue/ba mission, gồm dialogue, instruction, label, hint, feedback và recap.
- Reviewer đạt ít nhất một trong hai đường năng lực: (a) IELTS Academic Overall từ 7.5 và Writing từ 7.0; hoặc (b) ít nhất hai năm kinh nghiệm giảng dạy hay biên tập nội dung IELTS có thể xác minh.
- Tác giả, người sửa nội dung học thuật cuối cùng và reviewer không được là cùng một người. Codex có thể author/pre-review nhưng không được tính là independent reviewer.
- Mỗi item hoặc narrative text unit lưu reviewer identity/reference, qualification path, reviewed content/narrative version/hash, decision, checklist result, comment, timestamp và conflict-of-interest declaration.
- `approved` chỉ hợp lệ khi reviewer duyệt English, đáp án/accepted variants, distractors, giải thích, level, IELTS relevance, claim safety và provenance. `changes_requested` quay lại Draft; sửa học thuật sau duyệt làm mất approval và cần review lại.
- Nếu chưa tìm được reviewer đạt chuẩn, pack vẫn ở Draft/Preview nội bộ và không được phát hành cho người dùng công khai.
- Product Owner duyệt premise, continuity, tone, emotional safety và character intent; accessibility được kiểm theo `ACCESSIBILITY.md`. Academic reviewer không mặc nhiên thay thế các vai trò này.

## Authoring với Codex

Codex có thể đề xuất, soạn nháp và pre-review ngoài runtime trong planning, prototype và implementation. Kết quả phải mang `reviewStatus: draft` hoặc `reviewStatus: codex_pre_reviewed`, không được gắn `reviewed`/`approved`, và có thể dùng cho schema fixtures, automated tests, prototype hoặc internal Preview. Chỉ `approved` mới đủ điều kiện đi tiếp tới public-release gate; Codex không được tự chuyển trạng thái sang publishable.

Human academic review không phải điều kiện để bắt đầu code hoặc cho chủ dự án dùng Owner Alpha. Nó là cổng trước khi cấp Public Preview cho bất kỳ người dùng nào ngoài chủ dự án: toàn bộ 30 item và learner-facing English phải đạt chuẩn reviewer ở trên. Machine translation chỉ ở authoring time, được lưu và review. Không tự động scrape/publish current events.

## Current-events workflow

Allowlist nguồn → lưu link/metadata/đoạn trích tối thiểu hợp pháp → editorial queue → kiểm chứng nguồn chính hoặc nguồn thứ hai khi cần → viết item gốc → review date/expiry → publish. Quá hạn review tự deactivate. Sensitive topic có warning và skip-equivalent không phạt.

## Khối lượng

- Golden slice: 1 node, 8–12 item review từng item.
- Wave đầu: 12–15 node, tổng khoảng 100–180 item được duyệt, ít nhất hai format/node khi phù hợp.
- Mở rộng: 200–300 sau khi pipeline ổn định.

Số lượng không thay thế coverage, semantic validity hoặc delayed/transfer evidence.

### Vertical-slice item blueprint

Mỗi trong ba node đã chọn có 10 reviewed items: 6 independent mastery-eligible, 2 hinted practice-only và 2 independent review/transfer. Tổng bank là 30 item, nhưng story run đầu chỉ lấy khoảng 12 item qua ba mission; phần còn lại phục vụ lựa chọn biến thể, review và replay. Một item hinted không được tái phân loại thành mastery evidence chỉ vì người học trả lời đúng.

### Pre-code proof pack

Trước khi xin quyền code, tạo một proof pack khoảng 12 item cho first run; đây là tập con của blueprint 30 item, không phải một bank bổ sung. Proof pack phải:

- phủ cả ba node, mục tiêu khoảng 4 item/mission và ít nhất hai interaction format phù hợp cho mỗi node;
- có đường independent mastery-eligible, hinted practice-only và independent review/transfer để kiểm chứng ranh giới bằng chứng;
- gắn từng item với construct, answer contract/accepted variants, distractor rationale, giải thích mặc định/chi tiết, IELTS relevance, provenance/license, immutable ID/version và `reviewStatus: codex_pre_reviewed`;
- đủ ngắn cho ngân sách tải nhận thức và làm thay đổi hồ sơ quan sát được đã quy định trong `NARRATIVE-DESIGN.md`;
- có valid fixtures cùng invalid fixtures cho ít nhất: ambiguity, fuzzy answer vượt policy, hinted attempt bị gán mastery, sai completion channel, broken reference và Narrative Pack vượt số slot;
- ghi hash/rollback target để cùng một attempt có thể được tái lập và một pack lỗi có thể bị rút an toàn.

Proof pack chỉ chứng minh contract/schema/evaluator và trải nghiệm Owner Alpha. Nó không thay thế đủ 30 item hoặc qualified-human review bắt buộc trước khi mở cho người dùng khác.

P-031 proof pack hiện được ghi tại [`content/vertical-slice/P031-PROOF-PACK.md`](content/vertical-slice/P031-PROOF-PACK.md), với schema/semantic evidence riêng. Hai Content Pack tách Grammar và Vocabulary vì một pack chỉ khai một `skill`; chúng vẫn tạo thành một first run logic gồm 12 item. `exercise.schema.json` cho phép metadata authoring có cấu trúc, còn Narrative Pack cho phép Prologue copy và rollback target tường minh.

## Incident

Retire/version item; xác định attempts bị ảnh hưởng; đánh dấu non-evidentiary; rebuild mastery; thông báo người dùng; ghi changelog nội dung và rollback target.

## Schemas

Các schema trong `schemas/` điều khiển public content và export. `sync-operation.schema.json` là artifact lịch sử, không dùng cho client offline sync sau ADR-013; cần deprecate/xóa trong implementation migration. Private assessment schema không nằm trong public repo.

`schemas/narrative-pack.schema.json` điều khiển story copy và 3–5 exercise slots. Narrative Pack và Exercise Pack có version độc lập; attempt snapshot phải lưu mission/slot/item/content-pack/narrative-pack/evaluation-algorithm/scoring-contract versions, cùng selection-algorithm version khi có chọn bài thích ứng.

`schemas/learning-node.schema.json` yêu cầu `completionContract`. Assessment mode quyết định completion channel: mastery cho auto/controlled/hybrid, practice cho self-review-only và external cho external-review-required. Semantic validation phải xác nhận mọi prerequisite/unlock dùng contract của node tiên quyết, không tự chuyển practice milestone thành mastery.
