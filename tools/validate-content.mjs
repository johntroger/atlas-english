import { readFile } from "node:fs/promises";

import {
  validateArtifactSchema,
  validateExerciseSemantics,
  validateVerticalSlice,
} from "./content-validator.mjs";

const fixtureRoot = new URL("../docs/schemas/fixtures/", import.meta.url);

async function fixture(name) {
  return JSON.parse(await readFile(new URL(name, fixtureRoot), "utf8"));
}

const schemaCases = [
  ["exercise", "exercise-ambiguous.semantic-invalid.json", true],
  ["exercise", "exercise-fuzzy-answer.invalid.json", false],
  ["exercise", "exercise-hinted-mastery.semantic-invalid.json", true],
  ["exercise", "exercise-self-review-mastery.invalid.json", false],
  ["exercise", "exercise-self-review.valid.json", true],
  ["learning-node", "learning-node-cause-effect.valid.json", true],
  ["learning-node", "learning-node-external-mastery.invalid.json", false],
  ["learning-node", "learning-node-external.valid.json", true],
  ["learning-node", "learning-node-hybrid.valid.json", true],
  ["learning-node", "learning-node-nouns-countability.valid.json", true],
  ["learning-node", "learning-node-self-review-mastery.invalid.json", false],
  ["learning-node", "learning-node-sentence-boundaries.valid.json", true],
  ["narrative-pack", "narrative-pack-broken-reference.semantic-invalid.json", true],
  ["narrative-pack", "narrative-pack-too-many-slots.invalid.json", false],
  ["narrative-pack", "narrative-pack.valid.json", true],
  ["content-pack", "vertical-slice-grammar-proof-pack.valid.json", true],
  ["narrative-pack", "vertical-slice-narrative-pack.valid.json", true],
  ["content-pack", "vertical-slice-vocabulary-proof-pack.valid.json", true],
];

async function main() {
  const failures = [];

  for (const [kind, name, expectedValid] of schemaCases) {
    const result = validateArtifactSchema(kind, await fixture(name));
    if (result.valid !== expectedValid) {
      failures.push({
        check: `schema:${name}`,
        expected: expectedValid ? "valid" : "invalid",
        issues: result.issues,
      });
    }
  }

  const learningNodes = await Promise.all(
    [
      "learning-node-sentence-boundaries.valid.json",
      "learning-node-nouns-countability.valid.json",
      "learning-node-cause-effect.valid.json",
    ].map(fixture),
  );
  const contentPacks = await Promise.all(
    [
      "vertical-slice-grammar-proof-pack.valid.json",
      "vertical-slice-vocabulary-proof-pack.valid.json",
    ].map(fixture),
  );
  const narrativePack = await fixture("vertical-slice-narrative-pack.valid.json");
  const proofResult = validateVerticalSlice({ contentPacks, learningNodes, narrativePack });
  if (!proofResult.valid) {
    failures.push({ check: "semantic:P-031-proof", issues: proofResult.findings });
  }

  const hintedFindings = validateExerciseSemantics(
    await fixture("exercise-hinted-mastery.semantic-invalid.json"),
  );
  if (!hintedFindings.some(({ code }) => code === "exercise.hinted_practice.must_be_practice")) {
    failures.push({ check: "semantic:hinted-mastery", issues: hintedFindings });
  }

  const ambiguityFindings = validateExerciseSemantics(
    await fixture("exercise-ambiguous.semantic-invalid.json"),
  );
  if (
    !ambiguityFindings.some(
      ({ code, severity }) =>
        code === "exercise.ambiguity.manual_review_required" && severity === "manual_review",
    )
  ) {
    failures.push({ check: "semantic:ambiguity-manual-review", issues: ambiguityFindings });
  }

  const brokenResult = validateVerticalSlice({
    contentPacks: [],
    learningNodes,
    narrativePack: await fixture("narrative-pack-broken-reference.semantic-invalid.json"),
    proofContract: false,
    verifyHashes: false,
  });
  const brokenReferenceCount = brokenResult.findings.filter(({ code }) =>
    code.startsWith("narrative.reference."),
  ).length;
  if (brokenReferenceCount !== 7) {
    failures.push({
      check: "semantic:broken-references",
      expected: 7,
      actual: brokenReferenceCount,
      issues: brokenResult.findings,
    });
  }

  if (failures.length > 0) {
    console.error(JSON.stringify({ valid: false, failures }, null, 2));
    process.exitCode = 1;
    return;
  }

  console.log(
    JSON.stringify(
      {
        valid: true,
        schemaCases: schemaCases.length,
        semanticCases: 4,
        proofSummary: proofResult.summary,
        manualReviewClasses: ["natural-language answer ambiguity"],
      },
      null,
      2,
    ),
  );
}

await main();
