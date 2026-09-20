/* ==========================================================================
   Chat Prac — 交互逻辑
   板块：单词 / 句子和对话 / 对话练习（查询）· 单词 / 对话（学习）
   底部统一为「对话框 + 发送键」：在检索板块它是搜索框，在对话练习里它是聊天输入框。
   学习模式的「单词」板块是一套独立的三键循环学习系统，见下方「板块一」。
   ========================================================================== */

(function () {
  "use strict";

  var DATA = window.CHAT_PRAC_DATA;

  /* ---------------------------------------------------------------------
     DeepSeek 接口配置（界面完成后，把 enabled 改为 true 并填好 apiKey 即可接入）
     注意：密钥放在前端会暴露给用户，正式上线请走自己的后端代理转发。
     --------------------------------------------------------------------- */
  var API = {
    enabled: false,
    endpoint: "https://api.deepseek.com/chat/completions",
    apiKey: "",
    model: "deepseek-chat",
    systemPrompt:
      "You are a friendly English speaking partner for a Chinese learner. " +
      "Reply in natural, everyday English at an intermediate level (1-3 short sentences). " +
      "Always end with a follow-up question to keep the conversation going. " +
      "Do not add Chinese translation; the app handles that separately."
  };

  /* ------------------------------ 状态 ------------------------------ */
  var state = {
    mode: "search",           // search=查询模式 / study=学习模式
    tab: "words",
    wordQuery: "",
    sentQuery: "",
    talkQuery: "",
    drafts: { words: "", sentences: "", practice: "", dialogue: "" },
    chat: [],
    replyIndex: {},
    busy: false
  };

  var TAB_TITLES = {
    words: "单词",
    sentences: "句子和对话",
    practice: "对话练习",
    dialogue: "对话"
  };

  // 每种模式显示哪些板块
  function tabsForMode(mode) {
    return mode === "study" ? ["words", "dialogue"] : ["words", "sentences", "practice"];
  }

  // 底部输入框的提示（按当前模式 + 板块）
  function composerConfig() {
    if (state.tab === "sentences") {
      return { ph: "搜索句子或对话：酒店、airport、面试…", hint: "Enter 搜索 · Shift + Enter 换行" };
    }
    if (state.tab === "practice") {
      return { ph: "用英文说点什么，Enter 发送…", hint: "Enter 发送 · Shift + Enter 换行" };
    }
    if (state.tab === "dialogue") {
      return {
        ph: "也可以直接搜对话：点餐、面试、道歉…",
        hint: "Enter 搜索 · 或点上方「选择场景」按域挑"
      };
    }
    // 学习模式底部是进度条，没有输入框（composerConfig 只在查询模式用得上）
    return { ph: "搜索单词：abandon、机会、/əˈbændən/…", hint: "Enter 搜索 · Shift + Enter 换行" };
  }

  /* ------------------------------ DOM ------------------------------ */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var els = {
    app: $("#app"),
    sidebar: $("#sidebar"),
    backdrop: $("#backdrop"),
    menuBtn: $("#menuBtn"),
    nav: $("#nav"),
    modeSwitch: $("#modeSwitch"),
    viewTitle: $("#viewTitle"),
    themeToggle: $("#themeToggle"),
    viewport: $("#viewport"),
    views: {
      words: $("#view-words"),
      sentences: $("#view-sentences"),
      practice: $("#view-practice"),
      dialogue: $("#view-dialogue")
    },
    vocabBoard: $("#vocabBoard"),
    wordList: $("#wordList"),
    wordEmpty: $("#wordEmpty"),
    sentList: $("#sentList"),
    sentEmpty: $("#sentEmpty"),
    dialogueList: $("#dialogueList"),
    dialogueEmpty: $("#dialogueEmpty"),
    chatLog: $("#chatLog"),
    input: $("#input"),
    sendBtn: $("#sendBtn"),
    composerHint: $("#composerHint"),
    composer: $("#composer"),
    studyProgress: $("#studyProgress"),
    pbarAll: $("#pbarAll"),
    pbarAllVal: $("#pbarAllVal"),
    pbarDom: $("#pbarDom"),
    pbarDomVal: $("#pbarDomVal"),
    pbarDomName: $("#pbarDomName"),
    syncToggle: $("#syncToggle"),
    syncState: $("#syncState"),
    syncBody: $("#syncBody"),
    syncToken: $("#syncToken"),
    syncUp: $("#syncUp"),
    syncDown: $("#syncDown"),
    syncAuto: $("#syncAuto"),
    syncMsg: $("#syncMsg"),
    syncText: $("#syncText"),
    syncExport: $("#syncExport"),
    syncImport: $("#syncImport"),
    syncFile: $("#syncFile")
  };

  /* ------------------------------ 工具 ------------------------------ */
  function esc(str) {
    return String(str).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function highlight(text, query) {
    if (!query) return esc(text);
    var lower = String(text).toLowerCase();
    var q = query.toLowerCase();
    var idx = lower.indexOf(q);
    if (idx < 0) return esc(text);
    return esc(text.slice(0, idx)) +
      "<mark>" + esc(text.slice(idx, idx + q.length)) + "</mark>" +
      esc(text.slice(idx + q.length));
  }

  function matches(query, fields) {
    if (!query) return true;
    var q = query.toLowerCase();
    return fields.some(function (f) {
      return String(f || "").toLowerCase().indexOf(q) >= 0;
    });
  }

  function autoGrow() {
    var el = els.input;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 168) + "px";
  }

  function scrollToBottom() {
    els.viewport.scrollTop = els.viewport.scrollHeight;
  }

  /* ------------------------------ 主题 ------------------------------ */
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("chatprac-theme"); } catch (e) {}
    var theme = saved || (window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  }

  function toggleTheme() {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("chatprac-theme", next); } catch (e) {}
  }

  /* --------------------------- 侧边栏抽屉 --------------------------- */
  function setMenu(open) {
    els.app.classList.toggle("is-menu-open", open);
    els.menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function toggleMenu() {
    setMenu(!els.app.classList.contains("is-menu-open"));
  }

  function closeMenu() {
    setMenu(false);
  }

  /* --------------------- App 模式：装到主屏幕后的一些适配 --------------------- */
  // 判断是不是"独立窗口"运行（PWA 安装后、iOS 主屏幕图标打开）
  function isStandalone() {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function" &&
        window.matchMedia("(display-mode: standalone)").matches) {
      return true;
    }
    return typeof navigator !== "undefined" && navigator.standalone === true; // iOS Safari
  }

  function initStandalone() {
    if (isStandalone()) document.documentElement.classList.add("is-app");
  }

  // 从屏幕左边缘往右滑 → 拉出侧边栏（手机上的 App 手感）
  function bindEdgeSwipe() {
    var tracking = false;
    var startX = 0;
    var startY = 0;

    document.addEventListener("touchstart", function (e) {
      var t = e.touches && e.touches[0];
      if (!t || t.clientX > 28) return;
      if (els.app.classList.contains("is-menu-open")) return;
      tracking = true;
      startX = t.clientX;
      startY = t.clientY;
    }, { passive: true });

    document.addEventListener("touchmove", function (e) {
      if (!tracking) return;
      var t = e.touches && e.touches[0];
      if (!t) return;
      var dx = t.clientX - startX;
      var dy = Math.abs(t.clientY - startY);
      if (dx > 48 && dy < 40) {   // 主要往右滑，避免和上下滚动抢手势
        tracking = false;
        setMenu(true);
      }
    }, { passive: true });

    document.addEventListener("touchend", function () { tracking = false; }, { passive: true });
    document.addEventListener("touchcancel", function () { tracking = false; }, { passive: true });
  }

  /* ============================== 板块一：单词 ============================== */
  // 查询模式：没输入时留空，输入后全库检索（4198 词，data.words.js）
  // 学习模式：6 板块 + 三键循环（data.vocab.js），和检索用的词库完全分开

  // 查询模式用的单词卡（简洁：单词 / 音标 / 词性 / 中文）
  function wordCardHtml(it, q) {
    return '' +
      '<article class="card">' +
        '<div class="card-top">' +
          '<h3 class="card-word">' + highlight(it.w, q) + '</h3>' +
          '<span class="card-phon">' + highlight(it.ph, q) + '</span>' +
          (it.pos ? '<span class="card-pos">' + esc(it.pos) + '</span>' : '') +
        '</div>' +
        '<p class="card-cn">' + highlight(it.cn, q) + '</p>' +
      '</article>';
  }

  /* ---------------------------------------------------------------------
     学习模式 · 单词板块：6 板块 + 三键循环
     ---------------------------------------------------------------------
     板块：收词台 / 今日新词 / 待复习 / 已掌握 / 听写轨 / 语块库
     三键：认识（推进记忆盒）· 模糊（明天再来）· 不认识（10 分钟后重来）
     记忆盒 0~5，推到 5 之后标为「已掌握」，不再出现在队列里。
     归档按场景域（domain），出卡按打散队列：每天新词跨域混排，
     同一场景不相邻——同一语义场集中初学会互相抑制提取。
     --------------------------------------------------------------------- */

  var V = window.CHAT_PRAC_VOCAB || { words: [], domains: {}, tracks: {}, chunks: [] };
  var VKEY = "chatprac-vocab-study";
  var VDAY = 86400000;
  var VNEW_PER_DAY = 50;          // 每天新词上限：再高复习队列会崩
  var VBOX_MAX = 5;               // 记忆盒满格
  var VFLOOR = 10 * 60 * 1000;    // 「不认识」的冷却时间
  // 记忆盒 0~5 对应的下次出现间隔
  var VINT = [VFLOOR, VDAY, 3 * VDAY, 7 * VDAY, 14 * VDAY, 30 * VDAY];

  var vocab = null;

  // 读取进度（键都用单词本身，导入时已去重）
  function vBlank() {
    return {
      box: {}, due: {}, done: {}, mastered: {}, learnedAt: {},
      custom: [], chunks: null, day: "", newToday: 0,
      streak: 0, lastStudy: ""            // 连续学习天数 / 最后一次学习是哪天
    };
  }

  function vDateKey(ts) {
    var d = new Date(ts);
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  function vToday() {
    return vDateKey(Date.now());
  }

  // 跨天检查：每天重新发一份新词任务（不是一次性的），并维护连续天数。
  // 页面加载时查一次不够——装成 App 后是「从后台恢复」而不是重新加载，
  // 所以每次渲染、每次回到前台都要再查一次，否则日期永远停在昨天。
  function vRollDay() {
    if (!vocab) return false;
    var today = vToday();
    if (vocab.day === today) return false;
    vocab.day = today;
    vocab.newToday = 0;                  // 新的一天，今日额度重新发
    vSave();
    return true;
  }

  // 学到一个词时更新连续天数
  function vTouchStreak() {
    var today = vToday();
    if (vocab.lastStudy === today) return;
    var yesterday = vDateKey(Date.now() - VDAY);
    vocab.streak = (vocab.lastStudy === yesterday) ? (vocab.streak || 1) + 1 : 1;
    vocab.lastStudy = today;
  }

  // 连续天数只在前一天或今天学过时才算「连着」
  function vStreakShown() {
    if (!vocab || !vocab.lastStudy) return 0;
    var today = vToday();
    return (vocab.lastStudy === today || vocab.lastStudy === vDateKey(Date.now() - VDAY))
      ? (vocab.streak || 0) : 0;
  }

  function vLoad() {
    var d = vBlank();
    try {
      var raw = localStorage.getItem(VKEY);
      if (raw) {
        var saved = JSON.parse(raw);
        Object.keys(d).forEach(function (k) {
          if (saved && saved[k] !== undefined && saved[k] !== null) d[k] = saved[k];
        });
      }
    } catch (e) { /* 读不出来就当新开始 */ }
    if (!d.chunks || !d.chunks.length) d.chunks = (V.chunks || []).slice();
    vocab = d;
    vRollDay();                          // 跨天自动重置今日额度
    return vocab;
  }

  function vSave() {
    try { localStorage.setItem(VKEY, JSON.stringify(vocab)); } catch (e) {}
  }

  // 队列 / 统计用的视图状态（不持久化）
  var vs = {
    tab: "today",
    queue: [],
    qi: 0,
    revealed: false,
    forced: false,                 // 待复习没清时，用户点过「仍要学新词」
    importText: "",
    importTrack: "G",
    chunkText: ""
  };

  // 学习词池 = 查询模式那套 4198 词大词库（含雅思词）+ 原学习词库的 162 词 + 自己加的
  // 只取 单词/词性/中文 三个字段，音标仍然从 DATA.words 借（vPhon）
  var vPoolBase = null;
  function vPoolInit() {
    if (vPoolBase) return vPoolBase;
    var seen = {};
    var out = [];

    (DATA.words || []).forEach(function (x) {
      var key = x.w.toLowerCase();
      if (seen[key]) return;
      seen[key] = 1;
      out.push({ w: x.w, pos: x.pos || "", cn: x.cn || "" });
    });
    (V.words || []).forEach(function (x) {
      var key = x.w.toLowerCase();
      if (seen[key]) return;
      seen[key] = 1;
      out.push({ w: x.w, pos: x.pos || "", cn: x.cn || "", track: x.track });
    });

    vPoolBase = out;
    return vPoolBase;
  }

  function vWords() { return vPoolInit().concat(vocab.custom); }
  function vIsNew(w) { return !vocab.done[w.w]; }
  function vIsMastered(w) { return !!vocab.mastered[w.w]; }
  function vIsDue(w) {
    return !!vocab.done[w.w] && !vocab.mastered[w.w] && (vocab.due[w.w] || 0) <= Date.now();
  }
  function vBox(w) { return vocab.box[w.w] || 0; }

  // 全部词一起排队：原来把「拼写轨(L)」排除在外，而听写页已经不可达，
  // 那 45 个词就永远学不到了——现在并回普通队列，谁也不会漏。
  function vNormal() {
    return vWords();
  }
  function vDueList() {
    return vNormal().filter(vIsDue).sort(function (a, b) {
      return (vocab.due[a.w] || 0) - (vocab.due[b.w] || 0);
    });
  }
  function vNewPool() { return vNormal().filter(vIsNew); }
  function vMasteredList() { return vNormal().filter(vIsMastered); }

  // 听写页（拼写轨）已经不可达，相关代码整块删掉了；那些词已并入普通队列
  function vShuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function vBuildQueue() {
    vs.revealed = false;
    if (vs.tab === "today") {
      var room = Math.max(0, VNEW_PER_DAY - vocab.newToday);
      vs.queue = vShuffle(vNewPool().slice()).slice(0, room);
    } else if (vs.tab === "review") {
      vs.queue = vDueList();
    } else {
      vs.queue = [];
    }
    vs.qi = 0;
  }

  // 三键的实际作用点
  function vAnswer(w, kind) {
    var now = Date.now();
    var box = vBox(w);
    if (kind === "know") {
      box = box + 1;
      if (box > VBOX_MAX) {
        vocab.mastered[w.w] = 1;
        vocab.box[w.w] = VBOX_MAX;
        vocab.due[w.w] = now + VINT[VBOX_MAX];
      } else {
        vocab.box[w.w] = box;
        vocab.due[w.w] = now + VINT[box];
      }
    } else if (kind === "fuzzy") {
      vocab.due[w.w] = now + VDAY;          // 记忆盒不动，明天再考
    } else {
      vocab.box[w.w] = 0;
      vocab.due[w.w] = now + VFLOOR;        // 打回盒 0，10 分钟后重来
    }
    if (!vocab.done[w.w]) {
      vocab.done[w.w] = 1;
      vocab.newToday++;        // 拼写轨已并入普通队列，学到的新词一律占今日额度
    }
    // 「已学习」按学习时间倒序；老进度里没有这个字段的，这次补上
    if (!vocab.learnedAt[w.w]) vocab.learnedAt[w.w] = now;
    vTouchStreak();                            // 连续学习天数
    vSave();
    syncAutoPush();                            // 设置过同步就顺手传一次（失败静默）
  }

  // 发音：用浏览器自带的语音合成，不需要联网
  function vSpeak(text) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (typeof window.SpeechSynthesisUtterance !== "function") return;
    try {
      window.speechSynthesis.cancel();
      var u = new window.SpeechSynthesisUtterance(text);
      u.lang = "en-GB";
      u.rate = 0.88;
      window.speechSynthesis.speak(u);
    } catch (e) { /* 没有语音引擎就静默跳过 */ }
  }

  // 音标从检索词库里借（学习词库自己不带音标）
  var vPhonMap = null;
  function vPhon(word) {
    if (!vPhonMap) {
      vPhonMap = {};
      (DATA.words || []).forEach(function (x) { vPhonMap[x.w] = x.ph; });
    }
    return Object.prototype.hasOwnProperty.call(vPhonMap, word) ? vPhonMap[word] : "";
  }

  // 固定搭配也从检索词库里借，答完显示，帮助记搭配而不是记单词
  function vCollocations(word) {
    if (!DATA.collocations) return null;
    return Object.prototype.hasOwnProperty.call(DATA.collocations, word)
      ? DATA.collocations[word] : null;
  }

  // 三个板块：今日新词 / 已学习 / 全部单词
  var VTABS = [
    { id: "today", label: "今日新词" },
    { id: "learned", label: "已学习" },
    { id: "all", label: "全部单词" }
  ];

  function vLearnedList() {
    return vWords().filter(function (w) { return vocab.done[w.w]; })
      .sort(function (a, b) { return (vocab.learnedAt[b.w] || 0) - (vocab.learnedAt[a.w] || 0); });
  }

  // 今日新词：先复习到期的，再按每天上限补新词（新词跨场景域打散）
  function vTodayList() {
    var due = vDueList();
    var room = Math.max(0, VNEW_PER_DAY - vocab.newToday);
    var fresh = vShuffle(vNewPool().slice()).slice(0, room);
    return due.concat(fresh);
  }

  // 全部单词：先学习词库（A-Z），再词典里的固定搭配（A-Z）放到最后
  var vAllCache = null;
  function vByEn(a, b) {
    var x = a.w.toLowerCase(), y = b.w.toLowerCase();
    return x < y ? -1 : (x > y ? 1 : 0);
  }
  function vAllList() {
    if (vAllCache) return vAllCache;

    var words = vWords().map(function (w) {
      return {
        w: w.w,
        ph: vPhon(w.w),
        desc: (w.pos && w.pos !== "—" ? w.pos + ". " : "") + w.cn
      };
    }).sort(vByEn);

    var seen = {};
    words.forEach(function (it) { seen[it.w.toLowerCase()] = 1; });

    var phrases = [];
    var col = DATA.collocations || {};
    Object.keys(col).forEach(function (head) {
      col[head].forEach(function (pair) {
        var key = String(pair[0]).toLowerCase();
        if (seen[key]) return;                 // 和学习词库重复的不再列一遍
        seen[key] = 1;
        phrases.push({ w: pair[0], ph: "", desc: pair[1] });
      });
    });
    phrases.sort(vByEn);

    vAllCache = words.concat(phrases);          // 单词在前，固定搭配在后
    return vAllCache;
  }

  // 小按钮组：今日新词三个键，已学习两个键
  function vKeysHtml(word, kinds) {
    return kinds.map(function (k) {
      var label = k === "know" ? "认识" : (k === "fuzzy" ? "模糊" : "不认识");
      var cls = k === "know" ? "vk-ok" : (k === "fuzzy" ? "vk-mid" : "vk-no");
      return '<button type="button" class="vk ' + cls + '" data-vans="' + k +
        '" data-vword="' + esc(word) + '">' + label + "</button>";
    }).join("");
  }

  // 第一行左边：英语 + 音标（点一下发音）
  function vWordPart(w, phon) {
    return '<span class="vw" data-vspeak="' + esc(w) + '">' + esc(w) + "</span>" +
      (phon ? '<span class="vp">' + esc(phon) + "</span>" : "");
  }

  // 左侧两行文字：第一行 英语+音标，第二行 词性+中文
  function vTextHtml(w) {
    return '<div class="vtext">' +
      '<div class="vline">' + vWordPart(w.w, vPhon(w.w)) + "</div>" +
      '<div class="vdesc">' + esc((w.pos && w.pos !== "—" ? w.pos + ". " : "") + w.cn) + "</div>" +
    "</div>";
  }

  // 今日新词：左边两行文字，右边两个键（认识 / 不认识）
  function vRowHtml(w) {
    return '<div class="vrow">' + vTextHtml(w) +
      '<div class="vkeys">' + vKeysHtml(w.w, ["know", "no"]) + "</div>" +
    "</div>";
  }

  // 已学习：同上（两个键，按学习时间由新到旧排）
  function vLearnedRowHtml(w) {
    return '<div class="vrow">' + vTextHtml(w) +
      '<div class="vkeys">' + vKeysHtml(w.w, ["know", "no"]) + "</div>" +
    "</div>";
  }

  // 全部单词：一行「英语 / 音标 / 词性+中文」
  function vFlatRowHtml(it) {
    return '<div class="vflat">' +
      '<span class="vw" data-vspeak="' + esc(it.w) + '">' + esc(it.w) + "</span>" +
      (it.ph ? '<span class="vp">' + esc(it.ph) + "</span>" : "") +
      '<span class="vdesc-inline">' + esc(it.desc) + "</span>" +
    "</div>";
  }

  function vTodayHtml() {
    var list = vTodayList();
    if (!list.length) {
      var left = Math.max(0, VNEW_PER_DAY - vocab.newToday);
      if (left > 0) {
        return '<p class="vempty">词库里能学的词都学完了。<br>到期的复习词会继续出现在这里。</p>';
      }
      var s = vStreakShown();
      return '<p class="vempty">今天的 ' + VNEW_PER_DAY + " 个新词完成了 ✅<br>" +
        "明天会再发 " + VNEW_PER_DAY + " 个，一天一批；到期的复习词随时会插进来。" +
        (s ? "<br>已经连续 " + s + " 天了。" : "") + "</p>";
    }
    return '<div class="vlist">' + list.map(vRowHtml).join("") + "</div>";
  }

  function vLearnedHtml() {
    var list = vLearnedList();
    if (!list.length) return '<p class="vempty">还没有学过的词，去「今日新词」开始吧。</p>';
    return '<div class="vlist">' + list.map(vLearnedRowHtml).join("") + "</div>";
  }

  function vAllHtml() {
    return '<div class="vlist">' + vAllList().map(vFlatRowHtml).join("") + "</div>";
  }

  function vCounts() {
    return {
      today: vTodayList().length,
      learned: vLearnedList().length,
      all: vWords().length,
      todayDone: vocab.newToday,
      total: vWords().length
    };
  }

  function vTrackName(t) { return (V.tracks && V.tracks[t]) || t; }

  function vBadgesHtml(w) {
    var domName = (V.domains && V.domains[w.domain]) || "";
    return '<span class="vbadge" data-track="' + esc(w.track) + '">' +
        esc(w.track) + " · " + esc(vTrackName(w.track)) + "</span>" +
      (domName ? '<span class="vtag">' + esc(domName) + "</span>" : "") +
      (w.trap ? '<span class="vtag">拼写陷阱</span>' : "");
  }

  function vDotsHtml(w) {
    var box = vBox(w), dots = "";
    for (var i = 1; i <= VBOX_MAX; i++) {
      dots += '<i class="vdot' + (i <= box ? " is-on" : "") + '"></i>';
    }
    return dots;
  }

  function vOptionsHtml() {
    var sel = vs.importTrack || "G";
    return Object.keys(V.tracks || {}).map(function (k) {
      return '<option value="' + esc(k) + '"' + (k === sel ? " selected" : "") + ">" +
        esc(k + " · " + (V.tracks[k] || "")) + "</option>";
    }).join("");
  }

  /* 卡片式学习页 / 听写页已经不再渲染（现在用的是「一行一个词 + 认识/不认识」的列表），
     相应的 vReadCardHtml / vSpellCardHtml / vStudyHtml 已删除，避免留着会点不动的死按钮。 */

  function vInboxHtml() {
    var custom = vocab.custom;
    var list = custom.length
      ? '<div class="vlist">' + custom.map(function (w, i) {
          return '<div class="vitem">' +
            '<span class="vitem-w">' + esc(w.w) + "</span>" +
            '<span class="vitem-c">' + esc(w.pos || "") + " " + esc(w.cn) +
              " · " + esc(vTrackName(w.track)) + "</span>" +
            '<button type="button" class="vitem-del" data-vdel="' + i + '">删除</button>' +
          "</div>";
        }).join("") + "</div>"
      : '<div class="vempty">还没有导入过词。上面粘贴后点「加入词库」。</div>';

    return "" +
      '<p class="vhint">把《雅思词汇胜经》《王陆 807》、APP 词书里的生词粘进来，一行一个。' +
        "格式：<b>单词 词性 中文</b>，后两项可省；重复的词会自动跳过。</p>" +
      '<div class="vimport">' +
        '<textarea class="vinput" data-vimport="1" rows="5" ' +
          'placeholder="accommodation n 住宿&#10;itinerary n 行程&#10;refund">' +
          esc(vs.importText) + "</textarea>" +
        '<div class="vrow">' +
          '<select class="vselect" data-vtrack="1">' + vOptionsHtml() + "</select>" +
          '<button type="button" class="vbtn vbtn-primary" data-vadd="1">加入词库</button>' +
          '<button type="button" class="vbtn" data-vreset="1">清空全部进度</button>' +
        "</div>" +
      "</div>" +
      '<p class="vsec">已导入 ' + custom.length + " 个</p>" + list;
  }

  function vChunksHtml() {
    var list = vocab.chunks.map(function (c, i) {
      return '<div class="vitem">' +
        '<span class="vitem-w">' + esc(c.w) + "</span>" +
        '<span class="vitem-c">' + esc(c.cn) + (c.tag ? " · " + esc(c.tag) : "") + "</span>" +
        '<button type="button" class="vitem-del" data-vchunkdel="' + i + '">删除</button>' +
      "</div>";
    }).join("");

    return "" +
      '<p class="vhint">词组、搭配、整句都放这里，<b>不进单词表</b>。格式：英文 | 中文 | 场景</p>' +
      '<div class="vimport">' +
        '<textarea class="vinput" data-vchunk="1" rows="2" placeholder="make a decision | 做决定 | 职场">' +
          esc(vs.chunkText) + "</textarea>" +
        '<div class="vrow">' +
          '<button type="button" class="vbtn vbtn-primary" data-vchunkadd="1">添加语块</button>' +
        "</div>" +
      "</div>" +
      '<p class="vsec">' + vocab.chunks.length + " 条</p>" +
      '<div class="vlist">' + list + "</div>";
  }

  function vMasteredHtml() {
    var m = vMasteredList();
    if (!m.length) {
      return '<div class="vempty">还没有已掌握的词。<br>答「认识」把记忆盒推到 ' + VBOX_MAX + " 才算。</div>";
    }
    return '<p class="vhint">记忆盒推到 ' + VBOX_MAX + " 的词，不再出现在队列里。共 " + m.length + " 个。</p>" +
      '<div class="vlist">' + m.map(function (w) {
        return '<div class="vitem">' +
          '<span class="vitem-w">' + esc(w.w) + "</span>" +
          '<span class="vitem-c">' + esc(w.pos || "") + ". " + esc(w.cn) + "</span>" +
          '<button type="button" class="vitem-del" data-vagain="' + esc(w.w) + '">重新学</button>' +
        "</div>";
      }).join("") + "</div>";
  }

  function renderVocab() {
    if (!els.vocabBoard) return;
    if (vRollDay()) vs.forced = false;   // 跨天了：额度重发，门禁也重置
    var c = vCounts();

    var html = '<div class="vtabs">' + VTABS.map(function (t) {
      return '<button type="button" class="vtab' + (vs.tab === t.id ? " is-active" : "") + '" data-vtab="' + t.id + '">' +
        esc(t.label) + (c[t.id] ? "<em>" + c[t.id] + "</em>" : "") + "</button>";
    }).join("") + "</div>";

    var left = Math.max(0, VNEW_PER_DAY - vocab.newToday);
    var streak = vStreakShown();
    html += '<p class="vstat">今日新词 <b>' + c.todayDone + "/" + VNEW_PER_DAY + "</b>" +
      (left ? "（还剩 <b>" + left + "</b> 个）" : "（今天的发完了）") +
      "　复习到期 <b>" + vDueList().length + "</b>" +
      "　已学习 <b>" + c.learned + "</b>　全部 <b>" + c.total + "</b>" +
      (streak ? "　连续 <b>" + streak + "</b> 天" : "") + "</p>";

    if (vs.tab === "learned") html += vLearnedHtml();
    else if (vs.tab === "all") html += vAllHtml();
    else html += vTodayHtml();

    els.vocabBoard.innerHTML = html;
  }

  /* ---------- 学习模式·单词板块 的交互 ---------- */

  function vAddImported() {
    var lines = String(vs.importText || "").split("\n");
    var track = vs.importTrack || "G";
    var added = 0, dup = 0;

    lines.forEach(function (line) {
      line = line.trim();
      if (!line) return;
      var parts = line.split(/[\s,，\t]+/).filter(Boolean);
      if (!parts.length) return;
      var word = parts[0];
      var exists = vWords().some(function (x) { return x.w.toLowerCase() === word.toLowerCase(); });
      if (exists) { dup++; return; }

      var pos = "", cn = "";
      if (parts.length >= 3) { pos = parts[1]; cn = parts.slice(2).join(" "); }
      else if (parts.length === 2) { cn = parts[1]; }

      vocab.custom.push({
        w: word,
        pos: pos || "—",
        cn: cn || "（释义待补）",
        track: track,
        domain: "00",        // 导入的词先不带场景，找到归属再改
        sub: "custom",
        trap: false,
        note: ""
      });
      added++;
    });

    vs.importText = "";
    vAllCache = null;    // 词库变了，「全部单词」的缓存要重建    vSave();
    renderVocab();

    if (added || dup) {
      els.composerHint.textContent = "✓ 加入 " + added + " 个" + (dup ? "，跳过重复 " + dup + " 个" : "");
    }
  }

  function vAddChunk() {
    var text = String(vs.chunkText || "").trim();
    if (!text) return;
    var p = text.split("|").map(function (s) { return s.trim(); });
    vocab.chunks.push({ w: p[0], cn: p[1] || "（待补）", tag: p[2] || "" });
    vs.chunkText = "";
    vSave();
    renderVocab();
  }

  // 底部输入框已从学习模式移除，所以「快速加词」入口也一起去掉（vAddImported 还留着，导入按钮可能用到）
  function onVocabClick(e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var el;

    if ((el = t.closest("[data-vtab]"))) {
      vs.tab = el.getAttribute("data-vtab");
      vs.forced = false;
      vBuildQueue();
      renderVocab();
      els.viewport.scrollTop = 0;
      return;
    }
    if ((el = t.closest("[data-vspeak]"))) { vSpeak(el.getAttribute("data-vspeak")); return; }
    if ((el = t.closest("[data-vans]"))) {
      // 列表里的三键：直接对那一行作答
      var kind = el.getAttribute("data-vans");
      var word = el.getAttribute("data-vword");
      var target = vWords().filter(function (x) { return x.w === word; })[0];
      if (target) { vAnswer(target, kind); renderVocab(); }
      return;
    }
    if ((el = t.closest("[data-vgo]"))) {
      vs.tab = "review"; vs.forced = false; vBuildQueue(); renderVocab(); return;
    }
    if ((el = t.closest("[data-vforce]"))) { vs.forced = true; renderVocab(); return; }
    if ((el = t.closest("[data-vadd]"))) { vAddImported(); return; }
    if ((el = t.closest("[data-vchunkadd]"))) { vAddChunk(); return; }
    if ((el = t.closest("[data-vdel]"))) {
      vocab.custom.splice(Number(el.getAttribute("data-vdel")), 1); vSave(); renderVocab(); return;
    }
    if ((el = t.closest("[data-vchunkdel]"))) {
      vocab.chunks.splice(Number(el.getAttribute("data-vchunkdel")), 1); vSave(); renderVocab(); return;
    }
    if ((el = t.closest("[data-vagain]"))) {
      var word = el.getAttribute("data-vagain");
      delete vocab.mastered[word];
      delete vocab.done[word];
      delete vocab.box[word];
      delete vocab.due[word];
      vSave(); renderVocab(); return;
    }
    if ((el = t.closest("[data-vreset]"))) {
      if (window.confirm("清空全部学习进度（包括导入的词和语块）？")) {
        vocab = vBlank();
        vocab.chunks = (V.chunks || []).slice();
        vSave();
        vs.tab = "inbox"; vs.forced = false;
        vBuildQueue();
        renderVocab();
      }
      return;
    }
  }

  // 只记录输入内容，不重渲染（重渲染会打断打字和焦点）
  function onVocabInput(e) {
    var t = e.target;
    if (!t || !t.getAttribute) return;
    if (t.getAttribute("data-vimport") !== null) vs.importText = t.value;
    else if (t.getAttribute("data-vchunk") !== null) vs.chunkText = t.value;
    else if (t.getAttribute("data-vdinput") !== null) vs.spell.typed = t.value;
  }

  function onVocabChange(e) {
    var t = e.target;
    if (t && t.getAttribute && t.getAttribute("data-vtrack") !== null) {
      vs.importTrack = t.value;
    }
  }

  function onVocabKeydown(e) {
    var t = e.target;
    if (!t || !t.getAttribute) return;
    // 听写输入框已经不在界面上了，这里保留一个空实现以防旧缓存页面还挂着监听
  }

  /* ---------------------------------------------------------------------
     学习模式 / 查询模式 的分发
     --------------------------------------------------------------------- */

  function renderWords() {
    var study = state.mode === "study";

    // 进学习模式时重建队列；离开时把检索区留空
    if (study) {
      if (els.vocabBoard.hidden) vBuildQueue();
      els.vocabBoard.hidden = false;
      els.wordList.innerHTML = "";
      els.wordEmpty.hidden = true;
      renderVocab();
      return;
    }

    els.vocabBoard.hidden = true;

    var q = state.wordQuery.trim();
    if (!q) {
      els.wordList.innerHTML = "";
      els.wordEmpty.hidden = true;
      return;
    }

    var hits = (DATA.words || []).filter(function (it) {
      return matches(q, [it.w, it.cn, it.ph, it.pos]);
    });

    els.wordEmpty.hidden = hits.length > 0;
    els.wordList.innerHTML = hits.map(function (it) { return wordCardHtml(it, q); }).join("");
  }

  /* ============================== 板块二：句子和对话 ============================== */
  // 句子和对话拆成两份数据，这里合并成一个池子一起检索
  function contentPool() {
    var sentences = DATA.sentences || [];
    var dialogues = DATA.dialogues || [];
    return sentences.concat(dialogues);
  }

  function renderSentences() {
    var q = state.sentQuery.trim();
    if (!q) {
      els.sentList.innerHTML = "";
      els.sentEmpty.hidden = true;
      return;
    }

    var list = contentPool().filter(function (it) {
      var fields = [it.en, it.cn, it.title || ""];
      (it.lines || []).forEach(function (l) { fields.push(l.en, l.cn); });
      return matches(q, fields);
    });

    els.sentEmpty.hidden = list.length > 0;

    els.sentList.innerHTML = list.map(function (it) {
      if (it.lines) return dialogueCardHtml(it, q);
      return '' +
        '<article class="card">' +
          '<p class="card-en">' + highlight(it.en, q) + '</p>' +
          '<p class="card-cn-2">' + highlight(it.cn, q) + '</p>' +
        '</article>';
    }).join("");
  }

  function dialogueCardHtml(d, q) {
    return '' +
      '<article class="card">' +
        (d.title ? '<p class="card-title">' + highlight(d.title, q) + '</p>' : '') +
        '<div class="dlg">' +
          d.lines.map(function (l) {
            return '<div class="dlg-line">' +
              '<span class="dlg-who">' + esc(l.who) + '</span>' +
              '<div class="dlg-body">' +
                '<p class="dlg-en">' + highlight(l.en, q) + '</p>' +
                '<p class="dlg-cn">' + highlight(l.cn, q) + '</p>' +
              '</div>' +
            '</div>';
          }).join("") +
        '</div>' +
      '</article>';
  }

  /* ==================== 板块四：对话（学习模式·场景对话库） ====================
     两级选择器：一级标题是域（可折叠，手风琴），二级是选项「场景 · 变体」。
     每行右边挂 掌握 / 练习 两个键（进度存本机），点选项文字看对话；
     再点一次已选中的标题 = 取消选中，下面的对话收起。
     不显示：顶部统计条、场景标题以外的说明、雅思标签、关系/语域/渠道/障碍/结果 元数据、
             说话人姓名；朗读按钮也去掉了。
     数据来自 data.scenarios.js（window.CHAT_PRAC_SCENARIOS）。
     ========================================================================= */

  var SC = window.CHAT_PRAC_SCENARIOS || { domains: [], scenarios: [] };
  var dlgOpen = false;   // 选择器是否展开
  var dlgSel = "";       // 当前选中的对话，键形如 "s04-01:3"（场景 id : 变体序号）
  var dlgDomOpen = null; // 选择器里展开的一级标题（域 id）——手风琴，一次只开一个

  // 扁平化成「一行一个变体」的列表，顺序按 域 → 场景 → 变体
  function dlgFlat() {
    var out = [];
    (SC.domains || []).forEach(function (dom) {
      (SC.scenarios || []).forEach(function (scn) {
        if (scn.domain !== dom.id) return;
        (scn.dialogues || []).forEach(function (d, di) {
          out.push({ key: scn.id + ":" + di, dom: dom, scn: scn, d: d, di: di });
        });
      });
    });
    return out;
  }

  function dlgFind(key) {
    var list = dlgFlat();
    for (var i = 0; i < list.length; i++) if (list[i].key === key) return list[i];
    return null;
  }

  // 搜索命中：变体名 + 对话正文
  function dlgMatch(d, q) {
    if (!q) return true;
    var fields = [d.variant];
    (d.lines || []).forEach(function (l) { fields.push(l.en, l.cn); });
    return matches(q, fields);
  }

  /* ---------- 朗读：已按用户要求去掉（浏览器语音太难听） ---------- */

  /* ---------- 选择器 ---------- */

  // 选项文字 = 场景名 · 变体（同一个域里有多个场景时，光看变体名分不出是哪一条）
  function dlgLabel(it) {
    return it.scn.title + " · " + it.d.variant;
  }

  function dlgPickHtml(list, curIdx, q) {
    var picked = curIdx >= 0 ? list[curIdx] : null;
    var html = '<div class="dlgpick">' +
      '<button type="button" class="dlgpick-btn' + (dlgOpen ? " is-open" : "") +
        (picked ? " is-active" : "") + '"' +
        ' data-dlgpick="1" aria-expanded="' + (dlgOpen ? "true" : "false") + '">' +
        '<span class="dlgpick-val' + (picked ? "" : " is-ph") + '">' +
          esc(picked ? dlgLabel(picked) : "选择场景") +
        "</span>" +
        '<span class="dlgpick-arrow">' + (dlgOpen ? "▲" : "▼") + "</span>" +
      "</button>";

    if (dlgOpen) {
      // 一级标题（域）可折叠，手风琴式：一次只展开一个，否则翻完一个域要滑很久
      var groups = [];
      list.forEach(function (it) {
        var g = groups[groups.length - 1];
        if (!g || g.id !== it.dom.id) {
          g = { id: it.dom.id, name: it.dom.name, items: [] };
          groups.push(g);
        }
        g.items.push(it);
      });

      html += '<div class="dlgpick-list">' +
        '<p class="dlgpickstat">今天掌握 <b>' + dlgTodayDone() + "</b> / " + DLG_DAILY_GOAL +
        " · 全部已掌握 <b>" + dlgDoneAll() + "</b> 段</p>";

      groups.forEach(function (g) {
        var open = q ? true : dlgDomOpen === g.id;   // 搜索时全部展开，免得结果藏着
        var hasSel = g.items.some(function (it) { return it.key === dlgSel; });
        html += '<button type="button" class="dlgdomlabel' + (open ? " is-open" : "") +
          (hasSel ? " is-active" : "") + '" data-dlgdom="' + esc(g.id) + '"' +
          ' aria-expanded="' + (open ? "true" : "false") + '">' +
          '<span class="dlgdomname">' + esc(g.name) + "</span>" +
          '<span class="dlgdomarrow">' + (open ? "▲" : "▼") + "</span>" +
        "</button>";
        if (!open) return;
        g.items.forEach(function (it) {
          // 二级标题：点文字 = 选中/取消选中；右边两个键 = 掌握 / 练习
          var m = dlgMarkOf(it.key);
          html += '<div class="dlgpick-row' + (it.key === dlgSel ? " is-active" : "") +
            (m ? " is-" + m : "") + '">' +
            '<button type="button" class="dlgpick-item" data-dlgseg="' + esc(it.key) + '">' +
              esc(dlgLabel(it)) + "</button>" +
            '<span class="dlgmarks">' +
              '<button type="button" class="dlgmark dlgmark-ok' + (m === "ok" ? " is-on" : "") +
                '" data-dlgmark="ok" data-dlgkey="' + esc(it.key) + '">掌握</button>' +
              '<button type="button" class="dlgmark dlgmark-practice' + (m === "practice" ? " is-on" : "") +
                '" data-dlgmark="practice" data-dlgkey="' + esc(it.key) + '">练习</button>' +
            "</span>" +
          "</div>";
        });
      });
      if (!list.length) html += '<p class="dlgpick-none">没有匹配的对话</p>';
      html += "</div>";
    }
    return html + "</div>";
  }

  /* ---------- 目标完成：进度存本机，掌握 / 练习两个键挂在下拉框的每一行上 ----------
     一个「课题」= 一个场景（8 种变体）。掌握 = 这段学完了；练习 = 还要再学。 */
  var DG_KEY = "chatprac-dialogue-goal";
  var DLG_DAILY_GOAL = 8;    // 每天的目标：一个课题 = 8 段
  var dlgGoal = dlgGoalLoad();

  function dlgGoalLoad() {
    var d = { mark: {} };   // mark["s04-01:0"] = { s: "ok" | "practice", d: "2026-1-5" }
    try {
      var raw = localStorage.getItem(DG_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        if (saved && saved.mark) d.mark = saved.mark;
      }
    } catch (e) { /* 读不出来就当新开始 */ }
    return d;
  }

  function dlgGoalSave() {
    try { localStorage.setItem(DG_KEY, JSON.stringify(dlgGoal)); } catch (e) {}
    if (typeof syncAutoPush === "function") syncAutoPush();   // 对话掌握也一起同步
  }

  // 点「掌握」记 ok，点「练习」记 practice，再点一次同一个就取消
  function dlgMark(key, kind) {
    var cur = dlgGoal.mark[key];
    if (cur && cur.s === kind) delete dlgGoal.mark[key];
    else dlgGoal.mark[key] = { s: kind, d: vToday() };
    dlgGoalSave();
  }

  function dlgMarkOf(key) {
    var m = dlgGoal.mark[key];
    return m && m.s ? m.s : "";
  }

  // 今天已掌握的段数（跨天自动归零，因为按日期比）
  function dlgTodayDone() {
    var today = vToday(), n = 0;
    Object.keys(dlgGoal.mark).forEach(function (k) {
      if (dlgGoal.mark[k].s === "ok" && dlgGoal.mark[k].d === today) n++;
    });
    return n;
  }

  function dlgDoneAll() {
    var n = 0;
    Object.keys(dlgGoal.mark).forEach(function (k) { if (dlgGoal.mark[k].s === "ok") n++; });
    return n;
  }

  /* ---------- 对话正文：一句一行（朗读按钮已按用户要求去掉） ---------- */

  function dlgLinesHtml(d) {
    return '<div class="dlglines">' + (d.lines || []).map(function (l) {
      return '<div class="dlgline">' +
        '<div class="dlgbody">' +
          '<p class="dlgen">' + esc(l.en) + "</p>" +
          '<p class="dlgcn">' + esc(l.cn) + "</p>" +
        "</div>" +
      "</div>";
    }).join("") + "</div>";
  }

  function renderDialogues() {
    var q = (state.talkQuery || "").trim();
    var all = dlgFlat();
    var list = q ? all.filter(function (it) { return dlgMatch(it.d, q); }) : all;

    var curIdx = -1;
    for (var i = 0; i < list.length; i++) if (list[i].key === dlgSel) curIdx = i;

    // 搜索时自动展开选择器；当前选中的没命中，就跳到第一个命中
    if (q) {
      dlgOpen = true;
      if (curIdx < 0 && list.length) { curIdx = 0; dlgSel = list[0].key; }
    }

    var html = dlgPickHtml(list, curIdx, q);
    if (curIdx >= 0) html += '<div class="dlgview">' + dlgLinesHtml(list[curIdx].d) + "</div>";

    els.dialogueList.innerHTML = html;
    els.dialogueEmpty.hidden = !(q && !list.length);
    renderStudyProgress();   // 掌握/练习 一点，底部两条进度条要跟着动
  }

  // 事件委托顺序由内到外：掌握/练习 → 选二级标题（再点取消） → 一级标题 → 展开/收起选择器
  function onDialogueClick(e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var el;

    if ((el = t.closest("[data-dlgmark]"))) {
      dlgMark(el.getAttribute("data-dlgkey"), el.getAttribute("data-dlgmark"));
      renderDialogues();
      return;
    }
    if ((el = t.closest("[data-dlgseg]"))) {
      var key = el.getAttribute("data-dlgseg");
      if (key === dlgSel) {
        dlgSel = "";                   // 再点一次取消选中：下面的对话收起
      } else {
        dlgSel = key;
        dlgOpen = false;               // 选完就收起下拉，直接看对话
        dlgDomOpen = null;
      }
      renderDialogues();
      return;
    }
    if ((el = t.closest("[data-dlgdom]"))) {
      var id = el.getAttribute("data-dlgdom");
      if (dlgDomOpen === id) {
        dlgDomOpen = null;             // 再点一次收起这个域
      } else {
        dlgDomOpen = id;               // 点别的域就换过去（手风琴）
      }
      renderDialogues();
      return;
    }
    if (t.closest("[data-dlgpick]")) {
      dlgOpen = !dlgOpen;
      if (dlgOpen) {
        // 打开时自动展开当前选中的那个域，省得再找一遍
        var cur = dlgFind(dlgSel);
        dlgDomOpen = cur ? cur.dom.id : dlgDomOpen;
      }
      renderDialogues();
    }
  }

  /* ============================== 板块三：对话练习 ============================== */
  function pushMessage(role, html) {
    var wrap = document.createElement("div");
    wrap.className = "msg " + role;
    if (role === "assistant") {
      wrap.innerHTML = '<div class="avatar">CP</div><div class="bubble">' + html + "</div>";
    } else {
      wrap.innerHTML = '<div class="bubble">' + html + "</div>";
    }
    els.chatLog.appendChild(wrap);
    scrollToBottom();
    return wrap;
  }

  function botBubble(en, cn) {
    return esc(en) + (cn ? '<span class="bubble-cn">' + esc(cn) + "</span>" : "");
  }

  function typingNode() {
    return '<span class="typing"><i></i><i></i><i></i></span>';
  }

  function mockReply(text) {
    var bank = DATA.replies.generic;
    var i = state.replyIndex.generic || 0;
    state.replyIndex.generic = (i + 1) % bank.length;

    var item = bank[i];
    var en = item.en;

    // 用户提问时，先给一句口语化的回应，让模拟回复不那么死板
    if (/\?\s*$/.test(text.trim())) {
      en = "Good question! " + en;
    }
    return { en: en, cn: item.cn };
  }

  function sendToModel(text) {
    var history = state.chat.slice(-10).map(function (m) {
      return { role: m.role, content: m.content };
    });
    history.push({ role: "user", content: text });

    if (!API.enabled || !API.apiKey) {
      return new Promise(function (resolve) {
        var reply = mockReply(text);
        setTimeout(function () { resolve(reply); }, 500 + Math.random() * 400);
      });
    }

    return fetch(API.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API.apiKey
      },
      body: JSON.stringify({
        model: API.model,
        messages: [{ role: "system", content: API.systemPrompt }].concat(history),
        temperature: 0.8,
        stream: false
      })
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    }).then(function (json) {
      var content = json.choices && json.choices[0] && json.choices[0].message.content;
      return { en: content || "(空回复)", cn: "" };
    }).catch(function (err) {
      return { en: "连接模型失败：" + err.message, cn: "请检查 API Key / 网络，或先使用模拟模式。" };
    });
  }

  function sendChat(text) {
    if (state.busy) return;
    state.busy = true;
    els.sendBtn.disabled = true;

    pushMessage("user", esc(text));
    state.chat.push({ role: "user", content: text });

    var holder = pushMessage("assistant", typingNode());

    sendToModel(text).then(function (reply) {
      holder.querySelector(".bubble").innerHTML = botBubble(reply.en, reply.cn);
      state.chat.push({ role: "assistant", content: reply.en });
      state.busy = false;
      els.sendBtn.disabled = false;
      scrollToBottom();
    });
  }

  // 一条进度条：已掌握 / 总数；不到 10% 时留一位小数，免得刚开始全是 0%
  function pbarText(done, total) {
    var pct = total ? done / total * 100 : 0;
    var shown = (pct > 0 && pct < 10) ? pct.toFixed(1) : String(Math.round(pct));
    return done + " / " + total + " · " + shown + "%";
  }

  // 底部进度：全场景 + 当前正在学的一级标题（域）
  function renderStudyProgress() {
    if (!els.studyProgress) return;
    var studyDialogue = state.mode === "study" && state.tab === "dialogue";
    els.studyProgress.hidden = !studyDialogue;
    if (els.composer) els.composer.hidden = state.mode === "study";
    if (!studyDialogue) return;

    var all = dlgFlat();
    var doneAll = 0;
    all.forEach(function (it) { if (dlgMarkOf(it.key) === "ok") doneAll++; });

    // 当前一级标题：优先选中那条所在的域，其次下拉里展开的域，最后退回第一个有内容的域
    var cur = dlgFind(dlgSel);
    var domId = cur ? cur.dom.id : (dlgDomOpen || (all[0] && all[0].dom.id));
    var mine = all.filter(function (it) { return it.dom.id === domId; });
    var doneDom = 0;
    mine.forEach(function (it) { if (dlgMarkOf(it.key) === "ok") doneDom++; });
    var domName = mine.length ? mine[0].dom.name : "当前场景";

    els.pbarAllVal.textContent = pbarText(doneAll, all.length);
    els.pbarAll.style.width = (all.length ? Math.round(doneAll / all.length * 100) : 0) + "%";
    els.pbarDomName.textContent = domName;
    els.pbarDomVal.textContent = pbarText(doneDom, mine.length);
    els.pbarDom.style.width = (mine.length ? Math.round(doneDom / mine.length * 100) : 0) + "%";
  }

  /* ==================== 进度同步（快照 / 备份文件 / GitHub Gist） ====================
     为什么需要它：静态页面把进度存在浏览器 localStorage 里，清缓存或换手机就没了。
     所以做一个「快照」层，把全部进度打包成一段 JSON，再提供三条通道：
       ① 导出到文本 / 从文本恢复（哪都能用，不依赖网络）
       ② 备份到文件（手机上存到「文件」App 或网盘）
       ③ GitHub Gist（粘一个只勾 gist 权限的 token，换设备粘同一个就能拿回来）
     快照里存各 key 的原始字符串，不做二次解析，避免漏字段。
     ================================================================================= */

  var SNAP_KEYS = [
    "chatprac-vocab-study",     // 背单词进度
    "chatprac-dialogue-goal",   // 对话掌握 / 练习
    "chatprac-mode",            // 查询 / 学习
    "chatprac-theme"            // 深浅色
  ];
  var SNAP_MAGIC = "chat-prac";
  var SYNC_KEY = "chatprac-sync";
  var GIST_FILE = "chat-prac-progress.json";

  function syncCfgLoad() {
    var d = { token: "", gist: "", auto: true, at: 0 };
    try {
      var raw = localStorage.getItem(SYNC_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        Object.keys(d).forEach(function (k) { if (saved && saved[k] !== undefined) d[k] = saved[k]; });
      }
    } catch (e) { /* 当没设置过 */ }
    return d;
  }
  var syncCfg = syncCfgLoad();

  function syncCfgSave() {
    try { localStorage.setItem(SYNC_KEY, JSON.stringify(syncCfg)); } catch (e) {}
  }

  /* ---------- 快照 ---------- */

  function snapMake() {
    var data = {};
    SNAP_KEYS.forEach(function (k) {
      try {
        var v = localStorage.getItem(k);
        if (v !== null) data[k] = v;
      } catch (e) { /* 读不到就跳过这个 key */ }
    });
    return { app: SNAP_MAGIC, version: 1, savedAt: Date.now(), data: data };
  }

  function snapParse(text) {
    var obj;
    try { obj = JSON.parse(String(text || "").trim()); } catch (e) { return { err: "不是有效的 JSON" }; }
    if (!obj || obj.app !== SNAP_MAGIC || !obj.data) return { err: "这不是 Chat Prac 的进度快照" };
    return { snap: obj };
  }

  function snapWhen(ts) {
    try { return new Date(ts).toLocaleString(); } catch (e) { return "未知时间"; }
  }

  // 把快照写回本机，并让内存里的状态一起换过来（不用刷新页面）
  function snapApply(snap) {
    var n = 0;
    SNAP_KEYS.forEach(function (k) {
      if (snap.data[k] === undefined || snap.data[k] === null) return;
      try { localStorage.setItem(k, snap.data[k]); n++; } catch (e) {}
    });
    vocab = vLoad();                     // 背单词进度
    dlgGoal = dlgGoalLoad();             // 对话掌握 / 练习
    vs.tab = "today"; vs.forced = false;
    vBuildQueue();
    initTheme();                         // 主题
    initModeState();                     // 查询 / 学习
    renderVocab();
    renderDialogues();
    renderStudyProgress();
    return n;
  }

  function snapStamp() {
    var d = new Date();
    function p(x) { return (x < 10 ? "0" : "") + x; }
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" + p(d.getHours()) + p(d.getMinutes());
  }

  /* ---------- GitHub Gist 通道 ---------- */

  function syncSay(msg, bad) {
    if (!els.syncMsg) return;
    els.syncMsg.textContent = msg || "";
    els.syncMsg.className = "sync-msg" + (bad ? " is-bad" : "");
  }

  function syncPaint() {
    if (els.syncToken) els.syncToken.value = syncCfg.token;
    if (els.syncAuto) els.syncAuto.textContent = "自动同步：" + (syncCfg.auto ? "开" : "关");
    if (els.syncState) {
      els.syncState.textContent = !syncCfg.token ? "未设置"
        : (syncCfg.at ? "已同步 " + new Date(syncCfg.at).toLocaleDateString() : "已设置");
    }
  }

  function ghHeaders() {
    return {
      "Accept": "application/vnd.github+json",
      "Authorization": "Bearer " + syncCfg.token,
      "Content-Type": "application/json"
    };
  }

  function syncUp() {
    if (!syncCfg.token) { syncSay("先粘一个 GitHub token", true); return; }
    var payload = {
      description: "Chat Prac 学习进度（自动生成，勿手改）",
      files: {}
    };
    if (!syncCfg.gist) payload.public = false;
    payload.files[GIST_FILE] = { content: JSON.stringify(snapMake()) };

    var url = syncCfg.gist ? "https://api.github.com/gists/" + syncCfg.gist : "https://api.github.com/gists";
    syncSay("上传中…");
    fetch(url, { method: syncCfg.gist ? "PATCH" : "POST", headers: ghHeaders(), body: JSON.stringify(payload) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j, code: r.status }; }); })
      .then(function (res) {
        if (!res.ok) { syncSay("上传失败：" + ((res.j && res.j.message) || res.code), true); return; }
        syncCfg.gist = res.j.id;
        syncCfg.at = Date.now();
        syncCfgSave();
        syncPaint();
        syncSay("已上传 ✓");
      })
      .catch(function () { syncSay("上传失败：网络不通", true); });
  }

  function syncDown(quiet) {
    if (!syncCfg.token || !syncCfg.gist) {
      if (!quiet) syncSay("云端还没有备份，先点「上传进度」", true);
      return;
    }
    if (!quiet) syncSay("下载中…");
    fetch("https://api.github.com/gists/" + syncCfg.gist, { headers: ghHeaders() })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var f = j && j.files && j.files[GIST_FILE];
        if (!f) { if (!quiet) syncSay("云端那个 gist 里没有进度文件", true); return; }
        var parsed = snapParse(f.content);
        if (parsed.err) { if (!quiet) syncSay(parsed.err, true); return; }
        var n = snapApply(parsed.snap);
        syncCfg.at = Date.now();
        syncCfgSave();
        syncPaint();
        syncSay("已恢复 " + n + " 项（备份于 " + snapWhen(parsed.snap.savedAt) + "）");
      })
      .catch(function () { if (!quiet) syncSay("下载失败：网络不通", true); });
  }

  var syncTimer = null;
  // 学一会儿就自动传一次；没设置 token 或断网就静默跳过
  function syncAutoPush() {
    if (!syncCfg.auto || !syncCfg.token) return;
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(syncUp, 6000);
  }

  /* ---------- 文本 / 文件通道 ---------- */

  function syncExport() {
    if (!els.syncText) return;
    els.syncText.value = JSON.stringify(snapMake());
    syncSay("已导出到下面的文本框，可以复制到别处保存");
  }

  function syncImport() {
    if (!els.syncText) return;
    var parsed = snapParse(els.syncText.value);
    if (parsed.err) { syncSay(parsed.err, true); return; }
    var n = snapApply(parsed.snap);
    syncSay("已恢复 " + n + " 项（备份于 " + snapWhen(parsed.snap.savedAt) + "）");
  }

  function syncFile() {
    try {
      var blob = new Blob([JSON.stringify(snapMake())], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "chat-prac-progress-" + snapStamp() + ".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      syncSay("已保存到「下载 / 文件」里；换设备时打开这个文件，把内容贴进下面再点恢复");
    } catch (e) {
      syncSay("这个浏览器不支持直接存文件，请用「导出到文本」", true);
    }
  }

  function initSync() {
    if (!els.syncToggle) return;
    syncPaint();
    els.syncToggle.addEventListener("click", function () {
      var open = els.syncBody.hidden;
      els.syncBody.hidden = !open;
      els.syncToggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) syncSay("");
    });
    els.syncToken.addEventListener("change", function () {
      syncCfg.token = String(els.syncToken.value || "").trim();
      syncCfgSave();
      syncPaint();
      syncSay(syncCfg.token ? "token 已保存；换设备粘同一个就能把进度拿回来" : "已清空 token");
      if (syncCfg.token) syncDown(true);   // 新设备接管时先试着把云端进度拉下来
    });
    els.syncUp.addEventListener("click", syncUp);
    els.syncDown.addEventListener("click", syncDown);
    els.syncAuto.addEventListener("click", function () {
      syncCfg.auto = !syncCfg.auto;
      syncCfgSave();
      syncPaint();
      syncSay(syncCfg.auto ? "每次学习后会自动上传" : "已关闭自动上传");
    });
    els.syncExport.addEventListener("click", syncExport);
    els.syncImport.addEventListener("click", syncImport);
    els.syncFile.addEventListener("click", syncFile);
  }

  /* ============================== 顶部栏 / 输入区联动 ============================== */
  // 手机上不自动聚焦：程序化 focus() 会把软键盘顶上来，挡住半个屏幕。
  // 只有"鼠标类"设备（桌面）才自动聚焦，触屏设备一律等用户自己点输入框。
  function focusInputIfDesktop() {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    if (els.composer && els.composer.hidden) return;   // 学习模式没有输入框
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    els.input.focus();
  }

  function syncChrome() {
    var cfg = composerConfig();
    els.viewTitle.textContent = TAB_TITLES[state.tab] || "Chat Prac";
    els.composerHint.textContent = cfg.hint;
    els.input.placeholder = cfg.ph;
    els.input.value = state.drafts[state.tab] || "";
    autoGrow();
    focusInputIfDesktop();
  }

  /* 地址栏定位：#words / #sentences / #practice / #dialogue（便于分享链接，也方便打包成 App 时做深链） */
  function readHashTab() {
    var hash = (window.location && window.location.hash || "").replace(/^#\/?/, "");
    return TAB_TITLES[hash] ? hash : null;
  }

  function writeHash(tab) {
    if (!window.location) return;
    if ((window.location.hash || "").replace(/^#\/?/, "") === tab) return;
    try {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", "#" + tab);
      } else {
        window.location.hash = tab;
      }
    } catch (e) { /* file:// 下个别浏览器会拒绝，忽略即可 */ }
  }

  /* ============================== 模式：查询 / 学习 ============================== */
  // 只更新导航与按钮的显示，不动当前板块（避免和 switchTab 互相递归）
  function applyModeUi() {
    var allowed = tabsForMode(state.mode);
    els.app.classList.toggle("is-study", state.mode === "study");
    $$(".nav-item", els.nav).forEach(function (btn) {
      var modes = (btn.getAttribute("data-modes") || "").split(/\s+/);
      btn.hidden = modes.indexOf(state.mode) < 0;
      btn.classList.toggle("is-active", btn.getAttribute("data-tab") === state.tab);
    });
    $$(".mode-btn", els.modeSwitch).forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-mode") === state.mode);
    });
    return allowed;
  }

  function initMode() {
    var saved = null;
    try { saved = localStorage.getItem("chatprac-mode"); } catch (e) {}
    if (saved === "study" || saved === "search") state.mode = saved;
  }

  // 恢复快照后用：把模式重新读一遍并刷新界面（幂等，可以重复调用）
  function initModeState() {
    initMode();
    var allowed = applyModeUi();
    if (allowed.indexOf(state.tab) < 0) {
      state.tab = allowed[0] || "words";
      Object.keys(els.views).forEach(function (key) { els.views[key].hidden = key !== state.tab; });
    }
    syncChrome();
  }

  function saveMode() {
    try { localStorage.setItem("chatprac-mode", state.mode); } catch (e) {}
  }

  function setMode(mode) {
    if (mode !== "search" && mode !== "study") return;
    if (state.mode === mode) { closeMenu(); return; }
    state.mode = mode;
    saveMode();
    var allowed = applyModeUi();
    if (allowed.indexOf(state.tab) < 0) {
      switchTab("words");
    } else {
      renderCurrent();
      syncChrome();
      renderStudyProgress();
    }
    els.viewport.scrollTop = 0;
    closeMenu();
  }

  // 当前板块该由哪个渲染函数负责
  function renderCurrent() {
    if (state.tab === "words") renderWords();
    else if (state.tab === "sentences") renderSentences();
    else if (state.tab === "dialogue") renderDialogues();
    // practice 是聊天界面，重渲染会丢记录，这里不动
  }

  function switchTab(tab) {
    if (!TAB_TITLES[tab]) return;

    // 该板块不属于当前模式时（比如从深链进来），自动切到对应模式
    if (tabsForMode(state.mode).indexOf(tab) < 0) {
      state.mode = tabsForMode("study").indexOf(tab) >= 0 ? "study" : "search";
      saveMode();
    }
    applyModeUi();

    state.drafts[state.tab] = els.input.value;

    state.tab = tab;
    Object.keys(els.views).forEach(function (key) {
      els.views[key].hidden = key !== tab;
    });
    $$(".nav-item", els.nav).forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-tab") === tab);
    });

    if (tab === "practice") els.chatLog.scrollTop = els.chatLog.scrollHeight;

    // 渲染是随"模式 + 板块"变的，所以切过去要重新渲染一次
    renderCurrent();

    syncChrome();
    renderStudyProgress();
    writeHash(tab);
    closeMenu();
    els.viewport.scrollTop = 0;
  }

  /* ============================== 发送 ============================== */
  function handleSend() {
    var text = els.input.value.trim();

    if (state.tab === "words") {
      state.wordQuery = text;
      renderWords();
      els.viewport.scrollTop = 0;
      return;
    }

    if (state.tab === "sentences") {
      state.sentQuery = text;
      renderSentences();
      els.viewport.scrollTop = 0;
      return;
    }

    if (state.tab === "dialogue") {
      state.talkQuery = text;
      renderDialogues();
      els.viewport.scrollTop = 0;
      return;
    }

    // 对话练习
    if (!text || state.busy) return;
    state.drafts.practice = "";
    els.input.value = "";
    autoGrow();
    sendChat(text);
  }

  function handleInput() {
    state.drafts[state.tab] = els.input.value;
    autoGrow();
    // 学习模式的单词板块不做实时筛选（输入框用于加词），其余检索板块支持实时筛选
    if (state.tab === "words") {
      if (state.mode === "study") return;
      state.wordQuery = els.input.value;
      renderWords();
    } else if (state.tab === "sentences") {
      state.sentQuery = els.input.value;
      renderSentences();
    } else if (state.tab === "dialogue") {
      state.talkQuery = els.input.value;
      renderDialogues();
    }
  }

  /* ============================== 事件绑定 ============================== */
  function bind() {
    $$(".nav-item", els.nav).forEach(function (btn) {
      btn.addEventListener("click", function () {
        switchTab(btn.getAttribute("data-tab"));
      });
    });

    // 模式切换（查询 / 学习）
    $$(".mode-btn", els.modeSwitch).forEach(function (btn) {
      btn.addEventListener("click", function () {
        setMode(btn.getAttribute("data-mode"));
      });
    });

    // 学习模式·单词板块：整块用事件委托，重渲染后不用重新绑定
    els.vocabBoard.addEventListener("click", onVocabClick);
    els.vocabBoard.addEventListener("input", onVocabInput);
    els.vocabBoard.addEventListener("change", onVocabChange);
    els.vocabBoard.addEventListener("keydown", onVocabKeydown);

    // 对话板块（学习模式）：整块事件委托
    els.dialogueList.addEventListener("click", onDialogueClick);

    els.themeToggle.addEventListener("click", toggleTheme);
    els.sendBtn.addEventListener("click", handleSend);
    els.input.addEventListener("input", handleInput);

    // 侧边栏抽屉：三条横线拉出，点遮罩或按 Esc 收起
    els.menuBtn.addEventListener("click", toggleMenu);
    els.backdrop.addEventListener("click", closeMenu);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
    bindEdgeSwipe();   // 手机上从左边往右滑也能拉出

    els.input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        handleSend();
      }
    });
  }

  /* ============================== 启动 ============================== */
  // 离线缓存：部署到 http(s) 后生效，手机加到主屏幕即可断网使用
  function registerServiceWorker() {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    if (!window.location || (window.location.protocol !== "http:" && window.location.protocol !== "https:")) return;
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {
        /* 缓存失败不影响正常使用 */
      });
    });
  }

  function init() {
    vocab = vLoad();

    // 装成 App 后多半是「从后台恢复」而不是重新加载页面，所以回到前台要再查一次日期，
    // 不然新的一天不会发新词（用了一整天还是一批任务）。
    try {
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) return;
        if (vRollDay()) { vs.forced = false; renderVocab(); }
      });
      window.addEventListener("focus", function () {
        if (vRollDay()) { vs.forced = false; renderVocab(); }
      });
    } catch (e) { /* 没有 DOM 就算了 */ }

    initTheme();
    initSync();
    // 设置过同步的话，启动时静默拉一次：清缓存或换设备后一打开就自动恢复进度
    if (syncCfg.token && syncCfg.gist) syncDown(true);
    initStandalone();
    initMode();
    applyModeUi();
    renderWords();
    renderSentences();
    renderDialogues();
    bind();
    registerServiceWorker();

    var deepLink = readHashTab();
    if (deepLink && deepLink !== state.tab) {
      switchTab(deepLink);       // 深链可能属于另一种模式，switchTab 里会自动切模式
    } else {
      syncChrome();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
