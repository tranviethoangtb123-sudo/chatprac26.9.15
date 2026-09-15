/* ============================================================================
   合并固定搭配分片 → assets/js/data.collocations.js
   ----------------------------------------------------------------------------
   输入：tools/.parts/colloc/colloc-*.json（每块形如 { "word": [["en","cn"], ...] }）
   校验：结构、条数、英文纯 ASCII、中文含汉字、是否包含该词、重复
   用法：node tools/build-collocations.js
   ============================================================================ */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PARTS = path.join(__dirname, ".parts", "colloc");
const OUT = path.join(ROOT, "assets", "js", "data.collocations.js");

global.window = global;
global.window.CHAT_PRAC_DATA = {};
require(path.join(ROOT, "assets", "js", "data.words.js"));
const words = global.window.CHAT_PRAC_DATA.words;
const wordSet = new Set(words.map((w) => w.w));

const files = fs.readdirSync(PARTS).filter((f) => f.endsWith(".json")).sort();
if (!files.length) {
  console.error("没有找到分片文件：" + PARTS);
  process.exit(1);
}

const merged = {};
const problems = [];
const CJK = /[\u4e00-\u9fa5]/;
const seenPairs = new Set();

files.forEach((f) => {
  const data = JSON.parse(fs.readFileSync(path.join(PARTS, f), "utf8"));
  Object.keys(data).forEach((w) => {
    const list = data[w];
    if (!Array.isArray(list) || !list.length) { problems.push(f + " " + w + " 数据为空"); return; }
    if (merged[w]) { problems.push(w + " 在多个分片里重复出现"); return; }

    const cleaned = [];
    list.forEach((pair) => {
      if (!Array.isArray(pair) || pair.length !== 2) { problems.push(w + " 条目结构不对：" + JSON.stringify(pair)); return; }
      const en = String(pair[0]).trim();
      const cn = String(pair[1]).trim();
      if (!en || !cn) { problems.push(w + " 有空字段"); return; }
      if (/[^\x00-\x7F]/.test(en)) { problems.push(w + " 英文含非 ASCII：" + en); return; }
      if (/[\u2018\u2019\u201C\u201D]/.test(en)) { problems.push(w + " 英文含弯引号：" + en); return; }
      if (!CJK.test(cn)) { problems.push(w + " 中文不含汉字：" + cn); return; }
      if (en.split(/\s+/).length < 2 || en.split(/\s+/).length > 4) { problems.push(w + " 词数不在 2-4：" + en); return; }
      const stem = w.length > 4 ? w.slice(0, w.length - 1) : w.slice(0, Math.max(3, w.length - 1));
      if (en.toLowerCase().indexOf(stem.toLowerCase()) < 0) { problems.push(w + " 搭配里没有这个词：" + en); return; }
      const key = w + "|" + en.toLowerCase();
      if (seenPairs.has(key)) { problems.push(w + " 内有重复搭配：" + en); return; }
      seenPairs.add(key);
      cleaned.push([en, cn]);
    });
    if (cleaned.length) merged[w] = cleaned;
    else problems.push(w + " 清洗后没有可用搭配");
  });
});

const missing = words.filter((w) => !merged[w.w]).map((w) => w.w);
const extra = Object.keys(merged).filter((w) => !wordSet.has(w));

const total = Object.values(merged).reduce((n, l) => n + l.length, 0);
console.log("分片：" + files.length + " 个");
console.log("词库：" + words.length + " 词");
console.log("有固定搭配：" + Object.keys(merged).length + " 词，" + total + " 条");
if (missing.length) console.log("缺搭配的词：" + missing.length + " 个（前 20：" + missing.slice(0, 20).join(", ") + "）");
if (extra.length) console.log("不在词库里的词：" + extra.length + " 个（前 20：" + extra.slice(0, 20).join(", ") + "）");

if (problems.length) {
  console.log("\n发现问题 " + problems.length + " 处：");
  problems.slice(0, 30).forEach((p) => console.log("  ✗ " + p));
  if (problems.length > 30) console.log("  … 还有 " + (problems.length - 30) + " 处");
  process.exit(1);
}

// 输出：按字母排序，一行一个词，紧凑写法
const keys = Object.keys(merged).sort();
const body = keys.map((w) => {
  const items = merged[w].map(([en, cn]) => '["' + en.replace(/"/g, '\\"') + '", "' + cn + '"]').join(", ");
  return '  "' + w + '": [' + items + "]";
}).join(",\n");

const out = `/* ============================================================================
   固定搭配（${keys.length} 词 / ${total} 条）— 由 tools/build-collocations.js 合并生成
   ----------------------------------------------------------------------------
   内容为 Chat Prac 编写的学习资料（每个词 2 条常见固定搭配），可自由修改。
   重新生成：先准备 tools/.parts/colloc/*.json，再跑 node tools/build-collocations.js
   ============================================================================ */
window.CHAT_PRAC_DATA = window.CHAT_PRAC_DATA || {};
window.CHAT_PRAC_DATA.collocations = {
${body}
};
`;

fs.writeFileSync(OUT, out, "utf8");
console.log("\n已写入：" + OUT + "（" + (out.length / 1024).toFixed(1) + " KB）");
