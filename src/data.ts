// ===== All portfolio content for Jinghan Dong's 3D Office =====
import { l, type L } from "./i18n";

export interface EduItem {
  flag: string;
  school: string;
  schoolZh: string;
  degree: string;
  degreeZh: string;
  year: string;
  place: string;
  placeZh: string;
}

export const EDUCATION: EduItem[] = [
  {
    flag: "🇨🇳",
    school: "East China Normal University (985)",
    schoolZh: "华东师范大学（985 保研）",
    degree: "M.Eng. — Port, Coastal & Offshore Eng. (AI + Water)",
    degreeZh: "硕士 · 港口、海岸及近海工程（AI+水利）· GPA 3.80/4.0",
    year: "2024 —",
    place: "Shanghai, China",
    placeZh: "中国 · 上海",
  },
  {
    flag: "🇨🇳",
    school: "Shanghai Ocean University (Double First-Class)",
    schoolZh: "上海海洋大学（双一流）",
    degree: "B.Eng. — Environmental Eng. & Computer Science (double major)",
    degreeZh: "本科 · 环境工程 & 计算机科学与技术（双专业）· GPA 3.75/4.0",
    year: "2020 — 2024",
    place: "Shanghai, China",
    placeZh: "中国 · 上海",
  },
];

// ---------- 实习经历（电脑屏幕放映机） ----------
export interface InternshipItem {
  title: L;
  desc: L;
  metric: L; // quantified result, shown highlighted
}

export interface Internship {
  id: string;
  num: string;
  company: L;
  role: L;
  period: string;
  scene: L;      // e.g. TO B — 商家 AI 创意生产
  headline: L;   // the one-line business result
  background: L;
  items: InternshipItem[];
}

