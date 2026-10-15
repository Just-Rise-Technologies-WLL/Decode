<template>
  <section 
    ref="containerRef" 
    class="hero-scroll-track" 
    id="hero-walkthrough"
  >
    <!-- Sticky Pinned Viewport Container -->
    <div class="hero-pinned-wrapper">
      <!-- 60FPS Hardware Accelerated Canvas -->
      <canvas ref="canvasRef" class="hero-canvas"></canvas>

      <!-- Vignette and Ambient Depth Gradient -->
      <div class="hero-vignette"></div>

      <!-- Hotspots Wall Pin Overlay (Active during 3D walkthrough) -->
      <div class="hotspots-layer" :class="{ 'is-hidden': currentPhase !== 'walkthrough' }">
        <HeroHotspotPin 
          v-for="spot in HERO_HOTSPOTS"
          :key="spot.id"
          :hotspot="spot"
          :is-visible="isHotspotVisible(spot)"
          :is-active="activeHotspot?.id === spot.id"
          @toggle="toggleHotspot"
        />
      </div>

      <!-- Room Zone Floating Pill Indicator (Top Center) -->
      <div class="room-nav-pill" :class="{ 'is-visible': currentPhase === 'walkthrough' }">
        <div class="room-nav-dot"></div>
        <span class="room-nav-text">{{ currentRoomName }}</span>
        <span class="room-nav-frame">Frame {{ currentFrame + 1 }}/240</span>
      </div>

      <!-- Interactive Bottom Room Switcher Dock -->
      <div class="room-switcher-dock" :class="{ 'is-visible': currentPhase === 'walkthrough' }">
        <div class="dock-inner">
          <button 
            v-for="spot in HERO_HOTSPOTS"
            :key="spot.id"
            class="dock-pill"
            :class="{ 'is-active': activeRoomId === spot.id }"
            :aria-label="`Switch to ${spot.room}`"
            @click="jumpToRoom(spot)"
          >
            <span class="dock-swatch" :style="{ backgroundColor: spot.color.hex }">
              <span class="swatch-glint"></span>
            </span>
            <div class="dock-pill-text">
              <span class="dock-room-name">{{ spot.room }}</span>
              <span class="dock-shade-code">{{ spot.color.code }} {{ spot.color.name }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Interactive Dynamic Scroll Explorer Indicator -->
      <div 
        class="scroll-indicator"
        :class="{ 'is-hidden': isDetailOpen || scrollProgress > 0.96 }"
      >
        <div class="scroll-mouse">
          <div class="scroll-wheel"></div>
        </div>
        <span class="scroll-label">{{ scrollPhaseLabel }}</span>
      </div>

      <!-- Interactive Hotspot Detail Card & Mobile Slide-Up Drawer -->
      <HotspotDetailCard 
        :hotspot="activeHotspot"
        :is-open="isDetailOpen"
        :saved-palette="savedPalette"
        @close="closeDetail"
        @toggle-palette="handleTogglePalette"
        @order-sample="handleOrderSample"
        @explore-studio="handleExploreStudio"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useScrollCanvas } from '../../composables/useScrollCanvas.js'
import { HERO_HOTSPOTS } from '../../data/heroHotspotsData.js'
import HeroHotspotPin from './HeroHotspotPin.vue'
import HotspotDetailCard from './HotspotDetailCard.vue'

