/* 冒烟测试：用最小 DOM 桩在 Node 里真实执行 app.js 的初始化与主要交互链路
   运行：node tests/smoke.js */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const problems = [];
process.on("unhandledRejection", (e) => problems.push("未捕获的异步错误: " + (e && e.stack || e)));

/* ---------------- 最小 DOM 桩 ---------------- */
const listeners = new WeakMap();
let touchDevice = true;      // 默认模拟手机（触屏）：验证"不自动拉起键盘"
let standaloneMode = true;   // 默认模拟"已装到主屏幕"：验证 App 模式标记

function makeEl(tag, attrs) {
  const el = {
    tagName: (tag || "div").toUpperCase(),
    attrs: attrs || {},
    children: [],
    innerHTML: "",
    textContent: "",
    value: "",
    hidden: false,
    disabled: false,
    scrollTop: 0,
    scrollHeight: 100,
    style: {},
    className: "",
    classList: {
      _set: new Set(),
      add(c) { this._set.add(c); },
      remove(c) { this._set.delete(c); },
      contains(c) { return this._set.has(c); },
      toggle(c, on) { on ? this._set.add(c) : this._set.delete(c); }
    },
    getAttribute(n) { return n in this.attrs ? this.attrs[n] : null; },
    setAttribute(n, v) { this.attrs[n] = v; },
    addEventListener(type, fn) {
      const m = listeners.get(el) || {};
      (m[type] = m[type] || []).push(fn);
      listeners.set(el, m);
    },
    appendChild(child) { el.children.push(child); return child; },
    querySelector(sel) {
      return (el._q = el._q || {})[sel] || (el._q[sel] = makeEl("div"));
    },
    querySelectorAll(sel) { return documentStub.querySelectorAll(sel); },
    closest() { return null; },
    focus() { el.focusCount = (el.focusCount || 0) + 1; }
  };
  return el;
}

function fire(el, type, evt) {
  const m = listeners.get(el) || {};
  (m[type] || []).forEach((fn) => fn(Object.assign({ preventDefault() {}, isComposing: false }, evt)));
}

const navButtons = ["words", "sentences", "practice"].map((t) =>
  makeEl("button", { "data-tab": t }));
const sendBtn = makeEl("button");
const input = makeEl("textarea");
const chatLog = makeEl("div");

const byId = {};
["app", "sidebar", "backdrop", "menuBtn", "nav", "viewTitle", "themeToggle", "viewport",
 "view-words", "view-sentences", "view-practice", "wordList", "wordEmpty", "sentList",
 "sentEmpty", "chatLog", "input", "sendBtn", "composerHint"].forEach((id) => {
  byId[id] = makeEl("div");
});
Object.assign(byId, { input: input, sendBtn: sendBtn, chatLog: chatLog });

