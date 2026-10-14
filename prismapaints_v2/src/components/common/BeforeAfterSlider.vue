<template>
  <div 
    class="before-after-container" 
    ref="containerRef"
    :style="{ height: height || '420px' }"
    @mousedown="startDrag"
    @touchstart.passive="startDrag">

    <!-- Underneath "After" Image (Painted / Finished View) -->
    <div class="image-layer after-layer">
      <img 
        :src="afterImg" 
        :alt="afterTag || 'After'" 
        draggable="false" 
        class="slider-img">
      <span class="badge after-badge">{{ afterTag || 'After' }}</span>
    </div>

    <!-- Top "Before" Image (Clipped / Raw View) -->
    <div class="image-layer before-layer" :style="{ width: `${sliderPosition}%` }">
      <img 
        :src="beforeImg" 
        :alt="beforeTag || 'Before'" 
        draggable="false" 
        class="slider-img"
        :style="{ width: containerWidth ? `${containerWidth}px` : '100%' }">
      <span class="badge before-badge">{{ beforeTag || 'Before' }}</span>
    </div>

    <!-- Central Divider Handle Line -->
    <div class="slider-divider" :style="{ left: `${sliderPosition}%` }">
      <div class="divider-line"></div>
      <div class="divider-handle">
        <span class="handle-grip">|||||</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  beforeImg: { type: String, required: true },
  afterImg: { type: String, required: true },
  beforeTag: { type: String, default: 'Before' },
  afterTag: { type: String, default: 'After' },
  height: { type: String, default: '420px' }
})

const containerRef = ref(null)
const sliderPosition = ref(50)
const isDragging = ref(false)
const containerWidth = ref(0)

const updateWidth = () => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.offsetWidth
  }
}

const updatePosition = (clientX) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const offset = clientX - rect.left
  const percentage = (offset / rect.width) * 100
  sliderPosition.value = Math.max(0, Math.min(100, percentage))
}

const startDrag = (e) => {
  isDragging.value = true
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  updatePosition(clientX)

  // Attach global event listeners for smooth drag even outside container
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onDrag)
  window.addEventListener('touchend', stopDrag)
}

const onDrag = (e) => {
  if (!isDragging.value) return
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  updatePosition(clientX)
}

const stopDrag = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', stopDrag)
}

onMounted(() => {
  updateWidth()
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
  stopDrag()
})
</script>

<style scoped>
.before-after-container {
  position: relative;
  width: 100%;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  cursor: ew-resize;
  touch-action: none;
}

.image-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.slider-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.before-layer {
  z-index: 2;
  border-right: 2px solid rgba(255, 255, 255, 0.9);
}

.before-layer img {
  max-width: none;
}

/* Badges matching screenshot pill design */
.badge {
  position: absolute;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 5;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  pointer-events: none;
}

.before-badge {
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.45);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.after-badge {
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.85);
  color: #242220;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Central Divider Line & Handle */
.slider-divider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  z-index: 10;
  transform: translateX(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.divider-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #ffffff;
  box-shadow: 0 0 8px rgba(0,0,0,0.4);
}

.divider-handle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 18px rgba(0,0,0,0.35);
  color: #5c291b;
  z-index: 11;
  transition: transform 0.2s ease;
  cursor: ew-resize;
}

.before-after-container:hover .divider-handle {
  transform: scale(1.12);
}

.handle-grip {
  font-size: 0.65rem;
  letter-spacing: -1px;
  font-weight: 800;
  color: #5c291b;
  opacity: 0.75;
}
</style>
