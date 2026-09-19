import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "icons");

function markSvg(size, { inset = 0 } = {}) {
  const pad = Math.round(size * inset);
  const inner = size - pad * 2;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#1a1814"/>
  <g transform="translate(${pad} ${pad})">
    <path
      d="M ${inner * 0.72} ${inner * 0.22}
         A ${inner * 0.28} ${inner * 0.28} 0 1 0 ${inner * 0.72} ${inner * 0.78}"
      fill="none"
      stroke="#b8956a"
      stroke-width="${Math.max(18, inner * 0.1)}"
      stroke-linecap="round"
    />
  </g>
</svg>`;
}

async function writePng(name, size, inset) {
  const png = await sharp(Buffer.from(markSvg(size, { inset })))
    .png()
    .toBuffer();
  await writeFile(path.join(outDir, name), png);
  console.log("wrote", name, png.length, "bytes");
}

await mkdir(outDir, { recursive: true });
await writePng("icon-192.png", 192, 0.14);
await writePng("icon-512.png", 512, 0.14);
await writePng("icon-512-maskable.png", 512, 0.22);
