import cv2
import os
from PIL import Image

base = "/Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints"
video_path = os.path.join(base, "public/final_video/BuildingHollowgram_web.mp4")

holo_hd_dir = os.path.join(base, "public/sequence_hologram")
holo_low_dir = os.path.join(base, "public/sequence_hologram_low")
seq_low_dir = os.path.join(base, "public/sequence_low")
wall_hd_dir = os.path.join(base, "public/sequence_wall")
wall_low_dir = os.path.join(base, "public/sequence_wall_low")

os.makedirs(holo_hd_dir, exist_ok=True)
os.makedirs(holo_low_dir, exist_ok=True)
os.makedirs(seq_low_dir, exist_ok=True)
os.makedirs(wall_low_dir, exist_ok=True)

# --- 1. Extract BuildingHollowgram_web.mp4 into HD and Low-Res WebP ---
cap = cv2.VideoCapture(video_path)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
print(f"BuildingHollowgram_web.mp4: {total_frames} frames, {fps} FPS")

# Target ~180 frames for smooth scroll build
TARGET_HOLO = 180
indices = [int(i * (total_frames - 1) / (TARGET_HOLO - 1)) for i in range(TARGET_HOLO)]

count = 0
for idx in indices:
    cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
    ret, frame = cap.read()
    if not ret:
        break
    count += 1
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(rgb)
    w, h = img.size
    if w != 1920:
        new_h = int(h * (1920 / w))
        img = img.resize((1920, new_h), Image.Resampling.LANCZOS)
    
    # Save HD (1080p)
    hd_out = os.path.join(holo_hd_dir, f"holo_{count:04d}.webp")
    img.save(hd_out, "WEBP", quality=82, method=2)
    
    # Save Low-Res Proxy (480x270)
    low_h = int(img.height * (480 / img.width))
    low_img = img.resize((480, low_h), Image.Resampling.BILINEAR)
    low_out = os.path.join(holo_low_dir, f"holo_{count:04d}.webp")
    low_img.save(low_out, "WEBP", quality=50, method=2)
    
    if count % 40 == 0 or count == TARGET_HOLO:
        print(f"Extracted {count}/{TARGET_HOLO} hologram frames...")
cap.release()

# --- 2. Generate Low-Res Proxies for sequence/ (3D walkthrough, 240 frames) ---
seq_src = os.path.join(base, "public/sequence")
seq_files = sorted([f for f in os.listdir(seq_src) if f.endswith(".webp") or f.endswith(".jpg")])
print(f"Generating low-res for walkthrough: {len(seq_files)} frames...")
s_count = 0
for f in seq_files:
    s_count += 1
    src_f = os.path.join(seq_src, f)
    base_n = os.path.splitext(f)[0]
    out_f = os.path.join(seq_low_dir, f"{base_n}.webp")
    if not os.path.exists(out_f):
        try:
            with Image.open(src_f) as im:
                w, h = im.size
                low_h = int(h * (480 / w))
                low_im = im.resize((480, low_h), Image.Resampling.BILINEAR)
                low_im.save(out_f, "WEBP", quality=50, method=2)
        except Exception as e:
            print(f"Error {f}: {e}")

# --- 3. Convert sequence_wall to WebP and generate Low-Res Proxies (240 frames) ---
wall_files = sorted([f for f in os.listdir(wall_hd_dir) if f.endswith(".jpg") or f.endswith(".webp")])
print(f"Processing wall sequence: {len(wall_files)} frames...")
w_count = 0
for f in wall_files:
    w_count += 1
    src_f = os.path.join(wall_hd_dir, f)
    base_n = os.path.splitext(f)[0]
    
    # Ensure HD WebP exists
    hd_webp = os.path.join(wall_hd_dir, f"{base_n}.webp")
    if not os.path.exists(hd_webp) and f.endswith(".jpg"):
        try:
            with Image.open(src_f) as im:
                im.save(hd_webp, "WEBP", quality=80, method=2)
        except Exception as e:
            pass
            
    # Ensure Low-Res WebP exists
    low_out = os.path.join(wall_low_dir, f"{base_n}.webp")
    if not os.path.exists(low_out):
        try:
            with Image.open(src_f) as im:
                w, h = im.size
                low_h = int(h * (480 / w))
                low_im = im.resize((480, low_h), Image.Resampling.BILINEAR)
                low_im.save(low_out, "WEBP", quality=50, method=2)
        except Exception as e:
            pass

print("All asset extraction and optimizations for prismapaints completed successfully!")
