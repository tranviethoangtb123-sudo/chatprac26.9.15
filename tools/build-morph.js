/* ============================================================================
   词根 / 衍生词生成器 → assets/js/data.morph.js
   ----------------------------------------------------------------------------
   用途：学习模式「单词」板块，每个单词下面用小字显示
     · 词根：前缀/后缀拆解 + 词缀中文（un- 不 + happy 快乐的）
     · 衍生词：同一词根下的其他词（happiness 幸福 / unhappily 不快乐地）
   做法：对词库里每个词尝试拆前缀/后缀，拆出来的部分必须
     ① 本身也在词库里（不凭猜想造词根）；
     ② 释义能和原词对上（共用至少一个非通用汉字），或者词缀本身是「强词缀」
        （un- / -less / -tion 这类几乎不会误判的）。
   注意：宁可少给，不给错——没把握就不输出这一条。
   重新生成：node tools/build-morph.js
   ============================================================================ */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const WORDS_PATH = path.join(ROOT, "assets", "js", "data.words.js");
const VOCAB_PATH = path.join(ROOT, "assets", "js", "data.vocab.js");
const OUT_PATH = path.join(ROOT, "assets", "js", "data.morph.js");

/* ------------------------------ 词缀表 ------------------------------ */
// 前缀：词缀 → 中文意思（只收学习者常见的）
const PREFIX = {
  un: "不", dis: "不/相反", non: "非", mis: "错误地", anti: "反对", counter: "反",
  in: "不", im: "不", il: "不", ir: "不",
  re: "重新", pre: "预先", post: "之后", fore: "前", over: "过度", under: "不足",
  sub: "下/次", super: "超", semi: "半", inter: "相互", trans: "跨越", co: "共同",
  de: "去除", en: "使…", ex: "向外", extra: "超出", multi: "多", auto: "自动",
  bi: "双", micro: "微小", mini: "小", out: "超出", up: "向上", well: "好",
  ill: "坏", self: "自我", uni: "单", mono: "单", poly: "多", tele: "远"
};

// 后缀：词缀 → 中文意思
const SUFFIX = {
  tion: "名词（动作）", sion: "名词（动作）", ation: "名词（动作）", ition: "名词（动作）",
  ment: "名词（结果）", ness: "名词（性质）", ity: "名词（性质）", ance: "名词（状态）",
  ence: "名词（状态）", ship: "身份/关系", hood: "时期/状态", ism: "主义", ist: "人",
  er: "人/物", or: "人/物", ful: "充满…的", less: "无…的", able: "能…的", ible: "能…的",
  ive: "…的", ous: "有…性质的", al: "…的", ly: "…地", ish: "略…的", ize: "使…化",
  ise: "使…化", ward: "朝向", ent: "人/物", ant: "人/物", ic: "…的", y: "…的"
};

// 这几个词缀几乎不会误判，即使释义对不上也认（un- / -less / -tion …）
const STRONG_PRE = new Set(["un", "dis", "non", "mis", "anti", "over", "under", "im", "il", "ir"]);
const STRONG_SUF = new Set(["less", "ful", "ness", "tion", "sion", "ation", "ition", "ment", "able", "ible", "ist", "ism", "ship", "hood"]);

/* 希腊/拉丁词根（组合形式）：bio-logy、tele-phone、photo-graph 这类
   两边都得是表里的词根，或者另一边是词库里的词，才敢拆 */
const ROOT_HEAD = {
  bio: "生命", geo: "地球", tele: "远", photo: "光", micro: "微小", macro: "宏大",
  hydro: "水", aero: "空气", astro: "星", psycho: "心理", electro: "电", techno: "技术",
  socio: "社会", eco: "生态", demo: "人民", chrono: "时间", thermo: "热", morpho: "形状",
  anthropo: "人类", crypto: "隐藏", neuro: "神经", cardio: "心脏", auto: "自己", mono: "单",
  poly: "多"
};
const ROOT_TAIL = {
  logy: "学科", ology: "学科", graph: "写/画", graphy: "写/画/学", phone: "声音",
  scope: "观察", meter: "测量", metry: "测量", cracy: "统治", nomy: "法则", pathy: "感受",
  gram: "写/记录", sophy: "智慧", sphere: "球/层", genic: "产生的", logist: "学者", phobia: "恐惧"
};

// 这几个词看着像词根组合，其实是别的来源，别拆
const ROOT_SKIP = new Set(["economy", "economic", "economics", "economist"]);

