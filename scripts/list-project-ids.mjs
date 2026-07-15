import fs from "fs";

const t = fs.readFileSync(new URL("../src/lib/projects.ts", import.meta.url), "utf8");
const re =
  /p\("([^"]+)",\s*"([^"]+)",\s*"(usa|latam|mena)",\s*"([^"]+)"/g;
let m;
const ids = [];
while ((m = re.exec(t))) {
  const [, name, country, region] = m;
  const id = `${region}-${country}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  ids.push({ id, name });
}
for (const row of ids) console.log(`${row.id}\t${row.name}`);
console.log("count", ids.length);
