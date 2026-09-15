/* 临时探查：ECDICT 里的"短语词条"（固定搭配）有多少、能不能按首词挂到词库上 */
const fs = require("fs");
const path = require("path");

const CSV = path.join(__dirname, ".cache", "ecdict.csv");

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false; }
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); field = ""; rows.push(row); row = []; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

console.log("读取词典…");
const rows = parseCsv(fs.readFileSync(CSV, "utf8"));
const header = rows[0].map((h) => h.trim());
const idx = {};
header.forEach((h, i) => { idx[h] = i; });
console.log("总记录 " + (rows.length - 1));

global.window = global;
global.window.CHAT_PRAC_DATA = {};
require(path.join(__dirname, "..", "assets", "js", "data.words.js"));
const bank = new Set(global.window.CHAT_PRAC_DATA.words.map((w) => w.w));
console.log("词库 " + bank.size + " 词");

// 短语词条：全是小写字母和空格的 2-4 词条目
const byFirst = new Map();
const byAnyWord = new Map();
let phraseCount = 0;
const samples = { take: [], look: [], in: [], make: [], give: [], at: [] };

for (let r = 1; r < rows.length; r++) {
  const row = rows[r];
  const word = (row[idx.word] || "").trim();
  if (!/^[a-z][a-z' -]*$/.test(word) || word.indexOf(" ") < 0) continue;
  const parts = word.split(/\s+/);
  if (parts.length < 2 || parts.length > 5) continue;
  const translation = (row[idx.translation] || "").split(/\\n|\n/)[0].trim();
  if (!translation) continue;
  phraseCount++;

  const rec = { w: word, cn: translation.slice(0, 30) };
  if (bank.has(parts[0])) {
    if (!byFirst.has(parts[0])) byFirst.set(parts[0], []);
    byFirst.get(parts[0]).push(rec);
  }
  parts.forEach((p) => {
    if (bank.has(p)) {
      if (!byAnyWord.has(p)) byAnyWord.set(p, []);
      byAnyWord.get(p).push(rec);
    }
  });
  const key = parts[0];
  if (Array.isArray(samples[key]) && samples[key].length < 12) samples[key].push(rec);
}

console.log("\n短语词条总数：" + phraseCount);
console.log("按首词能挂上词库的：" + byFirst.size + " 个词，共 " + [...byFirst.values()].reduce((n, l) => n + l.length, 0) + " 条");
console.log("按任意词能挂上词库的：" + byAnyWord.size + " 个词，共 " + [...byAnyWord.values()].reduce((n, l) => n + l.length, 0) + " 条");

console.log("\n每个词平均能挂几条（按首词）：" + (( [...byFirst.values()].reduce((n, l) => n + l.length, 0)) / Math.max(1, byFirst.size)).toFixed(1));

console.log("\n=== 抽样：按首词挂上的搭配 ===");
["take", "look", "make", "give", "come", "get"].forEach((w) => {
  const list = byFirst.get(w) || [];
  console.log("  " + w + "（" + list.length + " 条）：" + list.slice(0, 6).map((x) => x.w).join(" / "));
});

console.log("\n=== 覆盖率 ===");
const covered = [...bank].filter((w) => byFirst.has(w)).length;
console.log("  " + covered + " / " + bank.size + " 词有首词搭配（" + (covered / bank.size * 100).toFixed(0) + "%）");
const coveredAny = [...bank].filter((w) => byAnyWord.has(w)).length;
console.log("  " + coveredAny + " / " + bank.size + " 词有任意位置搭配（" + (coveredAny / bank.size * 100).toFixed(0) + "%）");
