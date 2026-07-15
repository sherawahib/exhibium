/**
 * Download retail photos from a verified Unsplash set (one unique rotate per project).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "projects");
const mediaJson = path.join(root, "src", "lib", "projectMedia.json");

/** Known-good Unsplash IDs from prior successful downloads in this environment. */
const safe = [
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

function loadProjects() {
  const t = fs.readFileSync(path.join(root, "src/lib/projects.ts"), "utf8");
  const re =
    /p\("([^"]+)",\s*"([^"]+)",\s*"(usa|latam|mena)",\s*"([^"]+)"/g;
  const rows = [];
  let m;
  while ((m = re.exec(t))) {
    const [, name, country, region] = m;
    const id = `${region}-${country}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    rows.push({ id, name });
  }
  return rows;
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { "User-Agent": "ExhibiumSiteBot/1.0", Accept: "image/*" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2000) throw new Error("small");
  fs.writeFileSync(dest, buf);
}

async function main() {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const projects = loadProjects();
  const media = {};

  for (let i = 0; i < projects.length; i++) {
    const { id, name } = projects[i];
    const photo = safe[i % safe.length];
    const dest = path.join(outDir, `${id}.jpg`);
    let ok = false;
    for (let attempt = 0; attempt < safe.length && !ok; attempt++) {
      const p = safe[(i + attempt) % safe.length];
      try {
        await download(
          `https://images.unsplash.com/photo-${p}?auto=format&fit=crop&w=1400&q=80`,
          dest
        );
        ok = true;
      } catch {
        /* try next */
      }
    }
    if (!ok) throw new Error(`Failed ${name}`);
    media[id] = `/projects/${id}.jpg`;
    console.log(`[${i + 1}/${projects.length}] ${name} ← ${photo}`);
    await new Promise((r) => setTimeout(r, 90));
  }

  fs.copyFileSync(
    path.join(outDir, projects[0].id + ".jpg"),
    path.join(outDir, "_retail.jpg")
  );
  fs.writeFileSync(mediaJson, JSON.stringify(media, null, 2));
  console.log("done", Object.keys(media).length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
