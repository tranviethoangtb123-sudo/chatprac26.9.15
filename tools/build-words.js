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

// 一行释义拆成若干义项：ECDICT 用「；」分义项、用「，」分近义词，两种都当分隔符
function cleanSenses(body) {
  return body
    .split(/[；;，,、]/)
    .filter((raw) => !/人名|地名|姓氏|城市名|商标/.test(raw))   //「米尔斯（人名）」这类整条剔掉
    .map((s) => s
      .replace(/\[[^\]]{1,6}\]/g, "")                       // 去掉 [计] [医] [经] 这类学科标记
      .replace(/[（(][^）)]{0,30}[）)]/g, "")               // 去掉成对的括号补充说明
      .replace(/[（(][^）)]*$/g, "")                        // 去掉被截断的半个括号
      .replace(/[（()）]/g, "")
      .replace(/[.。!！?？\s]+$/g, "")
      .trim())
    .filter((s) => s && /[\u4e00-\u9fa5]/.test(s));
}

/* --------------------- 选义项：挑「最常用」的一行 ---------------------
   ECDICT 的释义是一行一个词性，行序没有规律：很多常用词的名词/形容词义项排在
   动词前面（give 第一行是「n. 弹性」，back 第一行是「a. 后面的」，mean 第一行
   是「a. 低劣的」）。只取第一行会把最常用的意思丢掉——「give 怎么变成弹性了」
   就是这么来的。这里改成按「义项数 × 词性权重 × 词形佐证」挑主词性。 */
const POS_ALIAS = {
  n: "n", pl: "n", v: "v", vt: "v", vi: "v", adj: "adj", a: "adj",
  adv: "adv", ad: "adv", prep: "prep", conj: "conj", pron: "pron",
  num: "num", art: "art", int: "int", interj: "int", aux: "aux", abbr: "abbr"
};
const POS_TEXT = {
  n: "n.", v: "v.", adj: "adj.", adv: "adv.", prep: "prep.", conj: "conj.",
  pron: "pron.", num: "num.", art: "art.", int: "int.", aux: "aux.", abbr: "abbr.", "": ""
};
// 词性权重：同样义项数下，动词/形容词比名词更像「这个词最常用的用法」
const POS_WEIGHT = { n: 1.0, v: 1.12, adj: 1.05, adv: 0.95, prep: 0.6, conj: 0.6, pron: 0.5, num: 0.6, int: 0.45, art: 0.3, aux: 0.3, abbr: 0.5, "": 0.9 };

/* 人工校准：机械规则对部分高频多义词仍会选偏（常把冷僻的动词/名词义项排前面），
   这里直接指定主词性顺序。只排词性、不改释义——中文仍然逐字来自 ECDICT。
   node tools/build-words.js 2000 --with-ielts --review=1800 可以复查效果。 */
const PRIMARY = {
  /* 第一行是冷僻名词/形容词，常见用法在别的词性 */
  give: "v n", mean: "v adj", back: "adv n", still: "adv adj", well: "adv adj n",
  last: "adj n", light: "n adj", right: "adj n adv", one: "num pron", play: "v n",
  run: "v n", watch: "v n", work: "n v", kind: "n adj", point: "n v", talk: "v n",
  turn: "v n", start: "v n", show: "v n", study: "v n", like: "v adj", look: "v n",
  want: "v n", keep: "v n", help: "v n", need: "v n", love: "v n", call: "v n",
  move: "v n", leave: "v n", try: "v n", ask: "v n",
  /* 名词为主，但动词/形容词义项的行更长 */
  job: "n v", team: "n", question: "n v", about: "prep adv", across: "prep adv",
  around: "prep adv", before: "prep conj adv", since: "prep conj adv",
  level: "n adj v", guy: "n", process: "n v", former: "adj n", model: "n v",
  season: "n v", couple: "n v", project: "n v", court: "n v", oil: "n v",
  figure: "n v", doctor: "n v", condition: "n v", color: "n v", west: "n adj adv",
  thousand: "num n adj", sound: "n adj", above: "prep adv adj", expert: "n adj",
  firm: "n adj", pain: "n v", glass: "n v", fish: "n v", deep: "adj adv n",
  shoulder: "n v", detail: "n v", soldier: "n", bag: "n v", heat: "n v",
  skin: "n v", coach: "n v", budget: "n v", participant: "n", corner: "n v",
  conduct: "n v", please: "adv v", date: "n v", fan: "n v", ship: "n v",
  boat: "n v", wood: "n", village: "n adj", contract: "n v", crowd: "n v",
  express: "v adj n", horse: "n v", guard: "n v", average: "n adj v", photo: "n",
  egg: "n v", anybody: "pron n", perfect: "adj v n", mother: "n v",
  order: "n v", hand: "n v", matter: "n v", water: "n v", fire: "n v",
  face: "n v", book: "n v", money: "n v", name: "n v", room: "n v", eye: "n v",
  /* 雅思段：同样是被冷僻动词义项抢了位置的具体名词 */
  neighbor: "n v", speed: "n v", mistake: "n v", dress: "n v", tour: "n v",
  direct: "adj v", flower: "n v", bottom: "n adj v", neck: "n v", fuel: "n v",
  pool: "n v", sugar: "n v", weather: "n v", pocket: "n v", loan: "n v",
  profit: "n v", nose: "n v", bottle: "n v", snow: "n v", frame: "n v",
  nurse: "n v", wing: "n v", cloud: "n v", match: "n v", bomb: "n v",
  engineer: "n v", representative: "n adj", incident: "n", guide: "n v",
  lead: "v n", particular: "adj n"
};

