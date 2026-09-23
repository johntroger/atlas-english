"use client";

import { useState } from "react";

export function AlphaAccessForm() {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState(false);
  async function submit() {
    setError(false);
    const response = await fetch("/api/alpha-access", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    if (!response.ok) return setError(true);
    window.location.assign("/");
  }
  return (
    <main className="access-shell">
      <section className="access-card" aria-labelledby="alpha-title">
        <p className="route-label">Atlas English · Owner Alpha</p>
        <h1 id="alpha-title">Khu vực thử nghiệm riêng</h1>
        <p>Nhập mã truy cập của chủ dự án để tiếp tục.</p>
        <label htmlFor="alpha-secret">Mã truy cập</label>
        <input
          id="alpha-secret"
          type="password"
          autoComplete="current-password"
          value={secret}
          onChange={(event) => setSecret(event.target.value)}
        />
        <button className="button-primary" type="button" onClick={() => void submit()}>
          Mở môi trường Alpha
        </button>
        {error ? (
          <p className="submit-error" role="alert">
            Không thể xác minh mã. Vui lòng thử lại.
          </p>
        ) : null}
      </section>
    </main>
  );
}
