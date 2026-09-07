import { useEffect, useMemo, useState } from "react";
import { BRANCHES, CONTACT, HONORS, PAPERS, PHONE_GIFS, PHOTOS, POSTERS, PROJECTS } from "../data";
import { ABOUT, AWARDS, STR, t, type Lang } from "../i18n";

// ============================================================
// Welcome intro (first visit)
// ============================================================
export function WelcomeOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet sheet-welcome" onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose} aria-label="close">×</button>
        <h1 className="welcome-title">Hi, I'm <span>Zhihui Zhang 张淽卉</span> 👋</h1>
        <p className="welcome-lead">
          PhD candidate at CUHK, Dept. of Curriculum &amp; Instruction — exploring how
          <strong> generative AI</strong> sparks creativity &amp; motivation in language learners.
          Welcome to my office. Everything here tells a story:
        </p>
        <div className="welcome-grid">
          <div>📋 <b>Blackboard</b> — 6 papers, DOI stickers &amp; posters</div>
          <div>🗺️ <b>World map</b> — my education journey</div>
          <div>💻 <b>Computer</b> — sit down &amp; play my projects</div>
          <div>📱 <b>Phone</b> — zoom in for app demos</div>
          <div>🏷️ <b>Sticky notes</b> — research keywords</div>
          <div>✏️ <b>Blank note</b> — leave me a message</div>
          <div>🎵 <b>Vinyl</b> — music on / off</div>
          <div>🪑 <b>Red chair</b> — give it a spin</div>
          <div>🐕 <b>Ben</b> — pat the dog!</div>
        </div>
        <div className="honor-list">
          {HONORS.map((h, i) => <div key={i}>{h}</div>)}
        </div>
        <div className="contact-row">
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={CONTACT.scholar} target="_blank" rel="noreferrer">Google Scholar</a>
          <a href={CONTACT.github} target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <button className="enter-btn" onClick={onClose}>Come on in →</button>
      </div>
    </div>
  );
}

// ============================================================
// Reading view — light academic publications board, 3 cards per row
// ============================================================
const TAG_COLORS: Record<string, string> = {
  Vocabulary: "#d6336c",              // 玫红
  Writing: "#1f3a93",                 // 藏青
  "Assessment & Motivation": "#0ca678", // 青绿
  "Curriculum Design": "#e8590c",     // 橘
  Review: "#868e96",                  // 灰
};

export function ReadingOverlay({ branch, onClose }: { branch: string; onClose: () => void }) {
  const [filter, setFilter] = useState(branch);
  useEffect(() => setFilter(branch), [branch]);
  const list = useMemo(
    () => (filter === "all" ? PAPERS : PAPERS.filter((p) => p.tag === filter)),
    [filter]
  );
  return (
    <div className="sheet-backdrop reading" onClick={onClose}>
      <div className="sheet sheet-reading" onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose} aria-label="close">×</button>
        <h2 className="sheet-title reading-title">
          Publications
          <img className="title-clip" src="/stickers/回形针.png" alt="" />
        </h2>
        <div className="chip-row">
          <button className={`chip ${filter === "all" ? "chip-on" : ""}`} onClick={() => setFilter("all")}>All</button>
          {BRANCHES.map((b) => (
            <button key={b} className={`chip ${filter === b ? "chip-on" : ""}`} onClick={() => setFilter(b)}>{b}</button>
          ))}
        </div>
        <div className="paper-grid">
          {list.map((p, i) => (
            <div className="paper-card" key={i}>
              <span className="paper-tag" style={{ background: TAG_COLORS[p.tag] || "#868e96" }}>{p.tag}</span>
              <div className="paper-title">{p.title}</div>
              <div className="paper-venue">
                {p.underReview ? <span className="paper-review">Under Review</span> : p.venue}
                {p.award && <span className="paper-award">🏆 <b>{p.award}</b></span>}
              </div>
              {p.doi && (
                <a className="paper-doi-btn" href={p.doi} target="_blank" rel="noreferrer">
                  View / Download <span className="doi-arrow">↓</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Guest note — leave a message
// ============================================================
interface GuestNote { name: string; msg: string; ts: number }
const NOTES_KEY = "zhihui-office-notes";

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
// Screen player — positioned over the 3D monitor screen
// ============================================================
export function ScreenPlayer({
  idx, onNav,
}: {
  idx: number;
  onNav: (dir: number) => void;
}) {
  const p = PROJECTS[idx];
  const [mediaIdx, setMediaIdx] = useState(0);
  useEffect(() => setMediaIdx(0), [idx]);
  return (
    <>
      <img key={p.media[mediaIdx]} src={p.media[mediaIdx]} alt={p.title} className="sp-img" />
      <div className="sp-bar">
        <button className="sp-btn" onClick={() => onNav(-1)}>‹</button>
        <span className="sp-title">{p.num} · {p.title}</span>
        <button className="sp-btn" onClick={() => onNav(1)}>›</button>
      </div>
      {p.media.length > 1 && (
        <button className="sp-next-img" onClick={() => setMediaIdx((mediaIdx + 1) % p.media.length)}>›</button>
      )}
    </>
  );
}

// ============================================================
// Phone player — the GIF inside the fullscreen phone mockup
// ============================================================
export function PhonePlayer({ idx }: { idx: number }) {
  return (
    <img key={PHONE_GIFS[idx]} src={PHONE_GIFS[idx]} alt={`phone demo ${idx + 1}`} className="sp-img sp-phone-img" />
  )
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
// About — the journal on the desk opens this "Hi, I'm Zhihui" sheet
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
              <a className="chip" href={CONTACT.scholar} target="_blank" rel="noreferrer"><img src="/logo/53.png" alt="" />Scholar</a>
            </div>
            <div className="about-links">
              <a className="chip" href={CONTACT.linkedin} target="_blank" rel="noreferrer"><img src="/logo/51.png" alt="" />LinkedIn</a>
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
                <>PhD candidate at CUHK's Dept. of Curriculum &amp; Instruction. I study how <b className="hl">generative AI</b> sparks <b className="hl">creativity</b> &amp; <b className="hl">motivation</b> in language learners — and turn ideas into little tools.</>
              ) : (
                <>香港中文大学课程与教学系在读博士生。我研究<b className="hl">生成式 AI</b> 如何点燃语言学习者的<b className="hl">创造力</b>与<b className="hl">动机</b>——并把灵感做成一个个小工具。</>
              )}
            </p>
            <div className="about-stickers-row">
              <img className="about-person" src="/photos/about.png" alt="Zhihui Zhang" />
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
  Research: "#1f3a93",      // 藏青
  Parenting: "#e8590c",     // 橘
  Fiction: "#0ca678",       // 青绿
  "Family Reads": "#d6336c", // 玫红
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
