import cv2
import os

# Extract frames every 0.5s or key frames to see the rotation
os.makedirs("scratch_inspect", exist_ok=True)

cap = cv2.VideoCapture("public/final_video/mouseHover.mp4")
fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
total_f = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

# Save 10 sample frames across the video to see the motion
for i in range(10):
    f_idx = int(i * (total_f - 1) / 9)
    cap.set(cv2.CAP_PROP_POS_FRAMES, f_idx)
    ret, frame = cap.read()
    if ret:
        sec = f_idx / fps
        cv2.imwrite(f"scratch_inspect/hover_sample_{i:02d}_sec_{sec:.2f}.jpg", cv2.resize(frame, (640, 360)))
cap.release()

cap_s = cv2.VideoCapture("public/final_video/mouseScroll.mp4")
fps_s = cap_s.get(cv2.CAP_PROP_FPS) or 24.0
total_f_s = int(cap_s.get(cv2.CAP_PROP_FRAME_COUNT))

for i in range(10):
    f_idx = int(i * (total_f_s - 1) / 9)
    cap_s.set(cv2.CAP_PROP_POS_FRAMES, f_idx)
    ret, frame = cap_s.read()
    if ret:
        sec = f_idx / fps_s
        cv2.imwrite(f"scratch_inspect/scroll_sample_{i:02d}_sec_{sec:.2f}.jpg", cv2.resize(frame, (640, 360)))
cap_s.release()

print("Extracted inspection samples to scratch_inspect")
