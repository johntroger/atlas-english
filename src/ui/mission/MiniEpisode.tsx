"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";

import {
  FIRST_RUN_MISSIONS,
  initialResponse,
  isResponseComplete,
  type MissionResponse,
} from "@/domain/vertical-slice/mission-catalog";
import type { AttemptCommand, AttemptReceipt } from "@/application/attempts/submit-attempt";

type Screen = "intro" | "question" | "feedback" | "checkpoint" | "safe_stopped";
type Checkpoint = Readonly<{
  state: "interim_ready" | "final_first_completion" | "final_replay";
  updatePending: boolean;
  guest: boolean;
}>;
type Recovery = Readonly<{
  missionIndex: number;
  questionIndex: number;
  response: Exclude<MissionResponse, string>;
  hintUsed: boolean;
  expiresAt: number;
}>;
const RECOVERY_KEY = "atlas_current_choice_v1";
const RECOVERY_TTL = 30 * 60 * 1000;

export function MiniEpisode() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [missionIndex, setMissionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [response, setResponse] = useState<MissionResponse>(() =>
    initialResponse(FIRST_RUN_MISSIONS[0].questions[0]),
  );
  const [hintUsed, setHintUsed] = useState(false);
  const [showHintWarning, setShowHintWarning] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [reorderTouched, setReorderTouched] = useState(false);
  const [receipt, setReceipt] = useState<AttemptReceipt>();
  const [pendingCommand, setPendingCommand] = useState<AttemptCommand>();
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "error">("idle");
  const feedbackHeading = useRef<HTMLHeadingElement>(null);
  const checkpointHeading = useRef<HTMLHeadingElement>(null);
  const hintDialog = useRef<HTMLElement>(null);
  const hintTrigger = useRef<HTMLButtonElement>(null);
  const checkpointKey = useRef<string | undefined>(undefined);
  const [checkpoint, setCheckpoint] = useState<Checkpoint>();
  const [checkpointError, setCheckpointError] = useState(false);
  const [online, setOnline] = useState(true);
  const [recovery, setRecovery] = useState<Recovery>();

  const mission = FIRST_RUN_MISSIONS[missionIndex];
  const question = mission.questions[questionIndex];
  const outcome = screen === "feedback" ? receipt?.outcome : undefined;
  const responseIsComplete =
    isResponseComplete(question, response) && (question.type !== "reorder" || reorderTouched);

  useEffect(() => {
    if (screen === "feedback") feedbackHeading.current?.focus();
  }, [screen]);

  useEffect(() => {
    if (screen === "checkpoint" || screen === "safe_stopped") checkpointHeading.current?.focus();
  }, [screen]);

  useEffect(() => {
    if (showHintWarning) hintDialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [showHintWarning]);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(RECOVERY_KEY) ?? "null") as Recovery | null;
      if (
        saved &&
        saved.expiresAt > Date.now() &&
        Number.isInteger(saved.missionIndex) &&
        Number.isInteger(saved.questionIndex) &&
        Array.isArray(saved.response)
      )
        setRecovery(saved);
      else sessionStorage.removeItem(RECOVERY_KEY);
    } catch {
      sessionStorage.removeItem(RECOVERY_KEY);
    }
  }, []);

  useEffect(() => {
    if (screen !== "question" || typeof response === "string") return;
    sessionStorage.setItem(
      RECOVERY_KEY,
      JSON.stringify({
        missionIndex,
        questionIndex,
        response,
        hintUsed,
        expiresAt: Date.now() + RECOVERY_TTL,
      }),
    );
  }, [screen, missionIndex, questionIndex, response, hintUsed]);

  function startMission(index: number) {
    sessionStorage.removeItem(RECOVERY_KEY);
    setRecovery(undefined);
    const firstQuestion = FIRST_RUN_MISSIONS[index].questions[0];
    setMissionIndex(index);
    setQuestionIndex(0);
    setResponse(initialResponse(firstQuestion));
    setHintUsed(false);
    setDetailsOpen(false);
    setReorderTouched(false);
    setReceipt(undefined);
    setPendingCommand(undefined);
    setSubmitState("idle");
    setScreen("question");
  }

  function resumeRecovery() {
    if (!recovery) return;
    setMissionIndex(recovery.missionIndex);
    setQuestionIndex(recovery.questionIndex);
    setResponse(recovery.response);
    setHintUsed(recovery.hintUsed);
    setReorderTouched(Array.isArray(recovery.response));
    setScreen("question");
  }

  async function submitAnswer() {
    if (!responseIsComplete || submitState === "submitting" || !online) return;
    const command = pendingCommand ?? {
      attemptId: crypto.randomUUID(),
      idempotencyKey: crypto.randomUUID(),
      itemId: question.id,
      response,
      hintUsed,
    };
    setPendingCommand(command);
    setSubmitState("submitting");
    try {
      const result = await fetch("/api/attempts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(command),
      });
      const payload = (await result.json()) as { receipt?: AttemptReceipt };
      if (!result.ok || !payload.receipt) throw new Error("Attempt acknowledgement failed");
      setReceipt(payload.receipt);
      sessionStorage.removeItem(RECOVERY_KEY);
      setPendingCommand(undefined);
      setSubmitState("idle");
      setScreen("feedback");
    } catch {
      setSubmitState("error");
    }
  }

  function nextQuestion() {
    if (questionIndex < mission.questions.length - 1) {
      const nextQuestion = mission.questions[questionIndex + 1];
      setQuestionIndex((index) => index + 1);
      setResponse(initialResponse(nextQuestion));
      setHintUsed(false);
      setDetailsOpen(false);
      setReorderTouched(false);
      setScreen("question");
      return;
    }
    void openCheckpoint();
  }

  async function openCheckpoint() {
    checkpointKey.current ??= crypto.randomUUID();
    setCheckpoint(undefined);
    setCheckpointError(false);
    setScreen("checkpoint");
    try {
      const result = await fetch("/api/checkpoint", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          missionId: mission.id,
          idempotencyKey: checkpointKey.current,
          clientRelease: "vs-08.1",
        }),
      });
      const payload = (await result.json()) as Checkpoint;
      if (!result.ok || !payload.state) throw new Error("Checkpoint unavailable");
      setCheckpoint(payload);
    } catch {
      setCheckpointError(true);
    }
  }

  function continueFromCheckpoint() {
    checkpointKey.current = undefined;
    if (missionIndex < FIRST_RUN_MISSIONS.length - 1) startMission(missionIndex + 1);
    else startMission(0);
  }

  function moveToken(fromIndex: number, direction: -1 | 1) {
    if (!Array.isArray(response)) return;
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= response.length) return;
    const next = [...response];
    [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
    setResponse(next);
    setReorderTouched(true);
  }

  function toggleOption(optionId: string) {
    if (question.type === "choice") {
      setResponse([optionId]);
      return;
    }
    if (!Array.isArray(response)) return;
    setResponse(
      response.includes(optionId)
        ? response.filter((id) => id !== optionId)
        : [...response, optionId],
    );
  }

  function closeHintWarning() {
    setShowHintWarning(false);
    hintTrigger.current?.focus();
  }

  function keepHintFocus(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeHintWarning();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      hintDialog.current?.querySelectorAll<HTMLButtonElement>("button") ?? [],
    );
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <main className="mission-shell">
      <div className="contour-field" aria-hidden="true" />
      <section className="mission-frame" aria-labelledby="mission-title">
        <header className="mission-header">
          <div>
            <p className="route-label">Atlas English · Route to 6.5</p>
            <h1 id="mission-title">Hồ sơ ngữ cảnh</h1>
          </div>
          {screen === "question" || screen === "feedback" ? (
            <p className="mission-progress">
              <span className="sr-only">Câu </span>
              {questionIndex + 1}
              <span aria-hidden="true">/4</span>
            </p>
          ) : null}
        </header>

        <p className="temporary-notice" role="status">
          Bạn có thể chơi ngay. Đăng nhập email để lưu và xem lại lịch sử dài hạn.
        </p>
        {!online ? (
          <p className="submit-error" role="status">
            Mất kết nối: câu đang làm được giữ tạm; hãy kết nối lại để gửi.
          </p>
        ) : null}

        {screen === "intro" ? (
          <section className="mission-intro" aria-labelledby="intro-title">
            <div className="dossier-mark" aria-hidden="true">
              <span>↗</span>
            </div>
            <p className="route-label">The Atlas Initiative · Prologue</p>
            <h2 id="intro-title">Một hồ sơ, ba lớp ngữ cảnh bị thiếu</h2>
            <p>
              Hai bản tóm tắt về việc học online không khớp nhau. Cùng Ato và Mira sửa logic câu,
              phạm vi số liệu và độ mạnh của kết luận.
            </p>
            <dl className="mission-brief">
              <div>
                <dt>Lộ trình</dt>
                <dd>3 hồ sơ ngắn · 12 câu</dd>
              </div>
              <div>
                <dt>Mục tiêu</dt>
                <dd>Luyện grammar và vocabulary phục vụ IELTS Academic.</dd>
              </div>
            </dl>
            <button className="button-primary" type="button" onClick={() => startMission(0)}>
              Mở hồ sơ đầu tiên
            </button>
            {recovery ? (
              <button className="button-secondary" type="button" onClick={resumeRecovery}>
                Tiếp tục câu đang làm
              </button>
            ) : null}
          </section>
        ) : null}

        {screen === "question" ? (
          <section className="question-layout" aria-labelledby="question-title">
            <aside className="context-panel" aria-label="Ngữ cảnh nhiệm vụ">
              <p className="route-label">{mission.dossierLabel}</p>
              <p>{mission.setupVi}</p>
              <div className="context-line" aria-hidden="true" />
              <p>{mission.objectiveVi}</p>
              <p className="episode-position">
                Hồ sơ {missionIndex + 1}/3 · Câu {questionIndex + 1}/4
              </p>
            </aside>
            <div className="question-panel">
              <div className="progress-track" aria-hidden="true">
                <span style={{ width: `${((questionIndex + 1) / 4) * 100}%` }} />
              </div>
              {question.context ? (
                <p className="question-context" lang="en">
                  {question.context}
                </p>
              ) : null}
              <h2 id="question-title" lang="en">
                {question.prompt}
              </h2>
              {hintUsed && question.hint ? (
                <aside className="hint-note" lang="en">
                  <strong>Lượt luyện tập</strong>
                  <span>{question.hint}</span>
                </aside>
              ) : null}

              {question.type === "choice" || question.type === "multiple_choice" ? (
                <fieldset className="answer-list">
                  <legend className="sr-only">
                    {question.type === "multiple_choice"
                      ? "Chọn các đáp án phù hợp"
                      : "Chọn một đáp án"}
                  </legend>
                  {question.options.map((option) => {
                    const selected = Array.isArray(response) && response.includes(option.id);
                    return (
                      <label className="answer-option" key={option.id}>
                        <input
                          checked={selected}
                          name={question.id}
                          onChange={() => toggleOption(option.id)}
                          type={question.type === "multiple_choice" ? "checkbox" : "radio"}
                          value={option.id}
                        />
                        <span className="option-key" aria-hidden="true">
                          {option.id.toUpperCase()}
                        </span>
                        <span lang="en">{option.text}</span>
                      </label>
                    );
                  })}
                </fieldset>
              ) : null}

              {question.type === "reorder" && Array.isArray(response) ? (
                <ol className="reorder-list" aria-label="Sắp xếp các phần của câu">
                  {response.map((tokenIndex, index) => (
                    <li key={tokenIndex}>
                      <span lang="en">{question.tokens[tokenIndex]}</span>
                      <span className="reorder-controls">
                        <button
                          aria-label={`Đưa phần ${index + 1} lên`}
                          disabled={index === 0}
                          onClick={() => moveToken(index, -1)}
                          type="button"
                        >
                          Lên
                        </button>
                        <button
                          aria-label={`Đưa phần ${index + 1} xuống`}
                          disabled={index === response.length - 1}
                          onClick={() => moveToken(index, 1)}
                          type="button"
                        >
                          Xuống
                        </button>
                      </span>
                    </li>
                  ))}
                </ol>
              ) : null}

              {question.type === "text" ? (
                <label className="text-answer" htmlFor="mission-answer">
                  <span>Viết câu trả lời</span>
                  <textarea
                    id="mission-answer"
                    lang="en"
                    onChange={(event) => setResponse(event.target.value)}
                    placeholder="Write your answer here."
                    rows={4}
                    value={typeof response === "string" ? response : ""}
                  />
                </label>
              ) : null}

              <div className="question-actions">
                {question.hint && !hintUsed ? (
                  <button
                    className="button-secondary"
                    onClick={() => setShowHintWarning(true)}
                    ref={hintTrigger}
                    type="button"
                  >
                    Gợi ý
                  </button>
                ) : (
                  <span />
                )}
                <button
                  className="button-primary"
                  disabled={!responseIsComplete || submitState === "submitting" || !online}
                  onClick={submitAnswer}
                  type="button"
                >
                  {submitState === "submitting" ? "Đang kiểm tra…" : "Kiểm tra"}
                </button>
              </div>
              {submitState === "error" ? (
                <p className="submit-error" role="alert">
                  Chưa thể lưu lượt làm. Kiểm tra Internet rồi nhấn Kiểm tra để thử lại.
                </p>
              ) : null}
            </div>
          </section>
        ) : null}

        {screen === "feedback" && outcome ? (
          <section className="feedback-layout" aria-labelledby="feedback-title">
            <div className={`result-signal ${outcome.isCorrect ? "is-correct" : "is-incorrect"}`}>
              <span aria-hidden="true">{outcome.isCorrect ? "✓" : "!"}</span>
              <p>{outcome.isCorrect ? "Đúng" : "Cần sửa"}</p>
            </div>
            <div className="feedback-body">
              <h2 id="feedback-title" ref={feedbackHeading} tabIndex={-1}>
                {outcome.practiceOnly
                  ? "Hoàn thành lượt luyện tập"
                  : outcome.isCorrect
                    ? "Đáp án đã rõ"
                    : "Cách dùng rõ nghĩa"}
              </h2>
              <p className="submitted-label">Câu nên dùng</p>
              <p className="correction" lang="en">
                {outcome.correction}
              </p>
              <p>{outcome.explanationVi}</p>
              <p className="evidence-note">{outcome.evidenceMessage}</p>
              <button
                aria-controls="feedback-details"
                aria-expanded={detailsOpen}
                className="details-toggle"
                onClick={() => setDetailsOpen((open) => !open)}
                type="button"
              >
                {detailsOpen ? "Thu gọn" : "Xem chi tiết"}
              </button>
              {detailsOpen ? (
                <div className="feedback-details" id="feedback-details">
                  <p>
                    <strong>Quy tắc</strong>
                    <span lang="en">{question.detail.rule}</span>
                  </p>
                  <p>
                    <strong>Ví dụ</strong>
                    <span lang="en">{question.detail.example}</span>
                  </p>
                  <p>
                    <strong>Liên hệ IELTS</strong>
                    <span>{question.detail.ielts}</span>
                  </p>
                </div>
              ) : null}
              <button className="button-primary" onClick={nextQuestion} type="button">
                {questionIndex === mission.questions.length - 1
                  ? missionIndex === FIRST_RUN_MISSIONS.length - 1
                    ? "Xem kết quả mini-episode"
                    : "Xem hồ sơ tiếp theo"
                  : "Tiếp tục"}
              </button>
            </div>
          </section>
        ) : null}

        {screen === "checkpoint" ? (
          <section className="mission-complete checkpoint-card" aria-labelledby="checkpoint-title">
            <div className="dossier-mark" aria-hidden="true">
              <span>{checkpoint?.state === "final_first_completion" ? "⌁" : "↗"}</span>
            </div>
            <p className="route-label">Checkpoint · Chặng {missionIndex + 1}/3 hoàn tất</p>
            <h2 id="checkpoint-title" ref={checkpointHeading} tabIndex={-1}>
              {checkpoint?.state === "final_first_completion"
                ? "Đã khôi phục ngữ cảnh"
                : checkpoint?.state === "final_replay"
                  ? "Hồ sơ đã hoàn thành trước đó"
                  : "Dữ liệu đã rõ hơn"}
            </h2>
            <p>{mission.transitionVi}</p>
            {checkpoint?.state === "final_first_completion" ? (
              <p className="story-result">
                Sổ hành trình: <strong>Context Restored</strong> · Một đoạn bản đồ mới đã mở.
              </p>
            ) : null}
            {checkpoint?.guest ? (
              <p className="evidence-note">
                Bạn đang chơi với tư cách khách; kết quả này giữ tối đa 24 giờ.
              </p>
            ) : null}
            {checkpoint?.updatePending ? (
              <button
                className="button-secondary"
                onClick={() => window.location.reload()}
                type="button"
              >
                Tải phiên bản mới
              </button>
            ) : null}
            {checkpointError ? (
              <p className="submit-error" role="alert">
                Checkpoint chưa tải được; các câu đã gửi vẫn an toàn.
              </p>
            ) : null}
            <div className="checkpoint-actions">
              <button
                className="button-primary"
                disabled={!checkpoint}
                onClick={continueFromCheckpoint}
                type="button"
              >
                {missionIndex === FIRST_RUN_MISSIONS.length - 1
                  ? "Làm lại mini-episode"
                  : "Tiếp tục nhiệm vụ"}
              </button>
              <button
                className="button-secondary"
                onClick={() => setScreen("safe_stopped")}
                type="button"
              >
                Dừng tại đây
              </button>
              {checkpointError ? (
                <button
                  className="details-toggle"
                  onClick={() => void openCheckpoint()}
                  type="button"
                >
                  Thử lại checkpoint
                </button>
              ) : null}
            </div>
          </section>
        ) : null}

        {screen === "safe_stopped" ? (
          <section className="mission-complete checkpoint-card" aria-labelledby="safe-stop-title">
            <div className="dossier-mark" aria-hidden="true">
              <span>□</span>
            </div>
            <p className="route-label">Điểm dừng an toàn</p>
            <h2 id="safe-stop-title" ref={checkpointHeading} tabIndex={-1}>
              Các câu đã gửi vẫn được giữ
            </h2>
            <p>
              Bạn có thể quay lại bất cứ lúc nào. Lượt làm đã được máy chủ xác nhận không bị mất vì
              bạn dừng ở đây.
            </p>
            {checkpoint?.guest ? (
              <p className="evidence-note">
                Với tư cách khách, tiến độ tạm thời còn hiệu lực tối đa 24 giờ trên trình duyệt này.
              </p>
            ) : null}
            <div className="checkpoint-actions">
              <button className="button-primary" onClick={continueFromCheckpoint} type="button">
                {missionIndex === FIRST_RUN_MISSIONS.length - 1
                  ? "Làm lại mini-episode"
                  : "Tiếp tục nhiệm vụ"}
              </button>
              <button className="button-secondary" onClick={() => setScreen("intro")} type="button">
                Về hồ sơ đầu
              </button>
            </div>
          </section>
        ) : null}
      </section>

      {showHintWarning ? (
        <div className="dialog-backdrop" role="presentation">
          <section
            aria-describedby="hint-warning-copy"
            aria-labelledby="hint-warning-title"
            aria-modal="true"
            className="hint-dialog"
            onKeyDown={keepHintFocus}
            ref={hintDialog}
            role="dialog"
          >
            <h2 id="hint-warning-title">Mở gợi ý?</h2>
            <p id="hint-warning-copy">
              Gợi ý giúp bạn luyện tập; lượt này sẽ không tính vào mức độ thành thạo.
            </p>
            <div className="dialog-actions">
              <button className="button-secondary" onClick={closeHintWarning} type="button">
                Tiếp tục không gợi ý
              </button>
              <button
                className="button-primary"
                onClick={() => {
                  setHintUsed(true);
                  setShowHintWarning(false);
                }}
                type="button"
              >
                Mở gợi ý
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
