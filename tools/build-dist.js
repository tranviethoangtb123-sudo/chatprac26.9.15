/* ============================================================================
   打包出可以直接上传到静态托管的文件夹
   ----------------------------------------------------------------------------
   只复制网站运行需要的文件（不含 tools / tests / README / 缓存）
   用法：node tools/build-dist.js
   输出：dist/
   ============================================================================ */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const FILES = [
  "index.html",
  "manifest.webmanifest",
  "sw.js",
  "assets/css/style.css",
  "assets/js/app.js",
  "assets/js/data.words.js",
  "assets/js/data.vocab.js",
  "assets/js/data.collocations.js",
  "assets/js/data.phon.js",
  "assets/js/data.sentences.js",
  "assets/js/data.dialogues.js",
  "assets/js/data.practice.js",
  "assets/js/data.scenarios.js",
  "assets/js/data.notes.js",
  "assets/css/scenarios.css",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/icon-maskable-512.png",
  "assets/icons/apple-touch-icon.png",
  "assets/icons/favicon-32.png"
];

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

let total = 0;
const missing = [];

FILES.forEach((rel) => {
  const src = path.join(ROOT, rel);
  if (!fs.existsSync(src)) { missing.push(rel); return; }
  const dst = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
  const size = fs.statSync(src).size;
  total += size;
  console.log("  " + rel.padEnd(38) + (size / 1024).toFixed(1) + " KB");
});

if (missing.length) {
  console.error("\n缺少文件：" + missing.join("、"));
  console.error("如果缺的是图标，先运行：node tools/build-icons.js");
  process.exit(1);
}

console.log("\n共 " + FILES.length + " 个文件，" + (total / 1024).toFixed(0) + " KB");
console.log("输出目录：" + DIST);

// 顺手校验一下 sw.js 里预缓存清单和实际文件对得上
const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
const precache = [...sw.matchAll(/"\.\/([^"]*)"/g)].map((m) => m[1]).filter(Boolean);
const swMissing = precache.filter((p) => !fs.existsSync(path.join(ROOT, p)));
if (swMissing.length) {
  console.error("\nsw.js 里列了不存在的文件：" + swMissing.join("、"));
  process.exit(1);
}
console.log("sw.js 预缓存清单与文件一致（" + precache.length + " 项）");
