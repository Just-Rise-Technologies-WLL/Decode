<template>
  <div class="studio-preview-box">
    <!-- Realistic Room Photo Visualizer with Blend-Mode Paint Overlay -->
    <div class="room-visualizer-container">
      
      <!-- Base Architectural Room Photo (Lighting, Shadows & Furniture) -->
      <img 
        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80" 
        alt="Room Wall Visualizer" 
        class="room-base-img">

      <!-- Dynamic Paint Tint Layer (Mix-Blend-Mode Multiply) -->
      <div 
        class="wall-paint-overlay"
        :style="{ 
          backgroundColor: color.hex,
          opacity: sheenOpacity
        }">
      </div>

      <!-- Surface Texture & Highlight Overlay Layer -->
      <div class="room-highlight-layer"></div>

      <!-- Sheen Finish Badge Floating Tag -->
      <span class="finish-badge-tag">{{ finish }} Finish</span>
    </div>

    <!-- Active Color Details Bar -->
    <div class="active-color-meta">
      <div>
        <span class="meta-label">SELECTED COLOR</span>
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
import { computed } from 'vue'

const props = defineProps({
  color: { type: Object, required: true },
  finish: { type: String, default: 'Matte' }
})

defineEmits(['copy-hex'])

const sheenOpacity = computed(() => {
  switch (props.finish) {
    case 'Matte': return 0.82
    case 'Eggshell': return 0.78
    case 'Satin': return 0.75
    case 'Semi-Gloss': return 0.70
    case 'Textured': return 0.85
    default: return 0.80
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
  height: 380px;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
  background-color: #1a1615;
}

.room-base-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Dynamic Paint Layer using Multiply Blend Mode for realistic lighting & shadows */
.wall-paint-overlay {
  position: absolute;
  inset: 0;
  mix-blend-mode: multiply;
  transition: background-color 0.4s ease, opacity 0.4s ease;
  pointer-events: none;
}

/* Highlights overlay for 3D realism */
.room-highlight-layer {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%, rgba(0,0,0,0.2) 100%);
  pointer-events: none;
}

.finish-badge-tag {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  color: var(--clr-accent-gold);
  border: 1px solid rgba(212, 175, 55, 0.3);
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 600;
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
</style>
