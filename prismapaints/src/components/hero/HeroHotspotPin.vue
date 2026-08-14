<template>
  <div 
    class="hotspot-pin-wrapper"
    :class="{ 'is-active': isActive, 'is-visible': isVisible }"
    :style="{
      left: `${hotspot.x}%`,
      top: `${hotspot.y}%`
    }"
  >
    <!-- Radar Pulse Wave Rings -->
    <div class="pulse-ring pulse-ring-1"></div>
    <div class="pulse-ring pulse-ring-2"></div>

    <!-- Main Circular Hotspot Button -->
    <button 
      class="hotspot-btn"
      :aria-label="`Explore ${hotspot.color.name}`"
      @click.stop="$emit('toggle', hotspot)"
    >
      <span class="btn-icon" :class="{ 'icon-rotate': isActive }">
        <svg v-if="!isActive" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </span>
    </button>

    <!-- Mini Hover Capsule Label -->
    <div class="hotspot-preview-tag" v-if="!isActive">
      <span class="color-dot" :style="{ backgroundColor: hotspot.color.hex }"></span>
      <span class="tag-title">{{ hotspot.color.code }} {{ hotspot.color.name }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  hotspot: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: true
  }
})

defineEmits(['toggle'])
</script>

<style scoped>
.hotspot-pin-wrapper {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 25;
  pointer-events: auto;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.6);
  transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hotspot-pin-wrapper.is-visible {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

/* Radar Pulse Rings */
.pulse-ring {
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  pointer-events: none;
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 16px rgba(255, 255, 255, 0.4);
  animation: pulseRadar 2.6s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
}

.pulse-ring-2 {
  animation-delay: 1.3s;
}

@keyframes pulseRadar {
  0% {
    transform: scale(0.6);
    opacity: 0.9;
  }
  70% {
    transform: scale(1.8);
    opacity: 0;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}

/* Main Button */
.hotspot-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255, 255, 255, 0.95);
  color: #1a1816;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 1);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  padding: 0;
}

.hotspot-pin-wrapper:hover .hotspot-btn {
  transform: scale(1.15);
  background: #ffffff;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}

.hotspot-pin-wrapper.is-active .hotspot-btn {
  background: #1a1816;
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.icon-rotate {
  transform: rotate(90deg);
}

/* Mini Tag on Hover */
.hotspot-preview-tag {
  position: absolute;
  left: 48px;
  white-space: nowrap;
  background: rgba(18, 16, 14, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transform: translateX(-8px);
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.hotspot-pin-wrapper:hover .hotspot-preview-tag {
  opacity: 1;
  transform: translateX(0);
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .pulse-ring {
    width: 40px;
    height: 40px;
  }
  .hotspot-btn {
    width: 36px;
    height: 36px;
  }
  .hotspot-preview-tag {
    display: none; /* Keep clean on mobile, full drawer will open */
  }
}
</style>
