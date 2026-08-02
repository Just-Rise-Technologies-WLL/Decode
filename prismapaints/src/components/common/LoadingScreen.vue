<template>
  <transition name="preloader-fade">
    <div v-if="isLoading" class="preloader-overlay">
      <div class="preloader-content">
        <!-- Logo with Gold Pulse Animation -->
        <div class="logo-wrapper">
          <img src="/images/prisma_logo.png" alt="Prisma Paints Logo" class="preloader-logo" />
        </div>

        <span class="preloader-tag">LUXURY DECORATIVE & INDUSTRIAL COATINGS</span>

        <!-- Gold Progress Bar -->
        <div class="progress-bar-track">
          <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
        </div>

        <span class="progress-num">{{ Math.round(progress) }}%</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isLoading: { type: Boolean, default: true }
})

const progress = ref(15)
let progressInterval = null

onMounted(() => {
  progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 12 + 5
      if (progress.value > 90) progress.value = 90
    }
  }, 180)
})

onUnmounted(() => {
  if (progressInterval) clearInterval(progressInterval)
})
</script>

<style scoped>
.preloader-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background-color: #181614;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.preloader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
  padding: 0 20px;
}

.logo-wrapper {
  margin-bottom: 24px;
  animation: logoPulse 2s ease-in-out infinite;
}

.preloader-logo {
  height: 90px;
  width: auto;
  object-fit: contain;
}

.preloader-tag {
  font-size: 0.72rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--clr-accent-gold);
  margin-bottom: 28px;
  font-weight: 600;
}

.progress-bar-track {
  width: 240px;
  height: 3px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #c5a059 0%, #f3e5ab 50%, #c5a059 100%);
  border-radius: 4px;
  transition: width 0.25s ease-out;
}

.progress-num {
  font-size: 0.8rem;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.6);
  font-family: monospace;
}

@keyframes logoPulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px rgba(197, 160, 89, 0.2));
  }
  50% {
    transform: scale(1.04);
    filter: drop-shadow(0 0 25px rgba(197, 160, 89, 0.55));
  }
}

/* Smooth Fade Out Transition */
.preloader-fade-leave-active {
  transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}

.preloader-fade-leave-to {
  opacity: 0;
}
</style>
