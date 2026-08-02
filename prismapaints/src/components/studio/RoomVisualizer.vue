<template>
  <div class="studio-preview-box">
    <!-- Photorealistic Room Visualizer with Stacked Morph-Dissolve Engine -->
    <div class="room-visualizer-container">
      
      <!-- Previous Background Image (Pinned underneath during morph) -->
      <img 
        v-if="previousImage"
        :src="previousImage" 
        alt="Previous Wall Visualizer" 
        class="room-photo photo-bg">

      <!-- Active Foreground Image (Morphs & dissolves smoothly over previous image) -->
      <img 
        :key="color.id"
        :src="color.image" 
        :alt="color.name + ' Wall Visualizer'" 
        class="room-photo photo-fg"
        :class="{ 'morphing': isMorphing }">

      <!-- Surface Lighting & Highlight Overlay Layer -->
      <div class="room-highlight-layer"></div>
    </div>

    <!-- Active Selected Color Meta Details -->
    <div class="active-color-meta">
      <div>
        <span class="meta-label">SELECTED SHADE</span>
        <h3 class="color-title">{{ color.name }}</h3>
        <p class="color-desc">{{ color.desc }}</p>
      </div>
      <div>
        <button class="color-hex-tag" @click="$emit('copy-hex', color.hex)" title="Click to copy HEX">
          {{ color.hex }} 📋
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  color: { type: Object, required: true }
})

defineEmits(['copy-hex'])

const previousImage = ref(null)
const isMorphing = ref(false)

watch(() => props.color, (newColor, oldColor) => {
  if (oldColor && oldColor.image && oldColor.image !== newColor.image) {
    previousImage.value = oldColor.image
    isMorphing.value = true
    
    setTimeout(() => {
      isMorphing.value = false
    }, 450)
  }
})
</script>

<style scoped>
.studio-preview-box {
  background: var(--clr-dark-card);
  border: 1px solid var(--clr-border-dark);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.4);
}

.room-visualizer-container {
  width: 100%;
  height: 440px;
  border-radius: 18px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
  background-color: #1a1615;
}

.room-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.photo-bg {
  z-index: 1;
}

.photo-fg {
  z-index: 2;
  transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.photo-fg.morphing {
  animation: morphDissolve 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes morphDissolve {
  0% {
    opacity: 0;
    transform: scale(1.018);
    filter: blur(1px);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0px);
  }
}

/* Highlights overlay for 3D depth */
.room-highlight-layer {
  position: absolute;
  inset: 0;
  z-index: 3;
  background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%, rgba(0,0,0,0.2) 100%);
  pointer-events: none;
}

.active-color-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--clr-border-dark);
}

.meta-label {
  font-size: 0.7rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--clr-accent-gold);
  font-weight: 600;
  display: block;
  margin-bottom: 2px;
}

.color-title {
  font-size: 1.6rem;
  color: #ffffff;
  margin-bottom: 2px;
}

.color-desc {
  font-size: 0.85rem;
  color: var(--clr-text-light);
  opacity: 0.8;
}

.color-hex-tag {
  font-size: 0.85rem;
  color: var(--clr-accent-gold);
  background: rgba(212, 175, 55, 0.12);
  border: 1px solid rgba(212, 175, 55, 0.25);
  padding: 6px 14px;
  border-radius: 20px;
  font-family: monospace;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.color-hex-tag:hover {
  background: var(--clr-accent-gold);
  color: #1f1211;
}

@media (max-width: 640px) {
  .room-visualizer-container {
    height: 320px;
  }
}
</style>
