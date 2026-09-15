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
    tab: "words",
    wordQuery: "",
    sentQuery: "",
    drafts: { words: "", sentences: "", practice: "" },
    chat: [],
    replyIndex: {},
    busy: false
  };

  var TABS = {
    words: {
      title: "单词",
      placeholder: "搜索单词：abandon、机会、/əˈbændən/…",
      hint: "Enter 搜索 · Shift + Enter 换行"
    },
    sentences: {
      title: "句子和对话",
      placeholder: "搜索句子或对话：酒店、airport、面试…",
      hint: "Enter 搜索 · Shift + Enter 换行"
    },
    practice: {
      title: "对话练习",
      placeholder: "用英文说点什么，Enter 发送…",
      hint: "Enter 发送 · Shift + Enter 换行"
    }
  };

  /* ------------------------------ DOM ------------------------------ */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var els = {
    app: $("#app"),
    sidebar: $("#sidebar"),
    backdrop: $("#backdrop"),
    menuBtn: $("#menuBtn"),
    nav: $("#nav"),
    viewTitle: $("#viewTitle"),
    themeToggle: $("#themeToggle"),
    viewport: $("#viewport"),
    views: {
      words: $("#view-words"),
      sentences: $("#view-sentences"),
      practice: $("#view-practice")
    },
    wordList: $("#wordList"),
    wordEmpty: $("#wordEmpty"),
    sentList: $("#sentList"),
    sentEmpty: $("#sentEmpty"),
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

  /* ============================== 板块一：单词 ============================== */
  // 没有输入时右侧留空，只有输入后才出现结果
  function renderWords() {
    var q = state.wordQuery.trim();
    if (!q) {
      els.wordList.innerHTML = "";
      els.wordEmpty.hidden = true;
      return;
    }

    var list = DATA.words.filter(function (it) {
      return matches(q, [it.w, it.cn, it.ph, it.pos]);
    });

    els.wordEmpty.hidden = list.length > 0;

    els.wordList.innerHTML = list.map(function (it) {
      return '' +
        '<article class="card">' +
          '<div class="card-top">' +
            '<h3 class="card-word">' + highlight(it.w, q) + '</h3>' +
            '<span class="card-phon">' + highlight(it.ph, q) + '</span>' +
            '<span class="card-pos">' + esc(it.pos) + '</span>' +
          '</div>' +
          '<p class="card-cn">' + highlight(it.cn, q) + '</p>' +
        '</article>';
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
      if (it.lines) {
        return '' +
          '<article class="card">' +
            (it.title ? '<p class="card-title">' + highlight(it.title, q) + '</p>' : '') +
            '<div class="dlg">' +
              it.lines.map(function (l) {
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
      return '' +
        '<article class="card">' +
          '<p class="card-en">' + highlight(it.en, q) + '</p>' +
          '<p class="card-cn-2">' + highlight(it.cn, q) + '</p>' +
        '</article>';
    }).join("");
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
    var cfg = TABS[state.tab];
    els.viewTitle.textContent = cfg.title;
    els.composerHint.textContent = cfg.hint;
    els.input.placeholder = cfg.placeholder;
    els.input.value = state.drafts[state.tab] || "";
    autoGrow();
    focusInputIfDesktop();
  }

  /* 地址栏定位：#words / #sentences / #practice（便于分享链接，也方便打包成 App 时做深链） */
  function readHashTab() {
    var hash = (window.location && window.location.hash || "").replace(/^#\/?/, "");
    return TABS[hash] ? hash : null;
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

  function switchTab(tab) {
    if (!TABS[tab]) return;
    state.drafts[state.tab] = els.input.value;

    state.tab = tab;
    Object.keys(els.views).forEach(function (key) {
      els.views[key].hidden = key !== tab;
    });
    $$(".nav-item", els.nav).forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-tab") === tab);
    });

    if (tab === "practice") els.chatLog.scrollTop = els.chatLog.scrollHeight;

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
    // 检索板块支持实时筛选
    if (state.tab === "words") {
      state.wordQuery = els.input.value;
      renderWords();
    } else if (state.tab === "sentences") {
      state.sentQuery = els.input.value;
      renderSentences();
    }
  }

  /* ============================== 事件绑定 ============================== */
  function bind() {
    $$(".nav-item", els.nav).forEach(function (btn) {
      btn.addEventListener("click", function () {
        switchTab(btn.getAttribute("data-tab"));
      });
    });

    els.themeToggle.addEventListener("click", toggleTheme);
    els.sendBtn.addEventListener("click", handleSend);
    els.input.addEventListener("input", handleInput);

    // 侧边栏抽屉：三条横线拉出，点遮罩或按 Esc 收起
    els.menuBtn.addEventListener("click", toggleMenu);
    els.backdrop.addEventListener("click", closeMenu);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

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
    renderWords();
    renderSentences();
    bind();
    registerServiceWorker();

    var deepLink = readHashTab();
    if (deepLink && deepLink !== state.tab) {
      switchTab(deepLink);
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
