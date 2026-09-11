import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import gsap from "gsap";
import {
  woodFloorTexture,
  roundRugTexture,
  stickyTexture,
  screenTexture,
  doiBadgeTexture,
  chalkBoardArtTexture,
  corkTexture,
  tagNoteTexture,
  stripTexture,
} from "./textures";
import { PHOTOS, PHOTO_ASPECTS, PHOTO_WALL_PATTERN, PUBLISHED, COVER_ASPECTS, SKILL_WALL, VIBE_WORK } from "../data";
import { l, t, type L, type Lang } from "../i18n";

// ============================================================
// Types
// ============================================================
export type ViewMode = "home" | "map" | "photo" | "screen" | "poster" | "desk" | "phone" | "deskframe";

export interface ScreenRect {
  left: number; top: number; width: number; height: number;
}

export interface OfficeCallbacks {
  onReady: () => void;
  onProgress: (pct: number) => void;
  onHover: (label: L | null) => void;
  onModeChange: (mode: ViewMode) => void;
  onScreenRect: (rect: ScreenRect | null) => void;
  onPhotoIndex: (index: number) => void;
  onPosterIndex: (index: number) => void;
  onOpenPapers: (branch: string) => void;
  onOpenEducation: () => void;
  onOpenNote: () => void;
  onOpenAbout: () => void;
  onOpenAwards: () => void;
  onMusicToggle: (playing: boolean) => void;
}

export interface OfficeHandles {
  dispose: () => void;
  backToRoom: () => void;
  setMusic: (playing: boolean) => void;
  setLang: (lang: Lang) => void;
  posterNav: (dir: number) => void;
  photoNav: (dir: number) => void;
}

interface InteractData {
  id: string;
  label: L;
  action: () => void;
}

// ============================================================
// Palette — light walls + bold accents
// ============================================================
const C = {
  backWall: 0xa45849,   // retro red-brown (desk-facing wall)
  leftWall: 0xefe8dd,   // warm cream
  rightWall: 0xefe8dd,  // warm cream (same as left)
  baseboard: 0xc8b8a5,  // light taupe skirting
  boardDark: 0x22282d,  // blackboard
  boardWood: 0x8a5a33,
  shelfBlue: 0x1f4fa0,
  metal: 0x2b2f36,
  led: 0xffe9b8,
};

