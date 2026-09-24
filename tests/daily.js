/* 每日任务测试：验证「一天一批新词」而不是一次性任务。
   关键场景：装成 App 后是「从后台恢复」而不是重新加载页面 —— 所以
   测试把时钟拨到第 2 天，只触发一次 visibilitychange（模拟回到前台），
   看是否自动发出新的一批。走的是和真实点击一样的路径。
   运行：node tests/daily.js */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const problems = [];

/* ---------------- 可拨动的假时钟 ---------------- */
const RealDate0 = Date;
let NOW = new RealDate0(2026, 0, 1, 9, 0, 0).getTime();   // 2026-1-1 09:00
class FakeDate extends RealDate0 {
  constructor(...a) { super(...(a.length ? a : [NOW])); }
  static now() { return NOW; }
}
globalThis.Date = FakeDate;
const setDay = (y, m, d) => { NOW = new RealDate0(y, m - 1, d, 9, 0, 0).getTime(); };
const todayKey = () => { const d = new RealDate0(NOW); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };

/* ---------------- 最小 DOM 桩（带事件注册表） ---------------- */
const listeners = new WeakMap();
function makeEl(tag, attrs) {
  const el = {
    tagName: (tag || "div").toUpperCase(), attrs: attrs || {}, children: [], innerHTML: "",
    textContent: "", value: "", hidden: false, disabled: false, scrollTop: 0, scrollHeight: 100,
    style: {}, className: "",
    classList: { _s: new Set(), add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); }, contains(c) { return this._s.has(c); }, toggle(c, on) { on ? this._s.add(c) : this._s.delete(c); } },
    getAttribute(n) { return n in this.attrs ? this.attrs[n] : null; },
    setAttribute(n, v) { this.attrs[n] = v; },
    addEventListener(type, fn) { const m = listeners.get(el) || {}; (m[type] = m[type] || []).push(fn); listeners.set(el, m); },
    appendChild(c) { el.children.push(c); return c; },
    querySelector() { return makeEl("div"); }, querySelectorAll() { return []; },
    closest(sel) { const m = /^\[([A-Za-z-]+)\]$/.exec(sel); return m && m[1] in el.attrs ? el : null; },
    focus() {}
  };
  return el;
}
function fire(el, type, evt) {
  const m = listeners.get(el) || {};
  (m[type] || []).forEach((fn) => fn(Object.assign({ preventDefault() {} }, evt)));
}

const byId = {};
["app", "sidebar", "backdrop", "menuBtn", "nav", "modeSwitch", "viewTitle", "themeToggle", "viewport",
 "view-words", "view-sentences", "view-practice", "view-dialogue", "vocabBoard",
 "wordList", "wordEmpty", "sentList", "sentEmpty", "dialogueList", "dialogueEmpty", "chatLog",
 "input", "sendBtn", "composerHint", "composer", "studyProgress",
 "pbarAll", "pbarAllVal", "pbarDom", "pbarDomVal", "pbarDomName"].forEach((id) => { byId[id] = makeEl("div"); });
byId.vocabBoard.hidden = true;

