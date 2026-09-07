// ===== All portfolio content for Zhihui Zhang's 3D Office =====
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
  pin: { x: number; y: number }; // normalized position on the wall map
}

export const EDUCATION: EduItem[] = [
  {
    flag: "🇪🇸",
    school: "Universidad de Salamanca",
    schoolZh: "萨拉曼卡大学",
    degree: "B.A.",
    degreeZh: "文学学士",
    year: "2014",
    place: "Salamanca, Spain",
    placeZh: "西班牙 · 萨拉曼卡",
    pin: { x: 0.488, y: 0.285 },
  },
  {
    flag: "🇺🇸",
    school: "University of Southern California",
    schoolZh: "南加州大学",
    degree: "M.A.",
    degreeZh: "文学硕士",
    year: "2018",
    place: "Los Angeles, USA",
    placeZh: "美国 · 洛杉矶",
    pin: { x: 0.106, y: 0.3 },
  },
  {
    flag: "🇭🇰",
    school: "The Chinese University of Hong Kong",
    schoolZh: "香港中文大学",
    degree: "PhD Candidate",
    degreeZh: "博士在读",
    year: "2024 —",
    place: "Hong Kong, China",
    placeZh: "中国 · 香港",
    pin: { x: 0.799, y: 0.372 },
  },
];

export interface Paper {
  title: string;
  venue: string;
  tag: string; // research branch
  award?: string;
  doi?: string;
  underReview?: boolean;
  cover?: string;  // journal cover thumbnail on the blackboard
  poster?: string; // matching research poster shown on the blackboard
}

export const BRANCHES = [
  "Vocabulary",
  "Writing",
  "Assessment & Motivation",
  "Curriculum Design",
  "Review",
] as const;

export const PAPERS: Paper[] = [
  {
    title:
      "The impact of chatbots based on large language models on second language vocabulary acquisition",
    venue: "Heliyon",
    tag: "Vocabulary",
    award: "AERA 2024 · Division C Award",
    doi: "https://doi.org/10.1016/j.heliyon.2024.e25370",
    cover: "/papers/paper1.jpg",
    poster: "/posters/research1.png",
  },
  {
    title: "How L2 Learners Negotiate Meaning in GenAI-Supported Creative Writing",
    venue: "International Journal of Applied Linguistics",
    tag: "Writing",
    doi: "https://doi.org/10.1111/ijal.70256",
    cover: "/papers/paper2.jpg",
    poster: "/posters/research4.png",
  },
  {
    title:
      "The role of generative AI and hybrid feedback in improving L2 writing skills: A comparative study",
    venue: "Innovation in Language Learning and Teaching",
    tag: "Writing",
    award: "BERA 2025",
    doi: "https://doi.org/10.1080/17501229.2025.2503890",
    cover: "/papers/paper3.jpg",
    poster: "/posters/research2.png",
  },
  {
    title: "EFL learners' motivation in a gamified formative assessment: The case of Quizizz",
    venue: "Education and Information Technologies",
    tag: "Assessment & Motivation",
    doi: "https://doi.org/10.1007/s10639-023-12034-7",
    cover: "/papers/paper4.jpg",
    poster: "/posters/research3.png",
  },
  {
    title: "Exploring the impact of the adaptive gamified assessment on learners in blended learning",
    venue: "Education and Information Technologies, 29:21869–21889",
    tag: "Assessment & Motivation",
    doi: "https://doi.org/10.1007/s10639-024-12708-w",
    cover: "/papers/paper5.jpg",
    poster: "/posters/research6.png",
  },
  {
    title:
      "How Do Language and Science Students Respond to Emotional Designs in AI-Based Chatbot Feedback from a Self-Determination Theory",
    venue: "Under Review",
    tag: "Assessment & Motivation",
    underReview: true,
  },
  {
    title:
      "Comparing the Impact of Synchronous and Asynchronous Generative AI-Assisted Learning in K-12 Education",
    venue: "Under Review",
    tag: "Curriculum Design",
    underReview: true,
  },
  {
    title:
      "How Does Learner Prior Language Knowledge Play in GenAI-Assisted Project-Based Learning for Creative Thinking?",
    venue: "Technology, Knowledge and Learning, 1–31",
    tag: "Curriculum Design",
    doi: "https://doi.org/10.1007/s10758-026-09984-5",
    cover: "/papers/paper6.jpg",
    poster: "/posters/research5.png",
  },
  {
    title:
      "Does Generative Artificial Intelligence (GenAI) Boost Language Skills? Evidence from a Meta-analysis",
    venue: "Under Review",
    tag: "Review",
    underReview: true,
  },
];

