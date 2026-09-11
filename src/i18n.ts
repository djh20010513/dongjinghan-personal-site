// ===== bilingual (En / 中) strings for the 3D office =====

export type Lang = "en" | "zh";

export interface L {
  en: string;
  zh: string;
}

export const l = (en: string, zh: string): L => ({ en, zh });

/** pick the current-language string */
export const t = (x: L, lang: Lang): string => x[lang];

export const STR = {
  loadingTitle: l("Loading Jinghan's 3D Office…", "正在加载静涵的 3D 办公室…"),
  loadingSub: l(
    "Brewing coffee, walking the dog 🐕, warming the projector 📽️",
    "煮咖啡、遛狗 🐕、预热灯光 💡"
  ),
  idleHint: l(
    "🖱️ Drag to orbit · Right-drag to pan · Double-click to focus · Click objects",
    "🖱️ 左键旋转 · 右键平移 · 双击定位 · 点击物品探索"
  ),
  back: l("← Back", "← 返回"),
  posterLabel: l("Paper Cover", "论文封面"),
  photoLabel: l("life beyond work", "工作之外的生活"),
  // note overlay
  noteTitle: l("Leave Me a Note", "给我留句话"),
  noteNamePh: l("Your name (optional)", "你的名字（可不填）"),
  noteMsgPh: l(
    "Write a message… say hi, share an idea, or just leave a footprint 👣",
    "写点什么吧……打个招呼、分享想法，或只是留个脚印 👣"
  ),
  noteSubmit: l("Pin it on my desk 📌", "钉在我的书桌旁 📌"),
  noteSaved: l("Pinned! 📌", "已钉上！📌"),
  noteLocal: l("Notes are stored locally in this browser.", "留言仅保存在此浏览器本地。"),
  // photo story
  storyHint: l("‹ › to browse the wall", "‹ › 翻页浏览整面照片墙"),
  // skills overlay
  skillTitle: l("My Skills", "能力标签"),
  // education overlay
  eduTitle: l("My Education", "我的学历"),
  eduSubtitle: l("Two chapters, both in Shanghai — click the bookshelf anytime", "两段求学时光，都在上海——随时点击书架查看"),
  // resume overlay
  resumeTitle: l("My Résumé", "我的简历"),
  resumeDownload: l("⬇ Download PDF", "⬇ 下载 PDF"),
  // contact card (phone)
  contactTitle: l("Contact Me", "联系我"),
  contactTagline: l("AI Product Manager · always happy to talk AI & products", "AI 产品经理 · 随时聊聊 AI 与产品"),
};

// ---------- about (手帐本) ----------
export const ABOUT = {
  title: l("Hi! I'm Jinghan", "嗨！我是静涵"),
  intro: l(
    "AI Product Manager focused on LLM applications and intelligent products. With a solid grasp of AI technology and a track record of shipping products, I'm familiar with Agent, RAG and other LLM application techniques, and I've contributed to AI product development at ByteDance, Xiaohongshu and Bilibili — turning AI capabilities into real business value.",
    "AI 产品经理，专注大模型应用与智能产品。具备 AI 技术理解与产品落地能力，熟悉 Agent、RAG 等大模型应用技术，参与字节跳动、小红书、哔哩哔哩 AI 产品建设，致力于将 AI 能力转化为真实业务价值。"
  ),
  factsTitle: l("Quick Facts · 小档案", "Quick Facts · 小档案"),
  facts: [
    l("💼 AI PM · ByteDance / Xiaohongshu / Bilibili", "💼 AI 产品经理 · 字节跳动 / 小红书 / 哔哩哔哩"),
    l("🎓 M.Eng., ECNU (AI + Water) · GPA 3.80/4.0", "🎓 华东师范大学硕士（AI+水利）· GPA 3.80/4.0"),
    l("📄 5 SCI papers", "📄 5 篇 SCI 论文"),
    l("📍 Shanghai 上海", "📍 上海 Shanghai"),
    l("✉️ djh1721695188@163.com", "✉️ djh1721695188@163.com"),
  ],
};

// ---------- awards (奖杯) ----------
export const AWARDS = {
  title: l("Awards & Honors", "荣誉与奖项"),
  items: [
    l("Shanghai Outstanding Graduate · 2024", "上海市优秀毕业生 · 2024"),
    l("ECNU Academic Excellence Scholarship · 2025", "华东师范大学优秀学业奖学金 · 2025"),
    l("First-Class Postgraduate Scholarship, ECNU · 2025", "华东师范大学研究生一等奖学金 · 2025"),
    l("Outstanding League Cadre, Shanghai Ocean University · 2023", "上海海洋大学优秀团干部 · 2023"),
    l("Outstanding Student, Shanghai Ocean University · 2022", "上海海洋大学优秀学生 · 2022"),
  ],
};

// ---------- bookshelf (书单) ----------
export interface Book {
  tag: string;          // category — must match a key of BOOK_TAG_COLORS in Panels.tsx
  title: L;
  author: string;
  note: L;              // one-line "why this book"
}

export const BOOKS = {
  title: l("My Bookshelf", "我的书单"),
  subtitle: l("Books that shaped how I think about products & AI", "塑造我产品与 AI 思考方式的书"),
  categories: ["Product", "AI & Tech", "Thinking"],
  items: [
    { tag: "Product", author: "Marty Cagan", title: l("Inspired", "启示录"), note: l("How great product teams really work.", "优秀产品团队真正的工作方式。") },
    { tag: "Product", author: "梁宁", title: l("Product Thinking 30 Lectures", "产品思维30讲"), note: l("Understanding users starts with understanding emotion.", "懂产品，先要懂情绪。") },
    { tag: "AI & Tech", author: "Stuart Russell & Peter Norvig", title: l("Artificial Intelligence: A Modern Approach", "人工智能：一种现代的方法"), note: l("The classic that frames how I think about agents.", "塑造我 Agent 思维的经典教科书。") },
    { tag: "AI & Tech", author: "Chip Huyen", title: l("AI Engineering", "AI 工程"), note: l("From model to product — the missing middle mile.", "从模型到产品之间最关键的一公里。") },
    { tag: "Thinking", author: "Daniel Kahneman", title: l("Thinking, Fast and Slow", "思考，快与慢"), note: l("Why users don't decide the way you think.", "用户的决策方式，和你想的不一样。") },
    { tag: "Thinking", author: "Peter Thiel", title: l("Zero to One", "从0到1"), note: l("My favorite question: what do you believe that few agree with?", "最喜欢的问题：在什么问题上你与多数人看法不同？") },
  ] as Book[],
};
