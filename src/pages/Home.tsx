import { useCallback, useEffect, useRef, useState } from "react";
import OfficeScene from "../components/OfficeScene";
import {
  AboutOverlay, AwardsOverlay, BooksOverlay, BrowseBar, NoteOverlay, PhonePlayer, ReadingOverlay, ScreenPlayer,
} from "../components/Panels";
import type { OfficeHandles, ScreenRect, ViewMode } from "../three/office";
import { PHOTOS, PHONE_GIFS, PROJECTS, PUBLISHED } from "../data";
import { STR, t, type L, type Lang } from "../i18n";
import LoadingScreen from "../components/LoadingScreen";
import "../App.css";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [lang, setLangState] = useState<Lang>("en");
  const [hoverLabel, setHoverLabel] = useState<L | null>(null);
  const [mode, setMode] = useState<ViewMode>("home");
  const [papersBranch, setPapersBranch] = useState<string | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [awardsOpen, setAwardsOpen] = useState(false);
  const [booksOpen, setBooksOpen] = useState(false);
  const [posterIdx, setPosterIdx] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [projectIdx, setProjectIdx] = useState(0);
  const [phoneGifIdx, setPhoneGifIdx] = useState(0);
  const handlesRef = useRef<OfficeHandles | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const screenOverlayRef = useRef<HTMLDivElement | null>(null);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    handlesRef.current?.setLang(next);
  }, []);

  useEffect(() => {
    bgmRef.current = new Audio("/audio/bgm.mp3");
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.3;
    return () => { bgmRef.current?.pause(); };
  }, []);

  const setMusic = useCallback((playing: boolean) => {
    handlesRef.current?.setMusic(playing);
    if (playing) void bgmRef.current?.play().catch(() => {});
    else bgmRef.current?.pause();
  }, []);

  const goBack = useCallback(() => {
    setPapersBranch(null);
    setNoteOpen(false);
    handlesRef.current?.backToRoom();
  }, []);

  // phone zoom: auto-advance the demo GIFs while the mockup is open
  useEffect(() => {
    if (mode !== "phone") return;
    const timer = setInterval(() => setPhoneGifIdx((i) => (i + 1) % PHONE_GIFS.length), 9000);
    return () => clearInterval(timer);
  }, [mode]);

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

  const inOverlay = papersBranch !== null || noteOpen || aboutOpen || awardsOpen || booksOpen;
  const showBack = mode !== "home" && !inOverlay;

  return (
    <div className="office-root">
      <OfficeScene
        handlesRef={handlesRef}
        events={{
          // manager.onLoad re-fires after every lazy texture batch — set once
          onReady: () => setReady(true),
          onHover: setHoverLabel,
          onModeChange: setMode,
          onScreenRect,
          onPhotoIndex: setPhotoIdx,
          onPosterIndex: setPosterIdx,
          onOpenPapers: (b) => setPapersBranch(b),
          onOpenNote: () => setNoteOpen(true),
          onOpenAbout: () => setAboutOpen(true),
          onOpenAwards: () => setAwardsOpen(true),
          onOpenBooks: () => setBooksOpen(true),
          onMusicToggle: setMusic,
        }}
      />

      <LoadingScreen ready={ready} />

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
        <span className="brand-dot" /> Zhihui's Office · 张淽卉
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

      {/* poster browsing chrome */}
      {mode === "poster" && (
        <BrowseBar
          icon="📽️" label={t(STR.posterLabel, lang)}
          index={posterIdx} total={PUBLISHED.length}
          onNav={(d) => handlesRef.current?.posterNav(d)}
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
          <ScreenPlayer idx={projectIdx} onNav={(d) => setProjectIdx((projectIdx + d + PROJECTS.length) % PROJECTS.length)} />
        )}
        {mode === "deskframe" && (
          <img src="/photos/home.gif" alt="homepage demo" className="sp-img" />
        )}
      </div>

      {/* phone zoom — fullscreen phone mockup with demo GIFs */}
      {mode === "phone" && (
        <div className="phone-zoom">
          <button className="phone-zoom-close" onClick={goBack} aria-label="close">×</button>
          <div className="phone-mockup">
            <div className="phone-island" />
            <PhonePlayer idx={phoneGifIdx} />
            <div className="phone-homebar" />
          </div>
          <button className="sp-btn phone-nav phone-nav-l" onClick={() => setPhoneGifIdx((phoneGifIdx + PHONE_GIFS.length - 1) % PHONE_GIFS.length)} aria-label="previous">‹</button>
          <button className="sp-btn phone-nav phone-nav-r" onClick={() => setPhoneGifIdx((phoneGifIdx + 1) % PHONE_GIFS.length)} aria-label="next">›</button>
        </div>
      )}

      {/* fullscreen overlays */}
      {papersBranch !== null && <ReadingOverlay branch={papersBranch} onClose={goBack} />}
      {noteOpen && <NoteOverlay lang={lang} onClose={() => setNoteOpen(false)} />}
      {aboutOpen && <AboutOverlay lang={lang} onClose={() => setAboutOpen(false)} />}
      {awardsOpen && <AwardsOverlay lang={lang} onClose={() => setAwardsOpen(false)} />}
      {booksOpen && <BooksOverlay lang={lang} onClose={() => setBooksOpen(false)} />}
    </div>
  );
}
