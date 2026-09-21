import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([".git", ".next", "node_modules", "coverage"]);
const ignoredFiles = new Set(["package-lock.json"]);
const readableExtensions = new Set([
  ".css",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml",
]);
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\b(?:SUPABASE_SERVICE_ROLE_KEY|VERCEL_TOKEN|GITHUB_TOKEN)\s*=\s*[^\s#]+/,
  /\bsk_(?:live|test)_[A-Za-z0-9]{16,}/,
  /\bgh[opurs]_[A-Za-z0-9]{20,}/,
];

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(path)));
    } else if (!ignoredFiles.has(entry.name) && readableExtensions.has(extname(entry.name))) {
      files.push(path);
    }
  }

  return files;
}

const findings = [];
for (const file of await collectFiles(root)) {
  const content = await readFile(file, "utf8");
  for (const pattern of secretPatterns) {
    if (pattern.test(content)) {
      findings.push(`${relative(root, file)} matched ${pattern}`);
    }
  }
}

if (findings.length > 0) {
  console.error(`Potential secrets found:\n${findings.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log("Secret scan passed.");
}
