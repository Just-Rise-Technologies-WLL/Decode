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
  - Extracted 120 HD frames (`public/sequence_hover/hover_0001.jpg` to `0120.jpg`) from `public/final_video/mouseHover.mp4` with default mid-frame (60) resting center.
  - Extracted 240 HD frames (`public/sequence/frame_0001.jpg` to `0240.jpg`) from `public/final_video/mouseScroll.mp4`.
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
