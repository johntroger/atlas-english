# Atlas English — Kế hoạch sản phẩm và kỹ thuật

> Phiên bản: 2.5
> Cập nhật: 2026-09-22
> Trạng thái: **APPROVED — VERTICAL SLICE ONLY; VS-07 COMPLETE; VS-08 LOCKED**

## 1. Mục đích tài liệu

Đây là nguồn quyết định cao nhất về phạm vi và điều kiện phê duyệt của Atlas English. Các đặc tả chi tiết nằm trong `docs/`; khi có mâu thuẫn, `PLAN.md` quyết định phạm vi, ADR quyết định kiến trúc đã chấp thuận, và tài liệu chuyên đề quyết định hành vi chi tiết.

Cho đến khi người dùng phê duyệt một phạm vi triển khai cụ thể, chỉ được làm tài liệu, schema, ADR, nội dung mẫu và công việc rà soát. Quyền đầu tiên chỉ có thể là `APPROVED — VERTICAL SLICE ONLY`; trạng thái này không cho phép tự động mở rộng sang beta MVP hoặc Production. Không được viết mã ứng dụng, cài dependency, khởi tạo framework/cơ sở dữ liệu, triển khai hoặc phát hành ngoài phạm vi đã phê duyệt.

Sau khi có quyền Vertical Slice, việc triển khai vẫn theo từng cổng `VS-01` đến `VS-09` trong `docs/VERTICAL-SLICE.md`. Quyền ban đầu chỉ mở `VS-01`. Mỗi bước phải hoàn thành code trong đúng phạm vi, chạy toàn bộ kiểm thử/kiểm tra bắt buộc, tổng hợp bằng chứng và dừng lại hỏi chủ dự án trước khi mở bước kế tiếp. Nếu có lỗi hoặc tiêu chí chưa đạt, chỉ được sửa và kiểm thử lại trong bước hiện tại; không được code trước, gộp hoặc ngầm mở bước sau. Sự chấp thuận một bước không cấp quyền cho bất kỳ bước nào ngoài bước kế tiếp được nêu rõ trong báo cáo.

## 2. Tầm nhìn sản phẩm

Atlas English là website game hóa hỗ trợ người Việt luyện nền tảng tiếng Anh phục vụ IELTS Academic, tập trung vào:

- grammar;
- vocabulary và collocation;
- spelling;
- pronunciation ở mức tín hiệu đáng tin cậy;
- chuyển giao kiến thức sang Listening, Reading và Writing practice.

Sản phẩm không tự nhận là khóa luyện thi IELTS đầy đủ, không thay thế giám khảo hoặc giáo viên, và không suy diễn Overall band từ dữ liệu không đủ.

Campaign khởi đầu là **Route to 6.5**. Hồ sơ tham chiếu để thiết kế là người học tự ước lượng band tổng 5.0, Listening 5.0, Reading 6.0, Writing 5.0, Speaking 5.5, mục tiêu 6.5 và có thể học khoảng 150 phút/ngày. Đây không phải giới hạn của sản phẩm và không gắn với hạn thi cố định.

## 3. Đối tượng và mô hình truy cập

- Người Việt học IELTS Academic trên toàn cầu.
- Riêng Public Vertical Slice Preview ban đầu chỉ hướng tới người từ 18 tuổi đang cư trú tại Việt Nam. Không thu vị trí chính xác hoặc dùng IP để chặn địa lý và không chủ động quảng bá Preview ra ngoài Việt Nam; mở rộng địa lý cần một lần rà soát privacy/legal và cập nhật thông báo riêng.
- Public Vertical Slice Preview chỉ cho phép tạo tài khoản khi người dùng tự xác nhận từ 18 tuổi; không thu ngày sinh. Hỗ trợ tài khoản người chưa thành niên bị hoãn cho đến khi có policy/legal review riêng.
- Giao diện bằng tiếng Việt; nội dung luyện tập bằng tiếng Anh.
- Giải thích tiếng Việt là tùy chọn và có thể thu gọn.
- Website responsive cho điện thoại, máy tính bảng và desktop; không xây native app.
- Website cần Internet để hoạt động; không làm PWA, không hỗ trợ học offline.
- URL production công khai trên tên miền `vercel.app` trong beta; chưa cần custom domain.

### 3.1. Khách chưa đăng nhập

Khách có thể vào landing page và chơi core practice/Quick Start mà không đăng nhập. Trạng thái khách:

- được giữ trong trình duyệt tối đa 24 giờ kể từ hoạt động gần nhất;
- không tạo mastery, streak, roadmap hoặc lịch sử dài hạn chính thức;
- không được dùng full assessment;
- khi đăng nhập, hệ thống hỏi rõ trước khi nhập các kết quả khách đã hoàn thành còn hợp lệ.

Trong Owner Alpha, toàn bộ website nằm sau một access gate của môi trường nên chỉ chủ dự án có thể tới Landing. Sau khi qua gate, chủ dự án vẫn kiểm thử được trải nghiệm khách bình thường; gate không được biến thành product login hoặc làm thay đổi hợp đồng Guest Quick Start.

### 3.2. Tài khoản

Đăng ký tự phục vụ được mở công khai trong beta, không invite-only, không allowlist và không đặt giới hạn số người dùng ở tầng sản phẩm. Khi chạm quota hạ tầng, hệ thống có thể tạm dừng đăng ký mới nhưng vẫn giữ chế độ khách và có thể mở waitlist.

Đăng nhập dùng magic link và mã dùng một lần:

