import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const schemaRoot = new URL("../docs/schemas/", import.meta.url);
const zeroHash = "0".repeat(64);

const schemaFiles = {
  exercise: "exercise.schema.json",
  "content-pack": "content-pack.schema.json",
  "narrative-pack": "narrative-pack.schema.json",
  "learning-node": "learning-node.schema.json",
};

async function loadJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

const schemas = Object.fromEntries(
  await Promise.all(
    Object.entries(schemaFiles).map(async ([kind, file]) => [
      kind,
      await loadJson(new URL(file, schemaRoot)),
    ]),
  ),
);

const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  strictRequired: false,
  strictTypes: false,
});
addFormats(ajv);
ajv.addSchema(schemas.exercise);

const schemaValidators = Object.fromEntries(
  Object.entries(schemas).map(([kind, schema]) => [
    kind,
    ajv.getSchema(schema.$id) ?? ajv.compile(schema),
  ]),
);

function finding(code, path, message, severity = "error") {
  return { code, path, severity, message };
}

export function validateArtifactSchema(kind, artifact) {
  const validate = schemaValidators[kind];
  if (!validate) {
    throw new TypeError(`Unsupported artifact kind: ${kind}`);
  }

  const valid = validate(artifact);
  return {
    valid,
    issues: valid
      ? []
      : (validate.errors ?? []).map((error) => ({
          keyword: error.keyword,
          message: error.message ?? "Schema validation failed.",
          path: error.instancePath || "/",
          schemaPath: error.schemaPath,
        })),
  };
}

export function computeContentHash(artifact) {
  const canonical = structuredClone(artifact);
  canonical.contentHash = zeroHash;
  return createHash("sha256").update(JSON.stringify(canonical), "utf8").digest("hex");
}

export function validateExerciseSemantics(exercise) {
  const findings = [];
  const role = exercise.authoring?.contentRole;

  if (role === "hinted_practice" && exercise.evidenceEligibility !== "practice") {
    findings.push(
      finding(
        "exercise.hinted_practice.must_be_practice",
        "/evidenceEligibility",
        "A hinted-practice item cannot produce mastery evidence.",
      ),
    );
  }

  if (role === "hinted_practice" && exercise.hint?.changesAttemptToPracticeOnly !== true) {
    findings.push(
      finding(
        "exercise.hinted_practice.requires_hint_contract",
        "/hint",
        "A hinted-practice item must declare a practice-only hint consequence.",
      ),
    );
  }

  if (["single_choice", "multiple_choice"].includes(exercise.exerciseType)) {
    const optionIds = new Set((exercise.options ?? []).map((option) => option.id));
    for (const answer of exercise.scoring?.acceptedAnswers ?? []) {
      if (!optionIds.has(answer)) {
        findings.push(
          finding(
            "exercise.answer.unknown_option",
            "/scoring/acceptedAnswers",
            `Accepted option '${answer}' does not exist in the option set.`,
          ),
        );
      }
    }
  }

  if (exercise.evidenceEligibility === "mastery" && exercise.scoring?.mode === "normalized_text") {
    if (exercise.scoring.declaredVariantsOnly !== true) {
      findings.push(
        finding(
          "exercise.mastery.declared_variants_required",
          "/scoring/declaredVariantsOnly",
          "Mastery text answers must use declared variants only.",
        ),
      );
    }
    if (exercise.scoring.fuzzyMatching !== false) {
      findings.push(
        finding(
          "exercise.mastery.fuzzy_matching_prohibited",
          "/scoring/fuzzyMatching",
          "Fuzzy matching is prohibited for mastery evidence.",
        ),
      );
    }
  }

  if (exercise.mistakeTags?.includes("invalid_ambiguity")) {
    findings.push(
      finding(
        "exercise.ambiguity.manual_review_required",
        "/mistakeTags",
        "Declared answer ambiguity requires a human content-contract decision.",
        "manual_review",
      ),
    );
  }

  return findings;
}

