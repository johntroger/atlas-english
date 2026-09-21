# UX prototype and validation plan

> Trạng thái: DRAFT — design artifact only

## Quyết định về mức độ hoàn thiện

Trước khi code, dự án chỉ tạo wireframe responsive mức cơ bản và state/transition map cho năm luồng cốt lõi. Artifact được viết bằng Markdown thuần trong [WIREFRAMES.md](WIREFRAMES.md), dùng text diagram cho layout và Mermaid cho luồng/trạng thái; không phụ thuộc Figma, ảnh PNG/PDF hoặc tệp nhị phân bên ngoài. Không tạo một prototype clickable hoặc high-fidelity riêng. Sau khi người dùng phê duyệt `APPROVED — VERTICAL SLICE ONLY`, bản Owner Alpha được code trở thành prototype tương tác đầu tiên.

Wireframe phải đủ rõ để Codex kiểm tra hierarchy, copy, trạng thái lỗi/rỗng/loading, điểm dừng an toàn, keyboard/focus order và cách bố cục đổi giữa điện thoại với desktop. Wireframe không cần animation hoàn chỉnh, dữ liệu thật, backend hoặc pixel-perfect visual polish.

## Mục tiêu

Kiểm tra information hierarchy, story–learning balance và high-risk states trước khi component architecture bị khóa.

Prototype và Owner Alpha được phép dùng copy/item ở trạng thái `draft` hoặc `codex_pre_reviewed`, phải gắn nhãn nội bộ và không được đưa cho người dùng ngoài chủ dự án như nội dung đã kiểm định. Human IELTS review không phải điều kiện để thử nội bộ; nó vẫn là cổng trước Public Preview.

## Owner-first validation

Chủ dự án là người dùng đầu tiên và cũng là người duy nhất của Owner Alpha. Không có yêu cầu tuyển 3–5 người hoặc đạt cỡ mẫu usability trước khi bắt đầu triển khai. Codex thực hiện heuristic review trên wireframe trước; sau khi được phép code, chủ dự án tự đi qua các luồng tương tác thật trên điện thoại và desktop, gửi vấn đề cho Codex để sửa và retest.

Mỗi finding tối thiểu ghi: môi trường/thiết bị, bước tái hiện, kết quả mong đợi/thực tế, ảnh nếu có, mức nghiêm trọng, bản sửa và kết quả retest. Owner feedback có giá trị cho iteration nhưng không được diễn giải thành bằng chứng đại diện cho nhiều người học. External user testing được bổ sung dần sau này theo quyết định của chủ dự án, không có số lượng tối thiểu cố định.

## Năm wireframe/luồng bắt buộc trước code

1. **Landing:** giá trị chính, Guest Quick Start là CTA chính, đăng nhập là hành động phụ và privacy notice ngắn.
2. **Question:** context truyện vừa đủ, một objective, prompt/đáp án, hint practice-only, skip và trạng thái gửi/mất mạng.
3. **Feedback:** đúng/sai, giải thích Việt ngắn có thể mở rộng, lỗi mục tiêu, tác động của hint và hành động tiếp theo.
4. **Checkpoint/safe stop:** tiến độ cụm, recap hữu ích, dừng/tiếp tục và lời mời đăng nhập theo ngữ cảnh sau checkpoint đầu tiên.
5. **Sign-in/guest import:** email verification, preview dữ liệu khách, consent/decline, import success/failure/idempotent retry và đi tới Home/history.

Prologue/story-skip, sai lần đầu/lần hai và independent review được biểu diễn như trạng thái/transition bên trong năm luồng trên, không cần thêm prototype riêng. Pronunciation và Writing không thuộc wireframe P0 của Vertical Slice; technical prototype/study của chúng vẫn là gate của giai đoạn sau.

## Bộ bàn giao tối thiểu

- Một wireframe điện thoại và một biến thể desktop cho mỗi luồng; tablet có thể suy ra bằng responsive rules nếu không xuất hiện rủi ro riêng.
- State map liệt kê default, loading, success, validation error, server/network error và disabled/empty state có liên quan.
- Luồng bàn phím/focus dự kiến, nhãn accessibility quan trọng và hành vi reduced motion.
- Ghi chú liên kết mỗi màn hình với acceptance criterion tương ứng.
- Biên bản heuristic review của Codex; P0/P1 phải được xử lý trong wireframe trước khi xin quyền code.

Không yêu cầu hotspot/click-through, animation demo, mock backend hoặc visual polish hoàn chỉnh. Những yếu tố tương tác được xác nhận trong Owner Alpha đã code.

`WIREFRAMES.md` là nguồn artifact duy nhất. Tài liệu này chỉ định yêu cầu/review; không sao chép bản vẽ sang nhiều tệp. Mỗi phần tử tương tác có ID ổn định để nối finding, acceptance criterion và implementation về sau.

## Trình tự thực hiện và duyệt

Wireframe được làm từng cái một theo thứ tự `Landing → Question → Feedback → Checkpoint/safe stop → Sign-in/guest import`. Với mỗi wireframe:

1. tạo phone layout, desktop adaptation, state map và accessibility notes;
2. Codex thực hiện heuristic review và ghi finding vào `WIREFRAMES.md`;
3. xử lý mọi P0/P1 của wireframe đó;
4. Codex đóng P0/P1 và ghi rationale; chỉ hỏi chủ dự án nếu thay đổi ảnh hưởng đáng kể tới scope, chi phí, pháp lý, dữ liệu hoặc claim;
5. mở wireframe kế tiếp; chủ dự án có thể yêu cầu chỉnh bất kỳ lúc nào.

P2/P3 có thể được giữ lại nếu có lý do và không làm sai learning flow, accessibility hoặc dữ liệu. Việc Codex sign-off từng wireframe là kiểm soát chất lượng artifact thiết kế, không phải quyền code hoặc quyền phát hành.

## Home hierarchy

1. `Học tiếp` — CTA duy nhất nổi bật.
2. `Ôn tập cần làm` — chỉ khi có due review.
3. `Khám phá thêm` — story map, Expedition và nội dung phụ.

Field Case, Atlas Dispatch, Expedition, Mistake Book và Progress không được cạnh tranh ngang hàng trên Home.

## Progress presentation

Ưu tiên trạng thái bằng lời, evidence count và next action. Không hiển thị mastery 0–100 như điểm thi. Story progress, mastery, practice status và external evidence là bốn vùng thị giác tách biệt.

## Nghiên cứu giai đoạn sau

Pronunciation technical prototype vẫn phải kiểm tra mic denied, low confidence, unsupported browser và session-only deletion trước khi nhập vào Beta MVP. Writing mobile study sau Vertical Slice sẽ kiểm tra prompt thu gọn/cố định, outline mode, paragraph navigator, word count trung tính, keyboard-safe controls, save state và copy-before-session-loss. Hai nghiên cứu này không chặn quyền code Vertical Slice.

## Validation tasks

- Người học giải thích được mục tiêu mission trong 10 giây.
- Bỏ story vẫn làm bài đúng context.
- Phân biệt `đã hoàn thành truyện` với `đã thành thạo`.
- Hiểu tác động của hint trước khi mở.
- Tìm được cách dừng an toàn và quay lại.
- Không nhầm trạng thái story completion với mastery hoặc IELTS band.

Trong heuristic review trước code, ghi finding, mức nghiêm trọng và thay đổi wireframe. Trong Owner Alpha, ghi quan sát, completion, lỗi hiểu, lời nói của chủ dự án và đề xuất sửa. Không dùng time-on-app đơn lẻ hoặc một người dùng duy nhất làm bằng chứng UX/learning có thể khái quát.
