# Prisma Paints Vue 3 Enterprise Website - Technical Document & Logic Brain

## Project Overview
- **Client**: Prisma Paints (Prisma Modern Decorative Paints - Sitra Industrial Area, Kingdom of Bahrain)
- **Architecture**: Enterprise Vite + Vue 3 Single-File Component (`.vue` SFC) Modular Application with PHP Email Backend.
- **Location**: `/Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints`

---

## Technical Stack & Dependencies
- **Build System**: Vite 5+ (`vite.config.js`)
- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Git Config**: [.gitignore](file:///Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints/.gitignore)
- **Favicon**: `public/favicon.svg` (Prisma Paints Signature Multi-color Triangle Logo)
- **Modular Components**:
  - `src/components/layout/Navbar.vue` (Floating Rounded Glassmorphism Pill Navigation Bar)
  - `src/components/layout/Footer.vue`
  - `src/components/hero/ScrollHero.vue` (Hardware-Accelerated 60FPS Full-Screen Background Video using `/video/Herosection VIdeo.MOV`)
  - `src/components/wall/WallSectionAnimation.vue` (100% Full-View Unblocked Interactive 300vh Scroll-Driven Frame Canvas Section rendering 240 HD frames extracted from `/video/Wall Section Video.mp4`)
  - `src/components/about/AboutProductsSection.vue` (Unified About Us section + Signature Products showcase with 60fps Photo-Real parabolic arc flight engine matching Green and Blue photo cans 100% in handles, metallic rims, and lighting)
  - `src/components/about/ThreeDCanCanvas.vue` (Real Three.js WebGL 3D Cylinder Paint Can Mesh with studio lighting, gold metallic rim, and 360° scroll-driven 3D cylinder rotation)
  - `src/components/categories/CategoryGrid.vue` & `CategoryCard.vue`
  - `src/components/finishes/FinishesGrid.vue` (Horizontal Pinned Side-Scroll with 9 Finish Categories, dynamic scroll width calculation, and 100% full view end spacer)
  - `src/components/studio/ColorStudio.vue`, `RoomVisualizer.vue` (Stacked Morph-Dissolve 5-Color Room Visualizer rendering `/intractive_panel/WhiteWall.png`, `RedWall.png`, `MaroonWall.png`, `GreenWall.png`, `BlueWall.png`), `SwatchGrid.vue`
  - `src/components/projects/ProjectsGrid.vue` (Interactive Before/After Project Cards)
  - `src/components/common/BeforeAfterSlider.vue` (Reusable Drag Comparison Component)
  - `src/components/common/SampleModal.vue` & `ToastNotification.vue`
- **Composables**:
  - `src/composables/useScrollCanvas.js` (Butter-Smooth 60FPS LERP Canvas Engine: 300 HD Frames extracted from 0:18–1:18 segment of 3D Private Residence Architectural Walkthrough Video)
  - `src/composables/useColorStudio.js` (Reactive state manager for surfaces, finishes, palette shortlist, and modal controls)

---

## Log References
- [ActivitiesLog.md](file:///Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints/ActivitiesLog.md)
- [ErrorFixLog.md](file:///Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints/ErrorFixLog.md)
