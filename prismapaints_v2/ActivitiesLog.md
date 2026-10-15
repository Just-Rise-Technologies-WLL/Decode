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

### [15-10-2026 05:18 AM]
- **Activity**: Integrated Real Villa Video Frame Sequence, Last Frame Pause Hold, and Building Zoom-in Engine into Option 2 (`prismapaints_v2`).
- **Details**:
  - Extracted 300 optimized WebP frames from `1013(2).mp4` into `public/sequence_villa/` (1920x1080, quality 82, 20 MB total).
  - Removed old HTML5 `<video>` tag (`BuildingHollowgram_web.mp4` / `BuikdingHallowGrowMobile.mp4`) and skip intro button.
  - Implemented 4-phase unified canvas journey in `useScrollCanvas.js`:
    - **Phase 1 (0% to 35% scroll)**: Pure scroll-driven scrubbing through the real Bahrain villa sequence (`villa_0001.webp` to `villa_0300.webp`).
    - **Phase 2 (35% to 45% scroll)**: Scroll plateau holding on the last frame (`villa_0300.webp` featuring the Prisma IMAJ paint can and villa).
    - **Phase 3 (45% to 58% scroll)**: Cinematic dynamic building zoom-in centered on the villa entrance archway (zooming from 1.0x to 2.5x with smooth cubic ease).
    - **Phase 4 (58% to 100% scroll)**: Seamless crossfade into the 240-frame 3D interior walkthrough with active Hotspot Pins (Green Living Area Frame 130, Blue Dining Area Frame 150, Master Suite Frame 218) and interactive Room Switcher Dock.
  - Spliced instant Frame 1 canvas paint (< 50ms) to trigger preloader dismissal with zero black screen.
  - Verified production compilation (`npm run build`) passing with zero errors.

### [15-10-2026 05:36 AM]
- **Activity**: Implemented Dual-Tier Progressive Loading Engine & Real Dynamic Progress Bar across All 3 Frame Sequences.
- **Details**:
  - Generated lightweight 480x270 WebP proxy sequences for all 3 sequences:
    - `public/sequence_villa_low/` (300 frames, 2.4 MB total).
    - `public/sequence_low/` (240 frames, 2.6 MB total).
    - `public/sequence_wall_low/` (240 frames, 1.4 MB total).
    - Converted all 240 `sequence_wall` frames to WebP.
  - Upgraded `LoadingScreen.vue` to accept dynamic `:progress="loadingProgress"` prop, removing the artificial timer and binding the bar to the 100% real download percentage (0% to 100%).
  - Upgraded `useScrollCanvas.js` and `useWallCanvas.js` to dual-tier rendering (`loadedHd[i] || loadedLow[i]`), ensuring immediate butter-smooth 60fps scrolling without dropped frames while HD frames stream seamlessly in the background.
  - Verified build passes with zero errors in 1.62s.

### [15-10-2026 05:47 AM]
- **Activity**: Fixed Cached Image Event Listener Order & Implemented Silky RAF Progress Interpolation in Preloader.
- **Details**:
  - Fixed JavaScript event binding in `useScrollCanvas.js`: Attached `img.onload` / `img.onerror` BEFORE assigning `img.src` and added synchronous `.complete` checks to prevent cached browser hits from skipping count increments.
  - Added a 2.8s safety threshold preventing preloader lock if any individual network frame stalls.
  - Added smooth RAF LERP interpolation (`visualProgress`) in `LoadingScreen.vue`, guaranteeing the gold progress bar and percentage numbers glide continuously from 0% to 100% with premium visual feedback.
  - Verified compilation passing with zero errors.

### [15-10-2026 06:25 AM]
- **Activity**: Fixed Cloud (Vercel) Blank Screen & Slashed Initial Network Requests via Lazy IntersectionObserver & Throttled Streams.
- **Details**:
  - Identified cloud bottleneck: 1,593 concurrent requests were flooding Vercel HTTP/2 stream limits on landing.
  - Implemented `IntersectionObserver` with a `rootMargin: '600px 0px'` on `useWallCanvas.js`, reducing wall frame requests on initial landing from 480 down to 0.
  - Spliced priority Frame 1 first paint (< 50ms) before batching in both `useScrollCanvas.js` and `useWallCanvas.js`.
  - Added lazy walkthrough streaming in `useScrollCanvas.js` that waits until the user scrolls past the Villa sequence (`p > 0.25`) before requesting interior frames.
  - Slashed initial landing network requests from 1,593 down to ~300 lightweight WebP frames (~2 MB).
  - Verified production build (`npm run build`) passing with zero errors.

### [15-10-2026 11.14 AM]
- **Activity**: Integrated New Brand Logo (`prisma-logo-right1.png`) into Navigation Bar, Footer, and Loading Screen across Both Projects (`prismapaints` and `prismapaints_v2`).
- **Details**:
  - Cropped original high-res logo (`prisma-logo-right1.png`) and generated retina-sharp, ultra-lightweight WebP asset (`public/images/prisma_logo_dark.webp`, ~28 KB down from ~800 KB) and PNG fallback in both projects.
  - **Navigation Bar (`Navbar.vue`)**: Connected `/images/prisma_logo_dark.webp` within the existing frosted glass floating pill capsule (`rgba(255, 255, 255, 0.48)`), providing sharp contrast and high legibility for the dark navy typography and orange accent triangle.
  - **Footer (`Footer.vue`)**: Wrapped brand mark in a luxury frosted light badge (`.footer-logo-badge`: `rgba(255, 255, 255, 0.95)`, `backdrop-filter: blur(14px)`, `box-shadow`) against the dark charcoal background (`#171110`), ensuring vivid contrast and premium presentation.
  - **Loading Screen (`LoadingScreen.vue`)**: Wrapped preloader brand mark in a matching luxury frosted light plate (`.preloader-badge`) with ambient gold pulse animation against the dark preloader background (`#181614`).

### [15-10-2026 11.31 AM]
- **Activity**: Refined Brand Mark Badge to True Luminous Translucent Frosted Glass with Blue Logo & Fixed Projects Heading Text Contrast across Both Projects.
- **Details**:
  - Restyled `.footer-logo-badge` and `.preloader-badge` with **true translucent frosted glass** (`background: linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.58) 100%)`, `backdrop-filter: blur(24px) saturate(180%)`, specular inner bevel highlight `inset 0 1px 2px rgba(255,255,255,0.95)`).
  - Maintained the signature **deep blue/navy brand logo** (`prisma_logo_dark.webp`) inside the frosted glass plate for sharp, authentic brand presence.
  - **Fixed Projects Header Text Contrast (`ProjectsGrid.vue`)**: Added scoped typography styles on dark `#181614` background:
    - `.section-subtitle` (`PROJECTS`): Metallic gold (`#D4AF37`, letter-spacing 3px).
    - `.section-title` (`Trusted on landmark builds across the region`): Pure crisp white (`#FFFFFF`).
    - `.section-desc`: Readable soft off-white (`rgba(255, 255, 255, 0.75)`).
  - Verified production build passing with zero errors across both projects.