- tài khoản ở trạng thái chờ xác minh ngay khi nhập email;
- tài khoản chưa xác minh hoạt động như khách và bị xóa sau 24 giờ;
- mỗi liên kết/mã chỉ dùng một lần và hết hạn sau 60 phút; hết hạn không tự xóa tài khoản chờ, người dùng có thể xin thử thách mới nếu chưa quá giới hạn tần suất;
- sau 5 lần nhập sai, mã bị vô hiệu;
- phản hồi phải chung chung để tránh dò email và có rate limit;
- phiên đăng nhập tối đa 30 ngày; thao tác nhạy cảm yêu cầu xác thực lại.

Đăng nhập mở khóa lịch sử, mastery, streak, roadmap, export/xóa dữ liệu và các assessment đủ điều kiện.

## 4. Nguyên tắc học tập

1. **Ngắn và có điểm dừng:** một câu thường 30–90 giây; một cụm 3–5 phút; tối đa 5 câu trước checkpoint ngắn.
2. **Học trước, đo sau:** Practice phản hồi ngay; Assessment chỉ phản hồi sau khi nộp.
3. **Mastery dựa trên bằng chứng:** độ chính xác, mức hỗ trợ, độ khó, độ mới và sự đa dạng ngữ cảnh; không chỉ dựa vào XP.
4. **Không đánh đồng chỉ số:** Writing mechanics không phải Writing band; pronunciation không phải Speaking band.
5. **Không trừng phạt lỗi kỹ thuật:** lỗi mạng, mic hoặc audio không được tính là câu sai.
6. **Khuyến khích bền vững:** mục tiêu theo tuần, ngày nghỉ không phạt; XP là thứ yếu và giảm dần khi lặp lại.
7. **Không khóa kiến thức bằng phần thưởng:** phần thưởng chỉ là cosmetic, bản đồ hoặc câu chuyện.
8. **Thuật toán xác định và có phiên bản:** cùng đầu vào và phiên bản phải cho cùng kết quả; có thể audit, shadow-compare và rollback.

## 5. Phạm vi MVP

### 5.0. Phân kỳ phạm vi trước khi triển khai

Kế hoạch không được phê duyệt như một khối duy nhất. Quyền triển khai đầu tiên, nếu được người dùng chấp thuận sau này, chỉ là `APPROVED — VERTICAL SLICE ONLY`:

| Mốc | Phạm vi |
|---|---|
| Thiết kế trước code | Wireframe responsive mức cơ bản cho 5 luồng cốt lõi; không làm prototype tương tác/high-fidelity riêng |
| Owner Alpha | Vertical Slice chạy online nhưng chỉ chủ dự án truy cập; dùng nội dung draft/Codex-pre-reviewed để dogfood, ghi lỗi và sửa dần; chưa mở cho người dùng khác |
| Public Vertical Slice | Guest Quick Start, mini-episode 3 mission, 3 Grammar/Vocabulary nodes, 30 item đã human-review, deterministic feedback, checkpoint, một review, optional sign-in/import/history |
| Beta MVP | Season 1, 12–15 nodes/100–180 item, bốn khu vực nền tảng, Writing/transfer, lifecycle, accessibility và public-beta controls |
| Post-validation | Calibrated LR assessment/private bank production, Campaign/Expedition mở rộng và mọi claim nâng cao |

Pronunciation dùng technical prototype riêng trước khi nhập vào Beta MVP. Vertical slice không bao gồm calibrated assessment, private assessment bank production, Writing dài, Speaking Part 2/3, full Season 1, Campaign 2+, Atlas Dispatch, Character Cases hoặc AI.

Năm wireframe bắt buộc trước khi xin quyền code là Landing, Question, Feedback, Checkpoint/safe stop và Sign-in/guest import. Chúng được viết bằng Markdown thuần, có text diagram, Mermaid state/transition map và chú thích responsive/accessibility, rồi lưu cùng repository tại `docs/WIREFRAMES.md`. Việc thiết kế và duyệt diễn ra tuần tự theo đúng thứ tự trên, bắt đầu từ Landing; finding P0/P1 của một wireframe phải được xử lý trước khi chuyển sang wireframe kế tiếp. Không yêu cầu một prototype clickable/high-fidelity tách biệt. Sau khi có quyền triển khai, bản Owner Alpha được code sẽ là prototype tương tác đầu tiên và là nơi chủ dự án kiểm thử luồng thật trên điện thoại/desktop.

### 5.1. Bắt buộc

- Landing page, Quick Start cho khách và đăng ký/đăng nhập không mật khẩu.
- Onboarding tối đa 5 câu; diagnostic tùy chọn theo mô-đun khoảng 5 phút.
- Home với một hành động chính “Học tiếp”, kế hoạch hôm nay và tiến độ gọn.
- Grammar Lab, Vocabulary Forge, Spelling Sprint và Pronunciation Studio.
- Daily Quest mang tính gợi ý; người dùng có thể chọn bài khác.
- Practice ngắn, checkpoint sau tối đa 5 câu, safe stop và resume online.
- Mastery Engine, review scheduler, mistake book và giải thích lỗi xác định.
- Writing Practice có scaffold, autosave và phản hồi mechanics giới hạn tối đa 3 nhóm lỗi ưu tiên.
- IELTS transfer tasks ngắn; Reading passage dài được chia đoạn và nhóm 3–5 câu.
- Listening practice với audio ngắn 30–90 giây.
- Lịch sử, tiến độ, roadmap, streak tuần và export/xóa dữ liệu cho tài khoản.
- Content pack bất biến, có phiên bản, schema validation, staged release và rollback.
- Responsive, WCAG AA, reduced motion, dark/light theme và ba cỡ chữ.
- Quan sát lỗi tối thiểu, backup/restore, feature flag, circuit breaker và rollback release.

