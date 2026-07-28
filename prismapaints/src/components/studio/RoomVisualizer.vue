<template>
  <div class="studio-preview-box">
    <div class="room-visualizer-canvas" :style="{ backgroundColor: color.hex }">
      <svg class="room-overlay-svg" viewBox="0 0 800 500" preserveAspectRatio="none">
        <path d="M0,0 L200,120 L600,120 L800,0 M200,120 L200,500 M600,120 L600,500 M0,500 L200,500 M600,500 L800,500" stroke="rgba(0,0,0,0.15)" stroke-width="2" fill="none"/>
        <rect x="300" y="160" width="200" height="180" rx="8" fill="rgba(255,255,255,0.4)" stroke="rgba(0,0,0,0.1)" stroke-width="2"/>
      </svg>
    </div>

    <div class="active-color-meta">
      <div>
        <span style="font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; color: var(--clr-accent-gold);">SELECTED COLOR</span>
        <h3 class="color-title">{{ color.name }}</h3>
        <p style="font-size: 0.85rem; color: var(--clr-text-light); opacity: 0.8;">{{ color.desc }}</p>
      </div>
      <div>
        <span class="color-hex-tag" @click="$emit('copy-hex', color.hex)" title="Click to copy HEX">
          {{ color.hex }} 📋
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  color: Object
})

defineEmits(['copy-hex'])
</script>

<style scoped>
.studio-preview-box {
  background: var(--clr-dark-card);
  border: 1px solid var(--clr-border-dark);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.4);
}

.room-visualizer-canvas {
  width: 100%;
  height: 380px;
  border-radius: 16px;
  background-color: #dfd8cc;
  position: relative;
  overflow: hidden;
  transition: background-color 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.room-overlay-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
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

.color-title {
  font-size: 1.6rem;
  color: #ffffff;
}

.color-hex-tag {
  font-size: 0.85rem;
  color: var(--clr-accent-gold);
  background: rgba(212, 175, 55, 0.12);
  padding: 4px 12px;
  border-radius: 20px;
  font-family: monospace;
  cursor: pointer;
}
</style>
