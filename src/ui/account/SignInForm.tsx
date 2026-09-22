"use client";

import { useState } from "react";
import Link from "next/link";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [ageResidencyAttested, setAgeResidencyAttested] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [diagnostic, setDiagnostic] = useState<string>();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setDiagnostic(undefined);
    try {
      const response = await fetch("/api/auth/request-link", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, ageResidencyAttested, termsAccepted, privacyAcknowledged }),
      });
      const payload = (await response.json()) as { diagnostic?: unknown };
      if (!response.ok) {
        setDiagnostic(typeof payload.diagnostic === "string" ? payload.diagnostic : undefined);
        throw new Error("Could not request a sign-in link.");
      }
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <section className="account-card" aria-labelledby="email-sent-title">
        <p className="route-label">Liên kết xác thực đã được gửi</p>
        <h1 id="email-sent-title">Kiểm tra hộp thư của bạn</h1>
        <p>
          Mở liên kết trong email để xác thực. Lịch sử luyện tập của khách chỉ có thể nhập trong
          vòng 24 giờ kể từ khi bắt đầu.
        </p>
      </section>
    );
  }

  return (
    <section className="account-card" aria-labelledby="sign-in-title">
      <p className="route-label">Lưu lịch sử của bạn</p>
      <h1 id="sign-in-title">Đăng nhập bằng email</h1>
      <p>
        Bạn vẫn có thể chơi không cần tài khoản. Khi xác thực email, bạn có thể xem lại lịch sử và
        chọn nhập các lượt khách còn hiệu lực.
      </p>
      <form className="sign-in-form" onSubmit={submit}>
        <label htmlFor="email">
          Email
          <input
            autoComplete="email"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>
        <label className="consent-check">
          <input
            checked={ageResidencyAttested}
            onChange={(event) => setAgeResidencyAttested(event.target.checked)}
            type="checkbox"
          />
          <span>Tôi từ 18 tuổi trở lên và hiện cư trú tại Việt Nam.</span>
        </label>
        <label className="consent-check">
          <input
            checked={termsAccepted}
            onChange={(event) => setTermsAccepted(event.target.checked)}
            type="checkbox"
          />
          <span>
            Tôi đồng ý với <Link href="/terms">Điều khoản sử dụng</Link> của bản thử nghiệm.
          </span>
        </label>
        <label className="consent-check">
          <input
            checked={privacyAcknowledged}
            onChange={(event) => setPrivacyAcknowledged(event.target.checked)}
            type="checkbox"
          />
          <span>
            Tôi đã đọc <Link href="/privacy">Thông báo quyền riêng tư</Link>.
          </span>
        </label>
        <button
          className="button-primary"
          disabled={
            state === "sending" || !ageResidencyAttested || !termsAccepted || !privacyAcknowledged
          }
          type="submit"
        >
          {state === "sending" ? "Đang gửi…" : "Gửi liên kết đăng nhập"}
        </button>
        {state === "error" ? (
          <p className="submit-error" role="alert">
            Chưa thể gửi liên kết. Vui lòng kiểm tra lại kết nối và thử lại.
            {diagnostic ? ` Mã kiểm tra: ${diagnostic}.` : null}
          </p>
        ) : null}
      </form>
    </section>
  );
}
