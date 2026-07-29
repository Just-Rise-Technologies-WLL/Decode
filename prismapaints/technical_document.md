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
- **Modular Components**:
  - `src/components/layout/Navbar.vue` & `Footer.vue`
  - `src/components/hero/ScrollHero.vue` (Scroll-Revealed Text Card Animation)
  - `src/components/categories/CategoryGrid.vue` & `CategoryCard.vue`
  - `src/components/finishes/FinishesGrid.vue` (Horizontal Side-Scroll + Feature Before/After Slider)
  - `src/components/studio/ColorStudio.vue`, `RoomVisualizer.vue` (Precise Wall Mask Paint Engine), `SwatchGrid.vue`
  - `src/components/projects/ProjectsGrid.vue` (Interactive Before/After Project Cards)
  - `src/components/common/BeforeAfterSlider.vue` (Reusable Drag Comparison Component)
  - `src/components/common/SampleModal.vue` & `ToastNotification.vue`
- **Composables**:
  - `src/composables/useScrollCanvas.js` (Universal Media Engine: 90 HD Frames extracted from Paint bucket color splash video)
  - `src/composables/useColorStudio.js` (Reactive state manager for surfaces, finishes, palette shortlist, and modal controls)

---

## Deep Analysis & Scroll-Revealed Hero Card (Rule 4 & 5)

### Component: `src/components/hero/ScrollHero.vue`
- **Behavior**:
  - At 0% scroll position (page top), the glassmorphism text card (`.hero-card`) is hidden (`opacity: 0`, `transform: translateY(40px)`), presenting a clean view of the paint bucket splash reveal.
  - As the user scrolls down ($0.20 \rightarrow 0.70$ progress), the text card smoothly fades in to full opacity and slides up into position.
  - When scrolling back to top, it smoothly fades back out.

---

## Log References
- [ActivitiesLog.md](file:///Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints/ActivitiesLog.md)
- [ErrorFixLog.md](file:///Volumes/Files/AppDev/justrise_bahrain/Decode/prismapaints/ErrorFixLog.md)
