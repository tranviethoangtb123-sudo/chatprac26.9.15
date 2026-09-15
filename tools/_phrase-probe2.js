/* 临时探查 2：短语词条有没有词频数据，能不能据此挑出常用搭配 */
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

const rows = parseCsv(fs.readFileSync(CSV, "utf8"));
const header = rows[0].map((h) => h.trim());
const idx = {};
header.forEach((h, i) => { idx[h] = i; });
console.log("字段：" + header.join(", "));

let total = 0, withFrq = 0, withTag = 0, withCollins = 0;
const byFirst = new Map();

for (let r = 1; r < rows.length; r++) {
  const row = rows[r];
  const word = (row[idx.word] || "").trim();
  if (!/^[a-z][a-z' -]*$/.test(word) || word.indexOf(" ") < 0) continue;
  const parts = word.split(/\s+/);
  if (parts.length < 2 || parts.length > 5) continue;
  const translation = (row[idx.translation] || "").split(/\\n|\n/)[0].trim();
  if (!translation) continue;
  total++;
  const frq = Number(row[idx.frq]) || 0;
  const bnc = Number(row[idx.bnc]) || 0;
  const tag = (row[idx.tag] || "").trim();
  const collins = Number(row[idx.collins]) || 0;
  if (frq || bnc) withFrq++;
  if (tag) withTag++;
  if (collins) withCollins++;

  const first = parts[0];
  if (!byFirst.has(first)) byFirst.set(first, []);
  byFirst.get(first).push({ w: word, cn: translation.slice(0, 24), rank: frq || bnc || 999999, words: parts.length });
}

console.log("\n短语词条 " + total + " 条");
console.log("  有词频(frq/bnc)的：" + withFrq + "（" + (withFrq / total * 100).toFixed(1) + "%）");
console.log("  有考试标签的：" + withTag);
console.log("  有柯林斯星级的：" + withCollins);

["take", "look", "make", "get", "come", "put"].forEach((w) => {
  const list = (byFirst.get(w) || []).slice();
  const byFreq = list.filter((x) => x.rank < 999999).sort((a, b) => a.rank - b.rank);
  console.log("\n=== " + w + "（共 " + list.length + " 条，其中有词频 " + byFreq.length + " 条）===");
  console.log("  按词频前 12：");
  byFreq.slice(0, 12).forEach((x) => console.log("    " + String(x.rank).padStart(7) + "  " + x.w.padEnd(26) + x.cn));
  const short = list.filter((x) => x.words <= 3).sort((a, b) => a.w.length - b.w.length);
  console.log("  最短 8 条（2-3 词）：");
  short.slice(0, 8).forEach((x) => console.log("    " + x.w.padEnd(26) + x.cn));
});
