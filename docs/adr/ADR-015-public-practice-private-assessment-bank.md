# ADR-015: Tách practice content công khai khỏi assessment bank riêng tư

- Trạng thái: Accepted
- Ngày: 2026-09-20

## Bối cảnh

Practice content cần minh bạch và dễ đóng góp, trong khi assessment item, đáp án và exposure history phải được bảo vệ để giữ giá trị đo lường.

## Quyết định

1. Mã nguồn công khai theo MIT.
2. Practice content công khai theo CC BY-NC-SA 4.0, kèm provenance và contributor rights declaration.
3. Assessment bank, answer keys, calibration data và exposure history nằm trong kho riêng và storage server-side, “all rights reserved” hoặc theo thỏa thuận contributor riêng.
4. Client chỉ nhận dữ liệu cần để làm item; không nhận answer key trước khi đủ điều kiện hiển thị phản hồi.
5. Assessment có nhiều form, rotation, exposure threshold và retirement.
6. Tác giả không tự phê duyệt thay đổi học thuật của chính mình.
7. Không upload private bank lên dịch vụ kiểm tra tương đồng bên ngoài nếu chưa có thỏa thuận bảo mật.
8. Form chưa đủ review/calibration chỉ hiển thị raw result và nhãn thử nghiệm, không band/readiness.

## Hệ quả

- Repository công khai không phải nguồn đầy đủ để dựng production assessment.
- CI/release cần hai pipeline và quyền truy cập tách biệt.
- Export không bao gồm answer key, private item bank hoặc exposure logic nhạy cảm.
- Nội dung lỗi phải được retire/version, đánh dấu attempt liên quan non-evidentiary và recompute theo quy trình.
