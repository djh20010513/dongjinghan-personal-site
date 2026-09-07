import * as THREE from "three";

function canvasTex(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  draw(ctx, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Warm light-oak floor planks */
export function woodFloorTexture(): THREE.CanvasTexture {
  const t = canvasTex(1024, 1024, (ctx, w, h) => {
    const plankH = 128;
    for (let y = 0; y < h; y += plankH) {
      const offset = (y / plankH) % 2 === 0 ? 0 : 340;
      for (let x = -offset; x < w; x += 512) {
        const hue = 32 + Math.random() * 6;
        const light = 56 + Math.random() * 10;
        ctx.fillStyle = `hsl(${hue}, 45%, ${light}%)`;
        ctx.fillRect(x, y, 510, plankH - 4);
        // grain
        ctx.strokeStyle = "rgba(120, 85, 45, 0.16)";
        ctx.lineWidth = 2;
        for (let g = 0; g < 5; g++) {
          const gy = y + 14 + Math.random() * (plankH - 30);
          ctx.beginPath();
          ctx.moveTo(x, gy);
          ctx.bezierCurveTo(x + 150, gy + 6, x + 330, gy - 6, x + 510, gy + 4);
          ctx.stroke();
        }
      }
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 3);
  return t;
}

/** Round beige rug with pastel geometric shapes (blue / pink / green) */
export function roundRugTexture(): THREE.CanvasTexture {
  return canvasTex(1024, 1024, (ctx, w, h) => {
    const cx = w / 2, cy = h / 2, R = w / 2;
    // creamy warm-white base
    ctx.fillStyle = "#D9D1BF";
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    // very faint concentric circles
    ctx.strokeStyle = "#C7BEAA";
    ctx.globalAlpha = 0.45;
    for (const rr of [R * 0.3, R * 0.5, R * 0.68]) {
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke();
    }
    // one single irregular freehand arc
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx - R * 0.52, cy + R * 0.1);
    ctx.bezierCurveTo(cx - R * 0.3, cy - R * 0.38, cx + R * 0.08, cy - R * 0.5, cx + R * 0.42, cy - R * 0.18);
    ctx.stroke();
    ctx.globalAlpha = 1;
    // thin coffee border ring
    ctx.strokeStyle = "#B5A488";
    ctx.lineWidth = 12;
    ctx.beginPath(); ctx.arc(cx, cy, R - 18, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(cx, cy, R - 40, 0, Math.PI * 2); ctx.stroke();
  });
}

/** Keyboard top face: rows of keys with accent keys */
export function keyboardTexture(): THREE.CanvasTexture {
  return canvasTex(1024, 384, (ctx, w, h) => {
    ctx.fillStyle = "#e8e8ec";
    ctx.fillRect(0, 0, w, h);
    const rows = 4, cols = 14;
    const kw = (w - 60) / cols, kh = (h - 50) / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const accent = (r === 0 && c === 0) || (r === rows - 1 && c === cols - 1);
        const wide = r === rows - 1 && c >= 4 && c <= 8; // spacebar zone
        ctx.fillStyle = accent ? "#c41e3a" : wide ? "#d5d5dc" : "#f7f7fa";
        const x = 30 + c * kw, y = 25 + r * kh;
        ctx.beginPath();
        ctx.roundRect(x + 4, y + 4, kw - 8, kh - 8, 8);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.12)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      // merge spacebar look
      if (r === rows - 1) {
        ctx.fillStyle = "#f7f7fa";
        ctx.beginPath();
        ctx.roundRect(30 + 4 * kw + 4, 25 + r * kh + 4, 5 * kw - 8, kh - 8, 8);
        ctx.fill();
        ctx.stroke();
      }
    }
  });
}

/** Small round red DOI sticker pinned at a paper's corner */
export function doiBadgeTexture(): THREE.CanvasTexture {
  return canvasTex(256, 256, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#c41e3a";
    ctx.beginPath(); ctx.arc(w / 2, h / 2, 116, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(w / 2, h / 2, 100, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 76px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("DOI", w / 2, h / 2 + 4);
  });
}

/** Bold terracotta rug with geometric pattern */
export function rugTexture(): THREE.CanvasTexture {
  return canvasTex(1024, 640, (ctx, w, h) => {
    ctx.fillStyle = "#b33a2b";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#e8604c";
    ctx.fillRect(28, 28, w - 56, h - 56);
    ctx.strokeStyle = "#ffe8c9";
    ctx.lineWidth = 10;
    ctx.strokeRect(52, 52, w - 104, h - 104);
    // diamond pattern
    ctx.fillStyle = "#ffe8c9";
    const step = 128;
    for (let y = step; y < h - 60; y += step) {
      for (let x = step; x < w - 60; x += step) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-16, -16, 32, 32);
        ctx.restore();
      }
    }
    ctx.fillStyle = "#7f2418";
    for (let y = step; y < h - 60; y += step) {
      for (let x = step; x < w - 60; x += step) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-7, -7, 14, 14);
        ctx.restore();
      }
    }
  });
}

/** A printed paper sheet with title + text lines */
export function paperTexture(title: string): THREE.CanvasTexture {
  return canvasTex(512, 700, (ctx, w, h) => {
    ctx.fillStyle = "#fdfbf5";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#1a1a2e";
    ctx.font = "bold 30px Georgia, serif";
    const words = title.split(" ");
    let line = "";
    let y = 70;
    for (const word of words) {
      if ((line + word).length > 26) {
        ctx.fillText(line, 36, y);
        y += 38;
        line = "";
      }
      line += word + " ";
    }
    ctx.fillText(line, 36, y);
    ctx.fillStyle = "#888";
    for (let ly = y + 60; ly < h - 40; ly += 26) {
      const lw = w - 72 - Math.random() * 90;
      ctx.fillRect(36, ly, lw, 8);
    }
    ctx.fillStyle = "#c41e3a";
    ctx.fillRect(36, 30, 90, 8);
  });
}

