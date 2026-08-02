<template>
  <section id="wall-animation" ref="containerRef" class="wall-scroll-container">
    <div class="wall-pinned-wrapper">
      <div class="wall-boxed-card">
        <canvas ref="canvasRef" class="wall-canvas"></canvas>
      </div>

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
  padding: 32px 24px;
  box-sizing: border-box;
}

.wall-boxed-card {
  position: relative;
  width: 100%;
  max-width: 1360px;
  height: calc(100vh - 120px);
  max-height: 860px;
  min-height: 480px;
  background: rgba(20, 18, 16, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 28px;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wall-canvas {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.scroll-indicator {
  position: absolute;
  bottom: 24px;
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
  pointer-events: none;
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

@media (max-width: 768px) {
  .wall-pinned-wrapper {
    padding: 16px 12px;
  }
  .wall-boxed-card {
    height: calc(100vh - 80px);
    border-radius: 20px;
  }
}
</style>
