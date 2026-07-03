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
const runbookDir = resolve(dirname(scriptPath), "..");
const knownSkills = ["question", "research"];
const args = process.argv.slice(2);

let targetRoot = process.cwd();
if (args[0] && (args[0].startsWith(".") || args[0].startsWith("/") || args[0].startsWith("~"))) {
  targetRoot = resolve(args.shift().replace(/^~(?=$|\/)/, process.env.HOME ?? "~"));
}

const selectedSkills = args.length > 0 ? args : knownSkills;

for (const skill of selectedSkills) {
  if (!knownSkills.includes(skill)) {
    throw new Error(`Unknown skill "${skill}". Known skills: ${knownSkills.join(", ")}`);
  }

  const sourceRoot = join(runbookDir, "skills", skill, "assets", "claude");
  copyMarkdownFiles(`${skill} commands`, join(sourceRoot, "commands"), join(targetRoot, ".claude", "commands"));
  copyMarkdownFiles(`${skill} agents`, join(sourceRoot, "agents"), join(targetRoot, ".claude", "agents"));
}

removeLocalLockEntries(targetRoot, selectedSkills);

console.log(`Installed Claude assets for ${selectedSkills.join(", ")} in ${targetRoot}`);

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

function removeLocalLockEntries(root, skills) {
  const lockPath = join(root, "skills-lock.json");
  if (!existsSync(lockPath)) return;

  const lock = JSON.parse(readFileSync(lockPath, "utf8"));
  if (!lock.skills || typeof lock.skills !== "object") return;

  let changed = false;
  for (const skill of skills) {
    if (lock.skills[skill]?.sourceType === "local") {
      delete lock.skills[skill];
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
    console.log(`Removed local ${skills.join(", ")} entries from ${lockPath}`);
  }
}
