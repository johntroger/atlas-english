"use client";

import { useEffect, useState } from "react";

type Attempt = Readonly<{
  id: string;
  item_id: string;
  submitted_at: string;
  server_outcome: Readonly<{ isCorrect?: boolean; practiceOnly?: boolean }>;
  hint_count: number;
}>;

export function HistoryPanel() {
  const [attempts, setAttempts] = useState<Attempt[] | undefined>();
  const [previewCount, setPreviewCount] = useState<number>();
  const [error, setError] = useState<string>();
  const [importing, setImporting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    void Promise.all([fetch("/api/account/history"), fetch("/api/guest-import/preview")])
      .then(async ([historyResponse, previewResponse]) => {
        if (historyResponse.status === 401) {
          setError("Vui lòng xác thực email trước khi xem lịch sử.");
          return;
        }
        if (!historyResponse.ok) throw new Error("History unavailable");
        const history = (await historyResponse.json()) as { attempts: Attempt[] };
        setAttempts(history.attempts);
        if (previewResponse.ok) {
          const preview = (await previewResponse.json()) as { available: boolean; count: number };
          setPreviewCount(preview.available ? preview.count : 0);
        }
      })
      .catch(() => setError("Chưa thể tải lịch sử. Vui lòng thử lại sau."));
  }, []);

  async function importGuestHistory() {
    setImporting(true);
    setError(undefined);
    try {
      const response = await fetch("/api/guest-import", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ consent: true, idempotencyKey: crypto.randomUUID() }),
      });
      if (!response.ok) throw new Error("Import unavailable");
      const historyResponse = await fetch("/api/account/history");
      if (!historyResponse.ok) throw new Error("History unavailable");
      const history = (await historyResponse.json()) as { attempts: Attempt[] };
      setAttempts(history.attempts);
      setPreviewCount(0);
    } catch {
      setError("Chưa thể nhập lịch sử khách. Không có lượt làm nào bị thay đổi.");
    } finally {
      setImporting(false);
    }
  }

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
    } finally {
      window.location.replace("/");
    }
  }

  return (
    <section className="account-card history-card" aria-labelledby="history-title">
      <p className="route-label">Lịch sử tài khoản</p>
      <h1 id="history-title">Các lượt luyện tập đã lưu</h1>
      <button className="details-toggle" disabled={signingOut} onClick={signOut} type="button">
        {signingOut ? "Đang đăng xuất…" : "Đăng xuất"}
      </button>
      {previewCount && previewCount > 0 ? (
        <aside className="import-preview">
          <p>
            Tìm thấy <strong>{previewCount}</strong> lượt khách còn hiệu lực. Bạn có muốn nhập vào
            lịch sử tài khoản không?
          </p>
          <button
            className="button-secondary"
            disabled={importing}
            onClick={importGuestHistory}
            type="button"
          >
            {importing ? "Đang nhập…" : "Đồng ý nhập lịch sử khách"}
          </button>
        </aside>
      ) : null}
      {error ? (
        <p className="submit-error" role="alert">
          {error}
        </p>
      ) : null}
      {!error && !attempts ? <p>Đang tải lịch sử…</p> : null}
      {attempts?.length === 0 ? <p>Chưa có lượt làm nào được lưu trong tài khoản này.</p> : null}
      {attempts && attempts.length > 0 ? (
        <ol className="history-list">
          {attempts.map((attempt) => (
            <li key={attempt.id}>
              <span className="history-status">
                {attempt.server_outcome.isCorrect ? "Đúng" : "Đã luyện"}
              </span>
              <strong>{attempt.item_id}</strong>
              <time dateTime={attempt.submitted_at}>
                {new Intl.DateTimeFormat("vi-VN", {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(new Date(attempt.submitted_at))}
              </time>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
