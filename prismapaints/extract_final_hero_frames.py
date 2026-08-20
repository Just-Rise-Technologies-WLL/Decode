import cv2
import os

hover_video = "public/final_video/mouseHover.mp4"
scroll_video = "public/final_video/mouseScroll.mp4"

hover_out_dir = "public/sequence_hover"
scroll_out_dir = "public/sequence"

os.makedirs(hover_out_dir, exist_ok=True)
os.makedirs(scroll_out_dir, exist_ok=True)

# 1. Clean existing sequence directories
for f in os.listdir(hover_out_dir):
    if f.endswith(".jpg"):
        os.remove(os.path.join(hover_out_dir, f))

for f in os.listdir(scroll_out_dir):
    if f.endswith(".jpg"):
        os.remove(os.path.join(scroll_out_dir, f))

# 2. Extract Hover Sequence (0.00s to 5.00s)
# 5 seconds at 24fps = 120 frames. Mid frame = 60
cap_h = cv2.VideoCapture(hover_video)
fps_h = cap_h.get(cv2.CAP_PROP_FPS) or 24.0
total_h_frames = int(cap_h.get(cv2.CAP_PROP_FRAME_COUNT))
h_end_frame = min(total_h_frames, int(5.0 * fps_h))  # 5.0 seconds

print(f"Extracting Hover frames: 0 to {h_end_frame} (from total {total_h_frames})...")
hover_count = 0
cur_f = 0
while cap_h.isOpened() and cur_f < h_end_frame:
    ret, frame = cap_h.read()
    if not ret:
        break
    hover_count += 1
    out_name = os.path.join(hover_out_dir, f"hover_{hover_count:04d}.jpg")
    h, w = frame.shape[:2]
    # Ensure 1920 width
    if w != 1920:
        new_w = 1920
        new_h = int(h * (new_w / w))
        frame = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_AREA)
    cv2.imwrite(out_name, frame, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
    cur_f += 1
cap_h.release()
print(f"-> Extracted {hover_count} hover frames to {hover_out_dir} (Mid-frame: {hover_count // 2})")

# 3. Extract Scroll Walkthrough Sequence (All 240 frames of mouseScroll.mp4)
cap_s = cv2.VideoCapture(scroll_video)
fps_s = cap_s.get(cv2.CAP_PROP_FPS) or 24.0
total_s_frames = int(cap_s.get(cv2.CAP_PROP_FRAME_COUNT))

print(f"Extracting Scroll walkthrough frames: 0 to {total_s_frames}...")
scroll_count = 0
while cap_s.isOpened() and scroll_count < total_s_frames:
    ret, frame = cap_s.read()
    if not ret:
        break
    scroll_count += 1
    out_name = os.path.join(scroll_out_dir, f"frame_{scroll_count:04d}.jpg")
    h, w = frame.shape[:2]
    if w != 1920:
        new_w = 1920
        new_h = int(h * (new_w / w))
        frame = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_AREA)
    cv2.imwrite(out_name, frame, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
cap_s.release()
print(f"-> Extracted {scroll_count} scroll walkthrough frames to {scroll_out_dir}")
