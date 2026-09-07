import { useEffect, useMemo, useState } from "react";
import { CONTACT, HONORS, INTERNSHIPS, PHOTOS, POSTERS, SKILLS } from "../data";
import { ABOUT, AWARDS, STR, t, type Lang } from "../i18n";

// ============================================================
// Welcome intro (first visit)
// ============================================================
export function WelcomeOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet sheet-welcome" onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose} aria-label="close">×</button>
        <h1 className="welcome-title">Hi, I'm <span>Jinghan Dong 董静涵</span> 👋</h1>
        <p className="welcome-lead">
          AI Product Manager — interned at <strong>ByteDance, Xiaohongshu &amp; Bilibili</strong>,
          building Agent / AIGC products. Welcome to my office. Everything here tells a story:
        </p>
        <div className="welcome-grid">
          <div>💻 <b>Computer</b> — sit down &amp; browse my internships</div>
          <div>🏷️ <b>Sticky notes</b> — my skill tags</div>
          <div>🗺️ <b>World map</b> — my education journey</div>
          <div>📋 <b>Blackboard</b> — 5 SCI papers &amp; DOI stickers</div>
          <div>📄 <b>Desk frame</b> — my résumé</div>
          <div>📱 <b>Phone</b> — contact me</div>
          <div>🏆 <b>Trophies</b> — awards &amp; honors</div>
          <div>✏️ <b>Blank note</b> — leave me a message</div>
          <div>🐕 <b>Dog</b> — pat him!</div>
        </div>
        <div className="honor-list">
          {HONORS.map((h, i) => <div key={i}>{h}</div>)}
        </div>
        <div className="contact-row">
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.site} target="_blank" rel="noreferrer">dongjinghan.cn</a>
          <a href={CONTACT.github} target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <button className="enter-btn" onClick={onClose}>Come on in →</button>
      </div>
    </div>
  );
}

// ============================================================
// Skills view — opened from the sticky notes on the blackboard
// ============================================================
const SKILL_COLORS: Record<string, string> = {
  business: "#e8590c",  // 橘
  vibe: "#1f3a93",      // 藏青
  tech: "#0ca678",      // 青绿
};

