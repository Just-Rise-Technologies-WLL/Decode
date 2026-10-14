import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import os

bg_photo_path = "public/sequence/frame_0001.jpg"
logo_path = "public/images/prisma_logo.png"
output_path = "public/images/og_share_preview.png"

# Target OG standard dimensions: 1200 x 630
W, H = 1200, 630

if os.path.exists(bg_photo_path):
    bg_img = Image.open(bg_photo_path).convert("RGBA")
    # Resize and crop to fill 1200x630
    bg_ratio = bg_img.width / bg_img.height
    target_ratio = W / H
    if bg_ratio > target_ratio:
        new_h = H
        new_w = int(H * bg_ratio)
    else:
        new_w = W
        new_h = int(W / bg_ratio)
    bg_resized = bg_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    left = (new_w - W) // 2
    top = (new_h - H) // 2
    canvas = bg_resized.crop((left, top, left + W, top + H))
else:
    # Fallback to dark luxury solid canvas
    canvas = Image.new("RGBA", (W, H), (24, 22, 20, 255))

# Apply dark luxury overlay tint for high contrast (70% opacity)
overlay = Image.new("RGBA", (W, H), (20, 18, 16, 180))
canvas = Image.alpha_composite(canvas, overlay)

# Load and place Prisma Paints logo centered
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert("RGBA")
    # Resize logo width to 450px
    logo_w = 450
    logo_h = int(logo.height * (logo_w / logo.width))
    logo_resized = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
    
    # Position logo centered horizontally and slightly above vertical center
    logo_x = (W - logo_w) // 2
    logo_y = (H - logo_h) // 2 - 20
    canvas.paste(logo_resized, (logo_x, logo_y), logo_resized)

# Save final 1200x630 OpenGraph social share card
canvas_rgb = canvas.convert("RGB")
canvas_rgb.save(output_path, "PNG", quality=95)
print(f"[SUCCESS] OpenGraph Social Share Preview Image created at {output_path} (1200x630)")
