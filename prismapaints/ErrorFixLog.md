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

### [2026-08-02 10:22]
- **Issue**: Photo frame image in `RoomVisualizer.vue` failed to load over network, rendering a white blank box with broken alt text.
- **Root Cause**: External Unsplash network URL failed to fetch in the user's browser.
- **Fix Implemented**: Replaced external image URL with an embedded vector gallery artwork inside `.photo-frame-mat` (0 network dependencies, 100% reliable instant load) and upgraded wall paint blend mode to dual-layer (`color` + `multiply`) for vibrant paint hues.