// 判断「释义对得上」时要忽略的通用字：光靠这些字重合不算证据
const GENERIC = "的地得人物事行状性用使之于不无有为很常表示…；，、（）";

/* --------------------------- 读取现有数据 --------------------------- */
function loadBank() {
  const src = fs.readFileSync(WORDS_PATH, "utf8");
  const list = [];
  const re = /\{ w: "([^"]+)", ph: "([^"]*)", pos: "([^"]*)", cn: "([^"]*)", frq: (\d+)/g;
  let m;
  while ((m = re.exec(src))) {
    list.push({ w: m[1], pos: m[3], cn: m[4], frq: Number(m[5]) });
  }
  return list;
}

// 学习词库（data.vocab.js）里的 162 个词也一起算进来，方便互相做词根/衍生词
function loadVocab() {
  if (!fs.existsSync(VOCAB_PATH)) return [];
  const src = fs.readFileSync(VOCAB_PATH, "utf8");
  const out = [];
  const re = /"([a-z][a-z' -]*)\|([^|]*)\|([^|]*)\|/g;
  let m;
  while ((m = re.exec(src))) {
    out.push({ w: m[1].trim(), pos: m[2].trim(), cn: m[3].trim(), frq: 999999 });
  }
  return out;
}

/* ------------------------------ 构词判定 ------------------------------ */
function overlap(a, b) {
  for (const ch of a) {
    if (GENERIC.indexOf(ch) >= 0) continue;
    if (b.indexOf(ch) >= 0) return true;
  }
  return false;
}

function shortGloss(cn) {
  const first = String(cn || "").split(/[；;]/)[0].replace(/[.。\s]+$/, "");
  return first.length > 6 ? first.slice(0, 6) : first;
}

function main() {
  const bank = loadBank();
  const vocab = loadVocab();
  const seen = new Set();
  const words = [];
  bank.concat(vocab).forEach((w) => {
    const key = w.w.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    words.push({ w: w.w, key: key, pos: w.pos || "", cn: w.cn || "", frq: w.frq });
  });
  const byKey = new Map();
  words.forEach((w) => byKey.set(w.key, w));
  console.log("词条 " + words.length + " 个（词库 " + bank.length + " + 学习词库 " + vocab.length + "）");

  // 拆一个词：返回 { type, affix, base } 或 null
  function split(w) {
    const cands = [];
    // 前缀
    Object.keys(PREFIX).forEach((p) => {
      if (w.key.length - p.length < 3 || w.key.slice(0, p.length) !== p) return;
      const base = w.key.slice(p.length);
      const b = byKey.get(base);
      if (!b) return;
      const ok = overlap(w.cn, b.cn) || STRONG_PRE.has(p);
      if (!ok) return;
      cands.push({ type: "pre", affix: p, base: b, hit: overlap(w.cn, b.cn) });
    });
    // 后缀
    Object.keys(SUFFIX).forEach((s) => {
      if (w.key.length - s.length < 3 || w.key.slice(-s.length) !== s) return;
      const base = w.key.slice(0, w.key.length - s.length);
      const b = byKey.get(base);
      if (!b) return;
      const hit = overlap(w.cn, b.cn);
      // 释义对不上的不要（career ← care + -er、battery ← batter + -y 这种），
      // 只有强词缀（-less / -tion / -ful …）例外
      if (!hit && !STRONG_SUF.has(s)) return;
      // -er / -or 还要求基词是动词（teacher ← teach）；基词是形容词时是比较级（lower ← low）
      if ((s === "er" || s === "or") && !/^(v|adj|adv)/.test(b.pos || "")) return;
      cands.push({ type: "suf", affix: s, base: b, hit: hit });
    });
    if (!cands.length) {
      // 希腊/拉丁词根组合：bio-logy、tele-phone、photo-graph
      for (let k = 3; k <= Math.min(9, w.key.length - 3); k++) {
        const head = w.key.slice(0, k);
        const tail = w.key.slice(k);
        if (!ROOT_HEAD[head]) continue;
        if (ROOT_SKIP.has(w.key)) continue;                       // economy 不是 eco + nomy
        const tailOk = ROOT_TAIL[tail]
          ? true
          : (byKey.has(tail) && overlap(w.cn, byKey.get(tail).cn));   // 后半截是词库里的词时，释义也得对得上
        if (!tailOk) continue;
        cands.push({ type: "root", head: head, tail: tail });
        break;
      }
    }
    if (!cands.length) return null;
    // 释义对得上的优先，其次词缀长的优先
    cands.sort((a, b) => (b.hit - a.hit) || (b.affix.length - a.affix.length));
    return cands[0];
  }

  const info = new Map();      // key → { r, base }
  const family = new Map();    // baseKey → Set(keys)
  let withRoot = 0;

  words.forEach((w) => {
    const s = split(w);
    if (!s) return;
    withRoot++;
    let affixTxt, baseKey = null;
    if (s.type === "pre") {
      affixTxt = s.affix + "- " + PREFIX[s.affix] + " + " + s.base.w +
        (shortGloss(s.base.cn) ? " " + shortGloss(s.base.cn) : "");
      baseKey = s.base.key;
    } else if (s.type === "suf") {
      const tail = (s.affix === "er" || s.affix === "or") && /^(adj|adv)/.test(s.base.pos || "")
        ? "比较级" : SUFFIX[s.affix];
      affixTxt = s.base.w + (shortGloss(s.base.cn) ? " " + shortGloss(s.base.cn) : "") + " + -" + s.affix + " " + tail;
      baseKey = s.base.key;
    } else {
      const tailTxt = ROOT_TAIL[s.tail] || (byKey.has(s.tail) ? shortGloss(byKey.get(s.tail).cn) : "");
      affixTxt = s.head + "- " + ROOT_HEAD[s.head] + " + -" + s.tail + (tailTxt ? " " + tailTxt : "");
      if (byKey.has(s.tail)) baseKey = s.tail;      // telephone 也算 phone 的衍生词
    }
    info.set(w.key, { root: affixTxt, baseKey: baseKey });
    if (baseKey) {
      if (!family.has(baseKey)) family.set(baseKey, new Set());
      family.get(baseKey).add(w.key);
      family.get(baseKey).add(baseKey);
    }
  });

  // 每个词的衍生词：同一词根下的其他词（基词排最前，其余按词频）
  const out = {};
  let withKin = 0;
  words.forEach((w) => {
    const own = info.get(w.key);
    const baseKey = own ? own.baseKey : (family.has(w.key) ? w.key : null);
    const kin = [];
    if (baseKey) {
      const members = [...(family.get(baseKey) || new Set())].filter((k) => k !== w.key);
      members.sort((a, b) => {
        if (a === baseKey) return -1;
        if (b === baseKey) return 1;
        return (byKey.get(a).frq || 0) - (byKey.get(b).frq || 0);
      });
      members.slice(0, 3).forEach((k) => {
        const m = byKey.get(k);
        const g = shortGloss(m.cn);
        kin.push(m.w + (g ? " " + g : ""));
      });
    }
    if (!own && !kin.length) return;
    const item = {};
    if (own) item.r = own.root;
    if (kin.length) { item.k = kin; withKin++; }
    out[w.w] = item;
  });

  const body = Object.keys(out).map((w) =>
    "  " + JSON.stringify(w) + ": {" +
    (out[w].r ? " r: " + JSON.stringify(out[w].r) + "," : "") +
    (out[w].k ? " k: [" + out[w].k.map((x) => JSON.stringify(x)).join(", ") + "]" : "") +
    " }"
  ).join(",\n");

  const src = `/* ============================================================================
   词根 / 衍生词（共 ${Object.keys(out).length} 个词）— 本文件由 tools/build-morph.js 自动生成
   ----------------------------------------------------------------------------
   r = 词根拆解（前缀/后缀 + 中文），k = 同一词根下的其他词
   依据：词库释义 + 构词法（拆出来的部分本身也在词库里，释义能对上才算）
   重新生成：node tools/build-morph.js
   ============================================================================ */
window.CHAT_PRAC_MORPH = {
${body}
};
`;
  fs.writeFileSync(OUT_PATH, src, "utf8");

  console.log("拆出词根：" + withRoot + " 个词");
  console.log("有衍生词：" + withKin + " 个词");
  console.log("输出词条：" + Object.keys(out).length + " 个（" + (src.length / 1024).toFixed(1) + " KB）");
  console.log("已写入：" + OUT_PATH);
  console.log("\n抽样：");
  const keys = Object.keys(out);
  const step = Math.max(1, Math.round(keys.length / 14));
  for (let i = 0; i < keys.length; i += step) {
    const o = out[keys[i]];
    console.log("  " + keys[i].padEnd(14) + (o.r ? "词根 " + o.r : "") +
      (o.k ? (o.r ? "  ｜ " : "") + "衍生 " + o.k.join("、") : ""));
  }
}

main();
