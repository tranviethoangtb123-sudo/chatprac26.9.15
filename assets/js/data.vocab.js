/* ============================================================================
   Chat Prac — 学习模式·单词板块 的场景分类词库
   ----------------------------------------------------------------------------
   用途：学习模式下的「6 板块 + 三键循环」学习系统只读这份数据，
        和查询模式用的 data.words.js（4198 词，供检索）互相独立。

   分类方式（两层轴）：
     · 归档轴 = 场景域（domain）：12 个域，用来做记忆锚点和成组复习
     · 出卡轴 = 打散队列：每天新词跨域混排，同一场景不相邻
       （同一语义场集中初学会互相抑制提取，所以初学打散、复习成组）
   横向标签：
     track  G=通用高频 / A=学术 / S=口语产出 / L=听力拼写（单独成轨，只练"听到即拼对"）
     trap   听力拼写轨道里的拼写陷阱词

   本文件可以手工增补：在 WORDS 里按同样的竖线格式加一行即可。
   格式：英文|词性|中文|轨道|域号|子场景|是否拼写陷阱(y/空)|易混提示
   ============================================================================ */

(function () {
  "use strict";

  var DOMAINS = {
    "01": "生存出行",
    "02": "医疗应急",
    "03": "居住生活",
    "04": "社交人际",
    "05": "学术学习",
    "06": "职场工作",
    "07": "服务商业",
    "08": "电话远程",
    "09": "数字书面",
    "10": "观点交流",
    "11": "文化休闲",
    "12": "独白描述",
    "807": "听力拼写"
  };

  var TRACKS = {
    G: "通用",
    A: "学术",
    S: "口语产出",
    L: "听力拼写"
  };

  var WORDS = [
    /* ---- 04 社交人际 ---- */
    "acquaintance|n|熟人|G|04|soc||acquaintance / acquaint",
    "compliment|n|称赞|G|04|soc||compliment / complement",
    "apologize|v|道歉|G|04|soc||apologize / apologise",
    "awkward|adj|尴尬的|G|04|soc||",
    "sincere|adj|真诚的|G|04|soc||sincere / sincerely",
    "offend|v|冒犯|G|04|soc||",
    "tease|v|取笑|G|04|soc||",
    "gossip|n|闲话|G|04|soc||",
    "sympathy|n|同情|G|04|soc||",
    "congratulate|v|祝贺|G|04|soc||",
    "invitation|n|邀请|G|04|soc||",
    "reunion|n|聚会|G|04|soc||",
    "mutual|adj|相互的|G|04|soc||",
    "reserved|adj|内向的|G|04|soc||reserved / reserve",
    "outgoing|adj|外向的|G|04|soc||",
    "considerate|adj|体贴的|G|04|soc||considerate / considerable",
    "console|v|安慰|G|04|soc||",
    "farewell|n|告别|G|04|soc||",
    "embrace|v|拥抱、接受|G|04|soc||",
    "resent|v|不满、怨恨|G|04|soc||",

    /* ---- 05 学术学习 ---- */
    "assignment|n|作业|G|05|aca||",
    "deadline|n|截止日期|G|05|aca||",
    "extension|n|延期|G|05|aca||extension / extent",
    "seminar|n|研讨课|G|05|aca||",
    "tutorial|n|辅导课|G|05|aca||",
    "lecture|n|讲座|G|05|aca||",
    "supervisor|n|导师、主管|G|05|aca||",
    "citation|n|引用|G|05|aca||",
    "bibliography|n|参考书目|G|05|aca||",
    "plagiarism|n|抄袭|G|05|aca||",
    "hypothesis|n|假设|G|05|aca||",
    "methodology|n|方法论|G|05|aca||",
    "questionnaire|n|问卷|G|05|aca||",
    "draft|n|草稿|G|05|aca||",
    "feedback|n|反馈|G|05|aca||",
    "criterion|n|标准|A|05|aca||复数为 criteria",
    "syllabus|n|课程大纲|G|05|aca||",
    "compulsory|adj|必修的|G|05|aca||",
    "elective|adj|选修的|G|05|aca||",
    "dissertation|n|学位论文|G|05|aca||",
    "abstract|n|摘要|A|05|aca||",
    "appendix|n|附录|G|05|aca||",
    "paraphrase|v|改述|A|05|aca||",
    "evaluate|v|评估|A|05|aca||",
    "summarize|v|概括|A|05|aca||",
    "analyze|v|分析|A|05|aca||analyze / analyse",
    "attendance|n|出勤|G|05|aca||",
    "transcript|n|成绩单|G|05|aca||",

    /* ---- 06 职场工作 ---- */
    "colleague|n|同事|G|06|wrk||",
    "subordinate|n|下属|G|06|wrk||",
    "workload|n|工作量|G|06|wrk||",
    "overtime|n|加班|G|06|wrk||",
    "promotion|n|晋升|G|06|wrk||",
    "resignation|n|辞职|G|06|wrk||",
    "negotiation|n|谈判|G|06|wrk||",
    "proposal|n|提案|G|06|wrk||",
    "agenda|n|议程|G|06|wrk||",
    "minutes|n|会议记录|G|06|wrk||",
    "budget|n|预算|G|06|wrk||",
    "client|n|客户|G|06|wrk||",
    "contract|n|合同|G|06|wrk||",
    "incentive|n|激励|G|06|wrk||",
    "appraisal|n|考核|G|06|wrk||",
    "recruitment|n|招聘|G|06|wrk||",
    "vacancy|n|空缺|G|06|wrk||",
    "probation|n|试用期|G|06|wrk||",
    "freelance|adj|自由职业的|G|06|wrk||",
    "collaboration|n|协作|G|06|wrk||",
    "workshop|n|工作坊|G|06|wrk||",
    "turnover|n|人员流动、营业额|G|06|wrk||",
    "redundancy|n|裁员|G|06|wrk||",
    "internship|n|实习|G|06|wrk||",
    "interview|n|面试|G|06|wrk||",

    /* ---- 10 观点交流（口语 Part 3 主战场） ---- */
    "agree|v|同意|G|10|opn||",
    "disagree|v|不同意|G|10|opn||",
    "oppose|v|反对|G|10|opn||",
    "doubt|v|怀疑|G|10|opn||",
    "assume|v|假定|G|10|opn||",
    "imply|v|暗示|G|10|opn||imply / infer",
    "recommend|v|建议|G|10|opn||",
    "justify|v|证明有理|A|10|opn||",
    "acknowledge|v|承认|A|10|opn||",
    "concede|v|让步|A|10|opn||",
    "emphasize|v|强调|A|10|opn||",
    "clarify|v|澄清|A|10|opn||",
    "contrast|v|对比|A|10|opn||",
    "compare|v|比较|G|10|opn||",
    "argue|v|主张|G|10|opn||",
    "claim|v|声称|G|10|opn||",
    "maintain|v|坚持认为|A|10|opn||",
    "object|v|反对|G|10|opn||",
    "compromise|n|折中|G|10|opn||",
    "persuade|v|说服|G|10|opn||",
    "convince|v|使信服|G|10|opn||",
    "admit|v|承认|G|10|opn||",
    "deny|v|否认|G|10|opn||",
    "speculate|v|推测|A|10|opn||",

    /* ---- 12 独白描述（口语 Part 2 主力词） ---- */
    "picturesque|adj|风景如画的|S|12|dsc||",
    "bustling|adj|熙攘的|S|12|dsc||",
    "crowded|adj|拥挤的|G|12|dsc||",
    "remote|adj|偏远的|G|12|dsc||",
    "tranquil|adj|宁静的|S|12|dsc||",
    "spacious|adj|宽敞的|S|12|dsc||",
    "cramped|adj|狭小的|S|12|dsc||",
    "vibrant|adj|有活力的|S|12|dsc||",
    "stunning|adj|极美的|S|12|dsc||",
    "breathtaking|adj|令人惊叹的|S|12|dsc||",
    "contemporary|adj|当代的|A|12|dsc||",
    "shabby|adj|破旧的|S|12|dsc||",
    "cozy|adj|舒适的|S|12|dsc||cozy / cosy",
    "distinctive|adj|独特的|A|12|dsc||",
    "remarkable|adj|非凡的|A|12|dsc||",
    "vivid|adj|生动的|S|12|dsc||",
    "atmosphere|n|气氛|G|12|dsc||",
    "scenery|n|风景|G|12|dsc||",
    "landmark|n|地标|G|12|dsc||",
    "heritage|n|遗产|G|12|dsc||",

    /* ---- L 听力拼写轨：拼写陷阱 ---- */
    "receive|v|收到|L|807|spelling|y|ie 顺序",
    "necessary|adj|必要的|L|807|spelling|y|一个 c 两个 s",
    "definitely|adv|肯定|L|807|spelling|y|中间没有 a",
    "environment|n|环境|L|807|spelling|y|n 在中间",
    "restaurant|n|餐厅|L|807|spelling|y|au 组合",
    "foreign|adj|外国的|L|807|spelling|y|ei 组合",
    "government|n|政府|L|807|spelling|y|n 在中间",
    "guarantee|v|保证|L|807|spelling|y|ua 组合",
    "immediately|adv|立即|L|807|spelling|y|两个 m",
    "occasion|n|场合|L|807|spelling|y|两个 c 一个 s",
    "separate|adj|分开的|L|807|spelling|y|para 不是 pera",
    "temperature|n|温度|L|807|spelling|y|结尾没有 e",
    "whether|conj|是否|L|807|spelling|y|别和 weather 混",

    /* ---- L 听力拼写轨：数字与单位 ---- */
    "dozen|n|一打|L|807|num||",
    "quarter|n|四分之一|L|807|num||",
    "fortnight|n|两周|L|807|num||",
    "approximately|adv|大约|L|807|num|y|两个 p",
    "percentage|n|百分比|L|807|num||",
    "average|n|平均|L|807|num||",
    "double|v|加倍|L|807|num||",
    "halve|v|减半|L|807|num||",
    "decimal|n|小数|L|807|num||",
    "sequence|n|顺序|L|807|num||",

    /* ---- L 听力拼写轨：住宿 ---- */
    "accommodation|n|住宿|L|807|accom|y|两个 c 两个 m",
    "deposit|n|押金|L|807|accom||",
    "receipt|n|收据|L|807|accom|y|p 不发音",
    "refund|n|退款|L|807|accom||",
    "luggage|n|行李|L|807|accom|y|两个 g",
    "itinerary|n|行程|L|807|accom||",
    "furnished|adj|带家具的|L|807|accom||",
    "utilities|n|水电费|L|807|accom||",
    "lease|n|租约|L|807|accom||lease / least",
    "tenant|n|房客|L|807|accom||",
    "landlord|n|房东|L|807|accom||",
    "ensuite|adj|带独立卫浴的|L|807|accom||",

    /* ---- L 听力拼写轨：学术流程 ---- */
    "enrolment|n|注册|L|807|study||英式拼写",
    "timetable|n|时间表|L|807|study||",
    "campus|n|校园|L|807|study||",
    "faculty|n|院系|L|807|study||",
    "undergraduate|n|本科生|L|807|study||",
    "postgraduate|n|研究生|L|807|study||",
    "scholarship|n|奖学金|L|807|study||",
    "tuition|n|学费|L|807|study||",
    "application|n|申请|L|807|study||",
    "reference|n|推荐信、参考|L|807|study||"
  ];

  var words = WORDS.map(function (line) {
    var p = line.split("|");
    return {
      w: p[0],
      pos: p[1],
      cn: p[2],
      track: p[3],
      domain: p[4],
      sub: p[5],
      trap: p[6] === "y",
      note: p[7] || ""
    };
  });

  /* 语块库的种子内容：词组、搭配、整句放这里，不进单词表 */
  var CHUNKS = [
    { w: "make a decision", cn: "做决定", tag: "职场" },
    { w: "I'm afraid there's been a mix-up", cn: "恐怕是搞错了", tag: "酒店" },
    { w: "is there anything you can do", cn: "你能想想办法吗", tag: "投诉" },
    { w: "I'd appreciate it if...", cn: "如果……我会很感激", tag: "请求" },
    { w: "under the name of", cn: "以……的名字（预订）", tag: "酒店" },
    { w: "That's not quite what I meant", cn: "我不是这个意思", tag: "澄清" }
  ];

  window.CHAT_PRAC_VOCAB = {
    domains: DOMAINS,
    tracks: TRACKS,
    words: words,
    chunks: CHUNKS
  };
})();
