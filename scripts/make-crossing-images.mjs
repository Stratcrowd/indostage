// Builds the web images for the /ravi-chary-crossing page into public/images/crossing/:
// five equal artist portraits, both partner logos (white background keyed out), and a share image.
//   node scripts/make-crossing-images.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const dataDir = path.join(root, "data from me");
const outDir = path.join(root, "public", "images", "crossing");
fs.mkdirSync(outDir, { recursive: true });

// Same source photos as scripts/render-ads.mjs. The Nashik 2017 archive tabla player is not Ojas, so it is not used.
const photos = {
  ravi: "RAVI CHARY-1960.jpg",
  ojas: "DSC00655 copy - Copy.jpg",
  gino: "IMG_5672.jpeg",
  sangeet: "SANGEET HALDIPUR .JPG",
  sheldon: "Sheldon 2020.jpg",
};
for (const [name, src] of Object.entries(photos)) {
  await sharp(path.join(dataDir, src)).rotate().resize(1200, 1200, { fit: "inside" })
    .webp({ quality: 80 }).toFile(path.join(outDir, `${name}.webp`));
}

// Same white-background key-out as render-ads.mjs.
const keyOut = async (input, out, lo, hi, crop) => {
  let img = sharp(input);
  if (crop) img = img.extract(crop);
  const { data, info } = await img.removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const [r, g, b] = [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
    const lum = (r + g + b) / 3;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    const d = Math.max(hi - lum, (sat - 28) * 1.6);
    px.set([r, g, b, Math.round(Math.min(1, Math.max(0, d / (hi - lo))) * 255)], i * 4);
  }
  await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } }).trim()
    .resize({ width: 900, withoutEnlargement: true }).webp({ quality: 90, alphaQuality: 100 }).toFile(out);
};
await keyOut(path.join(dataDir, "Ravi chary crossing.png"), path.join(outDir, "logo-indostage.webp"), 170, 235);
await keyOut(path.join(dataDir, "Ravi chary crossing (1).png"), path.join(outDir, "logo-swar-sanskruti.webp"), 170, 228, { left: 34, top: 30, width: 1536, height: 573 });

// Share image: the five portraits as equal strips.
const W = 1200, H = 630, strip = W / 5;
// Horizontal centre of each face, as a fraction of the photo's width.
const faceX = { ravi: 0.5, ojas: 0.42, gino: 0.57, sangeet: 0.55, sheldon: 0.46 };
const tiles = await Promise.all(Object.entries(photos).map(async ([name, src]) => {
  const scaled = await sharp(path.join(dataDir, src)).rotate().resize({ height: H }).toBuffer({ resolveWithObject: true });
  const w = scaled.info.width;
  const left = Math.round(Math.min(Math.max(faceX[name] * w - strip / 2, 0), w - strip));
  return sharp(scaled.data).extract({ left, top: 0, width: strip, height: H }).modulate({ brightness: 0.85 }).toBuffer();
}));
await sharp({ create: { width: W, height: H, channels: 3, background: "#0c0806" } })
  .composite(tiles.map((input, i) => ({ input, left: i * strip, top: 0 })))
  .jpeg({ quality: 85, mozjpeg: true }).toFile(path.join(outDir, "share.jpg"));

// Special guest Merlin D'Souza, and the tribute photos of Late Pt. Prabhakar Chari (Janma Shatabdi, 1926–2026)
// from the family archive in "new photos".
await sharp(path.join(dataDir, "Merlin MD.jpg")).rotate().resize(1200, 1200, { fit: "inside" })
  .webp({ quality: 80 }).toFile(path.join(outDir, "merlin.webp"));
const archive = path.join(root, "new photos");
await sharp(path.join(archive, "Late Pt. Prabhakar Chari.JPG.jpeg")).rotate().resize(800, 1000, { fit: "inside" })
  .grayscale().webp({ quality: 70 }).toFile(path.join(outDir, "prabhakar-chari.webp"));
await sharp(path.join(archive, "Felicitated by Gyani Zail Singh Ex President of India.jpg.jpeg")).rotate()
  .resize(1400, 1000, { fit: "inside" }).webp({ quality: 80 }).toFile(path.join(outDir, "prabhakar-chari-president.webp"));

for (const f of fs.readdirSync(outDir)) console.log(f, Math.round(fs.statSync(path.join(outDir, f)).size / 1024), "KB");
