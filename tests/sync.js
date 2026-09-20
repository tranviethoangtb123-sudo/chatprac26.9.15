/* 进度同步测试：验证「清缓存 / 换手机」后进度能拿回来。
   做法：真实加载 app.js → 学几个词 + 标记对话掌握 → 导出快照文本 →
   把 localStorage 整个清空（模拟清缓存/换新手机）→ 重新加载 app.js →
   从文本恢复 → 断言进度回来了。
   运行：node tests/sync.js */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const problems = [];
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
    removeChild(c) { el.children = el.children.filter((x) => x !== c); },
    querySelector() { return makeEl("div"); }, querySelectorAll() { return []; },
    closest(sel) { const m = /^\[([A-Za-z-]+)\]$/.exec(sel); return m && m[1] in el.attrs ? el : null; },
    focus() {}, click() { fire(el, "click", {}); }
  };
  return el;
}
function fire(el, type, evt) {
  const m = listeners.get(el) || {};
  (m[type] || []).forEach((fn) => fn(Object.assign({ preventDefault() {} }, evt)));
}

const IDS = ["app", "sidebar", "backdrop", "menuBtn", "nav", "modeSwitch", "viewTitle", "themeToggle", "viewport",
  "view-words", "view-sentences", "view-practice", "view-dialogue", "vocabBoard",
  "wordList", "wordEmpty", "sentList", "sentEmpty", "dialogueList", "dialogueEmpty", "chatLog",
  "input", "sendBtn", "composerHint", "composer", "studyProgress",
  "pbarAll", "pbarAllVal", "pbarDom", "pbarDomVal", "pbarDomName",
  "syncToggle", "syncState", "syncBody", "syncToken", "syncUp", "syncDown", "syncAuto",
  "syncMsg", "syncText", "syncExport", "syncImport", "syncFile"];

let byId = {};
let store = {};

