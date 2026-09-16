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
    }
  ];

  window.CHAT_PRAC_SCENARIOS = {
    domains: DOMAINS,
    scenarios: SCENARIOS
  };
})();
