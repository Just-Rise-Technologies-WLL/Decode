<template>
  <section ref="containerRef" class="hero-scroll-container">
    <div class="hero-pinned-wrapper">
      <canvas ref="canvasRef" class="hero-canvas"></canvas>
      <div class="hero-overlay"></div>

      <div class="hero-content-slider">
        <div class="hero-card">
          <span class="hero-subtitle">INSPIRED INTERIOR SHADES</span>
          <h1 class="hero-title">Warmth and comfort combined</h1>
          <p class="hero-desc">Bring a natural, grounding energy to your home with our earth-toned luxury collection, designed to create inviting, welcoming spaces.</p>
          <div style="display: flex; gap: 16px;">
            <button @click="$emit('open-modal')" class="btn-primary">Explore Palette</button>
            <a href="#studio" class="btn-outline" style="border-color: #ffffff; color: #ffffff;">Color Studio</a>
          </div>
        </div>
      </div>

      <div class="scroll-indicator">
        <div class="scroll-mouse">
          <div class="scroll-wheel"></div>
        </div>
        <span>Scroll to Experience</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useScrollCanvas } from '../../composables/useScrollCanvas.js'

defineEmits(['open-modal'])

const canvasRef = ref(null)
const containerRef = ref(null)

useScrollCanvas(canvasRef, containerRef)
</script>

<style scoped>
.hero-scroll-container {
  position: relative;
  height: 300vh;
}

.hero-pinned-wrapper {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(36, 34, 32, 0.3) 0%, rgba(36, 34, 32, 0.5) 100%);
  z-index: 2;
}

.hero-content-slider {
  position: relative;
  z-index: 10;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  color: #ffffff;
}

.hero-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 24px;
  padding: 60px 48px;
  max-width: 580px;
  box-shadow: var(--shadow-glass);
}

.hero-subtitle {
  font-size: 0.85rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--clr-accent-gold);
  margin-bottom: 14px;
  font-weight: 600;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 20px;
  line-height: 1.08;
  color: #ffffff;
}

.hero-desc {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
  font-weight: 300;
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #ffffff;
  font-size: 0.75rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.8;
}

.scroll-mouse {
  width: 24px;
  height: 38px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  position: relative;
}

.scroll-wheel {
  width: 4px;
  height: 8px;
  background-color: #ffffff;
  border-radius: 2px;
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  animation: scrollAnim 1.8s infinite;
}

@keyframes scrollAnim {
  0% { opacity: 1; top: 6px; }
  100% { opacity: 0; top: 22px; }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2.4rem;
  }
}
</style>
