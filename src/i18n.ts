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
  loadingTitle: l("Loading Zhihui's 3D Office…", "正在加载淽卉的 3D 办公室…"),
  loadingSub: l(
    "Brewing coffee, waking up Ben 🐕, warming the projector 📽️",
    "煮咖啡、叫醒大奔 🐕、预热灯光 💡"
  ),
  idleHint: l(
    "🖱️ Drag to orbit · Right-drag to pan · Double-click to focus · Click objects",
    "🖱️ 左键旋转 · 右键平移 · 双击定位 · 点击物品探索"
  ),
  back: l("← Back", "← 返回"),
  posterLabel: l("Research Poster", "研究海报"),
  photoLabel: l("life beyond research", "科研之外的生活"),
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
};

// ---------- about (手帐本) ----------
export const ABOUT = {
  title: l("Hi! I'm Zhihui", "嗨！我是淽卉"),
  intro: l(
    "PhD candidate at CUHK's Dept. of Curriculum & Instruction. I study how generative AI sparks creativity & motivation in language learners — and turn ideas into little tools.",
    "香港中文大学课程与教学系在读博士生。我研究生成式 AI 如何点燃语言学习者的创造力与动机——并把灵感做成一个个小工具。"
  ),
  factsTitle: l("Quick Facts · 小档案", "Quick Facts · 小档案"),
  facts: [
    l("🎓 PhD Candidate, Curriculum & Instruction, CUHK (2024–)", "🎓 香港中文大学 课程与教学系 博士生 (2024–)"),
    l("🔬 GenAI × language learning: creativity & motivation", "🔬 生成式 AI × 语言学习：创造力 & 动机"),
    l("🗣 中文 · English · Español · Français", "🗣 中文 · English · Español · Français"),
    l("📍 Hong Kong 香港", "📍 香港 Hong Kong"),
    l("✉️ zhihuiz@link.cuhk.edu.hk", "✉️ zhihuiz@link.cuhk.edu.hk"),
  ],
};

// ---------- awards (奖杯) ----------
export const AWARDS = {
  title: l("Awards & Honors", "荣誉与奖项"),
  items: [
    l("Duolingo Research Grant · 2025", "Duolingo 研究基金 · 2025"),
    l("CUHK Vice-Chancellor's Scholarship · 2024", "香港中文大学校长奖学金 · 2024"),
    l("CUHK Postgraduate Research Output Award · 2025", "港中文研究生研究成果奖 · 2025"),
    l("AERA 2024 Poster Award (Finalist) · Division C", "AERA 2024 海报奖（入围）· Division C"),
    l("Baidu AI Vibe Coding Best Communication Award · 2025", "百度 AI Vibe Coding 最佳传播奖 · 2025"),
    l("RedBook AI Vibe Coding Best Developer Award · 2025", "小红书 AI Vibe Coding 最佳开发者奖 · 2025"),
    l("TAL AI Vibe Coding Best Creativity Award · 2025", "好未来 AI Vibe Coding 最佳创意奖 · 2025"),
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
  subtitle: l("Books that shaped how I research, teach & parent", "塑造我研究、教学与育儿方式的书"),
  categories: ["Research", "Parenting", "Fiction", "Family Reads"],
  items: [
    { tag: "Research", author: "Wayne C. Booth et al.", title: l("The Craft of Research", "研究是一门艺术"), note: l("The book I hand to every new researcher — how a question becomes an argument.", "送给每位研究新手的第一本书：问题如何变成论证。") },
    { tag: "Research", author: "Paul J. Silvia", title: l("How to Write a Lot", "文思泉涌"), note: l("Writing is a habit, not a mood. Saved my PhD life.", "写作是习惯不是灵感——拯救了我的博士生活。") },
    { tag: "Parenting", author: "Daniel J. Siegel & Tina Payne Bryson", title: l("The Whole-Brain Child", "全脑教养法"), note: l("Name it to tame it — works on toddlers and on PhD stress.", "说出情绪才能驯服情绪——对娃和读博焦虑都管用。") },
    { tag: "Parenting", author: "Becky Kennedy", title: l("Good Inside", "看见孩子"), note: l("Two things are true: my kid is good inside, and so am I.", "两条同时成立：孩子内心是好的，我也是。") },
    { tag: "Fiction", author: "Tara Westover", title: l("Educated", "你当像鸟飞往你的山"), note: l("On education as self-invention — read it twice.", "教育是自我发明——读了两遍。") },
    { tag: "Fiction", author: "Antoine de Saint-Exupéry", title: l("The Little Prince", "小王子"), note: l("What is essential is invisible to the eye.", "真正重要的东西，眼睛是看不见的。") },
    { tag: "Family Reads", author: "Eric Carle", title: l("The Very Hungry Caterpillar", "好饿的毛毛虫"), note: l("Baby's first English book — our bedtime staple.", "宝宝的第一本英文书——睡前保留节目。") },
    { tag: "Family Reads", author: "Sam McBratney", title: l("Guess How Much I Love You", "猜猜我有多爱你"), note: l("I love you to the moon — and back.", "我爱你，一直到月亮那里——再绕回来。") },
  ] as Book[],
};
