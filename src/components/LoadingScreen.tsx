import { useEffect, useRef, useState } from "react";
import { playKnock } from "../lib/sound";

const LOAD_TITLE = "Loading.. Jinghan's 3D Office";
const KNOCK_AT = 1900; // ms — matches the hand-knock CSS animation delay
const INTRO_MIN = 3600; // ms — let the whole door/knock intro play out

export default function LoadingScreen({ ready, progress = 0 }: { ready: boolean; progress?: number }) {
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"load" | "entering" | "out" | "gone">("load");
  const mountAt = useRef(Date.now());

  // typewriter: "Loading.. Zhihui's 3D Office"
  useEffect(() => {
    let i = 0;
    const iv = window.setInterval(() => {
      i += 1;
      setTyped(LOAD_TITLE.slice(0, i));
      if (i >= LOAD_TITLE.length) window.clearInterval(iv);
    }, 55);
    return () => window.clearInterval(iv);
  }, []);

  // knock sound, synced with the hand animation
  useEffect(() => {
    const t = window.setTimeout(() => playKnock(), KNOCK_AT);
    return () => window.clearTimeout(t);
  }, []);

  // assets ready + intro had time to play → "Entering"
  useEffect(() => {
    if (!ready) return;
    const remaining = Math.max(0, INTRO_MIN - (Date.now() - mountAt.current));
    const t = window.setTimeout(() => setPhase("entering"), remaining);
    return () => window.clearTimeout(t);
  }, [ready]);

  // "Entering" → fade out → unmount (separate effects so the cleanup
  // of one phase never cancels the next phase's timer)
  useEffect(() => {
    if (phase !== "entering") return;
    const t = window.setTimeout(() => setPhase("out"), 1000);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "out") return;
    const t = window.setTimeout(() => setPhase("gone"), 700);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "gone") return null;

  const entering = phase === "entering" || phase === "out";
  return (
    <div className={`loading ${phase === "out" ? "loading-out" : ""}`}>
      <div className="load-line" />
      <img src="/stickers/门.png" alt="" className="load-door" draggable={false} />
      <img src="/stickers/手.png" alt="" className="load-hand" draggable={false} />
      <div className="load-knock">Knock Knock.</div>
      <div className="load-type">
        {entering ? (
          <span className="load-entering">Entering…</span>
        ) : (
          <>
            {typed}
            <span className="load-caret" />
          </>
        )}
      </div>
      {!entering && progress > 0 && (
        <div className="load-progress">{Math.min(progress, 99)}%</div>
      )}
    </div>
  );
}
