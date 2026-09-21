// 自检：静态引用一致性 + 数据文件内容质量
// 运行：node tests/selfcheck.js
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const html = read("index.html");
const app = read("assets/js/app.js");
const css = read("assets/css/style.css") + "\n" + read("assets/css/scenarios.css");

const problems = [];
const ok = [];
const fail = (msg) => problems.push(msg);

/* ============================ 一、静态引用 ============================ */

const idsInHtml = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
const idsUsed = new Set([...app.matchAll(/\$\("#([A-Za-z0-9_-]+)"\)/g)].map((m) => m[1]));
for (const id of idsUsed) {
  if (!idsInHtml.has(id)) fail(`app.js 引用了不存在的 id: #${id}`);
}
ok.push(`id 引用：app.js 用 ${idsUsed.size} 个，html 定义 ${idsInHtml.size} 个`);

const tabs = [...html.matchAll(/data-tab="([^"]+)"/g)].map((m) => m[1]);
for (const t of tabs) {
  if (!idsInHtml.has(`view-${t}`)) fail(`导航 ${t} 缺少对应视图 #view-${t}`);
}
ok.push(`板块对应：${tabs.join(", ")}`);

// 模式：每个导航项都要声明属于哪些模式，且每个模式至少有一个板块
const navSpec = [...html.matchAll(/data-tab="([^"]+)"\s+data-modes="([^"]+)"/g)].map((m) => [m[1], m[2]]);
const modeTabs = { search: [], study: [] };
navSpec.forEach(([tab, modes]) => {
  modes.split(/\s+/).forEach((mode) => {
    if (!modeTabs[mode]) fail(`导航 ${tab} 声明了未知模式：${mode}`);
    else modeTabs[mode].push(tab);
  });
});
if (navSpec.length !== tabs.length) fail("有导航项没声明 data-modes");
if (!modeTabs.search.length || !modeTabs.study.length) fail("有模式没有任何板块");
const modeButtons = [...html.matchAll(/class="mode-btn[^"]*"\s+type="button"\s+data-mode="([^"]+)"/g)].map((m) => m[1]);
if (modeButtons.length !== 2) fail("模式切换按钮应该正好 2 个，实际 " + modeButtons.length);
ok.push(`模式划分：查询 = ${modeTabs.search.join("/")}，学习 = ${modeTabs.study.join("/")}`);

const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]).filter((r) => !/^https?:/.test(r));
for (const r of refs) {
  if (!fs.existsSync(path.join(root, r))) fail(`资源缺失: ${r}`);
}
ok.push(`资源存在：${refs.length} 个本地文件`);

