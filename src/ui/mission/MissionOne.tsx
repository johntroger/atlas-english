"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";

import {
  evaluateMissionOneAnswer,
  isMissionOneResponseComplete,
  MISSION_ONE,
  type MissionOneResponse,
} from "@/domain/vertical-slice/mission-one";

type Screen = "intro" | "question" | "feedback" | "complete";

function initialResponse(questionIndex: number): MissionOneResponse {
  const question = MISSION_ONE.questions[questionIndex];
  return question.type === "reorder" ? question.tokens.map((_, index) => index) : "";
}

export function MissionOne() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [response, setResponse] = useState<MissionOneResponse>(() => initialResponse(0));
  const [hintUsed, setHintUsed] = useState(false);
  const [showHintWarning, setShowHintWarning] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [reorderTouched, setReorderTouched] = useState(false);
  const feedbackHeading = useRef<HTMLHeadingElement>(null);
  const hintDialog = useRef<HTMLElement>(null);
  const hintTrigger = useRef<HTMLButtonElement>(null);

  const question = MISSION_ONE.questions[questionIndex];
  const outcome =
    screen === "feedback" ? evaluateMissionOneAnswer(question, response, hintUsed) : undefined;
  const responseIsComplete =
    isMissionOneResponseComplete(question, response) &&
    (question.type !== "reorder" || reorderTouched);

  useEffect(() => {
    if (screen === "feedback") {
      feedbackHeading.current?.focus();
    }
  }, [screen]);

  useEffect(() => {
    if (showHintWarning) {
      hintDialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    }
  }, [showHintWarning]);

  function beginMission() {
    setScreen("question");
    setQuestionIndex(0);
    setResponse(initialResponse(0));
    setHintUsed(false);
    setDetailsOpen(false);
    setReorderTouched(false);
  }

  function submitAnswer() {
    if (!responseIsComplete) {
      return;
    }
    setScreen("feedback");
  }

  function nextQuestion() {
    if (questionIndex === MISSION_ONE.questions.length - 1) {
      setScreen("complete");
      return;
    }
    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    setResponse(initialResponse(nextIndex));
    setHintUsed(false);
    setDetailsOpen(false);
    setReorderTouched(false);
    setScreen("question");
  }

  function moveToken(fromIndex: number, direction: -1 | 1) {
    if (!Array.isArray(response)) {
      return;
    }
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= response.length) {
      return;
    }
    const next = [...response];
    [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
    setResponse(next);
    setReorderTouched(true);
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
    if (event.key !== "Tab") {
      return;
    }
    const focusable = Array.from(
      hintDialog.current?.querySelectorAll<HTMLButtonElement>("button") ?? [],
    );
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) {
      return;
    }
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
            <h1 id="mission-title">{MISSION_ONE.titleVi}</h1>
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
          {MISSION_ONE.temporaryNoticeVi}
        </p>

        {screen === "intro" ? (
          <section className="mission-intro" aria-labelledby="intro-title">
            <div className="dossier-mark" aria-hidden="true">
              <span>↗</span>
            </div>
            <p className="route-label">Hồ sơ 01</p>
            <h2 id="intro-title">Hai bản tóm tắt, một ngữ cảnh bị mất</h2>
            <p>
              Ato và Mira đang đối chiếu hai bản tóm tắt của cùng một khảo sát. Bốn câu ngắn sẽ giúp
              bạn nối lại logic giữa các phát hiện.
            </p>
            <dl className="mission-brief">
              <div>
                <dt>Mục tiêu</dt>
                <dd>{MISSION_ONE.dossierGoalVi}</dd>
              </div>
              <div>
                <dt>Thời lượng</dt>
                <dd>Khoảng 3 phút · 4 câu</dd>
              </div>
            </dl>
            <button className="button-primary" type="button" onClick={beginMission}>
              Bắt đầu nhiệm vụ
            </button>
          </section>
        ) : null}

        {screen === "question" ? (
          <section className="question-layout" aria-labelledby="question-title">
            <aside className="context-panel" aria-label="Ngữ cảnh nhiệm vụ">
              <p className="route-label">Mảnh hồ sơ {questionIndex + 1}</p>
              <p>{MISSION_ONE.shortContextVi}</p>
              <div className="context-line" aria-hidden="true" />
              <p>{MISSION_ONE.dossierGoalVi}</p>
            </aside>
            <div className="question-panel">
              <div className="progress-track" aria-hidden="true">
                <span style={{ width: `${((questionIndex + 1) / 4) * 100}%` }} />
              </div>
              <p className="question-context" lang="en">
                {question.context}
              </p>
              <h2 id="question-title" lang="en">
                {question.prompt}
              </h2>

              {hintUsed && question.hint ? (
                <aside className="hint-note" lang="en">
                  <strong>Lượt luyện tập</strong>
                  <span>{question.hint}</span>
                </aside>
              ) : null}

              {question.type === "choice" ? (
                <fieldset className="answer-list">
                  <legend className="sr-only">Chọn một đáp án</legend>
                  {question.options.map((option) => (
                    <label className="answer-option" key={option.id}>
                      <input
                        checked={response === option.id}
                        name={question.id}
                        onChange={() => setResponse(option.id)}
                        type="radio"
                        value={option.id}
                      />
                      <span className="option-key" aria-hidden="true">
                        {option.id.toUpperCase()}
                      </span>
                      <span lang="en">{option.text}</span>
                    </label>
                  ))}
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
                  <span>Viết câu đã sửa</span>
                  <textarea
                    id="mission-answer"
                    lang="en"
                    onChange={(event) => setResponse(event.target.value)}
                    placeholder="Write your corrected sentence here."
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
                  disabled={!responseIsComplete}
                  onClick={submitAnswer}
                  type="button"
                >
                  Kiểm tra
                </button>
              </div>
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
                onClick={() => setDetailsOpen((isOpen) => !isOpen)}
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
                {questionIndex === MISSION_ONE.questions.length - 1
                  ? "Xem kết quả nhiệm vụ"
                  : "Tiếp tục"}
              </button>
            </div>
          </section>
        ) : null}

        {screen === "complete" ? (
          <section className="mission-complete" aria-labelledby="complete-title">
            <div className="dossier-mark" aria-hidden="true">
              <span>⌁</span>
            </div>
            <p className="route-label">Hồ sơ đã rõ hơn</p>
            <h2 id="complete-title">Bốn mảnh logic đã được ghép lại</h2>
            <p>
              Bạn đã hoàn tất bản thử nghiệm của nhiệm vụ này. Hệ thống chưa lưu tiến độ, phần
              thưởng hay mastery ở bước hiện tại.
            </p>
            <p className="story-result" lang="en">
              The summary can now show the contrast between a high response rate and a limited
              sample.
            </p>
            <button className="button-primary" onClick={beginMission} type="button">
              Làm lại nhiệm vụ
            </button>
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
            role="dialog"
            onKeyDown={keepHintFocus}
            ref={hintDialog}
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
