# Chat Prac

英语学习工具：**单词** / **句子和对话** / **对话练习** 三个板块，版式参考 DeepSeek。手机竖屏优先，可加到主屏幕离线使用。

**线上地址：<https://tranviethoangtb123-sudo.github.io/chatprac26.9.15/>**（源码：<https://github.com/tranviethoangtb123-sudo/chatprac26.9.15>）

## 打开方式

直接双击 `index.html` 即可（纯静态，无需构建、无需联网）。

如果想用本地服务打开（推荐，便于后续调试和做成 App 壳）：

```powershell
cd D:\harness\dsh\program
python -m http.server 5173
# 然后访问 http://127.0.0.1:5173
```

## 目录

```
index.html                   页面结构：顶部栏 + 抽屉式侧边栏 + 底部输入区
manifest.webmanifest         PWA 配置（手机加到主屏幕用）
sw.js                        离线缓存（Service Worker，改内容后记得把 VERSION 加一）
交接文档.md                   给接手的人/另一个 AI 会话看的完整交接说明
部署说明.md                  上传到免费托管 + 加到手机主屏幕的步骤
assets/css/style.css         样式（浅色/深色、手机竖屏、DeepSeek 风格）
assets/js/app.js             交互逻辑：模式切换、抽屉、检索、板块切换、对话发送、学习模式的 vocab 模块
assets/js/data.words.js      查询模式词库 4198 词（由脚本生成，勿手工编辑）
assets/js/data.vocab.js      学习模式学习词库 162 词 + 语块种子（按场景域分类，可手工增补）
assets/js/data.collocations.js 固定搭配（取自 ECDICT 的短语词条，如 take off / in charge of）
assets/js/data.sentences.js  句子库 180 条
assets/js/data.dialogues.js  对话库 32 组（256 行，查询模式·句子和对话 用）
assets/js/data.scenarios.js  场景对话库 12 域 / 60 场景规划 / 已收录 16 段（学习模式·对话 用）
assets/css/scenarios.css     场景对话库的样式（独立文件）
assets/js/data.practice.js   对话练习场景 + 模拟回复（当前界面未使用，备用）
assets/icons/*.png           应用图标（白底黑字，由脚本生成）
tools/fetch-data.js          下载 ECDICT 与 ipa-dict 到 tools/.cache/
tools/build-words.js         从两个数据源生成 data.words.js
tools/make-colloc-chunks.js  把词库切成小块（生成固定搭配用）
tools/build-collocations.js  合并并校验固定搭配分片 → data.collocations.js
tools/build-icons.ps1        生成主屏幕图标（白底黑字 "Chat Prac"；需要 Windows 字体渲染，已生成好并提交，平时不用跑）
tools/build-dist.js          打包出可上传的 dist/ 目录
tools/check-icons.js         检查图标确实是"白底黑字"（解码 PNG 统计，可打印字符画）
tools/check-live.js          部署后自检：逐项验证线上站点
tools/api-sync.js            备用提交通道（github.com 连不上时走 Contents API）
tests/selfcheck.js           自检：静态引用 + PWA + 数据内容质量
tests/smoke.js               DOM 桩冒烟测试（抽屉 / 检索 / 切换 / 发送）
```

## 放到手机上用

详见 **`部署说明.md`**（含 Cloudflare Pages / GitHub Pages / Netlify 三种免费方案的逐步操作、加到主屏幕的方法、更新流程）。

打包命令：

```powershell
node tools/build-dist.js
Compress-Archive -Path "dist\*" -DestinationPath "ChatPrac-网站包.zip" -Force
```

改完文件后记得把 `sw.js` 里的 `VERSION` 加一，否则手机上因为离线缓存还是旧版本。

## 数据从哪来