// PWA：manifest 能解析、图标路径存在；sw.js 预缓存清单和实际文件对得上
try {
  const manifest = JSON.parse(read("manifest.webmanifest"));
  if (manifest.display !== "standalone") fail("manifest 的 display 不是 standalone");
  if (!manifest.start_url) fail("manifest 缺少 start_url");
  for (const icon of manifest.icons || []) {
    if (!fs.existsSync(path.join(root, icon.src.replace(/^\.\//, "")))) fail(`manifest 图标不存在: ${icon.src}`);
  }
  ok.push(`PWA manifest：${manifest.icons.length} 个图标，全部存在`);
} catch (e) {
  fail("manifest.webmanifest 解析失败：" + e.message);
}

const sw = read("sw.js");
const precache = [...sw.matchAll(/"\.\/([^"]*)"/g)].map((m) => m[1]).filter(Boolean);
for (const p of precache) {
  if (!fs.existsSync(path.join(root, p))) fail(`sw.js 预缓存了不存在的文件: ${p}`);
}
if (!/const VERSION = "v\d+"/.test(sw)) fail("sw.js 缺少 VERSION 版本号");
ok.push(`离线缓存：预缓存 ${precache.length} 个文件全部存在，版本号 ${(sw.match(/const VERSION = "(v\d+)"/) || [])[1]}`);

const dynamicClasses = [...app.matchAll(/class="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((v) => /^[A-Za-z][A-Za-z0-9_ -]*$/.test(v))
  .flatMap((v) => v.split(/\s+/))
  .filter(Boolean);
const cssClasses = new Set([...css.matchAll(/\.([A-Za-z][A-Za-z0-9_-]*)/g)].map((m) => m[1]));
for (const c of new Set(dynamicClasses)) {
  if (!cssClasses.has(c)) fail(`CSS 缺少样式类: .${c}`);
}
ok.push(`动态 class：${new Set(dynamicClasses).size} 个都有样式`);

/* ============================ 二、数据内容 ============================ */

global.window = global;
global.window.CHAT_PRAC_DATA = {};
["data.words.js", "data.vocab.js", "data.collocations.js", "data.phon.js", "data.sentences.js", "data.dialogues.js", "data.practice.js", "data.scenarios.js", "data.notes.js"].forEach((f) => {
  require(path.join(root, "assets/js", f));
});
const DATA = global.window.CHAT_PRAC_DATA;
const VOCAB = global.window.CHAT_PRAC_VOCAB;
const SC = global.window.CHAT_PRAC_SCENARIOS;
const PHON_EXTRA = global.window.CHAT_PRAC_PHON || {};
const NOTES = global.window.CHAT_PRAC_NOTES || { rules: [], texts: [], words: {}, colls: {}, seg: {} };

const CJK = /[\u4e00-\u9fa5]/;
const isAscii = (s) => !/[^\x00-\x7F]/.test(s);

// --- 词库 ---
const words = DATA.words || [];
if (words.length < 1000) fail(`词库只有 ${words.length} 词，偏少`);
const wordSeen = new Set();
words.forEach((x, i) => {
  const at = `词库第 ${i + 1} 条(${x.w})`;
  if (!/^[a-z][a-z'-]*$/.test(x.w)) fail(`${at} 格式不对`);
  if (wordSeen.has(x.w)) fail(`${at} 重复`);
  wordSeen.add(x.w);
  if (!/^\/.+\/$/.test(x.ph || "")) fail(`${at} 音标格式不对：${x.ph}`);
  if (!CJK.test(x.cn || "")) fail(`${at} 释义不含中文`);
  if (/["\\]/.test(x.cn || "")) fail(`${at} 释义含引号或反斜杠`);
});
ok.push(`词库：${words.length} 词，音标/释义格式全部合规`);

// --- 固定搭配 ---
const colloc = DATA.collocations || {};
const collocKeys = Object.keys(colloc);
const collocTotal = collocKeys.reduce((n, k) => n + colloc[k].length, 0);
if (collocKeys.length < words.length * 0.4) {
  fail(`固定搭配只覆盖 ${collocKeys.length}/${words.length} 词，偏少（词典里的固定短语就这么多，低于 40% 说明生成有问题）`);
}
collocKeys.slice(0, 100000).forEach((w) => {
  if (!wordSeen.has(w)) fail(`固定搭配里有不在词库中的词：${w}`);
  const list = colloc[w];
  if (!Array.isArray(list) || !list.length) { fail(`${w} 没有搭配数据`); return; }
  list.forEach((pair) => {
    if (!Array.isArray(pair) || pair.length !== 2) { fail(`${w} 的搭配结构不对`); return; }
    if (!isAscii(pair[0])) fail(`${w} 的搭配英文含非 ASCII：${pair[0]}`);
    if (/["\\]/.test(pair[0])) fail(`${w} 的搭配英文里有引号或反斜杠：${pair[0]}`);
    if (!CJK.test(pair[1])) fail(`${w} 的搭配中文不含汉字：${pair[1]}`);
    if (pair[0].split(/\s+/).length < 2 || pair[0].split(/\s+/).length > 4) fail(`${w} 的搭配词数不在 2-4：${pair[0]}`);
  });
});
ok.push(`固定搭配：${collocKeys.length} 词 / ${collocTotal} 条`);

// --- 句子 ---
const sentences = DATA.sentences || [];
if (sentences.length < 100) fail(`句子库只有 ${sentences.length} 条，偏少`);
const sentSeen = new Map();
sentences.forEach((s, i) => {
  const at = `句子第 ${i + 1} 条`;
  if (!s.en || !s.cn || !s.tag) fail(`${at} 字段缺失`);
  if (!isAscii(s.en)) fail(`${at} 英文含非 ASCII：${s.en}`);
  if (!CJK.test(s.cn)) fail(`${at} 中文不含汉字`);
  const key = (s.en || "").toLowerCase();
  if (sentSeen.has(key)) fail(`${at} 与第 ${sentSeen.get(key) + 1} 条重复：${s.en}`);
  sentSeen.set(key, i);
});
ok.push(`句子库：${sentences.length} 条，无重复、英文纯 ASCII`);

// --- 对话 ---
const dialogues = DATA.dialogues || [];
if (dialogues.length < 20) fail(`对话库只有 ${dialogues.length} 组，偏少`);
const titles = new Set();
const lineSeen = new Map();
dialogues.forEach((d, i) => {
  const at = `对话第 ${i + 1} 组「${d.title || "未命名"}」`;
  if (!d.title || !d.tag || !Array.isArray(d.lines)) { fail(`${at} 结构不对`); return; }
  if (titles.has(d.title)) fail(`${at} 标题重复`);
  titles.add(d.title);
  if (d.lines.length < 4 || d.lines.length > 10) fail(`${at} 行数 ${d.lines.length} 异常`);
  d.lines.forEach((l, j) => {
    const lat = `${at} 第 ${j + 1} 行`;
    if (l.who !== (j % 2 === 0 ? "A" : "B")) fail(`${lat} 说话人未交替`);
    if (!isAscii(l.en || "")) fail(`${lat} 英文含非 ASCII：${l.en}`);
    if (!CJK.test(l.cn || "")) fail(`${lat} 中文不含汉字`);
    const key = (l.en || "").toLowerCase();
    if (lineSeen.has(key)) fail(`${lat} 与其他对话重复：${l.en}`);
    lineSeen.set(key, lat);
  });
});
ok.push(`对话库：${dialogues.length} 组 ${[...dialogues].reduce((n, d) => n + d.lines.length, 0)} 行，结构/交替/去重全部通过`);

// --- 练习场景（当前界面未使用，校验备份数据完整性） ---
const scenarios = DATA.scenarios || [];
const replies = DATA.replies || {};
for (const s of scenarios) {
  if (!replies[s.id]) fail(`场景 ${s.id} 没有对应的模拟回复`);
}
if (!replies.generic) fail("缺少通用模拟回复 replies.generic");
ok.push(`练习场景：${scenarios.length} 个，回复库 ${Object.keys(replies).length} 组，一一对应`);

/* --- 学习词库（学习模式·单词板块 用的场景分类词库） --- */
const vwords = (VOCAB && VOCAB.words) || [];
if (vwords.length < 100) fail(`学习词库只有 ${vwords.length} 词，偏少`);
const vSeen = new Set();
vwords.forEach((x, i) => {
  const at = `学习词库第 ${i + 1} 条(${x.w})`;
  if (!/^[a-z][a-z'-]*$/.test(x.w || "")) fail(`${at} 格式不对`);
  if (vSeen.has(x.w)) fail(`${at} 重复`);
  vSeen.add(x.w);
  if (!CJK.test(x.cn || "")) fail(`${at} 释义不含中文`);
  if (/["\\]/.test(x.cn || "")) fail(`${at} 释义含引号或反斜杠`);
  if (!VOCAB.tracks || !VOCAB.tracks[x.track]) fail(`${at} 轨道未知：${x.track}`);
  if (x.domain !== "00" && (!VOCAB.domains || !VOCAB.domains[x.domain])) fail(`${at} 场景域未知：${x.domain}`);
  if (typeof x.trap !== "boolean") fail(`${at} trap 不是布尔值`);
});
const trackCount = {};
vwords.forEach((x) => { trackCount[x.track] = (trackCount[x.track] || 0) + 1; });
if (!trackCount.L) fail("学习词库缺少 L（听力拼写）轨");
if (!trackCount.G) fail("学习词库缺少 G（通用）轨");
ok.push(`学习词库：${vwords.length} 词，轨道 ${Object.keys(trackCount).sort().map((k) => k + "=" + trackCount[k]).join(" ")}，域 ${Object.keys(VOCAB.domains || {}).length} 个`);

/* --- 音标覆盖：学习词池里每个词都必须查得到音标 ---
   学习词池 = 检索词库 + 学习词库（去重，忽略大小写），音标来源 = 检索词库 + 音标补充表。
   之前有 65 个学习词不在检索词库里，卡片上音标是空的。 */
const phonMap = {};
words.forEach((x) => { phonMap[x.w] = x.ph; });
Object.keys(PHON_EXTRA).forEach((k) => {
  const at = `音标补充表(${k})`;
  if (!/^\/.+\/$/.test(PHON_EXTRA[k] || "")) fail(`${at} 音标格式不对：${PHON_EXTRA[k]}`);
  if (phonMap[k]) fail(`${at} 与检索词库里的音标重复，补充表里不该有它`);
  phonMap[k] = PHON_EXTRA[k];
});
const phonPool = [];
const phonSeen = new Set();
words.concat(vwords).forEach((x) => {
  const k = String(x.w).toLowerCase();
  if (phonSeen.has(k)) return;
  phonSeen.add(k);
  if (!phonMap[x.w] && !phonMap[k]) phonPool.push(x.w);
});
if (phonPool.length) {
  fail(`学习词池里有 ${phonPool.length} 个词没有音标：${phonPool.slice(0, 12).join("、")}${phonPool.length > 12 ? " …" : ""}`);
}
ok.push(`音标覆盖：学习词池 ${phonSeen.size} 词全部有音标（检索词库 ${words.length} + 补充表 ${Object.keys(PHON_EXTRA).length}）`);

/* --- 语块库（词组/搭配，不进单词表） --- */
const vchunks = (VOCAB && VOCAB.chunks) || [];
if (vchunks.length < 3) fail(`语块库只有 ${vchunks.length} 条，偏少`);
vchunks.forEach((c, i) => {
  if (!c.w || !c.cn) fail(`语块第 ${i + 1} 条字段缺失`);
  if (!CJK.test(c.cn)) fail(`语块第 ${i + 1} 条中文不含汉字`);
});
ok.push(`语块库：${vchunks.length} 条`);

/* --- 场景对话库（学习模式·对话板块） --- */
const scDomains = (SC && SC.domains) || [];
const scList = (SC && SC.scenarios) || [];
const plannedTotal = scDomains.reduce((n, d) => n + (d.scenarios || []).length, 0);
if (plannedTotal !== 60) fail(`场景对话库规划的场数应为 60，实际 ${plannedTotal}`);
const domainIds = new Set(scDomains.map((d) => d.id));
const scTitles = new Set();
let scDialogues = 0, scLines = 0;

scList.forEach((s) => {
  const at = `场景「${s.title || s.id}」`;
  if (!s.id || !s.title || !s.domain) fail(`${at} 缺 id/title/domain`);
  if (!domainIds.has(s.domain)) fail(`${at} 的 domain ${s.domain} 不在 domains 里`);
  if (scTitles.has(s.title)) fail(`${at} 标题重复`);
  scTitles.add(s.title);

  const ds = s.dialogues || [];
  if (ds.length !== 8) fail(`${at} 应该有 8 段变体，实际 ${ds.length}`);

  ds.forEach((d, i) => {
    const dat = `${at} 第 ${i + 1} 段`;
    ["variant", "relation", "register", "channel", "barrier", "result"].forEach((k) => {
      if (!d[k]) fail(`${dat} 缺字段 ${k}`);
    });
    // 第 3~7 段必须带障碍；第 8 段是低正式语域对照，允许无障碍
    if (i >= 2 && i <= 6 && (!d.barrier || d.barrier === "无")) {
      fail(`${dat} 的 barrier 不能是「无」（第 3~7 段必须有障碍）`);
    }
    const lines = d.lines || [];
    if (lines.length < 6 || lines.length > 20) fail(`${dat} 的话轮数 ${lines.length} 不在 6~20`);
    const speakers = new Set();
    lines.forEach((l, j) => {
      const lat = `${dat} 第 ${j + 1} 行`;
      if (!l.who || !l.en || !l.cn) fail(`${lat} 缺 who/en/cn`);
      if (/["\\]/.test(l.en || "")) fail(`${lat} 英文含引号或反斜杠`);
      // 人名/拼写/数字类话轮没有汉字可写，cn 很短时允许不含汉字
      if (!CJK.test(l.cn || "") && String(l.cn || "").length > 12) fail(`${lat} 中文不含汉字`);
      speakers.add(l.who);
    });
    if (speakers.size < 2) fail(`${dat} 至少要有 2 个不同说话人`);
    scDialogues++;
    scLines += lines.length;
  });
});
ok.push(`场景对话库：${scDomains.length} 个域 / 规划 ${plannedTotal} 场景，已收录 ${scList.length} 场景 ${scDialogues} 段 ${scLines} 话轮`);

/* --- 规划里的每个场景名都必须已收录（一个不漏，标题逐字一致） --- */
let missingScn = 0;
scDomains.forEach((d) => {
  (d.scenarios || []).forEach((name) => {
    if (!scTitles.has(name)) { fail(`域「${d.name}」规划的「${name}」还没收录`); missingScn++; }
  });
});
if (!missingScn) ok.push(`场景覆盖：${plannedTotal} 个规划场景全部收录，标题逐字一致`);

/* --- 对话「学习要点」（data.notes.js）：例句必须逐字来自该段正文 ---
   这是这个数据最容易出错的地方：模型"编"例句。所以要求
   语法例句、固定搭配、词汇都必须真的出现在那一段的英文里。 */
const notesSeg = NOTES.seg || {};
const segKeys = [];
SC.scenarios.forEach((s) => s.dialogues.forEach((d, i) => segKeys.push(s.id + ":" + i)));
const segByKey = {};
SC.scenarios.forEach((s) => s.dialogues.forEach((d, i) => { segByKey[s.id + ":" + i] = d; }));

Object.keys(notesSeg).forEach((k) => {
  if (!segByKey[k]) fail(`学习要点里有不存在的段落：${k}`);
});
let notesG = 0, notesC = 0, notesC2 = 0, notesN = 0, notesV = 0, notesEmptySeg = 0;
segKeys.forEach((k) => {
  const one = notesSeg[k];
  if (!one) { fail(`段落 ${k} 没有学习要点`); return; }
  const lines = (segByKey[k].lines || []).map((l) => String(l.en || ""));
  // 和生成器同一套归一化：标点当空格（check-in 也算 check in）
  const text = lines.map((s) => " " + s.toLowerCase().replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ") + " ").join(" ");
  // 词汇表里会有连字符词（non-refundable / cut-off），这类要按原样比对
  const hyphenText = lines.join(" \n ").toLowerCase().replace(/[^a-z0-9'\-]/g, " ");
  const rawText = lines.join(" \n ").toLowerCase();
  let count = 0;

  (one.g || []).forEach((pair, i) => {
    const at = `学习要点 ${k} 语法第 ${i + 1} 条`;
    if (!Array.isArray(pair) || pair.length !== 2) { fail(`${at} 结构不对`); return; }
    const [ri, q] = pair;
    if (typeof ri !== "number" || !(NOTES.rules || [])[ri]) fail(`${at} 讲解索引越界：${ri}`);
    if (!CJK.test((NOTES.rules || [])[ri] || "")) fail(`${at} 讲解不含中文`);
    const clean = String(q || "").replace(/^…/, "").replace(/…$/, "").trim();
    if (clean.length < 3) fail(`${at} 例句太短：${q}`);
    if (rawText.indexOf(clean.toLowerCase()) < 0) fail(`${at} 例句不是这段正文里的原话：${q}`);
    notesG++; count++;
  });

  (one.c || []).forEach((p, i) => {
    const at = `学习要点 ${k} 固定搭配第 ${i + 1} 条`;
    const cn = (NOTES.colls || {})[p];
    if (!cn) { fail(`${at} 不在词典短语表里：${p}`); return; }
    if (!CJK.test(cn)) fail(`${at} 中文释义不含汉字：${cn}`);
    // 搭配可能显示词典原形（ask for）或拆开形式（put sth in），所以核"出处"：
    // e[i] 是这段正文里的原话，必须逐字存在
    const ev = String((one.e || [])[i] || "");
    if (!ev) { fail(`${at} 缺少正文出处`); return; }
    if (text.indexOf(" " + ev + " ") < 0) fail(`${at} 出处不是这段正文里的原话：${ev}（搭配 ${p}）`);
    notesC++; count++;
  });

  // 生词搭配：出处是"那个生词本身"（正文里实际出现的形式）
  (one.c2 || []).forEach((p, i) => {
    const at = `学习要点 ${k} 生词搭配第 ${i + 1} 条`;
    const cn = (NOTES.colls || {})[p];
    if (!cn) { fail(`${at} 不在短语表里：${p}`); return; }
    if (!CJK.test(cn)) fail(`${at} 中文释义不含汉字：${cn}`);
    const ev = String((one.e2 || [])[i] || "");
    if (!ev) { fail(`${at} 缺少来源词`); return; }
    if (text.indexOf(" " + ev + " ") < 0 && text.indexOf(ev) < 0) {
      fail(`${at} 来源词不在正文里：${ev}（搭配 ${p}）`);
    }
    notesC2++; count++;
  });

  (one.n || []).forEach((ti, i) => {
    const at = `学习要点 ${k} 注意事项第 ${i + 1} 条`;
    const t = (NOTES.texts || [])[ti];
    if (!t) { fail(`${at} 文本索引越界：${ti}`); return; }
    if (!CJK.test(t)) fail(`${at} 不含中文`);
    notesN++; count++;
  });

  (one.v || []).forEach((w, i) => {
    const at = `学习要点 ${k} 词汇第 ${i + 1} 条`;
    const d = (NOTES.words || {})[w];
    if (!d) { fail(`${at} 词表里没有这个词：${w}`); return; }
    if (!CJK.test(d[1] || "")) fail(`${at} 释义不含中文：${w}`);
    if (d[0] && !/^\/.+\/$/.test(d[0])) fail(`${at} 音标格式不对：${w} ${d[0]}`);
    // 词表存的是原形，正文里可能是变形（relied → rely、reserved → reserve），
    // 所以取词干前几个字母来核对（rely 要去掉词尾 y 才是词干 rel）
    const stem = String(w).length > 3 && /y$/.test(w) ? String(w).slice(0, -1) : String(w);
    const probe = stem.slice(0, Math.min(4, stem.length)).toLowerCase();
    if (hyphenText.indexOf(probe) < 0 && text.indexOf(probe) < 0) {
      fail(`${at} 这段正文里没有这个词：${w}`);
    }
    notesV++; count++;
  });

  if (!count) notesEmptySeg++;
});
if (notesEmptySeg) fail(`有 ${notesEmptySeg} 段学习要点是空的`);
ok.push(`学习要点：${segKeys.length} 段全部覆盖（语法 ${notesG} / 固定搭配 ${notesC} / 生词搭配 ${notesC2} / 注意事项 ${notesN} / 词汇 ${notesV}），例句与搭配出处逐字来自正文`);
if (notesG / segKeys.length < 3) fail(`语法平均只有 ${(notesG / segKeys.length).toFixed(1)} 条/段，偏少`);
if (notesV / segKeys.length < 1) fail(`词汇平均只有 ${(notesV / segKeys.length).toFixed(1)} 个/段，偏少`);

/* ============================ 输出 ============================ */

console.log(ok.map((s) => "  ✓ " + s).join("\n"));
if (problems.length) {
  console.log("\n发现问题 " + problems.length + " 处：");
  console.log(problems.slice(0, 30).map((s) => "  ✗ " + s).join("\n"));
  if (problems.length > 30) console.log("  … 还有 " + (problems.length - 30) + " 处");
  process.exit(1);
}
console.log("\n全部检查通过 ✅");
