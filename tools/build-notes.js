/* ============================================================================
   场景对话「学习要点」生成器 → assets/js/data.notes.js
   ----------------------------------------------------------------------------
   给 480 段场景对话各生成四块内容：
     g 语法     该段真的出现的语法结构（规则命中，例句逐字取自对话正文）
     c 固定搭配 该段真的出现的词典短语（来自 data.collocations.js）
     n 注意事项 按该段语域 / 渠道 / 障碍类型生成的学习提示（写成建议句）
     v 词汇表   该段出现的、初中以上的词（音标 + 词性释义）

   「初中以上」怎么判定（三个条件全过才算，全部来自 ECDICT 字段）：
     ① 不带 zk 标签（zk = 中考词汇，即初中及以下）
     ② 不是牛津核心 3000（oxford = 1）
     ③ 柯林斯星级 < 4（星级越高越基础）
   再滤掉：人名/地名、只以大写出现的词、缩写、纯功能词、变形词（还原成原形）。

   数据来源（MIT License）：
     ECDICT   https://github.com/skywind3000/ECDICT        释义/词性/考试标签/词形还原
     ipa-dict https://github.com/open-dict-data/ipa-dict   现代 IPA 音标（美式）

   用法：node tools/build-notes.js
         node tools/build-notes.js --sample s04-01:0
   ============================================================================ */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const CSV_PATH = path.join(__dirname, ".cache", "ecdict.csv");
const IPA_PATH = path.join(__dirname, ".cache", "ipa_en_US.txt");
const OUT_PATH = path.join(ROOT, "assets", "js", "data.notes.js");
const V_MAX = 20;      // 每段最多列多少个词（太多了没人看）
const C_MAX = 8;       // 每段最多列多少条固定搭配
const G_MAX = 8;       // 每段最多列多少条语法（按 GRAMMAR_ORDER 取最值得讲的）
const SAMPLE = (() => { const i = process.argv.indexOf("--sample"); return i >= 0 ? process.argv[i + 1] : null; })();

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

function loadIpa() {
  const map = new Map();
  if (!fs.existsSync(IPA_PATH)) return map;
  fs.readFileSync(IPA_PATH, "utf8").split(/\r?\n/).forEach((line) => {
    const [w, ipa] = line.split("\t");
    if (!w || !ipa) return;
    map.set(w.trim().toLowerCase(), ipa.split(",")[0].trim().replace(/ɹ/g, "r").replace(/ɫ/g, "l"));
  });
  return map;
}

function normalizeOldPhonetic(ph) {
  return "/" + String(ph).replace(/ә/g, "ə").replace(/'/g, "ˈ").replace(/:/g, "ː").trim() + "/";
}

const POS_MAP = {
  n: "n.", v: "v.", vt: "v.", vi: "v.", adj: "adj.", a: "adj.", adv: "adv.", ad: "adv.",
  prep: "prep.", conj: "conj.", pron: "pron.", num: "num.", art: "art.", int: "int.",
  interj: "int.", aux: "aux.", abbr: "abbr.", pl: "n."
};

function cleanTranslation(raw) {
  if (!raw) return null;
  const first = raw.split(/\\n|\n/)[0].trim();
  if (!first || /^\[网络\]/.test(first)) return null;
  let pos = "", body = first;
  const m = first.match(/^([a-zA-Z]+)\.\s*/);
  if (m && POS_MAP[m[1].toLowerCase()]) { pos = POS_MAP[m[1].toLowerCase()]; body = first.slice(m[0].length); }
  if (/人名|地名|姓氏|城市名|商标|缩写/.test(body)) return null;
  const senses = body.split(/[；;，,、]/).map((s) => s
    .replace(/\[[^\]]{1,6}\]/g, "")
    .replace(/[（(][^）)]{0,30}[）)]/g, "")
    .replace(/[（(][^）)]*$/g, "")
    .replace(/[（()）]/g, "")
    .replace(/[.。!！?？\s]+$/g, "")
    .trim()).filter((s) => s && /[\u4e00-\u9fa5]/.test(s));
  if (!senses.length) return null;
  let cn = senses.slice(0, 2).join("；");
  if (cn.length > 16) cn = senses[0];
  if (!cn || cn.length > 18) return null;
  return { pos, cn };
}

/* --------------------------- 纯功能词（不进词汇表） --------------------------- */
const STOP = new Set(("a an the and or but if of to in on at by for with from as is are was were be been being am " +
  "do does did doing done have has had having will would shall should can could may might must " +
  "i you he she it we they me him her us them my your his its our their mine yours hers ours theirs " +
  "this that these those there here where when why how what which who whom whose " +
  "not no nor yes so very too also just than then now only own same such " +
  "all any some each every both few many much more most other another either neither " +
  "up down out off over under again once ever never always often sometimes " +
  "oh hi hey yeah ok okay hmm ha ah um eh " +
  "s t d ll re ve m n y o").split(/\s+/));

/* ============================ 语法规则库 ============================
   每条：id / 命中正则 / 讲解。例句从正文里按"整句"截取，保证逐字一致。
   会用到的词形集合（分词、不规则过去式）从 ECDICT 现场提取，避免正则瞎猜后缀。 */
/* 不规则过去式列表。
   注意：past 与原形同形的动词（put / read / cut / hurt / shut / spread 等）不能放进来，
   否则 "That is the correct way to put it." 会被误判成一般过去时。 */
const IRREGULAR_PAST = ("went said told asked came got made took gave knew thought found felt left kept saw heard met ran wrote bought brought paid sent spent stood understood wore won sat slept spoke swam taught threw woke broke chose drove ate fell flew forgot grew held lent lost meant rode rose sang shook showed sold shone shot slid sprang stole stuck stung swore swept swung tore").split(/\s+/);

/* 短语动词：用白名单（整条短语），比「动词+介词」的正则准
   （work in publishing 这种不是短语动词，白名单里没有就绝不会误报） */
const PHRASAL = [
  "check in", "check out", "fill in", "fill out", "sort out", "work out", "figure out", "find out",
  "pick up", "drop off", "turn up", "turn out", "show up", "look for", "look after", "look forward to",
  "get along", "get by", "get through", "get rid of", "put off", "put up with", "take care of",
  "take off", "take over", "bring up", "come up with", "catch up", "hang on", "hold on", "run out of",
  "set up", "sign up", "back up", "break down", "carry on", "cut down", "end up", "give up", "go on",
  "keep on", "move on", "pay off", "point out", "rely on", "stand for", "wrap up", "deal with",
  "cope with", "hang out", "chill out", "pop in", "drop by", "check on", "log in", "log out",
  "book in", "opt out of", "leave out", "hand in", "hand out", "hold up", "run into", "come across",
  "look into", "look up", "make up", "pass on", "pull over", "settle in", "take up", "try on", "wear off"
];

