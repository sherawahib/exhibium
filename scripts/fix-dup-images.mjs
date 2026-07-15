import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public", "projects");

const goodIds = [
  "1578916171728-46686eac8d58",
  "1542838132-92c53300491e",
  "1604719312566-891d7a8ddb74",
  "1534723452862-4cca3578e0ee",
  "1441986300917-64674bd600d8",
  "1555529669-e69e7aa0ba9a",
  "1519567241046-7f570eee3ce6",
  "1481437156560-3204869c6a69",
  "1567401807281-458c5a37d33f",
  "1445205170230-053b83016050",
  "1469334031218-e382a71b716b",
  "1483985988355-763728e1935b",
  "1490481651871-ab68de25d43d",
  "1558171813-4c088753af8f",
  "1515562141207-7a88fb7ce338",
  "1573408301185-9146b71fd11b",
  "1586015555754-63b98152c4a5",
  "1522337360788-8b13dee7a37e",
  "1560066984-138dadb4c035",
  "1502920917128-1aa500764cbd",
  "1516035069371-29a1b244cc32",
  "1600596542815-ffad4c1539a9",
  "1600585154340-be6161a56a0c",
  "1502672260266-1c1ef2d93688",
  "1551882547-ff40c63fe5fa",
  "1540541338287-41700207dee6",
  "1566073771259-6a8506099945",
  "1512453979796-25adf2231ede",
  "1472851294608-062f824d29cc",
  "1528698827591-e19ccd7bc23d",
  "1607083206869-a9f3a9e35cd0",
  "1491933382434-274a1b5ab4b2",
  "1550009158-9ebf69173e03",
  "1573855619003-d9fd01355f3e",
];

function hash(s) {
  return crypto.createHash("md5").update(s).digest("hex");
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { "User-Agent": "ExhibiumSiteBot/1.0", Accept: "image/*" },
  });
  if (!res.ok) throw new Error(String(res.status));
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1500) throw new Error("small");
  fs.writeFileSync(dest, buf);
  return buf.length;
}

const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".jpg") && !f.startsWith("_"));

const bySize = new Map();
for (const f of files) {
  const size = fs.statSync(path.join(dir, f)).size;
  const list = bySize.get(size) || [];
  list.push(f);
  bySize.set(size, list);
}

const dupSize = [...bySize.entries()].sort((a, b) => b[1].length - a[1].length)[0];
console.log("largest dup group", dupSize[0], "count", dupSize[1].length);

const dups = dupSize[1].slice(1); // keep first
let i = 0;
for (const f of dups) {
  const id = goodIds[i % goodIds.length];
  // nudge with hash so neighboring dups get different ids
  const nudge = parseInt(hash(f).slice(0, 2), 16) % goodIds.length;
  const photo = goodIds[(i + nudge) % goodIds.length];
  const url = `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=1400&q=80`;
  const dest = path.join(dir, f);
  try {
    const n = await download(url, dest);
    console.log("fixed", f, "→", photo, n);
  } catch (e) {
    console.log("fail", f, e.message);
  }
  i++;
  await new Promise((r) => setTimeout(r, 100));
}

const sizes = new Set(
  files.map((f) => fs.statSync(path.join(dir, f)).size)
);
console.log("unique sizes now", sizes.size, "of", files.length);
