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
    }
  ];

  window.CHAT_PRAC_SCENARIOS = {
    domains: DOMAINS,
    scenarios: SCENARIOS
  };
})();