const docListeners = {};
const documentStub = {
  readyState: "complete",
  documentElement: makeEl("html"),
  querySelector(sel) {
    const id = sel.replace(/^#/, "");
    if (/^#/.test(sel) && byId[id]) return byId[id];
    return makeEl("div");
  },
  querySelectorAll(sel) { return sel === ".nav-item" ? navButtons : []; },
  createElement(tag) { return makeEl(tag); },
  addEventListener(type, fn) { (docListeners[type] = docListeners[type] || []).push(fn); }
};

globalThis.window = globalThis;
globalThis.document = documentStub;
globalThis.localStorage = { _d: {}, getItem(k) { return this._d[k] || null; }, setItem(k, v) { this._d[k] = v; } };
globalThis.matchMedia = (q) => {
  const s = String(q);
  if (s.includes("display-mode: standalone")) return { matches: standaloneMode };
  if (s.includes("hover")) return { matches: !touchDevice };
  return { matches: false };
};
globalThis.location = { hash: "" };
globalThis.history = {
  replaceState(_s, _t, url) { globalThis.location.hash = url; }
};

/* ---------------- 加载真实脚本 ---------------- */
["data.words.js", "data.sentences.js", "data.dialogues.js", "data.practice.js"].forEach((f) => {
  require(path.join(root, "assets/js", f));
});
vm.runInThisContext(fs.readFileSync(path.join(root, "assets/js/app.js"), "utf8"), { filename: "app.js" });

const DATA = globalThis.CHAT_PRAC_DATA;
console.log("  数据规模：单词 " + DATA.words.length + " 个、句子 " + DATA.sentences.length +
  " 条、对话 " + DATA.dialogues.length + " 组、场景 " + DATA.scenarios.length + " 个");

const count = (v) => (v.match(/<article class="card">/g) || []).length;

/* ---------------- 断言 ---------------- */
try {
  // 侧边栏抽屉：默认收起，三条横线拉出，点遮罩或 Esc 收起
  const menuOpen = () => byId.app.classList.contains("is-menu-open");
  if (menuOpen()) problems.push("侧边栏默认就是打开的，应该默认收起");
  fire(byId.menuBtn, "click");
  if (!menuOpen()) problems.push("点三条横线后侧边栏没有拉出");
  if (String(byId.menuBtn.attrs["aria-expanded"]) !== "true") problems.push("菜单按钮 aria-expanded 没有同步");
  console.log("  抽屉：默认收起 → 点横线拉出 ✔");

  fire(byId.backdrop, "click");
  if (menuOpen()) problems.push("点遮罩后侧边栏没有收起");

  // 手机上从左边往右滑，也能拉出抽屉
  (docListeners.touchstart || []).forEach((fn) => fn({ touches: [{ clientX: 8, clientY: 300 }] }));
  (docListeners.touchmove || []).forEach((fn) => fn({ touches: [{ clientX: 92, clientY: 306 }] }));
  if (!menuOpen()) problems.push("左边缘右滑没有拉出侧边栏");
  fire(byId.backdrop, "click");
  console.log("  抽屉：左边缘右滑也能拉出 ✔");

  // App 模式（装到主屏幕后应该给 html 加上 is-app 标记）
  if (!documentStub.documentElement.classList.contains("is-app")) {
    problems.push("独立窗口模式下没有加上 is-app 标记");
  }
  console.log("  App 模式标记 is-app：" + documentStub.documentElement.classList.contains("is-app"));

  fire(byId.menuBtn, "click");
  (docListeners.keydown || []).forEach((fn) => fn({ key: "Escape" }));
  if (menuOpen()) problems.push("按 Esc 后侧边栏没有收起");
  console.log("  抽屉：点遮罩 / 按 Esc 都能收起 ✔");

  // 未输入时右侧应完全留空
  if (count(byId.wordList.innerHTML) !== 0) problems.push("未输入时单词列表不为空");
  if (byId.wordEmpty.hidden !== true) problems.push("未输入时不应显示空状态");
  if (byId.sentList.innerHTML !== "") problems.push("未输入时句子列表不为空");
  console.log("  未输入时右侧留空 ✔");

  // 触屏设备（手机）不应该自动聚焦输入框——否则软键盘会被顶上来
  if (byId.input.focusCount) problems.push("手机（触屏）上不该自动聚焦输入框，实际聚焦了 " + byId.input.focusCount + " 次");
  console.log("  手机（触屏）不自动聚焦：聚焦次数 " + (byId.input.focusCount || 0));

  // 桌面（鼠标设备）应该自动聚焦，方便直接打字
  touchDevice = false;
  fire(navButtons[0], "click");
  if (!byId.input.focusCount) problems.push("桌面（鼠标设备）上应该自动聚焦输入框");
  console.log("  桌面（鼠标）自动聚焦：聚焦次数 " + (byId.input.focusCount || 0));
  touchDevice = true;

  // 检索：中文关键词（词库变大后可能命中多个，检查包含目标词即可）
  byId.input.value = "机会";
  fire(byId.input, "input");
  const zh = byId.wordList.innerHTML;
  if (count(zh) < 1 || zh.indexOf("opportunity") < 0) problems.push("中文检索「机会」未命中 opportunity");
  if (zh.indexOf("<mark>") < 0) problems.push("检索结果没有高亮");
  if (zh.indexOf("card-ex") >= 0) problems.push("单词卡仍有例句");
  if (zh.indexOf("tag") >= 0) problems.push("单词卡仍有标签");
  console.log("  中文检索「机会」→ " + count(zh) + " 条，命中 opportunity，高亮正常，无例句无标签");

  // 检索：英文单词
  byId.input.value = "abandon";
  fire(byId.input, "input");
  if (count(byId.wordList.innerHTML) < 1) problems.push("英文检索「abandon」无结果");
  console.log("  英文检索「abandon」→ " + count(byId.wordList.innerHTML) + " 条");

  // 检索：音标片段
  byId.input.value = "əˈbændən";
  fire(byId.input, "input");
  console.log("  音标检索「əˈbændən」→ " + count(byId.wordList.innerHTML) + " 条");

  // 检索：无结果时应显示空状态
  byId.input.value = "zzzz";
  fire(byId.input, "input");
  if (byId.wordEmpty.hidden !== false) problems.push("无结果时空状态未显示");
  if (count(byId.wordList.innerHTML) !== 0) problems.push("无结果时仍渲染了卡片");
  console.log("  无结果时空状态已显示，列表 " + count(byId.wordList.innerHTML) + " 条");

  // 切到句子板块：切过去也应先留空（先拉出抽屉，验证点导航后会自动收起）
  fire(byId.menuBtn, "click");
  fire(navButtons[1], "click");
  if (menuOpen()) problems.push("点导航切换板块后侧边栏没有自动收起");
  if (byId.viewTitle.textContent !== "句子和对话") problems.push("板块标题未跟随切换");
  if (count(byId.sentList.innerHTML) !== 0) problems.push("切到句子板块后未留空");
  console.log("  句子板块初始留空，且切板块后抽屉自动收起 ✔");

  // 中文关键词应能命中的对话（对话标题「酒店入住」）
  byId.input.value = "酒店入住";
  fire(byId.input, "input");
  const hotel = byId.sentList.innerHTML;
  if (count(hotel) < 1) problems.push("句子检索「酒店入住」无结果");
  if (hotel.indexOf("dlg-line") < 0) problems.push("对话没有按对话样式渲染");
  if (hotel.indexOf("card-title") < 0) problems.push("对话缺少标题");
  console.log("  检索「酒店入住」→ " + count(hotel) + " 组，按对话样式渲染");

  // 英文关键词应能命中句子正文
  byId.input.value = "passport";
  fire(byId.input, "input");
  const passport = byId.sentList.innerHTML;
  if (count(passport) < 1) problems.push("句子检索「passport」无结果");
  if (passport.indexOf("tag") >= 0) problems.push("句子卡仍有标签");
  console.log("  检索「passport」→ " + count(passport) + " 条，无标签");

  // 清空后回到留空状态
  byId.input.value = "";
  fire(byId.input, "input");
  if (count(byId.sentList.innerHTML) !== 0) problems.push("清空关键词后列表未清空");
  console.log("  清空关键词后回到留空状态 ✔");

  // 切到对话练习：同样应该是空白的，没有任何欢迎语或场景按钮
  const chatHtml = () => byId.chatLog.children.map((c) => c.innerHTML).join("");
  fire(navButtons[2], "click");
  if (byId.chatLog.children.length !== 0) problems.push("对话练习不该有预置内容，实际气泡数 " + byId.chatLog.children.length);
  if (chatHtml().indexOf("scene-chip") >= 0) problems.push("场景按钮应已移除");
  console.log("  对话练习初始留空，无欢迎语、无场景按钮 ✔");

  // 地址栏定位同步
  if (globalThis.location.hash !== "#practice") problems.push("切换板块后地址栏未同步，实际：" + globalThis.location.hash);
  console.log("  地址栏已同步为 " + globalThis.location.hash);

  // 发送一条消息，走完整的「用户消息 → 输入中 → 模拟回复」链路
  byId.input.value = "I'd like a latte, please.";
  fire(byId.input, "input");
  fire(sendBtn, "click");
  if (byId.chatLog.children.length !== 2) problems.push("发送后应是「我的气泡 + 输入中气泡」，实际 " + byId.chatLog.children.length);
  console.log("  发送后气泡数=" + byId.chatLog.children.length + "，输入框已清空=" + (byId.input.value === ""));

  setTimeout(() => {
    const lastBubble = byId.chatLog.children[byId.chatLog.children.length - 1].querySelector(".bubble").innerHTML;
    if (lastBubble.indexOf("typing") >= 0) problems.push("回复后仍停留在「输入中」状态");
    if (!/bubble-cn/.test(lastBubble)) problems.push("模拟回复未带中文提示");
    if (!/I see|Nice one|Good\./.test(lastBubble)) problems.push("模拟回复内容不符：" + lastBubble);
    console.log("  模拟回复已替换「输入中」占位，内容含中文提示");
    console.log("  气泡数=" + byId.chatLog.children.length + "，发送键恢复=" + !sendBtn.disabled);

    if (problems.length) {
      console.log("\n发现问题：\n" + problems.map((s) => "  ✗ " + s).join("\n"));
      process.exit(1);
    }
    console.log("\n交互链路全部通过 ✅");
  }, 1400);
} catch (e) {
  console.log("\n执行中抛出异常：\n" + e.stack);
  process.exit(1);
}
