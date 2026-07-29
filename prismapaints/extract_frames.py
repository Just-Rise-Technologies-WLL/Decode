import cv2
import os

video_path = "public/video/Vrender Company - Private Residence Exterior _ Interior 4K 3D Animation Walkthrough Video - Vrender Architectural Rendering and 3D Animation (1080p, h264).mp4"
output_dir = "public/sequence"

os.makedirs(output_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)

fps = cap.get(cv2.CAP_PROP_FPS)
if fps <= 0:
    fps = 30.0

start_sec = 18.0   # 0:18 sec
end_sec = 78.0     # 1:18 min

start_frame = int(start_sec * fps)
end_frame = int(end_sec * fps)
target_count = 300   # High-density frame count for butter-smooth motion

total_frames_in_range = end_frame - start_frame
step = max(1, total_frames_in_range // target_count)

cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)

saved_count = 0
current_frame = start_frame

while cap.isOpened() and current_frame <= end_frame:
    ret, frame = cap.read()
    if not ret:
        break
    
    if (current_frame - start_frame) % step == 0 and saved_count < target_count:
        saved_count += 1
        output_filename = os.path.join(output_dir, f"frame_{saved_count:04d}.jpg")
        
        # Resize to 1920 width while maintaining aspect ratio
        h, w = frame.shape[:2]
        new_w = 1920
        new_h = int(h * (new_w / w))
        resized = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_AREA)
        cv2.imwrite(output_filename, resized, [int(cv2.IMWRITE_JPEG_QUALITY), 88])
    
    current_frame += 1

cap.release()
print(f"Successfully extracted {saved_count} frames (from 0:18 to 1:18) to {output_dir}")
