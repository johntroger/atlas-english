import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="policy-shell">
      <article className="policy-card">
        <p className="route-label">terms-2026-09-22-v1 · Bản thử nghiệm nội bộ</p>
        <h1>Điều khoản sử dụng</h1>
        <p>
          Atlas English là công cụ luyện tập bổ trợ cho IELTS Academic. Website không thay thế giáo
          viên hoặc giám khảo, không bảo đảm band điểm và không hiển thị Overall IELTS band khi chưa
          có bằng chứng đã hiệu chuẩn.
        </p>
        <h2>Tài khoản và cách dùng</h2>
        <p>
          Bạn có thể chơi Quick Start không cần tài khoản. Đăng ký chỉ dành cho người tự xác nhận từ
          18 tuổi và đang cư trú tại Việt Nam; bạn cần kiểm soát email dùng để nhận liên kết đăng
          nhập. Không dùng dịch vụ để dò tài khoản, vượt kiểm soát truy cập, lấy bí mật/đáp án hoặc
          làm gián đoạn hệ thống.
        </p>
        <h2>Trạng thái Preview</h2>
        <p>
          Đây là bản thử nghiệm có thể thay đổi hoặc gián đoạn. Điều khoản đang là dự thảo cho Owner
          Alpha; thông tin bên vận hành, kênh liên hệ và legal review phải hoàn tất trước bất kỳ
          phát hành công khai nào.
        </p>
        <p>
          <Link href="/login">Quay lại đăng nhập</Link>
        </p>
      </article>
    </main>
  );
}