function schemaFindings(kind, artifact, path) {
  const result = validateArtifactSchema(kind, artifact);
  return result.issues.map((issue) =>
    finding(
      `schema.${kind}.${issue.keyword}`,
      `${path}${issue.path === "/" ? "" : issue.path}` || "/",
      issue.message,
    ),
  );
}

function englishWordCount(text) {
  return text.trim().split(/\s+/u).filter(Boolean).length;
}

function validateNarrativeReferences(narrativePack, nodeIds) {
  const findings = [];
  const missionIds = new Set(narrativePack.missions.map((mission) => mission.missionId));
  const episodeIds = new Set(narrativePack.episodes.map((episode) => episode.episodeId));
  const characterIds = new Set(narrativePack.characters ?? []);

  narrativePack.episodes.forEach((episode, episodeIndex) => {
    episode.missionIds.forEach((missionId, missionIndex) => {
      if (!missionIds.has(missionId)) {
        findings.push(
          finding(
            "narrative.reference.mission_missing",
            `/episodes/${episodeIndex}/missionIds/${missionIndex}`,
            `Episode references unknown mission '${missionId}'.`,
          ),
        );
      }
    });
  });

  narrativePack.missions.forEach((mission, missionIndex) => {
    if (!episodeIds.has(mission.episodeId)) {
      findings.push(
        finding(
          "narrative.reference.episode_missing",
          `/missions/${missionIndex}/episodeId`,
          `Mission references unknown episode '${mission.episodeId}'.`,
        ),
      );
    }

    mission.activeCharacterIds.forEach((characterId, characterIndex) => {
      if (!characterIds.has(characterId)) {
        findings.push(
          finding(
            "narrative.reference.character_missing",
            `/missions/${missionIndex}/activeCharacterIds/${characterIndex}`,
            `Mission references unknown character '${characterId}'.`,
          ),
        );
      }
    });

    mission.exerciseSlots.forEach((slot, slotIndex) => {
      slot.allowedLearningNodeIds.forEach((nodeId, nodeIndex) => {
        if (!nodeIds.has(nodeId)) {
          findings.push(
            finding(
              "narrative.reference.learning_node_missing",
              `/missions/${missionIndex}/exerciseSlots/${slotIndex}/allowedLearningNodeIds/${nodeIndex}`,
              `Exercise slot references unknown learning node '${nodeId}'.`,
            ),
          );
        }
      });
    });

    if (
      mission.unlock.mode === "after_mission" &&
      !missionIds.has(mission.unlock.prerequisiteMissionId)
    ) {
      findings.push(
        finding(
          "narrative.reference.prerequisite_missing",
          `/missions/${missionIndex}/unlock/prerequisiteMissionId`,
          `Mission prerequisite '${mission.unlock.prerequisiteMissionId}' does not exist.`,
        ),
      );
    }
  });

  return findings;
}

function validateCopyBudgets(narrativePack) {
  const findings = [];
  const copies = [
    ...(narrativePack.prologue?.cards ?? []).map((copy, index) => [
      `/prologue/cards/${index}/en`,
      copy.en,
    ]),
    ...narrativePack.missions.flatMap((mission, index) => [
      [`/missions/${index}/setup/en`, mission.setup.en],
      [`/missions/${index}/storyBeat/en`, mission.storyBeat.en],
    ]),
  ];

  for (const [path, copy] of copies) {
    const words = englishWordCount(copy);
    if (words < 20 || words > 60) {
      findings.push(
        finding(
          "narrative.copy.word_budget",
          path,
          `Narrative copy has ${words} words; the approved budget is 20–60.`,
        ),
      );
    }
  }
  return findings;
}

