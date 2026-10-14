import cv2
import os

hover_path = "public/final_video/mouseHover.mp4"
scroll_path = "public/final_video/mouseScroll.mp4"

print("--- Inspecting Videos ---")
cap_h = cv2.VideoCapture(hover_path)
fps_h = cap_h.get(cv2.CAP_PROP_FPS) or 30.0
total_f_h = int(cap_h.get(cv2.CAP_PROP_FRAME_COUNT))
dur_h = total_f_h / fps_h if fps_h > 0 else 0
w_h = int(cap_h.get(cv2.CAP_PROP_FRAME_WIDTH))
h_h = int(cap_h.get(cv2.CAP_PROP_FRAME_HEIGHT))
cap_h.release()
print(f"mouseHover.mp4: {w_h}x{h_h}, {fps_h:.2f} FPS, {total_f_h} frames, {dur_h:.2f}s duration")

cap_s = cv2.VideoCapture(scroll_path)
fps_s = cap_s.get(cv2.CAP_PROP_FPS) or 30.0
total_f_s = int(cap_s.get(cv2.CAP_PROP_FRAME_COUNT))
dur_s = total_f_s / fps_s if fps_s > 0 else 0
w_s = int(cap_s.get(cv2.CAP_PROP_FRAME_WIDTH))
h_s = int(cap_s.get(cv2.CAP_PROP_FRAME_HEIGHT))
cap_s.release()
print(f"mouseScroll.mp4: {w_s}x{h_s}, {fps_s:.2f} FPS, {total_f_s} frames, {dur_s:.2f}s duration")