| 数据 | 来源 | 授权 |
| --- | --- | --- |
| 词库：中文释义、词性、词频、考试标签 | [ECDICT](https://github.com/skywind3000/ECDICT) | MIT License |
| 词库：音标（美式 IPA） | [ipa-dict](https://github.com/open-dict-data/ipa-dict) | MIT License |
| 固定搭配（take off / in charge of 这类短语词条） | [ECDICT](https://github.com/skywind3000/ECDICT) 的短语词条 | MIT License |
| 句子库、对话库、练习场景 | Chat Prac 原创编写 | 随本项目，可自由修改 |

选词依据：ECDICT 里带「牛津 3000 核心词 / 柯林斯星级 / 中考·高考·四六级·考研·雅思·托福」标签的词条，
按 COCA（`frq`）或 BNC（`bnc`）词频排序取前 2000，已排除纯功能词（the / of / and 之类）与英美重复拼写。
音标统一用 ipa-dict 的美式 IPA（`ɹ`/`ɫ` 已改写为更常见的 `r`/`l`）。

重新生成词库（可选，需要联网）：

```powershell
node tools/fetch-data.js          # 下载两个数据源（约 66 MB，只下一次，缓存在 tools/.cache/）
node tools/build-words.js         # 默认生成 1000 词
node tools/build-words.js 3000    # 想要更大的词库就改这个数字
```

> `tools/.cache/` 只是下载缓存，删掉不影响运行，只是下次要重新下载（网速慢的话要等几分钟）。
>
> 备选数据源（这次没用，供以后参考）：示例句可考虑 [Tatoeba](https://tatoeba.org)（CC BY 2.0 FR，需署名）；
> 中文词表可考虑 CC-CEDICT（CC BY-SA）；牛津 3000/5000 与 NGSL 的官方词表版权归各自发布方，
> **不建议直接复制**，只能作为选词参考。用之前请自行确认授权。

## 本地校验

```powershell
node tests/selfcheck.js   # 引用一致性 + 词库/句子/对话的数据质量
node tests/smoke.js       # 真实执行 app.js 的交互链路
node tools/check-live.js  # 部署后自检：线上资源是否都能打开
```

## 已实现

- **两种模式**（侧边栏最下方切换，选择会记住）：
  - **查询模式**：单词 / 句子和对话 / 对话练习 —— 和以前一样，输入框是检索框，没输入时右侧留空。
  - **学习模式**：只有 **单词** 和 **对话** 两个板块。
    - 单词：一套 **列表式背词系统**（`assets/js/data.vocab.js`，162 词，与查询模式的 4198 词库互相独立）。
      - **三个板块**：**今日新词**（每天 50 个上限，跨场景域打散；到期的旧词带「复习」标记排在最前面）/
        **已学习**（按学习时间倒序，最新学的在最上面）/ **全部单词**（A-Z 排列）。
      - **每个词一行**：第一行是「英文 + 音标 + 中文」，第二行是三个键 ——
        **认识**（记忆盒 +1，间隔 1/3/7/14/30 天，满 5 盒即已掌握）、**模糊**（明天再考）、**不认识**（归零，10 分钟后再来）。
      - 点单词本身可以发音（`speechSynthesis`，en-GB，不联网）；音标从查询模式的词库里借。
      - 底部输入框在学习模式下是**快速加词**：输入 `单词 词性 中文` 回车，直接进词库（出现在「今日新词」）。
      - 进度存在 `localStorage` 的 `chatprac-vocab-study`，与查询模式完全独立。
    - 对话：**场景对话库**（`assets/js/data.scenarios.js` + `assets/css/scenarios.css`），
      四层折叠 **域 → 场景 → 变体 → 话轮**。
      - **12 个域 / 规划 60 个场景**，当前已收录 2 个场景 × 8 种变体 = **16 段 194 话轮**。
      - 每个场景固定 **8 种变体**：顺利达成（对等 / 权力不对等）、拒绝或异议→折中、沟通故障→澄清→修复、
        情绪型、渠道变体、高正式语域、低正式语域。第 3~7 段必须带「障碍 → 修复 → 明确结果」，
        只有顺利对话等于只覆盖三成真实互动。
      - 进板块默认展开域 04；场景和单段对话默认收起，点标题展开。
      - **搜索**（底部输入框）命中场景标题、对话正文，以及 关系/语域/渠道/障碍/结果 五个元数据；
        搜索时自动展开命中的域、场景和那一段，没命中的域整块不显示。
      - **朗读**：每行一个 🔊，每段一个「整条朗读」（浏览器语音，离线）。
      - 还没收录内容的域灰显，把规划中的场景名当路线图列出来。
- 词库按「牛津核心 / 柯林斯星级 / 考纲标签」筛选并按词频排序，**并入了雅思标签词**（词频前 8000 内），
  所以雅思基础词汇基本都在里面。
- **手机竖屏优先**：三个板块收进左侧抽屉，默认收起，左上角三条横线拉出，**从屏幕左边缘往右滑也能拉出**；
  点遮罩或按 Esc 收起，选完板块自动关闭。顶部只有「菜单 / 板块名 / 主题切换」。
- **App 手感**：装到主屏幕后是全屏独立窗口（无地址栏）；关掉下拉刷新与橡皮筋回弹；按钮无点击高亮、无双击缩放；
  触屏设备上隐藏「Enter / Shift+Enter」这类键盘提示；输入框字号 16px 以避免 iOS 聚焦时自动放大页面。
- **图标长按快捷入口**：`manifest` 里配了三个 shortcuts（单词 / 句子和对话 / 对话练习），
  手机上长按桌面图标可直接跳到对应板块（走 `#words` / `#sentences` / `#practice` 深链）。
- **不自动拉起键盘**：进入页面或切换板块时不会自动聚焦输入框（手机上不会弹键盘），点输入框才弹；
  桌面（鼠标设备）仍保持自动聚焦，方便直接打字。
- 支持深色模式；宽屏下内容居中（最大 780px），窄屏自动收紧留白。
- **三个板块进入时右侧都是空白的**，没有任何预置内容（无欢迎语、无场景按钮、无列表）。
- **底部只有对话框和发送键**（按要求未放其他按钮），文本框随板块切换身份：
  - 单词板块：**2000 词**，输入中文、英文、音标、词性都能实时检索，命中处高亮；卡片只显示单词、音标、词性和中文意思，没有例句。
  - 句子和对话板块：**180 条句子 + 32 组对话（256 行）**，中英文实时检索；没有话题标签，卡片上也不显示角标。
  - 对话练习：空白的聊天区，输入英文 → Enter 发送，`Shift + Enter` 换行，机器人显示「正在输入」动画后才回复。
- 检索类板块清空关键词就回到空白；搜不到内容才出现一行提示。
- 未接入模型时用内置**模拟回复**，界面与真实接口完全一致，方便先看效果。
- 地址栏带板块定位（`#words` / `#sentences` / `#practice`），方便分享链接，也便于以后做 App 深链。

> 每个数据文件里都保留了暂时不显示的字段（句子的 `tag`、单词的 `frq`、练习场景与回复库），
> 以后想把话题标签、排序或场景按钮加回来，改 `app.js` 里对应的渲染逻辑即可。

## 接入 DeepSeek

打开 `assets/js/app.js` 顶部的 `API` 配置：

```js
var API = {
  enabled: true,
  endpoint: "https://api.deepseek.com/chat/completions",
  apiKey: "sk-你的密钥",
  model: "deepseek-chat",
  ...
};
```

改完顶部徽标会从「模拟模式」变成模型名，回复即来自真实模型。

> 注意：密钥写在前端会暴露给用户。正式上线（做成 App 时）请改成调用自己的后端代理，由后端转发到 DeepSeek。

## 后续可做

- 把示例数据换成词库文件 / 后端接口，检索交给服务端。
- 对话练习加语音识别（Web Speech API 或原生壳的能力）与发音打分。
- 加学习记录、生词本、复习提醒。
- 用 Capacitor / Tauri 等包壳做成 App，静态页面可直接复用。
