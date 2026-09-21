# Thông báo quyền riêng tư — Public Vertical Slice

> Trạng thái: **DRAFT — cần chủ dự án và chuyên gia pháp lý rà soát trước khi phát hành công khai**  
> Phạm vi: Public Vertical Slice Preview, dự kiến ban đầu dưới 10 người dùng

Tài liệu này là nguồn nội dung cho thông báo quyền riêng tư hiển thị trong sản phẩm. Nó mô tả đúng phạm vi Vertical Slice đã chọn, nhưng không phải là kết luận rằng sản phẩm đã đáp ứng pháp luật tại mọi quốc gia.

Bản tiếng Việt là bản chính thức duy nhất của thông báo trong Vertical Slice. Chưa phát hành bản dịch tiếng Anh. Bản dịch tương lai phải được rà soát, đồng bộ mã phiên bản/ngày hiệu lực và nêu rõ bản tiếng Việt được ưu tiên khi có khác biệt, trừ khi pháp luật áp dụng yêu cầu khác.

Preview ban đầu chỉ hướng tới người từ 18 tuổi đang cư trú tại Việt Nam. Website không thu vị trí chính xác hoặc dùng địa chỉ IP để chặn địa lý, và Preview không được chủ động quảng bá ra ngoài Việt Nam. Việc mở rộng sang quốc gia khác cần rà soát privacy/legal, nhà cung cấp và chuyển dữ liệu trước khi thay đổi phạm vi công bố.

## Lớp 1 — thông báo ngắn trước Quick Start

### Quyền riêng tư, nói ngắn gọn

Atlas English cần Internet để hoạt động. Khi bạn chơi mà không đăng nhập, chúng tôi dùng một mã khách ngẫu nhiên và giữ tiến trình tối thiểu trong bộ nhớ trình duyệt của thiết bị này tối đa 24 giờ để bạn hoàn thành phiên hoặc nhập kết quả nếu đăng nhập. Dữ liệu này tự hết hạn, không gồm email, nội dung Writing tự do, audio hoặc lịch sử tài khoản. Metadata lỗi kỹ thuật cần thiết có thể được giữ tối đa 30 ngày. Vertical Slice không dùng phân tích hành vi, quảng cáo hoặc ghi lại phiên thao tác.

Bạn có thể chơi ngay mà không cần tạo tài khoản. Tạo tài khoản là tùy chọn, chỉ dành cho người tự xác nhận từ 18 tuổi và giúp lưu lịch sử lâu dài.

Hành động hiển thị:

- `Tìm hiểu chi tiết`
- `Chơi ngay`

## Lớp 2 — trang thông tin chi tiết

### Ai vận hành Atlas English

Trước khi có pháp nhân riêng, Atlas English sẽ công bố tên thật của chủ dự án với vai trò bên vận hành dữ liệu. Tên cụ thể phải được chủ dự án xác nhận trước khi phát hành: `[OPERATOR_LEGAL_NAME]`.

Kênh liên hệ là một hộp thư riêng của dự án dùng cho cả quyền riêng tư và hỗ trợ; email cá nhân của chủ dự án không được công khai. Nếu sau này pháp nhân tiếp quản vai trò vận hành, thay đổi đó phải được ghi thành phiên bản chính sách mới và thông báo theo mức độ trọng yếu.

### Dữ liệu được xử lý

**Khi chơi với tư cách khách:** mã khách ngẫu nhiên; tham chiếu kết quả đã hoàn thành; phiên bản nội dung và thuật toán; trạng thái câu chuyện tối thiểu; trạng thái đồng ý nhập kết quả; metadata kỹ thuật cần thiết. Trạng thái tối thiểu trên thiết bị hết hạn sau tối đa 24 giờ kể từ hoạt động gần nhất; raw free-form answer không được giữ trong guest storage 24 giờ.