/* 语法条目的展示优先级：越靠前越值得讲。超过 8 条时先砍后面的（there be、时间介词这类太基础） */
const GRAMMAR_ORDER = ("modal-soft mind-ing wonder-if polite-ask indirect-q hedging refuse-soft empathy clarify " +
  "confirm-back pres-perfect pres-perf-cont if-unreal would-have passive rel-clause phrasal tag-question " +
  "suggestion used-to too-to result purpose gerund-verb want-to make-do wh-infinitive " +
  "comparative superlative as-as although unless whether-if obj-clause time-clause because countable " +
  "future-going future-will have-to be-supposed apologize please fillers there-be so-do-i negative-question " +
  "time-prep pres-cont past-cont past-simple past-neg").split(/\s+/);

function grammarRules(PART, PAST) {
  const part = (w) => PART.has(w);
  return [
    { id: "pres-perfect", test: (s, en) => /\b(have|has|'ve|i've|we've|you've|they've)\s+(not\s+|n't\s+)?([a-z]+)\b/i.exec(en), pick: (m) => part(m[3].toLowerCase()),
      t: "现在完成时（have/has + 过去分词）：讲到现在为止的经历或结果，不强调具体时间；常与 already / yet / ever / just 连用。" },
    { id: "pres-perf-cont", re: /\b(have|has|'ve)\s+been\s+[a-z]+ing\b/i,
      t: "现在完成进行时（have been + 动名词）：动作从过去持续到现在，往往还在继续，常配 for / since。" },
    { id: "past-cont", re: /\b(was|were)\s+[a-z]+ing\b/i,
      t: "过去进行时（was/were + 动名词）：过去某一刻正在发生的事，常作背景、被一般过去时打断。" },
    { id: "pres-cont", re: /\b(am|is|are|'m|'s|'re)\s+[a-z]+ing\b/i,
      t: "现在进行时（be + 动名词）：此刻正在发生，或近期临时的安排（I'm staying with a friend this week）。" },
    { id: "past-simple", test: (s, en) => {
        // 现在完成时里的过去分词别被当一般过去时（we've met 不是一般过去时）
        const stripped = en.replace(/\b(have|has|had|i've|we've|you've|they've|he's|she's|it's|'ve|'d)\s+\w+/gi, " ");
        const m = new RegExp("\\b(" + IRREGULAR_PAST.join("|") + ")\\b", "i").exec(stripped);
        if (!m) return null;
        // "Understood." 这种一个词的回答不算一般过去时
        const oneWord = s.some((x) => x.trim().replace(/[.!?,]+$/, "").toLowerCase() === m[0].toLowerCase());
        return oneWord ? null : m;
      },
      t: "一般过去时（动词过去式）：讲已经结束的过去动作，常与 yesterday / last week / ago 连用。" },
    { id: "past-neg", re: /\bdid\s?n'?o?t?\s+[a-z]+|\bdid\s+(you|he|she|it|they|we|i)\b/i,
      t: "did 构成的过去疑问/否定：did 后面的实义动词要用原形（Did you send it? 不是 Did you sent）。" },
    { id: "future-will", re: /\b(will|'ll)\s+(not\s+)?[a-z]+/i,
      t: "will + 动词原形：临时决定、承诺、预测。比 be going to 更即时。" },
    { id: "future-going", re: /\b(am|is|are|'m|'s|'re)\s+going\s+to\s+[a-z]+/i,
      t: "be going to + 动词原形：早就打算好，或有明显迹象即将发生。" },
    { id: "modal-soft", re: /\b(could|would)\s+(you|i|we)\b/i,
      t: "Could / Would + 主语：比 can / will 客气得多，办事、求助、跟陌生人说话的默认说法。" },
    { id: "have-to", re: /\b(have|has|had|'ve)\s+(got\s+)?to\s+[a-z]+/i,
      t: "have to / had to：客观规定造成的“不得不”，比 must 更常用于口语。" },
    { id: "be-supposed", re: /\b(am|is|are|was|were)\s+(supposed|able|allowed|meant)\s+to\b/i,
      t: "半情态结构（be supposed to / be able to / be allowed to）：表示应该、能够、被允许。" },
    { id: "mind-ing", re: /\bmind\s+[a-z]+ing\b/i,
      t: "Would you mind + 动名词：最委婉的请求；同意要说 Of course not / Not at all，别答 Yes。" },
    { id: "wonder-if", re: /\b(i\s+was\s+wondering|i\s+wonder|wondering\s+if)\b/i,
      t: "I was wondering if …：用过去进行时把请求说得更含蓄，是英语里最常用的软化手段。" },
    { id: "polite-ask", re: /\b(would\s+it\s+be\s+possible|do\s+you\s+think\s+i\s+could|is\s+it\s+ok(ay)?\s+if|any\s+chance)\b/i,
      t: "正式请求句式（Would it be possible / Is it okay if …）：先问可行性，再提要求。" },
    { id: "indirect-q", re: /\b(do\s+you\s+know|can\s+you\s+tell\s+me|could\s+you\s+tell\s+me|do\s+you\s+remember)\b/i,
      t: "间接疑问句（Do you know + 陈述语序）：从句里不倒装，别说 Do you know where is it。" },
    { id: "wh-infinitive", re: /\b(how|what|where|when|which)\s+to\s+[a-z]+/i,
      t: "疑问词 + 不定式（how to get / what to do）：把问句压成短语，句子里当名词用。" },
    { id: "if-unreal", re: /\bif\s+(i|you|he|she|it|we|they|there)\s+(were|was|had)\b/i,
      t: "虚拟条件句（If + 过去式，主句 would + 动词）：说与事实相反或想象的情况。" },
    { id: "would-have", re: /\bwould\s+have\s+[a-z]+/i,
      t: "would have + 过去分词：对过去的假设或遗憾（本来会……）。" },
    { id: "if-real", re: /\bif\s+[a-z]+[^,.!?]{0,30},\s*(i|you|we|they|he|she|it|there)\b/i,
      t: "真实条件句（If + 一般现在，主句用将来/情态）：主将从现，从句不用 will。" },
    { id: "unless", re: /\bunless\b/i, t: "unless = if not：除非……，本身就带否定，后面别再加 not。" },
    { id: "although", re: /\b(although|even\s+though|though)\b/i,
      t: "让步从句（although / even though）：虽然……，主句前不要再加 but。" },
    { id: "comparative", re: /\b(more|less|fewer|better|worse|cheaper|faster|bigger|easier|harder|longer|earlier|later|higher|lower|older|younger)\s+than\b|\b[a-z]{3,}(er)\s+than\b/i,
      // rather than / other than 不是比较级
      pick: (m) => !/^(rather|other|no other)\s+than$/i.test(m[0].trim()),
      t: "比较级 + than：比较两者。比较级前可用 much / far / a bit / slightly 加强或减弱。" },
    { id: "as-as", re: /\bas\s+[a-z]+\s+as\b/i, t: "as … as：两者一样。否定用 not as … as（不如）。" },
    { id: "superlative", re: /\bthe\s+(most|best|worst|cheapest|fastest|biggest|longest|easiest|hardest)\b/i,
      t: "最高级（the + -est / most）：三者以上比较，前面通常要加 the。" },
    { id: "passive", test: (s, en) => /\b(is|are|was|were|been|be|being|get|got|'s|'re)\s+([a-z]+)\s+by\b/i.exec(en) || /\b(was|were|is|are|been|be|'s)\s+([a-z]+ed)\b/i.exec(en),
      t: "被动语态（be + 过去分词）：强调动作承受者，或不提施动者时用；口语里也常用 get（got fired）。" },
    { id: "rel-clause", re: /\b[a-z]+\s+(who|which|that|where)\s+(is|are|was|were|has|have|can|will|'s|[a-z]+s)\b/i,
      t: "定语从句（who / which / that / where）：紧跟被修饰的名词。口语里作宾语的关系词可以省略。" },
    { id: "obj-clause", re: /\b(i\s+think|i\s+guess|i\s+reckon|i\s+suppose|the\s+thing\s+is)\b/i,
      t: "宾语从句 / 观点句：I think (that) + 陈述语序，用来软化立场、给自己留余地。" },
    { id: "whether-if", re: /\bwhether\b|\b(ask|asked|wonder|wondering|know|see|check|tell me|not sure|depends on|whether or not)\s+(if|whether)\b/i,
      t: "whether / if 引导的从句：表示“是否”。介词后面只能用 whether；if 只在 ask / wonder / not sure 这类词后面才等于“是否”。" },
    { id: "time-clause", re: /\b(as\s+soon\s+as|while|before|after|until|till|once|by\s+the\s+time)\s+[a-z]+/i,
      t: "时间状语从句：主句讲将来时，从句用一般现在（as soon as I get there, I'll call you）。" },
    { id: "because", re: /\b(because|since|as)\s+[a-z]+\s/i,
      t: "原因从句（because / since / as）：because 语气最强，since / as 更像“既然”。" },
    { id: "purpose", re: /\b(so\s+that|in\s+order\s+to|so\s+as\s+to)\b/i,
      t: "目的表达（so that + 从句 / in order to + 动词）：说明“为了……”。" },
    { id: "result", re: /\b(so|such)\s+[a-z]+\s+that\b/i, t: "结果状语从句（so + 形容词 + that / such + 名词 + that）：如此……以至于。" },
    { id: "too-to", re: /\btoo\s+[a-z]+\s+to\s+[a-z]+/i, t: "too … to …：太……以至于不能。注意它本身已含否定。" },
    { id: "gerund-verb", re: /\b(enjoy|mind|avoid|finish|suggest|recommend|keep|consider|practise|practice|miss|imagine)\s+[a-z]+ing\b/i,
      t: "后接动名词的动词（enjoy / avoid / suggest / keep … + doing）：这些词后面不能跟 to do。" },
    { id: "want-to", re: /\b(want|need|decide|hope|plan|try|manage|offer|refuse|expect|afford)\s+to\s+[a-z]+/i,
      t: "后接不定式的动词（want / decide / hope … + to do）：和上一类动词要分清。" },
    { id: "make-do", re: /\b(make|let|have)\s+(me|you|him|her|us|them|it)\s+[a-z]+/i,
      t: "使役结构（make / let / have + 人 + 动词原形）：get 后面要加 to（get him to sign）。" },
    { id: "suggestion", re: /\b(why\s+don'?t\s+(you|we)|how\s+about|what\s+about|shall\s+we|let'?s)\b/i,
      t: "提建议（Why don't we / How about + 动名词 / Shall we）：比 You should 更平等，不像在指挥人。" },
    { id: "tag-question", re: /,\s*(isn'?t\s+it|aren'?t\s+you|don'?t\s+you|doesn'?t\s+it|wasn'?t\s+it|right|yeah)\s*\?/i,
      t: "反意疑问 / 确认尾句（…, isn't it? / right?）：口语里用来求认同、确认信息。" },
    { id: "negative-question", re: /\b(don'?t\s+you|isn'?t\s+it|aren'?t\s+there|can'?t\s+we|won'?t\s+you)\b/i,
      t: "否定疑问句：表达惊讶、期待对方同意（Don't you think …?）。" },
    { id: "hedging", re: /\b(i'?m\s+afraid|i'?m\s+not\s+sure|it\s+seems|sort\s+of|kind\s+of|maybe|perhaps|probably|might\s+be)\b/i,
      t: "模糊限制语（I'm afraid / I'm not sure / maybe）：把话说软、避免绝对，是英语礼貌的核心手段。" },
    { id: "apologize", re: /\b(i'?m\s+sorry|sorry\s+(to|about|for)|apologize|my\s+apologies|excuse\s+me)\b/i,
      t: "道歉与打扰（Sorry to bother you / Excuse me）：开口前先降调，对方更容易配合。" },
    { id: "refuse-soft", re: /\b(i'?d\s+love\s+to,?\s+but|i'?m\s+afraid\s+i\s+can'?t|unfortunately|that'?s\s+a\s+shame,?\s+but)\b/i,
      t: "委婉拒绝（I'd love to, but …）：先肯定再给理由，最好补一个替代方案，别只甩 No。" },
    { id: "empathy", test: (s, en) => {
        // 共情句一般出现在句首；"an apology I understand" 不是共情
        for (let i = 0; i < s.length; i++) {
          if (/^(i understand|i know how you feel|that sounds|i can imagine|it must be (hard|tough|annoying|frustrating))/i.test(s[i].trim())) {
            return /\b(i understand|i know how you feel|that sounds|i can imagine|must be (hard|tough|annoying|frustrating))\b/i.exec(s[i]);
          }
        }
        return null;
      },
      t: "共情表达（That sounds … / I can imagine …）：对方有情绪时先接住情绪，再谈事实。" },
    { id: "clarify", re: /\b(sorry|could\s+you|can\s+you)\s+(repeat|say\s+that\s+again|speak\s+up|slow\s+down)|\bwhat\s+do\s+you\s+mean\b|\bpardon\b/i,
      t: "要求澄清（Sorry, could you say that again?）：听不清就问，别硬猜着答。" },
    { id: "confirm-back", re: /\b(so\s+that'?s|just\s+to\s+confirm|let\s+me\s+make\s+sure|you\s+said|did\s+i\s+get\s+that\s+right)\b/i,
      t: "复述确认（So that's … , right?）：把关键信息重复一遍，电话和办事场合必备。" },
    { id: "fillers", re: /\b(you\s+know|i\s+mean|to\s+be\s+honest|anyway|actually|well,)\b/i,
      t: "填充语（well / you know / I mean）：口语里用来争取思考时间，听起来自然；写作用要少。" },
    { id: "please", re: /\b(please|kindly)\s+[a-z]+/i,
      t: "please 软化祈使句：直接下命令容易显得冲，加 please 或改成 Could you … 会好很多。" },
    { id: "there-be", re: /\bthere\s+(is|are|was|were|'s)\b/i,
      t: "There be 句型：表示“有”，be 的单复数由后面的名词决定。" },
    { id: "used-to", re: /\b(used\s+to|be\s+used\s+to|get\s+used\s+to)\b/i,
      t: "used to do（过去常常）/ be used to doing（习惯于）：意思和结构都不同，别混。" },
    { id: "so-do-i", re: /\b(so\s+do\s+i|neither\s+do\s+i|so\s+am\s+i|me\s+too|same\s+here)\b/i,
      t: "附和与共鸣（So do I / Me too）：让对方知道你在同一阵线，对话才接得下去。" },
    { id: "countable", re: /\b(a\s+few|a\s+little|plenty\s+of|lots\s+of|a\s+couple\s+of|hardly\s+any)\b/i,
      t: "数量表达（a few + 可数 / a little + 不可数 / plenty of + 两者皆可）：用错会显得不自然。" },
    { id: "time-prep", re: /\b(at|on|in)\s+(\d{1,2}(:\d{2})?\s*(am|pm|a\.m\.|p\.m\.)?|monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december)\b/i,
      t: "时间介词（at + 时刻 / on + 星期日期 / in + 月份年份）：用错介词是高频小错。" },
    { id: "phrasal", phrases: PHRASAL,
      t: "短语动词（check in / sort out / pick up）：动词 + 介词或副词，意思往往和字面不同，要整块记。" }
  ];
}

/* ============================ 注意事项（按该段设计参数生成） ============================
   注意：data.scenarios.js 里的 register / channel / barrier / result 是自由文本
   （"半正式"、"即时消息"、"电话客服"、"达成（…）"），所以这里按关键词归类，不能直接查表。 */
const REGISTER_NOTE = {
  "随意": "这段是随意语域：有缩写、省略主语，还有 well / you know 这类填充语。跟朋友、室友这么说很自然，对客户或面试官要换成完整句。",
  "中性": "这段语域中性：句子完整但不生硬，适合大多数办事场合和同事之间，可以直接照搬。",
  "半正式": "这段是半正式语域：礼貌但不用太生分，常用 Could you / I was wondering if 这类句式。这也是职场和服务场合最常用的档位，值得整段模仿。",
  "正式": "这段偏正式：完整句 + 被动 + 委婉说法，写邮件、面试、投诉信时可以照搬。跟熟人这么讲会显得生分。"
};
const CHANNEL_RULES = [
  { k: /电话|通话|语音留言|IVR|自动语音|接线|分机|转接/, note: "电话里看不到表情和手势，时间、金额、地址这类关键信息一定要复述确认一遍；对方报数字时可以跟着重复一次。" },
  { k: /消息|文字|短信|群聊|聊天|聊天框|论坛|社交|邮件|书面|表单|问卷|文档|批注|平台|直播/, note: "文字渠道没有语气，容易读起来生硬或像指责：多用 please / thanks / sorry 软化，先说结论再说理由。" },
  { k: /视频|线上会议|远程|在线/, note: "视频/线上沟通有延迟，别抢话；关键内容说完停半秒，重要决定会后补一条书面确认。" },
  { k: /会议|委员会|听证|研讨会|评审|面谈|面试|答辩|谈判|课堂|小组/, note: "会议/面试这类场合：发言先给结论，再给一句理由；被打断时用 Can I just finish this point? 拿回话语权。" },
  { k: /面对面|柜台|前台|现场|诊室|店铺|餐厅|车内/, note: "面对面沟通可以借助表情和手势，但也更容易被即时打断：注意对方的停顿和语气，别急着把话说完。" }
];
const BARRIER_RULES = [
  { k: /听不清|没听清|听错|口音|名字|拼写|数字|信号|嘈杂|重复/, note: "这段的核心是「没听清 → 澄清 → 确认」：别硬猜着答，用 Sorry, could you say that again? / Let me repeat that back 把信息锁死。" },
  { k: /情绪|生气|发火|崩溃|哭|慌|紧张|不安|尴尬|冷场|冲突|吵|争执|重话|讽刺|误会|受伤|失望|不耐烦/, note: "这段带着情绪：先接住情绪（That sounds really frustrating. / I understand why you're upset.）再谈事实，一上来讲道理只会更僵。" },
  { k: /不肯|拒绝|不同意|不接受|推责|压价|超出|超权限|规定|政策|条款|反驳|异议|坚持/, note: "这段是拒绝/异议/顶规则：先肯定对方立场，再给依据和替代方案（I'd love to help, but … / Here's what I can do），比直接说 No 有用得多。" },
  { k: /多人|插话|抢话|同时|麦克风|静音|线上的人|归拢/, note: "多人场合要主动点名和归纳（Sorry, Tom, what do you think? / So we have two options …），否则话会散掉。" },
  { k: /网络|断线|卡顿|卡住|共享|黑屏|应用|系统|页面|二维码|自助/, note: "技术故障场合：先说清现象（时间、界面、报错），再提要求；重要信息不要只在坏线路上确认。" },
  { k: /时间|来不及|赶|截止|延期|拖延|超时|迟到|排队|忙碌|日程/, note: "时间紧张的场合：先把时限说明白（I only have ten minutes），再决定这次一定要解决哪一件事。" }
];
const RESULT_NOTE = {
  "折中": "这段的结局是各让一步：重点看双方是怎么把「不行」变成「这样可以」的——让步的条件是怎么谈出来的。",
  "修复": "这段的结局是修复关系/修复沟通：注意那个把话拉回来的转折句，比前面所有的客套都值钱。"
};

/* 常用语块：对话里高频、值得整块记的说法（词典短语表覆盖不到口语搭配，这里补上） */
const CHUNKS = [
  ["nice to meet you", "很高兴认识你"], ["how are you doing", "你最近怎么样"], ["long time no see", "好久不见"],
  ["what do you do", "你是做什么工作的"], ["where are you from", "你从哪来"], ["how's it going", "最近怎么样"],
  ["i'd like to", "我想要（客气）"], ["would you like to", "你想要……吗"], ["feel free to", "请随意、尽管"],
  ["i was wondering if", "不知能不能（很客气）"], ["would you mind", "你介意……吗（最委婉的请求）"],
  ["do you mind if", "我……你介意吗"], ["could you please", "能不能请你……"], ["sorry to bother you", "不好意思打扰一下"],
  ["excuse me", "打扰一下"], ["by any chance", "（顺便问一下）该不会"], ["just in case", "以防万一"],
  ["in advance", "提前"], ["as soon as possible", "尽快"], ["at the latest", "最晚"],
  ["on my way", "我在路上了"], ["running late", "要迟到了"], ["take your time", "不着急，慢慢来"],
  ["no worries", "没事、别客气"], ["no problem", "没问题"], ["that's fine", "可以、没关系"],
  ["sounds good", "听起来不错"], ["that works for me", "我这没问题"], ["i'm not sure", "我不太确定"],
  ["it depends", "看情况"], ["i'm afraid", "恐怕（委婉拒绝/坏消息）"], ["to be honest", "说实话"],
  ["as far as i know", "据我所知"], ["in that case", "那样的话"], ["by the way", "顺便说一句"],
  ["on the other hand", "另一方面"], ["in the meantime", "在此期间"], ["for now", "暂时"],
  ["make sense", "讲得通、能理解"], ["make sure", "确保"], ["figure out", "想明白、弄清楚"],
  ["sort out", "把……处理好"], ["deal with", "处理、应付"], ["get in touch", "联系上"],
  ["keep me posted", "有消息告诉我"], ["i'll get back to you", "我回头答复你"], ["follow up", "跟进"],
  ["reach out", "联系（某人）"], ["catch up", "叙旧、聊聊近况"], ["drop by", "顺便过来"],
  ["make an appointment", "预约"], ["place an order", "下单"], ["file a complaint", "投诉"],
  ["get a refund", "拿到退款"], ["pay by card", "刷卡支付"], ["in cash", "付现金"],
  ["out of stock", "没货了"], ["sold out", "卖完了"], ["under warranty", "在保修期内"],
  ["within walking distance", "走路就能到"], ["close to", "靠近"], ["next to", "紧挨着"],
  ["in front of", "在……前面"], ["at the end of", "在……末尾"], ["on the corner", "在拐角处"],
  ["look forward to", "期待"], ["get used to", "习惯于"], ["be supposed to", "按理应该"],
  ["end up", "最后变成"], ["turn out", "结果是"], ["come up with", "想出"],
  ["run out of", "用完、耗尽"], ["put off", "推迟"], ["put up with", "忍受"],
  ["take care of", "照顾、负责"], ["look after", "照看"], ["look into", "调查一下"],
  ["check in", "办入住/值机"], ["check out", "退房/结账"], ["fill in", "填写"],
  ["sign up", "报名、注册"], ["opt out", "选择退出"], ["back up", "备份、支持"],
  ["write down", "记下来"], ["point out", "指出"], ["work out", "锻炼/解决/结果不错"],
  ["give up", "放弃"], ["hold on", "等一下"], ["hang on", "稍等"],
  ["go ahead", "请便、继续"], ["after you", "您先请"], ["my pleasure", "是我的荣幸"],
  ["you're welcome", "不客气"], ["thanks a lot", "非常感谢"], ["i appreciate it", "很感谢"],
  ["i'm sorry to hear that", "听到这个我很难过"], ["that sounds great", "听起来很棒"],
  ["that's a shame", "太可惜了"], ["never mind", "算了、没关系"], ["no idea", "不知道"],
  ["i see", "我明白了"], ["right away", "马上"], ["in a row", "连续地"],
  ["at least", "至少"], ["as usual", "像往常一样"], ["a couple of", "几个、两三个"],
  ["plenty of", "大量的"], ["a bit", "有点儿"], ["kind of", "有点儿、算是"],
  ["on purpose", "故意"], ["by mistake", "不小心"], ["for sure", "确定、当然"],
  ["no rush", "不急"], ["that's the thing", "问题就在这儿"], ["the thing is", "问题是"],
  ["to be fair", "说句公道话"], ["at this point", "眼下、到这一步"], ["either way", "不管哪种都行"],
  ["if that works", "如果这样合适的话"], ["let me check", "我查一下"], ["i'll see what i can do", "我看看能帮到什么"],
  ["keep it down", "小声点"], ["speak up", "说大声点"], ["slow down", "说慢点"],
  ["come again", "再说一遍"], ["you lost me", "我没听懂"], ["got it", "明白了"],
  ["depend on", "取决于、依靠"], ["interested in", "对……感兴趣"], ["good at", "擅长"],
  ["afraid of", "害怕"], ["worried about", "担心"], ["responsible for", "负责"],
  ["familiar with", "熟悉"], ["similar to", "与……相似"], ["different from", "与……不同"],
  ["ready for", "为……做好准备"], ["proud of", "为……骄傲"], ["tired of", "厌倦"],
  ["based on", "基于"], ["according to", "根据"], ["instead of", "而不是"],
  ["thanks to", "多亏"], ["because of", "因为"], ["in spite of", "尽管"],
  ["in terms of", "就……而言"], ["in charge of", "负责"], ["in favour of", "支持"],
  ["on behalf of", "代表"], ["as well as", "以及"], ["apart from", "除了"],
  ["except for", "除了"], ["due to", "由于"], ["prior to", "在……之前"],
  ["regardless of", "无论"], ["aware of", "意识到"], ["capable of", "能够"],
  ["full of", "满是"], ["short of", "缺少"], ["keen on", "热衷于"],
  ["worried that", "担心（某事）"], ["make sure that", "确保"], ["as long as", "只要"],
  ["as soon as", "一……就"], ["in case of", "万一"], ["by the time", "到……的时候"],
  ["so far", "到目前为止"], ["up to now", "到目前为止"], ["from now on", "从现在起"],
  ["right now", "现在、马上"], ["at once", "立刻"], ["in a minute", "马上"],
  ["ahead of time", "提前"], ["on time", "准时"], ["in time", "及时"],
  ["out of date", "过时"], ["up to date", "最新"], ["in order", "整齐、按顺序"],
  ["out of order", "坏了、故障"], ["in trouble", "有麻烦"], ["on purpose", "故意"],
  ["by accident", "偶然、不小心"], ["in fact", "事实上"], ["as a result", "结果"],
  ["for example", "例如"], ["such as", "例如"], ["no longer", "不再"],
  ["as well", "也"], ["at all", "根本（用于否定）"], ["not at all", "一点也不、不客气"],
  ["more or less", "大致上"], ["sooner or later", "迟早"], ["once in a while", "偶尔"],
  ["all the time", "一直"], ["every now and then", "时不时"], ["from time to time", "偶尔"],
  ["in the end", "最后"], ["at first", "起初"], ["at least", "至少"],
  ["at most", "最多"], ["in total", "总共"], ["per cent", "百分之……"],
  ["give it a try", "试一下"], ["have a look", "看一看"], ["take a look", "看一眼"],
  ["make a difference", "有影响、起作用"], ["make up your mind", "下定决心"],
  ["change your mind", "改变主意"], ["keep in mind", "记住"], ["bear in mind", "记住"],
  ["get the point", "明白重点"], ["lost track of", "跟丢了、忘了"], ["on second thoughts", "转念一想"],
  ["in other words", "换句话说"], ["that is to say", "也就是说"], ["to sum up", "总之"]
];


/* ============================ 主流程 ============================ */
function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error("缺少词典文件：" + CSV_PATH + "\n请先运行 node tools/fetch-data.js");
    process.exit(1);
  }

  globalThis.window = globalThis;
  ["data.scenarios.js", "data.collocations.js", "data.words.js", "data.phon.js"].forEach((f) => {
    vm.runInThisContext(fs.readFileSync(path.join(ROOT, "assets", "js", f), "utf8"), { filename: f });
  });
  const SC = globalThis.CHAT_PRAC_SCENARIOS;
  const DATA = globalThis.CHAT_PRAC_DATA;

  console.log("读取词典（约 63MB）…");
  const rows = parseCsv(fs.readFileSync(CSV_PATH, "utf8"));
  const header = rows[0];
  const idx = {};
  header.forEach((h, i) => { idx[h.trim()] = i; });

  const ipa = loadIpa();
  const DICT = new Map();
  const LEMMA = new Map();     // 变形 → 原形（ECDICT exchange 里的 0: 字段，权威词形还原）
  const PART = new Set();      // 过去分词
  const PAST = new Set(IRREGULAR_PAST);

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.length < 8) continue;
    const w = (row[idx.word] || "").trim().toLowerCase();
    if (!/^[a-z][a-z'-]{1,20}$/.test(w)) continue;
    const exchange = row[idx.exchange] || "";
    const lemma = /(?:^|\/)\s*0:([a-z][a-z'-]{1,20})/.exec(exchange);
    if (lemma && lemma[1] !== w) LEMMA.set(w, lemma[1]);
    exchange.split("/").forEach((part) => {
      const m = /^d:([a-z][a-z'-]{1,20})$/.exec(part.trim());
      if (m) PART.add(m[1]);
    });
    if (w.endsWith("ed")) PART.add(w);
    if (DICT.has(w)) continue;
    DICT.set(w, {
      tag: (row[idx.tag] || "").trim(),
      oxford: Number(row[idx.oxford]) || 0,
      collins: Number(row[idx.collins]) || 0,
      phon: ipa.get(w) || ((row[idx.phonetic] || "").trim() ? normalizeOldPhonetic(row[idx.phonetic].trim()) : ""),
      clean: cleanTranslation(row[idx.translation] || "")
    });
  }
  console.log("词典 " + DICT.size + " 词条，词形还原 " + LEMMA.size + " 条，过去分词 " + PART.size + " 个");

  const phonBank = {};
  (DATA.words || []).forEach((x) => { phonBank[x.w] = x.ph; });
  Object.keys(globalThis.CHAT_PRAC_PHON || {}).forEach((k) => { phonBank[k] = globalThis.CHAT_PRAC_PHON[k]; });

  const COLLOC = DATA.collocations || {};
  const PHRASES = [];
  const seenPhrase = new Set();
  Object.keys(COLLOC).forEach((head) => {
    (COLLOC[head] || []).forEach((pair) => {
      const p = String(pair[0]).toLowerCase();
      if (seenPhrase.has(p)) return;
      seenPhrase.add(p);
      PHRASES.push({ p, cn: pair[1] });
    });
  });
  // 口语语块（词典短语表覆盖不到，见 CHUNKS）
  CHUNKS.forEach(([p, cn]) => {
    if (seenPhrase.has(p)) return;
    seenPhrase.add(p);
    PHRASES.push({ p, cn });
  });
  console.log("短语来源：" + Object.keys(COLLOC).length + " 个词典词条 + " + CHUNKS.length + " 条口语语块 = " + PHRASES.length + " 条");

  // 语域取值在数据里是自由文本（"半正式（情绪化）"），这里归一化
  function registerNote(text) {
    const t = String(text || "");
    if (/随意/.test(t)) return REGISTER_NOTE["随意"];
    if (/半正式/.test(t)) return REGISTER_NOTE["半正式"];
    if (/中性/.test(t)) return REGISTER_NOTE["中性"];
    if (/正式/.test(t)) return REGISTER_NOTE["正式"];
    return "";
  }

  // 初中及以下：中考标签 / 牛津核心 3000 / 柯林斯四星以上
  const isBasic = (e) => !!e && (/(^|\s)zk(\s|$)/.test(e.tag) || e.oxford === 1 || e.collins >= 4);
  // ECDICT 里变形词条自己的释义是「X的过去式」这种，不算真释义
  const isFormGloss = (e) => !!e && /的(过去式|过去分词|复数|第三人称|现在分词|ing形式|比较级|最高级)|复数形式|过去式和过去分词/.test(e.clean ? e.clean.cn : "");

  /* 词形还原后判定：
     ① 有 ECDICT 的 0: 原形 → 一律按原形判定（reserved → reserve，met → meet 是基础词就整条丢掉）
     ② 本身有真释义且不基础 → 用它自己（designer 就不会被误剥成 design）
     ③ 词典里查不到 → 才尝试去后缀（s / es / ing / ed） */
  function lookup(token) {
    if (LEMMA.has(token)) {
      const base = LEMMA.get(token);
      const e = DICT.get(base);
      if (!e || !e.clean || isBasic(e)) return null;
      return { w: base, e };
    }
    const direct = DICT.get(token);
    if (direct && direct.clean && !isBasic(direct) && !isFormGloss(direct)) return { w: token, e: direct };
    if (!direct) {
      const cands = [];
      if (/ies$/.test(token)) cands.push(token.replace(/ies$/, "y"));
      if (/es$/.test(token)) cands.push(token.replace(/es$/, ""));
      if (/s$/.test(token) && token.length > 4) cands.push(token.replace(/s$/, ""));
      if (/ing$/.test(token)) { cands.push(token.replace(/ing$/, ""), token.replace(/ing$/, "e")); }
      if (/ed$/.test(token)) { cands.push(token.replace(/ed$/, ""), token.replace(/ed$/, "e")); }
      for (const c of cands) {
        const e = DICT.get(c);
        if (e && e.clean && !isBasic(e) && !isFormGloss(e)) return { w: c, e };
      }
    }
    return null;
  }

  const words = {}, colls = {}, seg = {};
  const ruleTexts = [], ruleIdx = {};     // 语法讲解文本（几十条，跨段落共享）
  const noteTexts = [], noteIdx = {};     // 注意事项文本（同样共享）
  const intern = (arr, map, s) => {
    if (map[s] === undefined) { map[s] = arr.length; arr.push(s); }
    return map[s];
  };
  const stats = { segs: 0, g: 0, c: 0, n: 0, v: 0, vUniq: 0, empty: { g: 0, c: 0, n: 0, v: 0 } };

  (SC.scenarios || []).forEach((scn) => {
    (scn.dialogues || []).forEach((d, di) => {
      const key = scn.id + ":" + di;
      const lines = d.lines || [];
      if (!lines.length) return;
      stats.segs++;
      const rules = grammarRules(PART, PAST);

      /* ---------- 语法（例句取整句；按教学价值排序后最多 8 条） ---------- */
      const gAll = [], seenG = new Set();
      lines.forEach((l) => {
        const en = String(l.en || "");
        const sentences = en.split(/(?<=[.!?])\s+/).filter(Boolean);
        rules.forEach((rule) => {
          if (seenG.has(rule.id)) return;
          let m = null;
          if (rule.phrases) {
            const low = " " + en.toLowerCase().replace(/[^a-z' ]+/g, " ").replace(/\s+/g, " ") + " ";
            const hit = rule.phrases.find((p) => low.indexOf(" " + p + " ") >= 0);
            if (!hit) return;
            m = [hit];
          } else {
            m = rule.test ? rule.test(sentences, en) : rule.re.exec(en);
            if (!m) return;
            if (rule.pick && !rule.pick(m)) return;
          }
          // 例句必须是包含命中的那一整句；找不到就说明是跨句误配，直接跳过
          // （这样"讲解"和"例句"永远对得上，不会出现例句里根本没这个语法的情况）
          const hitSentence = sentences.find((s) => s.toLowerCase().indexOf(String(m[0]).toLowerCase()) >= 0);
          if (!hitSentence) return;
          seenG.add(rule.id);
          let q = hitSentence;
          if (q.length > 72) {
            const at = Math.max(0, q.toLowerCase().indexOf(String(m[0]).toLowerCase()) - 20);
            q = (at > 0 ? "…" : "") + q.slice(at, at + 68).trim() + "…";
          }
          gAll.push({ id: rule.id, q: q.trim(), t: rule.t });
        });
      });
      gAll.sort((a, b) => {
        const ia = GRAMMAR_ORDER.indexOf(a.id), ib = GRAMMAR_ORDER.indexOf(b.id);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      });
      const g = gAll.slice(0, G_MAX).map((x) => [intern(ruleTexts, ruleIdx, x.t), x.q]);

      /* ---------- 固定搭配（词典短语 + 口语语块，长的优先） ---------- */
      const lower = lines.map((l) => " " + String(l.en || "").toLowerCase().replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ") + " ");
      const hits = [], seenC = new Set();
      PHRASES.forEach((ph) => {
        if (seenC.has(ph.p)) return;
        if (lower.some((t) => t.indexOf(" " + ph.p + " ") >= 0)) { seenC.add(ph.p); hits.push(ph); }
      });
      hits.sort((a, b) => b.p.length - a.p.length);
      const c = [];
      hits.slice(0, C_MAX).forEach((ph) => {
        c.push(ph.p);
        colls[ph.p] = ph.cn;
      });

      /* ---------- 词汇表（初中以上） ---------- */
      const v = [], seenV = new Set();
      lines.forEach((l) => {
        const en = String(l.en || "");
        const toks = en.match(/[A-Za-z][A-Za-z'-]*/g) || [];
        toks.forEach((raw) => {
          const low = raw.toLowerCase();
          if (raw.indexOf("'") >= 0) return;                  // 缩写 i'm / don't 不算生词
          if (low.length < 3) return;
          if (STOP.has(low)) return;
          const found = lookup(low);
          if (!found || !found.e.clean) return;
          const e = found.e;
          if (isBasic(e)) return;
          if (/^re-/.test(found.w)) return;                   // re-code / re-argue 这类纯派生词不进词表
          // 只以大写出现的词：多半是人名/地名（Mia / Leo / Chen）
          const alwaysCap = !new RegExp("\\b" + low + "\\b").test(en) && new RegExp("\\b" + raw + "\\b").test(en);
          if (alwaysCap && e.oxford !== 1 && e.collins < 3) return;
          if (seenV.has(found.w)) return;
          seenV.add(found.w);
          v.push(found.w);
          if (!words[found.w]) {
            words[found.w] = [phonBank[found.w] || e.phon || "", (e.clean.pos ? e.clean.pos + " " : "") + e.clean.cn];
          }
        });
      });
      const vOut = v.slice(0, V_MAX);

      /* ---------- 注意事项（语域 + 渠道 + 障碍 + 结局，最多 5 条） ---------- */
      const n = [];
      const regNote = registerNote(d.register);
      if (regNote) n.push(regNote);
      const chText = String(d.channel || "");
      let chCount = 0;
      CHANNEL_RULES.forEach((r) => {
        if (chCount >= 2 || !r.k.test(chText)) return;
        if (n.indexOf(r.note) >= 0) return;
        n.push(r.note);
        chCount++;
      });
      const barText = String(d.barrier || "").trim();
      if (barText && !/^无/.test(barText)) {
        const hit = BARRIER_RULES.find((r) => r.k.test(barText));
        n.push(hit ? hit.note : "这段的障碍是「" + barText.replace(/[（(].*$/, "").trim() +
          "」：留意对话是怎么把这个坎绕过去的——那几句才是真正能迁移的。");
      }
      const resText = String(d.result || "");
      Object.keys(RESULT_NOTE).forEach((k) => { if (resText.indexOf(k) === 0 && n.length < 5) n.push(RESULT_NOTE[k]); });

      stats.g += g.length; stats.c += c.length; stats.n += n.length; stats.v += vOut.length;
      if (!g.length) stats.empty.g++;
      if (!c.length) stats.empty.c++;
      if (!n.length) stats.empty.n++;
      if (!vOut.length) stats.empty.v++;
      const one = {};
      if (g.length) one.g = g;
      if (c.length) one.c = c;
      if (n.length) one.n = n.map((t) => intern(noteTexts, noteIdx, t));
      if (vOut.length) one.v = vOut;
      seg[key] = one;
    });
  });

  if (SAMPLE) {
    console.log("\n抽样 " + SAMPLE);
    const one = seg[SAMPLE] || {};
    console.log("语法：");
    (one.g || []).forEach((x) => console.log("  · [" + x[1] + "]\n    " + ruleTexts[x[0]]));
    console.log("固定搭配：");
    (one.c || []).forEach((p) => console.log("  · " + p + "  " + colls[p]));
    console.log("注意事项：");
    (one.n || []).forEach((i) => console.log("  · " + noteTexts[i]));
    console.log("词汇表：");
    (one.v || []).forEach((w) => console.log("  · " + w.padEnd(14) + (words[w] ? words[w][0].padEnd(20) + words[w][1] : "")));
    return;
  }

  stats.vUniq = Object.keys(words).length;
  const head = [
    "/* ============================================================================",
    "   场景对话「学习要点」— 本文件由 tools/build-notes.js 自动生成，不要手工编辑",
    "   ----------------------------------------------------------------------------",
    "   seg[\"场景id:序号\"] 四块内容（文本都放在共享表里，段落里只存索引，省体积）：",
    "     g 语法     [[rules 下标, 例句], …]  例句逐字取自对话正文",
    "     c 固定搭配 [短语, …]                中文在 colls 里查",
    "     n 注意事项 [texts 下标, …]",
    "     v 词汇表   [词, …]                  音标/释义在 words 里查",
    "   「初中以上」= 不带中考(zk)标签 + 非牛津核心3000 + 柯林斯星级<4",
    "   释义 / 词性 / 考试标签：ECDICT  https://github.com/skywind3000/ECDICT  (MIT License)",
    "   音标（美式 IPA）：ipa-dict  https://github.com/open-dict-data/ipa-dict  (MIT License)",
    "   重新生成：node tools/build-notes.js",
    "   共 " + stats.segs + " 段：语法 " + stats.g + " / 固定搭配 " + stats.c +
      " / 注意事项 " + stats.n + " / 词汇引用 " + stats.v + "（去重 " + stats.vUniq + " 词）",
    "   ============================================================================ */"
  ];
  const out = head.concat([
    "window.CHAT_PRAC_NOTES = {",
    "  rules: " + JSON.stringify(ruleTexts) + ",",
    "  texts: " + JSON.stringify(noteTexts) + ",",
    "  words: {",
    Object.keys(words).sort().map((w) => "    " + JSON.stringify(w) + ": [" + JSON.stringify(words[w][0]) + ", " + JSON.stringify(words[w][1]) + "]").join(",\n"),
    "  },",
    "  colls: {",
    Object.keys(colls).sort().map((p) => "    " + JSON.stringify(p) + ": " + JSON.stringify(colls[p])).join(",\n"),
    "  },",
    "  seg: {",
    Object.keys(seg).sort().map((k) => "    " + JSON.stringify(k) + ": " + JSON.stringify(seg[k])).join(",\n"),
    "  }",
    "};",
    ""
  ]).join("\n");
  console.log("  共有讲解文本 " + ruleTexts.length + " 条、注意事项文本 " + noteTexts.length + " 条（去重后）");

  fs.writeFileSync(OUT_PATH, out, "utf8");
  console.log("\n段落 " + stats.segs);
  console.log("  语法 " + stats.g + " 条（" + (stats.g / stats.segs).toFixed(1) + " 条/段）");
  console.log("  固定搭配 " + stats.c + " 条（" + (stats.c / stats.segs).toFixed(1) + " 条/段）");
  console.log("  注意事项 " + stats.n + " 条（" + (stats.n / stats.segs).toFixed(1) + " 条/段）");
  console.log("  超纲词去重 " + stats.vUniq + " 个，段落引用 " + stats.v + " 次（" + (stats.v / stats.segs).toFixed(1) + " 个/段）");
  console.log("  空缺段落：语法 " + stats.empty.g + " / 固定搭配 " + stats.empty.c +
    " / 注意事项 " + stats.empty.n + " / 词汇表 " + stats.empty.v + "（共 " + stats.segs + " 段）");
  console.log("已写入：" + OUT_PATH + "（" + (out.length / 1024).toFixed(0) + " KB）");
}

main();
