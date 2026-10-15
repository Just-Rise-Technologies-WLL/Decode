# Activities Log - Prisma Paints

## Log Entries

### [2026-07-28 11:53]
- **Activity**: Initialized `technical_document.md`, `ActivitiesLog.md`, and `ErrorFixLog.md`.

### [2026-07-28 11:57]
- **Activity**: Built scalable Vite + Vue 3 Single-File Component (`.vue` SFC) enterprise project structure.

### [2026-07-29 01:57]
- **Activity**: Converted `FinishesGrid.vue` into a Pinned Sticky Horizontal Side-Scroll Section.

### [2026-07-29 02:17]
- **Activity**: Implemented `BeforeAfterSlider.vue` & Integrated into Finishes Banner and Landmark Projects Grid.

### [2026-07-29 02:25]
- **Activity**: Fixed Slider Dragging Interaction & Generated Matching Room Before/After Assets.

### [2026-07-29 03:09]
- **Activity**: Generated Matching Before & After Landmark Project AI Photos for All 4 Cards in `ProjectsGrid.vue`.

### [2026-07-29 05:15]
- **Activity**: Converted MP4 Video into 90 HD Frame Sequence & Connected to Canvas Hero.

### [2026-07-29 13:17]
- **Activity**: Removed Fallback Living Room Image & Updated Favicon to Prisma Logo.

### [2026-07-29 13:31]
- **Activity**: Extracted 0:18 to 1:18 Time Segment of New Client 3D Walkthrough Video into 120 HD Frames & Connected to Hero Canvas.

### [2026-07-29 13:43]
- **Activity**: Extracted 300 HD Frame Sequence & Implemented Inertial LERP Physics Engine in `useScrollCanvas.js`.

### [2026-07-30 02:25]
- **Activity**: Removed Text from Footer Logo.
- **Details**: Removed `PRISMA PAINTS` text span from `Footer.vue` to keep only the clean logo image in the footer brand section.

### [2026-08-02 02:20]
- **Activity**: Added 2-Column About Us Section to Home Page.
- **Details**: Created `src/components/about/AboutSection.vue` featuring a 2-column layout (Text column with brand story, heritage, key stats & CTA + Image column showcasing `/products/red.png`). Integrated `<AboutSection id="about" />` into `App.vue` directly following the Hero section and added an `#about` link in `Navbar.vue`.

### [2026-08-02 02:24]
- **Activity**: Implemented Scroll-Driven Rotating Product Landing Animation.

### [2026-08-14 04:36]
- **Activity**: Implemented Interactive Scroll-Driven Architectural Walkthrough Hero with Dynamic Hotspot Wall Pins & Mobile Drawer.
- **Details**: 
  - Upgraded `ScrollHero.vue` to render the 350-frame 60FPS LERP inertial sequence with room navigation pills.
  - Created `src/data/heroHotspotsData.js` with frame range intervals, wall coordinates, and paint specs.
  - Created `src/components/hero/HeroHotspotPin.vue` with radar pulse rings and toggle states.
  - Created `src/components/hero/HotspotDetailCard.vue` providing desktop floating glass card and mobile slide-up bottom sheet drawer with 1-click sample ordering, palette saving, and studio visualizer linking.
  - Updated `src/composables/useScrollCanvas.js` to expose reactive `currentFrame` and `isReady`.

### [2026-08-14 04:41]
- **Activity**: Removed Hero Frosted Card Overlay for Clean Architectural View.
- **Details**: Removed `<div class="hero-content">` and hero card overlay from `ScrollHero.vue` to allow an unobstructed, full-screen luxury view of the 3D walkthrough canvas and interactive wall hotspot pins from frame 1.

### [2026-08-14 04:47]
- **Activity**: Implemented Magnetic Scroll Curve with Focal Frame Holds for Hotspots.
- **Details**: Created piecewise plateau mapping (`mapScrollToTargetFrame`) in `useScrollCanvas.js` that automatically locks the camera on exact keyframes.

