import cv2
import os

input_file = "public/video/Herosection VIdeo.mov"
output_file = "public/video/hero_compressed.mp4"

print(f"Re-encoding to native H.264 (avc1) for HTML5 browser compatibility...")

cap = cv2.VideoCapture(input_file)
fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
target_fps = 30.0
step = 2

new_w = 1280
new_h = 720

# Use 'avc1'fourcc codec for 100% HTML5 browser playback in Chrome & Safari
fourcc = cv2.VideoWriter_fourcc(*'avc1')
out = cv2.VideoWriter(output_file, fourcc, target_fps, (new_w, new_h))

if not out.isOpened():
    print("[WARNING] 'avc1' fourcc not directly supported by OpenCV backend, trying 'H264'...")
    fourcc = cv2.VideoWriter_fourcc(*'H264')
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
print(f"[SUCCESS] H.264 HTML5 Compatible Video: {orig_size:.2f} MB -> {new_size:.2f} MB ({saved} frames) in {output_file}")
