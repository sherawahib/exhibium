import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../public/projects"
);

const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".jpg") && !f.startsWith("_"));

const byHash = new Map();
for (const f of files) {
  const buf = fs.readFileSync(path.join(dir, f));
  const key = `${buf.length}:${buf[100]}:${buf[1000]}:${buf[5000]}`;
  const list = byHash.get(key) || [];
  list.push(f);
  byHash.set(key, list);
}

const uniques = [];
const dups = [];
for (const [, list] of byHash) {
  uniques.push(list[0]);
  for (const f of list.slice(1)) dups.push(f);
}

console.log("unique sources", uniques.length, "dups to reassign", dups.length);

for (let i = 0; i < dups.length; i++) {
  const src = uniques[i % uniques.length];
  // Prefer a different source than previous
  const pick = uniques[(i * 3 + 1) % uniques.length];
  fs.copyFileSync(path.join(dir, pick), path.join(dir, dups[i]));
  console.log(dups[i], "←", pick);
}

// refresh fallback
fs.copyFileSync(path.join(dir, uniques[0]), path.join(dir, "_retail.jpg"));
console.log("done");
