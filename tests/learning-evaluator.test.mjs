import assert from "node:assert/strict";
import test from "node:test";

import {
  ALGORITHM_VERSION,
  classifyIdempotency,
  determineMasteryEligibility,
  evaluateAnswer,
  evaluateLearningAttempt,
  updateMastery,
} from "../src/domain/learning/index.ts";

const normalizedTextContract = {
  mode: "normalized_text",
  acceptedAnswers: ["Online learning can improve access."],
  caseSensitive: false,
  punctuationSensitive: false,
  hyphenSensitive: true,
};

const eligibleContext = {
  assessmentMode: "hybrid",
  nodeProgressChannels: ["mastery", "practice"],
  evidenceEligibility: "mastery",
  hintsUsed: 0,
  practiceOnly: false,
  incident: "none",
  supportedVersions: true,
  firstAttemptEligible: true,
};

test("normalization applies only declared deterministic tolerances", () => {
  assert.deepEqual(
    evaluateAnswer(normalizedTextContract, "  ONLINE   learning can improve access  "),
    {
      correctness: 1,
      isCorrect: true,
      matchedAcceptedAnswer: "Online learning can improve access.",
    },
  );

  assert.equal(
    evaluateAnswer(normalizedTextContract, "Online study can improve access").correctness,
    0,
  );
});

test("subset partial credit is awarded only when no incorrect option is selected", () => {
  const contract = {
    mode: "selected_options",
    acceptedAnswers: ["cause", "effect"],
    partialCreditPolicy: "subset_no_incorrect",
  };

  assert.equal(evaluateAnswer(contract, ["cause", "effect"]).correctness, 1);
  assert.equal(evaluateAnswer(contract, ["cause"]).correctness, 0.5);
  assert.equal(evaluateAnswer(contract, ["cause", "unsupported"]).correctness, 0);
});

test("first eligible recognition success initializes null mastery to 24", () => {
  assert.equal(
    updateMastery({
      algorithmVersion: ALGORITHM_VERSION,
      currentMastery: null,
      correctness: 1,
      mode: "recognition",
      difficulty: "target",
      spacing: "same_day",
    }),
    24,
  );
});

test("correct hinted attempt is practice-only and leaves mastery unchanged", () => {
  const result = evaluateLearningAttempt({
    algorithmVersion: ALGORITHM_VERSION,
    currentMastery: 52,
    answerContract: normalizedTextContract,
    response: "Online learning can improve access",
    context: { ...eligibleContext, hintsUsed: 1 },
    evidence: {
      mode: "controlled_production",
      difficulty: "target",
      spacing: "one_to_two_days",
    },
  });

  assert.equal(result.answer?.correctness, 1);
  assert.deepEqual(result.eligibility, { eligible: false, reasons: ["HINT_USED"] });
  assert.equal(result.mastery.next, 52);
  assert.equal(result.mastery.changed, false);
});

test("a controlled practice variant is ineligible until a later independent attempt", () => {
  const practiceVariant = evaluateLearningAttempt({
    algorithmVersion: ALGORITHM_VERSION,
    currentMastery: 41,
    answerContract: normalizedTextContract,
    response: "Online learning can improve access",
    context: { ...eligibleContext, practiceOnly: true },
    evidence: {
      mode: "controlled_production",
      difficulty: "target",
      spacing: "three_plus_days",
    },
  });
  const independentVariant = evaluateLearningAttempt({
    algorithmVersion: ALGORITHM_VERSION,
    currentMastery: 41,
    answerContract: normalizedTextContract,
    response: "Online learning can improve access",
    context: eligibleContext,
    evidence: {
      mode: "controlled_production",
      difficulty: "target",
      spacing: "three_plus_days",
    },
  });

  assert.equal(practiceVariant.mastery.next, 41);
  assert.equal(practiceVariant.mastery.changed, false);
  assert.ok(practiceVariant.eligibility.reasons.includes("PRACTICE_ONLY_RETRY"));
  assert.equal(independentVariant.eligibility.eligible, true);
  assert.equal(independentVariant.mastery.next, 51);
});

test("delayed controlled-production success moves mastery from 24 to 34", () => {
  assert.equal(
    updateMastery({
      algorithmVersion: ALGORITHM_VERSION,
      currentMastery: 24,
      correctness: 1,
      mode: "controlled_production",
      difficulty: "target",
      spacing: "one_to_two_days",
    }),
    34,
  );
});

test("delayed transfer success is capped at a 12-point gain", () => {
  assert.equal(
    updateMastery({
      algorithmVersion: ALGORITHM_VERSION,
      currentMastery: 34,
      correctness: 1,
      mode: "transfer",
      difficulty: "target",
      spacing: "three_plus_days",
    }),
    46,
  );
});

test("independent stretch failure is capped at a 15-point loss", () => {
  assert.equal(
    updateMastery({
      algorithmVersion: ALGORITHM_VERSION,
      currentMastery: 80,
      correctness: 0,
      mode: "transfer",
      difficulty: "stretch",
      spacing: "three_plus_days",
    }),
    65,
  );
});