export interface Project {
  id: string;
  num: string;
  title: string;
  desc: string;
  media: string[]; // gif / png paths
  awards: string[];
  link?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "ai-journey",
    num: "01",
    title: "AI Journey: A Gamified AI Learning Adventure",
    desc: "A gamified adventure that guides students through core AI knowledge — with a special focus on AI ethics — helping them recognize the limitations and pitfalls of AI and build critical AI literacy.",
    media: ["/projects/project_new.gif"],
    awards: ["📜 Software Invention Patent No. 2026SR0577734"],
  },
  {
    id: "postcard",
    num: "02",
    title: "GenAI-Powered Postcard Dialogue System",
    desc: "A GenAI-powered postcard dialogue system grounded in Self-Determination Theory, providing personalized language-learning feedback to enhance intrinsic motivation.",
    media: ["/projects/project1.gif"],
    awards: ["📜 Software Invention Patent No. 2025R11L2331073"],
    link: "https://picecho.top",
  },
  {
    id: "vocab-test",
    num: "03",
    title: "Gamified Vocabulary Testing System",
    desc: "A gamified vocabulary testing system based on cognitive theory, dynamically adapting to learners' levels for efficient and engaging assessment.",
    media: ["/projects/project2.gif"],
    awards: [
      "📜 Patent Invention No. 2022120701917470",
      "🏆 Baidu AI Vibe Coding Best Communication Award | 2025",
    ],
    link: "https://www.miaoda.cn/apps/app-6nwcjdhgv20x?s=s",
  },
  {
    id: "ielts",
    num: "04",
    title: "AI-Powered IELTS Writing Evaluation & Learning Planner",
    desc: "AI-delivered criterion-based IELTS writing feedback with actionable revisions, real-time Q&A aligned with feedback, side-by-side editing, and personalized writing summaries and study plans.",
    media: ["/projects/project3.gif"],
    awards: [],
    link: "http://www.test-writing.top/",
  },
  {
    id: "autoworksheet",
    num: "05",
    title: "AutoWorksheet: Gamified Printables in One Click",
    desc: "Upload any audio/text, instantly generate bingo, board-game or flash-card worksheets — gamified prep in one click.",
    media: ["/projects/project4.gif"],
    awards: ["🏆 RedBook AI Vibe Coding Best Developer Award | 2025"],
  },
  {
    id: "booktail",
    num: "06",
    title: "BookTail – AI Pet Reading Companion",
    desc: "An AI pet that grows and unlocks features as elementary students read better — turning reading progress into pet care fun.",
    media: ["/projects/project5.gif"],
    awards: ["🏆 TAL AI Vibe Coding Best Creativity Award | 2025"],
  },
  {
    id: "3d-word",
    num: "07",
    title: "3D Word Memorization Display Product",
    desc: "A 3D word memorization display product that enhances memory retention through spatial association and visualization.",
    media: ["/projects/project6_1.png", "/projects/project6_2.png"],
    awards: [
      "📜 Patent Invention No. 202111409594.8",
      "🏆 NYBPC: 2nd Place NY District & Best Female Entrepreneurship Award | 2020",
      "🏆 Pride Pitch Canada Finals: 1st Place | 2020",
    ],
  },
];

export const KEYWORDS: { text: string; branch: string; color: string }[] = [
  { text: "Generative AI", branch: "all", color: "#ffe45e" },
  { text: "L2 Vocabulary", branch: "Vocabulary", color: "#ff9de2" },
  { text: "Creative Writing", branch: "Writing", color: "#9df2ff" },
  { text: "Gamified Assessment", branch: "Assessment & Motivation", color: "#b6ff9d" },
  { text: "Learner Motivation", branch: "Assessment & Motivation", color: "#ffc59d" },
  { text: "Curriculum Design", branch: "Curriculum Design", color: "#d8b4fe" },
];

export const POSTERS = [
  "/posters/research1.png",
  "/posters/research2.png",
  "/posters/research3.png",
  "/posters/research4.png",
  "/posters/research5.png",
  "/posters/research6.png",
];

