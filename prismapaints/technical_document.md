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
- **Assets Format**: 100% High-Performance WebP format across all site images, sequence frames, and 3D textures (Total site image payload slashed by 95.5% from 125.8 MB down to 5.6 MB).
- **Modular Components**:
  - `src/components/layout/Navbar.vue` (Floating Rounded Glassmorphism Pill Navigation Bar with Light Frosted Crystal Glass material and `SHOP` menu link)
  - `src/components/layout/Footer.vue`
  - `src/components/hero/ScrollHero.vue` (Option 1 Unified Luxury Hero Engine: 1. Scroll-driven Holographic Building Rise `public/sequence_hologram/` -> 2. 360° Interactive Mouse Hover Rotation with `‹ 360° › ROTATE` Follower Cursor -> 3. 240-Frame Architectural Walkthrough with Dynamic Wall Hotspot Pins, LERP Physics, and Room Switcher Dock)
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
  - `src/components/common/LoadingScreen.vue` (Full-Screen Luxury Brand Preloader with 100% real dynamic download progress tracking :progress="loadingProgress", smooth gold pulse animation, and cubic-bezier fade-out transition)
  - `src/components/common/BeforeAfterSlider.vue` (Reusable Drag Comparison Component)
  - `src/components/common/SampleModal.vue` & `ToastNotification.vue`
- **Composables**:
  - `src/composables/useScrollCanvas.js` (Unified 3-Phase Dual-Tier Canvas Engine: Tier 1 fast low-res WebP proxy preloading driving real dynamic percentage, background Tier 2 HD 1080p streaming, interactive 360° mouse rotation, and seamless 60fps walkthrough scrubbing)
  - `src/composables/useWallCanvas.js` (Dual-Tier Progressive Wall Layering Canvas Engine: Preloads 240 lightweight WebP frames from `/sequence_wall_low/` for instant scrubbing, upgraded with background 1080p WebP streaming)
  - `src/composables/useColorStudio.js` (Reactive state manager for surfaces, finishes, palette shortlist, and modal controls)

---

## Log References
- [ActivitiesLog.md](file:///Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints/ActivitiesLog.md)
- [ErrorFixLog.md](file:///Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints/ErrorFixLog.md)