export const INTERNSHIPS: Internship[] = [
  {
    id: "bytedance",
    num: "01",
    company: l("ByteDance · Douyin Life Service", "字节跳动 · 抖音生活服务"),
    role: l("AI Product Manager", "AI 产品经理"),
    period: "2026.06 — 2026.09",
    scene: l("TO B — Merchant AI Creative Production", "TO B — 商家 AI 创意生产"),
    headline: l(
      "AI creative videos: GMV +12% vs. merchants' own videos, VV +16%",
      "AI 创意视频 GMV 较商家原生视频提升 12%，VV 提升 16%"
    ),
    background: l(
      "Merchant creative production relied on manual experience, with insufficient quality assets and viral know-how hard to reuse. I upgraded AI creation across three scenarios — asset optimization, viral replication and auto hosting — from content generation to reusable strategy, measurable quality and automatic execution.",
      "商家创意生产依赖人工经验，优质素材供给不足且爆款经验难规模复用；围绕素材优化、爆款复刻与自动托管三类场景，推动商家 AI 创作由内容生成向策略可复用、效果可评测、任务可自动执行升级。"
    ),
    items: [
      {
        title: l("Creative Strategy Distillation & Prompt Optimization", "创意策略蒸馏与 Prompt 优化"),
        desc: l(
          "Decomposed creative elements (theme, marketing expression) from top-performing videos with LLMs, refined prompts against posterior performance, and distilled them into reusable creative tags and strategy Skills.",
          "基于大盘高表现视频，通过大模型拆解主题及营销表达等创意要素，结合后验效果精筛并迭代 Prompt，沉淀为创意标签及策略 Skill。"
        ),
        metric: l("Strategy usability +21% · manual production efficiency +35%", "策略可用率提升 21% · 人工策略生产效率提升 35%"),
      },
      {
        title: l("Video Generation & Quality Evaluation", "视频生成与质量评测"),
        desc: l(
          "Located key issues in prompts, input assets and model generation from historical videos and bad cases; continuously tuned the generation pipeline and built quality evaluation standards.",
          "基于历史成片与 Bad Case 定位 Prompt、输入素材及模型生成等关键问题，持续调优生成链路并建立质量评测标准，驱动生成策略迭代。"
        ),
        metric: l("Usable video rate +25%", "成片可用率提升 25%"),
      },
      {
        title: l("Intelligent Creation Agent", "智能创作 Agent"),
        desc: l(
          "Built three creation pipelines (asset optimization, viral replication, auto hosting) with a Main Agent orchestrating sub-Agents / Skills / Tools, and a Harness managing tool calls, task states and result verification.",
          "搭建素材优化、爆款复刻及自动托管三类创作链路，由 Main Agent 统一调度子 Agent / Skill / Tool，并通过 Harness 管理 Tool 调用、任务状态及结果校验。"
        ),
        metric: l("Production efficiency +50% · task anomaly rate −12%", "视频生产效率提升 50% · 任务异常率降低 12%"),
      },
    ],
  },
  {
    id: "xhs",
    num: "02",
    company: l("Xiaohongshu (RED) · Diandian App", "小红书 · 点点 App"),
    role: l("Agent Product Manager", "Agent 产品经理"),
    period: "2026.03 — 2026.06",
    scene: l("TO C — AI Shopping Buddy for Fashion & Goods", "TO C — AI 好物买手"),
    headline: l("Seeding-to-purchase conversion +15%", "种草转化率提升 15%"),
    background: l(
      "Users faced vague need expression, underused personalization and long decision chains. I upgraded the Agent from generic Q&A to a personalized shopping assistant that understands users, picks better products and guides decisions.",
      "用户购物决策存在需求表达模糊、个性化信息利用不足及决策链路长等问题；围绕需求理解、商品推荐与决策引导，推动 Agent 由通用问答向更懂用户、更会选品、更能辅助决策的个性化购物助手升级。"
    ),
    items: [
      {
        title: l("Personalized Signal Consumption Strategy", "个性化信号消费策略"),
        desc: l(
          "Fused user profile, recent interests, historical behavior and session context; consolidated stable preferences via Memory with signal prioritization and conflict-resolution, applied to need understanding, clarification and search recommendation.",
          "融合用户画像、近期兴趣、历史行为及会话上下文，通过 Memory 沉淀稳定偏好并建立信号优先级与冲突更新机制，作用于需求理解、澄清与搜索推荐。"
        ),
        metric: l("Recommendation match +40%", "推荐匹配效果提升 40%"),
      },
      {
        title: l("High-Conversion Shopping-Guide Strategy Distillation", "高转化导购策略蒸馏"),
        desc: l(
          "Mined top-agent historical dialogs, extracted high-conversion scripts and decision strategies (comparison guidance, scenario recommendation), and distilled them into reusable guide Skills.",
          "分析金牌客服历史对话，提炼对比引导、场景推荐等高转化话术与决策策略，沉淀为可复用的导购 Skill，提升消费决策引导能力。"
        ),
        metric: l("Guide Skill effective hit rate 76%", "导购 Skill 有效命中率达 76%"),
      },
      {
        title: l("AI-Powered Product Selection", "AI 智能选品"),
        desc: l(
          "Built a Main Agent + Search Agent pipeline: RAG over products, UGC and guide strategies based on user context for recall, filtering and ranking; Harness unified session context, Memory I/O and tool calls.",
          "搭建 Main Agent + Search Agent 协同链路，基于用户 Context 通过 RAG 调用商品、UGC 及导购策略信息完成召回与筛选排序，并通过 Harness 统一管理会话上下文、Memory 读写与 Tool 调用。"
        ),
        metric: l("Task completion 90% · solution adoption +18%", "任务完成率达 90% · 方案采纳率提升 18%"),
      },
    ],
  },
  {
    id: "bilibili",
    num: "03",
    company: l("Bilibili · Triple-Click Promotion", "哔哩哔哩 · 三连推广"),
    role: l("AI Product Manager", "AI 产品经理"),
    period: "2026.01 — 2026.03",
    scene: l("TO B — AI Ad Creative Generation", "TO B — AI 广告素材创作"),
    headline: l("AI-generated assets took 45% of total consumption", "AI 衍生素材消耗占比达 45%"),
    background: l(
      "Facing asset shortage, high manual production cost and lagging optimization, I upgraded asset production toward automatic generation, measurable quality and continuous optimization.",
      "面向素材不足、人工生产成本高及优化滞后问题，推动素材生产向自动生成、质量可评、持续优化升级。"
    ),
    items: [
      {
        title: l("Multimodal AIGC Asset Generation", "多模态 AIGC 素材生成"),
        desc: l(
          "Identified product selling points and marketing scenarios from uploaded images with multimodal models, generated titles and covers based on historical top assets, and selected winners via a five-level quality evaluation system.",
          "基于上传图片通过多模态模型识别商品卖点与营销场景，结合历史优质素材生成标题与封面，并通过五级质量评估体系完成优选。"
        ),
        metric: l("AI cover CTR +24% vs. non-AI covers", "AI 封面 CTR 较非 AI 封面提升 24%"),
      },
      {
        title: l("Multi-Agent Autonomous Asset Optimization", "多 Agent 素材自主优化"),
        desc: l(
          "Built a Monitor + Judge + Generator agent pipeline: spotted low-efficiency assets by CTR and ROI, recalled similar cases from a 6M+ case library via keyword matching and vector retrieval, generated optimization strategies and auto-triggered AIGC regeneration.",
          "搭建监控 Agent、裁判 Agent、生成 Agent 协同链路；基于 CTR 和 ROI 识别低效素材，通过关键词匹配与向量检索从 600 万+历史案例库召回相似低效案例并生成优化策略，自动触发 AIGC 重生成。"
        ),
        metric: l("New-asset guaranteed delivery ratio +72%", "新素材保底跑量比例提升 72%"),
      },
    ],
  },
];