// 把一行释义拆成 { pos, senses }；学科标记行（[计] 因特网）单独放 loose 里当兜底
function posLines(raw) {
  const lines = [];
  const loose = [];
  String(raw).split(/\\n|\n/).forEach((line) => {
    const t = line.trim();
    if (!t) return;
    if (/^\[/.test(t)) {
      const senses = cleanSenses(t.replace(/^\[[^\]]{1,6}\]\s*/, "").trim());
      if (senses.length) loose.push({ pos: "", senses });
      return;
    }
    const m = t.match(/^([a-zA-Z]{1,6})\.\s*/);
    let key = "";
    let body = t;
    if (m) {
      const alias = POS_ALIAS[m[1].toLowerCase()];
      if (!alias) return;                      // 认不出的词性缩写，整行跳过
      key = alias;
      body = t.slice(m[0].length);
    }
    const senses = cleanSenses(body);
    if (!senses.length) return;
    lines.push({ pos: key, senses });
  });
  return { lines, loose };
}

// 释义文本：最多 3 个义项，按老规则裁剪长度
function glossText(group) {
  const senses = group.senses;
  let cn = senses.slice(0, 3).join("；");
  if (cn.length > 20) {
    cn = senses.slice(0, 2).join("；");
    if (cn.length > 20) cn = senses[0];
  }
  if (!cn || cn.length > 24) return null;
  return { pos: POS_TEXT[group.pos] || "", cn };
}

