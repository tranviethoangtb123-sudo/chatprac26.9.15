/* ============================================================================
   下载生成词库所需的两个数据文件（都只下一次，缓存在 tools/.cache/）
   ----------------------------------------------------------------------------
   1) ECDICT   https://github.com/skywind3000/ECDICT         MIT License
      → ecdict.csv     英汉双解词典：中文释义、词性、词频、考试标签（约 63 MB）
   2) ipa-dict https://github.com/open-dict-data/ipa-dict    MIT License
      → ipa-en_US.txt  现代 IPA 音标（约 3 MB）

   用法：node tools/fetch-data.js
   ============================================================================ */
const fs = require("fs");
const path = require("path");
const { Readable, Transform } = require("stream");
const { pipeline } = require("stream/promises");

const CACHE_DIR = path.join(__dirname, ".cache");

const FILES = [
  {
    name: "ecdict.csv",
    minSize: 50 * 1024 * 1024,
    label: "ECDICT 英汉词典",
    urls: [
      "https://raw.githubusercontent.com/skywind3000/ECDICT/master/ecdict.csv",
      "https://github.com/skywind3000/ECDICT/raw/master/ecdict.csv"
    ]
  },
  {
    name: "ipa-en_US.txt",
    minSize: 1024 * 1024,
    label: "ipa-dict 美式音标",
    urls: [
      "https://raw.githubusercontent.com/open-dict-data/ipa-dict/master/data/en_US.txt",
      "https://cdn.jsdelivr.net/gh/open-dict-data/ipa-dict@master/data/en_US.txt"
    ]
  }
];

async function download(file) {
  const target = path.join(CACHE_DIR, file.name);

  if (fs.existsSync(target) && fs.statSync(target).size >= file.minSize) {
    console.log("已缓存 " + file.name + "（" + (fs.statSync(target).size / 1048576).toFixed(1) + " MB）");
    return;
  }

  for (const url of file.urls) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      const tmp = target + ".part";
      try {
        console.log("下载 " + file.label + "（第 " + attempt + " 次）…");
        const res = await fetch(url, { headers: { "User-Agent": "chat-prac-build" } });
        if (!res.ok || !res.body) throw new Error("HTTP " + res.status);

        // 服务端可能返回压缩后的 content-length，这里的进度仅供参考
        const total = Number(res.headers.get("content-length")) || 0;
        let got = 0;
        let lastLog = 0;

        const counter = new Transform({
          transform(chunk, _enc, cb) {
            got += chunk.length;
            const now = Date.now();
            if (now - lastLog > 10000) {
              lastLog = now;
              const pct = total ? "约 " + Math.min(999, Math.round(got / total * 100)) + "%" : "";
              console.log("  已下载 " + (got / 1048576).toFixed(1) + " MB " + pct);
            }
            cb(null, chunk);
          }
        });

        await pipeline(Readable.fromWeb(res.body), counter, fs.createWriteStream(tmp));

        if (fs.statSync(tmp).size < file.minSize) {
          throw new Error("文件不完整，只有 " + fs.statSync(tmp).size + " 字节");
        }
        fs.renameSync(tmp, target);
        console.log("完成 " + file.name + "（" + (fs.statSync(target).size / 1048576).toFixed(1) + " MB）");
        return;
      } catch (e) {
        if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
        console.log("  失败：" + (e.cause && e.cause.message || e.message));
      }
    }
  }
  throw new Error(file.name + " 所有数据源都下载失败");
}

(async () => {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  for (const f of FILES) await download(f);
  console.log("\n数据已就绪，接着运行：node tools/build-words.js");
})().catch((e) => { console.error("失败：" + e.message); process.exit(1); });