// ---------- 能力标签（黑板便签） ----------
export interface Skill {
  id: string;      // sticky branch id
  name: L;
  tagline: L;
  detail: L;
  chips: string[]; // tool / tech keywords
}

export const SKILLS: Skill[] = [
  {
    id: "business",
    name: l("Business Insight", "业务洞察能力"),
    tagline: l("From pain points to shipped products (0→1)", "从业务痛点到产品 0→1 落地"),
    detail: l(
      "I identify core problems from user behavior and business data, abstract pain points — inefficient creative production, long consumption decision chains — into product solutions, and drive them 0→1. Core projects delivered GMV +12%.",
      "能够从用户行为与业务数据中识别核心问题，将创意生产低效、消费决策链路长等业务痛点抽象为产品方案，推动产品 0→1 完成落地；核心项目实现 GMV 提升 12%。"
    ),
    chips: ["用户行为分析", "业务数据洞察", "产品 0→1", "GMV +12%"],
  },
  {
    id: "vibe",
    name: l("Vibe Coding", "Vibe Coding 能力"),
    tagline: l("AI demos & interactive prototypes, fast", "快速搭建 AI Demo 与交互原型"),
    detail: l(
      "Fluent with Claude Code, Qoder CN, WorkBuddy, Coze and Figma to build AI demos and interactive prototypes — this very 3D office was built with WorkBuddy.",
      "熟练使用 Claude Code、Qoder CN、WorkBuddy、Coze、Figma 搭建 AI Demo 与交互原型——你正在看的这个 3D 办公室就是用 WorkBuddy 搭的。"
    ),
    chips: ["Claude Code", "Codex", "Qoder CN", "WorkBuddy", "Coze", "Figma"],
  },
  {
    id: "tech",
    name: l("AI Tech Understanding", "AI 技术理解能力"),
    tagline: l("Agent · RAG · Memory · Harness", "Agent · RAG · Memory · Harness"),
    detail: l(
      "Familiar with Agent, RAG, Memory and Harness architectures; understand context management and tool-calling mechanisms. With 5 SCI papers published, I know where model capability boundaries lie and collaborate efficiently with algorithm & engineering teams.",
      "熟悉 Agent、RAG、Memory、Harness 等 AI 技术体系，理解上下文管理与 Tool 调用机制；已发表 5 篇 SCI 论文，能够理解模型能力边界并与算法、研发高效协同。"
    ),
    chips: ["Agent", "RAG", "Memory", "Harness", "SCI × 5"],
  },
];

// ---------- 左墙：技能标签墙（3 大模块便签） ----------
export interface SkillWallModule {
  id: string;       // matches Skill.id → opens that skill card
  title: L;
  color: string;    // module title sticky color
  tags: { text: string; color: string }[];
}

