/* ============================================================================
   音标补充表生成器：给「学习词库」里那些不在检索词库中的词补音标
   ----------------------------------------------------------------------------
   背景：音标统一从 assets/js/data.words.js 借（见 app.js 的 vPhon），
         但 data.vocab.js 的 162 个学习词里有 65 个不在那 4198 词库内，
         于是这些词卡片上的音标是空的。
   做法：同样从 ipa-dict 取音标，并用与 build-words.js 完全相同的规范：
         取第一个读音，ɹ→r、ɫ→l（音位化写法）。
   数据来源：ipa-dict  https://github.com/open-dict-data/ipa-dict  (MIT License)
   用法：node tools/build-phon.js          （需要 tools/.cache/ipa-en_US.txt）
         node tools/build-phon.js --check  （只检查，不写文件）
   ============================================================================ */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const IPA_PATH = path.join(__dirname, ".cache", "ipa-en_US.txt");
const OUT = path.join(ROOT, "assets", "js", "data.phon.js");
const CHECK_ONLY = process.argv.indexOf("--check") >= 0;

globalThis.window = globalThis;
["data.words.js", "data.vocab.js"].forEach((f) => {
  vm.runInThisContext(fs.readFileSync(path.join(ROOT, "assets", "js", f), "utf8"), { filename: f });
});
const D = globalThis.CHAT_PRAC_DATA, V = globalThis.CHAT_PRAC_VOCAB;

function loadIpa() {
  const map = new Map();
  if (!fs.existsSync(IPA_PATH)) return map;
  fs.readFileSync(IPA_PATH, "utf8").split(/\r?\n/).forEach((line) => {
    const [w, ipa] = line.split("\t");
    if (!w || !ipa) return;
    const first = ipa.split(",")[0].trim();
    map.set(w.trim().toLowerCase(), first.replace(/ɹ/g, "r").replace(/ɫ/g, "l"));
  });
  return map;
}

/* ipa-dict（美式）里没有的词，逐个核对后写在这里，并注明依据。
   规范与 ipa-dict 一致：ɹ→r、ɫ→l，取常用读音。 */
const MANUAL = {
  // 英式拼写，ipa-dict 只有美式拼写 enrollment /ɛnˈɹoʊɫmənt/，按同词取音
  "enrolment": { ph: "/ɛnˈroʊlmənt/", src: "ipa-dict enrollment" },
  // 法语借词 en suite，Wiktionary：US /ˌɑn ˈswit/
  "ensuite": { ph: "/ˌɑnˈswit/", src: "Wiktionary" },
  // Wiktionary：US /ˌpoʊstˈɡɹædʒuət/（ɹ→r）
  "postgraduate": { ph: "/ˌpoʊstˈɡrædʒuət/", src: "Wiktionary" }
};

const ipa = loadIpa();
const have = {};
(D.words || []).forEach((x) => { have[x.w] = x.ph; });

// 学习词池 = 检索词库 + 学习词库（去重，忽略大小写）
const pool = [];
const seen = {};
(D.words || []).forEach((x) => {
  const k = x.w.toLowerCase();
  if (seen[k]) return;
  seen[k] = 1;
  pool.push(x.w);
});
(V.words || []).forEach((x) => {
  const k = x.w.toLowerCase();
  if (seen[k]) return;
  seen[k] = 1;
  pool.push(x.w);
});

const missing = pool.filter((w) => !have[w]);
const out = {};
const unfound = [];
const manualUsed = [];
missing.forEach((w) => {
  const p = ipa.get(w.toLowerCase());
  if (p) { out[w] = p; return; }
  const m = MANUAL[w.toLowerCase()];
  if (m) { out[w] = m.ph; manualUsed.push(w); return; }
  unfound.push(w);
});

const keys = Object.keys(out).sort((a, b) => a.localeCompare(b));
console.log("学习词池 " + pool.length + " 个词，缺音标的 " + missing.length + " 个");
console.log("ipa-dict 里查到 " + (keys.length - manualUsed.length) + " 个，另按来源核对补 " +
  manualUsed.length + " 个，仍缺 " + unfound.length + " 个");
if (manualUsed.length) console.log("  核对补充：" + manualUsed.map((w) => w + " " + out[w] + "（" + MANUAL[w.toLowerCase()].src + "）").join("；"));
if (unfound.length) console.log("  仍缺：" + unfound.join("、"));

if (CHECK_ONLY) {
  const ok = unfound.length === 0 && keys.length === missing.length;
  console.log(ok ? "音标补充表可以覆盖全部缺口 ✅" : "音标补充表覆盖不全 ❌");
  process.exit(ok ? 0 : 1);
}

if (unfound.length) {
  console.error("\n有词在 ipa-dict 里查不到音标，不写文件。" );
  process.exit(1);
}

const lines = [];
lines.push("/* ============================================================================");
lines.push("   音标补充表（自动生成，请勿手改）");
lines.push("   ----------------------------------------------------------------------------");
lines.push("   用途：给「学习词库」里不在检索词库中的词提供音标，");
lines.push("         app.js 的 vPhon() 在检索词库里查不到时会回退到这里。");
lines.push("   生成：node tools/build-phon.js");
lines.push("   数据来源：ipa-dict  https://github.com/open-dict-data/ipa-dict  (MIT License)");
if (manualUsed.length) {
  lines.push("   以下 " + manualUsed.length + " 条 ipa-dict 未收录，逐条核对后补充：");
  manualUsed.forEach((w) => {
    lines.push("     " + w + "  " + out[w] + "  依据：" + MANUAL[w.toLowerCase()].src);
  });
}
lines.push("   共 " + keys.length + " 条。");
lines.push("   ============================================================================ */");
lines.push("window.CHAT_PRAC_PHON = {");
keys.forEach((k, i) => {
  lines.push("  " + JSON.stringify(k) + ": " + JSON.stringify(out[k]) + (i === keys.length - 1 ? "" : ","));
});
lines.push("};");
lines.push("");
fs.writeFileSync(OUT, lines.join("\n"), "utf8");
console.log("已写入 " + path.relative(ROOT, OUT) + "（" + keys.length + " 条）");
