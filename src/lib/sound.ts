// ---------- shared UI sounds ----------

let clickEl: HTMLAudioElement | null = null;

/** Short click for every HTML button / link. */
export function uiClick(): void {
  try {
    if (!clickEl) {
      clickEl = new Audio("/audio/click.mp3");
      clickEl.volume = 0.28;
    }
    clickEl.currentTime = 0;
    void clickEl.play().catch(() => {});
  } catch {
    /* noop */
  }
}

/** Synthesized "knock knock" — two low thumps with a noisy attack. */
export function playKnock(): void {
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    void ctx.resume().catch(() => {});

    const knockAt = (t0: number) => {
      // low body thump
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(170, t0);
      osc.frequency.exponentialRampToValueAtTime(58, t0 + 0.09);
      g.gain.setValueAtTime(0.7, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.16);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.18);

      // sharp knuckle attack
      const len = Math.floor(ctx.sampleRate * 0.045);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.3, t0);
      ng.gain.exponentialRampToValueAtTime(0.001, t0 + 0.045);
      src.connect(ng);
      ng.connect(ctx.destination);
      src.start(t0);
    };

    knockAt(ctx.currentTime + 0.02);
    knockAt(ctx.currentTime + 0.38);
  } catch {
    /* noop */
  }
}

// ---------- water pouring (teapot & mug on the desk) ----------
let pourEl: HTMLAudioElement | null = null;

/** Pouring water sound — plays once per pour animation. */
export function playPour(): void {
  try {
    if (!pourEl) {
      pourEl = new Audio("/audio/pour.mp3");
      pourEl.volume = 0.55;
    }
    pourEl.currentTime = 0;
    void pourEl.play().catch(() => {});
  } catch {
    /* noop */
  }
}
