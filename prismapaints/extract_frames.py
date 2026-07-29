import cv2
import os

video_path = "public/video/Paint_bucket_color_splash_reveal_202607290340.mp4"
output_dir = "public/sequence"

os.makedirs(output_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print(f"Total video frames: {total_frames}")

# Target frame count (e.g. 90 frames for smooth scroll)
target_count = 90
step = max(1, total_frames // target_count)

frame_idx = 0
saved_count = 0

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    if frame_idx % step == 0 and saved_count < target_count:
        saved_count += 1
        output_filename = os.path.join(output_dir, f"frame_{saved_count:04d}.jpg")
        # Resize to 1920 width while maintaining aspect ratio
        h, w = frame.shape[:2]
        new_w = 1920
        new_h = int(h * (new_w / w))
        resized = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_AREA)
        cv2.imwrite(output_filename, resized, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
    
    frame_idx += 1

cap.release()
print(f"Successfully extracted {saved_count} frames to {output_dir}")
