/* ============================================================================
   部署后自检：逐项验证线上站点是否正常
   ----------------------------------------------------------------------------
   用法：node tools/check-live.js
   依赖：本地 git 仓库的 origin 地址（自动解析用户名/仓库名）
   说明：不需要 token（全部是公开资源），也不影响线上内容
   ============================================================================ */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

// 直接读 .git/config 解析 origin 地址（不用子进程：某些受限环境里拿不到子进程输出）
function parseRemote() {
  const cfgPath = path.join(ROOT, ".git", "config");
  let url = "";
  if (fs.existsSync(cfgPath)) {
    const cfg = fs.readFileSync(cfgPath, "utf8");
    const section = cfg.split(/^\[/m).find((s) => s.startsWith('remote "origin"'));
    if (section) {
      const m2 = section.match(/^\s*url\s*=\s*(.+)$/m);
      if (m2) url = m2[1].trim();
    }
  }
  const m = url.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (!m) throw new Error("无法从 origin 解析出 GitHub 用户名/仓库名：" + (url || "(空)"));
  return { owner: m[1], repo: m[2] };
}

const { owner, repo } = parseRemote();
const SITE = `https://${owner}.github.io/${repo}/`;

const FILES = [
  ["", "首页"],
  ["index.html", "首页文件"],
  ["manifest.webmanifest", "PWA 配置"],
  ["sw.js", "离线缓存"],
  ["assets/css/style.css", "样式"],
  ["assets/js/app.js", "交互逻辑"],
  ["assets/js/data.words.js", "查询模式词库"],
  ["assets/js/data.vocab.js", "学习模式词库"],
  ["assets/js/data.collocations.js", "固定搭配"],
  ["assets/js/data.sentences.js", "句子库"],
  ["assets/js/data.dialogues.js", "对话库"],
  ["assets/js/data.practice.js", "练习场景"],
  ["assets/icons/icon-192.png", "图标 192"],
  ["assets/icons/icon-512.png", "图标 512"],
  ["assets/icons/icon-maskable-512.png", "图标 maskable"],
  ["assets/icons/apple-touch-icon.png", "iOS 图标"],
  ["assets/icons/favicon-32.png", "favicon"]
];

(async () => {
  console.log("线上地址：" + SITE + "\n");

  let bad = [];
  for (const [file, label] of FILES) {
    let line;
    try {
      const r = await fetch(SITE + file, { headers: { "User-Agent": "chat-prac-check" } });
      const ok = r.status === 200;
      if (!ok) bad.push(file || "(首页)");
      line = (ok ? "✔ " : "✗ ") + label.padEnd(10) + file.padEnd(36) + "HTTP " + r.status;
    } catch (e) {
      bad.push(file || "(首页)");
      line = "✗ " + label.padEnd(10) + file.padEnd(36) + "请求失败：" + e.message;
    }
    console.log("  " + line);
  }

  // 内容级检查
  console.log("\n内容检查：");
  const html = await (await fetch(SITE, { headers: { "User-Agent": "chat-prac-check" } })).text();
  const checks = [
    ["页面标题是 Chat Prac", html.includes("<title>Chat Prac</title>")],
    ["引用了 manifest", html.includes("manifest.webmanifest")],
    ["引用了 apple-touch-icon", html.includes("apple-touch-icon")],
    ["有抽屉菜单按钮 #menuBtn", html.includes('id="menuBtn"')],
    ["底部只有输入框和发送键", html.includes('id="input"') && html.includes('id="sendBtn"')],
    ["有模式切换（查询/学习）", html.includes('id="modeSwitch"') && html.includes('data-mode="study"')],
    ["有学习模式的单词板块容器", html.includes('id="vocabBoard"')],
    ["加载了学习模式词库", html.includes("data.vocab.js")],
    ["有学习模式的对话板块", html.includes('id="view-dialogue"')],
    ["导航项声明了所属模式", (html.match(/data-modes="/g) || []).length >= 4]
  ];
  checks.forEach(([name, pass]) => {
    if (!pass) bad.push(name);
    console.log("  " + (pass ? "✔ " : "✗ ") + name);
  });

  const manifest = await (await fetch(SITE + "manifest.webmanifest")).json();
  const mOK = manifest.display === "standalone" && (manifest.icons || []).length >= 3;
  if (!mOK) bad.push("manifest 配置");
  console.log("  " + (mOK ? "✔ " : "✗ ") + "manifest：display=" + manifest.display +
    "、方向=" + manifest.orientation + "、图标 " + manifest.icons.length + " 个");

  const sw = await (await fetch(SITE + "sw.js")).text();
  const version = (sw.match(/VERSION\s*=\s*"(v\d+)"/) || [])[1];
  const precache = (sw.match(/"\.\/[^"]*"/g) || []).length;
  console.log("  " + (version ? "✔ " : "✗ ") + "离线缓存版本 " + (version || "未找到") + "，预缓存 " + precache + " 项");
  if (!version) bad.push("sw.js 版本号");

  const words = await (await fetch(SITE + "assets/js/data.words.js", { headers: { "User-Agent": "chat-prac-check" } })).text();
  const count = (words.match(/\{ w: "/g) || []).length;
  console.log("  " + (count > 0 ? "✔ " : "✗ ") + "词库线上共 " + count + " 词");
  if (!count) bad.push("词库内容");

  const colloc = await (await fetch(SITE + "assets/js/data.collocations.js", { headers: { "User-Agent": "chat-prac-check" } })).text();
  const collocCount = (colloc.match(/^  "/gm) || []).length;
  // 固定搭配取自词典的短语词条，不可能覆盖所有词，40% 以上就算正常
  const collocOK = collocCount >= count * 0.4;
  if (!collocOK) bad.push("固定搭配内容");
  console.log("  " + (collocOK ? "✔ " : "✗ ") + "固定搭配线上覆盖 " + collocCount + " 词（词典短语词条，约 " + (collocCount / count * 100).toFixed(0) + "%）");

  console.log("");
  if (bad.length) {
    console.log("有 " + bad.length + " 项异常：" + bad.join("、"));
    process.exit(1);
  }
  console.log("线上站点全部正常 ✅");
})().catch((e) => { console.error("检查失败：" + e.message); process.exit(1); });