const props = defineProps({
  savedPalette: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['open-modal', 'video-loaded', 'toggle-palette'])

const canvasRef = ref(null)
const containerRef = ref(null)

const activeHotspot = ref(null)
const isDetailOpen = ref(false)

const { scrollProgress, currentFrame, currentPhase, isReady } = useScrollCanvas(canvasRef, containerRef, {
  villaFrameCount: 300,
  villaPrefix: '/sequence_villa/villa_',
  villaExt: '.webp',
  walkthroughFrameCount: 240,
  walkthroughPrefix: '/sequence/frame_',
  walkthroughExt: '.webp',
  onReady: () => {
    // Instantly dismiss preloader when initial frame is painted
    emit('video-loaded')
  }
})

// Dynamic Scroll Mouse Label based on Active Architectural Phase
const scrollPhaseLabel = computed(() => {
  if (currentPhase.value === 'villa') return 'Scroll to Explore Exterior'
  if (currentPhase.value === 'pause') return 'Scroll to Zoom In'
  if (currentPhase.value === 'zoom') return 'Entering Architecture'
  return 'Scroll to Explore Walkthrough'
})

// Active Room Identifier based on Calibrated Walkthrough Frames
const activeRoomId = computed(() => {
  if (currentPhase.value !== 'walkthrough') return ''
  const f = currentFrame.value
  if (f < 140) return 'living-room-green'
  if (f < 185) return 'dining-kitchen-blue'
  return 'master-bedroom-wall'
})

// Current Room Name based on Frame Index
const currentRoomName = computed(() => {
  const f = currentFrame.value
  if (f < 140) return 'Living Area'
  if (f < 185) return 'Dining Gallery'
  return 'Master Suite'
})

// Check if a hotspot should be visible at current frame
const isHotspotVisible = (spot) => {
  if (currentPhase.value !== 'walkthrough') return false
  return currentFrame.value >= spot.startFrame && currentFrame.value <= spot.endFrame
}

const toggleHotspot = (spot) => {
  if (activeHotspot.value?.id === spot.id && isDetailOpen.value) {
    closeDetail()
  } else {
    activeHotspot.value = spot
    isDetailOpen.value = true
  }
}

const closeDetail = () => {
  isDetailOpen.value = false
  setTimeout(() => {
    activeHotspot.value = null
  }, 350)
}

// 1-Click Smooth Teleporting to Room within Walkthrough Phase
const jumpToRoom = (spot) => {
  if (!containerRef.value) return

  let targetProgress = 0.70 // Living Area (Frame 130)
  if (spot.id === 'dining-kitchen-blue') targetProgress = 0.81 // Dining Gallery (Frame 150)
  else if (spot.id === 'master-bedroom-wall') targetProgress = 0.94 // Master Bedroom (Frame 218)

  const containerRect = containerRef.value.getBoundingClientRect()
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const containerOffsetTop = containerRect.top + scrollTop
  const totalScrollable = containerRef.value.offsetHeight - window.innerHeight
  const targetScrollY = containerOffsetTop + targetProgress * totalScrollable

  window.scrollTo({
    top: targetScrollY,
    behavior: 'smooth'
  })
}

const handleTogglePalette = (color) => {
  emit('toggle-palette', color)
}

const handleOrderSample = (spot) => {
  closeDetail()
  emit('open-modal', {
    surface: 'Wall',
    preferredColor: spot.color
  })
}

const handleExploreStudio = () => {
  closeDetail()
  const studioElem = document.getElementById('color-studio')
  if (studioElem) {
    studioElem.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.hero-scroll-track {
  position: relative;
  height: 520vh;
  background-color: #161412;
}

@media (hover: hover) and (pointer: fine) {
  .hero-scroll-track {
    cursor: default;
  }
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

.hero-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.04) 40%, rgba(10, 8, 7, 0.55) 100%),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, transparent 20%, transparent 75%, rgba(0, 0, 0, 0.65) 100%);
  z-index: 2;
  pointer-events: none;
}

/* Hotspots Pin Overlay */
.hotspots-layer {
  position: absolute;
  inset: 0;
  z-index: 15;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.hotspots-layer.is-hidden {
  opacity: 0;
  pointer-events: none;
}

/* Active Room Nav Pill (Top Center) */
.room-nav-pill {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%) translateY(-10px);
  z-index: 20;
  background: rgba(18, 16, 14, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 100px;
  padding: 6px 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f7f6f4;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.room-nav-pill.is-visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.room-nav-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #D4AF37;
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.8);
  animation: pulseGold 2s infinite;
}

@keyframes pulseGold {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.6; }
  100% { transform: scale(1); opacity: 1; }
}

.room-nav-text {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #ffffff;
}

.room-nav-frame {
  font-size: 0.7rem;
  color: #9a948c;
  font-family: monospace;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  padding-left: 8px;
}

/* Floating Bottom Room Switcher Dock */
.room-switcher-dock {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  z-index: 22;
  width: 90%;
  max-width: 820px;
  pointer-events: auto;
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.room-switcher-dock.is-visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.dock-inner {
  background: rgba(18, 16, 14, 0.88);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 100px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  overflow-x: auto;
  scrollbar-width: none;
}

.dock-inner::-webkit-scrollbar {
  display: none;
}

.dock-pill {
  flex: 1;
  min-width: 140px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 100px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #c4beb7;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left;
}

.dock-pill:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.dock-pill.is-active {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(212, 175, 55, 0.45);
  color: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.dock-swatch {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.swatch-glint {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), transparent);
}

.dock-pill-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dock-room-name {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dock-shade-code {
  font-size: 0.65rem;
  color: #9a948c;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dock-pill.is-active .dock-shade-code {
  color: #E6CA65;
}

/* Scroll Mouse Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #ffffff;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.scroll-indicator.is-hidden {
  opacity: 0;
}

.scroll-mouse {
  width: 24px;
  height: 38px;
  border: 2px solid rgba(255, 255, 255, 0.75);
  border-radius: 20px;
  position: relative;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
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

.scroll-label {
  font-size: 0.7rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #a8a29b;
}

@media (max-width: 768px) {
  .room-switcher-dock {
    bottom: 16px;
    width: 95%;
  }
  .dock-inner {
    padding: 4px;
    gap: 4px;
  }
  .dock-pill {
    min-width: 120px;
    padding: 6px 10px;
  }
  .dock-room-name {
    font-size: 0.7rem;
  }
  .dock-shade-code {
    font-size: 0.6rem;
  }
  .room-nav-pill {
    top: 80px;
    padding: 5px 14px;
  }
  .room-nav-text {
    font-size: 0.72rem;
  }
}
</style>
