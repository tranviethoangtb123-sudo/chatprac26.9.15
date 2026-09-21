/* 对话模块测试（学习模式·对话）
   ----------------------------------------------------------------------------
   为什么单独一套：用户开始用这个板块了，最怕两件事 ——
     ① 关了再打开，掌握记录没了；② 跨天之后「全部已掌握」被清掉。
   所以这里每次都真的**重新加载一次 app.js**（新 DOM + 共用同一份 localStorage），
   而不是假装 reload。
   覆盖：
     · 打开板块：未选场景时不出正文、底部进度条就位、输入框隐藏
     · 展开选择器：一级标题默认收起（约定），点开域才列变体
     · 掌握 / 练习：互斥、再点取消、计数与底部两条进度条
     · 关掉再打开：掌握记录、今天掌握数、全部已掌握数都在；下拉行还带掌握样式
     · 跨天：今天掌握归零，但全部已掌握**一段都不能少**
     · 旧进度（带多余字段 + 已不存在场景的孤儿键）不崩、不清、不虚高
     · 只翻看板块（切换 / 开关下拉）绝不改写进度
     · 读不出来的进度：原文进保命副本，绝不被反手覆盖
     · 两个页面同时开着：后点的那个不能把先点的记录冲掉
   运行：node tests/dialogue.js */
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
const setDay = (y, m, d) => { NOW = new RealDate0(y, m - 1, d, 9, 0, 0).getTime(); };
const todayKey = () => { const d = new RealDate0(NOW); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };

/* ---------------- 共享「手机存储」：两次启动共用，模拟关掉再打开 ---------------- */
const store = {};

/* ---------------- 最小 DOM 桩 ---------------- */
function makeStubs() {
  const listeners = new WeakMap();
  function makeEl(tag, attrs) {
    const el = {
      tagName: (tag || "div").toUpperCase(), attrs: attrs || {}, children: [], innerHTML: "",
      textContent: "", value: "", hidden: false, disabled: false, scrollTop: 0, scrollHeight: 100,
      style: {}, className: "",
      classList: {
        _s: new Set(),
        add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); },
        contains(c) { return this._s.has(c); },
        toggle(c, on) { on ? this._s.add(c) : this._s.delete(c); }
      },
      getAttribute(n) { return n in el.attrs ? el.attrs[n] : null; },
      setAttribute(n, v) { el.attrs[n] = v; },
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
   "pbarAll", "pbarAllVal", "pbarDom", "pbarDomVal", "pbarDomName",
   "syncToggle", "syncState", "syncBody", "syncToken", "syncUp", "syncDown", "syncAuto",
   "syncMsg", "syncText", "syncExport", "syncImport", "syncFile", "syncReload", "syncReset"].forEach((id) => {
    byId[id] = makeEl("div");
  });
  byId.vocabBoard.hidden = true;
  return { makeEl, fire, byId };
}

const DATA_FILES = ["data.words.js", "data.vocab.js", "data.collocations.js", "data.phon.js",
  "data.sentences.js", "data.dialogues.js", "data.practice.js", "data.scenarios.js", "data.notes.js"];
const DATA_CODE = DATA_FILES.map((f) => ({ f, code: fs.readFileSync(path.join(root, "assets/js", f), "utf8") }));
const APP_CODE = fs.readFileSync(path.join(root, "assets/js/app.js"), "utf8");

