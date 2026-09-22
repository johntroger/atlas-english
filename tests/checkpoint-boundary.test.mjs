import assert from "node:assert/strict";
import test from "node:test";

const { checkpointState, resolveReleaseBoundary } = await import(
  "../src/application/checkpoints/release-boundary.ts"
);

test("a content-release mismatch becomes pending only at a checkpoint boundary", () => {
  assert.deepEqual(resolveReleaseBoundary("vs-08.1"), {
    updatePending: false,
    serverRelease: "vs-08.1",
  });
  assert.deepEqual(resolveReleaseBoundary("older-release"), {
    updatePending: true,
    serverRelease: "vs-08.1",
  });
});

test("only the first final completion can present the fixed reward state", () => {
  assert.equal(checkpointState(false, false), "interim_ready");
  assert.equal(checkpointState(true, false), "final_first_completion");
  assert.equal(checkpointState(true, true), "final_replay");
});
