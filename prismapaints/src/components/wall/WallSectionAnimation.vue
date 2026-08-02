<template>
  <section id="wall-animation" ref="containerRef" class="wall-scroll-container">
    <div class="wall-pinned-wrapper">
      <canvas ref="canvasRef" class="wall-canvas"></canvas>

      <!-- Scroll Mouse Indicator -->
      <div 
        class="scroll-indicator"
        :style="{ opacity: Math.max(0, 0.8 - scrollProgress * 2.5) }">
        <div class="scroll-mouse">
          <div class="scroll-wheel"></div>
        </div>
        <span>Scroll to Experience Wall Layering</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useWallCanvas } from '../../composables/useWallCanvas.js'

const canvasRef = ref(null)
const containerRef = ref(null)

const { scrollProgress } = useWallCanvas(canvasRef, containerRef)
</script>

<style scoped>
.wall-scroll-container {
  position: relative;
  height: 300vh;
  background-color: var(--clr-dark-bg);
}

.wall-pinned-wrapper {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wall-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.wall-content-wrapper {
  position: relative;
  z-index: 10;
  width: 90%;
  max-width: 1240px;
  margin: 0 auto;
  color: #ffffff;
}

.wall-card {
  background: rgba(36, 34, 32, 0.82);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 28px;
  padding: 56px 48px;
  max-width: 600px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.55);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.wall-tag {
  font-size: 0.82rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--clr-accent-gold);
  margin-bottom: 14px;
  font-weight: 600;
  display: block;
}

.wall-title {
  font-size: 2.8rem;
  margin-bottom: 18px;
  line-height: 1.12;
  color: #ffffff;
}

.wall-desc {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 32px;
  font-weight: 300;
  line-height: 1.6;
}

.wall-actions {
  display: flex;
  gap: 16px;
  align-items: center;
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
  transition: opacity 0.3s ease;
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
  .wall-card {
    padding: 40px 28px;
  }
  .wall-title {
    font-size: 2.2rem;
  }
}
</style>
