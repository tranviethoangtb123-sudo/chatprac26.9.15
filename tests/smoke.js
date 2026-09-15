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
    // 只支持 [data-xxx] 这种属性选择器，够验证学习板块的事件委托
    closest(sel) {
      const m = /^\[([A-Za-z-]+)\]$/.exec(sel);
      if (m && m[1] in el.attrs) return el;
      return null;
    },
    focus() { el.focusCount = (el.focusCount || 0) + 1; }
  };
  return el;
}

function fire(el, type, evt) {
  const m = listeners.get(el) || {};
  (m[type] || []).forEach((fn) => fn(Object.assign({ preventDefault() {}, isComposing: false }, evt)));
}

// 导航按钮：带 data-tab 和 data-modes（和 index.html 保持一致）
const NAV_SPEC = [
  { tab: "words", modes: "search study" },
  { tab: "sentences", modes: "search" },
  { tab: "practice", modes: "search" },
  { tab: "dialogue", modes: "study" }
];
const navButtons = NAV_SPEC.map((s) => makeEl("button", { "data-tab": s.tab, "data-modes": s.modes }));
const navByTab = {};
navButtons.forEach((b) => { navByTab[b.attrs["data-tab"]] = b; });

const modeButtons = ["search", "study"].map((m) => makeEl("button", { "data-mode": m }));
const modeByKey = {};
modeButtons.forEach((b) => { modeByKey[b.attrs["data-mode"]] = b; });

const sendBtn = makeEl("button");
const input = makeEl("textarea");
const chatLog = makeEl("div");

const byId = {};
["app", "sidebar", "backdrop", "menuBtn", "nav", "modeSwitch", "viewTitle", "themeToggle", "viewport",
 "view-words", "view-sentences", "view-practice", "view-dialogue", "vocabBoard",
 "wordList", "wordEmpty", "sentList", "sentEmpty", "dialogueList", "dialogueEmpty", "chatLog",
 "input", "sendBtn", "composerHint"].forEach((id) => {
  byId[id] = makeEl("div");
});
Object.assign(byId, { input: input, sendBtn: sendBtn, chatLog: chatLog });
// 和 index.html 一样，这个元素初始带 hidden 属性
byId.vocabBoard.hidden = true;