test("same-day easy recognition success moves mastery from 80 to 81", () => {
  assert.equal(
    updateMastery({
      algorithmVersion: ALGORITHM_VERSION,
      currentMastery: 80,
      correctness: 1,
      mode: "recognition",
      difficulty: "easy",
      spacing: "same_day",
    }),
    81,
  );
});

test("technical failure is not wrong and cannot change mastery", () => {
  const result = evaluateLearningAttempt({
    algorithmVersion: ALGORITHM_VERSION,
    currentMastery: 67,
    answerContract: normalizedTextContract,
    response: "",
    context: { ...eligibleContext, incident: "technical" },
    evidence: {
      mode: "recognition",
      difficulty: "target",
      spacing: "three_plus_days",
    },
  });

  assert.equal(result.answer, null);
  assert.deepEqual(result.eligibility, { eligible: false, reasons: ["TECHNICAL_INCIDENT"] });
  assert.deepEqual(result.mastery, {
    algorithmVersion: ALGORITHM_VERSION,
    previous: 67,
    next: 67,
    changed: false,
  });
});

test("self-review has no correctness result and never changes mastery", () => {
  const result = evaluateLearningAttempt({
    algorithmVersion: ALGORITHM_VERSION,
    currentMastery: 61,
    answerContract: { mode: "self_review" },
    response: "learner reflection",
    context: {
      ...eligibleContext,
      assessmentMode: "self_review_only",
      nodeProgressChannels: ["practice"],
      evidenceEligibility: "practice",
    },
    evidence: {
      mode: "production",
      difficulty: "target",
      spacing: "three_plus_days",
    },
  });

  assert.equal(result.answer, null);
  assert.equal(result.mastery.next, 61);
  assert.equal(result.mastery.changed, false);
  assert.ok(result.eligibility.reasons.includes("SELF_REVIEW_SCORING"));
});

test("every Learning Contract v0.1 eligibility gate produces an auditable reason", () => {
  const cases = [
    {
      context: { ...eligibleContext, nodeProgressChannels: ["practice"] },
      scoringMode: "normalized_text",
      reason: "NODE_MASTERY_DISABLED",
    },
    {
      context: { ...eligibleContext, assessmentMode: "self_review_only" },
      scoringMode: "normalized_text",
      reason: "ASSESSMENT_MODE_INELIGIBLE",
    },
    {
      context: { ...eligibleContext, evidenceEligibility: "practice" },
      scoringMode: "normalized_text",
      reason: "EXERCISE_PRACTICE_ONLY",
    },
    {
      context: eligibleContext,
      scoringMode: "self_review",
      reason: "SELF_REVIEW_SCORING",
    },
    {
      context: { ...eligibleContext, practiceOnly: true },
      scoringMode: "normalized_text",
      reason: "PRACTICE_ONLY_RETRY",
    },
    {
      context: { ...eligibleContext, incident: "content" },
      scoringMode: "normalized_text",
      reason: "CONTENT_INCIDENT",
    },
    {
      context: { ...eligibleContext, supportedVersions: false },
      scoringMode: "normalized_text",
      reason: "UNSUPPORTED_VERSION",
    },
    {
      context: { ...eligibleContext, firstAttemptEligible: false },
      scoringMode: "normalized_text",
      reason: "NOT_FIRST_ATTEMPT",
    },
  ];

  for (const fixture of cases) {
    const result = determineMasteryEligibility(fixture.context, fixture.scoringMode);
    assert.equal(result.eligible, false);
    assert.ok(result.reasons.includes(fixture.reason), fixture.reason);
  }
});

test("eligible deterministic attempt has no rejection reasons", () => {
  assert.deepEqual(determineMasteryEligibility(eligibleContext, "normalized_text"), {
    eligible: true,
    reasons: [],
  });
});

test("invalid mastery inputs fail closed", () => {
  assert.throws(
    () =>
      updateMastery({
        algorithmVersion: ALGORITHM_VERSION,
        currentMastery: 50,
        correctness: 1.1,
        mode: "recognition",
        difficulty: "target",
        spacing: "same_day",
      }),
    /correctness must be between 0 and 1/,
  );

  assert.throws(
    () =>
      updateMastery({
        algorithmVersion: "mastery-unknown",
        currentMastery: 50,
        correctness: 1,
        mode: "recognition",
        difficulty: "target",
        spacing: "same_day",
      }),
    /Unsupported mastery algorithm/,
  );
});

test("idempotency decision distinguishes new, replay and conflicting payloads", () => {
  assert.equal(classifyIdempotency(null, "hash-a"), "new");
  assert.equal(classifyIdempotency("hash-a", "hash-a"), "replay");
  assert.equal(classifyIdempotency("hash-a", "hash-b"), "conflict");
});

test("the same versioned attempt input always produces the same result", () => {
  const input = {
    algorithmVersion: ALGORITHM_VERSION,
    currentMastery: 34,
    answerContract: normalizedTextContract,
    response: "Online learning can improve access",
    context: eligibleContext,
    evidence: {
      mode: "transfer",
      difficulty: "target",
      spacing: "three_plus_days",
    },
  };

  assert.deepEqual(evaluateLearningAttempt(input), evaluateLearningAttempt(input));
});