### 5.2. Không thuộc MVP

- Native mobile app, PWA, service worker hoặc học offline.
- Runtime content generation hoặc runtime generative AI.
- AI Coach hiển thị trong giao diện.
- Human expert account, chat với chuyên gia, lớp học hoặc marketplace.
- Social feed, leaderboard, nhắn tin giữa người học.
- Chấm Speaking toàn diện, nhận dạng phoneme hoặc suy ra Speaking band.
- Full IELTS mock đủ bốn kỹ năng hoặc tuyên bố Overall band.
- Speaking fluency/Part 2/Part 3 training trong core MVP; Speaking chỉ giới hạn ở pronunciation practice và các grammar/vocabulary transfer không chấm Speaking.
- Thanh toán, quảng cáo hoặc gói thuê bao.

### 5.3. AI tương lai, không phải quyền triển khai hiện tại

MVP dùng phản hồi bằng thuật toán riêng. Một AI Coach tương lai có thể dùng Gemini theo mô hình BYOK, nhưng chỉ sau một phê duyệt giai đoạn riêng. Nguyên tắc bắt buộc:

- người dùng tự cung cấp API key; dự án không cấp shared key;
- key chỉ được mã hóa trong trình duyệt, mở khóa bằng mật khẩu cục bộ theo phiên, không sync, không gửi server, không log và không export;
- chỉ gửi nội dung người dùng chọn cùng rubric tối thiểu sau màn hình preview;
- text only; không gửi audio;
- AI chỉ tư vấn, không thay đổi mastery, readiness hoặc dữ liệu;
- model phải nằm trong allowlist đã test, có version prompt/evaluation và kill switch;
- core learning vẫn hoạt động khi AI bị tắt hoặc lỗi.

Chi tiết và ranh giới phê duyệt nằm trong ADR-014. Việc mô tả này không cho phép code AI trong MVP.

## 6. Vòng chơi và tải nhận thức

### 6.1. Cấu trúc phiên

`Chọn mục tiêu → cụm 3–5 phút → checkpoint → tiếp tục hoặc dừng an toàn`

- Mỗi checkpoint chỉ hiển thị tiến độ và một ghi chú hữu ích.
- Người dùng có thể bỏ qua câu trong practice.
- Câu chưa trả lời không tạo bằng chứng mastery trong practice.
- Timed assessment áp dụng quy tắc IELTS sau cảnh báo rõ.
- Gợi ý làm attempt thành practice-only.

### 6.2. Xử lý câu sai

- Sai lần đầu: gợi ý có mục tiêu.
- Sai lần hai: đáp án, giải thích và đưa vào review queue.
- Tiếp theo: một biến thể có kiểm soát ngay và một biến thể khác sau khoảng cách ôn tập.
- Câu đúng có cooldown; câu sai xuất hiện lại sớm dưới biến thể khác, không lặp nguyên văn liên tục.

### 6.3. Nhịp học

- Lựa chọn block 15/30/45 phút; không khuyến nghị học liên tục quá 45 phút.
- Roadmap theo chu kỳ lăn 4 tuần; ngày thi là tùy chọn.
- Từ mới mặc định tối đa 8/ngày; người dùng có thể chọn 3/5/8/12, nhưng review luôn được ưu tiên.
- Khuyến nghị tối đa một LR mock đầy đủ mỗi tuần.

## 7. Đo lường học tập

### 7.1. Mastery

Mastery được tính theo node kỹ năng và phiên bản thuật toán. Nó cần nhiều dạng bằng chứng qua thời gian:

- Vocabulary: meaning, spelling, form và collocation.
- Grammar: recognition, controlled production và contextual production.
- Writing mở: bản nộp đầu tiên và các revision chỉ thuộc practice; chỉ bài mechanics đóng/controlled có answer contract xác định mới có thể tạo mastery cho đúng node grammar, spelling hoặc vocabulary.
- Pronunciation: recording và self-review chỉ cập nhật practice status, không tạo mastery; chỉ bài perception/discrimination có đáp án xác định mới có thể tạo mastery.

Mastery không giảm trực tiếp chỉ vì thời gian trôi qua; độ tin cậy của bằng chứng giảm và tạo lịch recheck. Thay đổi thuật toán phải có migration/recompute, shadow comparison, rollback và thông báo nếu kết quả người dùng thay đổi đáng kể.

### 7.2. Band và readiness

- Chỉ LR mock đã hiệu chuẩn mới được hiển thị band Listening/Reading.
- Form chưa hiệu chuẩn chỉ hiển thị raw score, phản hồi và nhãn “thử nghiệm”.
- Writing Practice chỉ báo mechanics, không báo Writing band.
- Pronunciation Studio chỉ báo ba mức: “Cần luyện thêm”, “Đang tiến bộ”, “Ổn định”; không báo Speaking band hoặc điểm 0–100.
- Overall readiness chỉ xuất hiện khi có bằng chứng nội bộ đủ cho L/R và bằng chứng W/S hiện hành phù hợp; nếu không, hiển thị “Chưa đủ bằng chứng”.
- Điểm ngoài hệ thống do người dùng tự nhập phải có ngày và nguồn, được đánh dấu self-reported, suy giảm độ tin cậy theo tuổi dữ liệu và có lịch sử thay thế thay vì ghi đè.