**Khi có tài khoản:** email; xác nhận từ 18 tuổi; ngôn ngữ, múi giờ và tùy chọn; các lần làm bài đã hoàn thành; tiến độ mastery/practice; lịch ôn; tiến độ câu chuyện/phần thưởng; và sự kiện đồng ý theo phiên bản chính sách. Vertical Slice không thu ngày sinh.

**Không thu trong Vertical Slice:** audio phát âm thô; phân tích hành vi; bản ghi phiên thao tác; hồ sơ quảng cáo; danh bạ; vị trí chính xác; dữ liệu thanh toán; câu trả lời assessment riêng tư; hoặc khóa API AI.

### Mục đích sử dụng

- vận hành Quick Start, tài khoản và lịch sử học;
- chấm điểm theo thuật toán xác định, ngăn gửi trùng và tạo lịch ôn;
- bảo vệ dịch vụ, chẩn đoán lỗi và quản lý hạn mức;
- thực hiện yêu cầu xuất, đặt lại hoặc xóa dữ liệu khi các luồng tương ứng được phát hành.

Atlas English không bán dữ liệu và không dùng dữ liệu học tập cho quảng cáo.

Vertical Slice không tạo một luồng sự kiện phân tích hành vi riêng. Hệ thống có thể tính thống kê tổng hợp từ các bản ghi tài khoản, lần làm bài và lịch ôn vốn cần để cung cấp chức năng; báo cáo không chứa câu trả lời thô và không công bố tỷ lệ khi số người quá ít để bảo vệ riêng tư.

### Nhà cung cấp dự kiến

- **Vercel:** lưu trữ và phân phối website;
- **Supabase:** xác thực và cơ sở dữ liệu PostgreSQL;
- **Cloudflare R2:** chỉ lưu bản sao lưu logic của cơ sở dữ liệu đã được mã hóa trước khi tải lên;
- **GitHub Actions:** chạy tác vụ sao lưu bằng kho bí mật; kho mã nguồn công khai không chứa dữ liệu người học hoặc bản sao lưu đã giải mã.

Khu vực xử lý dữ liệu, nội dung chuyển dữ liệu xuyên biên giới và liên kết chính sách của từng nhà cung cấp phải được xác minh trước khi phát hành.

### Thời hạn lưu giữ

- trạng thái khách và tài khoản chờ xác minh: tối đa 24 giờ theo hợp đồng dữ liệu hiện hành;
- khôi phục câu trả lời đang làm: tối đa 30 phút;
- metadata kỹ thuật thiết yếu: 30 ngày;
- bản sao lưu logic đã mã hóa: thời hạn cuốn chiếu 30 ngày;
- lịch sử học của tài khoản đã xác minh: cho đến khi áp dụng yêu cầu đặt lại, xóa hoặc chính sách không hoạt động;
- khi xóa tài khoản: khóa ngay, cho phép khôi phục trong 30 ngày, sau đó xóa vĩnh viễn; dữ liệu trong bản sao lưu có thể cần tối đa thêm 30 ngày để tự hết vòng đời.

### Lựa chọn và quyền của người dùng

Người dùng có thể chơi với tư cách khách mà không đăng nhập. Việc nhập kết quả khách vào tài khoản cần một sự đồng ý riêng. Tài khoản có quyền truy cập/xuất dữ liệu, sửa tùy chọn, đặt lại tiến độ và yêu cầu xóa theo phạm vi tính năng đã phát hành. Yêu cầu nhạy cảm cần xác thực lại và phải có kênh liên hệ đã công bố.

### Bảo mật và giới hạn

Dữ liệu được bảo vệ bằng HTTPS, Row Level Security, quyền tối thiểu, giới hạn tần suất và bản sao lưu ngoài hệ thống đã mã hóa. Không có hệ thống nào an toàn tuyệt đối; sự cố ảnh hưởng người dùng phải được điều tra và thông báo theo nghĩa vụ pháp lý áp dụng.

### Độ tuổi

