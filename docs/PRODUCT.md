# Product specification

> Phạm vi cao nhất: `../PLAN.md`  
> Trạng thái: Draft — chưa cho phép code

Phạm vi triển khai đầu tiên được mô tả riêng tại `VERTICAL-SLICE.md`; các khả năng dài hạn trong tài liệu này không mặc nhiên thuộc lần build đầu tiên.

## Lời hứa sản phẩm

Atlas English giúp người Việt luyện nền tảng tiếng Anh phục vụ IELTS Academic bằng các phiên ngắn, phản hồi rõ và kế hoạch thích ứng. Website không phải khóa IELTS đầy đủ và không thay thế giáo viên/giám khảo.

## Người dùng và ngôn ngữ

- UI tiếng Việt; bài tập tiếng Anh; giải thích tiếng Việt tùy chọn.
- Dùng trên trình duyệt điện thoại, tablet và desktop; luôn cần Internet.
- Hỗ trợ hai bản mới nhất của Chrome, Edge và Safari với fallback cho tính năng nâng cao.

## Truy cập

### Khách

- Chơi Quick Start/core practice không cần đăng nhập.
- Chọn kỹ năng và mức Foundation / band 5 / band 6+.
- Trạng thái cục bộ hết hạn sau 24 giờ hoạt động gần nhất.
- Không có mastery, streak, roadmap, lịch sử dài hạn hoặc full assessment.
- Khi đăng nhập, hỏi consent trước khi import kết quả đã hoàn thành.

### Tài khoản

- Đăng ký công khai bằng email, magic link hoặc one-time code.
- Trong Public Vertical Slice Preview, người đăng ký phải tự xác nhận từ 18 tuổi và cư trú tại Việt Nam; không thu ngày sinh, vị trí chính xác hoặc bằng chứng địa chỉ. Minor accounts và phát hành quốc tế không thuộc phạm vi đã duyệt.
- Trước khi gửi email đăng ký, hai ô bỏ chọn mặc định là bắt buộc: age/residency attestation; Terms acceptance + Privacy acknowledgement. Không xác nhận không tạo pending account nhưng không chặn Guest Quick Start.
- Pending account chưa xác minh hoạt động như khách và bị xóa sau 24 giờ.
- Có lịch sử, mastery, streak, roadmap, assessment, export/delete/reset.

## Hành trình chính

1. Landing → `Chơi ngay` hoặc `Đăng nhập`.
2. Onboarding tối đa 5 câu; diagnostic là tùy chọn theo mô-đun 5 phút.
3. Home có một CTA chính `Học tiếp`.
4. Cụm học kéo dài 3–5 phút, tối đa 5 câu.
5. Checkpoint hiển thị tiến độ, một nhận xét hữu ích và lựa chọn tiếp tục/dừng.
6. Sau checkpoint đầu tiên, khách được mời đăng nhập bằng lời giải thích về lịch sử/tiến độ và consent import; từ chối không chặn chơi. Tài khoản nhận kế hoạch tiếp theo.

Story layer đặt các cluster trong The Atlas Initiative: người chơi dùng tiếng Anh để kiểm tra báo cáo, hiểu nhiều góc nhìn và sửa phần ngữ cảnh bị thiếu. Story có thể bỏ qua, không tạo failure vì câu sai và không thay đổi hợp đồng mastery. Xem `NARRATIVE-DESIGN.md`.

Sau khi hoàn thành một Campaign, người chơi mở vai trò và loại hồ sơ mới thay vì gặp màn hình “hết game”. Main Campaign có kết thúc thật; Field Cases, Dispatch và Expeditions duy trì luyện tập từ content pack đã duyệt, không dùng FOMO hoặc runtime generation.

## Khu vực học

- Grammar Lab: nhận diện → controlled production → contextual production.
- Vocabulary Forge: meaning, spelling, word form, collocation; ưu tiên review.
- Spelling Sprint: nghe/nhìn–gõ, phân loại lỗi và biến thể có kiểm soát.
- Pronunciation Studio: tín hiệu âm thanh cục bộ đáng tin cậy, ba mức, không Speaking band.
- Writing Practice: scaffold, autosave, mechanics feedback tối đa 3 nhóm ưu tiên; không Writing band.
- IELTS Transfer: Listening/Reading/Writing task ngắn, tách rõ practice và assessment.

## Hành vi học

- Practice phản hồi ngay; assessment phản hồi sau submit.
- Hint làm attempt practice-only.
- Sai lần đầu nhận hint; sai lần hai nhận đáp án/giải thích và vào review.
- Mistake book tự động, tối đa 5 focus đang hoạt động.
- Daily Quest là khuyến nghị, không là nghĩa vụ; không tạo “nợ”.
- Streak theo mục tiêu tuần, ngày nghỉ không phạt.
- XP giảm dần khi lặp và không khóa nội dung.

## Claims

- Mastery là bằng chứng kỹ năng, không phải band.
- Band L/R chỉ từ form timed đã hiệu chuẩn.
- Form chưa hiệu chuẩn chỉ cho raw score và nhãn thử nghiệm.
- Writing mechanics không phải Writing band.
- Pronunciation không phải Speaking band.
- Overall readiness thiếu bằng chứng phải ghi `Chưa đủ bằng chứng`.

## Dữ liệu và consent

- Public Vertical Slice không thu product-behavior analytics events; chỉ essential operational metadata theo retention đã công bố. Aggregate account metrics có thể được tính từ auth/attempt/evidence/review records vốn cần cho chức năng, không chứa raw answer và phải báo `insufficient data` khi mẫu quá nhỏ. Guest activation/return không được suy từ trạng thái trình duyệt ngắn hạn. Broader beta nếu được phê duyệt riêng mới có analytics opt-in. Consent email nhắc học và email sản phẩm luôn tách riêng, mặc định tắt.
- Guest được xem privacy notice ngắn ở lần chơi đầu.
- Account creation liên kết trực tiếp tới Terms và Privacy đầy đủ; không coi `Chơi ngay` là consent tài khoản.
- Vertical Slice publishes Vietnamese-only authoritative Terms and Privacy; no unreviewed machine/runtime translation is offered.
- Material Terms/Privacy changes trigger email plus blocking review at next account sign-in. Decline changes the account to export/delete-only while preserving Guest Quick Start; editorial-only changes use version history without reacceptance.
- Account có export ZIP, xóa với cửa sổ khôi phục 30 ngày, inactivity policy 24 tháng và reset có undo 7 ngày.
- Không session replay; audio không rời phiên.

## Ngoài phạm vi MVP

PWA/offline, native app, runtime AI, human expert account, social/leaderboard, payment/ads, full four-skill mock và mọi tuyên bố Overall band.

## AI tương lai

Không xuất hiện trong MVP. Nếu được phê duyệt riêng, Gemini BYOK chỉ là coach text/advisory theo ADR-014; không tác động mastery hoặc điểm.

## Thành công beta

Đo activation, tỷ lệ hoàn thành cluster, quay lại theo tuần, coverage/review health, technical failure, content report và learning evidence khi giai đoạn tương ứng có nguồn dữ liệu hợp lệ. Trong Public Vertical Slice, account metrics chỉ dùng aggregate từ records chức năng; guest activation/return dùng quan sát owner và phản hồi định tính tự nguyện, không được tuyên bố như analytics định lượng. Không tối ưu bằng cách kéo dài thời gian sử dụng hoặc gây áp lực streak.
