PRISMA PAINTS - VIDEO DIRECTORY

If you prefer using an MP4 / WebM video file instead of image frames:

Drop your video file here named:
public/video/hero.mp4

Keyframe Encoding Tip for FFmpeg:
ffmpeg -i your_video.mp4 -g 1 -keyint_min 1 -c:v libx264 -crf 18 hero.mp4