const docListeners = {};
const documentStub = {
  readyState: "complete",
  documentElement: makeEl("html"),
  querySelector(sel) {
    const id = sel.replace(/^#/, "");
    if (/^#/.test(sel) && byId[id]) return byId[id];
    return makeEl("div");
  },
  querySelectorAll(sel) {
    if (sel === ".nav-item") return navButtons;
    if (sel === ".mode-btn") return modeButtons;
    return [];
  },
  createElement(tag) { return makeEl(tag); },
  addEventListener(type, fn) { (docListeners[type] = docListeners[type] || []).push(fn); }
};

// 预置一条「到期该复习」的记录（due=0），用来验证「待复习没清完就不给收新词」这条门禁
const now = new Date();
const todayStr = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

globalThis.window = globalThis;
globalThis.document = documentStub;
globalThis.localStorage = {
  _d: {
    "chatprac-vocab-study": JSON.stringify({
      box: { agree: 1 }, due: { agree: 0 }, done: { agree: 1 }, mastered: {},
      custom: [], chunks: [], day: todayStr, newToday: 0
    })
  },
  getItem(k) { return this._d[k] || null; },
  setItem(k, v) { this._d[k] = v; }
};
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
["data.words.js", "data.vocab.js", "data.collocations.js", "data.sentences.js", "data.dialogues.js", "data.practice.js"].forEach((f) => {
  require(path.join(root, "assets/js", f));
});
vm.runInThisContext(fs.readFileSync(path.join(root, "assets/js/app.js"), "utf8"), { filename: "app.js" });

const DATA = globalThis.CHAT_PRAC_DATA;
const VOCAB = globalThis.CHAT_PRAC_VOCAB;
console.log("  数据规模：检索词库 " + DATA.words.length + " 个、学习词库 " + VOCAB.words.length +
  " 个（语块 " + VOCAB.chunks.length + " 条）、句子 " + DATA.sentences.length +
  " 条、对话 " + DATA.dialogues.length + " 组");

const count = (v) => (v.match(/<article class="card">/g) || []).length;
const visibleTabs = () => navButtons.filter((b) => !b.hidden).map((b) => b.attrs["data-tab"]);
const readVocabState = () => JSON.parse(globalThis.localStorage.getItem("chatprac-vocab-study"));
// 学习板块整块用事件委托，测试里就照着 data-* 造一个目标元素丢进去
const vclick = (attrs) => fire(byId.vocabBoard, "click", { target: makeEl("button", attrs) });

/* ---------------- 断言 ---------------- */
try {
  // ============ 模式：查询 / 学习 ============
  if (visibleTabs().join(",") !== "words,sentences,practice") {
    problems.push("查询模式下的导航不对：" + visibleTabs().join(","));
  }
  console.log("  查询模式导航：" + visibleTabs().join("、"));

  // 学习模式：只剩 单词 / 对话
  fire(modeByKey.study, "click");
  if (visibleTabs().join(",") !== "words,dialogue") {
    problems.push("学习模式下的导航不对：" + visibleTabs().join(","));
  }
  if (!modeByKey.study.classList.contains("is-active")) problems.push("模式按钮没有高亮同步");
  if (globalThis.localStorage.getItem("chatprac-mode") !== "study") problems.push("模式没有存进 localStorage");
  console.log("  学习模式导航：" + visibleTabs().join("、") + "（已记住选择）");

  // ============ 学习模式·单词：三个板块（今日新词 / 已学习 / 全部单词）+ 每行三键 ============
  if (byId.vocabBoard.hidden) problems.push("学习模式应该显示 vocabBoard");
  if (byId.wordList.innerHTML !== "") problems.push("学习模式不该渲染查询用的单词列表");

  const vHome = byId.vocabBoard.innerHTML;
  ["今日新词", "已学习", "全部单词"].forEach((t) => {
    if (vHome.indexOf(t) < 0) problems.push("学习模式缺少板块：" + t);
  });
  ["收词台", "待复习", "已掌握", "听写轨", "语块库"].forEach((t) => {
    if (vHome.indexOf(t) >= 0) problems.push("不该再有这个板块：" + t);
  });
  if (vHome.indexOf("vtabs") < 0) problems.push("缺少板块切换条");
  console.log("  学习模式·单词：今日新词 / 已学习 / 全部单词 三个板块 ✔");

  // 每行格式：第一行 英文 + 音标 + 中文，第二行三个键
  const firstRow = (byId.vocabBoard.innerHTML.match(/<div class="vrow">[\s\S]*?<\/div><\/div>/) || [""])[0];
  ["vrow-main", "vrow-w", "vrow-p", "vrow-c", "vrow-keys"].forEach((c) => {
    if (firstRow.indexOf(c) < 0) problems.push("单词行缺少 " + c);
  });
  ["know", "fuzzy", "no"].forEach((k) => {
    if (firstRow.indexOf('data-vans="' + k + '"') < 0) problems.push("单词行缺少按键：" + k);
  });
  if (!/class="vrow-w"[^>]*>[a-z][a-z']*</.test(firstRow)) problems.push("第一行没先写英文单词");
  if (!/vrow-p">\//.test(firstRow)) problems.push("第一行缺少音标");
  if (!/vrow-c">[\u4e00-\u9fa5]/.test(firstRow)) problems.push("第一行缺少中文");
  console.log("  单词行：第一行 英文+音标+中文，第二行三键 ✔");

  // 今日新词里应有一批词（每天上限 50）
  const todayRows = (byId.vocabBoard.innerHTML.match(/data-vans="know"/g) || []).length;
  const reviewRows = (byId.vocabBoard.innerHTML.match(/class="vrow-tag">复习</g) || []).length;
  const todayWords = todayRows - reviewRows;
  if (todayWords < 1) problems.push("今日新词是空的");
  if (todayWords > 50) problems.push("今日新词超过每日上限 50，实际 " + todayWords);
  console.log("  今日新词：" + todayWords + " 个新词 + " + reviewRows + " 个到期复习（新词上限 50）✔");

  // 抽第一条词，答「认识」→ 进已学习，记忆盒推进
  const firstWord = (byId.vocabBoard.innerHTML.match(/data-vword="([a-z'-]+)"/) || [])[1];
  if (!firstWord) problems.push("取不到第一条词");
  const boxBefore = readVocabState().box[firstWord] || 0;
  vclick({ "data-vans": "know", "data-vword": firstWord });
  const st1 = readVocabState();
  if (st1.done[firstWord] !== 1) problems.push("答「认识」后应记入 done：" + firstWord);
  if (st1.box[firstWord] !== boxBefore + 1) problems.push("答「认识」后记忆盒应 +1，实际 " + st1.box[firstWord]);
  if (!st1.due[firstWord] || st1.due[firstWord] <= Date.now()) problems.push("答「认识」后没有排下次复习时间");
  if (!st1.learnedAt[firstWord]) problems.push("答「认识」后应记录学习时间（已学习按它倒序）");
  console.log("  答「认识」：" + firstWord + " 进已学习，记忆盒 " + boxBefore + "→" + st1.box[firstWord] + " ✔");

  // 已学习板块：应能查到这个词
  vclick({ "data-vtab": "learned" });
  if (byId.vocabBoard.innerHTML.indexOf(firstWord) < 0) problems.push("已学习里没有刚学的词：" + firstWord);
  console.log("  已学习：" + (byId.vocabBoard.innerHTML.match(/data-vans="know"/g) || []).length + " 个 ✔");

  // 答「不认识」→ 记忆盒归零
  vclick({ "data-vans": "no", "data-vword": firstWord });
  const st2 = readVocabState();
  if (st2.box[firstWord] !== 0) problems.push("答「不认识」后记忆盒应归零，实际 " + st2.box[firstWord]);
  console.log("  答「不认识」：记忆盒归零，10 分钟后再来 ✔");

  // 全部单词：A-Z 排序，数量 = 词库总数
  vclick({ "data-vtab": "all" });
  const allHtml = byId.vocabBoard.innerHTML;
  const allCount = (allHtml.match(/data-vans="know"/g) || []).length;
  if (allCount !== VOCAB.words.length + st2.custom.length) {
    problems.push("全部单词数量不对：期望 " + (VOCAB.words.length + st2.custom.length) + "，实际 " + allCount);
  }
  const allWords = (allHtml.match(/class="vrow-w"[^>]*>([a-z'-]+)</g) || []).map((s) => (s.match(/>([a-z'-]+)</) || [])[1]);
  const sorted = allWords.slice().sort();
  if (allWords.join(",") !== sorted.join(",")) problems.push("全部单词没有按 A-Z 排序");
  console.log("  全部单词：" + allCount + " 个，按 A-Z 排序 ✔");

  // 学习模式下的对话板块：仍然留空（内容待定）
  fire(navByTab.dialogue, "click");
  if (byId.viewTitle.textContent !== "对话") problems.push("学习模式·对话标题不对：" + byId.viewTitle.textContent);
  if (byId.dialogueList.innerHTML !== "") problems.push("学习模式·对话应该先留空");
  console.log("  学习模式·对话：当前留空（待定）✔");

  // 切回查询模式：导航恢复三个板块，学习板块整体收起
  fire(modeByKey.search, "click");
  if (visibleTabs().join(",") !== "words,sentences,practice") problems.push("切回查询模式后导航不对");
  if (byId.vocabBoard.hidden !== true) problems.push("查询模式不该显示学习板块");
  if (count(byId.wordList.innerHTML) !== 0) problems.push("查询模式未输入时应留空");
  console.log("  切回查询模式：导航恢复、学习板块收起、单词留空 ✔");

  // 深链到不属于当前模式的板块时，应该自动切模式
  fire(modeByKey.study, "click");
  fire(navByTab.practice, "click");
  if (visibleTabs().join(",") !== "words,sentences,practice") problems.push("从深链进对话练习时应自动切回查询模式");
  console.log("  切到「对话练习」时自动回到查询模式 ✔");
  fire(navByTab.words, "click");
  fire(modeByKey.search, "click");

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
