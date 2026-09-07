"""Re-compress project GIFs (v3): convert frames eagerly during iteration."""
from pathlib import Path
from PIL import Image, ImageSequence

SRC = Path("/Users/sirazhang/Documents/kimi/workspace/personal_web/public/project")
OUT = Path("/Users/sirazhang/Documents/kimi/workspace/3d-office/public/projects")


def resize_gif(src: Path, dst: Path, max_w=480, max_frames=160):
    im = Image.open(src)
    total = getattr(im, "n_frames", 1)
    step = max(1, total // max_frames)
    w, h = im.size
    scale = min(1.0, max_w / w)
    nw, nh = int(w * scale), int(h * scale)
    frames, durations = [], []
    for i, fr in enumerate(ImageSequence.Iterator(im)):
        if i % step != 0:
            continue
        rgb = fr.convert("RGB")  # eager copy inside the loop
        if scale < 1.0:
            rgb = rgb.resize((nw, nh), Image.LANCZOS)
        q = rgb.quantize(colors=96, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG)
        q.info.pop("transparency", None)
        frames.append(q)
        durations.append(fr.info.get("duration", 100) * step)
    frames[0].save(dst, save_all=True, append_images=frames[1:],
                   duration=durations, loop=0, optimize=False)
    chk = Image.open(dst)
    print(f"{src.name}: -> {dst.stat().st_size//1024}KB saved_frames={getattr(chk,'n_frames',1)}")


for name in ["project_new", "project1", "project2", "project3", "project4", "project5"]:
    resize_gif(SRC / f"{name}.GIF", OUT / f"{name}.gif")
print("DONE")
