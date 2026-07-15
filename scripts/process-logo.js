const sharp = require("sharp");
const fs = require("fs");

function isNearWhite(r, g, b) {
  return r > 235 && g > 235 && b > 235;
}
function isSoftWhite(r, g, b) {
  return r > 210 && g > 210 && b > 210;
}
function isNavy(r, g, b) {
  return b >= 55 && b > r + 12 && b > g + 8 && r < 100 && g < 110;
}
function isOrange(r, g, b) {
  return r > 190 && g > 50 && g < 170 && b < 80 && r > g + 40;
}

async function processLogo() {
  const src = "f:/fernandoproject/public/logo-src.png";
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const idx = (x, y) => (y * width + x) * channels;

  // Content bbox from non-page pixels (before knocking out whites)
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = idx(x, y);
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (isNearWhite(r, g, b)) continue;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
  const pad = 2;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);

  // Find navy brand-box right edge
  const colNavy = new Array(width).fill(0);
  const colInk = new Array(width).fill(0);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const i = idx(x, y);
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (isNearWhite(r, g, b)) continue;
      colInk[x]++;
      if (isNavy(r, g, b)) colNavy[x]++;
    }
  }

  let boxEnd = minX;
  for (let x = minX; x <= maxX; x++) {
    const dens = colInk[x] ? colNavy[x] / colInk[x] : 0;
    if (dens > 0.28 || colNavy[x] > (maxY - minY) * 0.12) {
      boxEnd = x;
    } else if (x > minX + 30 && dens < 0.06 && boxEnd > minX + 40) {
      break;
    }
  }
  boxEnd = Math.min(maxX, boxEnd + 6);
  console.log("content", minX, minY, maxX, maxY, "boxEnd", boxEnd);

  // Knock out page white ONLY outside content bbox
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = idx(x, y);
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const inside =
        x >= minX && x <= maxX && y >= minY && y <= maxY;
      if (!inside && isSoftWhite(r, g, b)) {
        data[i + 3] = 0;
      } else if (inside && isNearWhite(r, g, b)) {
        // Soft fringe outside ink stays; solid page-white pockets rare inside
        // Keep grupo / e outline — do not erase interior whites
      }
    }
  }

  // Also clear near-white fully outside a slightly tighter mask:
  // any near-white pixel whose neighborhood has no navy/orange within 3px → page bg
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const i = idx(x, y);
      if (!isNearWhite(data[i], data[i + 1], data[i + 2])) continue;
      let nearInk = false;
      for (let dy = -3; dy <= 3 && !nearInk; dy++) {
        for (let dx = -3; dx <= 3 && !nearInk; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= width || yy >= height) continue;
          const j = idx(xx, yy);
          if (data[j + 3] < 16) continue;
          const r = data[j];
          const g = data[j + 1];
          const b = data[j + 2];
          if (isNavy(r, g, b) || isOrange(r, g, b)) nearInk = true;
        }
      }
      if (!nearInk) data[i + 3] = 0;
    }
  }

  const outW = 500; // retina; CSS still shows ~250px
  const outDark = "f:/fernandoproject/public/exhibium-logo.png";
  const outOnDark = "f:/fernandoproject/public/exhibium-logo-on-dark.png";

  const darkBuf = Buffer.from(data);
  await sharp(darkBuf, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 6 })
    .resize({ width: outW, kernel: sharp.kernel.lanczos3 })
    .toFile(outDark);

  // Reverse for dark backgrounds:
  // - navy outside box → white (wordmark)
  // - navy inside box → white (so mark reads on navy footer/header)
  // - white/light inside box (grupo + e outline) → navy
  // - orange stays
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = idx(x, y);
      if (data[i + 3] < 16) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (isOrange(r, g, b)) continue;

      const inBox = x <= boxEnd && x >= minX && y >= minY && y <= maxY;

      if (isNavy(r, g, b)) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        continue;
      }

      if (inBox && isSoftWhite(r, g, b)) {
        // Remap grupo text + light outlines onto the now-white mark
        data[i] = 18;
        data[i + 1] = 36;
        data[i + 2] = 72;
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 6 })
    .resize({ width: outW, kernel: sharp.kernel.lanczos3 })
    .toFile(outOnDark);

  for (const [from, to] of [
    [outDark, "f:/fernandoproject/public/logo.png"],
    [outOnDark, "f:/fernandoproject/public/logo-light.png"],
    [outDark, "f:/fernandoproject/public/logo-mark.png"],
    [outOnDark, "f:/fernandoproject/public/logo-mark-light.png"],
  ]) {
    fs.copyFileSync(from, to);
  }

  const a = await sharp(outDark).metadata();
  const b = await sharp(outOnDark).metadata();
  console.log("dark", a.width + "x" + a.height, "on-dark", b.width + "x" + b.height);
}

processLogo().catch((e) => {
  console.error(e);
  process.exit(1);
});
