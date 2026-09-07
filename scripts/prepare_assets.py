"""Prepare web assets: compress photos, resize animated GIFs, copy audio/map."""
from pathlib import Path
from PIL import Image, ImageSequence, ImageOps
import shutil

SRC_PHOTOS = Path("/Users/sirazhang/Downloads/照片素材")
SRC_WEB = Path("/Users/sirazhang/Documents/kimi/workspace/personal_web/public")
OUT = Path("/Users/sirazhang/Documents/kimi/workspace/3d-office/public")

for d in ["photos", "posters", "projects", "audio", "textures"]:
    (OUT / d).mkdir(parents=True, exist_ok=True)


def compress_photo(src: Path, dst: Path, max_px=1600, quality=82):
    im = Image.open(src)
    im = ImageOps.exif_transpose(im)  # honor EXIF orientation
    im = im.convert("RGB")
    im.thumbnail((max_px, max_px), Image.LANCZOS)
    im.save(dst, "JPEG", quality=quality, optimize=True, progressive=True)
    print(f"photo {src.name} -> {dst.name}: {dst.stat().st_size//1024}KB")


def resize_gif(src: Path, dst: Path, max_w=640):
    im = Image.open(src)
    w, h = im.size
    scale = min(1.0, max_w / w)
    nw, nh = int(w * scale), int(h * scale)
    frames = []
    durations = []
    for frame in ImageSequence.Iterator(im):
        f = frame.convert("P", palette=Image.ADAPTIVE, colors=128)
        if scale < 1.0:
            f = f.resize((nw, nh), Image.LANCZOS)
        frames.append(f)
        durations.append(frame.info.get("duration", 100))
    frames[0].save(
        dst, save_all=True, append_images=frames[1:],
        duration=durations, loop=0, optimize=True, disposal=2,
    )
    print(f"gif {src.name} -> {dst.name}: {dst.stat().st_size//1024}KB ({nw}x{nh}, {len(frames)} frames)")


def compress_png(src: Path, dst: Path, max_px=1400):
    im = Image.open(src)
    im.thumbnail((max_px, max_px), Image.LANCZOS)
    im.save(dst, "PNG", optimize=True)
    print(f"png {src.name} -> {dst.name}: {dst.stat().st_size//1024}KB")


# 1) Photo wall photos
photo_files = sorted(p for p in SRC_PHOTOS.iterdir() if p.suffix.lower() in (".jpg", ".jpeg", ".png"))
for i, p in enumerate(photo_files, 1):
    compress_photo(p, OUT / "photos" / f"photo{i}.jpg")

# 2) Research posters
for name in ["research1", "research2", "research3", "research4", "research5", "research6"]:
    compress_png(SRC_WEB / "research" / f"{name}.png", OUT / "posters" / f"{name}.png")

# 3) Project GIFs (resized)
for name in ["project_new", "project1", "project2", "project3", "project4", "project5"]:
    resize_gif(SRC_WEB / "project" / f"{name}.GIF", OUT / "projects" / f"{name}.gif")
compress_png(SRC_WEB / "project" / "project6_1.png", OUT / "projects" / "project6_1.png", 1000)
compress_png(SRC_WEB / "project" / "project6_2.png", OUT / "projects" / "project6_2.png", 1000)

# 4) World map texture
shutil.copy(SRC_WEB / "map.png", OUT / "textures" / "map.png")

# 5) Audio
shutil.copy(SRC_WEB / "audio" / "click.mp3", OUT / "audio" / "click.mp3")
shutil.copy(SRC_WEB / "audio" / "moment-of-peace.mp3", OUT / "audio" / "bgm.mp3")

print("DONE")