/* ---------------- 启动一次 app（新 DOM，共用 localStorage） ---------------- */
function launch() {
  const { makeEl, fire, byId } = makeStubs();
  const doc = {
    readyState: "complete", documentElement: makeEl("html"), hidden: false,
    querySelector(sel) {
      const id = String(sel).replace(/^#/, "");
      return String(sel).startsWith("#") && byId[id] ? byId[id] : makeEl("div");
    },
    querySelectorAll() { return []; },
    createElement(t) { return makeEl(t); },
    addEventListener() {}
  };
  const sandbox = {
    console: { log() {}, warn() {}, error() {} },
    setTimeout, clearTimeout, Date: FakeDate,
    localStorage: {
      getItem(k) { return k in store ? store[k] : null; },
      setItem(k, v) { store[k] = String(v); },
      removeItem(k) { delete store[k]; }
    },
    document: doc,
    navigator: {},
    location: { hash: "#dialogue", protocol: "file:" },
    history: { replaceState() {} },
    matchMedia: () => ({ matches: false }),
    addEventListener() {},
    fetch: () => Promise.reject(new Error("测试里不联网")),
    confirm: () => false
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  const ctx = vm.createContext(sandbox);
  DATA_CODE.forEach(({ f, code }) => vm.runInContext(code, ctx, { filename: f }));
  vm.runInContext(APP_CODE, ctx, { filename: "app.js" });

  const SC = sandbox.CHAT_PRAC_SCENARIOS;
  const dclick = (attrs) => fire(byId.dialogueList, "click", { target: makeEl("button", attrs) });
  const dHtml = () => byId.dialogueList.innerHTML;
  const goal = () => JSON.parse(store["chatprac-dialogue-goal"] || '{"mark":{}}');
  const vclick = (attrs) => fire(byId.vocabBoard, "click", { target: makeEl("button", attrs) });
  return { sandbox, SC, byId, fire, makeEl, dclick, dHtml, goal, vclick };
}

/* 只加载数据，用来算期望值（不启动 app） */
const POOL = (() => {
  const probe = { window: {} };
  const ctx = vm.createContext({ window: probe.window, console });
  vm.runInContext(fs.readFileSync(path.join(root, "assets/js/data.scenarios.js"), "utf8"), ctx, { filename: "sc.js" });
  vm.runInContext(fs.readFileSync(path.join(root, "assets/js/data.words.js"), "utf8"), ctx, { filename: "w.js" });
  vm.runInContext(fs.readFileSync(path.join(root, "assets/js/data.vocab.js"), "utf8"), ctx, { filename: "v.js" });
  const SC = probe.window.CHAT_PRAC_SCENARIOS;
  const all = [];
  SC.scenarios.forEach((s) => s.dialogues.forEach((d, i) => all.push({ key: s.id + ":" + i, dom: s.domain })));
  const have = new Set(
    probe.window.CHAT_PRAC_DATA.words.map((x) => x.w.toLowerCase())
      .concat((probe.window.CHAT_PRAC_VOCAB.words || []).map((x) => x.w.toLowerCase()))
  );
  return { SC, all, total: all.length, domCount: new Set(all.map((x) => x.dom)).size, have };
})();
const SEGS = POOL;

// 导入测试要用词库里**确实没有**的词，否则会被「跳过重复」挡住，测不出存盘
const CANDIDATES = ["itinerary", "refund", "zzprobe", "chatpracprobe", "probezz"];
const NEWWORD = CANDIDATES.find((w) => !POOL.have.has(w));
if (!NEWWORD) {
  console.log("发现问题 1 处：\n  ✗ 候选词都被词库收录了，导入测试没法验证存盘");
  process.exit(1);
}
const NEWLINE = NEWWORD + " n 测试用词";

const pctText = (done, total) => {
  const pct = total ? done / total * 100 : 0;
  return done + " / " + total + " · " + ((pct > 0 && pct < 10) ? pct.toFixed(1) : String(Math.round(pct))) + "%";
};
const pctOf = (done, total) => Math.round(done / total * 100) + "%";

/* ============================ 第 1 次打开 ============================ */
setDay(2026, 1, 1);
store["chatprac-mode"] = "study";
let app = launch();
let { byId, dclick, vclick, dHtml, goal } = app;
const scn0 = SEGS.SC.scenarios[0];
const k0 = scn0.id + ":0";
const k1 = scn0.id + ":1";
const k2 = scn0.id + ":2";

if (dHtml().indexOf("选择场景") < 0) problems.push("对话板块没有场景选择器");
if (dHtml().indexOf("dlgline") >= 0) problems.push("还没选场景时不该出现对话正文");
if (byId.studyProgress.hidden !== false) problems.push("对话板块底部进度条应显示");
if (byId.composer.hidden !== true) problems.push("对话板块底部不该有输入框");
console.log("  打开对话板块：只有选择器，没有正文；底部两条进度条就位 ✔");

/* ---------------- 展开选择器：一级标题默认收起；点开域才有变体 ---------------- */
dclick({ "data-dlgpick": "1" });
const heads = (dHtml().match(/class="dlgdomlabel/g) || []).length;
if (heads !== SEGS.domCount) problems.push("一级标题应为 " + SEGS.domCount + " 个，实际 " + heads);
if ((dHtml().match(/class="dlgpick-row/g) || []).length !== 0) {
  problems.push("一级标题默认应收起（约定：不直接铺开 480 个选项）");
}
dclick({ "data-dlgdom": scn0.domain });
const rowsOneDom = (dHtml().match(/class="dlgpick-row/g) || []).length;
const segsOneDom = SEGS.all.filter((x) => x.dom === scn0.domain).length;
if (rowsOneDom !== segsOneDom) problems.push("点开一个域后的变体行数应为 " + segsOneDom + "，实际 " + rowsOneDom);
if (dHtml().indexOf("今天掌握") < 0) problems.push("下拉里应有今日进度一行");
console.log("  展开选择器：" + heads + " 个域标题默认收起；点开「" + SEGS.SC.domains.find((d) => d.id === scn0.domain).name +
  "」列出 " + rowsOneDom + " 个变体 ✔");

/* ---------------- 掌握 / 练习：互斥、取消 ---------------- */
dclick({ "data-dlgmark": "ok", "data-dlgkey": k0 });
dclick({ "data-dlgmark": "ok", "data-dlgkey": k1 });
dclick({ "data-dlgmark": "ok", "data-dlgkey": k2 });
if (Object.keys(goal().mark).length !== 3) problems.push("连记 3 段掌握，实际只记下 " + Object.keys(goal().mark).length + " 段");
if ((goal().mark[k0] || {}).s !== "ok") problems.push("掌握没记成 ok");
if ((goal().mark[k0] || {}).d !== todayKey()) problems.push("掌握没记当天日期：" + (goal().mark[k0] || {}).d);

dclick({ "data-dlgmark": "practice", "data-dlgkey": k2 });     // 改成「练习」
if ((goal().mark[k2] || {}).s !== "practice") problems.push("练习没能覆盖掌握状态");
dclick({ "data-dlgmark": "ok", "data-dlgkey": k2 });           // 改回「掌握」
if ((goal().mark[k2] || {}).s !== "ok") problems.push("掌握没能覆盖练习状态");
dclick({ "data-dlgmark": "ok", "data-dlgkey": k2 });           // 再点一次 = 取消
if (goal().mark[k2]) problems.push("再点一次掌握应该取消掉");
dclick({ "data-dlgmark": "ok", "data-dlgkey": k2 });           // 恢复成掌握，便于后面断言
console.log("  掌握 / 练习：同一段互斥覆盖，再点一次取消，计数跟着走 ✔");

/* ---------------- 两条进度条 ---------------- */
const domId = scn0.domain;
const domSegs = SEGS.all.filter((s) => s.dom === domId).length;
if (byId.pbarAllVal.textContent !== pctText(3, SEGS.total)) {
  problems.push("全场景进度不对：" + byId.pbarAllVal.textContent + "（应为 " + pctText(3, SEGS.total) + "）");
}
if (byId.pbarAll.style.width !== pctOf(3, SEGS.total)) {
  problems.push("全场景进度条宽度不对：" + byId.pbarAll.style.width);
}
if (byId.pbarDomVal.textContent !== pctText(3, domSegs)) {
  problems.push("当前域进度不对：" + byId.pbarDomVal.textContent + "（应为 " + pctText(3, domSegs) + "）");
}
if (byId.pbarDomName.textContent.length < 2) problems.push("当前一级标题名字为空");
console.log("  底部进度：全场景 " + byId.pbarAllVal.textContent + " · " + byId.pbarDomName.textContent + " " + byId.pbarDomVal.textContent + " ✔");

/* ---------------- 只翻看不应改写进度 ---------------- */
const snapshotAfterMark = store["chatprac-dialogue-goal"];
dclick({ "data-dlgpick": "1" });                       // 收起/展开下拉
dclick({ "data-dlgseg": k0 });                         // 选中一段读对话
dclick({ "data-dlgseg": k0 });                         // 再点取消
dclick({ "data-dlgdom": "06" });                       // 点一级标题
if (store["chatprac-dialogue-goal"] !== snapshotAfterMark) {
  problems.push("只是翻看/展开/收起，进度就被改写了（不该动）");
}
if (dHtml().indexOf("dlgline") >= 0) problems.push("取消选中后对话应收起");
console.log("  只翻看板块（开关下拉、选中取消、点一级标题）：进度一个字都没动 ✔");

/* ============================ 关掉再打开 ============================ */
app = launch();
({ byId, dclick, vclick, dHtml, goal } = app);
if (Object.keys(goal().mark).length !== 3) {
  problems.push("重开后掌握记录丢了：只剩 " + Object.keys(goal().mark).length + " 段");
}
dclick({ "data-dlgpick": "1" });
dclick({ "data-dlgdom": domId });                      // 展开记过掌握的那个域，才看得到行
if (dHtml().indexOf("今天掌握 <b>3</b>") < 0) problems.push("重开后「今天掌握」没回到 3");
if (dHtml().indexOf("全部已掌握 <b>3</b>") < 0) problems.push("重开后「全部已掌握」没回到 3");
if ((dHtml().match(/dlgpick-row is-ok/g) || []).length !== 3) {
  problems.push("重开后下拉里掌握样式不对，实际 " + (dHtml().match(/dlgpick-row is-ok/g) || []).length + " 行");
}
if (byId.pbarAllVal.textContent !== pctText(3, SEGS.total)) {
  problems.push("重开后底部进度没恢复：" + byId.pbarAllVal.textContent);
}
console.log("  关掉再打开：掌握记录、今天掌握 3、全部已掌握 3、下拉样式、底部进度全在 ✔");

/* ============================ 跨天：记忆不能少 ============================ */
const before = goal().mark;
setDay(2026, 1, 2);
app = launch();
({ byId, dclick, vclick, dHtml, goal } = app);
const kept = Object.keys(goal().mark).filter((k) => goal().mark[k].s === "ok").length;
if (kept !== 3) problems.push("跨天后「全部已掌握」少了，剩 " + kept + " 段（记忆被清）");
if (Object.keys(before).some((k) => !goal().mark[k])) problems.push("跨天后有进度键整条消失");
dclick({ "data-dlgpick": "1" });
if (dHtml().indexOf("今天掌握 <b>0</b>") < 0) problems.push("跨天后「今天掌握」应归零");
if (dHtml().indexOf("全部已掌握 <b>3</b>") < 0) problems.push("跨天后「全部已掌握」应仍是 3");
console.log("  跨到第 2 天：今天掌握回到 0，全部已掌握仍是 3（记忆保留）✔");

/* ============================ 两个页面同时开着：后点的不能冲掉先点的 ============================ */
// 模拟：这边页面还停在旧数据上，另一边（或系统同步）刚写进一段新的掌握
store["chatprac-dialogue-goal"] = JSON.stringify({
  mark: Object.assign({}, goal().mark, { "s07-01:7": { s: "ok", d: todayKey() } })
});
dclick({ "data-dlgmark": "ok", "data-dlgkey": k0 === "s07-01:7" ? k1 : "s07-01:6" });
if (goal().mark["s07-01:7"] === undefined) {
  problems.push("用陈旧副本把别的页面刚记下的掌握冲掉了（s07-01:7 没了）");
}
console.log("  两个页面同时开着：点掌握前先读最新进度，新记录不会被冲掉 ✔");

/* ============================ 旧进度：多余字段 + 孤儿键 ============================ */
setDay(2026, 1, 3);
store["chatprac-dialogue-goal"] = JSON.stringify({
  mark: {
    [k0]: { s: "ok", d: todayKey(), note: "老版本可能多出来的字段" },
    "s99-99:5": { s: "ok", d: todayKey() },     // 场景已不存在（数据改过），不能算进任何计数
    "s00-00:0": { s: "practice", d: todayKey() }
  },
  version: 9,
  createdAt: "很久以前"
});
app = launch();
({ byId, dclick, vclick, dHtml, goal } = app);
if ((goal().mark[k0] || {}).s !== "ok") problems.push("旧进度里有效的掌握记录被丢了");
if (!goal().mark["s99-99:5"]) problems.push("旧进度里多余的键被删了（不该主动删用户数据）");
dclick({ "data-dlgpick": "1" });
if (goal().mark[k0].note !== "老版本可能多出来的字段") problems.push("掌握记录的额外字段被抹掉了");
if (dHtml().indexOf("今天掌握 <b>1</b>") < 0) {
  problems.push("孤儿键不该算进「今天掌握」，实际那行是：" +
    ((dHtml().match(/今天掌握 <b>\d+<\/b> \/ \d+/) || ["?"])[0]));
}
if (dHtml().indexOf("全部已掌握 <b>1</b>") < 0) {
  problems.push("孤儿键不该算进「全部已掌握」，实际：" +
    ((dHtml().match(/全部已掌握 <b>\d+<\/b>/) || ["?"])[0]));
}
if (byId.pbarAllVal.textContent !== pctText(1, SEGS.total)) {
  problems.push("有孤儿键时底部进度不对：" + byId.pbarAllVal.textContent);
}
console.log("  旧进度（带多余字段 + 孤儿键）：不崩、不删、不虚高，只数真实存在的段 ✔");

/* ============================ 损坏的进度：不能反手清掉 ============================ */
store["chatprac-dialogue-goal"] = "{坏掉的 JSON";
app = launch();
({ byId, dclick, vclick, dHtml, goal } = app);
if (store["chatprac-dialogue-goal"] !== "{坏掉的 JSON") {
  problems.push("读不出进度时不该把原文覆盖掉（现在被写成了：" + store["chatprac-dialogue-goal"] + "）");
}
if (store["chatprac-dialogue-goal.bak"] !== "{坏掉的 JSON") {
  problems.push("读不出进度时应先留一份保命副本 .bak");
}
console.log("  损坏的进度：只是当次当空，原文进了 .bak 保命副本 ✔");

/* ============================ 导入的词必须存盘 ============================ */
// 这是同一个「记忆」问题的另一面：导入的词之前根本没写进 localStorage，关掉就没了
store["chatprac-vocab-study"] = JSON.stringify({
  box: {}, due: {}, done: { agree: 1 }, mastered: {}, learnedAt: { agree: Date.now() },
  custom: [], chunks: null, day: todayKey(), newToday: 3, streak: 1, lastStudy: todayKey(), relearn: {}
});
app = launch();
({ byId, dclick, vclick, dHtml, goal } = app);
const ta = app.makeEl("textarea", { "data-vimport": "1" });
ta.value = NEWLINE + "\n" + NEWWORD + "x n 另一个测试用词";
app.fire(byId.vocabBoard, "input", { target: ta });
vclick({ "data-vadd": "1" });
const savedCustom = (JSON.parse(store["chatprac-vocab-study"] || "{}").custom || []).map((x) => x.w);
if (savedCustom.indexOf(NEWWORD) < 0) {
  problems.push("点「加入词库」后没存盘：关掉页面导入的词就没了（custom=" + JSON.stringify(savedCustom) + "）");
}
app = launch();
if ((JSON.parse(store["chatprac-vocab-study"]).custom || []).map((x) => x.w).indexOf(NEWWORD) < 0) {
  problems.push("重新打开后导入的词不见了");
}
console.log("  导入的词（" + NEWWORD + "）：点「加入词库」立刻存盘，关掉再打开还在 ✔");

console.log("");
if (problems.length) {
  console.log("发现问题 " + problems.length + " 处：");
  console.log(problems.map((s) => "  ✗ " + s).join("\n"));
  process.exit(1);
}
console.log("对话模块检查通过 ✅ （掌握记录关掉再打开还在，跨天只清当天计数、不清记忆）");
