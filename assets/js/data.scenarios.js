/* ============================================================================
   Chat Prac — 学习模式·对话板块 的场景对话库
   ----------------------------------------------------------------------------
   组织方式（四层）：
     域 Domain（12） → 场景 Setting（60） → 交际事件 Event（每场景 8 条） → 话轮 Line

   每个场景固定 8 条，对应 8 种变体，不是随便收 8 段对话：
     1 顺利达成（对等关系）      5 情绪型（不满/着急/道歉/安慰 或 尴尬冷场）
     2 顺利达成（权力不对等）    6 渠道变体（电话/文字/多人）
     3 拒绝或异议 → 折中         7 高正式语域
     4 沟通故障 → 澄清 → 修复    8 低正式语域（省略、俚语）
   第 3~7 条必须带「障碍 → 修复 → 明确结果」；第 8 条是低正式语域对照，允许无障碍。

   为什么必须这样收：只收集顺利对话 = 只覆盖约三成真实互动，一遇追问、异议、
   打断就断——那正是 5.5 卡到 7.0 的地方。

   进度：按《对话收集 30 天排期》逐日补充，当前 2/60 个场景。
   手工增补：往 SCENARIOS 里加一个对象即可，结构照抄现有的；DOMAINS 里
   scenarios 数组列的是规划中的全部 60 个场景名。
   ============================================================================ */

(function () {
  "use strict";

  var DOMAINS = [
    { id: "04", name: "社交人际", priority: "P0", scenarios: [
      "初次见面寒暄与自我介绍", "邀约与答应", "邀约与婉拒", "道歉与和解",
      "安慰与倾诉", "道谢与回应称赞", "闲聊与八卦", "冲突与争执"
    ] },
    { id: "05", name: "学术学习", priority: "P0", scenarios: [
      "课堂提问", "小组讨论与分工", "Presentation 与 Q&A 被质疑",
      "导师会谈与论文反馈", "选课与申请延期", "图书馆咨询与同学协作摩擦"
    ] },
    { id: "06", name: "职场工作", priority: "P0", scenarios: [
      "面试", "入职寒暄与同事相处", "会议发言与打断插话", "提出异议与进度汇报",
      "电话会议与远程沟通", "谈判报价与客户投诉处理", "请假调休与绩效反馈"
    ] },
    { id: "10", name: "观点交流", priority: "P0", scenarios: [
      "教育议题", "科技议题", "环境议题", "工作与生活方式议题", "媒体与文化议题"
    ] },
    { id: "12", name: "独白场景", priority: "P0", scenarios: [
      "描述一个人", "描述一个地方", "描述一件物品", "讲一次经历", "表达偏好并解释"
    ] },
    { id: "07", name: "服务商业", priority: "P1", scenarios: [
      "客服售后与退换", "预订与取消", "账单争议与会员积分"
    ] },
    { id: "08", name: "电话远程", priority: "P1", scenarios: [
      "语音留言与电话转接", "信号不好与听不清", "视频会议与线上客服"
    ] },
    { id: "09", name: "数字书面", priority: "P1", scenarios: [
      "正式邮件（申请 / 投诉）", "半正式邮件与即时消息", "社媒评论与论坛发帖"
    ] },
    { id: "01", name: "生存出行", priority: "P2", scenarios: [
      "机场值机与行李托运", "入境海关与安检", "打车与网约车", "公交地铁购票与问路",
      "租车", "酒店入住", "酒店退房与投诉", "餐厅点餐", "买单分账与退菜",
      "购物试穿与退换货", "换汇银行与邮局快递"
    ] },
    { id: "03", name: "居住生活", priority: "P2", scenarios: [
      "看房与租房", "签合同与押金纠纷", "报修与房东交涉", "邻居交涉与水电网络开通"
    ] },
    { id: "11", name: "文化休闲", priority: "P2", scenarios: [
      "导游观光与博物馆", "运动健身与兴趣社团"
    ] },
    { id: "02", name: "医疗应急", priority: "P3", scenarios: [
      "预约挂号与描述症状", "急诊与药店买药", "报警报失与保险理赔"
    ] }
  ];

  var SCENARIOS = [
    /* ==================== 04-01 初次见面寒暄与自我介绍 ==================== */
    {
      id: "s04-01",
      domain: "04",
      title: "初次见面寒暄与自我介绍",
      ielts: "口语 P1 社交 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "同龄陌生人 · 朋友引荐",
          register: "随意",
          channel: "面对面",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Mia", en: "Hey, I don't think we've met. I'm Mia.", cn: "嘿，我们好像还没见过。我是 Mia。" },
            { who: "Chen", en: "Hi Mia, I'm Chen. I came with Leo.", cn: "你好 Mia，我是 Chen。我跟 Leo 一起来的。" },
            { who: "Mia", en: "Oh, you're Leo's flatmate! He mentions you all the time.", cn: "哦，你就是 Leo 的室友！他老提起你。" },
            { who: "Chen", en: "Does he? Hopefully only good things.", cn: "是吗？希望都是好话。" },
            { who: "Mia", en: "Mostly. He says you're the one who actually cooks.", cn: "基本是。他说你是真会做饭的那个。" },
            { who: "Chen", en: "Guilty. It's cheaper than eating out every night.", cn: "被你说中了。比天天在外面吃便宜。" },
            { who: "Mia", en: "Smart. What do you do when you're not cooking?", cn: "挺会过。不做饭的时候你做什么？" },
            { who: "Chen", en: "I'm a product designer, mostly apps.", cn: "我是产品设计师，主要做 App。" },
            { who: "Mia", en: "Nice. I work in publishing, so I'm jealous of anyone who makes things that actually work.", cn: "不错。我在出版业，所以特别羡慕你们这些做出来的东西真能用的人。" },
            { who: "Chen", en: "Ha. It's less glamorous than it sounds. Mostly arguing about button sizes.", cn: "哈，没听起来那么光鲜。大部分时间在争按钮该多大。" },
            { who: "Mia", en: "Still beats arguing about commas.", cn: "那也比争逗号强。" },
            { who: "Chen", en: "Fair. How do you two know each other?", cn: "有道理。你俩怎么认识的？" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "新员工 · 资深同事",
          register: "中性偏正式",
          channel: "面对面（办公室）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Rachel", en: "You must be the new analyst. I'm Rachel, I sit two desks over.", cn: "你就是新来的分析师吧。我是 Rachel，隔着两张桌子。" },
            { who: "Tom", en: "Tom. Nice to meet you properly. We waved at each other on Monday.", cn: "Tom。正式认识一下挺好的。周一我们还互相挥手来着。" },
            { who: "Rachel", en: "We did. Sorry, first week is always a blur. How's it going so far?", cn: "是啊。抱歉，第一周总是糊里糊涂的。目前还顺利吗？" },
            { who: "Tom", en: "Good. A lot to take in, but everyone's been patient.", cn: "挺好。要消化的东西很多，但大家都很耐心。" },
            { who: "Rachel", en: "Give it a month and you'll be the one explaining the systems to somebody else.", cn: "过一个月，就轮到你给别人讲这些系统了。" },
            { who: "Tom", en: "That's reassuring. What do you work on?", cn: "这话让人安心。你负责什么？" },
            { who: "Rachel", en: "Client reporting, mostly. If you ever need the last three years of numbers, I'm your person.", cn: "主要是客户报告。你要是需要过去三年的数据，找我。" },
            { who: "Tom", en: "I'll take you up on that. I've been hunting for them since Tuesday.", cn: "那我可要麻烦你了。我从周二就在找那些数据。" },
            { who: "Rachel", en: "Come by after lunch. I'll walk you through where everything lives.", cn: "午饭后过来吧，我带你过一遍东西都放在哪。" },
            { who: "Tom", en: "That'd be great. Thanks, Rachel.", cn: "那太好了。谢谢 Rachel。" },
            { who: "Rachel", en: "No problem. Welcome aboard.", cn: "不客气。欢迎加入。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "陌生人 · 活动组织者",
          register: "中性",
          channel: "面对面",
          barrier: "对方提出你不想接受的请求",
          result: "折中（只去一次，不作承诺）",
          lines: [
            { who: "Sam", en: "You should come to the Thursday debate club. We're short on people.", cn: "你该来周四的辩论社。我们缺人。" },
            { who: "Nora", en: "That's kind of you, but I'm not really a debate person.", cn: "你太客气了，但我不太是辩论型的人。" },
            { who: "Sam", en: "Neither was I. Honestly, it's more of a discussion group.", cn: "我也不是。说实话，更像是个讨论小组。" },
            { who: "Nora", en: "I appreciate it, but I've got a lot on this term.", cn: "谢谢你的好意，但这学期事情太多了。" },
            { who: "Sam", en: "Fair enough. Could you come just once, as a guest? No commitment.", cn: "理解。那能不能就来一次，当客人？不用有任何承诺。" },
            { who: "Nora", en: "Just once?", cn: "就一次？" },
            { who: "Sam", en: "Just once. If you hate it, I won't ask again.", cn: "就一次。你要是觉得没意思，我就不再问了。" },
            { who: "Nora", en: "Okay, once. But I'm not speaking.", cn: "好吧，一次。但我不发言。" },
            { who: "Sam", en: "You can just listen. Half the room does.", cn: "你听着就行。一半的人都不说话。" },
            { who: "Nora", en: "Deal. What time does it start?", cn: "成交。几点开始？" },
            { who: "Sam", en: "Seven, in the seminar room. I'll send you the details.", cn: "七点，研讨室。我把细节发你。" },
            { who: "Nora", en: "Thanks. No promises beyond Thursday, though.", cn: "谢谢。不过周四之后我可不保证什么。" },
            { who: "Sam", en: "Understood. See you then.", cn: "明白。到时候见。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "陌生人 · 会议签到",
          register: "中性",
          channel: "面对面（环境嘈杂）",
          barrier: "没听清名字，需要重复与拼写",
          result: "达成",
          lines: [
            { who: "工作人员", en: "And your name, please?", cn: "请问您的名字？" },
            { who: "Priya", en: "Priya.", cn: "Priya。（人名）" },
            { who: "工作人员", en: "Sorry, Priya? How do you spell that?", cn: "不好意思，Priya？怎么拼？" },
            { who: "Priya", en: "P-R-I-Y-A. It's an Indian name.", cn: "P-R-I-Y-A。是个印度名字。" },
            { who: "工作人员", en: "P-R-I-Y-A. Got it. And your surname?", cn: "P-R-I-Y-A，记下了。姓呢？" },
            { who: "Priya", en: "Nair. N-A-I-R.", cn: "Nair。N-A-I-R。（姓）" },
            { who: "工作人员", en: "Nair. Sorry, the room's a bit loud.", cn: "Nair。抱歉，这里有点吵。" },
            { who: "Priya", en: "No worries, it happens constantly.", cn: "没关系，这是常事。" },
            { who: "工作人员", en: "And you're with...?", cn: "您来自……？" },
            { who: "Priya", en: "The University of Leeds. I'm presenting in the second session.", cn: "利兹大学。我在第二场做报告。" },
            { who: "工作人员", en: "Right, you're on the list. Table four, near the window.", cn: "对，名单上有您。四号桌，靠窗。" },
            { who: "Priya", en: "Thanks. Table four.", cn: "谢谢。四号桌。" }
          ]
        },
        {
          variant: "情绪型（尴尬冷场）",
          relation: "陌生人 · 电梯里",
          register: "随意",
          channel: "面对面",
          barrier: "无话可说，气氛尴尬",
          result: "达成（体面收场）",
          lines: [
            { who: "Alex", en: "...So. Long day?", cn: "……那个。今天挺长吧？" },
            { who: "Dana", en: "Bit of one, yeah. You?", cn: "是有点。你呢？" },
            { who: "Alex", en: "Same. I've been staring at the same spreadsheet since nine.", cn: "一样。我从九点开始就盯着同一张表。" },
            { who: "Dana", en: "Oh, what do you do?", cn: "哦，你是做什么的？" },
            { who: "Alex", en: "Finance. Which sounds more interesting than it is.", cn: "金融。听起来比实际有意思。" },
            { who: "Dana", en: "I work in finance too.", cn: "我也是做金融的。" },
            { who: "Alex", en: "...Right. Well. That's awkward.", cn: "……好吧。这就有点尴尬了。" },
            { who: "Dana", en: "Only a little. Which floor?", cn: "还好。你去几楼？" },
            { who: "Alex", en: "Eleven.", cn: "十一楼。" },
            { who: "Dana", en: "Twelve. You're nearly there.", cn: "我十二楼。你快到了。" },
            { who: "Alex", en: "Yeah. Have a good evening, then.", cn: "嗯。那祝你今晚愉快。" },
            { who: "Dana", en: "You too.", cn: "你也是。" }
          ]
        },
        {
          variant: "渠道变体（视频会议 / 多人）",
          relation: "跨时区团队 · 初次见面",
          register: "半正式",
          channel: "视频会议（三人以上）",
          barrier: "有人静音 + 多人插话",
          result: "达成",
          lines: [
            { who: "主持", en: "Let's do quick introductions since we've got new faces. Ken, start us off.", cn: "来了新面孔，我们快速自我介绍一下。Ken，你先来。" },
            { who: "Ken", en: "Sure. Ken Watanabe, I'm on the Tokyo team, I handle the supply side.", cn: "好。Ken Watanabe，东京团队，我负责供应端。" },
            { who: "主持", en: "Thanks. Sofia?", cn: "谢谢。Sofia？" },
            { who: "Sofia", en: "Sofia Almeida, Lisbon. I do the customer data modelling.", cn: "Sofia Almeida，里斯本。我做客户数据建模。" },
            { who: "主持", en: "And you've met Marcus. Marcus?", cn: "你见过 Marcus 了。Marcus？" },
            { who: "Marcus", en: "Marcus Bell, London. I look after the reporting pipeline.", cn: "Marcus Bell，伦敦。我负责报表流水线。" },
            { who: "主持", en: "Great. Ken, you're on mute, by the way, we missed the first half of that.", cn: "好。顺便说一句 Ken，你刚才静音了，前半句我们没听到。" },
            { who: "Ken", en: "Sorry. Can you hear me now?", cn: "抱歉。现在能听到吗？" },
            { who: "Sofia", en: "Yes, that's better.", cn: "能，这样好多了。" },
            { who: "Ken", en: "I said I've read the spec, and I've got two concerns.", cn: "我说我看了规格说明，有两点担心。" },
            { who: "主持", en: "Hold that thought, let's put concerns at the end so we don't run long.", cn: "先记着，把疑问放到最后，免得超时。" },
            { who: "Ken", en: "Fine by me.", cn: "我没问题。" },
            { who: "主持", en: "Right. Item one: the timeline.", cn: "好。第一项：时间线。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "博士生 · 学术会议教授",
          register: "正式",
          channel: "面对面（会议茶歇）",
          barrier: "无（但需正式得体地自谦与请教）",
          result: "达成",
          lines: [
            { who: "学生", en: "Professor Haywood? I hope I'm not interrupting.", cn: "Haywood 教授？希望没有打扰您。" },
            { who: "教授", en: "Not at all. And you are?", cn: "没有。你是？" },
            { who: "学生", en: "My name is Wei Zhang. I'm a doctoral candidate at Manchester, I presented in the poster session yesterday.", cn: "我叫张伟，曼彻斯特大学的博士生，昨天在海报专场做了展示。" },
            { who: "教授", en: "Ah, the one on urban heat mapping. I stopped by briefly.", cn: "啊，城市热力制图那个。我短暂地看了一眼。" },
            { who: "学生", en: "I saw, and I was sorry to have missed you. I'd very much value your thoughts on the methodology.", cn: "我看到了，很遗憾错过了您。我非常希望听听您对方法的看法。" },
            { who: "教授", en: "It's an interesting approach. The satellite data you're using, how do you handle cloud cover?", cn: "方法挺有意思。你用的卫星数据，云层遮挡怎么处理？" },
            { who: "学生", en: "We exclude the affected pixels and interpolate, though I'm aware that introduces bias.", cn: "我们剔除受影响的像元再做插值，不过我知道这会引入偏差。" },
            { who: "教授", en: "It does. Have you looked at Kotz et al.? They take a different route.", cn: "确实会。你看过 Kotz 他们的文章吗？他们走的是另一条路。" },
            { who: "学生", en: "I haven't. I'll look it up this evening, thank you.", cn: "还没。我今晚就去查，谢谢您。" },
            { who: "教授", en: "Send me your draft. I'm slow to reply, but I do reply.", cn: "把草稿发我。我回信慢，但一定会回。" },
            { who: "学生", en: "That's very kind. I'll send it by Friday.", cn: "太感谢了。我周五前发过去。" },
            { who: "教授", en: "Good. Enjoy the rest of the conference.", cn: "好。后面的会议愉快。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "朋友的朋友 · 派对",
          register: "随意（含省略与俚语）",
          channel: "面对面",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Jake", en: "Alright? You must be Dan.", cn: "还行吧？你一定是 Dan。" },
            { who: "Dan", en: "Yeah, and you're Jake. Heard a lot.", cn: "对，你就是 Jake。听说了不少。" },
            { who: "Jake", en: "All lies, mate.", cn: "全是瞎说的，哥们。" },
            { who: "Dan", en: "That's what he said too.", cn: "他也这么说。" },
            { who: "Jake", en: "Course he did. Drink?", cn: "他当然这么说。喝点什么？" },
            { who: "Dan", en: "Go on then. What's in the bowl?", cn: "那来一杯。盆里那是什么？" },
            { who: "Jake", en: "No idea. Tastes like regret.", cn: "不知道。喝着像后悔的味道。" },
            { who: "Dan", en: "I'll take my chances.", cn: "我碰碰运气。" },
            { who: "Jake", en: "So how d'you know Tom?", cn: "那你怎么认识 Tom 的？" },
            { who: "Dan", en: "Uni. We shared a flat for two years. Barely survived.", cn: "大学。我们合租了两年，差点没活下来。" },
            { who: "Jake", en: "Yeah, he's a nightmare. Lovely nightmare, mind.", cn: "是啊，他就是个麻烦精。不过是个可爱的麻烦精。" },
            { who: "Dan", en: "Exactly that. Cheers.", cn: "就是这样。干杯。" }
          ]
        }
      ]
    },

    /* ==================== 04-02 邀约与答应 ==================== */
    {
      id: "s04-02",
      domain: "04",
      title: "邀约与答应",
      ielts: "口语 P1 社交 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "熟人 · 朋友",
          register: "随意",
          channel: "面对面",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Ben", en: "Are you free Friday? A few of us are doing dinner at that Thai place.", cn: "周五有空吗？我们几个人去那家泰国菜吃晚饭。" },
            { who: "Ana", en: "Friday? I think so. What time?", cn: "周五？应该有。几点？" },
            { who: "Ben", en: "Half seven. I'll book if we're five or more.", cn: "七点半。够五个人我就订位。" },
            { who: "Ana", en: "Count me in. Is Maya coming?", cn: "算我一个。Maya 来吗？" },
            { who: "Ben", en: "She said maybe. Depends on her shift.", cn: "她说可能。要看排班。" },
            { who: "Ana", en: "Tell her to just show up if she can. No pressure.", cn: "跟她说能来就直接来，别有压力。" },
            { who: "Ben", en: "Yeah, that's the plan. You bringing anyone?", cn: "对，就这么说。你要带人吗？" },
            { who: "Ana", en: "Might bring my sister. She's visiting.", cn: "可能带我妹妹。她来玩。" },
            { who: "Ben", en: "The more the merrier. I'll text you the address.", cn: "人越多越好。我把地址发你。" },
            { who: "Ana", en: "Perfect. See you Friday.", cn: "好。周五见。" },
            { who: "Ben", en: "See you.", cn: "周五见。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "下属 · 上司",
          register: "中性偏正式",
          channel: "面对面（办公室）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Nina", en: "Have you got a second?", cn: "您有一分钟吗？" },
            { who: "主管", en: "Of course. Sit down.", cn: "当然。坐吧。" },
            { who: "Nina", en: "We're doing a small leaving do for Priya on Thursday, nothing formal, just drinks at the place round the corner. I wanted to invite you.", cn: "我们周四给 Priya 办个小送别，不正式，就在拐角那家喝点东西。想邀请您。" },
            { who: "主管", en: "That's kind. What time?", cn: "有心了。几点？" },
            { who: "Nina", en: "Six thirty onwards. People will drift in and out.", cn: "六点半开始，大家会陆续来。" },
            { who: "主管", en: "I've got a call at six, but I can come by seven. Will people still be there?", cn: "我六点有个电话会，但七点能到。那时候人还在吗？" },
            { who: "Nina", en: "Definitely. Priya won't leave before eight, she's got cake.", cn: "肯定在。Priya 八点前不会走，她有蛋糕。" },
            { who: "主管", en: "Then I'll be there. Should I bring anything?", cn: "那我就去。要带点什么吗？" },
            { who: "Nina", en: "Just yourself. Maybe a card if you want, we're all signing one.", cn: "人来就行。想的话可以带张卡，我们大家在联名一张。" },
            { who: "主管", en: "I'll do that. Thanks for organising it.", cn: "我会的。谢谢你张罗。" },
            { who: "Nina", en: "No problem. She's been here six years, it's the least we could do.", cn: "应该的。她在这儿六年了，这是最起码的。" },
            { who: "主管", en: "Six years. Time goes.", cn: "六年啊。时间真快。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "熟人 · 朋友",
          register: "随意",
          channel: "电话 / 消息",
          barrier: "对方那天不方便",
          result: "折中（改期）",
          lines: [
            { who: "Leo", en: "Fancy the cinema Saturday? That new one's finally out.", cn: "周六想去看电影吗？那部新的终于上了。" },
            { who: "Kate", en: "Ah, Saturday's no good, I've got my parents over.", cn: "啊，周六不行，我爸妈过来。" },
            { who: "Leo", en: "Sunday?", cn: "周日呢？" },
            { who: "Kate", en: "Sunday's worse. I'm driving them to the airport at six.", cn: "周日更不行。我六点送他们去机场。" },
            { who: "Leo", en: "Okay, so this weekend's a write-off.", cn: "好吧，那这周末算是废了。" },
            { who: "Kate", en: "Basically. What about Wednesday? Cheaper tickets anyway.", cn: "差不多。周三怎么样？票价还便宜。" },
            { who: "Leo", en: "Wednesday's fine. But you know I'll fall asleep.", cn: "周三可以。不过你知道我会睡着的。" },
            { who: "Kate", en: "You always fall asleep. It's part of the experience.", cn: "你每次都睡。这也是体验的一部分。" },
            { who: "Leo", en: "Rude. But fair.", cn: "过分。但说得对。" },
            { who: "Kate", en: "I'll book it. The six forty showing?", cn: "我来订。六点四十那场？" },
            { who: "Leo", en: "Make it the later one. I've got a call at five.", cn: "订晚一点那场吧。我五点有个电话。" },
            { who: "Kate", en: "Eight fifteen, then.", cn: "那就八点十五。" },
            { who: "Leo", en: "Deal.", cn: "成交。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "熟人 · 电话",
          register: "随意",
          channel: "电话（信号很差）",
          barrier: "听不清时间与地点",
          result: "达成（改用文字确认）",
          lines: [
            { who: "Rob", en: "So we're meeting at the usual place. Half six?", cn: "那我们在老地方见。六点半？" },
            { who: "Emma", en: "Sorry, you're breaking up. Half what?", cn: "抱歉，你那边断断续续的。六点几？" },
            { who: "Rob", en: "Half six. Six thirty.", cn: "六点半。就是六点三十。" },
            { who: "Emma", en: "Six thirty. And where, the one by the station?", cn: "六点半。在哪，车站那家？" },
            { who: "Rob", en: "No, not that one. The other one. The one with the red sign.", cn: "不是那家。是另一家，红招牌那家。" },
            { who: "Emma", en: "The Italian place?", cn: "是那家意大利餐厅？" },
            { who: "Rob", en: "That's it. Sorry, I'm walking past a building site.", cn: "对。抱歉，我正走过一个工地。" },
            { who: "Emma", en: "Right. Six thirty at the Italian place.", cn: "好。六点半，意大利餐厅。" },
            { who: "Rob", en: "Six thirty. And bring the tickets.", cn: "六点半。把票带上。" },
            { who: "Emma", en: "The what?", cn: "带什么？" },
            { who: "Rob", en: "The tickets! For the show. I'll text you anyway so we've got it written down.", cn: "票！演出的票。我还是发消息给你吧，写下来稳妥。" },
            { who: "Emma", en: "Good idea. Text me.", cn: "好主意。发消息吧。" },
            { who: "Rob", en: "Will do. See you.", cn: "好。到时候见。" }
          ]
        },
        {
          variant: "情绪型（双方试探）",
          relation: "熟人 · 彼此有好感",
          register: "随意",
          channel: "即时消息",
          barrier: "双方都不确定对方的意思，绕来绕去",
          result: "达成",
          lines: [
            { who: "Sam", en: "So... a few of us are going for food on Friday. You should come.", cn: "那个……周五我们几个人去吃饭。你也来吧。" },
            { who: "Jo", en: "A few of us?", cn: "我们几个人？" },
            { who: "Sam", en: "Well. Me and Dan and his girlfriend. And possibly you.", cn: "嗯。我、Dan 和他女朋友。还有可能你。" },
            { who: "Jo", en: "Possibly?", cn: "可能？" },
            { who: "Sam", en: "I mean, you're invited. I'm just being weird about it.", cn: "我是说，你是被邀请的。我只是有点别扭。" },
            { who: "Jo", en: "You are being a bit weird about it.", cn: "你确实有点别扭。" },
            { who: "Sam", en: "I know. Friday. Seven. Yes or no.", cn: "我知道。周五，七点。来还是不来。" },
            { who: "Jo", en: "Yes. Was that so hard?", cn: "来。有那么难说吗？" },
            { who: "Sam", en: "Genuinely, a little.", cn: "说实话，有一点。" },
            { who: "Jo", en: "I'll be there. Text me the place.", cn: "我会到的。把地方发我。" },
            { who: "Sam", en: "Sending it now.", cn: "现在就发。" },
            { who: "Jo", en: "See you Friday, weirdo.", cn: "周五见，怪人。" }
          ]
        },
        {
          variant: "渠道变体（群聊 / 多人）",
          relation: "朋友群",
          register: "随意",
          channel: "群聊（文字）",
          barrier: "多人同时发言，信息需要归拢",
          result: "达成",
          lines: [
            { who: "Ben", en: "@everyone Saturday hike, who's in?", cn: "@所有人 周六徒步，谁去？" },
            { who: "Ana", en: "In. What time?", cn: "我去。几点？" },
            { who: "Ben", en: "9am at the car park.", cn: "早上九点，停车场。" },
            { who: "Kate", en: "9 is brutal. 10?", cn: "九点太狠了。十点？" },
            { who: "Leo", en: "+1 for 10.", cn: "支持十点。" },
            { who: "Ben", en: "Fine, 10. Anyone need a lift?", cn: "行，十点。有人要搭车吗？" },
            { who: "Ana", en: "Me. I'm carless this month.", cn: "我。我这个月没车。" },
            { who: "Leo", en: "I can pick you up. Where are you?", cn: "我可以接你。你住哪？" },
            { who: "Ana", en: "Croft Road, number 14.", cn: "Croft 路 14 号。" },
            { who: "Leo", en: "Easy. 9:40.", cn: "好说。九点四十。" },
            { who: "Kate", en: "Can I also get a lift? I'm basically next door to Ana.", cn: "我也能搭车吗？我基本就在 Ana 隔壁。" },
            { who: "Leo", en: "Two of you, fine. Anyone else?", cn: "你们俩可以。还有别人吗？" },
            { who: "Ben", en: "Right, 10am, car park, three cars' worth of people. Anyone late buys coffee.", cn: "好，十点，停车场，三辆车的人。谁迟到谁买咖啡。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "会议主办方 · 受邀嘉宾",
          register: "正式",
          channel: "电话 / 邮件式",
          barrier: "对方日程很紧，需要协调",
          result: "达成",
          lines: [
            { who: "主办方", en: "Professor Ellis, this is Hannah Reid from the conference office. Is it a convenient moment?", cn: "Ellis 教授，我是会议办公室的 Hannah Reid。现在方便吗？" },
            { who: "Ellis", en: "Briefly, yes.", cn: "可以，简短一点。" },
            { who: "主办方", en: "I'm calling to confirm your keynote on the fourteenth. We'd be delighted if you could also join the panel that afternoon.", cn: "我打电话是想确认您十四号的主旨演讲。如果您下午也能参加圆桌讨论，我们会非常荣幸。" },
            { who: "Ellis", en: "The panel runs until when?", cn: "圆桌讨论到几点？" },
            { who: "主办方", en: "Four o'clock, followed by a reception.", cn: "四点结束，之后是招待会。" },
            { who: "Ellis", en: "I have a flight at seven, so I'd need to leave by half four.", cn: "我七点有航班，所以四点半前得走。" },
            { who: "主办方", en: "That should be entirely manageable. I'll make sure you're seated nearest the exit.", cn: "那完全可以安排。我会确保您坐在最靠近出口的位置。" },
            { who: "Ellis", en: "Then yes, I'm happy to take part.", cn: "那我愿意参加。" },
            { who: "主办方", en: "Wonderful. Would you like the discussion questions in advance?", cn: "太好了。您希望提前拿到讨论问题吗？" },
            { who: "Ellis", en: "Please. No later than the tenth, if possible.", cn: "请发给我。如果可能，不晚于十号。" },
            { who: "主办方", en: "Certainly. I'll send them on Monday and confirm the arrangements in writing.", cn: "当然。我周一把问题发给您，并以书面形式确认安排。" },
            { who: "Ellis", en: "Thank you, Hannah. Goodbye.", cn: "谢谢你，Hannah。再见。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "密友",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Dan", en: "pint?", cn: "喝一杯？" },
            { who: "Tom", en: "when", cn: "什么时候" },
            { who: "Dan", en: "now", cn: "现在" },
            { who: "Tom", en: "can't, still at work. 8?", cn: "不行，还在上班。八点？" },
            { who: "Dan", en: "yeah alright. the usual?", cn: "行吧。老地方？" },
            { who: "Tom", en: "go on then. bring your wallet this time", cn: "那就这么定。这次记得带钱包" },
            { who: "Dan", en: "that was ONE time", cn: "就那一次好吗" },
            { who: "Tom", en: "it was three times", cn: "是三次" },
            { who: "Dan", en: "two, max", cn: "最多两次" },
            { who: "Tom", en: "see you at 8. you're buying the first round", cn: "八点见。第一轮你请" },
            { who: "Dan", en: "robbers, the lot of you", cn: "你们这帮土匪" }
          ]
        }
      ]
    },

    /* ==================== 04-03 邀约与婉拒 ==================== */
    {
      id: "s04-03",
      domain: "04",
      title: "邀约与婉拒",
      ielts: "口语 P1 社交 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "好友 · 同学",
          register: "随意",
          channel: "面对面",
          barrier: "无",
          result: "达成（两人都去）",
          lines: [
            { who: "Nadia", en: "So, are we doing the coast trip or what? The forecast looks decent for Saturday.", cn: "那，海边那趟到底去不去？周六的天气预报还行。" },
            { who: "Ben", en: "I'm in. What time are you thinking?", cn: "我去。你想几点出发？" },
            { who: "Nadia", en: "Early. Leave after nine and we'll sit in traffic for two hours.", cn: "早点。九点以后出门，得在路上堵两个小时。" },
            { who: "Ben", en: "How early is early?", cn: "早就早到几点？" },
            { who: "Nadia", en: "Seven. I can pick you up, I've got the car this week.", cn: "七点。我可以来接你，这周车在我这儿。" },
            { who: "Ben", en: "Seven it is. Do you want me to bring anything?", cn: "那就七点。要我带点什么吗？" },
            { who: "Nadia", en: "Coffee. And that cool box, if it fits in the back.", cn: "咖啡。还有那个保温箱，后备箱塞得下的话。" },
            { who: "Ben", en: "It fits. I'll do sandwiches as well, saves us stopping.", cn: "塞得下。我再做点三明治，省得路上停。" },
            { who: "Nadia", en: "Perfect. Oh, Priya might come too, she's checking with work.", cn: "太好了。对了，Priya 可能也来，她在跟公司确认。" },
            { who: "Ben", en: "The more the better. Let me know tonight so I buy enough food.", cn: "人越多越好。今晚告诉我，我好按人数买吃的。" },
            { who: "Nadia", en: "Will do. Text me your address again, I always get the number wrong.", cn: "好。地址再发我一遍，我老记错门牌号。" },
            { who: "Ben", en: "Sent already. See you Saturday.", cn: "已经发了。周六见。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "下属 · 主管",
          register: "中性偏正式",
          channel: "面对面（办公室）",
          barrier: "无",
          result: "达成（主管答应，时间待确认）",
          lines: [
            { who: "Owen", en: "Rachel, have you got a minute? It's not about the project.", cn: "Rachel，你有空吗？不是项目的事。" },
            { who: "Rachel", en: "Go ahead.", cn: "你说。" },
            { who: "Owen", en: "A few of us are doing a dinner on Friday for Marco, he leaves at the end of the month. We'd love you to come.", cn: "我们几个周五给 Marco 办个饭局，他月底就走。希望你能来。" },
            { who: "Rachel", en: "That's kind of you to organise. Where?", cn: "你们想得挺周到。在哪家？" },
            { who: "Owen", en: "The Italian place on Bridge Street. Half past seven.", cn: "桥街那家意大利餐厅。七点半。" },
            { who: "Rachel", en: "I have a call with Singapore at six, but that should be done by seven.", cn: "我六点跟新加坡有个电话会，不过七点前应该能结束。" },
            { who: "Owen", en: "So that works?", cn: "那就是能来？" },
            { who: "Rachel", en: "It should. Send me the details and I'll confirm on Thursday.", cn: "应该可以。把详细信息发我，我周四给你准信。" },
            { who: "Owen", en: "Of course. And it's Dutch, by the way. We're splitting it.", cn: "好。顺便说一下是 AA，大家平摊。" },
            { who: "Rachel", en: "Naturally. I'll bring cash.", cn: "那当然。我带现金。" },
            { who: "Owen", en: "Great. Thanks, Rachel.", cn: "太好了。谢谢 Rachel。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "同事 · 周末徒步小团体",
          register: "中性",
          channel: "面对面",
          barrier: "对方提出要你长期固定参加的邀请",
          result: "折中（改成每月第一个周日去一次）",
          lines: [
            { who: "Sofia", en: "We're doing the ridge walk again on Sunday. You should come, you said you wanted to get out more.", cn: "周日我们又去走山脊那条线。你来吧，你说过想多出去走走。" },
            { who: "Marcus", en: "I did say that. But Sunday is my only proper day off this month.", cn: "我是说过。可这个月周日是我唯一像样的休息日。" },
            { who: "Sofia", en: "It's not work, though. That's the whole point.", cn: "这又不是上班。重点就在这儿。" },
            { who: "Marcus", en: "I know. It's just that six hours on a hill isn't rest for me right now.", cn: "我知道。只是现在对我来说，在山上走六个小时不算休息。" },
            { who: "Sofia", en: "Fair enough. It runs every Sunday anyway, you could come when you feel like it.", cn: "也有道理。反正每周日都有，你想来的时候来就行。" },
            { who: "Marcus", en: "How about once a month? First Sunday, and I'll actually turn up.", cn: "一个月一次怎么样？第一个周日，我保证到。" },
            { who: "Sofia", en: "Once a month beats never. I'm holding you to the first Sunday.", cn: "一个月一次总比不来强。第一个周日我可盯着你。" },
            { who: "Marcus", en: "Deal. I'll bring the good flask.", cn: "说定了。我带那个好保温壶。" },
            { who: "Sofia", en: "Now you're talking.", cn: "这话我爱听。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "朋友 · 临时饭局",
          register: "随意",
          channel: "电话",
          barrier: "邀约信息只发给了部分人，时间对不上",
          result: "修复（当场补通知，四十分钟后赶到）",
          lines: [
            { who: "Emma", en: "Hi, it's Emma. Are you on your way? We're all here.", cn: "喂，我是 Emma。你在路上了吗？我们都到了。" },
            { who: "Jake", en: "On my way where? I thought it was tomorrow.", cn: "在去哪儿的路上？我以为明天。" },
            { who: "Emma", en: "No, tonight. I put it in the group.", cn: "不是，今晚。我在群里发了。" },
            { who: "Jake", en: "I must have missed it. That group has been dead for weeks.", cn: "我肯定漏看了。那个群好几周没动静了。" },
            { who: "Emma", en: "Hang on... no, you're right. I only told Dan and Leo. I meant to send it to everyone.", cn: "等等……不，你说得对。我只跟 Dan 和 Leo 说了。本来要发群里，忘了。" },
            { who: "Jake", en: "Right. Well, I can be there in forty minutes if that's not too late.", cn: "这样。要是不算太晚，我四十分钟能到。" },
            { who: "Emma", en: "We haven't even ordered. Come.", cn: "我们还没点菜呢。来吧。" },
            { who: "Jake", en: "What's the address? The place we went to last time?", cn: "地址是哪儿？还是上次那家？" },
            { who: "Emma", en: "Same street, but the one with the red door. I'll send a pin now.", cn: "同一条街，红门那家。我这就发定位。" },
            { who: "Jake", en: "Got it. Sorry about the confusion.", cn: "收到了。不好意思，搞混了。" },
            { who: "Emma", en: "My fault, not yours. See you in a bit.", cn: "是我的错，不怪你。一会儿见。" }
          ]
        },
        {
          variant: "情绪型（被拒绝后受伤）",
          relation: "多年好友",
          register: "随意（情绪化）",
          channel: "面对面",
          barrier: "对方把你的婉拒听成人际疏远，情绪先上来",
          result: "达成（说明真实原因后和解）",
          lines: [
            { who: "Lena", en: "So that's a no, then. Third time.", cn: "所以这就是不去。第三次了。" },
            { who: "Ada", en: "It isn't about you, honestly.", cn: "真的不是针对你。" },
            { who: "Lena", en: "It never is. Everyone's just busy, and then one day nobody calls.", cn: "从来都不是。大家都忙，然后有一天就没人打电话了。" },
            { who: "Ada", en: "Lena. Look at me. My mum's been in hospital since March. That's where my weekends go.", cn: "Lena，看着我。我妈三月就住院了，我的周末都在那儿。" },
            { who: "Lena", en: "...You never said.", cn: "……你从来没说过。" },
            { who: "Ada", en: "I didn't want to make it a thing. I'm sorry, I should have told you.", cn: "我不想搞得那么沉重。对不起，我该告诉你的。" },
            { who: "Lena", en: "No, I'm sorry. I've been sitting here counting.", cn: "不，是我对不起。我还坐在这儿数次数。" },
            { who: "Ada", en: "Come with me on Thursday, if you like. Visiting hours are generous.", cn: "你要愿意，周四陪我去吧。探视时间挺长的。" },
            { who: "Lena", en: "I will. And I'll bring those biscuits she likes.", cn: "我去。我带她爱吃的那种饼干。" },
            { who: "Ada", en: "She'll love that.", cn: "她会很高兴的。" }
          ]
        },
        {
          variant: "渠道变体（群聊 / 多人）",
          relation: "同学群 · 五人",
          register: "随意",
          channel: "群聊（文字）",
          barrier: "多人插话，地点和人数始终定不下来",
          result: "达成（换到车站的酒吧，七点半）",
          lines: [
            { who: "Tina", en: "ok saturday dinner. who's in", cn: "周六吃饭。谁去" },
            { who: "Rob", en: "in", cn: "我" },
            { who: "Sam", en: "in. where", cn: "我。哪儿" },
            { who: "Tina", en: "that thai place? the one on mill road", cn: "那家泰国菜？磨坊路那家" },
            { who: "Rob", en: "that place is tiny, we'll never get five in", cn: "那家店很小，五个人根本坐不下" },
            { who: "Sam", en: "true. also i hate thai", cn: "确实。而且我讨厌泰国菜" },
            { who: "Tina", en: "sam you eat nothing but toast", cn: "Sam 你除了吐司什么都不吃" },
            { who: "Sam", en: "correct, and i'm thriving", cn: "没错，而且我过得很好" },
            { who: "Rob", en: "what about the pub by the station? big tables, food's fine", cn: "车站那家酒吧怎么样？桌子大，吃的也还行" },
            { who: "Tina", en: "fine by me. 7.30?", cn: "我没问题。七点半？" },
            { who: "Rob", en: "7.30", cn: "七点半" },
            { who: "Sam", en: "7.30. i'll book a table", cn: "七点半。我来订位" },
            { who: "Tina", en: "sam booking a table is the most organised thing you've done all year", cn: "Sam 订桌子是你今年最有条理的一件事" },
            { who: "Sam", en: "don't tell anyone", cn: "别跟人说" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "会议主办方 · 受邀讲者",
          register: "正式",
          channel: "面对面（会后）",
          barrier: "无（但需正式措辞、讲究礼数）",
          result: "达成",
          lines: [
            { who: "主办", en: "Dr Whitfield, thank you again for the keynote. It provoked a great deal of discussion.", cn: "Whitfield 博士，再次感谢您的主题演讲，引起了大量讨论。" },
            { who: "讲者", en: "That's very kind. You have an engaged group here.", cn: "您太客气了。你们这里的人都很投入。" },
            { who: "主办", en: "We wondered whether you might join us for dinner this evening. The committee would be delighted.", cn: "我们想请您今晚与我们共进晚餐。委员会会非常高兴。" },
            { who: "讲者", en: "I'd be honoured. May I ask where and at what hour?", cn: "我很荣幸。请问地点和时间？" },
            { who: "主办", en: "The Old Hall, at half past seven. I shall send a car if that is convenient.", cn: "老礼堂，七点半。如果方便，我派车接您。" },
            { who: "讲者", en: "A car is not necessary, though I appreciate the offer. I shall walk over.", cn: "车就不必了，不过多谢您的好意。我走过去。" },
            { who: "主办", en: "As you prefer. May I ask whether you have any dietary requirements?", cn: "随您。请问您饮食上有什么禁忌吗？" },
            { who: "讲者", en: "None at all. I look forward to it.", cn: "完全没有。我很期待。" },
            { who: "主办", en: "Splendid. I shall meet you at the entrance at twenty past.", cn: "太好了。我七点二十在门口等您。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "室友",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Kai", en: "you around sat", cn: "周六在吗" },
            { who: "Jo", en: "depends", cn: "看情况" },
            { who: "Kai", en: "depends on what", cn: "看什么情况" },
            { who: "Jo", en: "on what you're about to ask me", cn: "看你要问我什么" },
            { who: "Kai", en: "mate's thing. bbq. his garden. free food", cn: "哥们儿的事。烧烤。他家花园。白吃" },
            { who: "Jo", en: "why didn't you lead with free food", cn: "你干嘛不先说白吃" },
            { who: "Kai", en: "so that's a yes", cn: "那就是去" },
            { who: "Jo", en: "it's a yes", cn: "是去" },
            { who: "Kai", en: "he said bring nothing", cn: "他说不用带东西" },
            { who: "Jo", en: "i'm bringing crisps anyway", cn: "我还是带薯片" },
            { who: "Kai", en: "obviously", cn: "那当然" }
          ]
        }
      ]
    },

    /* ==================== 04-04 道歉与和解 ==================== */
    {
      id: "s04-04",
      domain: "04",
      title: "道歉与和解",
      ielts: "口语 P2 人际 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "好友",
          register: "随意",
          channel: "面对面",
          barrier: "无",
          result: "达成（和好）",
          lines: [
            { who: "Tom", en: "I'm sorry about last night. I said I'd be there and I wasn't.", cn: "昨晚的事对不起。我说了会去，结果没去。" },
            { who: "Ana", en: "You weren't. I waited forty minutes.", cn: "你是没去。我等了四十分钟。" },
            { who: "Tom", en: "I know. I got caught up with my brother's thing and just... didn't text. That's the part I'm sorry about.", cn: "我知道。我被我哥的事绊住了，就……没发消息。这部分才是我要道歉的。" },
            { who: "Ana", en: "The waiting I can forgive. The not texting is what made me angry.", cn: "等我可以原谅。让我生气的是你没发消息。" },
            { who: "Tom", en: "Fair. It won't happen again, and if it does, I'll be the one waiting.", cn: "说得对。不会有下次；真有，就换我等。" },
            { who: "Ana", en: "I'll hold you to that.", cn: "那我可记住了。" },
            { who: "Tom", en: "Coffee is on me for a week. Starting now.", cn: "一周的咖啡我请。从现在开始。" },
            { who: "Ana", en: "Now that's an apology I understand.", cn: "这种道歉我才听得懂。" },
            { who: "Tom", en: "I know my audience.", cn: "我懂我的听众。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "下属 · 主管",
          register: "中性偏正式",
          channel: "面对面（办公室）",
          barrier: "无",
          result: "达成（补救方案被接受）",
          lines: [
            { who: "Priya", en: "Have you got five minutes? I need to tell you something before the client does.", cn: "你有五分钟吗？有件事我得在客户之前告诉你。" },
            { who: "Daniel", en: "That is never a good opening.", cn: "这开场白从来都不是好事。" },
            { who: "Priya", en: "I sent the March figures with the wrong quarter in the header. They've had it since Monday.", cn: "我发的三月数据，表头写错了季度。他们周一就收到了。" },
            { who: "Daniel", en: "How wrong?", cn: "错得多严重？" },
            { who: "Priya", en: "The numbers are right. The labels are not. Anyone reading quickly would think we're down twelve percent.", cn: "数字是对的，标签不对。快速扫一眼的人会以为我们下滑了百分之十二。" },
            { who: "Daniel", en: "Have you told them?", cn: "你告诉他们了吗？" },
            { who: "Priya", en: "Not yet. I wanted to tell you first, and I've drafted the correction email for you to look at.", cn: "还没有。我想先跟你说，改正的邮件我写好了草稿，等你过目。" },
            { who: "Daniel", en: "Send it within the hour and copy me. Add a line saying we'll walk them through it on Thursday.", cn: "一小时内发出去，抄送我。再加一句，说我们周四会跟他们逐项过一遍。" },
            { who: "Priya", en: "I'll do it now. I'm sorry, Daniel.", cn: "我马上办。对不起，Daniel。" },
            { who: "Daniel", en: "You caught it before they did. That's the job.", cn: "你在他们发现之前就抓到了。这就是本事。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "前同事 · 借钱未还",
          register: "中性",
          channel: "面对面",
          barrier: "对方不接受一句口头道歉，要求实际方案",
          result: "折中（分期写清，先按每月两百五）",
          lines: [
            { who: "Nadia", en: "I owe you an apology, and some money.", cn: "我欠你一个道歉，还有一笔钱。" },
            { who: "Rob", en: "You owe me eleven hundred and eight months of silence.", cn: "你欠我一千一，还有八个月的沉默。" },
            { who: "Nadia", en: "That's fair. I'm sorry. I should have called even when I couldn't pay.", cn: "说得对。对不起，就算还不上，我也该打电话。" },
            { who: "Rob", en: "Sorry is cheap at this point.", cn: "到这一步，对不起不值钱。" },
            { who: "Nadia", en: "I know. I'm not asking you to say it's fine. I'm asking what would actually fix it.", cn: "我知道。我不是要你说没事。我是问，怎么样才算真的解决。" },
            { who: "Rob", en: "A plan. Written down. With dates.", cn: "一个计划，写下来，有日期。" },
            { who: "Nadia", en: "Two hundred a month, from the first of next month. Twelve months, the last one smaller.", cn: "每月两百，下个月一号开始。十二个月，最后一个月少一点。" },
            { who: "Rob", en: "Two fifty, and I stop being angry by month three.", cn: "两百五，而且我第三个月起不再生气。" },
            { who: "Nadia", en: "Two fifty. Send me your account details.", cn: "两百五。把你账号发我。" },
            { who: "Rob", en: "I'll text them tonight. And Nadia, thanks for not disappearing again.", cn: "今晚发你。还有 Nadia，谢谢你没再消失。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "同事 · 群聊里的玩笑",
          register: "随意",
          channel: "文字消息 → 电话",
          barrier: "道歉的文字被读成讽刺，越解释越糟",
          result: "修复（改当面道歉）",
          lines: [
            { who: "Mo", en: "hey. about the thing in the group chat", cn: "嘿。群里那事儿" },
            { who: "Alex", en: "which thing", cn: "哪件事" },
            { who: "Mo", en: "the one everyone laughed at. my message. it came out wrong", cn: "大家都笑的那件。我那条消息。写得不对。" },
            { who: "Alex", en: "it came out like you were mocking her presentation", cn: "看起来像你在嘲笑她的演讲" },
            { who: "Mo", en: "i was mocking my own slides, honestly. then i re-read it and, yeah. it reads badly", cn: "我本意是嘲我自己的幻灯片。后来重读了一遍，嗯，读起来确实很糟。" },
            { who: "Alex", en: "it does read badly", cn: "确实很糟" },
            { who: "Mo", en: "can i call you? typing this is making it worse", cn: "能打电话吗？越打字越糟" },
            { who: "Alex", en: "yeah, call", cn: "行，打吧" },
            { who: "Mo", en: "Right. Short version: I'm sorry. I'll post a correction in the group.", cn: "好。简短版：对不起。我会在群里发一条更正。" },
            { who: "Alex", en: "Don't post a correction, that makes it a bigger thing. Say it to her face tomorrow.", cn: "别发更正，那样反而闹大。明天你当面跟她说。" },
            { who: "Mo", en: "That's better. I'll do that.", cn: "这样好。我明天说。" }
          ]
        },
        {
          variant: "情绪型（积压不满）",
          relation: "室友",
          register: "随意（情绪化）",
          channel: "面对面",
          barrier: "对方积压已久，先要发泄完才谈得下去",
          result: "达成（定下新规矩，当场动手）",
          lines: [
            { who: "Jo", en: "The kitchen. Again.", cn: "厨房。又是这样。" },
            { who: "Kai", en: "I was going to do it in the morning.", cn: "我打算早上弄的。" },
            { who: "Jo", en: "You always say that. It's been four days.", cn: "你每次都说。已经四天了。" },
            { who: "Kai", en: "All right, I'm sorry. I'll do them now.", cn: "好吧，对不起。我现在就洗。" },
            { who: "Jo", en: "It's not the pans, Kai. It's that I asked you three times and you said yeah three times.", cn: "不是锅的事，Kai。是我问了你三次，你三次都说好。" },
            { who: "Kai", en: "...Yeah. I do that. I say yeah and then I don't.", cn: "……是。我确实这样。嘴上说好，然后不做。" },
            { who: "Jo", en: "That's the bit that's exhausting.", cn: "累人的就是这一点。" },
            { who: "Kai", en: "Okay. New rule: I don't say yeah unless I'm doing it now. And I'm doing the pans now.", cn: "好。新规矩：不是马上做，我就不说好。现在我马上洗锅。" },
            { who: "Jo", en: "Do them badly and I'll still be annoyed.", cn: "洗不干净我还是会烦。" },
            { who: "Kai", en: "Noted. Loudly.", cn: "记下了，大声记下。" }
          ]
        },
        {
          variant: "渠道变体（语音留言 / 电话）",
          relation: "老朋友 · 搬家失约",
          register: "中性",
          channel: "语音留言 → 电话",
          barrier: "留言断在半句，道歉没说完，只能再打一次",
          result: "达成（周六来搬箱子）",
          lines: [
            { who: "Lea", en: "You left a voicemail.", cn: "你留了条语音。" },
            { who: "Sam", en: "I did. Did you get it?", cn: "留了。你收到了吗？" },
            { who: "Lea", en: "The first half. You cut out at I'm sorry.", cn: "前半段。你说到「对不起」就断了。" },
            { who: "Sam", en: "Perfect. Then I'll say it again: I'm sorry. I had the van booked and I cancelled it for a work thing.", cn: "真巧。那我再说一次：对不起。我订好了车，又因为工作的事取消了。" },
            { who: "Lea", en: "We carried a sofa up three flights.", cn: "我们抬着沙发上三楼。" },
            { who: "Sam", en: "I know. I've been avoiding this call for a week.", cn: "我知道。这个电话我躲了一周。" },
            { who: "Lea", en: "That's the part I mind. Not the work thing. The week.", cn: "我介意的是这个。不是工作的事，是那一周。" },
            { who: "Sam", en: "Fair. I'll come on Saturday and take the boxes to the tip. All of them.", cn: "说得对。我周六来，把箱子都送去垃圾站，全部。" },
            { who: "Lea", en: "There are eleven.", cn: "有十一个。" },
            { who: "Sam", en: "There are eleven. Fine.", cn: "十一个。行。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "供应商 · 客户",
          register: "正式",
          channel: "面对面（正式会谈）",
          barrier: "无（但需正式致歉并给补偿方案）",
          result: "达成（继续合作）",
          lines: [
            { who: "客户", en: "Thank you for coming in. I would rather hear it from you than read it in an email.", cn: "感谢您亲自过来。我更愿意听您当面说，而不是从邮件里读到。" },
            { who: "供应商", en: "Of course. On behalf of the company, I apologise for the delay. It was our error, not the carrier's.", cn: "当然。我代表公司为这次延误致歉。是我们的失误，不是承运方的问题。" },
            { who: "客户", en: "Two weeks late on a launch date is not a small thing.", cn: "发布会日期晚了两周，这不是小事。" },
            { who: "供应商", en: "It is not, and we are not treating it as one. Your order has moved to the front of the queue and the expedited fee is waived.", cn: "确实不是，我们也没有当作小事处理。您的订单已调到最前面，加急费免除。" },
            { who: "客户", en: "And the shortfall? We were forty units short.", cn: "那缺的部分呢？我们少了四十台。" },
            { who: "供应商", en: "Those forty ship tomorrow by air, at our cost. I can put that in writing today.", cn: "那四十台明天空运发出，费用我们承担。我今天就可以书面确认。" },
            { who: "客户", en: "In writing, yes. And I would like a single point of contact for the next order.", cn: "书面确认，好。另外下一单我想要一个固定的对接人。" },
            { who: "供应商", en: "That would be me, directly. Here is my card.", cn: "就是我，直接找我。这是我名片。" },
            { who: "客户", en: "Then I think we can continue. Thank you for not making excuses.", cn: "那我想我们可以继续合作。谢谢您没有找借口。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "兄弟",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Nick", en: "you were a dick last night", cn: "你昨晚挺混蛋的" },
            { who: "Will", en: "yeah", cn: "嗯" },
            { who: "Nick", en: "that's it? yeah?", cn: "就这？嗯？" },
            { who: "Will", en: "i'm getting there", cn: "我在组织语言" },
            { who: "Will", en: "ok. sorry. i was a dick", cn: "好了。对不起。我是挺混蛋的" },
            { who: "Nick", en: "better", cn: "这还差不多" },
            { who: "Will", en: "pub tonight? my round. all night", cn: "今晚酒吧？我请，全程" },
            { who: "Nick", en: "all night is a big promise", cn: "全程可是个大承诺" },
            { who: "Will", en: "i'm good for it", cn: "我出得起" },
            { who: "Nick", en: "you're not. but i'll come", cn: "你出不起。不过我来" }
          ]
        }
      ]
    },

    /* ==================== 04-05 安慰与倾诉 ==================== */
    {
      id: "s04-05",
      domain: "04",
      title: "安慰与倾诉",
      ielts: "口语 P2 人际 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "好友 · 求职被拒",
          register: "随意",
          channel: "面对面",
          barrier: "无",
          result: "达成（情绪落地，约好一起改简历）",
          lines: [
            { who: "Rosa", en: "I didn't get it. They sent a two-line email.", cn: "我没拿到。他们就发了两行字的邮件。" },
            { who: "Ines", en: "Oh no. When?", cn: "不会吧。什么时候的事？" },
            { who: "Rosa", en: "This morning. I've been staring at the same spreadsheet pretending to work.", cn: "今天早上。我一整天盯着同一张表格假装在工作。" },
            { who: "Ines", en: "That's the worst kind of no. Do you want to talk about it, or do you want a distraction?", cn: "这种拒绝最难受。你想聊聊，还是想分散一下注意力？" },
            { who: "Rosa", en: "Talk. I think I need to say it out loud.", cn: "聊。我觉得我得把它说出来。" },
            { who: "Ines", en: "Then say it. Which part hurts most?", cn: "那就说。最难受的是哪一点？" },
            { who: "Rosa", en: "That I'd already told my mum. She was so pleased.", cn: "是我已经跟我妈说了。她特别高兴。" },
            { who: "Ines", en: "Ugh. That's the bit that stings.", cn: "唉。这才是最扎人的地方。" },
            { who: "Rosa", en: "I know it's one job. But it's the fourth no this year.", cn: "我知道只是一个岗位。可这是今年第四个拒绝了。" },
            { who: "Ines", en: "Four nos, and you're still applying. That is not nothing.", cn: "四个拒绝，你还在投。这可不是小事。" },
            { who: "Rosa", en: "Say that again in a week, when I've forgotten it.", cn: "一周以后我忘了的时候，你再说一遍。" },
            { who: "Ines", en: "I'll put it in my calendar. Bring your CV on Sunday and we'll rewrite the top half.", cn: "我记进日历。周日把简历带来，我们把上半部分重写。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "资深同事 · 新员工",
          register: "中性偏正式",
          channel: "面对面（办公室）",
          barrier: "无",
          result: "达成（重整旗鼓）",
          lines: [
            { who: "Rachel", en: "You've been very quiet since the review. Come and sit down for five minutes.", cn: "评审之后你一直很安静。过来坐五分钟。" },
            { who: "Tom", en: "It's fine. I just need to be better prepared next time.", cn: "没事。我下次准备得再充分一点就好。" },
            { who: "Rachel", en: "That's the right instinct and the wrong conclusion. You weren't unprepared.", cn: "这个直觉是对的，结论是错的。你不是没准备。" },
            { who: "Tom", en: "I froze on the second question.", cn: "第二个问题我卡住了。" },
            { who: "Rachel", en: "You paused. There's a difference, and nobody in that room thought you'd lost it.", cn: "你是停了一下。这不一样，屋里没人觉得你崩了。" },
            { who: "Tom", en: "It felt like ten minutes.", cn: "我感觉像停了十分钟。" },
            { who: "Rachel", en: "It was four seconds. I counted, because I've done exactly the same thing in front of the board.", cn: "四秒。我数了，因为我在董事会面前也干过一模一样的事。" },
            { who: "Tom", en: "Really?", cn: "真的？" },
            { who: "Rachel", en: "Nineteen ninety-eight, and worse than yours. What I do now is write down the three questions I'm afraid of, the night before.", cn: "九八年，比你还惨。我现在的做法是前一晚把最怕的三个问题写下来。" },
            { who: "Tom", en: "Does it help?", cn: "有用吗？" },
            { who: "Rachel", en: "It moves the fear to the night before, where it costs less.", cn: "它把恐惧提前到前一晚，代价小得多。" },
            { who: "Tom", en: "I'll try that. Thanks, Rachel.", cn: "我试试。谢谢 Rachel。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "朋友 · 刚分手",
          register: "中性",
          channel: "面对面",
          barrier: "对方提出你无法答应的请求（搬来长住）",
          result: "折中（先住三天，周六一起找房）",
          lines: [
            { who: "Mia", en: "I can't stay in that flat. Can I come to yours for a bit?", cn: "那房子我待不下去了。我能去你那儿住一阵吗？" },
            { who: "Dev", en: "How long is a bit?", cn: "一阵是多久？" },
            { who: "Mia", en: "I don't know. A month? Two?", cn: "我不知道。一个月？两个月？" },
            { who: "Dev", en: "I want to say yes, and I have to be honest: two months in my spare room would wreck us.", cn: "我想说行，但我得说实话：在我那间小屋住两个月，我们俩都会受不了。" },
            { who: "Mia", en: "So that's a no.", cn: "所以就是不行。" },
            { who: "Dev", en: "It's a no to two months. It's a yes to this week, tonight included, and I'll spend Saturday helping you look.", cn: "两个月不行。这一周可以，今晚就可以，周六我陪你找房子。" },
            { who: "Mia", en: "I don't want to look. I want to not think about it.", cn: "我不想找房子。我想不去想这件事。" },
            { who: "Dev", en: "Three nights of not thinking. Then Saturday we look, and I bring the coffee.", cn: "三个晚上不想。然后周六我们找，咖啡我带。" },
            { who: "Mia", en: "You're very annoying when you're reasonable.", cn: "你讲道理的时候特别烦人。" },
            { who: "Dev", en: "I've been told. Come on, I'll drive you to get your things.", cn: "有人说过了。走吧，我开车陪你去拿东西。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "同事 · 项目被换人",
          register: "随意",
          channel: "面对面",
          barrier: "安慰的话说错，正好戳在痛处",
          result: "修复（道歉并改成只倾听）",
          lines: [
            { who: "Nora", en: "They gave the project to Priya.", cn: "他们把项目给了 Priya。" },
            { who: "Sam", en: "At least you still have a job. Half the industry would kill for your salary.", cn: "至少你还有工作。这行一半人愿意为你的薪水拼命。" },
            { who: "Nora", en: "Right. So I should be grateful.", cn: "是啊。那我该感恩。" },
            { who: "Sam", en: "...That came out wrong.", cn: "……我说错了。" },
            { who: "Nora", en: "It came out like my problem isn't a problem.", cn: "听起来像我的问题不算问题。" },
            { who: "Sam", en: "I know. I do this thing where I try to fix it before I've heard it.", cn: "我知道。我总犯这毛病：还没听完就想解决。" },
            { who: "Nora", en: "Yes. You do.", cn: "对。你就是。" },
            { who: "Sam", en: "Start again. For the next ten minutes I won't say anything helpful.", cn: "重来。接下来十分钟我保证不说任何有用的话。" },
            { who: "Nora", en: "That's the most useful thing you've said all week.", cn: "这是你这周说得最有用的一句。" },
            { who: "Sam", en: "Was it really Priya?", cn: "真是 Priya 拿走的？" },
            { who: "Nora", en: "It was really Priya.", cn: "真是 Priya。" }
          ]
        },
        {
          variant: "情绪型（深夜崩溃）",
          relation: "姐妹",
          register: "随意（情绪化）",
          channel: "面对面（深夜）",
          barrier: "对方情绪崩溃，此刻要的是陪伴而不是方案",
          result: "达成（哭完说开，约好陪同办事）",
          lines: [
            { who: "Lena", en: "Sorry. I don't know why I'm crying.", cn: "抱歉。我不知道自己为什么在哭。" },
            { who: "Ada", en: "You don't need a reason. I'm not going anywhere.", cn: "不需要理由。我哪儿也不去。" },
            { who: "Lena", en: "It's stupid. It's just a form.", cn: "很蠢的。就是一张表格。" },
            { who: "Ada", en: "The visa form?", cn: "签证那张表？" },
            { who: "Lena", en: "They asked for my address for the last five years. I couldn't remember one of them and I just sat down on the floor.", cn: "他们要我这五年的住址。有一个我死活想不起来，然后就坐在地板上了。" },
            { who: "Ada", en: "So it wasn't the form.", cn: "所以不是表格的事。" },
            { who: "Lena", en: "It's that I'm doing this alone, and I'm so tired of being the only one holding it.", cn: "是我一个人在做这些，我太累了，一直只有我自己撑着。" },
            { who: "Ada", en: "You're not the only one. Not tonight, and not on Thursday when we hand it in.", cn: "不是只有你。今晚不是，周四交材料的时候也不是。" },
            { who: "Lena", en: "You'd come with me?", cn: "你陪我去？" },
            { who: "Ada", en: "I'll take the morning off. Now blow your nose, I'm making tea.", cn: "我请一上午假。现在擤擤鼻子，我去泡茶。" }
          ]
        },
        {
          variant: "渠道变体（深夜电话）",
          relation: "异地好友",
          register: "随意",
          channel: "电话（深夜）",
          barrier: "只听声音，沉默容易被听成不耐烦",
          result: "达成（远程分工，第二天代办）",
          lines: [
            { who: "Jay", en: "You've gone quiet. Are you still there?", cn: "你不说话了。还在吗？" },
            { who: "Nina", en: "I'm here. I was nodding. Which you can't see, sorry.", cn: "在。我在点头。你看不见，抱歉。" },
            { who: "Jay", en: "Right. Yeah.", cn: "嗯。好。" },
            { who: "Nina", en: "Say the thing you called to say. I've got all night.", cn: "把你要说的事说了吧。我一整晚都有空。" },
            { who: "Jay", en: "It's going to sound small on the phone.", cn: "在电话里说会显得是件小事。" },
            { who: "Nina", en: "Then it'll sound small and I'll still care about it. Try me.", cn: "那就显得小，我照样在乎。你说。" },
            { who: "Jay", en: "The flat fell through. The landlord took someone else's deposit.", cn: "房子黄了。房东收了别人的押金。" },
            { who: "Nina", en: "That is not small. Where are you sleeping on Friday?", cn: "这可不小。你周五睡哪儿？" },
            { who: "Jay", en: "Sofa at Dan's. Two weeks, maybe.", cn: "Dan 家的沙发。大概两周。" },
            { who: "Nina", en: "Send me the listings you like. I'll call the agents tomorrow morning while you're at work.", cn: "你把看中的房源发我。明天早上你上班的时候我打电话问中介。" },
            { who: "Jay", en: "You hate calling people.", cn: "你最讨厌给人打电话。" },
            { who: "Nina", en: "I hate you sleeping on Dan's sofa more.", cn: "我更讨厌你睡 Dan 家的沙发。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "导师 · 研究生",
          register: "正式",
          channel: "面对面（办公室）",
          barrier: "无（但需正式措辞、拿捏分寸）",
          result: "达成（重新规划申请结构）",
          lines: [
            { who: "导师", en: "I was sorry to hear the result. I know how much work went into that application.", cn: "听到结果我很遗憾。我知道你为那份申请花了多少功夫。" },
            { who: "学生", en: "Thank you. I have not yet decided what to do next.", cn: "谢谢您。我还没决定接下来怎么办。" },
            { who: "导师", en: "That is a reasonable place to be. The committee's comments were, in my view, unnecessarily severe.", cn: "这种状态很正常。在我看来，委员会的意见严厉得不必要。" },
            { who: "学生", en: "They said the proposal lacked originality.", cn: "他们说我的方案缺乏原创性。" },
            { who: "导师", en: "They said it lacked a clearly stated contribution, which is a different complaint, and a fixable one.", cn: "他们说的是没有清晰陈述的贡献，这是另一回事，而且可以改。" },
            { who: "学生", en: "You think it can be fixed?", cn: "您觉得能改？" },
            { who: "导师", en: "I think the second chapter is the strongest thing you have written, and it is buried on page forty.", cn: "我认为第二章是你写过最好的东西，而它被埋在第四十页。" },
            { who: "学生", en: "So I should move it.", cn: "那我应该把它往前放。" },
            { who: "导师", en: "You should lead with it. Shall we meet on Tuesday and work through the structure together?", cn: "你应该用它开头。我们周二见一面，一起理一遍结构，好吗？" },
            { who: "学生", en: "I would be grateful.", cn: "我很感激。" },
            { who: "导师", en: "Bring the printed draft. And do not rewrite anything before Tuesday.", cn: "把打印稿带来。周二之前什么都别重写。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "室友",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Jo", en: "you ok", cn: "你还好吗" },
            { who: "Kai", en: "no", cn: "不好" },
            { who: "Jo", en: "coming home with chips", cn: "我带薯片回来" },
            { who: "Kai", en: "i'm not hungry", cn: "我不饿" },
            { who: "Jo", en: "not for you. for me. i'm sitting with you while i eat them", cn: "不是给你。是给我。我边吃边陪你坐着" },
            { who: "Kai", en: "that's grim", cn: "太惨了" },
            { who: "Jo", en: "it's love actually", cn: "这其实是爱" },
            { who: "Kai", en: "bring the salt and vinegar ones", cn: "要盐醋味的" },
            { who: "Jo", en: "there he is", cn: "这才像你" }
          ]
        }
      ]
    },

    /* ==================== 04-06 道谢与回应称赞 ==================== */
    {
      id: "s04-06",
      domain: "04",
      title: "道谢与回应称赞",
      ielts: "口语 P1 社交 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "好友",
          register: "随意",
          channel: "面对面",
          barrier: "无",
          result: "达成（正经道谢，约饭答谢）",
          lines: [
            { who: "Ben", en: "I owe you one for last week.", cn: "上周的事我欠你一个人情。" },
            { who: "Nadia", en: "You don't owe me anything.", cn: "你不欠我什么。" },
            { who: "Ben", en: "I do. You drove me to the airport at five in the morning.", cn: "我欠。你早上五点送我去机场。" },
            { who: "Nadia", en: "You'd do the same.", cn: "换你也会这样。" },
            { who: "Ben", en: "I would, badly. Which is why I'm saying thank you properly.", cn: "我会，但做得很差。所以我才要正经道个谢。" },
            { who: "Nadia", en: "All right. You're welcome. Properly.", cn: "好吧。不客气。正经的。" },
            { who: "Ben", en: "Dinner is on me, Friday, anywhere you like.", cn: "周五我请你吃饭，地方你挑。" },
            { who: "Nadia", en: "Anywhere? You'll regret saying that.", cn: "随便挑？你会后悔的。" },
            { who: "Ben", en: "I've seen your taste. I'll survive.", cn: "我见过你的品味。我撑得住。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "主管 · 下属",
          register: "中性偏正式",
          channel: "面对面（办公室）",
          barrier: "无",
          result: "达成（收下称赞，接下更大责任）",
          lines: [
            { who: "Daniel", en: "The client asked for you by name on the next phase. I thought you should know.", cn: "客户在下一阶段点名要你。我想你应该知道。" },
            { who: "Priya", en: "That's good to hear. Thank you for telling me.", cn: "很高兴听到这个。谢谢您告诉我。" },
            { who: "Daniel", en: "It isn't a favour, it's an accurate report. You ran that handover well.", cn: "这不是人情，是如实的反馈。那次交接你做得好。" },
            { who: "Priya", en: "I had good notes from the last person.", cn: "我有上一任留下的好笔记。" },
            { who: "Daniel", en: "You also had a client shouting on line two, and you didn't raise your voice once.", cn: "你还要应付二号线上吼叫的客户，一次都没提高嗓门。" },
            { who: "Priya", en: "That took practice. I used to apologise for things that weren't my fault.", cn: "那是练出来的。我以前老为自己没做错的事道歉。" },
            { who: "Daniel", en: "Well, it works. Which brings me to the next phase: I'd like you to lead it.", cn: "总之很管用。这就说到下一阶段：我希望你来牵头。" },
            { who: "Priya", en: "Lead it, or run it with you?", cn: "牵头，还是跟您一起做？" },
            { who: "Daniel", en: "Lead it. I'll be on the call if you want a second opinion.", cn: "牵头。你要是想听第二个意见，我随时在。" },
            { who: "Priya", en: "Then I'd like that in writing, so I can hold you to it.", cn: "那我希望您写下来，这样我好拿这个找你。" },
            { who: "Daniel", en: "Ha. Fair. I'll send it this afternoon.", cn: "哈，有道理。我今天下午发。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "客户 · 项目负责人",
          register: "中性偏正式",
          channel: "视频会议",
          barrier: "对方要送礼公开致谢，公司规定不能收",
          result: "折中（退回礼物，收下写明姓名的书面致谢）",
          lines: [
            { who: "客户", en: "Before we finish, we'd like to send your team something. A case of wine, something like that.", cn: "结束之前，我们想给你们团队送点东西。一箱酒之类的。" },
            { who: "负责人", en: "That's very generous, and I have to turn it down. We're not allowed to accept gifts.", cn: "太客气了，但我得拒绝。我们规定不能收礼。" },
            { who: "客户", en: "It's wine, not a bribe.", cn: "是酒，不是贿赂。" },
            { who: "负责人", en: "I know, and the rule doesn't know the difference. It's the same rule that protects you when we're bidding.", cn: "我知道，可规定分不出这个。就是这条规定在投标时保护你们。" },
            { who: "客户", en: "Then let me write something instead. A letter to your director.", cn: "那我改成写点东西。给你们总监写封信。" },
            { who: "负责人", en: "That I can accept, and honestly it's worth more internally than wine.", cn: "这个我可以收。说实话，在我们内部比酒有用。" },
            { who: "客户", en: "Name the three people who did the work and I'll mention them.", cn: "把干活的三个人名字给我，我写上。" },
            { who: "负责人", en: "Two of them are contractors. Do their names still count?", cn: "其中两个是外包。名字也算数吗？" },
            { who: "客户", en: "Especially then.", cn: "那更算。" },
            { who: "负责人", en: "I'll send the names today. Thank you, that's a better thank-you than the wine.", cn: "我今天把名字发你。谢谢，这比酒更让人受用。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "同事",
          register: "随意",
          channel: "文字消息",
          barrier: "称赞的文字被读成讽刺，对方反而更不高兴",
          result: "修复（说清指的是哪一处）",
          lines: [
            { who: "Rob", en: "great work on the deck btw", cn: "顺便说一句，幻灯片做得好" },
            { who: "Tina", en: "is that sarcasm", cn: "这是讽刺吗" },
            { who: "Rob", en: "no?", cn: "不是？" },
            { who: "Tina", en: "because you rewrote half of it on tuesday", cn: "因为你周二改了一半" },
            { who: "Rob", en: "i rewrote the numbers, not the words. the structure is yours", cn: "我改的是数字，不是文字。结构是你写的" },
            { who: "Tina", en: "you should have said that on tuesday", cn: "你周二就该这么说" },
            { who: "Rob", en: "i know. i said it badly then", cn: "我知道。当时没说好" },
            { who: "Tina", en: "you said, and i quote, this bit is confusing", cn: "你说的是，我引用一下，这段有点绕" },
            { who: "Rob", en: "that was about the chart. the chart was confusing", cn: "那是说图表。图表确实绕" },
            { who: "Tina", en: "so the deck is fine", cn: "所以幻灯片没问题" },
            { who: "Rob", en: "the deck is good. i'm saying so badly, but i'm saying it", cn: "幻灯片很好。我说得不好，但我是这个意思" },
            { who: "Tina", en: "ok. thank you. badly", cn: "行。谢谢你。虽然说得不好" }
          ]
        },
        {
          variant: "情绪型（不肯收下称赞）",
          relation: "朋友 · 姐弟",
          register: "随意（情绪化）",
          channel: "面对面",
          barrier: "对方一直自我贬低，不肯把称赞收下",
          result: "达成（终于收下第一句谢谢）",
          lines: [
            { who: "Ada", en: "You know you saved that dinner, right? The whole thing would have died without you.", cn: "你知道那顿饭是你救回来的吧？没有你整场就冷掉了。" },
            { who: "Lena", en: "I only asked a few questions.", cn: "我只是问了几个问题。" },
            { who: "Ada", en: "You asked my father-in-law about his boat. Nobody has ever got three sentences out of that man.", cn: "你问我公公那条船的事。从来没人能让他说出三句话。" },
            { who: "Lena", en: "It's not a skill. It's noticing when someone is about to be ignored.", cn: "这不算本事。就是注意到有人快被忽略了。" },
            { who: "Ada", en: "Lena. Take the compliment.", cn: "Lena。把夸奖收下。" },
            { who: "Lena", en: "I don't know how.", cn: "我不知道怎么收。" },
            { who: "Ada", en: "You say thank you. That's the whole move.", cn: "你说谢谢。就这一步。" },
            { who: "Lena", en: "...I find it easier to give them than to get them.", cn: "……我觉得给出去比收下来容易。" },
            { who: "Ada", en: "I've noticed. Try it once, for me.", cn: "我看出来了。为了我，试一次。" },
            { who: "Lena", en: "Thank you. That's... uncomfortable.", cn: "谢谢。这……挺不舒服的。" },
            { who: "Ada", en: "It gets easier by the fourth one.", cn: "第四次就习惯了。" }
          ]
        },
        {
          variant: "渠道变体（多人会议）",
          relation: "跨部门同事 · 多人会议",
          register: "半正式",
          channel: "多人会议",
          barrier: "当众致谢被打断，功劳差点没写进记录",
          result: "达成（写进会议记录，会后补说完）",
          lines: [
            { who: "主持", en: "Last item, then we're done. Anything to flag?", cn: "最后一项，然后就散会。有什么要提的吗？" },
            { who: "Kim", en: "One thing. The migration went smoothly because Owen rebuilt the scripts on Friday night.", cn: "有一件事。这次迁移很顺，是因为 Owen 周五晚上重写了脚本。" },
            { who: "Owen", en: "The runbook from last quarter did half the work.", cn: "上一季度的运行手册也顶了一半。" },
            { who: "主持", en: "Sorry, we're at time. Noted, thank you, Owen.", cn: "抱歉，时间到了。记下了，谢谢你 Owen。" },
            { who: "Kim", en: "Can that go in the minutes? With his name on it.", cn: "这个能写进会议记录吗？写上他的名字。" },
            { who: "主持", en: "It's in. Owen, apologies for cutting you off.", cn: "已经写进去了。Owen，抱歉打断你。" },
            { who: "Owen", en: "It's fine. I was only going to say the runbook helped.", cn: "没事。我只是想说手册也起了作用。" },
            { who: "Kim", en: "Then say it in the channel and I'll reply to it.", cn: "那你在群里说，我来回复。" },
            { who: "Owen", en: "Thanks, Kim. You didn't have to do that.", cn: "谢谢 Kim。你不用这么做。" },
            { who: "Kim", en: "I did. I've watched you do this three times without anyone noticing.", cn: "我得做。我已经看过三次你干完这些却没人注意到。" },
            { who: "Owen", en: "Now it's written down. That's new.", cn: "现在它被写下来了。这倒是头一回。" },
            { who: "主持", en: "Next time, raise it at item two and we'll have time for it.", cn: "下次放到第二项提，我们就有时间谈了。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "获奖者 · 颁奖委员会",
          register: "正式",
          channel: "面对面（典礼后）",
          barrier: "无（但需正式得体地答谢、把握分寸）",
          result: "达成",
          lines: [
            { who: "委员", en: "On behalf of the committee, may I congratulate you. The award was unanimous.", cn: "我代表委员会向您道贺。这个奖是全票通过的。" },
            { who: "获奖者", en: "I am most grateful. I confess I did not prepare anything to say.", cn: "我非常感激。坦白说，我没有准备任何感言。" },
            { who: "委员", en: "There is no need. The citation spoke for itself.", cn: "不必。颁奖词已经说得很清楚了。" },
            { who: "获奖者", en: "Then allow me to thank the two people who made it possible, Professor Iyer and my colleague Miss Fenn.", cn: "那请允许我感谢两位让这件事成为可能的人：Iyer 教授和我的同事 Fenn 小姐。" },
            { who: "委员", en: "They are both on the guest list this evening.", cn: "他们两位都在今晚的宾客名单上。" },
            { who: "获奖者", en: "That is very thoughtful of you.", cn: "你们想得真周到。" },
            { who: "委员", en: "We shall ask you for a few words after dinner. No more than three minutes.", cn: "晚宴后我们会请您说几句。不超过三分钟。" },
            { who: "获奖者", en: "Three minutes I can manage, having had fair warning.", cn: "既然提前告知，三分钟我可以应付。" },
            { who: "委员", en: "Splendid. Please do not thank the committee, it embarrasses us.", cn: "太好了。请不要感谢委员会，我们会不好意思。" },
            { who: "获奖者", en: "Then I shall thank the cleaners instead. They have kept my laboratory usable for eleven years.", cn: "那我就感谢保洁人员。他们让我的实验室十一年都能用。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "同学",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Sam", en: "you absolute legend", cn: "你真是活菩萨" },
            { who: "Rob", en: "what did i do", cn: "我干什么了" },
            { who: "Sam", en: "the notes. the whole module. in one doc", cn: "笔记。整门课。一个文档" },
            { who: "Rob", en: "oh yeah. took ages", cn: "哦那个。弄了好久" },
            { who: "Sam", en: "you saved my exam", cn: "你救了我的考试" },
            { who: "Rob", en: "you're gonna fail anyway", cn: "你反正要挂" },
            { who: "Sam", en: "probably. but with notes", cn: "大概吧。但是带着笔记挂" },
            { who: "Rob", en: "coffee tomorrow. you buy", cn: "明天咖啡。你请" },
            { who: "Sam", en: "obviously", cn: "那当然" }
          ]
        }
      ]
    },

    /* ==================== 04-07 闲聊与八卦 ==================== */
    {
      id: "s04-07",
      domain: "04",
      title: "闲聊与八卦",
      ielts: "口语 P1 社交 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "好友 · 同事",
          register: "随意",
          channel: "面对面（午饭）",
          barrier: "无",
          result: "达成（聊完还顺手提醒彼此看机会）",
          lines: [
            { who: "Ines", en: "Did you hear about Marco?", cn: "你听说 Marco 的事了吗？" },
            { who: "Rosa", en: "No. What?", cn: "没有。怎么了？" },
            { who: "Ines", en: "He's leaving. End of the month.", cn: "他要走了。月底。" },
            { who: "Rosa", en: "Leaving leaving, or moving to another team?", cn: "是真走，还是转去别的组？" },
            { who: "Ines", en: "Leaving. He told Priya, and Priya told everyone, which he probably hadn't planned.", cn: "真走。他告诉了 Priya，Priya 又告诉了所有人，这大概不在他计划里。" },
            { who: "Rosa", en: "Poor Marco. Where's he going?", cn: "可怜的 Marco。他去哪儿？" },
            { who: "Ines", en: "Somewhere smaller. Fewer meetings, apparently.", cn: "一家小一点的公司。据说是会少开。" },
            { who: "Rosa", en: "That's everyone's dream, isn't it. Who's taking his work?", cn: "这是所有人的梦想吧。他的活儿谁接？" },
            { who: "Ines", en: "Nobody knows. That's the interesting part.", cn: "没人知道。这才是有意思的地方。" },
            { who: "Rosa", en: "Meaning they're not replacing him.", cn: "意思是他们不打算补人。" },
            { who: "Ines", en: "Meaning you and I should update our CVs.", cn: "意思是你我该更新简历了。" },
            { who: "Rosa", en: "Over lunch? Really?", cn: "吃着午饭说这个？行吧。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "新员工 · 部门总监",
          register: "中性偏正式",
          channel: "面对面（茶水间）",
          barrier: "无",
          result: "达成（留下好印象）",
          lines: [
            { who: "总监", en: "You're the new analyst. Tom, isn't it?", cn: "你是新来的分析师。Tom 吧？" },
            { who: "Tom", en: "That's me. Good to finally meet you properly.", cn: "是我。很高兴终于正式见到您。" },
            { who: "总监", en: "How has the first month been?", cn: "第一个月怎么样？" },
            { who: "Tom", en: "Busy, in a good way. I've stopped getting lost on the way to the third floor.", cn: "忙，但是好事。我已经不会在三楼迷路了。" },
            { who: "总监", en: "That takes some people a year. Are you settling in with the team?", cn: "有人一年都记不住。跟团队相处得怎么样？" },
            { who: "Tom", en: "Yes. Rachel has been generous with her time.", cn: "挺好。Rachel 很愿意花时间带我。" },
            { who: "总监", en: "She's like that. She taught me half of what I know.", cn: "她就是这样。我的一半本事是她教的。" },
            { who: "Tom", en: "Then I'm in good hands.", cn: "那我跟对人了。" },
            { who: "总监", en: "You are. Right, this is my floor. Good to meet you, Tom.", cn: "是的。好，我到了。很高兴认识你，Tom。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "同事",
          register: "随意",
          channel: "面对面",
          barrier: "对方要拉你一起议论别人，你不想参与",
          result: "折中（不跟帖附和，建议当面问）",
          lines: [
            { who: "Sam", en: "Have you seen what Nadia posted? About the restructure?", cn: "你看到 Nadia 发的了吗？关于重组的。" },
            { who: "Alex", en: "I saw something come through. I didn't open it.", cn: "我看到有消息进来。没点开。" },
            { who: "Sam", en: "She's basically accusing Daniel of lying in the all-hands.", cn: "她基本是在说 Daniel 在全员会上撒谎。" },
            { who: "Alex", en: "That's between the two of them.", cn: "那是他们俩之间的事。" },
            { who: "Sam", en: "You're no fun.", cn: "你真没劲。" },
            { who: "Alex", en: "I'm not going to pile on someone in a thread, Sam. It isn't my thing.", cn: "我不想在群里跟着踩人，Sam。这不是我的风格。" },
            { who: "Sam", en: "Fine. But you know he did, right?", cn: "行吧。可你知道他确实撒谎了吧？" },
            { who: "Alex", en: "I know the numbers changed. I don't know why.", cn: "我知道数字变了。我不知道为什么。" },
            { who: "Sam", en: "See, that's the interesting bit.", cn: "你看，这才是有意思的地方。" },
            { who: "Alex", en: "Then ask him. He has office hours on Thursday.", cn: "那你问他。他周四有开放时间。" },
            { who: "Sam", en: "You're impossible.", cn: "你真没法聊。" },
            { who: "Alex", en: "Are we still doing lunch?", cn: "中午还一起吃吗？" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "同事",
          register: "随意",
          channel: "面对面（茶水间）",
          barrier: "转述的八卦是错的，还被当事人当场听到",
          result: "修复（当面更正并承诺回去澄清）",
          lines: [
            { who: "Rob", en: "So apparently Kim is applying for Daniel's job.", cn: "据说 Kim 在申请 Daniel 那个位置。" },
            { who: "Tina", en: "Where did you hear that?", cn: "你从哪儿听来的？" },
            { who: "Rob", en: "Everyone's saying it. Leo told me.", cn: "大家都在说。Leo 告诉我的。" },
            { who: "Tina", en: "I'm not saying anything, because that is not true.", cn: "我什么都不说，因为那不是真的。" },
            { who: "Rob", en: "How do you know?", cn: "你怎么知道？" },
            { who: "Tina", en: "Because Kim told me she isn't, and she is standing right behind you with a coffee.", cn: "因为 Kim 跟我说过不是，而且她正端着咖啡站在你后面。" },
            { who: "Rob", en: "...Kim. Hi.", cn: "……Kim。嗨。" },
            { who: "Kim", en: "Morning. Leo's version is more fun than mine, clearly.", cn: "早。显然 Leo 那个版本比我的好玩。" },
            { who: "Rob", en: "I'm sorry. I repeated something I had no business repeating.", cn: "对不起。我不该转述根本不该转述的东西。" },
            { who: "Kim", en: "You did. Leo has been telling people since Tuesday, so you're not the first.", cn: "你确实不该。Leo 从周二就在跟人说，你也不是第一个。" },
            { who: "Rob", en: "I'll correct it where I heard it.", cn: "我在听到的地方更正。" },
            { who: "Kim", en: "Do. And next time, ask me. I'm two desks away.", cn: "去吧。下次直接问我。我就隔着两张桌子。" }
          ]
        },
        {
          variant: "情绪型（发现自己被议论）",
          relation: "好友 · 同事",
          register: "随意（情绪化）",
          channel: "面对面",
          barrier: "对方得知自己被议论，情绪受伤",
          result: "达成（承认没早说，并承诺以后先告诉她）",
          lines: [
            { who: "Mia", en: "Is it true that people are saying I'm leaving?", cn: "大家在说我要走，是真的吗？" },
            { who: "Priya", en: "Where did you hear that?", cn: "你听谁说的？" },
            { who: "Mia", en: "Dan asked if I was still around next month. In the middle of a meeting.", cn: "Dan 问我下个月还在不在。还是在会中间问的。" },
            { who: "Priya", en: "...Okay. Yes, there has been talk. I heard it on Monday.", cn: "……好吧。是有人议论。我周一听到的。" },
            { who: "Mia", en: "From whom?", cn: "谁说的？" },
            { who: "Priya", en: "I'm not going to name people, but I did say it wasn't true.", cn: "我不想点名，但我确实说了那不是真的。" },
            { who: "Mia", en: "So you knew for two days and didn't tell me.", cn: "所以你两天前就知道，却没告诉我。" },
            { who: "Priya", en: "I thought telling you would only hurt you. That was wrong.", cn: "我以为告诉你也只是让你难受。这是我错了。" },
            { who: "Mia", en: "It hurts more to find out in a meeting.", cn: "在会里发现更难受。" },
            { who: "Priya", en: "You're right. From now on, you hear it from me first.", cn: "你说得对。以后这种事你先从我这儿听到。" },
            { who: "Mia", en: "And I'm not leaving. I'm taking two weeks off in June.", cn: "而且我不走。我六月请两周假。" },
            { who: "Priya", en: "That's it? Two weeks off turned into a resignation?", cn: "就这？两周假变成了辞职？" },
            { who: "Mia", en: "In this office, yes.", cn: "在这个办公室，是的。" }
          ]
        },
        {
          variant: "渠道变体（群聊 / 多人）",
          relation: "同学群 · 六人",
          register: "随意",
          channel: "群聊（文字）",
          barrier: "私下的吐槽被搬进大群，有人开始截图",
          result: "达成（拉回小群继续说）",
          lines: [
            { who: "Tina", en: "guys did you see the email from the department", cn: "各位看到系里那封邮件了吗" },
            { who: "Rob", en: "which bit", cn: "哪一段" },
            { who: "Tina", en: "the bit where they say the timetable is final", cn: "说课表是最终版的那段" },
            { who: "Sam", en: "it's not final. it's never final", cn: "不是最终版。从来都不是" },
            { who: "Rob", en: "they moved my seminar again", cn: "他们又挪了我的讨论课" },
            { who: "Tina", en: "hey sam, don't screenshot this", cn: "喂 Sam，这条别截图" },
            { who: "Sam", en: "i wasn't going to", cn: "我没打算截" },
            { who: "Rob", en: "you screenshot everything", cn: "你什么都截" },
            { who: "Sam", en: "i screenshot timetables", cn: "我截的是课表" },
            { who: "Tina", en: "can we take this to the other chat", cn: "这事能换到另一个群说吗" },
            { who: "Rob", en: "there's another chat?", cn: "还有另一个群？" },
            { who: "Tina", en: "there is now", cn: "现在有了" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "与会者 · 陌生同行",
          register: "正式",
          channel: "面对面（招待会）",
          barrier: "无（但需正式寒暄、避开私人话题）",
          result: "达成（约好次日继续谈）",
          lines: [
            { who: "甲", en: "May I join you? The coffee here is unexpectedly good.", cn: "我可以坐这儿吗？这里的咖啡出乎意料地好。" },
            { who: "乙", en: "Please do. It is the one reliable thing about this venue.", cn: "请坐。这是这个场地唯一可靠的东西。" },
            { who: "甲", en: "You were on the panel this morning, were you not? On assessment.", cn: "您参加了今天上午的讨论组吧？关于评估的。" },
            { who: "乙", en: "I was. I suspect I talked for rather too long.", cn: "是的。我怀疑我说得太久了。" },
            { who: "甲", en: "Not at all. Your point about marking consistency is the reason I am still here.", cn: "完全没有。您关于评分一致性的观点正是我还留在这儿的原因。" },
            { who: "乙", en: "That is generous. May I ask where you are based?", cn: "您太客气了。请问您在哪个机构？" },
            { who: "甲", en: "Cardiff. I look after the foundation programme.", cn: "卡迪夫。我负责预科项目。" },
            { who: "乙", en: "Then we have the same problem and different committees.", cn: "那我们有同样的问题，只是委员会不同。" },
            { who: "甲", en: "I should be glad to compare notes. Are you here tomorrow?", cn: "我很愿意交流一下。您明天还在吗？" },
            { who: "乙", en: "Until four. Shall we say eleven, by the registration desk?", cn: "待到四点。我们十一点在注册台见，好吗？" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "宿舍同学",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Jo", en: "you'll never guess who i just saw", cn: "你绝对猜不到我刚看见谁" },
            { who: "Kai", en: "no", cn: "不猜" },
            { who: "Jo", en: "guess", cn: "猜" },
            { who: "Kai", en: "no", cn: "不猜" },
            { who: "Jo", en: "it was dan. with a guitar", cn: "是 Dan。还背着一把吉他" },
            { who: "Kai", en: "shut up", cn: "别逗了" },
            { who: "Jo", en: "a guitar, kai", cn: "一把吉他，Kai" },
            { who: "Kai", en: "was he any good", cn: "弹得好吗" },
            { who: "Jo", en: "i didn't stay to find out", cn: "我没留下听" },
            { who: "Kai", en: "coward", cn: "怂" },
            { who: "Jo", en: "i have a life", cn: "我有我的生活" },
            { who: "Kai", en: "you have chips and a sofa", cn: "你只有薯片和沙发" }
          ]
        }
      ]
    },

    /* ==================== 04-08 冲突与争执 ==================== */
    {
      id: "s04-08",
      domain: "04",
      title: "冲突与争执",
      ielts: "口语 P3 观点 / 听力 S3",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "好友 · 合租",
          register: "随意",
          channel: "面对面",
          barrier: "无",
          result: "达成（各让一步，改成出一半车费）",
          lines: [
            { who: "Ben", en: "You told Priya I'd drive her to the airport.", cn: "你跟 Priya 说我会送她去机场。" },
            { who: "Nadia", en: "I said you might.", cn: "我说你可能可以。" },
            { who: "Ben", en: "You said it as though it were settled. She has already told her sister.", cn: "你说得像是已经定了一样。她都已经告诉她姐了。" },
            { who: "Nadia", en: "Okay, that one is on me.", cn: "好吧，这个是我的错。" },
            { who: "Ben", en: "It isn't the driving. It's that I found out from her.", cn: "不是送不送的问题。是我从她那儿才听说的。" },
            { who: "Nadia", en: "Fair. I should have asked first.", cn: "说得对。我该先问你。" },
            { who: "Ben", en: "I can do Thursday. Not Sunday.", cn: "周四可以。周日不行。" },
            { who: "Nadia", en: "Her flight is Sunday.", cn: "她的航班是周日。" },
            { who: "Ben", en: "Then she takes a taxi and I pay half. That's my offer.", cn: "那她打车，我出一半。这是我的方案。" },
            { who: "Nadia", en: "That's actually generous.", cn: "这还挺大方的。" },
            { who: "Ben", en: "I'm not angry. I just want to be asked.", cn: "我不是生气。我只是想被问一声。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "下属 · 主管",
          register: "中性偏正式",
          channel: "面对面（办公室）",
          barrier: "无",
          result: "达成（截止日期改到十七号）",
          lines: [
            { who: "Priya", en: "Have you got ten minutes? I want to push back on the deadline.", cn: "你有十分钟吗？我想对那个截止日期提反对意见。" },
            { who: "Daniel", en: "Push back.", cn: "说吧。" },
            { who: "Priya", en: "The third of June assumes the client signs on Monday. They have never signed on time.", cn: "六月三号的前提是客户周一签字。他们从来没有准时签过。" },
            { who: "Daniel", en: "They promised this time.", cn: "他们这次保证了。" },
            { who: "Priya", en: "They promised in January too. I have the email.", cn: "一月也保证过。我有邮件。" },
            { who: "Daniel", en: "Show me.", cn: "给我看。" },
            { who: "Priya", en: "January the ninth. Same wording.", cn: "一月九号。一字不差。" },
            { who: "Daniel", en: "Right. What is your alternative?", cn: "好。你的替代方案是什么？" },
            { who: "Priya", en: "Build in two weeks of slack, and tell them the real date is the seventeenth.", cn: "留两周缓冲，告诉他们真实日期是十七号。" },
            { who: "Daniel", en: "If we tell them the seventeenth, they will sign on the seventeenth.", cn: "要是告诉他们十七号，他们就会十七号才签。" },
            { who: "Priya", en: "Then we are no worse off, and we stop lying to ourselves.", cn: "那我们也不亏，而且不用再骗自己。" },
            { who: "Daniel", en: "Fine. The seventeenth. But you write the email.", cn: "行。十七号。但邮件你写。" },
            { who: "Priya", en: "Happily.", cn: "乐意。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "同事 · 署名之争",
          register: "中性",
          channel: "面对面",
          barrier: "对方要求你公开认错，你不认为责任全在你",
          result: "折中（承认对方那部分，公开更正而非道歉）",
          lines: [
            { who: "Leo", en: "You put your name on the report. I wrote half of it.", cn: "报告上写了你的名字。可有一半是我写的。" },
            { who: "Sam", en: "I wrote the sections, you built the model. Both are in it.", cn: "我写的章节，你做的模型。两个都在里面。" },
            { who: "Leo", en: "The model is the report. Everything else is decoration.", cn: "模型就是报告。其他都是装饰。" },
            { who: "Sam", en: "That's not how the client read it, but fine. Let's talk about credit.", cn: "客户不是这么读的，不过算了。我们来谈署名。" },
            { who: "Leo", en: "I want you to say in the channel that the analysis was mine.", cn: "我要你在群里说那份分析是我做的。" },
            { who: "Sam", en: "I will say the analysis was yours, because it was. I won't say the report was yours.", cn: "我会说分析是你做的，因为确实是你做的。但我不会说报告是你写的。" },
            { who: "Leo", en: "So a half apology.", cn: "所以是半个道歉。" },
            { who: "Sam", en: "It's a correction, not an apology. And I'll ask them to credit both of us on the next one.", cn: "这是更正，不是道歉。而且下一份我会让他们署我们两个人的名。" },
            { who: "Leo", en: "That I'll take.", cn: "这个我接受。" },
            { who: "Sam", en: "Good. Draft it with me after lunch?", cn: "好。午饭后一起写？" },
            { who: "Leo", en: "After lunch.", cn: "午饭后。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "室友",
          register: "随意",
          channel: "面对面",
          barrier: "两人吵的根本不是同一件事，越吵越远",
          result: "修复（把两个话题拆开，各自给方案）",
          lines: [
            { who: "Ada", en: "I'm not talking about the dishes.", cn: "我说的不是碗。" },
            { who: "Lena", en: "Then what are we talking about? Because I have been washing dishes for ten minutes.", cn: "那我们在说什么？我已经洗了十分钟碗了。" },
            { who: "Ada", en: "I'm talking about you saying you'd be home by seven and getting home at ten.", cn: "我说的是你说七点回家，结果十点才到。" },
            { who: "Lena", en: "I texted you.", cn: "我给你发消息了。" },
            { who: "Ada", en: "At nine forty. That's the difference.", cn: "九点四十。差别就在这儿。" },
            { who: "Lena", en: "Okay. So it isn't the dishes, and it isn't the text.", cn: "好。所以不是碗的事，也不是消息的事。" },
            { who: "Ada", en: "It's that I ate alone again.", cn: "是我又一个人吃的饭。" },
            { who: "Lena", en: "...Yeah. That's a different conversation, and it's one I can actually answer.", cn: "……对。这是另一件事，而且这个我答得上。" },
            { who: "Ada", en: "Can you?", cn: "答得上？" },
            { who: "Lena", en: "On Monday and Thursday I'll be late, so eat without me. The other nights I'll be back.", cn: "周一周四我会晚，你别等我，先吃。其余几天我赶回来。" },
            { who: "Ada", en: "Put it in the calendar so I don't have to guess.", cn: "写进日历吧，省得我猜。" },
            { who: "Lena", en: "Doing it now.", cn: "这就写。" }
          ]
        },
        {
          variant: "情绪型（火气上来）",
          relation: "兄弟",
          register: "随意（情绪化）",
          channel: "面对面",
          barrier: "双方都在气头上，话说重了",
          result: "达成（各自收回重话，说清真正的诉求）",
          lines: [
            { who: "Will", en: "You always do this. You decide and then you tell me.", cn: "你老这样。你先决定，然后才告诉我。" },
            { who: "Nick", en: "Somebody had to decide. You weren't answering your phone.", cn: "总得有人决定。你不接电话。" },
            { who: "Will", en: "For two hours. In two hours you sold Dad's car.", cn: "就两个小时。两个小时里你把爸的车卖了。" },
            { who: "Nick", en: "It was rusting on the drive.", cn: "它在车道上锈着。" },
            { who: "Will", en: "It was his.", cn: "那是他的。" },
            { who: "Nick", en: "...Okay. That one is mine.", cn: "……好。这句是我的错。" },
            { who: "Will", en: "I haven't finished.", cn: "我还没说完。" },
            { who: "Nick", en: "I know. I'm not going anywhere. Say the rest.", cn: "我知道。我不走。你接着说。" },
            { who: "Will", en: "I wanted to be there when it went. That's all.", cn: "我想在场，看着它走。就这样。" },
            { who: "Nick", en: "I should have waited. I'm sorry.", cn: "我该等的。对不起。" },
            { who: "Will", en: "Don't say sorry in that voice.", cn: "别用那种语气说对不起。" },
            { who: "Nick", en: "Then I'll say it normally. I'm sorry. Come and get a coffee and I'll tell you what they gave me for it.", cn: "那我正常说。对不起。走，喝杯咖啡，我告诉你他们给了多少钱。" }
          ]
        },
        {
          variant: "渠道变体（电话会议三人）",
          relation: "三人项目组 · 电话会议",
          register: "半正式",
          channel: "电话会议（三人）",
          barrier: "两人隔着电话争执，需要第三人拆题",
          result: "达成（拆成两个议题，各定一个人）",
          lines: [
            { who: "Kim", en: "Okay. I can hear that you two disagree. Let's slow down.", cn: "好。我听得出你们俩意见不同。我们慢一点。" },
            { who: "Owen", en: "I said the date slips if we add the audit.", cn: "我说了，加审计日期就得往后推。" },
            { who: "Rob", en: "And I said we don't have to add the audit.", cn: "我说了我们不必加审计。" },
            { who: "Kim", en: "Those are two separate claims. Owen, how long is the audit?", cn: "这是两个不同的说法。Owen，审计要多长时间？" },
            { who: "Owen", en: "Three weeks minimum.", cn: "最少三周。" },
            { who: "Kim", en: "Rob, who is asking for it?", cn: "Rob，是谁要求做的？" },
            { who: "Rob", en: "Legal. In an email nobody wants to read twice.", cn: "法务。在一封谁都不想读第二遍的邮件里。" },
            { who: "Kim", en: "Then legal is the question, not the date. Rob, ask them to justify it by Friday.", cn: "那问题是法务，不是日期。Rob，你周五前让他们给出理由。" },
            { who: "Rob", en: "Fine.", cn: "行。" },
            { who: "Kim", en: "Owen, price the three weeks. Don't schedule them yet.", cn: "Owen，把这三周的成本算出来。先别排进计划。" },
            { who: "Owen", en: "Fine.", cn: "行。" },
            { who: "Kim", en: "Good. Two fines is a productive meeting. Nobody talks to each other until Friday.", cn: "好。两个「行」就算一场有成果的会。周五之前你们俩不许互相联系。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "租客 · 房东代理人",
          register: "正式",
          channel: "面对面（正式会谈）",
          barrier: "无（但需正式、克制、凡事留书面）",
          result: "达成（当天书面确认期限与租金调整）",
          lines: [
            { who: "租客", en: "Thank you for meeting me. I should like to raise the matter of the heating.", cn: "谢谢您与我见面。我想提出供暖的问题。" },
            { who: "代理", en: "I understand there have been delays.", cn: "我了解到有延误。" },
            { who: "租客", en: "There have. I first reported it on the third of November, in writing.", cn: "确实有。我十一月三日首次以书面形式报修。" },
            { who: "代理", en: "And the contractor attended, I believe.", cn: "我相信承包商已经上门了。" },
            { who: "租客", en: "Twice. On both occasions without the correct part.", cn: "两次。两次都没带对零件。" },
            { who: "代理", en: "That is not acceptable, and I apologise on behalf of the agency.", cn: "这是不能接受的，我代表中介公司致歉。" },
            { who: "租客", en: "I am not seeking an apology. I am seeking a date.", cn: "我不是来要道歉的。我是来要一个日期。" },
            { who: "代理", en: "That is reasonable. May I propose the twenty-eighth?", cn: "这很合理。我可以提议二十八号吗？" },
            { who: "租客", en: "You may propose it. I should like it confirmed in writing today, with a rent adjustment for the period.", cn: "您可以提议。我希望今天书面确认，并就这段时间调整租金。" },
            { who: "代理", en: "I shall put both in writing before five o'clock.", cn: "我会在五点前把两项都写成书面。" },
            { who: "租客", en: "Then I have nothing further. Thank you for your time.", cn: "那我就没有别的事了。谢谢您的时间。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "队友",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Rob", en: "you left me on read", cn: "你已读不回" },
            { who: "Sam", en: "i was busy", cn: "我忙" },
            { who: "Rob", en: "busy doing what", cn: "忙什么" },
            { who: "Sam", en: "ignoring you", cn: "忙着不理你" },
            { who: "Rob", en: "wow", cn: "服了" },
            { who: "Sam", en: "kidding. i was at my mum's", cn: "开玩笑的。我在我妈那儿" },
            { who: "Rob", en: "you're always at your mum's", cn: "你老在你妈那儿" },
            { who: "Sam", en: "she feeds me", cn: "她管饭" },
            { who: "Rob", en: "fair", cn: "有道理" },
            { who: "Sam", en: "are we ok", cn: "我们没事吧" },
            { who: "Rob", en: "yeah. but answer your phone", cn: "没事。但接电话" },
            { who: "Sam", en: "i'll try", cn: "我尽量" }
          ]
        }
      ]
    },

    /* ==================== 05-01 课堂提问 ==================== */
    {
      id: "s05-01",
      domain: "05",
      title: "课堂提问",
      ielts: "口语 P3 学术 / 听力 S3",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "学生 · 讲师（课后）",
          register: "半正式",
          channel: "面对面（讲台前）",
          barrier: "无",
          result: "达成（问清要求，拿到参考资料）",
          lines: [
            { who: "Anna", en: "Excuse me, have you got a moment? I had a question about the essay title.", cn: "打扰一下，您有空吗？我对论题有个问题。" },
            { who: "讲师", en: "Of course. Which part of it?", cn: "当然。哪一部分？" },
            { who: "Anna", en: "It says compare the two approaches. Does that mean I should take a position, or just set them side by side?", cn: "题目说比较两种方法。意思是我要表明立场，还是并列陈述就行？" },
            { who: "讲师", en: "Good question. Set them side by side, but the conclusion should say which you found more convincing.", cn: "问得好。并列陈述，但结论里要说明你认为哪个更有说服力。" },
            { who: "Anna", en: "Even if my reasons are mostly practical?", cn: "即使我的理由大多是实际层面的？" },
            { who: "讲师", en: "Especially then. That is what a conclusion is for.", cn: "那更是。结论就是干这个的。" },
            { who: "Anna", en: "And the word limit, does it include the bibliography?", cn: "那字数限制，包括参考文献吗？" },
            { who: "讲师", en: "It doesn't. Footnotes do count, which catches people out every year.", cn: "不包括。脚注算字数，这一点每年都有人栽。" },
            { who: "Anna", en: "So I should keep the footnotes short.", cn: "那我的脚注要写短。" },
            { who: "讲师", en: "Or put the long ones in the bibliography and cite them there.", cn: "或者把长的放进参考文献，在正文里引用。" },
            { who: "Anna", en: "That's helpful. Thank you.", cn: "这很有帮助。谢谢您。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "大一新生 · 教授（全班面前）",
          register: "半正式",
          channel: "面对面（课堂上）",
          barrier: "无",
          result: "达成（提问被肯定，全班受益）",
          lines: [
            { who: "教授", en: "Before we move on, is anything unclear?", cn: "继续之前，有什么不清楚的吗？" },
            { who: "Tom", en: "Sorry, yes. Could you go back to the difference between the two tenses?", cn: "抱歉，有。您能回到那两个时态的区别吗？" },
            { who: "教授", en: "Which one would you like again?", cn: "你想再听哪一个？" },
            { who: "Tom", en: "The second one. I can use it, but I couldn't explain the rule to anyone else.", cn: "第二个。我会用，但如果要我给别人讲规则，我讲不出来。" },
            { who: "教授", en: "That's the most useful kind of question. Hands up, who else couldn't explain it?", cn: "这是最有用的那种问题。举手看看，还有谁讲不出来？" },
            { who: "Tom", en: "About half the room.", cn: "大概一半的人。" },
            { who: "教授", en: "Exactly. Right, one more time, with the timeline on the board.", cn: "正是。好，再来一遍，这次把时间轴画在黑板上。" },
            { who: "Tom", en: "Thank you. Sorry for slowing us down.", cn: "谢谢您。抱歉拖慢了进度。" },
            { who: "教授", en: "You didn't. You have just saved me a revision session.", cn: "没有。你刚帮我省了一节复习课。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "学生代表 · 讲师",
          register: "半正式",
          channel: "面对面（课后）",
          barrier: "学生要求重讲整章，讲师不能占掉一整节课",
          result: "折中（开头十分钟讲易错点 + 上传完整例题）",
          lines: [
            { who: "Priya", en: "Could you go through chapter four again on Thursday? Half the class is lost.", cn: "周四的课您能再讲一遍第四章吗？一半的人都跟丢了。" },
            { who: "讲师", en: "I can't give a whole lecture to one chapter. We are two weeks behind as it is.", cn: "我不能把一整节课给一章。我们已经落后两周了。" },
            { who: "Priya", en: "Then people will fail that section, and nobody will say anything.", cn: "那这部分大家就会挂，而且没人会吭声。" },
            { who: "讲师", en: "That I believe. So let me offer something that fits the time we have.", cn: "这我相信。那我说个在现有时间里做得到的方案。" },
            { who: "Priya", en: "Such as?", cn: "比如？" },
            { who: "讲师", en: "Ten minutes at the start of Thursday on the two ideas people actually get wrong, and the full worked examples on the portal tonight.", cn: "周四开头十分钟讲大家真正弄错的那两个概念，完整例题今晚放到教学平台上。" },
            { who: "Priya", en: "The worked examples are the part that's missing.", cn: "缺的就是例题。" },
            { who: "讲师", en: "Then that is the fix. Tell the class to read them before Thursday, or the ten minutes won't help.", cn: "那就这么办。告诉全班周四前先看一遍，不然那十分钟也没用。" },
            { who: "Priya", en: "I'll post it in the group chat.", cn: "我在群里发。" },
            { who: "讲师", en: "Good. And if three or more of you still can't do question six after that, come as a group and I'll book a room.", cn: "好。如果看完还有三个人以上做不出第六题，你们一起来找我，我订间教室。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "学生 · 助教（答疑课）",
          register: "半正式",
          channel: "面对面（答疑课）",
          barrier: "提问被听成质疑老师，双方都卡住",
          result: "修复（说清只是想弄懂，当场发现讲义漏了一步）",
          lines: [
            { who: "Leo", en: "I don't follow why we're allowed to do that.", cn: "我不明白为什么可以那样做。" },
            { who: "助教", en: "It's in the notes. Page twelve.", cn: "讲义里有。第十二页。" },
            { who: "Leo", en: "I have read page twelve. I still don't see why it's allowed.", cn: "我读过第十二页。我还是不明白为什么允许。" },
            { who: "助教", en: "Are you saying the notes are wrong?", cn: "你是说讲义错了吗？" },
            { who: "Leo", en: "No. I'm saying I'm missing a step. Sorry, that came out as a challenge.", cn: "不是。我是说我漏了一步。抱歉，听起来像是在质疑。" },
            { who: "助教", en: "...Okay. That's different, and it's my fault for hearing it that way.", cn: "……好。那不一样，是我不该那样听。" },
            { who: "Leo", en: "Can I show you where I get stuck?", cn: "我能让您看看我卡在哪儿吗？" },
            { who: "助教", en: "Come to the board.", cn: "到黑板这儿来。" },
            { who: "Leo", en: "Here. I can get from line one to line two, but not line two to line three.", cn: "这里。第一步到第二步我可以，第二步到第三步不行。" },
            { who: "助教", en: "Ah. That step assumes you have already done the substitution. It isn't written down.", cn: "啊。这一步默认你已经做了代换。这个没写出来。" },
            { who: "Leo", en: "So the notes do skip something.", cn: "所以讲义确实跳过了一点。" },
            { who: "助教", en: "The notes skip something. I'll have it added and I'll mention it on Thursday.", cn: "讲义跳过了一点。我会让人补上，周四也提一句。" }
          ]
        },
        {
          variant: "情绪型（被嘲笑后不敢问）",
          relation: "同学 · 同学",
          register: "随意（情绪化）",
          channel: "面对面（课后）",
          barrier: "提问被同学嘲笑，从此不敢开口",
          result: "达成（先彩排一次，找回开口的底气）",
          lines: [
            { who: "Mei", en: "I am never asking anything in that seminar again.", cn: "我再也不在那节讨论课上提问了。" },
            { who: "Ines", en: "Because of what Dan said?", cn: "因为 Dan 那句话？" },
            { who: "Mei", en: "He laughed. Twice.", cn: "他笑了。两次。" },
            { who: "Ines", en: "He laughs at everything. He laughed when the fire alarm went off.", cn: "他什么都笑。火警响的时候他也笑。" },
            { who: "Mei", en: "It isn't only him. I could hear someone behind me doing the sighing thing.", cn: "不只是他。我还能听见后面有人那种叹气声。" },
            { who: "Ines", en: "Okay, that one I believe. So ask me first, and then ask her in the seminar.", cn: "好吧，那个我信。那你先问我，然后再在课上问她。" },
            { who: "Mei", en: "That's the same question, just later.", cn: "那是同一个问题，只是晚一点问。" },
            { who: "Ines", en: "It's the same question with a rehearsal. That is the whole difference.", cn: "是同一个问题加一次彩排。差别就在这儿。" },
            { who: "Mei", en: "Fine. Practice question: what was she actually asking us to compare?", cn: "行。练习题：她到底要我们比较什么？" },
            { who: "Ines", en: "The two methods, not the two authors. See, you already knew that.", cn: "两种方法，不是两位作者。看，你早就知道。" },
            { who: "Mei", en: "...I did know that.", cn: "……我确实知道。" },
            { who: "Ines", en: "Thursday. Ask it.", cn: "周四。去问。" }
          ]
        },
        {
          variant: "渠道变体（线上课聊天框）",
          relation: "学生 · 讲师（线上课）",
          register: "半正式",
          channel: "线上课（聊天框）",
          barrier: "聊天框里的问题被刷过去，讲师没看到",
          result: "达成（助教课间转达，讲师下课前补答）",
          lines: [
            { who: "Leo", en: "could you repeat the last bit? the audio cut out", cn: "能重复一下最后一段吗？音频断了" },
            { who: "讲师", en: "Sorry, going back. The deadline moves to the fifteenth.", cn: "抱歉，往回说。截止日期改到十五号。" },
            { who: "Leo", en: "is the fifteenth for the draft or the final?", cn: "十五号是初稿还是终稿？" },
            { who: "讲师", en: "So if we look at the second case now...", cn: "那我们看第二个案例……" },
            { who: "Leo", en: "did anyone see my question", cn: "有人看到我的问题吗" },
            { who: "Tina", en: "yes. she didn't.", cn: "看到了。她没有。" },
            { who: "助教", en: "I've got it, Leo. I'll ask her at the break.", cn: "我记下了 Leo。课间我问她。" },
            { who: "讲师", en: "Before we finish: the fifteenth is the draft, the final is the twenty-ninth. Someone asked in the chat.", cn: "下课前说一下：十五号是初稿，终稿是二十九号。有人在聊天框里问了。" },
            { who: "Leo", en: "thank you", cn: "谢谢" },
            { who: "助教", en: "told you", cn: "我说了吧" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "研究生 · 主讲教授（研讨会）",
          register: "正式",
          channel: "面对面（研讨会）",
          barrier: "无（但需正式、点到为止）",
          result: "达成（教授接受质疑，约定补交出处）",
          lines: [
            { who: "学生", en: "Professor, may I put a question to you before we adjourn?", cn: "教授，散会前我可以提一个问题吗？" },
            { who: "教授", en: "Please do.", cn: "请。" },
            { who: "学生", en: "You suggested the earlier data are unreliable. On what grounds do you set them aside?", cn: "您认为早期的数据不可靠。您依据什么把它们排除？" },
            { who: "教授", en: "On the grounds that the instruments were recalibrated in the intervening year.", cn: "依据是仪器在中间那一年重新校准过。" },
            { who: "学生", en: "Then might the later figures not carry a comparable bias in the opposite direction?", cn: "那后期的数据是否可能带有方向相反的同类偏差？" },
            { who: "教授", en: "They might. That is a fair challenge, and I do not have the calibration records to hand.", cn: "有可能。这个质疑很中肯，而我手边没有校准记录。" },
            { who: "学生", en: "I mention it only because the same objection was raised in the nineteen eighties.", cn: "我提这一点，只是因为八十年代有人提过同样的异议。" },
            { who: "教授", en: "Was it indeed. Would you send me the reference?", cn: "是吗。你愿意把出处发我吗？" },
            { who: "学生", en: "I shall send it this evening.", cn: "我今晚就发。" },
            { who: "教授", en: "Then I am in your debt, and possibly the chapter's.", cn: "那我欠你一个人情，也许这一章都欠你的。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "同学",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成（打赌逼出一次课堂提问）",
          lines: [
            { who: "Sam", en: "did you get any of that", cn: "你听懂了吗" },
            { who: "Rob", en: "nope", cn: "没有" },
            { who: "Sam", en: "good. not just me", cn: "好。不只我一个" },
            { who: "Rob", en: "i wrote down the word vector four times", cn: "我把向量这个词抄了四遍" },
            { who: "Sam", en: "that's not a sentence", cn: "那不成句子" },
            { who: "Rob", en: "it's a cry for help", cn: "那是求救信号" },
            { who: "Sam", en: "i'll ask her thursday", cn: "我周四问她" },
            { who: "Rob", en: "you won't", cn: "你不会的" },
            { who: "Sam", en: "i will", cn: "我会" },
            { who: "Rob", en: "say it in the seminar and i'll buy you coffee", cn: "你在讨论课上问出来，我请你喝咖啡" },
            { who: "Sam", en: "deal", cn: "成交" }
          ]
        }
      ]
    },

    /* ==================== 05-02 小组讨论与分工 ==================== */
    {
      id: "s05-02",
      domain: "05",
      title: "小组讨论与分工",
      ielts: "口语 P3 学术 / 听力 S3",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "同组同学 · 四人",
          register: "随意",
          channel: "面对面（图书馆）",
          barrier: "无",
          result: "达成（分工明确并写进共享文档）",
          lines: [
            { who: "Kim", en: "Right, we have three weeks and four people. Who is doing what?", cn: "好，我们有三周、四个人。谁做什么？" },
            { who: "Owen", en: "I can do the literature review. I've already read most of it.", cn: "我可以做文献综述。大部分我已经读过了。" },
            { who: "Kim", en: "That's the biggest chunk.", cn: "那是最大的一块。" },
            { who: "Owen", en: "It is, but it's the bit I'm fastest at.", cn: "是，但也是我最快的部分。" },
            { who: "Rob", en: "I'll do the data. Put me down for the tables and the graphs.", cn: "我做数据。表格和图表算我的。" },
            { who: "Kim", en: "Then I'll write the introduction and hold the whole thing together.", cn: "那我写引言，并且负责把整篇统起来。" },
            { who: "Sam", en: "And me?", cn: "那我呢？" },
            { who: "Kim", en: "You're on references and formatting. It's boring, and it is the reason people lose marks.", cn: "你负责参考文献和格式。很无聊，但这就是丢分的原因。" },
            { who: "Sam", en: "I'll take it. Nobody else wants it.", cn: "我接。反正没人想要。" },
            { who: "Kim", en: "Drafts by the tenth. I want something from everyone by then, however rough.", cn: "初稿截止十号。那天我要看到每个人写的东西，多粗糙都行。" },
            { who: "Rob", en: "Rough I can do.", cn: "粗糙我擅长。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "组长（研二）· 新生",
          register: "半正式",
          channel: "面对面（小组会）",
          barrier: "无",
          result: "达成（新生拿到合适任务并说清自己的能力边界）",
          lines: [
            { who: "组长", en: "You're new to this format, so I'll be explicit about what I need from you.", cn: "你是第一次做这种形式，所以我明确说一下我需要什么。" },
            { who: "新生", en: "Please do.", cn: "请讲。" },
            { who: "组长", en: "Twenty sources, annotated, by the eighteenth. Not twenty pages, twenty entries of four lines each.", cn: "十八号之前二十条文献，带注释。不是二十页，是二十条，每条四行。" },
            { who: "新生", en: "I can do that. I should say I have never used a reference manager.", cn: "我可以。但我得说明，我没用过文献管理软件。" },
            { who: "组长", en: "That's fine, it takes an afternoon. I'll send you the template.", cn: "没关系，一个下午就能学会。我把模板发你。" },
            { who: "新生", en: "And if I find something that contradicts the argument?", cn: "如果我找到与论点矛盾的材料呢？" },
            { who: "组长", en: "Bring it to me rather than leaving it out. That is exactly what I want you for.", cn: "拿来找我，别把它删掉。我找你就是为这个。" },
            { who: "新生", en: "Then I'll start tonight. Where do I put the files?", cn: "那我今晚就开始。文件放哪儿？" },
            { who: "组长", en: "Shared folder. Same structure as the template, or I will lose track.", cn: "共享文件夹。结构跟模板一样，不然我会乱。" },
            { who: "新生", en: "Understood. Anything you would rather I didn't do?", cn: "明白。有什么你希望我别做的吗？" },
            { who: "组长", en: "Don't rewrite anyone's section. Comment instead.", cn: "别改别人的段落。写批注。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "同组同学",
          register: "随意",
          channel: "面对面",
          barrier: "对方临时把整块任务推给你",
          result: "折中（只接一部分，剩下那部分他本人在路上做）",
          lines: [
            { who: "Dan", en: "I can't do the presentation on Thursday. Could you cover the whole thing?", cn: "周四的展示我做不了。你能全包吗？" },
            { who: "Mei", en: "The whole thing? That's twenty minutes.", cn: "全包？那是二十分钟的内容。" },
            { who: "Dan", en: "I know. My sister's wedding is on Thursday.", cn: "我知道。我姐周四结婚。" },
            { who: "Mei", en: "That is a good reason for Thursday and a bad reason for today. What have you got so far?", cn: "周四那个理由很好，但今天这个理由不成立。你做到哪儿了？" },
            { who: "Dan", en: "Slides one to four.", cn: "一到四页。" },
            { who: "Mei", en: "I'll take your four and the methods part. Send me your notes tonight, and you do the last section on Sunday.", cn: "我接你那四页和方法部分。你今晚把笔记发我，最后那部分你周日做。" },
            { who: "Dan", en: "Sunday I'll be travelling.", cn: "周日我在路上。" },
            { who: "Mei", en: "Then you do it on the train. I'm not writing a section I haven't read for.", cn: "那你在火车上做。我不会替我根本没读过的部分写稿。" },
            { who: "Dan", en: "That's fair. Thank you.", cn: "这公平。谢谢。" },
            { who: "Mei", en: "And you owe me a coffee for every slide after four.", cn: "另外，第四页之后每页你要请我一杯咖啡。" },
            { who: "Dan", en: "There are twelve.", cn: "一共十二页。" },
            { who: "Mei", en: "I know. I can count.", cn: "我知道。我会数。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "同组同学",
          register: "随意",
          channel: "线上会议",
          barrier: "分工没写下来，两人做了同一部分、另一部分没人做",
          result: "修复（当场写进共享文档重新分配）",
          lines: [
            { who: "Rob", en: "So I've finished the introduction.", cn: "我把引言写完了。" },
            { who: "Tina", en: "I've finished the introduction too.", cn: "我也把引言写完了。" },
            { who: "Rob", en: "Since when?", cn: "什么时候的事？" },
            { who: "Tina", en: "Since Tuesday. I said in the call that I'd do it.", cn: "从周二开始。我在电话会上说了我做引言。" },
            { who: "Rob", en: "I was on mute for the first ten minutes.", cn: "我前十分钟静音了。" },
            { who: "Tina", en: "And nobody wrote anything down.", cn: "而且没人记下来。" },
            { who: "Rob", en: "So who did the methodology?", cn: "那方法部分谁做的？" },
            { who: "Tina", en: "...Nobody.", cn: "……没人。" },
            { who: "Rob", en: "Right. That is the actual problem, and it's fixable in ten minutes.", cn: "好。这才是真正的问题，十分钟能解决。" },
            { who: "Tina", en: "I'll take methodology, you keep the introduction.", cn: "我接方法部分，引言你留着。" },
            { who: "Rob", en: "And we put it in the shared doc before we hang up. Not in the chat.", cn: "而且挂电话之前就写进共享文档。不是发在聊天里。" },
            { who: "Tina", en: "Agreed. I'll replace mine with yours, yours is better.", cn: "同意。我把我的换成你的，你写得更好。" },
            { who: "Rob", en: "It's longer. Not better.", cn: "只是更长。不是更好。" }
          ]
        },
        {
          variant: "情绪型（有人一直不交）",
          relation: "同组同学",
          register: "随意（情绪化）",
          channel: "面对面",
          barrier: "有人一直不交东西，其他人憋着火",
          result: "达成（当面说开并定下最后期限）",
          lines: [
            { who: "Kim", en: "We need to talk about Sam.", cn: "我们得谈谈 Sam。" },
            { who: "Owen", en: "He hasn't sent anything.", cn: "他什么都没交。" },
            { who: "Kim", en: "Not since the first meeting. That was four weeks ago.", cn: "从第一次开会之后就没有。那是四周前了。" },
            { who: "Rob", en: "I've asked him three times. He says he's on it.", cn: "我问过他三次。他说在弄。" },
            { who: "Kim", en: "I'm not doing his part and then putting his name on it.", cn: "我不会替他做完还写上他的名字。" },
            { who: "Owen", en: "Nor am I. But if we drop him, that section still has to be written.", cn: "我也不。但如果我们把他踢掉，那部分还是要有人写。" },
            { who: "Kim", en: "Then we tell him today: Thursday, or his name comes off.", cn: "那我们今天告诉他：周四交，不然就把名字去掉。" },
            { who: "Rob", en: "Will you say it? I'll just get angry.", cn: "你来说行吗？我一说就会上火。" },
            { who: "Kim", en: "I'll say it, and I'll say it in front of both of you, so nobody can reword it later.", cn: "我来说，而且当着你们两个说，这样以后没人能改口。" },
            { who: "Owen", en: "That's fair. It's the fairest version of a bad conversation.", cn: "这样公平。这是这场难听话里最公平的版本。" },
            { who: "Rob", en: "And if he does deliver on Thursday?", cn: "要是他周四真交了？" },
            { who: "Kim", en: "Then it was never about Sam. It was about the deadline.", cn: "那就从来不是 Sam 的问题，是截止日期的问题。" }
          ]
        },
        {
          variant: "渠道变体（群聊分工）",
          relation: "同组同学 · 五人",
          register: "随意",
          channel: "群聊（文字）",
          barrier: "群里没人认领任务，眼看要拖到截止日",
          result: "达成（点名认领 + 截图留证）",
          lines: [
            { who: "Kim", en: "attaching the doc. put your name next to one section", cn: "文档发上来了。在自己要的那节旁边写上名字" },
            { who: "Kim", en: "anyone", cn: "有人吗" },
            { who: "Owen", en: "i'm looking", cn: "我在看" },
            { who: "Kim", en: "it's four sections and five of us", cn: "一共四节，我们五个人" },
            { who: "Rob", en: "i'll take the one about the survey", cn: "我要关于问卷的那节" },
            { who: "Tina", en: "i'll do the conclusion", cn: "我做结论" },
            { who: "Kim", en: "two left", cn: "还剩两节" },
            { who: "Sam", en: "which ones are left", cn: "剩哪两节" },
            { who: "Kim", en: "the ones with no names next to them", cn: "旁边没名字的那两节" },
            { who: "Sam", en: "fine, i'll take the hard one", cn: "行，难的那节给我" },
            { who: "Kim", en: "i've written that down and i'm screenshotting it", cn: "我记下来了，而且正在截图" },
            { who: "Sam", en: "i did say it though", cn: "我可说了" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "研讨会小组（含教授）",
          register: "正式",
          channel: "面对面（小组会）",
          barrier: "无（但需正式分工并记录在案）",
          result: "达成（分工写进纪要，定下更正期限）",
          lines: [
            { who: "主持", en: "Shall we agree the division of labour and minute it?", cn: "我们把分工定下来并记录在案，好吗？" },
            { who: "教授", en: "By all means. I shall take the introduction and the closing remarks.", cn: "当然。引言和结语我来。" },
            { who: "学生甲", en: "I should be glad to take the case studies.", cn: "我愿意负责案例部分。" },
            { who: "学生乙", en: "And I the methodological review, if nobody objects.", cn: "那方法综述归我，如果没人反对。" },
            { who: "主持", en: "Nobody objects. What do you require from the rest of us?", cn: "没人反对。您需要我们做什么？" },
            { who: "学生乙", en: "Two things: your data by the ninth, and no changes to my section after the eleventh.", cn: "两件事：九号前把你们的数据给我，十一号之后不要再改我那节。" },
            { who: "教授", en: "That second condition is entirely reasonable and rarely honoured. I shall support it.", cn: "第二个条件完全合理，而且很少被遵守。我支持。" },
            { who: "主持", en: "Then I shall record it as agreed. May I circulate the draft minutes tomorrow?", cn: "那我就记为已同意。我明天把纪要初稿发出来，可以吗？" },
            { who: "教授", en: "Please do. Corrections within forty-eight hours, or we treat them as accurate.", cn: "请发。四十八小时内提更正，否则就视为准确。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "同组同学",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Rob", en: "you do the slides", cn: "你做幻灯片" },
            { who: "Sam", en: "no", cn: "不" },
            { who: "Rob", en: "why not", cn: "为什么" },
            { who: "Sam", en: "because i did them last time", cn: "因为上次就是我做的" },
            { who: "Rob", en: "they were bad", cn: "做得很差" },
            { who: "Sam", en: "they were fine", cn: "挺好的" },
            { who: "Rob", en: "there was a typo in the title", cn: "标题里有个错字" },
            { who: "Sam", en: "there was one typo", cn: "就一个错字" },
            { who: "Rob", en: "in the title", cn: "在标题里" },
            { who: "Sam", en: "fine, i'll do the slides", cn: "行，我做幻灯片" },
            { who: "Rob", en: "check the title", cn: "检查一下标题" },
            { who: "Sam", en: "i'm checking it right now", cn: "我现在就在检查" }
          ]
        }
      ]
    },

    /* ==================== 05-03 Presentation 与 Q&A 被质疑 ==================== */
    {
      id: "s05-03",
      domain: "05",
      title: "Presentation 与 Q&A 被质疑",
      ielts: "口语 P3 学术 / 听力 S3",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "同学 · 课堂展示",
          register: "半正式",
          channel: "面对面（教室）",
          barrier: "无",
          result: "达成（答得住，并拿到一条改进意见）",
          lines: [
            { who: "同学", en: "Thanks for that. I've got a question about your second chart.", cn: "谢谢你的展示。我对你第二张图有个问题。" },
            { who: "讲者", en: "Go ahead.", cn: "请。" },
            { who: "同学", en: "You said the two groups were comparable. They look like different sizes to me.", cn: "你说两组是可比的。在我看来人数不一样。" },
            { who: "讲者", en: "They are different sizes, which is why I used percentages rather than counts.", cn: "人数确实不一样，所以我才用百分比而不是人数。" },
            { who: "同学", en: "Does the percentage hide the smaller group's outliers?", cn: "百分比会不会把小组里的异常值盖住了？" },
            { who: "讲者", en: "It can. I checked that: the smaller group has one outlier, and it moves the result by two points.", cn: "有可能。我查过了：小组里有一个异常值，会让结果移动两个百分点。" },
            { who: "同学", en: "Two points out of what?", cn: "两个百分点相对于多少？" },
            { who: "讲者", en: "Out of thirty-eight. I should have put that on the slide.", cn: "相对于三十八。这一点我该写在幻灯片上。" },
            { who: "同学", en: "That's my point, and it's a small one.", cn: "这就是我的意思，是个小问题。" },
            { who: "讲者", en: "It's a fair one. I'll add it before we hand in.", cn: "问得中肯。交之前我加上。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "学生 · 答辩委员",
          register: "半正式偏正式",
          channel: "面对面（答辩）",
          barrier: "无",
          result: "达成（守住结论，同时承认局限）",
          lines: [
            { who: "委员", en: "You conclude that the intervention worked. Your sample is nineteen people.", cn: "你的结论是这项干预有效。你的样本是十九个人。" },
            { who: "学生", en: "Nineteen, yes. I would not claim it generalises.", cn: "是十九个。我不会声称它可以推广。" },
            { who: "委员", en: "Then what are you claiming?", cn: "那你在声称什么？" },
            { who: "学生", en: "That in this setting, with these participants, the change was consistent across every measure we took.", cn: "在这个场景、这些参与者中，我们采取的每一项指标上的变化都是一致的。" },
            { who: "委员", en: "Consistent is a strong word for nineteen people.", cn: "对十九个人来说，一致是个很强的词。" },
            { who: "学生", en: "It is. I can show you the raw scores if that helps.", cn: "确实。如果您愿意，我可以把原始分数给您看。" },
            { who: "委员", en: "...Let me see them. Yes. That is more consistent than I expected.", cn: "……给我看看。好。比我预想的更一致。" },
            { who: "学生", en: "I would still want a larger study before anyone changes their practice.", cn: "但在有人改变做法之前，我还是希望能有更大规模的研究。" },
            { who: "委员", en: "Good. Put that sentence in the abstract. It will protect you.", cn: "好。把这句话写进摘要，它会保护你。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "讲者 · 听众（提问者）",
          register: "半正式",
          channel: "面对面（问答环节）",
          barrier: "被问到你没有数据支撑的数字，硬答就会出错",
          result: "折中（当场承认不知道，承诺会后给答复）",
          lines: [
            { who: "听众", en: "What is the effect size in the follow-up study?", cn: "后续研究里的效应量是多少？" },
            { who: "讲者", en: "I don't have that number with me.", cn: "我手边没有那个数字。" },
            { who: "听众", en: "It is in the paper you cited.", cn: "就在你引用的那篇论文里。" },
            { who: "讲者", en: "It may well be. I cited it for the method, and I read it four months ago.", cn: "很可能是。我引用它是因为方法，而且是四个月前读的。" },
            { who: "听众", en: "So you don't know.", cn: "所以你不知道。" },
            { who: "讲者", en: "I don't. I would rather say that than give you a number I am guessing at.", cn: "不知道。我宁愿这么说，也不想给您一个我瞎猜的数字。" },
            { who: "听众", en: "Fair. Can you get it to me?", cn: "公平。能发给我吗？" },
            { who: "讲者", en: "I'll look it up tonight and email you tomorrow, whether it supports my argument or not.", cn: "我今晚查，明天之前邮件发您，不管它是否支持我的论点。" },
            { who: "听众", en: "That last part is the part I believe.", cn: "我信的是最后那半句。" },
            { who: "讲者", en: "It is also the part that is true.", cn: "那也是真的那半句。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "讲者 · 听众",
          register: "半正式",
          channel: "面对面（问答环节）",
          barrier: "听错了问题，答非所问，提问者追问两遍才发现",
          result: "修复（重述问题，把漏洞写成局限）",
          lines: [
            { who: "听众", en: "How did you control for the time of day?", cn: "你怎么控制一天中的时段因素？" },
            { who: "讲者", en: "We ran all the sessions in the morning.", cn: "我们把所有场次都安排在上午。" },
            { who: "听众", en: "That's the scheduling, not the control.", cn: "那是排期，不是控制。" },
            { who: "讲者", en: "Sorry, I think I answered a different question. Could you say it again?", cn: "抱歉，我想我答的是另一个问题。您能再说一遍吗？" },
            { who: "听众", en: "How do you know the morning effect isn't doing the work?", cn: "你怎么知道不是上午这个因素在起作用？" },
            { who: "讲者", en: "Ah. I don't, and you are right to push. We tested it in the pilot with an afternoon group.", cn: "啊。我不知道，你问得对。我们在预实验里用过下午组测。" },
            { who: "听众", en: "And?", cn: "结果呢？" },
            { who: "讲者", en: "The afternoon group improved less. That could be the intervention or the time of day.", cn: "下午组进步更小。这可能是干预的效果，也可能是时段本身。" },
            { who: "听众", en: "So it is a limitation, not a finding.", cn: "那这是一条局限，不是一个发现。" },
            { who: "讲者", en: "It is a limitation. I'm writing it into the discussion, and I'm crediting you in the seminar.", cn: "是局限。我把它写进讨论部分，并在研讨会上注明是你提的。" },
            { who: "听众", en: "You don't have to do that.", cn: "不用这样。" },
            { who: "讲者", en: "I do. It's your point.", cn: "要的。这是你提的。" }
          ]
        },
        {
          variant: "情绪型（被连问三问到慌）",
          relation: "讲者 · 听众（语气不善）",
          register: "半正式（情绪化）",
          channel: "面对面（问答环节）",
          barrier: "对方连问三问、语气不善，讲者一度慌掉",
          result: "达成（争取到十秒钟，稳住后答完）",
          lines: [
            { who: "听众", en: "This is the third time you have moved the goalposts. Which metric are you actually claiming?", cn: "这是你第三次挪动标准了。你到底在声称哪个指标？" },
            { who: "讲者", en: "...Sorry. Can I take that in two parts?", cn: "……抱歉。能让我分两部分回答吗？" },
            { who: "听众", en: "Answer the metric question.", cn: "回答指标那个问题。" },
            { who: "讲者", en: "I am going to. I just need ten seconds, because I'm getting flustered and you'll get a worse answer.", cn: "我会答。只是我需要十秒，因为我现在有点慌，仓促答对您也没好处。" },
            { who: "听众", en: "...Take them.", cn: "……请。" },
            { who: "讲者", en: "Okay. The metric is completion rate. I moved the target twice, and that is a fair criticism.", cn: "好。指标是完成率。我确实两次调整了目标，这个批评站得住。" },
            { who: "听众", en: "Thank you. That is all I wanted.", cn: "谢谢。我要的就是这个。" },
            { who: "讲者", en: "Then may I add one thing? Both times, I told my supervisor before I changed it.", cn: "那我能补一句吗？两次调整之前我都跟导师说过。" },
            { who: "听众", en: "That helps.", cn: "这有用。" },
            { who: "讲者", en: "I'll put the dates in the appendix.", cn: "我会把日期写进附录。" }
          ]
        },
        {
          variant: "渠道变体（线上展示）",
          relation: "讲者 · 线上听众",
          register: "半正式",
          channel: "线上会议（问答）",
          barrier: "网络卡顿，提问全在聊天框，要靠主持人转达",
          result: "达成（逐个转达并答完，写进跟进邮件）",
          lines: [
            { who: "主持", en: "We have about eight minutes for questions. I'll read them out.", cn: "我们大概有八分钟提问。我来念问题。" },
            { who: "主持", en: "First one: how long did the pilot run?", cn: "第一个：预实验跑了多久？" },
            { who: "讲者", en: "Six weeks. And the audio dropped for a moment, so tell me if I missed anything.", cn: "六周。另外刚才音频断了片刻，如果漏了什么请告诉我。" },
            { who: "主持", en: "You cut out in the middle of the sampling part.", cn: "你在抽样那段讲到一半断了。" },
            { who: "讲者", en: "Then let me redo that in one sentence: we sampled every third student on the list.", cn: "那我用一句话重讲：我们按名单每三个抽一个。" },
            { who: "主持", en: "Next: two people are asking whether the materials are available.", cn: "下一个：有两个人问材料能不能公开。" },
            { who: "讲者", en: "They are, with one exception. The test items are under embargo until June.", cn: "可以，只有一处例外。测验题目到六月前不能公开。" },
            { who: "主持", en: "Someone is asking why.", cn: "有人问为什么。" },
            { who: "讲者", en: "Because the same items are used with the June cohort, and I would be handing them the answers.", cn: "因为六月那批还会用同一套题目，公开就等于把答案给他们了。" },
            { who: "主持", en: "That is a better answer than mine would have been.", cn: "这比我原本要答的好。" },
            { who: "讲者", en: "Put it in the follow-up email and I'll stop repeating myself.", cn: "写进跟进邮件里吧，省得我重复。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "会议讲者 · 资深教授（提问）",
          register: "正式",
          channel: "面对面（分会场问答）",
          barrier: "无（但需正式、有礼、守住学术分寸）",
          result: "达成（接受更精确的表述并纳入下一份申请）",
          lines: [
            { who: "教授", en: "May I press you on one point?", cn: "我可以在一点上追问您吗？" },
            { who: "讲者", en: "By all means.", cn: "当然可以。" },
            { who: "教授", en: "You attribute the improvement to the feedback rather than to the extra contact hours. How do you separate them?", cn: "您把进步归因于反馈，而不是额外的课时。您如何区分两者？" },
            { who: "讲者", en: "By design, imperfectly. The control group received the same contact hours, but from a different tutor.", cn: "在设计上并不完美。对照组有相同的课时，但由另一位教师授课。" },
            { who: "教授", en: "Then the tutor is your confound, not the hours.", cn: "那么您的混淆变量是教师，不是课时。" },
            { who: "讲者", en: "That is a precise way of putting it, and I shall adopt it.", cn: "这个说法很精确，我接受。" },
            { who: "教授", en: "Are you able to replicate with the same tutor?", cn: "您能用同一位教师重复吗？" },
            { who: "讲者", en: "Not within this project. It is the first item in the next proposal.", cn: "在本项目内做不到。这是下一份申请里的第一项。" },
            { who: "教授", en: "Then you are ahead of most people in this room. Thank you.", cn: "那您已经领先这屋里大多数人了。谢谢。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "同学 · 排练",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Rob", en: "how did it go", cn: "怎么样" },
            { who: "Sam", en: "he destroyed me", cn: "他把我打穿了" },
            { who: "Rob", en: "who", cn: "谁" },
            { who: "Sam", en: "the guy with the beard. three questions", cn: "那个留胡子的。连问三个" },
            { who: "Rob", en: "did you answer them", cn: "你答上来了吗" },
            { who: "Sam", en: "two", cn: "两个" },
            { who: "Rob", en: "that's not bad", cn: "不算差" },
            { who: "Sam", en: "the third one i said i don't know", cn: "第三个我说我不知道" },
            { who: "Rob", en: "good", cn: "好" },
            { who: "Sam", en: "good??", cn: "好？？" },
            { who: "Rob", en: "saying you don't know is a skill. most people just talk", cn: "说不知道是一种本事。大部分人只会瞎说" },
            { who: "Sam", en: "then i'm basically excellent", cn: "那我基本算优秀了" },
            { who: "Rob", en: "don't push it", cn: "别得寸进尺" }
          ]
        }
      ]
    },

    /* ==================== 05-04 导师会谈与论文反馈 ==================== */
    {
      id: "s05-04",
      domain: "05",
      title: "导师会谈与论文反馈",
      ielts: "口语 P3 学术 / 听力 S3",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "同门师兄 · 你",
          register: "随意",
          channel: "面对面（办公室）",
          barrier: "无",
          result: "达成（拿到一条能立刻动手的改法）",
          lines: [
            { who: "师兄", en: "I read your chapter. It's better than the last one.", cn: "我看了你那章。比上一章好。" },
            { who: "你", en: "That's a low bar. What's wrong with it?", cn: "这标准太低了。哪里有问题？" },
            { who: "师兄", en: "Nothing is wrong. The problem is that I can't tell what you are arguing until page nine.", cn: "没有错。问题是我到第九页才知道你在论证什么。" },
            { who: "你", en: "The argument is in the middle, because that is where the evidence is.", cn: "论点在中间，因为证据在那儿。" },
            { who: "师兄", en: "Then say it on page one and prove it in the middle. Same chapter, different order.", cn: "那就在第一页说清，中间去证明。同一章，换个顺序。" },
            { who: "你", en: "Wouldn't that be repetitive?", cn: "那不会显得重复吗？" },
            { who: "师兄", en: "It is how every chapter you admire is built. Go and look at the one you keep quoting.", cn: "你欣赏的每一章都是这么搭的。去看你老引的那一章。" },
            { who: "你", en: "...Fine. I'll look.", cn: "……行，我去看。" },
            { who: "师兄", en: "Send me the new first page tomorrow. One page.", cn: "明天把新的第一页发我。就一页。" },
            { who: "你", en: "One page.", cn: "就一页。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "学生 · 导师",
          register: "半正式",
          channel: "面对面（导师办公室）",
          barrier: "无",
          result: "达成（三层修改清单 + 十天期限）",
          lines: [
            { who: "导师", en: "I've read the draft. Sit down, this will take twenty minutes.", cn: "稿子我看了。坐下，这要二十分钟。" },
            { who: "学生", en: "That sounds like a lot.", cn: "听起来问题不少。" },
            { who: "导师", en: "Three things, and only one is serious. First, the literature review is a list.", cn: "三件事，只有一件严重。第一，文献综述是个清单。" },
            { who: "学生", en: "A list?", cn: "清单？" },
            { who: "导师", en: "Author, year, finding. Author, year, finding. I learn nothing about why they disagree.", cn: "作者、年份、结论。作者、年份、结论。我不知道他们为什么有分歧。" },
            { who: "学生", en: "I didn't want to put words in their mouths.", cn: "我不想替他们下判断。" },
            { who: "导师", en: "Summarising a debate is not putting words in anyone's mouth. Have an opinion and defend it.", cn: "概括一场争论不算替人下判断。你要有判断，并且为它辩护。" },
            { who: "学生", en: "And the serious one?", cn: "那严重的那件呢？" },
            { who: "导师", en: "Chapter four uses the wrong measure. That one costs you a week.", cn: "第四章用错了测量方式。这一件要花你一周。" },
            { who: "学生", en: "Can I fix it without redoing the analysis?", cn: "能不重做分析就改好吗？" },
            { who: "导师", en: "You can convert the scores, yes. I'll send you the note I wrote on it.", cn: "可以把分数换算过来，可以。我把我写的说明发你。" },
            { who: "学生", en: "Then I'll have all three done in ten days.", cn: "那我十天之内把三件都做完。" },
            { who: "导师", en: "Ten days. Send me the review first. I want to see whether the argument works.", cn: "十天。综述先发我。我要看论证立不立得住。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "学生 · 导师",
          register: "半正式",
          channel: "面对面（导师办公室）",
          barrier: "学生要求提前半年提交，导师不同意",
          result: "折中（三月底先交一章当试点，通过再定提交时间）",
          lines: [
            { who: "学生", en: "I'd like to submit in June instead of December.", cn: "我想六月提交，不是十二月。" },
            { who: "导师", en: "June is not realistic. Two chapters are still drafts.", cn: "六月不现实。两章还是草稿。" },
            { who: "学生", en: "My funding ends in July. After that I can't afford to stay.", cn: "我的资助七月结束。之后我留不下来。" },
            { who: "导师", en: "That is a real constraint and I am not dismissing it. But a bad thesis costs you more than three months.", cn: "这是真实的限制，我没有不当回事。但一篇糟糕的论文让你损失的比三个月多。" },
            { who: "学生", en: "So what do we do?", cn: "那我们怎么办？" },
            { who: "导师", en: "Give me chapter three as a finished piece by the end of March. If it holds up, we go for June, and I'll say so in writing.", cn: "三月底之前把第三章做成完整成品给我。如果立得住，我们就冲六月，而且我书面说明。" },
            { who: "学生", en: "And if it doesn't hold up?", cn: "如果立不住呢？" },
            { who: "导师", en: "Then we know in March rather than in May. That is the point of the test.", cn: "那我们三月就知道，而不是五月。这就是这次测试的意义。" },
            { who: "学生", en: "March it is. Who else reads it?", cn: "那就三月。还有谁看？" },
            { who: "导师", en: "One external reader. I'll ask someone who doesn't like your framework.", cn: "一位外部读者。我会找一个不喜欢你这套框架的人。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "学生 · 导师",
          register: "半正式",
          channel: "邮件批注 → 面对面",
          barrier: "一句批注被误解成否定整章，学生白删了八页",
          result: "修复（当面澄清并改用面谈）",
          lines: [
            { who: "学生", en: "I got your note on chapter two. I've rewritten the whole chapter.", cn: "我收到您在第二章的批注。我把整章重写了。" },
            { who: "导师", en: "The note said the section could be tighter.", cn: "批注说的是这一节可以更紧凑。" },
            { who: "学生", en: "Which I read as: it is bloated and the argument is weak.", cn: "我理解成：太臃肿，论证很弱。" },
            { who: "导师", en: "It says it could be tighter. That is four sentences, not four weeks.", cn: "上面写的是可以更紧凑。那是四句话的事，不是四周的事。" },
            { who: "学生", en: "...I've already cut eight pages.", cn: "……我已经删了八页。" },
            { who: "导师", en: "Put them back. Half of that was the evidence.", cn: "加回去。删掉的一半是证据。" },
            { who: "学生", en: "I wish you had written that.", cn: "我希望您当时就这么写。" },
            { who: "导师", en: "So do I. Notes are a bad medium for this, and I keep using them.", cn: "我也希望。批注是种糟糕的沟通方式，而我一直用它。" },
            { who: "学生", en: "Can we do fifteen minutes instead of notes next time?", cn: "下次能不能用十五分钟面谈代替批注？" },
            { who: "导师", en: "Fifteen minutes is cheaper than eight deleted pages. Yes.", cn: "十五分钟比删掉八页便宜。可以。" }
          ]
        },
        {
          variant: "情绪型（想放弃）",
          relation: "学生 · 导师",
          register: "半正式（情绪化）",
          channel: "面对面（导师办公室）",
          barrier: "学生被反复打回，情绪崩到想放弃",
          result: "达成（把大目标拆成这周只做一件事）",
          lines: [
            { who: "导师", en: "You asked to see me. What's happening?", cn: "你要求见面。出什么事了？" },
            { who: "学生", en: "I think I should stop. I've been on this chapter for five months and it keeps coming back.", cn: "我觉得我该停下。这一章我写了五个月，一直被打回来。" },
            { who: "导师", en: "It has come back three times. Do you know what the three objections had in common?", cn: "是被打回三次。你知道这三次的意见有什么共同点吗？" },
            { who: "学生", en: "That I can't write.", cn: "说明我不会写。" },
            { who: "导师", en: "That the sample section keeps changing. All three times, the same section.", cn: "是样本那一节一直在变。三次都是同一节。" },
            { who: "学生", en: "...That's true.", cn: "……确实。" },
            { who: "导师", en: "So it isn't the chapter and it isn't you. It is one section you haven't decided about.", cn: "所以问题不在这一章，也不在你。是你有一节还没做决定。" },
            { who: "学生", en: "I don't know which sample to use.", cn: "我不知道该用哪个样本。" },
            { who: "导师", en: "Then that is the only task this week. Not writing. Deciding.", cn: "那这就是这周唯一的任务。不是写，是做决定。" },
            { who: "学生", en: "And if I decide wrong?", cn: "要是决定错了呢？" },
            { who: "导师", en: "You will have decided, which is further than you are now. Bring me the answer on Friday.", cn: "那你就做了决定，已经比现在靠前。周五把答案带来。" }
          ]
        },
        {
          variant: "渠道变体（线上会议 + 文档批注）",
          relation: "学生 · 导师（线上）",
          register: "半正式",
          channel: "线上会议 + 文档批注",
          barrier: "批注和上次口头意见相反，学生不知道听哪个",
          result: "达成（以会议记录为准，当场删掉那条批注）",
          lines: [
            { who: "学生", en: "Before we start: there are forty comments in the document.", cn: "开始之前：文档里有四十条批注。" },
            { who: "导师", en: "There are. Most of them are small.", cn: "是有。大部分是小问题。" },
            { who: "学生", en: "Comment twelve says reconsider the whole approach. Is that small?", cn: "第十二条写的是重新考虑整个方法。这算小问题吗？" },
            { who: "导师", en: "That was a bad comment. I wrote it at midnight.", cn: "那条批注写得不好。我半夜写的。" },
            { who: "学生", en: "So which do I follow, that or what you said in the last meeting?", cn: "那我按哪个来，这条还是上次会上您说的？" },
            { who: "导师", en: "The meeting. And I'll delete twelve now, while we're talking.", cn: "按会上的。我现在就把它删掉，正好我们在通话。" },
            { who: "学生", en: "Can we do this every time? A five-line summary after the meeting, in writing?", cn: "以后每次都这样行吗？会后来个五行的书面小结？" },
            { who: "导师", en: "You write it, I'll correct it. That way the record is yours.", cn: "你写，我改。这样记录是你的。" },
            { who: "学生", en: "Then comment twelve never happens again.", cn: "那第十二条这种事就不会再有了。" },
            { who: "导师", en: "Comment twelve never happens again.", cn: "第十二条不会再有了。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "博士生 · 导师组（年度评审）",
          register: "正式",
          channel: "面对面（年度评审会）",
          barrier: "无（但需正式陈述进度并回应质询）",
          result: "达成（评审通过，附条件）",
          lines: [
            { who: "主席", en: "We have read your progress report. Would you summarise the past year in two minutes?", cn: "我们读了你的进度报告。你能用两分钟总结过去一年吗？" },
            { who: "学生", en: "I shall. One chapter submitted, one in revision, and the fieldwork complete.", cn: "好的。一章已提交，一章在修改，田野调查已完成。" },
            { who: "主席", en: "Your report says the fieldwork generated less data than planned.", cn: "你的报告说田野调查产生的数据少于计划。" },
            { who: "学生", en: "It did. Two of the five sites withdrew in March, for reasons outside my control.", cn: "确实。五个站点中的两个在三月退出，原因不在我控制范围内。" },
            { who: "主席", en: "What did you change as a result?", cn: "你因此改了什么？" },
            { who: "学生", en: "I added a document-based strand, and I narrowed the claims in chapter four accordingly.", cn: "我增加了一条基于文献的路径，并相应收窄了第四章的结论。" },
            { who: "委员", en: "Was that agreed with your supervisor before the withdrawal or after it?", cn: "这是在站点退出之前还是之后与导师商定的？" },
            { who: "学生", en: "After, within a fortnight, and it was minuted.", cn: "之后，两周内定的，而且有会议纪要。" },
            { who: "主席", en: "Then we are satisfied. The review is passed, on condition that the narrowed claims are held to.", cn: "那我们满意了。评审通过，条件是把收窄后的结论坚持到底。" },
            { who: "学生", en: "Understood. Thank you.", cn: "明白。谢谢。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "同门",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Sam", en: "how bad was it", cn: "有多惨" },
            { who: "Rob", en: "three pages of comments", cn: "三页批注" },
            { who: "Sam", en: "on how many pages", cn: "原稿多少页" },
            { who: "Rob", en: "four", cn: "四页" },
            { who: "Sam", en: "so basically he rewrote it", cn: "那基本等于他重写了" },
            { who: "Rob", en: "he says he's helping", cn: "他说他是在帮忙" },
            { who: "Sam", en: "did you cry", cn: "你哭了吗" },
            { who: "Rob", en: "nearly. then i read the last one", cn: "差点。然后我看了最后一条" },
            { who: "Sam", en: "what did it say", cn: "写的什么" },
            { who: "Rob", en: "the argument in this section is excellent", cn: "这一节的论证非常出色" },
            { who: "Sam", en: "so you're fine", cn: "那你没事了" },
            { who: "Rob", en: "i'm fine", cn: "我没事" }
          ]
        }
      ]
    },

    /* ==================== 05-05 选课与申请延期 ==================== */
    {
      id: "s05-05",
      domain: "05",
      title: "选课与申请延期",
      ielts: "口语 P3 学术 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "同学 · 同学",
          register: "随意",
          channel: "面对面（食堂）",
          barrier: "无",
          result: "达成（选课方案定了）",
          lines: [
            { who: "Mei", en: "Have you signed up for the statistics module yet?", cn: "你报统计那门课了吗？" },
            { who: "Dan", en: "Not yet. I keep going back and forth.", cn: "还没有。我一直拿不定主意。" },
            { who: "Mei", en: "What's the hesitation?", cn: "犹豫什么？" },
            { who: "Dan", en: "It's the Thursday nine a.m. slot. And I'm not sure I need it.", cn: "是周四早上九点那节。而且我不确定我需不需要。" },
            { who: "Mei", en: "You're writing a dissertation with survey data. You need it.", cn: "你要写的论文要用问卷数据。你需要。" },
            { who: "Dan", en: "I could learn it online.", cn: "我可以在网上学。" },
            { who: "Mei", en: "You could. You won't.", cn: "可以。但你不会。" },
            { who: "Dan", en: "...That's probably fair.", cn: "……这话大概没错。" },
            { who: "Mei", en: "Take it now, while it still counts as optional. Next year it is a requirement and the room is smaller.", cn: "趁现在还算选修就报。明年就变必修，教室还更小。" },
            { who: "Dan", en: "Fine. Thursday, nine a.m. Remind me why I know you.", cn: "行。周四早上九点。提醒我一下我为什么认识你。" },
            { who: "Mei", en: "Because I'm right about everything.", cn: "因为我什么都对。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "学生 · 课程负责人",
          register: "半正式",
          channel: "面对面（办公时间）",
          barrier: "无",
          result: "达成（延期两周获批，并抄送讨论课老师）",
          lines: [
            { who: "学生", en: "Thank you for seeing me. I'd like to request an extension on the second assignment.", cn: "谢谢您见我。我想申请第二次作业延期。" },
            { who: "老师", en: "How long, and on what grounds?", cn: "延多久，理由是什么？" },
            { who: "学生", en: "Two weeks. I had a medical appointment on the fourth and it turned into a referral.", cn: "两周。四号我去看病，后来转成了转诊。" },
            { who: "老师", en: "Do you have documentation?", cn: "有证明材料吗？" },
            { who: "学生", en: "I have the referral letter. I can bring the rest when it arrives.", cn: "我有转诊单。其余的一到我就送来。" },
            { who: "老师", en: "That will do. Two weeks, to the twenty-second, and I'll note it on the system.", cn: "可以。两周，到二十二号，我在系统里标注。" },
            { who: "学生", en: "Thank you. Should I also tell my seminar tutor?", cn: "谢谢您。我还要告诉讨论课老师吗？" },
            { who: "老师", en: "I'll copy her into the email, so you don't have to explain it twice.", cn: "我会把邮件抄给她，你不用讲两遍。" },
            { who: "学生", en: "That saves me a conversation I was dreading.", cn: "这省了我一场我很怕的谈话。" },
            { who: "老师", en: "People dread it because they wait until the day before. You came four days early.", cn: "大家怕，是因为都拖到前一天。你提前了四天。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "学生 · 课程负责人",
          register: "半正式",
          channel: "面对面（办公时间）",
          barrier: "迟交三天才来申请免罚，按规定不能免",
          result: "折中（接受六十分上限，但按完整标准批改 + 下次提纲提前看）",
          lines: [
            { who: "学生", en: "I know I'm three days late. I'd like to ask for the late penalty to be waived.", cn: "我知道我迟了三天。我想申请免掉迟交扣分。" },
            { who: "老师", en: "On what grounds? I should say the answer to that request has been no all term.", cn: "理由是什么？我得说明，这个请求整学期我都没同意过。" },
            { who: "学生", en: "The reasons are real but they aren't documented. So I'm not going to argue about the penalty.", cn: "理由是真实的，但没有书面证明。所以我不打算争这个扣分。" },
            { who: "老师", en: "That is an unusually honest opening.", cn: "这个开场少见的诚实。" },
            { who: "学生", en: "I would rather ask for something you can actually give. Could it be marked against the full rubric, so I know what to fix?", cn: "我更想提一个您真能给的东西。能不能按完整评分标准批改，让我知道该改什么？" },
            { who: "老师", en: "I do that anyway. The mark is capped at sixty; the comments are the same as for anyone else.", cn: "我本来就是这么做的。分数上限六十，评语跟其他人一样。" },
            { who: "学生", en: "That's more than I expected.", cn: "比我预想的多。" },
            { who: "老师", en: "Then let me add one thing you didn't ask for: bring me the plan for the next assignment a week early and I'll read it.", cn: "那再加一条你没要求的：下次作业提前一周把提纲给我，我看。" },
            { who: "学生", en: "I'll take that.", cn: "我接受。" },
            { who: "老师", en: "Good. And next time, email me on day one, not day three.", cn: "好。还有下次，第一天就给我发邮件，不是第三天。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "学生 · 教务办公室",
          register: "半正式",
          channel: "面对面（教务窗口）",
          barrier: "刷新页面生成了重复选课，系统把你塞进没选的课",
          result: "修复（删除错误记录并加书面说明）",
          lines: [
            { who: "学生", en: "I'm on the list for two modules that clash, but I only chose one.", cn: "我的名单上有两门时间冲突的课，但我只选了一门。" },
            { who: "教务", en: "The system doesn't add modules by itself.", cn: "系统不会自己加课。" },
            { who: "学生", en: "I know. That's why I'm here.", cn: "我知道。所以我才来。" },
            { who: "教务", en: "Give me your number. ...You registered for this one on the ninth and again on the twelfth.", cn: "给我你的学号。……你九号注册过一次，十二号又注册了一次。" },
            { who: "学生", en: "The twelfth was when the page froze and I refreshed it.", cn: "十二号那次是页面卡住，我刷新了。" },
            { who: "教务", en: "Then it created a second registration, and the second one is the one that held.", cn: "那就生成了第二条注册记录，生效的是第二条。" },
            { who: "学生", en: "So refreshing the page put me in a course I never picked.", cn: "所以我刷新页面，就被塞进了一门我没选的课。" },
            { who: "教务", en: "It did. I'm removing it now and I'll put a note on your record.", cn: "确实。我现在删掉它，并在你的记录上加一条说明。" },
            { who: "学生", en: "Could the note say why, so nobody asks me about it again?", cn: "说明里能写清原因吗？这样不会再有人来问我。" },
            { who: "教务", en: "It says system error, duplicate registration, removed at the student's request.", cn: "写的是：系统错误、重复注册、应学生要求删除。" },
            { who: "学生", en: "Thank you. And if it happens to someone else?", cn: "谢谢。要是别人也遇到呢？" },
            { who: "教务", en: "Tell them to come and see me rather than refreshing again.", cn: "告诉他们来找我，别再刷新。" }
          ]
        },
        {
          variant: "情绪型（撑不住想退课）",
          relation: "学生 · 学业辅导员",
          register: "半正式（情绪化）",
          channel: "面对面（辅导室）",
          barrier: "学生自认要挂两门课，情绪先崩",
          result: "达成（退一门免手续费 + 统计延两周，下周再看）",
          lines: [
            { who: "辅导员", en: "You booked this slot. What's going on?", cn: "你约了这个时间。怎么了？" },
            { who: "学生", en: "I'm going to fail two modules, and I have never failed anything.", cn: "我有两门课要挂，而我从来没挂过任何东西。" },
            { who: "辅导员", en: "Two, or the same one twice?", cn: "两门，还是同一门两次？" },
            { who: "学生", en: "...I don't know. It feels like all of them.", cn: "……我不知道。感觉是全部。" },
            { who: "辅导员", en: "Let's write them down. Names, deadlines, and what is actually done.", cn: "我们写下来。课名、截止日期、实际完成的部分。" },
            { who: "学生", en: "This is going to look stupid on paper.", cn: "写在纸上肯定显得很蠢。" },
            { who: "辅导员", en: "It usually looks smaller on paper. Start with the one you're most afraid of.", cn: "写在纸上通常显得更小。从你最怕的那门开始。" },
            { who: "学生", en: "...Statistics. I haven't opened it since week four.", cn: "……统计。我从第四周起就没打开过。" },
            { who: "辅导员", en: "Then here is what I can do today: one module dropped without a fee, and a fortnight's extension on statistics.", cn: "那我今天能办的是：退掉一门不收手续费，统计那门延两周。" },
            { who: "学生", en: "That doesn't fix all of it.", cn: "这没把所有问题都解决。" },
            { who: "辅导员", en: "No. But it is two things fewer, and we can look again next week.", cn: "没有。但少了两件事，下周我们可以再看一次。" }
          ]
        },
        {
          variant: "渠道变体（电话 + 邮件）",
          relation: "学生 · 任课老师",
          register: "半正式",
          channel: "电话 + 邮件",
          barrier: "邮件三天没回，只能打电话追",
          result: "达成（电话里当场批准，邮件确认留档）",
          lines: [
            { who: "学生", en: "Hello, is that Dr Ahmed? I emailed you on Monday about an extension.", cn: "您好，是 Ahmed 老师吗？我周一给您发过关于延期的邮件。" },
            { who: "老师", en: "I saw it. I have four hundred emails and I answer the urgent ones first.", cn: "我看到了。我有四百封邮件，先回紧急的。" },
            { who: "学生", en: "I understand. Mine becomes urgent tomorrow, which is why I'm calling.", cn: "我明白。我的从明天起就紧急，所以我才打电话。" },
            { who: "老师", en: "Go on.", cn: "说。" },
            { who: "学生", en: "I need five days. I have the medical note and I can send it in the next ten minutes.", cn: "我需要五天。我有医生证明，十分钟内能发过去。" },
            { who: "老师", en: "Send it. Five days. And put the deadline in the subject line of your next email.", cn: "发过来。五天。下次邮件把截止日期写在标题里。" },
            { who: "学生", en: "In the subject line. Understood.", cn: "写在标题里。明白了。" },
            { who: "老师", en: "I'm not annoyed with you. I'm annoyed with the three hundred people who don't do that.", cn: "我不是生你的气。我是气那三百个不这么做的人。" },
            { who: "学生", en: "Then I'll do it from now on.", cn: "那我以后都这么写。" },
            { who: "老师", en: "Do. And confirm this call by email, so we both have it in writing.", cn: "好。再把这通电话用邮件确认一下，双方都有书面记录。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "学生 · 学院委员会（听证）",
          register: "正式",
          channel: "面对面（委员会听证）",
          barrier: "无（但需正式陈述并提交证据）",
          result: "达成（延期四周获准并记入纪要）",
          lines: [
            { who: "主席", en: "You have applied for an extension of four weeks. Please state your case.", cn: "你申请延期四周。请陈述理由。" },
            { who: "学生", en: "I shall keep it brief. On the fourteenth of February I was admitted to hospital and discharged on the twenty-first.", cn: "我尽量简短。二月十四日我入院，二十一日出院。" },
            { who: "主席", en: "Do you have the discharge summary with you?", cn: "你带出院小结了吗？" },
            { who: "学生", en: "I do, together with a letter from my supervisor confirming the agreed plan for the remaining work.", cn: "带了，还有导师确认后续工作安排的信。" },
            { who: "委员", en: "Were your other modules affected to the same degree?", cn: "其他课程也受到同样程度的影响吗？" },
            { who: "学生", en: "Two were, and I have already completed both. This one requires laboratory access, which was the part I could not do.", cn: "有两门受影响，那两门我已经完成了。这一门需要进实验室，那部分我当时做不了。" },
            { who: "委员", en: "That is a reasonable distinction. I note no objection.", cn: "这个区分合理。我没有异议。" },
            { who: "主席", en: "Then the extension is granted for four weeks and the reasons are minuted. You will be asked to submit a revised timetable by Friday.", cn: "那延期四周获准，理由记入纪要。请在周五前提交修订后的时间表。" },
            { who: "学生", en: "I shall send it on Thursday. Thank you.", cn: "我周四发。谢谢。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "同学",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成（学会分批要延期）",
          lines: [
            { who: "Sam", en: "did you get the extension", cn: "延期批了吗" },
            { who: "Rob", en: "yeah", cn: "批了" },
            { who: "Sam", en: "how", cn: "怎么批的" },
            { who: "Rob", en: "i asked nicely", cn: "我好好问了" },
            { who: "Sam", en: "that's not a strategy", cn: "这不算策略" },
            { who: "Rob", en: "it worked though", cn: "但管用了" },
            { who: "Sam", en: "how long", cn: "延多久" },
            { who: "Rob", en: "a week", cn: "一周" },
            { who: "Sam", en: "i need three", cn: "我需要三周" },
            { who: "Rob", en: "then don't ask for three", cn: "那就别要三周" },
            { who: "Sam", en: "what", cn: "什么" },
            { who: "Rob", en: "ask for one. then ask for two more next week", cn: "先要一周。下周再要两周" },
            { who: "Sam", en: "you're a bad person", cn: "你这人不行" },
            { who: "Rob", en: "i'm a person with an extension", cn: "我是个延期批了的人" }
          ]
        }
      ]
    },

    /* ==================== 05-06 图书馆咨询与同学协作摩擦 ==================== */
    {
      id: "s05-06",
      domain: "05",
      title: "图书馆咨询与同学协作摩擦",
      ielts: "口语 P2 学术 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "学生 · 图书馆员",
          register: "随意",
          channel: "面对面（咨询台）",
          barrier: "无",
          result: "达成（调阅成功，还学会按馆藏地点筛选）",
          lines: [
            { who: "学生", en: "Hi. I'm looking for a paper the catalogue says is here, but it isn't on the shelf.", cn: "你好。我在找一篇论文，目录显示馆里有，但架上没有。" },
            { who: "馆员", en: "Have you got the reference?", cn: "有出处吗？" },
            { who: "学生", en: "Yes. Journal of Applied Linguistics, volume forty, nineteen ninety-eight.", cn: "有。《应用语言学杂志》，第四十卷，一九九八年。" },
            { who: "馆员", en: "That's in the off-site store. Everything before two thousand is.", cn: "那在馆外书库。两千年以前的都在那儿。" },
            { who: "学生", en: "Can I get it today?", cn: "今天能拿到吗？" },
            { who: "馆员", en: "I can order it. It arrives on Tuesday and you'll get an email.", cn: "我可以调阅。周二到，会给你发邮件。" },
            { who: "学生", en: "The deadline is Friday, so Tuesday is fine.", cn: "截止是周五，周二可以。" },
            { who: "馆员", en: "Good. While you're here, let me show you the search that would have told you that.", cn: "好。趁你在这儿，我教你一下本来能告诉你这件事的检索方法。" },
            { who: "学生", en: "There's a filter for location.", cn: "有个按馆藏地点筛选的选项。" },
            { who: "馆员", en: "There is. Most people find out the slow way, four times.", cn: "有。大部分人是用慢办法发现的，还得发现四回。" },
            { who: "学生", en: "Not this time. Thanks.", cn: "这次不会了。谢谢。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "博士生 · 馆藏主管",
          register: "半正式",
          channel: "面对面（办公室）",
          barrier: "无",
          result: "达成（拿到八周借期，还争取到研究间）",
          lines: [
            { who: "学生", en: "Thank you for the appointment. I'd like to ask about extended borrowing.", cn: "谢谢您安排见面。我想问一下延长借期的事。" },
            { who: "主管", en: "Undergraduates get two weeks. Research students get eight, if they ask.", cn: "本科生两周。研究生八周，但要主动申请。" },
            { who: "学生", en: "Nobody told me that in three years.", cn: "三年了没人告诉过我。" },
            { who: "主管", en: "We tell the departments. Whether it travels any further is another matter.", cn: "我们通知的是院系。能不能再往下传是另一回事。" },
            { who: "学生", en: "Could I have the eight weeks from today?", cn: "能从今天起给我八周吗？" },
            { who: "主管", en: "You could. Do you have anything out at the moment?", cn: "可以。你现在有借出的书吗？" },
            { who: "学生", en: "Eleven items, all a few days overdue.", cn: "十一本，都超期了几天。" },
            { who: "主管", en: "Clear the fines first and I'll switch you over. I'll give you a carrel as well, since you're here.", cn: "先清掉罚款，然后我给你改。既然你来了，我再给你一间研究间。" },
            { who: "学生", en: "A carrel? I thought there was a waiting list.", cn: "研究间？我以为要排队。" },
            { who: "主管", en: "There is. It moves faster for people who turn up and ask.", cn: "是要排。不过对亲自来问的人，排得快一些。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "同班同学",
          register: "随意",
          channel: "面对面（图书馆）",
          barrier: "同学要你把四个月的资料文件夹整套打包给他",
          result: "折中（给检索式 + 三篇核心文献，不给全部笔记）",
          lines: [
            { who: "Dan", en: "Can you send me your folder? The one with all the sources.", cn: "你能把那个文件夹发我吗？就是所有资料那个。" },
            { who: "Mei", en: "That is four months of work.", cn: "那是四个月的活儿。" },
            { who: "Dan", en: "I know. I've got two weeks.", cn: "我知道。我有两周。" },
            { who: "Mei", en: "Then two weeks of searching is what you've got. I'm not handing over the folder.", cn: "那你有两周的检索时间。文件夹我不给。" },
            { who: "Dan", en: "That's a bit harsh.", cn: "这话有点狠。" },
            { who: "Mei", en: "It isn't harsh, it's the difference between helping and doing it for you. Here's what I will give you.", cn: "不狠。这是帮忙和替你做之间的差别。我给你这个。" },
            { who: "Dan", en: "What?", cn: "什么？" },
            { who: "Mei", en: "The search string I used, and the three papers everything else hangs off.", cn: "我用的检索式，还有三篇核心文献，其他都是从这三篇长出来的。" },
            { who: "Dan", en: "That's actually more useful.", cn: "这其实更有用。" },
            { who: "Mei", en: "It's more useful and it takes you two days instead of two months. Bring me your draft on Friday and I'll read it.", cn: "更有用，而且只要两天不是两个月。周五把初稿带来，我看。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "同组同学",
          register: "随意",
          channel: "面对面（图书馆）",
          barrier: "两人都以为对方订了研讨间，四个人白等在走廊",
          result: "修复（当场补订空房，定下「发截图」的规矩）",
          lines: [
            { who: "Rob", en: "We're outside room three. Where are you?", cn: "我们在三号间外面。你在哪儿？" },
            { who: "Tina", en: "I'm at the desk. Room three was booked for two o'clock, not four.", cn: "我在服务台。三号间订的是两点，不是四点。" },
            { who: "Rob", en: "I thought you booked four.", cn: "我以为你订的是四点。" },
            { who: "Tina", en: "I booked two and told you in the group.", cn: "我订的是两点，而且在群里说了。" },
            { who: "Rob", en: "I read the first line and assumed the rest.", cn: "我看了第一行，剩下的靠猜。" },
            { who: "Tina", en: "So four of us are standing in a corridor.", cn: "那我们四个人现在站在走廊里。" },
            { who: "Rob", en: "Three of us. Sam went for coffee.", cn: "三个人。Sam 去买咖啡了。" },
            { who: "Tina", en: "There's a free room at half past. I'm booking it now, while we talk.", cn: "半点有一间空房。我趁说话这就订。" },
            { who: "Rob", en: "Do it. And from now on, whoever books it posts a screenshot.", cn: "订吧。以后谁订谁发截图。" },
            { who: "Tina", en: "A screenshot, not a message.", cn: "发截图，不是发消息。" },
            { who: "Rob", en: "A screenshot. That's the rule.", cn: "发截图。就这条规矩。" }
          ]
        },
        {
          variant: "情绪型（有人反复改我的段落）",
          relation: "同组同学",
          register: "随意（情绪化）",
          channel: "面对面（图书馆）",
          barrier: "同组的人半夜反复重写你的段落，还不告知",
          result: "达成（定下只写批注、不改正文）",
          lines: [
            { who: "Mei", en: "This is the third version of my section.", cn: "这是我那节的第三个版本了。" },
            { who: "Rob", en: "I was improving it.", cn: "我在帮你改好。" },
            { who: "Mei", en: "You rewrote it. There's a difference, and you did it without telling me.", cn: "你是重写了。这不一样，而且你没告诉我。" },
            { who: "Rob", en: "You weren't answering.", cn: "你没回我。" },
            { who: "Mei", en: "I was asleep. It was midnight.", cn: "我在睡觉。那是半夜。" },
            { who: "Rob", en: "Fine. I thought you'd be pleased.", cn: "行。我以为你会高兴。" },
            { who: "Mei", en: "I'd be pleased if you left a comment saying why. Now I can't tell which ideas are mine.", cn: "你要是留条批注说明原因，我会高兴。现在我看不出哪些观点是我的了。" },
            { who: "Rob", en: "...I didn't think of it that way.", cn: "……我没这么想过。" },
            { who: "Mei", en: "I know. So: comments only, no edits, until we merge on Sunday.", cn: "我知道。所以：只写批注，别改正文，周日合并的时候再说。" },
            { who: "Rob", en: "Comments only. And I'll put your version back.", cn: "只写批注。我把你的版本放回去。" },
            { who: "Mei", en: "Thank you. That is all I wanted.", cn: "谢谢。我要的就是这个。" }
          ]
        },
        {
          variant: "渠道变体（在线咨询）",
          relation: "学生 · 图书馆在线咨询",
          register: "半正式",
          channel: "在线咨询（聊天）",
          barrier: "机器人先拦一轮，换了三次说法才转人工",
          result: "达成（拿到扫描件与两个工作日承诺）",
          lines: [
            { who: "系统", en: "Hello, I'm the library assistant. How can I help today?", cn: "你好，我是图书馆助手。今天需要什么帮助？" },
            { who: "学生", en: "I need a scan of an article chapter. Is that possible?", cn: "我需要一篇文章章节的扫描件。可以吗？" },
            { who: "系统", en: "Please choose: borrowing, fines, rooms, scans, other.", cn: "请选择：借阅、罚款、房间、扫描、其他。" },
            { who: "学生", en: "other", cn: "其他" },
            { who: "系统", en: "I'm sorry, I didn't understand. Please rephrase.", cn: "抱歉，我没听懂。请换一种说法。" },
            { who: "学生", en: "human", cn: "人工" },
            { who: "馆员", en: "Hi, this is Priya. You wanted a scan?", cn: "你好，我是 Priya。你需要扫描件？" },
            { who: "学生", en: "Yes. One chapter, about thirty pages, from a book we only have in print.", cn: "是的。一章，大概三十页，一本书我们只有纸质版。" },
            { who: "馆员", en: "Within the copyright limits, yes. Send me the details and it'll be in your inbox in two working days.", cn: "在版权允许范围内可以。把信息发我，两个工作日内发到你邮箱。" },
            { who: "学生", en: "The chat assistant asked me to rephrase three times.", cn: "聊天助手让我换了三次说法。" },
            { who: "馆员", en: "It does that. Next time, type the word human first.", cn: "它就是这样。下次先打人工两个字。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "研究者 · 特藏馆员",
          register: "正式",
          channel: "面对面（特藏阅览室）",
          barrier: "无（但需正式申请并遵守规程）",
          result: "达成（获准查阅，预约好下次座位）",
          lines: [
            { who: "研究者", en: "Good morning. I have an appointment to consult the Marchand papers.", cn: "早上好。我预约了查阅 Marchand 手稿。" },
            { who: "馆员", en: "You do. May I see your reader's card and a form of identification?", cn: "是的。可以看一下您的读者证和一份身份证件吗？" },
            { who: "研究者", en: "Certainly. I understand that only pencils are permitted.", cn: "当然。我了解这里只允许用铅笔。" },
            { who: "馆员", en: "Pencils, and no bags at the desk. Lockers are by the entrance.", cn: "铅笔，桌上不能放包。储物柜在入口旁。" },
            { who: "研究者", en: "I shall leave everything there. Am I permitted to photograph the letters?", cn: "我会把东西都放那儿。信札可以拍照吗？" },
            { who: "馆员", en: "For private study, yes, without flash. Publication requires written permission from the estate.", cn: "私人研究可以，不能开闪光灯。出版需要版权方的书面许可。" },
            { who: "研究者", en: "I shall write to them this week. May I reserve the same seat for Thursday?", cn: "我这周就给他们写信。周四我可以预约同一个座位吗？" },
            { who: "馆员", en: "I have noted it. The boxes you requested will be waiting.", cn: "我记下了。您要的档案盒会准备好。" },
            { who: "研究者", en: "You have been most helpful. Thank you.", cn: "您帮了大忙。谢谢。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "同学",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Sam", en: "are you in the library", cn: "你在图书馆吗" },
            { who: "Rob", en: "yeah. third floor", cn: "在。三楼" },
            { who: "Sam", en: "save me a seat", cn: "给我占个座" },
            { who: "Rob", en: "no", cn: "不" },
            { who: "Sam", en: "why", cn: "为什么" },
            { who: "Rob", en: "because you talk", cn: "因为你老说话" },
            { who: "Sam", en: "i won't talk", cn: "我不说话" },
            { who: "Rob", en: "you always talk", cn: "你每次都说话" },
            { who: "Sam", en: "i have headphones now", cn: "我现在有耳机了" },
            { who: "Rob", en: "big ones", cn: "大耳机？" },
            { who: "Sam", en: "big ones", cn: "大耳机" },
            { who: "Rob", en: "fine. window side", cn: "行。靠窗" },
            { who: "Sam", en: "you're a good person", cn: "你是个好人" },
            { who: "Rob", en: "keep them on", cn: "耳机别摘" }
          ]
        }
      ]
    },

    /* ==================== 06-01 面试 ==================== */
    {
      id: "s06-01",
      domain: "06",
      title: "面试",
      ielts: "口语 P2 工作 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "应聘者 · 未来同事（初筛）",
          register: "半正式",
          channel: "视频面试",
          barrier: "无",
          result: "达成（进入第二轮）",
          lines: [
            { who: "面试官", en: "Thanks for making time. This is a short screen, about twenty minutes, mostly about your last role.", cn: "谢谢你来。这是一次简短初筛，大概二十分钟，主要聊你上一份工作。" },
            { who: "应聘者", en: "That works.", cn: "可以。" },
            { who: "面试官", en: "So what were you responsible for there?", cn: "你在那边负责什么？" },
            { who: "应聘者", en: "I ran the support queue for three products, about two hundred tickets a week, and I wrote the macros the team still uses.", cn: "我负责三个产品的支持工单，每周大约两百单，还写了团队现在还在用的快捷回复模板。" },
            { who: "面试官", en: "Still uses, so you left over a year ago?", cn: "现在还在用——所以你已经离开一年多了？" },
            { who: "应聘者", en: "Fourteen months. I checked with a friend there last week.", cn: "十四个月。我上周还跟那边的朋友确认过。" },
            { who: "面试官", en: "Why did you leave?", cn: "为什么离开？" },
            { who: "应聘者", en: "They moved the whole team to another time zone and offered a relocation I couldn't take.", cn: "他们把整个团队挪到了另一个时区，给的搬迁方案我没法接受。" },
            { who: "面试官", en: "Fair. What are you looking for now?", cn: "明白。你现在想找什么样的？" },
            { who: "应聘者", en: "The same kind of work, with more ownership of the process rather than just the tickets.", cn: "同类工作，但要能对流程本身负责，而不只是处理工单。" },
            { who: "面试官", en: "That's honest, and it fits what we are building. I'll put you through to the second round.", cn: "这个回答很实在，也跟我们正在做的事对得上。我送你进第二轮。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "应聘者 · 招聘经理",
          register: "半正式偏正式",
          channel: "面对面（会议室）",
          barrier: "无",
          result: "达成（薪资范围对齐，约定周四给数字）",
          lines: [
            { who: "经理", en: "Let's talk about the role first, then money. What did you earn in your last position?", cn: "我们先谈岗位，再谈钱。你上一份工作的收入是多少？" },
            { who: "应聘者", en: "I'd rather start with the range for this role, if that's all right. Then I can tell you whether we're close.", cn: "如果可以，我想先听这个岗位的薪资区间，然后我再说我们是否接近。" },
            { who: "经理", en: "That's fair. The band is forty-two to fifty thousand, depending on experience.", cn: "合理。区间是四万二到五万，看经验。" },
            { who: "应聘者", en: "Then we're close. I was on forty-eight with a bonus, and I'd be looking for the upper half of your band.", cn: "那我们接近。我上一份是四万八加奖金，我期望在你们区间的上半段。" },
            { who: "经理", en: "Upper half means fifty, effectively.", cn: "上半段实际就是五万。" },
            { who: "应聘者", en: "It means forty-seven and up. I'd need to see the whole package before I name a figure.", cn: "意思是四万七以上。在给出具体数字之前，我需要看完整待遇。" },
            { who: "经理", en: "What in the package matters to you?", cn: "待遇里什么对你重要？" },
            { who: "应聘者", en: "The training budget, and whether the on-call is paid. Those two move the number more than the base does.", cn: "培训预算，以及值班是否给钱。这两项对数字的影响比底薪大。" },
            { who: "经理", en: "On-call is paid and training is two thousand a year. I'll send it in writing.", cn: "值班给钱，培训每年两千。我书面发你。" },
            { who: "应聘者", en: "Then I can give you a figure by Thursday.", cn: "那我周四可以给你一个数字。" },
            { who: "经理", en: "Thursday works.", cn: "周四可以。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "应聘者 · 招聘经理",
          register: "半正式",
          channel: "视频面试",
          barrier: "对方要求做八小时不给钱的带回家作业",
          result: "折中（改成九十分钟现场题 + 提供过往作品）",
          lines: [
            { who: "经理", en: "The next stage is a take-home task. It takes about eight hours.", cn: "下一轮是一个带回家的作业，大概要八小时。" },
            { who: "应聘者", en: "Eight hours is most of a weekend. Is it paid?", cn: "八小时基本是一个周末。有报酬吗？" },
            { who: "经理", en: "It isn't, and I know how that sounds.", cn: "没有。我知道这听起来不好。" },
            { who: "应聘者", en: "Then I'd like to propose something different, and I'll accept it if the answer is no.", cn: "那我想提个别的方案，如果你们说不，我也接受。" },
            { who: "经理", en: "Go on.", cn: "说。" },
            { who: "应聘者", en: "Ninety minutes live, on a problem you haven't used before, and I'll send two pieces of past work with the client names removed.", cn: "现场做九十分钟，题目要是你们没用过的；另外我发两份过去的作品，客户名抹掉。" },
            { who: "经理", en: "The live part is easy. The past work is harder, legally.", cn: "现场那部分好办。过往作品在法律上麻烦些。" },
            { who: "应聘者", en: "I've done it before, with a signed note saying I wrote it and it's shared with permission.", cn: "我以前做过，附一份签名说明，写明是我写的、经许可分享。" },
            { who: "经理", en: "Then that's what we'll do. Ninety minutes, Thursday.", cn: "那就这么办。周四，九十分钟。" },
            { who: "应聘者", en: "And if I do the take-home anyway?", cn: "要是我还是做了那个作业呢？" },
            { who: "经理", en: "Then you'd get the job and I'd feel bad about your weekend. Do the ninety minutes.", cn: "那你会拿到工作，而我会为你的周末感到抱歉。做九十分钟那个。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "应聘者 · 面试官（视频）",
          register: "半正式",
          channel: "视频面试",
          barrier: "网络卡顿漏答，面试官以为你在回避问题",
          result: "修复（说明断线并重答，约定卡住就再问一次）",
          lines: [
            { who: "面试官", en: "You didn't really answer the question about conflict.", cn: "你其实没有回答关于冲突的那个问题。" },
            { who: "应聘者", en: "I think my answer didn't reach you. My connection dropped for about ten seconds.", cn: "我想我的回答没传到您那儿。我的网络断了大概十秒。" },
            { who: "面试官", en: "It did freeze. Say it again.", cn: "确实卡住了。再说一遍。" },
            { who: "应聘者", en: "Short version: a colleague and I disagreed about a release date. I asked him to walk me through his numbers, and he was right about two of the three.", cn: "简短版：我和同事对发布时间有分歧。我请他讲了讲他的数字，三项里有两项他是对的。" },
            { who: "面试官", en: "And the third?", cn: "那第三项呢？" },
            { who: "应聘者", en: "The third was mine, and we moved the date by four days instead of two weeks.", cn: "第三项是我的，我们把日期推后了四天，而不是两周。" },
            { who: "面试官", en: "Better answer than the one I heard.", cn: "比刚才那个回答好。" },
            { who: "应聘者", en: "May I suggest something for the rest of the call? If I freeze, ask me again rather than scoring me.", cn: "后面的通话我提个建议行吗？如果我卡住，请再问一次，而不是直接打分。" },
            { who: "面试官", en: "That's reasonable. It happens on half my calls.", cn: "合理。我一半的电话面试都这样。" },
            { who: "应聘者", en: "Then it's worth saying out loud.", cn: "那就值得说出来。" }
          ]
        },
        {
          variant: "情绪型（被贬低）",
          relation: "应聘者 · 面试官（语气轻蔑）",
          register: "半正式（紧张）",
          channel: "面对面（面试）",
          barrier: "面试官说你的经历不算数，情绪受影响",
          result: "达成（稳住并扭转局面，面试官道歉）",
          lines: [
            { who: "面试官", en: "Support work isn't engineering. I'm not sure this counts.", cn: "支持工作不算工程。我不确定这算数。" },
            { who: "应聘者", en: "It doesn't count as engineering. It counts as running a system under load, which is what the role does.", cn: "它确实不算工程。它算是在压力下维持系统运转，而这个岗位做的就是这件事。" },
            { who: "面试官", en: "That's a stretch.", cn: "这话有点勉强。" },
            { who: "应聘者", en: "It might be. May I give you one example, and you tell me if it's relevant?", cn: "也许。我举一个例子，您来判断相不相关，行吗？" },
            { who: "面试官", en: "One.", cn: "一个。" },
            { who: "应聘者", en: "In March we lost a payment provider for six hours. I wrote the fallback routing, told four hundred customers before they noticed, and we kept ninety-two percent of the transactions.", cn: "三月我们丢了一个支付通道六个小时。我写了回退路由，在四百个客户察觉之前通知了他们，保住了百分之九十二的交易。" },
            { who: "面试官", en: "...Who signed that off?", cn: "……那是谁批准的？" },
            { who: "应聘者", en: "I did, at two in the morning, and I told my manager at seven.", cn: "我批的，凌晨两点；七点告诉了我经理。" },
            { who: "面试官", en: "That is relevant. I apologise for the earlier remark.", cn: "这确实相关。为刚才那句话我道歉。" },
            { who: "应聘者", en: "Thank you. I would rather be asked than dismissed.", cn: "谢谢。我宁愿被追问，也不想被打发。" }
          ]
        },
        {
          variant: "渠道变体（电话初筛）",
          relation: "应聘者 · 招聘专员（电话）",
          register: "半正式",
          channel: "电话初筛",
          barrier: "信号差又在嘈杂处，几次听不清",
          result: "达成（换安静地方继续，并约好断线就用文字）",
          lines: [
            { who: "专员", en: "Can you hear me okay?", cn: "能听清我说话吗？" },
            { who: "应聘者", en: "Mostly. You cut out on the last sentence.", cn: "大致能。最后一句断了。" },
            { who: "专员", en: "I said the role is hybrid, three days in the office.", cn: "我说这个岗位是混合办公，每周三天到办公室。" },
            { who: "应聘者", en: "Three days works. Sorry, I'm on a train platform. Let me move.", cn: "三天可以。抱歉，我在站台上，我换个地方。" },
            { who: "专员", en: "Take your time.", cn: "不着急。" },
            { who: "应聘者", en: "Better. Where were we?", cn: "好多了。我们说到哪儿了？" },
            { who: "专员", en: "Salary expectations.", cn: "薪资期望。" },
            { who: "应聘者", en: "Then let me answer that straight: forty-seven to fifty-two, depending on the on-call.", cn: "那我直接回答：四万七到五万二，看值班安排。" },
            { who: "专员", en: "That's inside the band. One more thing and I'll let you go.", cn: "在区间内。还有一件事就放你走。" },
            { who: "应聘者", en: "Go ahead.", cn: "请说。" },
            { who: "专员", en: "If the call drops again, text me and we'll finish by message. Nobody is judging you for being on a train.", cn: "要是再断线，给我发短信，我们用文字聊完。没人会因为你坐火车扣你分。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "应聘者 · 遴选委员会",
          register: "正式",
          channel: "面对面（委员会面试）",
          barrier: "无（但需正式陈述、条理清楚）",
          result: "达成（进入下一轮，周五前补交推荐人）",
          lines: [
            { who: "主席", en: "Thank you for attending. We have forty minutes and six questions. Shall we begin with your research plans?", cn: "感谢出席。我们有四十分钟、六个问题。先从您的研究计划开始，可以吗？" },
            { who: "应聘者", en: "By all means. In brief: I propose to extend the 2023 fieldwork to two additional sites, using the same instruments.", cn: "当然。简要说：我计划把 2023 年的田野工作扩展到另外两个站点，使用同一套工具。" },
            { who: "主席", en: "Why those two sites in particular?", cn: "为什么特别选这两个站点？" },
            { who: "应聘者", en: "Because they differ in exactly one variable, the funding model, and everything else is held constant.", cn: "因为它们在恰好一个变量上不同——经费模式——其余条件都保持不变。" },
            { who: "委员", en: "Who would supervise the fieldwork?", cn: "田野工作由谁指导？" },
            { who: "应聘者", en: "I would lead it, with Professor Iyer as the named supervisor and a local co-investigator at each site.", cn: "我主导，由 Iyer 教授作为在册导师，每个站点配一位当地合作研究者。" },
            { who: "委员", en: "And if the funding is not renewed?", cn: "如果经费没有续上呢？" },
            { who: "应聘者", en: "Then the first site continues under existing funds and I publish from that alone. The proposal is designed to survive a partial award.", cn: "那第一个站点用现有经费继续，我就以那一个站点发表。这个方案是按能承受部分资助来设计的。" },
            { who: "主席", en: "That is unusually prudent. We shall ask you for two references by Friday.", cn: "这种审慎很少见。请在周五前提供两位推荐人。" },
            { who: "应聘者", en: "I shall send them today.", cn: "我今天就发。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "应聘者 · 创业公司创始人（咖啡馆）",
          register: "随意",
          channel: "面对面（咖啡馆）",
          barrier: "无",
          result: "达成（当场约定周一入职）",
          lines: [
            { who: "创始人", en: "So why us? Everyone asks that, sorry.", cn: "那为什么选我们？大家都问这句，抱歉。" },
            { who: "应聘者", en: "Because you're small enough that the thing I do actually matters.", cn: "因为你们够小，我做的事真的有用。" },
            { who: "创始人", en: "That's a good answer. Most people say the mission.", cn: "这回答不错。大部分人说的是使命愿景。" },
            { who: "应聘者", en: "I don't know your mission yet.", cn: "我还不知道你们的使命。" },
            { who: "创始人", en: "Honestly, neither do we. We know what we're building this quarter.", cn: "说实话我们也不知道。我们只知道这个季度要做什么。" },
            { who: "应聘者", en: "That's more useful anyway.", cn: "那反而更有用。" },
            { who: "创始人", en: "You'd be the fourth person. Everybody does support and everybody does sales.", cn: "你来了是第四个人。所有人都做支持，所有人都做销售。" },
            { who: "应聘者", en: "Fine. I'd want the process side, the boring part nobody wants.", cn: "可以。我想要流程那一块，就是没人想干的枯燥部分。" },
            { who: "创始人", en: "Nobody has ever asked for that in an interview.", cn: "面试里从来没人主动要过这个。" },
            { who: "应聘者", en: "Then it's probably the job.", cn: "那大概就是这份工作了。" },
            { who: "创始人", en: "Can you start on Monday?", cn: "周一能来吗？" },
            { who: "应聘者", en: "I can start on Monday.", cn: "周一可以。" }
          ]
        }
      ]
    },

    /* ==================== 06-02 入职寒暄与同事相处 ==================== */
    {
      id: "s06-02",
      domain: "06",
      title: "入职寒暄与同事相处",
      ielts: "口语 P1 工作 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "新同事 · 老同事",
          register: "随意",
          channel: "面对面（办公室）",
          barrier: "无",
          result: "达成（有人带，顺利融入）",
          lines: [
            { who: "Rachel", en: "You must be the new one. I'm Rachel, two desks over.", cn: "你就是新来的吧。我是 Rachel，隔两张桌子。" },
            { who: "Tom", en: "Tom. Nice to meet you.", cn: "Tom。很高兴认识你。" },
            { who: "Rachel", en: "The coffee machine is a nightmare; the good one is on three. Lunch is usually about one, and nobody minds if you eat at your desk.", cn: "这台咖啡机很糟，好的那台在三楼。午饭一般一点左右，在座位上吃也没人管。" },
            { who: "Tom", en: "That is the induction I actually needed.", cn: "这才是我真正需要的入职培训。" },
            { who: "Rachel", en: "The official one takes two hours and tells you nothing. How's the laptop?", cn: "官方的要两小时，什么也没说。电脑怎么样？" },
            { who: "Tom", en: "It arrived with someone else's files on it.", cn: "送来的时候里面还有别人的文件。" },
            { who: "Rachel", en: "That's the second time this month. Tell IT and copy me; they move faster with two names on it.", cn: "这个月第二次了。告诉 IT 并抄送我，有两个人的名字他们动作快。" },
            { who: "Tom", en: "Doing it now.", cn: "我这就发。" },
            { who: "Rachel", en: "Good. And if anyone asks you to just quickly do something for their project this week, say you're still onboarding.", cn: "好。还有，这周要是有人让你顺手帮他们的项目做点事，你就说你还在入职期。" },
            { who: "Tom", en: "And next week?", cn: "那下周呢？" },
            { who: "Rachel", en: "Next week you decide for yourself.", cn: "下周你自己判断。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "新员工 · 直属主管",
          register: "半正式",
          channel: "面对面（一对一）",
          barrier: "无",
          result: "达成（定下优先顺序与汇报节奏）",
          lines: [
            { who: "主管", en: "First week talk. How's it going, honestly?", cn: "第一周谈话。说实话怎么样？" },
            { who: "员工", en: "Honestly: too many introductions to remember, and I don't know what my priorities are yet.", cn: "说实话：要记的人太多，而且我还不清楚优先顺序。" },
            { who: "主管", en: "That is the most useful thing anyone has said to me this week.", cn: "这是这周我听到的最有用的一句话。" },
            { who: "员工", en: "May I ask for something specific? A single list of what matters, even if it's wrong.", cn: "我能提个具体要求吗？给我一份唯一的重要事项清单，哪怕是错的也行。" },
            { who: "主管", en: "Wrong is fine at this stage. Here: these three, in this order. Ignore everything else for a fortnight.", cn: "这个阶段错了没关系。给你：这三件，按这个顺序。其他两周内都别管。" },
            { who: "员工", en: "And if someone asks me for something urgent that isn't on the list?", cn: "如果有人让我做清单以外很急的事呢？" },
            { who: "主管", en: "Send them to me. That isn't you being difficult, that's the process.", cn: "让他们来找我。这不是你难相处，这是流程。" },
            { who: "员工", en: "How often do you want updates?", cn: "你希望多久汇报一次？" },
            { who: "主管", en: "Friday, five lines, in writing. If it's longer than five lines, something is wrong.", cn: "周五，五行，书面。超过五行就说明有问题。" },
            { who: "员工", en: "Five lines on Friday. Understood.", cn: "周五五行。明白。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "新同事 · 老同事",
          register: "随意",
          channel: "面对面",
          barrier: "老同事想把做了三年的日常事务整体推给你",
          result: "折中（只接夜间邮件分类，限期两周后再谈）",
          lines: [
            { who: "Marcus", en: "While you're settling in, do you want to take the inbox? It's a good way to learn the clients.", cn: "趁你刚来，要不要接管收件箱？这是熟悉客户的好办法。" },
            { who: "员工", en: "How long has it been yours?", cn: "这个收件箱归你多久了？" },
            { who: "Marcus", en: "Three years.", cn: "三年。" },
            { who: "员工", en: "Then it isn't an onboarding task, it's your job. But I'll take one part of it.", cn: "那它就不是入职任务，是你的工作。不过我可以接一部分。" },
            { who: "Marcus", en: "Which part?", cn: "哪部分？" },
            { who: "员工", en: "The overnight emails. I'll triage them before nine for two weeks, and after that we review whether it's still useful.", cn: "夜间的邮件。我两周内在九点前分好类，之后我们再看还有没有必要。" },
            { who: "Marcus", en: "Two weeks is short.", cn: "两周太短了。" },
            { who: "员工", en: "Two weeks is what I'm offering while I'm still learning.", cn: "在我还在学的阶段，我能给的就是两周。" },
            { who: "Marcus", en: "Fair enough. And if it works?", cn: "有道理。要是有用呢？" },
            { who: "员工", en: "Then we talk about it properly, with it written into my tasks.", cn: "那我们正式谈，写进我的任务里。" },
            { who: "Marcus", en: "You've done this before.", cn: "你以前干过这种事。" },
            { who: "员工", en: "I've been the new person before.", cn: "我以前当过新人。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "新同事 · 老同事",
          register: "随意",
          channel: "面对面（茶水间）",
          barrier: "老同事的玩笑被新人当成排挤，心里结疙瘩",
          result: "修复（解释玩笑 + 约定以后有话直说）",
          lines: [
            { who: "员工", en: "Can I ask you something awkward?", cn: "我能问个尴尬的问题吗？" },
            { who: "Rachel", en: "You can.", cn: "可以。" },
            { who: "员工", en: "Yesterday, when I asked about the deadline, you said good luck with that. Was that about me?", cn: "昨天我问截止日期的时候，你说『祝你好运』。那是在说我吗？" },
            { who: "Rachel", en: "It was about the deadline. It's a joke we all make, because the deadline is impossible.", cn: "是说那个截止日期。这是我们都会开的玩笑，因为那个日期根本不可能。" },
            { who: "员工", en: "I spent yesterday evening thinking I'd said something wrong.", cn: "我昨晚一直在想我是不是说错了话。" },
            { who: "Rachel", en: "You didn't. I should have explained the joke.", cn: "你没有。我该解释一下这个玩笑。" },
            { who: "员工", en: "It's fine, but may I ask for one thing?", cn: "没关系，但我能提一个请求吗？" },
            { who: "Rachel", en: "Go on.", cn: "说。" },
            { who: "员工", en: "If I have actually got something wrong, say it plainly. I'd rather have that than guess.", cn: "如果我真做错了什么，请直接说。我宁愿那样，也不想靠猜。" },
            { who: "Rachel", en: "That I can do. And I'll stop making jokes that need three years of context.", cn: "可以。我也不再开那种需要三年背景才懂的玩笑了。" }
          ]
        },
        {
          variant: "情绪型（第一周被压垮）",
          relation: "新员工 · 同期老同事",
          register: "随意（情绪化）",
          channel: "面对面（楼梯间）",
          barrier: "信息量太大，新人第一周就崩了",
          result: "达成（被接住，并得到可执行的减负办法）",
          lines: [
            { who: "Rachel", en: "You're in the stairwell. Everything okay?", cn: "你在楼梯间。还好吗？" },
            { who: "员工", en: "I've been here four days and I've understood about ten minutes of it.", cn: "我来了四天，大概听懂了十分钟的内容。" },
            { who: "Rachel", en: "That's day four. I cried on day six.", cn: "才第四天。我第六天哭的。" },
            { who: "员工", en: "Really?", cn: "真的？" },
            { who: "Rachel", en: "In the car park. Over a spreadsheet.", cn: "在停车场。因为一张表格。" },
            { who: "员工", en: "I don't want to be the person who needs help every hour.", cn: "我不想成为那种每小时都要人帮的人。" },
            { who: "Rachel", en: "Nobody minds the questions. They mind the same question twice. So write them down and ask in one go at four o'clock.", cn: "没人烦问题。大家烦的是同一个问题问两遍。所以你把问题记下来，下午四点一次性问。" },
            { who: "员工", en: "One go at four.", cn: "四点一次性问。" },
            { who: "Rachel", en: "And skip the all-hands tomorrow. You're allowed one induction session instead.", cn: "还有，明天那个全员大会别去。你可以改去一场入职培训。" },
            { who: "员工", en: "Is that allowed?", cn: "这允许吗？" },
            { who: "Rachel", en: "I'll tell them you were in training. Which you will be.", cn: "我跟他们说你在培训。你确实会在培训。" }
          ]
        },
        {
          variant: "渠道变体（远程入职 / 群聊）",
          relation: "新员工 · 团队（远程）",
          register: "随意",
          channel: "远程 + 群聊",
          barrier: "远程入职没人带，群里问事没人回",
          result: "达成（找到对接人，定下每天早上十五分钟同步）",
          lines: [
            { who: "员工", en: "morning all. where do i find the client list", cn: "各位早。客户名单在哪儿找" },
            { who: "员工", en: "anyone", cn: "有人吗" },
            { who: "Rachel", en: "sorry, time zones. it's on the shared drive under clients", cn: "抱歉，时差。在共享盘的 clients 下面" },
            { who: "员工", en: "i don't have access to the shared drive", cn: "我没有共享盘的权限" },
            { who: "Rachel", en: "nobody does on day one. i'll raise it", cn: "第一天谁都没有。我去提" },
            { who: "员工", en: "who do i ask about the daily report?", cn: "日报我问谁" },
            { who: "Rachel", en: "that was marcus. he left in february", cn: "那是 Marcus。他二月走了" },
            { who: "员工", en: "so who now", cn: "那现在是谁" },
            { who: "Rachel", en: "good question. nobody, which is why it's late every day", cn: "好问题。没人，所以它每天都很晚" },
            { who: "员工", en: "can i take it", cn: "我可以接吗" },
            { who: "Rachel", en: "you've been here two days", cn: "你才来了两天" },
            { who: "员工", en: "and nobody else wants it", cn: "而且没人想要" },
            { who: "Rachel", en: "you're right. i'll be your contact for it. fifteen minutes every morning", cn: "你说得对。我来当你的对接人。每天早上十五分钟" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "新员工 · 部门负责人",
          register: "正式",
          channel: "面对面（正式会面）",
          barrier: "无（但需正式得体地介绍自己）",
          result: "达成（被记住，并获准直接沟通）",
          lines: [
            { who: "负责人", en: "You must be our new analyst. I am Mrs Okonjo; I oversee this division.", cn: "你就是我们新来的分析师。我是 Okonjo 女士，负责这个事业部。" },
            { who: "员工", en: "It is a pleasure to meet you. Thomas Reid. I joined on Monday.", cn: "很高兴认识您。我是 Thomas Reid，周一入职。" },
            { who: "负责人", en: "How have you found your first week?", cn: "第一周感觉如何？" },
            { who: "员工", en: "Full of information, most of which I expect to need in six weeks rather than now.", cn: "信息量很大，其中大部分我想是六周后才会用到，而不是现在。" },
            { who: "负责人", en: "That is a fair description of every first week here. Are you being well looked after?", cn: "这是这里每个第一周的准确写照。有人好好带你吗？" },
            { who: "员工", en: "I am, by Rachel. She has been generous with her time.", cn: "有，Rachel。她很愿意花时间。" },
            { who: "负责人", en: "I shall thank her for it. Should anything be unclear at my level, write to me directly.", cn: "我会谢谢她。如果有我这一层才说得清的事，直接写信给我。" },
            { who: "员工", en: "I shall, and I shall keep it to matters that need you.", cn: "我会的，而且只写需要您处理的事。" },
            { who: "负责人", en: "That is the right instinct. Welcome aboard.", cn: "这个判断是对的。欢迎加入。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "新同事 · 老同事",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Tom", en: "where do people eat", cn: "大家中午在哪吃" },
            { who: "Rachel", en: "basement. don't", cn: "地下室。别去" },
            { who: "Tom", en: "why", cn: "为什么" },
            { who: "Rachel", en: "you'll find out. or you won't, if you don't go", cn: "你会知道的。或者你不去就永远不会知道" },
            { who: "Tom", en: "that's not helpful", cn: "这话没用" },
            { who: "Rachel", en: "there's a place on the corner. i go at one", cn: "转角有家店。我一点去" },
            { who: "Tom", en: "i'm in", cn: "我加入" },
            { who: "Rachel", en: "you don't have to say yes to everything this week", cn: "这周你不用什么都答应" },
            { who: "Tom", en: "i'm saying yes to lunch", cn: "午饭我是答应的" },
            { who: "Rachel", en: "that one's allowed", cn: "这个可以答应" }
          ]
        }
      ]
    },

    /* ==================== 06-03 会议发言与打断插话 ==================== */
    {
      id: "s06-03",
      domain: "06",
      title: "会议发言与打断插话",
      ielts: "口语 P3 工作 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "同事 · 同事（团队会）",
          register: "中性",
          channel: "面对面（会议室）",
          barrier: "无",
          result: "达成（把问题摆上台面并写进议程）",
          lines: [
            { who: "主持", en: "Next item: the support queue. Any thoughts?", cn: "下一项：支持队列。有什么想法？" },
            { who: "Priya", en: "May I come in on that?", cn: "我能说一句吗？" },
            { who: "主持", en: "Go ahead.", cn: "请。" },
            { who: "Priya", en: "We've added two hundred tickets a week since January, with no extra capacity. I'd like us to say that out loud before we discuss anything else.", cn: "从一月起每周多了两百单，产能没变。我希望在讨论别的之前先把这件事说清楚。" },
            { who: "主持", en: "That is a fair place to start.", cn: "这个起点很合理。" },
            { who: "Rob", en: "The number is more like a hundred and fifty.", cn: "数字更像是一百五。" },
            { who: "Priya", en: "It is two hundred and six if you count the chat channel, which we started counting in February.", cn: "如果把聊天渠道算上，是两百零六，我们二月就开始统计了。" },
            { who: "Rob", en: "Then it is two hundred and six.", cn: "那就是两百零六。" },
            { who: "Priya", en: "So the question is whether we hire, or drop a product.", cn: "所以问题是我们要招人，还是砍掉一个产品。" },
            { who: "主持", en: "That is the question for the next meeting, and I'll put it in the agenda.", cn: "这是下次会议的问题，我把它写进议程。" },
            { who: "Priya", en: "Good. I don't want it to be a surprise in March.", cn: "好。我不想它到三月才变成意外。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "员工 · 高级别与会者",
          register: "半正式",
          channel: "面对面（跨部门会议）",
          barrier: "无",
          result: "达成（插话成功，决定提前，风险写进纪要）",
          lines: [
            { who: "主持", en: "I think we have covered the timeline. Anything else?", cn: "时间线我想已经讨论完了。还有别的吗？" },
            { who: "员工", en: "May I add one thing before we close the item? It's a risk rather than a comment.", cn: "在结束这一项之前我能补一点吗？是风险，不是评论。" },
            { who: "主持", en: "Please.", cn: "请。" },
            { who: "员工", en: "The supplier's lead time doubles in August. If we sign in July we're fine; in August we're six weeks late.", cn: "供应商的交付周期八月翻倍。七月签就没问题，八月签就要晚六周。" },
            { who: "总监", en: "Where did that come from?", cn: "这个信息从哪来的？" },
            { who: "员工", en: "Their own schedule, page four. I asked them to confirm it in writing and they did, last Thursday.", cn: "他们自己的排期表，第四页。我请他们书面确认，上周四确认了。" },
            { who: "总监", en: "Nobody else has seen this.", cn: "别人都没看到过。" },
            { who: "员工", en: "I only got it on Thursday. I'd rather interrupt now than in September.", cn: "我周四才拿到。我宁愿现在打断，也不想九月再说。" },
            { who: "总监", en: "Quite right. Put it in the minutes and move the decision to July.", cn: "完全正确。写进纪要，把决定提前到七月。" },
            { who: "员工", en: "I'll send the page round after this.", cn: "会后我把那页发给大家。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "同事 · 同事（被打断者）",
          register: "中性",
          channel: "面对面（会议）",
          barrier: "发言被反复打断，一句话说不完",
          result: "折中（用「给我两分钟」拿回话语权）",
          lines: [
            { who: "Rob", en: "That won't work, because—", cn: "那样不行，因为——" },
            { who: "Priya", en: "Sorry, let me finish this sentence and then I'll stop.", cn: "抱歉，让我把这句话说完就停。" },
            { who: "Rob", en: "But the numbers—", cn: "可那些数字——" },
            { who: "Priya", en: "Two minutes. I'll take two minutes, and then you have the rest of the meeting.", cn: "两分钟。我要两分钟，剩下的时间都归你。" },
            { who: "Rob", en: "...Fine. Two minutes.", cn: "……行。两分钟。" },
            { who: "Priya", en: "Thank you. Three points. One: the volume doubled. Two: the error rate didn't. Three: that means the process is sound and the staffing isn't.", cn: "谢谢。三点。一，量翻倍了。二，错误率没有。三，这说明流程没问题，人手有问题。" },
            { who: "Rob", en: "That is... a good argument.", cn: "这……是个好论证。" },
            { who: "Priya", en: "It's your data. I only read it in order.", cn: "用的是你的数据。我只是按顺序读了一遍。" },
            { who: "Rob", en: "Then I withdraw the objection.", cn: "那我撤回反对意见。" },
            { who: "Priya", en: "You don't have to. Just say it after I finish, next time.", cn: "不必。下次等我说完再说就行。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "同事 · 同事（线上会）",
          register: "中性",
          channel: "线上会议",
          barrier: "多人同时开口，会议陷入互相盖话",
          result: "修复（开启举手功能，主持人点名）",
          lines: [
            { who: "主持", en: "Sorry, three people at once. Rob, you were first.", cn: "抱歉，三个人同时说。Rob，你先。" },
            { who: "Rob", en: "I was going to say the same thing as Tina.", cn: "我要说的和 Tina 一样。" },
            { who: "主持", en: "Tina?", cn: "Tina？" },
            { who: "Tina", en: "Then it's been said. Can we agree a way of doing this? Half of this call is people talking over each other.", cn: "那就说完了。我们能定个办法吗？这通电话一半时间大家在互相盖话。" },
            { who: "主持", en: "Suggest something.", cn: "你提一个。" },
            { who: "Tina", en: "Raise your hand in the app and the host picks. It's one setting.", cn: "在应用里举手，主持人点名。就是一个设置。" },
            { who: "Rob", en: "That slows everything down.", cn: "那会拖慢速度。" },
            { who: "Tina", en: "We spent eleven minutes on one item. It can't slow down much further.", cn: "我们在一个议题上花了十一分钟。再慢也慢不到哪去了。" },
            { who: "主持", en: "It's on. Let's try it for the rest of the call.", cn: "开了。剩下时间我们试试。" },
            { who: "Rob", en: "Fine. Hand up.", cn: "行。我举手。" }
          ]
        },
        {
          variant: "情绪型（想法被无视后被别人复述）",
          relation: "员工 · 同事（当场被抢话）",
          register: "中性（情绪化）",
          channel: "面对面（会议）",
          barrier: "十分钟前提的想法没人接，别人复述后被认可",
          result: "达成（平静标记归属，主持人改了收集意见的方式）",
          lines: [
            { who: "员工", en: "I said that ten minutes ago and it didn't land. I'd like to know what changed.", cn: "我十分钟前说过这个，当时没人接。我想知道是什么变了。" },
            { who: "主持", en: "Sorry, which part?", cn: "抱歉，哪一部分？" },
            { who: "员工", en: "The staged rollout. Marcus has just described it and now it's a good idea. I'd like the record to show it was on the table earlier.", cn: "分阶段上线。Marcus 刚刚描述了它，现在它成了好主意。我希望记录里体现它更早就被提过。" },
            { who: "Marcus", en: "You did say it. I forgot who said it, and that's on me.", cn: "你确实说过。我忘了是谁说的，这是我的问题。" },
            { who: "员工", en: "Thank you. That is all I wanted.", cn: "谢谢。我要的就是这个。" },
            { who: "主持", en: "I'll note it in the minutes as your proposal.", cn: "我在纪要里记成你提的。" },
            { who: "员工", en: "Not for credit. For the next time I say something and the room goes quiet.", cn: "不是为了功劳。是为了下次我说话时屋里别一片安静。" },
            { who: "主持", en: "...That is fair, and it is a pattern. Let's take ideas in order from now on.", cn: "……这话有道理，而且这是个模式。以后按顺序收集意见。" },
            { who: "Marcus", en: "Agreed. And I'll say who said what before I build on it.", cn: "同意。而且我以后在接着讲之前会说清是谁提的。" }
          ]
        },
        {
          variant: "渠道变体（混合会议：现场 + 线上）",
          relation: "远程与会者 · 现场主持",
          register: "中性",
          channel: "混合会议",
          barrier: "现场讨论太投入，线上的人被忘了，麦克风还对着墙",
          result: "达成（主持人改为前五分钟先听远程）",
          lines: [
            { who: "远程", en: "Sorry to interrupt, we couldn't hear the last two minutes. The room mic is pointing at the wall.", cn: "抱歉打断一下，最后两分钟我们听不见。会议室麦克风冲着墙。" },
            { who: "主持", en: "Sorry. Is that better?", cn: "抱歉。这样好点吗？" },
            { who: "远程", en: "Much. But we also couldn't tell who was speaking.", cn: "好多了。不过我们也听不出是谁在说。" },
            { who: "主持", en: "That was Rob, then Priya.", cn: "是 Rob，然后 Priya。" },
            { who: "远程", en: "Then may I respond to Priya? I'm typing it as well, in case the audio goes again.", cn: "那我能回应 Priya 吗？我同时也打字，以防音频再断。" },
            { who: "主持", en: "Please.", cn: "请。" },
            { who: "远程", en: "The two-week window only works if the Berlin team is on the same release. They are a week behind.", cn: "两周的窗口只有在柏林团队同版本发布的前提下才成立。他们晚了一周。" },
            { who: "主持", en: "We didn't know that.", cn: "我们不知道这个。" },
            { who: "远程", en: "I know. That is why I stopped waiting to be asked.", cn: "我知道。所以我不等了，直接说。" },
            { who: "主持", en: "Fair. From now on, remote first for the first five minutes.", cn: "有道理。以后前五分钟先听远程。" },
            { who: "远程", en: "Then someone has to say that at the start of every meeting, not just this one.", cn: "那每次会议开头都得有人说这句，不只是这次。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "与会者 · 委员会主席",
          register: "正式",
          channel: "面对面（委员会会议）",
          barrier: "无（但需正式请求发言并按程序动议）",
          result: "达成（动议通过，事项延后至九月）",
          lines: [
            { who: "与会者", en: "Mr Chairman, may I speak to item four?", cn: "主席先生，我可以就第四项发言吗？" },
            { who: "主席", en: "You may.", cn: "可以。" },
            { who: "与会者", en: "I shall be brief. The proposal before us would commit the committee to a sum not yet audited.", cn: "我尽量简短。提交给我们的提案会让委员会承诺一笔尚未审计的款项。" },
            { who: "主席", en: "The figure has been circulated.", cn: "数字已经传阅。" },
            { who: "与会者", en: "It has, and it is an estimate rather than an account. I would move that we defer the decision until the audit is tabled.", cn: "是的，但那是估算而非账目。我提议推迟决定，待审计报告提交后再议。" },
            { who: "委员", en: "Is there a seconder?", cn: "有人附议吗？" },
            { who: "另一委员", en: "I second the motion.", cn: "我附议。" },
            { who: "主席", en: "Then the motion is before the committee. Those in favour?", cn: "那么动议已提交委员会。赞成的请举手？" },
            { who: "主席", en: "Carried. The matter returns to the agenda in September, with the audit.", cn: "通过。此事连同审计报告九月重回议程。" },
            { who: "与会者", en: "Thank you, Mr Chairman.", cn: "谢谢主席先生。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "团队成员 · 每日站会",
          register: "随意（极简、俚语）",
          channel: "每日站会",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "主持", en: "go", cn: "开始" },
            { who: "Rob", en: "shipped the fix. nothing blocked", cn: "修复上线了。没阻塞" },
            { who: "主持", en: "sam", cn: "Sam" },
            { who: "Sam", en: "still on the migration", cn: "还在弄迁移" },
            { who: "主持", en: "how long", cn: "还要多久" },
            { who: "Sam", en: "tuesday", cn: "周二" },
            { who: "主持", en: "you said tuesday last tuesday", cn: "上个周二你也是说周二" },
            { who: "Sam", en: "this tuesday", cn: "这个周二" },
            { who: "主持", en: "right. anyone blocked", cn: "行。有人被卡住吗" },
            { who: "Rob", en: "sam", cn: "Sam" },
            { who: "Sam", en: "not blocked. slow", cn: "不是被卡。是慢" },
            { who: "主持", en: "same thing. fifteen minutes after this, you and me", cn: "一回事。散会后你留一下，十五分钟" }
          ]
        }
      ]
    },

    /* ==================== 06-04 提出异议与进度汇报 ==================== */
    {
      id: "s06-04",
      domain: "06",
      title: "提出异议与进度汇报",
      ielts: "口语 P3 工作 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "同事 · 同事",
          register: "中性",
          channel: "面对面（办公室）",
          barrier: "无",
          result: "达成（先修一处，两周后用数据决定是否重做）",
          lines: [
            { who: "Priya", en: "I don't think we should rebuild the whole thing.", cn: "我认为我们不该整个重做。" },
            { who: "Rob", en: "You saw the error rates.", cn: "你看了错误率。" },
            { who: "Priya", en: "I did. Ninety percent of the errors come from one input field.", cn: "看了。百分之九十的错误来自一个输入框。" },
            { who: "Rob", en: "So we fix the field.", cn: "那就修那个输入框。" },
            { who: "Priya", en: "We fix the field, and if that doesn't move the number in two weeks, we rebuild.", cn: "先修输入框，如果两周后数字没动，我们再重做。" },
            { who: "Rob", en: "That's two weeks of pretending.", cn: "那是两周的自欺欺人。" },
            { who: "Priya", en: "It is two weeks of evidence. If I'm wrong, you get your rebuild and I support it in the meeting.", cn: "那是两周的证据。如果我错了，你提重做，我在会上支持你。" },
            { who: "Rob", en: "...Fine. Two weeks.", cn: "……行。两周。" },
            { who: "Priya", en: "And we write down now what number would prove me wrong.", cn: "而且我们现在就写下什么数字能证明我错了。" },
            { who: "Rob", en: "Half the errors gone.", cn: "错误少一半。" },
            { who: "Priya", en: "Half. Done.", cn: "少一半。就这么定。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "项目经理 · 总监",
          register: "半正式",
          channel: "面对面（一对一）",
          barrier: "无",
          result: "达成（砍掉没人要的模块，并当天告知客户）",
          lines: [
            { who: "总监", en: "Where are we?", cn: "进展到哪儿了？" },
            { who: "经理", en: "Two weeks behind, and I'd like to say why before you ask the obvious question.", cn: "晚了两周，我想在您问那个显然的问题之前先说原因。" },
            { who: "总监", en: "Go on.", cn: "说。" },
            { who: "经理", en: "We spent nine days on the data migration because the vendor's export was wrong. That time is spent, not recoverable.", cn: "我们在数据迁移上花了九天，因为供应商的导出是错的。那段时间已经花掉，追不回来。" },
            { who: "总监", en: "Could you have seen it earlier?", cn: "能更早发现吗？" },
            { who: "经理", en: "Yes, by testing the export on day one instead of day four. That one is mine.", cn: "能，第一天就测导出数据，而不是第四天。这是我的失误。" },
            { who: "总监", en: "Then what do you need?", cn: "那你需要什么？" },
            { who: "经理", en: "One of two things: either the date moves to the twenty-fourth, or we drop the reporting module.", cn: "两件事选一件：要么日期改到二十四号，要么砍掉报表模块。" },
            { who: "总监", en: "Which would you choose?", cn: "你选哪个？" },
            { who: "经理", en: "Drop the module. It is the only part nobody has asked for.", cn: "砍模块。那是唯一没人要求过的部分。" },
            { who: "总监", en: "Then drop it, and tell the client today rather than on the twenty-fourth.", cn: "那就砍掉，今天告诉客户，不要等到二十四号。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "员工 · 主管",
          register: "半正式",
          channel: "面对面（一对一）",
          barrier: "主管要求周五交完整成品，时间上做不到",
          result: "折中（周五交三个可用页面，其余两周后交）",
          lines: [
            { who: "主管", en: "The client wants it on Friday.", cn: "客户要周五交。" },
            { who: "员工", en: "Friday isn't possible. I get the data on Thursday, and that is if the vendor is on time, which they aren't.", cn: "周五不可能。我周四才拿到数据，前提是供应商准时，但他们不准时。" },
            { who: "主管", en: "Then make it possible.", cn: "那就让它可能。" },
            { who: "员工", en: "I can make part of it possible, and I would rather offer you that than say yes and miss it.", cn: "我可以让一部分成为可能。我宁愿给你这个方案，也不想答应了再做不出来。" },
            { who: "主管", en: "Which part?", cn: "哪部分？" },
            { who: "员工", en: "The three screens that carry the workflow. Rough, no polish, working by Friday.", cn: "承载流程的那三个页面。粗糙、不美化，周五能用。" },
            { who: "主管", en: "And the rest?", cn: "其余的呢？" },
            { who: "员工", en: "Two weeks later, properly tested. If I promise all of it on Friday, you get all of it broken.", cn: "两周后，测试完整。如果我答应周五全交，你拿到的会是一堆坏掉的东西。" },
            { who: "主管", en: "...I'll tell the client six screens by Friday and the rest in a fortnight.", cn: "……那我告诉客户周五交六个页面，其余两周后。" },
            { who: "员工", en: "Say three screens. Then Friday looks like a win rather than a shortfall.", cn: "说三个页面。这样周五就是超额，而不是缺斤少两。" },
            { who: "主管", en: "Three screens. I'll send it now.", cn: "三个页面。我这就发。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "员工 · 主管",
          register: "半正式",
          channel: "面对面",
          barrier: "「基本完成」被主管听成「已经完成」",
          result: "修复（改用百分比 + 预计完成日期两个数字）",
          lines: [
            { who: "主管", en: "You told me last week it was basically done.", cn: "你上周跟我说基本完成了。" },
            { who: "员工", en: "I said the build was basically done. The testing hasn't started.", cn: "我说的是构建基本完成。测试还没开始。" },
            { who: "主管", en: "Those are the same sentence to me.", cn: "对我来说这是同一句话。" },
            { who: "员工", en: "Then that is the problem, and it is mine as much as yours.", cn: "那这就是问题所在，责任我和你一样大。" },
            { who: "主管", en: "Meaning?", cn: "什么意思？" },
            { who: "员工", en: "I'll stop using words like basically and give two numbers: percent complete, and the date I expect to finish.", cn: "我以后不再用『基本』这类词，改给两个数字：完成百分比和预计完成日期。" },
            { who: "主管", en: "Give me this week in that format.", cn: "这周就用这个格式给我。" },
            { who: "员工", en: "Build ninety-four percent, testing zero, data dependent on Thursday, so the finish date is the twenty-second.", cn: "构建百分之九十四，测试百分之零，数据周四到位，所以完成日期是二十二号。" },
            { who: "主管", en: "Now I know what to tell the client.", cn: "现在我知道该跟客户说什么了。" },
            { who: "员工", en: "That is why I'm changing it. Not to protect myself.", cn: "所以我改这个，不是为了自保。" },
            { who: "主管", en: "I believe you. Send it every Friday in that format.", cn: "我信。以后每周五都按这个格式发。" }
          ]
        },
        {
          variant: "情绪型（方案被否后说重话）",
          relation: "员工 · 主管",
          register: "半正式（情绪化）",
          channel: "面对面（一对一）",
          barrier: "方案被否，情绪上头说了重话",
          result: "达成（收回重话，改成先做两天复盘）",
          lines: [
            { who: "员工", en: "So we're doing it the way that failed last year.", cn: "所以我们要按去年失败的那个做法来。" },
            { who: "主管", en: "That's a bit much.", cn: "这话有点过了。" },
            { who: "员工", en: "Sorry. That came out as an attack and it wasn't meant to be one.", cn: "抱歉。这句听起来像攻击，但我不是这个意思。" },
            { who: "主管", en: "Then say the version you meant.", cn: "那就说你原本想说的版本。" },
            { who: "员工", en: "I'm worried we're repeating a decision that cost us a quarter, and I don't think we have ever looked at why it failed.", cn: "我担心我们在重复一个害我们损失一个季度的决定，而且我不认为我们看过它为什么失败。" },
            { who: "主管", en: "That is a different sentence and I can answer it: we haven't looked at it.", cn: "这是另一句话，而且我答得上：我们确实没看过。" },
            { who: "员工", en: "May I spend two days on the post-mortem before we commit?", cn: "在定下来之前，我能花两天做复盘吗？" },
            { who: "主管", en: "Two days is cheap against a quarter. Do it.", cn: "相对一个季度，两天很便宜。做吧。" },
            { who: "员工", en: "And if it says the same as last time?", cn: "如果结论和上次一样呢？" },
            { who: "主管", en: "Then I'll change my mind in front of everyone, which is also cheap.", cn: "那我就当着大家改主意，这也很便宜。" }
          ]
        },
        {
          variant: "渠道变体（书面周报 + 短会）",
          relation: "员工 · 主管（异步）",
          register: "中性",
          channel: "书面周报 + 短会",
          barrier: "周报写得太细没人读，风险藏在第四节",
          result: "达成（改成顶部三行摘要 + 红黄绿）",
          lines: [
            { who: "主管", en: "I read your report. It took nine minutes and I still had to ask you where the risk was.", cn: "我读了你的报告。花了九分钟，而且我还得追着问你风险在哪。" },
            { who: "员工", en: "It's all in there. Section four.", cn: "都在里面。第四节。" },
            { who: "主管", en: "Which is why nobody reads it. Put the bad news first.", cn: "所以没人读。把坏消息放最前面。" },
            { who: "员工", en: "Then it looks like a disaster every week.", cn: "那每周看起来都像灾难。" },
            { who: "主管", en: "Then colour-code it. Green, amber, red, and the reader knows in two seconds.", cn: "那就标颜色。绿、黄、红，读者两秒就知道。" },
            { who: "员工", en: "Three lines at the top, then the detail?", cn: "开头三行摘要，然后细节？" },
            { who: "主管", en: "Three lines, one colour, then detail for anyone who wants it.", cn: "三行、一个颜色，然后给想看的人看细节。" },
            { who: "员工", en: "This week would be amber.", cn: "这周会是黄色。" },
            { who: "主管", en: "Why amber?", cn: "为什么是黄？" },
            { who: "员工", en: "One dependency slips on Thursday and it costs us three days. Everything else is green.", cn: "有个依赖周四会滑，代价是三天。其他都是绿的。" },
            { who: "主管", en: "That is the entire report. Send it like that from now on.", cn: "整份报告就这些。以后就这么发。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "项目经理 · 指导委员会",
          register: "正式",
          channel: "面对面（委员会汇报）",
          barrier: "无（但需正式、准确、不掩饰风险）",
          result: "达成（委员会批准缩减范围，附客户书面确认）",
          lines: [
            { who: "主席", en: "The committee has your written report. Would you summarise the position?", cn: "委员会已收到你的书面报告。请概述现状。" },
            { who: "经理", en: "I shall. The project is eleven days behind schedule and within budget.", cn: "好的。项目进度晚十一天，预算未超。" },
            { who: "委员", en: "Eleven days is not what your last report suggested.", cn: "十一天与上次报告的显示不符。" },
            { who: "经理", en: "The last report did not include the vendor's revised lead times, which I received on the sixth and circulated on the seventh.", cn: "上次报告未包含供应商修订后的交付周期，我六号收到，七号传阅。" },
            { who: "委员", en: "And the mitigation?", cn: "缓解措施呢？" },
            { who: "经理", en: "Two options: the date moves to the twenty-fourth, or we reduce scope by one module. I recommend the second.", cn: "两个方案：日期改到二十四号，或削减一个模块的范围。我建议第二个。" },
            { who: "主席", en: "What does the client say?", cn: "客户怎么说？" },
            { who: "经理", en: "They were told today, before this meeting, so that they do not hear it first from the minutes.", cn: "今天已经告知他们，就在本次会议之前，以免他们先从纪要里看到。" },
            { who: "主席", en: "That was the right order. Does the committee approve the reduction in scope?", cn: "这个顺序是对的。委员会是否批准缩减范围？" },
            { who: "委员", en: "Approved, on condition that the client confirms in writing this week.", cn: "批准，条件是客户本周书面确认。" },
            { who: "经理", en: "I shall obtain that by Friday.", cn: "我周五前拿到。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "同事",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Rob", en: "did you tell him", cn: "你跟他说了吗" },
            { who: "Sam", en: "not yet", cn: "还没" },
            { who: "Rob", en: "you said you would", cn: "你说过你要说" },
            { who: "Sam", en: "i know. he's in a mood", cn: "我知道。他心情不好" },
            { who: "Rob", en: "he's always in a mood", cn: "他心情从来就没好过" },
            { who: "Sam", en: "fair", cn: "有道理" },
            { who: "Rob", en: "say it with numbers. he can't argue with numbers", cn: "用数字说。他没法跟数字争" },
            { who: "Sam", en: "the number is three weeks", cn: "数字是三周" },
            { who: "Rob", en: "then say three weeks", cn: "那就说三周" },
            { who: "Sam", en: "he'll say no", cn: "他会说不" },
            { who: "Rob", en: "then he's said no to three weeks. that's still information", cn: "那他就是对三周说了不。那也是信息" },
            { who: "Sam", en: "ok. sending it", cn: "行。我发了" }
          ]
        }
      ]
    },

    /* ==================== 06-05 电话会议与远程沟通 ==================== */
    {
      id: "s06-05",
      domain: "06",
      title: "电话会议与远程沟通",
      ielts: "口语 P3 工作 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "同事 · 同事（周会）",
          register: "中性",
          channel: "电话会议（两人）",
          barrier: "无",
          result: "达成（两项议题十一分钟走完，分工明确）",
          lines: [
            { who: "Priya", en: "Can you hear me?", cn: "能听到我吗？" },
            { who: "Rob", en: "Loud and clear. Two items, right?", cn: "很清楚。两项，对吧？" },
            { who: "Priya", en: "Two. First, the migration date.", cn: "两项。第一，迁移日期。" },
            { who: "Rob", en: "I'd move it a week. The data won't be clean before then, and I'd rather do it once.", cn: "我会往后挪一周。数据在那之前干净不了，我宁愿只做一次。" },
            { who: "Priya", en: "Then it's the twenty-fourth. Second: who tells the client?", cn: "那就二十四号。第二：谁去告诉客户？" },
            { who: "Rob", en: "You, because you're better at it and I'd sound like an excuse.", cn: "你去，因为你更会讲，我说起来像找借口。" },
            { who: "Priya", en: "I'll do it if you write the two lines explaining why.", cn: "我可以去，但你得写两句解释原因的话。" },
            { who: "Rob", en: "Two lines by tonight.", cn: "今晚两句。" },
            { who: "Priya", en: "Then we're done in eleven minutes, which is a record.", cn: "那我们十一分钟就开完了，破纪录。" },
            { who: "Rob", en: "We should do this every week.", cn: "我们该每周都这样。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "员工 · 海外高管（电话）",
          register: "半正式",
          channel: "电话会议",
          barrier: "无",
          result: "达成（先认自己的那部分，拿到高管出面的一句话）",
          lines: [
            { who: "高管", en: "I have fifteen minutes. Start with the number I don't want to hear.", cn: "我有十五分钟。先说那个我不想听的数字。" },
            { who: "员工", en: "We're nine days late on the second release.", cn: "第二个版本晚了九天。" },
            { who: "高管", en: "Why?", cn: "为什么？" },
            { who: "员工", en: "One dependency we don't control, and one we do. I'd like to talk about the second one first.", cn: "一个依赖我们控制不了，一个能控制。我想先说能控制的那个。" },
            { who: "高管", en: "Go on.", cn: "说。" },
            { who: "员工", en: "We tested it four days later than we should have. That one is ours, and I've changed the checklist so it can't happen again.", cn: "我们比应该的时间晚了四天才测。这是我们的问题，我已经改了检查清单，不会再发生。" },
            { who: "高管", en: "Send me the checklist.", cn: "把清单发我。" },
            { who: "员工", en: "It's in your inbox already, with the changes highlighted.", cn: "已经在您邮箱里了，改动的地方标出来了。" },
            { who: "高管", en: "Then the nine days is an annoyance, not a problem. What do you need from me?", cn: "那这九天是件烦人事，不是问题。你需要我做什么？" },
            { who: "员工", en: "One sentence to the client that the date moved, from you rather than from us.", cn: "给客户一句话说明日期变了，由您说，不是我们说。" },
            { who: "高管", en: "I'll send it before the end of my day.", cn: "我下班前发。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "员工 · 项目经理（跨时区）",
          register: "中性",
          channel: "电话会议",
          barrier: "对方要求你长期固定在凌晨六点开会",
          result: "折中（时差轮换 + 三十分钟 + 录音）",
          lines: [
            { who: "经理", en: "So the standing call is Tuesdays at six a.m. your time.", cn: "那固定会议是每周二你那边早上六点。" },
            { who: "员工", en: "That's a hard no long term. Not the call, the hour.", cn: "长期这样肯定不行。不是会议，是时间。" },
            { who: "经理", en: "Someone has to take the bad slot.", cn: "总得有人占那个糟糕的时段。" },
            { who: "员工", en: "Agreed, so let's rotate it. Six a.m. for me this month, then six a.m. for Berlin next month.", cn: "同意，所以轮着来。这个月我这边六点，下个月柏林那边六点。" },
            { who: "经理", en: "Berlin won't like that.", cn: "柏林不会喜欢。" },
            { who: "员工", en: "Neither do I, which is the point. Two more things while we're here.", cn: "我也不喜欢，这就是重点。趁现在再说两件。" },
            { who: "经理", en: "Go on.", cn: "说。" },
            { who: "员工", en: "Thirty minutes rather than an hour, with the agenda sent the day before. And a recording, so people who can't attend aren't guessing.", cn: "三十分钟而不是一小时，议程提前一天发。还要录音，让来不了的人不用靠猜。" },
            { who: "经理", en: "The recording has to stop before the confidential item.", cn: "录音要在保密议题前停掉。" },
            { who: "员工", en: "Then it stops there. Rotating, thirty minutes, recorded, and I'll write it up this week.", cn: "那就停在那儿。轮换、三十分钟、录音，我这周写下来。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "同事 · 同事（电话）",
          register: "中性",
          channel: "电话会议",
          barrier: "把 fifteen 听成 fifty，差点按错误数量下单",
          result: "修复（数字当场复述 + 重要事项一律书面）",
          lines: [
            { who: "员工", en: "So we order fifteen units.", cn: "那我们订十五台。" },
            { who: "同事", en: "Fifty. I said fifty.", cn: "五十。我说的是五十。" },
            { who: "员工", en: "I heard fifteen. That's a difference of thirty-five thousand.", cn: "我听成十五。这差三万五。" },
            { who: "同事", en: "Good thing you read it back.", cn: "幸好你复述了一遍。" },
            { who: "员工", en: "I didn't, actually. I caught it when I wrote the email.", cn: "其实我没有。是我写邮件的时候发现的。" },
            { who: "同事", en: "Then let's fix that now. From today, any number on a call gets repeated back before we move on.", cn: "那我们现在就改。从今天起，电话里的任何数字都要复述一遍再往下走。" },
            { who: "员工", en: "Fifty units, confirmed.", cn: "五十台，确认。" },
            { who: "同事", en: "Fifty, correct.", cn: "五十，正确。" },
            { who: "员工", en: "And I'll put it in the email anyway, because a call is a bad place for numbers.", cn: "我还是会写进邮件，因为电话不是放数字的地方。" },
            { who: "同事", en: "Everything important goes in writing. That's the rule from now on.", cn: "重要的事都落在书面上。以后就这条规矩。" }
          ]
        },
        {
          variant: "情绪型（远程被忽略）",
          relation: "远程员工 · 主管",
          register: "半正式（情绪化）",
          channel: "电话会议（一对一）",
          barrier: "远程员工总是最后一个知道影响自己工作的决定",
          result: "达成（主管承诺当天告知 + 公布前十五分钟预告）",
          lines: [
            { who: "员工", en: "May I raise something that isn't on the agenda?", cn: "我能说点议程以外的事吗？" },
            { who: "主管", en: "Of course.", cn: "当然。" },
            { who: "员工", en: "I found out about the reorganisation from the minutes. That's the fourth time this quarter.", cn: "我是从会议纪要里知道重组的。这是这个季度第四次了。" },
            { who: "主管", en: "I didn't realise it was four.", cn: "我没意识到有四次。" },
            { who: "员工", en: "It's four. And I'm not asking to be in every room; I'm asking not to be the last to know about work I have to do.", cn: "是四次。我不是要求进每个房间，我只是不想在必须做的事上最后一个知道。" },
            { who: "主管", en: "That is a fair line and I have crossed it. What would fix it?", cn: "这条线划得合理，而我越线了。怎么改？" },
            { who: "员工", en: "Two things: decisions that affect my work reach me the same day, and I get fifteen minutes before anything is announced.", cn: "两件事：影响我工作的决定当天告诉我；事情公布之前给我十五分钟。" },
            { who: "主管", en: "Same day, and fifteen minutes' warning. I can do both.", cn: "当天，加提前十五分钟。两件我都能做到。" },
            { who: "员工", en: "Then I'll stop keeping score.", cn: "那我就不再数次数了。" },
            { who: "主管", en: "Keep score for another month, quietly. If I slip, I want to know.", cn: "你再悄悄数一个月。要是我又犯了，我要知道。" }
          ]
        },
        {
          variant: "渠道变体（全远程 / 异步）",
          relation: "跨时区团队 · 团队负责人",
          register: "中性",
          channel: "异步（文字 + 短会）",
          barrier: "时差导致响应慢，电话会变成单向念状态",
          result: "达成（状态改成必读文档，会议只谈卡住的事）",
          lines: [
            { who: "负责人", en: "Half of you were asleep for that call. Let's fix the format.", cn: "那通电话会一半人在睡觉。我们来改形式。" },
            { who: "Kim", en: "The call was a status update read aloud. That could have been a document.", cn: "那通会就是把状态更新念了一遍。那本可以是一份文档。" },
            { who: "负责人", en: "Then it becomes a document. Who writes it?", cn: "那就变成文档。谁写？" },
            { who: "Kim", en: "Rotate. But written by the end of your own day, so nobody waits a full cycle.", cn: "轮着写。但要按各自的当地下班时间写完，这样没人要多等一整个周期。" },
            { who: "Rob", en: "And the questions?", cn: "那问题呢？" },
            { who: "Kim", en: "In the thread. Anything unanswered within twenty-four hours becomes an agenda item.", cn: "在帖子里问。二十四小时内没答复的就变成议题。" },
            { who: "负责人", en: "So the weekly call is only for the things that are stuck.", cn: "那每周的电话会只处理卡住的事。" },
            { who: "Kim", en: "Thirty minutes, stuck items only, and optional if you have read the document.", cn: "三十分钟，只谈卡住的；读过文档的人可以不来。" },
            { who: "负责人", en: "Optional worries me.", cn: "可以不来这点让我担心。" },
            { who: "Kim", en: "Then make the document mandatory and the meeting optional. You'll get better attendance at both.", cn: "那就把文档定为必读、会议定为可选。两边出勤都会变好。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "项目负责人 · 客户（正式电话会）",
          register: "正式",
          channel: "电话会议",
          barrier: "无（但需正式开场、按议程推进并留书面记录）",
          result: "达成（日期先定，模块提交董事会，约定书面纪要）",
          lines: [
            { who: "负责人", en: "Good morning. Present on our side are myself, Ms Fenn and Mr Okafor. May I confirm who is with you?", cn: "早上好。我方出席的是我、Fenn 女士和 Okafor 先生。请问您那边是谁？" },
            { who: "客户", en: "Our director and I. He has twenty minutes.", cn: "我们总监和我。他有二十分钟。" },
            { who: "负责人", en: "Then I shall take the two decisions first and the detail afterwards. Item one concerns the delivery date.", cn: "那我先讲两项决定，再说细节。第一项关于交付日期。" },
            { who: "客户", en: "Go ahead.", cn: "请。" },
            { who: "负责人", en: "We propose the twenty-fourth, with a reduction of one module, and we would prefer to agree both today.", cn: "我们提议二十四号交付，并削减一个模块，希望今天两项都定下来。" },
            { who: "客户", en: "The date is acceptable. The module is not our decision alone.", cn: "日期可以接受。模块不是我们一方能定的。" },
            { who: "负责人", en: "Understood. May we proceed on the date and take the module to your board, with our note attached?", cn: "明白。那我们能否先把日期定下，模块连我们的说明一起提交贵方董事会？" },
            { who: "客户", en: "That is the correct order. Send the note today.", cn: "这个顺序是对的。说明今天发过来。" },
            { who: "负责人", en: "I shall send it within the hour, together with a written record of this call.", cn: "我一小时内发过去，并附本次通话的书面记录。" },
            { who: "客户", en: "Thank you. That concludes our items.", cn: "谢谢。我们这边没有别的了。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "同事",
          register: "随意（极简、俚语）",
          channel: "电话（两人）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Rob", en: "you free", cn: "你有空吗" },
            { who: "Sam", en: "for what", cn: "干什么" },
            { who: "Rob", en: "two minutes", cn: "两分钟" },
            { who: "Sam", en: "that's what you said last time", cn: "上次你也这么说" },
            { who: "Rob", en: "this time it's true", cn: "这次是真的" },
            { who: "Sam", en: "go", cn: "说" },
            { who: "Rob", en: "can you take the client call thursday", cn: "周四的客户电话你能接吗" },
            { who: "Sam", en: "why", cn: "为什么" },
            { who: "Rob", en: "i'll be on a train", cn: "我在火车上" },
            { who: "Sam", en: "trains have phones", cn: "火车上有电话" },
            { who: "Rob", en: "trains don't have my laptop", cn: "火车上没有我的电脑" },
            { who: "Sam", en: "fine. you owe me", cn: "行。你欠我的" },
            { who: "Rob", en: "i owe you", cn: "我欠你的" }
          ]
        }
      ]
    },

    /* ==================== 06-06 谈判报价与客户投诉处理 ==================== */
    {
      id: "s06-06",
      domain: "06",
      title: "谈判报价与客户投诉处理",
      ielts: "口语 P3 工作 / 听力 S3",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "采购方 · 供应商",
          register: "半正式",
          channel: "面对面（谈判）",
          barrier: "无",
          result: "达成（三年合同换六个点折扣 + 十八个月后重议数量）",
          lines: [
            { who: "采购", en: "Your quote is twelve percent above last year's.", cn: "你们的报价比去年高百分之十二。" },
            { who: "供应商", en: "Our costs are up nine. That is most of it.", cn: "我们的成本涨了九个点。大部分在这儿。" },
            { who: "采购", en: "I can accept that. What I can't accept is the same price for a one-year and a three-year commitment.", cn: "这我能接受。我不能接受的是：一年期和三年期一个价。" },
            { who: "供应商", en: "What are you proposing?", cn: "你想怎么谈？" },
            { who: "采购", en: "Three years, fixed volume, and we carry the delivery risk. In exchange, eight percent off the list.", cn: "三年、固定量、交付风险我们承担。交换条件是按价目表减八个点。" },
            { who: "供应商", en: "Eight is more than I can sign.", cn: "八个点超出我能签的范围。" },
            { who: "采购", en: "Then tell me what you can sign, and I'll tell you today whether it is enough.", cn: "那告诉我你能签多少，我今天就告诉你要不要。" },
            { who: "供应商", en: "Five, and a fourth year at the same price.", cn: "五个点，再加第四年同价。" },
            { who: "采购", en: "Six, and the fourth year at the same price.", cn: "六个点，第四年同价。" },
            { who: "供应商", en: "Six, and we review the volume in eighteen months.", cn: "六个点，十八个月后重议数量。" },
            { who: "采购", en: "Agreed. I'll have it drafted this week.", cn: "同意。我这周让人拟合同。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "客服主管 · 愤怒客户",
          register: "半正式偏正式",
          channel: "电话",
          barrier: "无",
          result: "达成（全额退款 + 免两月 + 专属对接，客户暂缓投诉升级）",
          lines: [
            { who: "客户", en: "I have been passed between four people. I want the person who can actually decide.", cn: "我被推给四个人了。我要能真正做决定的人。" },
            { who: "主管", en: "That's me, and I'm sorry it took four. Tell me the problem in your own words.", cn: "就是我，抱歉让您转了四个人。请您用自己的话说一下问题。" },
            { who: "客户", en: "Your system double-charged us for six months, and every month I was told it was fixed.", cn: "你们的系统连续六个月重复收费，每个月我都被告知已经修好了。" },
            { who: "主管", en: "How much in total?", cn: "一共多少钱？" },
            { who: "客户", en: "Eight hundred and forty.", cn: "八百四。" },
            { who: "主管", en: "That will be refunded in full within three working days, and I'll confirm it by email today.", cn: "三个工作日内全额退回，我今天就用邮件确认。" },
            { who: "客户", en: "And the six months of phone calls?", cn: "那六个月的电话呢？" },
            { who: "主管", en: "That I can't refund, but I can do two things: two months free, and from now on you deal with me directly.", cn: "那我没法退，但我能做两件事：免两个月费用，而且以后您直接找我。" },
            { who: "客户", en: "I don't want to deal with anyone else ever again.", cn: "我再也不想跟别人打交道了。" },
            { who: "主管", en: "Then my number is in the email I'm sending in ten minutes.", cn: "那我的号码在十分钟后发的那封邮件里。" },
            { who: "客户", en: "...Fine. Thank you. I'll hold off on the complaint.", cn: "……好。谢谢。我先不提投诉了。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "客服 · 客户",
          register: "半正式",
          channel: "电话",
          barrier: "客户要求全额退款并保留服务，超出客服权限",
          result: "折中（退一半 + 免费三个月 + 具名书面承诺）",
          lines: [
            { who: "客户", en: "I want a full refund and I want to keep the subscription.", cn: "我要全额退款，而且要保留订阅。" },
            { who: "客服", en: "I can do one or the other. I can't do both.", cn: "两件里我能做一件，不能两件都做。" },
            { who: "客户", en: "That's your problem, not mine.", cn: "那是你们的问题，不是我的。" },
            { who: "客服", en: "It is our problem, and I still can't do both. May I offer the closest thing?", cn: "确实是我们的问题，但我还是不能两件都做。我能不能提一个最接近的方案？" },
            { who: "客户", en: "Go on.", cn: "说。" },
            { who: "客服", en: "Half the fee back, the next three months free, and a written commitment that if it happens again you get the whole year.", cn: "退回一半费用，接下来三个月免费，再加一份书面承诺：如果再发生，整年都退。" },
            { who: "客户", en: "Written where? In an email nobody reads?", cn: "写在哪？写在一封没人看的邮件里？" },
            { who: "客服", en: "On the invoice, in the service description, so it follows the account.", cn: "写在发票上、写进服务条款里，这样会跟着这个账户走。" },
            { who: "客户", en: "And who signs it?", cn: "谁签？" },
            { who: "客服", en: "My manager, by name. I'll send it today, and it will be there before you pay anything.", cn: "我经理，具名。我今天就发，会在您付任何费用之前到。" },
            { who: "客户", en: "Then I'll wait for it.", cn: "那我等它。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "销售 · 客户",
          register: "半正式",
          channel: "邮件 + 电话",
          barrier: "报价单没写清是否含安装，双方理解不同",
          result: "修复（含三天安装，总价仍压在客户预算内）",
          lines: [
            { who: "客户", en: "Your quote says fifteen thousand. We assumed installation was included.", cn: "你们的报价是一万五。我们以为包含安装。" },
            { who: "销售", en: "It isn't included. That is on the second page.", cn: "不包含。在第二页。" },
            { who: "客户", en: "Nobody reads page two. We budgeted for one number.", cn: "没人看第二页。我们只按一个数字做的预算。" },
            { who: "销售", en: "That is a fair criticism of our quote, not of your reading. Let me see what I can do.", cn: "这是对我们报价单的合理批评，不是您看漏了。我看看能怎么处理。" },
            { who: "客户", en: "Please do.", cn: "请。" },
            { who: "销售", en: "Installation is four days at two hundred a day, so eight hundred. I can include three of those days and charge for one.", cn: "安装是四天、每天两百，共八百。我可以含三天，只收一天。" },
            { who: "客户", en: "Why not all four?", cn: "为什么不是四天全含？" },
            { who: "销售", en: "Because then I'd have to raise the unit price and you would pay it anyway. This way the total stays inside your budget.", cn: "因为那样我得抬高单价，您最后还是付这笔钱。这样总价还在您预算内。" },
            { who: "客户", en: "That's honest. Send the revised quote today.", cn: "这话实在。今天把修订后的报价发我。" },
            { who: "销售", en: "Today, with a one-line summary at the top so nobody has to read page two.", cn: "今天发，顶部加一行摘要，省得没人看第二页。" }
          ]
        },
        {
          variant: "情绪型（客户开始骂人）",
          relation: "客服 · 客户（情绪激烈）",
          register: "半正式（紧张）",
          channel: "电话",
          barrier: "客户开始人身攻击，谈判濒临破裂",
          result: "达成（划定界限后仍给出上门与换机承诺）",
          lines: [
            { who: "客户", en: "You people are useless. Every one of you.", cn: "你们这些人真没用。你们每一个。" },
            { who: "客服", en: "I'll take the complaint about us seriously. I'd like you to stop there on the personal part.", cn: "关于我们的投诉我会认真处理。针对个人的那部分，希望您到此为止。" },
            { who: "客户", en: "So now I can't even be angry.", cn: "所以我现在连生气都不行了。" },
            { who: "客服", en: "You can be as angry as you like about the service. It's the words about me I'm asking you to drop.", cn: "对服务您想多生气都行。我请您收回的是针对我个人的那些话。" },
            { who: "客户", en: "...Fine. It's the service I'm angry about.", cn: "……行。我气的是服务。" },
            { who: "客服", en: "Then let's stay on that, because I can fix that and I can't fix the rest.", cn: "那我们就谈这个，因为这个我能解决，其余的解决不了。" },
            { who: "客户", en: "It has failed three times.", cn: "它坏了三次。" },
            { who: "客服", en: "Three times in five weeks. I'll put an engineer on site on Thursday and I'll call you myself on Friday morning.", cn: "五周内三次。我周四派工程师上门，周五早上我亲自给您打电话。" },
            { who: "客户", en: "And if it fails again?", cn: "要是又坏了呢？" },
            { who: "客服", en: "Then we replace the unit rather than repair it. That is within my authority and I'll put it in writing.", cn: "那我们就换机，而不是修。这在我的权限内，我会写成书面。" },
            { who: "客户", en: "...All right. Thursday, then.", cn: "……好吧。那就周四。" }
          ]
        },
        {
          variant: "渠道变体（多方评标）",
          relation: "供应商代表 · 采购评审组",
          register: "半正式",
          channel: "面对面（评标会）",
          barrier: "评审组压价并要求加条款，时间只有两分钟",
          result: "达成（守住单价，用服务与罚则条款交换）",
          lines: [
            { who: "评审", en: "Your price is the highest of the three. Justify it in two minutes.", cn: "你们的报价是三家里最高的。用两分钟说明理由。" },
            { who: "代表", en: "Two minutes: we are the only bidder who has run this at your volume, and the only one quoting a fixed price for three years.", cn: "两分钟：我们是唯一按你们的量级做过这件事的投标方，也是唯一给出三年固定价的。" },
            { who: "评审", en: "A fixed price means you carry the cost risk, not us. That is why it is high.", cn: "固定价意味着成本风险由你们承担，不是我们。所以它才贵。" },
            { who: "代表", en: "That is exactly right, and it is worth about four percent to you.", cn: "完全正确，而这对你们值大约四个点。" },
            { who: "评审", en: "Can you come down four?", cn: "能降四个点吗？" },
            { who: "代表", en: "No. I can add something worth more than four to you and costing us less.", cn: "不能。我可以加一项对你们价值超过四个点、而我们成本更低的东西。" },
            { who: "评审", en: "Which is?", cn: "是什么？" },
            { who: "代表", en: "A named account manager, quarterly reviews, and a penalty clause if we miss the agreed dates.", cn: "一位具名客户经理、季度复盘，以及如果我们错过约定日期的罚则。" },
            { who: "评审", en: "A penalty clause is unusual from a supplier.", cn: "供应商主动提罚则很少见。" },
            { who: "代表", en: "It is the only honest way to say we are confident. And it is capped at five percent, so it is real but not fatal.", cn: "这是唯一诚实的方式，表明我们有信心。上限百分之五，所以是真的，但不会致命。" },
            { who: "评审", en: "Put that in writing and we'll take it to the panel.", cn: "把这条写进书面，我们提交评审组。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "甲方代表 · 乙方代表",
          register: "正式",
          channel: "面对面（合同谈判）",
          barrier: "无（但需正式措辞并逐条确认）",
          result: "达成（条款对齐，约定十二号签署）",
          lines: [
            { who: "甲方", en: "We have reached clause seven. Would you care to state your position?", cn: "我们到第七条了。请陈述贵方立场。" },
            { who: "乙方", en: "We accept the delivery schedule, and we seek a reciprocal obligation: no unilateral alteration of the specification.", cn: "我们接受交付排期，并希望对等义务：不得单方面修改规格说明。" },
            { who: "甲方", en: "We require the right to alter it where safety demands.", cn: "在安全需要的情况下，我们要求修改权。" },
            { who: "乙方", en: "Then we propose the words where safety demands, with written notice within twenty-four hours.", cn: "那我们建议措辞为：在安全需要时，须在二十四小时内书面通知。" },
            { who: "甲方", en: "That is acceptable to us. Do you require anything further on liability?", cn: "我方可以接受。关于责任条款，贵方还有要求吗？" },
            { who: "乙方", en: "Only that the cap be expressed as a figure rather than as a formula.", cn: "只要求把上限写成一个数字，而不是一个公式。" },
            { who: "甲方", en: "A figure is clearer. Shall we say the contract value?", cn: "数字更清楚。就写合同金额，可以吗？" },
            { who: "乙方", en: "That is more than we had anticipated, and we accept it.", cn: "这超出我们的预期，我们接受。" },
            { who: "甲方", en: "Then the drafting will be amended and circulated tomorrow. Do you propose to sign on the twelfth?", cn: "那明天修订并传阅。贵方是否提议十二号签署？" },
            { who: "乙方", en: "The twelfth is agreeable. We shall have it reviewed before then.", cn: "十二号可以。我们会在那之前完成审阅。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "老客户 · 小供应商",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Sam", en: "your price went up", cn: "你涨价了" },
            { who: "Rob", en: "everything went up", cn: "什么都涨了" },
            { who: "Sam", en: "not by that much", cn: "没涨这么多" },
            { who: "Rob", en: "by about that much, actually", cn: "其实差不多就这么多" },
            { who: "Sam", en: "i'll take double if you hold the price", cn: "我量翻倍，你把价按住" },
            { who: "Rob", en: "how long", cn: "多久" },
            { who: "Sam", en: "a year", cn: "一年" },
            { who: "Rob", en: "a year is a long time", cn: "一年很长" },
            { who: "Sam", en: "six months then", cn: "那就半年" },
            { who: "Rob", en: "six months, old price, double volume", cn: "半年，原价，双倍量" },
            { who: "Sam", en: "deal", cn: "成交" },
            { who: "Rob", en: "and you pay in fourteen days, not thirty", cn: "还有，你十四天付款，不是三十天" },
            { who: "Sam", en: "now you're pushing it", cn: "这就过分了" },
            { who: "Rob", en: "i had to try", cn: "总得试试" }
          ]
        }
      ]
    },

    /* ==================== 06-07 请假调休与绩效反馈 ==================== */
    {
      id: "s06-07",
      domain: "06",
      title: "请假调休与绩效反馈",
      ielts: "口语 P3 工作 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "员工 · 同事",
          register: "随意",
          channel: "面对面",
          barrier: "无",
          result: "达成（同事愿意替班，交接写成一页）",
          lines: [
            { who: "Priya", en: "Are you around next week? I want to book three days off.", cn: "你下周在吗？我想请三天假。" },
            { who: "Rob", en: "Tuesday to Thursday?", cn: "周二到周四？" },
            { who: "Priya", en: "Tuesday to Thursday. I'd need you to take the Thursday client call.", cn: "周二到周四。我需要你接周四那通客户电话。" },
            { who: "Rob", en: "That's the one with the German client.", cn: "就是那个德国客户的。" },
            { who: "Priya", en: "It is. It's forty minutes, and I'll write you a one-page brief on Monday.", cn: "是的。四十分钟，我周一给你写一页要点。" },
            { who: "Rob", en: "Then yes. Does Mark know?", cn: "那可以。Mark 知道了吗？" },
            { who: "Priya", en: "Not yet. I'm telling him today, and I wanted to be able to say it's covered.", cn: "还没有。我今天告诉他，而且我希望说的时候已经有人接了。" },
            { who: "Rob", en: "That's why you asked me first.", cn: "所以你先问我。" },
            { who: "Priya", en: "Obviously.", cn: "当然。" },
            { who: "Rob", en: "Fine. One page, Monday, and no surprises on Thursday.", cn: "行。周一，一页，周四别给我惊喜。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "员工 · 主管",
          register: "半正式",
          channel: "面对面（一对一）",
          barrier: "无",
          result: "达成（两周假获批，交接与替班都写清）",
          lines: [
            { who: "员工", en: "I'd like to book leave for the first two weeks of July.", cn: "我想请七月的头两周假。" },
            { who: "主管", en: "That is the week of the audit.", cn: "那是审计那周。" },
            { who: "员工", en: "It is, and I checked before asking. The audit needs my data, not me; I can have it ready by the thirtieth of June.", cn: "是的，我在开口前查过了。审计要的是我的数据，不是我本人；我六月三十号前能准备好。" },
            { who: "主管", en: "Who answers questions while you're away?", cn: "你不在的时候谁回答问题？" },
            { who: "员工", en: "Priya, and I'll leave a two-page note covering the tricky parts.", cn: "Priya，而且我会留一份两页的说明，写好棘手的地方。" },
            { who: "主管", en: "Two weeks is a long time in July.", cn: "七月两周是挺长。" },
            { who: "员工", en: "It is. If you'd rather I split it, I'd take the first week in July and the second in September.", cn: "是。如果您希望我拆开，我可以七月第一周、九月第二周。" },
            { who: "主管", en: "Take the two weeks. I would rather have you back rested than half here.", cn: "就两周吧。我宁愿你休完回来精神好，也不想你半吊子在这儿。" },
            { who: "员工", en: "Thank you. I'll put the note together this week.", cn: "谢谢。我这周把说明写好。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "员工 · 主管",
          register: "半正式",
          channel: "面对面",
          barrier: "请假撞上交付期，第二周不批",
          result: "折中（先批第一周，补休周提前写进系统）",
          lines: [
            { who: "主管", en: "I can't approve the second week. We ship on the fourteenth.", cn: "第二周我批不了。十四号我们要发布。" },
            { who: "员工", en: "Then I'll take the first week and move the rest.", cn: "那我休第一周，其余挪后。" },
            { who: "主管", en: "That is easier than I expected.", cn: "比我想的容易。" },
            { who: "员工", en: "I'd like something in return, though.", cn: "不过我想要一个交换条件。" },
            { who: "主管", en: "Such as?", cn: "比如？" },
            { who: "员工", en: "The week after the release, in writing, before I agree to the first week.", cn: "发布后的那一周，写下来，在我答应第一周之前。" },
            { who: "主管", en: "You want it in writing now.", cn: "你现在就要书面确认。" },
            { who: "员工", en: "Last time the make-up week became a normal week. I'd rather not repeat it.", cn: "上次那个补休周变成了普通一周。我不想再来一次。" },
            { who: "主管", en: "...Fair. I'll put both weeks in the system today.", cn: "……有道理。我今天把两周都录进系统。" },
            { who: "员工", en: "Then I'm happy with the first week.", cn: "那第一周我没问题。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "员工 · 人力资源",
          register: "半正式",
          channel: "面对面",
          barrier: "以为调休会结转，其实季度末清零，白丢了四天",
          result: "修复（特例追回四天，并设季度提醒）",
          lines: [
            { who: "员工", en: "I had six days of time off in lieu and now there are two.", cn: "我有六天调休，现在只剩两天。" },
            { who: "人事", en: "They expire at the end of the quarter.", cn: "它们在季度末清零。" },
            { who: "员工", en: "Nobody told me that. I thought they carried over like annual leave.", cn: "没人告诉过我。我以为它们像年假一样结转。" },
            { who: "人事", en: "It is on page nine of the handbook, which nobody reads, including me until I started here.", cn: "在手册第九页。没人看，包括我刚来的时候。" },
            { who: "员工", en: "Can I get them back?", cn: "能补回来吗？" },
            { who: "人事", en: "The system has closed the quarter. But I can do two things.", cn: "系统已经关账了。但我能做两件事。" },
            { who: "员工", en: "Go on.", cn: "请说。" },
            { who: "人事", en: "You take the two remaining days this month, and I'll get the four reinstated as an exception, with the reason recorded.", cn: "这个月你把剩下的两天休掉；另外四天我按特例追回，并记录原因。" },
            { who: "员工", en: "What is the reason recorded?", cn: "记录的原因是什么？" },
            { who: "人事", en: "That the policy was not communicated to the team in January. It is honest, and it protects you.", cn: "一月时这条政策没有传达到团队。这是实话，而且能保护你。" },
            { who: "员工", en: "Then thank you. And could a reminder go out at the start of every quarter?", cn: "那谢谢。能不能每季度初发一次提醒？" },
            { who: "人事", en: "I'll set it up today. You're the third person this month.", cn: "我今天就设。这个月你是第三个了。" }
          ]
        },
        {
          variant: "情绪型（反馈只有印象没有例子）",
          relation: "员工 · 主管（绩效面谈）",
          register: "半正式（情绪化）",
          channel: "面对面（绩效面谈）",
          barrier: "反馈只说总体印象，没有具体事例，员工当场难受",
          result: "达成（逼出具体事例，写成一条可执行规则）",
          lines: [
            { who: "主管", en: "Overall it has been a good year, but I have one concern: your communication with stakeholders.", cn: "总体是好的一年，但我有一个担心：你跟相关方的沟通。" },
            { who: "员工", en: "Which stakeholders, and which conversation?", cn: "哪些相关方，哪次沟通？" },
            { who: "主管", en: "It is a general impression.", cn: "是个总体印象。" },
            { who: "员工", en: "Then I can't act on it, and honestly it stings more than a specific example would.", cn: "那我就没法改，而且说实话，这比给个具体例子更让人难受。" },
            { who: "主管", en: "That is a fair reaction.", cn: "这个反应合理。" },
            { who: "员工", en: "Can we look at the last quarter together and find the actual moment?", cn: "我们能一起看上季度，找出具体那一次吗？" },
            { who: "主管", en: "...The April review. You sent the summary to the client before I had seen it.", cn: "……四月的复盘。你在我看过之前就把摘要发给客户了。" },
            { who: "员工", en: "That I can fix. One rule: nothing goes to a client before you have seen it. Is that the whole concern?", cn: "这个我能改。一条规则：你没看过的东西不发客户。这就是全部的担心吗？" },
            { who: "主管", en: "It is the whole concern.", cn: "就是这些。" },
            { who: "员工", en: "Then write it that way and I'll sign it. General impressions I can't sign.", cn: "那就这么写，我签字。总体印象我没法签。" }
          ]
        },
        {
          variant: "渠道变体（远程面谈 + 书面自评）",
          relation: "员工 · 主管（远程面谈）",
          register: "半正式",
          channel: "视频面谈 + 书面评语",
          barrier: "面谈里主管念稿，八个要点四分钟听完，抓不住重点",
          result: "达成（改成提前一天发书面评语，员工带两点异议来谈）",
          lines: [
            { who: "主管", en: "I'll read the summary and then we can discuss it.", cn: "我念一下总结，然后我们讨论。" },
            { who: "员工", en: "May I suggest the other order? If you send it first, I can read it properly and come with questions.", cn: "我能建议反过来吗？如果您先发给我，我能好好读一遍，带着问题来。" },
            { who: "主管", en: "People get upset reading it alone.", cn: "大家一个人读的时候容易上头。" },
            { who: "员工", en: "Some do. I get more upset hearing eight bullet points in four minutes.", cn: "有些人会。我更怕四分钟里听八个要点。" },
            { who: "主管", en: "Then let's try it. I'll send it an hour before, next time.", cn: "那试试。下次我提前一小时发。" },
            { who: "员工", en: "An hour is tight for a year's feedback. A day?", cn: "一年的反馈，一小时有点紧。一天行吗？" },
            { who: "主管", en: "A day, and you write down the two points you disagree with.", cn: "一天，而且你写下你不同意的两点。" },
            { who: "员工", en: "Only two?", cn: "只写两点？" },
            { who: "主管", en: "If you disagree with more than two, the problem is my review, not your year.", cn: "如果你不同意超过两点，那问题在我的评语，不在你这一年。" },
            { who: "员工", en: "I'll take that deal.", cn: "我接受这个约定。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "员工 · 人力资源经理",
          register: "正式",
          channel: "面对面（人事会谈）",
          barrier: "无（但需正式陈述并提供证据）",
          result: "达成（三天直接确认，第四天待书面确认，十日内答复）",
          lines: [
            { who: "人事", en: "You have requested a review of your leave record. Please state the position.", cn: "您要求复核休假记录。请陈述情况。" },
            { who: "员工", en: "I submitted eleven days of time off in lieu between January and March. Four of them are not on the record.", cn: "一月到三月我提交了十一天的调休。其中四天不在记录上。" },
            { who: "人事", en: "Do you have the approvals?", cn: "您有批准记录吗？" },
            { who: "员工", en: "I have emails from my line manager for three of them. The fourth was approved verbally, in a meeting on the ninth of March.", cn: "其中三天我有直属主管的邮件。第四天是口头批准，在三月九日的一次会议上。" },
            { who: "人事", en: "Were the emails sent to your work address or your personal address?", cn: "邮件发到的是工作邮箱还是私人邮箱？" },
            { who: "员工", en: "Work address, and I have printed them.", cn: "工作邮箱，我打印出来了。" },
            { who: "人事", en: "Then three are straightforward. For the fourth, I shall ask your manager to confirm in writing.", cn: "那三天没有问题。第四天我会请您的经理书面确认。" },
            { who: "员工", en: "I should be grateful. May I have the outcome in writing either way?", cn: "我很感激。无论结果如何，可以书面告知我吗？" },
            { who: "人事", en: "You may. The review will be concluded within ten working days.", cn: "可以。复核将在十个工作日内完成。" },
            { who: "员工", en: "Thank you. I have no further points.", cn: "谢谢。我没有别的了。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "同事",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Rob", en: "you off next week", cn: "你下周休吗" },
            { who: "Sam", en: "trying to", cn: "想休" },
            { who: "Rob", en: "he said no", cn: "他说不行？" },
            { who: "Sam", en: "he said maybe", cn: "他说再看看" },
            { who: "Rob", en: "maybe means no", cn: "再看看就是不行" },
            { who: "Sam", en: "i know", cn: "我知道" },
            { who: "Rob", en: "book it in the system then tell him", cn: "先在系统里订，再告诉他" },
            { who: "Sam", en: "that's not how it works", cn: "不是这么运作的" },
            { who: "Rob", en: "it's exactly how it works", cn: "就是这么运作的" },
            { who: "Sam", en: "i'll try it", cn: "我试试" },
            { who: "Rob", en: "tell me what he says", cn: "告诉我他怎么说" },
            { who: "Sam", en: "he said yes", cn: "他说行" },
            { who: "Rob", en: "told you", cn: "我说了吧" }
          ]
        }
      ]
    },

    /* ==================== 01-01 机场值机与行李托运 ==================== */
    {
      id: "s01-01",
      domain: "01",
      title: "机场值机与行李托运",
      ielts: "口语 P2 场景 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "旅客 · 值机柜台",
          register: "中性",
          channel: "面对面（值机柜台）",
          barrier: "无",
          result: "达成（托运完成，换到靠窗座位）",
          lines: [
            { who: "旅客", en: "Hi, checking in for the eleven twenty to Lisbon.", cn: "你好，办十一点二十飞里斯本的登机手续。" },
            { who: "柜台", en: "Passport, please. Any bags to check?", cn: "请给护照。有行李要托运吗？" },
            { who: "旅客", en: "One. It's twenty-one kilos, I weighed it at home.", cn: "一件。二十一公斤，我在家称过。" },
            { who: "柜台", en: "The allowance is twenty-three, so you're fine. Any liquids or batteries in it?", cn: "限额二十三，所以没问题。里面有液体或电池吗？" },
            { who: "旅客", en: "No batteries. There's a bottle of olive oil, sealed.", cn: "没有电池。有一瓶橄榄油，封着的。" },
            { who: "柜台", en: "That's fine in checked baggage. Window or aisle?", cn: "托运没问题。靠窗还是过道？" },
            { who: "旅客", en: "Window, if there is one.", cn: "靠窗，如果有的话。" },
            { who: "柜台", en: "Twelve A. Gate forty-one, boarding at ten fifty.", cn: "12A。四十一号登机口，十点五十开始登机。" },
            { who: "旅客", en: "Is the flight on time?", cn: "航班准点吗？" },
            { who: "柜台", en: "It is, and you have plenty of time. Security is busy this morning, so go straight through.", cn: "准点，而且你时间很充裕。今天早上安检人多，直接过去吧。" },
            { who: "旅客", en: "Thank you.", cn: "谢谢。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "旅客（银卡）· 值班主任",
          register: "半正式",
          channel: "面对面（值机柜台）",
          barrier: "无",
          result: "达成（用「把三公斤挪到随身」免掉超重费，还换到第八排）",
          lines: [
            { who: "旅客", en: "I'm three kilos over on the second bag. Is there any flexibility?", cn: "我第二件行李超了三公斤。有通融余地吗？" },
            { who: "主任", en: "The fee is thirty-five per bag, and the weight limit is the weight limit.", cn: "费用是每件三十五，重量限制就是重量限制。" },
            { who: "旅客", en: "Understood. I have silver status. Does that change anything on this route?", cn: "明白。我有银卡。在这条航线上有区别吗？" },
            { who: "主任", en: "It gives you one extra bag, not extra weight. Which is the problem you have.", cn: "它给你多一件行李，不是多重量。而你的问题是重量。" },
            { who: "旅客", en: "So the answer is the fee.", cn: "所以答案就是付费。" },
            { who: "主任", en: "Unless you move three kilos into your hand luggage. That is free.", cn: "除非你把三公斤挪到手提行李里。那是免费的。" },
            { who: "旅客", en: "My hand luggage is already full.", cn: "我的手提行李已经满了。" },
            { who: "主任", en: "Then wear the jacket and put the books in the pockets. Everybody does it.", cn: "那就把外套穿上，书塞进口袋。大家都这么干。" },
            { who: "旅客", en: "That is... practical. Thank you.", cn: "这……很实际。谢谢。" },
            { who: "主任", en: "I'll also move you to row eight, which has more legroom and no extra charge.", cn: "我再把你调到第八排，腿空间大一些，不加钱。" },
            { who: "旅客", en: "Why row eight?", cn: "为什么是第八排？" },
            { who: "主任", en: "Because you asked politely and didn't argue about the rule.", cn: "因为你问得有礼貌，而且没有为规则跟我吵。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "旅客 · 值机柜台",
          register: "中性",
          channel: "面对面（值机柜台）",
          barrier: "行李超重九公斤，转机只剩九十分钟来不及重装",
          result: "折中（五公斤付费托运，四公斤走快递，柜台帮留行李四十分钟）",
          lines: [
            { who: "柜台", en: "This one is thirty-two kilos. The limit is twenty-three.", cn: "这件三十二公斤。限额是二十三。" },
            { who: "旅客", en: "I know. I was at a wedding and people kept giving me things.", cn: "我知道。我参加了婚礼，大家一直给我东西。" },
            { who: "柜台", en: "Nine kilos over is ninety euros, or you can repack at the table behind you.", cn: "超九公斤是九十欧，或者你可以在后面那张桌子重新打包。" },
            { who: "旅客", en: "My connection is in ninety minutes. Repacking eighteen kilos is not realistic.", cn: "我九十分钟后转机。重新打包十八公斤不现实。" },
            { who: "柜台", en: "Then it's the fee.", cn: "那就付费。" },
            { who: "旅客", en: "Could I split it? Five kilos paid, four kilos posted?", cn: "能拆开吗？五公斤付费，四公斤寄走？" },
            { who: "柜台", en: "We don't post bags, but there is a courier desk in arrivals.", cn: "我们不寄行李，但到达层有个快递柜台。" },
            { who: "旅客", en: "How long does that take?", cn: "那边要多久？" },
            { who: "柜台", en: "Twenty minutes, and it arrives in three days.", cn: "二十分钟，三天到。" },
            { who: "旅客", en: "Then I'll pay for five and courier four. Where is the desk?", cn: "那我付五公斤，寄四公斤。柜台在哪？" },
            { who: "柜台", en: "Through those doors and to the left. I'll hold your bag here for forty minutes.", cn: "穿过那扇门左转。我帮你把行李在这儿留四十分钟。" },
            { who: "旅客", en: "That's more than I expected. Thanks.", cn: "比我预想的周到。谢谢。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "旅客 · 值机柜台",
          register: "中性",
          channel: "面对面（值机柜台）",
          barrier: "机票姓名比护照多一个字母，系统拒绝出票",
          result: "修复（柜台联系航司改名，免收费重出票）",
          lines: [
            { who: "柜台", en: "The system won't accept this. Your ticket says Rahman, your passport says Rahmann.", cn: "系统不接受。机票是 Rahman，护照是 Rahmann。" },
            { who: "旅客", en: "One n. I must have typed it when I booked.", cn: "多了一个 n。我订票的时候打错了。" },
            { who: "柜台", en: "I can't change a name at the desk. It has to come from the airline.", cn: "我在柜台改不了名字。必须由航司改。" },
            { who: "旅客", en: "My flight is in two hours.", cn: "我的航班两小时后起飞。" },
            { who: "柜台", en: "I know. Let me call them. It takes about fifteen minutes.", cn: "我知道。我给他们打电话，大概十五分钟。" },
            { who: "旅客", en: "Will they charge me?", cn: "他们会收费吗？" },
            { who: "柜台", en: "Usually, unless it is a one-letter typo, and this is one letter.", cn: "通常会，除非是一个字母的笔误，而这就是一个字母。" },
            { who: "柜台", en: "They've corrected it and reissued. No charge. Check in again at this desk.", cn: "他们改好了，已经重新出票，没有收费。请在这个柜台再办一次。" },
            { who: "旅客", en: "Thank you. What should I have done?", cn: "谢谢。我本来该怎么做？" },
            { who: "柜台", en: "Checked the spelling the moment you got the confirmation. Everyone reads the date and nobody reads the name.", cn: "收到确认信的时候就核对拼写。所有人都看日期，没人看名字。" }
          ]
        },
        {
          variant: "情绪型（带小孩赶不上）",
          relation: "旅客（带小孩）· 值机柜台",
          register: "中性（焦虑）",
          channel: "面对面（值机柜台）",
          barrier: "时间紧、队伍长、还带着三岁小孩",
          result: "达成（走家庭通道，行李直挂到终点）",
          lines: [
            { who: "旅客", en: "Sorry, we're a bit late. Is there any way to go faster?", cn: "抱歉，我们有点晚了。有办法快一点吗？" },
            { who: "柜台", en: "How late?", cn: "多晚？" },
            { who: "旅客", en: "The board says boarding in twenty-five minutes and there are forty people in that queue.", cn: "牌子上写着二十五分钟后登机，而那队里有四十个人。" },
            { who: "柜台", en: "Two adults and one child?", cn: "两位大人一个孩子？" },
            { who: "旅客", en: "And she is three, so she is not going to run.", cn: "她三岁，跑不起来。" },
            { who: "柜台", en: "Take the family lane on the far left. And I'll tag these two bags through to your final destination.", cn: "走最左边的家庭通道。另外我把这两件行李直挂到你的最终目的地。" },
            { who: "旅客", en: "Through? We have a connection in Madrid.", cn: "直挂？我们在马德里转机。" },
            { who: "柜台", en: "Which is exactly why. Then you don't collect them and check them in again in fifty minutes.", cn: "正因如此。这样你不用在五十分钟里取出来再托运一次。" },
            { who: "旅客", en: "Thank you. I was about to cry in a queue.", cn: "谢谢。我刚才快在队伍里哭出来了。" },
            { who: "柜台", en: "You're not the first this morning. Go now, and don't stop at the shops.", cn: "今天早上你不是第一个。现在就去，别在商店停。" }
          ]
        },
        {
          variant: "渠道变体（自助值机 + App）",
          relation: "旅客 · 自助值机 + 柜台",
          register: "中性",
          channel: "自助值机 + 柜台",
          barrier: "自助机认不出订座编号，白排二十分钟",
          result: "达成（柜台补办并把订座编号和票号的区别讲清）",
          lines: [
            { who: "旅客", en: "The machine says my booking can't be found.", cn: "机器说找不到我的订座。" },
            { who: "柜台", en: "It has been doing that all morning. Give me the reference.", cn: "它一早上都这样。给我订座编号。" },
            { who: "旅客", en: "It's on my phone. Six characters.", cn: "在我手机里。六位。" },
            { who: "柜台", en: "That's the ticket number, not the booking reference. They look the same.", cn: "那是票号，不是订座编号。它们看起来一样。" },
            { who: "旅客", en: "How do I tell them apart?", cn: "怎么区分？" },
            { who: "柜台", en: "The reference has letters. The ticket number is all digits.", cn: "订座编号带字母。票号全是数字。" },
            { who: "旅客", en: "Then here's the one with letters.", cn: "那这个带字母的给你。" },
            { who: "柜台", en: "That's it. You're checked in, seat fourteen C, and your bag is tagged.", cn: "就是这个。办好了，座位 14C，行李也贴好标签了。" },
            { who: "旅客", en: "So the machine failed and I queued for twenty minutes for nothing.", cn: "所以机器坏了，我白排了二十分钟。" },
            { who: "柜台", en: "Not for nothing. The bag still has to go on the belt, and the machine can't do that.", cn: "不算白排。行李还是得上传送带，机器干不了这个。" },
            { who: "旅客", en: "That makes me feel slightly better.", cn: "这话让我好受一点。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "旅客 · 航司服务主管",
          register: "正式",
          channel: "面对面（服务台）",
          barrier: "无（但需正式申请特殊协助并留书面记录）",
          result: "达成（登记轮椅协助与优先登机，书面确认）",
          lines: [
            { who: "旅客", en: "Good morning. I should like to request special assistance for my mother, who is travelling with me.", cn: "早上好。我想为我同行的母亲申请特殊协助。" },
            { who: "主管", en: "Certainly. May I ask what assistance is required?", cn: "当然。请问需要什么协助？" },
            { who: "旅客", en: "A wheelchair from check-in to the gate, and priority boarding so that she does not stand in the queue.", cn: "从值机到登机口的轮椅，以及优先登机，免得她排队站着。" },
            { who: "主管", en: "Is the wheelchair her own, or ours?", cn: "轮椅是她自带的，还是用我们的？" },
            { who: "旅客", en: "Ours, and it will be checked in. She can walk short distances.", cn: "自带的，会托运。她能走短距离。" },
            { who: "主管", en: "Then I shall record it as assistance to the gate rather than to the seat. That avoids any question at the aircraft door.", cn: "那我登记为协助至登机口，而不是至座位。这样在机舱门口不会有争议。" },
            { who: "旅客", en: "That is precisely the distinction I was unsure about. Thank you.", cn: "这正是我拿不准的那个区别。谢谢您。" },
            { who: "主管", en: "It is noted on both bookings. May I ask you to be at the gate forty minutes before departure?", cn: "两个订座上都注明了。请你们在起飞前四十分钟到登机口，可以吗？" },
            { who: "旅客", en: "We shall be there. Could I have that in writing as well?", cn: "我们会到。可以也给我一份书面确认吗？" },
            { who: "主管", en: "I shall email it within the hour.", cn: "我一小时内邮件发给您。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "朋友（同行）",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Sam", en: "where are you", cn: "你在哪" },
            { who: "Rob", en: "queue. the long one", cn: "排队。长的那条" },
            { who: "Sam", en: "there's a short one", cn: "有条短的" },
            { who: "Rob", en: "that's the family one", cn: "那是家庭通道" },
            { who: "Sam", en: "so", cn: "所以呢" },
            { who: "Rob", en: "i don't have a family", cn: "我没有家庭" },
            { who: "Sam", en: "borrow one", cn: "借一个" },
            { who: "Rob", en: "i'm not doing that", cn: "我不干这事" },
            { who: "Sam", en: "i'll see you at the gate", cn: "登机口见" },
            { who: "Rob", en: "get me a coffee", cn: "帮我带杯咖啡" },
            { who: "Sam", en: "gate coffee is robbery", cn: "登机口的咖啡是抢钱" },
            { who: "Rob", en: "get me a coffee", cn: "帮我带杯咖啡" }
          ]
        }
      ]
    },

    /* ==================== 01-02 入境海关与安检 ==================== */
    {
      id: "s01-02",
      domain: "01",
      title: "入境海关与安检",
      ielts: "口语 P2 场景 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "旅客 · 边检官员",
          register: "半正式",
          channel: "面对面（边检柜台）",
          barrier: "无",
          result: "达成（顺利入境）",
          lines: [
            { who: "官员", en: "Passport, please. What is the purpose of your visit?", cn: "请给护照。您此行的目的是什么？" },
            { who: "旅客", en: "Tourism. Ten days.", cn: "旅游。十天。" },
            { who: "官员", en: "Where will you be staying?", cn: "您住在哪里？" },
            { who: "旅客", en: "The first three nights in a hotel in the old town, then with a friend in the north.", cn: "头三晚住老城区的酒店，之后住北边一个朋友家。" },
            { who: "官员", en: "Do you have the booking?", cn: "有预订单吗？" },
            { who: "旅客", en: "Here. And a return ticket for the nineteenth.", cn: "这里。还有十九号的回程票。" },
            { who: "官员", en: "How much cash are you carrying?", cn: "您带了多少现金？" },
            { who: "旅客", en: "About three hundred euros, and a card.", cn: "大约三百欧，还有一张卡。" },
            { who: "官员", en: "Is this your first visit?", cn: "这是您第一次来吗？" },
            { who: "旅客", en: "Second. I came in twenty nineteen as well.", cn: "第二次。二〇一九年也来过。" },
            { who: "官员", en: "Enjoy your stay.", cn: "祝您旅途愉快。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "旅客 · 海关官员",
          register: "半正式偏正式",
          channel: "面对面（海关通道）",
          barrier: "无",
          result: "达成（配合开箱检查后放行）",
          lines: [
            { who: "官员", en: "Please come this way. Is this your bag?", cn: "请到这边来。这是您的包吗？" },
            { who: "旅客", en: "It is.", cn: "是。" },
            { who: "官员", en: "I'm going to open it. Do you have anything to declare?", cn: "我要打开检查。您有需要申报的东西吗？" },
            { who: "旅客", en: "Two bottles of wine and a box of chocolates. Both under the limit.", cn: "两瓶酒和一盒巧克力。都在限额内。" },
            { who: "官员", en: "And this? It's wrapped.", cn: "这个呢？包着的东西。" },
            { who: "旅客", en: "A gift for my host. I can unwrap it if you need me to.", cn: "给主人的礼物。如果需要我可以拆开。" },
            { who: "官员", en: "Please.", cn: "请。" },
            { who: "旅客", en: "It's a coffee grinder. Here's the receipt.", cn: "是个咖啡磨豆机。这是收据。" },
            { who: "官员", en: "Thank you. That's everything. You can close it up.", cn: "谢谢。就这些。您可以合上了。" },
            { who: "旅客", en: "Do I need to do anything else?", cn: "我还需要办什么吗？" },
            { who: "官员", en: "Nothing. The exit is behind you.", cn: "不需要。出口在您后面。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "旅客 · 海关官员",
          register: "半正式",
          channel: "面对面（海关通道）",
          barrier: "酒超出免税额两瓶，要么缴税要么寄存退运",
          result: "折中（当场缴十一欧税放行）",
          lines: [
            { who: "官员", en: "You have four bottles. The allowance is two.", cn: "您有四瓶。限额是两瓶。" },
            { who: "旅客", en: "I didn't know that. What are the options?", cn: "我不知道。有什么选择？" },
            { who: "官员", en: "You pay duty on the excess, or you leave them here and collect them on your way out.", cn: "要么对超出的部分缴税，要么留在这里，出境时再取。" },
            { who: "旅客", en: "How much is the duty?", cn: "税是多少？" },
            { who: "官员", en: "Eleven euros for the two bottles.", cn: "两瓶十一欧。" },
            { who: "旅客", en: "And if I leave them here?", cn: "如果留在这里呢？" },
            { who: "官员", en: "Storage is free for thirty days. But you would be collecting them at the end of a ten-day trip.", cn: "寄存三十天内免费。但您十天行程结束时才回来取。" },
            { who: "旅客", en: "Then I'd be carrying them home anyway. I'll pay the eleven.", cn: "那我反正要带回家。我付十一欧。" },
            { who: "官员", en: "Card or cash?", cn: "刷卡还是现金？" },
            { who: "旅客", en: "Card. And may I have the receipt?", cn: "刷卡。可以给我收据吗？" },
            { who: "官员", en: "It prints automatically. Keep it until you leave.", cn: "会自动打印。留到出境。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "旅客 · 边检官员（口音重）",
          register: "半正式",
          channel: "面对面（边检柜台）",
          barrier: "口音加紧张，连续两次听错问题答非所问",
          result: "修复（请求重复并放慢，答对后放行）",
          lines: [
            { who: "官员", en: "How long do you intend to remain?", cn: "您打算停留多久？" },
            { who: "旅客", en: "Sorry, could you repeat that? I didn't catch the last word.", cn: "抱歉，能重复一下吗？最后一个词我没听清。" },
            { who: "官员", en: "How long. Will you stay.", cn: "多久。您待多久。" },
            { who: "旅客", en: "Ten days. Until the nineteenth.", cn: "十天。到十九号。" },
            { who: "官员", en: "Where are you staying?", cn: "您住在哪儿？" },
            { who: "旅客", en: "Sorry, did you ask where I'm staying or where I'm flying to?", cn: "抱歉，您是问我住哪儿，还是问我飞哪儿？" },
            { who: "官员", en: "Staying.", cn: "住哪儿。" },
            { who: "旅客", en: "A hotel in the old town. I have the booking here if that helps.", cn: "老城区一家酒店。如果需要，预订单在这儿。" },
            { who: "官员", en: "It's fine. Sorry, the accent here is hard. Most people just nod.", cn: "不用。抱歉，这里的口音不好懂。大部分人就直接点头。" },
            { who: "旅客", en: "Nodding would have been worse.", cn: "点头会更糟。" },
            { who: "官员", en: "Much worse. Welcome.", cn: "糟得多。欢迎。" }
          ]
        },
        {
          variant: "情绪型（被抽中二次检查）",
          relation: "旅客 · 边检官员（二次检查）",
          register: "半正式（紧张）",
          channel: "面对面（二次检查室）",
          barrier: "被随机抽中二次检查，紧张到说话前后矛盾",
          result: "达成（先说明自己紧张，冷静重答后放行）",
          lines: [
            { who: "官员", en: "You've been selected for a secondary check. It's routine.", cn: "您被抽中二次检查。这是例行程序。" },
            { who: "旅客", en: "Okay. Sorry, am I in trouble?", cn: "好。抱歉，我是不是有问题？" },
            { who: "官员", en: "No. I'm going to ask the same questions again.", cn: "没有。我会把同样的问题再问一遍。" },
            { who: "旅客", en: "May I say something first? I'm nervous, and when I'm nervous I say things twice and get the dates wrong.", cn: "我能先说一句吗？我紧张，一紧张就会重复说话、还会把日期说错。" },
            { who: "官员", en: "That's fine. Take your time.", cn: "没关系。慢慢来。" },
            { who: "旅客", en: "I arrived this morning. My return is the nineteenth. I'm staying with a friend after Tuesday.", cn: "我今天早上到的。回程是十九号。周二之后住朋友家。" },
            { who: "官员", en: "The same answers as before. Good.", cn: "和刚才答的一样。很好。" },
            { who: "旅客", en: "Is that why people get held up? Because they change their story?", cn: "大家被扣下就是因为这个吗？因为说法变了？" },
            { who: "官员", en: "Usually it is the dates. You would be surprised how many people forget their own.", cn: "通常是日期。忘了自己日期的人多得让你意外。" },
            { who: "旅客", en: "I wrote mine on the back of the ticket. It helped.", cn: "我把我的写在机票背面。管用。" }
          ]
        },
        {
          variant: "渠道变体（自助通关）",
          relation: "旅客 · 边检官员（自助通道）",
          register: "半正式",
          channel: "自助通关 + 人工柜台",
          barrier: "人脸识别连失败三次，自助门不开",
          result: "达成（转人工柜台，查清是换护照导致记录未关联）",
          lines: [
            { who: "旅客", en: "The gate won't open. It's the third time.", cn: "门不开。第三次了。" },
            { who: "官员", en: "Come to the desk. Did you renew your passport recently?", cn: "到柜台来。您最近换过护照吗？" },
            { who: "旅客", en: "Two months ago. Does that matter?", cn: "两个月前。有影响吗？" },
            { who: "官员", en: "It does. The photo on the chip is the new one, but the entry record is the old one.", cn: "有。芯片里的照片是新的，但入境记录是旧的。" },
            { who: "旅客", en: "So the machine is comparing me with a ten-year-old photo.", cn: "所以机器是拿我和十年前的照片比。" },
            { who: "官员", en: "Effectively. I'll do it manually and link the two records.", cn: "可以这么说。我手动办，并把两条记录关联起来。" },
            { who: "旅客", en: "Will it work next time?", cn: "下次能过吗？" },
            { who: "官员", en: "It should, now that they are linked. If it doesn't, use the desk and say the records were merged.", cn: "关联之后应该可以。如果不行，就走柜台，说记录已经合并了。" },
            { who: "旅客", en: "Thank you. The machine gave me no clue at all.", cn: "谢谢。机器什么提示都没有。" },
            { who: "官员", en: "It never does. That is the most common complaint we get.", cn: "从来都没有。这是我们收到最多的抱怨。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "旅客（商务）· 边检官员",
          register: "正式",
          channel: "面对面（边检柜台）",
          barrier: "无（但需正式说明并出示邀请函）",
          result: "达成（按商务登记入境）",
          lines: [
            { who: "官员", en: "What is the purpose of your visit?", cn: "您此行的目的是什么？" },
            { who: "旅客", en: "Business. I am attending a three-day conference at the university and returning on Friday.", cn: "商务。我参加大学里为期三天的会议，周五返回。" },
            { who: "官员", en: "Do you have an invitation or a registration confirmation?", cn: "您有邀请函或注册确认吗？" },
            { who: "旅客", en: "I have both, and a letter from my employer stating that my costs are covered.", cn: "两样都有，还有一封雇主出具的费用承担说明信。" },
            { who: "官员", en: "Will you be receiving any payment from a source in this country?", cn: "您会从本国的任何机构获得报酬吗？" },
            { who: "旅客", en: "No. The honorarium, if there is one, is paid to my institution rather than to me personally.", cn: "不会。如有酬金，也是付给我所在机构，而不是我个人。" },
            { who: "官员", en: "That is the correct arrangement. Are you carrying samples or equipment?", cn: "这个安排是正确的。您携带样品或设备吗？" },
            { who: "旅客", en: "A laptop and a poster tube. Nothing for sale.", cn: "一台笔记本电脑和一个海报筒。没有用于销售的东西。" },
            { who: "官员", en: "Then there is nothing to declare. Your entry is recorded under business.", cn: "那就不需要申报。您的入境按商务登记。" },
            { who: "旅客", en: "Thank you. Should I keep the confirmation with me while I am here?", cn: "谢谢。我在这里期间需要随身带着确认函吗？" },
            { who: "官员", en: "It is advisable. You may be asked on departure.", cn: "建议带着。出境时可能会被问。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "跨境通勤者 · 边检官员（每周往返）",
          register: "随意（极简、俚语）",
          channel: "面对面（陆路口岸）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "官员", en: "Back again.", cn: "又回来了。" },
            { who: "旅客", en: "Monday to Friday, same as always.", cn: "周一到周五，老样子。" },
            { who: "官员", en: "Anything to declare?", cn: "有要申报的吗？" },
            { who: "旅客", en: "Half a kilo of coffee. Same as last week.", cn: "半公斤咖啡。跟上周一样。" },
            { who: "官员", en: "Under the limit.", cn: "在限额内。" },
            { who: "旅客", en: "I know the limit by now.", cn: "我现在知道限额了。" },
            { who: "官员", en: "How's the job?", cn: "工作怎么样？" },
            { who: "旅客", en: "Same as this border. Repetitive.", cn: "跟这个口岸一样。重复。" },
            { who: "官员", en: "Careful.", cn: "说话小心点。" },
            { who: "旅客", en: "Kidding. See you Friday.", cn: "开玩笑。周五见。" },
            { who: "官员", en: "Friday.", cn: "周五见。" }
          ]
        }
      ]
    },

    /* ==================== 01-03 打车与网约车 ==================== */
    {
      id: "s01-03",
      domain: "01",
      title: "打车与网约车",
      ielts: "口语 P2 场景 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "乘客 · 出租车司机",
          register: "中性",
          channel: "面对面（出租车）",
          barrier: "无",
          result: "达成（走环路避开堵车，按表付费）",
          lines: [
            { who: "乘客", en: "Hi, to the central station, please.", cn: "你好，去中央车站。" },
            { who: "司机", en: "Which entrance? There are two.", cn: "哪个入口？有两个。" },
            { who: "乘客", en: "The north side, if that's easier to stop at.", cn: "北边那个，如果那边好停车的话。" },
            { who: "司机", en: "It is. About fifteen minutes at this time.", cn: "好停。这个点大概十五分钟。" },
            { who: "乘客", en: "Could you take the ring road? I'm not in a rush, I just feel sick in stop-start traffic.", cn: "能走环路吗？我不赶时间，就是走走停停会难受。" },
            { who: "司机", en: "Then the ring road. It's a bit longer but it keeps moving.", cn: "那就环路。远一点，但一直在走。" },
            { who: "乘客", en: "Do you take cards?", cn: "能刷卡吗？" },
            { who: "司机", en: "Card and cash. The meter starts at four.", cn: "刷卡现金都行。起步价四块。" },
            { who: "乘客", en: "Is there a surcharge for luggage?", cn: "行李有附加费吗？" },
            { who: "司机", en: "Not for one bag in the boot. Only on the airport run.", cn: "后备箱一件行李不收。只有机场线才收。" },
            { who: "乘客", en: "Good. Station, north side.", cn: "好。车站，北边。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "乘客 · 出租车司机（疑似绕路）",
          register: "中性",
          channel: "面对面（车内）",
          barrier: "无（但要在司机占上风时冷静拿到凭据）",
          result: "达成（司机掉头走近路，乘客照表付费）",
          lines: [
            { who: "乘客", en: "Sorry, this isn't the way I came. Is there a reason?", cn: "抱歉，这不是我来的路。有什么原因吗？" },
            { who: "司机", en: "Traffic on the bridge.", cn: "桥那边堵。" },
            { who: "乘客", en: "The app says the bridge is clear. Could we go back to the other road?", cn: "应用显示桥上是通的。我们能回到刚才那条路吗？" },
            { who: "司机", en: "This is faster, trust me.", cn: "这条路更快，你信我。" },
            { who: "乘客", en: "I'd rather not argue. Two things, and then I'll be quiet.", cn: "我不想争。两件事，然后我就不说话了。" },
            { who: "司机", en: "Go on.", cn: "说。" },
            { who: "乘客", en: "One: I'll pay whatever the meter says, but I'll ask for a receipt with the route on it. Two: if the route is wrong I'll take it up with the company, not with you here.", cn: "一：我按表付钱，但要一张写明路线的发票。二：如果路线有问题，我去找公司，不在这儿跟你说。" },
            { who: "司机", en: "...The bridge is fine, actually. I'll turn around at the lights.", cn: "……桥确实没问题。我在红绿灯那儿掉头。" },
            { who: "乘客", en: "Thank you. That's all I wanted.", cn: "谢谢。我要的就是这个。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "乘客 · 出租车司机（上车前）",
          register: "中性",
          channel: "面对面（路边）",
          barrier: "司机不肯打表，要一口价且明显偏高",
          result: "折中（打表，超过四十按四十付）",
          lines: [
            { who: "司机", en: "To the airport? Fifty.", cn: "去机场？五十。" },
            { who: "乘客", en: "With the meter?", cn: "打表吗？" },
            { who: "司机", en: "No meter. Fifty flat.", cn: "不打表。一口价五十。" },
            { who: "乘客", en: "The app says thirty-five to forty.", cn: "应用显示三十五到四十。" },
            { who: "司机", en: "The app doesn't know the traffic.", cn: "应用不知道路况。" },
            { who: "乘客", en: "Then let's do this: meter on, and if it comes to more than forty I pay the forty.", cn: "那我们这样：打表，如果超过四十，我按四十付。" },
            { who: "司机", en: "That's not how it works.", cn: "不是这么算的。" },
            { who: "乘客", en: "It is if you want the fare. Otherwise I'll walk to the corner and order one.", cn: "如果你想做这单就是这么算。不然我走到路口叫一辆。" },
            { who: "司机", en: "...Get in. Meter.", cn: "……上车。打表。" },
            { who: "乘客", en: "Thank you. And if it's under forty, I pay exactly what it says.", cn: "谢谢。要是不到四十，我按表付。" },
            { who: "司机", en: "It'll be over forty.", cn: "肯定会超四十。" },
            { who: "乘客", en: "Then you'll get your forty.", cn: "那你就拿到四十。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "乘客 · 网约车司机（电话）",
          register: "中性",
          channel: "电话 + 车内",
          barrier: "定位是旧的，司机和乘客在电话里说不清位置",
          result: "修复（改用共享定位 + 地标描述）",
          lines: [
            { who: "司机", en: "I'm at the address but I can't see you.", cn: "我到了地址，但看不到你。" },
            { who: "乘客", en: "I'm outside the pharmacy. There are two on this street.", cn: "我在药店外面。这条街上有两家。" },
            { who: "司机", en: "Which pharmacy?", cn: "哪家药店？" },
            { who: "乘客", en: "The one next to the bank. Sorry, that doesn't help either, there are two banks.", cn: "银行旁边那家。抱歉，这也没用，有两家银行。" },
            { who: "司机", en: "Send me your location.", cn: "把你的定位发我。" },
            { who: "乘客", en: "It says you're two hundred metres away, on the other side.", cn: "上面显示你在两百米外，在另一边。" },
            { who: "司机", en: "That's the old pin. Give me a landmark.", cn: "那是旧的位置。给我个地标。" },
            { who: "乘客", en: "There's a red awning and a bus stop with a number seventeen sign.", cn: "有个红雨棚，还有一个挂着十七路牌子的公交站。" },
            { who: "司机", en: "The seventeen. I can see it. Two minutes.", cn: "十七路。我看见了。两分钟。" },
            { who: "乘客", en: "I'll stand under the awning so you can see me.", cn: "我站到雨棚下面，这样你能看见我。" }
          ]
        },
        {
          variant: "情绪型（司机边抱怨边飙车）",
          relation: "乘客 · 出租车司机（情绪激动）",
          register: "中性（紧张）",
          channel: "面对面（车内）",
          barrier: "司机抱怨生活并越开越快，乘客不安",
          result: "达成（提出减速请求，司机缓和后安全到达）",
          lines: [
            { who: "司机", en: "Twelve hours today. Twelve. And the company takes a third.", cn: "今天十二个小时。十二个。公司还抽三成。" },
            { who: "乘客", en: "That's a long day.", cn: "这一天够长的。" },
            { who: "司机", en: "And then you get people who say the meter is wrong.", cn: "然后还有人说我表不准。" },
            { who: "乘客", en: "I'm not going to say that. But I would like to ask for something.", cn: "我不会那么说。但我想提一件事。" },
            { who: "司机", en: "What?", cn: "什么？" },
            { who: "乘客", en: "Could you slow down a little? We're doing seventy in a fifty, and I've got a child at home.", cn: "能稍微慢一点吗？限速五十我们开到七十了，我家里还有孩子。" },
            { who: "司机", en: "...Sorry. You're right.", cn: "……抱歉。你说得对。" },
            { who: "乘客", en: "No harm done. Twelve hours is too long for anyone to stay sharp.", cn: "没事。十二个小时对谁来说都太长了，反应不可能还敏锐。" },
            { who: "司机", en: "The union has been saying that for two years.", cn: "工会说了两年了。" },
            { who: "乘客", en: "Then it isn't just you.", cn: "那就不是你的问题。" },
            { who: "司机", en: "Two more minutes. I'll take the side road, it's slower.", cn: "再两分钟。我走辅路，慢一些。" }
          ]
        },
        {
          variant: "渠道变体（App 下单 + 客服）",
          relation: "乘客 · 网约车平台客服",
          register: "中性",
          channel: "App + 电话客服",
          barrier: "司机取消订单，却把乘客标记成未上车并扣了等待费",
          result: "达成（客服退费、标记这单、重新叫车）",
          lines: [
            { who: "乘客", en: "The driver cancelled after eleven minutes and I've been charged a wait fee.", cn: "司机在十一分钟后取消了，而我被扣了等待费。" },
            { who: "客服", en: "Let me look. He marked you as a no-show.", cn: "我看一下。他标记您未上车。" },
            { who: "乘客", en: "I was standing at the pin the whole time, and the app has my location.", cn: "我一直站在定位点，而且应用里有我的位置记录。" },
            { who: "客服", en: "It does. That contradicts his note.", cn: "确实有。这和他的记录矛盾。" },
            { who: "乘客", en: "So it's his word against the app's.", cn: "所以是他的说法对应用的数据。" },
            { who: "客服", en: "The app's, in this case. I'm refunding the fee and flagging the trip.", cn: "这次以应用为准。我退还费用，并标记这一单。" },
            { who: "乘客", en: "What does flagging do?", cn: "标记有什么用？" },
            { who: "客服", en: "Three flags and he is reviewed. It isn't instant, and I won't pretend it is.", cn: "三次标记就会有人复核。不是立刻生效，我不假装它是。" },
            { who: "乘客", en: "That's honest. Could you order me another one on the same account?", cn: "这话实在。能用同一个账号帮我再叫一辆吗？" },
            { who: "客服", en: "Done. Same pin, two minutes.", cn: "好了。同一个定位点，两分钟。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "乘客 · 专车司机（预约接送）",
          register: "正式",
          channel: "面对面（专车）",
          barrier: "无（但需正式确认行程与细节）",
          result: "达成（按预约完成整晚接送）",
          lines: [
            { who: "司机", en: "Good evening, madam. I am your driver for the evening. May I confirm the itinerary?", cn: "晚上好，女士。我是您今晚的司机。我确认一下行程，可以吗？" },
            { who: "乘客", en: "Please do.", cn: "请。" },
            { who: "司机", en: "The hotel at seven, the concert hall at half past, and then the restaurant on Rue Clair.", cn: "七点酒店，七点半音乐厅，然后克莱尔街的餐厅。" },
            { who: "乘客", en: "The restaurant booking is at ten, so we have time after the concert.", cn: "餐厅订的是十点，所以音乐会之后有时间。" },
            { who: "司机", en: "In that case I shall wait at the stage door rather than the main entrance, which is quieter.", cn: "那我就在后台出口等，而不是正门，那边安静些。" },
            { who: "乘客", en: "That is thoughtful. Is there water in the car?", cn: "想得周到。车上有水吗？" },
            { who: "司机", en: "There is, and umbrellas. The forecast suggests rain after nine.", cn: "有，还有伞。预报说九点后有雨。" },
            { who: "乘客", en: "Then I shall take the umbrella and leave it in the car for the return.", cn: "那我带上伞，回程时留在车里。" },
            { who: "司机", en: "As you wish. Shall I use the same number for the whole evening?", cn: "随您。整晚都用同一个号码联系您吗？" },
            { who: "乘客", en: "Yes, and please call rather than text. I shan't be looking at the screen.", cn: "是的，而且请打电话，别发短信。我不会看手机。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "乘客 · 出租车司机（短途）",
          register: "随意（极简、俚语）",
          channel: "面对面（车内）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "乘客", en: "corner shop on mill road please", cn: "磨坊路那家便利店，谢谢" },
            { who: "司机", en: "which one", cn: "哪家" },
            { who: "乘客", en: "the one with the yellow sign", cn: "黄招牌那家" },
            { who: "司机", en: "got it", cn: "知道了" },
            { who: "乘客", en: "you can drop me here", cn: "在这儿放我下来就行" },
            { who: "司机", en: "this is the middle of the road", cn: "这是路中间" },
            { who: "乘客", en: "the lights then", cn: "那就红绿灯那儿" },
            { who: "司机", en: "six forty", cn: "六块四" },
            { who: "乘客", en: "card ok", cn: "刷卡行吗" },
            { who: "司机", en: "card's fine", cn: "行" },
            { who: "乘客", en: "cheers", cn: "谢了" }
          ]
        }
      ]
    },

    /* ==================== 01-04 公交地铁购票与问路 ==================== */
    {
      id: "s01-04",
      domain: "01",
      title: "公交地铁购票与问路",
      ielts: "口语 P2 场景 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "旅客 · 地铁站工作人员",
          register: "中性",
          channel: "面对面（地铁站）",
          barrier: "无",
          result: "达成（买对票并问清换乘与末班车）",
          lines: [
            { who: "旅客", en: "Hi, I need to get to the university. What's the best ticket?", cn: "你好，我要去大学。买什么票最合适？" },
            { who: "工作人员", en: "A single, or a day pass if you're coming back.", cn: "单程票；如果还要回来，就买日票。" },
            { who: "旅客", en: "I'll be back this evening. Is the day pass cheaper?", cn: "我今晚要回来。日票更便宜吗？" },
            { who: "工作人员", en: "Day pass is seven; two singles are five eighty. So no.", cn: "日票七块，两张单程五块八。所以不划算。" },
            { who: "旅客", en: "Then two singles. Which line?", cn: "那就两张单程。坐哪条线？" },
            { who: "工作人员", en: "Blue to Central, then change to the green line, three stops.", cn: "蓝线到中央站，换绿线，坐三站。" },
            { who: "旅客", en: "Do I need to exit to change?", cn: "换乘要出站吗？" },
            { who: "工作人员", en: "No, it's the same station. Follow the signs up one level.", cn: "不用，同一站。跟着指示牌上一层。" },
            { who: "旅客", en: "And the last train back?", cn: "回来的末班车几点？" },
            { who: "工作人员", en: "Twenty-three forty. If you miss it, there's a night bus from the square.", cn: "二十三点四十。要是错过了，广场有夜班车。" },
            { who: "旅客", en: "Two singles, then. Card or cash?", cn: "那就两张单程。刷卡还是现金？" },
            { who: "工作人员", en: "Both, but the machine only takes coins after eight.", cn: "都行，但八点以后机器只收硬币。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "乘客 · 查票员",
          register: "半正式",
          channel: "面对面（车厢内）",
          barrier: "无（但票确实没打，要冷静据实说明）",
          result: "达成（只补车费，免罚款）",
          lines: [
            { who: "查票员", en: "Tickets, please. ...This one wasn't validated.", cn: "请出示车票。……这张没有打票。" },
            { who: "乘客", en: "I didn't know I had to. The machine at the entrance was out of order.", cn: "我不知道要打票。入口那台机器坏了。" },
            { who: "查票员", en: "The fine is forty. Or you can explain it at the office.", cn: "罚款四十。或者你可以到办公室说明。" },
            { who: "乘客", en: "I'd rather explain. Where is the office?", cn: "我更愿意说明。办公室在哪里？" },
            { who: "查票员", en: "Two stops back. But you'll miss your connection.", cn: "往回两站。但你会错过换乘。" },
            { who: "乘客", en: "Then may I ask you something instead: is there a record of a broken validator this morning?", cn: "那我不如问你一件事：今天早上有报修记录吗？" },
            { who: "查票员", en: "There is. Eight ten, at the north entrance.", cn: "有。八点十分，北入口。" },
            { who: "乘客", en: "That's the one I used. Here's my ticket, bought at eight twelve.", cn: "我走的就是那个。这是我八点十二分买的票。" },
            { who: "查票员", en: "That fits. I'll note it and you pay the fare only.", cn: "对得上。我记一下，你只补车费。" },
            { who: "乘客", en: "Thank you. Should I keep the ticket?", cn: "谢谢。票要留着吗？" },
            { who: "查票员", en: "Keep it until you're out of the station. Someone else may ask.", cn: "留到出站。可能还有人查。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "旅客 · 店家（问路被指错）",
          register: "随意",
          channel: "面对面（街上）",
          barrier: "第一个人指的路是反的，走了十分钟才发现",
          result: "折中（再问一次并当场用地图核对）",
          lines: [
            { who: "旅客", en: "Excuse me, is this the way to the cathedral?", cn: "打扰一下，去大教堂是这条路吗？" },
            { who: "路人", en: "Yes, straight on, ten minutes.", cn: "是，一直走，十分钟。" },
            { who: "旅客", en: "...I've been walking for ten minutes and the numbers are going down.", cn: "……我走了十分钟，门牌号在变小。" },
            { who: "旅客", en: "Sorry to bother you again. I think I went the wrong way.", cn: "抱歉再打扰一下。我想我走反了。" },
            { who: "店主", en: "The cathedral? You went the wrong way entirely. Back the way you came, then left at the lights.", cn: "大教堂？你完全走反了。往回走，到红绿灯左转。" },
            { who: "旅客", en: "May I check on my map? I'd rather not ask a third time.", cn: "我能在我的地图上核对一下吗？我不想再问第三次。" },
            { who: "店主", en: "Go ahead. ...Yes, that's the lights, and you can see the towers from there.", cn: "看吧。……对，就是那个红绿灯，从那儿就能看见塔尖。" },
            { who: "旅客", en: "May I ask why you're sure?", cn: "我能问一下你为什么这么确定吗？" },
            { who: "店主", en: "Because I can see it from my door. The other man was pointing at the bus station.", cn: "因为从我门口就能看见。刚才那位指的是汽车站。" },
            { who: "旅客", en: "That explains the numbers.", cn: "难怪门牌号不对。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "旅客 · 售票机 + 站务员",
          register: "中性",
          channel: "自助售票机 + 柜台",
          barrier: "机器只收硬币，界面还只有当地语言",
          result: "修复（站务员帮操作，并教了调出英文的快捷方式）",
          lines: [
            { who: "旅客", en: "The machine won't take my card.", cn: "机器不收我的卡。" },
            { who: "站务员", en: "It only takes coins after eight. There's a counter over there.", cn: "八点以后只收硬币。那边有柜台。" },
            { who: "旅客", en: "I queued for ten minutes to find that out.", cn: "我排了十分钟才知道这个。" },
            { who: "站务员", en: "Sorry. What are you buying?", cn: "抱歉。你要买什么？" },
            { who: "旅客", en: "Two singles to Central. I couldn't read the screen either.", cn: "两张去中央站的单程票。界面我也看不懂。" },
            { who: "站务员", en: "It's in four languages, but the fourth one is hidden behind this button.", cn: "有四种语言，但第四种藏在这个按钮后面。" },
            { who: "旅客", en: "That's the most useful thing anyone has told me today.", cn: "这是今天别人告诉我最有用的信息。" },
            { who: "站务员", en: "Hold this button for two seconds and it comes up in English.", cn: "按住这个按钮两秒，就会变成英文。" },
            { who: "旅客", en: "Two singles, English, coins. Got it.", cn: "两张单程、英文、硬币。记住了。" },
            { who: "站务员", en: "And on Sundays the counter opens at nine, so use the app.", cn: "还有，周日柜台九点才开，用应用买。" }
          ]
        },
        {
          variant: "情绪型（坐反方向又赶时间）",
          relation: "旅客 · 公交司机",
          register: "中性（着急）",
          channel: "面对面（公交车上）",
          barrier: "坐错方向越坐越远，还要赶六点的渡轮",
          result: "达成（司机在车场掉头，顺路放到港口站）",
          lines: [
            { who: "旅客", en: "Is this going to the harbour?", cn: "这车去港口吗？" },
            { who: "司机", en: "Opposite direction. You want the one across the road.", cn: "反方向。你要坐对面那趟。" },
            { who: "旅客", en: "Oh no. I have a ferry at six.", cn: "糟了。我六点有渡轮。" },
            { who: "司机", en: "What time is it now?", cn: "现在几点？" },
            { who: "旅客", en: "Five twenty. And I've been going the wrong way for fifteen minutes.", cn: "五点二十。而我坐错方向坐了十五分钟。" },
            { who: "司机", en: "Then don't get off here. Stay on; I turn around at the depot in four minutes.", cn: "那别在这儿下。坐着，我四分钟后在车场掉头。" },
            { who: "旅客", en: "Will that get me there in time?", cn: "那样来得及吗？" },
            { who: "司机", en: "It puts you at the harbour stop at ten to six. Walk fast, don't queue for a ticket, pay on board.", cn: "五点五十把你放到港口站。走快点，别排队买票，上车付。" },
            { who: "旅客", en: "Thank you. I was about to get off and cry at a bus stop.", cn: "谢谢。我刚才差点下车在站台上哭。" },
            { who: "司机", en: "People do that every week. Sit down, it's four minutes.", cn: "每周都有人这样。坐下吧，四分钟。" }
          ]
        },
        {
          variant: "渠道变体（App 二维码过闸）",
          relation: "乘客 · 站务员（闸机口）",
          register: "中性",
          channel: "手机应用 + 闸机",
          barrier: "二维码刷不开闸机，屏幕亮度也不够",
          result: "达成（改走宽闸机识别成功，并拿到手机没电的备用方案）",
          lines: [
            { who: "乘客", en: "The gate won't read my code. I bought the ticket on the app.", cn: "闸机读不出我的码。我在应用上买的票。" },
            { who: "站务员", en: "Show me the screen. ...The brightness is too low.", cn: "给我看屏幕。……亮度太低了。" },
            { who: "乘客", en: "I've turned it up. Still nothing.", cn: "我调亮了。还是不行。" },
            { who: "站务员", en: "Then use the wide gate on the left, it reads better.", cn: "那走左边那个宽闸机，识别更好。" },
            { who: "乘客", en: "It worked. Why does the narrow one fail?", cn: "行了。为什么窄的那个不行？" },
            { who: "站务员", en: "The scanner is at the bottom and people hold the phone at the top.", cn: "扫描口在下面，而大家都把手机举在上面。" },
            { who: "乘客", en: "That's a design problem, not a user problem.", cn: "这是设计问题，不是用户问题。" },
            { who: "站务员", en: "I have said so for two years. Meanwhile: hold it at the bottom.", cn: "我说了两年了。总之：放低一点。" },
            { who: "乘客", en: "What if my phone dies?", cn: "手机没电怎么办？" },
            { who: "站务员", en: "There's a ticket machine inside the gate, so you can always buy your way out.", cn: "闸机里面就有售票机，所以你总能买票出去。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "领队 · 车站值班主管",
          register: "正式",
          channel: "面对面（车站服务台）",
          barrier: "无（但需正式说明团体与无障碍需求）",
          result: "达成（团体票与无障碍车厢安排妥当）",
          lines: [
            { who: "领队", en: "Good morning. I am leading a group of fourteen students and I should like to arrange tickets in advance.", cn: "早上好。我带十四个学生，想提前安排车票。" },
            { who: "主管", en: "Certainly. Is it a return journey?", cn: "当然。是往返吗？" },
            { who: "领队", en: "A return, departing at nine and returning at half past four.", cn: "往返，九点出发，四点半返回。" },
            { who: "主管", en: "Group rates apply from ten persons. May I ask whether anyone requires step-free access?", cn: "十人起可享团体票。请问有人需要无障碍通道吗？" },
            { who: "领队", en: "One student uses a wheelchair, and two others cannot manage stairs with luggage.", cn: "一名学生用轮椅，另外两名带着行李走不了楼梯。" },
            { who: "主管", en: "Then I shall book you into coach two, which has the ramp, and notify both stations.", cn: "那我给你们订第二节车厢，那里有坡道，并通知两端车站。" },
            { who: "领队", en: "That is more than I had thought to ask for.", cn: "这比我原本想到要问的还多。" },
            { who: "主管", en: "It is standard practice. I shall send the booking and a platform plan this afternoon.", cn: "这是标准做法。我今天下午把订票和站台示意图发给您。" },
            { who: "领队", en: "Thank you. Should we arrive earlier than the group norm?", cn: "谢谢。我们需要比团体常规时间更早到吗？" },
            { who: "主管", en: "Twenty minutes earlier, so that boarding is not rushed.", cn: "提早二十分钟，这样上车不会赶。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "旅客 · 路人（问路）",
          register: "随意（极简、俚语）",
          channel: "面对面（街上）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "旅客", en: "sorry, the museum?", cn: "请问，博物馆？" },
            { who: "路人", en: "two blocks. left at the kebab place", cn: "两个街区。烤肉店那儿左转" },
            { who: "旅客", en: "the what", cn: "哪个" },
            { who: "路人", en: "kebab place. big orange sign. can't miss it", cn: "烤肉店。大橙色招牌。不可能错过" },
            { who: "旅客", en: "cheers", cn: "谢了" },
            { who: "路人", en: "it's shut on mondays by the way", cn: "顺便说一句，周一闭馆" },
            { who: "旅客", en: "it's tuesday", cn: "今天周二" },
            { who: "路人", en: "then you're fine", cn: "那没问题" },
            { who: "旅客", en: "you're sure about the kebab place", cn: "烤肉店你确定吗" },
            { who: "路人", en: "i eat there every day", cn: "我天天在那儿吃" }
          ]
        }
      ]
    },

    /* ==================== 01-05 租车 ==================== */
    {
      id: "s01-05",
      domain: "01",
      title: "租车",
      ielts: "口语 P2 场景 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "旅客 · 租车柜台",
          register: "半正式",
          channel: "面对面（租车柜台）",
          barrier: "无",
          result: "达成（租到车，保险条款讲清）",
          lines: [
            { who: "旅客", en: "I have a booking under Reid, for four days.", cn: "我用 Reid 的名字订了车，四天。" },
            { who: "柜台", en: "Licence and card, please. Are you taking the basic insurance?", cn: "请给驾照和卡。您要基础保险吗？" },
            { who: "旅客", en: "Yes, but tell me what it doesn't cover.", cn: "要，但请告诉我它不保什么。" },
            { who: "柜台", en: "Glass, tyres and the underside. That's what the excess waiver covers.", cn: "玻璃、轮胎和底盘。那是免赔额险保的部分。" },
            { who: "旅客", en: "How much is the waiver?", cn: "免赔额险多少钱？" },
            { who: "柜台", en: "Fourteen a day.", cn: "每天十四。" },
            { who: "旅客", en: "And the excess without it?", cn: "不买的话免赔额是多少？" },
            { who: "柜台", en: "Nine hundred. Most people take the waiver for the first day and decide later.", cn: "九百。大部分人先买第一天的，之后再决定。" },
            { who: "旅客", en: "Then I'll take one day and decide after I've parked once.", cn: "那我先买一天，等我停过一次车再决定。" },
            { who: "柜台", en: "Sensible. Full tank, return full. Bay forty-one, keys in the box.", cn: "明智。满油出、满油还。四十一号位，钥匙在盒子里。" },
            { who: "旅客", en: "Before I go: what do I do if something happens?", cn: "走之前问一下：如果出了事怎么办？" },
            { who: "柜台", en: "Photograph everything, call this number, and don't move the car until they say so.", cn: "全部拍照，打这个号码，在他们说可以之前别挪车。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "旅客 · 租车公司主管（还车争议）",
          register: "半正式",
          channel: "面对面（还车区）",
          barrier: "无（但要顶住推责，靠证据说话）",
          result: "达成（凭取车照片无费用结案）",
          lines: [
            { who: "主管", en: "There's a scratch on the rear door. That's a three hundred euro repair.", cn: "后门有划痕。维修费三百欧。" },
            { who: "旅客", en: "That scratch was there when I collected the car.", cn: "那道划痕我取车时就有。" },
            { who: "主管", en: "It isn't on the condition report.", cn: "车况报告上没有。" },
            { who: "旅客", en: "Because the report says no damage, and the agent never walked round it with me.", cn: "因为报告上写的是无损伤，而工作人员根本没跟我一起绕车检查。" },
            { who: "主管", en: "Do you have anything to support that?", cn: "您有什么能证明这一点吗？" },
            { who: "旅客", en: "Forty-one photographs, taken in the bay before I drove off. Here's the door, and here's the timestamp.", cn: "四十一张照片，开车前在车位拍的。这是车门，这是时间戳。" },
            { who: "主管", en: "...That is the same scratch.", cn: "……是同一道。" },
            { who: "旅客", en: "And the photo of the report shows the sheet was blank on collection.", cn: "还有一张报告单的照片，显示取车时表是空的。" },
            { who: "主管", en: "I'll close the file with no charge, and I'll speak to the agent.", cn: "我按无费用结案。另外我会跟那位工作人员谈。" },
            { who: "旅客", en: "Please do. And thank you for looking at the photographs rather than arguing.", cn: "麻烦你了。也谢谢你愿意看照片，而不是直接跟我争。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "旅客 · 租车柜台",
          register: "半正式",
          channel: "面对面（租车柜台）",
          barrier: "柜台坚持推销「预购一箱油」，比实际油价贵",
          result: "折中（自己还车前加满，手续费数字写进合同）",
          lines: [
            { who: "柜台", en: "Shall I add the pre-paid fuel? It's easier.", cn: "要加预购油吗？更省事。" },
            { who: "旅客", en: "How much?", cn: "多少钱？" },
            { who: "柜台", en: "Sixty-five for the tank.", cn: "一箱六十五。" },
            { who: "旅客", en: "The tank is forty-five litres and fuel is one twenty a litre. That's fifty-four.", cn: "油箱四十五升，油价一块二一升。那是五十四。" },
            { who: "柜台", en: "You're paying for the convenience.", cn: "您买的是便利。" },
            { who: "旅客", en: "I understand. I'd rather pay for fuel than for convenience, and I'll fill it up before I return.", cn: "我明白。我更愿意为油付钱，而不是为便利付钱，我回来之前会加满。" },
            { who: "柜台", en: "If you don't, we charge the difference plus a fee.", cn: "如果您没加满，我们要收差价加手续费。" },
            { who: "旅客", en: "Then could we write the fee on the contract? So neither of us is guessing.", cn: "那能把手续费写在合同上吗？这样谁都不用猜。" },
            { who: "柜台", en: "It's twenty-five.", cn: "二十五。" },
            { who: "旅客", en: "Twenty-five, on the contract, and I'll fill up at the station by the airport.", cn: "二十五，写在合同上，我在机场那个加油站加满。" },
            { who: "柜台", en: "That's fair.", cn: "这样公平。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "旅客 · 租车救援电话",
          register: "半正式",
          channel: "电话 + 车内",
          barrier: "仪表盘亮灯，说不清是哪个灯、什么现象",
          result: "修复（拍照发送，查清是胎压并就近处理）",
          lines: [
            { who: "旅客", en: "Hi, a warning light came on. I don't know which one.", cn: "你好，仪表盘亮了个灯。我不知道是哪个。" },
            { who: "救援", en: "What colour is it?", cn: "什么颜色？" },
            { who: "旅客", en: "Amber. It looks like a horseshoe with an exclamation mark.", cn: "黄色。看起来像个带感叹号的马蹄铁。" },
            { who: "救援", en: "That's tyre pressure. Is the car pulling to one side?", cn: "那是胎压。车会往一边偏吗？" },
            { who: "旅客", en: "Slightly, when I brake. Is it safe to keep driving?", cn: "刹车时有点。继续开安全吗？" },
            { who: "救援", en: "Not far. Can you photograph the dashboard and send it?", cn: "别开太远。你能拍一下仪表盘发过来吗？" },
            { who: "旅客", en: "Sending it now. ...And the tyre.", cn: "这就发。……还有轮胎。" },
            { who: "救援", en: "The rear left is low. There's a station four hundred metres ahead. Take it slowly.", cn: "左后轮气压低。前面四百米有个加油站。慢慢开过去。" },
            { who: "旅客", en: "What do I say to them?", cn: "我跟他们怎么说？" },
            { who: "救援", en: "Rental car, slow puncture, and ask them to check all four. Send me the receipt and we'll refund it.", cn: "说租的车、慢漏气，请他们把四个都检查一遍。收据发我，我们报销。" },
            { who: "旅客", en: "And if it's flat when I get there?", cn: "要是到了那儿完全没气了呢？" },
            { who: "救援", en: "Then call me back and don't drive on it. The spare is under the floor.", cn: "那就再打给我，别硬开。备胎在地板下面。" }
          ]
        },
        {
          variant: "情绪型（停车场剐蹭）",
          relation: "旅客 · 租车公司客服（事故）",
          register: "半正式（紧张）",
          channel: "电话",
          barrier: "停车场剐到柱子，旅客慌乱不知先做什么",
          result: "达成（按顺序处理：拍照、报备、报损）",
          lines: [
            { who: "旅客", en: "I've hit a pillar in a car park. Nobody's hurt. What do I do first?", cn: "我在停车场撞到柱子了。没人受伤。我该先做什么？" },
            { who: "客服", en: "First: is anyone with you, and is the car drivable?", cn: "第一：有人跟你在一起吗，车还能开吗？" },
            { who: "旅客", en: "I'm alone. It's drivable, the wing is dented.", cn: "我一个人。能开，叶子板凹了。" },
            { who: "客服", en: "Good. Then breathe, and photograph four things: the car, the pillar, the position, and the other party if there is one.", cn: "好。那先深呼吸，拍四样：车、柱子、位置，如果有别人就拍对方。" },
            { who: "旅客", en: "There's no other party. Do I call the police?", cn: "没有别人。要报警吗？" },
            { who: "客服", en: "For a pillar, no. For another car, yes. Ask the car park for a written note that you reported it.", cn: "撞柱子不用。撞车就要。跟停车场要一张你报备过的书面说明。" },
            { who: "旅客", en: "And the damage?", cn: "那损伤呢？" },
            { who: "客服", en: "Send the photographs within twenty-four hours and we open the file. If you have the waiver, the excess is zero.", cn: "二十四小时内把照片发来，我们立案。如果你买了免赔额险，免赔额为零。" },
            { who: "旅客", en: "I bought one day of it.", cn: "我只买了一天。" },
            { who: "客服", en: "Then check the date. If today is covered, you're fine.", cn: "那看一下日期。如果今天在保，就没问题。" },
            { who: "旅客", en: "Today is covered. I've never been so glad to have said yes to a salesman.", cn: "今天在保。我从没这么庆幸跟销售说了好。" }
          ]
        },
        {
          variant: "渠道变体（App 自助取还车）",
          relation: "旅客 · 租车电话支持",
          register: "半正式",
          channel: "App 自助取还 + 电话",
          barrier: "自助钥匙柜打不开，应用给的码也不对",
          result: "达成（电话支持远程开柜，并提醒更新应用与还车事项）",
          lines: [
            { who: "旅客", en: "The locker won't open. The app says my code is wrong.", cn: "柜子打不开。应用说我的码是错的。" },
            { who: "支持", en: "Read me the code from the app.", cn: "把应用里的码念给我。" },
            { who: "旅客", en: "Four one seven two.", cn: "四一七二。" },
            { who: "支持", en: "That's the booking number, not the locker code. The locker code is under the QR button.", cn: "那是订座号，不是柜子密码。柜子密码在二维码按钮下面。" },
            { who: "旅客", en: "There's no QR button on my screen.", cn: "我屏幕上没有二维码按钮。" },
            { who: "支持", en: "Then your app hasn't updated. I can open it remotely. Give me thirty seconds.", cn: "那你的应用没更新。我可以远程开。给我三十秒。" },
            { who: "旅客", en: "It's open. Thank you. Should I update the app now?", cn: "开了。谢谢。我现在要更新应用吗？" },
            { who: "支持", en: "Do it before you return the car, or you'll be on the phone again at midnight.", cn: "还车之前更新，不然你半夜又要打电话。" },
            { who: "旅客", en: "What time is the return deadline?", cn: "还车截止是几点？" },
            { who: "支持", en: "Six, and the locker takes the key. Photograph the mileage before you close it.", cn: "六点，钥匙放进柜子。合上之前拍一下里程表。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "公司代表 · 租车公司业务经理",
          register: "正式",
          channel: "面对面（会议室）",
          barrier: "无（但需正式议定条款）",
          result: "达成（三个月租约含替换车条款，提交董事会）",
          lines: [
            { who: "经理", en: "We have your requirements. Three vehicles for three months, with drivers?", cn: "我们收到你们的需求了。三辆车、三个月，配司机吗？" },
            { who: "代表", en: "Without drivers, but with a guaranteed replacement within four hours.", cn: "不配司机，但要保证四小时内提供替换车。" },
            { who: "经理", en: "Four hours is achievable in the city. Outside it, we would say six.", cn: "市区内四小时可以做到。市区外我们要说六小时。" },
            { who: "代表", en: "Then the contract should distinguish the two, rather than promising a single figure.", cn: "那合同里应该区分这两种情况，而不是只承诺一个数字。" },
            { who: "经理", en: "Agreed. And on servicing?", cn: "同意。保养呢？" },
            { who: "代表", en: "Servicing at your cost, with forty-eight hours' notice, because we need cover on those days.", cn: "保养由你们承担，提前四十八小时通知，因为那几天我们需要替代车。" },
            { who: "经理", en: "That is reasonable and we shall include it.", cn: "这合理，我们会写进去。" },
            { who: "代表", en: "One further point: the vehicles must be identical, so that our drivers do not have to relearn the controls.", cn: "还有一点：车辆必须同款，免得我们的司机要重新熟悉操作。" },
            { who: "经理", en: "Identical, same specification, delivered on the first.", cn: "同款、同配置，一号交付。" },
            { who: "代表", en: "Then I shall recommend acceptance to my board this week.", cn: "那我这周向董事会建议接受。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "旅客 · 租车柜台（周末短租）",
          register: "随意（极简、俚语）",
          channel: "面对面（柜台）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "旅客", en: "anything cheap for the weekend", cn: "周末有什么便宜的车" },
            { who: "柜台", en: "how cheap", cn: "多便宜" },
            { who: "旅客", en: "cheapest", cn: "最便宜的" },
            { who: "柜台", en: "small one. no radio. no ac", cn: "小车。没收音机。没空调" },
            { who: "旅客", en: "it's august", cn: "现在是八月" },
            { who: "柜台", en: "then not that one", cn: "那就不是那辆" },
            { who: "旅客", en: "what's the next one up", cn: "再上一档是什么" },
            { who: "柜台", en: "twenty more. has ac", cn: "多二十。有空调" },
            { who: "旅客", en: "i'll take it", cn: "我要了" },
            { who: "柜台", en: "insurance", cn: "保险呢" },
            { who: "旅客", en: "no", cn: "不要" },
            { who: "柜台", en: "your call. bring it back with a full tank", cn: "随你。还车加满油" },
            { who: "旅客", en: "i'll try", cn: "我尽量" }
          ]
        }
      ]
    },

    /* ==================== 01-06 酒店入住 ==================== */
    {
      id: "s01-06",
      domain: "01",
      title: "酒店入住",
      ielts: "口语 P2 场景 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "旅客 · 酒店前台",
          register: "半正式",
          channel: "面对面（酒店前台）",
          barrier: "无",
          result: "达成（换成朝院安静房间，问清行李寄存）",
          lines: [
            { who: "旅客", en: "Hi, I have a reservation under Reid, two nights.", cn: "你好，我用 Reid 的名字订了房，两晚。" },
            { who: "前台", en: "Passport, please. ...Breakfast is included, seven to ten.", cn: "请给护照。……含早餐，七点到十点。" },
            { who: "旅客", en: "Is the room on the street side? I'm a light sleeper.", cn: "房间是朝街那面吗？我睡觉轻。" },
            { who: "前台", en: "It is. Would you like the courtyard side? Same price, slightly smaller.", cn: "是的。您要朝院子那面吗？同价，稍微小一点。" },
            { who: "旅客", en: "Smaller and quiet beats bigger and loud.", cn: "小一点安静，比大一点吵强。" },
            { who: "前台", en: "Then I'll move you. Room two oh four, courtyard, top floor.", cn: "那我给您换。二〇四房，朝院，顶层。" },
            { who: "旅客", en: "Is there a lift?", cn: "有电梯吗？" },
            { who: "前台", en: "There is, but it stops at three. Yours is one flight up from there.", cn: "有，但只到三楼。您那层还要上一层。" },
            { who: "旅客", en: "With one suitcase that's fine. Can I leave a bag here after check-out?", cn: "一个箱子没问题。退房后能寄存行李吗？" },
            { who: "前台", en: "Free until six, then three euros a day.", cn: "六点前免费，之后每天三欧。" },
            { who: "旅客", en: "Then I'll be back before six.", cn: "那我六点前回来。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "旅客 · 值班经理（房型不符）",
          register: "半正式",
          channel: "面对面（前台）",
          barrier: "无（但要拿预订确认说服对方）",
          result: "达成（明天换房 + 今晚按标准间收费退差价）",
          lines: [
            { who: "旅客", en: "I booked a room with a desk and a fridge. There's neither.", cn: "我订的是带书桌和冰箱的房间。两样都没有。" },
            { who: "经理", en: "That's a standard room. The description may have been aspirational.", cn: "那是标准间。描述可能有点理想化。" },
            { who: "旅客", en: "It wasn't a description, it was the confirmation. Here, page two: desk, fridge, quiet side.", cn: "不是描述，是确认单。这里，第二页：书桌、冰箱、安静一侧。" },
            { who: "经理", en: "I see it.", cn: "我看到了。" },
            { who: "旅客", en: "I'd rather have the room than an argument. Do you have one that matches?", cn: "我宁愿要房间，也不想吵架。你们有符合的吗？" },
            { who: "经理", en: "Not tonight. Tomorrow we have one.", cn: "今晚没有。明天有一间。" },
            { who: "旅客", en: "Then two options: move me tomorrow, or charge the standard rate tonight and refund the difference.", cn: "那两个选择：明天给我换房，或者今晚按标准间收费、退还差价。" },
            { who: "经理", en: "I'll do both. Move tomorrow at ten, and tonight at the standard rate.", cn: "两件我都做。明天十点换房，今晚按标准间价。" },
            { who: "旅客", en: "Then I have nothing to complain about.", cn: "那我就没什么可抱怨的了。" },
            { who: "经理", en: "You had something to complain about an hour ago. I'd rather fix it than read it in a review.", cn: "一小时前您确实有。我宁愿现在解决，也不想在点评里读到。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "旅客 · 酒店前台（早班机到达）",
          register: "半正式",
          channel: "面对面（前台）",
          barrier: "早上七点想入住，而规定是下午三点",
          result: "折中（存行李 + 用泳池淋浴 + 排到两点打扫名单第一位）",
          lines: [
            { who: "旅客", en: "My flight landed at seven. Is there any chance of checking in now?", cn: "我的航班七点落地。现在能办入住吗？" },
            { who: "前台", en: "Check-in is at three. The room is still being cleaned.", cn: "入住时间是三点。房间还在打扫。" },
            { who: "旅客", en: "I've been awake since four. What can you do?", cn: "我四点就醒了。你们能做什么？" },
            { who: "前台", en: "I can't give you the room, but I can do three things.", cn: "房间我给不了，但我能做三件事。" },
            { who: "旅客", en: "Go on.", cn: "请说。" },
            { who: "前台", en: "Store your bags, give you a card for the pool and showers, and put you first on the cleaning list for two o'clock.", cn: "存行李，给你一张泳池和淋浴的卡，并把你排到两点打扫名单的第一位。" },
            { who: "旅客", en: "Two o'clock I can live with. Is there coffee anywhere?", cn: "两点我能接受。哪里能喝到咖啡？" },
            { who: "前台", en: "The bar opens at nine, but I'll bring you one now from the office machine.", cn: "酒吧九点开，但我现在从办公室的机器给你端一杯。" },
            { who: "旅客", en: "That's the thing I actually needed.", cn: "这才是我真正需要的。" },
            { who: "前台", en: "Most people say the room. It's never the room at seven in the morning.", cn: "大部分人说房间。早上七点谁都缺的从来不是房间。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "旅客 · 酒店前台（房卡失灵）",
          register: "半正式",
          channel: "面对面（前台）",
          barrier: "房卡三次失灵，还发现房间已被另一位客人占用",
          result: "修复（换到三〇五并查明是系统重复分配）",
          lines: [
            { who: "旅客", en: "The key won't work. Third time.", cn: "房卡不行。第三次了。" },
            { who: "前台", en: "Let me re-code it. ...It should work now.", cn: "我重新写一下。……现在应该可以。" },
            { who: "旅客", en: "It didn't. And there's someone else's suitcase in the room.", cn: "还是不行。而且房间里有别人的行李箱。" },
            { who: "前台", en: "...That shouldn't be possible.", cn: "……这不可能。" },
            { who: "旅客", en: "It is possible. I'd rather not walk in on them again.", cn: "就是发生了。我不想再撞见他们一次。" },
            { who: "前台", en: "I'm sorry. Let me look at the system. ...You were both assigned two eleven.", cn: "抱歉。我看一下系统。……你们两位都被分到了二一一。" },
            { who: "旅客", en: "So whoever arrived second just opened the door.", cn: "所以后到的那位直接就开门进去了。" },
            { who: "前台", en: "Effectively. I'm moving you to three oh five, a better room, and I'll walk you up myself.", cn: "可以这么说。我给您换到三〇五，更好的房间，我亲自送您上去。" },
            { who: "旅客", en: "And the other guest?", cn: "那另一位客人呢？" },
            { who: "前台", en: "She keeps two eleven. She has unpacked.", cn: "她留着二一一。她已经把行李打开了。" },
            { who: "旅客", en: "Then three oh five is fine.", cn: "那三〇五可以。" }
          ]
        },
        {
          variant: "情绪型（凌晨两点被施工吵）",
          relation: "旅客 · 酒店前台（深夜）",
          register: "半正式（极度疲惫）",
          channel: "面对面（前台，深夜）",
          barrier: "凌晨到达，房间朝施工一侧，噪音不断",
          result: "达成（换到朝院房间 + 免费延迟退房）",
          lines: [
            { who: "旅客", en: "I'm sorry. I know it's two in the morning and I'm the fourth person to complain.", cn: "抱歉。我知道现在是凌晨两点，而我是第四个来投诉的人。" },
            { who: "前台", en: "You are, and all four of you are on the fifth floor.", cn: "确实是，而且你们四个人都在五楼。" },
            { who: "旅客", en: "It's drilling. At two in the morning.", cn: "是电钻。凌晨两点。" },
            { who: "前台", en: "That isn't us, it's the site next door. It has been going on for a month.", cn: "那不是我们，是隔壁工地。已经持续一个月了。" },
            { who: "旅客", en: "I've been travelling for nineteen hours. I'm not going to be reasonable about this.", cn: "我已经在路上十九个小时了。这件事上我讲不了道理了。" },
            { who: "前台", en: "You don't have to be. I have one room on the courtyard side and I'm giving it to you.", cn: "您不用讲道理。我有一间朝院的房，给您。" },
            { who: "旅客", en: "Why not to the other three?", cn: "为什么不给另外三个人？" },
            { who: "前台", en: "Because you asked last and I've run out. I'll move them in the morning and tell them why.", cn: "因为您问得最晚，我已经分完了。早上我会给他们换，并说明原因。" },
            { who: "旅客", en: "That's honest. I'll take it.", cn: "这话实在。我要了。" },
            { who: "前台", en: "And I've put a late check-out on your booking, free of charge. Sleep in.", cn: "另外我在您的订单上免费加了延迟退房。睡到自然醒吧。" },
            { who: "旅客", en: "...Thank you. That's the first kind thing today.", cn: "……谢谢。这是今天第一件暖心的事。" }
          ]
        },
        {
          variant: "渠道变体（App 自助入住机）",
          relation: "旅客 · 自助入住机 + 前台",
          register: "半正式",
          channel: "自助机 + 前台",
          barrier: "自助机查不到平台订单，无法取卡入住",
          result: "达成（柜台九十秒手工办好，并说明下次怎么走）",
          lines: [
            { who: "旅客", en: "The machine says my reservation isn't found.", cn: "机器说找不到我的预订。" },
            { who: "前台", en: "Did you book directly or through a site?", cn: "您是在我们这儿订的，还是通过平台？" },
            { who: "旅客", en: "Through a site. I have the number.", cn: "通过平台。我有确认号。" },
            { who: "前台", en: "The machine only sees direct bookings. That's why.", cn: "机器只看得到直销订单。就是这个原因。" },
            { who: "旅客", en: "Then why does it offer to check me in?", cn: "那它为什么还让我办入住？" },
            { who: "前台", en: "Because the screen is the same one we use. It's a design decision I disagree with.", cn: "因为屏幕跟我们用的是一样的。这个设计我不同意。" },
            { who: "旅客", en: "Can you do it here?", cn: "你能在这儿办吗？" },
            { who: "前台", en: "Already done. Room four one two, breakfast until ten.", cn: "已经办好了。四一二房，早餐到十点。" },
            { who: "旅客", en: "Should I use the machine next time?", cn: "下次我该用机器吗？" },
            { who: "前台", en: "Book direct and yes. Otherwise come here, it takes ninety seconds.", cn: "直接在我们这儿订就用机器。不然就来柜台，九十秒的事。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "旅客 · 宾客关系经理",
          register: "正式",
          channel: "面对面（大堂）",
          barrier: "无（但需正式提出并书面确认特殊安排）",
          result: "达成（房内早餐与临时办公空间均书面确认）",
          lines: [
            { who: "经理", en: "Welcome, Mr Reid. I am the guest relations manager. May I confirm the arrangements for your stay?", cn: "欢迎，Reid 先生。我是宾客关系经理。我确认一下您此次住宿的安排，可以吗？" },
            { who: "旅客", en: "Please. I should say at once that I have a meeting each morning at eight.", cn: "请。我先说明，我每天早上八点有会。" },
            { who: "经理", en: "Then I shall have breakfast served in your room at half past six, unless you prefer the restaurant.", cn: "那我安排六点半把早餐送到您房间，除非您更想去餐厅。" },
            { who: "旅客", en: "In the room, and a pot of coffee rather than a cup.", cn: "送房间，而且要一壶咖啡，不是一杯。" },
            { who: "经理", en: "Noted. And your other requirement?", cn: "记下了。还有您另一项要求？" },
            { who: "旅客", en: "I need a quiet place to take calls between eleven and one. A meeting room would be excessive.", cn: "我需要一个安静的地方在十一点到一点之间打电话。会议室太夸张了。" },
            { who: "经理", en: "The library on the first floor is unused in the morning. I shall reserve it and put a sign on the door.", cn: "一楼的图书室上午没人用。我把它预留出来，门上挂个牌子。" },
            { who: "旅客", en: "That is precisely what I needed. Could I have both in writing?", cn: "这正是我需要的。两项都能书面确认吗？" },
            { who: "经理", en: "I shall email them within the hour, together with my direct number.", cn: "我一小时内邮件发给您，并附我的直线电话。" },
            { who: "旅客", en: "Thank you. That is more efficient than most hotels manage.", cn: "谢谢。这比大多数酒店都高效。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "背包客 · 青年旅舍前台",
          register: "随意（极简、俚语）",
          channel: "面对面（青旅前台）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "旅客", en: "got a bed for two nights", cn: "有两晚的床位吗" },
            { who: "前台", en: "dorm or private", cn: "床位还是单间" },
            { who: "旅客", en: "cheapest", cn: "最便宜的" },
            { who: "前台", en: "dorm. six beds. top bunk left", cn: "床位。六人间。左上铺" },
            { who: "旅客", en: "is it loud", cn: "吵吗" },
            { who: "前台", en: "it's a hostel", cn: "这是青旅" },
            { who: "旅客", en: "fair. i'll take it", cn: "有道理。我要了" },
            { who: "前台", en: "towel's two euro", cn: "毛巾两欧" },
            { who: "旅客", en: "i'll use my shirt", cn: "我用我的衬衫" },
            { who: "前台", en: "everyone does", cn: "大家都这样" }
          ]
        }
      ]
    },

    /* ==================== 01-07 酒店退房与投诉 ==================== */
    {
      id: "s01-07",
      domain: "01",
      title: "酒店退房与投诉",
      ielts: "口语 P2 场景 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "旅客 · 酒店前台",
          register: "半正式",
          channel: "面对面（前台）",
          barrier: "无",
          result: "达成（逐条核对账单后退房）",
          lines: [
            { who: "旅客", en: "Checking out, room two oh four.", cn: "退房，二〇四房。" },
            { who: "前台", en: "Did you use the minibar?", cn: "您用过迷你吧吗？" },
            { who: "旅客", en: "Two waters. Everything else is as it was.", cn: "两瓶水。其他都没动。" },
            { who: "前台", en: "That's six euros. Anything from the restaurant?", cn: "六欧。餐厅有消费吗？" },
            { who: "旅客", en: "One dinner on Tuesday, charged to the room.", cn: "周二一顿晚餐，挂在房账上。" },
            { who: "前台", en: "I have it. Total is one hundred and eighty-four.", cn: "有记录。总共一百八十四。" },
            { who: "旅客", en: "Could I see the breakdown before I pay?", cn: "付款前能看一下明细吗？" },
            { who: "前台", en: "Of course. ...Two nights, dinner, two waters, city tax.", cn: "当然。……两晚、晚餐、两瓶水、城市税。" },
            { who: "旅客", en: "The city tax I didn't know about, but it's on the door card, so that one is my fault for not reading it.", cn: "城市税我不知道，但门卡上写了，所以这个是我自己没看。" },
            { who: "前台", en: "Most people say that. Everyone pays it.", cn: "大部分人都这么说。每个人都要付。" },
            { who: "旅客", en: "Card. And can I leave my bag until five?", cn: "刷卡。行李能存到五点吗？" },
            { who: "前台", en: "Until six, free of charge.", cn: "到六点，免费。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "旅客 · 前台主管（账单有错）",
          register: "半正式",
          channel: "面对面（前台）",
          barrier: "无（但要逐条核对并说清为什么不是自己的账）",
          result: "达成（两笔误记撤销并直接退款到卡）",
          lines: [
            { who: "旅客", en: "There are two charges here I don't recognise.", cn: "这里有两笔我不认识的收费。" },
            { who: "主管", en: "Which ones?", cn: "哪两笔？" },
            { who: "旅客", en: "Room service on Wednesday, and a laundry charge. I checked in on Wednesday evening.", cn: "周三的客房送餐，还有一笔洗衣费。我周三晚上才入住。" },
            { who: "主管", en: "The room service must be the previous guest.", cn: "客房送餐应该是上一位客人。" },
            { who: "旅客", en: "It would have to be. And the laundry was signed with a room number rather than a name.", cn: "那只能是。洗衣那笔签的是房号，不是姓名。" },
            { who: "主管", en: "Let me pull the slips. ...Both are signed R. Reed, with two e's. You are Reid.", cn: "我把签单调出来。……两笔签的都是 R. Reed，两个 e。您是 Reid。" },
            { who: "旅客", en: "So the same guest, twice, on my bill.", cn: "所以是同一位客人，两次记在我账上。" },
            { who: "主管", en: "Both removed, and I'll refund the card rather than adjust the bill.", cn: "两笔都撤销，而且我直接退到卡上，而不是改账单。" },
            { who: "旅客", en: "Why refund rather than adjust?", cn: "为什么是退款而不是改账？" },
            { who: "主管", en: "Because you have already paid. Adjusting would mean you chasing us for the money.", cn: "因为您已经付过了。改账意味着您要追着我们要钱。" },
            { who: "旅客", en: "That is the first time a hotel has thought that through.", cn: "这是第一次有酒店把这一步想到。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "旅客 · 酒店前台",
          register: "半正式",
          channel: "面对面（前台）",
          barrier: "要求延迟到六点被拒（当晚满房），且干洗被收费",
          result: "折中（改到两点 + 免掉有瑕疵的干洗费）",
          lines: [
            { who: "旅客", en: "Could I keep the room until six? My flight is at nine.", cn: "房间能留到六点吗？我的航班是九点。" },
            { who: "前台", en: "I can't. We're full tonight and housekeeping needs the block.", cn: "不行。今晚满房，客房部要整层打扫。" },
            { who: "旅客", en: "Then two o'clock?", cn: "那两点呢？" },
            { who: "前台", en: "Two o'clock I can do, at half the nightly rate.", cn: "两点可以，收半晚房价。" },
            { who: "旅客", en: "Half is more than I expected for two hours.", cn: "两个小时收半晚，比我预想的多。" },
            { who: "前台", en: "It's a fixed rate, not a calculation. But there is something else I can do.", cn: "这是固定价，不是算出来的。不过还有一件我能做的。" },
            { who: "旅客", en: "Go on.", cn: "请说。" },
            { who: "前台", en: "The dry cleaning you were charged for came back with a mark on the collar. I'll take that off the bill.", cn: "您被收的那笔干洗，衣服领子上留了个印子。那笔我从账单上免掉。" },
            { who: "旅客", en: "You knew about that?", cn: "你知道这件事？" },
            { who: "前台", en: "It was in the log this morning. Nobody had told you.", cn: "今早记在交接本上。没人告诉您。" },
            { who: "旅客", en: "Then two o'clock, and thank you for reading the log.", cn: "那就两点，谢谢你看了交接本。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "旅客 · 前台 + 行李员",
          register: "半正式",
          channel: "面对面（前台）",
          barrier: "寄存的行李被放上团队行李车，找不到",
          result: "修复（凭行李牌找到，赶在出发前取出）",
          lines: [
            { who: "旅客", en: "I left one bag here at eleven. It isn't in the store room.", cn: "我十一点存了一件行李。寄存间里没有。" },
            { who: "前台", en: "What does it look like?", cn: "什么样子？" },
            { who: "旅客", en: "Black, hard shell, with a red tag showing my flight number.", cn: "黑色硬壳，一个红色行李牌，上面有我的航班号。" },
            { who: "前台", en: "There's a black hard shell in the group area. It came in with a tour group at noon.", cn: "团队区有个黑色硬壳。中午跟一个旅行团一起进来的。" },
            { who: "旅客", en: "Mine was tagged. Was that one?", cn: "我那件有牌子。那件有吗？" },
            { who: "前台", en: "It has a tag, but the number belongs to a tour company.", cn: "有牌子，但号码是旅行社的。" },
            { who: "旅客", en: "Mine is the flight number. Can we look? My taxi is in twenty minutes.", cn: "我的是航班号。能看看吗？我的车二十分钟后到。" },
            { who: "前台", en: "I'll take you through now. ...Is this it?", cn: "我现在带您过去。……是这件吗？" },
            { who: "旅客", en: "That's it. It was put on the wrong trolley.", cn: "就是它。它被放错车了。" },
            { who: "前台", en: "The tag was facing down. That is how it happened, and it isn't good enough.", cn: "行李牌朝下了。就是这么弄错的，这不合格。" },
            { who: "旅客", en: "I have my bag and nine minutes. Let's leave it there.", cn: "我拿到包了，还有九分钟。就这样吧。" }
          ]
        },
        {
          variant: "情绪型（三次投诉无果）",
          relation: "旅客 · 值班经理（投诉）",
          register: "半正式（情绪化）",
          channel: "面对面（大堂）",
          barrier: "连续三晚没有热水，前两次投诉没有任何记录",
          result: "达成（工程师即刻到场 + 免一晚半价两晚 + 具名书面致歉）",
          lines: [
            { who: "旅客", en: "This is the third time I have come to this desk about the hot water.", cn: "这是我第三次来这个柜台说热水的事。" },
            { who: "经理", en: "I can see two notes on the file.", cn: "我看到档案上有两条记录。" },
            { who: "旅客", en: "Two notes and three visits. The first one I made at eight in the morning and nobody wrote it down.", cn: "两条记录，三次来访。第一次是早上八点来的，没人记下来。" },
            { who: "经理", en: "That is our failure, and I'm not going to explain it away.", cn: "这是我们的失误，我不打算找理由解释掉。" },
            { who: "旅客", en: "I've had cold showers for three days. I'm not angry about the water any more. I'm angry about the notes.", cn: "我洗了三天冷水澡。我已经不为水生气了。我是为那些记录生气。" },
            { who: "经理", en: "Understood. Here is what I'm doing: an engineer within twenty minutes, and the first night taken off the bill.", cn: "明白。我这么做：二十分钟内工程师到，账单上第一晚免掉。" },
            { who: "旅客", en: "And the other two nights?", cn: "那另外两晚呢？" },
            { who: "经理", en: "At half rate, and a written apology from the general manager, by name.", cn: "按半价，还有总经理具名的书面道歉。" },
            { who: "旅客", en: "I would rather have had the hot water.", cn: "我宁愿一开始就有热水。" },
            { who: "经理", en: "So would I. That's the honest answer.", cn: "我也是。这是实话。" }
          ]
        },
        {
          variant: "渠道变体（App 退房后又被扣费）",
          relation: "旅客 · 酒店客服（线上）",
          register: "半正式",
          channel: "App 退房 + 电话",
          barrier: "线上退房显示已结清，随后又被扣迷你吧费用",
          result: "达成（查明是感应器误报，三个工作日退款）",
          lines: [
            { who: "旅客", en: "I checked out on the app last night and I've just been charged again.", cn: "我昨晚在应用上退了房，刚才又被扣了一笔。" },
            { who: "客服", en: "Let me see. It's the minibar sensor. Four euros.", cn: "我看一下。是迷你吧感应器，四欧。" },
            { who: "旅客", en: "I didn't open the minibar.", cn: "我没开迷你吧。" },
            { who: "客服", en: "The sensor registers movement, not removal. Did you move anything to reach the socket?", cn: "感应器记录的是移动，不是拿走。您为了插电挪动过什么吗？" },
            { who: "旅客", en: "I moved a bottle to plug in my laptop.", cn: "我为了插笔记本挪了一瓶。" },
            { who: "客服", en: "Then it's a false charge. We get about two of these a month and we refund every one.", cn: "那就是误扣。每月大概两起，我们每一起都退。" },
            { who: "旅客", en: "Should I have told someone?", cn: "我该告诉谁吗？" },
            { who: "客服", en: "You could, but the sensor should know the difference. I'll report it.", cn: "可以，但感应器本该分得出来。我会反馈。" },
            { who: "旅客", en: "And the refund?", cn: "退款呢？" },
            { who: "客服", en: "Three working days. If it doesn't arrive, call me on the extension in this email.", cn: "三个工作日。如果没到，打这封邮件里的分机找我。" },
            { who: "旅客", en: "Ninety seconds on the phone. That is better than most.", cn: "电话九十秒解决。比大多数都好。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "旅客 · 酒店总经理",
          register: "正式",
          channel: "面对面（办公室）",
          barrier: "无（但需正式陈述并接受正式答复）",
          result: "达成（五日内具名书面答复，说明制度变更）",
          lines: [
            { who: "总经理", en: "Thank you for agreeing to see me rather than simply writing a review.", cn: "谢谢您愿意来见我，而不是直接写点评。" },
            { who: "旅客", en: "I wrote to you first because the matter is not about money.", cn: "我先写信给您，是因为这件事不是钱的问题。" },
            { who: "总经理", en: "Then state it, and I shall not interrupt.", cn: "那请您陈述，我不打断。" },
            { who: "旅客", en: "On the second night, a member of staff entered my room at eleven without knocking, while I was asleep.", cn: "第二晚，一名员工在十一点没有敲门就进了我的房间，当时我在睡觉。" },
            { who: "总经理", en: "That should never happen, and the door has a chain and a Do Not Disturb sign.", cn: "这绝不该发生，而且门上有链锁和请勿打扰牌。" },
            { who: "旅客", en: "Both were in use. The person had a master key and did not announce themselves.", cn: "两样都用了。那人有总卡，也没有出声。" },
            { who: "总经理", en: "I have read the access log. The entry is recorded at eleven oh four, and there was no reason for it.", cn: "我看了门禁记录。十一点零四分有进入记录，而没有任何理由。" },
            { who: "旅客", en: "What I want is not compensation. It is a written reply stating what has changed.", cn: "我要的不是赔偿。我要一封书面答复，说明改了什么。" },
            { who: "总经理", en: "You shall have it within five working days, signed by me, describing the retraining and the change to the master key policy.", cn: "五个工作日内给您，由我签署，写明重新培训的内容和总卡政策的变更。" },
            { who: "旅客", en: "Then I shall consider the matter closed.", cn: "那我就认为此事了结。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "旅客 · 青年旅舍前台（退房）",
          register: "随意（极简、俚语）",
          channel: "面对面（前台）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "旅客", en: "checking out", cn: "退房" },
            { who: "前台", en: "room", cn: "房号" },
            { who: "旅客", en: "six", cn: "六" },
            { who: "前台", en: "towel", cn: "毛巾" },
            { who: "旅客", en: "didn't take one", cn: "我没拿" },
            { who: "前台", en: "everyone says that", cn: "大家都这么说" },
            { who: "旅客", en: "i used my shirt", cn: "我用的是衬衫" },
            { who: "前台", en: "yeah, i remember", cn: "对，我记得" },
            { who: "旅客", en: "was i that obvious", cn: "我这么明显吗" },
            { who: "前台", en: "you were the only one in a shirt", cn: "你是唯一一个穿衬衫的" }
          ]
        }
      ]
    },

    /* ==================== 01-08 餐厅点餐 ==================== */
    {
      id: "s01-08",
      domain: "01",
      title: "餐厅点餐",
      ielts: "口语 P2 场景 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "顾客 · 餐厅服务员",
          register: "中性",
          channel: "面对面（餐厅）",
          barrier: "无",
          result: "达成（点好菜并问清做法与过敏）",
          lines: [
            { who: "服务员", en: "Good evening. Table for two?", cn: "晚上好。两位吗？" },
            { who: "顾客", en: "Two, please. Could we sit outside?", cn: "两位。能坐外面吗？" },
            { who: "服务员", en: "There's one table left, but it's near the door. Does that matter?", cn: "还剩一张桌，但靠门。有关系吗？" },
            { who: "顾客", en: "It's fine. Do you have the menu in English?", cn: "没关系。有英文菜单吗？" },
            { who: "服务员", en: "We do. Anything to drink first?", cn: "有。先来点喝的吗？" },
            { who: "顾客", en: "Just water, and we'll order in a minute.", cn: "就水吧，我们一会儿点菜。" },
            { who: "服务员", en: "Take your time. The fish of the day is sea bass, and the soup is pumpkin.", cn: "慢慢看。今日鲜鱼是海鲈，汤是南瓜汤。" },
            { who: "顾客", en: "Is the sea bass bony?", cn: "海鲈刺多吗？" },
            { who: "服务员", en: "It's filleted. The only bones are the ones you can see.", cn: "已经去骨了。只有看得见的那些。" },
            { who: "顾客", en: "Then one sea bass and one soup to start, and the pasta for me.", cn: "那先来一份海鲈和一份汤，我要意面。" },
            { who: "服务员", en: "Any allergies I should tell the kitchen about?", cn: "有什么过敏要告诉厨房吗？" },
            { who: "顾客", en: "None. Thank you.", cn: "没有。谢谢。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "顾客 · 餐厅领班（座位与上菜节奏）",
          register: "半正式",
          channel: "面对面（餐厅）",
          barrier: "无（但要得体地争取安静座位和上菜节奏）",
          result: "达成（换到吧台尽头，主菜压后）",
          lines: [
            { who: "顾客", en: "We booked a quiet table. This one is next to the kitchen door.", cn: "我们订的是安静的位子。这张桌靠着厨房门。" },
            { who: "领班", en: "I'm sorry. The quiet ones are taken until nine.", cn: "抱歉。安静的位子要到九点才有。" },
            { who: "顾客", en: "We're celebrating, so nine is too late to start. Is there anything else?", cn: "我们是来庆祝的，九点开始太晚。还有别的办法吗？" },
            { who: "领班", en: "There are two seats at the end of the bar. Not ideal, but far from the door.", cn: "吧台尽头有两个座位。不理想，但离门远。" },
            { who: "顾客", en: "How far from the kitchen?", cn: "离厨房多远？" },
            { who: "领班", en: "Across the room. You'd hear the music, not the plates.", cn: "在餐厅另一边。你会听到音乐，不是盘子声。" },
            { who: "顾客", en: "Then we'll take it, if you'll serve us a little slower than usual.", cn: "那我们要了，如果你们能比平常上得慢一点。" },
            { who: "领班", en: "Slower I can do. I'll ask the kitchen to hold the main course.", cn: "慢一点没问题。我让厨房压住主菜。" },
            { who: "顾客", en: "That is exactly what I wanted, and I didn't have to ask twice.", cn: "这正是我想要的，而且不用我说两遍。" },
            { who: "领班", en: "People ask for the food to come faster. You're the first in a month to ask for slower.", cn: "大家都要求上快一点。您是一个月里第一个要求慢一点的。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "顾客 · 餐厅服务员（招牌菜卖完）",
          register: "中性",
          channel: "面对面（餐厅）",
          barrier: "专程想点的招牌菜刚卖完",
          result: "折中（换同做法的牛小排，并预订周四的羊排）",
          lines: [
            { who: "顾客", en: "We'd like the lamb for two, please.", cn: "我们要两人份的羊排。" },
            { who: "服务员", en: "The lamb has just gone. That was the last one of the evening.", cn: "羊排刚卖完。那是今晚最后一份。" },
            { who: "顾客", en: "We came especially for it, I'm afraid.", cn: "我们专程为它来的。" },
            { who: "服务员", en: "I understand. Let me tell you what's closest to it.", cn: "我明白。我说说跟它最接近的。" },
            { who: "顾客", en: "Please.", cn: "请。" },
            { who: "服务员", en: "The short rib is cooked the same way, and there's a pork loin that's more popular.", cn: "牛小排做法一样，还有一款更受欢迎的猪里脊。" },
            { who: "顾客", en: "Is the short rib also slow-cooked?", cn: "牛小排也是慢炖的吗？" },
            { who: "服务员", en: "Six hours, same as the lamb. I'll bring bread while it cooks.", cn: "六小时，跟羊排一样。烤的时候我先上面包。" },
            { who: "顾客", en: "Then short rib for two, and we'll come back for the lamb on Thursday.", cn: "那要两人份牛小排，周四我们再来吃羊排。" },
            { who: "服务员", en: "Thursdays are quieter and the lamb is on then. I'll put your name down.", cn: "周四安静些，那天有羊排。我把您的名字记下。" },
            { who: "顾客", en: "You've turned a disappointment into a booking.", cn: "你把一件失望的事变成了一次预订。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "顾客 · 餐厅服务员（上错菜）",
          register: "中性",
          channel: "面对面（餐厅）",
          barrier: "菜名的理解不同（squid 与 squid ink），上错了菜",
          result: "修复（炸鱿鱼转给别桌，意面重做）",
          lines: [
            { who: "顾客", en: "I think this isn't what I ordered.", cn: "我想这不是我点的。" },
            { who: "服务员", en: "You ordered the squid, didn't you?", cn: "您点的是鱿鱼，对吧？" },
            { who: "顾客", en: "I ordered the squid ink pasta. This is fried squid.", cn: "我点的是墨鱼汁意面。这是炸鱿鱼。" },
            { who: "服务员", en: "Ah. In the menu, squid is the starter and squid ink is the pasta.", cn: "啊。菜单里 squid 是前菜，squid ink 才是意面。" },
            { who: "顾客", en: "I see how that happened. I probably said squid and pointed at the wrong line.", cn: "我明白怎么会错了。我大概说了 squid，又指错了行。" },
            { who: "服务员", en: "I should have checked. Shall I bring the pasta?", cn: "我应该确认一下。要给您上意面吗？" },
            { who: "顾客", en: "Only if the fried squid can go to someone who wants it. I don't want food thrown away.", cn: "除非这份炸鱿鱼能给想吃的人。我不想食物被倒掉。" },
            { who: "服务员", en: "Two people at table six ordered it. I'll ask them.", cn: "六号桌有两位点了这个。我去问他们。" },
            { who: "顾客", en: "And if they say no?", cn: "如果他们不要呢？" },
            { who: "服务员", en: "Then it goes on my tab, not on yours, and the pasta is on the house.", cn: "那记在我账上，不是您的，意面店里请。" },
            { who: "顾客", en: "That's more than fair. I'll eat the squid while we wait.", cn: "这太公道了。等的时候我把鱿鱼吃了。" }
          ]
        },
        {
          variant: "情绪型（等太久孩子闹）",
          relation: "顾客 · 餐厅服务员（等菜四十分钟）",
          register: "中性（不耐烦）",
          channel: "面对面（餐厅）",
          barrier: "等了四十分钟什么都没上，孩子开始闹",
          result: "达成（面包立刻上、儿童餐先上且免费）",
          lines: [
            { who: "顾客", en: "Excuse me, we ordered forty minutes ago and we've had nothing.", cn: "不好意思，我们四十分钟前点的菜，到现在什么都没有。" },
            { who: "服务员", en: "Let me check. ...The kitchen has your order, it's just behind two large tables.", cn: "我查一下。……厨房有您的单，只是排在两大桌后面。" },
            { who: "顾客", en: "I have a five-year-old and no bread. That's the problem.", cn: "我带着一个五岁的孩子，连面包都没有。这才是问题。" },
            { who: "服务员", en: "That is our fault. Bread in one minute.", cn: "这是我们的问题。面包一分钟就到。" },
            { who: "顾客", en: "Could you bring the child's food first, even if ours comes later?", cn: "能把孩子的先上吗，我们的晚点也行？" },
            { who: "服务员", en: "I'll ask them to do exactly that.", cn: "我让他们就这么办。" },
            { who: "顾客", en: "And I'd like to know how long ours will be.", cn: "还有，我想知道我们的还要多久。" },
            { who: "服务员", en: "Ten minutes, and I'll come back in five to tell you if that changes.", cn: "十分钟；如果变了，我五分钟后来告诉您。" },
            { who: "顾客", en: "Coming back to tell me is the part nobody does.", cn: "会回来告诉我，这一点没人做得到。" },
            { who: "服务员", en: "I'll do it. And I've taken the child's meal off the bill.", cn: "我会做到。另外儿童餐我从账单上免掉了。" },
            { who: "顾客", en: "You didn't have to, but thank you.", cn: "你不用这样，不过谢谢你。" }
          ]
        },
        {
          variant: "渠道变体（电话订位）",
          relation: "顾客 · 餐厅电话接线",
          register: "中性",
          channel: "电话订位",
          barrier: "电话里姓名听不清，订位信息要反复确认",
          result: "达成（订位成功，过敏信息送到厨房）",
          lines: [
            { who: "接线", en: "Good evening, Romano's. Hold or book?", cn: "晚上好，Romano 餐厅。您是等候还是订位？" },
            { who: "顾客", en: "Book, please. Friday, eight o'clock, four people.", cn: "订位。周五八点，四位。" },
            { who: "接线", en: "Friday at eight. Name?", cn: "周五八点。姓名？" },
            { who: "顾客", en: "Bright. B-R-I-G-H-T.", cn: "Bright。拼写 B-R-I-G-H-T。" },
            { who: "接线", en: "Bite?", cn: "Bite？" },
            { who: "顾客", en: "No, Bright. As in not dark.", cn: "不是，Bright。就是亮那个词。" },
            { who: "接线", en: "Got it. Any allergies on the booking?", cn: "好。订位需要备注过敏吗？" },
            { who: "顾客", en: "One person is allergic to nuts. Serious, not a preference.", cn: "有一位对坚果过敏。是严重的，不是口味偏好。" },
            { who: "接线", en: "I've flagged it as an allergy, not a preference. That goes to the kitchen, not only the front desk.", cn: "我标成过敏，不是偏好。这条会送到厨房，不只是前台。" },
            { who: "顾客", en: "That's the answer I was hoping for. Should I confirm nearer the time?", cn: "这正是我想听的回答。临近日期需要再确认吗？" },
            { who: "接线", en: "We text the day before. Reply yes and it's held.", cn: "我们前一天发短信。回 yes 就保留。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "主人 · 餐厅经理（商务宴请）",
          register: "正式",
          channel: "面对面（餐厅）",
          barrier: "无（但需正式安排菜单、座次与分寸）",
          result: "达成（套餐每道含替代项，酒单由经理保管）",
          lines: [
            { who: "主人", en: "I have booked for eight. Might we discuss the menu in advance?", cn: "我订了八位。我们能否先商量一下菜单？" },
            { who: "经理", en: "Certainly. Would you prefer a set menu or a free choice?", cn: "当然。您希望套餐还是自由点菜？" },
            { who: "主人", en: "A set menu, but with one alternative for each course. Guests dislike being given no choice.", cn: "套餐，但每道菜要有一个替代选择。客人不喜欢没有选择。" },
            { who: "经理", en: "Four courses, two options each. Any dietary requirements?", cn: "四道菜，每道两个选择。有饮食禁忌吗？" },
            { who: "主人", en: "Two guests do not drink alcohol, and one does not eat shellfish.", cn: "有两位客人不喝酒，一位不吃贝类。" },
            { who: "经理", en: "I shall mark the shellfish course and offer a substitute without drawing attention to it.", cn: "我会标出那道贝类，并提供替代而不引人注意。" },
            { who: "主人", en: "That is precisely the point. Discretion matters more than the food.", cn: "这正是关键。得体比菜品更重要。" },
            { who: "经理", en: "Understood. Shall I keep the wine list on the table, or with me?", cn: "明白。酒单放在桌上，还是由我保管？" },
            { who: "主人", en: "With you, and bring it to me rather than to the table.", cn: "你保管，并且拿给我，而不是拿到桌上。" },
            { who: "经理", en: "As you wish. I shall confirm everything in writing tomorrow.", cn: "随您。我明天把一切书面确认。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "顾客 · 快餐柜台",
          register: "随意（极简、俚语）",
          channel: "面对面（柜台）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "顾客", en: "one burger, no pickle", cn: "一个汉堡，不要酸黄瓜" },
            { who: "服务员", en: "fries", cn: "薯条呢" },
            { who: "顾客", en: "yeah, go on", cn: "行吧" },
            { who: "服务员", en: "large", cn: "大份？" },
            { who: "顾客", en: "medium. i'm not an animal", cn: "中份。我又不是野兽" },
            { who: "服务员", en: "drink", cn: "饮料" },
            { who: "顾客", en: "water", cn: "水" },
            { who: "服务员", en: "water's free", cn: "水免费" },
            { who: "顾客", en: "so's the pickle, usually", cn: "酸黄瓜通常也免费" },
            { who: "服务员", en: "not today", cn: "今天不是" },
            { who: "顾客", en: "noted", cn: "记下了" }
          ]
        }
      ]
    },

    /* ==================== 01-09 买单分账与退菜 ==================== */
    {
      id: "s01-09",
      domain: "01",
      title: "买单分账与退菜",
      ielts: "口语 P2 场景 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "顾客（四人）· 服务员",
          register: "随意",
          channel: "面对面（餐厅）",
          barrier: "无",
          result: "达成（按各人点的分开付，酒只算喝酒的两位）",
          lines: [
            { who: "顾客", en: "Could we pay separately? Four of us.", cn: "能分开付吗？我们四个人。" },
            { who: "服务员", en: "Of course. Split evenly, or by what you each had?", cn: "当然。平摊，还是按各人点的算？" },
            { who: "顾客", en: "By what we had, if that isn't too much trouble.", cn: "按各人点的算，如果不麻烦的话。" },
            { who: "服务员", en: "It's easier than even. I'll bring the itemised bill.", cn: "比平摊容易。我把明细单拿来。" },
            { who: "顾客", en: "Two of us shared the starter, so put it on my part.", cn: "我们两个人分了一个前菜，记在我这份上。" },
            { who: "服务员", en: "Then your part is thirty-one, and the wine is separate.", cn: "那您这份是三十一，酒单算。" },
            { who: "顾客", en: "Whose wine was it?", cn: "酒是谁的？" },
            { who: "服务员", en: "It was ordered for the table, so I've split it four ways.", cn: "是整桌点的，所以我按四份分。" },
            { who: "顾客", en: "Two of us didn't drink, so that isn't right.", cn: "我们两位没喝，那样算不对。" },
            { who: "服务员", en: "Then it's split between the other two. My mistake.", cn: "那就只算另外两位。是我的疏忽。" },
            { who: "顾客", en: "You've thought about this more than we did.", cn: "你想得比我们还周到。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "顾客 · 餐厅经理（重复收费）",
          register: "半正式",
          channel: "面对面（收银台）",
          barrier: "无（但要拿明细单逐条对，同时不指责人）",
          result: "达成（去掉重复那笔，服务费照付）",
          lines: [
            { who: "顾客", en: "We've been charged for the starter twice.", cn: "前菜被收了两遍钱。" },
            { who: "经理", en: "It appears twice on the system.", cn: "系统里显示两次。" },
            { who: "顾客", en: "Here's the itemised bill: the same dish on two lines, same minute.", cn: "这是明细单：同一道菜在两行，同一分钟。" },
            { who: "经理", en: "The second entry is at the same minute. That's a keying error.", cn: "第二条是同一分钟。这是录入错误。" },
            { who: "顾客", en: "I assumed so. I'm not accusing anyone of anything.", cn: "我也这么想。我不是在指责任何人。" },
            { who: "经理", en: "Thank you. I'll remove it, and take the service charge off as well.", cn: "谢谢。我把它去掉，服务费也一并免掉。" },
            { who: "顾客", en: "The service was good. Don't take the service charge off.", cn: "服务挺好。服务费别免。" },
            { who: "经理", en: "Then I'll remove the error and leave the service. That's unusual.", cn: "那我只去掉错的那笔，服务费保留。这很少见。" },
            { who: "顾客", en: "It's only unusual because most people are angrier than the situation deserves.", cn: "很少见只是因为大部分人比事情本身更生气。" },
            { who: "经理", en: "I'll take the compliment and fix the bill.", cn: "这个称赞我收下，账单我改。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "顾客 · 厨师长（要求退菜）",
          register: "中性",
          channel: "面对面（餐厅）",
          barrier: "要求退菜但已吃掉一半，店家不肯全额退",
          result: "折中（不退款，加半份别的菜按半价，并改配方）",
          lines: [
            { who: "顾客", en: "I'm sorry, but this isn't what I expected. Could we send it back?", cn: "抱歉，这道菜跟我预想的不一样。能退吗？" },
            { who: "服务员", en: "Half of it is gone. I can't take it off the bill.", cn: "已经吃了一半。我没法从账单上划掉。" },
            { who: "顾客", en: "I understand. I ate it because I was hungry, not because it was good.", cn: "我明白。我吃是因为饿，不是因为好吃。" },
            { who: "服务员", en: "Let me ask the chef what he can do.", cn: "我去问厨师长能怎么处理。" },
            { who: "厨师长", en: "I'll come out. What's wrong with it?", cn: "我出来一下。这道菜哪里不对？" },
            { who: "顾客", en: "It is much saltier than the description. I've had it before and it wasn't.", cn: "比描述咸很多。我以前吃过，不是这个味。" },
            { who: "厨师长", en: "That's possible. I changed the cure last week.", cn: "有可能。我上周改了腌制法。" },
            { who: "顾客", en: "Then it isn't my palate.", cn: "那就不是我的口味问题。" },
            { who: "厨师长", en: "No. I'll bring you a half portion of something else and charge it at half.", cn: "不是。我给您上半份别的菜，按半价收。" },
            { who: "顾客", en: "And this one?", cn: "那这道呢？" },
            { who: "厨师长", en: "Full price, because you ate it. But I'll take the salt out of the recipe.", cn: "全价，因为您吃了。但我会把配方里的盐减下来。" },
            { who: "顾客", en: "That's the fairest thing anyone could say.", cn: "这是最公道的说法了。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "顾客 · 服务员（刷卡刷反）",
          register: "随意",
          channel: "面对面（收银台）",
          barrier: "分账时把两张卡刷反，一笔重复扣款",
          result: "修复（当场作废，留下凭条与联系电话）",
          lines: [
            { who: "顾客", en: "I think you've charged my card twice and his once.", cn: "我想你们刷了我的卡两次，他的刷了一次。" },
            { who: "服务员", en: "Let me look. ...You're right, I swapped the two cards.", cn: "我看一下。……您说得对，我把两张卡弄反了。" },
            { who: "顾客", en: "Can you void the second one?", cn: "能把第二笔作废吗？" },
            { who: "服务员", en: "I can void it, but the bank may hold it for three days.", cn: "能作废，但银行可能冻结三天。" },
            { who: "顾客", en: "Three days is fine, as long as it doesn't become permanent.", cn: "三天可以，只要不会变成永久的。" },
            { who: "服务员", en: "Here's the void slip with the reference. Keep it.", cn: "这是作废凭条，上面有单号。请留着。" },
            { who: "顾客", en: "And his charge?", cn: "那他的那笔呢？" },
            { who: "服务员", en: "His is correct. Yours will show as pending and then disappear.", cn: "他的没问题。您的那笔会显示待处理，然后消失。" },
            { who: "顾客", en: "If it doesn't disappear, who do I call?", cn: "如果没消失，我打给谁？" },
            { who: "服务员", en: "This number, quote the reference, and ask for me by name.", cn: "这个号码，报单号，指名找我。" }
          ]
        },
        {
          variant: "情绪型（朋友之间为钱尴尬）",
          relation: "两位朋友 · 服务员",
          register: "随意（尴尬）",
          channel: "面对面（餐桌）",
          barrier: "一个想请客，一个坚持各付各的，场面僵住",
          result: "达成（对半分账，酒算请客一方的）",
          lines: [
            { who: "顾客甲", en: "Put it all on mine. It's my turn.", cn: "都记我账上。这次轮到我。" },
            { who: "顾客乙", en: "It's never your turn. You paid last time and the time before.", cn: "从来没轮到你。上次和上上次都是你付的。" },
            { who: "顾客甲", en: "I earn more. That's the whole reason.", cn: "我挣得多。就这个原因。" },
            { who: "顾客乙", en: "And that's the whole reason I don't want you to.", cn: "这也正是我不想让你付的原因。" },
            { who: "服务员", en: "...Shall I come back?", cn: "……我要不要待会儿再来？" },
            { who: "顾客乙", en: "No. Two bills, please, split down the middle, even if the middle is unfair.", cn: "不用。两张单，对半分，哪怕对半分不公平。" },
            { who: "顾客甲", en: "The wine was mine. Put the wine on mine.", cn: "酒是我喝的。把酒算我头上。" },
            { who: "顾客乙", en: "That I'll accept.", cn: "这个我接受。" },
            { who: "服务员", en: "So two bills, and the wine on the second.", cn: "那就是两张单，酒记在第二张。" },
            { who: "顾客甲", en: "And next time we go somewhere cheaper, so this conversation doesn't happen.", cn: "下次我们找家便宜点的，就不用这么尴尬了。" }
          ]
        },
        {
          variant: "渠道变体（扫码结账）",
          relation: "顾客 · 服务员（扫码支付）",
          register: "中性",
          channel: "手机扫码 + 服务员",
          barrier: "扫码页面提示失败后又成功，重复扣了两笔",
          result: "达成（凭条走应用退款，两天到账）",
          lines: [
            { who: "顾客", en: "The app said payment failed, so I paid again. Now it shows two payments.", cn: "应用说支付失败，所以我又付了一次。现在显示两笔。" },
            { who: "服务员", en: "Let me see the screen. ...Both went through.", cn: "给我看屏幕。……两笔都成功了。" },
            { who: "顾客", en: "The first one said failed, in red.", cn: "第一笔是红色显示失败的。" },
            { who: "服务员", en: "It fails, then it succeeds, then it tells you it failed. It's the worst part of the system.", cn: "它先失败、再成功，然后告诉你失败。这是系统最糟的地方。" },
            { who: "顾客", en: "Can you refund one here?", cn: "能在这儿退一笔吗？" },
            { who: "服务员", en: "Not from the till. It has to go through the app's refund process.", cn: "收银台退不了。必须走应用的退款流程。" },
            { who: "顾客", en: "How long?", cn: "多久？" },
            { who: "服务员", en: "Two days, and I'll write the reference on your receipt so you don't have to explain it twice.", cn: "两天。我把单号写在您的收据上，省得您解释两遍。" },
            { who: "顾客", en: "Writing it down is the useful part.", cn: "写下来这一点最有用。" },
            { who: "服务员", en: "Everyone else just tells you to contact the app.", cn: "别人只会让您联系应用客服。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "公司代表 · 餐厅经理（开票）",
          register: "正式",
          channel: "面对面（收银台）",
          barrier: "无（但需正式提出公司发票与明细要求）",
          result: "达成（开具明细发票，服务费单列）",
          lines: [
            { who: "代表", en: "I should like to settle the account and request an invoice in the company's name.", cn: "我想结账，并申请一张公司抬头的发票。" },
            { who: "经理", en: "Certainly. May I have the company details?", cn: "当然。请提供公司信息。" },
            { who: "代表", en: "Here is the card. The invoice should show the full legal name and the tax number.", cn: "这是名片。发票上要写完整法定名称和税号。" },
            { who: "经理", en: "Would you like the itemised version or the summary?", cn: "您要明细版还是汇总版？" },
            { who: "代表", en: "Itemised, because our finance department will query anything unexplained.", cn: "明细版，因为财务部会对任何没写明的东西追问。" },
            { who: "经理", en: "I shall also separate the service charge so that it can be treated correctly.", cn: "我还会把服务费单列，以便正确处理。" },
            { who: "代表", en: "That is exactly the detail that causes trouble. Thank you.", cn: "正是这个细节最容易出问题。谢谢。" },
            { who: "经理", en: "May I email it, or would you prefer it printed?", cn: "我可以邮件发，还是您希望打印？" },
            { who: "代表", en: "Both. The printed copy for tonight, the email for the file.", cn: "都要。打印的今晚带走，邮件存档。" },
            { who: "经理", en: "The email will reach you within the hour.", cn: "邮件一小时内到。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "顾客 · 服务员（分账）",
          register: "随意（极简、俚语）",
          channel: "面对面（收银台）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "顾客", en: "can we split it", cn: "能分开付吗" },
            { who: "服务员", en: "how many ways", cn: "分几份" },
            { who: "顾客", en: "three", cn: "三份" },
            { who: "服务员", en: "even, or by what you had", cn: "平摊，还是按点的算" },
            { who: "顾客", en: "even. he's not paying for my steak", cn: "平摊。他可不想替我的牛排付钱" },
            { who: "服务员", en: "he had the steak", cn: "牛排是他点的" },
            { who: "顾客", en: "then by what we had", cn: "那就按点的算" },
            { who: "服务员", en: "sensible", cn: "明智" },
            { who: "顾客", en: "he's still not paying for my wine", cn: "他也别想替我的酒付钱" },
            { who: "服务员", en: "the wine was yours?", cn: "酒是你的？" },
            { who: "顾客", en: "the wine was mine", cn: "酒是我的" }
          ]
        }
      ]
    },

    /* ==================== 01-10 购物试穿与退换货 ==================== */
    {
      id: "s01-10",
      domain: "01",
      title: "购物试穿与退换货",
      ielts: "口语 P2 场景 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "顾客 · 服装店店员",
          register: "中性",
          channel: "面对面（店铺）",
          barrier: "无",
          result: "达成（尺码不合换款，买到合身的）",
          lines: [
            { who: "顾客", en: "Could I try this in a medium?", cn: "这件能试中号吗？" },
            { who: "店员", en: "The fitting rooms are at the back. How many items?", cn: "试衣间在后面。几件？" },
            { who: "顾客", en: "Three. Is there a limit?", cn: "三件。有件数限制吗？" },
            { who: "店员", en: "Six is the limit. Take the tag off this one first, or the alarm goes off.", cn: "限六件。先把这个的磁扣取下来，不然报警器会响。" },
            { who: "顾客", en: "The medium is tight across the shoulders. Do you have a large?", cn: "中号肩膀有点紧。有大号吗？" },
            { who: "店员", en: "Not in that colour. There is a large in navy.", cn: "这个颜色没有。藏青色有大号。" },
            { who: "顾客", en: "I'd rather have the fit than the colour. Let me try the navy.", cn: "我宁愿合身，颜色其次。我试试藏青。" },
            { who: "店员", en: "Here you are. The sleeves on that one are longer, by the way.", cn: "给您。顺便说一句，那款袖子长一些。" },
            { who: "顾客", en: "Longer is what I need. I'll take it.", cn: "我就需要长一点。我要了。" },
            { who: "店员", en: "Shall I keep the other two at the desk while you decide?", cn: "另外两件要不要先放柜台，您慢慢决定？" },
            { who: "顾客", en: "Please. I'll be five minutes.", cn: "好。我五分钟。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "顾客 · 店长（超过退货期限）",
          register: "半正式",
          channel: "面对面（店铺）",
          barrier: "无（但要靠商品状态与「无损失」论点争取）",
          result: "达成（不退现金，给不过期的换货券）",
          lines: [
            { who: "顾客", en: "I'd like to return this. It's unused and I have the receipt.", cn: "我想退这件。没穿过，收据也在。" },
            { who: "店长", en: "The receipt is from five weeks ago. Our policy is twenty-eight days.", cn: "收据是五周前的。我们的规定是二十八天。" },
            { who: "顾客", en: "I know. I was abroad for three of those weeks, which is why I'm late rather than undecided.", cn: "我知道。其中三周我在国外，所以是晚了，而不是拿不定主意。" },
            { who: "店长", en: "The policy doesn't have an exception for travel.", cn: "规定里没有旅行这一条例外。" },
            { who: "顾客", en: "Then let me ask a different question: is the item resellable?", cn: "那我换个问题：这件还能再卖吗？" },
            { who: "店长", en: "It is. Tags on, no marks.", cn: "能。标签还在，没有痕迹。" },
            { who: "顾客", en: "So your loss is nothing, and mine is the whole price.", cn: "所以你们的损失是零，我的损失是全部货款。" },
            { who: "店长", en: "...I can't refund it, but I can give you a credit note with no expiry.", cn: "……我不能退款，但可以给您一张不过期的换货券。" },
            { who: "顾客", en: "No expiry, printed on the note?", cn: "不过期，印在券上？" },
            { who: "店长", en: "Printed on it, and I'll note the reason in the system.", cn: "印在上面。另外我会在系统里记下原因。" },
            { who: "顾客", en: "That is a fair outcome for a rule that isn't mine.", cn: "对一条不是我定的规则来说，这个结果算公道。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "顾客 · 店员（折扣商品有瑕疵）",
          register: "中性",
          channel: "面对面（店铺）",
          barrier: "打折商品标明不退不换，但确实有瑕疵",
          result: "折中（免费修补；修不好再退，写进单据）",
          lines: [
            { who: "顾客", en: "The label says no returns on sale items, and there's a pulled thread here.", cn: "标签写着打折商品不退，而这里有个抽丝。" },
            { who: "店员", en: "Sale items are final, but a fault is different.", cn: "打折商品是最终销售，但有瑕疵就是另一回事。" },
            { who: "顾客", en: "Is it a fault, or is it wear?", cn: "这算瑕疵，还是磨损？" },
            { who: "店员", en: "Let me look under the light. ...It's a fault. The thread isn't cut, it's pulled.", cn: "我在灯下看看。……是瑕疵。线没断，是抽出来的。" },
            { who: "顾客", en: "Then can I have a refund?", cn: "那能退款吗？" },
            { who: "店员", en: "For sale items we repair or exchange. A refund is only for full price.", cn: "打折商品我们修或者换。只有正价才退款。" },
            { who: "顾客", en: "I'd rather have it repaired, because there's no other one in my size.", cn: "我更愿意修，因为我的码没有别的了。" },
            { who: "店员", en: "We have an alterations desk. Two days, no charge.", cn: "我们有修改台。两天，免费。" },
            { who: "顾客", en: "And if the repair shows?", cn: "如果修补痕迹看得出来呢？" },
            { who: "店员", en: "Then bring it back and we refund it, sale or not. I'll write that on the slip.", cn: "那您拿回来，不管打不打折我们都退款。我把这条写在单子上。" },
            { who: "顾客", en: "Written on the slip is what makes that believable.", cn: "写在单子上才让人信。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "顾客 · 店员（线上线下规则不同）",
          register: "中性",
          channel: "面对面（店铺）",
          barrier: "网上下单、门店退货，两边规则说法冲突",
          result: "修复（查明是加盟店，改办等价换货）",
          lines: [
            { who: "顾客", en: "I bought this online and the size is wrong. Can I return it here?", cn: "我在网上买的，尺码不对。能在这儿退吗？" },
            { who: "店员", en: "Online orders go back online.", cn: "网上的订单要退到网上。" },
            { who: "顾客", en: "The website says I can return to any store in the group.", cn: "网站上写着可以退到集团旗下任何门店。" },
            { who: "店员", en: "We're a franchise. The group stores are the ones in the city centre.", cn: "我们是加盟店。集团直营店是市中心那几家。" },
            { who: "顾客", en: "So the website is right, and this shop is the exception.", cn: "所以网站没说错，这家店是例外。" },
            { who: "店员", en: "That's about it. But I can do something else.", cn: "差不多是这样。不过我能做另一件事。" },
            { who: "顾客", en: "What?", cn: "什么？" },
            { who: "店员", en: "I'll exchange it for the right size from our stock and deal with the paperwork myself.", cn: "我从我们库存里给您换正确的码，单据我自己处理。" },
            { who: "顾客", en: "That's better than a refund.", cn: "这比退款还好。" },
            { who: "店员", en: "And take a photo of the website line, in case the next shop argues.", cn: "另外把网站那句话拍下来，免得下一家店跟您争。" }
          ]
        },
        {
          variant: "情绪型（出门时防盗门响）",
          relation: "顾客 · 店员（防盗门报警）",
          register: "中性（尴尬）",
          channel: "面对面（店门口）",
          barrier: "出门时报警器响，被当众拦下查看",
          result: "达成（查明是他店未消磁的旧商品，店员道歉）",
          lines: [
            { who: "店员", en: "Excuse me. Could you come back inside for a moment?", cn: "不好意思。能请您回来一下吗？" },
            { who: "顾客", en: "The alarm went off, yes. But I paid for everything.", cn: "报警器是响了。但东西我都付过钱了。" },
            { who: "店员", en: "I have to check. It's the rule, not my opinion of you.", cn: "我必须查一下。这是规定，不是我针对您。" },
            { who: "顾客", en: "I understand the rule. I'd like you to check somewhere less public.", cn: "我理解规定。我希望您换个不那么公开的地方查。" },
            { who: "店员", en: "You're right. Let's use the desk at the back.", cn: "您说得对。我们去后面的柜台。" },
            { who: "顾客", en: "The receipt is here, and the bag is untouched.", cn: "收据在这儿，袋子没动过。" },
            { who: "店员", en: "...It's the coat. The tag is from another shop and was never deactivated.", cn: "……是这件外套。标签是另一家店的，从来没消磁。" },
            { who: "顾客", en: "So it would have gone off in every shop I walked into today.", cn: "那我今天进的每家店都会响。" },
            { who: "店员", en: "Probably. I'm sorry about the way I asked.", cn: "大概是。为我刚才的方式道歉。" },
            { who: "顾客", en: "You asked politely. It was the doorway I minded.", cn: "您问得有礼貌。我介意的是站在门口。" }
          ]
        },
        {
          variant: "渠道变体（网购退货客服）",
          relation: "顾客 · 网店客服",
          register: "半正式",
          channel: "在线客服",
          barrier: "退货被系统按超时自动拒绝，实际是派送延误",
          result: "达成（人工复核批准，免费退货标签并延长窗口）",
          lines: [
            { who: "顾客", en: "My return was refused automatically. The reason says outside the window.", cn: "我的退货被自动拒绝了。理由写的是超出时限。" },
            { who: "客服", en: "When did it arrive?", cn: "什么时候到的？" },
            { who: "顾客", en: "The twelfth. I applied on the tenth of the following month.", cn: "十二号。我是在下个月十号申请的。" },
            { who: "客服", en: "That is two days outside thirty. It's automated, so it can't see context.", cn: "超出三十天两天。是系统自动判断，看不出具体情况。" },
            { who: "顾客", en: "The context is that nobody was home to receive it and it sat at the depot.", cn: "具体情况是家里没人收，它在快递站放了一周。" },
            { who: "客服", en: "Do you have the delivery notification?", cn: "您有派送通知吗？" },
            { who: "顾客", en: "Here. First attempt on the eighteenth.", cn: "有。第一次派送是十八号。" },
            { who: "客服", en: "Then the clock should start then, not on the twelfth. I'll approve it.", cn: "那时限就该从十八号算，不是十二号。我批准。" },
            { who: "顾客", en: "Will the return label cost me anything?", cn: "退货标签要我付钱吗？" },
            { who: "客服", en: "Not when it's our error. Free label, and I'll extend the window by a week in the system.", cn: "是我们的问题就不收费。免费标签，我在系统里给你延一周。" },
            { who: "顾客", en: "That will save me arguing again.", cn: "这省得我再争一次。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "顾客 · 百货商店客服经理",
          register: "正式",
          channel: "面对面（客服办公室）",
          barrier: "无（但需正式陈述问题并提供证据）",
          result: "达成（全额退到原卡，并反馈修改洗护标签）",
          lines: [
            { who: "经理", en: "You wished to raise a matter about a purchase. Please go ahead.", cn: "您想就一笔购物提出事项。请讲。" },
            { who: "顾客", en: "I bought a coat on the ninth of March. The lining has split after four wears.", cn: "我三月九日买了一件外套。穿了四次里衬就裂了。" },
            { who: "经理", en: "Do you have the receipt and the item?", cn: "您有收据和商品吗？" },
            { who: "顾客", en: "Both, and photographs of the split taken before I brought it in.", cn: "都有，还有送来之前拍的裂口照片。" },
            { who: "经理", en: "Has it been worn in the rain, or cleaned?", cn: "淋过雨或者洗过吗？" },
            { who: "顾客", en: "It has been worn outdoors. It has not been cleaned, and the care label says nothing about rain.", cn: "在户外穿过。没有洗过，而且洗护标签上没提到雨。" },
            { who: "经理", en: "I accept that. Our position is that a refund is available within six months for a manufacturing fault.", cn: "这一点我接受。我们的立场是：制造缺陷在六个月内可以全额退款。" },
            { who: "顾客", en: "Then we agree on the principle. May I have it refunded to the original card?", cn: "那我们在原则上一致。可以退到原卡吗？" },
            { who: "经理", en: "You may. I shall process it today and email the confirmation.", cn: "可以。我今天处理，并邮件确认。" },
            { who: "顾客", en: "Thank you. I would also suggest the care label be amended.", cn: "谢谢。我还建议修改洗护标签。" },
            { who: "经理", en: "I shall pass that to the buyer, which is more useful than an apology.", cn: "我会转告采购，这比道歉更有用。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "顾客 · 店员（试衣间）",
          register: "随意（极简、俚语）",
          channel: "面对面（试衣间）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "顾客", en: "got this in a small", cn: "这件有小号吗" },
            { who: "店员", en: "what size is that", cn: "你拿的什么码" },
            { who: "顾客", en: "medium", cn: "中号" },
            { who: "店员", en: "small's on the rail outside", cn: "小号在外面架子上" },
            { who: "顾客", en: "tried it. too tight", cn: "试了。太紧" },
            { who: "店员", en: "tight where", cn: "哪儿紧" },
            { who: "顾客", en: "everywhere", cn: "哪儿都紧" },
            { who: "店员", en: "then it's not your size", cn: "那就不是你的码" },
            { who: "顾客", en: "i'll take the medium", cn: "我要中号" },
            { who: "店员", en: "sensible", cn: "明智" }
          ]
        }
      ]
    },

    /* ==================== 01-11 换汇银行与邮局快递 ==================== */
    {
      id: "s01-11",
      domain: "01",
      title: "换汇银行与邮局快递",
      ielts: "口语 P2 场景 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "顾客 · 银行柜员",
          register: "半正式",
          channel: "面对面（银行柜台）",
          barrier: "无",
          result: "达成（算清手续费与汇率后换汇）",
          lines: [
            { who: "顾客", en: "I'd like to change some euros into sterling.", cn: "我想把一些欧元换成英镑。" },
            { who: "柜员", en: "How much, and do you have an account with us?", cn: "换多少？您在我们这儿有账户吗？" },
            { who: "顾客", en: "Three hundred euros. No account, I'm here for a week.", cn: "三百欧。没有账户，我来一周。" },
            { who: "柜员", en: "Without an account there's a commission of four pounds.", cn: "没有账户要收四镑手续费。" },
            { who: "顾客", en: "What rate do I get as a visitor?", cn: "作为游客我用什么汇率？" },
            { who: "柜员", en: "One point one six, and the commission is waived above five hundred.", cn: "一点一六，五百以上免手续费。" },
            { who: "顾客", en: "So if I change six hundred I save four pounds.", cn: "那我换六百就省下四镑。" },
            { who: "柜员", en: "You do, but you'd be carrying three hundred more in cash than you need.", cn: "是的，但您会多带三百现金在身上。" },
            { who: "顾客", en: "Good point. Three hundred, and I'll pay the four.", cn: "说得好。换三百，那四镑我付。" },
            { who: "柜员", en: "Sensible. Would you like twenties, or some smaller notes?", cn: "明智。您要二十镑的，还是加一些小面额？" },
            { who: "顾客", en: "A mix. Two fifties and the rest in tens, please.", cn: "混合吧。两张五十，其余十镑的。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "顾客 · 银行柜员（大额存入）",
          register: "半正式",
          channel: "面对面（银行柜台）",
          barrier: "无（但要配合合规询问并提供来源证明）",
          result: "达成（一次存入并留档）",
          lines: [
            { who: "柜员", en: "You'd like to deposit five thousand in cash. May I ask where it came from?", cn: "您要存五千现金。请问这钱来自哪里？" },
            { who: "顾客", en: "From selling a car, in cash, before I left.", cn: "我出发前卖了车，收的现金。" },
            { who: "柜员", en: "Do you have the sale document?", cn: "有交易凭证吗？" },
            { who: "顾客", en: "I have the transfer of ownership form and a copy of the advert.", cn: "我有过户表和那份广告的截图。" },
            { who: "柜员", en: "That will do. Above ten thousand we would need more, but this is below the threshold.", cn: "可以。超过一万我们需要更多材料，但您这笔在门槛以下。" },
            { who: "顾客", en: "Do you need to know what I'll spend it on?", cn: "你们需要知道我要花在哪儿吗？" },
            { who: "柜员", en: "For this amount, no. I record the source, not the plan.", cn: "这个金额不用。我记录来源，不记录用途。" },
            { who: "顾客", en: "And if I deposit the rest next month?", cn: "如果我下个月把剩下的也存进来呢？" },
            { who: "柜员", en: "Then bring the same document, and I'd suggest one visit rather than three small ones.", cn: "那带同样的凭证，而且我建议一次存完，不要分三次小额。" },
            { who: "顾客", en: "Why one visit?", cn: "为什么一次存完？" },
            { who: "柜员", en: "Small deposits in a row look like structuring, even when they aren't, and it costs you paperwork.", cn: "连续小额会被当成拆分规避，即使并不是，而且会给你带来额外材料。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "顾客 · 邮局职员（包裹超尺寸）",
          register: "中性",
          channel: "面对面（邮局）",
          barrier: "包裹超尺寸两厘米，不能按普通邮件寄",
          result: "折中（书拿出来单独按印刷品寄，省下大半邮费）",
          lines: [
            { who: "顾客", en: "I'd like to send this to Canada, standard.", cn: "我想把这个寄到加拿大，普通件。" },
            { who: "职员", en: "It's over the size limit. It has to go as a parcel, which is three times the price.", cn: "超过尺寸上限。必须按包裹寄，价格是三倍。" },
            { who: "顾客", en: "How much over?", cn: "超多少？" },
            { who: "职员", en: "Two centimetres on the length. That's the frustrating kind.", cn: "长度超两厘米。就是这种最气人的。" },
            { who: "顾客", en: "Can I repack it here?", cn: "我能在这儿重新打包吗？" },
            { who: "职员", en: "There's a table by the window and tape at the counter.", cn: "窗边有张桌子，胶带在柜台。" },
            { who: "顾客", en: "If I take the books out and send them separately, does the rest fit?", cn: "如果我把书拿出来单独寄，剩下的能塞进去吗？" },
            { who: "职员", en: "It would, and books go at the printed-paper rate, which is cheaper than parcels anyway.", cn: "能。书按印刷品寄，本来就比包裹便宜。" },
            { who: "顾客", en: "Then I'll do that. Two parcels, one cheap.", cn: "那就这样。两个包裹，一个便宜。" },
            { who: "职员", en: "And mark the second one printed papers, or it gets charged as a parcel.", cn: "第二个标上印刷品，不然会按包裹收费。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "顾客 · 快递客服（邮编写反）",
          register: "半正式",
          channel: "电话客服",
          barrier: "客服把邮编数字写反，包裹被退回",
          result: "修复（免费重寄并补发更正标签照片）",
          lines: [
            { who: "顾客", en: "My parcel came back to me. The tracking says wrong address.", cn: "我的包裹被退回来了。追踪显示地址错误。" },
            { who: "客服", en: "The postcode on the label belongs to a street two kilometres away.", cn: "标签上的邮编对应的是两公里外的另一条街。" },
            { who: "顾客", en: "I gave the address on the phone and it was read back to me.", cn: "我是在电话里报的地址，而且被复述确认过。" },
            { who: "客服", en: "I can see the note. The agent wrote the postcode digits the other way round.", cn: "我看到记录了。客服把邮编的数字写反了。" },
            { who: "顾客", en: "So the label was wrong, not me.", cn: "所以是标签错了，不是我。" },
            { who: "客服", en: "It was our error. I'll re-label it and it goes out tonight at our cost.", cn: "是我们的错误。我重新打标签，今晚发出，费用我们承担。" },
            { who: "顾客", en: "The original postage, do I get that back?", cn: "原来的邮费退吗？" },
            { who: "客服", en: "No, because the service was attempted. But the second attempt is free.", cn: "不退，因为服务已经尝试过。但第二次寄免费。" },
            { who: "顾客", en: "Could you send me a photo of the corrected label before it goes?", cn: "发出之前能把更正后的标签拍照发我吗？" },
            { who: "客服", en: "That's a good idea and almost nobody asks. Sending it now.", cn: "这主意好，几乎没人这么要求。现在发。" }
          ]
        },
        {
          variant: "情绪型（重要文件寄丢）",
          relation: "顾客 · 邮局主管（急件未到）",
          register: "半正式（着急）",
          channel: "面对面（邮局）",
          barrier: "签证材料寄丢，截止日临近",
          result: "达成（启动追查、免费重寄、出具书面说明）",
          lines: [
            { who: "顾客", en: "I sent documents here eleven days ago and they haven't arrived.", cn: "我十一天前在这儿寄了文件，还没到。" },
            { who: "主管", en: "Express or standard?", cn: "加急还是普通？" },
            { who: "顾客", en: "Express, and I paid for tracking. The last scan is this office.", cn: "加急，而且我付了追踪费。最后一次扫描就在这个网点。" },
            { who: "主管", en: "Then it never left. I'm sorry.", cn: "那它根本没离开这里。对不起。" },
            { who: "顾客", en: "It's a visa application. The deadline is Friday and I can't reapply.", cn: "是签证申请。截止是周五，我没法重新申请。" },
            { who: "主管", en: "Let me do three things now: search the cage, start a formal trace, and give you a letter confirming it.", cn: "我现在做三件事：查库房、正式立案追查、给你一封说明信。" },
            { who: "顾客", en: "Will the letter help with the embassy?", cn: "那封信对使馆有用吗？" },
            { who: "主管", en: "It usually does. It states the date, the service, and that the failure is ours.", cn: "通常有用。上面写明日期、服务类型，并说明是我们的失误。" },
            { who: "顾客", en: "And if you find it?", cn: "如果找到了呢？" },
            { who: "主管", en: "Then it goes tonight at our cost, and I call you either way by five.", cn: "那今晚免费发出，而且无论结果如何我五点前都给你打电话。" },
            { who: "顾客", en: "Calling either way is what I needed to hear.", cn: "无论结果如何都打电话，这是我想听到的。" }
          ]
        },
        {
          variant: "渠道变体（手机银行跨境汇款）",
          relation: "顾客 · 银行电话客服",
          register: "半正式",
          channel: "手机银行 + 电话",
          barrier: "汇款显示已完成但没到账，实际卡在审核队列",
          result: "达成（补交材料 + 拿到单号与预计到账日）",
          lines: [
            { who: "顾客", en: "I sent a transfer on the app this morning. It says completed, but my landlord says nothing arrived.", cn: "我今早在应用上转了钱。显示已完成，但房东说没收到。" },
            { who: "客服", en: "International transfers show as completed before they clear.", cn: "跨境汇款在清算前就显示已完成。" },
            { who: "顾客", en: "Then the word completed is doing a lot of work.", cn: "那已完成这个词承担了太多含义。" },
            { who: "客服", en: "It is. Yours is in a review queue because it's a new payee.", cn: "确实。您这笔在审核队列里，因为是新收款人。" },
            { who: "顾客", en: "How long is the queue?", cn: "队列要多久？" },
            { who: "客服", en: "Twenty-four hours, and it clears the next working day after that.", cn: "二十四小时，之后下一个工作日到账。" },
            { who: "顾客", en: "Can you release it now? I can send you the tenancy agreement.", cn: "能现在放行吗？我可以把租约发您。" },
            { who: "客服", en: "I can't release it, but I can add the document to the file so the reviewer doesn't ask.", cn: "我没法放行，但可以把材料加进档案，这样审核员不会再问。" },
            { who: "顾客", en: "Then send me a reference so I can prove the timing to my landlord.", cn: "那给我一个单号，我好向房东证明时间。" },
            { who: "客服", en: "Reference and expected date, in writing, now.", cn: "单号和预计到账日，书面，现在发。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "公司财务 · 银行客户经理",
          register: "正式",
          channel: "面对面（银行会议室）",
          barrier: "无（但需正式议定汇率与费用安排）",
          result: "达成（做六期远期，费用与汇率分列）",
          lines: [
            { who: "经理", en: "Thank you for coming in. You wished to discuss your exposure to the euro.", cn: "谢谢您过来。您想讨论欧元敞口的问题。" },
            { who: "财务", en: "We invoice in euros and pay in sterling. The gap costs us every month.", cn: "我们用欧元开票、用英镑付款。这个缺口每月都在损钱。" },
            { who: "经理", en: "How much are we speaking about, and over what period?", cn: "大概多少，周期多长？" },
            { who: "财务", en: "About two hundred thousand a quarter, for the next two years.", cn: "每季度约二十万，未来两年。" },
            { who: "经理", en: "At that size a forward contract is appropriate. Would you prefer a fixed rate or a range?", cn: "这个规模适合做远期。您希望固定汇率还是区间？" },
            { who: "财务", en: "A fixed rate, because our board cannot manage a range it has to explain.", cn: "固定汇率，因为我们的董事会无法解释一个区间。" },
            { who: "经理", en: "Then I shall prepare a forward in six tranches, with a schedule of costs.", cn: "那我准备分六期的远期方案，附费用表。" },
            { who: "财务", en: "May I see the fees separately from the rate?", cn: "费用能和汇率分开列吗？" },
            { who: "经理", en: "You may, and I would insist on it. Blended pricing is how banks hide margin.", cn: "可以，而且我会坚持这么做。混合报价正是银行藏利润的方式。" },
            { who: "财务", en: "That is the most reassuring thing a banker has said to me.", cn: "这是银行人士对我说过最让人放心的一句话。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "顾客 · 邮局职员（寄明信片）",
          register: "随意（极简、俚语）",
          channel: "面对面（邮局）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "顾客", en: "how much to send this to japan", cn: "这个寄到日本多少钱" },
            { who: "职员", en: "letter or parcel", cn: "信件还是包裹" },
            { who: "顾客", en: "it's a postcard", cn: "是明信片" },
            { who: "职员", en: "then it's cheap. two fifty", cn: "那便宜。两块五" },
            { who: "顾客", en: "will it get there", cn: "能到吗" },
            { who: "职员", en: "eventually", cn: "最终能" },
            { who: "顾客", en: "how eventually", cn: "多最终" },
            { who: "职员", en: "two weeks. or three", cn: "两周。或者三周" },
            { who: "顾客", en: "i'll take my chances", cn: "我碰碰运气" },
            { who: "职员", en: "everyone does", cn: "大家都这样" }
          ]
        }
      ]
    },

    /* ==================== 03-01 看房与租房 ==================== */
    {
      id: "s03-01",
      domain: "03",
      title: "看房与租房",
      ielts: "口语 P2 场景 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "租客 · 中介（看房）",
          register: "半正式",
          channel: "面对面（看房现场）",
          barrier: "无",
          result: "达成（问清费用与条款后决定申请）",
          lines: [
            { who: "中介", en: "This is the one-bedroom on the second floor. No lift, I'm afraid.", cn: "这是二楼的一居室。抱歉，没有电梯。" },
            { who: "租客", en: "That's fine. How long has it been empty?", cn: "没关系。空了多久了？" },
            { who: "中介", en: "Three weeks. The last tenant left in June.", cn: "三周。上一位租客六月走的。" },
            { who: "租客", en: "Is the heating gas or electric?", cn: "暖气是燃气还是电的？" },
            { who: "中介", en: "Gas, and the boiler was replaced last year. Here's the certificate.", cn: "燃气，锅炉去年换过。这是证书。" },
            { who: "租客", en: "What's included in the rent?", cn: "租金包含什么？" },
            { who: "中介", en: "Water and building maintenance. Electricity and internet are yours.", cn: "水费和公共维修。电费和网络自理。" },
            { who: "租客", en: "And the deposit?", cn: "押金呢？" },
            { who: "中介", en: "Five weeks' rent, held in a protection scheme. You'll get the certificate.", cn: "五周租金，存在押金保护计划里。你会拿到凭证。" },
            { who: "租客", en: "How much notice do I give if I leave?", cn: "如果我要搬走，需要提前多久通知？" },
            { who: "中介", en: "One month, in writing, any time after the first six.", cn: "一个月，书面，头六个月之后随时。" },
            { who: "租客", en: "I'd like to apply. What do you need from me?", cn: "我想申请。需要我提供什么？" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "租客 · 房东（入住前修窗）",
          register: "半正式",
          channel: "面对面（看房现场）",
          barrier: "无（但要把口头承诺写进合同才肯签）",
          result: "达成（十四天内修好，租金从修好日起算）",
          lines: [
            { who: "租客", en: "The window in the bedroom doesn't close properly.", cn: "卧室的窗户关不严。" },
            { who: "房东", en: "It sticks in summer. You get used to it.", cn: "夏天有点卡。你会习惯的。" },
            { who: "租客", en: "I'd rather not get used to it. There's a draught and the road is loud.", cn: "我宁愿不习惯。有穿堂风，而且马路上很吵。" },
            { who: "房东", en: "I can have someone look at it after you move in.", cn: "你搬进来之后我可以让人看看。" },
            { who: "租客", en: "I'd prefer before, because after usually means never.", cn: "我希望在搬进来之前修，因为「之后」通常等于永远不修。" },
            { who: "房东", en: "That is a fair point, unfortunately.", cn: "这话没错，可惜是真的。" },
            { who: "租客", en: "Could we put it in the agreement as a condition of the tenancy?", cn: "能作为租约条件写进合同吗？" },
            { who: "房东", en: "I'll write it in as a repair within fourteen days, with the rent starting when it's done.", cn: "我写成十四天内修好，租金从修好那天起算。" },
            { who: "租客", en: "That is more than I asked for.", cn: "这比我要求的还多。" },
            { who: "房东", en: "It's cheaper than an argument in November.", cn: "这比十一月吵一架便宜。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "租客 · 中介（中介费与押金）",
          register: "半正式",
          channel: "面对面（中介办公室）",
          barrier: "中介费不肯减，只好改谈押金分期",
          result: "折中（签十八个月换押金分两期）",
          lines: [
            { who: "租客", en: "The agency fee is one month's rent plus tax. Can it be reduced?", cn: "中介费是一个月租金加税。能减吗？" },
            { who: "中介", en: "The fee is fixed by the agency and I can't move it.", cn: "费用是公司定的，我动不了。" },
            { who: "租客", en: "Then I won't argue about the fee. I'd like to ask about the deposit instead.", cn: "那我不争费用。我想问押金。" },
            { who: "中介", en: "Five weeks, as advertised.", cn: "五周，如广告所示。" },
            { who: "租客", en: "Could it be paid in two parts, with the second half at the end of the first month?", cn: "能分两期付吗，第二期在第一个月底？" },
            { who: "中介", en: "The landlord wants it before the keys.", cn: "房东希望交钥匙前付清。" },
            { who: "租客", en: "Then let me offer something in exchange: I'll sign for eighteen months instead of twelve.", cn: "那我给个交换条件：我签十八个月，而不是十二个月。" },
            { who: "中介", en: "...That changes the calculation. I'll ask him.", cn: "……那算法就不一样了。我去问他。" },
            { who: "租客", en: "And if he says no?", cn: "如果他说不呢？" },
            { who: "中介", en: "Then you pay in full, and I'll take the fee question to my manager.", cn: "那你付全款，我去跟经理谈费用的事。" },
            { who: "租客", en: "That's two offers instead of one no.", cn: "这是两个方案，而不是一个不字。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "租客 · 中介（广告与实况不符）",
          register: "半正式",
          channel: "面对面（看房现场）",
          barrier: "广告写「带家具」，实际只有一张床",
          result: "修复（次日中午前书面答复：补齐或改广告）",
          lines: [
            { who: "租客", en: "The advert said furnished. This has a bed and nothing else.", cn: "广告写的是带家具。这里只有一张床，其他什么都没有。" },
            { who: "中介", en: "Furnished means different things to different landlords.", cn: "带家具对不同房东意思不一样。" },
            { who: "租客", en: "Then let's make it mean one thing. May I photograph the advert?", cn: "那我们把它统一成一个意思。我能拍一下广告吗？" },
            { who: "中介", en: "You can. ...It does say sofa, table and washing machine.", cn: "可以。……确实写了沙发、桌子和洗衣机。" },
            { who: "租客", en: "So the advert is a list, and the flat is missing three items.", cn: "所以广告是份清单，而房子缺了三样。" },
            { who: "中介", en: "It was the previous tenant's furniture that went, not ours. He took the sofa.", cn: "走掉的是上一位租客的家具，不是我们的。他把沙发搬走了。" },
            { who: "租客", en: "That's his problem and yours, not mine.", cn: "那是他和你们的问题，不是我的。" },
            { who: "中介", en: "Fair. Give me until tomorrow and I'll either replace them or amend the advert.", cn: "说得对。给我到明天，我要么补齐，要么改广告。" },
            { who: "租客", en: "Replace or amend, but tell me which in writing.", cn: "补齐或者改广告都行，但书面告诉我是哪一种。" },
            { who: "中介", en: "In writing by noon tomorrow.", cn: "明天中午前书面给你。" }
          ]
        },
        {
          variant: "情绪型（押金被扣）",
          relation: "租客 · 房东（退租检查）",
          register: "半正式（情绪化）",
          channel: "面对面（退租房屋）",
          barrier: "房东用「磨损」和清洁费扣掉全部押金",
          result: "达成（照片对上入住清单，只扣坏掉的百叶窗）",
          lines: [
            { who: "房东", en: "I'm keeping three hundred for cleaning and the mark on the wall.", cn: "我要扣三百，清洁费和墙上的印子。" },
            { who: "租客", en: "The mark was there when I moved in. It's on the inventory.", cn: "那印子我搬进来时就有。清单上有。" },
            { who: "房东", en: "The inventory isn't a photograph.", cn: "清单不是照片。" },
            { who: "租客", en: "It isn't, but I have photographs. Forty of them, dated the day I got the keys.", cn: "不是，但我有照片。四十张，日期就是我拿钥匙那天。" },
            { who: "房东", en: "...Let me see the wall.", cn: "……让我看看那面墙。" },
            { who: "租客", en: "Here. Same mark, same corner. And the cleaning: I paid a company, and here's the receipt.", cn: "这里。同一个印子，同一个角落。清洁也一样：我请了公司，这是收据。" },
            { who: "房东", en: "Then the cleaning shouldn't be charged either.", cn: "那清洁费也不该收。" },
            { who: "租客", en: "So what is left to charge?", cn: "那还剩什么可扣的？" },
            { who: "房东", en: "The broken blind, which is genuinely mine to charge.", cn: "那个坏掉的百叶窗，这个确实该扣。" },
            { who: "租客", en: "The blind I'll accept. I'd like the rest back within ten days.", cn: "百叶窗我认。其余的希望在十天内退回。" },
            { who: "房东", en: "Ten days, and I'll say in writing what the blind cost.", cn: "十天。而且我会书面写明百叶窗花了多少。" }
          ]
        },
        {
          variant: "渠道变体（视频看房）",
          relation: "租客 · 中介（视频看房）",
          register: "半正式",
          channel: "视频看房",
          barrier: "镜头只对着好的一面，看不出噪音与环境",
          result: "达成（指定补拍位置 + 举稳听环境声）",
          lines: [
            { who: "租客", en: "Could you turn the camera towards the window? I want to see what's outside.", cn: "能把镜头转向窗户吗？我想看看外面是什么。" },
            { who: "中介", en: "It's a quiet street.", cn: "是条安静的街。" },
            { who: "租客", en: "Quiet streets are usually quiet because there's a motorway behind them. Could you show me?", cn: "安静的街通常是因为后面有条高速。能让我看看吗？" },
            { who: "中介", en: "Ha. Fair. Give me a second. ...It's a car park, actually.", cn: "哈，有道理。等一下。……其实是个停车场。" },
            { who: "租客", en: "Thank you. That's the sort of thing I need to know before paying a deposit from another country.", cn: "谢谢。这正是在国外付押金之前需要知道的事。" },
            { who: "中介", en: "What else would you like to see?", cn: "您还想看什么？" },
            { who: "租客", en: "The boiler, the water pressure, and inside the cupboards.", cn: "锅炉、水压，还有柜子里面。" },
            { who: "中介", en: "The pressure I can show you by running the tap.", cn: "水压我可以开龙头给您看。" },
            { who: "租客", en: "And could you hold the phone steady for ten seconds without talking? I want to hear the road.", cn: "还有，能举稳手机十秒不说话吗？我想听听马路的声音。" },
            { who: "中介", en: "Nobody has ever asked me that.", cn: "从来没人这么要求过。" },
            { who: "租客", en: "It's the only part a video can actually prove.", cn: "这是视频唯一能真正证明的东西。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "租客 · 房东代理（签约）",
          register: "正式",
          channel: "面对面（签约）",
          barrier: "无（但需逐条确认并当日取得副本）",
          result: "达成（签约，维修与押金条款明确）",
          lines: [
            { who: "代理", en: "We have the tenancy agreement. Shall we go through the clauses you queried?", cn: "租约在这里。我们过一遍您提出疑问的条款，好吗？" },
            { who: "租客", en: "Please. First, the repair obligation and the timescale.", cn: "好。第一，维修义务和时限。" },
            { who: "代理", en: "Clause nine: urgent repairs within twenty-four hours, others within fourteen days.", cn: "第九条：紧急维修二十四小时内，其他十四天内。" },
            { who: "租客", en: "And if the fourteen days pass?", cn: "如果十四天过了呢？" },
            { who: "代理", en: "You may instruct a contractor and deduct the cost, provided you give notice in writing first.", cn: "您可以自行请人维修并从租金中扣除，前提是先书面通知。" },
            { who: "租客", en: "That is acceptable. Second, the deposit scheme and the certificate.", cn: "这条可以。第二，押金计划和凭证。" },
            { who: "代理", en: "The deposit is registered within thirty days, and you receive the certificate directly from the scheme.", cn: "押金三十天内登记，凭证由押金计划直接寄给您。" },
            { who: "租客", en: "Directly is the important word. Third, the inventory.", cn: "「直接」是关键词。第三，房屋清单。" },
            { who: "代理", en: "You have seven days to amend it, and we both sign the amendment.", cn: "您有七天时间修改，修改后双方签字。" },
            { who: "租客", en: "Then I am content to sign, and I should like a copy of everything today.", cn: "那我愿意签，并且希望今天拿到全部文件的副本。" },
            { who: "代理", en: "You shall have it before you leave the room.", cn: "您离开这间屋子之前就会拿到。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "租客 · 中介（看房）",
          register: "随意（极简、俚语）",
          channel: "面对面（看房）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "租客", en: "how much", cn: "多少钱" },
            { who: "中介", en: "nine fifty a month", cn: "每月九百五" },
            { who: "租客", en: "bills", cn: "账单呢" },
            { who: "中介", en: "not included", cn: "不含" },
            { who: "租客", en: "so eleven hundred really", cn: "那实际是一千一" },
            { who: "中介", en: "about that", cn: "差不多" },
            { who: "租客", en: "when can i move in", cn: "什么时候能搬进来" },
            { who: "中介", en: "first of the month", cn: "一号" },
            { who: "租客", en: "i'll take it", cn: "我要了" },
            { who: "中介", en: "deposit first", cn: "先付押金" },
            { who: "租客", en: "obviously", cn: "那当然" }
          ]
        }
      ]
    },

    /* ==================== 03-02 签合同与押金纠纷 ==================== */
    {
      id: "s03-02",
      domain: "03",
      title: "签合同与押金纠纷",
      ielts: "口语 P3 场景 / 听力 S3",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "租客 · 有经验的朋友（看合同）",
          register: "随意",
          channel: "面对面（咖啡馆）",
          barrier: "无",
          result: "达成（找出三处该改的条款）",
          lines: [
            { who: "朋友", en: "Before you sign, read me the clause about the deposit.", cn: "签之前，把押金那条念给我听。" },
            { who: "租客", en: "It says the deposit may be withheld for any breach of the agreement.", cn: "写的是：任何违约都可以扣押金。" },
            { who: "朋友", en: "Any breach is doing a lot of work there. Ask them to list what counts.", cn: "「任何违约」这个词太含糊。让他们列明哪些算。" },
            { who: "租客", en: "And the notice period?", cn: "那通知期呢？" },
            { who: "朋友", en: "Two months? Standard is one.", cn: "两个月？标准是一个月。" },
            { who: "租客", en: "Two. They said it protects them if I leave in winter.", cn: "两个月。他们说这样如果我在冬天搬走能保护他们。" },
            { who: "朋友", en: "Then it should be one for you and one for them, or neither.", cn: "那就该对你对他都是一个月，或者都别要。" },
            { who: "租客", en: "There's also a line saying the landlord may enter with reasonable notice.", cn: "还有一条，说房东可在合理通知后进入。" },
            { who: "朋友", en: "Reasonable needs a number. Write twenty-four hours and put it in.", cn: "「合理」需要个数字。写成二十四小时，加进去。" },
            { who: "租客", en: "Three changes, then, and none of them is unreasonable.", cn: "那就三处改动，而且没有一处不讲理。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "租客 · 房东（不公平条款）",
          register: "半正式",
          channel: "面对面（签约前）",
          barrier: "无（但要逐条顶住不对等条款）",
          result: "达成（删掉两条、维修责任封顶五十镑）",
          lines: [
            { who: "租客", en: "Clause eleven lets you enter without notice in an emergency. What counts as an emergency?", cn: "第十一条说紧急情况下您可无需通知进入。什么算紧急？" },
            { who: "房东", en: "Water, fire, that sort of thing.", cn: "漏水、火灾这类。" },
            { who: "租客", en: "Then write those words in, because as it stands it covers anything.", cn: "那就把这两个词写进去，因为照现在这样它涵盖一切。" },
            { who: "房东", en: "It's standard.", cn: "这是标准条款。" },
            { who: "租客", en: "It isn't, and if it were, it would still be worth writing down.", cn: "不是；就算是，也值得写清楚。" },
            { who: "房东", en: "And clause fourteen?", cn: "那第十四条呢？" },
            { who: "租客", en: "It makes me responsible for all repairs, including structural ones.", cn: "那条让我负责所有维修，包括结构性的。" },
            { who: "房东", en: "Not the roof.", cn: "不包括屋顶。" },
            { who: "租客", en: "It says structural repairs are the tenant's where caused by neglect. Everything is caused by neglect if you argue hard enough.", cn: "它写的是因疏忽造成的结构维修由租客负责。只要争得够狠，什么都能说成疏忽。" },
            { who: "房东", en: "...We'll delete fourteen and cap your repairs at fifty pounds.", cn: "……那删掉第十四条，把您的维修责任上限设成五十镑。" },
            { who: "租客", en: "Then I'll sign today.", cn: "那我今天就签。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "租客 · 房东（补充函）",
          register: "半正式",
          channel: "面对面",
          barrier: "房东拒绝改合同正文，租客不肯照签",
          result: "折中（正文不动，另签一页补充函存档）",
          lines: [
            { who: "租客", en: "You won't change the contract, and I won't sign clause six as it is.", cn: "您不改合同，而第六条照现在这样我不签。" },
            { who: "房东", en: "It's a printed contract. I use it for all four flats.", cn: "这是印刷合同。我四套房都用这个。" },
            { who: "租客", en: "I understand that. Then let's not touch the printed part.", cn: "我理解。那我们不动印刷部分。" },
            { who: "房东", en: "What's the alternative?", cn: "那怎么办？" },
            { who: "租客", en: "A one-page side letter saying the pets clause does not apply to my cat, signed by both of us.", cn: "一页补充函，写明宠物条款不适用于我的猫，双方签字。" },
            { who: "房东", en: "A side letter has no legal weight.", cn: "补充函没有法律效力。" },
            { who: "租客", en: "It does if it's signed and refers to the clause. That is how a variation works.", cn: "如果签字并援引条款就有。合同变更就是这么做的。" },
            { who: "房东", en: "You've done this before.", cn: "你以前干过这事。" },
            { who: "租客", en: "I've been a tenant for eleven years.", cn: "我租了十一年房。" },
            { who: "房东", en: "One page, both signatures, and it goes in the file.", cn: "一页，双方签字，存档。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "租客 · 中介（合同与口头不一致）",
          register: "半正式",
          channel: "面对面（中介办公室）",
          barrier: "合同写的租期与租金跟周二口头谈的不一样",
          result: "修复（重出合同，修订处用颜色标出）",
          lines: [
            { who: "租客", en: "The contract says twelve months. We agreed eighteen, with a break at twelve.", cn: "合同写的是十二个月。我们谈好的是十八个月，第十二个月可解约。" },
            { who: "中介", en: "The landlord's standard term is twelve.", cn: "房东的标准期限是十二个月。" },
            { who: "租客", en: "Then either he changed his mind, or this was typed before the conversation.", cn: "那要么他改主意了，要么这份是谈话之前就打好字的。" },
            { who: "中介", en: "It was prepared last week.", cn: "是上周准备的。" },
            { who: "租客", en: "So the conversation on Tuesday never reached the document.", cn: "那周二的谈话没进这份文件。" },
            { who: "中介", en: "It appears not. I'll reissue it with the break clause.", cn: "看来没有。我重新出一份，加上解约条款。" },
            { who: "租客", en: "And mark the changed parts, so we can both see what moved.", cn: "而且把改动处标出来，我们都看得见变了什么。" },
            { who: "中介", en: "Tracked changes, in a different colour.", cn: "修订模式，用不同颜色。" },
            { who: "租客", en: "Then I'll read it tonight and sign tomorrow.", cn: "那我今晚看，明天签。" },
            { who: "中介", en: "I'll send the rent figure again too, because that was also different.", cn: "我把租金数字也再发一遍，那个也不一样。" }
          ]
        },
        {
          variant: "情绪型（押金被全额扣且无人回复）",
          relation: "租客 · 中介（三周无回复）",
          register: "半正式（情绪化）",
          channel: "电话 + 邮件",
          barrier: "三周四封邮件无人回复，押金已被全额扣走",
          result: "达成（中介限期举证，否则转押金计划争议）",
          lines: [
            { who: "租客", en: "I've emailed four times in three weeks. Nobody has replied.", cn: "三周里我发了四封邮件。没人回。" },
            { who: "中介", en: "The property manager left. Your file was reassigned.", cn: "房管离职了。您的档案被转给了别人。" },
            { who: "租客", en: "And in the meantime the whole deposit was deducted.", cn: "然后押金就被全额扣掉了。" },
            { who: "中介", en: "For cleaning and damage.", cn: "用于清洁和损坏。" },
            { who: "租客", en: "Which damage, and where is the evidence?", cn: "哪里的损坏，证据在哪？" },
            { who: "中介", en: "There's a report.", cn: "有份报告。" },
            { who: "租客", en: "A report written by the person who wants to keep my money is not evidence. I have the check-in inventory and forty photographs.", cn: "由想要留下我钱的人写的报告不算证据。我有入住清单和四十张照片。" },
            { who: "中介", en: "I'll ask for the check-out photographs.", cn: "我去要退租时的照片。" },
            { who: "租客", en: "If they don't exist, I'm opening a dispute with the deposit scheme on Monday.", cn: "如果没有，我周一向押金计划提起争议。" },
            { who: "中介", en: "That isn't necessary.", cn: "没这个必要。" },
            { who: "租客", en: "It became necessary the moment three weeks passed without a reply.", cn: "三周没有回复的那一刻起，它就有必要了。" }
          ]
        },
        {
          variant: "渠道变体（押金计划在线申请）",
          relation: "租客 · 押金计划客服",
          register: "半正式",
          channel: "在线申请 + 电话",
          barrier: "在线表格要求房东回应，房东不配合",
          result: "达成（单方提交程序，第一天先上传证据）",
          lines: [
            { who: "租客", en: "I'm starting a dispute. The form asks for the landlord's response.", cn: "我要提起争议。表格要求房东回应。" },
            { who: "客服", en: "You can submit without it. We invite them, and the clock runs either way.", cn: "没有也可以提交。我们会邀请他们，时限照走。" },
            { who: "租客", en: "What if he ignores the invitation?", cn: "如果他不理邀请呢？" },
            { who: "客服", en: "Then it's decided on the evidence you send, which is why photographs matter.", cn: "那就根据您提交的证据裁定，所以照片很重要。" },
            { who: "租客", en: "I have forty photographs and the signed inventory.", cn: "我有四十张照片和签过字的清单。" },
            { who: "客服", en: "Send those first, not last. Evidence uploaded on day one carries more weight.", cn: "那些先传，不要最后传。第一天上传的证据分量更重。" },
            { who: "租客", en: "Is that a rule or an impression?", cn: "这是规则还是感觉？" },
            { who: "客服", en: "An impression from handling these cases. The adjudicator reads the first file first.", cn: "是处理这些案子得出的感觉。裁定人先读第一份。" },
            { who: "租客", en: "Then I'll upload everything tonight.", cn: "那我今晚全部上传。" },
            { who: "客服", en: "And keep the originals. If it goes further, you'll want them dated.", cn: "原件留着。如果再往上走，你需要带日期的原件。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "租客 · 押金裁定员（书面听证）",
          register: "正式",
          channel: "书面陈述与听证",
          barrier: "无（但需正式陈述并举证）",
          result: "达成（按证据裁定，酌减后退还大部分押金）",
          lines: [
            { who: "裁定员", en: "You are claiming the return of the deposit in full. Please summarise your evidence.", cn: "您主张全额退还押金。请概述您的证据。" },
            { who: "租客", en: "I rely on three documents: the check-in inventory, forty dated photographs, and a cleaning receipt.", cn: "我依据三份材料：入住清单、四十张带日期的照片，和一张清洁收据。" },
            { who: "裁定员", en: "The landlord relies on a check-out report and an invoice for repainting.", cn: "房东依据退租报告和一张重新粉刷的发票。" },
            { who: "租客", en: "The invoice is dated eleven days after I returned the keys, and the flat was re-let within a week.", cn: "那张发票的日期是我交还钥匙十一天后，而房子一周内就重新出租了。" },
            { who: "裁定员", en: "You suggest the work was not done?", cn: "您是说那项工作没做？" },
            { who: "租客", en: "I suggest it cannot be shown to relate to my tenancy. I do not allege dishonesty.", cn: "我是说无法证明那与我这次租住相关。我不是在指控不诚实。" },
            { who: "裁定员", en: "That is the correct way to put it. Is the cleaning deduction also disputed?", cn: "这个说法恰当。清洁费的扣除也有争议吗？" },
            { who: "租客", en: "It is, and I have the receipt for the clean I paid for on the day of departure.", cn: "有争议，而且我有离房当天自己付的清洁收据。" },
            { who: "裁定员", en: "The decision will be issued in writing within ten working days.", cn: "裁决将在十个工作日内书面发出。" },
            { who: "租客", en: "Thank you. I have no further submissions.", cn: "谢谢。我没有其他陈述。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "合租室友之间",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "Sam", en: "landlord's keeping the deposit", cn: "房东不退押金" },
            { who: "Rob", en: "all of it", cn: "全不退？" },
            { who: "Sam", en: "all of it", cn: "全不退" },
            { who: "Rob", en: "why", cn: "为什么" },
            { who: "Sam", en: "cleaning", cn: "清洁" },
            { who: "Rob", en: "we cleaned it", cn: "我们打扫过了" },
            { who: "Sam", en: "he says not enough", cn: "他说不够干净" },
            { who: "Rob", en: "photos", cn: "照片呢" },
            { who: "Sam", en: "i took some", cn: "我拍了几张" },
            { who: "Rob", en: "then he's not keeping it", cn: "那他留不住" },
            { who: "Sam", en: "you think", cn: "你觉得？" },
            { who: "Rob", en: "i know. send them monday", cn: "我知道。周一发过去" }
          ]
        }
      ]
    },

    /* ==================== 03-03 报修与房东交涉 ==================== */
    {
      id: "s03-03",
      domain: "03",
      title: "报修与房东交涉",
      ielts: "口语 P2 场景 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "租客 · 房东（修锅炉）",
          register: "半正式",
          channel: "电话 + 短信",
          barrier: "无",
          result: "达成（约好师傅上门，责任划分写进消息）",
          lines: [
            { who: "租客", en: "The hot water has been off since Tuesday. I've tried the reset button.", cn: "热水从周二起就没了。我试过重启按钮。" },
            { who: "房东", en: "Did you check the pressure gauge?", cn: "你看过压力表吗？" },
            { who: "租客", en: "It's at zero point five. The manual says it should be between one and one point five.", cn: "在零点五。说明书说应该在一到一点五之间。" },
            { who: "房东", en: "Then it needs topping up. There's a valve under the sink.", cn: "那需要补水。水槽下面有个阀门。" },
            { who: "租客", en: "I'd rather not touch gas equipment. Could you send the engineer?", cn: "我不想碰燃气设备。您能派师傅来吗？" },
            { who: "房东", en: "That's sensible. I'll call him today.", cn: "这很明智。我今天联系他。" },
            { who: "租客", en: "When should I expect him? I need to be here.", cn: "他大概什么时候来？我得在家。" },
            { who: "房东", en: "Tomorrow morning, and I'll text you the time tonight.", cn: "明天上午，我今晚把时间发短信给你。" },
            { who: "租客", en: "Thank you. And if it's the boiler itself?", cn: "谢谢。如果是锅炉本身坏了呢？" },
            { who: "房东", en: "Then it's mine to replace, not yours to pay for.", cn: "那就是我该换的，不用你出钱。" },
            { who: "租客", en: "I'll put that in the message so we both have it.", cn: "我把这句写进消息里，我们双方都有记录。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "租客 · 房东（拖了九天）",
          register: "半正式",
          channel: "书面消息",
          barrier: "无（但要用法定程序把话说到位）",
          result: "达成（周四上门，书面确认）",
          lines: [
            { who: "租客", en: "This is the third message about the heating. It has been nine days.", cn: "这是关于暖气的第三条消息了。已经九天了。" },
            { who: "房东", en: "I've been busy. These things take time.", cn: "我一直很忙。这种事需要时间。" },
            { who: "租客", en: "I understand busy. What I don't understand is nine days in December.", cn: "我理解忙。我不理解的是十二月的九天。" },
            { who: "房东", en: "I'll get to it.", cn: "我会处理的。" },
            { who: "租客", en: "Then let me be clear about my next step, so that it isn't a surprise.", cn: "那我说清我下一步要做什么，免得变成意外。" },
            { who: "房东", en: "Go on.", cn: "说。" },
            { who: "租客", en: "I'm writing today, in writing, requesting the repair within fourteen days. If it isn't done, I may have it done and deduct the cost.", cn: "我今天书面提出，要求十四天内修好。如果没有，我可以自行维修并从租金中扣除。" },
            { who: "房东", en: "That's a threat.", cn: "这是威胁。" },
            { who: "租客", en: "It's the procedure. I would rather use it than a solicitor.", cn: "这是程序。我宁愿用它，而不是请律师。" },
            { who: "房东", en: "...I'll book the engineer for Thursday.", cn: "……我订周四的师傅。" },
            { who: "租客", en: "Thursday, confirmed in writing, and I'll stop there.", cn: "周四，书面确认，我就不再说什么了。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "租客 · 房东（洗衣机反复坏）",
          register: "半正式",
          channel: "书面消息",
          barrier: "房东只肯再修一次，不肯换新",
          result: "折中（第三次故障即更换，当场写进协议）",
          lines: [
            { who: "租客", en: "The washing machine floods every second wash. I'd like it replaced.", cn: "洗衣机每洗两次就溢水。我希望换一台。" },
            { who: "房东", en: "It's eight years old and it still works. I'll have it repaired.", cn: "它八年了，还能用。我让人修。" },
            { who: "租客", en: "It has been repaired twice this year. Third visit, same fault.", cn: "今年已经修过两次。第三次上门，同一处故障。" },
            { who: "房东", en: "One more repair.", cn: "再修一次。" },
            { who: "租客", en: "I'd accept that if it came with a condition.", cn: "如果有附加条件，我可以接受。" },
            { who: "房东", en: "Such as?", cn: "比如？" },
            { who: "租客", en: "If it fails a third time you replace it, and we write that in now rather than argue in March.", cn: "如果第三次再坏，您就换新，而且现在写进合同，而不是三月再争。" },
            { who: "房东", en: "And if it doesn't fail?", cn: "如果没坏呢？" },
            { who: "租客", en: "Then you've paid for one repair and I've stopped writing to you.", cn: "那您只花一次维修费，我也不再给您写信了。" },
            { who: "房东", en: "Fair. Third failure, replacement, in writing.", cn: "公道。第三次坏就换，写下来。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "租客 · 房东（师傅走错门）",
          register: "半正式",
          channel: "电话 + 短信",
          barrier: "师傅进了邻居家、修错锅炉，却留下「已修好」的字条",
          result: "修复（返工并由房东本人到场，约定二十四小时通知）",
          lines: [
            { who: "租客", en: "The engineer came on Wednesday while I was at work, and his note says he fixed it.", cn: "师傅周三来的，当时我在上班，他留的条子说修好了。" },
            { who: "房东", en: "So it's fixed.", cn: "那就是修好了。" },
            { who: "租客", en: "It isn't. He replaced a part on the neighbour's boiler. Flat six, not flat four.", cn: "没有。他换的是邻居家锅炉的零件。是六号房，不是四号房。" },
            { who: "房东", en: "...How do you know?", cn: "……你怎么知道？" },
            { who: "租客", en: "The part number on his invoice matches the one in the bin outside flat six.", cn: "他发票上的零件号，跟六号房门外垃圾桶里那个一致。" },
            { who: "房东", en: "That's a mistake, then.", cn: "那是个失误。" },
            { who: "租客", en: "It is, and it isn't mine to pay for. The hot water still doesn't run.", cn: "是失误，而且不该我付钱。热水还是不出。" },
            { who: "房东", en: "I'll get him back tomorrow and I'll be there myself.", cn: "我让他明天再来，我自己到场。" },
            { who: "租客", en: "That's the key part. Nobody should be in my flat without me again.", cn: "这才是关键。以后我不在，任何人不该进我的房子。" },
            { who: "房东", en: "Agreed, and I'll give you twenty-four hours' notice in writing.", cn: "同意，而且我会提前二十四小时书面通知你。" }
          ]
        },
        {
          variant: "情绪型（冬天没有暖气）",
          relation: "租客 · 房东（孩子受冻）",
          register: "半正式（情绪化）",
          channel: "电话",
          barrier: "房东一拖再拖，孩子冻着，租客情绪爆发",
          result: "达成（当天四点上门送电暖器）",
          lines: [
            { who: "租客", en: "I have a two-year-old and no heating. It's four degrees in the bedroom.", cn: "我有个两岁的孩子，没有暖气。卧室里四度。" },
            { who: "房东", en: "I'll look at it next week.", cn: "我下周看看。" },
            { who: "租客", en: "Next week is not an answer to a cold child. I'm not going to be polite about this any more.", cn: "对一个受冻的孩子来说，下周不是答案。这件事我不再客气了。" },
            { who: "房东", en: "There's no need to take that tone.", cn: "没必要用这种语气。" },
            { who: "租客", en: "You're right. Here's a calmer version: I need a date today, and if I don't have one, I'm calling the council housing team.", cn: "你说得对。那我说个更冷静的版本：我今天就要一个日期；如果没有，我就打给市政住房部门。" },
            { who: "房东", en: "...I can come at four.", cn: "……我四点能到。" },
            { who: "租客", en: "Four today?", cn: "今天四点？" },
            { who: "房东", en: "Four today. I'll bring the space heaters from the other flat.", cn: "今天四点。我把另一套房子的电暖器带来。" },
            { who: "租客", en: "Then I'll hold off on the council, and I'll tell them the same if they call.", cn: "那我先不打给市政，如果他们打来我也这么说。" },
            { who: "房东", en: "Thank you. And I should have come on Monday.", cn: "谢谢。我周一本该来的。" }
          ]
        },
        {
          variant: "渠道变体（App 报修工单）",
          relation: "租客 · 维修平台客服",
          register: "半正式",
          channel: "报修 App + 电话",
          barrier: "工单九天停在「处理中」，没有日期",
          result: "达成（补上目标日期与回电承诺）",
          lines: [
            { who: "租客", en: "I logged the repair nine days ago. The app says in progress.", cn: "我九天前报的修。应用显示处理中。" },
            { who: "客服", en: "In progress means it's with a contractor.", cn: "处理中意味着已派给承包商。" },
            { who: "租客", en: "The same status has shown since day one, and there's no date.", cn: "从第一天起就是同一个状态，而且没有日期。" },
            { who: "客服", en: "The contractor has fourteen days under the agreement.", cn: "按协议承包商有十四天。" },
            { who: "租客", en: "Then the app should say that, rather than a status that sounds like movement.", cn: "那应用就该这么写，而不是一个听起来像有进展的状态。" },
            { who: "客服", en: "I agree. I'll add the target date to your job now.", cn: "我同意。我现在就把目标日期加到您的工单上。" },
            { who: "租客", en: "What is the target date?", cn: "目标日期是哪天？" },
            { who: "客服", en: "The twelfth, which is day fourteen. If nobody has called by day ten, phone us.", cn: "十二号，也就是第十四天。如果第十天还没人联系，打电话给我们。" },
            { who: "租客", en: "Day ten is a Friday. Will anyone answer?", cn: "第十天是周五。有人接吗？" },
            { who: "客服", en: "The line is open until eight, and I'll note on the job that you want a call by day nine.", cn: "线路开到八点。另外我在工单上注明，您希望第九天前回电。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "租客 · 房东代理（正式交涉）",
          register: "正式",
          channel: "面对面（正式会面）",
          barrier: "无（但需正式陈述三项问题并要求书面日期）",
          result: "达成（周五前书面确认三处维修日期）",
          lines: [
            { who: "代理", en: "You have written to us about the repairs. We are here to resolve them.", cn: "您已就维修事宜致函我们。我们今天来解决问题。" },
            { who: "租客", en: "There are three items: the heating, the extractor fan, and the damp patch in the corner.", cn: "有三项：暖气、排风扇，和角落的潮湿痕迹。" },
            { who: "代理", en: "Two are maintenance. The damp we may attribute to ventilation.", cn: "两项属于维护。潮湿我们可能归因于通风。" },
            { who: "租客", en: "That is possible, which is why I have not removed the patch or painted over it.", cn: "有可能，所以我没有清除这块痕迹，也没有刷漆盖住。" },
            { who: "代理", en: "You did right. The surveyor should see it as it is.", cn: "您做得对。鉴定人应该看到原样。" },
            { who: "租客", en: "I should like all three addressed within the fourteen days specified in the agreement.", cn: "我希望三项都在协议约定的十四天内处理。" },
            { who: "代理", en: "We shall confirm dates in writing by Friday, and the surveyor will attend next week.", cn: "我们周五前书面确认日期，鉴定人下周上门。" },
            { who: "租客", en: "May I ask that the surveyor attends with me present?", cn: "我可以要求鉴定人在我在场时来吗？" },
            { who: "代理", en: "You may, and it is advisable. Some findings are disputed afterwards.", cn: "可以，而且建议如此。有些结论事后会有争议。" },
            { who: "租客", en: "Then I shall keep the day free.", cn: "那我把那天留出来。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "租客 · 房东（短信）",
          register: "随意（极简、俚语）",
          channel: "短信",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "租客", en: "boiler's dead", cn: "锅炉坏了" },
            { who: "房东", en: "again", cn: "又坏了" },
            { who: "租客", en: "again", cn: "又坏了" },
            { who: "房东", en: "i'll send someone", cn: "我派个人去" },
            { who: "租客", en: "when", cn: "什么时候" },
            { who: "房东", en: "soon", cn: "很快" },
            { who: "租客", en: "soon isn't a day", cn: "很快不是日期" },
            { who: "房东", en: "thursday", cn: "周四" },
            { who: "租客", en: "thursday, what time", cn: "周四，几点" },
            { who: "房东", en: "morning", cn: "上午" },
            { who: "租客", en: "i'll be here", cn: "我在家" }
          ]
        }
      ]
    },

    /* ==================== 03-04 邻居交涉与水电网络开通 ==================== */
    {
      id: "s03-04",
      domain: "03",
      title: "邻居交涉与水电网络开通",
      ielts: "口语 P2 场景 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "租客 · 楼下邻居（噪音）",
          register: "随意",
          channel: "面对面（敲门）",
          barrier: "无",
          result: "达成（挪音箱 + 以后提前打招呼）",
          lines: [
            { who: "租客", en: "Hi, I'm from number twelve. Have you got a minute?", cn: "你好，我住十二号。你有空吗？" },
            { who: "邻居", en: "Sure.", cn: "有。" },
            { who: "租客", en: "The music last night was loud until about two. Was that you?", cn: "昨晚的音乐响到两点左右。是你家吗？" },
            { who: "邻居", en: "It was. Sorry, it was a birthday.", cn: "是我。抱歉，是生日聚会。" },
            { who: "租客", en: "That's fine, birthdays happen. My bedroom is directly above your speaker, so it's the bass more than the volume.", cn: "没关系，生日总会有。我卧室就在你音箱正上方，主要是低音，不是音量。" },
            { who: "邻居", en: "I didn't know that. I can move the speaker off the wall.", cn: "我不知道。我可以把音箱从墙边挪开。" },
            { who: "租客", en: "That would probably fix it. And if you're having people over, a text the day before is enough for me.", cn: "那大概就能解决。如果下次有人来，提前一天发条消息给我就够了。" },
            { who: "邻居", en: "I'll do both. What's your number?", cn: "两样我都做。你号码多少？" },
            { who: "租客", en: "Here. I'm not asking you to be silent, by the way.", cn: "给你。顺便说一句，我不是要你完全没声音。" },
            { who: "邻居", en: "I know. You came to the door, which is more than most people do.", cn: "我知道。你是来敲门的，比大多数人强。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "租客 · 楼上装修邻居",
          register: "半正式",
          channel: "面对面 + 物业",
          barrier: "无（但要用楼规和物业把话逼实）",
          result: "达成（改为九点开工，不惊动物业）",
          lines: [
            { who: "租客", en: "This is the third time I've knocked. The drilling starts at seven every morning.", cn: "这是我第三次敲门了。每天早上七点就开始钻。" },
            { who: "邻居", en: "It's a renovation. It has to happen.", cn: "在装修。总得做。" },
            { who: "租客", en: "It does. The building rules say work starts at nine.", cn: "是要做。楼里的规定是九点才能开工。" },
            { who: "邻居", en: "The rules say a lot of things.", cn: "规定还说很多别的呢。" },
            { who: "租客", en: "They do, and I'm not going to argue about them in a doorway. I'm going to the management office.", cn: "确实。我不打算在门口跟你争这些。我去物业办公室。" },
            { who: "邻居", en: "That's a bit much.", cn: "有点过分吧。" },
            { who: "租客", en: "It's the third conversation. The first two were friendly and nothing changed.", cn: "这是第三次谈了。前两次都很客气，但什么都没变。" },
            { who: "邻居", en: "...Fine, nine o'clock.", cn: "……行，九点。" },
            { who: "租客", en: "Nine o'clock, and I'll tell the management we resolved it, so nobody gets a letter.", cn: "九点。而且我会告诉物业我们解决了，免得有人收到通知函。" },
            { who: "邻居", en: "All right. Thanks for that.", cn: "好。谢谢。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "租客 · 邻居（公共下水道）",
          register: "随意",
          channel: "面对面",
          barrier: "邻居要你全额承担公共管道疏通费",
          result: "折中（对半分摊，并由水管工判断成因）",
          lines: [
            { who: "邻居", en: "The shared drain is blocked again and it's on your side. You should pay for it.", cn: "公共下水道又堵了，堵在你那边。应该你付钱。" },
            { who: "租客", en: "It's a shared drain. We both use it.", cn: "是公共下水道。我们都在用。" },
            { who: "邻居", en: "It backs up on your side, so it's your problem.", cn: "堵在你那边，所以是你的问题。" },
            { who: "租客", en: "It backs up on my side because it's lower, not because I caused it. I'm not paying all of it.", cn: "堵在我这边是因为位置低，不是因为我造成的。我不会全额付。" },
            { who: "邻居", en: "Then what do you propose?", cn: "那你说怎么办？" },
            { who: "租客", en: "Two things: we split the cost, and we both stop putting cooking oil down the sink.", cn: "两件事：费用对半分；而且我们都别再往水槽倒油。" },
            { who: "邻居", en: "I don't put oil down the sink.", cn: "我不倒油。" },
            { who: "租客", en: "Then the plumber can tell us what he found, and I'll accept his answer either way.", cn: "那让水管工告诉我们他发现了什么，不管结果如何我都接受。" },
            { who: "邻居", en: "Fine. Split it, and ask him.", cn: "行。对半分，你问他。" },
            { who: "租客", en: "And if it blocks again in a month, we call him together.", cn: "如果一个月内又堵，我们一起叫他。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "租客 · 水电公司客服（账户挂错房号）",
          register: "半正式",
          channel: "电话客服",
          barrier: "电费账户登记成九号房，替别人付了六周",
          result: "修复（转户 + 六周退款，电表照片作证）",
          lines: [
            { who: "客服", en: "Your account is registered to flat nine, not flat four.", cn: "您的账户登记的是九号房，不是四号房。" },
            { who: "租客", en: "I gave the address on the phone and I've been paying for six weeks.", cn: "我是在电话里报的地址，而且已经付了六周。" },
            { who: "客服", en: "Which means flat nine has had free electricity for six weeks.", cn: "也就是说九号房免费用了六周的电。" },
            { who: "租客", en: "And I've been paying for their usage.", cn: "而我在替他们的用电付费。" },
            { who: "客服", en: "It appears so. I'm sorry.", cn: "看来是这样。对不起。" },
            { who: "租客", en: "Can it be corrected without charging me a second address change?", cn: "能改过来而不收我第二次改址费吗？" },
            { who: "客服", en: "Yes, because the first one was our error. What is your meter number?", cn: "可以，因为第一次是我们的错误。您的电表号是多少？" },
            { who: "租客", en: "It's on the meter in the hall. I photographed it when I moved in.", cn: "在走廊的电表上。我搬进来时拍了照。" },
            { who: "客服", en: "That photograph solves it. I'll transfer the account and raise a refund for the six weeks.", cn: "这张照片就解决了。我转移账户，并就这六周发起退款。" },
            { who: "租客", en: "Photographing the meter was the most useful thing I did that week.", cn: "给电表拍照是我那周做过最有用的事。" }
          ]
        },
        {
          variant: "情绪型（三周没睡好）",
          relation: "租客 · 养狗的邻居",
          register: "随意（情绪化）",
          channel: "面对面",
          barrier: "狗从早上六点开始叫，租客三周没睡好",
          result: "达成（挂窗帘 + 六点半前关在屋里，两周试验期）",
          lines: [
            { who: "租客", en: "I haven't slept properly in three weeks. Your dog barks from six.", cn: "我三周没睡好觉了。你的狗从六点就开始叫。" },
            { who: "邻居", en: "He's a dog. Dogs bark.", cn: "它是狗。狗会叫。" },
            { who: "租客", en: "They do, and I'm not asking for silence. I'm asking for six in the morning not to be the start.", cn: "是会叫，我不是要求完全没有声音。我是说别从早上六点就开始。" },
            { who: "邻居", en: "I leave for work at seven.", cn: "我七点出门上班。" },
            { who: "租客", en: "I know. That's why I'm here rather than complaining to the council.", cn: "我知道。所以我才来跟你说，而不是去投诉。" },
            { who: "邻居", en: "What would help?", cn: "那怎么才能好点？" },
            { who: "租客", en: "Two things: a curtain over the window he looks out of, and him inside until half six.", cn: "两件事：他望出去的那扇窗挂个窗帘；六点半之前让他在屋里。" },
            { who: "邻居", en: "The curtain I can do tonight.", cn: "窗帘我今晚就能挂。" },
            { who: "租客", en: "And I'll wear earplugs for a fortnight while we test it, so we're not guessing which worked.", cn: "那两周我戴耳塞，我们试出来到底是哪一项管用。" },
            { who: "邻居", en: "That's more patient than I would have been.", cn: "换我早就没这个耐心了。" }
          ]
        },
        {
          variant: "渠道变体（开通宽带：电话 + 自助安装）",
          relation: "租客 · 宽带客服",
          register: "半正式",
          channel: "电话 + 自助安装",
          barrier: "路由器被投到邻居家，激活日已过",
          result: "达成（当天补发，线路不变，直达分机）",
          lines: [
            { who: "客服", en: "Your activation date is the fourteenth, and the router arrives by post.", cn: "您的开通日期是十四号，路由器邮寄到。" },
            { who: "租客", en: "The router hasn't arrived and today is the fifteenth.", cn: "路由器还没到，今天十五号了。" },
            { who: "客服", en: "The tracking says delivered to a neighbour.", cn: "物流显示送到邻居家了。" },
            { who: "租客", en: "Nobody asked me whether that was acceptable. I live in a block of twelve.", cn: "没人问过我这样行不行。我这栋楼有十二户。" },
            { who: "客服", en: "It's the courier's policy when nobody answers.", cn: "这是没人应门时快递公司的做法。" },
            { who: "租客", en: "I was in. There's a doorbell and it logs the time.", cn: "我在家。门铃有记录，能查时间。" },
            { who: "客服", en: "Then they didn't ring. I'll send a replacement today and log the complaint.", cn: "那就是他们没按。我今天补发一个，并记录投诉。" },
            { who: "租客", en: "Will the activation date move?", cn: "开通日期会变吗？" },
            { who: "客服", en: "No, the line is live. You can use it the moment the router arrives.", cn: "不会，线路已经开通。路由器一到就能用。" },
            { who: "租客", en: "So plug it in and it works, with no further calls?", cn: "那就是插上就能用，不用再打电话？" },
            { who: "客服", en: "One call, to me, and no queue. I've put my extension on the order.", cn: "如果不行就打给我一个人，不用排队。我把分机写在订单上了。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "租客 · 物业管理处（正式投诉）",
          register: "正式",
          channel: "面对面 + 书面",
          barrier: "无（但需提供完整记录并处理匿名要求）",
          result: "达成（物业致函全楼，投诉人姓名不出现）",
          lines: [
            { who: "租客", en: "I should like to lodge a complaint about persistent noise from flat nine, and I have a record.", cn: "我想就九号房长期噪音提出投诉，而且我有记录。" },
            { who: "管理", en: "Do you have dates and times?", cn: "有日期和时间吗？" },
            { who: "租客", en: "Twenty-two entries over five weeks, with the time, the duration, and where relevant the nature of the noise.", cn: "五周内二十二条记录，含时间、时长，必要时还写明噪音性质。" },
            { who: "管理", en: "That is more than most complaints contain. Have you raised it with the resident?", cn: "这比大多数投诉都详细。您跟住户本人提过吗？" },
            { who: "租客", en: "Twice, in person, politely, and I noted the dates.", cn: "当面提过两次，很客气，日期我也记了。" },
            { who: "管理", en: "Then the next step is a written warning from us. May we quote your record?", cn: "那下一步是我们发出书面警告。可以引用您的记录吗？" },
            { who: "租客", en: "You may, but I should prefer my name not to be used unless it becomes necessary.", cn: "可以，但除非必须，我希望不出现我的名字。" },
            { who: "管理", en: "That is standard. We shall write to all residents in the block instead.", cn: "这是常规做法。我们改为致函全楼住户。" },
            { who: "租客", en: "That is the better way, and I shall send you the record by email today.", cn: "这样更好，我今天邮件把记录发给您。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "租客 · 邻居（门口对话）",
          register: "随意（极简、俚语）",
          channel: "面对面（门口）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "邻居", en: "your music", cn: "你的音乐" },
            { who: "租客", en: "too loud", cn: "太吵？" },
            { who: "邻居", en: "bass", cn: "低音" },
            { who: "租客", en: "yeah, fair", cn: "行，有道理" },
            { who: "邻居", en: "can't hear my tv", cn: "我听不见电视" },
            { who: "租客", en: "i'll move the speaker", cn: "我把音箱挪开" },
            { who: "邻居", en: "cheers", cn: "谢了" },
            { who: "租客", en: "shut the door on your way out", cn: "出去时把门带上" },
            { who: "邻居", en: "what", cn: "什么" },
            { who: "租客", en: "joking", cn: "开玩笑" }
          ]
        }
      ]
    },

    /* ==================== 02-01 预约挂号与描述症状 ==================== */
    {
      id: "s02-01",
      domain: "02",
      title: "预约挂号与描述症状",
      ielts: "口语 P2 场景 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "病人 · 诊所前台",
          register: "半正式",
          channel: "面对面（诊所前台）",
          barrier: "无",
          result: "达成（约到当天护士门诊）",
          lines: [
            { who: "前台", en: "Good morning, Riverside Surgery. How can I help?", cn: "早上好，河畔诊所。需要什么帮助？" },
            { who: "病人", en: "I'd like an appointment. I've had a sore throat for five days.", cn: "我想预约。我喉咙痛了五天。" },
            { who: "前台", en: "Any fever?", cn: "发烧吗？" },
            { who: "病人", en: "Slight, in the evenings. It hasn't gone above thirty-eight.", cn: "晚上有点。没超过三十八度。" },
            { who: "前台", en: "We have a nurse appointment today at four, or a doctor on Thursday morning.", cn: "今天下午四点有护士门诊，或者周四上午有医生。" },
            { who: "病人", en: "What's the difference?", cn: "有什么区别？" },
            { who: "前台", en: "The nurse can examine and prescribe for throat infections; the doctor if it's more complicated.", cn: "护士可以检查咽喉感染并开药；更复杂的情况看医生。" },
            { who: "病人", en: "Then the nurse today, and I'll see the doctor if she thinks it's needed.", cn: "那今天看护士，如果她认为需要我再看医生。" },
            { who: "前台", en: "That's how it works. Four o'clock, and bring your card.", cn: "流程就是这样。四点，带上您的卡。" },
            { who: "病人", en: "I'll be there. Is there anything I should do before?", cn: "我会到。之前需要做什么吗？" },
            { who: "前台", en: "Drink water, and don't take anything for the fever an hour before, in case she wants to check.", cn: "喝水；看诊前一小时别吃退烧药，以防她要检查。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "病人 · 全科医生（争取转诊）",
          register: "半正式",
          channel: "面对面（诊室）",
          barrier: "无（但要用症状细节推翻「检查正常」的结论）",
          result: "达成（加急转诊，十天内无消息回电）",
          lines: [
            { who: "医生", en: "The blood tests are normal, so I don't think a referral is needed.", cn: "血检正常，所以我认为不需要转诊。" },
            { who: "病人", en: "I understand the tests are normal. What worries me is that the pain wakes me at night.", cn: "我理解检查正常。让我担心的是疼痛会把我夜里疼醒。" },
            { who: "医生", en: "How many nights?", cn: "几个晚上？" },
            { who: "病人", en: "Fourteen out of the last twenty. And I've lost four kilos without trying.", cn: "最近二十天里有十四天。而且我没刻意减重却瘦了四公斤。" },
            { who: "医生", en: "...You didn't mention the weight.", cn: "……你没提体重的事。" },
            { who: "病人", en: "I didn't know it mattered. That's why I'm giving you the detail rather than my conclusion.", cn: "我不知道这重要。所以我说细节，而不是我的结论。" },
            { who: "医生", en: "It matters, and it changes the picture. I'll refer you, and mark it urgent rather than routine.", cn: "这重要，而且改变了判断。我给您转诊，并标为加急而不是常规。" },
            { who: "病人", en: "Thank you. How long is urgent?", cn: "谢谢。加急要多久？" },
            { who: "医生", en: "Two weeks, and if you hear nothing in ten days, call me and I'll chase it.", cn: "两周；如果十天内没有消息，打给我，我来催。" },
            { who: "病人", en: "Ten days, and I'll call. Thank you for listening to the second half.", cn: "十天，我会打。谢谢您听完了后半段。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "病人 · 诊所前台（当天无号）",
          register: "半正式",
          channel: "电话",
          barrier: "想当天看病但没有号，最早周四",
          result: "折中（当天十一点电话问诊，必要时加号）",
          lines: [
            { who: "病人", en: "I need to see someone today. It's getting worse.", cn: "我今天必须看医生。情况在恶化。" },
            { who: "前台", en: "We're fully booked. The earliest is Thursday.", cn: "今天约满了。最早周四。" },
            { who: "病人", en: "Thursday is four days away. What can be done today?", cn: "周四还有四天。今天能做什么？" },
            { who: "前台", en: "I can book a telephone appointment at eleven, and if the doctor thinks you need to come in, she'll fit you in.", cn: "我可以给您约十一点电话问诊，如果医生认为您需要来，她会安排。" },
            { who: "病人", en: "Does that actually work, or is it a polite way of saying no?", cn: "这真的管用，还是换种方式说不？" },
            { who: "前台", en: "It works. Two or three people a day come in after the call.", cn: "管用。每天有两三个人打完电话就来。" },
            { who: "病人", en: "Then eleven. What should I have ready?", cn: "那就十一点。我该准备什么？" },
            { who: "前台", en: "Your temperature, what you've taken and when, and your symptoms in order.", cn: "体温、吃过什么药和什么时候吃的，还有按顺序列的症状。" },
            { who: "病人", en: "In order — that's the part I would have got wrong.", cn: "按顺序——这点我本来会弄错。" },
            { who: "前台", en: "It's the first thing she asks and the thing nobody has ready.", cn: "这是她问的第一件事，也是没人准备好的事。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "病人 · 药剂师（剂量说清）",
          register: "半正式",
          channel: "面对面（药房）",
          barrier: "用法说得含糊，差点理解成每三小时一片",
          result: "修复（把时间写在标签上，并说清漏服处理）",
          lines: [
            { who: "药剂师", en: "Take one tablet three times a day.", cn: "一天三次，每次一片。" },
            { who: "病人", en: "Three tablets a day, or one tablet every three hours?", cn: "是一天三片，还是每三小时一片？" },
            { who: "药剂师", en: "Three a day. With meals.", cn: "一天三片。随餐。" },
            { who: "病人", en: "That's what I thought, and I'd rather ask than guess. Could you write it on the box?", cn: "我也这么想，但我宁愿问而不是猜。能写在盒子上吗？" },
            { who: "药剂师", en: "I'll put the times on the label. Eight, one and six.", cn: "我把时间写在标签上。八点、一点、六点。" },
            { who: "病人", en: "And if I miss one?", cn: "如果漏了一次呢？" },
            { who: "药剂师", en: "Take it when you remember, unless it's nearly time for the next one. Don't double up.", cn: "想起来就补，除非快到下一次了。不要吃双份。" },
            { who: "病人", en: "What counts as nearly?", cn: "多近算近？" },
            { who: "药剂师", en: "Under four hours. And if you get a rash, stop and call us.", cn: "不到四小时。另外如果起疹子，停药并打给我们。" },
            { who: "病人", en: "Under four hours, no doubling, a rash means stop. That's clear.", cn: "不到四小时、不吃双份、起疹子就停。清楚了。" }
          ]
        },
        {
          variant: "情绪型（害怕，说不出口）",
          relation: "病人 · 医生（焦虑就诊）",
          register: "半正式（紧张）",
          channel: "面对面（诊室）",
          barrier: "紧张到忘词，回避了两个月才来",
          result: "达成（当天做心电图，并解释能查出什么）",
          lines: [
            { who: "病人", en: "I'm sorry, I've forgotten half of what I wanted to say.", cn: "抱歉，我想说的话忘了一半。" },
            { who: "医生", en: "That's normal. Do you have a list?", cn: "这很正常。你列了单子吗？" },
            { who: "病人", en: "I do, but it looks stupid written down.", cn: "列了，但写在纸上显得很蠢。" },
            { who: "医生", en: "Read it. I've seen worse, and I've written worse.", cn: "念吧。我见过更糟的，也写过更糟的。" },
            { who: "病人", en: "Chest pain when I climb stairs, and I've started avoiding stairs.", cn: "爬楼梯时胸口疼，而且我开始躲楼梯了。" },
            { who: "医生", en: "How long has the avoiding been going on?", cn: "躲了多久了？" },
            { who: "病人", en: "Two months. I didn't want to be the person who makes a fuss.", cn: "两个月。我不想成为大惊小怪的人。" },
            { who: "医生", en: "The avoiding is the symptom I care about most. Pain you can ignore; changing your life around it, you can't.", cn: "我最在意的是「躲」这个症状。疼可以忽略；为它改变生活就不行。" },
            { who: "病人", en: "Then I'm glad I came.", cn: "那我庆幸来了。" },
            { who: "医生", en: "So am I. We'll do an ECG today, and I'll explain what it does and doesn't tell us.", cn: "我也庆幸。今天做心电图，我会说明它能查出什么、查不出什么。" }
          ]
        },
        {
          variant: "渠道变体（线上问诊 App）",
          relation: "病人 · 问诊平台客服",
          register: "半正式",
          channel: "App 视频问诊 + 电话",
          barrier: "视频问诊没响铃，医生标记为无人接听",
          result: "达成（当天改约 + 报修响铃故障）",
          lines: [
            { who: "病人", en: "The app says my video appointment was at three, but nobody called.", cn: "应用说我的视频问诊是三点，但没人打来。" },
            { who: "客服", en: "The clinician tried twice. It says no answer.", cn: "医生试了两次。记录显示无人接听。" },
            { who: "病人", en: "My phone shows no missed calls. Would it come through the app rather than by phone?", cn: "我的手机没有未接来电。是通过应用打来，而不是打电话？" },
            { who: "客服", en: "It should come through the app, using data.", cn: "应该是通过应用、走网络的。" },
            { who: "病人", en: "Then my notifications were off. Is that on me?", cn: "那是我关了通知。这算我的问题吗？" },
            { who: "客服", en: "Partly, but the app should ring rather than notify. It's a known fault.", cn: "一部分是，但应用应该像电话一样响，而不是只推通知。这是已知问题。" },
            { who: "病人", en: "Can I be rebooked today?", cn: "今天能重新约吗？" },
            { who: "客服", en: "There's a slot at half four, and I'll phone you first to check the app is ringing.", cn: "四点半有一个号；我会先打电话给您，确认应用能响。" },
            { who: "病人", en: "Do that. And put the ringing fault on my record, in case it happens again.", cn: "就这么办。另外把这个响铃问题记在我档案里，以防再发生。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "病人 · 专科医生（转诊就诊）",
          register: "正式",
          channel: "面对面（医院诊室）",
          barrier: "无（但需正式陈述病史与用药）",
          result: "达成（当天抽血与超声，等结果不自行查）",
          lines: [
            { who: "医生", en: "You have been referred for investigation of the pain. May I take a history?", cn: "您因疼痛被转诊做检查。我可以问一下病史吗？" },
            { who: "病人", en: "Please. I have brought a written summary, in case my English fails me on the day.", cn: "请。我带了书面概述，以防当天英文卡住。" },
            { who: "医生", en: "That is helpful. When did the symptoms begin?", cn: "这很有帮助。症状什么时候开始的？" },
            { who: "病人", en: "In March, gradually, and they have not improved with rest.", cn: "三月，逐渐出现，休息后没有改善。" },
            { who: "医生", en: "Any family history of note?", cn: "有值得注意的家族史吗？" },
            { who: "病人", en: "My father had the same condition at fifty-five, and my sister has a thyroid problem, which is unrelated.", cn: "我父亲五十五岁时有同样的病症；我妹妹有甲状腺问题，与此无关。" },
            { who: "医生", en: "The distinction matters, thank you. Are you taking anything regularly?", cn: "这个区分很重要，谢谢。您平时在服药吗？" },
            { who: "病人", en: "Two, both listed with doses and times. I have not stopped anything without advice.", cn: "两种，剂量和时间都列了。我没有在未被告知的情况下停过任何药。" },
            { who: "医生", en: "Then we can proceed. Today's tests are bloods and an ultrasound, and neither requires preparation.", cn: "那我们可以继续。今天的检查是抽血和超声，都不需要准备。" },
            { who: "病人", en: "I shall wait for the results rather than look them up online.", cn: "我会等结果，而不是上网自己查。" },
            { who: "医生", en: "That is the single most useful thing a patient can say.", cn: "这是病人能说最有用的的一句话。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "病人 · 诊所前台（电话约号）",
          register: "随意（极简、俚语）",
          channel: "电话",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "病人", en: "got any appointments", cn: "还有号吗" },
            { who: "前台", en: "when for", cn: "什么时候" },
            { who: "病人", en: "today", cn: "今天" },
            { who: "前台", en: "nothing today", cn: "今天没有" },
            { who: "病人", en: "tomorrow", cn: "明天" },
            { who: "前台", en: "half nine or half four", cn: "九点半或四点半" },
            { who: "病人", en: "half nine", cn: "九点半" },
            { who: "前台", en: "name", cn: "姓名" },
            { who: "病人", en: "reid", cn: "Reid" },
            { who: "前台", en: "spell it", cn: "拼一下" },
            { who: "病人", en: "r e i d", cn: "r e i d" },
            { who: "前台", en: "see you tomorrow", cn: "明天见" }
          ]
        }
      ]
    },

    /* ==================== 02-02 急诊与药店买药 ==================== */
    {
      id: "s02-02",
      domain: "02",
      title: "急诊与药店买药",
      ielts: "口语 P2 场景 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "顾客 · 药剂师（感冒买药）",
          register: "半正式",
          channel: "面对面（药房）",
          barrier: "无",
          result: "达成（因在服降压药改推荐生理盐水喷雾）",
          lines: [
            { who: "药剂师", en: "How can I help?", cn: "需要什么帮助？" },
            { who: "顾客", en: "I need something for a cold. I've had it four days.", cn: "我需要治感冒的药。已经四天了。" },
            { who: "药剂师", en: "Any chesty cough, or is it all in your head?", cn: "有痰咳吗，还是都在鼻子上？" },
            { who: "顾客", en: "Just blocked, and a headache. No cough.", cn: "就是鼻塞和头痛。不咳嗽。" },
            { who: "药剂师", en: "Then a decongestant and paracetamol. Are you taking anything else?", cn: "那就通鼻剂加扑热息痛。您还在吃别的药吗？" },
            { who: "顾客", en: "Blood pressure tablets.", cn: "降压药。" },
            { who: "药剂师", en: "Then not this one. Decongestants raise blood pressure. Take the saline spray instead.", cn: "那就不能用这个。通鼻剂会升血压。改用生理盐水喷雾。" },
            { who: "顾客", en: "Is the saline as effective?", cn: "生理盐水效果一样吗？" },
            { who: "药剂师", en: "Slower, and safe for you. That's the trade.", cn: "慢一些，但对您安全。这就是取舍。" },
            { who: "顾客", en: "I'll take the slower one. Thank you for asking about the tablets.", cn: "那我要慢的那个。谢谢您问了降压药的事。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "病人 · 急诊分诊护士",
          register: "半正式",
          channel: "面对面（急诊分诊台）",
          barrier: "无（但要在「按需要排序」的规则里问出自己的顺位）",
          result: "达成（明确为紧急、约两小时，并知悉变化要立刻说）",
          lines: [
            { who: "护士", en: "What's brought you in tonight?", cn: "今晚是什么情况来的？" },
            { who: "病人", en: "I've had stomach pain since this morning. I want to be seen now.", cn: "我从今早开始肚子疼。我希望现在就看。" },
            { who: "护士", en: "I'll assess you, and you'll be seen in order of need, not of arrival.", cn: "我会评估，然后按需要而不是到达顺序就诊。" },
            { who: "病人", en: "That's what everyone is told after four hours.", cn: "这是每个人等了四小时后都会听到的话。" },
            { who: "护士", en: "Fair. Let me ask three questions and then tell you where you are.", cn: "有道理。我问三个问题，然后告诉你排在哪。" },
            { who: "病人", en: "Go on.", cn: "请问。" },
            { who: "护士", en: "Can you walk? Is the pain constant or in waves? Any blood?", cn: "你能走路吗？疼是持续的还是一阵阵的？有出血吗？" },
            { who: "病人", en: "I can walk, it comes in waves, and there's no blood.", cn: "能走，一阵阵的，没有出血。" },
            { who: "护士", en: "Then you're urgent rather than emergency. Two hours, and if anything changes, tell me at once.", cn: "那你是紧急，不是危急。两小时；如果有变化，立刻告诉我。" },
            { who: "病人", en: "Two hours I can plan for. That's better than being told nothing.", cn: "两小时我能安排。比什么都不说强。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "顾客 · 药剂师（要求抗生素）",
          register: "半正式",
          channel: "面对面（药房）",
          barrier: "没有处方买不到抗生素，顾客坚持上次有效",
          result: "折中（先止痛 + 当天号 + 把上次用药写给药医）",
          lines: [
            { who: "顾客", en: "I need antibiotics. I had these last time and they worked.", cn: "我要抗生素。上次吃这个很管用。" },
            { who: "药剂师", en: "I can't sell them without a prescription.", cn: "没有处方我不能卖。" },
            { who: "顾客", en: "It's the same infection.", cn: "是同一种感染。" },
            { who: "药剂师", en: "It may be, and I still can't. What I can do is three things.", cn: "也许是，但我还是不能卖。我能做三件事。" },
            { who: "顾客", en: "What?", cn: "什么？" },
            { who: "药剂师", en: "Pain relief now, a same-day appointment request, and a note of what worked last time for the doctor.", cn: "现在给止痛药、帮你申请当天号，并把上次有效的药写下来给医生看。" },
            { who: "顾客", en: "And if the doctor says no?", cn: "如果医生说不呢？" },
            { who: "药剂师", en: "Then you've lost an hour, not a week on the wrong antibiotic.", cn: "那你只损失一小时，而不是一周吃错药。" },
            { who: "顾客", en: "Last time I waited four days and it got worse.", cn: "上次我等了四天，结果更严重了。" },
            { who: "药剂师", en: "That is exactly why I'm making the appointment request now.", cn: "正因为如此，我现在就帮你申请号。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "病人 · 医生（部位说不清）",
          register: "半正式",
          channel: "面对面（诊室）",
          barrier: "母语里部位只有一个词，英文说错位置差点误判",
          result: "修复（用手指出位置 + 下次带母语书页照片）",
          lines: [
            { who: "医生", en: "So the pain is in your chest.", cn: "所以疼痛在胸部。" },
            { who: "病人", en: "Not in my chest. Under my ribs, on the right, and it goes through to my back.", cn: "不是胸部。在右肋下面，而且会穿到后背。" },
            { who: "医生", en: "That's a different area entirely. Why did you say chest?", cn: "那完全是另一个部位。你为什么说胸部？" },
            { who: "病人", en: "In my language there's one word for the whole front. I didn't know the English for this part.", cn: "在我的语言里整个前面只有一个词。我不知道这部分的英文。" },
            { who: "医生", en: "Show me with your hand.", cn: "用手给我指。" },
            { who: "病人", en: "Here. And it's worse after fatty food.", cn: "这里。而且吃了油腻的之后更疼。" },
            { who: "医生", en: "That changes my first thought, and it is a good thing you said it.", cn: "这改变了我的第一判断，幸好你说了。" },
            { who: "病人", en: "Should I bring a diagram next time?", cn: "下次我该带张图吗？" },
            { who: "医生", en: "Photograph the page in your language and show me. That works better than guessing.", cn: "把你看的那页拍下来给我看。这比猜好得多。" },
            { who: "病人", en: "I'll do that, and I'll say where the pain travels, not only where it starts.", cn: "我会的。而且我会说疼到哪里，不只是从哪儿开始。" }
          ]
        },
        {
          variant: "情绪型（孩子发烧）",
          relation: "家长 · 医生（幼儿发烧）",
          register: "半正式（焦急）",
          channel: "面对面（诊室）",
          barrier: "两夜没睡，被要求别担心却不知道要看什么",
          result: "达成（写明观察指标与夜间求助电话）",
          lines: [
            { who: "医生", en: "How long has the fever been going on?", cn: "发烧多久了？" },
            { who: "家长", en: "Two days, and it won't come down. I've been up all night.", cn: "两天了，一直退不下来。我一整夜没睡。" },
            { who: "医生", en: "Is she drinking?", cn: "她喝水吗？" },
            { who: "家长", en: "Yes, and she's still going to the toilet. I keep checking because someone told me to.", cn: "喝，而且还在上厕所。我一直检查，因为有人跟我说要盯着。" },
            { who: "医生", en: "That advice was right, and it is the reason I'm not worried about dehydration.", cn: "那条建议是对的，也正因为如此我不担心脱水。" },
            { who: "家长", en: "Then what is it?", cn: "那是什么病？" },
            { who: "医生", en: "Probably viral, which means time rather than antibiotics. I'll tell you what to watch for.", cn: "大概是病毒性的，也就是说需要时间，不需要抗生素。我告诉你该注意什么。" },
            { who: "家长", en: "I'd rather be told what to watch for than told not to worry.", cn: "我宁愿被告知要注意什么，而不是被告诉别担心。" },
            { who: "医生", en: "That is the right way round. A rash, drowsiness, or no wet nappies for eight hours and you come back tonight.", cn: "这个顺序是对的。起疹子、嗜睡，或者八小时没有湿尿布，今晚就回来。" },
            { who: "家长", en: "Written down?", cn: "能写下来吗？" },
            { who: "医生", en: "Written down, and here's the number for the out-of-hours service.", cn: "写下来，这是非工作时间的电话。" }
          ]
        },
        {
          variant: "渠道变体（线上配药 / 送药上门）",
          relation: "病人 · 在线药房客服",
          register: "半正式",
          channel: "App 订药 + 电话",
          barrier: "长期处方到期被驳回，手里只剩两天药量",
          result: "达成（加急复核 + 挂单待发，短信通知）",
          lines: [
            { who: "客服", en: "Your repeat prescription was rejected by the surgery.", cn: "您的长期处方被诊所驳回了。" },
            { who: "病人", en: "Why? I've had the same one for two years.", cn: "为什么？同样的处方我用了两年。" },
            { who: "客服", en: "The system says a review is due. It's a clinical check, not a refusal.", cn: "系统显示该复诊了。这是临床复核，不是拒绝。" },
            { who: "病人", en: "So I have no tablets and no appointment.", cn: "所以我现在既没药也没号。" },
            { who: "客服", en: "You have two days' worth if you're taking them as prescribed, and I can do two things.", cn: "按医嘱吃的话您还有两天的量，而我能做两件事。" },
            { who: "病人", en: "Please.", cn: "请说。" },
            { who: "客服", en: "I'll request an urgent review with the reason marked, and hold the order so it ships the hour it's approved.", cn: "我提交加急复核并注明原因，同时把订单挂起，批准后一小时内发出。" },
            { who: "病人", en: "How do I know it's been approved?", cn: "我怎么知道批准了？" },
            { who: "客服", en: "You'll get a text, and if you hear nothing by four tomorrow, call us and quote this number.", cn: "您会收到短信；如果明天四点前没消息，打电话报这个号码。" },
            { who: "病人", en: "Two days of tablets and a number. That's manageable.", cn: "两天的药加一个号码。这我能应付。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "病人 · 医院医生（入院确认）",
          register: "正式",
          channel: "面对面（病房）",
          barrier: "无（但需正式确认用药、过敏与近亲）",
          result: "达成（当晚补液与抽血，次日晨扫描）",
          lines: [
            { who: "医生", en: "You have been referred for admission. May I confirm your details and your medication?", cn: "您是转诊入院。我确认一下您的信息和用药，可以吗？" },
            { who: "病人", en: "Please. I have a list, including the two I take for blood pressure.", cn: "请。我有清单，包括我吃的两种降压药。" },
            { who: "医生", en: "Any allergies, and how were they established?", cn: "有过敏吗？是怎么确认的？" },
            { who: "病人", en: "Penicillin, confirmed by a rash as a child, and I have worn a warning bracelet since.", cn: "青霉素，小时候起疹子确认的，从那以后我一直戴警示手环。" },
            { who: "医生", en: "That is the clearest answer I have had today. Any advance decisions we should know about?", cn: "这是我今天听到最清楚的回答。有需要我们了解的预立医疗决定吗？" },
            { who: "病人", en: "None. My next of kin is my sister, and her number is on the form.", cn: "没有。我的近亲是我妹妹，号码在表上。" },
            { who: "医生", en: "We shall keep her informed. The plan is fluids, bloods, and a scan in the morning.", cn: "我们会保持通知她。方案是补液、抽血，明早做扫描。" },
            { who: "病人", en: "May I ask what you are looking for in the scan?", cn: "我可以问扫描在找什么吗？" },
            { who: "医生", en: "Stones, and if there are none, we look at the gallbladder.", cn: "结石；如果没有，我们就看胆囊。" },
            { who: "病人", en: "Thank you for saying what you are looking for rather than what you suspect.", cn: "谢谢您说的是在找什么，而不是您怀疑什么。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "顾客 · 药剂师（买头痛药）",
          register: "随意（极简、俚语）",
          channel: "面对面（药房）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "顾客", en: "anything for a headache", cn: "有治头痛的吗" },
            { who: "药剂师", en: "how bad", cn: "多严重" },
            { who: "顾客", en: "bad enough", cn: "够严重" },
            { who: "药剂师", en: "these ones", cn: "这种" },
            { who: "顾客", en: "how many", cn: "吃几片" },
            { who: "药剂师", en: "two. four hours apart", cn: "两片。间隔四小时" },
            { who: "顾客", en: "and if it doesn't go", cn: "要是不好呢" },
            { who: "药剂师", en: "come back", cn: "回来找我" },
            { who: "顾客", en: "cheers", cn: "谢了" }
          ]
        }
      ]
    },

    /* ==================== 02-03 报警报失与保险理赔 ==================== */
    {
      id: "s02-03",
      domain: "02",
      title: "报警报失与保险理赔",
      ielts: "口语 P2 场景 / 听力 S3",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "报案人 · 警察（钱包丢失）",
          register: "半正式",
          channel: "面对面（警察局）",
          barrier: "无",
          result: "达成（按失物登记备案，编号可用于补办证件）",
          lines: [
            { who: "警察", en: "You want to report a loss?", cn: "您要报失？" },
            { who: "报案人", en: "Yes. My wallet, on the bus this morning.", cn: "是的。我的钱包，今早落在公交车上。" },
            { who: "警察", en: "Was anything taken, or did you lose it?", cn: "是被偷了，还是您自己弄丢的？" },
            { who: "报案人", en: "I think I left it on the seat. I noticed at the next stop and the bus had gone.", cn: "我想是落在座位上了。下一站我才发现，车已经走了。" },
            { who: "警察", en: "Then it's a lost property report, not a theft. That matters for insurance.", cn: "那就是失物登记，不是盗窃。这对保险很重要。" },
            { who: "报案人", en: "Good to know. The contents matter more: cards, a residence permit, sixty euros.", cn: "这我很想知道。更重要的是里面的东西：卡、居留许可、六十欧。" },
            { who: "警察", en: "Cancel the cards first, today. The permit takes longer.", cn: "先去把卡停掉，今天就办。居留许可要久一些。" },
            { who: "报案人", en: "Will the report help with the permit?", cn: "这份记录对居留许可有帮助吗？" },
            { who: "警察", en: "Yes. Quote this number when you apply for the replacement.", cn: "有。补办的时候引用这个号码。" },
            { who: "报案人", en: "Then I'll do the cards now and come back for a copy.", cn: "那我就先去停卡，再回来取一份副本。" },
            { who: "警察", en: "Ask for me and I'll print it, otherwise you'll queue twice.", cn: "找我，我给你打印，不然你要排两次队。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "投保人 · 保险理赔员（被拒赔）",
          register: "半正式",
          channel: "电话 + 邮件",
          barrier: "无（但要用监控与收银时间推翻「无人看管」）",
          result: "达成（重开档案，五日内书面答复）",
          lines: [
            { who: "理赔员", en: "The claim is declined because the policy excludes items left unattended.", cn: "理赔被拒，因为保单不保无人看管的物品。" },
            { who: "投保人", en: "It was on me until I put it down for twenty seconds at the till.", cn: "它一直在我身上，直到我在收银台放下了二十秒。" },
            { who: "理赔员", en: "The adjuster's note says unattended.", cn: "定损员的记录写的是无人看管。" },
            { who: "投保人", en: "Then the note conflicts with the shop's camera, which I have requested.", cn: "那记录和店里的监控矛盾，我已经申请调取了。" },
            { who: "理赔员", en: "You have requested the footage?", cn: "您申请调取监控了？" },
            { who: "投保人", en: "And the till receipt with the time on it, which puts me at the counter when the phone was taken.", cn: "还有带时间的收银小票，它能证明手机被拿走时我就在柜台。" },
            { who: "理赔员", en: "That is new evidence. I'll reopen the file, and you'll hear within five days.", cn: "这是新证据。我重开档案，五天内给你答复。" },
            { who: "投保人", en: "In writing, either way, please.", cn: "无论结果如何，请书面通知。" },
            { who: "理赔员", en: "In writing. And I would suggest you upload the footage rather than describe it.", cn: "书面。另外建议您上传监控，而不是描述它。" },
            { who: "投保人", en: "I have it as a file already.", cn: "我已经有文件了。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "报案人 · 警察（自行车被盗）",
          register: "半正式",
          channel: "面对面（警察局）",
          barrier: "轻微盗窃不派警员，只让网上报案",
          result: "折中（当场在手机上填，警察核对后给编号）",
          lines: [
            { who: "警察", en: "For a stolen bicycle we don't send an officer. You can report it online.", cn: "自行车被盗我们不派警员。你可以在网上报案。" },
            { who: "报案人", en: "Online won't get me the number I need for insurance.", cn: "网上报案拿不到保险需要的号码。" },
            { who: "警察", en: "It does, actually. The online report gets a crime reference.", cn: "其实可以。网上报案也会生成案件编号。" },
            { who: "报案人", en: "Then why do people queue here for two hours?", cn: "那为什么大家在这儿排两小时队？" },
            { who: "警察", en: "Because they don't know that, and we are short-staffed.", cn: "因为他们不知道，而我们人手不足。" },
            { who: "报案人", en: "Could I do it here on my phone and have you check it's right?", cn: "我能在手机上填，然后请您帮我核对吗？" },
            { who: "警察", en: "That is the fastest thing you could have asked for. Sit down.", cn: "这是你能提的最快的办法。坐下吧。" },
            { who: "报案人", en: "What do I put for value?", cn: "价值填多少？" },
            { who: "警察", en: "What you paid, or what it costs to replace, whichever you can evidence.", cn: "你付的价，或者换新的价，哪个你能拿出证据就填哪个。" },
            { who: "报案人", en: "Then the replacement price, and I have the shop listing.", cn: "那填换新价，我有商店的页面截图。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "报案人 · 警察（编号念错）",
          register: "半正式",
          channel: "电话 + 现场",
          barrier: "编号里的斜杠没念出来，保险公司查不到",
          result: "修复（书面给出正确编号，并说明可下载 PDF）",
          lines: [
            { who: "报案人", en: "The crime reference I was given doesn't exist. The insurer can't find it.", cn: "给我的案件编号查不到。保险公司查不到。" },
            { who: "警察", en: "Read it to me.", cn: "念给我听。" },
            { who: "报案人", en: "It ends in four seven. The system shows nothing.", cn: "末尾是四七。系统里什么都没有。" },
            { who: "警察", en: "Four seven, or four slash seven?", cn: "是四七，还是四斜杠七？" },
            { who: "报案人", en: "I wrote down what I heard on the phone.", cn: "我记的是电话里听到的。" },
            { who: "警察", en: "That's the problem. It was four slash seven, and the slash is part of the number.", cn: "问题就在这儿。是四斜杠七，斜杠是编号的一部分。" },
            { who: "报案人", en: "Nobody says slash out loud.", cn: "没人会口头念出斜杠。" },
            { who: "警察", en: "They should, and I'll say it that way from now on. Here is the correct reference in writing.", cn: "应该念，我以后就这么念。这是正确的编号，书面给你。" },
            { who: "报案人", en: "Does the insurer need anything else?", cn: "保险公司还需要别的吗？" },
            { who: "警察", en: "The report PDF, which you download with this reference. No need to come back.", cn: "报案 PDF，用这个编号就能下载。不用再来了。" }
          ]
        },
        {
          variant: "情绪型（被抢后一直发抖）",
          relation: "受害人 · 警察（街头抢劫）",
          register: "半正式（情绪化）",
          channel: "面对面（警察局）",
          barrier: "人没受伤但控制不住发抖与自责",
          result: "达成（拿到处理步骤与受害者支持电话）",
          lines: [
            { who: "报案人", en: "It happened on my street, at eight in the evening.", cn: "就发生在我那条街上，晚上八点。" },
            { who: "警察", en: "Were you hurt?", cn: "您受伤了吗？" },
            { who: "报案人", en: "No. He took the phone and ran. I'm not hurt, I just can't stop shaking.", cn: "没有。他抢了手机就跑了。我没受伤，我只是控制不住发抖。" },
            { who: "警察", en: "That's a normal reaction, and it can last a few days.", cn: "这是正常反应，可能持续几天。" },
            { who: "报案人", en: "I keep thinking I should have held it tighter.", cn: "我一直想我当时应该抓得更紧。" },
            { who: "警察", en: "People who resist get hurt. You did the right thing, and that is worth hearing from someone who sees it weekly.", cn: "反抗的人会受伤。你做得对，这话从一个每周都见这种事的人嘴里说出来，值得听。" },
            { who: "报案人", en: "...Thank you. What happens next?", cn: "……谢谢。接下来呢？" },
            { who: "警察", en: "Your network will block the phone, so it's worthless to them. Call them tonight.", cn: "你的运营商会把手机锁掉，对他们来说就没用了。今晚打电话办。" },
            { who: "报案人", en: "And if they find it?", cn: "如果找到了呢？" },
            { who: "警察", en: "You'll get a call. And I'd advise the victim support number on this card either way.", cn: "会有人给你打电话。另外无论如何，建议你打这张卡上的受害者支持电话。" }
          ]
        },
        {
          variant: "渠道变体（网上报案 + 保险 App）",
          relation: "投保人 · 保险客服（缺编号）",
          register: "半正式",
          channel: "网上报案 + 保险 App",
          barrier: "网上报案只收到确认邮件，找不到案件编号",
          result: "达成（在 PDF 第二页找到编号，只上传必要文件）",
          lines: [
            { who: "客服", en: "Your claim is missing the crime reference.", cn: "您的理赔缺案件编号。" },
            { who: "投保人", en: "I filed the report online and got a confirmation, but no reference.", cn: "我在网上报了案，收到确认，但没有编号。" },
            { who: "客服", en: "The reference is in the PDF, not in the email.", cn: "编号在 PDF 里，不在邮件里。" },
            { who: "投保人", en: "The email only says your report has been received.", cn: "邮件只写「您的报案已收到」。" },
            { who: "客服", en: "Then open the attachment. It's on the second page.", cn: "那就打开附件。在第二页。" },
            { who: "投保人", en: "Got it. Should I upload the email as well?", cn: "找到了。我要把邮件也上传吗？" },
            { who: "客服", en: "Only the PDF. Extra documents slow the system down.", cn: "只传 PDF。多余文件会拖慢系统。" },
            { who: "投保人", en: "How long does approval take?", cn: "批准要多久？" },
            { who: "客服", en: "Ten working days, and the app shows the stage. If it says awaiting information, that means us, not you.", cn: "十个工作日，应用会显示阶段。如果显示等待信息，那是等我们，不是等你。" },
            { who: "投保人", en: "That's the sentence that should be on the screen.", cn: "这句话就该显示在屏幕上。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "报案人 · 警察（正式笔录）",
          register: "正式",
          channel: "面对面（警察局笔录）",
          barrier: "无（但需逐行核对并主动更正）",
          result: "达成（更正两处，补充出租车线索，签字）",
          lines: [
            { who: "警察", en: "This is your statement. Please read it and correct anything that is wrong.", cn: "这是您的陈述。请阅读并更正任何错误。" },
            { who: "报案人", en: "Line four says I was approached from behind. I was approached from the side.", cn: "第四行写的是有人从背后靠近我。是从侧面。" },
            { who: "警察", en: "Corrected. Anything else that is not accurate?", cn: "已更正。还有不准确的地方吗？" },
            { who: "报案人", en: "Line seven says the man spoke. He did not speak at all, which is why I cannot describe a voice.", cn: "第七行写那名男子说了话。他完全没说话，所以我说不出声音特征。" },
            { who: "警察", en: "That is an important correction. Silence is itself a detail.", cn: "这是重要的更正。沉默本身就是一条线索。" },
            { who: "报案人", en: "I should like to add that I saw a taxi waiting with its light on.", cn: "我想补充一点：我看到一辆出租车亮着灯在等。" },
            { who: "警察", en: "Which company, if you know?", cn: "哪家公司，如果您知道？" },
            { who: "报案人", en: "I do not. It was white with a blue stripe, and I would not swear to the colour.", cn: "不知道。白色带蓝条，但颜色我不敢发誓。" },
            { who: "警察", en: "Saying what you would not swear to is more useful than a confident guess. Sign here.", cn: "说清哪些你不敢确定，比一个自信的猜测更有用。请在这里签字。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "报案人 · 警察（自行车被偷）",
          register: "随意（极简、俚语）",
          channel: "面对面（警察局）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "报案人", en: "my bike got nicked", cn: "我的自行车被偷了" },
            { who: "警察", en: "where", cn: "在哪" },
            { who: "报案人", en: "outside the station", cn: "车站外面" },
            { who: "警察", en: "when", cn: "什么时候" },
            { who: "报案人", en: "last night", cn: "昨晚" },
            { who: "警察", en: "locked", cn: "锁了吗" },
            { who: "报案人", en: "yeah. decent lock too", cn: "锁了。还是把好锁" },
            { who: "警察", en: "they cut it", cn: "他们剪断了" },
            { who: "报案人", en: "looks like it", cn: "看起来是" },
            { who: "警察", en: "report it online. you'll get a number for insurance", cn: "网上报案。会给你一个保险用的编号" },
            { who: "报案人", en: "for a bike", cn: "一辆自行车？" },
            { who: "警察", en: "for anything", cn: "什么都一样" }
          ]
        }
      ]
    },

    /* ==================== 11-01 导游观光与博物馆 ==================== */
    {
      id: "s11-01",
      domain: "11",
      title: "导游观光与博物馆",
      ielts: "口语 P2 场景 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "游客 · 导游（参观安排）",
          register: "中性",
          channel: "面对面（景区）",
          barrier: "无",
          result: "达成（确认塔楼难度与拍照规则后定行程）",
          lines: [
            { who: "导游", en: "We'll spend forty minutes in the cloister, then the tower.", cn: "我们会在回廊待四十分钟，然后上塔楼。" },
            { who: "游客", en: "Is the tower climb difficult?", cn: "爬塔楼难吗？" },
            { who: "导游", en: "Two hundred and twenty steps, no lift, and the staircase is narrow.", cn: "二百二十级台阶，没有电梯，楼梯很窄。" },
            { who: "游客", en: "Is there anywhere to stop halfway?", cn: "中途有地方可以停吗？" },
            { who: "导游", en: "There's a landing at one hundred and ten with a bench. Most people stop there.", cn: "一百一十级处有个平台，有长椅。大部分人都在那儿歇。" },
            { who: "游客", en: "Then I'll try it. Does the ticket cover both?", cn: "那我试试。票包含两处吗？" },
            { who: "导游", en: "It does, and the tower is valid all day.", cn: "包含，而且塔楼当天随时都能上。" },
            { who: "游客", en: "May I take photographs inside?", cn: "里面能拍照吗？" },
            { who: "导游", en: "Everywhere except the chapel, where there's a service at four.", cn: "除了礼拜堂都可以，四点那里有礼拜。" },
            { who: "游客", en: "Then I'll do the tower now and the chapel tomorrow morning.", cn: "那我先上塔楼，礼拜堂明早再去。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "游客 · 博物馆工作人员（包超尺寸）",
          register: "半正式",
          channel: "面对面（展厅入口）",
          barrier: "无（但要在规则内找到第三条路）",
          result: "达成（只带相机、包留储物柜）",
          lines: [
            { who: "工作人员", en: "You can't bring that bag into the gallery. It's larger than the limit.", cn: "那个包不能进展厅。超过了尺寸限制。" },
            { who: "游客", en: "It's a camera bag and everything in it is equipment.", cn: "这是摄影包，里面全是器材。" },
            { who: "工作人员", en: "The rule is about size, not contents.", cn: "规定管的是尺寸，不是内容。" },
            { who: "游客", en: "Then I'll check it in, but the cloakroom queue is twenty minutes.", cn: "那我寄存，但寄存处要排二十分钟。" },
            { who: "工作人员", en: "There are lockers by the north entrance, and they're usually empty.", cn: "北门有储物柜，通常没人用。" },
            { who: "游客", en: "Are they big enough for the bag?", cn: "能放下这个包吗？" },
            { who: "工作人员", en: "They're the same size, I'm afraid.", cn: "恐怕是同样尺寸。" },
            { who: "游客", en: "Could I carry the camera and leave the bag?", cn: "我能只带相机、把包留下吗？" },
            { who: "工作人员", en: "That's allowed, and it solves both our problems.", cn: "可以，这样我们两个的问题都解决了。" },
            { who: "游客", en: "Then I'll do that. Thank you for finding the third option.", cn: "那就这样。谢谢您找到第三个办法。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "游客 · 售票处（导览满员）",
          register: "中性",
          channel: "面对面（售票处）",
          barrier: "想参加的导览已满，没有候补名单",
          result: "折中（改下午场，并说明现场候补怎么做）",
          lines: [
            { who: "游客", en: "The guided tour for tomorrow is sold out. Is there any way in?", cn: "明天的导览卖完了。有办法进吗？" },
            { who: "售票", en: "The tour is capped at fifteen. I can't add one.", cn: "导览限十五人。我不能加一个。" },
            { who: "游客", en: "Could I be put on a cancellation list?", cn: "能把我放到候补名单吗？" },
            { who: "售票", en: "We don't have one, but here is what does work.", cn: "我们没有候补名单，但有个办法管用。" },
            { who: "游客", en: "Go on.", cn: "请说。" },
            { who: "售票", en: "Come ten minutes early and ask at the desk. Cancellations happen about once a week, and the person at the desk decides.", cn: "提前十分钟到，在柜台问。每周大概有一次取消，柜台的人决定。" },
            { who: "游客", en: "So the queue is the waiting list.", cn: "所以排队就是候补名单。" },
            { who: "售票", en: "Effectively. And the same tour in the afternoon has space.", cn: "可以这么说。下午同一场还有位置。" },
            { who: "游客", en: "Then I'll take the afternoon and stop worrying.", cn: "那我要下午的，不用再操心了。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "游客 · 工作人员（语音导览语言错）",
          register: "中性",
          channel: "面对面（语音导览台）",
          barrier: "导览册编号印错，选英语放出德语",
          result: "修复（当场统一告知正确编号，游客也帮忙转告）",
          lines: [
            { who: "游客", en: "The audio guide is in the wrong language. I chose English.", cn: "语音导览语言不对。我选的是英语。" },
            { who: "工作人员", en: "Press one at the start. It defaults to the last setting.", cn: "开头按一。它默认用上一次的设置。" },
            { who: "游客", en: "I pressed one and got German.", cn: "我按了一，出来的是德语。" },
            { who: "工作人员", en: "Then the numbers have shifted. What number is English on your sheet?", cn: "那编号变动了。你那张单子上英语是几号？" },
            { who: "游客", en: "Two.", cn: "二号。" },
            { who: "工作人员", en: "Two is German in this batch. It's a printing error on the sheet, not on the machine.", cn: "这一批里二号是德语。是纸上的印刷错误，不是机器的。" },
            { who: "游客", en: "So the sheet is wrong for everyone today.", cn: "那今天所有人的纸都是错的。" },
            { who: "工作人员", en: "Yes, and I'll say it at the desk rather than swap sheets one at a time.", cn: "是的，我会在柜台统一说明，而不是一张一张换。" },
            { who: "游客", en: "Tell people English is three. I'll pass it on as well.", cn: "告诉大家英语是三。我也会转告。" },
            { who: "工作人员", en: "Thank you. That saves me twenty conversations.", cn: "谢谢。这省了我二十次解释。" }
          ]
        },
        {
          variant: "情绪型（排了五十分钟却遇展厅关闭）",
          relation: "游客 · 博物馆工作人员",
          register: "中性（失望）",
          channel: "面对面（展厅入口）",
          barrier: "排队五十分钟后目标展厅因保护性维护关闭，入口无告示",
          result: "达成（走会员入口免排队，并当天补上告示）",
          lines: [
            { who: "游客", en: "I've queued fifty minutes and the room I came for is closed.", cn: "我排了五十分钟，而我想看的那个展厅关了。" },
            { who: "工作人员", en: "The Rothko room is closed for conservation. It says so online.", cn: "罗斯科展厅因保护性维护关闭。网上有写。" },
            { who: "游客", en: "It says so on a page I didn't open, and there's no sign at the entrance.", cn: "写在了一个我没打开的页面，而入口处没有告示。" },
            { who: "工作人员", en: "You're right, and that is our failure.", cn: "您说得对，这是我们的失误。" },
            { who: "游客", en: "I'm not angry about the room. I'm angry about the fifty minutes.", cn: "我不是为展厅生气。我是为那五十分钟生气。" },
            { who: "工作人员", en: "Then let me fix the part I can. Come with me.", cn: "那我来解决我能解决的部分。请跟我来。" },
            { who: "游客", en: "Where?", cn: "去哪？" },
            { who: "工作人员", en: "The members' entrance. There's no queue, and the two rooms next to Rothko are open.", cn: "会员入口。那里不排队，而且罗斯科旁边那两个展厅开着。" },
            { who: "游客", en: "That's twenty minutes of my fifty back.", cn: "这把我那五十分钟找回了二十分钟。" },
            { who: "工作人员", en: "And I'll put a sign at the entrance today, which is the part that should have existed.", cn: "另外我今天会在入口加上告示，本来就该有。" }
          ]
        },
        {
          variant: "渠道变体（手机 App 语音导览）",
          relation: "游客 · 语音导览客服",
          register: "半正式",
          channel: "App + 客服",
          barrier: "地下展厅无线网断，导览卡在下载百分之八",
          result: "达成（改用编号 + 离线模式，并反馈默认设置）",
          lines: [
            { who: "游客", en: "The app won't download the tour. It's stuck at eight percent.", cn: "应用下载不了导览。卡在百分之八。" },
            { who: "客服", en: "Are you on the museum wifi?", cn: "您在用博物馆的无线网吗？" },
            { who: "游客", en: "I am, and it's the only network that works inside.", cn: "在用，而且这是馆内唯一能用的网络。" },
            { who: "客服", en: "The wifi drops in the basement galleries. Download it upstairs first.", cn: "无线网在地下展厅会断。请先到楼上把导览下载完。" },
            { who: "游客", en: "I'm already in the basement.", cn: "我已经在地下室了。" },
            { who: "客服", en: "Then use the printed numbers and offline mode. Tap the number, don't scan.", cn: "那就用墙上的编号和离线模式。点编号，别扫码。" },
            { who: "游客", en: "There's an offline mode?", cn: "有离线模式？" },
            { who: "客服", en: "It's in the settings and it isn't obvious, which I have complained about.", cn: "在设置里，而且不明显，这事我反映过。" },
            { who: "游客", en: "It's working. Why isn't that the default?", cn: "能用了。为什么不做成默认？" },
            { who: "客服", en: "Because it downloads everything at once. I'll pass your comment on with the word default in it.", cn: "因为那样会一次性下载全部内容。我会把您的意见原话转过去，带上默认这个词。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "参观者 · 策展人（藏品来源）",
          register: "正式",
          channel: "面对面（研究室）",
          barrier: "无（但需正式提出查阅档案并说明用途）",
          result: "达成（约周四查阅通信档案，策展人陪同首小时）",
          lines: [
            { who: "策展人", en: "Thank you for coming. You asked about the provenance of the two panels.", cn: "谢谢您来。您问的是那两块镶板的来源。" },
            { who: "参观者", en: "I did. The label says acquired in 1954, which is unusually precise for that period.", cn: "是的。标签写的是 1954 年入藏，对那个年代来说异常精确。" },
            { who: "策展人", en: "It is precise because the acquisition was contested at the time.", cn: "之所以精确，是因为当时这笔入藏有争议。" },
            { who: "参观者", en: "Contested by whom?", cn: "谁有争议？" },
            { who: "策展人", en: "By the vendor's family, and the correspondence survives in our archive.", cn: "卖方家族，相关通信保存在我们的档案里。" },
            { who: "参观者", en: "Would it be possible to consult that correspondence?", cn: "有可能查阅那些通信吗？" },
            { who: "策展人", en: "By appointment, and I should warn you that two of the letters are in Dutch.", cn: "预约即可，不过我要提醒您，其中两封信是荷兰文。" },
            { who: "参观者", en: "That is not a difficulty. I should like to cite them accurately rather than approximately.", cn: "这不是问题。我希望能准确引用，而不是大致引用。" },
            { who: "策展人", en: "Then I shall arrange it for Thursday morning, and I shall sit in for the first hour.", cn: "那我安排周四上午，第一小时我会在场。" },
            { who: "参观者", en: "That is generous, and unusual.", cn: "这很慷慨，也很少见。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "游客 · 售票处（买门票）",
          register: "随意（极简、俚语）",
          channel: "面对面（售票处）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "游客", en: "how much to get in", cn: "门票多少钱" },
            { who: "售票", en: "twelve. students eight", cn: "十二。学生八块" },
            { who: "游客", en: "i'm not a student", cn: "我不是学生" },
            { who: "售票", en: "are you sure", cn: "你确定吗" },
            { who: "游客", en: "yes", cn: "确定" },
            { who: "售票", en: "shame", cn: "可惜" },
            { who: "游客", en: "why", cn: "为什么" },
            { who: "售票", en: "everyone your age says they're a student", cn: "你这年纪的人都说自己是学生" },
            { who: "游客", en: "i'm honest", cn: "我诚实" },
            { who: "售票", en: "twelve, then", cn: "那就十二" },
            { who: "游客", en: "worth it?", cn: "值吗" },
            { who: "售票", en: "the tower is", cn: "塔楼值" }
          ]
        }
      ]
    },

    /* ==================== 11-02 运动健身与兴趣社团 ==================== */
    {
      id: "s11-02",
      domain: "11",
      title: "运动健身与兴趣社团",
      ielts: "口语 P2 场景 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "顾客 · 健身房前台（体验课）",
          register: "中性",
          channel: "面对面（健身房）",
          barrier: "无",
          result: "达成（问清装备与简化动作的做法）",
          lines: [
            { who: "前台", en: "Are you here for the trial?", cn: "您是来体验的吗？" },
            { who: "顾客", en: "I am. I booked the seven o'clock class.", cn: "是的。我订了七点那节课。" },
            { who: "前台", en: "It's beginners' circuit, forty minutes. Are you training for anything in particular?", cn: "是初级循环训练，四十分钟。您有特别的目标吗？" },
            { who: "顾客", en: "Nothing specific. I sit down all day and I've stopped being able to run for a bus.", cn: "没有具体的。我整天坐着，现在连追公交都跑不动了。" },
            { who: "前台", en: "That is the most common reason people come here.", cn: "这是大家来这儿最常见的原因。" },
            { who: "顾客", en: "Do I need to bring anything?", cn: "需要自带什么吗？" },
            { who: "前台", en: "Water and a towel. There are mats in the studio.", cn: "水和毛巾。教室里有垫子。" },
            { who: "顾客", en: "And if the class is too hard?", cn: "如果课太难呢？" },
            { who: "前台", en: "Tell the instructor before it starts. He'll give you the easier version of each station.", cn: "开始前告诉教练。他会给你每个站的简化版。" },
            { who: "顾客", en: "I'll do that. Which changing room?", cn: "我会的。用哪个更衣室？" },
            { who: "前台", en: "Left, and the lockers need a pound coin, which everybody forgets.", cn: "左边。储物柜要一枚一镑硬币，这个大家都忘。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "顾客 · 健身房销售（年卡推销）",
          register: "半正式",
          channel: "面对面（健身房）",
          barrier: "无（但要用「人家二月就停」把年卡话术拆掉）",
          result: "达成（改按月付，不入年卡）",
          lines: [
            { who: "销售", en: "The annual membership is the best value. It works out at thirty a month.", cn: "年卡最划算。折算下来每月三十。" },
            { who: "顾客", en: "It's only good value if I come for twelve months.", cn: "只有我坚持十二个月它才划算。" },
            { who: "销售", en: "Most people do.", cn: "大部分人都会。" },
            { who: "顾客", en: "Most people also stop in February. What's the monthly?", cn: "大部分人二月就停了。月卡多少钱？" },
            { who: "销售", en: "Forty-five, with a joining fee of twenty.", cn: "四十五，另收入会费二十。" },
            { who: "顾客", en: "So the annual saves me two hundred, and the joining fee is the same either way?", cn: "所以年卡省我两百，而入会费两种都一样？" },
            { who: "销售", en: "The joining fee is waived on the annual, actually.", cn: "其实年卡是免入会费的。" },
            { who: "顾客", en: "Then here is my offer: I'll pay three months up front, and if I'm still coming in April I'll take the rest of the year.", cn: "那我提个方案：我先付三个月；如果四月我还在来，我把剩下的一年补上。" },
            { who: "销售", en: "I can't hold the annual price for you.", cn: "我没法替您保留年卡的价格。" },
            { who: "顾客", en: "Then hold nothing and I'll pay monthly. If I stay, you get more than thirty a month anyway.", cn: "那什么都不用留，我按月付。如果我留下，你们每月拿到的还不止三十。" },
            { who: "销售", en: "That is a fair argument. Monthly it is.", cn: "这个说法公道。就按月。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "跑者 · 社团组织者（水平不够）",
          register: "随意",
          channel: "面对面（约跑点）",
          barrier: "想参加十公里团跑但只能跑五公里",
          result: "折中（先跑周二五公里慢组，能跑八公里再转周四）",
          lines: [
            { who: "组织者", en: "The Thursday run is for people who can do ten kilometres. You said five.", cn: "周四那场是给能跑十公里的人。你说的是五公里。" },
            { who: "参加者", en: "I can do five comfortably. I'd like to build up.", cn: "五公里我很轻松。我想慢慢加。" },
            { who: "组织者", en: "Ten is the entry point, and I don't want you dropped at the back alone.", cn: "十公里是门槛，我不想让你一个人掉在队尾。" },
            { who: "参加者", en: "That's a fair reason. Is there anything between?", cn: "这个理由公道。中间有别的选择吗？" },
            { who: "组织者", en: "Tuesday is a five-kilometre loop with a faster group and a slower one.", cn: "周二有一个五公里环线，分快组和慢组。" },
            { who: "参加者", en: "Then I'll start on Tuesday and move to Thursday when I can do eight.", cn: "那我先周二，等我能跑八公里再转周四。" },
            { who: "组织者", en: "That is the right order. Tuesday's slower group has a leader who stays at the back.", cn: "这个顺序对。周二慢组有个领队一直压队尾。" },
            { who: "参加者", en: "Let me guess: she's the one who talked you into it.", cn: "让我猜：就是她说服你这么安排的。" },
            { who: "组织者", en: "Two years ago, and she was right.", cn: "两年前，而且她说对了。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "会员 · 健身房前台（课程改场地没通知）",
          register: "中性",
          channel: "面对面（健身房）",
          barrier: "课程临时改教室，只发在应用里，柜台订课的人没看到",
          result: "修复（换到八点场 + 抵扣一节 + 加进短信名单）",
          lines: [
            { who: "会员", en: "I turned up for the six o'clock class and the studio was dark.", cn: "我六点来上课，教室是黑的。" },
            { who: "前台", en: "It moved to the poolside room this week. We posted it in the app.", cn: "这周改到泳池边的教室了。我们在应用里发了通知。" },
            { who: "会员", en: "I don't have the app. I booked at this desk.", cn: "我没装那个应用。我是在这个柜台订的。" },
            { who: "前台", en: "Then you wouldn't have seen it. That's our gap, not yours.", cn: "那您就看不到。这是我们的漏洞，不是您的。" },
            { who: "会员", en: "The class is over now. What can be done?", cn: "课已经结束了。能怎么办？" },
            { who: "前台", en: "Three things: I'll move you to the eight o'clock tonight, credit this one, and put your number on the SMS list.", cn: "三件事：我给您换到今晚八点，这节课记成抵扣，并把您的号码加到短信名单。" },
            { who: "会员", en: "Was anyone else caught out?", cn: "还有别人也被绕了吗？" },
            { who: "前台", en: "Four of you. The other three just went home.", cn: "你们四个。另外三个直接回家了。" },
            { who: "会员", en: "Then text everyone who books at the desk, not only app users.", cn: "那就给所有在柜台订课的人发短信，不只是用应用的人。" },
            { who: "前台", en: "I'll ask for that today. You're the first person to say it out loud.", cn: "我今天就提。您是第一个把这话说出来的人。" }
          ]
        },
        {
          variant: "情绪型（被教练当众点名）",
          relation: "会员 · 教练（当众批评）",
          register: "随意（情绪化）",
          channel: "面对面（健身房）",
          barrier: "教练当众要求加重量，会员差点直接走人",
          result: "达成（教练改先问一句，并补一节一对一）",
          lines: [
            { who: "会员", en: "I'd like to say something about the class.", cn: "我想说说那节课。" },
            { who: "教练", en: "You were struggling with the weights.", cn: "你在重量上有点吃力。" },
            { who: "会员", en: "I was. What I minded was being told in front of everyone to add more.", cn: "确实。我介意的是当着所有人的面被要求加重量。" },
            { who: "教练", en: "It's how I motivate people.", cn: "我就是这么激励人的。" },
            { who: "会员", en: "It works for some. It made me want to leave, and I nearly did.", cn: "对有些人有用。它让我想走，而且我差点就走了。" },
            { who: "教练", en: "...I didn't know that.", cn: "……我不知道。" },
            { who: "会员", en: "Now you do. Could you say it quietly next time, or ask first?", cn: "现在你知道了。下次能小声说，或者先问一句吗？" },
            { who: "教练", en: "I'll ask first. And I owe you a session, one to one, to go through the technique properly.", cn: "我先问。而且我欠你一节课，一对一，把动作好好过一遍。" },
            { who: "会员", en: "I'd take that. And I'll tell you when I'm at my limit instead of just stopping.", cn: "这个我要。而且我到极限时会告诉你，而不是直接停下。" },
            { who: "教练", en: "That is the deal that should have existed from the start.", cn: "这个约定本来就该从一开始就有。" }
          ]
        },
        {
          variant: "渠道变体（App 约课）",
          relation: "会员 · 健身房客服（约课名额）",
          register: "半正式",
          channel: "App + 客服",
          barrier: "应用显示满员，现场却有空位",
          result: "达成（问清现场名额与放号时间，并提文案修改）",
          lines: [
            { who: "会员", en: "The app says the class is full, but the studio had eleven people in it.", cn: "应用说课满了，但教室里只有十一个人。" },
            { who: "客服", en: "The cap is twenty. The app shows full when the online allocation is gone.", cn: "上限是二十。应用显示满是指线上名额发完了。" },
            { who: "会员", en: "So there are places that can only be had by walking in.", cn: "所以有些位置只能走到现场才有。" },
            { who: "客服", en: "In practice, yes. Regulars know, and it's unfair on everyone else.", cn: "实际上是的。老会员知道这一点，对其他所有人都不公平。" },
            { who: "会员", en: "Then put the number on the screen. Twenty places, fourteen online.", cn: "那就把数字显示在屏幕上。二十个位置，线上十四个。" },
            { who: "客服", en: "That's a product change, not something I can do today.", cn: "那是产品改动，不是我今天能做的。" },
            { who: "会员", en: "Then do what you can: tell me how many walk-in places this class has.", cn: "那你做你能做的：告诉我这节课现场有多少个位置。" },
            { who: "客服", en: "Six, and they open ten minutes before.", cn: "六个，开课前十分钟放出。" },
            { who: "会员", en: "Now I can plan. Write that in the class description.", cn: "现在我能安排了。把这句写进课程说明里。" },
            { who: "客服", en: "I'll pass it on as a wording change, which is easier to approve than a feature.", cn: "我按文案改动提上去，这比做个新功能好批。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "参加者 · 骑行俱乐部负责人",
          register: "正式",
          channel: "面对面（俱乐部）",
          barrier: "无（但需正式确认保险与安全要求）",
          result: "达成（先确认自保再参加，周日带灯）",
          lines: [
            { who: "负责人", en: "Welcome. Before you join the club's Sunday rides, I must take you through our safety rules.", cn: "欢迎。在您参加俱乐部周日骑行之前，我必须向您说明安全规则。" },
            { who: "参加者", en: "Please do. I have read the handbook, and I have one question about the insurance.", cn: "请讲。手册我读过了，关于保险我有一个问题。" },
            { who: "负责人", en: "The club insurance covers third-party claims, not personal injury.", cn: "俱乐部保险覆盖第三方索赔，不包括个人伤害。" },
            { who: "参加者", en: "Then I should confirm my own cover before my first ride rather than after.", cn: "那我应该在第一次骑行之前而不是之后确认我自己的保险。" },
            { who: "负责人", en: "That is what most people do afterwards, and it is the wrong way round.", cn: "大部分人都是事后再办，而这个顺序是错的。" },
            { who: "参加者", en: "What else is required of members?", cn: "会员还有别的要求吗？" },
            { who: "负责人", en: "A helmet, working lights, and that you tell the ride leader if you are dropping off the back.", cn: "头盔、能用的车灯，以及如果你掉队要告诉领骑。" },
            { who: "参加者", en: "The last one I have not seen before, and it is the sensible one.", cn: "最后一条我以前没见过，但它是最合理的一条。" },
            { who: "负责人", en: "It came from an incident. Since then we have had no one lost.", cn: "这条来自一次事故。从那以后我们没丢过人。" },
            { who: "参加者", en: "Then I shall sign, and I shall bring the lights on Sunday.", cn: "那我签字，周日我会带灯。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "顾客 · 健身房前台（问价格）",
          register: "随意（极简、俚语）",
          channel: "面对面（健身房）",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "顾客", en: "how much a month", cn: "一个月多少钱" },
            { who: "前台", en: "thirty five", cn: "三十五" },
            { who: "顾客", en: "and there's no contract", cn: "没有合约吧" },
            { who: "前台", en: "twelve months", cn: "十二个月" },
            { who: "顾客", en: "so there is a contract", cn: "所以是有合约" },
            { who: "前台", en: "yeah", cn: "对" },
            { who: "顾客", en: "can i cancel", cn: "能取消吗" },
            { who: "前台", en: "with a doctor's note", cn: "有医生证明才行" },
            { who: "顾客", en: "of course", cn: "那当然" },
            { who: "前台", en: "that's gyms", cn: "健身房都这样" }
          ]
        }
      ]
    },

    /* ==================== 07-01 客服售后与退换 ==================== */
    {
      id: "s07-01",
      domain: "07",
      title: "客服售后与退换",
      ielts: "口语 P2 场景 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "顾客 · 客服（换货）",
          register: "半正式",
          channel: "电话客服",
          barrier: "无",
          result: "达成（同款换新，标签扫描即发货）",
          lines: [
            { who: "客服", en: "How can I help?", cn: "需要什么帮助？" },
            { who: "顾客", en: "The kettle I bought last month leaks from the base.", cn: "我上个月买的水壶底部漏水。" },
            { who: "客服", en: "Do you have the order number?", cn: "有订单号吗？" },
            { who: "顾客", en: "It's in my account. Reference four eight two.", cn: "在我账户里。编号四八二。" },
            { who: "客服", en: "I can see it. Would you like a replacement or a refund?", cn: "我看到了。您要换货还是退款？" },
            { who: "顾客", en: "Replacement, if it's the same model. I liked it until it leaked.", cn: "换货，如果是同款的话。漏水之前我很喜欢它。" },
            { who: "客服", en: "Same model, and I'll send a return label for the old one.", cn: "同款，我会给旧件发一张退货标签。" },
            { who: "顾客", en: "Do I need to clean it first?", cn: "需要先清洁吗？" },
            { who: "客服", en: "Empty it and don't bother cleaning. It's going to be inspected, not reused.", cn: "倒空就行，不用洗。它会被检查，不会再使用。" },
            { who: "顾客", en: "Then I'll post it tomorrow. How long for the new one?", cn: "那我明天寄。新的要多久？" },
            { who: "客服", en: "Three days, and it ships when the label is scanned rather than when it arrives.", cn: "三天；标签一扫描就发货，不用等到到货。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "顾客 · 售后客服（保修被拒）",
          register: "半正式",
          channel: "电话客服",
          barrier: "无（但要用照片证明工程师报告张冠李戴）",
          result: "达成（改判保修维修，取件费由商家承担）",
          lines: [
            { who: "客服", en: "The engineer's report says the damage is accidental, so the warranty doesn't apply.", cn: "工程师报告说损坏属于意外，所以保修不适用。" },
            { who: "顾客", en: "What did he say the damage was?", cn: "他说损坏是什么？" },
            { who: "客服", en: "A cracked screen from impact.", cn: "撞击造成的屏幕破裂。" },
            { who: "顾客", en: "The screen is intact. The fault is that it won't charge.", cn: "屏幕是完好的。故障是充不进电。" },
            { who: "客服", en: "The report mentions the screen.", cn: "报告提到了屏幕。" },
            { who: "顾客", en: "Then the report is about a different phone or a different customer. I can send you a photograph of mine with today's date.", cn: "那这份报告说的是另一台手机，或者另一位客户。我可以给您发我的手机照片，带今天的日期。" },
            { who: "客服", en: "...Please do. If the screen is intact, the report doesn't match your device.", cn: "……请发。如果屏幕完好，报告就和您的设备不符。" },
            { who: "顾客", en: "Sending it now. And I'd like the repair under warranty, not a paid one.", cn: "现在发。而且我希望按保修维修，不是付费维修。" },
            { who: "客服", en: "If the photograph matches, it's a warranty repair, and we collect it at our cost.", cn: "如果照片对得上，就按保修维修，我们承担取件费。" },
            { who: "顾客", en: "Thank you. I'd also like the report corrected, in case it follows the serial number.", cn: "谢谢。我还希望把那份报告更正，以防它跟着序列号走。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "顾客 · 客服（超期退货）",
          register: "半正式",
          channel: "电话客服",
          barrier: "买了四个月想退货，远超三十天",
          result: "折中（按四成折价换购，高于标准）",
          lines: [
            { who: "顾客", en: "I bought this in March and I'd like to return it.", cn: "我三月买的，想退。" },
            { who: "客服", en: "Our returns window is thirty days.", cn: "我们的退货期是三十天。" },
            { who: "顾客", en: "It's four months. I'm not going to pretend I didn't know.", cn: "四个月了。我不会假装我不知道。" },
            { who: "客服", en: "Then a refund isn't something I can offer.", cn: "那退款我给不了。" },
            { who: "顾客", en: "What can you offer, given that the fault is a design one? The newer model fixed it.", cn: "既然这是设计缺陷，你们能提供什么？新款已经修好了这个问题。" },
            { who: "客服", en: "Where did you read that?", cn: "您在哪看到的？" },
            { who: "顾客", en: "In your own release notes. It says the hinge was redesigned.", cn: "在你们自己的发布说明里。写着铰链重新设计了。" },
            { who: "客服", en: "...I can offer a trade-in at forty percent of what you paid, which is above our standard.", cn: "……我可以给按您付款的四成折价换购，高于我们的标准。" },
            { who: "顾客", en: "Forty percent of a four-month-old item is fair. I'll take it.", cn: "四个月的东西给四成，公道。我接受。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "顾客 · 客服（换错颜色还缺件）",
          register: "半正式",
          channel: "电话客服",
          barrier: "补发的货颜色与订单不符，配件还漏了",
          result: "修复（先发正确件，寄回不设前提）",
          lines: [
            { who: "顾客", en: "The replacement arrived, but it's the wrong colour and the accessory is missing.", cn: "换货到了，但颜色错了，而且配件缺失。" },
            { who: "客服", en: "The colour on the order is grey. What arrived?", cn: "订单上的颜色是灰色。到的是什么？" },
            { who: "顾客", en: "Grey is what I ordered, but the box says white and the item inside is white.", cn: "我订的是灰色，但盒子上写的是白色，里面也是白色。" },
            { who: "客服", en: "So the label and the contents agree with each other and disagree with the order.", cn: "所以标签和内容一致，但和订单不一致。" },
            { who: "顾客", en: "That's exactly it. And the cable isn't in the box.", cn: "就是这样。而且线也不在盒子里。" },
            { who: "客服", en: "That's a picking error at the warehouse. I'll send the correct one today and a prepaid label for this one.", cn: "这是仓库拣货错误。我今天发正确的，并给这件附一张预付标签。" },
            { who: "顾客", en: "Do I have to send this back before the new one ships?", cn: "我必须在新的发出之前把件寄回吗？" },
            { who: "客服", en: "No. You've already waited once. It ships now, and you return it when convenient.", cn: "不用。您已经等过一次了。现在就发，您方便时再寄回。" },
            { who: "顾客", en: "That's the first time a company has trusted me.", cn: "这是第一次有公司信任我。" }
          ]
        },
        {
          variant: "情绪型（第三次联系同一单）",
          relation: "顾客 · 客服（反复未解决）",
          register: "半正式（情绪化）",
          channel: "电话客服",
          barrier: "同一问题第三次联系，前两次都被关单",
          result: "达成（当天补发 + 退运费 + 账户标注历史）",
          lines: [
            { who: "顾客", en: "This is the third contact about the same order.", cn: "这是关于同一笔订单的第三次联系了。" },
            { who: "客服", en: "I can see two previous tickets.", cn: "我看到两张之前的工单。" },
            { who: "顾客", en: "And each time I was told it was resolved. It isn't.", cn: "每次都告诉我已解决。并没有。" },
            { who: "客服", en: "That's two people who closed a ticket without finishing it, and that is on us.", cn: "那是两个人没做完就关了工单，这是我们的问题。" },
            { who: "顾客", en: "I don't want another apology. I want the thing I paid for.", cn: "我不要又一个道歉。我要我付钱买的东西。" },
            { who: "客服", en: "Understood. I'm doing three things while you're on the line: sending a replacement today, refunding the delivery charge, and noting on the account that this is the third contact.", cn: "明白。我在通话中做三件事：今天发出替换件、退还运费、在账户上标注这是第三次联系。" },
            { who: "顾客", en: "Will the note mean anything to the next person?", cn: "这条标注对下一个人有意义吗？" },
            { who: "客服", en: "It means the next person sees the history before they speak to you.", cn: "意思是下一个人跟你说话之前会看到全部历史。" },
            { who: "顾客", en: "...That's all I wanted three weeks ago.", cn: "……三周前我要的就是这个。" },
            { who: "客服", en: "I know. And I'd ask you to hold me to it by name, which is on this email.", cn: "我知道。而且请您用名字盯着我办，名字在这封邮件里。" }
          ]
        },
        {
          variant: "渠道变体（在线客服聊天）",
          relation: "顾客 · 在线客服",
          register: "半正式",
          channel: "在线聊天",
          barrier: "物流显示已送达，但门口照片不是自家",
          result: "达成（提交理赔，标记快递员并换人派送）",
          lines: [
            { who: "顾客", en: "my order says delivered but nothing arrived", cn: "我的订单显示已送达，但什么都没到" },
            { who: "客服", en: "the photo on the tracking shows a doorstep. is that yours", cn: "物流照片显示一个门口。是您家吗" },
            { who: "顾客", en: "no. different door, different colour", cn: "不是。门不一样，颜色也不一样" },
            { who: "客服", en: "then it was delivered to the wrong address. i'm filing a claim now", cn: "那就是送错地址了。我现在提交理赔" },
            { who: "顾客", en: "how long", cn: "要多久" },
            { who: "客服", en: "24 hours to confirm, then replacement or refund, your choice", cn: "24 小时确认，然后换货或退款，您选" },
            { who: "顾客", en: "replacement. same item", cn: "换货。同一件" },
            { who: "客服", en: "done. and i've flagged the courier, not you", cn: "好了。另外我标记的是快递员，不是您" },
            { who: "顾客", en: "what does flagged mean", cn: "标记是什么意思" },
            { who: "客服", en: "it means the next one is delivered by someone else", cn: "意思是下一件换个人送" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "顾客 · 客服主管（正式交涉）",
          register: "正式",
          channel: "面对面（客服中心）",
          barrier: "无（但需正式陈述时间线并要求全额退款）",
          result: "达成（全额退款并退运费，档案注明失误）",
          lines: [
            { who: "主管", en: "You have written to us about the kettle and the replacement. May we go through it?", cn: "您已就水壶和换货事宜致函我们。我们可以逐项过一遍吗？" },
            { who: "顾客", en: "Please. The sequence matters more than the fault.", cn: "请。经过比故障本身更重要。" },
            { who: "主管", en: "Then state the sequence.", cn: "那请您陈述经过。" },
            { who: "顾客", en: "Reported on the third, replaced on the ninth, and the replacement leaked on the eleventh. I telephoned on the twelfth, was told to email, and emailed on the twelfth.", cn: "三号报修，九号换货，十一号换的那件也漏。十二号我打电话，被告知要发邮件，我十二号发了邮件。" },
            { who: "主管", en: "I have the email. The reply took six days.", cn: "邮件我有。回复用了六天。" },
            { who: "顾客", en: "It did, and the reply asked me to do what I had already described doing.", cn: "是的，而且回复让我做的正是我已经写明做过的事。" },
            { who: "主管", en: "That is a failure of reading, and I shall say so in the file.", cn: "这是阅读上的失误，我会在档案里这么写。" },
            { who: "顾客", en: "I should like a full refund rather than a third replacement, and the delivery charge returned.", cn: "我希望全额退款，而不是第三次换货，并退还运费。" },
            { who: "主管", en: "That is reasonable, and I shall approve it today.", cn: "这合理，我今天批准。" },
            { who: "顾客", en: "Then I have no complaint about the outcome, only about the six days.", cn: "那我对结果没有意见，只是对那六天有意见。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "顾客 · 客服（换货）",
          register: "随意（极简、俚语）",
          channel: "在线聊天",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "顾客", en: "this is broken", cn: "这个坏了" },
            { who: "客服", en: "when did you buy it", cn: "什么时候买的" },
            { who: "顾客", en: "last month", cn: "上个月" },
            { who: "客服", en: "refund or swap", cn: "退款还是换" },
            { who: "顾客", en: "swap", cn: "换" },
            { who: "客服", en: "same colour", cn: "同色吗" },
            { who: "顾客", en: "yeah", cn: "是" },
            { who: "客服", en: "label's in your email", cn: "标签在您邮箱里" },
            { who: "顾客", en: "cheers", cn: "谢了" }
          ]
        }
      ]
    },

    /* ==================== 07-02 预订与取消 ==================== */
    {
      id: "s07-02",
      domain: "07",
      title: "预订与取消",
      ielts: "口语 P2 场景 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "顾客 · 预订客服（改期与加人）",
          register: "半正式",
          channel: "电话",
          barrier: "无",
          result: "达成（改到下周六八点，换大桌）",
          lines: [
            { who: "客服", en: "You'd like to cancel the booking for Saturday?", cn: "您要取消周六的预订？" },
            { who: "顾客", en: "Change it, if I can. Same time, next Saturday.", cn: "如果能改就改。同一时间，下周六。" },
            { who: "客服", en: "Let me look. ...Next Saturday is free at seven thirty.", cn: "我看一下。……下周六七点半有空位。" },
            { who: "顾客", en: "Then move it rather than cancel it.", cn: "那就改，不用取消。" },
            { who: "客服", en: "Done. Is the number of guests the same?", cn: "改好了。人数一样吗？" },
            { who: "顾客", en: "Six instead of four, if that's possible.", cn: "如果可以，从四位改成六位。" },
            { who: "客服", en: "Six needs the larger table, which is taken at seven thirty but free at eight.", cn: "六位需要大桌，七点半被订了，八点空着。" },
            { who: "顾客", en: "Eight is fine. Are you sure the table is big enough?", cn: "八点可以。您确定桌子够大吗？" },
            { who: "客服", en: "It seats eight. I would rather you had space than be squeezed.", cn: "能坐八人。我宁愿您宽敞点，而不是挤着。" },
            { who: "顾客", en: "That's how it should be done. Thank you.", cn: "就该这么做。谢谢。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "顾客 · 客服（严格取消政策）",
          register: "半正式",
          channel: "电话",
          barrier: "无（但要用「政策允许的另一半」换到改期）",
          result: "达成（改到十月同一周，无需证明）",
          lines: [
            { who: "客服", en: "The booking is non-refundable within seven days.", cn: "预订在七天之内不可退款。" },
            { who: "顾客", en: "I'm cancelling because of a hospital appointment, not a change of mind.", cn: "我取消是因为医院预约，不是改主意。" },
            { who: "客服", en: "The policy doesn't distinguish between the two.", cn: "政策不区分这两种情况。" },
            { who: "顾客", en: "Then I'll ask for the part the policy does allow: can the dates be moved instead?", cn: "那我要政策允许的那部分：日期能改吗？" },
            { who: "客服", en: "A date change is allowed once, within six months.", cn: "六个月内可以改一次日期。" },
            { who: "顾客", en: "Then move it to the same week in October, and I'll send the appointment letter.", cn: "那就改到十月同一周，我会把预约单发过来。" },
            { who: "客服", en: "The letter isn't needed for a date change. Keep it.", cn: "改期不需要那封信。您留着吧。" },
            { who: "顾客", en: "Then why would it be needed if I cancelled?", cn: "那如果我是取消，为什么要那封信？" },
            { who: "客服", en: "Because a refund needs a reason on file. A date change doesn't.", cn: "因为退款需要在档案里有理由。改期不需要。" },
            { who: "顾客", en: "Good to know. October, then, and please confirm by email.", cn: "这很有用。那就十月，请邮件确认。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "顾客 · 客服（过了免费取消期）",
          register: "半正式",
          channel: "电话",
          barrier: "二十四小时内取消要给一晚房费",
          result: "折中（把预订转给妹妹，一分不浪费）",
          lines: [
            { who: "顾客", en: "I need to cancel tomorrow's booking.", cn: "我要取消明天的预订。" },
            { who: "客服", en: "That's inside twenty-four hours, so the first night is charged.", cn: "这在二十四小时之内，所以第一晚要收费。" },
            { who: "顾客", en: "I know. Is there anything better than paying for a room I won't use?", cn: "我知道。有没有比为一间我不会用的房间付钱更好的办法？" },
            { who: "客服", en: "Two options: move it to a date within thirty days, or transfer it to someone else.", cn: "两个选择：改到三十天内的某个日期，或者转给别人。" },
            { who: "顾客", en: "Transfer it to my sister. Can she just give my name?", cn: "转给我妹妹。她报我的名字就行吗？" },
            { who: "客服", en: "Give me her name and I'll amend the booking. She'll need ID at check-in.", cn: "把她的名字给我，我改预订。她入住时需要证件。" },
            { who: "顾客", en: "And the payment?", cn: "付款呢？" },
            { who: "客服", en: "It stays as it is. She pays nothing, because you have already paid.", cn: "不变。她不用付，因为您已经付了。" },
            { who: "顾客", en: "Then nothing is wasted. That's better than I expected.", cn: "那就没有浪费。比我预想的好。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "顾客 · 客服（确认信日期错）",
          register: "半正式",
          channel: "电话 + 邮件",
          barrier: "电话里确认的是十四号，确认信写成四号",
          result: "修复（改到十四号，并用文字写出星期几）",
          lines: [
            { who: "顾客", en: "I booked for the fourteenth and the confirmation says the fourth.", cn: "我订的是十四号，确认信写的是四号。" },
            { who: "客服", en: "The system has the fourth at seven.", cn: "系统里是四号七点。" },
            { who: "顾客", en: "I read the date back on the phone and it was confirmed.", cn: "我在电话里复述过日期，而且被确认了。" },
            { who: "客服", en: "There's a note: customer confirmed the fourth.", cn: "有条备注：客户确认四号。" },
            { who: "顾客", en: "Then the error happened before that, and the note recorded the error instead of catching it.", cn: "那错误发生在之前，而备注记录了这个错误，而不是发现它。" },
            { who: "客服", en: "That is a fair reading. I'll move it to the fourteenth, and there's space.", cn: "这个解读公道。我改到十四号，还有位置。" },
            { who: "顾客", en: "Could you also confirm by email with the day written out in words?", cn: "另外能用邮件确认，并把星期几写成文字吗？" },
            { who: "客服", en: "Friday the fourteenth. I'll write it exactly like that.", cn: "十四号星期五。我就这么写。" },
            { who: "顾客", en: "Words prevent this. Digits cause it.", cn: "文字能防止这种事，数字会引发它。" }
          ]
        },
        {
          variant: "情绪型（出发前两天被取消）",
          relation: "顾客 · 客服（酒店停业）",
          register: "半正式（情绪化）",
          channel: "电话",
          barrier: "出发前两天酒店取消预订，顾客无处可住",
          result: "达成（同区同价换到更好的酒店，差价商家承担）",
          lines: [
            { who: "顾客", en: "You've cancelled my booking two days before I travel.", cn: "你们在我出发前两天取消了预订。" },
            { who: "客服", en: "The hotel has closed for refurbishment.", cn: "酒店因翻新停业了。" },
            { who: "顾客", en: "That's their problem, and I'm the one with no room.", cn: "那是他们的问题，而没房住的是我。" },
            { who: "客服", en: "You're right, and we're responsible for finding you somewhere.", cn: "您说得对，我们有责任给您找地方。" },
            { who: "顾客", en: "At the same price, in the same area, for the same dates.", cn: "同价位、同区域、同日期。" },
            { who: "客服", en: "There are two options within a kilometre. One is better and costs us more.", cn: "一公里内有两个选择。一个更好，但我们要多花点钱。" },
            { who: "顾客", en: "Which one are you offering?", cn: "您给哪个？" },
            { who: "客服", en: "The better one. It's our failure, and I'm not going to save forty pounds on it.", cn: "更好的那个。这是我们的失误，我不想在这种事上省四十镑。" },
            { who: "顾客", en: "Then I've stopped being angry.", cn: "那我就不生气了。" },
            { who: "客服", en: "I would rather you stopped being angry than I saved the money.", cn: "我宁愿您不生气，也不想省那笔钱。" }
          ]
        },
        {
          variant: "渠道变体（App 自助改期）",
          relation: "顾客 · 预订客服（自助改期）",
          register: "半正式",
          channel: "App + 在线客服",
          barrier: "应用只给「取消」，把可改期这项藏起来",
          result: "达成（人工改期免手续费，并留下书面记录）",
          lines: [
            { who: "顾客", en: "The app won't let me change the date. It only offers cancel.", cn: "应用不让我改日期，只给取消。" },
            { who: "客服", en: "That's because it's a saver rate, which is changeable but not through the app.", cn: "因为这是特惠价，可以改，但不能通过应用改。" },
            { who: "顾客", en: "So the app offers the option that costs me money and hides the one that doesn't.", cn: "所以应用给的是让我花钱的选项，把不花钱的藏起来了。" },
            { who: "客服", en: "It does, and I have raised it twice internally.", cn: "确实，我内部提过两次了。" },
            { who: "顾客", en: "Then change it for me now. Same booking, one week later.", cn: "那现在帮我改。同一个预订，推后一周。" },
            { who: "客服", en: "Done, and there's no fee, because the rate allows one change.", cn: "改好了，没有费用，因为这个价格允许改一次。" },
            { who: "顾客", en: "Does that use up my one change?", cn: "这算用掉了我那一次改期吗？" },
            { who: "客服", en: "It does, and the app should have told you that as well.", cn: "算，而且应用也该告诉您这一点。" },
            { who: "顾客", en: "Write it in the chat so I have it.", cn: "在聊天里写给我，我好留底。" },
            { who: "客服", en: "Written. Quote this reference if anyone queries it.", cn: "写好了。如果有人质疑，报这个编号。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "客户 · 场地经理（正式取消宴会厅）",
          register: "正式",
          channel: "书面 + 面谈",
          barrier: "无（但需确认费用与退款形式）",
          result: "达成（免收费取消，十四天内按原方式退订金）",
          lines: [
            { who: "经理", en: "We have your letter regarding the cancellation of the function room.", cn: "我们收到您关于取消宴会厅的信函。" },
            { who: "顾客", en: "I should like to cancel on the fourteenth of June and to understand the charges.", cn: "我想取消六月十四日的预订，并了解相关费用。" },
            { who: "经理", en: "Under the terms, cancellation more than twenty-eight days before the event carries no charge.", cn: "按条款，活动前二十八天以上取消不收费。" },
            { who: "顾客", en: "That is more than fifty days, so no charge applies.", cn: "那是五十多天，所以不应收费。" },
            { who: "经理", en: "Correct. The deposit is returned within fourteen days.", cn: "正确。订金在十四天内退还。" },
            { who: "顾客", en: "May I ask in what form, and whether any administration fee is deducted?", cn: "请问以什么形式退还，是否扣除手续费？" },
            { who: "经理", en: "By the original method, and no fee is deducted on a cancellation with this much notice.", cn: "按原支付方式，且在此通知期下取消不扣手续费。" },
            { who: "顾客", en: "Then I shall confirm the cancellation in writing today, and I should like the refund date in writing as well.", cn: "那我今天书面确认取消，并希望退款日期也书面告知。" },
            { who: "经理", en: "You shall have both by the end of the week.", cn: "两项本周内都会给您。" },
            { who: "顾客", en: "Thank you. We may wish to rebook in the autumn.", cn: "谢谢。我们秋天可能还想再订。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "顾客 · 预订客服",
          register: "随意（极简、俚语）",
          channel: "电话",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "顾客", en: "need to cancel saturday", cn: "周六的预订要取消" },
            { who: "客服", en: "name", cn: "姓名" },
            { who: "顾客", en: "reid", cn: "Reid" },
            { who: "客服", en: "cancel or move", cn: "取消还是改期" },
            { who: "顾客", en: "move if you can", cn: "能改就改" },
            { who: "客服", en: "next saturday, same time", cn: "下周六，同一时间" },
            { who: "顾客", en: "go on then", cn: "那就这样" },
            { who: "客服", en: "done", cn: "改好了" },
            { who: "顾客", en: "cheers", cn: "谢了" }
          ]
        }
      ]
    },

    /* ==================== 07-03 账单争议与会员积分 ==================== */
    {
      id: "s07-03",
      domain: "07",
      title: "账单争议与会员积分",
      ielts: "口语 P3 场景 / 听力 S3",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "顾客 · 手机运营商客服",
          register: "半正式",
          channel: "电话客服",
          barrier: "无",
          result: "达成（弄清渡轮卫星费，免一半并加屏蔽）",
          lines: [
            { who: "客服", en: "How can I help?", cn: "需要什么帮助？" },
            { who: "顾客", en: "My bill is forty pounds higher than usual and I don't know why.", cn: "我的话费比平时高四十镑，我不知道为什么。" },
            { who: "客服", en: "There's a roaming charge of thirty-two from the ninth to the twelfth.", cn: "九号到十二号有一笔三十二镑的漫游费。" },
            { who: "顾客", en: "I was in France for three days. I thought roaming was included.", cn: "我在法国待了三天。我以为漫游是包含的。" },
            { who: "客服", en: "It is included in your plan within the EU, and France is in the EU.", cn: "在您的套餐里欧盟境内是包含的，法国属于欧盟。" },
            { who: "顾客", en: "Then why has it been charged?", cn: "那为什么收费了？" },
            { who: "客服", en: "The charge is from a satellite service, not from a French network.", cn: "这笔费用来自卫星服务，不是法国运营商。" },
            { who: "顾客", en: "I was on a ferry. That must be it.", cn: "我在渡轮上。应该是这个。" },
            { who: "客服", en: "That will be it. Satellite is excluded, and it's on page nine.", cn: "就是这个。卫星不在包含范围内，写在第九页。" },
            { who: "顾客", en: "Could it be removed as a first-time thing?", cn: "能按首次情况免掉吗？" },
            { who: "客服", en: "I can remove half, and I'll put a bar on satellite so that it can't happen again.", cn: "我可以免一半，并给您加一道卫星屏蔽，免得再发生。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "顾客 · 客服（不明订阅费）",
          register: "半正式",
          channel: "电话客服",
          barrier: "无（但要用录音文字记录反证「价格没念过」）",
          result: "达成（退还四个月并取消订阅）",
          lines: [
            { who: "顾客", en: "There's a subscription of nine ninety-nine on my card for four months.", cn: "我卡上有一笔九块九九的订阅费，连续四个月。" },
            { who: "客服", en: "It was added during a call in March. There's a recording reference.", cn: "是三月一通电话里加的。有录音编号。" },
            { who: "顾客", en: "I didn't agree to anything in March. May I hear the recording?", cn: "我三月没同意过任何事。我能听录音吗？" },
            { who: "客服", en: "I can't play it, but I can send a transcript.", cn: "我不能播放，但可以发文字记录。" },
            { who: "顾客", en: "Then send it before we discuss anything else.", cn: "那先发给我，我们再谈别的。" },
            { who: "客服", en: "...The transcript shows the agent described it and you said yes.", cn: "……记录显示坐席介绍了这项服务，您说了好。" },
            { who: "顾客", en: "I said yes to a free trial. Was the price mentioned?", cn: "我说好的是免费试用。价格提到了吗？" },
            { who: "客服", en: "The transcript is abbreviated. I can't confirm the price was read.", cn: "记录是节略的。我无法确认价格被念过。" },
            { who: "顾客", en: "Then refund the four months and cancel it, and note that the price cannot be evidenced.", cn: "那就退还四个月并取消，并注明价格无法举证。" },
            { who: "客服", en: "I'll refund all four months, and the cancellation is done.", cn: "我全额退还四个月，取消已办。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "顾客 · 客服（积分过期）",
          register: "半正式",
          channel: "电话客服",
          barrier: "六千积分过期，系统已删无法恢复",
          result: "折中（现有积分延长十二个月 + 双倍积分活动）",
          lines: [
            { who: "顾客", en: "Six thousand points expired last month. I'd like them reinstated.", cn: "上个月六千积分过期了。我希望恢复。" },
            { who: "客服", en: "Points expire after twenty-four months.", cn: "积分二十四个月后过期。" },
            { who: "顾客", en: "I know, and I couldn't travel for most of that because of the restrictions.", cn: "我知道，而且其中大部分时间因为管控我没法出行。" },
            { who: "客服", en: "The system deleted them on the first.", cn: "系统在一号已删除。" },
            { who: "顾客", en: "Can anything be done, or is this the end of it?", cn: "有办法吗，还是就到此为止？" },
            { who: "客服", en: "I can't reinstate points, but I can extend the ones you hold now by twelve months.", cn: "我没法恢复积分，但可以把您现在持有的积分延长十二个月。" },
            { who: "顾客", en: "That's forty-five hundred points I won't lose.", cn: "那就是四千五百积分不会丢了。" },
            { who: "客服", en: "And if you book before December, there's a double-points offer which would replace most of the six.", cn: "另外如果十二月前预订，有个双倍积分活动，能补回六千中的大部分。" },
            { who: "顾客", en: "Now that is a real answer.", cn: "这才是真正的答复。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "顾客 · 客服（地址改了没同步）",
          register: "半正式",
          channel: "电话客服",
          barrier: "App 里改过的地址没同步到计费系统，账单寄错三个月",
          result: "修复（更正并回溯到一月，注明信件不得寄旧地址）",
          lines: [
            { who: "顾客", en: "I've been billed at my old address for three months.", cn: "我按旧地址被收费三个月了。" },
            { who: "客服", en: "The address on the account is the old one.", cn: "账户上的地址是旧的。" },
            { who: "顾客", en: "I updated it in January, in the app, and it confirmed.", cn: "我一月份在应用里更新过，而且有确认。" },
            { who: "客服", en: "The app update didn't reach the billing system. That's a known issue.", cn: "应用的更新没有同步到计费系统。这是已知问题。" },
            { who: "顾客", en: "Known since when?", cn: "从什么时候开始知道的？" },
            { who: "客服", en: "Since November, and the fix is due next month.", cn: "从十一月起，修复预计下个月。" },
            { who: "顾客", en: "So for three months my address has been wrong and nobody told me.", cn: "所以三个月里我的地址是错的，也没人告诉我。" },
            { who: "客服", en: "We write to the address we hold, which was the old one.", cn: "我们按留存的地址寄信，而那是旧地址。" },
            { who: "顾客", en: "Then anything important has been going to strangers.", cn: "那所有重要文件都寄给陌生人了。" },
            { who: "客服", en: "I'll correct it now, backdate it to January, and note that correspondence must not go to the old address.", cn: "我现在更正，回溯到一月，并注明信件不得寄往旧地址。" }
          ]
        },
        {
          variant: "情绪型（被威胁转催收）",
          relation: "顾客 · 客服（收到催收信）",
          register: "半正式（情绪化）",
          channel: "电话客服",
          barrier: "明明付过的款因账号差一位挂到别人账上，五个月后收到催收信",
          result: "达成（转账销账、停止催收、书面确认并申请免滞纳金）",
          lines: [
            { who: "顾客", en: "I've had a letter saying I owe two hundred and it will go to a collection agency.", cn: "我收到一封信，说我欠两百，还要转给催收公司。" },
            { who: "客服", en: "The account shows an unpaid balance from March.", cn: "账户显示三月有一笔未付余额。" },
            { who: "顾客", en: "I paid that in March, by card, over the phone. I have the statement.", cn: "我三月就付了，用卡，电话里付的。我有对账单。" },
            { who: "客服", en: "The payment went to the wrong account number, one digit out.", cn: "那笔付款打到了错误的账号，差一位数字。" },
            { who: "顾客", en: "Whose account did it go to?", cn: "打到谁的账号了？" },
            { who: "客服", en: "Another customer's. It has been sitting as a credit on their account.", cn: "另一位客户的。一直挂在他们的账户上作为余额。" },
            { who: "顾客", en: "So the money existed, and the letters kept coming for five months.", cn: "所以钱是有的，而信来了五个月。" },
            { who: "客服", en: "That is indefensible. I'll transfer it, stop the collection process today, and write to you confirming it.", cn: "这一点无法辩解。我现在转账、停止催收流程，并书面确认给您。" },
            { who: "顾客", en: "Written confirmation is what I needed in March.", cn: "书面确认正是我三月就需要的东西。" },
            { who: "客服", en: "And I'll ask for the late fee to be removed as well.", cn: "另外我会申请把滞纳金也免掉。" }
          ]
        },
        {
          variant: "渠道变体（App 账单明细）",
          relation: "顾客 · 客服（明细打不开）",
          register: "半正式",
          channel: "App + 电话客服",
          barrier: "账单里「服务费」点开是空框，毫无说明",
          result: "达成（查明是纸质账单费，免收并上报缺陷）",
          lines: [
            { who: "顾客", en: "The app shows a charge called service fee with no description.", cn: "应用里有一笔叫服务费的费用，没有说明。" },
            { who: "客服", en: "It should open when you tap it.", cn: "点一下应该会展开。" },
            { who: "顾客", en: "It opens an empty box. I've tried twice.", cn: "它打开的是一个空框。我试了两次。" },
            { who: "客服", en: "That means the description wasn't attached when the charge was raised.", cn: "那说明生成这笔费用时没有附说明。" },
            { who: "顾客", en: "So the app is faithfully showing me nothing.", cn: "所以应用忠实地什么都没显示。" },
            { who: "客服", en: "It is. I can see the detail on my side: it's a paper bill charge.", cn: "是的。我这边能看到明细：是纸质账单费。" },
            { who: "顾客", en: "I never asked for paper bills.", cn: "我从没要过纸质账单。" },
            { who: "客服", en: "It's charged when the address is undeliverable and we post instead of emailing.", cn: "当地址无法投递、我们改为寄信而不是邮件时就会收这笔费用。" },
            { who: "顾客", en: "Then that's the same address error as everything else.", cn: "那这跟其他问题一样，还是地址错误。" },
            { who: "客服", en: "It is. I'll remove the charge, fix the address, and report the empty box as a bug.", cn: "是的。我去掉这笔费用、更正地址，并把空框作为程序缺陷上报。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "客户 · 服务商经理（正式账单争议）",
          register: "正式",
          channel: "面对面 + 书面",
          barrier: "无（但需逐项区分接受与异议的依据）",
          result: "达成（两项冲抵，更正后账单只剩两项）",
          lines: [
            { who: "经理", en: "You have disputed the invoice of the twelfth. May we go through the items?", cn: "您对十二号的账单提出异议。我们可以逐项核对吗？" },
            { who: "顾客", en: "Please. I dispute two of the four items, and I accept the other two.", cn: "请。四项中我异议两项，接受另外两项。" },
            { who: "经理", en: "Which do you accept?", cn: "您接受哪两项？" },
            { who: "顾客", en: "The line rental and the calls. I dispute the service fee and the roaming charge.", cn: "月租和通话费。我异议服务费和漫游费。" },
            { who: "经理", en: "On what basis is the roaming charge disputed?", cn: "漫游费的异议依据是什么？" },
            { who: "顾客", en: "It was incurred on a ferry, which was within the area covered by my plan. I accept that the exclusion exists; I dispute that it was made clear.", cn: "它产生在渡轮上，而渡轮在我套餐覆盖区域内。我承认这条除外条款存在；我异议的是它没有被明确告知。" },
            { who: "经理", en: "That is a fair distinction and I shall treat it as such. I shall credit the roaming charge.", cn: "这个区分合理，我就按这个处理。我会冲抵漫游费。" },
            { who: "顾客", en: "And the service fee?", cn: "那服务费呢？" },
            { who: "经理", en: "That follows from the same address error, so it is credited as well.", cn: "那笔源于同一个地址错误，因此也一并冲抵。" },
            { who: "顾客", en: "Then the corrected invoice should show two items only.", cn: "那更正后的账单应该只剩两项。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "顾客 · 客服（话费异常）",
          register: "随意（极简、俚语）",
          channel: "电话客服",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "顾客", en: "why is my bill bigger", cn: "我的账单为什么变多了" },
            { who: "客服", en: "roaming", cn: "漫游" },
            { who: "顾客", en: "i wasn't abroad", cn: "我没出国" },
            { who: "客服", en: "ferry", cn: "渡轮" },
            { who: "顾客", en: "ah", cn: "啊" },
            { who: "客服", en: "yeah, satellite", cn: "对，卫星" },
            { who: "顾客", en: "can you take it off", cn: "能去掉吗" },
            { who: "客服", en: "half of it", cn: "免一半" },
            { who: "顾客", en: "i'll take half", cn: "一半也行" }
          ]
        }
      ]
    },

    /* ==================== 08-01 语音留言与电话转接 ==================== */
    {
      id: "s08-01",
      domain: "08",
      title: "语音留言与电话转接",
      ielts: "口语 P2 场景 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "来电者 · 公司前台（转接）",
          register: "半正式",
          channel: "电话转接",
          barrier: "无",
          result: "达成（要来分机号与姓名，转接一次成功）",
          lines: [
            { who: "前台", en: "Good morning, Hartley and Co.", cn: "早上好，Hartley 公司。" },
            { who: "来电者", en: "Could I speak to someone about an invoice, please?", cn: "我想找个人问一张发票的事。" },
            { who: "前台", en: "That's accounts. I'll put you through.", cn: "那是财务部。我给您转过去。" },
            { who: "来电者", en: "Before you do, could you tell me the extension in case we're cut off?", cn: "转之前能告诉我分机号吗，万一断线了？" },
            { who: "前台", en: "Two one four. And your name, in case they ask?", cn: "二一四。请问您贵姓，万一他们问？" },
            { who: "来电者", en: "Reid. R-E-I-D.", cn: "姓 Reid，R-E-I-D。" },
            { who: "前台", en: "Putting you through now.", cn: "现在为您转接。" },
            { who: "来电者", en: "Thank you.", cn: "谢谢。" },
            { who: "财务", en: "Accounts, this is Priya. Mr Reid?", cn: "财务部，我是 Priya。Reid 先生？" },
            { who: "来电者", en: "That's me, and the extension worked.", cn: "是我，分机有用。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "来电者 · 客服（被转四次）",
          register: "半正式",
          channel: "电话转接",
          barrier: "无（但要在两个团队之间要到「一个负责人」）",
          result: "达成（指定负责人 + 编号 + 明日五点前回电）",
          lines: [
            { who: "来电者", en: "This is the fourth transfer. Each person says it isn't their department.", cn: "这是第四次转接了。每个人都说不是他们部门。" },
            { who: "客服", en: "The order was placed online and the delivery was by a partner, so it sits between two teams.", cn: "订单是网上下单，配送是合作方，所以它卡在两个团队之间。" },
            { who: "来电者", en: "I understand why it sits between two teams. What I need is one person who owns it.", cn: "我理解为什么卡在中间。我需要的是一个负责它的人。" },
            { who: "客服", en: "I can be that person, but I'd have to call you back after speaking to the partner.", cn: "我可以当那个人，但我得先跟合作方沟通再回电给您。" },
            { who: "来电者", en: "That's acceptable, if you give me a deadline and a reference.", cn: "可以接受，只要给我一个期限和一个编号。" },
            { who: "客服", en: "Reference eight eight four two, and I'll call by five tomorrow.", cn: "编号八八四二，我明天五点前回电。" },
            { who: "来电者", en: "And if you can't reach the partner?", cn: "如果联系不上合作方呢？" },
            { who: "客服", en: "I still call, and I tell you that, rather than letting it go quiet.", cn: "我照样打，而且告诉你这件事，而不是让它没声音。" },
            { who: "来电者", en: "That last part is why I'm staying on this call.", cn: "最后这句正是我还留在这通电话上的原因。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "来电者 · 前台（要找的人不在）",
          register: "半正式",
          channel: "电话 + 邮件",
          barrier: "想直接找的人开会到四点，留言可能明天才听",
          result: "折中（标题写姓名与编号的邮件 + 三十秒语音留言）",
          lines: [
            { who: "来电者", en: "Is Mr Achebe in? I've been given his name.", cn: "Achebe 先生在吗？有人给了我他的名字。" },
            { who: "前台", en: "He's in a meeting until four.", cn: "他在开会，到四点。" },
            { who: "来电者", en: "I'd rather not explain the whole thing twice. Could I leave a detailed message?", cn: "我不想把事情讲两遍。我能留个详细留言吗？" },
            { who: "前台", en: "You can, but he may not listen until tomorrow.", cn: "可以，但他可能明天才听。" },
            { who: "来电者", en: "Then is there a way to make it more likely?", cn: "那有办法让它更容易被听到吗？" },
            { who: "前台", en: "Send it by email with his name and the reference in the subject line. He reads those first.", cn: "发邮件，把他的名字和编号写在标题里。那些他先看。" },
            { who: "来电者", en: "And the voicemail as well?", cn: "语音留言也留吗？" },
            { who: "前台", en: "Thirty seconds, with the same reference. The email explains the rest.", cn: "三十秒，报同样的编号。细节让邮件说。" },
            { who: "来电者", en: "Reference in the subject, thirty seconds on the phone. That's a method.", cn: "标题写编号，电话三十秒。这算方法。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "来电者 · 客服（留言被截断）",
          register: "半正式",
          channel: "语音留言",
          barrier: "系统三十秒自动截断，号码没录进去",
          result: "修复（重留并改用「先说号码」的顺序）",
          lines: [
            { who: "来电者", en: "I left a message on Friday and it seems to have been cut off.", cn: "我周五留了言，好像被截断了。" },
            { who: "客服", en: "There's a message here that ends mid-sentence.", cn: "这里有条留言，断在半句。" },
            { who: "来电者", en: "The system cut me off at thirty seconds.", cn: "系统在三十秒时把我切断了。" },
            { who: "客服", en: "It does that, and it doesn't warn you.", cn: "它就是这样，而且不提示。" },
            { who: "来电者", en: "Then my number wasn't in the first thirty seconds, so nobody could call back.", cn: "那我的号码不在前三十秒里，所以没人能回电。" },
            { who: "客服", en: "That's the usual failure. I'm listening to the start now: you said your name and then the background.", cn: "这是常见的失误。我现在听开头：您说了名字，然后是背景音。" },
            { who: "来电者", en: "I was on a train.", cn: "我在火车上。" },
            { who: "客服", en: "Nothing after that. Say the number first next time, and the reason second.", cn: "后面就没内容了。下次先说号码，再说事由。" },
            { who: "来电者", en: "Number first. That's counter-intuitive, and it's right.", cn: "先说号码。这有点反直觉，但是对的。" }
          ]
        },
        {
          variant: "情绪型（急事被转来转去）",
          relation: "来电者 · 客服（款项未到）",
          register: "半正式（着急）",
          channel: "电话转接",
          barrier: "款项未到且明天中午供应商停工，已被转三次",
          result: "达成（客服代为转接并二十分钟内回电）",
          lines: [
            { who: "来电者", en: "I need to speak to someone about a payment that hasn't arrived. It's urgent.", cn: "我需要找人问一笔没到的款项。这很紧急。" },
            { who: "客服", en: "Everything gets marked urgent. Tell me the deadline instead.", cn: "所有事都会被标成紧急。请告诉我截止时间。" },
            { who: "来电者", en: "The supplier stops work at midday tomorrow.", cn: "供应商明天中午就停工。" },
            { who: "客服", en: "Then that is urgent, and it's three fifteen now, so we have until six today.", cn: "那确实紧急，现在三点十五，所以到今天六点为止。" },
            { who: "来电者", en: "I've been transferred three times so far.", cn: "我已经被转了三次了。" },
            { who: "客服", en: "Then I'll do the transfers instead of you. Sit down and I'll call you back in twenty minutes.", cn: "那转接我来做，不是你。您坐着，我二十分钟后回电。" },
            { who: "来电者", en: "You don't have my number. I've been transferred three times.", cn: "你没有我的号码。我被转了三次。" },
            { who: "客服", en: "Then give it to me now and I'll repeat it back.", cn: "那现在给我，我复述一遍。" },
            { who: "来电者", en: "It's the one you're speaking to.", cn: "就是你正在通话的这个号。" },
            { who: "客服", en: "...Fair. Twenty minutes.", cn: "……有道理。二十分钟。" }
          ]
        },
        {
          variant: "渠道变体（自动语音菜单）",
          relation: "来电者 · 语音菜单 + 客服",
          register: "半正式",
          channel: "自动语音菜单（IVR）",
          barrier: "菜单层层嵌套，几乎劝退来电者",
          result: "达成（按「更早订单」选项接通人工）",
          lines: [
            { who: "系统", en: "Press one for accounts, two for deliveries, three for complaints.", cn: "财务请按一，配送请按二，投诉请按三。" },
            { who: "来电者", en: "Deliveries.", cn: "配送。" },
            { who: "系统", en: "For deliveries within the last seven days, press one. For older, press two.", cn: "七天内的配送请按一，更早的请按二。" },
            { who: "来电者", en: "Two.", cn: "二。" },
            { who: "系统", en: "To leave a message, press one. To speak to an adviser, press two and hold.", cn: "留言请按一，转人工请按二并等候。" },
            { who: "来电者", en: "Two, and hold.", cn: "二，然后等。" },
            { who: "系统", en: "Your position in the queue is nine.", cn: "您排在第 9 位。" },
            { who: "客服", en: "Deliveries, this is Sam.", cn: "配送部，我是 Sam。" },
            { who: "来电者", en: "I got through. Are these menus designed to make people give up?", cn: "接通了。这些菜单是设计来让人放弃的吗？" },
            { who: "客服", en: "Honestly, that is what the data shows, and it's why I always press the older-order option myself.", cn: "说实话，数据就是这样，所以我自己也总是先按更早订单那个选项。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "来电者 · 公司前台（正式留言）",
          register: "正式",
          channel: "电话留言",
          barrier: "无（但需正式说明事由、时段与保密安排）",
          result: "达成（预约回电时段，并邮件补充函件）",
          lines: [
            { who: "来电者", en: "Good morning. I should like to leave a message for Ms Fenwick regarding the contract dated the third.", cn: "早上好。我想给 Fenwick 女士留个言，关于三号那份合同。" },
            { who: "前台", en: "I'll take the details. Would you prefer a call back or an email?", cn: "我记录一下。您希望回电还是邮件？" },
            { who: "来电者", en: "A call back, between nine and eleven if possible, and the matter is not urgent.", cn: "回电，如果可能的话在九点到十一点之间，事情不急。" },
            { who: "前台", en: "Not urgent is useful to know. May I have the contract reference?", cn: "知道不急很有用。请问合同编号？" },
            { who: "来电者", en: "It is on the covering letter, which I shall email, so that the message and the letter are in one place.", cn: "在附函上，我会邮件发过去，这样留言和函件在同一处。" },
            { who: "前台", en: "That is more organised than most. Anything else you wish to add?", cn: "这比大多数人都有条理。还有什么要补充吗？" },
            { who: "来电者", en: "Only that I shall be unavailable on Friday, so the call should be before then.", cn: "只有一点：我周五没空，所以电话最好在那之前。" },
            { who: "前台", en: "Noted. I shall confirm receipt of your email by return.", cn: "记下了。我会回信确认收到邮件。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "来电者 · 前台（找人）",
          register: "随意（极简、俚语）",
          channel: "电话",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "来电者", en: "is sam there", cn: "Sam 在吗" },
            { who: "前台", en: "who's calling", cn: "哪位" },
            { who: "来电者", en: "rob", cn: "Rob" },
            { who: "前台", en: "he's on a call", cn: "他在打电话" },
            { who: "来电者", en: "tell him i rang", cn: "跟他说我打过" },
            { who: "前台", en: "about what", cn: "什么事" },
            { who: "来电者", en: "he'll know", cn: "他知道" },
            { who: "前台", en: "he won't", cn: "他不知道" },
            { who: "来电者", en: "the thing", cn: "那件事" },
            { who: "前台", en: "i'll say the thing", cn: "我就说那件事" },
            { who: "来电者", en: "cheers", cn: "谢了" }
          ]
        }
      ]
    },

    /* ==================== 08-02 信号不好与听不清 ==================== */
    {
      id: "s08-02",
      domain: "08",
      title: "信号不好与听不清",
      ielts: "口语 P2 场景 / 听力 S1",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "同事之间（通话中断）",
          register: "随意",
          channel: "手机通话",
          barrier: "无",
          result: "达成（换到窗边并改书面确认）",
          lines: [
            { who: "甲", en: "Sorry, you're breaking up. Can you hear me?", cn: "抱歉，你声音断断续续的。能听到我吗？" },
            { who: "乙", en: "I can hear you. You're cutting out on my side.", cn: "我能听到你。是你那边在断。" },
            { who: "甲", en: "Then I'll move. I'm standing next to a lift shaft.", cn: "那我换个地方。我站在电梯井旁边。" },
            { who: "乙", en: "Take your time.", cn: "不着急。" },
            { who: "甲", en: "Better? I'm by a window now.", cn: "好点吗？我现在在窗边。" },
            { who: "乙", en: "Much better. Where were we?", cn: "好多了。我们说到哪儿了？" },
            { who: "甲", en: "You were about to give me the figure.", cn: "你要给我那个数字了。" },
            { who: "乙", en: "Nineteen thousand, and I'm sending it in writing so the call doesn't matter.", cn: "一万九，而且我会书面发给你，这样通话就不重要了。" },
            { who: "甲", en: "That's the right instinct with a bad line.", cn: "信号差的时候这么做是对的。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "供应商 · 重要客户（线路差）",
          register: "半正式",
          channel: "手机通话 + 邮件",
          barrier: "无（但关键数字不在坏线路上确认）",
          result: "达成（邮件先给数字，一点半回电）",
          lines: [
            { who: "客户", en: "You're very faint. Should we reschedule?", cn: "你声音很小。我们要不要改时间？" },
            { who: "供应商", en: "If it suits you, yes. I don't want to confirm numbers over a bad line.", cn: "如果您方便就改。我不想在信号不好的线上确认数字。" },
            { who: "客户", en: "The board meets at three, so I need the numbers by two.", cn: "董事会三点开会，所以我两点前需要数字。" },
            { who: "供应商", en: "Then I'll email them within five minutes and call you back at half one.", cn: "那我在五分钟内邮件发过去，一点半再打给您。" },
            { who: "客户", en: "And if the line is bad again?", cn: "如果线路又不好呢？" },
            { who: "供应商", en: "Then we do it in writing only, and I'll treat your email reply as confirmation.", cn: "那就只走书面，我把您邮件的回复视为确认。" },
            { who: "客户", en: "That's acceptable. Send them now.", cn: "可以。现在发。" },
            { who: "供应商", en: "Sent, and I put the two figures in the subject line so you needn't open it in the meeting.", cn: "发了，而且我把两个数字写在标题里，您在会上不用打开。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "同事之间（打三次都听不清）",
          register: "随意",
          channel: "App 语音条",
          barrier: "电话连着断三次，双方都失去耐性",
          result: "折中（改用语音条，周五复盘是否可行）",
          lines: [
            { who: "甲", en: "I've called three times and we've lost the thread each time.", cn: "我打了三次电话，每次都断在半路。" },
            { who: "乙", en: "My signal at home is bad all evening.", cn: "我家晚上信号一直很差。" },
            { who: "甲", en: "Then let's stop trying to fix the call and fix the method.", cn: "那我们别再试着修这通电话，改修方法吧。" },
            { who: "乙", en: "Which is?", cn: "怎么改？" },
            { who: "甲", en: "Voice notes in the app. You speak when the signal allows and I listen when it suits me.", cn: "用应用里的语音条。你有信号时录，我方便时听。" },
            { who: "乙", en: "I've never used those.", cn: "我从没用过。" },
            { who: "甲", en: "Press and hold, speak, release. It's easier than a call, which is the strange part.", cn: "按住、说话、松手。比打电话容易，这才是奇怪的地方。" },
            { who: "乙", en: "Then let's try it this week and review on Friday.", cn: "那这周试试，周五看效果。" },
            { who: "甲", en: "And if it doesn't work, we go back to calls at your end of the day.", cn: "如果不行，就换回你那边白天的时候打电话。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "甲乙之间（数字听错）",
          register: "半正式",
          channel: "手机通话 + 邮件",
          barrier: "把五十听成十五，订单已按错误数量发出",
          result: "修复（一小时内改单并约定数字必须复述）",
          lines: [
            { who: "甲", en: "I wrote down fifteen, and you say it was fifty.", cn: "我记的是十五，你说是五十。" },
            { who: "乙", en: "Fifty. The line broke just as I said it.", cn: "五十。我说的时候线路正好断了。" },
            { who: "甲", en: "I acted on fifteen. I've already sent the order.", cn: "我按十五办了。订单已经发出去了。" },
            { who: "乙", en: "Can it be amended?", cn: "能改吗？" },
            { who: "甲", en: "Within an hour, yes. After that it becomes a change request.", cn: "一小时内可以。之后就要走变更申请。" },
            { who: "乙", en: "Then do it now, and I'll confirm by email in two minutes.", cn: "那现在就改，我两分钟后邮件确认。" },
            { who: "甲", en: "Amended. And from today, any number on a call gets repeated back.", cn: "改好了。从今天起，电话里的任何数字都要复述一遍。" },
            { who: "乙", en: "Agreed. Fifty, confirmed.", cn: "同意。五十，确认。" }
          ]
        },
        {
          variant: "情绪型（重要通话总断）",
          relation: "甲乙之间（时间紧）",
          register: "半正式（着急）",
          channel: "手机通话",
          barrier: "总断线且时间所剩不多，情绪上来",
          result: "达成（只问最关键的一问，其余改书面）",
          lines: [
            { who: "甲", en: "We keep cutting out and I'm running out of time.", cn: "我们一直断线，而我时间不多了。" },
            { who: "乙", en: "I can hear that you're frustrated.", cn: "我听得出你很着急。" },
            { who: "甲", en: "I'm not frustrated with you. I'm frustrated with the handset.", cn: "我不是对你着急。我是对这个话筒着急。" },
            { who: "乙", en: "Then let's use the three minutes we have. What's the one thing you need?", cn: "那我们把手上这三分钟用掉。你最需要哪一件事？" },
            { who: "甲", en: "One thing: can you deliver on the ninth or not?", cn: "一件事：九号你能交货还是不能？" },
            { who: "乙", en: "Not the ninth. The twelfth.", cn: "九号不行。十二号。" },
            { who: "甲", en: "Then that's the whole call. Everything else is detail.", cn: "那这通电话就完了。其余都是细节。" },
            { who: "乙", en: "I'll write the rest and send it tonight.", cn: "剩下的我写下来今晚发你。" },
            { who: "甲", en: "And I'll stop shouting at a handset.", cn: "那我也不用再对着话筒喊了。" }
          ]
        },
        {
          variant: "渠道变体（视频会议卡顿）",
          relation: "主持 · 参加者（视频会议）",
          register: "半正式",
          channel: "视频会议",
          barrier: "画面卡住，部分人看不到共享屏幕",
          result: "达成（关视频 + 口述内容，写进下次邀请）",
          lines: [
            { who: "主持", en: "Your audio is fine but the video is frozen.", cn: "你的声音正常，但画面卡住了。" },
            { who: "参加者", en: "Then I'll turn the video off. Nobody needs to watch me think.", cn: "那我关掉画面。没人需要看我思考的样子。" },
            { who: "主持", en: "That helps. You're clear now.", cn: "这有用。现在很清楚。" },
            { who: "参加者", en: "Can everyone see the shared screen, or can some only hear me?", cn: "大家都能看到共享屏幕吗，还是有人只能听到我？" },
            { who: "主持", en: "Two of us can see it, one can't.", cn: "我们两个能看到，一个看不到。" },
            { who: "参加者", en: "Then I'll describe it aloud as I go, so the audio carries the content.", cn: "那我边讲边口述，让声音承载内容。" },
            { who: "主持", en: "That's slower, and it works for everyone.", cn: "这样慢一点，但对所有人都有效。" },
            { who: "参加者", en: "It's the rule for hybrid meetings: assume someone can only hear you.", cn: "这是混合会议的规矩：假定有人只能听到你。" },
            { who: "主持", en: "I'll put that in the invitation for next time.", cn: "下次我把这句写进会议邀请里。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "会议主席 · 分会场（正式电话会议线路问题）",
          register: "正式",
          channel: "正式电话会议",
          barrier: "无（但需正式确立「书面 + 口头」双重确认程序）",
          result: "达成（每项决定当场复述确认并记入纪要）",
          lines: [
            { who: "主席", en: "We are having difficulty hearing the Paris office. Could you confirm that you can hear us?", cn: "我们听巴黎那边有困难。请确认您能听到我们吗？" },
            { who: "巴黎", en: "We hear you clearly. The difficulty is in one direction only.", cn: "我们听得很清楚。问题只在单向传输上。" },
            { who: "主席", en: "Then we shall conduct the remainder with written and spoken confirmation.", cn: "那接下来的部分我们以书面加口头确认的方式进行。" },
            { who: "巴黎", en: "That is prudent. I shall confirm each decision in the chat as it is taken.", cn: "这样审慎。每项决定作出时我会在聊天框里确认。" },
            { who: "主席", en: "And I shall read each back before we proceed.", cn: "而我会在继续之前逐条复述。" },
            { who: "巴黎", en: "That is the correct procedure, and I should like it minuted.", cn: "这是正确的程序，我希望记入纪要。" },
            { who: "主席", en: "It shall be. Any decision not read back and confirmed is not taken.", cn: "会的。任何未经复述和确认的决定都不算通过。" },
            { who: "巴黎", en: "That protects both offices.", cn: "这对两个办公室都是保护。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "同事之间（信号差）",
          register: "随意（极简、俚语）",
          channel: "手机通话 + 短信",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "甲", en: "you're breaking up", cn: "你声音断续" },
            { who: "乙", en: "what", cn: "什么" },
            { who: "甲", en: "breaking up", cn: "断续" },
            { who: "乙", en: "can't hear you", cn: "听不清" },
            { who: "甲", en: "i'll text you", cn: "我发短信给你" },
            { who: "乙", en: "better", cn: "这样好" },
            { who: "甲", en: "sent", cn: "发了" },
            { who: "乙", en: "got it", cn: "收到" },
            { who: "甲", en: "phones", cn: "电话这东西" },
            { who: "乙", en: "yeah", cn: "是啊" }
          ]
        }
      ]
    },

    /* ==================== 08-03 视频会议与线上客服 ==================== */
    {
      id: "s08-03",
      domain: "08",
      title: "视频会议与线上客服",
      ielts: "口语 P3 场景 / 听力 S3",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "主持 · 参加者（视频会议议程）",
          register: "半正式",
          channel: "视频会议",
          barrier: "无",
          result: "达成（按硬性离场时间调整议程顺序）",
          lines: [
            { who: "主持", en: "Can everyone see the shared screen?", cn: "大家能看到共享屏幕吗？" },
            { who: "参加者", en: "I can, but the text is small. Could you zoom in?", cn: "能看到，但字很小。能放大吗？" },
            { who: "主持", en: "Better?", cn: "好点吗？" },
            { who: "参加者", en: "Much. I'll say when it isn't.", cn: "好多了。看不清我会说。" },
            { who: "主持", en: "Three items today: the budget, the timeline, and who speaks to the client.", cn: "今天三项：预算、时间线、谁去见客户。" },
            { who: "参加者", en: "Could we take the client item first? Two of us have a hard stop at half past.", cn: "能先谈客户那项吗？我们有两个人半点必须走。" },
            { who: "主持", en: "That's a good enough reason to reorder. Client first.", cn: "这个理由足够调顺序。客户先。" },
            { who: "参加者", en: "Thank you. It's the only item that needs all three of us.", cn: "谢谢。这是唯一需要三个人都在的一项。" },
            { who: "主持", en: "Noted for future agendas.", cn: "以后排议程会注意。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "汇报人 · 客户（线上汇报被质疑）",
          register: "半正式",
          channel: "视频会议",
          barrier: "无（但主动说明两个数字不一致的原因）",
          result: "达成（改用实际数并承诺超 2% 一周内报备）",
          lines: [
            { who: "客户", en: "The second figure doesn't match the report you sent on Monday.", cn: "第二个数字跟您周一发的报告不一致。" },
            { who: "汇报人", en: "It doesn't, and I'd rather address it now than later. Monday's figure was an estimate; this one is actual.", cn: "确实不一致，我宁愿现在说而不是以后。周一的数字是估算，这个是实际数。" },
            { who: "客户", en: "Which should I use for the board pack?", cn: "我给董事会的材料里该用哪个？" },
            { who: "汇报人", en: "The actual, with a note that it differs from the estimate by four percent, and why.", cn: "用实际数，并注明与估算相差四个百分点以及原因。" },
            { who: "客户", en: "Why did it move by four?", cn: "为什么差四个点？" },
            { who: "汇报人", en: "One supplier's price rose in April and we absorbed it rather than pass it on mid-contract.", cn: "一个供应商四月涨价，我们在合同期内自己承担了，没有转嫁。" },
            { who: "客户", en: "That's a decision I would have wanted to know about at the time.", cn: "这个决定我本希望当时就知道。" },
            { who: "汇报人", en: "That's fair, and it's a process failure on our side. I'll add a threshold: anything above two percent comes to you within a week.", cn: "这话公道，是我们流程上的失误。我加一条线：超过两个百分点，一周内报给您。" },
            { who: "客户", en: "Put that in writing this afternoon.", cn: "今天下午把它写下来发我。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "参加者 · 客户（要求开摄像头）",
          register: "半正式",
          channel: "视频会议",
          barrier: "开视频会断音，无法全程开摄像头",
          result: "折中（开场与结尾开，中间关，并在聊天里发照片）",
          lines: [
            { who: "客户", en: "Would you turn your camera on? We like to see who we're talking to.", cn: "您能开摄像头吗？我们喜欢看到对话的人。" },
            { who: "参加者", en: "On this connection the video makes my audio break up. May I offer something else?", cn: "在这个网络下开视频我的声音会断。我能给个别的方案吗？" },
            { who: "客户", en: "Such as?", cn: "比如？" },
            { who: "参加者", en: "I'll switch it on for the first two minutes and at the end, and keep it off while I present.", cn: "我开头两分钟和结尾开，讲的时候关掉。" },
            { who: "客户", en: "That's reasonable. Everyone's connection is different.", cn: "这合理。每个人的网络都不一样。" },
            { who: "参加者", en: "And I'll send a photograph in the chat, so you know who you're dealing with.", cn: "另外我在聊天框里发一张照片，让你们知道在跟谁打交道。" },
            { who: "客户", en: "That's the first time anyone has offered that.", cn: "这是第一次有人主动这么提。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "主持 · 参加者（共享黑屏）",
          register: "半正式",
          channel: "视频会议",
          barrier: "双屏共享错屏，所有人只看到黑屏",
          result: "修复（改为共享窗口，并写进会议模板）",
          lines: [
            { who: "主持", en: "I'm sharing, but you should be seeing a blank window.", cn: "我在共享，但你们看到的应该是一个空白窗口。" },
            { who: "参加者", en: "We see a black screen with your cursor moving.", cn: "我们看到黑屏，但你的光标在动。" },
            { who: "主持", en: "Then you're seeing my desktop and not the document. Let me try again.", cn: "那你们看到的是我的桌面，不是文档。我再试一次。" },
            { who: "参加者", en: "Still black. Do you have two screens?", cn: "还是黑的。你有两个屏幕吗？" },
            { who: "主持", en: "I do. It may be sharing the wrong one.", cn: "有。可能是共享错了那个。" },
            { who: "参加者", en: "Share the window rather than the screen. That usually fixes it.", cn: "共享窗口而不是整个屏幕。这通常能解决。" },
            { who: "主持", en: "That's it. Can you see it now?", cn: "行了。现在能看到吗？" },
            { who: "参加者", en: "We can. Two minutes lost, and worth it for the fix.", cn: "能。丢了两分钟，但换来一个解决办法值得。" },
            { who: "主持", en: "I'll put share the window into the meeting template.", cn: "我把「共享窗口」写进会议模板。" }
          ]
        },
        {
          variant: "情绪型（线上客服排队四十分钟）",
          relation: "顾客 · 线上客服（第三位坐席）",
          register: "半正式（情绪化）",
          channel: "在线客服",
          barrier: "排队四十分钟、换了三位坐席，退款批了却没执行",
          result: "达成（当场处理并留在会话直到收到确认邮件）",
          lines: [
            { who: "客服", en: "Thank you for waiting. How can I help?", cn: "感谢等待。需要什么帮助？" },
            { who: "顾客", en: "I've been in the queue for forty minutes and this is the third agent.", cn: "我排队四十分钟了，这是第三位客服。" },
            { who: "客服", en: "I can see the previous two chats. Would you like me to read them, or would you rather tell me?", cn: "我能看到前两次对话。您希望我读一遍，还是您说？" },
            { who: "顾客", en: "Read them, and then tell me what you're going to do rather than what you can't.", cn: "你读，然后告诉我你要做什么，而不是你不能做什么。" },
            { who: "客服", en: "Fair. Reading now. ...The refund was approved and never processed.", cn: "好。现在读。……退款已批准但从未处理。" },
            { who: "顾客", en: "That's what I've been saying for three weeks.", cn: "这就是我三周来一直在说的。" },
            { who: "客服", en: "It's processed now, and I'm staying on this chat until you see the confirmation email.", cn: "现在处理了，而且我会留在这个对话里直到您看到确认邮件。" },
            { who: "顾客", en: "You don't have to stay.", cn: "你不用一直留着。" },
            { who: "客服", en: "I do, because the last two said it was done.", cn: "我要留，因为前两位都说办好了。" }
          ]
        },
        {
          variant: "渠道变体（线上客服 + 屏幕共享）",
          relation: "顾客 · 线上客服（共享屏幕排错）",
          register: "半正式",
          channel: "在线客服 + 屏幕共享",
          barrier: "顾客不愿共享整个桌面，报错又只有屏幕上能看到",
          result: "达成（只共享浏览器标签页，查清并合并重复账户）",
          lines: [
            { who: "客服", en: "Could you share your screen so I can see the error?", cn: "您能共享屏幕让我看看报错吗？" },
            { who: "顾客", en: "I'd rather not share my whole desktop. Is there another way?", cn: "我不想共享整个桌面。有别的办法吗？" },
            { who: "客服", en: "Share the browser tab only. Nothing else is visible then.", cn: "只共享浏览器标签页。那样其他内容都看不到。" },
            { who: "顾客", en: "Good. Done.", cn: "好。好了。" },
            { who: "客服", en: "I can see it. ...The error appears because two accounts are linked to one email.", cn: "我看到了。……这个报错是因为两个账户绑了同一个邮箱。" },
            { who: "顾客", en: "Which one is mine?", cn: "哪个是我的？" },
            { who: "客服", en: "This one, with the order history. The other has no orders and should be deleted.", cn: "这个，有订单历史的。另一个没有订单，应该删掉。" },
            { who: "顾客", en: "Deleting an account: is that something you do, or I do?", cn: "删账户是你来还是我来？" },
            { who: "客服", en: "I do it, and I'll confirm in the chat before and after.", cn: "我来做，前后都会在聊天里确认。" },
            { who: "顾客", en: "Before and after is the part people skip.", cn: "前后都确认这一点，别人都会省掉。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "委员会主席 · 委员（正式线上会议）",
          register: "正式",
          channel: "正式线上会议",
          barrier: "无（但需处理仅音频参会与利益申报程序）",
          result: "达成（决定逐条复述，申报人表决时退出通话）",
          lines: [
            { who: "主席", en: "As this is a formal session, I shall take the minutes and the roll.", cn: "由于这是正式会议，我来做纪要并点名。" },
            { who: "委员", en: "Before the roll, may I note that one member is joining by audio only?", cn: "点名之前，我提一下有一位成员仅以音频参加。" },
            { who: "主席", en: "Noted, and we shall read every decision back for that member.", cn: "记下了，我们会为那位成员复述每一项决定。" },
            { who: "委员", en: "I should also declare an interest in item four.", cn: "我还要就第四项申报利益相关。" },
            { who: "主席", en: "Thank you. You may speak to it but not vote on it.", cn: "谢谢。您可以就此发言，但不参与表决。" },
            { who: "委员", en: "That is understood. I shall leave the room for the vote.", cn: "明白。表决时我会离席。" },
            { who: "主席", en: "For a video meeting, leaving the room means leaving the call. We shall record that you did.", cn: "视频会议里「离席」就是退出通话。我们会记录您确实退出了。" },
            { who: "委员", en: "Then I shall leave the call and rejoin afterwards.", cn: "那我退出通话，之后再加入。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "同事之间（线上会议）",
          register: "随意（极简、俚语）",
          channel: "视频会议",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "甲", en: "you're on mute", cn: "你静音了" },
            { who: "乙", en: "what", cn: "什么" },
            { who: "甲", en: "mute", cn: "静音" },
            { who: "乙", en: "can you hear me now", cn: "现在能听到吗" },
            { who: "甲", en: "yeah", cn: "能" },
            { who: "乙", en: "good. where were we", cn: "好。说到哪了" },
            { who: "甲", en: "the budget", cn: "预算" },
            { who: "乙", en: "right", cn: "对" },
            { who: "甲", en: "you're frozen now", cn: "你现在卡住了" },
            { who: "乙", en: "of course", cn: "那还用说" }
          ]
        }
      ]
    },

    /* ==================== 09-01 正式邮件（申请 / 投诉） ==================== */
    {
      id: "s09-01",
      domain: "09",
      title: "正式邮件（申请 / 投诉）",
      ielts: "口语 P3 学术 / 听力 S3",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "申请人 · 同事（改申请信）",
          register: "半正式",
          channel: "面对面 + 邮件",
          barrier: "无",
          result: "达成（把诉求提到第一句，当晚发出）",
          lines: [
            { who: "同事", en: "Have you sent the application?", cn: "你申请发了吗？" },
            { who: "申请人", en: "I've drafted it. It's four hundred words and it says everything except what I want.", cn: "写好了草稿。四百字，什么都说到了，就是没说我想要什么。" },
            { who: "同事", en: "Then the first line is the problem. What do you want?", cn: "那问题在第一句。你想要什么？" },
            { who: "申请人", en: "The post, starting in September.", cn: "这个岗位，九月入职。" },
            { who: "同事", en: "Put that in the first sentence, not the last paragraph.", cn: "把这个放第一句，不是最后一段。" },
            { who: "申请人", en: "Doesn't that sound blunt?", cn: "那样不会显得生硬吗？" },
            { who: "同事", en: "It sounds like someone who knows what they are asking for. The detail then supports it.", cn: "听起来像个清楚自己要什么的人。细节随后支撑它。" },
            { who: "申请人", en: "And the tone?", cn: "语气呢？" },
            { who: "同事", en: "Formal but not stiff. No I would be most grateful unless you mean it.", cn: "正式但不僵硬。别写「不胜感激」，除非你真这么想。" },
            { who: "申请人", en: "I'll rewrite the opening and send it tonight.", cn: "我重写开头，今晚发。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "申请人 · 顾问（被无理由驳回）",
          register: "正式",
          channel: "书面",
          barrier: "无（但要理由而不是争结论）",
          result: "达成（要求二十日内书面说明依据，逾期抄送监察）",
          lines: [
            { who: "申请人", en: "They've rejected the claim without giving a reason.", cn: "他们驳回了申请，没给理由。" },
            { who: "顾问", en: "Then your letter should ask for the reason rather than dispute the decision.", cn: "那你的信应该要理由，而不是争结论。" },
            { who: "申请人", en: "Why not dispute it?", cn: "为什么不争？" },
            { who: "顾问", en: "Because you cannot argue against a decision you cannot see. Ask for the reasoning and the policy it was made under.", cn: "因为你没法反驳一个你看不见的决定。要理由，以及作出决定所依据的政策。" },
            { who: "申请人", en: "And the deadline for their reply?", cn: "他们回复的时限呢？" },
            { who: "顾问", en: "Ask for a reply within twenty working days, and refer to their own service standard.", cn: "要求二十个工作日内答复，并引用他们自己的服务标准。" },
            { who: "申请人", en: "If they don't reply?", cn: "如果不回呢？" },
            { who: "顾问", en: "Then you write again, one page, quoting the first letter and the standard, and you copy the ombudsman.", cn: "那你再写一封，一页，引用第一封和那条标准，并抄送监察机构。" },
            { who: "申请人", en: "Copying the ombudsman changes the speed of the reply.", cn: "抄送监察机构会改变回复的速度。" },
            { who: "顾问", en: "Every time, and it is not aggressive if the standard exists.", cn: "每次都这样，而且如果标准存在，这不算过激。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "申请人 · 顾问（资格不符被拒）",
          register: "半正式",
          channel: "面对面",
          barrier: "超出资格窗口期三个月，申诉无门",
          result: "折中（改走困难补助与院系机动经费两条路）",
          lines: [
            { who: "申请人", en: "The funding application was refused.", cn: "资助申请被拒了。" },
            { who: "顾问", en: "On what basis?", cn: "依据是什么？" },
            { who: "申请人", en: "Eligibility. I'm three months outside the window.", cn: "资格。我超出窗口期三个月。" },
            { who: "顾问", en: "Then the refusal is correct and there is nothing to appeal.", cn: "那这个拒绝是对的，没什么可申诉的。" },
            { who: "申请人", en: "That's not what I wanted to hear.", cn: "这不是我想听的。" },
            { who: "顾问", en: "It is what saves you six weeks. There are two other routes.", cn: "但这能省你六周。还有两条别的路径。" },
            { who: "申请人", en: "Which?", cn: "哪两条？" },
            { who: "顾问", en: "The hardship fund has no window, and the department has discretionary funds that nobody applies for.", cn: "困难补助没有窗口期，院系还有没人申请的机动经费。" },
            { who: "申请人", en: "Why does nobody apply?", cn: "为什么没人申请？" },
            { who: "顾问", en: "Because it isn't advertised. Ask your supervisor directly, in writing.", cn: "因为不宣传。直接书面问你的导师。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "申请人 · 顾问（语气被读错）",
          register: "半正式",
          channel: "书面",
          barrier: "一句「我注意到您尚未回复」被读成指责",
          result: "修复（改成「想确认是否送达」并补上截止日期）",
          lines: [
            { who: "申请人", en: "My email was read as aggressive and I don't know why.", cn: "我的邮件被读成有攻击性，我不知道为什么。" },
            { who: "顾问", en: "Read me the sentence.", cn: "把那一句念给我听。" },
            { who: "申请人", en: "I note that you have not yet replied to my previous message.", cn: "我注意到您尚未回复我上一封邮件。" },
            { who: "顾问", en: "There it is. I note that you have not is a formal way of saying you ignored me.", cn: "就是这个。「我注意到您尚未」是一种正式的「你无视我」的说法。" },
            { who: "申请人", en: "That isn't what I meant. I was worried it hadn't arrived.", cn: "我不是这个意思。我是担心它没送到。" },
            { who: "顾问", en: "Then say that: I wanted to check whether my earlier message reached you.", cn: "那就直说：我想确认前一封是否送达。" },
            { who: "申请人", en: "Same content, no accusation.", cn: "同样内容，没有指责。" },
            { who: "顾问", en: "And add why you need it: because the deadline is the ninth.", cn: "再加上你为什么需要：因为截止是九号。" },
            { who: "申请人", en: "A reason turns a complaint into a request.", cn: "一个理由能把抱怨变成请求。" }
          ]
        },
        {
          variant: "情绪型（投诉无回音）",
          relation: "申请人 · 顾问（愤怒时写不写信）",
          register: "半正式（情绪化）",
          channel: "面对面",
          barrier: "三次错过期限且无回复，写信时情绪失控",
          result: "达成（今晚只写事实，明天调语气后再发）",
          lines: [
            { who: "申请人", en: "I want to write something they'll actually read.", cn: "我想写点他们真的会看的东西。" },
            { who: "顾问", en: "Then don't write it today.", cn: "那就别今天写。" },
            { who: "申请人", en: "Why not? I'm angry now.", cn: "为什么？我现在就在气头上。" },
            { who: "顾问", en: "Because an angry letter gets a template reply. Write the facts tonight and the tone tomorrow.", cn: "因为愤怒的信只会收到模板回复。今晚写事实，明天调语气。" },
            { who: "申请人", en: "The facts are three missed deadlines and no reply.", cn: "事实是三次错过期限和一次不回复。" },
            { who: "顾问", en: "Then list them with dates, one line each. No adjectives.", cn: "那就按日期列出来，一条一行。不要形容词。" },
            { who: "申请人", en: "No adjectives is hard.", cn: "不用形容词很难。" },
            { who: "顾问", en: "It is the hardest and most effective rule. Facts shame people; adjectives let them dismiss you.", cn: "这是最难也最有效的规则。事实让人羞愧，形容词让人有理由打发你。" },
            { who: "申请人", en: "I'll write it tonight and read it aloud tomorrow before sending.", cn: "我今晚写，明天发之前念一遍。" }
          ]
        },
        {
          variant: "渠道变体（在线表单 + 邮件 + 电话）",
          relation: "申请人 · 客服（表单没提交成功）",
          register: "半正式",
          channel: "在线表单 + 邮件 + 电话",
          barrier: "以为六天前提交成功，其实缺少第二封带编号的确认",
          result: "达成（重新提交并标注原始日期，不丢六天）",
          lines: [
            { who: "申请人", en: "I submitted the form and got an automatic reply with no reference.", cn: "我提交了表格，收到自动回复，但没有编号。" },
            { who: "客服", en: "The reference is in the subject line of the confirmation.", cn: "编号在确认邮件的标题里。" },
            { who: "申请人", en: "The subject says thank you for your submission.", cn: "标题写的是「感谢您的提交」。" },
            { who: "客服", en: "Then it is in the body, in the table.", cn: "那在正文的表格里。" },
            { who: "申请人", en: "There's no table. It's three lines of text.", cn: "没有表格。只有三行文字。" },
            { who: "客服", en: "Then your submission may not have completed. Did you get a second email?", cn: "那您的提交可能没完成。您收到第二封邮件了吗？" },
            { who: "申请人", en: "Only one.", cn: "只有一封。" },
            { who: "客服", en: "That's the problem. The second email carries the reference, and without it the form isn't in the queue.", cn: "问题就在这儿。第二封才带编号，没有它表格不在队列里。" },
            { who: "申请人", en: "Six days ago I thought I had applied.", cn: "六天前我以为我申请了。" },
            { who: "客服", en: "Resubmit now and I'll flag the original date, so you don't lose the six days.", cn: "现在重新提交，我会标注原始日期，这样六天不会白丢。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "申请人 · 顾问（打磨投诉信用词）",
          register: "正式",
          channel: "面对面 + 书面",
          barrier: "无（但需把请求编号化并删掉讽刺）",
          result: "达成（两项编号请求 + 答复期限与后续动作）",
          lines: [
            { who: "顾问", en: "Let us go through your letter. The first paragraph should state what you want.", cn: "我们过一遍你的信。第一段应该说明你要什么。" },
            { who: "申请人", en: "I want the decision reviewed and the fee refunded.", cn: "我希望复核决定并退还费用。" },
            { who: "顾问", en: "Two requests, then. State them as two numbered points rather than one sentence.", cn: "那是两项请求。写成两个编号条目，而不是一句话。" },
            { who: "申请人", en: "And the tone throughout?", cn: "通篇的语气呢？" },
            { who: "顾问", en: "Firm, factual, and free of sarcasm. Sarcasm in a formal letter only ever costs you the reader.", cn: "坚定、就事论事、不带讽刺。正式信里的讽刺只会让你失去读者。" },
            { who: "申请人", en: "May I say that I am disappointed?", cn: "我可以说我很失望吗？" },
            { who: "顾问", en: "Once, and then move to the facts. Two mentions of disappointment reads as weakness.", cn: "说一次，然后进入事实。提两次失望就显得软弱。" },
            { who: "申请人", en: "And the closing?", cn: "结尾呢？" },
            { who: "顾问", en: "State the date by which you expect a reply, and say what you will do if it does not come.", cn: "写明你期望得到答复的日期，并说明如果没有你会怎么做。" },
            { who: "申请人", en: "That last part is what makes them answer.", cn: "最后这一句才是让他们回信的原因。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "同事之间（催一封正式邮件）",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "甲", en: "did you send it", cn: "你发了吗" },
            { who: "乙", en: "drafting", cn: "在写" },
            { who: "甲", en: "just send it", cn: "直接发吧" },
            { who: "乙", en: "it's too angry", cn: "太冲了" },
            { who: "甲", en: "then cut the adjectives", cn: "那就把形容词删了" },
            { who: "乙", en: "which ones", cn: "哪些" },
            { who: "甲", en: "all of them", cn: "全部" },
            { who: "乙", en: "harsh", cn: "太狠了" },
            { who: "甲", en: "it works though", cn: "但管用" },
            { who: "乙", en: "sent", cn: "发了" },
            { who: "甲", en: "how do you feel", cn: "感觉怎么样" },
            { who: "乙", en: "lighter", cn: "轻松了" }
          ]
        }
      ]
    },

    /* ==================== 09-02 半正式邮件与即时消息 ==================== */
    {
      id: "s09-02",
      domain: "09",
      title: "半正式邮件与即时消息",
      ielts: "口语 P3 工作 / 听力 S3",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "同事之间（催回复）",
          register: "半正式",
          channel: "邮件",
          barrier: "无",
          result: "达成（标题写明「需处理」，周四在同一会话催一次）",
          lines: [
            { who: "同事", en: "Did you get a reply from the Berlin team?", cn: "柏林那边回你了吗？" },
            { who: "发件人", en: "Nothing yet. I sent a short email on Tuesday.", cn: "还没有。我周二发了封短邮件。" },
            { who: "同事", en: "How short?", cn: "多短？" },
            { who: "发件人", en: "Five lines: what I need, by when, and what happens if it's late.", cn: "五行：我需要什么、什么时候要、晚了会怎样。" },
            { who: "同事", en: "That's the right length. What did you put in the subject?", cn: "长度合适。标题写的什么？" },
            { who: "发件人", en: "Action needed by Friday: figures for the Q2 pack.", cn: "周五前需处理：第二季度材料的数字。" },
            { who: "同事", en: "Good. Action needed in the subject is why it gets read.", cn: "不错。标题里写「需处理」才会被读。" },
            { who: "发件人", en: "Should I chase?", cn: "我该催吗？" },
            { who: "同事", en: "Once, on Thursday, and reply to your own email so the thread stays together.", cn: "周四催一次，回复你自己那封，这样在同一个会话里。" },
            { who: "发件人", en: "Chasing in the same thread reads as organised rather than impatient.", cn: "在同一会话里催显得有条理，而不是没耐心。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "下属 · 上司（向上要资源）",
          register: "半正式",
          channel: "邮件 + 面对面",
          barrier: "无（但要用「决定在前、理由在后」的结构）",
          result: "达成（写清决定、理由与两个备选方案）",
          lines: [
            { who: "下属", en: "I need to ask the director for two more weeks. How should I write it?", cn: "我需要向总监要两周时间。该怎么写？" },
            { who: "上司", en: "Lead with the decision you need, then the reason, then the alternatives.", cn: "先写你需要什么决定，再写原因，然后写备选方案。" },
            { who: "下属", en: "Not with the reason first?", cn: "不先写原因吗？" },
            { who: "上司", en: "He reads the first line and decides whether to read the rest.", cn: "他看第一行，然后决定要不要看下去。" },
            { who: "下属", en: "And the alternatives?", cn: "备选方案呢？" },
            { who: "上司", en: "Two options, and say which you recommend. Asking him to choose from nothing reads as a problem; choosing for him reads as management.", cn: "两个选项，并说明你推荐哪个。让他从零开始选是抛问题；替他选好是管理。" },
            { who: "下属", en: "What if he says no to both?", cn: "如果两个都否了呢？" },
            { who: "上司", en: "Then you've learned his priority. Put it in writing, and the next request is easier.", cn: "那你就知道他的优先级了。写下来，下次请求就更容易。" },
            { who: "下属", en: "I'll send it this afternoon.", cn: "我今天下午发。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "使用者 · 同事（即时回复的期望）",
          register: "半正式",
          channel: "即时消息",
          barrier: "团队默认十分钟内回复，无法长期做到",
          result: "折中（用状态注明紧急与四小时口径，并说明一次）",
          lines: [
            { who: "同事", en: "People expect an answer in ten minutes on the chat.", cn: "大家在聊天里期望十分钟内回复。" },
            { who: "使用者", en: "Ten minutes isn't a policy, it's a habit.", cn: "十分钟不是制度，是习惯。" },
            { who: "同事", en: "Try telling that to the team.", cn: "你去跟团队这么说试试。" },
            { who: "使用者", en: "I will, but with an alternative rather than a refusal.", cn: "我会说，但给的是替代方案，不是拒绝。" },
            { who: "同事", en: "Such as?", cn: "比如？" },
            { who: "使用者", en: "A note in my profile: urgent means call me, everything else within four hours.", cn: "在个人状态里写：紧急请打电话，其余四小时内回。" },
            { who: "同事", en: "And if they ignore it?", cn: "如果他们不理呢？" },
            { who: "使用者", en: "Then I answer late and say why, once. Habits change by consequence, not by rules.", cn: "那我就晚回，并说明一次原因。习惯靠后果改变，不是靠规定。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "使用者 · 同事（两个字被读成冷淡）",
          register: "半正式",
          channel: "即时消息",
          barrier: "一句「行」被理解为不高兴，引发误会",
          result: "修复（含决定的一律写完整句，事务才用单词）",
          lines: [
            { who: "同事", en: "Your message fine came across as annoyed.", cn: "你那条「行」看起来像不高兴。" },
            { who: "使用者", en: "It was just agreement. Two letters can't carry a tone.", cn: "那就是同意。两个字承载不了语气。" },
            { who: "同事", en: "In chat, short answers read as cold.", cn: "在聊天里，短短的回答读起来很冷。" },
            { who: "使用者", en: "Then I'll change how I write, not what I mean.", cn: "那我改写法，不改意思。" },
            { who: "同事", en: "How?", cn: "怎么改？" },
            { who: "使用者", en: "Full sentences for anything with a decision in it, and agreed instead of fine.", cn: "任何含决定的都写完整句子，并把「行」换成「同意」。" },
            { who: "同事", en: "And for one-word answers?", cn: "那单词回答呢？" },
            { who: "使用者", en: "Only for logistics: what time, which room. Never for anything people might read twice.", cn: "只用在事务上：几点、哪个房间。绝不用于别人可能重读的内容。" }
          ]
        },
        {
          variant: "情绪型（措辞引发冲突）",
          relation: "使用者 · 同事（一句「正如我之前所说」）",
          register: "半正式（情绪化）",
          channel: "邮件",
          barrier: "一句「正如我之前所说」引爆争执",
          result: "达成（换成给台阶的说法，并停止在气头上发送）",
          lines: [
            { who: "使用者", en: "I wrote as I said before and it started an argument.", cn: "我写了「正如我之前所说」，结果吵起来了。" },
            { who: "同事", en: "That phrase is a slap in writing.", cn: "那句话在书面上就是一巴掌。" },
            { who: "使用者", en: "I only meant that it had been covered.", cn: "我只是想说这事已经说过。" },
            { who: "同事", en: "Then write: I think this was in my Tuesday email. Let me know if it didn't arrive.", cn: "那就写：这一点我记得在周二那封邮件里提过。如果没收到请告诉我。" },
            { who: "使用者", en: "It gives them a way out.", cn: "这样给了对方台阶。" },
            { who: "同事", en: "And it puts the fact on the record. Both at once, which is the trick.", cn: "同时把事实留在记录里。一举两得，这才是诀窍。" },
            { who: "使用者", en: "I'll use it, and I'll stop writing when I'm annoyed.", cn: "我以后就这么写。而且生气的时候不写。" },
            { who: "同事", en: "Drafting angry emails is fine. Sending them isn't.", cn: "写愤怒的邮件没关系，发出去才有关系。" }
          ]
        },
        {
          variant: "渠道变体（多人邮件与抄送规则）",
          relation: "同事之间（抄送客户）",
          register: "半正式",
          channel: "邮件 + 即时消息",
          barrier: "凡事都抄送客户，客户逐渐不再看邮件",
          result: "达成（按「要不要行动」区分收件人与抄送）",
          lines: [
            { who: "同事", en: "Should I copy the client on this?", cn: "这封我该抄送客户吗？" },
            { who: "使用者", en: "What do you want the client to do?", cn: "你想让客户做什么？" },
            { who: "同事", en: "Nothing. It's just so they're aware.", cn: "什么都不做。就是让他们知道。" },
            { who: "使用者", en: "Then don't copy them. Awareness without action is how people learn to ignore your emails.", cn: "那就别抄。只知情不行动，会让人学会忽略你的邮件。" },
            { who: "同事", en: "But then they'll say they weren't told.", cn: "可他们会说没人告诉他们。" },
            { who: "使用者", en: "Send a separate one-line note when there's something to decide, and copy them when there is.", cn: "有需要决定的就单独发一行说明；该抄的时候再抄。" },
            { who: "同事", en: "And the difference between cc and to?", cn: "那抄送和收件人的区别呢？" },
            { who: "使用者", en: "To means you act. Cc means you're informed. If you need action and put them in cc, you'll wait forever.", cn: "收件人意味着你要行动，抄送意味着你知情。需要行动却放在抄送，你会一直等。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "使用者 · 顾问（正式与半正式的分寸）",
          register: "正式",
          channel: "面对面 + 书面",
          barrier: "无（但需统一语域并跟着对方风格）",
          result: "达成（改半正式：完整句、无缩略式、一句话自我介绍）",
          lines: [
            { who: "顾问", en: "This letter is half formal and half casual, and it reads as neither.", cn: "这封信一半正式一半随意，结果两边都不像。" },
            { who: "使用者", en: "Which half is wrong?", cn: "哪一半不对？" },
            { who: "顾问", en: "The opening is formal. The rest uses contractions and exclamation marks.", cn: "开头是正式的。后面却用了缩略式和感叹号。" },
            { who: "使用者", en: "I thought a friendly tone would help.", cn: "我以为友善的语气有帮助。" },
            { who: "顾问", en: "Friendliness is not the same as informality. You may be warm and still write in full sentences.", cn: "友善不等于随意。你可以温和，同时写完整句子。" },
            { who: "使用者", en: "So which register for a first approach to a company?", cn: "那第一次联系公司该用什么语域？" },
            { who: "顾问", en: "Semi-formal: full sentences, no contractions, no exclamation marks, and one sentence about who you are.", cn: "半正式：完整句子、不用缩略式、不用感叹号，并用一句话说明你是谁。" },
            { who: "使用者", en: "And once they reply?", cn: "他们回复之后呢？" },
            { who: "顾问", en: "Mirror them. If they write in two lines, don't send four paragraphs.", cn: "跟着对方的风格。如果他们写两行，别发四段。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "同事之间（催回复）",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "甲", en: "did you send it", cn: "你发了吗" },
            { who: "乙", en: "yeah", cn: "发了" },
            { who: "甲", en: "did they reply", cn: "回了吗" },
            { who: "乙", en: "no", cn: "没有" },
            { who: "甲", en: "how long", cn: "多久了" },
            { who: "乙", en: "two days", cn: "两天" },
            { who: "甲", en: "chase tomorrow", cn: "明天催" },
            { who: "乙", en: "with what", cn: "怎么催" },
            { who: "甲", en: "bump", cn: "顶一下" },
            { who: "乙", en: "that's it", cn: "就这" },
            { who: "甲", en: "that's it", cn: "就这" }
          ]
        }
      ]
    },

    /* ==================== 09-03 社媒评论与论坛发帖 ==================== */
    {
      id: "s09-03",
      domain: "09",
      title: "社媒评论与论坛发帖",
      ielts: "口语 P3 媒体 / 听力 S2",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "发帖者 · 朋友（筛回复）",
          register: "随意",
          channel: "论坛 + 面对面",
          barrier: "无",
          result: "达成（学会用来源与日期分辨靠谱回复）",
          lines: [
            { who: "发帖者", en: "I posted a question about a visa and got eleven replies in an hour.", cn: "我发了个签证的问题，一小时收到十一条回复。" },
            { who: "朋友", en: "Any of them useful?", cn: "有用的有几条？" },
            { who: "发帖者", en: "Two. The rest were people guessing confidently.", cn: "两条。其余是自信地猜。" },
            { who: "朋友", en: "How did you tell them apart?", cn: "你怎么分辨的？" },
            { who: "发帖者", en: "The two quoted the official page and gave the date they had checked it. The others said I think.", cn: "那两条引了官网页面，并写明他们是哪天查的。其余说「我觉得」。" },
            { who: "朋友", en: "Next time, say in your post what you have already tried.", cn: "下次在帖子里写清你已经试过什么。" },
            { who: "发帖者", en: "Why?", cn: "为什么？" },
            { who: "朋友", en: "It filters out everyone except the people who read carefully.", cn: "它能把不看帖的人筛掉，留下认真读的人。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "发帖者 · 论坛管理员（被删帖）",
          register: "半正式",
          channel: "论坛申诉",
          barrier: "无（但要用「被索取才发链接」的区分争取重发）",
          result: "达成（改文字描述重发，并问清链接规则）",
          lines: [
            { who: "发帖者", en: "My post was removed for spam and it wasn't spam.", cn: "我的帖子被当成垃圾信息删了，可它不是。" },
            { who: "管理员", en: "It contained a link to a shop.", cn: "里面有商店链接。" },
            { who: "发帖者", en: "It was a link to the exact part I was asking about, so people could see the specification.", cn: "那是我问的那个零件的链接，好让大家看到规格。" },
            { who: "管理员", en: "The rules don't distinguish intent.", cn: "规则不区分意图。" },
            { who: "发帖者", en: "Then may I repost it without the link, describing the part instead?", cn: "那我能去掉链接、改用文字描述那个零件重发吗？" },
            { who: "管理员", en: "You may.", cn: "可以。" },
            { who: "发帖者", en: "And is a link allowed if someone asks me for it in a reply?", cn: "如果有人回复里问我要链接，那时可以发吗？" },
            { who: "管理员", en: "On request, yes. The rule is about unsolicited links.", cn: "被索取时可以。规则针对的是未被索取的链接。" },
            { who: "发帖者", en: "That distinction should be on the rules page.", cn: "这个区分应该写进规则页。" },
            { who: "管理员", en: "It is, in the third paragraph, which nobody reads.", cn: "有写，在第三段，没人看。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "发帖者 · 管理员（发问卷）",
          register: "半正式",
          channel: "论坛",
          barrier: "主板不允许发问卷，只能发讨论",
          result: "折中（先参与一周讨论，周五专用帖发问卷）",
          lines: [
            { who: "发帖者", en: "I'd like to post about my survey. Is that allowed?", cn: "我想发个我的问卷。允许吗？" },
            { who: "管理员", en: "Not on the main board. It's for discussion, not data collection.", cn: "主板不行。那是讨论用的，不是收数据用的。" },
            { who: "发帖者", en: "I understand. Is there anywhere it is allowed?", cn: "我理解。有允许的地方吗？" },
            { who: "管理员", en: "The weekly thread on Fridays, and only if you take part in the discussion the rest of the week.", cn: "周五的每周帖，而且只有在你其他日子参与讨论的前提下。" },
            { who: "发帖者", en: "So participation first.", cn: "所以先参与。" },
            { who: "管理员", en: "That's the whole rule. It's why the Friday thread works.", cn: "规则就这一条。周五帖能用就是因为这个。" },
            { who: "发帖者", en: "Then I'll answer questions for a week and post on Friday.", cn: "那我先回答一周问题，周五再发。" },
            { who: "管理员", en: "And say what the survey is for in the first line, or nobody clicks.", cn: "而且第一行要写问卷是干什么的，不然没人点。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "发帖者 · 朋友（帖子被误读）",
          register: "随意",
          channel: "论坛 + 面对面",
          barrier: "漏写「高峰时段」四个字，帖子二十分钟变吵架",
          result: "修复（只改第一行 + 用评论澄清原意）",
          lines: [
            { who: "发帖者", en: "My post about cycling lanes turned into a fight in twenty minutes.", cn: "我那篇自行车道的帖子二十分钟内变成了吵架。" },
            { who: "朋友", en: "What did you write?", cn: "你写了什么？" },
            { who: "发帖者", en: "Cars should be banned from the centre. I meant during rush hour.", cn: "市中心应该禁止汽车。我的意思是高峰时段。" },
            { who: "朋友", en: "There it is. Everyone read the version without the time limit.", cn: "就是这个。所有人都读了没有时间限制那个版本。" },
            { who: "发帖者", en: "I can edit the post.", cn: "我可以编辑帖子。" },
            { who: "朋友", en: "Editing after forty replies looks like rewriting history. Add the clarification as a comment and edit only the first line.", cn: "四十条回复之后再改像改历史。把澄清写成评论，只改第一行。" },
            { who: "发帖者", en: "First line plus a comment, and I'll say what I should have written.", cn: "改第一行加一条评论，并写明我本来该写什么。" },
            { who: "朋友", en: "Admitting the wording was bad ends those threads faster than arguing.", cn: "承认措辞不好，比争下去更能结束这类帖子。" }
          ]
        },
        {
          variant: "情绪型（被围攻与威胁）",
          relation: "发帖者 · 朋友（网暴）",
          register: "随意（情绪化）",
          channel: "社交平台",
          barrier: "四十条攻击与两条威胁，情绪接近崩溃",
          result: "达成（截图留证、只回一次、威胁报平台与警方）",
          lines: [
            { who: "发帖者", en: "Forty people are telling me I'm an idiot and two are threatening.", cn: "四十个人说我是白痴，还有两个在威胁。" },
            { who: "朋友", en: "Take screenshots of the threats, today.", cn: "今天就把威胁截图。" },
            { who: "发帖者", en: "Should I reply to any of them?", cn: "我要回复吗？" },
            { who: "朋友", en: "Not tonight. Everything you write tonight will be used tomorrow.", cn: "今晚不要。你今晚写的任何东西明天都会被拿来用。" },
            { who: "发帖者", en: "It's hard to say nothing.", cn: "什么都不说很难。" },
            { who: "朋友", en: "Then say one thing, once: I've read the criticism and I'll answer when I've thought about it.", cn: "那就说一句，只说一次：批评我看了，我想清楚再回。" },
            { who: "发帖者", en: "And the threats?", cn: "那威胁呢？" },
            { who: "朋友", en: "Report them to the platform and, if they name a place or a time, to the police.", cn: "向平台举报；如果提到地点或时间，就报警。" },
            { who: "发帖者", en: "That last part I wouldn't have thought of.", cn: "最后这一点我本来想不到。" }
          ]
        },
        {
          variant: "渠道变体（短视频评论）",
          relation: "发布者 · 朋友（评论区重复提问）",
          register: "随意",
          channel: "短视频平台",
          barrier: "同一个问题在评论里被问四十遍，置顶没人看",
          result: "达成（答案做成前几秒字幕，并保留置顶）",
          lines: [
            { who: "发布者", en: "The comments on the video are asking the same question forty times.", cn: "视频下面的评论把同一个问题问了四十遍。" },
            { who: "朋友", en: "Then answer it once and pin it.", cn: "那就答一次并置顶。" },
            { who: "发布者", en: "I pinned it, and they're still asking.", cn: "我置顶了，他们还在问。" },
            { who: "朋友", en: "Because nobody reads pinned comments on a phone. Put it in the first three seconds of the video.", cn: "因为在手机上没人读置顶评论。把答案放进视频前三秒。" },
            { who: "发布者", en: "That ruins the opening.", cn: "那就毁了开头。" },
            { who: "朋友", en: "Or put the answer on screen as text while you talk. That way both survive.", cn: "或者你说话时把答案做成字幕打在屏幕上。这样两个都能保住。" },
            { who: "发布者", en: "Text on screen for the first five seconds. I'll try it on the next one.", cn: "前五秒上字幕。下一个视频我试试。" },
            { who: "朋友", en: "And pin the same answer anyway, for the people who do read.", cn: "置顶还是照做，给那些真会读的人。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "发帖者 · 版主（审核区长帖）",
          register: "正式",
          channel: "论坛审核",
          barrier: "无（但需按格式删减并补一手来源）",
          result: "达成（论点开头、脚注来源、写明何种证据会改变看法）",
          lines: [
            { who: "版主", en: "We have received your post for the moderated section. It is longer than our guidance.", cn: "我们收到你投给审核区的帖子。它比我们的指引长。" },
            { who: "发帖者", en: "I should like to keep the whole argument. Which parts would you suggest cutting?", cn: "我希望保留完整论证。您建议删哪些部分？" },
            { who: "版主", en: "The first two paragraphs restate what the forum already knows.", cn: "前两段是复述论坛已知的内容。" },
            { who: "发帖者", en: "Then I shall cut them and open with the claim, with the sources in a footnote.", cn: "那我删掉，用论点开头，来源放脚注。" },
            { who: "版主", en: "That is the format we prefer. Do you have a source for the third figure?", cn: "这是我们偏好的格式。第三个数字有来源吗？" },
            { who: "发帖者", en: "I do, and I shall cite the primary document rather than the news report.", cn: "有，而且我会引用原始文件，而不是新闻报道。" },
            { who: "版主", en: "That will save us an argument in the comments.", cn: "这能在评论区省一场争论。" },
            { who: "发帖者", en: "I shall also state what would change my mind.", cn: "我还会写明什么情况会改变我的看法。" },
            { who: "版主", en: "That single sentence improves a post more than anything else.", cn: "这一句话比任何其他改动都更能提升一篇帖子。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "发帖者 · 回复者（问产品）",
          register: "随意（极简、俚语）",
          channel: "论坛",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "发帖者", en: "anyone know if this works", cn: "有人知道这个管用吗" },
            { who: "回复者", en: "works for me", cn: "我用着可以" },
            { who: "发帖者", en: "how long", cn: "用了多久" },
            { who: "回复者", en: "two years", cn: "两年" },
            { who: "发帖者", en: "any downsides", cn: "有什么缺点" },
            { who: "回复者", en: "the app", cn: "那个应用" },
            { who: "发帖者", en: "what about it", cn: "它怎么了" },
            { who: "回复者", en: "it's terrible", cn: "很烂" },
            { who: "发帖者", en: "but it works", cn: "但管用" },
            { who: "回复者", en: "yeah", cn: "对" }
          ]
        }
      ]
    },

    /* ==================== 10-01 教育议题 ==================== */
    {
      id: "s10-01",
      domain: "10",
      title: "教育议题",
      ielts: "口语 P3 观点 / 听力 S3",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "两位同学（考试是否有用）",
          register: "半正式",
          channel: "面对面",
          barrier: "无",
          result: "达成（把分歧落到「两套体系都有误差，应该测出来」）",
          lines: [
            { who: "甲", en: "Do you think exams measure anything?", cn: "你觉得考试能衡量什么吗？" },
            { who: "乙", en: "They measure how good you are at exams. That isn't nothing, but it isn't the subject either.", cn: "它们衡量你多会考试。这不算毫无价值，但也不是那门学问。" },
            { who: "甲", en: "Then what would you use instead?", cn: "那你用什么替代？" },
            { who: "乙", en: "Coursework plus a viva. It takes longer and it's harder to fake.", cn: "平时作业加答辩。更花时间，也更难作假。" },
            { who: "甲", en: "Harder to standardise, though. Two examiners could differ by a grade.", cn: "但更难标准化。两个考官可能差一个等级。" },
            { who: "乙", en: "So could two markers of the same exam paper. We just pretend they can't.", cn: "同一份卷子的两个阅卷人也可能。我们只是假装他们不会。" },
            { who: "甲", en: "That's a fair point. Perhaps the honest answer is that both systems carry error, and we should measure it.", cn: "这话有道理。也许诚实的答案是两套体系都有误差，而我们应该把误差测出来。" },
            { who: "乙", en: "Now that is a policy I would vote for.", cn: "这个政策我会投票支持。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "学生 · 老师（作业该不该取消）",
          register: "半正式",
          channel: "面对面（办公室）",
          barrier: "无（但要把过强的论断收窄到可辩护）",
          result: "达成（学生把立场改成更窄、更有证据的版本）",
          lines: [
            { who: "学生", en: "I think homework should be banned before the age of eleven.", cn: "我认为十一岁之前应该禁止家庭作业。" },
            { who: "老师", en: "Why eleven?", cn: "为什么是十一岁？" },
            { who: "学生", en: "Because that is when children can organise their own time.", cn: "因为那时孩子才能安排自己的时间。" },
            { who: "老师", en: "And before that, what does homework do?", cn: "在那之前，作业起了什么作用？" },
            { who: "学生", en: "It teaches them that home is an extension of school.", cn: "它让他们知道家是学校的延伸。" },
            { who: "老师", en: "That is a strong claim. Can you support it with evidence rather than conviction?", cn: "这是个很强的论断。你能用证据而不是信念支持它吗？" },
            { who: "学生", en: "There are studies on reading at home, but not on homework in general.", cn: "有关于在家阅读的研究，但没有关于家庭作业总体的。" },
            { who: "老师", en: "Then your position should be the narrower one, the one you can defend.", cn: "那你的立场应该是更窄的那个，那个你能守住。" },
            { who: "学生", en: "Narrower and defensible. That is a better sentence than mine.", cn: "更窄、可辩护。这句话比我那句好。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "两位家长（择校与交通）",
          register: "半正式",
          channel: "面对面",
          barrier: "一方主张自由择校，一方指出只有部分家庭能承担",
          result: "折中（把「选择权」与「交通补贴」拆成两个议题）",
          lines: [
            { who: "甲", en: "Parents should be able to choose any school they like.", cn: "父母应该能选任何他们喜欢的学校。" },
            { who: "乙", en: "That works for parents with cars and free mornings. It is a different sentence for everyone else.", cn: "对有车有闲的家长可行。对其他人来说是另一回事。" },
            { who: "甲", en: "Are you saying choice is only for the rich?", cn: "你是说选择权只属于富人？" },
            { who: "乙", en: "I'm saying choice plus transport is for everyone. Choice alone isn't.", cn: "我是说「选择权加交通」才属于所有人。光有选择权不是。" },
            { who: "甲", en: "So you would accept choice if the transport were funded?", cn: "那如果交通有补贴，你就接受选择权？" },
            { who: "乙", en: "I would accept it and then argue about the funding. That is a different argument.", cn: "我接受，然后我们再争补贴。那是另一个争论。" },
            { who: "甲", en: "Separating the principle from the funding is the useful part of this conversation.", cn: "把原则和资金分开，是这场对话里有用的部分。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "两位同学（「标准」一词的两种意思）",
          register: "半正式",
          channel: "面对面",
          barrier: "争了十分钟才发现双方的「标准」不是同一个意思",
          result: "修复（约定「底线」和「基准」两个词后重述论点）",
          lines: [
            { who: "甲", en: "We have been arguing for ten minutes and I think we mean different things by standard.", cn: "我们争了十分钟，我觉得我们对「标准」的理解不同。" },
            { who: "乙", en: "I mean a minimum that everyone reaches.", cn: "我指的是人人都要达到的最低线。" },
            { who: "甲", en: "I mean a level everyone is compared against, whether they reach it or not.", cn: "我指的是一个所有人被拿来对比的水平线，达不达到是另一回事。" },
            { who: "乙", en: "Then we disagree about what the word is doing, not about schools.", cn: "那我们争的是这个词的作用，不是学校。" },
            { who: "甲", en: "Can we agree two terms and use them for the rest of the discussion?", cn: "我们能定两个词，然后在后面的讨论里只用它们吗？" },
            { who: "乙", en: "Floor and benchmark.", cn: "底线和基准。" },
            { who: "甲", en: "Floor and benchmark. Now say your original point again.", cn: "底线和基准。现在把你的原话重说一遍。" },
            { who: "乙", en: "A floor is fair; a benchmark is only fair if the teaching is equal. That is a better sentence than my first one.", cn: "底线是公平的；基准只有在教学条件相同时才公平。这句比我第一句好。" }
          ]
        },
        {
          variant: "情绪型（九岁孩子的作业）",
          relation: "两位家长（作业与童年时间）",
          register: "半正式（情绪化）",
          channel: "面对面",
          barrier: "孩子九岁每天两小时作业，家长心疼但不知怎么说",
          result: "达成（改成「被拿走的是什么」的说法，并要求书面答复）",
          lines: [
            { who: "甲", en: "I'm not sure my daughter should be doing two hours of homework at nine.", cn: "我不确定我女儿九岁就该做两小时作业。" },
            { who: "乙", en: "That is a lot. What does she do afterwards?", cn: "那挺多的。做完之后她做什么？" },
            { who: "甲", en: "Nothing. It's bedtime. That's the whole day.", cn: "什么都不做。就该睡了。这一天就过完了。" },
            { who: "乙", en: "Then the question isn't homework, it's what is being taken away.", cn: "那问题不是作业，而是被拿走的是什么。" },
            { who: "甲", en: "Reading for pleasure, and being bored. Boredom matters, and nobody counts it.", cn: "为兴趣读书，还有发呆。发呆很重要，而没人把它算进去。" },
            { who: "乙", en: "Then say that at the parents' meeting, in those words.", cn: "那就在家长会上用这句话说。" },
            { who: "甲", en: "They will say it is the curriculum.", cn: "他们会说是课程要求。" },
            { who: "乙", en: "Then ask which part of the curriculum requires two hours, and ask for it in writing.", cn: "那就问课程要求的哪一部分需要两小时，并要求书面答复。" }
          ]
        },
        {
          variant: "渠道变体（线上辩论）",
          relation: "主持 · 两位辩手（线上辩论）",
          register: "半正式",
          channel: "线上辩论",
          barrier: "两人论点太接近，辩论陷入重复",
          result: "达成（互相复述对方立场，找出真正的分歧在顺序）",
          lines: [
            { who: "主持", en: "We have two minutes each, then questions. Please keep to the point.", cn: "每人两分钟，然后提问。请紧扣主题。" },
            { who: "甲", en: "My point is that class size matters less than teacher quality, and we keep funding the wrong one.", cn: "我的观点是班级规模不如教师素质重要，而我们一直在给错的那个投钱。" },
            { who: "乙", en: "My point is that you cannot improve teacher quality without reducing class size, so they are the same argument.", cn: "我的观点是，不缩小班级规模就提不高教师素质，所以它们是同一个论点。" },
            { who: "主持", en: "Those are close enough that I should like each of you to state the other's position in one sentence.", cn: "这两个太接近了，我想请你们各自用一句话复述对方的立场。" },
            { who: "甲", en: "You're saying resources are the precondition.", cn: "你是说资源是前提。" },
            { who: "乙", en: "And you're saying resources are wasted without quality. Both are true.", cn: "而你是说没有质量，资源就是浪费。两者都对。" },
            { who: "主持", en: "Then the disagreement is about order, not about facts. That is the most useful outcome a debate can have.", cn: "那分歧在于顺序，而不在事实。这是辩论能得到最有用的结果。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "委员会主席 · 发言者（正式教育议题）",
          register: "正式",
          channel: "正式会议",
          barrier: "无（但需三段理由加一点让步）",
          result: "达成（让步比理由更有说服力，被接受为动议依据）",
          lines: [
            { who: "主席", en: "The motion before us is that examination results should not be published by school.", cn: "提交我们的动议是：学校不应公布考试成绩。" },
            { who: "发言者", en: "I support the motion, and I shall give three reasons and one concession.", cn: "我支持该动议，我将给出三点理由和一点让步。" },
            { who: "主席", en: "Please proceed.", cn: "请继续。" },
            { who: "发言者", en: "First, publication measures intake as much as teaching. Second, it drives selection by postcode. Third, regulators hold the data regardless.", cn: "第一，公布成绩衡量的生源不亚于教学。第二，它促成按邮编筛选。第三，监管机构本来就能拿到数据。" },
            { who: "委员", en: "And your concession?", cn: "那您的让步呢？" },
            { who: "发言者", en: "That parents have a legitimate interest in the information, and it should be available to them in confidence rather than in a league table.", cn: "家长对这类信息有正当利益，应以非公开方式而非排行榜形式提供给他们。" },
            { who: "委员", en: "That concession is more persuasive than the three reasons.", cn: "这个让步比那三条理由更有说服力。" },
            { who: "发言者", en: "It usually is, which is why I put it last.", cn: "通常是这样，所以我才把它放最后。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "两位同学（讨论课前的阅读）",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "甲", en: "did you do the reading", cn: "阅读做了吗" },
            { who: "乙", en: "no", cn: "没有" },
            { who: "甲", en: "seminar's in an hour", cn: "一小时后就是讨论课" },
            { who: "乙", en: "i'll skim it", cn: "我扫一遍" },
            { who: "甲", en: "skimming won't work", cn: "扫一遍没用" },
            { who: "乙", en: "why", cn: "为什么" },
            { who: "甲", en: "he asks for the argument, not the facts", cn: "他问的是论证，不是事实" },
            { who: "乙", en: "then i'm doomed", cn: "那我完了" },
            { who: "甲", en: "read the intro and the conclusion", cn: "读引言和结论" },
            { who: "乙", en: "that's a strategy", cn: "这算个策略" }
          ]
        }
      ]
    },

    /* ==================== 10-02 科技议题 ==================== */
    {
      id: "s10-02",
      domain: "10",
      title: "科技议题",
      ielts: "口语 P3 观点 / 听力 S3",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "两位同学（AI 与写作）",
          register: "半正式",
          channel: "面对面",
          barrier: "无",
          result: "达成（定下「讲不清就不发」的界限）",
          lines: [
            { who: "甲", en: "Do you use AI for writing?", cn: "你用 AI 写东西吗？" },
            { who: "乙", en: "For structure, not for sentences. It's good at telling me what I have left out.", cn: "用来理结构，不用来写句子。它擅长告诉我漏了什么。" },
            { who: "甲", en: "Isn't that the part you are supposed to learn?", cn: "那部分不正是你该学的吗？" },
            { who: "乙", en: "Some of it. Knowing what a good argument contains is a separate skill from making one.", cn: "一部分是。知道好论证包含什么，跟写出它，是两种不同的能力。" },
            { who: "甲", en: "Where do you draw the line?", cn: "你的界限在哪？" },
            { who: "乙", en: "If I couldn't defend the sentence out loud, I don't send it.", cn: "如果我不能把这句话当面讲清楚，我就不发。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "员工 · 主管（自动化与岗位）",
          register: "半正式",
          channel: "面对面（一对一）",
          barrier: "无（但要把口头担忧变成书面并要求答复日期）",
          result: "达成（培训经费与不因系统升级裁员两条写进计划）",
          lines: [
            { who: "员工", en: "The new system does about half of what my team does.", cn: "新系统做了我团队大约一半的工作。" },
            { who: "主管", en: "It does the repetitive half.", cn: "它做的是重复的那一半。" },
            { who: "员工", en: "For now. What I'm asking is whether anyone has said what happens to the people who did the repetitive half.", cn: "目前是这样。我要问的是：有没有人说过原来做那一半的人会怎样。" },
            { who: "主管", en: "Not in writing.", cn: "书面上没有。" },
            { who: "员工", en: "Then let me put it in writing, and I'd like a date for an answer.", cn: "那我来写，并希望有个答复日期。" },
            { who: "主管", en: "What would you want said?", cn: "你希望写什么？" },
            { who: "员工", en: "Two things: retraining is funded, and nobody is made redundant because a system improved.", cn: "两件事：培训有经费；不能因为系统升级就裁员。" },
            { who: "主管", en: "The second one I can support. The first one I'll ask about.", cn: "第二条我可以支持。第一条我去问。" },
            { who: "员工", en: "In writing, and that is how a plan starts.", cn: "书面，计划就是这么开始的。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "两位家长（校园手机禁令）",
          register: "半正式",
          channel: "面对面",
          barrier: "一方要求全面禁手机，另一方指出禁令在边界上失效",
          result: "折中（上课禁用、楼道禁用、操场在有看管时可用）",
          lines: [
            { who: "甲", en: "Phones should be banned in schools completely.", cn: "学校应该彻底禁止手机。" },
            { who: "乙", en: "Completely means during a fire drill too.", cn: "彻底的意思包括消防演习时。" },
            { who: "甲", en: "That is a silly example.", cn: "这例子很蠢。" },
            { who: "乙", en: "It is an edge case, and edge cases are where bans fail. Say not during lessons and I'll agree.", cn: "这是边界情况，而禁令就是在边界上失效。你说「上课期间不用」，我就同意。" },
            { who: "甲", en: "Then breaks become a free-for-all.", cn: "那课间就变成混战。" },
            { who: "乙", en: "So ban them in corridors and allow them in the yard, where there's supervision.", cn: "那就禁止在楼道用，允许在有人看管的操场用。" },
            { who: "甲", en: "That's more complicated, and it might work.", cn: "这更复杂，但可能管用。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "两位同事（「AI」指的不是一回事）",
          register: "半正式",
          channel: "面对面",
          barrier: "一个说现有工具，一个以为在说通用智能，白争半小时",
          result: "修复（约定「工具」与「那种主张」两个词后重新对齐）",
          lines: [
            { who: "甲", en: "You keep saying AI, and I don't know whether you mean the current tools or something else.", cn: "你一直说 AI，我不知道你指的是现在的工具还是别的东西。" },
            { who: "乙", en: "The current tools.", cn: "现在的工具。" },
            { who: "甲", en: "Then I agree with most of what you said. I thought you meant general intelligence.", cn: "那你说的大部分我同意。我以为你指的是通用智能。" },
            { who: "乙", en: "That's my fault. I use the word for both.", cn: "是我的问题。我这个词两个意思都用。" },
            { who: "甲", en: "Then let's use the tools for what exists, and the claim for the other.", cn: "那我们用「工具」指现在存在的东西，用「那种主张」指另一个。" },
            { who: "乙", en: "With that change, where do we actually disagree?", cn: "换了这个词，我们到底哪里不同？" },
            { who: "甲", en: "About speed, not about direction.", cn: "关于速度，不是方向。" }
          ]
        },
        {
          variant: "情绪型（生计被自动化挤压）",
          relation: "自由职业者 · 朋友",
          register: "半正式（情绪化）",
          channel: "面对面",
          barrier: "八个月内活源枯竭，情绪与生计双重压力",
          result: "达成（转向需要承担责任的那类工作）",
          lines: [
            { who: "甲", en: "My work dried up in eight months. It wasn't a recession.", cn: "我的活八个月里就没了。那不是经济衰退。" },
            { who: "乙", en: "What changed?", cn: "什么变了？" },
            { who: "甲", en: "Clients started doing in an hour what they used to pay me a day for.", cn: "客户开始用一小时做以前付我一天钱的事。" },
            { who: "乙", en: "And the quality?", cn: "质量呢？" },
            { who: "甲", en: "Good enough. That is the whole problem. Good enough is what pays.", cn: "够用。这就是全部问题。「够用」才是付钱的。" },
            { who: "乙", en: "What are you doing about it?", cn: "你打算怎么办？" },
            { who: "甲", en: "Moving to the part that needs accountability. Anyone can generate it; not everyone will sign their name to it.", cn: "转到需要承担责任的那部分。谁都能生成，但不是谁都愿意署名。" },
            { who: "乙", en: "That is the most concrete answer I have heard to this question.", cn: "这是我在这个问题上听到最具体的答案。" }
          ]
        },
        {
          variant: "渠道变体（直播与播客讨论）",
          relation: "主持 · 嘉宾（直播问答）",
          register: "半正式",
          channel: "直播问答",
          barrier: "聊天框滚得太快，问题重复且夹杂攻击",
          result: "达成（取问得最多的那一个，并置顶关键回答）",
          lines: [
            { who: "主持", en: "We have a thousand people watching and the chat is moving fast. One question at a time.", cn: "有一千人在看，聊天框滚得很快。一次一个问题。" },
            { who: "嘉宾", en: "Take the most-asked one, not the most recent.", cn: "取问得最多的那个，不是最新的。" },
            { who: "主持", en: "The most-asked is: will this take jobs?", cn: "问得最多的是：这会不会抢走工作。" },
            { who: "嘉宾", en: "It will take tasks. Whether it takes jobs depends on whether we retrain, and that is a decision, not a prediction.", cn: "它会抢走任务。是否抢走岗位取决于我们是否再培训，那是个决定，不是预言。" },
            { who: "主持", en: "Someone in the chat says that is a cop-out.", cn: "聊天里有人说这是回避问题。" },
            { who: "嘉宾", en: "It's the opposite. A prediction lets you do nothing. A decision makes someone responsible.", cn: "正好相反。预言让你什么都不用做。决定则要有人负责。" },
            { who: "主持", en: "I'll pin that.", cn: "这句我置顶。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "委员会主席 · 委员（自动决策伦理）",
          register: "正式",
          channel: "正式会议",
          barrier: "无（但需把责任落到具体人而不是技术）",
          result: "达成（三项条件写入纪要，含具名负责人）",
          lines: [
            { who: "主席", en: "The committee will consider the deployment of automated decision-making in public services.", cn: "委员会将审议公共服务中自动决策系统的部署。" },
            { who: "委员", en: "I support deployment with three conditions: an explanation for each decision, a route of appeal, and a named person accountable.", cn: "我支持部署，附三个条件：每项决定可解释、有申诉途径、有具名负责人。" },
            { who: "主席", en: "Are those conditions technically achievable?", cn: "这些条件在技术上可实现吗？" },
            { who: "委员", en: "The first two, yes. The third is an administrative choice, not a technical one.", cn: "前两项可以。第三项是管理选择，不是技术问题。" },
            { who: "主席", en: "Then the committee should say so plainly rather than deferring to engineers.", cn: "那委员会就该明说，而不是推给工程师。" },
            { who: "委员", en: "I agree, and I would add that a system which cannot explain itself should not be deployed in a service that can refuse someone.", cn: "我同意，并补充：不能解释自身的系统，不该部署在可以拒绝他人的服务里。" },
            { who: "主席", en: "That sentence will be in the minutes.", cn: "这句话会进纪要。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "两位同事（试新工具）",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "甲", en: "did you try it", cn: "你试了吗" },
            { who: "乙", en: "yeah", cn: "试了" },
            { who: "甲", en: "any good", cn: "好用吗" },
            { who: "乙", en: "for boring stuff", cn: "处理无聊的事还行" },
            { who: "甲", en: "like what", cn: "比如" },
            { who: "乙", en: "summarising. emails. that's it", cn: "总结。邮件。就这些" },
            { who: "甲", en: "writing", cn: "写作呢" },
            { who: "乙", en: "it writes like a leaflet", cn: "它写得像宣传册" },
            { who: "甲", en: "so do i", cn: "我也一样" },
            { who: "乙", en: "then you're both fine", cn: "那你俩都挺好" }
          ]
        }
      ]
    },

    /* ==================== 10-03 环境议题 ==================== */
    {
      id: "s10-03",
      domain: "10",
      title: "环境议题",
      ielts: "口语 P3 观点 / 听力 S3",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "两位同学（个人行动有没有用）",
          register: "半正式",
          channel: "面对面",
          barrier: "无",
          result: "达成（个人行动与政治行动并行，但不混为一谈）",
          lines: [
            { who: "甲", en: "I've started cycling to work. It saves about a tonne of carbon a year.", cn: "我开始骑车上班了。一年大约省一吨碳。" },
            { who: "乙", en: "And the council has just approved a new road.", cn: "而市政刚批了一条新路。" },
            { who: "甲", en: "So my tonne is pointless?", cn: "所以我那一吨就没意义了？" },
            { who: "乙", en: "No. It's just smaller than the decisions you don't get to make.", cn: "不。只是它比你没法参与的那些决定要小。" },
            { who: "甲", en: "Then what is the point of doing anything?", cn: "那做任何事还有什么意义？" },
            { who: "乙", en: "The point is that individual action and political action aren't alternatives. One takes ten minutes and the other takes ten years.", cn: "意义在于个人行动和政治行动不是二选一。一个花十分钟，一个花十年。" },
            { who: "甲", en: "So do both, and don't pretend the first one is the second.", cn: "所以两件都做，但别把第一件当成第二件。" },
            { who: "乙", en: "That's the whole argument in one sentence.", cn: "整个论点就这一句。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "居民 · 规划部门官员（环境评估）",
          register: "半正式",
          channel: "公众咨询",
          barrier: "无（但要用一个更窄的问题击穿由开发商出资的报告）",
          result: "达成（要求补充监测站距离并书面提交委员会）",
          lines: [
            { who: "居民", en: "The air quality report says the site is suitable. It was paid for by the developer.", cn: "空气质量报告说这块地适合。报告是开发商出钱的。" },
            { who: "官员", en: "That is normal practice, and it does not follow that the report is wrong.", cn: "这是常规做法，并不等于报告是错的。" },
            { who: "居民", en: "I agree, and it does follow that it needs checking.", cn: "我同意，但这确实意味着它需要被复核。" },
            { who: "官员", en: "The council has no capacity to commission its own.", cn: "市政没有能力自己委托一份。" },
            { who: "居民", en: "Then let me ask a narrower question: which monitoring station was used, and how far is it from the site?", cn: "那我问个更窄的问题：用的是哪个监测站，离地块多远？" },
            { who: "官员", en: "Two kilometres, I believe.", cn: "我想是两公里。" },
            { who: "居民", en: "That is the question that decides the application, and it isn't in the report.", cn: "这才是决定申请的问题，而它不在报告里。" },
            { who: "官员", en: "...I shall ask for that to be supplied.", cn: "……我会要求补充这一点。" },
            { who: "居民", en: "In writing, please, and before the committee meets.", cn: "请书面，并在委员会开会之前。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "两位同学（一次性塑料禁令）",
          register: "半正式",
          channel: "面对面",
          barrier: "「全面禁止」的说法在医院等场景上站不住",
          result: "折中（把主张收窄到商店零售，并补上替代方案）",
          lines: [
            { who: "甲", en: "Single-use plastics should be banned entirely.", cn: "一次性塑料应该全面禁止。" },
            { who: "乙", en: "Including the ones that keep hospital equipment sterile?", cn: "包括让医院器械保持无菌的那些吗？" },
            { who: "甲", en: "Obviously not those.", cn: "显然不包括那些。" },
            { who: "乙", en: "Then the ban isn't on single-use plastic, it's on single-use plastic in shops.", cn: "那这项禁令针对的不是一次性塑料，而是商店里的一次性塑料。" },
            { who: "甲", en: "Fine, that's what I meant, and it's still worth doing.", cn: "行，我就是这个意思，而且仍然值得做。" },
            { who: "乙", en: "Then say it that way, because the first version loses the argument before it starts.", cn: "那就这么说，因为第一个版本还没开始就输了。" },
            { who: "甲", en: "Narrow claim, winnable argument.", cn: "窄的主张，能赢的论证。" },
            { who: "乙", en: "And add what replaces it. A ban without an alternative is a ban people break.", cn: "再加上替代品是什么。没有替代方案的禁令，人们会违反。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "两位同学（净零与绝对零混用）",
          register: "半正式",
          channel: "面对面",
          barrier: "「净零」被当成「零」用，讨论一直对不上",
          result: "修复（改用「绝对零」与「净零」两个词各配日期）",
          lines: [
            { who: "甲", en: "You've said net zero three times and I'm not sure you mean zero.", cn: "你说了三次净零，我不确定你指的是零。" },
            { who: "乙", en: "I mean emissions minus removals.", cn: "我指的是排放减去移除。" },
            { who: "甲", en: "And I mean no emissions at all. Those are different targets with different dates.", cn: "我指的是完全不再排放。这是两个不同目标，时间表也不同。" },
            { who: "乙", en: "They are, and the words are used interchangeably by everyone, including governments.", cn: "确实是，而且所有人都在混用这两个词，包括政府。" },
            { who: "甲", en: "Then let's say gross zero and net zero for the rest of this.", cn: "那接下来的讨论我们用「绝对零」和「净零」。" },
            { who: "乙", en: "Gross zero for electricity, net zero for everything else, and a date for each.", cn: "电力用绝对零，其他用净零，各有一个日期。" },
            { who: "甲", en: "Now I know what we disagree about.", cn: "现在我知道我们在争什么了。" }
          ]
        },
        {
          variant: "情绪型（气候焦虑）",
          relation: "两位同学（读不下报告）",
          register: "半正式（情绪化）",
          channel: "面对面",
          barrier: "报告读到麻木，把不看当成放弃",
          result: "达成（把阅读换成一件能长期做的具体行动）",
          lines: [
            { who: "甲", en: "I can't read another report. I've stopped looking.", cn: "我读不下去报告了。我已经不看了。" },
            { who: "乙", en: "That's a reasonable reaction to reading them.", cn: "读了那些之后这个反应很正常。" },
            { who: "甲", en: "It feels like giving up.", cn: "感觉像放弃了。" },
            { who: "乙", en: "It isn't, if you replace the reading with one action.", cn: "如果你把阅读换成一件实际行动，就不算。" },
            { who: "甲", en: "Which action?", cn: "什么行动？" },
            { who: "乙", en: "Whichever one you can keep doing while you're not reading. Mine is a bus pass and a bank that doesn't fund coal.", cn: "任何你在不读报告的时候还能一直做的事。我的是公交年卡和一家不投煤的银行。" },
            { who: "甲", en: "The bank one I hadn't thought of, and it takes twenty minutes.", cn: "银行这个我没想到，而且只要二十分钟。" },
            { who: "乙", en: "That's why it's a good one. Twenty minutes once beats a lifetime of guilt.", cn: "所以它是个好选择。二十分钟一次，胜过一辈子的愧疚。" }
          ]
        },
        {
          variant: "渠道变体（线上公众咨询）",
          relation: "居民 · 咨询会主持（线上听证）",
          register: "半正式",
          channel: "线上公众咨询",
          barrier: "模板邮件与认真提交的反馈被同等计数",
          result: "达成（改为带段落引用的编号异议并要求逐条答复）",
          lines: [
            { who: "主持", en: "This consultation is recorded and the transcript will be published.", cn: "本次咨询会录音，笔录将公开。" },
            { who: "居民", en: "May I ask how the responses are weighted? Four hundred emails or forty letters?", cn: "请问反馈如何加权？四百封邮件还是四十封信？" },
            { who: "主持", en: "All responses are treated equally.", cn: "所有反馈同等对待。" },
            { who: "居民", en: "Then a campaign that sends a standard email counts the same as someone who read the whole document.", cn: "那一场发标准模板邮件的运动，跟一个读完整份文件的人分量一样。" },
            { who: "主持", en: "That is the policy.", cn: "这是我们的政策。" },
            { who: "居民", en: "Then I shall submit my points as numbered objections with paragraph references, and ask that they be answered individually.", cn: "那我就把意见写成带段落引用的编号异议，并要求逐条答复。" },
            { who: "主持", en: "That is unusual, and it is harder to set aside.", cn: "这很少见，也更难被搁置。" },
            { who: "居民", en: "That's why I'm doing it.", cn: "所以我才这么做。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "委员会主席 · 居民协会代表（防洪方案）",
          register: "正式",
          channel: "正式听证",
          barrier: "无（但需三段具体质疑加一项可表决的请求）",
          result: "达成（要求修订模型并在学期内重新咨询，付诸表决）",
          lines: [
            { who: "主席", en: "The committee will take evidence on the proposal for the flood defences.", cn: "委员会将就防洪方案听取证词。" },
            { who: "发言者", en: "I speak for the residents' association. I have three points and one request.", cn: "我代表居民协会发言。我有三点意见和一项请求。" },
            { who: "主席", en: "Please proceed.", cn: "请继续。" },
            { who: "发言者", en: "First, the modelling uses rainfall data to 2015. Second, it excludes the two streets built since. Third, the consultation was held in August.", cn: "第一，模型用的是到 2015 年的降雨数据。第二，它排除了此后建成的两条街。第三，咨询会安排在八月。" },
            { who: "委员", en: "The August timing is a fair criticism.", cn: "八月的安排这一点批评得公道。" },
            { who: "发言者", en: "My request is that the committee ask for revised modelling and re-consult in term time.", cn: "我的请求是委员会要求修订模型，并在学期内重新咨询。" },
            { who: "主席", en: "That request is within our power and I shall put it to the vote.", cn: "这项请求在我们权限内，我将付诸表决。" },
            { who: "发言者", en: "Thank you. I should add that we support the scheme in principle.", cn: "谢谢。我补充一点：我们原则上支持该方案。" },
            { who: "主席", en: "Saying so makes your objections harder to dismiss.", cn: "这句话让你们的不同意见更难被驳掉。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "两位同事（回收）",
          register: "随意（极简、俚语）",
          channel: "面对面",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "甲", en: "you recycle", cn: "你回收吗" },
            { who: "乙", en: "yeah", cn: "回" },
            { who: "甲", en: "does it matter", cn: "有用吗" },
            { who: "乙", en: "not much", cn: "用处不大" },
            { who: "甲", en: "then why", cn: "那为什么" },
            { who: "乙", en: "habit", cn: "习惯" },
            { who: "甲", en: "honest", cn: "实诚" },
            { who: "乙", en: "the bin men do the rest", cn: "剩下的是收垃圾的干的" },
            { who: "甲", en: "or they don't", cn: "或者他们也没干" },
            { who: "乙", en: "probably", cn: "大概吧" }
          ]
        }
      ]
    },

    /* ==================== 10-04 工作与生活方式议题 ==================== */
    {
      id: "s10-04",
      domain: "10",
      title: "工作与生活方式议题",
      ielts: "口语 P3 观点 / 听力 S3",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "两位同事（回不回办公室）",
          register: "半正式",
          channel: "面对面",
          barrier: "无",
          result: "达成（按「哪些任务需要一个房间」来判断）",
          lines: [
            { who: "甲", en: "Would you go back to the office five days?", cn: "你会回去一周五天坐班吗？" },
            { who: "乙", en: "For a job I wanted, yes. For this one, no.", cn: "如果是我想要的工作，会。这一份，不会。" },
            { who: "甲", en: "What's the difference?", cn: "区别在哪？" },
            { who: "乙", en: "In this one, half my day is reading and writing. That doesn't need a building.", cn: "这一份里，我半天时间在读和写。那不需要一栋楼。" },
            { who: "甲", en: "And the parts that do?", cn: "那需要楼的部分呢？" },
            { who: "乙", en: "The two hours a week that decide things. I'd come in for those without being asked.", cn: "每周决定事情的那两小时。那两小时不用要求我也会来。" },
            { who: "甲", en: "So the argument isn't remote versus office. It's which tasks need a room.", cn: "所以争论不是远程对坐班，而是哪些任务需要一个房间。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "员工 · 主管（申请四天工作制）",
          register: "半正式",
          channel: "面对面（一对一）",
          barrier: "无（但要用可验证的产出换试点）",
          result: "达成（三个月书面试点，指标先定）",
          lines: [
            { who: "员工", en: "I'd like to discuss moving to four days.", cn: "我想谈谈改成四天工作制。" },
            { who: "主管", en: "Same pay?", cn: "同样的薪水？" },
            { who: "员工", en: "Same pay, four days, and I'll show you the output figures after three months.", cn: "同薪、四天，三个月后我给你看产出数据。" },
            { who: "主管", en: "Why would I agree to that in advance?", cn: "我为什么要事先同意？" },
            { who: "员工", en: "Because if the figures hold, you get five days of work for four days of cost. If they don't, I go back and we've lost three months.", cn: "因为如果数据站得住，你用四天的成本拿到五天的工作量。如果站不住，我改回去，我们只损失三个月。" },
            { who: "主管", en: "And if the rest of the team wants the same?", cn: "如果团队其他人也要呢？" },
            { who: "员工", en: "Then you decide on their figures too, not on mine. That's fair.", cn: "那你就按他们的数据决定，不是按我的。这样公平。" },
            { who: "主管", en: "...Three months, in writing, with the metric agreed first.", cn: "……三个月，书面，指标先定好。" },
            { who: "员工", en: "The metric agreed first is the part people skip.", cn: "先把指标定好，这一点别人都会省掉。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "两位同事（工作与生活平衡这个词）",
          register: "半正式",
          channel: "面对面",
          barrier: "一方认为这个词是管理层话术，一方靠它度过家人生病",
          result: "折中（改叫「请假」，并让所有人都能用而非只给会开口的人）",
          lines: [
            { who: "甲", en: "Work-life balance is a phrase managers use to avoid hiring.", cn: "工作生活平衡是管理者用来逃避招人的说法。" },
            { who: "乙", en: "Sometimes. It's also what I needed when my father was ill.", cn: "有时是。它也是我父亲生病时我需要的。" },
            { who: "甲", en: "Then it should be called what it is: leave.", cn: "那就该叫它本来的名字：请假。" },
            { who: "乙", en: "Fine. Call it leave, and make it available to everyone rather than to the people who ask well.", cn: "行。就叫请假，并且让所有人都能用，而不是只给那些会开口的人。" },
            { who: "甲", en: "That's the version I'd support.", cn: "这个版本我支持。" },
            { who: "乙", en: "The wording was never the problem. The discretion was.", cn: "措辞从来不是问题，自由裁量才是。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "两位同事（「忙碌」与「高效」）",
          register: "半正式",
          channel: "面对面",
          barrier: "把落后归因于自己慢，其实是清单本身不对",
          result: "修复（去向拥有清单的人要求排序）",
          lines: [
            { who: "甲", en: "I've been working sixty-hour weeks and I'm still behind.", cn: "我一周工作六十小时，还是落后。" },
            { who: "乙", en: "Behind on what?", cn: "落后什么？" },
            { who: "甲", en: "On the list.", cn: "那个清单。" },
            { who: "乙", en: "Whose list?", cn: "谁的清单？" },
            { who: "甲", en: "...I see your point.", cn: "……我明白你的意思了。" },
            { who: "乙", en: "Sixty hours means the list is wrong, not that you're slow. Say that out loud to whoever owns the list.", cn: "六十小时说明清单有问题，不是你慢。去跟拥有那份清单的人这么说。" },
            { who: "甲", en: "They'll say it's all essential.", cn: "他们会说每项都必要。" },
            { who: "乙", en: "Then ask them to rank it. Nobody can rank twelve things as first.", cn: "那就让他们排序。没人能把十二件事都排第一。" }
          ]
        },
        {
          variant: "情绪型（倦怠）",
          relation: "两位同事（喜欢的工作变了）",
          register: "半正式（情绪化）",
          channel: "面对面",
          barrier: "同样的活、更多量、同样的钱，持续十四个月",
          result: "达成（把「我累了」换成可谈判的那句话）",
          lines: [
            { who: "甲", en: "I used to like this job.", cn: "我以前喜欢这份工作。" },
            { who: "乙", en: "What changed?", cn: "什么变了？" },
            { who: "甲", en: "Nothing, and that's the problem. Same job, more of it, same money.", cn: "什么都没变，而这就是问题。同样的活，更多，同样的钱。" },
            { who: "乙", en: "How long has it been more?", cn: "多了多久了？" },
            { who: "甲", en: "Fourteen months. I keep thinking it's a phase.", cn: "十四个月。我一直觉得这是阶段性的。" },
            { who: "乙", en: "Fourteen months is not a phase, it's the job. What would you need in order to stay?", cn: "十四个月不是阶段性，这就是这份工作。你需要什么才肯留下？" },
            { who: "甲", en: "One more person on the team, or the same output promised to fewer people.", cn: "团队多一个人，或者对更少的客户承诺同样的产出。" },
            { who: "乙", en: "Then that is the sentence for the meeting, not I'm tired.", cn: "那这就是会上该说的那句，而不是「我累了」。" }
          ]
        },
        {
          variant: "渠道变体（混合团队文化）",
          relation: "主持 · 远程同事（混合会议）",
          register: "半正式",
          channel: "线上会议 + 面对面",
          barrier: "现场的人主导会议，远程成为二等参与者",
          result: "达成（全体各自接入 + 前十分钟留给远程 + 决定当小时书面）",
          lines: [
            { who: "主持", en: "The people in the room dominate the call. How do we fix it?", cn: "现场的人主导了会议。我们怎么解决？" },
            { who: "远程", en: "Two ways. Everyone joins from their own laptop, even in the office, and the first ten minutes are for remote.", cn: "两个办法。所有人各自用笔记本接入，哪怕在办公室；前十分钟留给远程。" },
            { who: "主持", en: "The first one feels antisocial.", cn: "第一个感觉有点不近人情。" },
            { who: "远程", en: "It's the opposite. It means the people at home aren't second-class participants.", cn: "恰恰相反。它意味着在家的人不是二等参与者。" },
            { who: "主持", en: "And decisions?", cn: "那决定呢？" },
            { who: "远程", en: "Written down within the hour, or they get re-argued next week by whoever wasn't listening.", cn: "一小时内写下来，不然下周会被没在听的人推翻重议。" },
            { who: "主持", en: "Both of those, starting Monday.", cn: "两条都做，周一开始。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "委员会主席 · 委员（弹性工作动议）",
          register: "正式",
          channel: "正式会议",
          barrier: "无（但需把举证责任转到雇主并保护小企业）",
          result: "达成（请求权改为获得权 + 十人以下企业豁免）",
          lines: [
            { who: "主席", en: "The committee will consider a motion on flexible working as the default.", cn: "委员会将审议一项关于弹性工作为默认安排的动议。" },
            { who: "委员", en: "I support it, with one amendment: the right to request should become a right to have, unless the employer can show a specific business reason in writing.", cn: "我支持，并提一项修正：请求权应改为获得权，除非雇主能书面说明具体的业务理由。" },
            { who: "主席", en: "That shifts the burden of proof.", cn: "这转移了举证责任。" },
            { who: "委员", en: "It does, and that is precisely the point. At present the employee must prove it is workable, which nobody can do in advance.", cn: "是的，而这正是关键。目前员工必须证明可行，而没人能事先证明。" },
            { who: "委员乙", en: "Small employers may struggle with the paperwork.", cn: "小雇主可能在材料上有困难。" },
            { who: "委员", en: "Then exempt firms with under ten staff rather than weakening the right for everyone.", cn: "那就豁免十人以下的企业，而不是削弱所有人的权利。" },
            { who: "主席", en: "That is a workable amendment. I shall take both to the vote.", cn: "这是一项可行的修正。两项都付诸表决。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "两位同事（居家办公）",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "甲", en: "you still working from home", cn: "你还在家办公吗" },
            { who: "乙", en: "tuesdays and thursdays", cn: "周二和周四" },
            { who: "甲", en: "and the rest", cn: "其余呢" },
            { who: "乙", en: "office", cn: "去办公室" },
            { who: "甲", en: "which is better", cn: "哪个更好" },
            { who: "乙", en: "home for work. office for people", cn: "干活在家，见人去办公室" },
            { who: "甲", en: "that's about right", cn: "差不多是这样" },
            { who: "乙", en: "and fridays are pointless", cn: "而且周五毫无意义" },
            { who: "甲", en: "everyone says that", cn: "大家都这么说" },
            { who: "乙", en: "because it's true", cn: "因为是真的" }
          ]
        }
      ]
    },

    /* ==================== 10-05 媒体与文化议题 ==================== */
    {
      id: "s10-05",
      domain: "10",
      title: "媒体与文化议题",
      ielts: "口语 P3 观点 / 听力 S3",
      dialogues: [
        {
          variant: "顺利达成（对等）",
          relation: "两位同学（新闻来源）",
          register: "半正式",
          channel: "面对面",
          barrier: "无",
          result: "达成（区分「读新闻」与「读受众」）",
          lines: [
            { who: "甲", en: "Where do you get your news?", cn: "你的新闻从哪来？" },
            { who: "乙", en: "Two sources I pay for, and one I don't trust but read anyway.", cn: "两个我付费的，一个我不信但还会看的。" },
            { who: "甲", en: "Why read the one you don't trust?", cn: "为什么看你不信的那个？" },
            { who: "乙", en: "To know what other people are being told. That's useful, and it isn't information.", cn: "为了知道别人被告知了什么。这有用，但不是信息。" },
            { who: "甲", en: "That's a distinction I hadn't made.", cn: "这个区分我没想到。" },
            { who: "乙", en: "It's the difference between reading the news and reading the audience.", cn: "这就是读新闻和读受众的区别。" }
          ]
        },
        {
          variant: "顺利达成（权力不对等）",
          relation: "读者 · 编辑（要求更正）",
          register: "半正式",
          channel: "邮件 + 电话",
          barrier: "无（但要用「号码已停用两年」的事实要求更正而非澄清）",
          result: "达成（编辑亲自处理更正位置）",
          lines: [
            { who: "读者", en: "Your article said I refused to comment. I was never asked.", cn: "你们的文章说我不予置评。从来没人问过我。" },
            { who: "编辑", en: "The reporter's note says a call was made.", cn: "记者的记录说打过电话。" },
            { who: "读者", en: "To a number that has been disconnected for two years. It is on your own contact page.", cn: "打的是一个两年前就停用的号码。而它就在你们自己的联络页上。" },
            { who: "编辑", en: "That would be an error.", cn: "那确实是个错误。" },
            { who: "读者", en: "I should like a correction rather than a clarification, and not at the bottom of the page.", cn: "我要的是更正，不是澄清；而且不希望它放在页面最下面。" },
            { who: "编辑", en: "We correct at the foot of the article. That is our policy.", cn: "我们在文章末尾更正。这是我们的政策。" },
            { who: "读者", en: "Then I shall ask for a paragraph in the same section, and I'll put that request in writing today.", cn: "那我会要求在同一个版块给一段更正，并且今天书面提出这个要求。" },
            { who: "编辑", en: "...Send the letter. I'll look at it myself.", cn: "……把信发来。我亲自看。" }
          ]
        },
        {
          variant: "拒绝 → 折中",
          relation: "两位同学（能不能说）",
          register: "半正式",
          channel: "面对面",
          barrier: "把「会被反驳」当成「被封禁」",
          result: "折中（承认真正分歧在「代价是否重要」）",
          lines: [
            { who: "甲", en: "You can't say anything any more.", cn: "现在什么都不能说了。" },
            { who: "乙", en: "You can say it. What changed is that people may answer.", cn: "你可以说。变的是别人可能会回应。" },
            { who: "甲", en: "That's the same thing with extra steps.", cn: "这是一回事，只是多了几步。" },
            { who: "乙", en: "It isn't. Being disagreed with is not being censored.", cn: "不是。被反驳不等于被封禁。" },
            { who: "甲", en: "Then we disagree about whether the cost matters.", cn: "那我们对「这个代价是否重要」有分歧。" },
            { who: "乙", en: "Agreed, and that is a real disagreement. The other version isn't.", cn: "同意，而且这是个真实的分歧。另一个版本不是。" }
          ]
        },
        {
          variant: "沟通故障 → 修复",
          relation: "两位同学（审查与平台规则）",
          register: "半正式",
          channel: "面对面",
          barrier: "「审查」与「平台执行规则」被混为一谈，救济途径讲不清",
          result: "修复（改用「去平台化」并分开讨论机制与救济）",
          lines: [
            { who: "甲", en: "Taking that video down is censorship.", cn: "下架那个视频就是审查。" },
            { who: "乙", en: "Censorship is the state doing it. A platform enforcing its own rules is something else.", cn: "审查是国家做的。平台执行自己的规则是另一回事。" },
            { who: "甲", en: "The effect on the speaker is the same.", cn: "对说话者的效果一样。" },
            { who: "乙", en: "The effect is similar, the mechanism is different, and the remedies are completely different.", cn: "效果相似，机制不同，而救济途径完全不同。" },
            { who: "甲", en: "Remedies?", cn: "救济？" },
            { who: "乙", en: "Against the state you go to court. Against a platform you change platform or terms.", cn: "对国家你去法院。对平台你换平台或换条款。" },
            { who: "甲", en: "So the word we want is something like deplatforming, and then we can argue about whether it's right.", cn: "那我们要的词大概是「去平台化」，然后才能争它对不对。" },
            { who: "乙", en: "Exactly. Naming it correctly is half of arguing about it.", cn: "正是。把它叫对，争论就成了一半。" }
          ]
        },
        {
          variant: "情绪型（文化身份与归属）",
          relation: "两位朋友（「你到底是哪里人」）",
          register: "半正式（情绪化）",
          channel: "面对面",
          barrier: "被反复追问出身，惊讶比敌意更难应对",
          result: "达成（把提问换成两个都答得上的问题）",
          lines: [
            { who: "甲", en: "I've been here six years and I still get asked where I'm really from.", cn: "我在这儿六年了，还是有人问我到底是哪里人。" },
            { who: "乙", en: "What do you answer?", cn: "你怎么答？" },
            { who: "甲", en: "I used to explain. Now I say here, and watch their face.", cn: "以前我会解释。现在我说「这儿」，然后看他们的表情。" },
            { who: "乙", en: "That face is the whole problem.", cn: "那个表情就是全部问题。" },
            { who: "甲", en: "It isn't hostility. It's surprise, which is worse in a way.", cn: "不是敌意。是惊讶，某种意义上更糟。" },
            { who: "乙", en: "What would you want them to ask instead?", cn: "你希望他们问什么？" },
            { who: "甲", en: "How long have you been here, and do you like it. Both are answerable.", cn: "「你在这儿多久了」「你喜欢这儿吗」。这两个都答得上来。" },
            { who: "乙", en: "I'll use those. That's a small thing I can actually do.", cn: "我以后就这么问。这是我能做到的一件小事。" }
          ]
        },
        {
          variant: "渠道变体（社交媒体上的文化争论）",
          relation: "两位朋友（博物馆标签的争论）",
          register: "半正式",
          channel: "社交媒体 + 面对面",
          barrier: "四千条回复的对立，没人提出折中方案",
          result: "达成（两个视角都写并附日期，看清帖子的分裂效应）",
          lines: [
            { who: "甲", en: "The thread about the museum's labels has four thousand replies.", cn: "博物馆标签那个帖子有四千条回复。" },
            { who: "乙", en: "What's the argument?", cn: "争什么？" },
            { who: "甲", en: "Whether to describe objects by the culture that made them or by the culture that collected them.", cn: "是该按制作它们的文化来描述，还是按收藏它们的文化。" },
            { who: "乙", en: "Both, with the dates. Collected in 1897 is itself information.", cn: "两个都写，加上日期。「1897 年入藏」本身就是信息。" },
            { who: "甲", en: "That's the compromise nobody in the thread has suggested.", cn: "这个折中帖子里没人提过。" },
            { who: "乙", en: "Compromises don't get four thousand replies. That's why threads look more divided than people are.", cn: "折中不会有四千条回复。所以帖子看起来比人本身更分裂。" }
          ]
        },
        {
          variant: "高正式语域",
          relation: "委员会主席 · 委员（文化政策与藏品来源）",
          register: "正式",
          channel: "正式会议",
          barrier: "无（但要把编目条件写进拨款并解决小馆负担）",
          result: "达成（拨款内含编目经费，条件写入修正案）",
          lines: [
            { who: "主席", en: "The committee will consider funding for regional museums.", cn: "委员会将审议地区博物馆的经费。" },
            { who: "委员", en: "I support the funding, and I should like to attach a condition about catalogues.", cn: "我支持这笔经费，并希望附加一项关于藏品目录的条件。" },
            { who: "主席", en: "What condition?", cn: "什么条件？" },
            { who: "委员", en: "That provenance and acquisition dates be published online within three years, as a condition of the grant rather than a request.", cn: "作为拨款条件而不是请求：三年内在线公布来源与入藏日期。" },
            { who: "委员乙", en: "That is a large administrative burden for small museums.", cn: "对小博物馆来说这是很大的行政负担。" },
            { who: "委员", en: "Then fund the cataloguing as part of the grant, which is cheaper than the dispute that follows without it.", cn: "那就把编目经费纳入拨款，这比没有它之后的争议更便宜。" },
            { who: "主席", en: "That is a better amendment than the original motion.", cn: "这个修正比原动议更好。" }
          ]
        },
        {
          variant: "低正式语域",
          relation: "两位朋友（热门剧集）",
          register: "随意（极简、俚语）",
          channel: "即时消息",
          barrier: "无",
          result: "达成",
          lines: [
            { who: "甲", en: "did you watch it", cn: "你看了吗" },
            { who: "乙", en: "no", cn: "没有" },
            { who: "甲", en: "it's everywhere", cn: "到处都在说" },
            { who: "乙", en: "that's why i didn't", cn: "所以我才没看" },
            { who: "甲", en: "fair", cn: "有道理" },
            { who: "乙", en: "i'll watch it next month", cn: "我下个月看" },
            { who: "甲", en: "no you won't", cn: "你不会的" },
            { who: "乙", en: "probably not", cn: "大概不会" },
            { who: "甲", en: "nobody does", cn: "没人会" },
            { who: "乙", en: "and yet everyone has an opinion", cn: "可人人都有看法" }
          ]
        }
      ]
    }
  ];

  window.CHAT_PRAC_SCENARIOS = {
    domains: DOMAINS,
    scenarios: SCENARIOS
  };
})();
