import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const domainRoot = join(root, "src", "domain");
const sourceExtensions = new Set([".ts", ".tsx"]);
const forbiddenImports = [
  /^react(?:\/|$)/,
  /^next(?:\/|$)/,
  /^@supabase\//,
  /^@\/(?:app|infrastructure|ui)(?:\/|$)/,
];

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(path)));
    } else if (sourceExtensions.has(extname(entry.name))) {
      files.push(path);
    }
  }

  return files;
}

const importPattern = /(?:from\s+|import\s*\()["']([^"']+)["']/g;
const findings = [];

for (const file of await collectSourceFiles(domainRoot)) {
  const content = await readFile(file, "utf8");
  for (const match of content.matchAll(importPattern)) {
    const specifier = match[1];
    if (forbiddenImports.some((pattern) => pattern.test(specifier))) {
      findings.push(`${relative(root, file)} imports forbidden module ${specifier}`);
    }
  }
}

if (findings.length > 0) {
  console.error(`Architecture boundary violations:\n${findings.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log("Architecture boundary check passed.");
}
