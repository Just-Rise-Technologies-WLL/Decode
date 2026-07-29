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
  - `src/components/hero/ScrollHero.vue` (Scroll-Revealed Text Card Animation with 40% Delay)
  - `src/components/categories/CategoryGrid.vue` & `CategoryCard.vue`
  - `src/components/finishes/FinishesGrid.vue` (Horizontal Side-Scroll + Feature Before/After Slider)
  - `src/components/studio/ColorStudio.vue`, `RoomVisualizer.vue` (Precise Wall Mask Paint Engine), `SwatchGrid.vue`
  - `src/components/projects/ProjectsGrid.vue` (Interactive Before/After Project Cards)
  - `src/components/common/BeforeAfterSlider.vue` (Reusable Drag Comparison Component)
  - `src/components/common/SampleModal.vue` & `ToastNotification.vue`
- **Composables**:
  - `src/composables/useScrollCanvas.js` (Butter-Smooth 60FPS LERP Canvas Engine: 300 HD Frames extracted from 0:18–1:18 segment of 3D Private Residence Architectural Walkthrough Video)
  - `src/composables/useColorStudio.js` (Reactive state manager for surfaces, finishes, palette shortlist, and modal controls)

---

## Deep Analysis & Inertial LERP Physics Engine (`useScrollCanvas.js`)

### LERP Mathematics:
$$\text{frame}_{\text{current}} \leftarrow \text{frame}_{\text{current}} + (\text{frame}_{\text{target}} - \text{frame}_{\text{current}}) \times 0.14$$
- Continuously interpolates frame position on every `requestAnimationFrame` tick to eliminate wheel stepping and provide butter-smooth, silky 60fps video camera motion.

---

## Log References
- [ActivitiesLog.md](file:///Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints/ActivitiesLog.md)
- [ErrorFixLog.md](file:///Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints/ErrorFixLog.md)
