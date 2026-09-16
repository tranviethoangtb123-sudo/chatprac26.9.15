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
    }
  ];

  window.CHAT_PRAC_SCENARIOS = {
    domains: DOMAINS,
    scenarios: SCENARIOS
  };
})();
