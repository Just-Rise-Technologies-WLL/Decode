# Prisma Paints Vue 3 Enterprise Website - Technical Document & Logic Brain

## Project Overview
- **Client**: Prisma Paints (Prisma Modern Decorative Paints - Sitra Industrial Area, Kingdom of Bahrain)
- **Architecture**: Enterprise Vite + Vue 3 Single-File Component (`.vue` SFC) Modular Application with PHP Email Backend.
- **Location**: `/Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints`

---

## Technical Stack & Dependencies
- **Build System**: Vite 5+ (`vite.config.js`)
- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Modular Components**:
  - `src/components/layout/Navbar.vue` & `Footer.vue`
  - `src/components/hero/ScrollHero.vue`
  - `src/components/categories/CategoryGrid.vue` & `CategoryCard.vue`
  - `src/components/finishes/FinishesGrid.vue`
  - `src/components/studio/ColorStudio.vue`, `RoomVisualizer.vue`, `SwatchGrid.vue`
  - `src/components/projects/ProjectsGrid.vue`
  - `src/components/common/SampleModal.vue` & `ToastNotification.vue`
- **Composables**:
  - `src/composables/useScrollCanvas.js` (Universal Media Engine: MP4 video, WebP sequence, & Canvas Fallback)
  - `src/composables/useColorStudio.js` (Reactive state manager for surfaces, finishes, palette shortlist, and modal controls)

---

## Frame Recommendations & Folder Destinations

### 1. Recommended Frame Count:
- **Optimal Range**: **60 to 120 frames** (e.g. 60–120 WebP images or a 3 to 5 second MP4 video).
- **Why**: Keeps initial download under ~8MB while delivering 60 FPS scroll animation response on mobile and desktop.

### 2. Supported File Destinations:
- **Option 1 (MP4 / WebM Video)**:
  Drop video into `public/video/hero.mp4`.
- **Option 2 (Image Sequence)**:
  Drop images into `public/sequence/frame_0001.webp` ... `frame_0060.webp`.
- **Option 3 (Procedural Fallback)**:
  Active automatically if no media files are added.

---

## Log References
- [ActivitiesLog.md](file:///Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints/ActivitiesLog.md)
- [ErrorFixLog.md](file:///Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints/ErrorFixLog.md)
