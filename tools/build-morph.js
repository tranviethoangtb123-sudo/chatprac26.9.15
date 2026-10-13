/* ============================================================================
   同族词生成器 → assets/js/data.morph.js
   ----------------------------------------------------------------------------
   用途：学习模式「单词」板块，每个单词下面用小字列出同族的其他词，
        统一写「词性 英文 中文」（用户要求，不加「词根 / 衍生」这类标签）。
   做法：对词库里每个词尝试拆前缀/后缀，拆出来的部分必须
     ① 本身也在词库里（不凭猜想造词根）；
     ② 释义能和原词对上（共用至少一个非通用汉字），或者词缀本身是「强词缀」
        （un- / -less / -tion 这类几乎不会误判的）；
   合成词（home + work、foot + ball）把两半也当同族词列出来。
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
  ise: "使…化", ward: "朝向", ent: "人/物", ant: "人/物", ic: "…的", y: "…的",
  // -ery / -ary / -ory 要单列：拆成 -er + -y 会把 scenery（不是 scene+er+y）这类弄错
  ery: "名词（场所/总称）", ary: "…的/场所", ory: "…的/场所",
  ify: "使…化", ate: "使…", ee: "被…的人", eer: "从事…的人", ian: "…的人",
  dom: "领域/状态", ure: "名词（行为/结果）", age: "名词（行为/总称）"
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

// 「词性 英文 中文」，中文照词库原样给全（不截断）——用户要求这么写
function posTxt(p) {
  const s = String(p || "").trim().replace(/\.+$/, "");
  return s ? s + "." : "";
}
function ref(w) {
  const pos = posTxt(w.pos);
  const cn = String(w.cn || "").replace(/[.。\s]+$/, "");
  return (pos ? pos + " " : "") + w.w + (cn ? " " + cn : "");
}

// 拆完词缀后常见的拼写变化：happi→happy、larg→large、runn→run
function variants(base) {
  const out = [base];
  if (/i$/.test(base)) out.push(base.slice(0, -1) + "y");
  out.push(base + "e");
  if (/([bcdfglmnprst])\1$/.test(base)) out.push(base.slice(0, -1));
  return out.filter((x) => x.length >= 3);
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

  // 还原拼写变体后到词库里找词基
  function baseOf(rest) {
    for (const v of variants(rest)) {
      const b = byKey.get(v);
      if (b) return b;
    }
    return null;
  }

  // 一层词缀：un+happy、teach+er
  function oneLevel(w) {
    const cands = [];
    Object.keys(PREFIX).forEach((p) => {
      if (w.key.length - p.length < 3 || w.key.slice(0, p.length) !== p) return;
      const b = byKey.get(w.key.slice(p.length));
      if (!b) return;
      const hit = overlap(w.cn, b.cn);
      if (!hit && !STRONG_PRE.has(p)) return;
      cands.push({ kind: "affix", pres: [p], sufs: [], base: b, hit: hit });
    });
    Object.keys(SUFFIX).forEach((s) => {
      if (w.key.length - s.length < 3 || w.key.slice(-s.length) !== s) return;
      const b = baseOf(w.key.slice(0, w.key.length - s.length));
      if (!b) return;
      const hit = overlap(w.cn, b.cn);
      // 释义对不上的不要（career ← care + -er、battery ← batter + -y 这种），
      // 只有强词缀（-less / -tion / -ful …）例外
      if (!hit && !STRONG_SUF.has(s)) return;
      // -er / -or 还要求基词是动词（teacher ← teach）；基词是形容词时是比较级（lower ← low）
      if ((s === "er" || s === "or") && !/^(v|adj|adv)/.test(b.pos || "")) return;
      cands.push({ kind: "affix", pres: [], sufs: [s], base: b, hit: hit });
    });
    return cands;
  }

  // 两层词缀：中间那段不在词库里也算（carelessness 由 -less/-ness 两层拆到 care）
  function twoLevel(w) {
    const out = [];
    const firsts = [];
    Object.keys(PREFIX).forEach((p) => {
      if (w.key.startsWith(p) && w.key.length - p.length >= 5) {
        firsts.push({ type: "pre", affix: p, rest: w.key.slice(p.length) });
      }
    });
    Object.keys(SUFFIX).forEach((s) => {
      if (w.key.endsWith(s) && w.key.length - s.length >= 5) {
        firsts.push({ type: "suf", affix: s, rest: w.key.slice(0, w.key.length - s.length) });
      }
    });
    const push = (f1, type, affix, rest) => {
      // 两层拆解必须直接落在词库里的词上（不看拼写变体），否则容易拆错
      // （invariably 会被拆成 in- + variable + -y，其实是 invariable + -ly）
      const b = byKey.get(rest);
      if (!b || !overlap(w.cn, b.cn)) return;          // 两层必须靠释义对上，否则太容易误拆
      // -er / -or 后面再跟 -y/-ly 的，实际是 -ery/-ary/-ory，已经在后缀表里单列了
      if (type === "suf" && /^(er|or)$/.test(f1.affix)) return;
      if (type === "suf" && /^(y|ly)$/.test(affix) && /^(er|or)$/.test(f1.affix)) return;
      const pres = [], sufs = [];
      [f1, { type: type, affix: affix }].forEach((f) => { (f.type === "pre" ? pres : sufs).push(f.affix); });
      out.push({ kind: "affix", pres: pres, sufs: sufs, base: b, hit: true, depth: 2 });
    };
    firsts.forEach((f1) => {
      Object.keys(PREFIX).forEach((p) => {
        if (!f1.rest.startsWith(p) || f1.rest.length - p.length < 3) return;
        push(f1, "pre", p, f1.rest.slice(p.length));
      });
      Object.keys(SUFFIX).forEach((s) => {
        if (!f1.rest.endsWith(s) || f1.rest.length - s.length < 3) return;
        push(f1, "suf", s, f1.rest.slice(0, f1.rest.length - s.length));
      });
    });
    return out;
  }

  // 合成词：home+work、foot+ball（两半都在词库里，且释义对得上）
  function compoundOf(w) {
    for (let k = 3; k <= w.key.length - 3; k++) {
      const a = byKey.get(w.key.slice(0, k));
      const b = byKey.get(w.key.slice(k));
      if (!a || !b) continue;
      if (!overlap(w.cn, a.cn) && !overlap(w.cn, b.cn)) continue;
      return { kind: "compound", a: a, b: b };
    }
    return null;
  }

  function rootForm(w) {
    if (ROOT_SKIP.has(w.key)) return null;               // economy 不是 eco + nomy
    for (let k = 3; k <= Math.min(9, w.key.length - 3); k++) {
      const head = w.key.slice(0, k);
      const tail = w.key.slice(k);
      if (!ROOT_HEAD[head]) continue;
      const tailOk = ROOT_TAIL[tail]
        ? true
        : (byKey.has(tail) && overlap(w.cn, byKey.get(tail).cn));
      if (!tailOk) continue;
      return { kind: "root", head: head, tail: tail };
    }
    return null;
  }

  function split(w) {
    const one = oneLevel(w);
    one.sort((a, b) => (b.hit - a.hit) || (b.base.key.length - a.base.key.length));
    if (one.length) return one[0];
    const comp = compoundOf(w);
    if (comp) return comp;
    const rf = rootForm(w);
    if (rf) return rf;
    const two = twoLevel(w);
    if (two.length) return two[0];
    return null;
  }

  const info = new Map();      // key → { r, base }
  const family = new Map();    // baseKey → Set(keys)
  let withRoot = 0;

  words.forEach((w) => {
    const s = split(w);
    if (!s) return;
    withRoot++;
    if (s.kind === "compound") {
      // 合成词：把两半各自当一个词条列出来（home 家 + work 工作）
      info.set(w.key, { parts: [s.a.key, s.b.key] });
      return;
    }
    if (s.kind !== "affix") return;          // 只有希腊/拉丁词根的那些词没有词库里的同族词，不列
    const baseKey = s.base.key;
    info.set(w.key, { baseKey: baseKey });
    if (!family.has(baseKey)) family.set(baseKey, new Set());
    family.get(baseKey).add(w.key);
    family.get(baseKey).add(baseKey);
  });

  /* 每个词下面列出同族的其他词，统一写「词性 英文 中文」，不加「词根 / 衍生」这类标签
     （用户要求：直接写词性和单词和中文就行）。基词排最前，其余按词频，最多 4 个。 */
  const out = {};
  let withKin = 0;
  words.forEach((w) => {
    const own = info.get(w.key);
    let list = [];
    if (own && own.parts) {
      list = own.parts.map((k) => ref(byKey.get(k)));
    } else {
      const baseKey = own ? own.baseKey : (family.has(w.key) ? w.key : null);
      if (baseKey) {
        const members = [...(family.get(baseKey) || new Set())].filter((k) => k !== w.key);
        members.sort((a, b) => {
          if (a === baseKey) return -1;
          if (b === baseKey) return 1;
          return (byKey.get(a).frq || 0) - (byKey.get(b).frq || 0);
        });
        list = members.slice(0, 4).map((k) => ref(byKey.get(k)));
      }
    }
    if (!list.length) return;
    out[w.w] = { k: list };
    withKin++;
  });

  const body = Object.keys(out).map((w) =>
    "  " + JSON.stringify(w) + ": { k: [" + out[w].k.map((x) => JSON.stringify(x)).join(", ") + "] }"
  ).join(",\n");

  const src = `/* ============================================================================
   同族词（共 ${Object.keys(out).length} 个词）— 本文件由 tools/build-morph.js 自动生成
   ----------------------------------------------------------------------------
   k = 这个单词下面要列出的同族词，每项都是「词性 英文 中文」（不加「词根 / 衍生」标签）
   依据：词库释义 + 构词法（拆出来的部分本身也在词库里，释义能对上才算；合成词列两半）
   重新生成：node tools/build-morph.js
   ============================================================================ */
window.CHAT_PRAC_MORPH = {
${body}
};
`;
  fs.writeFileSync(OUT_PATH, src, "utf8");

  console.log("拆出词根的：" + withRoot + " 个词");
  console.log("输出词条：" + Object.keys(out).length + " 个（" + (src.length / 1024).toFixed(1) + " KB）");
  console.log("已写入：" + OUT_PATH);
  console.log("\n抽样：");
  const keys = Object.keys(out);
  const step = Math.max(1, Math.round(keys.length / 14));
  for (let i = 0; i < keys.length; i += step) {
    console.log("  " + keys[i].padEnd(14) + out[keys[i]].k.join("、"));
  }
}

main();
