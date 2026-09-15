/* ============================================================================
   把词库切成小块，供生成"固定搭配"用
   用法：node tools/make-colloc-chunks.js [每块词数]
   输出：tools/.parts/words/chunk-01.tsv …（word \t 词性 \t 中文释义）
   ============================================================================ */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PER_CHUNK = Number(process.argv[2]) || 350;

global.window = global;
global.window.CHAT_PRAC_DATA = {};
require(path.join(ROOT, "assets", "js", "data.words.js"));
const words = global.window.CHAT_PRAC_DATA.words;

const outDir = path.join(__dirname, ".parts", "words");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

let n = 0;
for (let i = 0; i < words.length; i += PER_CHUNK) {
  n++;
  const chunk = words.slice(i, i + PER_CHUNK);
  const name = "chunk-" + String(n).padStart(2, "0") + ".tsv";
  const body = chunk.map((w) => [w.w, w.pos || "", w.cn].join("\t")).join("\n") + "\n";
  fs.writeFileSync(path.join(outDir, name), body, "utf8");
  console.log("  " + name + "  " + chunk.length + " 词  (" + chunk[0].w + " … " + chunk[chunk.length - 1].w + ")");
}
console.log("\n共 " + n + " 块，输出目录 tools/.parts/words/");