export function SkillOverlay({ branch, lang, onClose }: { branch: string; lang: Lang; onClose: () => void }) {
  const [filter, setFilter] = useState(branch);
  useEffect(() => setFilter(branch), [branch]);
  const skill = useMemo(() => SKILLS.find((s) => s.id === filter) ?? SKILLS[0], [filter]);
  const color = SKILL_COLORS[skill.id] || "#868e96";
  return (
    <div className="sheet-backdrop reading" onClick={onClose}>
      <div className="sheet sheet-reading" onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose} aria-label="close">×</button>
        <h2 className="sheet-title reading-title">
          {t(STR.skillTitle, lang)}
          <img className="title-clip" src="/stickers/回形针.png" alt="" />
        </h2>
        <div className="chip-row">
          {SKILLS.map((s) => (
            <button
              key={s.id}
              className={`chip ${filter === s.id ? "chip-on" : ""}`}
              onClick={() => setFilter(s.id)}
            >
              {t(s.name, lang)}
            </button>
          ))}
        </div>
        <div className="skill-card" style={{ borderColor: color }}>
          <div className="skill-head" style={{ background: color }}>
            <span className="skill-name">{t(skill.name, lang)}</span>
            <span className="skill-tagline">{t(skill.tagline, lang)}</span>
          </div>
          <p className="skill-detail">{t(skill.detail, lang)}</p>
          <div className="skill-chips">
            {skill.chips.map((c) => (
              <span className="skill-chip" key={c} style={{ borderColor: color, color }}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Guest note — leave a message
// ============================================================
interface GuestNote { name: string; msg: string; ts: number }
const NOTES_KEY = "jinghan-office-notes";

export function NoteOverlay({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [saved, setSaved] = useState(false);
  const [notes, setNotes] = useState<GuestNote[]>(() => {
    try { return JSON.parse(localStorage.getItem(NOTES_KEY) || "[]"); } catch { return []; }
  });

  const submit = () => {
    if (!msg.trim()) return;
    const next = [{ name: name.trim() || "Anonymous", msg: msg.trim(), ts: Date.now() }, ...notes].slice(0, 30);
    setNotes(next);
    localStorage.setItem(NOTES_KEY, JSON.stringify(next));
    setName(""); setMsg(""); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet sheet-note" onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose} aria-label="close">×</button>
        <h2 className="sheet-title"><span className="accent-green">✏️</span> {t(STR.noteTitle, lang)}</h2>
        <input className="note-input" placeholder={t(STR.noteNamePh, lang)} value={name} onChange={(e) => setName(e.target.value)} maxLength={30} />
        <textarea className="note-textarea" placeholder={t(STR.noteMsgPh, lang)} value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={300} rows={3} />
        <button className="note-submit" onClick={submit}>{saved ? t(STR.noteSaved, lang) : t(STR.noteSubmit, lang)}</button>
        {notes.length > 0 && (
          <div className="note-list">
            {notes.slice(0, 5).map((n, i) => (
              <div className="note-card" key={i} style={{ transform: `rotate(${(i % 2 ? -1 : 1) * 1.2}deg)` }}>
                <div className="note-msg">“{n.msg}”</div>
                <div className="note-meta">— {n.name} · {new Date(n.ts).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
        <p className="panel-note">{t(STR.noteLocal, lang)}</p>
      </div>
    </div>
  );
}

// ============================================================
// Internship player — positioned over the 3D monitor screen
// ============================================================
const COMPANY_COLORS: Record<string, string> = {
  bytedance: "#325df0",
  xhs: "#ff2442",
  bilibili: "#00a1d6",
};

export function InternshipPlayer({
  idx, lang, onNav,
}: {
  idx: number;
  lang: Lang;
  onNav: (dir: number) => void;
}) {
  const it = INTERNSHIPS[idx];
  const accent = COMPANY_COLORS[it.id] || "#325df0";
  return (
    <div className="isn-card" key={it.id}>
      <div className="isn-scroll">
        <div className="isn-head">
          <span className="isn-logo" style={{ background: accent }}>{t(it.company, lang).slice(0, 1)}</span>
          <div className="isn-headtext">
            <div className="isn-company">{t(it.company, lang)}</div>
            <div className="isn-role">{t(it.role, lang)} · {it.period}</div>
          </div>
          <span className="isn-scene" style={{ borderColor: accent, color: accent }}>{t(it.scene, lang)}</span>
        </div>
        <div className="isn-headline" style={{ color: accent }}>{t(it.headline, lang)}</div>
        <div className="isn-bg">{t(it.background, lang)}</div>
        <div className="isn-items">
          {it.items.map((item, i) => (
            <div className="isn-item" key={i}>
              <div className="isn-item-title">
                <span className="isn-item-dot" style={{ background: accent }} />
                {t(item.title, lang)}
              </div>
              <div className="isn-item-desc">{t(item.desc, lang)}</div>
              <div className="isn-item-metric" style={{ color: accent }}>▲ {t(item.metric, lang)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="sp-bar">
        <button className="sp-btn" onClick={() => onNav(-1)}>‹</button>
        <span className="sp-title">{it.num} · {t(it.company, lang)}</span>
        <button className="sp-btn" onClick={() => onNav(1)}>›</button>
      </div>
    </div>
  );
}

// ============================================================
// Contact card — inside the fullscreen phone mockup
// ============================================================
export function ContactCard({ lang }: { lang: Lang }) {
  return (
    <div className="cc-card">
      <img className="cc-avatar" src="/photos/photo2.jpg" alt="Jinghan Dong" />
      <div className="cc-name">董静涵 · Jinghan Dong</div>
      <div className="cc-tagline">{t(STR.contactTagline, lang)}</div>
      <div className="cc-rows">
        <a className="cc-row" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>
          <span className="cc-ico">📞</span><span>{CONTACT.phone}</span>
        </a>
        <a className="cc-row" href={`mailto:${CONTACT.email}`}>
          <span className="cc-ico">✉️</span><span>{CONTACT.email}</span>
        </a>
        <a className="cc-row" href={CONTACT.site} target="_blank" rel="noreferrer">
          <span className="cc-ico">🌐</span><span>dongjinghan.cn</span>
        </a>
        <a className="cc-row" href={CONTACT.github} target="_blank" rel="noreferrer">
          <span className="cc-ico">🐙</span><span>github.com/djh20010513</span>
        </a>
      </div>
      <div className="cc-title-tag">{t(STR.contactTitle, lang)}</div>
    </div>
  );
}

// ============================================================
// Résumé viewer — fullscreen PDF + download (from the desk frame)
// ============================================================
export function ResumeOverlay({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet sheet-resume" onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose} aria-label="close">×</button>
        <div className="resume-head">
          <h2 className="sheet-title">{t(STR.resumeTitle, lang)}</h2>
          <a className="resume-dl" href="/resume.pdf" download="董静涵-简历.pdf">
            {t(STR.resumeDownload, lang)}
          </a>
        </div>
        <iframe className="resume-frame" src="/resume.pdf" title="résumé" />
      </div>
    </div>
  );
}

// ============================================================
// Bottom chrome for poster / photo browsing
// ============================================================
export function BrowseBar({
  icon, label, index, total, onNav,
}: {
  icon: string;
  label: string;
  index: number;
  total: number;
  onNav: (dir: number) => void;
}) {
  return (
    <div className="browse-bar">
      <button className="sp-btn" onClick={() => onNav(-1)}>‹</button>
      <span className="browse-label">{icon} {label} · {index + 1} / {total}</span>
      <button className="sp-btn" onClick={() => onNav(1)}>›</button>
    </div>
  );
}

export const POSTER_TOTAL = POSTERS.length;
export const PHOTO_TOTAL = PHOTOS.length;

// ============================================================
// About — the journal on the desk opens this "Hi, I'm Jinghan" sheet
// ============================================================
export function AboutOverlay({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet sheet-about" onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose} aria-label="close">×</button>
        <div className="about-grid">
          <div className="about-facts">
            <img className="pin-facts" src="/stickers/图钉.png" alt="" />
            <img className="clip clip-tr" src="/stickers/回形针.png" alt="" />
            <img className="clip clip-br" src="/stickers/回形针.png" alt="" />
            <div className="about-facts-title">{t(ABOUT.factsTitle, lang)}</div>
            <ul>
              {ABOUT.facts.map((f, i) => <li key={i}>{t(f, lang)}</li>)}
            </ul>
            <div className="about-links">
              <a className="chip" href={`mailto:${CONTACT.email}`}><img src="/logo/52.png" alt="" />Email</a>
              <a className="chip" href={CONTACT.site} target="_blank" rel="noreferrer"><img src="/logo/53.png" alt="" />Site</a>
            </div>
            <div className="about-links">
              <a className="chip" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}><img src="/logo/51.png" alt="" />Phone</a>
              <a className="chip" href={CONTACT.github} target="_blank" rel="noreferrer"><img src="/logo/55.png" alt="" />GitHub</a>
            </div>
          </div>
          <div className="about-hi">
            <h2 className="about-title">
              {t(ABOUT.title, lang)}
              <img className="title-hi" src="/stickers/hi-cloud.png" alt="hi" />
            </h2>
            <p className="about-intro">
              {lang === "en" ? (
                <>AI Product Manager — interned at <b className="hl">ByteDance</b>, <b className="hl">Xiaohongshu</b> and <b className="hl">Bilibili</b>, building Agent / AIGC products. Also an M.Eng. student at ECNU working on AI + water research. I turn business pain points into products that ship.</>
              ) : (
                <>AI 产品经理——在<b className="hl">字节跳动</b>、<b className="hl">小红书</b>、<b className="hl">哔哩哔哩</b>实习，做 Agent / AIGC 产品；也是华东师范大学硕士生，研究 AI + 水利。我把业务痛点做成真正落地的产品。</>
              )}
            </p>
            <div className="about-stickers-row">
              <img className="about-person" src="/photos/about.png" alt="Jinghan Dong" />
              <img className="about-flowers" src="/stickers/鲜花.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Awards — clicking a trophy on the shelf opens this list
// ============================================================
export function AwardsOverlay({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet sheet-awards" onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose} aria-label="close">×</button>
        <div className="awards-head">
          <h2 className="sheet-title awards-title">{t(AWARDS.title, lang)}</h2>
          <img className="awards-trophy" src="/stickers/奖杯.png" alt="" />
        </div>
        <ul className="awards-list">
          {AWARDS.items.map((a, i) => {
            const s = t(a, lang);
            const parts = s.split(/·\s*(?=\d{4})/);
            const text = parts[0].trim();
            const year = parts[1]?.trim();
            return (
              <li key={i} style={{ transform: `rotate(${(i % 2 ? -1 : 1) * 0.5}deg)` }}>
                <span className="award-ico">{i < 3 ? "🎓" : "🏅"}</span>
                <span className="award-text">{text}</span>
                {year && <span className="award-year">{year}</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// ============================================================
// Bookshelf — clicking the bookshelf opens this reading list
// ============================================================
import { BOOKS } from "../i18n";

export const BOOK_TAG_COLORS: Record<string, string> = {
  Product: "#1f3a93",      // 藏青
  "AI & Tech": "#0ca678",  // 青绿
  Thinking: "#e8590c",     // 橘
};

export function BooksOverlay({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const [filter, setFilter] = useState("all");
  const list = useMemo(
    () => (filter === "all" ? BOOKS.items : BOOKS.items.filter((b) => b.tag === filter)),
    [filter]
  );
  return (
    <div className="sheet-backdrop reading" onClick={onClose}>
      <div className="sheet sheet-reading sheet-books" onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose} aria-label="close">×</button>
        <h2 className="sheet-title reading-title">
          {t(BOOKS.title, lang)}
          <img className="title-clip" src="/stickers/回形针.png" alt="" />
        </h2>
        <p className="books-subtitle">{t(BOOKS.subtitle, lang)}</p>
        <div className="chip-row">
          <button className={`chip ${filter === "all" ? "chip-on" : ""}`} onClick={() => setFilter("all")}>All</button>
          {BOOKS.categories.map((c) => (
            <button key={c} className={`chip ${filter === c ? "chip-on" : ""}`} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>
        <div className="book-grid">
          {list.map((b, i) => {
            const color = BOOK_TAG_COLORS[b.tag] || "#868e96";
            return (
              <div className="book-card" key={i} style={{ transform: `rotate(${(i % 2 ? -1 : 1) * 0.4}deg)` }}>
                <span className="book-spine" style={{ background: color }} />
                <div className="book-body">
                  <div className="book-title">{t(b.title, lang)}</div>
                  <div className="book-author">{b.author}</div>
                  <div className="book-note">“{t(b.note, lang)}”</div>
                </div>
                <span className="book-tag" style={{ background: color }}>{b.tag}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
