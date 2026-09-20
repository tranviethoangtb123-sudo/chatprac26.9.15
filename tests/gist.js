/* 云同步（GitHub Gist）测试：验证「清缓存 / 换手机」真的能靠云端把进度拿回来，
   并且新设备**不会**用一份空进度把云端备份冲掉。
   做法：把 fetch 换成内存版假 Gist API，然后真实加载 app.js 走完整流程：
     ① 旧手机第一次配置 token → 学几个词 → 自动上传 → 云端出现进度
     ② 新手机（localStorage 清空）粘同一个 token，但**下载失败**（断网）
        → 此时学 1 个词触发自动上传 → 必须被拦住，云端原进度不能没
     ③ 新手机下载成功 → 进度完整恢复；之后再学 → 云端继续增长
     ④ 云端始终保留带时间的历史副本，且只留最近 3 份
   运行：node tests/gist.js */
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
    querySelectorAll() { return []; },
    createElement(t) { return makeEl(t); },
    addEventListener() {}
  };
}

/* ---------------- 内存版假 Gist API ---------------- */
let gists = {};        // id -> { id, files: { name: content } }
let nextId = 1;
let offline = false;   // 打开 = 所有请求都失败（模拟断网）
let calls = [];

function fakeFetch(url, opts) {
  const u = String(url);
  const method = (opts && opts.method) || "GET";
  calls.push(method + " " + u.replace("https://api.github.com", ""));
  if (offline) return Promise.reject(new Error("网络不通"));

  if (u === "https://api.github.com/gists" && method === "POST") {
    const body = JSON.parse(opts.body);
    const id = "g" + (nextId++);
    gists[id] = { id, files: {} };
    Object.keys(body.files || {}).forEach((n) => {
      if (body.files[n]) gists[id].files[n] = body.files[n].content;
    });
    return Promise.resolve({ ok: true, status: 201, json: () => Promise.resolve({ id }) });
  }
  if (u === "https://api.github.com/gists?per_page=100") {
    const list = Object.keys(gists).map((id) => ({ id, files: Object.fromEntries(Object.keys(gists[id].files).map((n) => [n, true])) }));
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(list) });
  }
  const m = /^https:\/\/api\.github\.com\/gists\/(g\d+)$/.exec(u);
  if (m) {
    const g = gists[m[1]];
    if (!g) return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({ message: "Not Found" }) });
    if (method === "GET") {
      const files = {};
      Object.keys(g.files).forEach((n) => { files[n] = { content: g.files[n] }; });
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ id: g.id, files }) });
    }
    if (method === "PATCH") {
      const body = JSON.parse(opts.body);
      Object.keys(body.files || {}).forEach((n) => {
        if (body.files[n] === null) delete g.files[n];
        else g.files[n] = body.files[n].content;
      });
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ id: g.id }) });
    }
  }
  return Promise.resolve({ ok: false, status: 400, json: () => Promise.resolve({ message: "unexpected " + method + " " + u }) });
}

/* ---------------- 假时钟：让多次上传落在不同分钟（否则历史副本会同名互相覆盖） ---------------- */
const RealDate0 = Date;
let NOW = new RealDate0(2026, 0, 1, 9, 0, 0).getTime();
class FakeDate extends RealDate0 {
  constructor(...a) { super(...(a.length ? a : [NOW])); }
  static now() { return NOW; }
}
globalThis.Date = FakeDate;
const advance = (min) => { NOW += min * 60000; };

/* ---------------- 定时器改成手动触发（自动同步是 6 秒后再传） ---------------- */
const timers = [];
globalThis.setTimeout = (fn) => { timers.push(fn); return timers.length; };
globalThis.clearTimeout = () => {};
function flushAutoSync() {
  const pending = timers.splice(0, timers.length);
  pending.forEach((fn) => fn());
  return pending.length;
}
const settle = () => new Promise((r) => setImmediate(r));
async function flushAndSettle() { flushAutoSync(); await settle(); await settle(); await settle(); }

/* ---------------- 环境 ---------------- */
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
globalThis.fetch = fakeFetch;
globalThis.Blob = function () {};
globalThis.URL = { createObjectURL: () => "blob:x", revokeObjectURL() {} };

["data.words.js", "data.vocab.js", "data.collocations.js", "data.phon.js", "data.sentences.js", "data.dialogues.js", "data.practice.js", "data.scenarios.js"]
  .forEach((f) => require(path.join(root, "assets/js", f)));
const APP = fs.readFileSync(path.join(root, "assets/js/app.js"), "utf8");