function cleanTranslation(raw, word, exchange) {
  if (!raw) return null;
  if (/^\[网络\]/.test(String(raw).split(/\\n|\n/)[0].trim())) return null;

  const parsed = posLines(raw);
  // 没有正常释义行时，才用学科标记行兜底（internet → [计] 因特网）
  const weak = !parsed.lines.length && parsed.loose.length > 0;
  const lines = parsed.lines.length ? parsed.lines : parsed.loose;
  if (!lines.length) return null;

  // 同一词性的多行先合并（ECDICT 常把 vt / vi 拆成两行）
  const merged = [];
  lines.forEach((l) => {
    let g = merged.filter((x) => x.pos === l.pos)[0];
    if (!g) { g = { pos: l.pos, senses: [] }; merged.push(g); }
    l.senses.forEach((s) => { if (g.senses.indexOf(s) < 0) g.senses.push(s); });
  });

  const rtf = /(^|\/)(r|t):/.test(exchange || "");     // 有比较级/最高级 → 形容词或副词才是主词性
  const score = (g) => Math.min(g.senses.length, 5) *
    (POS_WEIGHT[g.pos] === undefined ? 0.9 : POS_WEIGHT[g.pos]) *
    (rtf && (g.pos === "adj" || g.pos === "adv") ? 1.35 : 1);

  const fixed = PRIMARY[word];
  let order;
  if (fixed) {
    const want = fixed.split(/\s+/);
    order = merged.slice().sort((a, b) => {
      const ia = want.indexOf(a.pos) < 0 ? 99 : want.indexOf(a.pos);
      const ib = want.indexOf(b.pos) < 0 ? 99 : want.indexOf(b.pos);
      return ia - ib || score(b) - score(a);
    });
  } else {
    // 默认沿用第一行的词性（词典一般把最常见的用法放前面，具体名词几乎都如此），
    // 只有别的词性明显更强（≥1.3 倍）才换过去
    const first = merged.filter((g) => g.pos === lines[0].pos)[0] || merged[0];
    const sorted = merged.slice().sort((a, b) => score(b) - score(a));
    order = (sorted[0] !== first && score(sorted[0]) >= score(first) * 1.3)
      ? [sorted[0]].concat(sorted.filter((g) => g !== sorted[0]))
      : [first].concat(sorted.filter((g) => g !== first));
  }
  const g = glossText(order[0]);
  return g ? { pos: g.pos, cn: g.cn, weak: weak } : null;
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

/* 词形还原：判断一个词是不是已有词的变化形式（higher → high） */
function stemOf(word) {
  const out = [];
  const add = (s) => { if (s && s.length >= 3 && s !== word && out.indexOf(s) < 0) out.push(s); };
  if (/ies$/.test(word)) add(word.replace(/ies$/, "y"));
  if (/ing$/.test(word)) { add(word.replace(/ing$/, "")); add(word.replace(/ing$/, "e")); }
  if (/ed$/.test(word)) { add(word.replace(/ed$/, "")); add(word.replace(/ed$/, "e")); }
  if (/est$/.test(word)) add(word.replace(/est$/, ""));
  if (/er$/.test(word)) { add(word.replace(/er$/, "")); add(word.replace(/er$/, "e")); }
  if (/s$/.test(word)) add(word.replace(/es$/, "").replace(/s$/, ""));
  return out;
}

/* ------------------------------ 主流程 ------------------------------ */function main() {
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
    const exchange = (row[idx.exchange] || "").trim();

    if (!/^[a-z][a-z'-]{1,20}$/.test(word)) continue;
    if (STOP.has(word)) continue;
    if (!translation) continue;

    const rank = frq || bnc;
    const isCore = oxford === 1 || collins >= 3 || /(^|\s)(zk|gk|cet4|cet6|ky|toefl|ielts)(\s|$)/.test(tag);
    if (!isCore) continue;
    if (!rank || rank > 20000) continue;

    const clean = cleanTranslation(translation, word, exchange);
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
      tag,
      weak: !!clean.weak,
      _raw: translation
    });
  }

  // 去重：一个词只留词频最靠前的
  const byWord = new Map();
  candidates.forEach((c) => {
    const old = byWord.get(c.w);
    if (!old || c.frq < old.frq) byWord.set(c.w, c);
  });

  // 只有学科标记释义的词（internet → [计] 因特网）留着；
  // 但如果它只是已有词的一个变化形式（higher / funding / hiring 这类，
  // 释义还常是「[经] 上扬」这种），那就不值得再占一个词条
  const allWords = new Set(byWord.keys());
  let weakDropped = 0;
  [...byWord.keys()].forEach((w) => {
    const c = byWord.get(w);
    if (!c.weak) return;
    if (stemOf(w).some((s) => s !== w && allWords.has(s))) { byWord.delete(w); weakDropped++; }
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

  /* --review[=N]：只打印「释义跟旧词库不一样」的词（词频 ≤ N），人工核对用 */
  const reviewArg = process.argv.find((a) => a.startsWith("--review"));
  if (reviewArg) {
    const maxRank = Number(reviewArg.split("=")[1]) || 800;
    const brief = process.argv.includes("--brief");
    const src = fs.existsSync(OUT_PATH) ? fs.readFileSync(OUT_PATH, "utf8") : "";
    const old = {};
    const re = /\{ w: "([^"]+)", ph: "([^"]*)", pos: "([^"]*)", cn: "([^"]*)", frq: (\d+)/g;
    let mm;
    while ((mm = re.exec(src))) old[mm[1]] = { pos: mm[3], cn: mm[4] };
    let n = 0;
    words.filter((w) => w.frq <= maxRank).forEach((w) => {
      const o = old[w.w];
      if (!o || (o.pos === w.pos && o.cn === w.cn)) return;
      n++;
      const lines = posLines(w._raw).lines.map((l) => (POS_TEXT[l.pos] || "?") + " " + l.senses.slice(0, 5).join("、")).join(" │ ");
      console.log("  " + w.w.padEnd(14) + String(w.frq).padStart(5) +
        "  旧[" + o.pos + " " + o.cn + "]  →  新[" + w.pos + " " + w.cn + "]");
      if (!brief) console.log("        " + lines.slice(0, 150));
    });
    console.log("\n共 " + n + " 个词的释义有变化（词频 ≤ " + maxRank + "）");
    if (process.argv.includes("--only-review")) return;
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
