<template>
  <section id="studio" class="color-studio-section">
    <div class="container">
      <div class="section-header">
        <span class="section-subtitle">COLOR STUDIO</span>
        <h2 class="section-title">Find the exact finish & shade</h2>
        <p class="section-desc">Pick a color, choose a surface, dial in the sheen. Save your shortlist and request free physical samples.</p>
      </div>

      <div class="studio-grid">
        <!-- Room Visualizer -->
        <RoomVisualizer 
          :color="selectedColor" 
          :finish="activeFinish"
          @copy-hex="copyHex" 
        />

        <!-- Streamlined Controls Panel -->
        <div class="studio-controls-panel">
          
          <!-- 1. Surface Selection -->
          <div>
            <div class="control-group-title">1. CHOOSE SURFACE</div>
            <div class="options-row">
              <button 
                v-for="s in surfaces" 
                :key="s" 
                :class="['chip-btn', { active: activeSurface === s }]"
                @click="$emit('update:activeSurface', s)">
                {{ s }}
              </button>
            </div>
          </div>

          <!-- 2. Finish Selection -->
          <div>
            <div class="control-group-title">2. SELECT FINISH / SHEEN</div>
            <div class="options-row">
              <button 
                v-for="f in finishes" 
                :key="f" 
                :class="['chip-btn', { active: activeFinish === f }]"
                @click="$emit('update:activeFinish', f)">
                {{ f }}
              </button>
            </div>
          </div>

          <!-- 3. Color Family Swatches -->
          <div>
            <div class="control-group-title">3. SELECT SHADE SWATCH</div>
            <SwatchGrid 
              :colors="filteredColors" 
              :selected-id="selectedColor.id" 
              @select-color="$emit('select-color', $event)" 
            />
          </div>

          <!-- Compact Palette Shortlist -->
          <div class="palette-shortlist-card">
            <div class="palette-header">
              <span class="shortlist-title">MY PALETTE SHORTLIST</span>
              <span class="palette-count">{{ myPalette.length }} / 8 Shades</span>
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
  surfaces: Array,
  finishes: Array,
  families: Array,
  activeSurface: String,
  activeFinish: String,
  activeFamily: String,
  selectedColor: Object,
  myPalette: Array,
  filteredColors: Array,
  isInPalette: Function
})

defineEmits([
  'update:activeSurface',
  'update:activeFinish',
  'update:activeFamily',
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
  gap: 22px;
}

.control-group-title {
  font-size: 0.72rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--clr-accent-gold);
  font-weight: 600;
  margin-bottom: 10px;
}

.options-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip-btn {
  padding: 7px 16px;
  border-radius: 30px;
  font-size: 0.82rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--clr-border-dark);
  color: var(--clr-text-light);
  transition: var(--transition-smooth);
}

.chip-btn:hover,
.chip-btn.active {
  background: var(--clr-primary);
  border-color: var(--clr-primary);
  color: #ffffff;
}

.palette-shortlist-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed var(--clr-border-dark);
  border-radius: 16px;
  padding: 18px;
  margin-top: 6px;
}

.palette-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
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
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
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
  margin-top: 14px;
}

@media (max-width: 1024px) {
  .studio-grid {
    grid-template-columns: 1fr;
  }
}
</style>
