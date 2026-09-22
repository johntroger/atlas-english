import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="policy-shell">
      <article className="policy-card">
        <p className="route-label">privacy-2026-09-22-v1 · Bản thử nghiệm nội bộ</p>
        <h1>Thông báo quyền riêng tư</h1>
        <p>
          Atlas English cần Internet để hoạt động. Bạn có thể chơi không cần tài khoản; khi đó, một
          mã khách ngẫu nhiên gắn với trình duyệt được giữ tối đa 24 giờ để hoàn thành phiên hoặc tự
          chọn nhập các kết quả còn hiệu lực sau khi xác thực email.
        </p>
        <h2>Dữ liệu và mục đích</h2>
        <p>
          Tài khoản xác thực dùng email, ngôn ngữ/múi giờ, lượt làm đã hoàn thành và các sự kiện
          đồng ý theo phiên bản chính sách để vận hành lịch sử học. Chúng tôi không thu ngày sinh,
          vị trí chính xác, audio phát âm thô, dữ liệu quảng cáo hay khóa AI trong Vertical Slice.
        </p>
        <p>
          Dữ liệu khách hết hạn sau 24 giờ. Lịch sử tài khoản được giữ cho đến khi luồng xóa hoặc
          chính sách lưu giữ tương ứng được phát hành. Bạn có thể từ chối tạo tài khoản và tiếp tục
          chơi với tư cách khách.
        </p>
        <h2>Phạm vi và tình trạng</h2>
        <p>
          Bản Preview này chỉ hướng tới người từ 18 tuổi, tự xác nhận đang cư trú tại Việt Nam. Đây
          là thông báo dự thảo cho Owner Alpha, chưa phải cam kết phát hành công khai: tên bên vận
          hành, email hỗ trợ, khu vực nhà cung cấp và legal review vẫn là điều kiện phát hành.
        </p>
        <p>
          <Link href="/login">Quay lại đăng nhập</Link>
        </p>
      </article>
    </main>
  );
}
