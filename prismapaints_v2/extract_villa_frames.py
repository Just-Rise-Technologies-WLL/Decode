import cv2
import os
from PIL import Image

video_path = "/Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints_v2/1013(2).mp4"
out_dir = "/Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints_v2/public/sequence_villa"

os.makedirs(out_dir, exist_ok=True)

# Clean existing directory if any
for f in os.listdir(out_dir):
    if f.endswith(".webp") or f.endswith(".jpg") or f.endswith(".png"):
        try:
            os.remove(os.path.join(out_dir, f))
        except Exception:
            pass

cap = cv2.VideoCapture(video_path)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
fps = cap.get(cv2.CAP_PROP_FPS) or 30.0

print(f"Extracting villa frames from {video_path}: Total {total_frames} frames, {fps} FPS...")

# Target around 300 high quality frames for smooth scroll scrubbing without excessive download size
TARGET_FRAMES = 300
indices = [int(i * (total_frames - 1) / (TARGET_FRAMES - 1)) for i in range(TARGET_FRAMES)]

count = 0
for idx in indices:
    cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
    ret, frame = cap.read()
    if not ret:
        break
    count += 1
    
    # Convert BGR to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(rgb_frame)
    
    # Ensure 1920 width, maintain aspect ratio
    w, h = img.size
    if w != 1920:
        new_h = int(h * (1920 / w))
        img = img.resize((1920, new_h), Image.Resampling.LANCZOS)
    
    out_file = os.path.join(out_dir, f"villa_{count:04d}.webp")
    # Save optimized WebP
    img.save(out_file, "WEBP", quality=82, method=4)
    if count % 50 == 0 or count == TARGET_FRAMES:
        print(f"Saved {count}/{TARGET_FRAMES} frames...")

cap.release()
print(f"Extraction complete! Successfully created {count} WebP frames in {out_dir}")
