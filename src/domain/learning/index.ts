export const ALGORITHM_VERSION = "mastery-v0.1" as const;

export type AlgorithmVersion = typeof ALGORITHM_VERSION;
export type AssessmentMode =
  | "auto_scored"
  | "controlled_production"
  | "self_review_only"
  | "external_review_required"
  | "hybrid";
export type ProgressChannel = "mastery" | "practice" | "external";
export type EvidenceEligibility = "mastery" | "practice" | "external";
export type AttemptIncident = "none" | "technical" | "content";
export type EvidenceMode = "recognition" | "controlled_production" | "production" | "transfer";
export type Difficulty = "easy" | "target" | "stretch";
export type Spacing = "same_day" | "one_to_two_days" | "three_plus_days";

export type TextAnswerContract = Readonly<{
  mode: "exact" | "normalized_text";
  acceptedAnswers: readonly string[];
  caseSensitive?: boolean;
  punctuationSensitive?: boolean;
  hyphenSensitive?: boolean;
}>;

export type SelectedOptionsAnswerContract = Readonly<{
  mode: "selected_options";
  acceptedAnswers: readonly string[];
  partialCreditPolicy: "none" | "subset_no_incorrect";
}>;

export type SelfReviewAnswerContract = Readonly<{
  mode: "self_review";
}>;

export type AnswerContract =
  | TextAnswerContract
  | SelectedOptionsAnswerContract
  | SelfReviewAnswerContract;

export type AnswerResult = Readonly<{
  correctness: number;
  isCorrect: boolean;
  matchedAcceptedAnswer?: string;
}>;

export type EligibilityReason =
  | "NODE_MASTERY_DISABLED"
  | "ASSESSMENT_MODE_INELIGIBLE"
  | "EXERCISE_PRACTICE_ONLY"
  | "SELF_REVIEW_SCORING"
  | "HINT_USED"
  | "PRACTICE_ONLY_RETRY"
  | "TECHNICAL_INCIDENT"
  | "CONTENT_INCIDENT"
  | "UNSUPPORTED_VERSION"
  | "NOT_FIRST_ATTEMPT";

export type EligibilityResult =
  | Readonly<{ eligible: true; reasons: readonly [] }>
  | Readonly<{ eligible: false; reasons: readonly EligibilityReason[] }>;

export type AttemptContext = Readonly<{
  assessmentMode: AssessmentMode;
  nodeProgressChannels: readonly ProgressChannel[];
  evidenceEligibility: EvidenceEligibility;
  hintsUsed: number;
  practiceOnly: boolean;
  incident: AttemptIncident;
  supportedVersions: boolean;
  firstAttemptEligible: boolean;
}>;

export type MasteryUpdateInput = Readonly<{
  algorithmVersion: AlgorithmVersion;
  currentMastery: number | null;
  correctness: number;
  mode: EvidenceMode;
  difficulty: Difficulty;
  spacing: Spacing;
}>;

export type LearningAttemptInput = Readonly<{
  algorithmVersion: AlgorithmVersion;
  currentMastery: number | null;
  answerContract: AnswerContract;
  response: string | readonly string[];
  context: AttemptContext;
  evidence: Readonly<{
    mode: EvidenceMode;
    difficulty: Difficulty;
    spacing: Spacing;
  }>;
}>;

export type LearningAttemptResult = Readonly<{
  answer: AnswerResult | null;
  eligibility: EligibilityResult;
  mastery: Readonly<{
    algorithmVersion: AlgorithmVersion;
    previous: number | null;
    next: number | null;
    changed: boolean;
  }>;
}>;

const hyphenCharacters = new Set(["-", "‐", "‑", "‒", "–", "—"]);

function normalizeText(value: string, contract: TextAnswerContract): string {
  let normalized = value.normalize("NFC").trim().replace(/\s+/gu, " ");

  if (contract.caseSensitive !== true) {
    normalized = normalized.toLocaleLowerCase("en-US");
  }

  if (contract.punctuationSensitive !== true) {
    normalized = Array.from(normalized, (character) => {
      if (!/\p{P}/u.test(character)) {
        return character;
      }

      if (contract.hyphenSensitive === true && hyphenCharacters.has(character)) {
        return character;
      }

      return " ";
    })
      .join("")
      .replace(/\s+/gu, " ")
      .trim();
  }

  if (contract.hyphenSensitive === false) {
    normalized = Array.from(normalized, (character) =>
      hyphenCharacters.has(character) ? " " : character,
    )
      .join("")
      .replace(/\s+/gu, " ")
      .trim();
  }

  return normalized;
}

function textAnswerResult(contract: TextAnswerContract, response: unknown): AnswerResult {
  if (typeof response !== "string") {
    return { correctness: 0, isCorrect: false };
  }

  const candidate = contract.mode === "exact" ? response : normalizeText(response, contract);
  const match = contract.acceptedAnswers.find((acceptedAnswer) => {
    const expected =
      contract.mode === "exact" ? acceptedAnswer : normalizeText(acceptedAnswer, contract);
    return candidate === expected;
  });

  if (match === undefined) {
    return { correctness: 0, isCorrect: false };
  }

  return { correctness: 1, isCorrect: true, matchedAcceptedAnswer: match };
}

