/* ============================================================================
   从词典里提取"固定搭配" → assets/js/data.collocations.js
   ----------------------------------------------------------------------------
   数据来源：ECDICT https://github.com/skywind3000/ECDICT （MIT License）
   ECDICT 收了 30 万条"短语词条"，这里挑出三类最典型的固定搭配：
     ① 动词 + 小品词/介词：take off、look up
     ② 介词短语：in charge of、on time、at risk
     ③ 动词 + 名词 + 介词：take care of、make up for
   （"blue point"这类"修饰语+名词"不算固定搭配，直接排除）
   用法：node tools/build-collocations.js [每词条数，默认 3]
   ============================================================================ */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CSV = path.join(__dirname, ".cache", "ecdict.csv");
const OUT = path.join(ROOT, "assets", "js", "data.collocations.js");
const PER_WORD = Number(process.argv[2]) || 3;

/* ------------------------------ CSV 解析 ------------------------------ */
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false; }
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); field = ""; rows.push(row); row = []; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

/* --------------------------- 词表 --------------------------- */
// 小品词（用于识别动词短语）
const PARTICLES = new Set(("up out off on in down over back away through around along forward together apart aside " +
  "about across after by for from into of to upon with within against").split(/\s+/));
// 常见程度：越靠前越常用，用来在同类里排序
const PARTICLE_RANK = {};
("up out off on in down over back away through around along forward about into to for with at from by of after")
  .split(/\s+/).forEach((p, i) => { PARTICLE_RANK[p] = i + 1; });
const PREPS = new Set(("in on at for with under by without out of from about after before against over beyond within into")
  .split(/\s+/));
const PREP_RANK = {};
("in on at for with out of under by without from about after before against over beyond within into")
  .split(/\s+/).forEach((p, i) => { PREP_RANK[p] = i + 1; });
// 这些不算实词：不往它们下面挂搭配，也不拿它们当短语的头
const FUNC = new Set(("a an the and or but if of to in on at by for with from as is are was were be been being am " +
  "do does did done have has had will would shall should can could may might must " +
  "this that these those there here it its sb sth someone something oneself " +
  "he she they we you i me him her us them his their your my our one ones " +
  "not no so very too also just than then now up down out off over under away back through about into upon after").split(/\s+/));

const POS_PREFIX = /^((n|v|vt|vi|adj|adv|prep|conj|pron|num|art|int|aux|abbr)\.\s*)+/i;