### 7.3. Pronunciation

Phân tích local/browser chỉ dùng tín hiệu đủ tin cậy: hoạt động giọng nói, âm lượng, thời lượng, tốc độ, khoảng dừng và proxy nhịp/stress. Không tuyên bố nhận diện phoneme.

- Audio chỉ tồn tại trong phiên, được phát lại/re-record trong phiên và xóa khi thoát.
- Không lưu audio, fingerprint hoặc feature chi tiết; chỉ lưu mức/kategori và nhóm lỗi tổng quát.
- Precheck mic, âm lượng và nhiễu; confidence không đủ thì yêu cầu thử lại, không chấm và không cập nhật mastery.
- Trình duyệt không hỗ trợ sẽ dùng nghe–ghi âm–tự đối chiếu có hướng dẫn và không tạo mastery.
- Chấp nhận accent dễ hiểu; không ép accent bản ngữ.

## 8. Nội dung và kiểm định học thuật

- Nội dung do người viết biên soạn; trong giai đoạn planning/implementation, Codex có thể gợi ý, soạn nháp và pre-review để xây prototype, fixture và test. Nhãn Codex pre-review không phải academic approval.
- Người viết không được tự duyệt thay đổi học thuật của chính mình.
- Không cần tìm hoặc hoàn tất human academic review trước khi phê duyệt code hoặc Owner Alpha. Trước khi Public Preview cho bất kỳ người dùng nào ngoài chủ dự án, một human reviewer độc lập vẫn phải duyệt 100% cả 30 item và toàn bộ learner-facing English. Reviewer đạt IELTS Academic Overall 7.5 và Writing 7.0, hoặc có ít nhất hai năm kinh nghiệm giảng dạy/biên tập IELTS có thể xác minh; đây là chuẩn nội bộ, không phải yêu cầu chính thức của IELTS.
- Chủ dự án là người dùng đầu tiên trong Owner Alpha. Không yêu cầu cohort 3–5 người hoặc usability test bên ngoài trước Alpha; lỗi và phản hồi do chủ dự án gửi cho Codex được ghi, ưu tiên, sửa và retest tuần tự. Mở cho bất kỳ người dùng nào khác cần quyết định phát hành riêng.
- Finding Alpha dùng bốn mức: P0 mất dữ liệu/bảo mật/chấm sai phải contain và sửa ngay; P1 chặn luồng chính phải sửa trước Alpha release tiếp theo; P2 usability/content được xếp nhóm; P3 cosmetic xử lý khi thuận tiện. Chủ dự án chỉ cần mô tả tự nhiên, Codex chịu trách nhiệm lập record/reproduction/fix/retest.
- Practice content công khai dùng giấy phép CC BY-NC-SA 4.0.
- Mã nguồn công khai dùng MIT.
- Assessment bank, answer keys và exposure data nằm trong kho riêng/server riêng, không thuộc giấy phép nội dung công khai.
- Không sao chép đề IELTS ngẫu nhiên; chỉ dùng nội dung gốc hoặc nguồn có quyền tái sử dụng rõ ràng.
- Current-events content chỉ thu thập link/metadata từ allowlist vào hàng chờ biên tập; không scrape và không tự xuất bản.
- Machine translation chỉ được dùng ở authoring time; bản dịch phải được lưu và duyệt, không dịch runtime.
- Mỗi pack bất biến, có version, provenance, review status và rollback target.
- Lỗi nội dung làm attempt liên quan thành non-evidentiary, sau đó recompute mastery và thông báo người bị ảnh hưởng.

Mức khởi đầu mục tiêu: 12–15 learning nodes và khoảng 100–180 item đã duyệt; mở rộng 200–300 sau khi pipeline ổn định. Khối lượng không được đánh giá chỉ bằng số câu mà bằng độ phủ matrix, biến thể, bằng chứng đa dạng và tỷ lệ item đã duyệt.

## 9. Kiến trúc mục tiêu

### 9.1. Kiểu kiến trúc

- Modular monolith.
- Next.js, React và TypeScript.
- Supabase cho PostgreSQL, authentication và dữ liệu đồng bộ.
- Vercel cho web hosting/deployment.
- Domain logic thuần, không import React, browser API, Supabase hoặc framework module.
- UI không gọi Supabase trực tiếp; đi qua application ports/services.

### 9.2. Online-first và dữ liệu

Supabase là nguồn dữ liệu chính cho tài khoản. Không có IndexedDB primary store, sync outbox hoặc conflict merge offline.

- Attempt là append-only event, có UUID phía client và idempotency key.
- Mất mạng giữa câu: giữ đáp án hiện tại tạm thời, retry khi online, không tính lỗi kỹ thuật là sai và không mở câu mới khi offline.
- `sessionStorage` chỉ giữ current answer tối đa 30 phút. `localStorage` chỉ giữ guest state tối thiểu tối đa 24 giờ với TTL bắt buộc; không chứa PII, raw free-form answer, secret, audio, private answer key hoặc lịch sử tài khoản.
- Writing draft autosave lên server sau debounce; giữ 30 ngày từ lần sửa cuối và cảnh báo trước khi hết hạn.
- Một draft chỉ có một editor chủ động; thiết bị khác phải takeover rõ ràng.
- Bản đã submit là bất biến.
- Không lưu bí mật, audio hoặc assessment answer key trong client storage.

