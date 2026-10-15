<template>
  <transition name="preloader-fade">
    <div v-if="isLoading" class="preloader-overlay">
      <div class="preloader-content">
        <!-- Logo with Gold Pulse Animation -->
        <div class="logo-wrapper">
          <div class="preloader-badge">
            <img src="/images/prisma_logo_dark.webp" alt="Prisma Paints Logo" class="preloader-logo" />
          </div>
        </div>

        <span class="preloader-tag">LUXURY DECORATIVE & INDUSTRIAL COATINGS</span>

        <!-- Gold Progress Bar -->
        <div class="progress-bar-track">
          <div class="progress-bar-fill" :style="{ width: visualProgress + '%' }"></div>
        </div>

        <span class="progress-num">{{ Math.round(visualProgress) }}%</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isLoading: { type: Boolean, default: true },
  progress: { type: Number, default: 0 }
})

const visualProgress = ref(0)
let animId = null

const tick = () => {
  const target = Math.min(100, Math.max(0, props.progress))
  if (visualProgress.value < target) {
    const diff = target - visualProgress.value
    const step = Math.max(0.6, diff * 0.15)
    visualProgress.value = Math.min(target, visualProgress.value + step)
  }
  animId = requestAnimationFrame(tick)
}

onMounted(() => {
  animId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
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
  display: flex;
  justify-content: center;
}

.preloader-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.62) 100%);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-radius: 16px;
  padding: 14px 28px;
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: 
    inset 0 1px 2px rgba(255, 255, 255, 0.95),
    0 12px 36px rgba(0, 0, 0, 0.35),
    0 0 24px rgba(212, 175, 55, 0.25);
}

.preloader-logo {
  height: 58px;
  width: auto;
  object-fit: contain;
  display: block;
}

.preloader-tag {
  font-size: 0.72rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--clr-accent-gold, #D4AF37);
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
