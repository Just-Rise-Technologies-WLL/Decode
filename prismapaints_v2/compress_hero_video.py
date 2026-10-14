import subprocess
import os

input_file = "public/video/Herosection VIdeo.mov"
output_file = "public/video/hero_compressed.mp4"

if not os.path.exists(input_file):
    print(f"[ERROR] Input video {input_file} does not exist.")
    exit(1)

print(f"Compressing {input_file} -> {output_file} with FastStart streaming flags...")

# FFmpeg H.264 compression with CRF 23, AAC audio (or no audio), and +faststart flag for instant streaming
cmd = [
    "ffmpeg", "-y",
    "-i", input_file,
    "-c:v", "libx264",
    "-crf", "23",
    "-preset", "fast",
    "-an", # Remove audio for background hero video
    "-movflags", "+faststart",
    output_file
]

try:
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    orig_size = os.path.getsize(input_file) / (1024 * 1024)
    new_size = os.path.getsize(output_file) / (1024 * 1024)
    print(f"[SUCCESS] Video compressed from {orig_size:.2f} MB down to {new_size:.2f} MB! (~{((orig_size - new_size)/orig_size)*100:.1f}% reduction)")
except Exception as e:
    print(f"[FALLBACK] ffmpeg command failed: {e}")
    # Fallback to OpenCV if ffmpeg binary is not directly available in PATH
    import cv2
    cap = cv2.VideoCapture(input_file)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_file, fourcc, fps, (w, h))
    
    count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        out.write(frame)
        count += 1
    cap.release()
    out.release()
    orig_size = os.path.getsize(input_file) / (1024 * 1024)
    new_size = os.path.getsize(output_file) / (1024 * 1024)
    print(f"[SUCCESS] OpenCV re-encoded {count} frames -> {output_file} ({new_size:.2f} MB)")