### 9.3. Dữ liệu và môi trường

- Dev, Preview và Production tách dữ liệu hoàn toàn.
- Owner Alpha dùng Supabase Preview riêng và không bao giờ trỏ tới Production. Khi mở Public Preview/Production, không clone hoặc copy toàn bộ Alpha database.
- Lịch sử Alpha mặc định ở lại Preview. Nếu chủ dự án muốn giữ, chỉ chuyển dữ liệu học đã hoàn thành qua export/import hoặc migration một lần có preview, consent, validation, idempotency, backup và audit; không chuyển session, secret, pending/guest data, test flags, operational logs hoặc dữ liệu lỗi.
- Dữ liệu Owner Alpha là dữ liệu thử nghiệm có cố gắng bảo toàn, không phải cam kết tương thích vĩnh viễn. Khi thay đổi schema/thuật toán lớn, ưu tiên migration hoặc rebuild projection; reset chỉ được thực hiện sau backup đã xác minh, impact report và xác nhận phá hủy riêng của chủ dự án. Quyền reset đặc biệt này không áp dụng cho Public/Production.
- RLS bắt buộc theo tài khoản/role.
- Private assessment items được phục vụ không kèm đáp án; có form rotation, exposure tracking và retirement.
- Backup mã hóa rolling 30 ngày; isolated restore phải đạt trước Public Preview, chạy hằng tháng trong ba tháng public đầu tiên rồi hằng quý; mục tiêu khôi phục backup ngày gần nhất trong 24 giờ.
- Khi Owner Alpha bắt đầu lưu tiến độ thật, backup logic mã hóa hằng ngày lên Cloudflare R2 cũng bắt đầu ngay, dùng project/prefix/credential scope riêng. Restore drill đầy đủ phải đạt trước Public Preview; job success đơn thuần không thay thế restore evidence.
- Migration tương thích ngược trong rollout; release có health check và auto rollback.

## 10. Quyền riêng tư và vòng đời dữ liệu

- Public Vertical Slice không có product/learning analytics event pipeline. Chỉ được tính aggregate cần thiết từ auth/attempt/evidence/review records vốn đã cần để cung cấp dịch vụ; không đưa raw answer vào báo cáo và phải trả `insufficient data` khi mẫu quá nhỏ. Broader-beta analytics chỉ được bật sau phê duyệt riêng, opt-in, dùng account ID hoặc guest session ID ngẫu nhiên, xóa sau 90 ngày và xóa liên kết khi rút consent.
- Error monitoring chỉ thu metadata thiết yếu, không session replay, giữ 30 ngày.
- Export tài khoản là ZIP gồm bản tóm tắt dễ đọc, CSV và JSON; link tải hết hạn sau 24 giờ.
- Xóa tài khoản: khóa ngay, cho khôi phục 30 ngày rồi xóa vĩnh viễn; bản backup hết vòng đời không quá 30 ngày tiếp theo.
- Tài khoản không hoạt động 24 tháng: cảnh báo trước 30 và 7 ngày rồi xóa/ẩn danh.
- Reset tiến độ theo kỹ năng hoặc toàn bộ: xác thực lại, ẩn ngay, hoàn tác trong 7 ngày rồi xóa; metadata exposure chỉ giữ đến khi xóa tài khoản.
- Thống kê đã tổng hợp không thể đảo ngược có thể được giữ nếu được công bố rõ.
- Chấp thuận Terms/Privacy theo version được lưu; thay đổi trọng yếu yêu cầu chấp thuận lại.
- Tạo tài khoản dùng hai ô riêng, đều bỏ chọn mặc định: (1) xác nhận từ 18 tuổi và cư trú tại Việt Nam; (2) đồng ý Điều khoản sử dụng và xác nhận đã đọc Thông báo quyền riêng tư. Không xác nhận thì vẫn có thể quay lại chơi khách.
- Vertical Slice dự kiến áp dụng pháp luật Việt Nam; khiếu nại ưu tiên liên hệ/thương lượng trực tuyến nhưng không áp đặt trọng tài bắt buộc hoặc hạn chế quyền dùng hòa giải, trọng tài hay Tòa án có thẩm quyền.
- Thay đổi Terms/Privacy trọng yếu được báo qua email và yêu cầu xem/chấp thuận lại ở lần đăng nhập tiếp theo. Từ chối chỉ giới hạn tài khoản ở quyền xem/export/delete, không chặn Guest Quick Start; thay đổi biên tập không đổi nghĩa chỉ ghi version history.
- Thay đổi chính sách trọng yếu có kế hoạch báo trước tối thiểu 7 ngày lịch. Chỉ sự cố bảo mật hoặc nghĩa vụ pháp lý mới cho phép hiệu lực ngay, với giải thích và audit phê duyệt bắt buộc.
- Terms và Privacy của Vertical Slice chỉ phát hành chính thức bằng tiếng Việt. Bản dịch tương lai cần review, đồng bộ phiên bản và quy tắc ưu tiên ngôn ngữ rõ ràng.
- Email nhắc học và email sản phẩm là hai consent riêng, mặc định tắt; email giao dịch/bảo mật không phụ thuộc marketing consent.

### 10.1. Cổng pháp lý chưa hoàn thành

