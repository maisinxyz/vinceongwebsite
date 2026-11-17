#!/usr/bin/env node
/* ═══════════════════════════════════════════════════
   WAVE-0 TOKEN CODEMOD (CONTRACT 1.8)
   Replaces legacy text-opacity classes and palette literals with tokens.

   node scripts/codemods/text-tokens.mjs            dry run: per-rule counts, no writes
   node scripts/codemods/text-tokens.mjs --write    apply the replacements
   node scripts/codemods/text-tokens.mjs --check    exit 1 listing file:line for any hit,
                                                    else print "0 remaining" and exit 0
   --root <dir>   project root to scan (default: the directory above scripts/)

   Scope: app/** and components/** *.ts / *.tsx, minus the excluded files.
   No dependencies.
   ═══════════════════════════════════════════════════ */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const CHECK = args.includes("--check");
const rootIdx = args.indexOf("--root");
const ROOT = rootIdx >= 0 ? args[rootIdx + 1] : fileURLToPath(new URL("../../", import.meta.url));

if (WRITE && CHECK) {
  console.error("Use either --write or --check, not both.");
  process.exit(2);
}

const SCAN_DIRS = ["app", "components"];
const EXCLUDED = new Set([
  "components/LaptopScrollReveal.tsx", // laptop deletes it
  "components/PlayingCards.tsx", // bg-black is the physical card frame; landing decides
]);

// Order matters: rule 5 runs before rule 6. Each regex runs on the whole file;
// the leading capture group keeps any variant prefix chain (hover:, before:, sm:, …).
const RULES = [
  { id: 1, re: /(?<![\w/-])((?:[\w-]+:)*)text-silver\/(?:20|25|30|35|40|45|50|55|60)(?![\w/])/g, to: "$1text-subtle" },
  { id: 2, re: /(?<![\w/-])((?:[\w-]+:)*)text-steel\/\d+(?![\w/])/g, to: "$1text-subtle" },
  { id: 3, re: /(?<![\w/-])((?:[\w-]+:)*)text-silver\/(?:70|80|90)(?![\w/])/g, to: "$1text-silver" },
  { id: 4, re: /(?<![\w/-])((?:[\w-]+:)*)text-chalk\/\d+(?![\w/])/g, to: "$1text-chalk" },
  { id: 5, re: /\s?selection:(?:bg-silver\/30|text-white)(?![\w/])/g, to: "" },
  { id: 6, re: /(?<![\w/-])((?:[\w-]+:)*)text-white(?![\w/-])/g, to: "$1text-chalk" },
  { id: 7, re: /(?<![\w/-])((?:[\w-]+:)*)bg-black(?![\w/-])/g, to: "$1bg-void" },
  { id: 8, re: /hover:bg-white hover:text-black/g, to: "hover:bg-chalk hover:text-void" },
];

function walk(dir) {
  let out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out = out.concat(walk(full));
    else if (/\.(ts|tsx)$/.test(name)) out.push(full);
  }
  return out;
}

const files = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)))
  .map((full) => ({ full, rel: relative(ROOT, full).split(sep).join("/") }))
  .filter((f) => !EXCLUDED.has(f.rel))
  .sort((a, b) => a.rel.localeCompare(b.rel));

const counts = Object.fromEntries(RULES.map((r) => [r.id, 0]));
const hits = [];
let changedFiles = 0;

for (const { full, rel } of files) {
  const original = readFileSync(full, "utf8");
  let text = original;
  for (const rule of RULES) {
    if (CHECK) {
      // Report each match on the original text, by line
      for (const m of original.matchAll(rule.re)) {
        const line = original.slice(0, m.index).split("\n").length;
        hits.push(`${rel}:${line}  rule ${rule.id}  ${m[0].trim()}`);
      }
      continue;
    }
    text = text.replace(rule.re, (...m) => {
      counts[rule.id] += 1;
      return rule.to.replace("$1", m[1] ?? "");
    });
  }
  if (!CHECK && text !== original) {
    changedFiles += 1;
    if (WRITE) writeFileSync(full, text);
  }
}

if (CHECK) {
  if (hits.length) {
    console.log(hits.join("\n"));
    console.log(`${hits.length} remaining`);
    process.exit(1);
  }
  console.log("0 remaining");
  process.exit(0);
}

const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log(RULES.map((r) => `rule ${r.id}: ${counts[r.id]}`).join("\n"));
console.log(`${total} replacements in ${changedFiles} files${WRITE ? " (written)" : " (dry run, nothing written)"}`);
