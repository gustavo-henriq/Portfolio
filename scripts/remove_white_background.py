from pathlib import Path

import numpy as np
from PIL import Image


source = Path(r"C:\Users\Carlos\Downloads\jobhunter-logo-outfit-medium-branco-hq.png")
target = Path(__file__).resolve().parents[1] / "public" / "assets" / "jobhunter-logo-transparent.png"

image = Image.open(source).convert("RGBA")
pixels = np.array(image)
rgb = pixels[..., :3].astype(np.int16)
maximum = rgb.max(axis=2)
minimum = rgb.min(axis=2)
average = rgb.mean(axis=2)
neutral = (maximum - minimum) <= 9

fully_transparent = neutral & (average >= 238)
soft_neutral = neutral & (average >= 160) & ~fully_transparent

pixels[fully_transparent, :3] = 0
pixels[fully_transparent, 3] = 0
pixels[soft_neutral, :3] = 0
pixels[soft_neutral, 3] = np.clip((255 - average[soft_neutral]) * 2.2, 0, 255).astype(np.uint8)

Image.fromarray(pixels, "RGBA").save(target)
print(f"{target}|{image.width}x{image.height}|RGBA")
