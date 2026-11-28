// Generate PNG ikon Corely sebagai file statis (tanpa render runtime, tanpa dependensi — hanya node:zlib).
// Kenapa bukan next/og: di Windows bundel @vercel/og Next 14 gagal resolve path font/wasm.
// Jalankan ulang setelah simbol berubah: node apps/web/scripts/gen-icons.mjs
// Geometri sama dengan components/logo-mark.tsx & public/icon.svg — ubah ketiganya bersamaan.
import { writeFileSync } from 'node:fs';
import { deflateSync, crc32 } from 'node:zlib';

// Simbol dalam koordinat viewBox "72 72 368 368" (lihat logo-mark.tsx).
const VB = { x: 72, size: 368 };
const HALF_STROKE = 34; // stroke-width 68
const ARC = { cx: 256, cy: 256, r: 140, from: 30, to: 300 }; // derajat, y ke bawah (searah jarum jam)
const CHECK = [[196, 262], [248, 314], [392, 190]];
const BLUE = [0x25, 0x63, 0xeb];

function distSegment(px, py, [ax, ay], [bx, by]) {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}

function distArc(px, py) {
  const { cx, cy, r, from, to } = ARC;
  const deg = ((Math.atan2(py - cy, px - cx) * 180) / Math.PI + 360) % 360;
  if (deg >= from && deg <= to) return Math.abs(Math.hypot(px - cx, py - cy) - r);
  const end = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  return Math.min(...[end(from), end(to)].map(([x, y]) => Math.hypot(px - x, py - y)));
}

function dist(x, y) {
  return Math.min(distArc(x, y), distSegment(x, y, CHECK[0], CHECK[1]), distSegment(x, y, CHECK[1], CHECK[2]));
}

/** badge=false: simbol biru di latar putih (app icon). badge=true: simbol putih transparan (Android hanya pakai alpha). */
function render(size, badge) {
  // 0.62 → lingkaran simbol (~31% radius) tetap di safe zone maskable (40%).
  const glyph = size * (badge ? 0.84 : 0.62);
  const off = (size - glyph) / 2;
  const k = VB.size / glyph; // px → unit viewBox
  const rgba = Buffer.alloc(size * size * 4);
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const d = dist(VB.x + (px + 0.5 - off) * k, VB.x + (py + 0.5 - off) * k);
      const a = Math.max(0, Math.min(1, (HALF_STROKE - d) / k + 0.5)); // anti-alias 1px
      const i = (py * size + px) * 4;
      if (badge) rgba.set([255, 255, 255, Math.round(a * 255)], i);
      else rgba.set([...BLUE.map((c) => Math.round(255 + (c - 255) * a)), 255], i);
    }
  }
  return png(size, rgba);
}

function png(size, rgba) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.set([8, 6, 0, 0, 0], 8); // 8-bit RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Self-check: titik di tengah garis busur kiri harus kena, pusat simbol tidak.
if (dist(116, 256) > 1 || dist(256, 200) < HALF_STROKE) throw new Error('geometri simbol berubah');

const web = new URL('..', import.meta.url);
for (const [path, size, badge] of [
  ['public/icon-192.png', 192, false],
  ['public/icon-512.png', 512, false],
  ['public/badge-96.png', 96, true],
  ['public/apple-touch-icon.png', 180, false],
]) {
  const buf = render(size, badge);
  writeFileSync(new URL(path, web), buf);
  console.log(`${path} ${size}x${size} ${buf.length}B`);
}
