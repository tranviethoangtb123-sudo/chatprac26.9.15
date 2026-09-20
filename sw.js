/* ============================================================================
   Chat Prac 离线缓存（Service Worker）
   ----------------------------------------------------------------------------
   作用：把整个应用（页面、样式、脚本、词库、句子、对话、图标）缓存到手机上，
        断网也能用；只有"对话练习"接 DeepSeek 时才需要联网。
   注意：改了任何文件后，把下面的 VERSION 数字加一，否则手机上还是旧版本。
   ============================================================================ */

const VERSION = "v46";
const CACHE = "chat-prac-" + VERSION;

// 需要离线可用的文件（相对路径，兼容部署在子目录的情况）
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/css/style.css",
  "./assets/js/app.js",
  "./assets/js/data.words.js",
  "./assets/js/data.vocab.js",
  "./assets/js/data.collocations.js",
  "./assets/js/data.sentences.js",
  "./assets/js/data.dialogues.js",
  "./assets/js/data.practice.js",
  "./assets/js/data.scenarios.js",
  "./assets/css/scenarios.css",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/favicon-32.png"
];

// 安装：预缓存全部文件
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 激活：清掉旧版本缓存
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 请求策略：
//   页面/脚本/样式 → 网络优先（联网时永远拿最新的，断网回退到缓存）
//   图片等静态资源 → 缓存优先（基本不变，省流量）
// 之前是全部缓存优先，导致「改了代码、刷新还是旧版」，要刷两次才更新。
const IMMUTABLE = /\.(png|ico)$/;

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // 跨域请求（比如以后调用 DeepSeek 接口）直接放行，不缓存
  if (url.origin !== self.location.origin) return;

  // 静态图片：缓存优先
  if (IMMUTABLE.test(url.pathname)) {
    event.respondWith(
      caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetchAndCache(req))
    );
    return;
  }

  // 其余：网络优先，失败回退缓存（断网也能用）
  event.respondWith(
    fetch(req).then((res) => {
      if (res && res.ok && res.type === "basic") {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy));
      }
      return res;
    }).catch(() =>
      caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match("./index.html"))
    )
  );
});

function fetchAndCache(req) {
  return fetch(req).then((res) => {
    if (res && res.ok && res.type === "basic") {
      const copy = res.clone();
      caches.open(CACHE).then((cache) => cache.put(req, copy));
    }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }));
}
