import cv2
import os

video_path = "public/video/Wall Section Video.mp4"
output_dir = "public/sequence_wall"

os.makedirs(output_dir, exist_ok=True)

# Clean existing sequence frames
for f in os.listdir(output_dir):
    if f.startswith("frame_") and f.endswith(".jpg"):
        os.remove(os.path.join(output_dir, f))

cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    print(f"[ERROR] Could not open video file: {video_path}")
    exit(1)

fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
duration = total_frames / fps if fps > 0 else 0

target_frames = 300
step = max(1, total_frames // target_frames)

print(f"Wall Section Video Duration: {duration:.2f}s | Total Frames: {total_frames} | Target: {target_frames}")

saved_count = 0
cur_f = 0

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    if cur_f % step == 0 and saved_count < target_frames:
        saved_count += 1
        output_filename = os.path.join(output_dir, f"frame_{saved_count:04d}.jpg")
        h, w = frame.shape[:2]
        new_w = 1920
        new_h = int(h * (new_w / w))
        resized = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_AREA)
        cv2.imwrite(output_filename, resized, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
    cur_f += 1

cap.release()
print(f"[SUCCESS] Extracted {saved_count} HD frames to {output_dir}")
