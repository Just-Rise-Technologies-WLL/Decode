<template>
  <Teleport to="body">
    <div 
      v-if="hotspot" 
      class="hotspot-overlay"
      :class="{ 'is-open': isOpen }"
      @click.self="$emit('close')"
    >
      <!-- Backdrop Blur on Mobile / Modal click-away -->
      <div class="drawer-backdrop" @click="$emit('close')"></div>

      <!-- Main Luxury Contextual Card / Drawer -->
      <div 
        class="hotspot-card"
        :class="{ 'is-active': isOpen }"
        role="dialog"
        aria-modal="true"
      >
        <!-- Mobile Drag / Close Indicator -->
        <div class="mobile-drag-bar" @click="$emit('close')"></div>

        <!-- Header: Room Badge & Close Button -->
        <div class="card-header">
          <div class="room-badge">
            <span class="badge-dot"></span>
            <span>{{ hotspot.room }}</span>
          </div>
          <button class="close-btn" @click="$emit('close')" aria-label="Close details">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <h3 class="card-title">{{ hotspot.title }}</h3>
        <p class="card-desc">{{ hotspot.description }}</p>

        <!-- 1. Color Swatch & Code Row (Jotun Style) -->
        <div class="item-row color-row">
          <div class="color-preview-box" :style="{ backgroundColor: hotspot.color.hex }">
            <div class="color-glint"></div>
          </div>
          <div class="item-meta">
            <span class="meta-label">PRISMA LUXURY SHADE</span>
            <h4 class="color-name">{{ hotspot.color.code }} {{ hotspot.color.name }}</h4>
            <div class="color-specs">
              <span class="spec-tag">{{ hotspot.color.hex }}</span>
              <span class="spec-tag">RGB ({{ hotspot.color.rgb }})</span>
            </div>
          </div>
          <button 
            class="action-icon-btn"
            :class="{ 'is-saved': isSavedInPalette }"
            :title="isSavedInPalette ? 'Remove from Palette' : 'Save to Palette'"
            @click="$emit('toggle-palette', hotspot.color)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" :fill="isSavedInPalette ? '#D4AF37' : 'none'" :stroke="isSavedInPalette ? '#D4AF37' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        <!-- 2. Recommended Topcoat Product Row (Jotun Style) -->
        <div class="item-row product-row">
          <div class="product-thumb-box">
            <img :src="hotspot.product.image" :alt="hotspot.product.name" class="product-img" />
          </div>
          <div class="item-meta">
            <span class="meta-label">RECOMMENDED COATING</span>
            <h4 class="product-name">{{ hotspot.product.name }}</h4>
            <span class="product-sub">{{ hotspot.product.sheen }} • {{ hotspot.product.durability }}</span>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="card-actions">
          <button 
            class="btn-primary-lux"
            @click="$emit('order-sample', hotspot)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            Order Free Swatch
          </button>
          <button 
            class="btn-secondary-lux"
            @click="$emit('explore-studio', hotspot)"
          >
            Explore in Studio
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  hotspot: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  savedPalette: {
    type: Array,
    default: () => []
  }
})

defineEmits(['close', 'toggle-palette', 'order-sample', 'explore-studio'])

const isSavedInPalette = computed(() => {
  if (!props.hotspot || !props.savedPalette) return false
  return props.savedPalette.some(c => c.hex?.toLowerCase() === props.hotspot.color?.hex?.toLowerCase() || c.name === props.hotspot.color?.name)
})
</script>

<style scoped>
.hotspot-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  pointer-events: none;
}

.hotspot-overlay.is-open {
  pointer-events: auto;
}

.drawer-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 0.35s ease;
}

.hotspot-overlay.is-open .drawer-backdrop {
  opacity: 1;
}

/* Floating Card for Desktop / Tablet */
.hotspot-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  margin: 0 40px 40px 0;
  background: rgba(22, 20, 18, 0.94);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  color: #f7f6f4;
  transform: translateY(20px) scale(0.95);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}

.hotspot-card.is-active {
  transform: translateY(0) scale(1);
  opacity: 1;
}

.mobile-drag-bar {
  display: none;
  width: 44px;
  height: 5px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  margin: -8px auto 16px auto;
  cursor: pointer;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.room-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(212, 175, 55, 0.15);
  border: 1px solid rgba(212, 175, 55, 0.35);
  color: #E6CA65;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 100px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #E6CA65;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #d1cdc7;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.card-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 6px 0;
  line-height: 1.25;
}

.card-desc {
  font-size: 0.85rem;
  color: #b3aea7;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

/* Item Rows (Jotun Reference Style) */
.item-row {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 12px 14px;
  margin-bottom: 12px;
  transition: background 0.2s ease;
}

.item-row:hover {
  background: rgba(255, 255, 255, 0.08);
}

.color-preview-box {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.color-glint {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), transparent);
  border-radius: 50% 50% 0 0;
}

.product-thumb-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.product-img {
  width: 82%;
  height: 82%;
  object-fit: contain;
}

.item-meta {
  flex: 1;
  min-width: 0;
}

.meta-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: #9a948c;
  text-transform: uppercase;
  display: block;
  margin-bottom: 2px;
}

.color-name, .product-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.color-specs {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.spec-tag {
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  color: #d1cdc7;
  font-family: monospace;
}

.product-sub {
  font-size: 0.75rem;
  color: #b3aea7;
  display: block;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-icon-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #d1cdc7;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
}

.action-icon-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
}

.action-icon-btn.is-saved {
  background: rgba(212, 175, 55, 0.2);
  border-color: rgba(212, 175, 55, 0.5);
  color: #D4AF37;
}

/* Bottom Action Buttons */
.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.btn-primary-lux {
  flex: 1;
  background: linear-gradient(135deg, #7C3B29 0%, #522519 100%);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(124, 59, 41, 0.4);
  transition: all 0.25s ease;
}

.btn-primary-lux:hover {
  background: linear-gradient(135deg, #8E4430 0%, #5F2B1E 100%);
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(124, 59, 41, 0.55);
}

.btn-secondary-lux {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary-lux:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.35);
}

/* Mobile Slide-Up Bottom Sheet */
@media (max-width: 768px) {
  .hotspot-overlay {
    align-items: flex-end;
    justify-content: center;
  }

  .hotspot-card {
    margin: 0;
    max-width: 100%;
    border-radius: 28px 28px 0 0;
    padding: 20px 20px 32px 20px;
    transform: translateY(100%);
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.8);
  }

  .hotspot-card.is-active {
    transform: translateY(0);
  }

  .mobile-drag-bar {
    display: block;
  }

  .card-title {
    font-size: 1.2rem;
  }
}
</style>
