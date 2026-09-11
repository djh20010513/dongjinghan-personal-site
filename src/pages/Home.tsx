import { useCallback, useEffect, useRef, useState } from "react";
import OfficeScene from "../components/OfficeScene";
import {
  AboutOverlay, AwardsOverlay, BrowseBar, ContactCard, EducationOverlay, InternshipPlayer, NoteOverlay, PaperReader, ResumeOverlay, SkillOverlay,
} from "../components/Panels";
import type { OfficeHandles, ScreenRect, ViewMode } from "../three/office";
import { INTERNSHIPS, PHOTOS } from "../data";
import { STR, t, type L, type Lang } from "../i18n";
import LoadingScreen from "../components/LoadingScreen";
import "../App.css";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lang, setLangState] = useState<Lang>("zh");
  const [hoverLabel, setHoverLabel] = useState<L | null>(null);
  const [mode, setMode] = useState<ViewMode>("home");
  const [skillBranch, setSkillBranch] = useState<string | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [awardsOpen, setAwardsOpen] = useState(false);
  const [eduOpen, setEduOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [posterIdx, setPosterIdx] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [internshipIdx, setInternshipIdx] = useState(0);
  const handlesRef = useRef<OfficeHandles | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const screenOverlayRef = useRef<HTMLDivElement | null>(null);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    handlesRef.current?.setLang(next);
  }, []);

  useEffect(() => {
    bgmRef.current = new Audio("/audio/bgm.mp3");
    bgmRef.current.preload = "none"; // 5MB music — only fetch when the user hits play
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.3;
    return () => { bgmRef.current?.pause(); };
  }, []);

  // failsafe: never trap the visitor on the loading screen forever —
  // if a single asset stalls on a slow network, enter anyway after 45s
  useEffect(() => {
    if (ready) return;
    const t = window.setTimeout(() => setReady(true), 45000);
    return () => window.clearTimeout(t);
  }, [ready]);

  // once the scene is up, sync its canvas labels with the React-side language
  // (the 3D wall generates its textures before any toggle happens)
  useEffect(() => {
    if (ready) handlesRef.current?.setLang(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const setMusic = useCallback((playing: boolean) => {
    handlesRef.current?.setMusic(playing);
    if (playing) void bgmRef.current?.play().catch(() => {});
    else bgmRef.current?.pause();
  }, []);

  const goBack = useCallback(() => {
    setSkillBranch(null);
    setNoteOpen(false);
    setResumeOpen(false);
    handlesRef.current?.backToRoom();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") goBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goBack]);

  // position the screen overlay directly (per-frame, no react state churn)
  const modeRef = useRef<ViewMode>("home");
  modeRef.current = mode;
  const onScreenRect = useCallback((rect: ScreenRect | null) => {
    const el = screenOverlayRef.current;
    if (!el) return;
    // phone zoom uses its own fullscreen mockup — not the 3D-locked rect
    if (!rect || modeRef.current === "phone") {
      el.style.display = "none";
      return;
    }
    el.style.display = "block";
    el.style.left = `${rect.left}px`;
    el.style.top = `${rect.top}px`;
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
  }, []);

  const inOverlay = skillBranch !== null || noteOpen || aboutOpen || awardsOpen || eduOpen || resumeOpen;
  // poster mode has its own reader chrome (close button) — no global back button there
  const showBack = mode !== "home" && mode !== "poster" && !inOverlay;

  return (
    <div className="office-root">
      <OfficeScene
        handlesRef={handlesRef}
        events={{
          // manager.onLoad re-fires after every lazy texture batch — set once
          onReady: () => setReady(true),
          onProgress: setProgress,
          onHover: setHoverLabel,
          onModeChange: setMode,
          onScreenRect,
          onPhotoIndex: setPhotoIdx,
          onPosterIndex: setPosterIdx,
          onOpenPapers: (b) => setSkillBranch(b),
          onOpenNote: () => setNoteOpen(true),
          onOpenAbout: () => setAboutOpen(true),
          onOpenAwards: () => setAwardsOpen(true),
          onOpenEducation: () => setEduOpen(true),
          onMusicToggle: setMusic,
        }}
      />

      <LoadingScreen ready={ready} progress={progress} />

      {/* hover tooltip */}
      {ready && hoverLabel && mode === "home" && !inOverlay && (
        <div className="hover-tip">{t(hoverLabel, lang)}</div>
      )}

      {/* idle hint */}
      {ready && mode === "home" && !hoverLabel && !inOverlay && (
        <div className="idle-hint">{t(STR.idleHint, lang)}</div>
      )}

      {/* brand */}
      <div className="brand">
        <span className="brand-dot" /> Jinghan's Office · 董静涵
      </div>

      {/* language toggle */}
      {ready && (
        <button
          className="lang-btn"
          onClick={() => setLang(lang === "en" ? "zh" : "en")}
          aria-label="switch language"
        >
          <span className={lang === "en" ? "lang-on" : ""}>En</span>
          <span className="lang-sep">/</span>
          <span className={lang === "zh" ? "lang-on" : ""}>中</span>
        </button>
      )}

      {/* back button */}
      {showBack && <button className="back-btn" onClick={goBack}>{t(STR.back, lang)}</button>}

      {/* poster browsing — the zoomed blackboard screen becomes a scrollable paper reader */}
      {mode === "poster" && (
        <PaperReader
          idx={posterIdx} lang={lang}
          onNav={(d) => handlesRef.current?.posterNav(d)}
          onClose={goBack}
        />
      )}

      {/* photo browsing chrome + the story of the current photo */}
      {mode === "photo" && (
        <>
          <BrowseBar
            icon="🖼️" label={t(STR.photoLabel, lang)}
            index={photoIdx} total={PHOTOS.length}
            onNav={(d) => handlesRef.current?.photoNav(d)}
          />
          <div className="photo-story" key={`${photoIdx}-${lang}`}>
            {t(PHOTOS[photoIdx].story, lang)}
          </div>
        </>
      )}

      {/* computer screen player — locked onto the 3D monitor */}
      <div ref={screenOverlayRef} className={`screen-overlay ${mode === "phone" ? "phone-mode" : ""}`} style={{ display: "none" }}>
        {mode === "screen" && (
          <InternshipPlayer idx={internshipIdx} lang={lang} onNav={(d) => setInternshipIdx((internshipIdx + d + INTERNSHIPS.length) % INTERNSHIPS.length)} />
        )}
        {mode === "deskframe" && (
          <img src="/resume-cover.jpg" alt="résumé" className="sp-img sp-resume-thumb" onClick={() => setResumeOpen(true)} />
        )}
      </div>

      {/* phone zoom — fullscreen phone mockup with the contact card */}
      {mode === "phone" && (
        <div className="phone-zoom">
          <button className="phone-zoom-close" onClick={goBack} aria-label="close">×</button>
          <div className="phone-mockup">
            <div className="phone-island" />
            <ContactCard lang={lang} />
            <div className="phone-homebar" />
          </div>
        </div>
      )}

      {/* fullscreen overlays */}
      {skillBranch !== null && <SkillOverlay branch={skillBranch} lang={lang} onClose={goBack} />}
      {noteOpen && <NoteOverlay lang={lang} onClose={() => setNoteOpen(false)} />}
      {aboutOpen && <AboutOverlay lang={lang} onClose={() => setAboutOpen(false)} />}
      {awardsOpen && <AwardsOverlay lang={lang} onClose={() => setAwardsOpen(false)} />}
      {eduOpen && <EducationOverlay lang={lang} onClose={() => setEduOpen(false)} />}
      {resumeOpen && <ResumeOverlay lang={lang} onClose={() => setResumeOpen(false)} />}
    </div>
  );
}