/** Sticky note with handwritten-ish text; big=true → huge bold font */
export function stickyTexture(text: string, bg: string, sub = "", big = false): THREE.CanvasTexture {
  return canvasTex(256, 256, (ctx, w, h) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    // folded corner
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.moveTo(w, h - 44);
    ctx.lineTo(w - 44, h);
    ctx.lineTo(w, h);
    ctx.fill();
    ctx.fillStyle = "#2b2b3a";
    ctx.font = `bold ${big ? 44 : 30}px 'Comic Sans MS', 'Chalkboard SE', cursive`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lines = text.split("\n");
    const lineH = big ? 56 : 40;
    lines.forEach((ln, i) => {
      ctx.fillText(ln, w / 2, h / 2 - (lines.length - 1) * (lineH / 2) + i * lineH - (sub ? 18 : 0));
    });
    if (sub) {
      ctx.font = "22px 'Comic Sans MS', cursive";
      ctx.fillStyle = "rgba(43,43,58,0.65)";
      ctx.fillText(sub, w / 2, h - 44);
    }
  });
}

/** Monitor screen: project collage wallpaper */
export function screenTexture(): THREE.CanvasTexture {
  return canvasTex(1024, 640, (ctx, w, h) => {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#101b3c");
    grad.addColorStop(0.55, "#27225c");
    grad.addColorStop(1, "#4c1d5f");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    // glowing blobs
    const blob = (x: number, y: number, r: number, c: string) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, c);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    };
    blob(220, 180, 260, "rgba(64,160,255,0.5)");
    blob(820, 420, 300, "rgba(255,84,180,0.45)");
    blob(560, 120, 200, "rgba(255,200,64,0.35)");
    // app icons
    const labels = ["AI Journey", "Postcard", "VocabTest", "IELTS", "Worksheet", "BookTail", "3D Word"];
    labels.forEach((lb, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = 150 + col * 240;
      const y = 180 + row * 240;
      ctx.fillStyle = `hsl(${(i * 47) % 360}, 75%, 62%)`;
      ctx.beginPath();
      ctx.roundRect(x - 52, y - 52, 104, 104, 26);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 44px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(lb[0], x, y);
      ctx.font = "24px sans-serif";
      ctx.fillText(lb, x, y + 84);
    });
    // taskbar
    ctx.fillStyle = "rgba(8,10,24,0.85)";
    ctx.fillRect(0, h - 56, w, 56);
    ctx.fillStyle = "#ffd166";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("▶  Click me — Project Player", 28, h - 27);
  });
}

/** Book spine label strip used as bookshelf side detail (unused generic helper) */
export function labelTexture(text: string, fg = "#fff", font = "bold 48px sans-serif"): THREE.CanvasTexture {
  return canvasTex(512, 128, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = fg;
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, h / 2);
  });
}

/** Floating education card shown directly on the world map */
export function eduLabelTexture(edu: {
  flag: string; school: string; schoolZh: string; degree: string; degreeZh: string;
  year: string; place: string; placeZh: string;
}, lang: "en" | "zh" = "en"): THREE.CanvasTexture {
  return canvasTex(1024, 384, (ctx, w, h) => {
    // card
    ctx.fillStyle = "rgba(20, 33, 61, 0.94)";
    ctx.beginPath();
    ctx.roundRect(6, 6, w - 12, h - 12, 36);
    ctx.fill();
    ctx.strokeStyle = "#ffd166";
    ctx.lineWidth = 6;
    ctx.stroke();
    // flag
    ctx.font = "120px serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(edu.flag, 50, h / 2 + 8);
    // year badge
    ctx.fillStyle = "#c41e3a";
    ctx.beginPath();
    ctx.roundRect(230, 50, 240, 72, 36);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 44px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(edu.year, 350, 90);
    // school
    ctx.fillStyle = "#ffd166";
    ctx.font = lang === "zh" ? "bold 52px 'PingFang SC', 'Microsoft YaHei', sans-serif" : "bold 46px Georgia, serif";
    ctx.textAlign = "left";
    const schoolFull = lang === "zh" ? edu.schoolZh : edu.school;
    const school = schoolFull.length > 38 ? schoolFull.slice(0, 37) + "…" : schoolFull;
    ctx.fillText(school, 230, 190);
    // degree + place
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = lang === "zh" ? "42px 'PingFang SC', 'Microsoft YaHei', sans-serif" : "40px sans-serif";
    ctx.fillText(lang === "zh" ? `${edu.degreeZh} · ${edu.placeZh}` : `${edu.degree} · ${edu.place}`, 230, 268);
  });
}

/** Map frame title strip */
export function mapTitleTexture(lang: "en" | "zh" = "en"): THREE.CanvasTexture {
  return canvasTex(1024, 128, (ctx, w, h) => {
    ctx.fillStyle = "#14213d";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#ffd166";
    ctx.font = lang === "zh" ? "bold 54px 'PingFang SC', 'Microsoft YaHei', sans-serif" : "bold 56px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(lang === "zh" ? "✈  我的求学之旅  ✈" : "✈  My Education Journey  ✈", w / 2, h / 2);
  });
}

/** Dog bone / paw rug under dog bed - simple ellipse mat */
export function matTexture(): THREE.CanvasTexture {
  return canvasTex(512, 512, (ctx, w, h) => {
    ctx.fillStyle = "#f4e3c2";
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, w / 2 - 8, h / 2 - 60, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}
