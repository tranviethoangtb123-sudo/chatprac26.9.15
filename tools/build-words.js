/* ============================================================================
   词库生成器：ECDICT + ipa-dict → assets/js/data.words.js
   ----------------------------------------------------------------------------
   数据来源（均为 MIT License）：
     · ECDICT   https://github.com/skywind3000/ECDICT       中文释义 / 词性 / 词频 / 考试标签
     · ipa-dict https://github.com/open-dict-data/ipa-dict  现代 IPA 音标（美式）

   用法：
     node tools/fetch-data.js          # 先下载两个数据文件
     node tools/build-words.js         # 默认生成 1000 词
     node tools/build-words.js 2000    # 自定义词数
   ============================================================================ */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CSV_PATH = path.join(__dirname, ".cache", "ecdict.csv");
const IPA_PATH = path.join(__dirname, ".cache", "ipa-en_US.txt");
const OUT_PATH = path.join(ROOT, "assets", "js", "data.words.js");
const LIMIT = Number(process.argv[2]) || 1000;

/* ------------------------------ CSV 解析 ------------------------------ */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\n") {
      row.push(field); field = "";
      rows.push(row); row = [];
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

/* --------------------------- 音标处理 --------------------------- */
function loadIpa() {
  const map = new Map();
  if (!fs.existsSync(IPA_PATH)) return map;
  fs.readFileSync(IPA_PATH, "utf8").split("\n").forEach((line) => {
    const [w, ipa] = line.split("\t");
    if (!w || !ipa) return;
    // 一个词可能有多个读音，取第一个
    const first = ipa.split(",")[0].trim();
    // 转成词典里更通用的写法：ɹ→r、ɫ→l（音位化写法，学习者更熟悉）
    map.set(w.trim().toLowerCase(), first.replace(/ɹ/g, "r").replace(/ɫ/g, "l"));
  });
  return map;
}

// ECDICT 里的旧式音标（`ә`、`a:`、`'` 这类）只作为兜底，做基础符号替换
function normalizeOldPhonetic(ph) {
  return "/" + ph
    .replace(/ә/g, "ə")
    .replace(/'/g, "ˈ")
    .replace(/:/g, "ː")
    .trim() + "/";
}

/* --------------------------- 释义清洗 --------------------------- */
// 纯功能词/助动词/代词/限定词，背单词意义不大
const STOP = new Set(("a an the and or but if of to in on at by for with from as is are was were be been being am " +
  "do does did doing done have has had having will would shall should can could may might must " +
  "i you he she it we they me him her us them my your his its our their mine yours hers ours theirs " +
  "this that these those there here where when why how what which who whom whose " +
  "not no nor yes so very too also just than then now only own same such " +
  "all any some each every both few many much more most other another either neither " +
  "up down out off over under again once ever never always often sometimes " +
  "oh hi hey yeah ok okay hmm ha ah um eh " +
  "s t d ll re ve m n y o").split(/\s+/));

const POS_MAP = {
  "n": "n.", "v": "v.", "vt": "v.", "vi": "v.", "adj": "adj.", "a": "adj.",
  "adv": "adv.", "ad": "adv.", "prep": "prep.", "conj": "conj.", "pron": "pron.",
  "num": "num.", "art": "art.", "int": "int.", "interj": "int.", "aux": "aux.", "abbr": "abbr.",
  "pl": "n.", "vi./vt.": "v."
};

function cleanTranslation(raw) {
  if (!raw) return null;
  const first = raw.split(/\\n|\n/)[0].trim();
  if (!first || /^\[网络\]/.test(first)) return null;

  let pos = "";
  let body = first;
  const m = first.match(/^([a-zA-Z]+)\.\s*/);
  if (m && POS_MAP[m[1].toLowerCase()]) {
    pos = POS_MAP[m[1].toLowerCase()];
    body = first.slice(m[0].length);
  }

  if (/人名|地名|姓氏|城市名|商标/.test(body)) return null;

  // ECDICT 用「；」分义项、用「，」分近义词，两种都当分隔符，只留前 3 个
  const senses = body
    .split(/[；;，,、]/)
    .map((s) => s
      .replace(/\[[^\]]{1,6}\]/g, "")                       // 去掉 [计] [医] [经] 这类学科标记
      .replace(/[（(][^）)]{0,30}[）)]/g, "")               // 去掉成对的括号补充说明
      .replace(/[（(][^）)]*$/g, "")                        // 去掉被截断的半个括号
      .replace(/[（()）]/g, "")
      .replace(/[.。!！?？\s]+$/g, "")
      .trim())
    .filter((s) => s && /[\u4e00-\u9fa5]/.test(s));

  if (!senses.length) return null;

  let cn = senses.slice(0, 3).join("；");
  if (cn.length > 20) {
    cn = senses.slice(0, 2).join("；");
    if (cn.length > 20) cn = senses[0];
  }
  if (!cn || cn.length > 24) return null;
  return { pos, cn };
}

