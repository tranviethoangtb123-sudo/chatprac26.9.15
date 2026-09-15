/* ============================================================================
   备用提交通道：github.com:443 连不上时，改走 Contents API（api.github.com）
   ----------------------------------------------------------------------------
   什么时候用：`git push` 报 "Connection was reset" / "Failed to connect to
   github.com:443"，但 api.github.com 还通（这台机器上出现过这种情况）。
   代价：API 提交会产生**不同的提交哈希**，本地 main 会和远端分叉。
        网络恢复后执行 `git fetch origin && git reset --hard origin/main` 重新对齐。

   用法（必须先用 PowerShell 准备好清单与提交信息，脚本本身不 spawn 子进程）：
     git show --name-status --format= HEAD | Set-Content .secrets\_list.txt -Encoding UTF8
     git log -1 --format="%s%n%n%b" | Set-Content .secrets\_msg.txt -Encoding UTF8
     node tools/api-sync.js .secrets\_list.txt .secrets\_msg.txt
   ============================================================================ */
const fs = require("fs");
const path = require("path");

const OWNER = "tranviethoangtb123-sudo";
const REPO = "chatprac26.9.15";
const ROOT = path.join(__dirname, "..");
const TOKEN = fs.readFileSync(path.join(ROOT, ".secrets", "github-token.txt"), "utf8").trim();

const H = {
  "User-Agent": "chat-prac",
  "Accept": "application/vnd.github+json",
  "Authorization": "Bearer " + TOKEN,
  "X-GitHub-Api-Version": "2022-11-28"
};
const API = `https://api.github.com/repos/${OWNER}/${REPO}/contents/`;

// 文件清单与提交信息由 PowerShell 预先写好（沙箱里 Node 不能 spawn 子进程）
// 用法：node tools/_api-sync.js <列表文件> <提交信息文件>
const LIST_FILE = process.argv[2];
const MSG_FILE = process.argv[3];
if (!LIST_FILE || !MSG_FILE) {
  console.error("用法：node tools/_api-sync.js <name-status 列表文件> <提交信息文件>");
  process.exit(1);
}

const status = fs.readFileSync(path.join(ROOT, LIST_FILE), "utf8").split("\n").map((s) => s.trim()).filter(Boolean);
const message = fs.readFileSync(path.join(ROOT, MSG_FILE), "utf8").trim();

async function currentSha(rel) {
  const r = await fetch(API + encodeURI(rel), { headers: H });
  if (!r.ok) return null;
  return (await r.json()).sha;
}

(async () => {
  console.log("提交信息：" + message.split("\n")[0]);
  console.log("文件数：" + status.length + "\n");

  let ok = 0;
  const failed = [];

  for (const line of status) {
    const parts = line.split("\t");
    const kind = parts[0][0];          // A / M / D / R
    const rel = parts[parts.length - 1]; // 重命名时取新路径

    if (kind === "D") {
      const sha = await currentSha(rel);
      if (!sha) { console.log("– 跳过（远端已无此文件）：" + rel); continue; }
      const res = await fetch(API + encodeURI(rel), {
        method: "DELETE",
        headers: H,
        body: JSON.stringify({ message, sha })
      });
      if (res.ok) { ok++; console.log("✔ 删除 " + rel); }
      else { failed.push(rel); console.log("✗ 删除失败 " + rel + " HTTP " + res.status + " " + (await res.text()).slice(0, 160)); }
      continue;
    }

    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) { console.log("– 本地不存在，跳过：" + rel); continue; }
    const buf = fs.readFileSync(abs);
    const sha = await currentSha(rel);

    const res = await fetch(API + encodeURI(rel), {
      method: "PUT",
      headers: H,
      body: JSON.stringify({
        message,
        content: buf.toString("base64"),
        ...(sha ? { sha } : {})
      })
    });
    if (res.ok) { ok++; console.log("✔ " + (kind === "A" ? "新增" : "更新") + " " + rel + "  (" + (buf.length / 1024).toFixed(1) + " KB)"); }
    else { failed.push(rel); console.log("✗ " + rel + " HTTP " + res.status + " " + (await res.text()).slice(0, 160)); }
  }

  console.log("\n成功 " + ok + " 个" + (failed.length ? "，失败 " + failed.length + " 个：" + failed.join("、") : "，全部完成"));
  if (failed.length) process.exit(1);
})().catch((e) => { console.error("失败：" + e.message); process.exit(1); });
