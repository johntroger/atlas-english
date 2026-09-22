"use client";

import { useEffect, useState } from "react";

export default function AuthCallbackPage() {
  const [error, setError] = useState(false);

  useEffect(() => {
    const accessToken = new URLSearchParams(window.location.hash.slice(1)).get("access_token");
    if (!accessToken) {
      setError(true);
      return;
    }
    void fetch("/api/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ accessToken }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Could not create account session.");
        window.location.replace("/history");
      })
      .catch(() => setError(true));
  }, []);

  return (
    <main className="account-shell">
      <section className="account-card">
        <h1>{error ? "Không thể xác thực liên kết" : "Đang xác thực email…"}</h1>
        <p>
          {error
            ? "Liên kết có thể đã hết hạn hoặc đã được dùng. Hãy quay lại và yêu cầu một liên kết mới."
            : "Bạn sẽ được chuyển đến lịch sử tài khoản ngay sau khi xác thực xong."}
        </p>
      </section>
    </main>
  );
}
