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
const vclick = (attrs) => fire(byId.vocabBoard, "click", { target: makeEl("button", attrs) });
const answerOne = () => { const w = firstWord(); if (!w) return false; vclick({ "data-vans": "know", "data-vword": w }); return true; };
const backToForeground = () => { globalThis.document.hidden = false; fire(globalThis.document, "visibilitychange", {}); };

/* ---------------- 第 1 天 ---------------- */
setDay(2026, 1, 1);
if (state().day !== todayKey()) problems.push(`首次加载应写入今天的日期，实际 ${state().day}`);
if (state().newToday !== 0) problems.push(`首次加载 newToday 应为 0，实际 ${state().newToday}`);
if (!/还剩 50 个/.test(statText())) problems.push("今日新词应显示还剩 50 个，实际：" + statText());
console.log("  第 1 天开局：" + statText());

for (let i = 0; i < 50; i++) if (!answerOne()) { problems.push("第 " + (i + 1) + " 行没渲染出来"); break; }
if (state().newToday !== 50) problems.push(`第 1 天应学满 50 个，实际 ${state().newToday}`);
if (!/今天的 50 个新词完成了/.test(board())) problems.push("学满后应显示「今天的 50 个新词完成了」");
if (!/明天会再发 50 个/.test(board())) problems.push("学满后应说明明天会再发一批");
console.log("  第 1 天结束：" + statText());

/* ---------------- 第 2 天：不刷新页面，只回到前台 ---------------- */
setDay(2026, 1, 2);
backToForeground();
if (state().day !== todayKey()) problems.push(`跨天后日期应更新为 ${todayKey()}，实际 ${state().day}`);
if (state().newToday !== 0) problems.push(`跨天后今日额度应重置为 0，实际 ${state().newToday}`);
if (!/今日新词 0\/50/.test(statText())) problems.push("第 2 天计数应从 0/50 开始");
if (!/还剩 50 个/.test(statText())) problems.push("第 2 天应重新有 50 个新词任务");
if (!firstWord()) problems.push("第 2 天应该能列出新词");
console.log("  第 2 天回到前台：" + statText());

/* ---------------- 第 2 天：先清到期的复习，复习不占新词额度 ---------------- */
const dueBefore = Number((statText().match(/复习到期 (\d+)/) || [])[1] || 0);
for (let i = 0; i < 3; i++) answerOne();
if (state().newToday !== 0) {
  problems.push("答到期的复习词不该占用今日新词额度，实际 newToday=" + state().newToday);
}
const dueAfter = Number((statText().match(/复习到期 (\d+)/) || [])[1] || 0);
if (!(dueAfter < dueBefore)) problems.push(`复习到期应从 ${dueBefore} 减少，实际 ${dueAfter}`);
if (state().streak !== 2) problems.push(`第 1、2 天连着学，连续应为 2，实际 ${state().streak}`);
if (state().lastStudy !== todayKey()) problems.push("lastStudy 应记成今天");

/* ---------------- 第 3 天接着学：连续天数应变成 3 ---------------- */
setDay(2026, 1, 3);
backToForeground();
answerOne();
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