function freshDom() {
  byId = {};
  IDS.forEach((id) => { byId[id] = makeEl("div"); });
  byId.vocabBoard.hidden = true;
  byId.syncBody.hidden = true;
  globalThis.document = {
    readyState: "complete", documentElement: makeEl("html"), hidden: false, body: makeEl("body"),
    querySelector(sel) { const id = String(sel).replace(/^#/, ""); return String(sel).startsWith("#") && byId[id] ? byId[id] : makeEl("div"); },
    querySelectorAll(sel) { return sel === ".nav-item" || sel === ".mode-btn" ? [] : []; },
    createElement(t) { return makeEl(t); },
    addEventListener(type, fn) { const m = listeners.get(globalThis.document) || {}; (m[type] = m[type] || []).push(fn); listeners.set(globalThis.document, m); }
  };
}

globalThis.window = globalThis;
freshDom();
globalThis.localStorage = {
  getItem(k) { return k in store ? store[k] : null; },
  setItem(k, v) { store[k] = String(v); },
  removeItem(k) { delete store[k]; },
  clear() { store = {}; }
};
globalThis.matchMedia = () => ({ matches: false });
globalThis.location = { hash: "" };
globalThis.history = { replaceState() {} };
globalThis.Blob = function () {};
globalThis.URL = { createObjectURL: () => "blob:x", revokeObjectURL() {} };

["data.words.js", "data.vocab.js", "data.collocations.js", "data.sentences.js", "data.dialogues.js", "data.practice.js", "data.scenarios.js"]
  .forEach((f) => require(path.join(root, "assets/js", f)));
const APP = fs.readFileSync(path.join(root, "assets/js/app.js"), "utf8");

const VKEY = "chatprac-vocab-study", GKEY = "chatprac-dialogue-goal";
const vState = () => JSON.parse(store[VKEY] || "{}");
const gState = () => JSON.parse(store[GKEY] || '{"mark":{}}');
const board = () => byId.vocabBoard.innerHTML;
const vclick = (attrs) => fire(byId.vocabBoard, "click", { target: makeEl("button", attrs) });
const dclick = (attrs) => fire(byId.dialogueList, "click", { target: makeEl("button", attrs) });

/* ---------------- 第一次打开：学 5 个词 + 标记一段对话掌握 ---------------- */
store["chatprac-mode"] = "study";
vm.runInThisContext(APP, { filename: "app.js" });
for (let i = 0; i < 5; i++) {
  const w = (board().match(/data-vword="([^"]+)"/) || [])[1];
  if (!w) { problems.push("第 " + (i + 1) + " 行没渲染出来"); break; }
  vclick({ "data-vans": "know", "data-vword": w });
}
dclick({ "data-dlgpick": "1" });
dclick({ "data-dlgseg": "s06-01:0" });
dclick({ "data-dlgmark": "ok", "data-dlgkey": "s06-01:0" });

const learnedBefore = Object.keys(vState().done || {}).length;
const masteredBefore = gState().mark["s06-01:0"];
if (learnedBefore !== 5) problems.push(`应学 5 个词，实际 ${learnedBefore}`);
if (!masteredBefore) problems.push("对话「掌握」没记下来");
console.log("  第一次打开：学了 " + learnedBefore + " 个词，对话掌握 1 段");

/* ---------------- 导出快照文本 ---------------- */
fire(byId.syncToggle, "click", {});
if (byId.syncBody.hidden !== false) problems.push("点「进度同步」应该展开面板");
fire(byId.syncExport, "click", {});
const snapshot = byId.syncText.value;
if (!snapshot || snapshot.length < 50) problems.push("导出的快照文本为空");
const snapObj = JSON.parse(snapshot);
if (snapObj.app !== "chat-prac") problems.push("快照缺少标识 app=chat-prac");
if (!snapObj.data || !snapObj.data[VKEY]) problems.push("快照里没有背单词进度");
if (!snapObj.data[GKEY]) problems.push("快照里没有对话掌握进度");
console.log("  导出快照：" + snapshot.length + " 字符，含 " + Object.keys(snapObj.data).join(" / "));

/* ---------------- 清缓存 / 换新手机：localStorage 全清，重新加载 ---------------- */
globalThis.localStorage.clear();
freshDom();
vm.runInThisContext(APP, { filename: "app.js" });
console.log("  清空缓存后重新打开：学过的词 " + Object.keys(vState().done || {}).length + " 个（应为 0）");
if (Object.keys(vState().done || {}).length !== 0) problems.push("清缓存后不该还有进度（测试前提不成立）");

/* ---------------- 从文本恢复 ---------------- */
fire(byId.syncToggle, "click", {});
byId.syncText.value = snapshot;
fire(byId.syncImport, "click", {});
const learnedAfter = Object.keys(vState().done || {}).length;
const masteredAfter = gState().mark["s06-01:0"];
if (learnedAfter !== learnedBefore) problems.push(`恢复后应有 ${learnedBefore} 个学过的词，实际 ${learnedAfter}`);
if (!masteredAfter) problems.push("恢复后对话「掌握」丢了");
if (vState().day === undefined) problems.push("恢复后日期字段丢了");
if (!/sync-msg/.test(byId.syncMsg.className) && !byId.syncMsg.textContent) problems.push("恢复后应给出提示");
console.log("  从文本恢复：" + byId.syncMsg.textContent);
console.log("  恢复后：学过的词 " + learnedAfter + " 个，对话掌握 " + (masteredAfter ? "在" : "丢了"));

/* ---------------- 期间：脏数据要被挡住 ---------------- */
byId.syncText.value = "{}";
fire(byId.syncImport, "click", {});
if (Object.keys(vState().done || {}).length !== learnedBefore) {
  problems.push("无效文本不该清掉现有进度");
}
if (!byId.syncMsg.className.includes("is-bad")) problems.push("无效快照应给出错误提示");

console.log("");
if (problems.length) {
  console.log("发现问题 " + problems.length + " 处：");
  console.log(problems.map((s) => "  ✗ " + s).join("\n"));
  process.exit(1);
}
console.log("进度同步检查通过 ✅ （导出 → 清空缓存 → 恢复：单词进度与对话掌握都回来了）");
