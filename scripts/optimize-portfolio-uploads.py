import json
import os
import sys
from pathlib import Path

from PIL import Image, ImageOps


PROJECT_ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
DATA_PATH = PROJECT_ROOT / "src" / "data" / "portfolio-data.json"
UPLOADS_DIR = PROJECT_ROOT / "public" / "uploads"
MAX_WIDTH = 2000
MAX_SIZE = 3 * 1024 * 1024
WEBP_QUALITY = 84


def walk_strings(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, list):
        for item in value:
            yield from walk_strings(item)
    elif isinstance(value, dict):
        for item in value.values():
            yield from walk_strings(item)


def replace_strings(value, replacements):
    if isinstance(value, str):
        return replacements.get(value, value)
    if isinstance(value, list):
        return [replace_strings(item, replacements) for item in value]
    if isinstance(value, dict):
        return {key: replace_strings(item, replacements) for key, item in value.items()}
    return value


def upload_path_to_file(src):
    if not src.startswith("/uploads/"):
        return None
    candidate = (PROJECT_ROOT / "public" / src.lstrip("/")).resolve()
    try:
        candidate.relative_to(UPLOADS_DIR.resolve())
    except ValueError:
        return None
    return candidate if candidate.exists() else None


def optimize_image(path):
    original_size = path.stat().st_size

    with Image.open(path) as image:
        image = ImageOps.exif_transpose(image)
        width, height = image.size
        if width <= MAX_WIDTH and original_size <= MAX_SIZE:
            return None

        if width > MAX_WIDTH:
            next_height = max(1, round(height * (MAX_WIDTH / width)))
            image = image.resize((MAX_WIDTH, next_height), Image.Resampling.LANCZOS)

        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA" if "A" in image.getbands() else "RGB")

        output = path.with_name(f"{path.stem}-optimized.webp")
        image.save(output, "WEBP", quality=WEBP_QUALITY, method=6)

    return output


def main():
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    before_size = sum(file.stat().st_size for file in UPLOADS_DIR.glob("*") if file.is_file())
    referenced_paths = sorted({src for src in walk_strings(data) if src.startswith("/uploads/")})
    replacements = {}
    optimized_count = 0

    for src in referenced_paths:
        path = upload_path_to_file(src)
        if not path:
            continue
        output = optimize_image(path)
        if output:
            replacements[src] = f"/uploads/{output.name}"
            optimized_count += 1

    if replacements:
        data = replace_strings(data, replacements)
        DATA_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    remaining_refs = set(walk_strings(data))
    for old_src in replacements:
        old_path = upload_path_to_file(old_src)
        if old_path and old_src not in remaining_refs:
            old_path.unlink()

    after_size = sum(file.stat().st_size for file in UPLOADS_DIR.glob("*") if file.is_file())
    files = [file for file in UPLOADS_DIR.glob("*") if file.is_file()]
    largest = max(files, key=lambda file: file.stat().st_size) if files else None

    print(json.dumps({
        "optimized": optimized_count,
        "beforeBytes": before_size,
        "afterBytes": after_size,
        "largestFile": str(largest.relative_to(PROJECT_ROOT)) if largest else "",
        "largestBytes": largest.stat().st_size if largest else 0,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
