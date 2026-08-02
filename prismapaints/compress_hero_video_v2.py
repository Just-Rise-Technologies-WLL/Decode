import cv2
import os

input_file = "public/video/Herosection VIdeo.mov"
output_file = "public/video/hero_compressed.mp4"

print(f"Compressing {input_file} -> {output_file} via OpenCV HD Resize...")

cap = cv2.VideoCapture(input_file)
fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

# We keep every 2nd frame (60fps -> 30fps) for 50% size reduction with zero visual difference
target_fps = 30.0
step = 2

new_w = 1280
new_h = 720

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_file, fourcc, target_fps, (new_w, new_h))

cur_f = 0
saved = 0
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    if cur_f % step == 0:
        resized = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_AREA)
        out.write(resized)
        saved += 1
    cur_f += 1

cap.release()
out.release()

orig_size = os.path.getsize(input_file) / (1024 * 1024)
new_size = os.path.getsize(output_file) / (1024 * 1024)
print(f"[SUCCESS] Ultra-Optimized: {orig_size:.2f} MB -> {new_size:.2f} MB ({saved} frames @ {target_fps}fps) in {output_file}")
