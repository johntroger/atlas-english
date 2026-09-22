import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

test("foundation scripts required by VS-01 are present", async () => {
  const packageJson = JSON.parse(await readFile(join(projectRoot, "package.json"), "utf8"));

  for (const script of [
    "build",
    "boundary:check",
    "format:check",
    "lint",
    "typecheck",
    "test",
    "secret:check",
    "check",
  ]) {
    assert.equal(typeof packageJson.scripts[script], "string", `missing ${script}`);
  }
});

test("secret-bearing environment files are ignored", async () => {
  const gitignore = await readFile(join(projectRoot, ".gitignore"), "utf8");

  assert.match(gitignore, /^\.env$/m);
  assert.match(gitignore, /^\.env\.\*$/m);
  assert.match(gitignore, /^!\.env\.example$/m);
});

test("Next.js type declarations remain versioned", async () => {
  const gitignore = await readFile(join(projectRoot, ".gitignore"), "utf8");

  assert.doesNotMatch(gitignore, /^next-env\.d\.ts$/m);
  await readFile(join(projectRoot, "next-env.d.ts"), "utf8");
});

test("repository text files use stable LF line endings", async () => {
  const attributes = await readFile(join(projectRoot, ".gitattributes"), "utf8");

  assert.match(attributes, /^\* text=auto eol=lf$/m);
});

test("architecture boundary directories exist", async () => {
  const sourceEntries = await readdir(join(projectRoot, "src"));

  for (const directory of ["app", "application", "domain", "infrastructure", "ui"]) {
    assert.ok(sourceEntries.includes(directory), `missing src/${directory}`);
  }
});

test("GitHub Actions are pinned to immutable commits", async () => {
  const workflow = await readFile(join(projectRoot, ".github", "workflows", "ci.yml"), "utf8");
  const actionReferences = [...workflow.matchAll(/uses:\s+[^@\s]+@([^\s#]+)/g)].map(
    (match) => match[1],
  );

  assert.ok(actionReferences.length > 0);
  for (const reference of actionReferences) {
    assert.match(reference, /^[a-f0-9]{40}$/);
  }
});
