<template>
  <section id="studio" class="color-studio-section">
    <div class="container">
      <div class="section-header">
        <span class="section-subtitle">REAL COLOR VISUALIZER</span>
        <h2 class="section-title">Select shade swatch to paint room wall</h2>
        <p class="section-desc">Pick any of our 5 signature shades below to preview the real paint finish on the architectural wall in real time.</p>
      </div>

      <div class="studio-grid">
        <!-- Room Visualizer with Wall Paint Blend Engine & Photo Frame -->
        <RoomVisualizer 
          :color="selectedColor" 
          @copy-hex="copyHex" 
        />

        <!-- Streamlined Controls Panel (Only 5 Color Swatches + Palette Shortlist) -->
        <div class="studio-controls-panel">
          
          <!-- SELECT SHADE SWATCH (5 Curated Colors) -->
          <div>
            <div class="control-group-title">SELECT SHADE SWATCH</div>
            <SwatchGrid 
              :colors="filteredColors" 
              :selected-id="selectedColor.id" 
              @select-color="$emit('select-color', $event)" 
            />
          </div>

          <!-- Palette Shortlist Card -->
          <div class="palette-shortlist-card">
            <div class="palette-header">
              <span class="shortlist-title">MY PALETTE SHORTLIST</span>
              <span class="palette-count">{{ myPalette.length }} / 5 Shades</span>
            </div>

            <div class="palette-swatches-list">
              <div 
                v-for="c in myPalette" 
                :key="c.id"
                class="mini-swatch"
                :style="{ backgroundColor: c.hex }"
                :title="c.name + ' - Click to remove'"
                @click="$emit('toggle-palette', c)">
              </div>
              <p v-if="myPalette.length === 0" class="empty-hint">
                Click "+ Add Current Shade" to save samples.
              </p>
            </div>

            <div class="action-btn-row">
              <button 
                @click="$emit('toggle-palette', selectedColor)" 
                class="btn-outline" 
                style="border-color: rgba(255,255,255,0.3); color: #ffffff; flex: 1;">
                {{ isInPalette(selectedColor.id) ? '✓ Saved' : '+ Add Current Shade' }}
              </button>
              <button @click="$emit('open-modal')" class="btn-primary" style="flex: 1.2;">
                Request Sample →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import RoomVisualizer from './RoomVisualizer.vue'
import SwatchGrid from './SwatchGrid.vue'

defineProps({
  selectedColor: Object,
  myPalette: Array,
  filteredColors: Array,
  isInPalette: Function
})

defineEmits([
  'select-color', 
  'toggle-palette', 
  'copy-hex', 
  'open-modal'
])
</script>

<style scoped>
.color-studio-section {
  background-color: var(--clr-dark-bg);
  color: #ffffff;
  padding: 100px 0;
  position: relative;
}

.color-studio-section .section-subtitle {
  color: var(--clr-accent-gold);
}

.color-studio-section .section-title {
  color: #ffffff;
}

.studio-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  align-items: start;
  margin-top: 40px;
}

.studio-controls-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.control-group-title {
  font-size: 0.78rem;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--clr-accent-gold);
  font-weight: 600;
  margin-bottom: 14px;
}

.palette-shortlist-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed var(--clr-border-dark);
  border-radius: 20px;
  padding: 22px;
  margin-top: 6px;
}

.palette-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.shortlist-title {
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 1px;
  color: var(--clr-text-light);
}

.palette-count {
  font-size: 0.78rem;
  color: var(--clr-accent-gold);
}

.palette-swatches-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  min-height: 40px;
  align-items: center;
}

.mini-swatch {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.4);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.mini-swatch:hover {
  transform: scale(1.18);
}

.empty-hint {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
}

.action-btn-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

@media (max-width: 1024px) {
  .studio-grid {
    grid-template-columns: 1fr;
  }
}
</style>
