import assert from "node:assert/strict";
import test from "node:test";

import {
  MISSION_ONE,
  evaluateMissionOneAnswer,
  isMissionOneResponseComplete,
} from "../src/domain/vertical-slice/mission-one.ts";

test("VS-04 mission contains exactly four ordered temporary exercises", () => {
  assert.equal(MISSION_ONE.questions.length, 4);
  assert.deepEqual(
    MISSION_ONE.questions.map(({ id }) => id),
    [
      "slice.m1.boundaries.001",
      "slice.m1.boundaries.002",
      "slice.m1.boundaries.003",
      "slice.m1.boundaries.004",
    ],
  );
});

test("choice, reorder and controlled text answers use their declared deterministic contracts", () => {
  assert.equal(evaluateMissionOneAnswer(MISSION_ONE.questions[0], "c", false).isCorrect, true);
  assert.equal(
    evaluateMissionOneAnswer(MISSION_ONE.questions[1], [1, 2, 0], false).isCorrect,
    true,
  );
  assert.equal(
    evaluateMissionOneAnswer(
      MISSION_ONE.questions[3],
      "The response rate was high although the sample came from one faculty.",
      false,
    ).isCorrect,
    true,
  );
});

test("wrong answers show the declared correction without producing a mastery claim", () => {
  const outcome = evaluateMissionOneAnswer(MISSION_ONE.questions[0], "b", false);

  assert.equal(outcome.isCorrect, false);
  assert.equal(outcome.practiceOnly, false);
  assert.equal(
    outcome.correction,
    "The survey included 120 students. Most used online resources twice a week.",
  );
});

test("opening a hint makes the resulting attempt practice-only even when correct", () => {
  const outcome = evaluateMissionOneAnswer(
    MISSION_ONE.questions[2],
    "The survey covered first-year students, but it did not include final-year students.",
    true,
  );

  assert.equal(outcome.isCorrect, true);
  assert.equal(outcome.practiceOnly, true);
  assert.equal(outcome.evidenceMessage, "Lượt luyện tập — không thay đổi mức độ thành thạo.");
});

test("an answer is complete only when its interaction contract has a usable response", () => {
  assert.equal(isMissionOneResponseComplete(MISSION_ONE.questions[0], ""), false);
  assert.equal(isMissionOneResponseComplete(MISSION_ONE.questions[0], "a"), true);
  assert.equal(isMissionOneResponseComplete(MISSION_ONE.questions[1], [0, 1]), false);
  assert.equal(isMissionOneResponseComplete(MISSION_ONE.questions[1], [0, 1, 2]), true);
  assert.equal(isMissionOneResponseComplete(MISSION_ONE.questions[2], "   "), false);
});