### [2026-08-14 04:51]
- **Activity**: Implemented Interactive Room & Shade Switcher Dock at Bottom of Hero.
- **Details**: Added floating glassmorphic room dock (`.room-switcher-dock`) with 4 interactive shade pills in `ScrollHero.vue`. Users can now jump directly between rooms in 1 click with smooth camera flight and active state synchronization.

### [2026-08-20 14:20]
- **Activity**: Implemented Dual-Mode Interactive Hero Canvas Engine (Mouse 3D Rotation + Scroll Walkthrough).
- **Details**:
  - Extracted 120 HD frames from `public/final_video/mouseHover.mp4` with default mid-frame (60) resting center.
  - Extracted 240 HD frames from `public/final_video/mouseScroll.mp4`.
  - Upgraded `src/composables/useScrollCanvas.js` to support dual interaction.

### [2026-08-20 14:25]
- **Activity**: Calibrated Hotspot Pins to Precise Frames and Reduced Magnetic Hold Windows.
- **Details**:
  - Calibrated Pin 1 to **Frame 130** on the Green Living Area wall panel (`x: 24%, y: 44%`).
  - Calibrated Pin 2 to **Frame 150** on the Blue Dining & Kitchen wall (`x: 18%, y: 46%`).
  - Calibrated Pin 3 to **Frame 218** on the Master Suite headboard wall (`x: 45%, y: 46%`).
  - Reduced holding plateaus in `useScrollCanvas.js` from 18% down to 7% for a 3x faster, more responsive walkthrough scroll.

### [2026-08-20 14:32]
- **Activity**: Implemented Luxury 360° Floating Magnetic Custom Cursor Follower in Hero Section.
- **Details**:
  - Added `.hero-cursor-follower` in `ScrollHero.vue` featuring a glowing gold precision dot and a glassmorphic `‹ 360° › ROTATE` badge that follows the mouse cursor.
  - Added intelligent hover detection (`isHoveringBtn`) that morphs the cursor into a magnetic focus ring when hovering over interactive elements (buttons, links, dock pills, pins).
  - Smoothly fades out during scroll walkthrough and auto-disables on touch screens.

### [2026-08-20 14:48]
- **Activity**: Synchronized Preloader Dismissal with Confirmed 1st Frame Painting.
- **Details**:
  - Eliminated initial white background by adding `#181614` styling directly to `index.html` and `#app-root`.
  - Upgraded `useScrollCanvas.js` to prioritize loading the resting frame (`hover_0060.webp`) and immediately painting it to the `<canvas>` before triggering `onReady()`.

### [2026-08-23 03:47]
- **Activity**: Integrated Responsive 5-Second Cinematic Intro Videos (Desktop & Mobile).
- **Details**:
  - Added responsive video source selection in `ScrollHero.vue`:
    - **Desktop**: `/final_video/BuildingHollowgram_web.mp4`
    - **Mobile**: `/final_video/BuikdingHallowGrowMobile.mp4`
  - Automatic 5.0-second timer and scroll watcher that smoothly crossfades from the intro video directly into the 3D mouse hover rotation and scroll walkthrough canvas.
  - Luxury glassmorphic `[ Skip Intro ❯ ]` button for instant exploration.

### [2026-08-23 04:08]
- **Activity**: Full WebP Optimization and Smart Batch Streaming Engine Implemented.
- **Details**:
  - Converted all 120 hover frames and 240 scroll walkthrough frames into ultra-lightweight WebP format (`.webp`).
  - Implemented smart staggered batch queue in `useScrollCanvas.js` (6-connection browser standard) that eliminates network congestion on live hosting (Vercel).
  - Resting frame (Frame 60) loads and paints in < 50ms, delivering instant display without blank screen delay.

### [2026-08-23 10:20]
- **Activity**: Converted Entire Site Image Library (23 Assets) to Optimized WebP.
- **Details**:
  - Slashed site image payload from **125.8 MB down to 5.6 MB (-95.5% reduction)**.
  - Updated all component references across `AboutProductsSection.vue`, `ThreeDCanCanvas.vue`, `RoomVisualizer.vue`, `ProjectsGrid.vue`, `FinishesGrid.vue`, `Navbar.vue`, `Footer.vue`, and `LoadingScreen.vue`.

