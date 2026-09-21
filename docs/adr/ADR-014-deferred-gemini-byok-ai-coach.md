# ADR-014: AI Coach Gemini BYOK được hoãn sang giai đoạn sau

- Trạng thái: Accepted — deferred, không phải quyền triển khai
- Ngày: 2026-09-20
- Liên quan: ADR-011 tiếp tục điều chỉnh MVP

## Bối cảnh

MVP đã chọn phản hồi xác định, không runtime generative AI. Sản phẩm có thể bổ sung AI Coach về sau nếu mỗi người dùng tự cung cấp Gemini API key.

## Quyết định

MVP vẫn không có runtime AI và không hiển thị AI Coach. Giai đoạn tương lai chỉ được đề xuất khi có phê duyệt riêng và phải tuân thủ:

1. BYOK; không có shared project key.
2. Key được mã hóa trong trình duyệt, mở khóa bằng mật khẩu cục bộ theo phiên; không sync, gửi backend, log hoặc export.
3. Chỉ gọi trực tiếp từ browser nếu SDK, điều khoản và CORS chính thức cho phép an toàn; nếu không thì không phát hành, không lách qua proxy làm server thấy key.
4. Chỉ text cho grammar, vocabulary, Writing practice và câu hỏi học tập; không gửi audio.
5. Người dùng xem chính xác dữ liệu sẽ gửi và chủ động xác nhận.
6. Chỉ gửi nội dung được chọn và rubric tối thiểu, không gửi toàn bộ lịch sử.
7. Gemini đi qua provider adapter; model nằm trong allowlist đã regression-test và pin/version.
8. Phản hồi gắn nhãn AI, có giới hạn/report và không thay đổi mastery, readiness, điểm hoặc hành động hệ thống.
9. Chat mặc định chỉ trong phiên. Người dùng có thể lưu phản hồi đã chọn cùng timestamp, model và prompt version.
10. Không log prompt/response phía server; lỗi kỹ thuật không chứa nội dung người học.
11. Có ước tính chi phí, usage cap, retry giới hạn, kill switch và core learning độc lập.

## Cổng phát hành riêng

- Threat model cho key, prompt injection, data exfiltration và provider outage.
- Xác minh hỗ trợ trình duyệt và điều khoản Gemini tại thời điểm triển khai.
- IELTS expert review, safety evaluation và regression suite.
- Privacy/Terms cập nhật và consent riêng.
- Phê duyệt rõ để chuyển AI Coach sang phạm vi triển khai.

## Hệ quả

ADR-011 vẫn là ranh giới MVP. Không tạo placeholder UI, dependency hoặc database cho AI chỉ vì ADR này tồn tại.
