import assert from "node:assert/strict";
import test from "node:test";

import {
  evaluateMissionAnswer,
  FIRST_RUN_MISSIONS,
  initialResponse,
  isResponseComplete,
  SELECTION_CONTRACT,
} from "../src/domain/vertical-slice/mission-catalog.ts";

const allQuestions = FIRST_RUN_MISSIONS.flatMap((mission) => mission.questions);

test("VS-05 exposes three ordered missions with exactly twelve short first-run questions", () => {
  assert.deepEqual(
    FIRST_RUN_MISSIONS.map((mission) => mission.id),
    ["m1", "m2", "m3"],
  );
  assert.deepEqual(
    FIRST_RUN_MISSIONS.map((mission) => mission.questions.length),
    [4, 4, 4],
  );
  assert.equal(allQuestions.length, 12);
  assert.equal(new Set(allQuestions.map((question) => question.id)).size, 12);
});

test("the first-run questions are exactly the first twelve entries of the 30-item selection contract", () => {
  const firstRun = SELECTION_CONTRACT.filter((item) => item.firstRun);
  assert.equal(SELECTION_CONTRACT.length, 30);
  assert.equal(firstRun.length, 12);
  assert.deepEqual(
    firstRun.map((item) => item.id),
    allQuestions.map((question) => question.id),
  );
});

test("each selected learning node has the approved 6 core, 2 hinted and 2 review allocation", () => {
  for (const nodeId of [
    "grammar.sentence.boundaries",
    "grammar.nouns.countability",
    "vocabulary.cause_effect",
  ]) {
    const pool = SELECTION_CONTRACT.filter((item) => item.learningNodeId === nodeId);
    assert.equal(pool.length, 10);
    assert.equal(pool.filter((item) => item.role === "core_mastery").length, 6);
    assert.equal(pool.filter((item) => item.role === "hinted_practice").length, 2);
    assert.equal(pool.filter((item) => item.role === "independent_review").length, 2);
  }
});

test("choice, multiple-choice, reorder and text responses use declared deterministic contracts", () => {
  const [m1, , m3] = FIRST_RUN_MISSIONS;
  assert.equal(evaluateMissionAnswer(m1.questions[0], ["c"], false).isCorrect, true);
  assert.equal(evaluateMissionAnswer(m1.questions[1], [1, 2, 0], false).isCorrect, true);
  assert.equal(evaluateMissionAnswer(m3.questions[1], ["a", "c"], false).isCorrect, true);
  assert.equal(evaluateMissionAnswer(m3.questions[3], "contribute to", false).isCorrect, true);
  assert.equal(evaluateMissionAnswer(m3.questions[1], ["a", "b"], false).isCorrect, false);
});

test("hinted answers remain practice-only and response readiness follows interaction type", () => {
  const hintedQuestion = FIRST_RUN_MISSIONS[1].questions[2];
  const outcome = evaluateMissionAnswer(
    hintedQuestion,
    "The report gives much advice about online study.",
    true,
  );
  assert.equal(outcome.isCorrect, true);
  assert.equal(outcome.practiceOnly, true);
  assert.match(outcome.evidenceMessage, /không thay đổi mức độ thành thạo/);

  assert.equal(isResponseComplete(FIRST_RUN_MISSIONS[2].questions[1], []), false);
  assert.equal(isResponseComplete(FIRST_RUN_MISSIONS[2].questions[1], ["a"]), true);
  assert.equal(isResponseComplete(FIRST_RUN_MISSIONS[0].questions[0], ["c"]), true);
  assert.deepEqual(initialResponse(FIRST_RUN_MISSIONS[0].questions[0]), []);
  assert.equal(
    isResponseComplete(
      FIRST_RUN_MISSIONS[0].questions[1],
      initialResponse(FIRST_RUN_MISSIONS[0].questions[1]),
    ),
    true,
  );
});