Đăng ký tài khoản trong Vertical Slice chỉ dành cho người tự xác nhận từ 18 tuổi và đang cư trú tại Việt Nam. Sản phẩm không lưu ngày sinh, vị trí chính xác hoặc bằng chứng địa chỉ; chưa hỗ trợ tài khoản người chưa thành niên, cơ chế đồng ý của phụ huynh hoặc phát hành có chủ đích ngoài Việt Nam.

### Liên hệ

Email dự án: `[PROJECT_PRIVACY_EMAIL — bắt buộc tạo, kiểm tra nhận thư và điền trước khi phát hành công khai]`

Trong giai đoạn đầu, hộp thư này có thể dùng nhà cung cấp email phổ thông; custom domain không phải điều kiện phát hành Vertical Slice. Nếu đổi địa chỉ sau này, phải cập nhật thông báo, luồng hỗ trợ và kiểm thử liên kết liên hệ trong cùng một bản phát hành.

## Tiêu chí chấp nhận

- Lớp 1 xuất hiện trước khi xử lý dữ liệu khách ngoài phần tải trang thật sự cần thiết.
- `Tìm hiểu chi tiết` mở Lớp 2; `Chơi ngay` không bị diễn giải thành đồng ý tạo tài khoản.
- Luồng tạo tài khoản có xác nhận từ 18 tuổi và liên kết tới Lớp 2.
- Luồng tạo tài khoản thể hiện rõ Preview dành cho người cư trú tại Việt Nam mà không yêu cầu vị trí chính xác hoặc quyền geolocation.
- Hai ô account eligibility và Terms/Privacy đều bỏ chọn mặc định; Privacy được ghi nhận là đã đọc, không bị mô tả sai thành sự đồng ý cho mọi hoạt động xử lý.
- Nội dung hiển thị khớp schema, thời hạn và nhà cung cấp thực tế; placeholder hoặc tuyên bố chưa xác minh sẽ chặn phát hành công khai.
- Chính sách có phiên bản; thay đổi trọng yếu phải thông báo và yêu cầu đồng ý lại khi cần.
- Thay đổi Privacy trọng yếu được gửi qua email và hiển thị ở lần đăng nhập tiếp theo; người không xác nhận vẫn được truy cập export/delete và Guest Quick Start nhưng không tiếp tục hoạt động mới trong tài khoản.
- Thay đổi trọng yếu đã lên kế hoạch được báo trước ít nhất 7 ngày lịch. Thay đổi tức thời chỉ dành cho nhu cầu bảo mật hoặc nghĩa vụ pháp lý, phải giải thích và lưu dấu vết phê duyệt.

## Phiên bản

- Mã bất biến có dạng `privacy-YYYY-MM-DD-vN`, ví dụ `privacy-2026-09-20-v1`.
- Mỗi phiên bản lưu `announced_at`, `effective_at`, loại thay đổi và tóm tắt; timestamp lưu UTC và hiển thị theo `Asia/Ho_Chi_Minh`.
- Không sửa đè bản đã phát hành. Sửa nhỏ vẫn tạo phiên bản mới nhưng không tự động trở thành thay đổi trọng yếu.

## Việc còn phải xác minh trước phát hành

- tên thật đã được chủ dự án xác nhận và địa chỉ hộp thư dự án thực tế;
- khu vực Vercel, Supabase và Cloudflare R2 thực tế;
- liên kết chính sách của từng nhà cung cấp và cách mô tả chuyển dữ liệu xuyên biên giới;
- căn cứ pháp lý, quyền người dùng và nghĩa vụ thông báo phù hợp với nhóm quốc gia phục vụ;
- cách xử lý truy cập ngoài ý muốn từ ngoài Việt Nam mà không bổ sung theo dõi vị trí;
- sự khớp nhau giữa thông báo này, Terms, schema, cấu hình lưu giữ và hành vi đã kiểm thử.