Public Vertical Slice hiện giới hạn đăng ký tài khoản cho người tự xác nhận từ 18 tuổi và cư trú tại Việt Nam; không thu ngày sinh, vị trí chính xác hoặc bằng chứng địa chỉ. Policy này giảm phạm vi nhưng không thay thế legal review. Đây là **pre-public-release blocker**, không phải pre-code/Owner-Alpha blocker: operator/contact thật, quyền người tiêu dùng, consent, provider region/chuyển dữ liệu và nội dung giáo dục vẫn phải được review trước khi mở cho bất kỳ người dùng nào ngoài owner.

## 11. UX và nhận diện

- Tên sản phẩm: **Atlas English**; campaign: **Route to 6.5**.
- Companion: **Ato**, sinh vật la bàn nhỏ, trung tính, có vai trò trong truyện và chỉ xuất hiện khi giúp định hướng/onboarding/checkpoint/help; không hoạt động như mascot gây gián đoạn, không chen vào mọi câu hỏi và không tạo cảm giác tội lỗi.
- Màu navy/teal, điểm nhấn amber/coral; không mô phỏng nhận diện Duolingo.
- Light/dark theo hệ thống và toggle; WCAG AA; reduced motion; âm hiệu ứng mặc định tắt; learning audio tách riêng và không autoplay.
- Mobile bottom navigation: Trang chủ / Học / Tiến độ / Cá nhân.
- Tab Tiến độ vẫn hiện cho khách nhưng giải thích lợi ích đăng nhập.
- Hỗ trợ hai phiên bản mới nhất của Chrome, Edge và Safari; tính năng nâng cao phải có fallback.
- Chỉ landing và public content được index; tài khoản, kết quả, assessment và guest state phải `noindex`.

### 11.1. Cốt truyện học tập

Atlas English dùng bối cảnh đời thực có yếu tố bí ẩn nhẹ: người chơi là Navigator trong The Atlas Initiative, giải quyết các vấn đề giao tiếp và báo cáo bị mất ngữ cảnh. Cốt truyện phải dùng tiếng Anh thông dụng/chủ đề IELTS, gắn bài tập với hành động có ý nghĩa, có thể bỏ qua và không làm thay đổi mastery.

Kiến trúc dài hạn dùng các Campaign có kết thúc riêng, sau đó mở Field Cases, Atlas Dispatch, Expeditions và Campaign mới bằng Narrative Pack bất biến. Không kéo dài một bí ẩn vô tận, không sinh truyện runtime và không dùng nội dung biến mất/FOMO. MVP narrative vẫn giới hạn ở Prologue, Season 1 `Campus Connections`, một Expedition preview và các continuity ledgers tối thiểu; Campaign sau chỉ là khung, chưa được author toàn bộ. Đặc tả đầy đủ nằm tại `docs/NARRATIVE-DESIGN.md`.

## 12. Vận hành và phát hành

- Không cam kết uptime trong beta và không triển khai cảnh báo operator tự động ở giai đoạn đầu.
- Vẫn phải có health view/status, log tối thiểu, feature flags, circuit breakers, dashboard kiểm tra thủ công và runbook sự cố.
- Không dùng session replay.
- Vertical slice dùng dashboard kiểm tra thủ công cùng quota monitoring, rate limits và kill switches vì URL truy cập công khai. Khi quota/sự cố tăng: tạm dừng signup/email trước, sau đó import/history không thiết yếu; chỉ giữ guest core khi scoring/persistence an toàn, nếu không chuyển sang maintenance. Broader public beta vẫn cần rehearsal và provider quota email.
- Owner Alpha phát hành cho đúng một chủ dự án sau implementation approval và kiểm tra kỹ thuật tối thiểu. Public Preview chỉ mở sau quyết định riêng và các gate public tương ứng; không yêu cầu cohort 3–5 người cố định. Mọi release vẫn cần health check, rollback và migration tương thích ngược.
- Owner Alpha phải có environment-level access protection dùng được trên điện thoại và desktop. Ưu tiên protection của hosting nếu gói thực tế hỗ trợ; fallback là server-side Alpha gate có secret ngoài repo, rate limit và cookie phiên bảo mật. URL khó đoán không phải access control.
- Owner Alpha tự động triển khai bản sửa chỉ sau khi type/schema/test/secret checks bắt buộc đạt. Client phát hiện phiên bản mới nhưng không reload giữa câu hoặc submit; cập nhật ở checkpoint/safe stop gần nhất. P0 có thể kill-switch ngay phần không an toàn, giữ current answer nếu an toàn và hiển thị trạng thái bảo trì rõ ràng.
- Support tiếng Việt là chính; yêu cầu bảo mật/pháp lý bằng tiếng Anh được chấp nhận. Mục tiêu phản hồi thường 3 ngày làm việc; xác nhận security/data request trong 24 giờ.

## 13. Kiểm thử và tiêu chuẩn chất lượng

Mỗi thay đổi sau khi được phép code phải chạy kiểm tra tương ứng:

- type checking và unit tests cho domain/application;
- schema validation cho mọi content pack/fixture;
- integration tests cho auth, RLS, idempotency, lifecycle và backup/restore;
- end-to-end cho guest, đăng nhập, import guest result, learning loop, autosave, reconnect, export và deletion;
- accessibility audit và keyboard-only flow;
- mobile viewport review và browser matrix;
- kiểm tra không rò bí mật, key, audio, answer key hoặc PII trong log/client bundle;
- academic QA và calibration trước khi hiển thị band/readiness.

Các quality gate chi tiết nằm trong `docs/TESTING.md`, `docs/ACCEPTANCE-CRITERIA.md` và `docs/QUALITY-ATTRIBUTES.md`.