/** Published papers shown on the blackboard (under-review work stays hidden) */
export const PUBLISHED = PAPERS.filter((p) => !p.underReview && p.cover && p.poster);

/** Phone GIFs played on the desk phone when zoomed in */
export const PHONE_GIFS = ["/phone/phone1.gif", "/phone/phone2.gif", "/phone/phone3.gif"];

export interface PhotoItem {
  src: string;
  story: L; // short bilingual caption shown when the photo is zoomed in
}

/** 15 wall photos — order matches the photo files; stories told by the owner */
export const PHOTOS: PhotoItem[] = [
  { src: "/photos/photo1.jpg",  story: l("The cathedral of Salamanca, Spain — where my journey began.", "西班牙萨拉曼卡的教堂——我旅程开始的地方。") },
  { src: "/photos/photo2.jpg",  story: l("Undergrad graduation trip — Chongqing memories.", "本科毕业旅行——重庆的记忆。") },
  { src: "/photos/photo3.jpg",  story: l("Conference days in Los Angeles.", "在洛杉矶开会的日子。") },
  { src: "/photos/photo4.jpg",  story: l("Biking along the waterfront in Vancouver.", "在温哥华的海边骑行。") },
  { src: "/photos/photo5.jpg",  story: l("Ski trip to Altay, Xinjiang — sunset over the snowland.", "新疆阿勒泰滑雪之旅——雪原上的落日。") },
  { src: "/photos/photo6.jpg",  story: l("Ben the labrador, living his best life.", "大奔的日常——一只幸福的拉布拉多。") },
  { src: "/photos/photo7.jpg",  story: l("Aquarium day with my little one.", "和宝宝在海洋馆的一天。") },
  { src: "/photos/photo8.jpg",  story: l("Presenting my poster at AERA 2024.", "在 AERA 2024 展示我的研究海报。") },
  { src: "/photos/photo9.jpg",  story: l("Hacking away at an AI hackathon.", "参加 AI 黑客松比赛。") },
  { src: "/photos/photo10.jpg", story: l("Conference trip to Austria — lakes and mountains.", "在奥地利开会——湖光山色。") },
  { src: "/photos/photo11.jpg", story: l("Our wedding day. 💍", "我们的结婚照。💍") },
  { src: "/photos/photo12.jpg", story: l("Back in my hometown — the swans had babies!", "在家乡——天鹅生宝宝啦！") },
  { src: "/photos/photo13.jpg", story: l("Celebrating my 30th birthday. 🎂", "我的 30 岁生日。🎂") },
  { src: "/photos/photo14.jpg", story: l("Everyday moments with the baby.", "宝宝的日常。") },
  { src: "/photos/photo15.jpg", story: l("Master's graduation — officially a Trojan! ✌️", "研究生毕业照——正式毕业啦！✌️") },
];

/**
 * Wall layout pattern per row: L = landscape slot, P = portrait slot.
 * Photos keep their data order (story ↑ stays in sync); landscape photos
 * fill L slots in order, portrait photos fill P slots in order.
 */
export const PHOTO_WALL_PATTERN = ["LPLPL", "LPPLL", "PLLLL"];

/** width/height aspect of each photo (kept native — frames never distort) */
export const PHOTO_ASPECTS = [
  1.5, 1.431, 1.333, 1.333, 1.5, 1.334, 1.333, 1.333, 1.503, 1.333,
  0.667, 0.748, 0.667, 0.75, 0.75,
];

/** width/height aspect of each paper first-page cover (from the source PDFs) */
export const COVER_ASPECTS = [0.733, 0.766, 0.702, 0.659, 0.659, 0.659];

export const CONTACT = {
  phone: "+856 60905092",
  email: "zhihuiz@link.cuhk.edu.hk",
  linkedin: "https://linkedin.com/in/zhihui-zhang-077824183",
  scholar: "https://scholar.google.com/citations?user=UZLg1a4AAAAJ&hl=zh-CN",
  github: "https://github.com/sirazhang",
};

export const HONORS = [
  "🎓 Duolingo Research Grant · 2025",
  "🏅 Vice-Chancellor's Scholarship, CUHK · 2024",
  "🗣️ Mandarin · English · Spanish · French",
  "💻 SQL · Python · SPSS · Front-end (HTML/CSS/JS)",
];
