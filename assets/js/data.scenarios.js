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
    }
  ];

  window.CHAT_PRAC_SCENARIOS = {
    domains: DOMAINS,
    scenarios: SCENARIOS
  };
})();
