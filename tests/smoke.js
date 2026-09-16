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
["data.words.js", "data.vocab.js", "data.collocations.js", "data.sentences.js", "data.dialogues.js", "data.practice.js", "data.scenarios.js"].forEach((f) => {
  require(path.join(root, "assets/js", f));
});
vm.runInThisContext(fs.readFileSync(path.join(root, "assets/js/app.js"), "utf8"), { filename: "app.js" });

const DATA = globalThis.CHAT_PRAC_DATA;
const VOCAB = globalThis.CHAT_PRAC_VOCAB;
const SC = globalThis.CHAT_PRAC_SCENARIOS;
console.log("  数据规模：检索词库 " + DATA.words.length + " 个、学习词库 " + VOCAB.words.length +
  " 个（语块 " + VOCAB.chunks.length + " 条）、句子 " + DATA.sentences.length +
  " 条、对话 " + DATA.dialogues.length + " 组、场景对话 " + SC.scenarios.length + " 个场景");

const count = (v) => (v.match(/<article class="card">/g) || []).length;
const visibleTabs = () => navButtons.filter((b) => !b.hidden).map((b) => b.attrs["data-tab"]);
const readVocabState = () => JSON.parse(globalThis.localStorage.getItem("chatprac-vocab-study"));
// 学习板块整块用事件委托，测试里就照着 data-* 造一个目标元素丢进去
const vclick = (attrs) => fire(byId.vocabBoard, "click", { target: makeEl("button", attrs) });
const dclick = (attrs) => fire(byId.dialogueList, "click", { target: makeEl("button", attrs) });

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

  // 每行格式：左边两行文字（英语+音标 / 词性+中文），右边按键列，按键整列垂直居中
  const rows = byId.vocabBoard.innerHTML.split('<div class="vrow">');
  const firstRow = rows[1] || "";
  ["vtext", "vline", "vw", "vp", "vkeys", "vdesc"].forEach((c) => {
    if (firstRow.indexOf('class="' + c + '"') < 0) problems.push("单词行缺少 " + c);
  });
  ["know", "no"].forEach((k) => {
    if (firstRow.indexOf('data-vans="' + k + '"') < 0) problems.push("单词行缺少按键：" + k);
  });
  if (byId.vocabBoard.innerHTML.indexOf('data-vans="fuzzy"') >= 0) {
    problems.push("已经去掉「模糊」键了，不该再出现");
  }
  if (!/class="vw"[^>]*>[a-z][a-z']*</.test(firstRow)) problems.push("左边第一行没先写英文单词");
  if (!/class="vp">\//.test(firstRow)) problems.push("左边第一行缺少音标");
  if (!/class="vdesc">[^<]{2,}</.test(firstRow)) problems.push("左边第二行缺少词性+中文释义");
  console.log("  单词行：左列 英语+音标 / 词性+中文，右列 认识+不认识 ✔");

  // 今日新词：新词每天上限 50，到期的复习词会额外排在最前面
  const todayRows = (byId.vocabBoard.innerHTML.match(/data-vans="know"/g) || []).length;
  if (todayRows < 1) problems.push("今日新词是空的");
  if (todayRows > 52) problems.push("今日新词过多（新词上限 50 + 少量到期复习），实际 " + todayRows);
  console.log("  今日新词：" + todayRows + " 行（新词上限 50，含到期复习）✔");

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

  // 全部单词：一行式；先单词（A-Z），再固定搭配（A-Z）放在最后
  vclick({ "data-vtab": "all" });
  const allHtml = byId.vocabBoard.innerHTML;
  const flatCount = (allHtml.match(/class="vflat"/g) || []).length;
  if (allHtml.indexOf('data-vans="know"') >= 0) problems.push("全部单词不该有按键（一行式）");
  if (!/class="vw"[^>]*>[a-z][a-z' -]*</.test(allHtml)) problems.push("全部单词的第一列不是英语");
  if (!/class="vp">\//.test(allHtml)) problems.push("全部单词缺少音标列");
  if (!/class="vdesc-inline">/.test(allHtml)) problems.push("全部单词缺少词性+中文列");

  const collocTotal = Object.keys(DATA.collocations || {}).reduce((n, k) => n + DATA.collocations[k].length, 0);
  if (flatCount < VOCAB.words.length + collocTotal * 0.9) {
    problems.push("全部单词偏少：含固定搭配应约 " + (VOCAB.words.length + collocTotal) + " 条，实际 " + flatCount);
  }
  if (allHtml.indexOf("in charge of") < 0) problems.push("全部单词里没有词典的固定搭配（in charge of）");

  // 单词和搭配用「有没有空格」区分（单词是单个词，固定搭配是多词短语）
  const allEn = (allHtml.match(/class="vw"[^>]*>([a-z' -]+)</g) || []).map((s) => (s.match(/>([a-z' -]+)</) || [])[1]);
  const wordPart = allEn.filter((x) => x.indexOf(" ") < 0);
  const phrasePart = allEn.filter((x) => x.indexOf(" ") >= 0);
  if (wordPart.length < 4000) problems.push("全部单词里的单词部分偏少，实际 " + wordPart.length);
  if (phrasePart.length < 3000) problems.push("全部单词里的固定搭配偏少，实际 " + phrasePart.length);
  if (wordPart.join("|") !== wordPart.slice().sort().join("|")) problems.push("全部单词里，单词部分没有按 A-Z 排序");
  if (phrasePart.join("|") !== phrasePart.slice().sort().join("|")) problems.push("全部单词里，固定搭配部分没有按 A-Z 排序");
  // 单词必须全部排在搭配前面
  const firstPhraseAt = allEn.findIndex((x) => x.indexOf(" ") >= 0);
  if (firstPhraseAt >= 0 && firstPhraseAt !== wordPart.length) problems.push("固定搭配没有全部排在单词后面");
  if (allEn.indexOf("in charge of") < 0) problems.push("全部单词里没有词典的固定搭配（in charge of）");
  console.log("  全部单词：" + wordPart.length + " 个单词 + " + phrasePart.length + " 条固定搭配（各自 A-Z，搭配在后）✔");

  // ============ 学习模式·对话：两级选择器（域 + 变体）+ 美/英双朗读 ============
  fire(navByTab.dialogue, "click");
  if (byId.viewTitle.textContent !== "对话") problems.push("学习模式·对话标题不对：" + byId.viewTitle.textContent);

  const dHtml = () => byId.dialogueList.innerHTML;
  // 进板块：只有「选择场景」，没有统计条、没有正文
  if (dHtml().indexOf("dlgstat") >= 0) problems.push("对话板块不该再有顶部说明条 dlgstat");
  if (dHtml().indexOf("选择场景") < 0) problems.push("对话板块缺少场景选择器");
  if (dHtml().indexOf("dlgline") >= 0) problems.push("还没选场景时不该出现对话正文");
  console.log("  进板块：只有「选择场景」，没统计条、没正文 ✔");

  // 展开选择器：一级标题（域）默认收起，一次只展开一个
  dclick({ "data-dlgpick": "1" });
  const openHtml = dHtml();
  const segTotal = SC.scenarios.reduce((n, s) => n + s.dialogues.length, 0);
  const withContent = new Set(SC.scenarios.map((s) => s.domain));
  const headCount = (openHtml.match(/class="dlgdomlabel/g) || []).length;
  if (headCount !== withContent.size) {
    problems.push("一级标题数应为 " + withContent.size + "，实际 " + headCount);
  }
  if ((openHtml.match(/class="dlgpick-item/g) || []).length !== 0) {
    problems.push("一级标题默认应该收起，不该直接铺开全部选项");
  }
  SC.domains.forEach((dom) => {
    const has = withContent.has(dom.id);
    if (has && openHtml.indexOf(dom.name) < 0) problems.push("缺了域：" + dom.name);
    if (!has && openHtml.indexOf(dom.name) >= 0) problems.push("还没收录内容的域不该出现：" + dom.name);
  });
  console.log("  展开选择器：默认只看到 " + headCount + " 个域标题（收起状态）✔");

  // 逐个点开域标题：一次只展开一个（手风琴），选项文字 = 场景名 · 变体
  const pickLabels = [];
  const allVariants = SC.scenarios.reduce((a, s) => a.concat(s.dialogues.map((d) => d.variant)), []);
  let expandedHtml = openHtml;
  let lastOpened = "";
  SC.domains.filter((dom) => withContent.has(dom.id)).forEach((dom) => {
    dclick({ "data-dlgdom": dom.id });
    lastOpened = dom.id;
    const one = dHtml();
    expandedHtml += one;
    const mine = one.match(/data-dlgseg="[^"]*">([^<]*)</g) || [];
    if (mine.length !== 8 * SC.scenarios.filter((s) => s.domain === dom.id).length) {
      problems.push("点开「" + dom.name + "」后的选项数不对：" + mine.length);
    }
    if ((one.match(/class="dlgdomlabel is-open"/g) || []).length !== 1) {
      problems.push("「" + dom.name + "」展开时应该只有一个域是展开的（手风琴）");
    }
    [].push.apply(pickLabels, mine.map((s) => s.replace(/^.*">/, "").replace(/<$/, "")));
  });
  if (pickLabels.length !== segTotal) problems.push("逐域展开后应有 " + segTotal + " 个选项，实际 " + pickLabels.length);
  if (new Set(pickLabels).size !== pickLabels.length) {
    problems.push("选项文字有重复，说明没带上场景名（" + pickLabels.length + " 项里只有 " + new Set(pickLabels).size + " 个不同）");
  }
  // 雅思标签、关系/语域/渠道/障碍/结果 这些说明都不上屏
  SC.scenarios.forEach((s) => {
    if (s.ielts && expandedHtml.indexOf(s.ielts) >= 0) problems.push("选择器里不该出现雅思标签：" + s.ielts);
    s.dialogues.forEach((d) => {
      ["relation", "register", "channel", "barrier", "result"].forEach((k) => {
        const v = d[k];
        if (!v || v.length < 3) return;                                 // 太短，可能是常用词
        if (allVariants.some((x) => x.indexOf(v) >= 0)) return;          // 本来就写在某个变体名里（如「渠道变体（视频会议）」）
        if (expandedHtml.indexOf(v) >= 0) problems.push("不该显示元数据说明（" + k + "）：" + v);
      });
    });
  });
  console.log("  逐域展开：" + pickLabels.length + " 个选项文字全部唯一（场景 · 变体）✔");
  // 再点一次同一个域标题 → 收起
  dclick({ "data-dlgdom": lastOpened });
  if ((dHtml().match(/class="dlgpick-item/g) || []).length !== 0) problems.push("再点一次域标题应该收起");
  console.log("  再点一次一级标题：收起 ✔");

  // 选中一段 → 收起选择器，直接呈现对话（朗读按钮已去掉）
  const scn0 = SC.scenarios[0];
  const d0 = scn0.dialogues[0];
  dclick({ "data-dlgseg": scn0.id + ":0" });
  const selHtml = dHtml();
  ["dlgline", "dlgen", "dlgcn"].forEach((c) => {
    if (selHtml.indexOf(c) < 0) problems.push("选中后缺少 " + c);
  });
  if (selHtml.indexOf("dlgsay") >= 0 || selHtml.indexOf("dlgspeak") >= 0) {
    problems.push("朗读按钮应该已经全部去掉");
  }
  if (selHtml.indexOf(d0.lines[0].en) < 0) problems.push("选中的对话正文没出现");
  if (selHtml.indexOf("dlgpick-list") >= 0) problems.push("选完应收起选项列表");
  if (selHtml.indexOf("dlgwho") >= 0) problems.push("不该再显示说话人姓名");
  if (selHtml.indexOf("整条朗读") >= 0) problems.push("不该再有「整条朗读」");
  if (selHtml.indexOf(scn0.title + " · " + d0.variant) < 0) problems.push("选择器没显示「场景 · 变体」");
  if (pickLabels.length !== segTotal) problems.push("选项总数不对：" + pickLabels.length);
  console.log("  选中一段：" + d0.lines.length + " 句，无姓名/无标签/无朗读按钮 ✔");

  // 再点一次同一个二级标题 → 取消选中，对话收起
  dclick({ "data-dlgpick": "1" });                      // 重新打开下拉（会自动展开当前选中的域）
  if (dHtml().indexOf("dlgpick-row is-active") < 0) problems.push("选中的那行应该有选中样式");
  if (dHtml().indexOf('class="dlgdomlabel is-open is-active"') < 0) {
    problems.push("含当前选中的一级标题应该有选中样式");
  }
  dclick({ "data-dlgseg": scn0.id + ":0" });            // 再点一次 = 取消
  const afterCancel = dHtml();
  if (afterCancel.indexOf("dlgline") >= 0) problems.push("取消选中后对话应该收起");
  if (afterCancel.indexOf("dlgpick-row is-active") >= 0) problems.push("取消选中后不该还有选中行");
  if (afterCancel.indexOf("dlgpick-list") < 0) problems.push("取消选中后下拉应该还开着，方便再选");
  console.log("  再点一次二级标题：取消选中、对话收起、下拉还在 ✔");

  // 掌握 / 练习 就在下拉框的每一行右边（不再有单独的目标完成框）
  const rowCount = (afterCancel.match(/class="dlgpick-row/g) || []).length;
  const markCount = (afterCancel.match(/class="dlgmark /g) || []).length;
  if (markCount !== rowCount * 2) {
    problems.push("每行应有 掌握 + 练习 两个键：" + markCount + " / " + rowCount);
  }
  if (afterCancel.indexOf("dlggoal") >= 0) problems.push("不该再有独立的目标完成框");
  if (afterCancel.indexOf("今天掌握") < 0) problems.push("下拉框里应有今日进度一行");
  const goalState = () => JSON.parse(globalThis.localStorage.getItem("chatprac-dialogue-goal") || '{"mark":{}}');
  const k0 = scn0.id + ":0", k1 = scn0.id + ":1";
  dclick({ "data-dlgmark": "ok", "data-dlgkey": k0 });
  if ((goalState().mark[k0] || {}).s !== "ok") problems.push("点「掌握」没有记下来");
  if (dHtml().indexOf("今天掌握 <b>1</b>") < 0) problems.push("今天掌握数没有加到 1");
  if (dHtml().indexOf("dlgline") >= 0) problems.push("点掌握不该把对话选出来");
  dclick({ "data-dlgmark": "practice", "data-dlgkey": k1 });
  if ((goalState().mark[k1] || {}).s !== "practice") problems.push("点「练习」没有记下来");
  dclick({ "data-dlgmark": "ok", "data-dlgkey": k0 });
  if (goalState().mark[k0]) problems.push("再点一次「掌握」应该取消");
  console.log("  掌握 / 练习：就在下拉框每一行右边，点了记进 localStorage ✔");

  // 搜索：命中对话正文（wallet 在低正式语域那段里）→ 自动展开并呈现
  byId.input.value = "wallet";
  fire(byId.input, "input");
  const hitHtml = dHtml();
  if (hitHtml.indexOf("wallet") < 0) problems.push("搜索 wallet 没有命中对话正文");
  if (hitHtml.indexOf("dlgline") < 0) problems.push("搜索命中后应自动呈现对话");
  if (hitHtml.indexOf("dlgpick-list") < 0) problems.push("搜索时应自动展开选项");
  if (hitHtml.indexOf("学术学习") >= 0) problems.push("搜索时不该显示没命中的域");
  console.log("  搜索「wallet」：自动展开并呈现命中对话 ✔");

  // 搜索：命中变体名（「折中」）
  byId.input.value = "折中";
  fire(byId.input, "input");
  if (dHtml().indexOf("dlgline") < 0) problems.push("搜索变体名命中后应呈现对话");
  // 无结果 → 空状态
  byId.input.value = "zzzz";
  fire(byId.input, "input");
  if (byId.dialogueEmpty.hidden !== false) problems.push("搜索无结果时应出现空状态");
  if (dHtml().indexOf("dlgpick-none") < 0) problems.push("搜索无结果时选择器要有空提示");
  // 清空搜索：保留上次选中的那段
  byId.input.value = "";
  fire(byId.input, "input");
  if (dHtml().indexOf("dlgline") < 0) problems.push("清空搜索后应保留上次选中的对话");
  console.log("  搜索变体名 / 无结果空状态 / 清空后保留选中 ✔");

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