/* ------------------ 英美拼写去重（音标统一用美式） ------------------ */
const AME_OF = [
  [/^(.+)tre$/, "$1ter"],          // centre → center
  [/^(.+)our$/, "$1or"],           // colour → color
  [/^(.+)ise$/, "$1ize"],          // organise → organize
  [/^(.+)isation$/, "$1ization"],
  [/^(.+)ogue$/, "$1og"],          // catalogue → catalog
  [/^(.+)lling$/, "$1ling"],       // travelling → traveling
  [/^(.+)lled$/, "$1led"]          // cancelled → canceled
];

function ameVariant(word) {
  for (const [re, to] of AME_OF) {
    if (re.test(word)) {
      const v = word.replace(re, to);
      if (v !== word) return v;
    }
  }
  return null;
}

/* ------------------------------ 主流程 ------------------------------ */
function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error("缺少词典文件：" + CSV_PATH + "\n请先运行 node tools/fetch-data.js");
    process.exit(1);
  }

  console.log("读取词典（约 63MB）…");
  const rows = parseCsv(fs.readFileSync(CSV_PATH, "utf8"));
  const header = rows[0];
  const idx = {};
  header.forEach((h, i) => { idx[h.trim()] = i; });
  console.log("总记录 " + (rows.length - 1) + " 条");

  const ipa = loadIpa();
  console.log("音标库 " + ipa.size + " 条" + (ipa.size ? "" : "（缺失，将退回 ECDICT 音标）"));

  const candidates = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.length < header.length - 3) continue;

    const word = (row[idx.word] || "").trim();
    const phonetic = (row[idx.phonetic] || "").trim();
    const translation = row[idx.translation] || "";
    const posRaw = (row[idx.pos] || "").trim();
    const collins = Number(row[idx.collins]) || 0;
    const oxford = Number(row[idx.oxford]) || 0;
    const tag = (row[idx.tag] || "").trim();
    const bnc = Number(row[idx.bnc]) || 0;
    const frq = Number(row[idx.frq]) || 0;

    if (!/^[a-z][a-z'-]{1,20}$/.test(word)) continue;
    if (STOP.has(word)) continue;
    if (!translation) continue;

    const rank = frq || bnc;
    const isCore = oxford === 1 || collins >= 3 || /(^|\s)(zk|gk|cet4|cet6|ky|toefl|ielts)(\s|$)/.test(tag);
    if (!isCore) continue;
    if (!rank || rank > 20000) continue;

    const clean = cleanTranslation(translation);
    if (!clean) continue;

    const ph = ipa.get(word) || (phonetic ? normalizeOldPhonetic(phonetic) : "");
    if (!ph) continue;

    candidates.push({
      w: word,
      ph: ph.startsWith("/") ? ph : "/" + ph + "/",
      pos: clean.pos || POS_MAP[(posRaw.split("/")[0] || "").trim().replace(/\.$/, "").toLowerCase()] || "",
      cn: clean.cn,
      frq: rank,
      collins,
      oxford,
      tag
    });
  }

  // 去重：一个词只留词频最靠前的
  const byWord = new Map();
  candidates.forEach((c) => {
    const old = byWord.get(c.w);
    if (!old || c.frq < old.frq) byWord.set(c.w, c);
  });

  // 英美拼写只会留一个（音标是美式，所以优先美式拼写）
  for (const w of [...byWord.keys()]) {
    const ame = ameVariant(w);
    if (ame && byWord.has(ame)) byWord.delete(w);
  }

  const ranked = [...byWord.values()].sort((a, b) => a.frq - b.frq);
  let words = ranked.slice(0, LIMIT);

  // --with-ielts：把带雅思标签、且不至于太生僻的词并进来
  // （--max-rank=N 控制上限，默认 8000，即只收词频前 8000 的雅思词）
  if (process.argv.includes("--with-ielts")) {
    const maxRankArg = process.argv.find((a) => a.startsWith("--max-rank="));
    const maxRank = maxRankArg ? Number(maxRankArg.split("=")[1]) : 8000;
    const ielts = ranked.filter((w) => /(^|\s)ielts(\s|$)/.test(w.tag || "") && w.frq <= maxRank);
    const seen = new Set(words.map((w) => w.w));
    let added = 0;
    ielts.forEach((w) => { if (!seen.has(w.w)) { words.push(w); seen.add(w.w); added++; } });
    words.sort((a, b) => a.frq - b.frq);
    console.log("雅思标签词（词频 ≤ " + maxRank + "）：" + ielts.length + " 个，其中新增 " + added + " 个");
  }

  const tagCount = {};
  words.forEach((w) => {
    String(w.tag || "").split(/\s+/).filter(Boolean).forEach((t) => { tagCount[t] = (tagCount[t] || 0) + 1; });
  });

  const stats = {
    总候选: byWord.size,
    输出: words.length,
    有美式音标: words.filter((w) => ipa.has(w.w)).length,
    牛津核心: words.filter((w) => w.oxford === 1).length,
    柯林斯三星以上: words.filter((w) => w.collins >= 3).length,
    考试标签分布: Object.entries(tagCount).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + " " + v).join("、") || "（无）",
    词频区间: words.length ? words[0].frq + "–" + words[words.length - 1].frq : "-"
  };
  console.log("\n统计：");
  Object.entries(stats).forEach(([k, v]) => console.log("  " + k + "：" + v));

  const body = words.map((w) =>
    "  { w: " + JSON.stringify(w.w) + ", ph: " + JSON.stringify(w.ph) + ", pos: " + JSON.stringify(w.pos) +
    ", cn: " + JSON.stringify(w.cn) + ", frq: " + w.frq +
    (w.tag ? ", tag: " + JSON.stringify(w.tag) : "") + " }"
  ).join(",\n");

  const out = `/* ============================================================================
   词库（共 ${words.length} 词）— 本文件由 tools/build-words.js 自动生成，不要手工编辑
   ----------------------------------------------------------------------------
   释义 / 词性 / 词频：ECDICT  https://github.com/skywind3000/ECDICT  (MIT License)
   音标（美式 IPA）：ipa-dict  https://github.com/open-dict-data/ipa-dict  (MIT License)
   筛选依据：牛津 3000 核心词 / 柯林斯星级 / 中考高考四六级考研雅思托福标签，
             按 COCA(frq) 或 BNC(bnc) 词频排序，已排除纯功能词与英美重复拼写。
   重新生成：node tools/fetch-data.js && node tools/build-words.js ${LIMIT}
   ============================================================================ */
window.CHAT_PRAC_DATA = window.CHAT_PRAC_DATA || {};
window.CHAT_PRAC_DATA.words = [
${body}
];
`;

  fs.writeFileSync(OUT_PATH, out, "utf8");
  console.log("\n已写入：" + OUT_PATH + "（" + (out.length / 1024).toFixed(1) + " KB）");
  console.log("\n抽样（每 40 词取一个）：");
  const step = Math.max(1, Math.round(words.length / 20));
  for (let i = 0; i < words.length; i += step) {
    const w = words[i];
    console.log("  " + w.w.padEnd(13) + w.ph.padEnd(20) + w.pos.padEnd(7) + w.cn);
  }
}

main();