// ============================================================
// Main factory
// ============================================================
export function createOffice(canvas: HTMLCanvasElement, cb: OfficeCallbacks): OfficeHandles {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe9eff5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(5.8, 4.4, 8.8);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = true; // right-drag pans the orbit center — free, game-like viewing
  controls.panSpeed = 0.9;
  controls.minDistance = 1.2;
  controls.maxDistance = 18;
  controls.minPolarAngle = Math.PI / 6;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.minAzimuthAngle = -Math.PI / 2.4;
  controls.maxAzimuthAngle = Math.PI / 2.4;
  controls.target.set(-0.4, 1.3, -1.2);

  const HOME_CAM = new THREE.Vector3(5.8, 4.4, 8.8);
  const HOME_TARGET = new THREE.Vector3(-0.4, 1.3, -1.2);

  // ----------------------------------------------------------
  // Loading manager → onReady
  // ----------------------------------------------------------
  const manager = new THREE.LoadingManager();
  manager.onLoad = () => cb.onReady();
  manager.onProgress = (_url, loaded, total) => {
    cb.onProgress(total > 0 ? Math.round((loaded / total) * 100) : 0);
  };
  const texLoader = new THREE.TextureLoader(manager);
  const gltfLoader = new GLTFLoader(manager);
  gltfLoader.setMeshoptDecoder(MeshoptDecoder);

  // ----------------------------------------------------------
  // Lights
  // ----------------------------------------------------------
  scene.add(new THREE.HemisphereLight(0xfff3e0, 0x27404d, 0.85));

  const sun = new THREE.DirectionalLight(0xffe7c4, 2.4);
  sun.position.set(6, 9, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -10;
  sun.shadow.camera.right = 10;
  sun.shadow.camera.top = 10;
  sun.shadow.camera.bottom = -10;
  sun.shadow.camera.far = 30;
  sun.shadow.bias = -0.0004;
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0x9ecfff, 0.5);
  fill.position.set(-7, 5, 4);
  scene.add(fill);

  // ----------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------
  const std = (color: number, rough = 0.75, metal = 0.0) =>
    new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

  function box(w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0, shadow = true): THREE.Mesh {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    if (shadow) { m.castShadow = true; m.receiveShadow = true; }
    return m;
  }

  /** Scale a scanned GLB (uniform or per-axis), center it on x/z and rest its bottom on y=0. */
  function prepSized(gltfScene: THREE.Group, scale: number | [number, number, number]): { group: THREE.Group; size: THREE.Vector3 } {
    const obj = gltfScene;
    obj.traverse((o) => {
      if (o instanceof THREE.Mesh) { o.castShadow = true; o.receiveShadow = true; }
    });
    if (Array.isArray(scale)) obj.scale.set(scale[0], scale[1], scale[2]);
    else obj.scale.setScalar(scale);
    obj.updateMatrixWorld(true);
    const bb = new THREE.Box3().setFromObject(obj);
    const c = bb.getCenter(new THREE.Vector3());
    obj.position.x -= c.x;
    obj.position.z -= c.z;
    obj.position.y -= bb.min.y;
    const g = new THREE.Group();
    g.add(obj);
    return { group: g, size: bb.getSize(new THREE.Vector3()) };
  }

  /** Legacy fixed-scale prep for the round-2 models (already hand-tuned). */
  function prepModel(gltfScene: THREE.Group, scale: number): THREE.Group {
    const obj = gltfScene;
    obj.traverse((o) => {
      if (o instanceof THREE.Mesh) { o.castShadow = true; o.receiveShadow = true; }
    });
    obj.scale.setScalar(scale);
    const g = new THREE.Group();
    g.add(obj);
    return g;
  }

  // ----------------------------------------------------------
  // Room shell
  // ----------------------------------------------------------
  const room = new THREE.Group();
  scene.add(room);
  const W = 13, D = 11, H = 4.8;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(W, D),
    new THREE.MeshStandardMaterial({ map: woodFloorTexture(), roughness: 0.65 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(W, H), std(C.backWall, 0.9));
  backWall.position.set(0, H / 2, -D / 2);
  backWall.receiveShadow = true;
  room.add(backWall);

  const sideWallMat = () => {
    const m = std(C.leftWall, 0.9);
    m.emissive.set(0x8a6f4d); // warm self-glow so cool fill light can't gray it out
    m.emissiveIntensity = 0.24;
    return m;
  };
  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), sideWallMat());
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-W / 2, H / 2, 0);
  leftWall.receiveShadow = true;
  room.add(leftWall);

  const rightWallMat = sideWallMat();
  const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(D, H), rightWallMat);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.set(W / 2, H / 2, 0);
  rightWall.receiveShadow = true;
  room.add(rightWall);

  const bbMat = std(C.baseboard, 0.6);
  room.add(box(W, 0.18, 0.06, bbMat, 0, 0.09, -D / 2 + 0.03, false));
  const bbL = box(D, 0.18, 0.06, bbMat, 0, 0.09, 0, false);
  bbL.rotation.y = Math.PI / 2;
  bbL.position.set(-W / 2 + 0.03, 0.09, 0);
  room.add(bbL);
  const bbR = bbL.clone();
  bbR.position.x = W / 2 - 0.03;
  room.add(bbR);

  // ----------------------------------------------------------
  // Round beige rug with pastel geometric shapes
  // ----------------------------------------------------------
  const rug = new THREE.Mesh(
    new THREE.CircleGeometry(3.5, 56),
    new THREE.MeshStandardMaterial({ map: roundRugTexture(), roughness: 0.95 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(-0.35, 0.012, -0.6);
  rug.receiveShadow = true;
  room.add(rug);

  // ----------------------------------------------------------
  // View mode state machine
  // ----------------------------------------------------------
  let mode: ViewMode = "home";

  function focusCam(cam: [number, number, number], target: [number, number, number], newMode: ViewMode) {
    if (hoveredRoot) {
      gsap.to(hoveredRoot.scale, { x: 1, y: 1, z: 1, duration: 0.2 });
      hoveredRoot = null;
      cb.onHover(null);
    }
    controls.enabled = false;
    controls.minDistance = 0.2; // allow close-ups (phone / photos / screen)
    if (newMode !== "screen" && newMode !== "phone" && newMode !== "deskframe") cb.onScreenRect(null);
    gsap.to(camera.position, { x: cam[0], y: cam[1], z: cam[2], duration: 1.15, ease: "power3.inOut" });
    gsap.to(controls.target, {
      x: target[0], y: target[1], z: target[2], duration: 1.15, ease: "power3.inOut",
      onComplete: () => {
        mode = newMode;
        cb.onModeChange(mode);
      },
    });
  }

  function backToRoom() {
    mode = "home";
    cb.onModeChange("home");
    cb.onScreenRect(null);
    controls.minDistance = 2.5;
    gsap.to(camera.position, { x: HOME_CAM.x, y: HOME_CAM.y, z: HOME_CAM.z, duration: 1.1, ease: "power3.inOut" });
    gsap.to(controls.target, {
      x: HOME_TARGET.x, y: HOME_TARGET.y, z: HOME_TARGET.z, duration: 1.1, ease: "power3.inOut",
      onComplete: () => { controls.enabled = true; },
    });
  }

  // ----------------------------------------------------------
  // Interactives registry
  // ----------------------------------------------------------
  const interactives: THREE.Object3D[] = [];
  function makeInteractive(group: THREE.Object3D, data: InteractData) {
    group.userData.interact = data;
    interactives.push(group);
  }

  const musicState = { playing: false };

  // ----------------------------------------------------------
  // Blackboard wall (back wall, WIDENED):
  // 5 paper covers tiled on the left · big poster screen + bulbs on the right
  // ----------------------------------------------------------
  const board = new THREE.Group();
  board.position.set(-0.35, 2.72, -D / 2 + 0.05);
  room.add(board);

  board.add(box(11.6, 3.05, 0.08, std(C.boardWood, 0.6), 0.25, 0, -0.02)); // widened toward the floor-lamp side
  const boardFace = new THREE.Mesh(
    new THREE.PlaneGeometry(11.35, 2.8),
    std(C.boardDark, 0.85)
  );
  boardFace.position.set(0.25, 0, 0.025);
  board.add(boardFace);

  // ---- single poster display (centered) with a string of warm bulbs ----
  const POSTER_LOCAL_X = 3.0;
  const posterG = new THREE.Group();
  posterG.position.set(POSTER_LOCAL_X, 0, 0.05);
  board.add(posterG);

  let posterIdx = 0;
  // paper covers are portrait first-page screenshots — keep each cover's own aspect
  const POSTER_H = 2.28;
  const posterAspect = (i: number) => COVER_ASPECTS[i] || 0.75;
  // toneMapped:false — paper pages must keep their native white/black contrast;
  // ACES tone mapping would wash the page out to an unreadable grey ("曝光")
  const posterMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  texLoader.load(PUBLISHED[0].poster!, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    posterMat.map = t;
    posterMat.needsUpdate = true;
  });
  const poster = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), posterMat);
  poster.scale.set(POSTER_H * posterAspect(0), POSTER_H, 1);
  posterG.add(poster);

  function showPoster(i: number) {
    posterIdx = i;
    texLoader.load(PUBLISHED[i].poster!, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      posterMat.map = t;
      posterMat.needsUpdate = true;
    });
    poster.scale.set(POSTER_H * posterAspect(i), POSTER_H, 1);
    gsap.fromTo(posterG.scale, { x: 0.96, y: 0.96, z: 1 }, { x: 1, y: 1, z: 1, duration: 0.45, ease: "back.out(2)" });
    cb.onPosterIndex(i);
  }

  // bulb string around the poster — many little warm light bulbs (portrait frame)
  const bulbGeo = new THREE.SphereGeometry(0.032, 10, 10);
  const BULB_W = 2.2, BULB_H = 2.58, BULB_STEP = 0.27;
  const bulbPositions: [number, number][] = [];
  for (let x = -BULB_W / 2; x <= BULB_W / 2 + 0.001; x += BULB_STEP) {
    bulbPositions.push([x, BULB_H / 2], [x, -BULB_H / 2]);
  }
  for (let y = -BULB_H / 2 + BULB_STEP; y <= BULB_H / 2 - BULB_STEP + 0.001; y += BULB_STEP) {
    bulbPositions.push([-BULB_W / 2, y], [BULB_W / 2, y]);
  }
  const bulbs: THREE.Mesh[] = [];
  bulbPositions.forEach(([bx, by], k) => {
    const b = new THREE.Mesh(bulbGeo, new THREE.MeshStandardMaterial({
      color: 0xffe0a3, emissive: 0xffc978, emissiveIntensity: 2.4, roughness: 0.35,
    }));
    b.position.set(POSTER_LOCAL_X + bx, by, 0.055);
    b.userData.phase = k * 0.7;
    board.add(b);
    bulbs.push(b);
  });
  const ledGlow = new THREE.PointLight(0xffe2a8, 5, 3.4, 1.6);
  ledGlow.position.set(POSTER_LOCAL_X, 0, 0.65);
  board.add(ledGlow);

  // poster world center ≈ (2.65, 2.72, -5.4)
  const focusPoster = () => focusCam([2.65, 2.7, -3.05], [2.65, 2.72, -5.4], "poster");
  makeInteractive(posterG, {
    id: "poster",
    label: l("📽️ Paper screen — click to read", "📽️ 论文大屏——点击阅读"),
    action: focusPoster,
  });

  function posterNav(dir: number) {
    showPoster((posterIdx + dir + PUBLISHED.length) % PUBLISHED.length);
  }

  // ---- chalk doodles in the empty middle of the board (title + arrow + stars) ----
  const chalkArt = new THREE.Mesh(
    new THREE.PlaneGeometry(2.7, 1.67),
    new THREE.MeshBasicMaterial({ map: chalkBoardArtTexture(), transparent: true })
  );
  chalkArt.position.set(0.15, 0, 0.03);
  board.add(chalkArt);

  // ---- 5 published paper covers (left region, tiled 3 + 2) + DOI stickers ----
  const doiTex = doiBadgeTexture();
  const coverSpots: [number, number][] = [
    [-4.6, 0.66], [-3.35, 0.66], [-2.1, 0.66],
    [-3.97, -0.66], [-2.72, -0.66],
  ];
  PUBLISHED.forEach((p, i) => {
    const [col, row] = coverSpots[i];
    const g = new THREE.Group();
    g.position.set(col, row, 0.04);
    board.add(g);
    const cw = 1.06 * (COVER_ASPECTS[i] || 0.72); // each cover keeps its PDF aspect
    g.add(box(cw + 0.08, 1.14, 0.02, std(0xffffff, 0.6), 0, 0, 0));
    const t = texLoader.load(p.cover!);
    t.colorSpace = THREE.SRGBColorSpace;
    const cover = new THREE.Mesh(new THREE.PlaneGeometry(cw, 1.06), new THREE.MeshBasicMaterial({ map: t, toneMapped: false }));
    cover.position.z = 0.015;
    g.add(cover);
    makeInteractive(g, {
      id: `paper-${i}`,
      label: l(`📄 ${p.venue} — show it on the big screen`, `📄 ${p.venue}——投到大屏幕查看`),
      action: () => showPoster(i),
    });
    // DOI sticker at the cover's bottom-right corner
    const doi = new THREE.Group();
    doi.position.set(cw / 2 + 0.01, -0.52, 0.03);
    const badge = new THREE.Mesh(
      new THREE.CircleGeometry(0.115, 24),
      new THREE.MeshBasicMaterial({ map: doiTex, transparent: true })
    );
    doi.add(badge);
    g.add(doi);
    makeInteractive(doi, {
      id: `doi-${i}`,
      label: l("🔗 DOI — open the paper online", "🔗 DOI——在线打开论文"),
      action: () => { if (p.doi) window.open(p.doi, "_blank", "noopener"); },
    });
  });

  // blank guest note stays on the wall below the board, layered over an envelope sticker
  const envelopeTex = texLoader.load("/stickers/留言板信封.png");
  envelopeTex.colorSpace = THREE.SRGBColorSpace;
  const blankNote = new THREE.Mesh(
    new THREE.PlaneGeometry(0.4, 0.4),
    new THREE.MeshStandardMaterial({ map: stickyTexture("✎", "#ffffff", "leave a note"), roughness: 0.9 })
  );
  blankNote.rotation.z = 0.08;
  blankNote.castShadow = true;
  const blankG = new THREE.Group();
  blankG.position.set(4.6, 0.72, -D / 2 + 0.08);
  const envelope = new THREE.Mesh(
    new THREE.PlaneGeometry(0.62, 0.5),
    new THREE.MeshBasicMaterial({ map: envelopeTex, transparent: true })
  );
  envelope.position.z = -0.015;
  envelope.rotation.z = -0.06;
  blankG.add(envelope);
  blankG.add(blankNote);
  room.add(blankG);
  makeInteractive(blankG, {
    id: "blank-note",
    label: l("✏️ Blank note — leave me a message!", "✏️ 空白便签——给我留言吧！"),
    action: () => cb.onOpenNote(),
  });

  // ----------------------------------------------------------
  // Left wall: corkboard — skill-tag modules + vibe-coding work
  // ----------------------------------------------------------
  let currentLang: Lang = "en";

  const wallG = new THREE.Group();
  wallG.position.set(-W / 2 + 0.03, 2.55, -0.6);
  wallG.rotation.y = Math.PI / 2;
  room.add(wallG);

  const WALL_W = 5.2, WALL_H = 2.925;
  // wooden frame + cork board
  wallG.add(box(WALL_W + 0.24, WALL_H + 0.55, 0.06, std(0xb5855c, 0.75), 0, 0.12, -0.03));
  const corkTex = corkTexture();
  corkTex.wrapS = corkTex.wrapT = THREE.RepeatWrapping;
  corkTex.repeat.set(3, 2);
  const cork = new THREE.Mesh(
    new THREE.PlaneGeometry(WALL_W, WALL_H),
    new THREE.MeshStandardMaterial({ map: corkTex, roughness: 0.95 })
  );
  cork.position.set(0, -0.05, 0.005);
  wallG.add(cork);

  /** materials that must be re-generated when the UI language switches */
  const langMats: { mat: THREE.MeshBasicMaterial; make: (lang: Lang) => THREE.CanvasTexture }[] = [];
  const regLang = (mat: THREE.MeshBasicMaterial, make: (lang: Lang) => THREE.CanvasTexture) => {
    langMats.push({ mat, make });
  };

  const wallTitleMat = new THREE.MeshBasicMaterial({
    map: stripTexture(t(l("My Skills Wall", "我的能力墙"), currentLang)),
    transparent: true,
  });
  regLang(wallTitleMat, (lang) => stripTexture(t(l("My Skills Wall", "我的能力墙"), lang)));
  const titleStrip = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.42), wallTitleMat);
  titleStrip.position.set(0, WALL_H / 2 + 0.18, 0.02);
  wallG.add(titleStrip);

  // pulsing rings pinned onto the wall (driven by the tick loop)
  const pins: THREE.Mesh[] = [];

  // ---- left column: vibe-coding work (polaroid pinned on the cork) ----
  const vibeG = new THREE.Group();
  vibeG.position.set(-1.82, 0.08, 0.03);
  vibeG.rotation.z = -0.035;
  wallG.add(vibeG);
  // white polaroid paper
  const vibePaper = new THREE.Mesh(
    new THREE.PlaneGeometry(1.24, 1.62),
    new THREE.MeshStandardMaterial({ color: 0xfffef8, roughness: 0.9 })
  );
  vibePaper.castShadow = true;
  vibeG.add(vibePaper);
  // work screenshot
  const vibeCoverTex = texLoader.load(VIBE_WORK.cover);
  vibeCoverTex.colorSpace = THREE.SRGBColorSpace;
  const vibeCover = new THREE.Mesh(
    new THREE.PlaneGeometry(1.06, 0.8),
    new THREE.MeshBasicMaterial({ map: vibeCoverTex })
  );
  vibeCover.position.set(0, 0.33, 0.012);
  vibeG.add(vibeCover);
  // caption strip under the photo
  const vibeCapMat = new THREE.MeshBasicMaterial({
    map: tagNoteTexture(t(VIBE_WORK.name, currentLang), "#fffef8", { fontPx: 30 }),
    transparent: true,
  });
  regLang(vibeCapMat, (lang) => tagNoteTexture(t(VIBE_WORK.name, lang), "#fffef8", { fontPx: 30 }));
  const vibeCap = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 0.42), vibeCapMat);
  vibeCap.position.set(0, -0.44, 0.012);
  vibeG.add(vibeCap);
  // washi tape on top of the polaroid
  const tape = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.16),
    new THREE.MeshBasicMaterial({ color: 0x9df2ff, transparent: true, opacity: 0.75 })
  );
  tape.position.set(0, 0.86, 0.014);
  tape.rotation.z = 0.04;
  vibeG.add(tape);
  makeInteractive(vibeG, {
    id: "vibe-work",
    label: l("🛠️ My vibe-coding work — open it", "🛠️ 我的 Vibe Coding 作品——点我看看"),
    action: () => window.open(VIBE_WORK.link, "_blank", "noopener"),
  });

  // ---- right area: 3 skill modules, tags pinned like sticky notes ----
  const MOD_X = [-0.42, 0.86, 2.14];
  const MOD_TILT = [-0.02, 0.015, -0.025];
  const TAG_TILT = [0.05, -0.06, 0.04, -0.05, 0.06, -0.04];
  const WALL_CAM: [number, number, number] = [-3.3, 2.55, -0.6];
  const WALL_TARGET: [number, number, number] = [-6.44, 2.5, -0.6];
  SKILL_WALL.forEach((mod, mi) => {
    const g = new THREE.Group();
    g.position.set(MOD_X[mi], -0.02, 0.03);
    g.rotation.z = MOD_TILT[mi];
    wallG.add(g);
    // paper sheet
    const sheet = new THREE.Mesh(
      new THREE.PlaneGeometry(1.16, 2.5),
      new THREE.MeshStandardMaterial({ color: 0xfffef5, roughness: 0.9 })
    );
    sheet.castShadow = true;
    g.add(sheet);
    // module title sticky (with pushpin) — bilingual, refreshed on language switch
    const titleMat = new THREE.MeshBasicMaterial({
      map: tagNoteTexture(t(mod.title, currentLang), mod.color, { pin: true, fontPx: 40 }),
      transparent: true,
    });
    regLang(titleMat, (lang) => tagNoteTexture(t(mod.title, lang), mod.color, { pin: true, fontPx: 40 }));
    const titleNote = new THREE.Mesh(new THREE.PlaneGeometry(1.04, 0.52), titleMat);
    titleNote.position.set(0, 0.92, 0.012);
    titleNote.rotation.z = mi % 2 === 0 ? 0.03 : -0.03;
    g.add(titleNote);
    // tag stickies — 2 cols × 3 rows
    mod.tags.forEach((tag, ti) => {
      const tagMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.48, 0.32),
        new THREE.MeshBasicMaterial({ map: tagNoteTexture(tag.text, tag.color, { fontPx: 30 }), transparent: true })
      );
      tagMesh.position.set(ti % 2 === 0 ? -0.27 : 0.27, 0.42 - Math.floor(ti / 2) * 0.52, 0.012);
      tagMesh.rotation.z = TAG_TILT[ti % TAG_TILT.length];
      g.add(tagMesh);
    });
    // pulse ring hint on the module
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.07, 0.095, 24),
      new THREE.MeshBasicMaterial({ color: 0xc41e3a, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
    );
    ring.userData.phase = mi * 1.3;
    ring.position.set(0.48, 1.12, 0.014);
    g.add(ring);
    pins.push(ring);
    makeInteractive(g, {
      id: `skill-${mod.id}`,
      label: l(`🏷️ ${t(mod.title, "en")} — see details`, `🏷️ ${t(mod.title, "zh")}——查看详情`),
      action: () => {
        focusCam(WALL_CAM, WALL_TARGET, "map");
        cb.onOpenPapers(mod.id);
      },
    });
  });

  // click the cork itself → just focus the wall
  makeInteractive(cork, {
    id: "skillwall",
    label: l("🏷️ My skills wall — click to zoom in", "🏷️ 我的能力墙——点击放大"),
    action: () => focusCam(WALL_CAM, WALL_TARGET, "map"),
  });

  /** switch UI language — regenerates the wall's canvas-texture labels */
  function setLang(lang: Lang) {
    if (lang === currentLang) return;
    currentLang = lang;
    langMats.forEach(({ mat, make }) => {
      const old = mat.map;
      mat.map = make(lang);
      mat.needsUpdate = true;
      old?.dispose();
    });
  }

  // ----------------------------------------------------------
  // Desk (user-scanned GLB) — center of the room, extra large
  // ----------------------------------------------------------
  const deskG = new THREE.Group();
  deskG.position.set(-0.3, 0, -1.3);
  room.add(deskG);

  const DESK_TOP_Y = 0.972;
  gltfLoader.load("/models/desk.glb", (gltf) => {
    // bigger again: ~4.1m wide × 0.97m high × 1.5m deep
    const { group } = prepSized(gltf.scene, [3.8, 2.7, 3.3]);
    deskG.add(group);
  });

  // ---- computer monitor (procedural, drives the project player) — enlarged ----
  const computer = new THREE.Group();
  computer.position.set(-0.85, DESK_TOP_Y, -0.42);
  deskG.add(computer);

  computer.add(box(1.8, 1.16, 0.07, std(0x16181d, 0.4, 0.3), 0, 0.72, 0));
  const screenTexObj = screenTexture();
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.64, 1.0),
    new THREE.MeshBasicMaterial({ map: screenTexObj })
  );
  screen.position.set(0, 0.72, 0.041);
  computer.add(screen);
  computer.add(box(0.13, 0.24, 0.06, std(0x16181d, 0.4, 0.3), 0, 0.1, -0.02));
  computer.add(box(0.5, 0.03, 0.34, std(0x16181d, 0.4, 0.3), 0, 0.015, 0.05));

  const focusScreen = () => {
    const wp = new THREE.Vector3();
    screen.getWorldPosition(wp);
    focusCam([wp.x, wp.y, wp.z + 1.35], [wp.x, wp.y, wp.z], "screen");
  };

  makeInteractive(computer, {
    id: "computer",
    label: l("💻 Click to sit down & browse my internships", "💻 点击坐下，看看我的实习经历"),
    action: focusScreen,
  });

  // keyboard (user scan) — laid flat on the desk, also enters the project player
  const kbG = new THREE.Group();
  kbG.position.set(-0.85, DESK_TOP_Y, 0.42);
  deskG.add(kbG);
  gltfLoader.load("/models/keyboard.glb", (gltf) => {
    const { group } = prepSized(gltf.scene, 0.5); // → ~0.55m wide
    group.rotation.x = -Math.PI / 2; // scan stands upright — lay it flat; top row faces the blackboard
    group.scale.z = -1; // mirror front-back: wedge high side toward the monitor (letters stay readable)
    group.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => { m.side = THREE.DoubleSide; });
      }
    });
    kbG.add(group);
  });
  makeInteractive(kbG, {
    id: "keyboard",
    label: l("⌨️ Click to sit down & browse my internships", "⌨️ 点击坐下，看看我的实习经历"),
    action: focusScreen,
  });

  // mouse (user scan) beside the keyboard — head points toward the blackboard
  const mouseG = new THREE.Group();
  mouseG.position.set(-0.28, DESK_TOP_Y, 0.45);
  mouseG.rotation.y = -Math.PI / 2;
  deskG.add(mouseG);
  gltfLoader.load("/models/mouse.glb", (gltf) => {
    const { group } = prepSized(gltf.scene, 0.14); // → ~0.16m long
    mouseG.add(group);
  });
  makeInteractive(mouseG, {
    id: "mouse",
    label: l("🖱️ Click to sit down & browse my internships", "🖱️ 点击坐下，看看我的实习经历"),
    action: focusScreen,
  });

  // ---- water cup (user scan) — nudged outward toward the chair ----
  const mug = new THREE.Group();
  mug.position.set(0.75, DESK_TOP_Y, 0.3);
  deskG.add(mug);
  gltfLoader.load("/models/水杯.glb", (gltf) => {
    mug.add(prepSized(gltf.scene, 0.16).group); // → ~0.11m tall
  });

  // ---- pen holder behind the mug, enlarged ----
  const penG = new THREE.Group();
  penG.position.set(0.9, DESK_TOP_Y, -0.14);
  deskG.add(penG);
  gltfLoader.load("/models/penholder.glb", (gltf) => {
    penG.add(prepSized(gltf.scene, 0.24).group); // → ~0.26m tall
  });

  // ---- desk lamp (user scan, enlarged) — moved toward the center ----
  const lampG = new THREE.Group();
  lampG.position.set(1.5, DESK_TOP_Y, -0.46);
  deskG.add(lampG);
  gltfLoader.load("/models/lamp.glb", (gltf) => {
    const { group } = prepSized(gltf.scene, 0.9); // → ~0.75m tall
    group.rotation.y = Math.PI; // arm reaches over the desk, not off the edge
    lampG.add(group);
  });
  const deskLampLight = new THREE.PointLight(0xffc978, 5, 3.6, 1.8);
  deskLampLight.position.set(1.3, DESK_TOP_Y + 0.55, -0.28);
  deskG.add(deskLampLight);
  let deskLampOn = true;
  makeInteractive(lampG, {
    id: "desklamp",
    label: l("💡 Desk lamp — click to switch on / off", "💡 台灯——点击开灯 / 关灯"),
    action: () => {
      deskLampOn = !deskLampOn;
      gsap.to(deskLampLight, { intensity: deskLampOn ? 5 : 0, duration: 0.5 });
    },
  });

  // ---- phone (user scan, bigger & moved forward) — next to the monitor ----
  const phoneG = new THREE.Group();
  phoneG.position.set(0.25, DESK_TOP_Y, -0.15);
  phoneG.rotation.y = 0.5; // scan's screen is yawed — face it toward the chair
  deskG.add(phoneG);
  // invisible projection plane matching the scan's own screen (drives the GIF overlay)
  const phoneScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.17, 0.4),
    new THREE.MeshBasicMaterial({ color: 0x0a0f1e })
  );
  phoneScreen.position.set(0, 0.242, 0.097);
  phoneScreen.visible = false; // the scan already has its own screen — no dark plate
  phoneG.add(phoneScreen);
  gltfLoader.load("/models/phone.glb", (gltf) => {
    phoneG.add(prepSized(gltf.scene, 0.46).group); // → ~0.49m tall
  });
  makeInteractive(phoneG, {
    id: "phone",
    label: l("📱 Phone — zoom in for my contact card", "📱 手机——放大看我的名片"),
    action: () => {
      const wp = new THREE.Vector3();
      phoneScreen.getWorldPosition(wp);
      // approach from front-above-side so the chair never blocks the view
      focusCam([wp.x + 0.26, wp.y + 0.24, wp.z + 0.44], [wp.x, wp.y, wp.z], "phone");
    },
  });

  // ---- vinyl record player (split model — the platter spins while music plays) ----
  const vinylG = new THREE.Group();
  vinylG.position.set(1.16, DESK_TOP_Y, -0.48);
  deskG.add(vinylG);
  let vinylPivot: THREE.Group | null = null;
  gltfLoader.load("/models/播放器分割.glb", (gltf) => {
    const raw = gltf.scene;
    // platter (part_6) + record (part_9) rotate around their shared center (−0.093, −0.032 in model space)
    const platter = raw.getObjectByName("part_6");
    const record = raw.getObjectByName("part_9");
    if (platter || record) {
      const pivot = new THREE.Group();
      pivot.position.set(-0.093, 0, -0.032);
      raw.add(pivot);
      if (platter) pivot.attach(platter);
      if (record) pivot.attach(record);
      vinylPivot = pivot;
    }
    const { group } = prepSized(raw, 0.52); // → ~0.45m wide
    vinylG.add(group);
  });
  makeInteractive(vinylG, {
    id: "vinyl",
    label: l("🎵 Vinyl player — click to play / pause music", "🎵 胶片播放器——点击播放 / 暂停音乐"),
    action: () => {
      musicState.playing = !musicState.playing;
      cb.onMusicToggle(musicState.playing);
    },
  });

  // ---- desk photo frame playing home.GIF (zoom = animated overlay) ----
  const deskFrameG = new THREE.Group();
  deskFrameG.position.set(-1.45, DESK_TOP_Y, 0.18);
  deskFrameG.rotation.y = 0.35; // face the chair
  deskG.add(deskFrameG);
  deskFrameG.add(box(0.42, 0.42, 0.025, std(0xfdfcf8, 0.5), 0, 0.21, 0));
  deskFrameG.add(box(0.03, 0.1, 0.02, std(0xd8cfc0, 0.6), 0, 0.05, -0.02)); // little stand foot
  const deskFrameTex = texLoader.load("/photos/home.jpg"); // static first frame in 3D
  deskFrameTex.colorSpace = THREE.SRGBColorSpace;
  const deskFrameScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.36, 0.36),
    new THREE.MeshBasicMaterial({ map: deskFrameTex })
  );
  deskFrameScreen.position.set(0, 0.21, 0.015);
  deskFrameG.add(deskFrameScreen);
  makeInteractive(deskFrameG, {
    id: "deskframe",
    label: l("📄 My résumé — click to view & download", "📄 我的简历——点击查看 / 下载"),
    action: () => {
      const wp = new THREE.Vector3();
      deskFrameScreen.getWorldPosition(wp);
      focusCam([wp.x + 0.18, wp.y + 0.16, wp.z + 0.5], [wp.x, wp.y, wp.z], "deskframe");
    },
  });

  // ---- journal / 手帐本 (user scan, front-right corner) — click for "Hi, I'm Jinghan" ----
  const journalG = new THREE.Group();
  journalG.position.set(1.72, DESK_TOP_Y, 0.3);
  journalG.rotation.y = -0.35; // face the chair
  deskG.add(journalG);
  gltfLoader.load("/models/手帐本.glb", (gltf) => {
    journalG.add(prepSized(gltf.scene, 0.42).group); // → ~0.45m wide
  });
  makeInteractive(journalG, {
    id: "journal",
    label: l("📖 My journal — Hi, I'm Jinghan!", "📖 我的手帐本——嗨，我是静涵！"),
    action: () => cb.onOpenAbout(),
  });

  // ---- horse ornament (user scan) — behind the journal, facing the chair ----
  const horseG = new THREE.Group();
  horseG.position.set(1.62, DESK_TOP_Y, -0.02);
  horseG.rotation.y = -0.35;
  deskG.add(horseG);
  gltfLoader.load("/models/马摆件.glb", (gltf) => {
    horseG.add(prepSized(gltf.scene, 0.26).group); // → ~0.22m tall
  });
  makeInteractive(horseG, {
    id: "horse",
    label: l("🐎 A little horse — 马到成功!", "🐎 小马摆件——马到成功！"),
    action: () => gsap.to(horseG.rotation, { y: horseG.rotation.y + Math.PI * 2, duration: 0.9, ease: "power2.inOut" }),
  });

  // ---- little succulent on the desk's back-left corner ----
  const deskSuccG = new THREE.Group();
  deskSuccG.position.set(-1.78, DESK_TOP_Y, -0.48);
  deskG.add(deskSuccG);
  gltfLoader.load("/models/多肉2.glb", (gltf) => {
    deskSuccG.add(prepSized(gltf.scene, 0.17).group); // → ~0.17m tall
  });

  // ----------------------------------------------------------
  // Red swivel chair (user scan) — in front of the desk, spins
  // ----------------------------------------------------------
  const chairG = new THREE.Group();
  chairG.position.set(0.15, 0, 0.55);
  room.add(chairG);
  gltfLoader.load("/models/chair.glb", (gltf) => {
    const m = prepModel(gltf.scene, 1.65); // bigger, matches the bigger desk
    chairG.add(m);
  });
  let chairSpinning = true;
  let chairSpeed = 0.25;
  makeInteractive(chairG, {
    id: "chair",
    label: l("🪑 Red chair — click to spin / stop", "🪑 红色转椅——点击旋转 / 停下"),
    action: () => {
      chairSpinning = !chairSpinning;
      if (chairSpinning) chairSpeed = 2.2;
    },
  });

  // ----------------------------------------------------------
  // Dog bed + Ben (user scans)
  // ----------------------------------------------------------
  const bedG = new THREE.Group();
  bedG.position.set(2.2, 0, 1.5); // moved toward the rug center
  bedG.rotation.y = -0.6;
  room.add(bedG);
  gltfLoader.load("/models/dogbed.glb", (gltf) => bedG.add(prepModel(gltf.scene, 1.3)));

  const dogG = new THREE.Group();
  dogG.position.set(0, 0.24, 0);
  dogG.rotation.y = 0.9;
  bedG.add(dogG);
  gltfLoader.load("/models/dog.glb", (gltf) => dogG.add(prepModel(gltf.scene, 1.15)));
  makeInteractive(dogG, {
    id: "dog",
    label: l("🐕 Ben the labrador — pat him!", "🐕 拉布拉多大奔——摸摸他！"),
    action: () => {
      gsap.to(dogG.rotation, { z: 0.12, duration: 0.16, yoyo: true, repeat: 5, ease: "sine.inOut" });
    },
  });

  // bone on rug
  const bone = new THREE.Group();
  const boneMat = std(0xfffaf0, 0.6);
  const boneBar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.22, 8), boneMat);
  boneBar.rotation.z = Math.PI / 2;
  bone.add(boneBar);
  [[-0.11, 0.03], [-0.11, -0.03], [0.11, 0.03], [0.11, -0.03]].forEach(([bx, bz]) => {
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), boneMat);
    knob.position.set(bx, 0, bz);
    bone.add(knob);
  });
  bone.position.set(2.4, 0.05, 1.4);
  bone.rotation.y = 0.7;
  bone.castShadow = true;
  room.add(bone);

  // ----------------------------------------------------------
  // Right wall: ALL 28 photos in native aspect ratio, above the shelf
  // ----------------------------------------------------------
  const photoWall = new THREE.Group();
  photoWall.position.set(W / 2 - 0.04, 2.62, -0.7); // shifted right ~15% toward the snowboard
  photoWall.rotation.y = -Math.PI / 2;
  room.add(photoWall);

  let photoIdx = 0;

  function zoomToFrame(frameObj: THREE.Object3D, i: number) {
    photoIdx = i;
    const wp = new THREE.Vector3();
    frameObj.getWorldPosition(wp);
    focusCam([wp.x - 1.3, wp.y, wp.z], [wp.x, wp.y, wp.z], "photo");
    cb.onPhotoIndex(i);
  }

  // 3 rows in an L/P pattern — landscape photos fill L slots in data order,
  // portrait photos fill P slots; every photo keeps its native aspect
  const PH_H = 0.56, PH_GAP = 0.26, ROW_Y = [0.86, 0, -0.86];
  const aspectOf = (i: number) => PHOTO_ASPECTS[i] || 1.33;
  const landQueue: number[] = [], portQueue: number[] = [];
  PHOTOS.forEach((_, i) => (aspectOf(i) >= 1 ? landQueue : portQueue).push(i));
  const wallOrder: (number | null)[][] = PHOTO_WALL_PATTERN.map((row) =>
    row.split("").map((ch) => (ch === "L" ? landQueue.shift() ?? null : portQueue.shift() ?? null))
  );
  wallOrder.forEach((rowIdxs, row) => {
    const aspects = rowIdxs.map((i) => (i === null ? 1.33 : aspectOf(i)));
    const rowWidth = aspects.reduce((acc, asp) => acc + PH_H * asp, 0) + PH_GAP * (rowIdxs.length - 1);
    let xCursor = -rowWidth / 2;
    rowIdxs.forEach((i, c) => {
      if (i === null) return;
      const ph = PHOTOS[i];
      const fh = PH_H, fw = PH_H * aspects[c];
      const fx = xCursor + fw / 2;
      xCursor += fw + PH_GAP;
      const fy = ROW_Y[row];

      const g = new THREE.Group();
      g.position.set(fx, fy, 0);
      // simple pale-wood frame
      g.add(box(fw + 0.1, fh + 0.1, 0.04, std(0xe8dfd0, 0.65), 0, 0, 0));
      g.add(box(fw + 0.04, fh + 0.04, 0.045, std(0xfdfcf8, 0.55), 0, 0, 0.004)); // thin mat
      const t = texLoader.load(ph.src);
      t.colorSpace = THREE.SRGBColorSpace;
      const img = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh), new THREE.MeshBasicMaterial({ map: t }));
      img.position.z = 0.028;
      g.add(img);
      g.rotation.z = ((i * 37) % 5 - 2) * 0.01; // very subtle, varied tilts
      photoWall.add(g);
      makeInteractive(g, {
        id: `photo-${i}`,
        label: l("🖼️ Click to zoom into this photo", "🖼️ 点击放大这张照片"),
        action: () => zoomToFrame(g, i),
      });
    });
  });

  function photoNav(dir: number) {
    const next = (photoIdx + dir + PHOTOS.length) % PHOTOS.length;
    const g = photoWall.children.find(
      (o) => o.userData.interact && (o.userData.interact as InteractData).id === `photo-${next}`
    );
    if (g) zoomToFrame(g, next);
  }

  // ---- bookshelf (user scan, updated) below the photo wall + decor on top ----
  const shelfG = new THREE.Group();
  shelfG.position.set(W / 2 - 0.45, 0, -0.7); // shifted right together with the photo wall
  shelfG.rotation.y = -Math.PI / 2; // face the room
  room.add(shelfG);
  gltfLoader.load("/models/bookshelf.glb", (gltf) => {
    const { group, size } = prepSized(gltf.scene, 3.6); // doubled per request
    shelfG.add(group);
    makeInteractive(group, {
      id: "bookshelf",
      label: l("🎓 My bookshelf — see my education", "🎓 我的书架——看看我的学历"),
      action: () => cb.onOpenEducation(),
    });
    const topY = size.y + 0.005;
    const topZ = -size.z / 2 + 0.22;

    // succulents — 4 pots, tightly clustered at the RIGHT end, sizes staggered
    gltfLoader.load("/models/succulent.glb", (g2) => {
      const pot = prepSized(g2.scene, 0.34); // biggest
      pot.group.position.set(1.02, topY, topZ);
      shelfG.add(pot.group);
    });
    gltfLoader.load("/models/多肉3.glb", (g2) => {
      const p = prepSized(g2.scene, 0.18); // small
      p.group.position.set(1.3, topY, topZ);
      shelfG.add(p.group);
    });
    gltfLoader.load("/models/多肉4.glb", (g2) => {
      const p = prepSized(g2.scene, 0.25); // medium
      p.group.position.set(1.53, topY, topZ);
      shelfG.add(p.group);
      const p2 = prepSized(g2.scene.clone(true), 0.14); // tiniest
      p2.group.position.set(1.75, topY, topZ);
      shelfG.add(p2.group);
    });

    // four trophies with staggered sizes — one white keepsake + three new scans
    const trophyG = new THREE.Group();
    shelfG.add(trophyG);
    gltfLoader.load("/models/奖杯A.glb", (g2) => {
      const p = prepSized(g2.scene, 0.56); // biggest
      p.group.position.set(-1.98, topY, topZ);
      trophyG.add(p.group);
    });
    gltfLoader.load("/models/奖杯1.glb", (g2) => {
      const p = prepSized(g2.scene, 0.42); // the white keepsake, second-tallest
      p.group.position.set(-1.52, topY, topZ);
      trophyG.add(p.group);
    });
    gltfLoader.load("/models/奖杯B.glb", (g2) => {
      const p = prepSized(g2.scene, 0.32); // medium-small
      p.group.position.set(-1.12, topY, topZ);
      trophyG.add(p.group);
    });
    gltfLoader.load("/models/奖杯黄.glb", (g2) => {
      const p = prepSized(g2.scene, 0.22); // smallest, golden
      p.group.position.set(-0.78, topY, topZ);
      trophyG.add(p.group);
    });
    makeInteractive(trophyG, {
      id: "trophies",
      label: l("🏆 My trophies — click to see awards", "🏆 我的奖杯——点击查看荣誉"),
      action: () => cb.onOpenAwards(),
    });

    // camera (new scan, doubled) between trophies and projector — click to fly to the photo wall
    const camG = new THREE.Group();
    shelfG.add(camG);
    gltfLoader.load("/models/相机.glb", (g2) => {
      const p = prepSized(g2.scene, 0.62);
      p.group.position.set(-0.3, topY, topZ);
      camG.add(p.group);
    });
    makeInteractive(camG, {
      id: "camera",
      label: l("📷 My camera — click to see the photo wall", "📷 我的相机——点击去看照片墙"),
      action: () => {
        photoIdx = 0;
        cb.onPhotoIndex(0);
        focusCam([W / 2 - 2.4, 2.62, -0.7], [W / 2 - 0.04, 2.62, -0.7], "photo");
      },
    });

    // little projector on the shelf, between the camera and the plants
    gltfLoader.load("/models/projector.glb", (g2) => {
      const p = prepSized(g2.scene, 0.45); // enlarged 1.5×
      p.group.position.set(0.55, topY, topZ);
      shelfG.add(p.group);
    });
  });

  // ----------------------------------------------------------
  // Photo-wall lighting & floating shelves
  // ----------------------------------------------------------

  // warm LED strip along the TOP of the photo wall (default OFF)
  const stripMat = new THREE.MeshStandardMaterial({
    color: 0xf5ead6, emissive: 0xffe6b8, emissiveIntensity: 0, roughness: 0.6,
  });
  const strip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.045, 4.6), stripMat);
  strip.position.set(W / 2 - 0.07, 4.25, -0.7);
  room.add(strip);
  const stripLight = new THREE.PointLight(0xffe2b0, 0, 5.5, 1.8);
  stripLight.position.set(W / 2 - 0.6, 4.1, -0.7);
  room.add(stripLight);
  let stripOn = false;
  const toggleStrip = () => {
    stripOn = !stripOn;
    gsap.to(stripMat, { emissiveIntensity: stripOn ? 2.4 : 0, duration: 0.5 });
    gsap.to(stripLight, { intensity: stripOn ? 6 : 0, duration: 0.5 });
  };

  // little switch on the right wall — click to toggle the strip
  // (enlarged 2x, raised to the photo wall's last row)
  const switchG = new THREE.Group();
  switchG.position.set(W / 2 - 0.16, 1.76, 2.75);
  switchG.rotation.y = -Math.PI / 2;
  room.add(switchG);
  gltfLoader.load("/models/开关.glb", (gltf) => {
    switchG.add(prepSized(gltf.scene, 0.3).group);
  });
  makeInteractive(switchG, {
    id: "stripswitch",
    label: l("💡 Switch — photo wall light on / off", "💡 开关——照片墙灯带 开 / 关"),
    action: toggleStrip,
  });

  // wall lamp (壁灯) on the back red wall, RIGHT of the blackboard — click to switch
  const wallLampG = new THREE.Group();
  wallLampG.position.set(6.05, 3.6, -D / 2 + 0.12);
  room.add(wallLampG);
  gltfLoader.load("/models/壁灯.glb", (gltf) => {
    wallLampG.add(prepSized(gltf.scene, 0.55).group);
  });
  const wallLampLight = new THREE.PointLight(0xffd9a0, 0, 4.5, 1.8);
  wallLampLight.position.set(6.05, 3.55, -D / 2 + 0.5);
  room.add(wallLampLight);
  let wallLampOn = false;
  makeInteractive(wallLampG, {
    id: "walllamp",
    label: l("🛋 Wall lamp — click to switch on / off", "🛋 壁灯——点击开灯 / 关灯"),
    action: () => {
      wallLampOn = !wallLampOn;
      gsap.to(wallLampLight, { intensity: wallLampOn ? 6 : 0, duration: 0.5 });
    },
  });

  // floating shelves — thin light-wood boards: 1 LEFT + 2 RIGHT of the photo wall
  const floatBoard = (len: number) =>
    new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.035, len), std(0xd8c4a5, 0.55));
  const shelfDefs: { z: number; y: number; len: number }[] = [
    { z: -3.8, y: 2.5, len: 1.1 },   // left of the photo wall (moved further left)
    { z: 2.6, y: 2.45, len: 1.2 },   // right, lower (moved further right)
    { z: 2.8, y: 3.15, len: 1.0 },   // right, higher
  ];
  shelfDefs.forEach((d) => {
    const b = floatBoard(d.len);
    b.position.set(W / 2 - 0.12, d.y, d.z);
    b.castShadow = true;
    room.add(b);
  });
  const shelfTop = (i: number) => shelfDefs[i].y + 0.018;
  const shelfX = W / 2 - 0.12;
  const putOnShelf = (path: string, size: number, shelfIdx: number, z: number, ry = 0) => {
    gltfLoader.load(path, (g) => {
      const p = prepSized(g.scene, size);
      p.group.position.set(shelfX, shelfTop(shelfIdx), z);
      p.group.rotation.y = ry;
      room.add(p.group);
    });
  };
  // left shelf: a book + a small succulent
  putOnShelf("/models/书本1.glb", 0.3, 0, -4.0);
  putOnShelf("/models/多肉3.glb", 0.13, 0, -3.55);
  // right-lower shelf: ornament 1 + a book + a tiny succulent
  putOnShelf("/models/摆件1.glb", 0.24, 1, 2.25);
  putOnShelf("/models/书本2.glb", 0.28, 1, 2.65);
  putOnShelf("/models/多肉4.glb", 0.11, 1, 3.0);
  // right-higher shelf: ornament 2 + a small succulent
  putOnShelf("/models/摆件2.glb", 0.24, 2, 2.65);
  putOnShelf("/models/多肉2.glb", 0.14, 2, 3.0);


  // ---- monstera (龟背竹, enlarged) — moved back into the corner ----
  const monsteraG = new THREE.Group();
  monsteraG.position.set(5.7, 0, -4.7);
  room.add(monsteraG);
  gltfLoader.load("/models/monstera.glb", (gltf) => {
    monsteraG.add(prepSized(gltf.scene, 2.6).group); // → ~2.1m tall
  });

  // ----------------------------------------------------------
  // Floor lamp (BIGGER) — click to cool & dim the room
  // ----------------------------------------------------------
  const floorLampG = new THREE.Group();
  floorLampG.position.set(-5.6, 0, -4.65); // tucked into the back-left corner
  room.add(floorLampG);
  gltfLoader.load("/models/floorlamp.glb", (gltf) => {
    const { group } = prepSized(gltf.scene, 1.8); // → ~2.1m tall
    floorLampG.add(group);
  });
  const flLight = new THREE.PointLight(0xffb26b, 9, 7, 1.7);
  flLight.position.set(-5.6, 2.0, -4.65);
  room.add(flLight);

  let coolMode = false;
  makeInteractive(floorLampG, {
    id: "floorlamp",
    label: l("🛋️ Floor lamp — click for cool evening mood", "🛋️ 落地灯——点击切换清凉夜晚模式"),
    action: () => {
      coolMode = !coolMode;
      gsap.to(sun, { intensity: coolMode ? 0.4 : 2.4, duration: 1.2 });
      gsap.to(fill, { intensity: coolMode ? 0.95 : 0.5, duration: 1.2 });
      gsap.to(renderer, { toneMappingExposure: coolMode ? 0.85 : 1.15, duration: 1.2 });
      sun.color.set(coolMode ? 0xbfd4ff : 0xffe7c4);
      flLight.intensity = coolMode ? 15 : 9;
      deskLampLight.intensity = coolMode ? 9 : 5;
    },
  });

  // ----------------------------------------------------------
  // Raycasting / hover / click
  // ----------------------------------------------------------
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hoveredRoot: THREE.Object3D | null = null;
  let downPos: [number, number] | null = null;
  let disposed = false;

  function rootOf(obj: THREE.Object3D | null): THREE.Object3D | null {
    let o = obj;
    while (o) {
      if (o.userData.interact) return o;
      o = o.parent;
    }
    return null;
  }

  function pick(ev: PointerEvent | MouseEvent): THREE.Object3D | null {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(interactives, true);
    return hits.length ? rootOf(hits[0].object) : null;
  }

  function onMove(ev: PointerEvent) {
    if (mode !== "home") return;
    const root = pick(ev);
    if (root !== hoveredRoot) {
      if (hoveredRoot) gsap.to(hoveredRoot.scale, { x: 1, y: 1, z: 1, duration: 0.25, ease: "power2.out" });
      hoveredRoot = root;
      if (root) {
        gsap.to(root.scale, { x: 1.05, y: 1.05, z: 1.05, duration: 0.25, ease: "back.out(3)" });
        canvas.style.cursor = "pointer";
        cb.onHover(root.userData.interact.label);
      } else {
        canvas.style.cursor = "grab";
        cb.onHover(null);
      }
    }
  }

  const clickSound = new Audio("/audio/click.mp3");
  clickSound.volume = 0.35;

  function onClick(ev: MouseEvent) {
    if (mode !== "home") return;
    if (downPos) {
      const dx = ev.clientX - downPos[0];
      const dy = ev.clientY - downPos[1];
      if (dx * dx + dy * dy > 36) return;
    }
    const root = pick(ev);
    if (!root) return;
    try { clickSound.currentTime = 0; void clickSound.play().catch(() => {}); } catch { /* noop */ }
    (root.userData.interact as InteractData).action();
  }

  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerdown", (ev) => { downPos = [ev.clientX, ev.clientY]; });
  canvas.addEventListener("click", onClick);

  // double-click any surface → smoothly re-center the orbit on that point and dolly in
  function onDblClick(ev: MouseEvent) {
    if (mode !== "home") return;
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(room.children, true);
    if (!hits.length) return;
    const p = hits[0].point;
    const dir = camera.position.clone().sub(controls.target).normalize();
    const dist = Math.max(2.2, camera.position.distanceTo(p) * 0.55);
    gsap.to(controls.target, { x: p.x, y: p.y, z: p.z, duration: 0.7, ease: "power3.inOut" });
    gsap.to(camera.position, {
      x: p.x + dir.x * dist, y: p.y + dir.y * dist, z: p.z + dir.z * dist,
      duration: 0.7, ease: "power3.inOut",
    });
  }
  canvas.addEventListener("dblclick", onDblClick);

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onResize);

  // ----------------------------------------------------------
  // Screen-rect projection (computer & phone overlay players)
  // ----------------------------------------------------------
  function meshCorners(w: number, h: number): THREE.Vector3[] {
    return [
      new THREE.Vector3(-w / 2, h / 2, 0.002),
      new THREE.Vector3(w / 2, h / 2, 0.002),
      new THREE.Vector3(w / 2, -h / 2, 0.002),
      new THREE.Vector3(-w / 2, -h / 2, 0.002),
    ];
  }
  const compCorners = meshCorners(1.64, 1.0);
  const phoneCorners = meshCorners(0.17, 0.4);
  const frameCorners = meshCorners(0.36, 0.36);
  const tmpV = new THREE.Vector3();

  function emitScreenRect() {
    const mesh =
      mode === "screen" ? screen :
      mode === "phone" ? phoneScreen :
      mode === "deskframe" ? deskFrameScreen : null;
    const corners =
      mode === "screen" ? compCorners :
      mode === "phone" ? phoneCorners : frameCorners;
    if (!mesh) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const c of corners) {
      tmpV.copy(c);
      mesh.localToWorld(tmpV);
      tmpV.project(camera);
      const px = (tmpV.x * 0.5 + 0.5) * window.innerWidth;
      const py = (-tmpV.y * 0.5 + 0.5) * window.innerHeight;
      minX = Math.min(minX, px); maxX = Math.max(maxX, px);
      minY = Math.min(minY, py); maxY = Math.max(maxY, py);
    }
    cb.onScreenRect({ left: minX, top: minY, width: maxX - minX, height: maxY - minY });
  }

  // ----------------------------------------------------------
  // Animation loop
  // ----------------------------------------------------------
  const clock = new THREE.Clock();
  function animate() {
    if (disposed) return;
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const t = clock.elapsedTime;

    if (chairSpinning) {
      chairG.rotation.y += chairSpeed * dt;
      chairSpeed += (0.25 - chairSpeed) * dt * 0.8;
    }
    if (musicState.playing && vinylPivot) {
      vinylPivot.rotation.y += 2.4 * dt; // turntable spins while the music plays
    }
    pins.forEach((ring) => {
      const s = 1 + 0.35 * Math.sin(t * 2.4 + ring.userData.phase);
      ring.scale.set(s, s, 1);
      (ring.material as THREE.MeshBasicMaterial).opacity = 0.45 + 0.35 * Math.sin(t * 2.4 + ring.userData.phase);
    });
    bulbs.forEach((b) => {
      (b.material as THREE.MeshStandardMaterial).emissiveIntensity =
        2.0 + 0.6 * Math.sin(t * 2.2 + b.userData.phase);
    });

    controls.update();
    emitScreenRect();
    renderer.render(scene, camera);
  }
  animate();

  return {
    backToRoom,
    posterNav,
    photoNav,
    setMusic: (playing: boolean) => { musicState.playing = playing; },
    setLang,
    dispose: () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("click", onClick);
      controls.dispose();
      renderer.dispose();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const m = o.material as THREE.Material | THREE.Material[];
          (Array.isArray(m) ? m : [m]).forEach((mm) => mm.dispose());
        }
      });
    },
  };
}
