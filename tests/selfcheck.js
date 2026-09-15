// 自检：静态引用一致性 + 数据文件内容质量
// 运行：node tests/selfcheck.js
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const html = read("index.html");
const app = read("assets/js/app.js");
const css = read("assets/css/style.css");

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
["data.words.js", "data.vocab.js", "data.collocations.js", "data.sentences.js", "data.dialogues.js", "data.practice.js"].forEach((f) => {
  require(path.join(root, "assets/js", f));
});
const DATA = global.window.CHAT_PRAC_DATA;
const VOCAB = global.window.CHAT_PRAC_VOCAB;

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

/* --- 语块库（词组/搭配，不进单词表） --- */
const vchunks = (VOCAB && VOCAB.chunks) || [];
if (vchunks.length < 3) fail(`语块库只有 ${vchunks.length} 条，偏少`);
vchunks.forEach((c, i) => {
  if (!c.w || !c.cn) fail(`语块第 ${i + 1} 条字段缺失`);
  if (!CJK.test(c.cn)) fail(`语块第 ${i + 1} 条中文不含汉字`);
});
ok.push(`语块库：${vchunks.length} 条`);

/* ============================ 输出 ============================ */

console.log(ok.map((s) => "  ✓ " + s).join("\n"));
if (problems.length) {
  console.log("\n发现问题 " + problems.length + " 处：");
  console.log(problems.slice(0, 30).map((s) => "  ✗ " + s).join("\n"));
  if (problems.length > 30) console.log("  … 还有 " + (problems.length - 30) + " 处");
  process.exit(1);
}
console.log("\n全部检查通过 ✅");