### [2026-08-23 12:06]
- **Activity**: Fixed Uncached Hard Reload (`Shift + Ctrl + R`) Blank Screen & Added Instant Posters.
- **Details**:
  - Removed premature `p.then()` preloader dismissal in `ScrollHero.vue`. Preloader now stays active until the video has confirmed advancing frames (`video.currentTime >= 0.05s`).
  - Extracted instant WebP posters (`intro_poster.webp` and `intro_poster_mobile.webp`) bound directly to the `<video>` element, ensuring zero black screen during buffering.

### [15-10-2026 05:57 AM]
- **Activity**: Converted 1st Intro Video into Scrollable Hologram Sequence & Implemented Dual-Tier Progressive Loading Engine in Option 1 (`prismapaints`).
- **Details**:
  - Extracted 180 HD WebP frames (`public/sequence_hologram/`) and 180 low-res proxy frames (`public/sequence_hologram_low/`, 480x270 WebP, 2.1 MB total) from `BuildingHollowgram_web.mp4`.
  - Generated 240 low-res proxy frames for 3D walkthrough (`public/sequence_low/`, 2.6 MB) and 240 low-res proxy frames for wall layering (`public/sequence_wall_low/`, 1.4 MB).
  - Converted all 240 wall frames in `public/sequence_wall/` to WebP.
  - Removed HTML5 `<video>` tag, video sources, and skip intro button from `ScrollHero.vue`.
  - Implemented 3-phase interactive scroll journey in `useScrollCanvas.js`:
    - **Phase 1 (0% to 35% scroll)**: Scroll-driven holographic building rise as visitor scrolls.
    - **Phase 2 (35% to 45% scroll)**: 360° interactive mouse hover rotation with floating follower cursor.
    - **Phase 3 (45% to 100% scroll)**: 3D interior walkthrough with Hotspot Pins (Frame 130 Living Room, Frame 150 Dining Gallery, Frame 218 Master Bedroom) and interactive Room Switcher Dock.
  - Connected real dynamic download progress (`0%` to `100%`) with smooth RAF glide interpolation in `LoadingScreen.vue`.
  - Upgraded `useWallCanvas.js` to dual-tier progressive loading.
  - Verified production build compiles cleanly with zero errors in 1.41s.

### [15-10-2026 06:25 AM]
- **Activity**: Fixed Cloud Network Congestion & Applied Lazy IntersectionObserver & Throttled Streams to Option 1.
- **Details**:
  - Implemented `IntersectionObserver` with `rootMargin: '600px 0px'` in `useWallCanvas.js` to defer 480 wall frames until user scrolls within 600px of section.
  - Spliced priority Frame 1 first paint (`holo_0001.webp` < 50ms) before queue processing in `useScrollCanvas.js`.
  - Added lazy walkthrough streaming in `useScrollCanvas.js` that waits until user scrolls past Hologram phase (`p > 0.20`).
  - Throttled batch sizes to 6 requests with synchronous cache checks.
  - Verified production build (`npm run build`) passing with zero errors in 1.52s.

### [15-10-2026 06:44 AM]
- **Activity**: Added Introductory Luxury Hero Brand Title with Scroll-Driven Fade to Option 1 (`prismapaints`).
- **Details**:
  - Integrated centered luxury typography banner in `ScrollHero.vue`:
    - Eyebrow: `THE PRISMA PAINT` in metallic gold tracked typography (`#D4AF37`, 5px letter-spacing).
    - Headline: `"Bringing Colors to Life"` in `'Playfair Display', serif` italic luxury font.
    - Accented with a sleek horizontal gold light line.
  - Connected reactive scroll fade out: Text starts at 100% opacity at scroll = 0 and smoothly fades to 0% as the visitor scrolls through the first 8% of the page (`p * 12.5`), accompanied by a subtle cinematic upward float (`translateY: 0 → -20px`).
  - Preserved complete isolation: `prismapaints_v2` was strictly untouched.
  - Verified production build (`npm run build`) passing with zero errors in 1.68s.
