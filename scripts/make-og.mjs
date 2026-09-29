// Generates the 1200x630 social share image (src/app/opengraph-image.jpg).
import sharp from "sharp";

const W = 1200, H = 630;
const overlay = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#0c0806" stop-opacity=".95"/><stop offset=".65" stop-color="#0c0806" stop-opacity=".55"/><stop offset="1" stop-color="#0c0806" stop-opacity=".1"/></linearGradient>
    <linearGradient id="t" x1="0" x2="1"><stop offset="0" stop-color="#f3d9a0"/><stop offset=".5" stop-color="#d6a54f"/><stop offset="1" stop-color="#b9782f"/></linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="#d6a54f" stroke-opacity=".35"/>
  <text x="80" y="150" font-family="Georgia, serif" font-size="30" letter-spacing="8" fill="#d6a54f">INDOSTAGE</text>
  <text x="80" y="290" font-family="Georgia, serif" font-size="84" fill="#f5ecdc">Where Indian Heritage</text>
  <text x="80" y="390" font-family="Georgia, serif" font-size="84" font-style="italic" fill="url(#t)">Meets Global Stages</text>
  <text x="80" y="500" font-family="Arial, sans-serif" font-size="26" fill="#b8a78d">Classical · Folk · Fusion · Events · Film · Training</text>
</svg>`;

await sharp("public/images/hero-dancer.webp")
  .resize(W, H, { fit: "cover", position: "right" })
  .composite([{ input: Buffer.from(overlay) }])
  .jpeg({ quality: 82 })
  .toFile("src/app/opengraph-image.jpg");
await sharp("src/app/opengraph-image.jpg").toFile("src/app/twitter-image.jpg");
console.log("ok");
