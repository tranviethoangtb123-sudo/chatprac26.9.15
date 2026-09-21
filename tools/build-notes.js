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
const C_MAX = 12;      // 每段最多列多少条固定搭配（用户要求"多列一点"）
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
  ["in other words", "换句话说"], ["that is to say", "也就是说"], ["to sum up", "总之"],
  /* ---------- 常用短语动词（中文按口语里的意思写，词典义项常常偏书面） ---------- */
  ["take up", "开始从事；占用（时间/空间）"], ["come by", "顺便过来；得到"],
  ["sort out", "把……处理好；解决"], ["figure out", "想明白；弄清楚"],
  ["pick up", "接人；取东西；学会"], ["drop off", "顺路送到；放下"],
  ["put off", "推迟；让人反感"], ["call off", "取消"],
  ["turn down", "拒绝；调小（音量）"], ["turn up", "出现；调大"],
  ["turn out", "结果发现是"], ["show up", "露面；出现"],
  ["give up", "放弃"], ["give in", "让步；屈服"],
  ["hold on", "稍等；（电话）别挂"], ["hang on", "稍等"],
  ["hang up", "挂电话"], ["carry on", "继续"],
  ["get through", "接通电话；熬过去"], ["go through", "经历；仔细过一遍"],
  ["get over", "从……恢复过来"], ["get along", "相处得来"],
  ["get by", "勉强应付得过去"], ["get rid of", "摆脱；扔掉"],
  ["run into", "偶遇；撞上（麻烦）"], ["run out of", "用完"],
  ["come across", "偶然遇到；给人的印象是"], ["come up with", "想出（办法）"],
  ["catch up", "赶上；叙旧"], ["keep up", "跟上；保持"],
  ["look into", "调查一下"], ["look up", "查（词典）；好转"],
  ["look after", "照看"], ["look out", "当心"],
  ["look forward to", "期待"], ["look over", "大致看一遍"],
  ["make out", "听清/看清；理解"], ["make up", "编造；和好；补上"],
  ["make up for", "弥补"], ["point out", "指出"],
  ["put up with", "忍受"], ["put through", "（电话）转接"],
  ["put down", "放下；写下；贬低"], ["take off", "起飞；脱掉；请假"],
  ["take over", "接手；接管"], ["take on", "承担；雇用"],
  ["take after", "长得像（长辈）"], ["take in", "理解；收留；改小（衣服）"],
  ["take out", "取出；带出去"], ["take back", "收回（说过的话）；退货"],
  ["bring up", "提出；抚养"], ["bring in", "引入；带来（收入）"],
  ["break down", "出故障；情绪崩溃"], ["break up", "分手；散会"],
  ["check out", "退房；结账；看看"], ["check in", "办入住；值机"],
  ["fill in", "填写；临时顶替"], ["fill out", "填写（表格）"],
  ["hand in", "上交"], ["hand out", "分发"],
  ["set up", "安排；建立"], ["set off", "出发；触发（警报）"],
  ["set out", "动身；着手"], ["sign up", "报名；注册"],
  ["opt out", "选择退出"], ["back up", "备份；支持；倒车"],
  ["wrap up", "收尾；结束"], ["end up", "最后（变成）"],
  ["pay off", "还清；见成效"], ["pay back", "还钱；报复"],
  ["work out", "锻炼；算出；顺利解决"], ["work on", "着手做；说服"],
  ["stand out", "显眼；突出"], ["stand for", "代表；容忍"],
  ["turn to", "求助于；转向"], ["refer to", "提到；查阅"],
  ["rely on", "依靠"], ["depend on", "取决于；依赖"],
  ["count on", "指望"], ["insist on", "坚持要"],
  ["focus on", "专注于"], ["move on", "继续往前；翻篇"],
  ["move in", "搬进来"], ["move out", "搬出去"],
  ["settle in", "适应下来；安顿好"], ["settle down", "安定下来"],
  ["drop by", "顺便来访"], ["drop out", "退出；辍学"],
  ["pop in", "顺道进来一下"], ["hang out", "一起消磨时间"],
  ["chill out", "放松一下"], ["calm down", "冷静下来"],
  ["slow down", "慢下来"], ["speed up", "加快"],
  ["cut down", "减少；砍倒"], ["cut off", "切断；打断（电话）"],
  ["cut out", "戒掉；剪下来"], ["cross out", "划掉"],
  ["throw away", "扔掉；浪费掉"], ["give away", "送掉；泄露"],
  ["try on", "试穿"], ["try out", "试用；试训"],
  ["wear out", "穿坏；使疲惫"], ["wear off", "（药效/新鲜感）消退"],
  ["wash up", "洗碗"], ["tidy up", "收拾整齐"],
  ["clear up", "放晴；澄清；收拾"], ["clean up", "打扫干净"],
  ["fix up", "安排；修好"], ["patch up", "修补；和好"],
  ["top up", "续满；充值"], ["team up", "组队"],
  ["catch on", "流行起来；明白过来"], ["come round", "顺道过来；改变主意"],
  ["come over", "过来（家里）"], ["come along", "一起来；进展"],
  ["go ahead", "请便；继续"], ["go on", "继续；发生"],
  ["go off", "（闹钟）响；变质；爆炸"], ["go over", "复习；重看一遍"],
  ["go back on", "违背（承诺）"], ["get back to", "回头答复（某人）"],
  ["get in touch", "联系上"], ["keep in touch", "保持联系"],
  ["keep on", "继续（做）"], ["keep to", "遵守；坚持（计划）"],
  ["hold up", "耽误；支撑；举起"], ["hold back", "忍住；隐瞒"],
  ["let down", "让……失望"], ["let in", "让进来"],
  ["let out", "放出去；发出（声音）"], ["lock out", "把……锁在外面"],
  ["mess up", "搞砸"], ["screw up", "搞砸（口语）"],
  ["mix up", "弄混"], ["sort itself out", "自己会解决"],
  ["slip up", "出错"], ["slip out", "（话）脱口而出"],
  ["note down", "记下来"], ["jot down", "随手记下"],
  ["write off", "报废；当作损失"], ["read out", "念出来"],
  ["speak up", "说大声点；明确表态"], ["speak out", "公开表态"],
  ["call back", "回电话"], ["ring back", "回电话"],
  ["call on", "拜访；请（某人）发言"], ["call in", "叫来；请（人）帮忙"],
  ["bring about", "导致"], ["bring down", "降低；使倒台"],
  ["bring forward", "提前"], ["push back", "推迟；反驳"],
  ["line up", "排好队；安排好"], ["queue up", "排队"],
  ["head off", "动身；阻止"], ["set aside", "留出；搁置"],
  ["put aside", "放到一边；存起来"], ["lay off", "裁员；停止"],
  ["take down", "记下；拆下"], ["take apart", "拆开"],
  ["put together", "组装；凑齐"], ["piece together", "拼凑出（真相）"],
  ["go along with", "同意；配合"], ["get away with", "侥幸逃过"],
  ["make do with", "将就着用"], ["live up to", "不辜负（期望）"],
  ["keep up with", "跟上"], ["put in for", "申请"],
  ["look up to", "敬重"], ["look down on", "看不起"],
  ["run by", "向（某人）说一下征求意见"], ["run through", "过一遍；排练"],
  ["walk through", "带着走一遍（流程）"], ["talk through", "把……讲清楚"],
  ["think over", "仔细考虑"], ["think through", "想透"],
  ["sleep on it", "睡一觉再决定"], ["play it by ear", "看情况再说"],
  ["see to it", "确保（办到）"], ["see through", "看穿；坚持到底"],
  ["come down to", "归结为"], ["amount to", "等于；总计"],
  ["add up to", "总计；等于"], ["result in", "导致"],
  ["account for", "解释；占（比例）"], ["allow for", "考虑到；留出"],
  ["apply for", "申请"], ["ask after", "问候（某人近况）"],
  ["attend to", "处理；照料"], ["bank on", "指望"],
  ["bear with", "请耐心等（一下）"], ["bow out", "退出"],
  ["brush up on", "复习（生疏的东西）"], ["bump into", "撞见"],
  ["burst out", "突然（笑/哭）起来"], ["care for", "照顾；喜欢"],
  ["carry out", "执行；进行"], ["check on", "查看（情况）"],
  ["chip in", "凑钱；插话"], ["close down", "关闭；停业"],
  ["come about", "发生"], ["come around", "改变主意；苏醒"],
  ["cope with", "应付"], ["count in", "把……算上"],
  ["cut in", "插话；插队"], ["deal with", "处理"],
  ["do without", "没有……也行"], ["draw up", "起草"],
  ["dress up", "打扮；盛装"], ["drive off", "开车走掉；赶走"],
  ["eat out", "出去吃"], ["eat in", "在家吃"],
  ["face up to", "正视"], ["fall apart", "散架；崩溃"],
  ["fall behind", "落后"], ["fall for", "上当；爱上"],
  ["fall out", "闹翻；脱落"], ["fight back", "反击"],
  ["find out", "查明；发现"], ["fit in", "融入；安排得下"],
  ["follow up", "跟进"], ["free up", "腾出（时间/空间）"],
  ["get around", "四处走动；绕过（问题）"], ["get down to", "开始认真做"],
  ["give out", "分发；用完；出故障"], ["go about", "着手做"],
  ["grow up", "长大"], ["hand back", "交还"],
  ["hand over", "移交"], ["head back", "往回走"],
  ["hit on", "突然想到"], ["iron out", "解决（小分歧）"],
  ["kick off", "开始"], ["knock out", "击倒；使震惊"],
  ["lay out", "摆放；阐述"], ["leave behind", "落下；留下"],
  ["leave out", "漏掉"], ["light up", "亮起来；露出喜色"],
  ["log in", "登录"], ["log out", "退出登录"],
  ["make it up to", "补偿（某人）"], ["narrow down", "缩小（范围）"],
  ["open up", "敞开心扉；开业"], ["own up", "承认（错误）"],
  ["pack up", "打包；收工"], ["pass on", "转达；传给"],
  ["pass out", "昏过去"], ["phase out", "逐步淘汰"],
  ["pick out", "挑出"], ["pipe up", "开口说话"],
  ["play down", "淡化"], ["plug in", "插上电源"],
  ["print out", "打印出来"], ["pull off", "成功做成（难事）"],
  ["pull over", "把车靠边停"], ["pull through", "渡过难关"],
  ["put across", "把（意思）讲清楚"], ["put away", "收起来"],
  ["put out", "熄灭；发布；添麻烦"], ["rule out", "排除"],
  ["scale back", "缩减"], ["sell out", "卖光；背叛"],
  ["send off", "寄出；送别"], ["set in", "（天气/情绪）开始并持续"],
  ["shop around", "货比三家"], ["shrug off", "不理会"],
  ["shut down", "关掉；停业"], ["sit in on", "旁听"],
  ["smooth over", "缓和（矛盾）"], ["snap up", "抢购"],
  ["split up", "分开；分手"], ["stand by", "支持；待命"],
  ["stand in for", "代替（某人）"], ["start over", "重新开始"],
  ["stick to", "坚持（计划）"], ["stick with", "继续用/跟着"],
  ["take on board", "接受（意见）"], ["tidy away", "收起来"],
  ["tone down", "把语气放缓和"], ["track down", "追查到"],
  ["tune in", "收听/收看"], ["turn around", "扭转（局面）；转身"],
  ["use up", "用完"], ["walk out", "退场；罢工"],
  ["watch out", "当心"], ["weigh up", "权衡"],
  ["wind down", "放松下来；逐步结束"], ["wipe out", "彻底毁灭"],
  ["zoom in", "放大"],
  /* 三词以上的动词短语（拆开时尾巴有两段） */
  ["take up on", "接受（提议/邀请）"], ["catch up on", "补上（进度、消息）"],
  ["check up on", "查证；核查"], ["get on with", "与……相处；继续做"],
  ["get on with it", "赶紧继续"], ["keep up with", "跟上"],
  ["come up against", "遇到（困难）"], ["look out for", "留意；照看"],
  ["watch out for", "当心"], ["make up for", "弥补"],
  ["put up with", "忍受"], ["come up with", "想出（办法）"],
  ["put in for", "申请"], ["live up to", "不辜负（期望）"],
  ["go along with", "同意；配合"], ["get away with", "侥幸逃过"],
  ["make do with", "将就着用"], ["sit in on", "旁听"],
  ["stand in for", "代替（某人）"], ["run out of", "用完"],
  ["look forward to", "期待"], ["get down to", "开始认真做"],
  ["come down to", "归结为"], ["face up to", "正视"],
  ["add up to", "总计；等于"], ["hold on to", "抓住不放"],
  ["get back to", "回头答复（某人）"], ["settle down to", "安下心来做"],
  /* ---------- 第二批短语动词 ---------- */
  ["break in", "打断；闯入"], ["break off", "突然中断"], ["break out", "爆发；逃出"],
  ["bring back", "带回；使回忆起"], ["bring forward", "提前"], ["bring out", "推出；使显现"],
  ["burn out", "累垮；烧坏"], ["call for", "需要；要求"], ["carry off", "成功应付"],
  ["chase up", "催问（进度）"], ["cheer up", "振作起来；让……高兴"],
  ["clean out", "清空；花光"], ["come apart", "散架；崩解"], ["come down with", "染上（病）"],
  ["come forward", "站出来（提供信息）"], ["come off", "成功；脱落；戒掉"],
  ["come on", "来吧；快点；进展"], ["come out", "出来；结果是；公开"],
  ["come through", "挺过来；兑现（承诺）"], ["come to", "苏醒；总计；谈到"],
  ["come up", "出现；被提出"], ["cover up", "掩盖"], ["crack down", "严厉打击"],
  ["cross off", "划掉"], ["cut back", "削减"], ["cut through", "抄近路；穿透"],
  ["dig up", "挖出；翻出（旧事）"], ["do up", "扣好；装修"], ["doze off", "打瞌睡"],
  ["drag on", "拖得太久"], ["draw on", "动用（经验/资源）"], ["drift apart", "渐行渐远"],
  ["ease off", "减轻；放缓"], ["fall back", "后退；退守"], ["fall through", "（计划）落空"],
  ["fend off", "抵挡；挡开"], ["fight off", "击退；努力摆脱"],
  ["fill up", "装满；填满"], ["finish off", "吃完；做完；干掉"],
  ["flare up", "突然发作；复发"], ["follow through", "坚持做完"],
  ["freshen up", "梳洗一下"], ["gather up", "收拢起来"], ["gear up", "准备好"],
  ["get across", "把（意思）讲清楚"], ["get ahead", "取得领先"], ["get at", "暗示；够到"],
  ["get down", "记下来；使沮丧"], ["get in", "到达；挤进去"], ["get off", "下车；下班；脱身"],
  ["get on", "上车；进展；相处"], ["get out", "出去；泄露"], ["get out of", "摆脱；逃避"],
  ["get together", "聚一聚"], ["get up", "起床；站起来"], ["give back", "归还"],
  ["go down", "下降；被接受；倒下"], ["go for", "选择；喜欢；尝试"],
  ["go in for", "喜欢；参加"], ["go out", "出去；熄灭；播出"],
  ["go under", "倒闭；沉没"], ["go without", "没有……也对付过去"],
  ["grow into", "长大成；适应"], ["hand down", "传下去"], ["hand round", "传递一圈"],
  ["hang around", "闲待着；徘徊"], ["head for", "朝……去"], ["heat up", "加热；升温"],
  ["help out", "帮忙解围"], ["hold off", "推迟；挡住"], ["hold out", "坚持；伸出"],
  ["hunt down", "追捕到"], ["join in", "加入（活动）"], ["jump at", "欣然接受（机会）"],
  ["keep at", "坚持做"], ["keep down", "压低；不吐出来"], ["keep from", "忍住不做"],
  ["keep off", "远离；不碰"], ["keep out", "别进来"], ["kick out", "赶出去"],
  ["knock off", "下班；减价；碰掉"], ["lead on", "误导；吊胃口"],
  ["lean on", "依靠；施压"], ["leave off", "停止；省略"], ["let off", "放过；引爆"],
  ["live on", "靠……生活"], ["look back", "回顾"], ["look in", "顺道看看"],
  ["look on", "旁观；看待"], ["look round", "四处看看"], ["look through", "翻看；浏览"],
  ["make over", "改造；转让"], ["map out", "规划"], ["mark down", "降价；记下"],
  ["mess around", "瞎混；胡闹"], ["miss out", "错过；漏掉"], ["move over", "挪一挪"],
  ["nod off", "打盹"], ["opt for", "选择"], ["pack in", "塞进；放弃"],
  ["pair up", "两两配对"], ["pass down", "传下来"], ["pass over", "略过；不考虑"],
  ["pay up", "付清"], ["pencil in", "暂定（时间）"], ["pick on", "找茬；挑中"],
  ["pile up", "堆积"], ["pin down", "确定；把话说死"], ["pitch in", "一起帮忙"],
  ["play along", "配合着来"], ["play up", "捣乱；（病）发作"], ["press on", "继续推进"],
  ["pull away", "开走；拉开距离"], ["pull in", "进站；挣到"], ["pull out", "退出；拔出"],
  ["pull together", "齐心协力"], ["push on", "继续前进"], ["put in", "提出；投入（时间）"],
  ["put on", "穿上；上演；假装"], ["read up on", "研读（某主题）"],
  ["rent out", "出租"], ["ride out", "安然渡过"], ["ring up", "打电话"],
  ["rip off", "宰客；剽窃"], ["roll out", "推出（新产品）"], ["root out", "根除"],
  ["rope in", "拉（人）参与"], ["round off", "圆满结束"], ["round up", "集合；凑整"],
  ["rub out", "擦掉"], ["run away", "逃跑"], ["run down", "撞倒；贬低；耗尽"],
  ["run off", "跑掉；快速印出"], ["rush into", "仓促做"], ["sail through", "轻松通过"],
  ["scale down", "缩减规模"], ["scrape by", "勉强糊口"], ["see off", "送别；赶走"],
  ["send back", "退回"], ["send in", "寄去；提交"], ["set about", "着手做"],
  ["set back", "耽误；使倒退"], ["set down", "放下；规定"], ["settle up", "结账"],
  ["shake off", "摆脱"], ["shop around", "货比三家"], ["shoot up", "猛涨"],
  ["show off", "炫耀"], ["show round", "带……参观"], ["shut down", "关掉；停产"],
  ["shut up", "闭嘴；关店"], ["side with", "站在……一边"], ["single out", "挑出（某人）"],
  ["sit back", "往后靠；袖手旁观"], ["sit out", "不参加；坐到结束"],
  ["size up", "估量"], ["skim through", "快速浏览"], ["slack off", "偷懒"],
  ["slip away", "悄悄离开；溜走"], ["smooth out", "把（问题）理顺"],
  ["sort through", "翻找整理"], ["sound out", "试探（意见）"], ["spell out", "明确说明"],
  ["spread out", "散开；摊开"], ["squeeze in", "挤进；腾出时间"],
  ["stand back", "退后；不介入"], ["stand down", "退出（竞选/职位）"],
  ["stand in", "代替（某人）"], ["stand up", "站起来；站得住"],
  ["stand up for", "为……辩护"], ["stand up to", "顶住；经得起"],
  ["start off", "开始（做）"], ["start out", "起步；起初"],
  ["stay away", "别靠近"], ["stay behind", "留下不走"], ["stay in", "待在家里"],
  ["stay out", "不在家；不介入"], ["stay up", "熬夜"], ["step aside", "让位"],
  ["step back", "退一步想"], ["step down", "辞职"], ["step in", "介入"],
  ["step up", "挺身而出；加大力度"], ["stick around", "留在附近等着"],
  ["stick out", "伸出来；显眼"], ["stick up for", "维护（某人）"], ["stir up", "挑起（情绪）"],
  ["stop by", "顺路过来"], ["stop off", "中途停留"], ["straighten out", "把……理清"],
  ["stretch out", "伸展开；拉长"], ["sum up", "总结"], ["switch off", "关掉；不再想"],
  ["switch on", "打开"], ["take on board", "接受（意见）"], ["talk over", "商量"],
  ["tell apart", "区分开"], ["think ahead", "提前打算"], ["tidy up", "收拾"],
  ["tip off", "给（某人）通风报信"], ["touch on", "简要提到"], ["track down", "追查到"],
  ["trade in", "以旧换新"], ["try out", "试用；试演"], ["tuck in", "塞好；开吃"],
  ["turn against", "转而反对"], ["turn away", "打发走；转身不看"],
  ["turn in", "上交；上床睡觉"], ["turn off", "关掉；使反感"],
  ["turn on", "打开；突然攻击"], ["turn over", "翻转；移交"],
  ["vote down", "投票否决"], ["wade through", "硬着头皮读完"],
  ["wait up", "熬夜等人"], ["wake up", "醒来；醒悟"], ["walk away", "走开；不管了"],
  ["ward off", "抵挡"], ["warm up", "热身；变暖"], ["wear down", "磨掉；使屈服"],
  ["weigh in", "发表意见"], ["wind up", "收尾；最终落得"], ["win over", "说服（某人）"],
  ["wipe off", "擦掉"], ["work off", "通过活动消除"], ["work up", "鼓足（勇气）"],
  ["write back", "回信"], ["write up", "整理成文"],
  /* ---------- 场景常用语块 ---------- */
  ["excuse me for asking", "恕我冒昧问一句"], ["sorry for the trouble", "给你添麻烦了"],
  ["thanks for having me", "谢谢你的招待"], ["thanks for your time", "谢谢你的时间"],
  ["i owe you one", "我欠你一个人情"], ["you shouldn't have", "你太客气了"],
  ["it slipped my mind", "我忘了"], ["my bad", "是我的错"],
  ["no offence", "没有冒犯的意思"], ["don't get me wrong", "别误会我的意思"],
  ["fair point", "有道理"], ["good point", "说得对"],
  ["i couldn't agree more", "完全同意"], ["i'm with you", "我同意、我站你这边"],
  ["i'm not convinced", "我还是不太信服"], ["i see your point", "我明白你的意思"],
  ["that's not what i meant", "我不是这个意思"], ["let me put it another way", "换个说法"],
  ["what do you mean by that", "你这话什么意思"], ["are you saying that", "你是说……吗"],
  ["just to be clear", "先说清楚"], ["to put it simply", "简单说"],
  ["long story short", "长话短说"], ["it's a long story", "说来话长"],
  ["same to you", "你也是"], ["likewise", "我也是、同样"],
  ["you too", "你也是"], ["take care", "保重"],
  ["have a good one", "过得愉快"], ["see you around", "回头见"],
  ["catch you later", "回头聊"], ["talk soon", "回头聊"],
  ["how come", "怎么会、为什么"], ["what's up", "怎么了、最近怎样"],
  ["what's going on", "出什么事了"], ["what brings you here", "什么风把你吹来了"],
  ["how was your day", "今天过得怎么样"], ["how did it go", "怎么样、顺利吗"],
  ["any luck", "有结果吗"], ["any news", "有消息吗"],
  ["good to see you", "见到你真好"], ["it's been a while", "有段时间没见了"],
  ["say hello to", "替我向……问好"], ["give my regards", "代我问好"],
  ["mind if i", "我……可以吗"], ["do you mind", "你介意吗"],
  ["is it okay if", "我……可以吗"], ["would that be alright", "那样行吗"],
  ["whenever you like", "你方便就行"], ["whatever suits you", "你方便就好"],
  ["i'm easy", "我随便、都行"], ["either is fine", "两个都行"],
  ["that's up to you", "你决定"], ["your call", "你说了算"],
  ["let me know", "告诉我一声"], ["keep me in the loop", "有情况告诉我"],
  ["i'll let you know", "我会告诉你"], ["i'll keep you posted", "我会随时告诉你进展"],
  ["as soon as i can", "尽快"], ["at your earliest convenience", "你方便的时候尽早"],
  ["no later than", "不晚于"], ["by the end of the day", "今天之内"],
  ["first thing tomorrow", "明天一早"], ["in the next few days", "这几天内"],
  ["sooner rather than later", "尽早"], ["just in time", "正好赶上"],
  ["a bit late", "有点晚了"], ["right on time", "正好准时"],
  ["hang on a second", "等一下"], ["give me a moment", "给我一点时间"],
  ["bear with me", "请耐心等一下"], ["where were we", "我们说到哪了"],
  ["as i was saying", "我刚才说"], ["to get back to your point", "回到你刚才那点"],
  ["that reminds me", "这让我想起来"], ["speaking of which", "说到这个"],
  ["on that note", "那就这样"], ["anyway", "总之、话说回来"],
  ["in any case", "不管怎样"], ["either way", "不管怎样"],
  ["all things considered", "总的来说"], ["on the whole", "总体上"],
  ["more importantly", "更重要的是"], ["above all", "最重要的是"],
  ["last but not least", "最后但同样重要"], ["first of all", "首先"],
  ["to begin with", "首先"], ["in the first place", "首先、当初"],
  ["as a matter of fact", "事实上"], ["to tell you the truth", "说实话"],
  ["between you and me", "咱俩私下说"], ["off the record", "非正式地说"],
  ["i have no idea", "我完全不知道"], ["your guess is as good as mine", "我也不知道"],
  ["it beats me", "我也搞不懂"], ["who knows", "谁知道呢"],
  ["not necessarily", "不一定"], ["it depends on", "取决于"],
  ["more often than not", "多半"], ["nine times out of ten", "十有八九"],
  ["as a rule", "通常"], ["generally speaking", "一般来说"],
  ["in general", "总的来说"], ["by and large", "大体上"],
  ["for the most part", "大部分情况下"], ["to some extent", "某种程度上"],
  ["up to a point", "某种程度上"], ["as far as i'm concerned", "就我而言"],
  ["if you ask me", "要我说"], ["in my opinion", "在我看来"],
  ["from my point of view", "从我的角度看"], ["i'd say", "我觉得"],
  ["i reckon", "我认为（口语）"], ["i suppose so", "我想是吧"],
  ["i'm afraid so", "恐怕是的"], ["i hope so", "希望如此"],
  ["i hope not", "希望不是"], ["let's hope so", "但愿如此"],
  ["that's a relief", "那就好、松了一口气"], ["what a relief", "真让人松口气"],
  ["that's a pity", "太可惜了"], ["what a shame", "真可惜"],
  ["never mind that", "别管那个"], ["forget about it", "算了、别提了"],
  ["don't mention it", "别客气"], ["any time", "随时、不客气"],
  ["happy to help", "乐意帮忙"], ["glad i could help", "很高兴能帮上忙"],
  ["that's very kind of you", "你太好了"], ["i really appreciate it", "非常感谢"],
  ["i can't thank you enough", "感激不尽"], ["thanks anyway", "还是谢谢你"],
  ["sorry to keep you waiting", "抱歉让你久等"], ["sorry for the delay", "抱歉耽误了"],
  ["my apologies for", "为……道歉"], ["i do apologize", "我诚恳道歉"],
  ["it won't happen again", "不会再发生了"], ["to make up for it", "作为补偿"],
  ["how can i make it up to you", "我怎么补偿你"], ["let me make it right", "让我补救一下"],
  ["i take it back", "我收回刚才的话"], ["i was out of line", "是我过分了"],
  ["no hard feelings", "别往心里去"], ["we're good", "我们没事了"],
  ["let's move on", "我们继续吧"], ["let's call it a day", "今天就到这儿"],
  ["let's wrap up", "我们收尾吧"], ["let's get started", "我们开始吧"],
  ["shall we begin", "可以开始了吗"], ["where do we start", "从哪儿开始"],
  ["what's the plan", "计划是什么"], ["what's the catch", "有什么坑"],
  ["what's the point", "意义何在"], ["what's the difference", "有什么区别"],
  ["it doesn't matter", "没关系"], ["it makes no difference", "没什么差别"],
  ["that makes sense", "有道理"], ["that figures", "果然如此"],
  ["that explains it", "原来如此"], ["now i get it", "我明白了"],
  ["i'm not following", "我没跟上"], ["sorry, i missed that", "抱歉我没听清"],
  ["could you spell that", "能拼一下吗"], ["could you write it down", "能写下来吗"],
  ["how do you spell that", "怎么拼"], ["how do you say that in english", "这个英文怎么说"],
  ["what does that mean", "那是什么意思"], ["in plain english", "用大白话说"],
  ["lay it out for me", "给我讲清楚"], ["walk me through it", "带我过一遍"],
  ["break it down", "拆开解释"], ["give me an example", "举个例子"],
  ["let me get this straight", "我确认一下"], ["correct me if i'm wrong", "我说错了请纠正"],
  ["am i making sense", "我说清楚了吗"], ["does that make sense", "这样讲能理解吗"],
  ["are we on the same page", "我们理解一致吗"], ["just so i understand", "我确认一下"],
  ["to recap", "回顾一下"], ["in summary", "总结一下"],
  ["the bottom line is", "关键在于"], ["the point is", "重点是"],
  ["what i mean is", "我的意思是"], ["all i'm saying is", "我只是想说"],
  ["that's beside the point", "这跑题了"], ["that's not the issue", "问题不在这儿"],
  ["let's stick to the point", "我们回到正题"], ["back to the topic", "回到主题"],
  ["as i mentioned earlier", "如我先前所说"], ["like i said", "就像我说的"],
  ["you mentioned that", "你提到过"], ["you said you would", "你说过你会"],
  ["that's what i thought", "我就这么想的"], ["i knew it", "我就知道"],
  ["i had a feeling", "我有预感"], ["just as i expected", "正如我所料"],
  ["better late than never", "晚做总比不做好"], ["easier said than done", "说起来容易"],
  ["no pain no gain", "不劳无获"], ["it's worth a try", "值得一试"],
  ["it can't hurt", "试试也无妨"], ["let's give it a shot", "我们试一下"],
  ["it's up in the air", "还没定"], ["it's a done deal", "已经定了"],
  ["back to square one", "回到起点"], ["in the same boat", "处境相同"],
  ["on the safe side", "保险起见"], ["to be on the safe side", "为稳妥起见"],
  ["play it safe", "稳妥行事"], ["take a risk", "冒个险"],
  ["keep your fingers crossed", "祈祷好运"], ["fingers crossed", "但愿顺利"],
  ["touch wood", "但愿如此"], ["knock on wood", "但愿好运"],
  ["it's not the end of the world", "天还没塌下来"], ["life goes on", "日子还得过"],
  ["look on the bright side", "往好处想"], ["every cloud has a silver lining", "坏事也有好的一面"],
  ["things happen", "事情就这样"], ["these things happen", "难免的事"],
  ["no big deal", "没什么大不了"], ["not a big deal", "不是什么大事"],
  ["it's a big deal", "这可是大事"], ["make a big deal", "小题大做"],
  ["don't make a fuss", "别大惊小怪"], ["calm down", "冷静点"],
  ["take it easy", "别紧张、放轻松"], ["don't stress", "别紧张"],
  ["it's not worth it", "不值得"], ["not worth the trouble", "不值得费这个劲"],
  ["it pays off", "会有回报"], ["worth every penny", "每一分钱都值"],
  ["a waste of time", "浪费时间"], ["a waste of money", "浪费钱"],
  ["for a change", "换个样"], ["as always", "一如既往"],
  ["once and for all", "彻底地、一劳永逸"], ["step by step", "一步步来"],
  ["little by little", "一点一点地"], ["bit by bit", "一点点地"],
  ["sooner or later", "迟早"], ["in the long run", "长远看"],
  ["in the short term", "短期内"], ["at the moment", "目前"],
  ["for the time being", "暂时"], ["as of now", "到目前为止"],
  ["from time to time", "偶尔"], ["now and then", "时不时"],
  ["more and more", "越来越多"], ["less and less", "越来越少"],
  ["all of a sudden", "突然"], ["out of the blue", "突然、毫无预兆"],
  ["in a row", "连续"], ["one after another", "一个接一个"],
  ["side by side", "并排"], ["face to face", "面对面"],
  ["hand in hand", "密切相关"], ["back and forth", "来回"]
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
  const PHRASE = new Map();    // 多词短语词条：phrase → {cn, type, particle, verb}
  const PHRASE_RAW = new Map(); // 还没定型的短语（等词典读完再按词性判定）

  // 短语结构判定用的小词表（照 build-collocations.js 的思路）
  const P_FUNC = new Set(("a an the and or but if of to in on at by for with from as is are was were be been being am " +
    "do does did done have has had will would shall should can could may might must this that these those there here " +
    "it its sb sth someone something oneself he she they we you i me him her us them his their your my our one ones " +
    "not no so very too also just than then now").split(/\s+/));
  const P_PARTICLE = new Set("up out off on in down over back away through around along forward together apart aside about across after by for from into of to upon with within against".split(/\s+/));
  const P_PREP = new Set("in on at for with under by without out of from about after before against over beyond within into".split(/\s+/));
  // 「形容词/名词 + 介词」只认这些真介词。out / up / off / down / over / back 这些是小品词，
  // 放进来会把 scan out(扫描输出) / queue on 这类词典生僻组合当成名词搭配
  const P_PREP_ONLY = new Set("in on at for with of to from by about into against upon without beyond within under".split(/\s+/));

  const POS_PREFIX = /^((n|v|vt|vi|adj|adv|prep|conj|pron|num|art|int|aux|abbr)\.\s*)+/i;
  function phraseGloss(raw) {
    if (!raw) return null;
    const first = String(raw).split(/\\n|\n/)[0].trim();
    if (!first) return null;
    const body = first.replace(/\[[^\]]{1,6}\]/g, "").replace(POS_PREFIX, "").trim();
    if (!body || /人名|地名|姓氏/.test(body)) return null;
    // 取前 3 个义项（词典第一个义项常常不是口语里那个意思）
    const senses = body.split(/[,，;；]/).map((x) => x.replace(/[.。\s"]+/g, "").trim())
      .filter((x) => x && /[\u4e00-\u9fa5]/.test(x) && x.length <= 8 && !/\.\.\.|…/.test(x));
    if (!senses.length) return null;
    const cn = senses.slice(0, 3).join("；");
    return cn.length > 26 ? senses.slice(0, 2).join("；") : cn;
  }

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.length < 8) continue;
    const w = (row[idx.word] || "").trim().toLowerCase();
    const isSingle = /^[a-z][a-z'-]{1,20}$/.test(w);
    if (!isSingle) {
      // 多词短语先都收着，等词典建好（要按词性判定"形容词/名词 + 介词"这类）
      if (!/^[a-z][a-z'-]*(\s+[a-z][a-z'-]*){1,3}$/.test(w) || PHRASE_RAW.has(w)) continue;
      const parts = w.split(/\s+/);
      if (parts.some((p) => !/^[a-z][a-z'-]{0,20}$/.test(p))) continue;
      const cn = phraseGloss(row[idx.translation] || "");
      if (cn) PHRASE_RAW.set(w, { cn, parts });
      continue;
    }
    const exchange = row[idx.exchange] || "";
    const lemma = /(?:^|\/)\s*0:([a-z][a-z'-]{1,20})/.exec(exchange);
    if (lemma && lemma[1] !== w) LEMMA.set(w, lemma[1]);
    exchange.split("/").forEach((part) => {
      const m = /^d:([a-z][a-z'-]{1,20})$/.exec(part.trim());
      if (m) PART.add(m[1]);
    });
    if (w.endsWith("ed")) PART.add(w);
    if (DICT.has(w)) continue;
    const clean = cleanTranslation(row[idx.translation] || "");
    // 全部词性（不只第一条）：straight 第一个义项是 n. 直线，但它还能当副词，
    // 所以不能拿它当动词短语的宾语（go straight through ≠ go sth through）
    const posAll = new Set();
    String(row[idx.translation] || "").split(/\\n|\n/).forEach((line) => {
      const m2 = /^\s*([a-zA-Z]+)\.\s/.exec(line);
      if (m2 && POS_MAP[m2[1].toLowerCase()]) posAll.add(POS_MAP[m2[1].toLowerCase()]);
    });
    DICT.set(w, {
      tag: (row[idx.tag] || "").trim(),
      // ECDICT 的 pos 列是空的，词性只能从释义前缀拿（"a. 好的" → adj.）
      pos: clean ? clean.pos : "",
      posAll: posAll,
      frq: Number(row[idx.frq]) || Number(row[idx.bnc]) || 0,
      oxford: Number(row[idx.oxford]) || 0,
      collins: Number(row[idx.collins]) || 0,
      phon: ipa.get(w) || ((row[idx.phonetic] || "").trim() ? normalizeOldPhonetic(row[idx.phonetic].trim()) : ""),
      clean: clean
    });
  }
  // 短语里的每个词都得像正常单词（挡掉带数字/符号的凑数条目）
  // 现在词典读完了，按词性给短语定型
  const posOf = (w) => { const e = DICT.get(w); return e ? e.pos : ""; };
  const isAdjWord = (w) => posOf(w) === "adj.";
  const isNounWord = (w) => posOf(w) === "n.";
  const isVerbWord = (w) => posOf(w) === "v.";
  // 高频词（词频前 5000）：只有这类名词才允许当「名词+介词」搭配的头
  const commonWord = (w) => { const e = DICT.get(w); return !!e && e.frq > 0 && e.frq <= 5000; };
  const commonVerb = (w) => { const e = DICT.get(w); return isVerbWord(w) && !!e && e.frq > 0 && e.frq <= 3000; };
  PHRASE_RAW.forEach((info, w) => {
    const parts = info.parts;
    let type = 0, particle = "", adjHead = false;
    if (parts.length === 2 && P_PARTICLE.has(parts[1]) && !P_FUNC.has(parts[0]) &&
        !P_PARTICLE.has(parts[0]) && !P_PREP.has(parts[0]) && isVerbWord(parts[0])) { type = 1; particle = parts[1]; }
    else if (P_PREP.has(parts[0]) && !P_FUNC.has(parts[1])) { type = 2; particle = parts[0]; }
    else if (parts.length === 3 && P_PREP.has(parts[0]) && !P_FUNC.has(parts[1]) &&
             (P_PREP.has(parts[2]) || P_PARTICLE.has(parts[2]))) { type = 2; particle = parts[0]; }
    else if (parts.length === 3 && P_PARTICLE.has(parts[2]) && !P_FUNC.has(parts[0]) && !P_FUNC.has(parts[1])) { type = 3; particle = parts[2]; }
    // 动词 + 小品词 + 介词：come up with / put up with / look forward to
    else if (parts.length === 3 && P_PARTICLE.has(parts[1]) && (P_PREP.has(parts[2]) || P_PARTICLE.has(parts[2])) &&
             !P_FUNC.has(parts[0])) { type = 5; particle = parts[1]; }
    // 形容词/名词 + 介词：good at / interested in / reason for
    // （正文里真的出现就收；"生词搭配"那节只取形容词类，见 BY_HEAD）
    else if (parts.length === 2 && P_PREP_ONLY.has(parts[1]) && !P_FUNC.has(parts[0]) &&
             !P_PARTICLE.has(parts[0]) && !P_PREP.has(parts[0]) && !isVerbWord(parts[0]) &&
             (isAdjWord(parts[0]) || (isNounWord(parts[0]) && commonWord(parts[0])))) {
      type = 6; particle = parts[1]; adjHead = isAdjWord(parts[0]);
    }
    // 小品词 + 介词：out of / up to / back to（也是常用搭配）
    else if (parts.length === 2 && P_PARTICLE.has(parts[0]) && P_PREP.has(parts[1]) && !P_FUNC.has(parts[1])) { type = 8; particle = parts[0]; }
    // 名词性词组：tenancy agreement / one-page brief（用户要的"词组"就包括这类）
    else if (parts.length >= 2 && parts.length <= 3 && isNounWord(parts[parts.length - 1]) &&
             !isVerbWord(parts[0]) && (isAdjWord(parts[0]) || isNounWord(parts[0])) &&
             parts.every((p) => !P_FUNC.has(p) && !P_PARTICLE.has(p) && !P_PREP.has(p))) { type = 7; particle = ""; }
    else return;
    if (parts.some((p) => !DICT.has(p))) return;      // 每个词都得是词典收录的单词
    PHRASE.set(w, { cn: info.cn, type, particle, verb: parts[0], adjHead: !!adjHead });
  });
  console.log("词典 " + DICT.size + " 词条，词形还原 " + LEMMA.size + " 条，过去分词 " + PART.size + " 个，结构化短语 " + PHRASE.size + " 条");

  const phonBank = {};
  (DATA.words || []).forEach((x) => { phonBank[x.w] = x.ph; });
  Object.keys(globalThis.CHAT_PRAC_PHON || {}).forEach((k) => { phonBank[k] = globalThis.CHAT_PRAC_PHON[k]; });

  /* ---------- 短语匹配用的索引 ----------
     ① 手写口语语块（CHUNKS）：中文按口语用法写 → 最高优先，覆盖词典义项偏书面的时候
     ② ECDICT 结构化短语（PHRASE）：动词+小品词 / 介词短语 / 动词+名词+小品词 / 动词+小品词+介词
     ③ 拆开的动词短语（take it up / take you up on that）——只认①里的语块，
        这样释义一定是对的（词典里 sit over 这种生僻义项不会跳出来误导人） */
  const CHUNK_MAP = new Map(CHUNKS.map(([p, cn]) => [p.toLowerCase(), cn]));

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

  // 介词短语这类：只有「介词 + 名词」两个词、且名词是最基础的词（on monday）才丢掉；
  // 三词的（in charge of）保留
  let droppedPhrase = 0;
  [...PHRASE.entries()].forEach(([p, info]) => {
    if (info.type !== 2 && info.type !== 4) return;
    const parts = p.split(" ");
    if (info.type === 2 && parts.length !== 2) return;
    const head = info.type === 2 ? parts[1] : parts[parts.length - 1];
    const e = DICT.get(head);
    if (e && e.oxford === 1 && e.collins >= 4) { PHRASE.delete(p); droppedPhrase++; }
  });
  if (droppedPhrase) console.log("  丢掉过于基础的短语：" + droppedPhrase + " 条（on monday 这类）");

  // 短语索引要在删减之后再建（否则被删的短语还会在匹配列表里，显示成空释义）
  const ALL_PHRASES = [...new Set([...CHUNK_MAP.keys(), ...PHRASE.keys()])].sort((a, b) => b.length - a.length);
  // 可拆开的动词短语：verb → Map(尾巴 → 释义)。
  // 尾巴是 "up" / "up on" / "out of" 这种；先放词典的（面广），再用口语语块覆盖（释义更准）
  const SPLIT_INDEX = new Map();
  const TAIL_RE = /^(up|out|off|on|in|down|over|back|away|through|around|along|about|across|after|by|for|from|into|of|to|with|against)(\s+(up|out|off|on|in|down|over|back|away|through|around|along|about|across|after|by|for|from|into|of|to|with|against))?$/;
  PHRASE.forEach((info, p) => {
    if (info.type !== 1) return;
    if (!SPLIT_INDEX.has(info.verb)) SPLIT_INDEX.set(info.verb, new Map());
    const m = SPLIT_INDEX.get(info.verb);
    if (!m.has(info.particle)) m.set(info.particle, info.cn);
  });
  CHUNK_MAP.forEach((cn, p) => {
    const parts = p.split(" ");
    if (parts.length < 2 || parts.length > 3) return;
    const tail = parts.slice(1).join(" ");
    if (!TAIL_RE.test(tail)) return;
    if (!SPLIT_INDEX.has(parts[0])) SPLIT_INDEX.set(parts[0], new Map());
    SPLIT_INDEX.get(parts[0]).set(tail, cn);      // 语块覆盖词典释义
  });
  console.log("短语来源：" + PHRASE.size + " 条词典短语 + " + CHUNK_MAP.size + " 条口语语块（可拆开的动词 " + SPLIT_INDEX.size + " 个）");

  // 生词 → 它的搭配（「生词搭配」小节用）。
  // 只取**释义已核对**的两类来源，不用整张词典短语表 ——
  // 词典里 scan out(扫描输出) / bunk off(逃避) / out tag status(输出标志状态) 这类
  // 生僻或专业组合太多，混进来反而误导：
  //   ① 手写口语语块（中文按口语用法写）里的动词短语
  //   ② 词典里的「形容词/名词 + 介词」类（reason for / access to，实测没有噪音）
  const BY_HEAD = new Map();
  const addHead = (head, p, perHead) => {
    if (!BY_HEAD.has(head)) BY_HEAD.set(head, []);
    const list = BY_HEAD.get(head);
    if (list.length < perHead()) list.push(p);
  };
  CHUNK_MAP.forEach((cn, p) => {
    const parts = p.split(" ");
    if (parts.length < 2 || parts.length > 3) return;
    if (!TAIL_RE.test(parts.slice(1).join(" "))) return;
    addHead(parts[0], p, () => 1);
  });
  PHRASE.forEach((info, p) => {
    if (info.type !== 6 || !info.adjHead) return;      // 生词搭配只要形容词类，名词类噪音大
    addHead(p.split(" ")[0], p, () => 2);
  });
  // 生词是高频动词时，它自己的词典动词短语也放进来（take up / put off 这类）
  PHRASE.forEach((info, p) => {
    if (info.type !== 1) return;
    const parts = p.split(" ");
    if (!commonVerb(parts[0])) return;
    addHead(parts[0], p, () => 2);
  });

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
  const stats = { segs: 0, g: 0, c: 0, c2: 0, n: 0, v: 0, vUniq: 0, empty: { g: 0, c: 0, n: 0, v: 0 } };

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

      /* ---------- 固定搭配 ----------
         ① 直接命中：把这段的 2~4 词连续片段做成集合，逐条短语查（比逐词 indexOf 快得多）
            关键：同时用"原形"再建一套片段 —— 对话里是 asked for / paid for / came out，
            词典里是 ask for / pay for / come out，不还原原形就一条都对不上
         ② 拆开的动词短语：take it up / pick the kids up → 显示成 take sth up
         长的优先，被更长的包含掉的丢掉；口语语块的中文优先于词典义项 */
      const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
      // 每个词同时记住「原样」和「原形」：搭配显示词典里的原形，
      // 但 evidence 记正文里的原话（asked for），这样数据可以逐条核对
      const pairLines = lines.map((l) => norm(l.en).split(" ").filter(Boolean)
        .map((t) => ({ s: t, l: LEMMA.get(t) || t })));
      const grams = new Set();          // 原样片段（名词性词组只用这套）
      const lemmaGrams = new Map();     // 原形片段 → 正文里的原话（动词短语用这套）
      pairLines.forEach((pairs) => {
        for (let i = 0; i < pairs.length; i++) {
          for (let n = 2; n <= 4 && i + n <= pairs.length; n++) {
            const seg2 = pairs.slice(i, i + n);
            grams.add(seg2.map((x) => x.s).join(" "));
            const lg = seg2.map((x) => x.l).join(" ");
            if (!lemmaGrams.has(lg)) lemmaGrams.set(lg, seg2.map((x) => x.s).join(" "));
          }
        }
      });
      const isVerbPhrase = (p) => {
        const info = PHRASE.get(p);
        if (!info) return true;                       // 口语语块：两套都试
        return info.type === 1 || info.type === 3 || info.type === 4 || info.type === 5;
      };

      const hits = [];                       // {p 显示形式, cn, ev 正文出处}
      const glossOf = (p) => CHUNK_MAP.get(p) || (PHRASE.get(p) || {}).cn || "";
      ALL_PHRASES.forEach((p) => {
        let ev = "";
        if (grams.has(p)) ev = p;
        else if (isVerbPhrase(p) && lemmaGrams.has(p)) ev = lemmaGrams.get(p);
        if (!ev) return;
        if (hits.some((h) => h.p.indexOf(p) >= 0 || p.indexOf(h.p) >= 0)) return;   // 已被更长的覆盖
        hits.push({ p, cn: glossOf(p), ev });
      });

      // 拆开形式：动词 +（1~2 个宾语词）+ 尾巴（up / up on / out of …）
      const PERSON = new Set("him her me us you".split(" "));
      const DET = new Set("the a an my your his her its our their some any this that these those another each every no both".split(" "));
      const PRON = new Set("it them him her us me you this that these those one ones mine yours his hers ours theirs somebody anybody nobody everyone everything something anything".split(" "));
      const NUM = new Set("one two three four five six seven eight nine ten few many several couple both half dozen".split(" "));
      // 宾语槽必须真的像个宾语：
      //   一个词 → 代词/限定词/普通名词（不能是数量词、介词、小品词）
      //   两个词 → 限定词 + 名词（the kids / my keys）
      // 这样 "Come by after lunch."（by 不是宾语）和 "I sit two desks over."（数量词）都不会被切错
      // 宾语槽必须真的是名词：代词/限定词，或词典里明确标了名词的词。
      // 词性不明的词（straight 这种副词）不算 —— 否则 "go straight through" 会被切成 go sth through
      const isNounish = (x) => {
        const e = DICT.get(x);
        if (!e || !e.posAll || isFormGloss(e)) return false;   // held 这种"hold的过去式"条目不算名词
        return e.posAll.has("n.") && !e.posAll.has("adv.") && !e.posAll.has("adj.");   // 还能当副词/形容词的不算宾语
      };
      const objectOk = (mid) => {
        if (mid.length === 1) return PRON.has(mid[0]) || DET.has(mid[0]) || isNounish(mid[0]);
        if (mid.length === 2) return (DET.has(mid[0]) || PRON.has(mid[0])) && isNounish(mid[1]);
        return false;
      };
      pairLines.forEach((pairs) => {
        for (let i = 0; i < pairs.length; i++) {
          const tails = SPLIT_INDEX.get(pairs[i].l);
          if (!tails) continue;
          const ordered = [...tails.keys()].sort((a, b) => b.length - a.length);   // 尾巴长的先试（up on 优先于 up）
          for (let k = 1; k <= 2 && i + k < pairs.length; k++) {
            const mid = pairs.slice(i + 1, i + k).map((x) => x.s);      // 用原样词判词性：held 的原形 hold 也能当名词
            if (!mid.length || !objectOk(mid)) continue;
            const rest = pairs.slice(i + k).map((x) => x.l).join(" ");
            const tail = ordered.find((t) => rest === t || rest.indexOf(t + " ") === 0);
            if (!tail) continue;
            // 小品词后面紧跟限定词/数词/代词/名词，说明它其实是介词
            // （takes coins after eight ≠ take sth after；bring it to me ≠ bring sth to）
            const after = pairs[i + k + tail.split(" ").length];
            if (after && (DET.has(after.l) || NUM.has(after.l) || PRON.has(after.l) || isNounish(after.s))) continue;
            const base = pairs[i].l + " " + tail;
            if (hits.some((h) => h.p === base)) break;        // 已经作为连续形式列过了
            const slot = mid.some((x) => PERSON.has(x)) ? "sb" : "sth";
            const display = pairs[i].l + " " + slot + " " + tail;
            if (hits.some((h) => h.p === display)) break;
            const tailWords = tail.split(" ").length;
            hits.push({
              p: display,
              cn: tails.get(tail),
              ev: pairs.slice(i, i + 1 + k + tailWords).map((x) => x.s).join(" ")   // 正文里的原话
            });
            break;
          }
        }
      });

      // 同一组词只留一条：coming back 与 come back 算同一条，留词典原形
      const byNorm = new Map();
      hits.forEach((h) => {
        const normKey = h.p.split(" ").map((w) => LEMMA.get(w) || w).join(" ");
        const old = byNorm.get(normKey);
        if (!old) { byNorm.set(normKey, h); return; }
        if (old.p !== normKey && h.p === normKey) byNorm.set(normKey, h);   // 优先词典原形
      });
      const uniq = [...byNorm.values()];

      uniq.sort((a, b) => (b.p.split(" ").length - a.p.split(" ").length) || (b.p.length - a.p.length));
      const c = [], evid = [];
      uniq.slice(0, C_MAX).forEach((h) => {
        c.push(h.p);
        evid.push(h.ev || h.p);
        colls[h.p] = h.cn;
      });

      /* ---------- 词汇表（初中以上） ---------- */
      const v = [], seenV = new Set(), vEv = {};   // vEv：原形 → 正文里实际出现的形式
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
          if (!vEv[found.w]) vEv[found.w] = low;
          if (!words[found.w]) {
            words[found.w] = [phonBank[found.w] || e.phon || "", (e.clean.pos ? e.clean.pos + " " : "") + e.clean.cn];
          }
        });
      });
      const vOut = v.slice(0, V_MAX);

      /* ---------- 补充：这段生词的词典搭配，单独放一处 ----------
         正文里出现的搭配进 c（固定搭配）；这里进 c2（生词搭配），
         界面分成两小节显示，用户能分清"这段里出现的"和"这些生词的常用搭配"。 */
      const c2 = [], evid2 = [];
      {
        let added = 0;
        vOut.forEach((w) => {
          if (added >= 4) return;
          (BY_HEAD.get(w) || []).forEach((ph) => {
            if (added >= 4) return;
            if (c.some((x) => x === ph || x.indexOf(ph) >= 0 || ph.indexOf(x) >= 0)) return;
            if (c2.indexOf(ph) >= 0) return;
            c2.push(ph);
            evid2.push(vEv[w] || w);            // 出处写正文里实际出现的形式（deducted，不是 deduct）
            colls[ph] = glossOf(ph);            // 语块的释义优先（它可能不在词典短语表里）
            added++;
          });
        });
      }

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

      stats.g += g.length; stats.c += c.length; stats.c2 += c2.length; stats.n += n.length; stats.v += vOut.length;
      if (!g.length) stats.empty.g++;
      if (!c.length) stats.empty.c++;
      if (!n.length) stats.empty.n++;
      if (!vOut.length) stats.empty.v++;
      const one = {};
      if (g.length) one.g = g;
      if (c.length) { one.c = c; one.e = evid; }    // e = 每条搭配在正文里的出处（自检核这个）
      if (c2.length) { one.c2 = c2; one.e2 = evid2; }
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
  console.log("  生词搭配 " + stats.c2 + " 条（" + (stats.c2 / stats.segs).toFixed(1) + " 条/段）");
  console.log("  注意事项 " + stats.n + " 条（" + (stats.n / stats.segs).toFixed(1) + " 条/段）");
  console.log("  超纲词去重 " + stats.vUniq + " 个，段落引用 " + stats.v + " 次（" + (stats.v / stats.segs).toFixed(1) + " 个/段）");
  console.log("  空缺段落：语法 " + stats.empty.g + " / 固定搭配 " + stats.empty.c +
    " / 注意事项 " + stats.empty.n + " / 词汇表 " + stats.empty.v + "（共 " + stats.segs + " 段）");
  console.log("已写入：" + OUT_PATH + "（" + (out.length / 1024).toFixed(0) + " KB）");
}

main();
