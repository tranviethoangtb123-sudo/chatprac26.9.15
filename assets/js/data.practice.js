/* ============================================================================
   对话练习场景 + 模拟回复库
   ----------------------------------------------------------------------------
   说明：当前界面上没有场景按钮（对话练习是空白起始），这份数据是**备用**的，
        接入 DeepSeek 之后可以用它给模型一句开场白，或者把场景按钮加回来。
   内容为 Chat Prac 原创编写。
   ============================================================================ */
window.CHAT_PRAC_DATA = window.CHAT_PRAC_DATA || {};

/* 场景：opener 是机器人开口说的第一句 */
window.CHAT_PRAC_DATA.scenarios = [
  { id: "greeting",   title: "日常寒暄",   tag: "日常", opener: "Hey! I'm your speaking partner. Tell me, how was your day?" },
  { id: "cafe",       title: "咖啡店点单", tag: "餐饮", opener: "Welcome in! What can I get for you today?" },
  { id: "restaurant", title: "餐厅点餐",   tag: "餐饮", opener: "Good evening. Are you ready to order, or would you like a few more minutes?" },
  { id: "airport",    title: "机场值机",   tag: "旅行", opener: "Good morning. May I see your passport and ticket, please?" },
  { id: "hotel",      title: "酒店入住",   tag: "住宿", opener: "Good evening, welcome to Riverside Hotel. Do you have a reservation?" },
  { id: "directions", title: "问路",       tag: "交通", opener: "You look a bit lost. Where are you trying to go?" },
  { id: "shopping",   title: "商店购物",   tag: "购物", opener: "Hi there. Let me know if you would like to try anything on." },
  { id: "doctor",     title: "看医生",     tag: "健康", opener: "Good morning. What brings you in today?" },
  { id: "interview",  title: "求职面试",   tag: "求职", opener: "Thanks for coming in today. Could you tell me a little about yourself?" },
  { id: "meeting",    title: "工作沟通",   tag: "工作", opener: "Morning. Do you have a minute to go over where we are with the project?" },
  { id: "bank",       title: "银行办事",   tag: "银行", opener: "Good afternoon. How can I help you today?" },
  { id: "weekend",    title: "聊周末计划", tag: "社交", opener: "The weekend is almost here. Any plans?" },
  { id: "free",       title: "自由闲聊",   tag: "社交", opener: "Let's just chat. What have you been up to lately?" }
];

/* 模拟回复：未接入模型时按顺序轮换使用（接入 DeepSeek 后不再使用） */
window.CHAT_PRAC_DATA.replies = {
  greeting: [
    { en: "Sounds good! What was the best part of it?", cn: "听起来不错！今天最好的一部分是什么？" },
    { en: "Nice. And what are you planning to do this evening?", cn: "不错。那你今晚打算做什么？" },
    { en: "That's interesting. Tell me more about it.", cn: "挺有意思的，再多说说。" }
  ],
  cafe: [
    { en: "Got it. Would you like that hot or iced?", cn: "好的。您要热的还是冰的？" },
    { en: "Sure. Anything to eat with that, a croissant maybe?", cn: "好的。要配点吃的吗，比如可颂？" },
    { en: "Perfect. That comes to five dollars. Cash or card?", cn: "好的，一共五美元。现金还是刷卡？" }
  ],
  restaurant: [
    { en: "Good choice. Would you like anything to drink with that?", cn: "选得不错。要配点喝的吗？" },
    { en: "How would you like that cooked?", cn: "您想要几分熟？" },
    { en: "I'll bring it out as soon as it's ready.", cn: "好了我马上给您端上来。" }
  ],
  airport: [
    { en: "Thank you. Are you checking any bags today?", cn: "谢谢。今天有行李要托运吗？" },
    { en: "Alright. Would you prefer a window or an aisle seat?", cn: "好的。您想要靠窗还是靠过道的座位？" },
    { en: "Your gate is 12, and boarding starts at 10:20. Have a good flight!", cn: "您的登机口是 12 号，10:20 开始登机。祝您旅途愉快！" }
  ],
  hotel: [
    { en: "Certainly. May I have your name and ID, please?", cn: "当然可以。请告诉我您的姓名，并出示证件。" },
    { en: "You're in room 508. Breakfast is served from seven to ten.", cn: "您住 508 房。早餐是七点到十点。" },
    { en: "Is there anything else I can help you with?", cn: "还有什么需要我帮忙的吗？" }
  ],
  directions: [
    { en: "No problem. It's about a ten minute walk from here.", cn: "没问题。从这里走过去大概十分钟。" },
    { en: "Go straight and turn left at the second traffic light.", cn: "一直走，到第二个红绿灯左转。" },
    { en: "You can also take the number five bus if you prefer.", cn: "如果你愿意，也可以坐五路公交。" }
  ],
  shopping: [
    { en: "Sure, the fitting rooms are just over there.", cn: "好的，试衣间就在那边。" },
    { en: "We have that in small, medium and large. What size are you?", cn: "这件有小号、中号和大号。您穿什么码？" },
    { en: "It looks great on you. Would you like to take it?", cn: "您穿这件很好看，要买吗？" }
  ],
  doctor: [
    { en: "I see. How long have you had these symptoms?", cn: "明白了。这些症状持续多久了？" },
    { en: "Any fever, or trouble sleeping?", cn: "有发烧或者睡不好吗？" },
    { en: "Let me write you a prescription. Get plenty of rest.", cn: "我给你开个药方。多休息。" }
  ],
  interview: [
    { en: "Thanks. What made you interested in this position?", cn: "谢谢。是什么让你对这个职位感兴趣？" },
    { en: "Could you give me an example of a project you're proud of?", cn: "能举一个你引以为豪的项目例子吗？" },
    { en: "Good. Where do you see yourself in three years?", cn: "很好。你觉得自己三年后会是什么样？" }
  ],
  meeting: [
    { en: "Got it. What's the biggest risk right now?", cn: "明白了。目前最大的风险是什么？" },
    { en: "Who else needs to be involved in this?", cn: "这件事还需要谁参与？" },
    { en: "Let's set a date for the next review, then.", cn: "那我们定一下下次评审的时间。" }
  ],
  bank: [
    { en: "Sure. Could I see your ID and proof of address?", cn: "好的。可以出示您的证件和住址证明吗？" },
    { en: "There's no monthly fee if you keep a small balance.", cn: "只要账户里有少量余额就不收月费。" },
    { en: "Your card will arrive by post in about a week.", cn: "您的卡大约一周后寄到。" }
  ],
  weekend: [
    { en: "That sounds fun. How long have you been doing that?", cn: "听起来很有意思。你做这件事多久了？" },
    { en: "Nice. Are you going with anyone?", cn: "不错。你和谁一起去吗？" },
    { en: "I might do the same. Any tips for a beginner?", cn: "我也许会试试。对新手有什么建议吗？" }
  ],
  free: [
    { en: "That sounds fun. How long have you been doing that?", cn: "听起来很有意思。你做这件事多久了？" },
    { en: "Interesting! And what do you like most about it?", cn: "有意思！你最喜欢它哪一点？" },
    { en: "I see. If you had a free weekend, what would you do?", cn: "明白了。如果有一个空闲的周末，你会做什么？" }
  ],
  generic: [
    { en: "I see. Could you tell me a bit more?", cn: "我明白了，能再多说一点吗？" },
    { en: "Nice one! Try answering with a longer sentence this time.", cn: "不错！这次试着用更长的一句话回答。" },
    { en: "Good. Let's keep going. What happened next?", cn: "很好，继续。后来发生了什么？" }
  ]
};
