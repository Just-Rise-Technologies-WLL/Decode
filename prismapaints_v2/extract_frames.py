import cv2
import os

video1_path = "public/video/begin-with-a-macro-frontf.mp4"
video2_path = "public/video/Vrender Company - Private Residence Exterior _ Interior 4K 3D Animation Walkthrough Video - Vrender Architectural Rendering and 3D Animation (1080p, h264).mp4"
output_dir = "public/sequence"

os.makedirs(output_dir, exist_ok=True)

# Clean existing sequence frames
for f in os.listdir(output_dir):
    if f.startswith("frame_") and f.endswith(".jpg"):
        os.remove(os.path.join(output_dir, f))

# Video 1: Full video
# Video 2: 0:05 (5 seconds) to 1:18 (78 seconds)
v2_start_sec = 5.0
v2_end_sec = 78.0

# Inspect Video 1
cap1 = cv2.VideoCapture(video1_path)
fps1 = cap1.get(cv2.CAP_PROP_FPS) or 30.0
total_f1 = int(cap1.get(cv2.CAP_PROP_FRAME_COUNT))
v1_duration = total_f1 / fps1 if fps1 > 0 else 0
cap1.release()

# Inspect Video 2
v2_duration = v2_end_sec - v2_start_sec

total_duration = v1_duration + v2_duration
total_target_frames = 350

target_f1 = max(1, int(total_target_frames * (v1_duration / total_duration)))
target_f2 = max(1, total_target_frames - target_f1)

print(f"Video 1 Duration: {v1_duration:.2f}s -> Target Frames: {target_f1}")
print(f"Video 2 Duration: {v2_duration:.2f}s -> Target Frames: {target_f2}")

saved_count = 0

# --- Process Video 1 (Full) ---
cap1 = cv2.VideoCapture(video1_path)
fps1 = cap1.get(cv2.CAP_PROP_FPS) or 30.0
step1 = max(1, total_f1 // target_f1) if target_f1 > 0 else 1

cur_f = 0
v1_saved = 0
while cap1.isOpened() and cur_f < total_f1:
    ret, frame = cap1.read()
    if not ret:
        break
    if cur_f % step1 == 0 and v1_saved < target_f1:
        saved_count += 1
        v1_saved += 1
        output_filename = os.path.join(output_dir, f"frame_{saved_count:04d}.jpg")
        h, w = frame.shape[:2]
        new_w = 1920
        new_h = int(h * (new_w / w))
        resized = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_AREA)
        cv2.imwrite(output_filename, resized, [int(cv2.IMWRITE_JPEG_QUALITY), 88])
    cur_f += 1
cap1.release()

# --- Process Video 2 (0:05s to 1:18min) ---
cap2 = cv2.VideoCapture(video2_path)
fps2 = cap2.get(cv2.CAP_PROP_FPS) or 30.0
v2_start_frame = int(v2_start_sec * fps2)
v2_end_frame = int(v2_end_sec * fps2)
total_f2_range = v2_end_frame - v2_start_frame
step2 = max(1, total_f2_range // target_f2) if target_f2 > 0 else 1

cap2.set(cv2.CAP_PROP_POS_FRAMES, v2_start_frame)
cur_f = v2_start_frame
v2_saved = 0
while cap2.isOpened() and cur_f <= v2_end_frame:
    ret, frame = cap2.read()
    if not ret:
        break
    if (cur_f - v2_start_frame) % step2 == 0 and v2_saved < target_f2:
        saved_count += 1
        v2_saved += 1
        output_filename = os.path.join(output_dir, f"frame_{saved_count:04d}.jpg")
        h, w = frame.shape[:2]
        new_w = 1920
        new_h = int(h * (new_w / w))
        resized = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_AREA)
        cv2.imwrite(output_filename, resized, [int(cv2.IMWRITE_JPEG_QUALITY), 88])
    cur_f += 1
cap2.release()

print(f"\n[SUCCESS] Extracted total {saved_count} frames ({v1_saved} from Video 1 + {v2_saved} from Video 2) to {output_dir}")
