/* ============================================================================
   图标检查：确认图标是"白底 + 黑色文字"，并可选打印字符画
   ----------------------------------------------------------------------------
   为什么需要它：图标是程序生成的 PNG，没法直接"看"，
   这个脚本把 PNG 解码后统计白底/墨色比例、检查是否黑白（无彩色像素），
   并可以用字符画把形状打出来核对。
   用法：
     node tools/check-icons.js              # 检查全部图标
     node tools/check-icons.js --art        # 额外打印字符画
     node tools/check-icons.js <文件名> --art
   ============================================================================ */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const DIR = path.join(__dirname, "..", "assets", "icons");

function decodePng(file) {
  const buf = fs.readFileSync(file);
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("不是 PNG：" + file);
  let pos = 8, width = 0, height = 0, bitDepth = 0, colorType = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.slice(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      bitDepth = data[8]; colorType = data[9];
    } else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
    pos += 12 + len;
  }
  const ch = colorType === 6 ? 4 : 3;
  if (bitDepth !== 8 || (colorType !== 6 && colorType !== 2)) {
    throw new Error("暂不支持 bitDepth=" + bitDepth + " colorType=" + colorType);
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * ch;
  const px = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)];
    const line = raw.slice(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? px[y * stride + x - ch] : 0;
      const b = y > 0 ? px[(y - 1) * stride + x] : 0;
      const c = (x >= ch && y > 0) ? px[(y - 1) * stride + x - ch] : 0;
      let v = line[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
      }
      px[y * stride + x] = v & 0xff;
    }
  }
  return { width, height, ch, px, stride };
}

function analyze(img) {
  let white = 0, ink = 0, color = 0, total = 0;
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const i = y * img.stride + x * img.ch;
      const r = img.px[i], g = img.px[i + 1], b = img.px[i + 2];
      total++;
      if (r > 245 && g > 245 && b > 245) white++;
      else if (Math.abs(r - g) < 14 && Math.abs(g - b) < 14) ink++;
      else color++;
    }
  }
  return {
    whitePct: white / total * 100,
    inkPct: ink / total * 100,
    colorPct: color / total * 100
  };
}

function art(img, cols) {
  const rows = Math.round(cols * img.height / img.width / 2.1);
  let out = "";
  for (let r = 0; r < rows; r++) {
    let line = "";
    for (let c = 0; c < cols; c++) {
      const x0 = Math.floor(c / cols * img.width), x1 = Math.max(x0 + 1, Math.floor((c + 1) / cols * img.width));
      const y0 = Math.floor(r / rows * img.height), y1 = Math.max(y0 + 1, Math.floor((r + 1) / rows * img.height));
      let sum = 0, n = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = y * img.stride + x * img.ch;
          sum += (img.px[i] + img.px[i + 1] + img.px[i + 2]) / 3;
          n++;
        }
      }
      const v = n ? sum / n : 255;
      line += v < 90 ? "#" : v < 160 ? "+" : v < 215 ? "." : " ";
    }
    out += "  |" + line + "|\n";
  }
  return out;
}

const args = process.argv.slice(2);
const wantArt = args.includes("--art");
const named = args.filter((a) => !a.startsWith("--"));
const files = named.length ? named : fs.readdirSync(DIR).filter((f) => f.endsWith(".png")).sort();

let bad = 0;
files.forEach((f) => {
  const file = path.join(DIR, f);
  const img = decodePng(file);
  const s = analyze(img);
  const ok = s.whitePct > 60 && s.inkPct > 1 && s.colorPct < 2;
  if (!ok) bad++;
  console.log((ok ? "✔ " : "✗ ") + f.padEnd(24) + img.width + "x" + img.height +
    "   白底 " + s.whitePct.toFixed(1) + "%   墨色 " + s.inkPct.toFixed(1) +
    "%   彩色 " + s.colorPct.toFixed(1) + "%");
  if (wantArt && img.width >= 180) console.log(art(img, 56));
});

console.log("");
if (bad) {
  console.log("有 " + bad + " 个图标不符合「白底黑字」：需要用 tools/build-icons.ps1 重新生成。");
  process.exit(1);
}
console.log("图标检查通过 ✅（白底 + 黑色文字，无彩色像素）");