const VKEY = "chatprac-vocab-study", GKEY = "chatprac-dialogue-goal";
const vState = () => JSON.parse(store[VKEY] || "{}");
const gState = () => JSON.parse(store[GKEY] || '{"mark":{}}');
const board = () => byId.vocabBoard.innerHTML;
const vclick = (attrs) => fire(byId.vocabBoard, "click", { target: makeEl("button", attrs) });
const dclick = (attrs) => fire(byId.dialogueList, "click", { target: makeEl("button", attrs) });
const learnOne = () => {
  const w = (board().match(/data-vword="([^"]+)"/) || [])[1];
  if (!w) return false;
  vclick({ "data-vans": "know", "data-vword": w });
  return true;
};
const cloudProgress = () => {
  const g = Object.keys(gists)[0];
  if (!g) return null;
  const raw = gists[g].files["chat-prac-progress.json"];
  if (!raw) return null;
  const snap = JSON.parse(raw);
  const v = JSON.parse(snap.data[VKEY] || "{}");
  const d = JSON.parse(snap.data[GKEY] || "{}");
  return {
    learned: Object.keys(v.done || {}).length,
    custom: (v.custom || []).length,
    marks: Object.keys(d.mark || {}).length,
    histFiles: Object.keys(gists[g].files).filter((n) => /^chat-prac-progress-\d{8}-\d{4}\.json$/.test(n)).length,
    allFiles: Object.keys(gists[g].files).length
  };
};
const TOKEN = { token: "ghp_faketoken", gist: "", auto: true, at: 0 };