// 取前两个义项，去学科标记和词性标记（含省略号的义项单独丢弃，不牵连整条）
function cleanMeaning(raw) {
  let s = String(raw).split(/\\n|\n/)[0].trim();
  s = s.replace(/\[[^\]]{1,6}\]/g, "").replace(POS_PREFIX, "").trim();
  if (!s) return null;
  const senses = s.split(/[,，;；]/)
    .map((x) => x.replace(/[.。\s"]+/g, "").trim())
    .filter((x) => x && /[\u4e00-\u9fa5]/.test(x) && x.length <= 8 && !/\.\.\.|…/.test(x));
  if (!senses.length) return null;
  return senses.slice(0, 2).join("；");
}

function senseCount(raw) {
  const line = String(raw).split(/\\n|\n/)[0].replace(/\[[^\]]{1,6}\]/g, "");
  return line.split(/[,，;；]/).map((x) => x.trim()).filter((x) => /[\u4e00-\u9fa5]/.test(x)).length;
}

/* ------------------------------ 主流程 ------------------------------ */
if (!fs.existsSync(CSV)) {
  console.error("缺少词典文件：" + CSV + "\n请先运行 node tools/fetch-data.js");
  process.exit(1);
}

global.window = global;
global.window.CHAT_PRAC_DATA = {};
require(path.join(ROOT, "assets", "js", "data.words.js"));
const words = global.window.CHAT_PRAC_DATA.words;
const bank = new Set(words.map((w) => w.w));
const posOfWord = {};
words.forEach((w) => { posOfWord[w.w] = w.pos || ""; });
// 判断首个词是不是动词（用于 take a bath 这类"动词+名词"词条）
function isVerbWord(w) { return /v\./.test(posOfWord[w] || ""); }

console.log("读取词典（约 63MB）…");
const rows = parseCsv(fs.readFileSync(CSV, "utf8"));
const header = rows[0].map((h) => h.trim());
const idx = {};
header.forEach((h, i) => { idx[h] = i; });

const candidates = new Map();   // 词 → [{en, cn, type, rank, senses}]
let scanned = 0;

for (let r = 1; r < rows.length; r++) {
  const row = rows[r];
  const phrase = (row[idx.word] || "").trim();
  if (phrase.indexOf(" ") < 0) continue;
  if (!/^[a-z][a-z' -]*$/.test(phrase)) continue;

  const parts = phrase.split(/\s+/);
  if (parts.length < 2 || parts.length > 3) continue;
  if (parts.some((p) => /^(sb|sth|someone|something|oneself|ones|one|one's)$/.test(p))) continue;

  // 判定类型 + 头词位置
  let type = 0, headIdx = -1, rank = 99;
  if (parts.length === 2 && PARTICLES.has(parts[1]) && !FUNC.has(parts[0])) {
    type = 1; headIdx = 0; rank = PARTICLE_RANK[parts[1]] || 20;            // take off
  } else if (PREPS.has(parts[0]) && !FUNC.has(parts[1])) {
    type = 2; headIdx = 1; rank = PREP_RANK[parts[0]] || 20;                // on time
  } else if (parts.length === 3 && PREPS.has(parts[0]) && !FUNC.has(parts[1]) &&
             (PREPS.has(parts[2]) || PARTICLES.has(parts[2]))) {
    type = 2; headIdx = 1; rank = (PREP_RANK[parts[0]] || 20);              // in charge of
  } else if (parts.length === 3 && PARTICLES.has(parts[2]) && !FUNC.has(parts[0]) && !FUNC.has(parts[1])) {
    type = 3; headIdx = 0; rank = PARTICLE_RANK[parts[2]] || 20;            // take care of
  } else if ((parts.length === 2 || parts.length === 3) &&
             (parts.length === 2 || /^(a|an|the)$/.test(parts[1])) &&
             !FUNC.has(parts[parts.length - 1]) && isVerbWord(parts[0])) {
    // take a bath / make bed —— 也是词典条目，挂到后面那个名词上
    type = 4; headIdx = parts.length - 1; rank = 5;
  } else {
    continue;   // 修饰语+名词之类的组合不算固定搭配
  }

  const head = parts[headIdx];
  if (!bank.has(head) || FUNC.has(head)) continue;
  if (head.indexOf("'") >= 0) continue;

  const cn = cleanMeaning(row[idx.translation] || "");
  if (!cn) continue;
  scanned++;

  if (!candidates.has(head)) candidates.set(head, []);
  candidates.get(head).push({ en: phrase, cn: cn, type: type, rank: rank, senses: senseCount(row[idx.translation] || "") });
}

console.log("符合条件的固定搭配：" + scanned + " 条");

// 每词挑最好的几条：按词性决定优先哪种结构，再看常见程度、义项多少
const posOf = {};
words.forEach((w) => { posOf[w.w] = w.pos || ""; });

// 动词优先"动词+小品词"（take off），名词/形容词优先"介词短语"（in charge of）；
// "动词+名词"（take a bath）排最后，只在没有更好选择时出现
function typeOrder(pos) {
  return /v\./.test(pos) ? [1, 3, 2, 4] : [2, 1, 3, 4];
}

const result = {};
[...candidates.keys()].sort().forEach((w) => {
  const seen = new Set();
  const order = typeOrder(posOf[w]);
  const picked = candidates.get(w)
    .sort((a, b) => (order.indexOf(a.type) - order.indexOf(b.type)) ||
      (a.rank - b.rank) || (b.senses - a.senses) ||
      (a.en.length - b.en.length) || (a.en < b.en ? -1 : 1))
    .filter((x) => { if (seen.has(x.en)) return false; seen.add(x.en); return true; })
    .slice(0, PER_WORD);
  if (picked.length) result[w] = picked.map((x) => [x.en, x.cn]);
});

const withPhrase = Object.keys(result).length;
const total = Object.values(result).reduce((n, l) => n + l.length, 0);
console.log("覆盖：" + withPhrase + " / " + words.length + " 词（" + (withPhrase / words.length * 100).toFixed(0) + "%），共 " + total + " 条");

const body = Object.keys(result).sort().map((w) =>
  "  " + JSON.stringify(w) + ": [" +
  result[w].map(([en, cn]) => "[" + JSON.stringify(en) + ", " + JSON.stringify(cn) + "]").join(", ") + "]"
).join(",\n");

const out = `/* ============================================================================
   固定搭配（${withPhrase} 词 / ${total} 条）— 由 tools/build-collocations.js 自动生成
   ----------------------------------------------------------------------------
   数据来源：ECDICT 的短语词条  https://github.com/skywind3000/ECDICT （MIT License）
   形如 take off / in charge of / take care of，中文释义取自词典。
   重新生成：node tools/build-collocations.js ${PER_WORD}
   ============================================================================ */
window.CHAT_PRAC_DATA = window.CHAT_PRAC_DATA || {};
window.CHAT_PRAC_DATA.collocations = {
${body}
};
`;

fs.writeFileSync(OUT, out, "utf8");
console.log("已写入：" + OUT + "（" + (out.length / 1024).toFixed(1) + " KB）");

console.log("\n抽样：");
["take", "charge", "look", "care", "time", "order", "account", "point", "break", "put", "turn", "hand"]
  .forEach((w) => {
    const l = result[w];
    console.log("  " + w.padEnd(9) + (l ? l.map((x) => x[0] + " " + x[1]).join("  |  ") : "（无）"));
  });