function selectedOptionsResult(
  contract: SelectedOptionsAnswerContract,
  response: unknown,
): AnswerResult {
  if (!Array.isArray(response) || !response.every((option) => typeof option === "string")) {
    return { correctness: 0, isCorrect: false };
  }

  const accepted = new Set(contract.acceptedAnswers);
  const selected = new Set(response);
  const hasIncorrectSelection = [...selected].some((option) => !accepted.has(option));
  const selectedCorrectCount = [...selected].filter((option) => accepted.has(option)).length;
  const isExact =
    !hasIncorrectSelection &&
    selectedCorrectCount === accepted.size &&
    selected.size === accepted.size;

  if (isExact) {
    return { correctness: 1, isCorrect: true };
  }

  if (
    contract.partialCreditPolicy === "subset_no_incorrect" &&
    !hasIncorrectSelection &&
    accepted.size > 0
  ) {
    return {
      correctness: selectedCorrectCount / accepted.size,
      isCorrect: false,
    };
  }

  return { correctness: 0, isCorrect: false };
}

export function evaluateAnswer(
  contract: AnswerContract,
  response: string | readonly string[],
): AnswerResult | null {
  if (contract.mode === "self_review") {
    return null;
  }

  if (contract.mode === "selected_options") {
    return selectedOptionsResult(contract, response);
  }

  return textAnswerResult(contract, response);
}

export function determineMasteryEligibility(
  context: AttemptContext,
  scoringMode: AnswerContract["mode"],
): EligibilityResult {
  if (!Number.isInteger(context.hintsUsed) || context.hintsUsed < 0) {
    throw new RangeError("hintsUsed must be a non-negative integer");
  }

  const reasons: EligibilityReason[] = [];

  if (!context.nodeProgressChannels.includes("mastery")) {
    reasons.push("NODE_MASTERY_DISABLED");
  }
  if (
    context.assessmentMode === "self_review_only" ||
    context.assessmentMode === "external_review_required"
  ) {
    reasons.push("ASSESSMENT_MODE_INELIGIBLE");
  }
  if (context.evidenceEligibility !== "mastery") {
    reasons.push("EXERCISE_PRACTICE_ONLY");
  }
  if (scoringMode === "self_review") {
    reasons.push("SELF_REVIEW_SCORING");
  }
  if (context.hintsUsed > 0) {
    reasons.push("HINT_USED");
  }
  if (context.practiceOnly) {
    reasons.push("PRACTICE_ONLY_RETRY");
  }
  if (context.incident === "technical") {
    reasons.push("TECHNICAL_INCIDENT");
  }
  if (context.incident === "content") {
    reasons.push("CONTENT_INCIDENT");
  }
  if (!context.supportedVersions) {
    reasons.push("UNSUPPORTED_VERSION");
  }
  if (!context.firstAttemptEligible) {
    reasons.push("NOT_FIRST_ATTEMPT");
  }

  return reasons.length === 0 ? { eligible: true, reasons: [] } : { eligible: false, reasons };
}

const modeFactors: Readonly<Record<EvidenceMode, number>> = {
  recognition: 0.7,
  controlled_production: 0.9,
  production: 1.1,
  transfer: 1.2,
};

const difficultyFactors: Readonly<Record<Difficulty, number>> = {
  easy: 0.9,
  target: 1,
  stretch: 1.1,
};

const spacingFactors: Readonly<Record<Spacing, number>> = {
  same_day: 0.4,
  one_to_two_days: 0.8,
  three_plus_days: 1,
};

function assertScore(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError(`${label} must be between 0 and 100`);
  }
}

export function updateMastery(input: MasteryUpdateInput): number {
  if (input.algorithmVersion !== ALGORITHM_VERSION) {
    throw new Error(`Unsupported mastery algorithm: ${input.algorithmVersion}`);
  }

  if (!Number.isFinite(input.correctness) || input.correctness < 0 || input.correctness > 1) {
    throw new RangeError("correctness must be between 0 and 1");
  }

  if (input.currentMastery !== null) {
    assertScore(input.currentMastery, "currentMastery");
  }

  const current = input.currentMastery ?? 20;
  const evidenceTarget = 100 * input.correctness;
  const evidenceWeight =
    modeFactors[input.mode] * difficultyFactors[input.difficulty] * spacingFactors[input.spacing];
  const isFullyCorrect = input.correctness === 1;
  const baseAlpha = isFullyCorrect ? 0.18 : 0.25;
  const alphaCap = isFullyCorrect ? 0.35 : 0.45;
  const alpha = Math.min(alphaCap, baseAlpha * evidenceWeight);
  const rawNext = current + alpha * (evidenceTarget - current);
  const boundedNext = Math.round(Math.min(current + 12, Math.max(current - 15, rawNext)));
  const next = isFullyCorrect ? Math.max(current, boundedNext) : boundedNext;

  return Math.min(100, Math.max(0, next));
}

export function classifyIdempotency(
  existingRequestHash: string | null,
  incomingRequestHash: string,
): "new" | "replay" | "conflict" {
  if (incomingRequestHash.length === 0) {
    throw new Error("incomingRequestHash must not be empty");
  }

  if (existingRequestHash === null) {
    return "new";
  }

  return existingRequestHash === incomingRequestHash ? "replay" : "conflict";
}

export function evaluateLearningAttempt(input: LearningAttemptInput): LearningAttemptResult {
  const eligibility = determineMasteryEligibility(input.context, input.answerContract.mode);
  const answer =
    input.context.incident === "none" ? evaluateAnswer(input.answerContract, input.response) : null;
  const next =
    eligibility.eligible && answer !== null
      ? updateMastery({
          algorithmVersion: input.algorithmVersion,
          currentMastery: input.currentMastery,
          correctness: answer.correctness,
          mode: input.evidence.mode,
          difficulty: input.evidence.difficulty,
          spacing: input.evidence.spacing,
        })
      : input.currentMastery;

  return {
    answer,
    eligibility,
    mastery: {
      algorithmVersion: input.algorithmVersion,
      previous: input.currentMastery,
      next,
      changed: next !== input.currentMastery,
    },
  };
}
