import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  computeContentHash,
  validateArtifactSchema,
  validateExerciseSemantics,
  validateVerticalSlice,
} from "../tools/content-validator.mjs";

const fixtureRoot = new URL("../docs/schemas/fixtures/", import.meta.url);

async function fixture(name) {
  return JSON.parse(await readFile(new URL(name, fixtureRoot), "utf8"));
}

async function proofArtifacts() {
  return {
    contentPacks: [
      await fixture("vertical-slice-grammar-proof-pack.valid.json"),
      await fixture("vertical-slice-vocabulary-proof-pack.valid.json"),
    ],
    narrativePack: await fixture("vertical-slice-narrative-pack.valid.json"),
    learningNodes: [
      await fixture("learning-node-sentence-boundaries.valid.json"),
      await fixture("learning-node-nouns-countability.valid.json"),
      await fixture("learning-node-cause-effect.valid.json"),
    ],
  };
}

test("approved proof artifacts pass their JSON Schemas", async () => {
  const cases = [
    ["content-pack", "vertical-slice-grammar-proof-pack.valid.json"],
    ["content-pack", "vertical-slice-vocabulary-proof-pack.valid.json"],
    ["narrative-pack", "vertical-slice-narrative-pack.valid.json"],
    ["learning-node", "learning-node-sentence-boundaries.valid.json"],
    ["learning-node", "learning-node-nouns-countability.valid.json"],
    ["learning-node", "learning-node-cause-effect.valid.json"],
  ];

  for (const [kind, name] of cases) {
    const result = validateArtifactSchema(kind, await fixture(name));
    assert.equal(result.valid, true, `${name}: ${JSON.stringify(result.issues)}`);
  }
});

test("known schema-invalid fixtures are rejected", async () => {
  const cases = [
    ["exercise", "exercise-fuzzy-answer.invalid.json"],
    ["narrative-pack", "narrative-pack-too-many-slots.invalid.json"],
    ["learning-node", "learning-node-self-review-mastery.invalid.json"],
    ["learning-node", "learning-node-external-mastery.invalid.json"],
  ];

  for (const [kind, name] of cases) {
    const result = validateArtifactSchema(kind, await fixture(name));
    assert.equal(result.valid, false, `${name} unexpectedly passed`);
    assert.ok(result.issues.length > 0);
  }
});

test("semantic-invalid fixtures remain schema-valid", async () => {
  const cases = [
    ["exercise", "exercise-hinted-mastery.semantic-invalid.json"],
    ["exercise", "exercise-ambiguous.semantic-invalid.json"],
    ["narrative-pack", "narrative-pack-broken-reference.semantic-invalid.json"],
  ];

  for (const [kind, name] of cases) {
    const result = validateArtifactSchema(kind, await fixture(name));
    assert.equal(result.valid, true, `${name}: ${JSON.stringify(result.issues)}`);
  }
});

test("hinted practice cannot claim mastery evidence", async () => {
  const exercise = await fixture("exercise-hinted-mastery.semantic-invalid.json");
  const findings = validateExerciseSemantics(exercise);

  assert.ok(findings.some(({ code }) => code === "exercise.hinted_practice.must_be_practice"));
});

test("declared ambiguity is routed to manual review, not guessed automatically", async () => {
  const exercise = await fixture("exercise-ambiguous.semantic-invalid.json");
  const findings = validateExerciseSemantics(exercise);

  assert.deepEqual(findings, [
    {
      code: "exercise.ambiguity.manual_review_required",
      path: "/mistakeTags",
      severity: "manual_review",
      message: "Declared answer ambiguity requires a human content-contract decision.",
    },
  ]);
});

test("broken narrative fixture produces the seven expected reference failures", async () => {
  const result = validateVerticalSlice({
    contentPacks: [],
    learningNodes: [
      await fixture("learning-node-sentence-boundaries.valid.json"),
      await fixture("learning-node-nouns-countability.valid.json"),
      await fixture("learning-node-cause-effect.valid.json"),
    ],
    narrativePack: await fixture("narrative-pack-broken-reference.semantic-invalid.json"),
    proofContract: false,
    verifyHashes: false,
  });

  assert.equal(result.valid, false);
  assert.equal(
    result.findings.filter(({ code }) => code.startsWith("narrative.reference.")).length,
    7,
  );
});

test("the complete P-031 vertical slice passes semantic validation", async () => {
  const result = validateVerticalSlice(await proofArtifacts());

  assert.equal(result.valid, true, JSON.stringify(result.findings, null, 2));
  assert.equal(result.findings.length, 0);
  assert.deepEqual(result.summary, {
    contentPacks: 2,
    exercises: 12,
    learningNodes: 3,
    missions: 3,
  });
});

test("cross-artifact semantic regressions are rejected with stable reason codes", async () => {
  const unknownAnswer = await proofArtifacts();
  unknownAnswer.contentPacks[0].exercises[0].scoring.acceptedAnswers = ["missing"];
  let result = validateVerticalSlice({ ...unknownAnswer, verifyHashes: false });
  assert.ok(result.findings.some(({ code }) => code === "exercise.answer.unknown_option"));

  const duplicateExercise = await proofArtifacts();
  duplicateExercise.contentPacks[0].exercises[1].exerciseId =
    duplicateExercise.contentPacks[0].exercises[0].exerciseId;
  result = validateVerticalSlice({ ...duplicateExercise, verifyHashes: false });
  assert.ok(result.findings.some(({ code }) => code === "content.exercise.duplicate_id"));

  const incompatibleSlot = await proofArtifacts();
  incompatibleSlot.narrativePack.missions[0].exerciseSlots[0].allowedExerciseTypes = ["dictation"];
  result = validateVerticalSlice({ ...incompatibleSlot, verifyHashes: false });
  assert.ok(result.findings.some(({ code }) => code === "proof.slot.no_compatible_exercise"));

  const missingRole = await proofArtifacts();
  missingRole.contentPacks[0].exercises[3].authoring.contentRole = "core_mastery";
  result = validateVerticalSlice({ ...missingRole, verifyHashes: false });
  assert.ok(result.findings.some(({ code }) => code === "proof.node.role_coverage"));

  const genericCheckpoint = await proofArtifacts();
  genericCheckpoint.narrativePack.missions[0].checkpointCopy.en = "Mission complete.";
  result = validateVerticalSlice({ ...genericCheckpoint, verifyHashes: false });
  assert.ok(result.findings.some(({ code }) => code === "proof.mission.observable_dossier_change"));

  const tamperedPack = await proofArtifacts();
  tamperedPack.contentPacks[0].exercises[0].prompt = "Tampered prompt";
  result = validateVerticalSlice(tamperedPack);
  assert.ok(result.findings.some(({ code }) => code === "pack.hash.mismatch"));
});

test("canonical content hashes match every release proof pack", async () => {
  for (const name of [
    "vertical-slice-grammar-proof-pack.valid.json",
    "vertical-slice-vocabulary-proof-pack.valid.json",
    "vertical-slice-narrative-pack.valid.json",
  ]) {
    const artifact = await fixture(name);
    assert.equal(computeContentHash(artifact), artifact.contentHash, name);
  }
});
