/* ==========================================================================
   Chat Prac — 交互逻辑
   板块：单词 / 句子和对话 / 对话练习
   底部统一为「对话框 + 发送键」：在检索板块它是搜索框，在对话练习里它是聊天输入框。
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
    letter: "A",              // 学习模式下当前选中的字母
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
      return { ph: "搜索…", hint: "对话板块：内容待定" };
    }
    if (state.mode === "study") {
      return { ph: "搜索单词：abandon、机会、/əˈbændən/…", hint: "Enter 搜索 · 学习模式：" + DATA.words.length + " 词按 A-Z 排列，含固定搭配" };
    }
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
    letterBar: $("#letterBar"),
    letterBubble: $("#letterBubble"),
    wordList: $("#wordList"),
    wordEmpty: $("#wordEmpty"),
    sentList: $("#sentList"),
    sentEmpty: $("#sentEmpty"),
    dialogueList: $("#dialogueList"),
    dialogueEmpty: $("#dialogueEmpty"),
    chatLog: $("#chatLog"),
    input: $("#input"),
    sendBtn: $("#sendBtn"),
    composerHint: $("#composerHint")
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
  // 查询模式：没输入时右侧留空，输入后才出结果
  // 学习模式：没输入时按 A-Z 展示（带固定搭配），输入后变成全库检索

  var letterIndex = null;

  function letters() {
    if (!letterIndex) {
      letterIndex = {};
      (DATA.words || []).forEach(function (w) {
        var L = w.w.charAt(0).toUpperCase();
        (letterIndex[L] = letterIndex[L] || []).push(w);
      });
      Object.keys(letterIndex).forEach(function (L) {
        letterIndex[L].sort(function (a, b) { return a.w < b.w ? -1 : (a.w > b.w ? 1 : 0); });
      });
    }
    return Object.keys(letterIndex).sort();
  }

  function wordsOfLetter(L) {
    letters();
    return letterIndex[L] || [];
  }

  function collocationsOf(word) {
    return (DATA.collocations && DATA.collocations[word]) || null;
  }

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

  // 学习模式的紧凑行：英语 + 音标 + 中文，下面一行是词典里的固定搭配
  function wordRowHtml(it, q) {
    var col = collocationsOf(it.w);
    var html = '<div class="wrow"><div class="wrow-main">' +
      '<span class="w-en">' + highlight(it.w, q) + '</span>' +
      '<span class="w-ph">' + highlight(it.ph, q) + '</span>' +
      '<span class="w-cn">' + highlight(it.cn, q) + '</span>' +
      '</div>';
    if (col && col.length) {
      html += '<div class="w-phrase">' + col.map(function (c) {
        return '<span class="w-phrase-en">' + esc(c[0]) + '</span> ' + esc(c[1]);
      }).join(" · ") + '</div>';
    }
    return html + '</div>';
  }

  // 右侧的 A-Z 索引（复刻微信通讯录：纯字母，没有底色和边框）
  function renderLetterBar() {
    var all = letters();
    if (all.indexOf(state.letter) < 0) state.letter = all[0] || "A";
    els.letterBar.innerHTML = all.map(function (L) {
      return '<button type="button" class="letter-item" data-letter="' + esc(L) + '">' + esc(L) + '</button>';
    }).join("");
  }

  var bubbleTimer = null;
  function showLetterBubble(L) {
    els.letterBubble.textContent = L;
    els.letterBubble.hidden = false;
    if (bubbleTimer) clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () { els.letterBubble.hidden = true; }, 700);
  }

  function jumpToLetter(L) {
    if (!L) return;
    if (L !== state.letter) {
      state.letter = L;
      renderWords();
      els.viewport.scrollTop = 0;
    }
    showLetterBubble(L);
  }

  // 手指/鼠标在索引上滑过时，取当前位置对应的字母
  function letterFromPoint(x, y) {
    if (typeof document.elementFromPoint !== "function") return null;
    var el = document.elementFromPoint(x, y);
    if (!el || !el.closest) return null;
    var item = el.closest(".letter-item");
    return item ? item.getAttribute("data-letter") : null;
  }

  function renderWords() {
    var q = state.wordQuery.trim();
    var study = state.mode === "study";

    // 学习模式、没输入 → 按字母浏览（紧凑行 + 固定搭配）
    if (study && !q) {
      els.letterBar.hidden = false;
      renderLetterBar();
      var list = wordsOfLetter(state.letter);
      els.wordEmpty.hidden = list.length > 0;
      els.wordList.innerHTML = list.map(function (it) { return wordRowHtml(it, ""); }).join("");
      return;
    }

    els.letterBar.hidden = true;

    if (!q) {
      els.wordList.innerHTML = "";
      els.wordEmpty.hidden = true;
      return;
    }

    var hits = (DATA.words || []).filter(function (it) {
      return matches(q, [it.w, it.cn, it.ph, it.pos]);
    });

    els.wordEmpty.hidden = hits.length > 0;
    els.wordList.innerHTML = hits.map(function (it) {
      return study ? wordRowHtml(it, q) : wordCardHtml(it, q);
    }).join("");
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

  /* ==================== 板块四：对话（学习模式，内容待定） ==================== */
  function renderDialogues() {
    // 这一块先留空，等具体方案确定后再做
    els.dialogueList.innerHTML = "";
    els.dialogueEmpty.hidden = true;
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

  /* ============================== 顶部栏 / 输入区联动 ============================== */
  // 手机上不自动聚焦：程序化 focus() 会把软键盘顶上来，挡住半个屏幕。
  // 只有"鼠标类"设备（桌面）才自动聚焦，触屏设备一律等用户自己点输入框。
  function focusInputIfDesktop() {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
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
    // 检索类板块支持实时筛选
    if (state.tab === "words") {
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

    // 学习模式的 A-Z 索引：点一下跳到该字母，按住上下滑也切字母
    els.letterBar.addEventListener("click", function (e) {
      var item = e.target && e.target.closest ? e.target.closest(".letter-item") : null;
      if (item) jumpToLetter(item.getAttribute("data-letter"));
    });

    function indexTouch(e) {
      var t = e.touches && e.touches[0];
      var L = null;
      if (t) L = letterFromPoint(t.clientX, t.clientY);
      if (!L && e.target && e.target.closest) {
        var item = e.target.closest(".letter-item");
        if (item) L = item.getAttribute("data-letter");
      }
      if (L) jumpToLetter(L);
    }
    els.letterBar.addEventListener("touchstart", indexTouch, { passive: true });
    els.letterBar.addEventListener("touchmove", indexTouch, { passive: true });

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
    initTheme();
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