function validateProofContract({ contentPacks, learningNodes, narrativePack, exercises }) {
  const findings = [];
  const selectedNodeIds = new Set(learningNodes.map((node) => node.learningNodeId));

  if (exercises.length !== 12) {
    findings.push(
      finding(
        "proof.exercise_count",
        "/contentPacks",
        `The P-031 first run requires 12 exercises; found ${exercises.length}.`,
      ),
    );
  }

  exercises.forEach((exercise, exerciseIndex) => {
    if (!exercise.authoring) {
      findings.push(
        finding(
          "proof.exercise.authoring_required",
          `/exercises/${exerciseIndex}/authoring`,
          `Proof exercise '${exercise.exerciseId}' requires structured authoring and provenance metadata.`,
        ),
      );
    }
  });

  for (const nodeId of selectedNodeIds) {
    const nodeExercises = exercises.filter((exercise) => exercise.learningNodeId === nodeId);
    if (nodeExercises.length !== 4) {
      findings.push(
        finding(
          "proof.node.exercise_count",
          "/contentPacks",
          `Learning node '${nodeId}' requires 4 proof exercises; found ${nodeExercises.length}.`,
        ),
      );
    }

    const formats = new Set(nodeExercises.map((exercise) => exercise.exerciseType));
    if (formats.size < 2) {
      findings.push(
        finding(
          "proof.node.format_coverage",
          "/contentPacks",
          `Learning node '${nodeId}' requires at least two exercise formats.`,
        ),
      );
    }

    const roles = new Set(nodeExercises.map((exercise) => exercise.authoring?.contentRole));
    for (const role of ["core_mastery", "hinted_practice", "independent_review_transfer"]) {
      if (!roles.has(role)) {
        findings.push(
          finding(
            "proof.node.role_coverage",
            "/contentPacks",
            `Learning node '${nodeId}' is missing content role '${role}'.`,
          ),
        );
      }
    }
  }

  if (narrativePack.missions.length !== 3) {
    findings.push(
      finding(
        "proof.mission_count",
        "/narrativePack/missions",
        `The P-031 mini-episode requires 3 missions; found ${narrativePack.missions.length}.`,
      ),
    );
  }

  const missionOrders = narrativePack.missions
    .map((mission) => mission.order)
    .sort((a, b) => a - b);
  if (JSON.stringify(missionOrders) !== JSON.stringify([1, 2, 3])) {
    findings.push(
      finding(
        "proof.mission.order",
        "/narrativePack/missions",
        "The P-031 missions must have the unique sequence 1, 2, 3.",
      ),
    );
  }

  narrativePack.missions.forEach((mission, missionIndex) => {
    if (mission.exerciseSlots.length !== 4) {
      findings.push(
        finding(
          "proof.mission.slot_count",
          `/narrativePack/missions/${missionIndex}/exerciseSlots`,
          `Proof mission '${mission.missionId}' requires exactly four exercise slots.`,
        ),
      );
    }

    if (!/^(Dossier updated:|Context restored:)/u.test(mission.checkpointCopy.en)) {
      findings.push(
        finding(
          "proof.mission.observable_dossier_change",
          `/narrativePack/missions/${missionIndex}/checkpointCopy/en`,
          `Proof mission '${mission.missionId}' must state its observable dossier change at the checkpoint.`,
        ),
      );
    }

    mission.exerciseSlots.forEach((slot, slotIndex) => {
      const compatible = exercises.some(
        (exercise) =>
          slot.allowedLearningNodeIds.includes(exercise.learningNodeId) &&
          slot.allowedExerciseTypes.includes(exercise.exerciseType) &&
          slot.progressChannel === exercise.evidenceEligibility,
      );
      if (!compatible) {
        findings.push(
          finding(
            "proof.slot.no_compatible_exercise",
            `/narrativePack/missions/${missionIndex}/exerciseSlots/${slotIndex}`,
            `Slot '${slot.slotId}' has no compatible exercise.`,
          ),
        );
      }
    });
  });

  for (const [packIndex, pack] of [...contentPacks, narrativePack].entries()) {
    if (pack.rollbackTarget?.mode !== "deactivate") {
      findings.push(
        finding(
          "proof.rollback.initial_pack_must_deactivate",
          packIndex < contentPacks.length
            ? `/contentPacks/${packIndex}/rollbackTarget`
            : "/narrativePack/rollbackTarget",
          "An initial proof pack must declare an explicit deactivate rollback target.",
        ),
      );
    }
  }

  findings.push(...validateCopyBudgets(narrativePack));
  return findings;
}