export const SKILL_WALL: SkillWallModule[] = [
  {
    id: "business",
    title: l("Business Insight", "业务洞察能力"),
    color: "#ffe45e",
    tags: [
      { text: "用户行为分析", color: "#fff3bf" },
      { text: "业务数据洞察", color: "#fff9db" },
      { text: "痛点抽象", color: "#ffe8cc" },
      { text: "产品 0→1", color: "#fff3bf" },
      { text: "GMV +12%", color: "#ffe066" },
      { text: "决策链路优化", color: "#fff9db" },
    ],
  },
  {
    id: "vibe",
    title: l("Vibe Coding", "Vibe Coding 能力"),
    color: "#9df2ff",
    tags: [
      { text: "Claude Code", color: "#d0ebff" },
      { text: "Codex", color: "#e7f5ff" },
      { text: "Qoder CN", color: "#d0ebff" },
      { text: "WorkBuddy", color: "#e7f5ff" },
      { text: "Coze", color: "#d0ebff" },
      { text: "Figma", color: "#e7f5ff" },
    ],
  },
  {
    id: "tech",
    title: l("AI Tech Understanding", "AI 技术理解能力"),
    color: "#b6ff9d",
    tags: [
      { text: "Agent", color: "#d3f9d8" },
      { text: "RAG", color: "#e9fac8" },
      { text: "Memory", color: "#d3f9d8" },
      { text: "Harness", color: "#e9fac8" },
      { text: "上下文管理", color: "#d3f9d8" },
      { text: "Tool 调用 · SCI × 5", color: "#e9fac8" },
    ],
  },
];

// ---------- 左墙：Vibe Coding 作品展示 ----------
export const VIBE_WORK = {
  title: l("My Vibe Coding Work", "我的 Vibe Coding 作品"),
  name: l("Job Hunter Pro · 职途 AI", "职途 AI · 智能求职助手"),
  desc: l(
    "An all-in-one job-hunting workspace built with AI coding tools — aggregating openings, tracking applications, JD matching and resume polishing.",
    "用 AI 编程工具打造的一站式求职工作台——聚合职位、追踪投递、JD 匹配与简历优化。"
  ),
  tools: ["WorkBuddy", "Claude Code", "JavaScript", "Vercel"],
  cover: "/work/vibe1.jpg",
  link: "https://job-hunter-pro-1.vercel.app/",
};

// ---------- 论文（黑板 + 投影仪） ----------
export interface Paper {
  title: string;
  venue: string;
  tag: string; // research branch
  award?: string;
  doi?: string;
  underReview?: boolean;
  cover?: string;  // journal cover thumbnail on the blackboard
  poster?: string; // matching research poster shown on the blackboard
  pages?: string[]; // every page rendered as an image — the scroll reader falls back to [poster] when absent
}

export const BRANCHES = [
  "Hydrology & Runoff",
  "Water Quality",
  "Energy Finance",
  "XAI",
] as const;

export const PAPERS: Paper[] = [
  {
    title:
      "A Novel Runoff Prediction Model Based on Support Vector Machine and Gate Recurrent Unit with Secondary Mode Decomposition",
    venue: "Water Resources Management, 38:1655–1674 (2024)",
    tag: "Hydrology & Runoff",
    award: "第一作者 · First Author",
    doi: "https://doi.org/10.1007/s11269-024-03748-5",
    cover: "/papers/paper1.jpg",
    poster: "/papers/paper1.jpg",
  },
  {
    title:
      "A Water Quality Prediction Model Based on Signal Decomposition and Ensemble Deep Learning Techniques",
    venue: "Water Science & Technology (2023)",
    tag: "Water Quality",
    award: "第一作者 · First Author",
    doi: "https://doi.org/10.2166/wst.2023.357",
    cover: "/papers/paper2.jpg",
    poster: "/papers/paper2.jpg",
  },
  {
    title:
      "A Novel Hybrid Model Based on Deep Learning and Error Correction for Crude Oil Futures Prices Forecast",
    venue: "Resources Policy, 83:103602 (2023)",
    tag: "Energy Finance",
    doi: "https://doi.org/10.1016/j.resourpol.2023.103602",
    cover: "/papers/paper3.jpg",
    poster: "/papers/paper3.jpg",
  },
  {
    title:
      "Robust Runoff Prediction With Explainable Artificial Intelligence and Meteorological Variables From Deep Learning Ensemble Model",
    venue: "Water Resources Research (2023)",
    tag: "XAI",
    doi: "https://doi.org/10.1029/2023WR035676",
    cover: "/papers/paper4.jpg",
    poster: "/papers/paper4.jpg",
  },
  {
    title:
      "Multi-Step Ahead Dissolved Oxygen Concentration Prediction Based on Knowledge Guided Ensemble Learning and Explainable Artificial Intelligence",
    venue: "Journal of Hydrology, 636:131297 (2024)",
    tag: "Water Quality",
    doi: "https://doi.org/10.1016/j.jhydrol.2024.131297",
    cover: "/papers/paper5.jpg",
    poster: "/papers/paper5.jpg",
  },
];