/* ============================ ① 旧手机：首次配置 → 学习 → 自动上传 ============================ */
(async () => {
  store["chatprac-mode"] = "study";
  store["chatprac-sync"] = JSON.stringify(TOKEN);
  vm.runInThisContext(APP, { filename: "app.js" });

  for (let i = 0; i < 5; i++) if (!learnOne()) { problems.push("第 " + (i + 1) + " 个词没渲染出来"); break; }
  dclick({ "data-dlgpick": "1" });
  dclick({ "data-dlgseg": "s06-01:0" });
  dclick({ "data-dlgmark": "ok", "data-dlgkey": "s06-01:0" });
  await flushAndSettle();

  const after1 = cloudProgress();
  if (!after1) { problems.push("自动上传没建出云端 Gist"); }
  else {
    if (after1.learned !== 5) problems.push("云端只存了 " + after1.learned + " 个词的进度（应为 5）");
    if (after1.marks !== 1) problems.push("云端没存到对话掌握记录");
    if (after1.histFiles !== 1) problems.push("云端历史副本数量不对：" + after1.histFiles);
  }
  console.log("  旧手机：学 5 个词 + 掌握 1 段 → 自动上传到云端 Gist ✔  " +
    (after1 ? "云端 learned=" + after1.learned + " marks=" + after1.marks + " 文件 " + after1.allFiles + " 个" : ""));

  /* ============================ ② 新手机 + 断网：不能拿空进度覆盖云端 ============================ */
  const cloudBefore = cloudProgress();
  globalThis.localStorage.clear();          // 换手机 / 清缓存：本机什么都没有
  freshDom();
  offline = true;                           // 新手机还没连上（下载失败）
  store["chatprac-mode"] = "study";
  store["chatprac-sync"] = JSON.stringify(TOKEN);
  vm.runInThisContext(APP, { filename: "app.js" });

  // 模拟：粘 token（触发一次静默下载 → 失败）
  store["chatprac-sync"] = JSON.stringify(TOKEN);
  byId.syncToken.value = "ghp_faketoken";
  fire(byId.syncToken, "change", {});
  await settle();
  if (gState().mark["s06-01:0"]) problems.push("断网时不该凭空有云端进度（测试前提不对）");

  learnOne();                               // 断网状态下学了一个词 → 会安排自动上传
  await flushAndSettle();
  const cloudStillOffline = cloudProgress();
  if (!cloudStillOffline || cloudStillOffline.learned !== cloudBefore.learned) {
    problems.push("断网时自动上传竟然改动了云端：" + (cloudStillOffline ? cloudStillOffline.learned : "（没了）"));
  } else {
    console.log("  新手机 + 一直断网：上传直接放弃（" + byId.syncMsg.textContent + "），云端仍有 " +
      cloudStillOffline.learned + " 个词 ✔");
  }

  // 更危险的一种：下载那一下失败，但 6 秒后网络恢复了 —— 上传真的会发出去，
  // 这时必须靠「云端更全就别传」的保护拦住，否则云端备份就被这份空进度冲掉了
  offline = false;
  learnOne();
  await flushAndSettle();
  const cloudAfterFail = cloudProgress();
  if (!cloudAfterFail || cloudAfterFail.learned !== cloudBefore.learned) {
    problems.push("网络恢复后，新手机把云端备份冲掉了：云端 learned " +
      (cloudAfterFail ? cloudAfterFail.learned : "（没了）") + "，原为 " + cloudBefore.learned);
  } else if (!/云端进度比本机多/.test(byId.syncMsg.textContent)) {
    problems.push("拦住了但没给提示，用户不知道该怎么办：" + byId.syncMsg.textContent);
  } else {
    console.log("  新手机 + 网络恢复：自动上传被拦住（云端仍有 " + cloudAfterFail.learned + " 个词），提示：" +
      byId.syncMsg.textContent.slice(0, 30) + "… ✔");
  }

  /* ============================ ③ 新手机 + 联网：下载恢复，然后继续增长 ============================ */
  byId.syncToken.value = "ghp_faketoken";
  fire(byId.syncToken, "change", {});
  await settle(); await settle();
  if (Object.keys(vState().done || {}).length !== 5) {
    problems.push("新手机下载后只恢复了 " + Object.keys(vState().done || {}).length + " 个词（应为 5）");
  }
  if (!gState().mark["s06-01:0"]) problems.push("新手机下载后对话掌握没恢复");
  console.log("  新手机 + 联网：粘同一个 token 就自动找回进度（" +
    Object.keys(vState().done || {}).length + " 个词 + 对话掌握）✔");

  learnOne();                               // 恢复之后继续学，云端应继续增长
  await flushAndSettle();
  const after3 = cloudProgress();
  if (!after3 || after3.learned < 6) {
    problems.push("恢复后继续学，云端没有跟着涨：learned=" + (after3 ? after3.learned : "?"));
  } else {
    console.log("  恢复后继续学：云端跟着涨到 " + after3.learned + " 个词 ✔");
  }

  /* ============================ ④ 历史副本：跨分钟上传，最多留 3 份 ============================ */
  offline = false;
  for (let i = 0; i < 5; i++) { advance(7); learnOne(); await flushAndSettle(); }
  const after4 = cloudProgress();
  if (!after4) problems.push("反复上传后云端进度文件不见了");
  else {
    if (after4.histFiles !== 3) problems.push("历史副本应只留 3 份，实际 " + after4.histFiles + " 份");
    if (after4.allFiles !== 4) problems.push("云端文件数应为 1 份进度 + 3 份副本 = 4，实际 " + after4.allFiles);
    // 最新那份副本必须就是当前进度（出事时靠它翻回来）
    const g = Object.keys(gists)[0];
    const histNames = Object.keys(gists[g].files).filter((n) => /^chat-prac-progress-\d{8}-\d{4}\.json$/.test(n)).sort();
    if (!histNames.length) {
      problems.push("云端一份历史副本都没有（进度被覆盖了就没法翻回来）");
    } else {
      let latest = null;
      try { latest = JSON.parse(gists[g].files[histNames[histNames.length - 1]]); } catch (e) { latest = null; }
      const latestLearned = latest ? Object.keys(JSON.parse(latest.data[VKEY] || "{}").done || {}).length : -1;
      if (latestLearned !== after4.learned) {
        problems.push("最新历史副本不是当前进度（副本 " + latestLearned + " vs 当前 " + after4.learned + "）");
      }
      console.log("  跨分钟上传 5 次：云端 1 份进度 + " + after4.histFiles + " 份历史副本（最新那份=当前进度）✔");
    }
  }

  /* ============================ ⑤ 手动上传时若云端更全，要先确认 ============================ */
  globalThis.localStorage.clear();
  freshDom();
  store["chatprac-mode"] = "study";
  store["chatprac-sync"] = JSON.stringify(TOKEN);
  let asked = "";
  globalThis.confirm = (msg) => { asked = msg; return false; };   // 用户点了「取消」
  vm.runInThisContext(APP, { filename: "app.js" });
  fire(byId.syncUp, "click", {});
  await settle(); await settle(); await settle();
  const after5 = cloudProgress();
  if (!/云端进度比本机多/.test(asked)) problems.push("手动上传时没有提醒云端更全");
  if (!after5 || after5.learned < 6) problems.push("用户取消后云端进度不该变，实际 learned=" + (after5 ? after5.learned : "?"));
  console.log("  手动上传 + 云端更全：先弹确认；点取消后云端进度原封不动 ✔");

  console.log("");
  if (problems.length) {
    console.log("发现问题 " + problems.length + " 处：");
    console.log(problems.map((s) => "  ✗ " + s).join("\n"));
    process.exit(1);
  }
  console.log("云同步检查通过 ✅ （换手机能拿回进度；新设备断网时不会把云端备份冲掉）");
})().catch((e) => {
  console.error("测试自身出错：" + e.message + "\n" + e.stack);
  process.exit(1);
});
