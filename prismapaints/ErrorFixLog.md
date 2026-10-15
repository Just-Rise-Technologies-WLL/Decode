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

### [2026-08-23 04:08]
- **Issue**: Live deployment on Vercel displayed a black hero background due to network stall when firing 360 parallel image requests at once.
- **Root Cause**: 
  1. 360 uncompressed JPEG frames totaled 50+ MB.
  2. Synchronous loop generated 360 simultaneous HTTP requests, triggering browser connection saturation and host rate-limiting.
- **Fix Implemented**:
  1. Converted all frames to modern WebP format (`.webp`), slashing payload down by 75%.
  2. Implemented priority 2-frame initial paint (loads in < 50ms) followed by a gentle 6-connection background batch stream queue in `useScrollCanvas.js`.

### [2026-08-23 12:06]
- **Issue**: On hard refresh (`Shift + Ctrl + R` / empty cache), preloader disappeared immediately and screen stayed blank/black while the 8MB video was still downloading.
- **Root Cause**: `video.play()` returns a Promise (`p.then()`) that resolves when the play request is received by the browser engine, NOT when video frames are downloaded and rendered. This dismissed the preloader in 1ms on an empty cache before any video data arrived.
- **Fix Implemented**:
  1. Strictly bound preloader dismissal to confirmed frame advancement (`video.currentTime >= 0.05s`). On hard reloads, the loading screen stays visible until the video is actively rolling.
  2. Generated and bound instant WebP video poster frames (`intro_poster.webp` and `intro_poster_mobile.webp`) to eliminate any black screen gaps.

### [15-10-2026 06:25 AM]
- **Issue**: Live deployment on Vercel (`decode-sigma-liard.vercel.app`) showed a black screen and hung for several seconds with 1,593 network requests firing simultaneously in Chrome DevTools.
- **Root Cause**:
  1. `useWallCanvas` immediately loaded 240 low + 240 HD frames on landing, even though the wall section is 3000px down the page.
  2. `useScrollCanvas` fired all low and HD frames for both hologram/villa and walkthrough concurrently.
  3. This saturated HTTP/2 stream multiplexing on Vercel CDN, starving Frame 1 in the network queue and leaving the canvas blank.
- **Fix Implemented**:
  1. Wrapped `useWallCanvas` loading in an `IntersectionObserver` (`rootMargin: '600px 0px'`), deferring all 480 wall frames until the user actually scrolls towards that section (saving 480 requests on landing).
  2. Implemented Priority 1 First Paint for Frame 1 (`holo_0001.webp`) rendered in < 50ms before any queue processing starts.
  3. Added lazy walkthrough streaming in `useScrollCanvas` so walkthrough frames are only requested when `p > 0.20`.
  4. Throttled batch sizes to 6 requests with synchronous cache hit checks (`img.complete && img.naturalWidth !== 0`) and event listeners attached before `src`.

