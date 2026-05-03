import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const svgPath = resolve("public/moncho.svg");
const outPath = resolve("public/favicon.ico");
const sizes = [16, 32, 48];

const svg = await readFile(svgPath);

const pngs = await Promise.all(
  sizes.map((size) =>
    sharp(svg, { density: 72, limitInputPixels: false })
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
  )
);

const headerSize = 6;
const entrySize = 16;
const dirSize = headerSize + entrySize * sizes.length;

const header = Buffer.alloc(headerSize);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);

const entries = Buffer.alloc(entrySize * sizes.length);
let offset = dirSize;
sizes.forEach((size, i) => {
  const png = pngs[i];
  const e = i * entrySize;
  entries.writeUInt8(size === 256 ? 0 : size, e + 0);
  entries.writeUInt8(size === 256 ? 0 : size, e + 1);
  entries.writeUInt8(0, e + 2);
  entries.writeUInt8(0, e + 3);
  entries.writeUInt16LE(1, e + 4);
  entries.writeUInt16LE(32, e + 6);
  entries.writeUInt32LE(png.length, e + 8);
  entries.writeUInt32LE(offset, e + 12);
  offset += png.length;
});

const ico = Buffer.concat([header, entries, ...pngs]);
await writeFile(outPath, ico);
console.log(`Wrote ${outPath} (${ico.length} bytes, sizes: ${sizes.join(", ")})`);