export function validateVerticalSlice({
  contentPacks,
  learningNodes,
  narrativePack,
  proofContract = true,
  verifyHashes = true,
}) {
  const findings = [];

  contentPacks.forEach((pack, index) => {
    findings.push(...schemaFindings("content-pack", pack, `/contentPacks/${index}`));
  });
  learningNodes.forEach((node, index) => {
    findings.push(...schemaFindings("learning-node", node, `/learningNodes/${index}`));
  });
  findings.push(...schemaFindings("narrative-pack", narrativePack, "/narrativePack"));

  if (findings.some(({ code }) => code.startsWith("schema."))) {
    return {
      valid: false,
      findings,
      summary: {
        contentPacks: contentPacks.length,
        exercises: 0,
        learningNodes: learningNodes.length,
        missions: narrativePack.missions?.length ?? 0,
      },
    };
  }

  const exercises = contentPacks.flatMap((pack) => pack.exercises);
  const nodeById = new Map(learningNodes.map((node) => [node.learningNodeId, node]));
  const exerciseIds = new Set();

  exercises.forEach((exercise, index) => {
    findings.push(...validateExerciseSemantics(exercise));

    if (exerciseIds.has(exercise.exerciseId)) {
      findings.push(
        finding(
          "content.exercise.duplicate_id",
          `/exercises/${index}/exerciseId`,
          `Duplicate exercise ID '${exercise.exerciseId}'.`,
        ),
      );
    }
    exerciseIds.add(exercise.exerciseId);

    const node = nodeById.get(exercise.learningNodeId);
    if (!node) {
      findings.push(
        finding(
          "content.reference.learning_node_missing",
          `/exercises/${index}/learningNodeId`,
          `Exercise references unknown learning node '${exercise.learningNodeId}'.`,
        ),
      );
    } else if (node.skill !== exercise.skill) {
      findings.push(
        finding(
          "content.exercise.skill_mismatch",
          `/exercises/${index}/skill`,
          `Exercise skill '${exercise.skill}' does not match learning node skill '${node.skill}'.`,
        ),
      );
    }
  });

  contentPacks.forEach((pack, packIndex) => {
    pack.exercises.forEach((exercise, exerciseIndex) => {
      if (exercise.skill !== pack.skill) {
        findings.push(
          finding(
            "content.pack.skill_mismatch",
            `/contentPacks/${packIndex}/exercises/${exerciseIndex}/skill`,
            `Exercise skill '${exercise.skill}' does not match pack skill '${pack.skill}'.`,
          ),
        );
      }
    });
  });

  findings.push(...validateNarrativeReferences(narrativePack, new Set(nodeById.keys())));

  if (verifyHashes) {
    [...contentPacks, narrativePack].forEach((pack, index) => {
      const actualHash = computeContentHash(pack);
      if (actualHash !== pack.contentHash) {
        findings.push(
          finding(
            "pack.hash.mismatch",
            index < contentPacks.length
              ? `/contentPacks/${index}/contentHash`
              : "/narrativePack/contentHash",
            `Declared content hash does not match canonical SHA-256 '${actualHash}'.`,
          ),
        );
      }
    });
  }

  if (proofContract) {
    findings.push(
      ...validateProofContract({ contentPacks, learningNodes, narrativePack, exercises }),
    );
  }

  return {
    valid: findings.length === 0,
    findings,
    summary: {
      contentPacks: contentPacks.length,
      exercises: exercises.length,
      learningNodes: learningNodes.length,
      missions: narrativePack.missions.length,
    },
  };
}
