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
  - `src/components/hero/ScrollHero.vue` (Option 2 Unified Luxury Hero Engine: 1. Pure Scroll-Driven Scrubbing of Real Bahrain Villa 300-Frame Sequence `public/sequence_villa/` -> 2. Resting Plateau Hold on Last Frame featuring Prisma IMAJ Paint Can & Villa -> 3. Cinematic Dynamic Building Zoom-in centered on Villa Archway Entrance -> 4. Cross-dissolve into 240-Frame 3D Interior Walkthrough with Interactive Wall Hotspot Pins, LERP Physics, and Room Switcher Dock)
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
  - `src/composables/useScrollCanvas.js` (Unified 4-Phase Dual-Tier Canvas Engine: Priority-1 First Frame paint < 50ms, Tier 1 fast low-res WebP proxy preloading driving real dynamic percentage, throttled 6-request connection pool, lazy walkthrough streaming when `p > 0.25`, background Tier 2 HD 1080p streaming, dynamic camera scale/zoom math, and seamless 60fps multi-scene scrubbing)
  - `src/composables/useWallCanvas.js` (Dual-Tier Progressive Wall Layering Canvas Engine: IntersectionObserver deferred loading at `rootMargin: '600px 0px'` to eliminate 480 initial requests on landing, priority Frame 1 paint, preloads 240 lightweight WebP frames from `/sequence_wall_low/` in throttled batches of 10, upgraded with background 1080p WebP streaming)
  - `src/composables/useColorStudio.js` (Reactive state manager for surfaces, finishes, palette shortlist, and modal controls)

---

## Log References
- [ActivitiesLog.md](file:///Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints/ActivitiesLog.md)
- [ErrorFixLog.md](file:///Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints/ErrorFixLog.md)
