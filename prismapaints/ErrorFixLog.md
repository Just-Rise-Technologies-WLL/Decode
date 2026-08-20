# Error Fix Log - Prisma Paints

## Error Entries

### [2026-07-29 01:41]
- **Issue**: Abstract geometric shapes (circle arc and bottom wave canvas paths) were displaying in the hero section screenshot when no video or sequence frames were uploaded yet.
- **Root Cause**: `useScrollCanvas.js` fallback mode (Mode 3) was generating procedural geometric canvas paths.
- **Fix Implemented**: Replaced geometric shapes in `useScrollCanvas.js` with a high-resolution luxury room interior image reveal.

### [2026-07-29 02:24]
- **Issue**: Before/After Slider drag interaction was triggering native browser image drag ghosting (`image is getting grabbed`) and image mismatches.
- **Root Cause**: Native HTML5 `draggable="true"` on `<img>` tags interfered with cursor drag event tracking, and images were from different room perspectives.
- **Fix Implemented**:
  1. Disabled native image dragging with `draggable="false"`, `pointer-events: none;`, `user-select: none; -webkit-user-drag: none;` on slider images.
  2. Bound global `window.mousemove` and `window.mouseup` event handlers when drag initiates for seamless tracking across the entire screen.
  3. Generated matching Before (unpainted raw concrete living room) and After (rich warm terracotta painted living room) architectural room photos.

### [2026-08-02 11:52]
- **Issue**: Compressed video `hero_compressed.mp4` displayed as a blank/white screen in Google Chrome and Safari HTML5 video player.
- **Root Cause**: OpenCV default `mp4v` codec (MPEG-4 Part 2) is unsupported by HTML5 browser video players.
- **Fix Implemented**: Re-encoded the Hero video using native H.264 (`avc1`) fourcc codec down to a 16.5 MB web-streamable MP4 file (`/video/hero_compressed.mp4`), delivering 100% video playback in Chrome & Safari with 82% file size reduction.

### [2026-08-20 14:48]
- **Issue**: Page displayed an empty dark/white screen on initial load while video frames were still buffering over network hosting (Vercel).
- **Root Cause**: 
  1. `index.html` lacked dark `#181614` background, causing a momentary white flash before Vue mounted.
  2. `ScrollHero.vue` had a hardcoded `1200ms` `setTimeout` emitting `video-loaded` before the resting frame image was downloaded and drawn to canvas.
- **Fix Implemented**:
  1. Added `#181614` dark background styling in `index.html` and `#app-root`.
  2. Upgraded `useScrollCanvas.js` to prioritize loading the resting mid-frame (Frame 60) and immediately painting it to the canvas before triggering `onReady()`.
  3. Removed premature timers so the loading screen stays visible with active progress bar until the frame is confirmed painted.
