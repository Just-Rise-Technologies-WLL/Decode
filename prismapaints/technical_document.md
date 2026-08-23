# Prisma Paints Vue 3 Enterprise Website - Technical Document & Logic Brain

## Project Overview
- **Client**: Prisma Paints (Prisma Modern Decorative Paints - Sitra Industrial Area, Kingdom of Bahrain)
- **Architecture**: Enterprise Vite + Vue 3 Single-File Component (`.vue` SFC) Modular Application with PHP Email Backend.
- **Location**: `/Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints`

---

## Technical Stack & Dependencies
- **Build System**: Vite 5+ (`vite.config.js`)
- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Social Link Previews**: OpenGraph (`og:image`, `og:title`, `og:description`) and Twitter Card (`twitter:card`) meta tags in `index.html` referencing 1200x630 dark luxury banner `public/images/og_share_preview.png` for WhatsApp, iMessage, LinkedIn, and Facebook link preview cards.
- **Git Config**: [.gitignore](file:///Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints/.gitignore)
- **Favicon**: `public/favicon.svg` (Prisma Paints Signature Multi-color Triangle Logo)
- **Modular Components**:
  - `src/components/layout/Navbar.vue` (Floating Rounded Glassmorphism Pill Navigation Bar with Light Frosted Crystal Glass material and `SHOP` menu link)
  - `src/components/layout/Footer.vue`
  - `src/components/hero/ScrollHero.vue` (3-Phase Luxury Hero Engine: 1. Responsive 5-Second Cinematic Streaming Intro Video `BuildingHollowgram_web.mp4` on Desktop / `BuikdingHallowGrowMobile.mp4` on Mobile -> 2. Interactive 3D Mouse Hover Rotation with `‹ 360° › ROTATE` Magnetic Follower Cursor -> 3. 240-Frame Architectural Walkthrough with Dynamic Wall Hotspot Pins, LERP Inertial Physics, and Room Switcher Dock)
  - `src/components/hero/HeroHotspotPin.vue` (Interactive wall hotspot pin with radar pulse waves, active state morphing, and preview tags)
  - `src/components/hero/HotspotDetailCard.vue` (Jotun-inspired floating contextual card on desktop and slide-up bottom sheet drawer on mobile with color swatch specs, topcoat preview, 1-click sample requests, and palette saving)
  - `src/data/heroHotspotsData.js` (Zone metadata, frame ranges, wall coordinates, and paint specifications: Pin 1 at Frame 130 on Green Wall, Pin 2 at Frame 150 on Blue Wall, Pin 3 at Frame 218 on Master Suite Bedroom Wall)
  - `src/components/wall/WallSectionAnimation.vue` (Interactive 300vh Scroll-Driven Frame Canvas rendering 240 HD frames in a luxury glassmorphic `.wall-boxed-card` with aspect-contain scaling for zero detail cropping)
  - `src/components/about/AboutProductsSection.vue` (Unified About Us section + Signature Products showcase with 60fps Photo-Real parabolic arc flight engine matching Green and Blue photo cans 100% in handles, metallic rims, and lighting)
  - `src/components/about/ThreeDCanCanvas.vue` (Real Three.js WebGL 3D Cylinder Paint Can Mesh with studio lighting, gold metallic rim, and 360° scroll-driven 3D cylinder rotation)
  - `src/components/categories/CategoryGrid.vue` & `CategoryCard.vue`
  - `src/components/finishes/FinishesGrid.vue` (Horizontal Pinned Side-Scroll with 9 Finish Categories, dynamic scroll width calculation, and 100% full view end spacer)
  - `src/components/studio/ColorStudio.vue`, `RoomVisualizer.vue` (Stacked Morph-Dissolve 5-Color Room Visualizer rendering shades in sequence: Alabaster White, Emerald Green, Mediterranean Blue, Imperial Red, Deep Maroon), `SwatchGrid.vue`
  - `src/components/projects/ProjectsGrid.vue` (Interactive Before/After Project Cards)
  - `src/components/common/LoadingScreen.vue` (Full-Screen Luxury Brand Preloader with Prisma Paints logo gold pulse animation, progress percentage bar, and video-loaded fade-out transition)
  - `src/components/common/BeforeAfterSlider.vue` (Reusable Drag Comparison Component)
  - `src/components/common/SampleModal.vue` & `ToastNotification.vue`
- **Composables**:
  - `src/composables/useScrollCanvas.js` (Dual-Mode 60FPS LERP Canvas Engine: High-performance WebP support with priority 2-frame initial paint in < 50ms and smart 6-connection background batch streaming queue that prevents host network congestion)
  - `src/composables/useColorStudio.js` (Reactive state manager for surfaces, finishes, palette shortlist, and modal controls)

---

## Log References
- [ActivitiesLog.md](file:///Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints/ActivitiesLog.md)
- [ErrorFixLog.md](file:///Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints/ErrorFixLog.md)
