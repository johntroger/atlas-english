import { MiniEpisode } from "@/ui/mission/MiniEpisode";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <nav aria-label="Tài khoản" className="account-nav">
        <Link href="/history">Lịch sử</Link>
        <Link href="/login">Đăng nhập</Link>
      </nav>
      <MiniEpisode />
    </>
  );
}
