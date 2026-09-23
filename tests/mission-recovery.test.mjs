import assert from "node:assert/strict";
import test from "node:test";

const { parseCurrentChoiceRecovery, parseStoryCheckpointRecovery } = await import(
  "../src/ui/mission/recovery.ts"
);

const now = 1_800_000_000_000;

test("a valid current choice recovery resumes the exact short-lived question", () => {
  const recovery = parseCurrentChoiceRecovery(
    JSON.stringify({
      missionIndex: 1,
      questionIndex: 0,
      response: ["option-b"],
      hintUsed: false,
      expiresAt: now + 1,
    }),
    3,
    4,
    now,
  );
  assert.deepEqual(recovery, {
    missionIndex: 1,
    questionIndex: 0,
    response: ["option-b"],
    hintUsed: false,
    expiresAt: now + 1,
  });
});

test("a valid story checkpoint resumes the next mission but expired or malformed values fail closed", () => {
  assert.deepEqual(
    parseStoryCheckpointRecovery(
      JSON.stringify({ nextMissionIndex: 1, expiresAt: now + 1 }),
      3,
      now,
    ),
    { nextMissionIndex: 1, expiresAt: now + 1 },
  );
  assert.equal(
    parseStoryCheckpointRecovery(
      JSON.stringify({ nextMissionIndex: 3, expiresAt: now + 1 }),
      3,
      now,
    ),
    undefined,
  );
  assert.equal(
    parseStoryCheckpointRecovery(JSON.stringify({ nextMissionIndex: 1, expiresAt: now }), 3, now),
    undefined,
  );
});
