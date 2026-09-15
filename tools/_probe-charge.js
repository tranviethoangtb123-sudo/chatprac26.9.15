/* 临时：查词典里 in charge / in charge of 的原始条目 */
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

const patterns = ["in charge", "take off", "in order", "on time", "in hand"];
patterns.forEach((p) => {
  const hits = [];
  for (let r = 1; r < rows.length && hits.length < 4; r++) {
    const w = (rows[r][idx.word] || "").trim();
    if (w === p) hits.push({ w: w, cn: rows[r][idx.translation] || "", collins: rows[r][idx.collins], oxford: rows[r][idx.oxford] });
  }
  console.log("\n=== \"" + p + "\" ===");
  if (!hits.length) console.log("  （词典里没有这个精确条目）");
  hits.forEach((h) => console.log("  cn=" + JSON.stringify(String(h.cn).slice(0, 90)) + "  collins=" + h.collins + " oxford=" + h.oxford));
});
