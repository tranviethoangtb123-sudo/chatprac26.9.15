/* ============================================================================
   生成 App 图标（手机"添加到主屏幕"需要 PNG 图标）
   ----------------------------------------------------------------------------
   图案：主色圆角方块 + 白色对话气泡 + 三条短横线（呼应界面里的菜单/文本）
   用法：node tools/build-icons.js
   输出：assets/icons/*.png
   ============================================================================ */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const OUT_DIR = path.join(__dirname, "..", "assets", "icons");
const ACCENT = [0x4d, 0x6b, 0xfe];
const WHITE = [0xff, 0xff, 0xff];

/* ------------------------------ PNG 编码 ------------------------------ */
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePng(size, rgba) {
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

/* ------------------------------ 图形 ------------------------------ */
// 坐标都用 0~1 的相对值，便于按尺寸缩放

function inRoundedRect(x, y, rx, ry, w, h, r) {
  if (x < rx || x > rx + w || y < ry || y > ry + h) return false;
  const cx = Math.min(Math.max(x, rx + r), rx + w - r);
  const cy = Math.min(Math.max(y, ry + r), ry + h - r);
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}

function inTriangle(x, y, ax, ay, bx, by, cx, cy) {
  const d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
  if (d === 0) return false;
  const a = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / d;
  const b = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / d;
  return a >= 0 && b >= 0 && a + b <= 1;
}

function draw(size, opts) {
  const SS = 4; // 4x4 超采样做抗锯齿
  const px = Buffer.alloc(size * size * 4);
  const k = opts.markScale;               // 图案整体缩放（maskable 要留安全区）
  const t = (v) => 0.5 + (v - 0.5) * k;   // 把相对坐标往中心收

  const sample = (x, y) => {
    // 底：圆角方块（圆角半径 0 就是铺满，用于 iOS / maskable）
    if (!inRoundedRect(x, y, 0, 0, 1, 1, opts.bgRadius)) return null;

    // 气泡里的三条短横线（主色）——必须画在气泡之前，否则会被白色盖住
    const bars = [[0.335, 0.375, 0.33], [0.335, 0.455, 0.25], [0.335, 0.535, 0.17]];
    for (const [bx, by, bw] of bars) {
      if (inRoundedRect(x, y, t(bx), t(by), bw * k, 0.05 * k, 0.025 * k)) return ACCENT;
    }

    // 白色对话气泡（圆角矩形 + 左下角小尾巴）
    if (inRoundedRect(x, y, t(0.25), t(0.30), 0.50 * k, 0.32 * k, 0.10 * k)) return WHITE;
    if (inTriangle(x, y, t(0.33), t(0.60), t(0.33), t(0.73), t(0.46), t(0.60))) return WHITE;

    return null;
  };

  for (let py = 0; py < size; py++) {
    for (let px2 = 0; px2 < size; px2++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = (px2 + (sx + 0.5) / SS) / size;
          const y = (py + (sy + 0.5) / SS) / size;
          const c = sample(x, y);
          const col = c || ACCENT;
          const alpha = c ? 255 : (inRoundedRect(x, y, 0, 0, 1, 1, opts.bgRadius) ? 255 : 0);
          r += col[0] * alpha / 255;
          g += col[1] * alpha / 255;
          b += col[2] * alpha / 255;
          a += alpha;
        }
      }
      const n = SS * SS;
      const i = (py * size + px2) * 4;
      // 未覆盖区域 alpha 为 0，颜色按覆盖率还原，避免边缘发黑
      const cover = a / n / 255;
      px[i] = cover > 0 ? Math.round(r / n / cover) : 0;
      px[i + 1] = cover > 0 ? Math.round(g / n / cover) : 0;
      px[i + 2] = cover > 0 ? Math.round(b / n / cover) : 0;
      px[i + 3] = Math.round(a / n);
    }
  }
  return px;
}

/* ------------------------------ 输出 ------------------------------ */
const TARGETS = [
  { file: "icon-192.png", size: 192, bgRadius: 0.22, markScale: 1.0 },
  { file: "icon-512.png", size: 512, bgRadius: 0.22, markScale: 1.0 },
  // maskable：铺满整块，图案缩到安全区以内，交给系统裁圆角
  { file: "icon-maskable-512.png", size: 512, bgRadius: 0, markScale: 0.86 },
  // iOS：系统自己会切圆角，所以铺满不留透明边
  { file: "apple-touch-icon.png", size: 180, bgRadius: 0, markScale: 0.86 },
  { file: "favicon-32.png", size: 32, bgRadius: 0.22, markScale: 1.0 }
];

fs.mkdirSync(OUT_DIR, { recursive: true });
TARGETS.forEach((t) => {
  const buf = encodePng(t.size, draw(t.size, t));
  fs.writeFileSync(path.join(OUT_DIR, t.file), buf);
  console.log("  " + t.file.padEnd(24) + t.size + "x" + t.size + "  " + (buf.length / 1024).toFixed(1) + " KB");
});
console.log("\n图标已生成到 assets/icons/");
