#!/usr/bin/env node
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const skillDir = resolve(dirname(scriptPath), "..");
const targetRoot = resolve(process.argv[2] ?? process.cwd());
const sourceRoot = join(skillDir, "assets", "claude");

copyMarkdownFiles("question commands", join(sourceRoot, "commands"), join(targetRoot, ".claude", "commands"));
copyMarkdownFiles("question agents", join(sourceRoot, "agents"), join(targetRoot, ".claude", "agents"));
removeLocalLockEntry(targetRoot, "question");

console.log(`Question slash command installed in ${targetRoot}`);

function copyMarkdownFiles(label, fromDir, toDir) {
  if (!existsSync(fromDir) || !statSync(fromDir).isDirectory()) {
    throw new Error(`Missing bundled ${label} directory: ${fromDir}`);
  }

  mkdirSync(toDir, { recursive: true });

  let count = 0;
  for (const name of readdirSync(fromDir)) {
    if (!name.endsWith(".md")) continue;
    copyFileSync(join(fromDir, name), join(toDir, name));
    count += 1;
  }

  console.log(`Installed ${count} ${label} into ${toDir}`);
}

function removeLocalLockEntry(root, skill) {
  const lockPath = join(root, "skills-lock.json");
  if (!existsSync(lockPath)) return;

  const lock = JSON.parse(readFileSync(lockPath, "utf8"));
  if (lock.skills?.[skill]?.sourceType !== "local") return;

  delete lock.skills[skill];
  writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
  console.log(`Removed local ${skill} entry from ${lockPath}`);
}