## 14. Lộ trình sau khi kế hoạch được phê duyệt

### Gate 0 — Phê duyệt kế hoạch

- Người dùng đổi trạng thái `PLAN.md` thành đúng `APPROVED — VERTICAL SLICE ONLY` bằng yêu cầu rõ ràng; các giai đoạn sau cần phê duyệt riêng.
- Chốt legal/privacy release blocker hoặc giới hạn phát hành tương ứng.

Approval record:

- approver: Project Owner;
- approved_at: 2026-09-21 (`Asia/Ho_Chi_Minh`);
- authorizing request: `bắt đầu code VS-01`;
- opened scope: chỉ `VS-01` trong `docs/VERTICAL-SLICE.md`;
- prohibited scope: `VS-02`–`VS-09`, Supabase, Vercel/deployment, gameplay, Beta MVP, Public Preview và Production cho đến các approval riêng tương ứng;
- accepted residual risks: GitHub authentication/remote chưa có, executable implementation checks chưa chạy, human academic/legal/provider/live-restore gates vẫn để đúng mốc sau;
- next-step rule: hoàn thành và báo cáo kiểm thử `VS-01`, sau đó dừng để xin phép mở riêng `VS-02`.

Subsequent step approvals:

- `VS-02`: Project Owner approved the named step after the VS-01 completion report on 2026-09-22; completed and verified separately.
- `VS-03`: Project Owner selected explicit option A after the VS-02 completion report on 2026-09-22; completed and verified separately.
- `VS-04`: Project Owner explicitly approved the named step on 2026-09-22; only one four-item temporary-data mission is open.
- `VS-04` completion: one four-item temporary-data mission was implemented and verified on 2026-09-22. `VS-05` is not open until a new explicit owner approval.
- `VS-05`: Project Owner explicitly approved the named step on 2026-09-22; only three local temporary-data missions, approximately 12 first-run items and the 30-item selection contract are open.
- `VS-05` completion: three local temporary-data missions, 12 first-run items and the 30-item selection contract were implemented and verified on 2026-09-22. `VS-06` is not open until a new explicit owner approval.
- `VS-06`: Project Owner explicitly approved the named step on 2026-09-22; only server acknowledgement, append-only attempts, request hashing, idempotent retry and persistence are open.
- `VS-06` completion: server acknowledgement, append-only guest attempts, server-computed request hashes, idempotent retry and Supabase persistence were implemented and verified on 2026-09-22. `VS-07` is not open until a new explicit owner approval.
- `VS-07`: Project Owner explicitly approved the named step on 2026-09-22; only guest TTL, account verification, explicit guest-import consent and account history are open.
- `VS-07` completion: the 24-hour guest binding, verified passwordless email account session, separately recorded eligibility/Terms/Privacy/import consent, append-only one-destination import receipt and account history were implemented and verified on 2026-09-22. `VS-08` is not open until a new explicit owner approval.

### Gate 1 — Hợp đồng triển khai

- ADR, database spec, RLS, lifecycle, schemas, content workflow và acceptance criteria thống nhất.
- Chọn region thực tế của nhà cung cấp và ghi rõ chuyển dữ liệu xuyên biên giới.

### Gate 2 — Vertical slice

- Chỉ được bắt đầu sau phê duyệt rõ `APPROVED — VERTICAL SLICE ONLY`.
- Guest Quick Start → mini-episode 3 mission → checkpoint.
- Account flow → import có consent → lịch sử online.
- Ba node Grammar/Vocabulary, 30 item theo blueprint, deterministic feedback, một review path và versioned content; human approval vẫn là pre-public-release gate.
- Không triển khai các mục đã liệt kê ngoài vertical slice ở mục 5.0.

### Gate 3 — MVP core

- Bốn khu vực luyện tập, learning engine, mistake book, roadmap, accessibility và responsive UX.
- Pronunciation fallback và Writing autosave/recovery.

### Gate 4 — Technical test và academic review

- Security/RLS/lifecycle/restore/release rehearsal.
- IELTS reviewer duyệt content, feedback claims và assessment language.

### Gate 5 — Open beta

- Đăng ký công khai; guest vẫn dùng được.
- Theo dõi activation, completion, return rate, learning evidence, lỗi kỹ thuật và content reports chỉ theo hợp đồng đo lường của từng giai đoạn. Public Vertical Slice không tuyên bố guest activation/return từ trạng thái trình duyệt ngắn hạn và không tự bật analytics event pipeline.
- Có emergency switch để dừng signup hoặc tính năng không thiết yếu.

### Gate 6 — Learning validation

- Đánh giá dữ liệu đủ dài để kiểm tra transfer và calibration.
- Chỉ nâng cấp claim/band/readiness khi bằng chứng đáp ứng framework.

### Gate 7 — Phát hành ổn định

- Hoàn thành legal/privacy gate, accessibility, restore drill và operational readiness.
- AI Coach nếu có phải đi qua một kế hoạch/phê duyệt riêng, không tự động đi cùng MVP.
- Calibrated LR band/private assessment bank production chỉ bắt đầu sau khi core learning loop đã được xác nhận; trước đó chỉ dùng raw practice result và external score log.

## 15. Definition of Done cho MVP

MVP chỉ hoàn thành khi:

- guest và account flow hoạt động đúng ranh giới dữ liệu;
- mỗi hoạt động được chia thành cụm ngắn và có safe stop;
- thuật toán mastery/review/feedback xác định, versioned và có test;
- pronunciation không vượt quá claim cho phép và không lưu audio;
- Writing/assessment không đưa ra band thiếu căn cứ;
- content đã schema-validate, academic-review và có provenance;
- RLS, auth abuse controls, export, deletion và retention được kiểm thử;
- website responsive, keyboard-usable, WCAG AA ở luồng chính;
- release, rollback, backup và restore rehearsal thành công;
- không có secret, API key, private answer key hoặc PII không cần thiết trong repo/log/client;
- tài liệu, changelog và status được cập nhật cùng thay đổi;
- mọi release blocker được đóng hoặc người dùng phê duyệt rõ giới hạn phát hành.

## 16. Quyết định đã chốt

Các quyết định chính của vòng lập kế hoạch hiện tại:

- Online-only responsive website, không app và không PWA/offline.
- Guest play công khai; đăng nhập chỉ bắt buộc cho lịch sử/mastery/assessment.
- Open self-service registration; không invite-only/allowlist/user cap.
- Supabase là nguồn dữ liệu chính; session storage chỉ để recovery ngắn.
- UI tiếng Việt, nội dung luyện tập tiếng Anh.
- Không runtime AI trong MVP; phản hồi bằng thuật toán riêng.
- Future Gemini AI là BYOK, text-only, client-held key, advisory-only.
- Không human expert account trong MVP.
- Core miễn phí, không quảng cáo.
- Public practice content và private assessment bank tách biệt.
- Microlearning tối đa 5 câu trước checkpoint.
- Pronunciation chỉ đánh giá tín hiệu đáng tin cậy, không Speaking band.
- Assessment claims theo evidence/calibration, không quảng bá “Full IELTS”.
- Không deadline tháng 2/2027; roadmap thích ứng theo dữ liệu và mục tiêu.
- Quyền code đầu tiên chỉ có thể là vertical slice theo ADR-016; không phê duyệt toàn MVP cùng lúc.
- Hint, recording/self-review pronunciation và open Writing submission không tạo mastery.
- Core MVP Speaking chỉ là pronunciation; fluency/Part 2/Part 3 được defer.

## 17. Điểm còn mở và release blocker

Không cần thêm quyết định sản phẩm trước khi duyệt kế hoạch, nhưng các mục sau phải được giải quyết ở đúng gate:

1. **Legal/privacy:** Vertical Slice account registration dùng 18+ self-declaration và không lưu ngày sinh; vẫn phải hoàn thiện điều khoản, privacy notice và chuyển dữ liệu quốc tế. Mọi hỗ trợ tài khoản người chưa thành niên cần legal/consent review riêng.
2. **Provider region:** xác minh region Supabase/Vercel thực tế trước triển khai production.
3. **Assessment calibration:** chưa được hiển thị band nếu chưa có item bank, review và dữ liệu calibration đủ.
4. **Operational cost:** chưa có cost dashboard tự động; trước public beta phải có provider quota email, rate limits, kill switch và kiểm thử signup pause/guest fallback.
5. **Future AI:** cần kế hoạch threat model, browser support, provider terms và evaluation riêng trước khi cho phép code.

## 18. Rủi ro chính

| Rủi ro | Mức | Ứng phó |
|---|---:|---|
| Claim IELTS vượt bằng chứng | Cao | Evidence gate, nhãn rõ, academic review |
| Nội dung ít hoặc lặp | Cao | Coverage matrix, controlled variants, monthly release |
| Rò assessment bank/key | Cao | Kho riêng, server-side delivery, exposure controls |
| Auth/signup abuse | Cao | Rate limit, generic response, one-use code, RLS |
| Phân tích pronunciation gây hiểu nhầm | Cao | Ba mức, confidence gate, no phoneme/band claim |
| Legal gate chưa có chuyên gia | Cao | Giữ release blocker, không tự tuyên bố tuân thủ |
| Mất mạng làm mất bài | Trung bình | Current-answer buffer, idempotent retry, draft autosave |
| Quota/cost không được cảnh báo | Trung bình–Cao | Circuit breaker, signup pause, manual dashboard |
| Scope creep AI | Trung bình | ADR-014, feature absent in MVP, phase approval riêng |

## 19. Tài liệu liên quan

Chỉ mục tài liệu nằm tại `docs/README.md`. Các ADR mới có hiệu lực:

- ADR-013: online-only, public guest và open registration;
- ADR-014: future Gemini BYOK AI Coach;
- ADR-015: public practice content và private assessment bank.
- ADR-016: vertical-slice-only first approval và learning evidence boundaries.

Các cổng chi tiết trước code nằm tại `docs/PRE-CODE-CHECKLIST.md`; phạm vi slice tại `docs/VERTICAL-SLICE.md`; evidence eligibility tại `docs/LEARNING-CONTRACT.md`.

## 20. Lịch sử cập nhật

- **2.0 — 2026-09-20:** hợp nhất quyết định cuối cùng; chuyển sang website online-only, public guest/open registration, Supabase-authoritative; bỏ PWA/offline/invite-only; thêm ranh giới AI BYOK tương lai và private assessment bank.
- **2.1 — 2026-09-20:** thu hẹp quyền triển khai đầu tiên thành vertical slice; chốt hint/recording không tạo mastery, Speaking MVP chỉ pronunciation, trì hoãn calibrated assessment/private bank production và bổ sung minimum quota controls trước public beta.
- **1.3 — 2026-09-19:** kế hoạch trước khi hợp nhất vòng quyết định; được lưu dấu qua changelog và các ADR lịch sử.