const store = {};
globalThis.window = globalThis;
globalThis.document = {
  readyState: "complete", documentElement: makeEl("html"), hidden: false,
  querySelector(sel) { const id = String(sel).replace(/^#/, ""); return String(sel).startsWith("#") && byId[id] ? byId[id] : makeEl("div"); },
  querySelectorAll(sel) { return sel === ".nav-item" || sel === ".mode-btn" ? [] : []; },
  createElement(t) { return makeEl(t); },
  // 和 makeEl 共用同一张注册表，这样 fire(document, "visibilitychange") 能打到 app 绑的处理器
  addEventListener(type, fn) { const m = listeners.get(globalThis.document) || {}; (m[type] = m[type] || []).push(fn); listeners.set(globalThis.document, m); }
};
globalThis.localStorage = {
  getItem(k) { return k in store ? store[k] : null; },
  setItem(k, v) { store[k] = String(v); },
  removeItem(k) { delete store[k]; }
};
globalThis.matchMedia = () => ({ matches: false });
globalThis.location = { hash: "" };
globalThis.history = { replaceState() {} };

["data.words.js", "data.vocab.js", "data.collocations.js", "data.phon.js", "data.sentences.js", "data.dialogues.js", "data.practice.js", "data.scenarios.js", "data.notes.js"]
  .forEach((f) => require(path.join(root, "assets/js", f)));
store["chatprac-mode"] = "study";     // 单词板块只在学习模式下渲染
vm.runInThisContext(fs.readFileSync(path.join(root, "assets/js/app.js"), "utf8"), { filename: "app.js" });

/* ---------------- 工具 ---------------- */
const VKEY = "chatprac-vocab-study";
const state = () => JSON.parse(store[VKEY] || "{}");
const board = () => byId.vocabBoard.innerHTML;
const statText = () => (board().match(/<p class="vstat">([\s\S]*?)<\/p>/) || [])[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const firstWord = () => (board().match(/data-vword="([^"]+)"/) || [])[1];
// 今日列表里所有词的行（复习在最前，新词在后）。
// 注意一行里有两个按钮都带 data-vword，所以只按「认识」键取，一行一个
const allWords = () => (board().match(/data-vans="know" data-vword="([^"]+)"/g) || [])
  .map((s) => s.replace(/.*data-vword="([^"]+)".*/, "$1"));
const vclick = (attrs) => fire(byId.vocabBoard, "click", { target: makeEl("button", attrs) });
const answerOne = () => { const w = firstWord(); if (!w) return false; vclick({ "data-vans": "know", "data-vword": w }); return true; };
const backToForeground = () => { globalThis.document.hidden = false; fire(globalThis.document, "visibilitychange", {}); };
const advance = (ms) => { NOW += ms; };      // 模拟"点一下隔一会儿再点下一个"

/* ---------------- 第 1 天 ---------------- */
setDay(2026, 1, 1);
if (state().day !== todayKey()) problems.push(`首次加载应写入今天的日期，实际 ${state().day}`);
if (state().newToday !== 0) problems.push(`首次加载 newToday 应为 0，实际 ${state().newToday}`);
if (!/还剩 50 个/.test(statText())) problems.push("今日新词应显示还剩 50 个，实际：" + statText());
console.log("  第 1 天开局：" + statText());

// 按界面上的顺序学 50 个，记下点击先后（每次点击隔 1 秒，模拟真实节奏）
const learnedOrder = [];
for (let i = 0; i < 50; i++) {
  const w = firstWord();
  if (!w) { problems.push("第 " + (i + 1) + " 行没渲染出来"); break; }
  learnedOrder.push(w);
  vclick({ "data-vans": "know", "data-vword": w });
  advance(1);                     // 每次点击隔 1 毫秒（只要时间戳能区分先后就行）
}
if (state().newToday !== 50) problems.push(`第 1 天应学满 50 个，实际 ${state().newToday}`);
if (!/今天的 50 个新词完成了/.test(board())) problems.push("学满后应显示「今天的 50 个新词完成了」");
if (Object.keys(state().knownAt || {}).length !== 50) {
  problems.push("每个词都该记下「点认识」的时间，实际记了 " + Object.keys(state().knownAt || {}).length + " 个");
}
console.log("  第 1 天结束：" + statText());

/* ---------------- 「继续学习」：50 个做完后可以一批一批接着学 ---------------- */
// 属性从渲染出来的 HTML 里取，不手写 —— 否则属性名拼错了测试也发现不了
const moreAttr = (board().match(/data-vmore="[^"]*"/) || [])[0];
if (!moreAttr) problems.push("50 个做完后应出现「继续学习」按钮");
if (!/继续学习（再 50 个）/.test(board())) problems.push("「继续学习」按钮文案不对");
const clickMore = () => {
  const pair = (board().match(/data-vmore="[^"]*"/) || [])[0];
  if (!pair) { problems.push("「继续学习」按钮不见了"); return false; }
  const [k, v] = pair.split("=");
  vclick({ [k]: v.replace(/"/g, "") });
  return true;
};
if (clickMore()) {
  if (state().newBonus !== 50) problems.push(`点一次继续学习应追加 50 个额度，实际 ${state().newBonus}`);
  if (!/今日新词 50\/100/.test(statText())) problems.push("追加后额度应变成 50/100，实际：" + statText());
  if (!/已追加 50 个/.test(statText())) problems.push("统计行应显示已追加 50 个，实际：" + statText());
}

// 追加出来的词确实能学（再学 5 个，记进点击顺序）
const bonusRows = allWords();
if (bonusRows.length !== 50) problems.push(`追加后应列出 50 个新词，实际 ${bonusRows.length} 行`);
for (let i = 0; i < 5; i++) {
  const w = firstWord();
  if (!w) { problems.push("追加的第 " + (i + 1) + " 个词没渲染出来"); break; }
  learnedOrder.push(w);
  vclick({ "data-vans": "know", "data-vword": w });
  advance(1);
}
if (state().newToday !== 55) problems.push(`追加后应能继续学，newToday 应为 55，实际 ${state().newToday}`);

// 把追加的这批剩下 45 个也学完（额度 100 用尽）→ 按钮应该再出现一次
for (let i = 0; i < 45; i++) {
  const w = firstWord();
  if (!w) { problems.push("追加的第 " + (i + 6) + " 个词没渲染出来"); break; }
  learnedOrder.push(w);
  vclick({ "data-vans": "know", "data-vword": w });
  advance(1);
}
if (state().newToday !== 100) problems.push(`追加的 50 个学完应为 100，实际 ${state().newToday}`);

// 可以反复追加（50 个一批）
if (clickMore()) {
  if (state().newBonus !== 100) problems.push(`再点一次应累计到 100，实际 ${state().newBonus}`);
  if (!/今日新词 100\/150/.test(statText())) problems.push("再追加后额度应变成 100/150，实际：" + statText());
  if (!/已追加 100 个/.test(statText())) problems.push("统计行应显示已追加 100 个，实际：" + statText());
}
console.log("  继续学习：50 个做完 → 追加 50 → 学完又能再追加（累计 100）✔");

/* ---------------- 第 2 天：不刷新页面，只回到前台 ---------------- */
setDay(2026, 1, 2);
advance(3 * 3600 * 1000);         // 第 2 天中午（保证昨天 9 点学的都到点了）
backToForeground();
if (state().day !== todayKey()) problems.push(`跨天后日期应更新为 ${todayKey()}，实际 ${state().day}`);
if (state().newToday !== 0) problems.push(`跨天后今日额度应重置为 0，实际 ${state().newToday}`);
if (state().reviewToday !== 0) problems.push(`跨天后复习额度应重置为 0，实际 ${state().reviewToday}`);
if (!/今日新词 0\/50/.test(statText())) problems.push("第 2 天计数应从 0/50 开始");
if (!/还剩 50 个/.test(statText())) problems.push("第 2 天应重新有 50 个新词任务");
if (!firstWord()) problems.push("第 2 天应该能列出新词");
console.log("  第 2 天回到前台：" + statText());

/* ---------------- 第 2 天：复习 15 个，顺序 = 最后一次点认识的倒序 ---------------- */
const learnedN = learnedOrder.length;                       // 第 1 天实际学了多少（50 + 继续学习追加的 5）
const dueAll = Number((statText().match(/到期 (\d+)/) || [])[1] || 0);
if (dueAll !== learnedN) problems.push(`第 2 天到期的应是昨天学的 ${learnedN} 个，实际 ${dueAll}`);
if (!/复习 0\/15/.test(statText())) problems.push("第 2 天复习计数应从 0/15 开始，实际：" + statText());
if (state().newBonus !== 0) problems.push(`「继续学习」追加的额度不该跨天，实际 newBonus=${state().newBonus}`);

// 今天列表 = 前 15 个复习词 + 后面的新词
const rows = allWords();
const reviewRows = rows.slice(0, 15);
const expectReview = learnedOrder.slice(-15).reverse();     // 最后点认识的排最前
if (reviewRows.join(",") !== expectReview.join(",")) {
  problems.push("复习顺序不是「最后一次点认识」的倒序\n      期望：" + expectReview.slice(0, 5).join(" ") +
    " …\n      实际：" + reviewRows.slice(0, 5).join(" "));
}
if (rows.length !== 15 + 50) problems.push(`第 2 天应列出 15 个复习 + 50 个新词，实际 ${rows.length} 行`);
console.log("  第 2 天：到期 " + learnedN + " 个 → 只发 15 个复习，顺序 = 最后点认识的排最前 ✔");
console.log("    前 5 个：" + reviewRows.slice(0, 5).join("、"));

/* ---------------- 第 2 天：复习不占新词额度；做完 15 个就不再发 ---------------- */
for (let i = 0; i < 15; i++) { answerOne(); advance(1); }
if (state().reviewToday !== 15) problems.push(`做完 15 个复习后 reviewToday 应为 15，实际 ${state().reviewToday}`);
if (state().newToday !== 0) {
  problems.push("答到期的复习词不该占用今日新词额度，实际 newToday=" + state().newToday);
}
const afterRows = allWords();
if (afterRows.length !== 50) {
  problems.push(`15 个复习做完后应只剩 50 个新词，实际 ${afterRows.length} 行（到期额度没封住）`);
}
const stillDue = learnedOrder.slice(0, learnedN - 15);      // 还没复习的仍然到期着，但今天不再发
if (stillDue.some((w) => afterRows.indexOf(w) >= 0)) {
  problems.push("今天的 15 个复习额度用完后，不该再插进到期的词");
}
if (!/复习 15\/15/.test(statText())) problems.push("统计行应显示复习 15/15，实际：" + statText());
if (!new RegExp("到期 " + (learnedN - 15)).test(statText())) {
  problems.push(`统计行应显示还有 ${learnedN - 15} 个到期，实际：` + statText());
}
if (state().streak !== 2) problems.push(`第 1、2 天连着学，连续应为 2，实际 ${state().streak}`);
if (state().lastStudy !== todayKey()) problems.push("lastStudy 应记成今天");
console.log("  15 个做完：复习额度封住（到期还剩 " + (learnedN - 15) + " 个，今天不再发），新词额度没被占用 ✔");

/* ---------------- 第 3 天：额度重置；轮到的应是还没复习过的那些（最早学的） ---------------- */
setDay(2026, 1, 3);
advance(3 * 3600 * 1000);
backToForeground();
if (!/复习 0\/15/.test(statText())) problems.push("第 3 天复习额度应重置为 0/15，实际：" + statText());
const day3 = allWords().slice(0, 15);
// 昨天复习过的 15 个进了记忆盒 2（+3 天），今天不到点；今天到期的是剩下那些（最早学的），
// 按倒序排，第一个就是它们当中最后点认识的那个
const expectDay3First = learnedOrder[learnedN - 15 - 1];
if (day3[0] !== expectDay3First) {
  problems.push("第 3 天复习队列第一个应是 " + expectDay3First + "，实际 " + day3[0]);
}
if (day3.indexOf(expectReview[14]) >= 0) {
  problems.push("昨天复习过、已经推到 3 天后的词，今天不该再出现");
}
answerOne();
advance(1);
if (state().streak !== 3) problems.push(`连着第 3 天学，连续应为 3，实际 ${state().streak}`);
console.log("  第 3 天：" + statText());

/* ---------------- 中断两天再学：连续天数重新从 1 开始 ---------------- */
setDay(2026, 1, 6);
backToForeground();
answerOne();
if (state().streak !== 1) problems.push(`断档后连续天数应从 1 重来，实际 ${state().streak}`);

/* ---------------- 老进度没有 day / streak 字段也不能崩 ---------------- */
store[VKEY] = JSON.stringify({ box: { agree: 2 }, done: { agree: 1 }, due: { agree: Date.now() + 999999 } });
setDay(2026, 1, 7);
backToForeground();
if (!/今日新词 0\/50/.test(statText())) problems.push("旧进度跨天应从 0/50 开始，实际：" + statText());

console.log("");
if (problems.length) {
  console.log("发现问题 " + problems.length + " 处：");
  console.log(problems.map((s) => "  ✗ " + s).join("\n"));
  process.exit(1);
}
console.log("每日任务检查通过 ✅ （第 1 天 50 个 → 第 2 天回到前台自动再发 50 个 → 连续天数跟着走）");
