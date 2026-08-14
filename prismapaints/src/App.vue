<template>
  <div id="app-root">
    <!-- Full-Screen Luxury Preloader -->
    <LoadingScreen :is-loading="isSiteLoading" />

    <!-- Header Navigation -->
    <Navbar @open-modal="openModal" />

    <!-- Hero Scroll-Driven Animation Section with Architectural Hotspots -->
    <ScrollHero 
      :saved-palette="myPalette"
      @open-modal="openModal" 
      @toggle-palette="togglePalette"
      @video-loaded="dismissPreloader" 
    />

    <!-- About Us & Interactive Product Showcase Section -->
    <AboutProductsSection @open-modal="openModal" />

    <!-- Categories Grid Section -->
    <CategoryGrid />

    <!-- Interactive Wall Section Layering Canvas Animation -->
    <WallSectionAnimation @open-modal="openModal" />

    <!-- Finishes Horizontal Side-Scroll Section -->
    <FinishesGrid @open-modal="openModal" />

    <!-- Color Studio Component -->
    <ColorStudio 
      :surfaces="surfaces"
      :finishes="finishes"
      :families="families"
      v-model:active-surface="activeSurface"
      v-model:active-finish="activeFinish"
      v-model:active-family="activeFamily"
      :selected-color="selectedColor"
      :my-palette="myPalette"
      :filtered-colors="filteredColors"
      :is-in-palette="isInPalette"
      @select-color="selectColor"
      @toggle-palette="togglePalette"
      @copy-hex="copyHex"
      @open-modal="openModal"
    />

    <!-- Landmark Projects Grid -->
    <ProjectsGrid />

    <!-- Footer Section -->
    <Footer />

    <!-- Request Sample Modal -->
    <SampleModal 
      :is-open="isModalOpen" 
      :palette="myPalette" 
      :surface="activeSurface" 
      @close="closeModal" 
      @submitted="handleToast"
    />

    <!-- Toast Notification Banner -->
    <ToastNotification :message="toastMessage" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoadingScreen from './components/common/LoadingScreen.vue'
import Navbar from './components/layout/Navbar.vue'
import ScrollHero from './components/hero/ScrollHero.vue'
import AboutProductsSection from './components/about/AboutProductsSection.vue'
import CategoryGrid from './components/categories/CategoryGrid.vue'
import WallSectionAnimation from './components/wall/WallSectionAnimation.vue'
import FinishesGrid from './components/finishes/FinishesGrid.vue'
import ColorStudio from './components/studio/ColorStudio.vue'
import ProjectsGrid from './components/projects/ProjectsGrid.vue'
import Footer from './components/layout/Footer.vue'
import SampleModal from './components/common/SampleModal.vue'
import ToastNotification from './components/common/ToastNotification.vue'

import { useColorStudio } from './composables/useColorStudio.js'

const isSiteLoading = ref(true)

const dismissPreloader = () => {
  if (isSiteLoading.value) {
    setTimeout(() => {
      isSiteLoading.value = false
    }, 400)
  }
}

onMounted(() => {
  // Safety fallback: dismiss preloader after 2.2 seconds max
  setTimeout(() => {
    dismissPreloader()
  }, 2200)
})

const {
  surfaces,
  finishes,
  families,
  activeSurface,
  activeFinish,
  activeFamily,
  selectedColor,
  myPalette,
  toastMessage,
  isModalOpen,
  filteredColors,
  selectColor,
  togglePalette,
  isInPalette,
  copyHex,
  openModal,
  closeModal
} = useColorStudio()

const handleToast = (msg) => {
  toastMessage.value = msg
  setTimeout(() => {
    if (toastMessage.value === msg) toastMessage.value = ''
  }, 3500)
}
</script>