export const POSTERS = [
  "/papers/paper1.jpg",
  "/papers/paper2.jpg",
  "/papers/paper3.jpg",
  "/papers/paper4.jpg",
  "/papers/paper5.jpg",
];

/** Published papers shown on the blackboard (under-review work stays hidden) */
export const PUBLISHED = PAPERS.filter((p) => !p.underReview && p.cover && p.poster);

// ---------- 照片墙 ----------
export interface PhotoItem {
  src: string;
  story: L; // short bilingual caption shown when the photo is zoomed in
}

export const PHOTOS: PhotoItem[] = [
  { src: "/photos/photo1.jpg",  story: l("Butterbeer at the Wizarding World — Gryffindor for a day! 🍺", "环球影城的黄油啤酒——格兰芬多一日体验！🍺") },
  { src: "/photos/photo2.jpg",  story: l("Lost in the music. 🎧", "沉浸在音乐里。🎧") },
  { src: "/photos/photo3.jpg",  story: l("One last read in the library — graduation season. 🎓", "毕业季，在图书馆再读一本书。🎓") },
  { src: "/photos/photo4.jpg",  story: l("Birthday dinner — flowers, candles & wishes. 🎂", "生日晚餐——鲜花、蜡烛和愿望。🎂") },
  { src: "/photos/photo5.jpg",  story: l("A portrait in blue. 💙", "蓝色系写真。💙") },
  { src: "/photos/photo6.jpg",  story: l("Golden light, golden mood. ✨", "金色的光，金色的心情。✨") },
  { src: "/photos/photo7.jpg",  story: l("Snowboarding day — pink turtle armor on! 🏂", "滑雪日——粉色小乌龟护具上线！🏂") },
  { src: "/photos/photo8.jpg",  story: l("Platform 9¾ — off to Hogwarts! 🪄", "九又四分之三站台——出发去霍格沃茨！🪄") },
  { src: "/photos/photo9.jpg",  story: l("The Bund at night — my city, Shanghai. 🌃", "外滩的夜景——我的城市，上海。🌃") },
  { src: "/photos/photo10.jpg", story: l("Night stroll along the Huangpu River. 🌉", "黄浦江边夜游。🌉") },
  { src: "/photos/photo11.jpg", story: l("Sea-view capsule train in Busan. 🚃", "釜山海边的胶囊小火车。🚃") },
  { src: "/photos/photo12.jpg", story: l("Jumping into the sunshine! ☀️", "跳进阳光里！☀️") },
  { src: "/photos/photo13.jpg", story: l("Golden hour on the lawn. 🌿", "草坪上的黄昏时光。🌿") },
];

/**
 * Wall layout pattern per row: L = landscape slot, P = portrait slot.
 * Photos keep their data order (story ↑ stays in sync); landscape photos
 * fill L slots in order, portrait photos fill P slots in order.
 */
export const PHOTO_WALL_PATTERN = ["PPLPP", "PPPPP", "LPP"];

/** width/height aspect of each photo (kept native — frames never distort) */
export const PHOTO_ASPECTS = [
  1.501, 0.749, 0.75, 0.75, 0.666, 0.666, 0.75, 0.666, 0.666, 0.666,
  1.333, 0.741, 0.75,
];

/** width/height aspect of each paper first-page cover (from the user's screenshots) */
export const COVER_ASPECTS = [0.66, 0.779, 0.75, 0.762, 0.75];

// ---------- 联系方式 ----------
export const CONTACT = {
  phone: "+86 13524038865",
  email: "djh1721695188@163.com",
  site: "https://dongjinghan.cn",
  github: "https://github.com/djh20010513",
};

// ---------- 荣誉速览（欢迎页） ----------
export const HONORS = [
  "🎓 ECNU Academic Excellence Scholarship · 华东师范大学优秀学业奖学金",
  "🎓 First-Class Postgraduate Scholarship · 研究生一等奖学金",
  "🏅 Shanghai Outstanding Graduate · 上海市优秀毕业生",
  "💼 ByteDance · Xiaohongshu · Bilibili — AI Product Manager",
  "📄 5 SCI papers · 5 篇 SCI 论文",
  "💻 Claude Code · WorkBuddy · Coze · Figma",
];
