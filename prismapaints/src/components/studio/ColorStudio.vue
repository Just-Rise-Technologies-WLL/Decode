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
        <RoomVisualizer :color="selectedColor" @copy-hex="copyHex" />

        <!-- Controls Panel -->
        <div class="studio-controls-panel">
          <!-- 1. Surface -->
          <div>
            <div class="control-group-title">1. Choose Surface</div>
            <div class="options-row">
              <button 
                v-for="s in surfaces" 
                :key="s" 
                :class="['chip-btn', { active: activeSurface === s }]"
                @click="activeSurface = s">
                {{ s }}
              </button>
            </div>
          </div>

          <!-- 2. Finish -->
          <div>
            <div class="control-group-title">2. Select Finish / Sheen</div>
            <div class="options-row">
              <button 
                v-for="f in finishes" 
                :key="f" 
                :class="['chip-btn', { active: activeFinish === f }]"
                @click="activeFinish = f">
                {{ f }}
              </button>
            </div>
          </div>

          <!-- 3. Family -->
          <div>
            <div class="control-group-title">3. Color Family</div>
            <div class="options-row">
              <button 
                v-for="fam in families" 
                :key="fam" 
                :class="['chip-btn', { active: activeFamily === fam }]"
                @click="activeFamily = fam">
                {{ fam }}
              </button>
            </div>
          </div>

          <!-- 4. Swatches -->
          <div>
            <div class="control-group-title">4. Select Shade Swatch</div>
            <SwatchGrid :colors="filteredColors" :selected-id="selectedColor.id" @select-color="selectColor" />
          </div>

          <!-- Palette Shortlist -->
          <div class="palette-shortlist-card">
            <div class="palette-header">
              <span style="font-weight: 600; font-size: 0.9rem;">MY PALETTE SHORTLIST</span>
              <span class="palette-count">{{ myPalette.length }} / 8 Shades</span>
            </div>

            <div class="palette-swatches-list">
              <div 
                v-for="c in myPalette" 
                :key="c.id"
                class="mini-swatch"
                :style="{ backgroundColor: c.hex }"
                :title="c.name + ' - Click to remove'"
                @click="togglePalette(c)">
              </div>
              <p v-if="myPalette.length === 0" style="font-size: 0.85rem; color: rgba(255,255,255,0.4);">
                Click "Add to Palette" below to build your sample shortlist.
              </p>
            </div>

            <div style="display: flex; gap: 12px; margin-top: 16px;">
              <button @click="togglePalette(selectedColor)" class="btn-outline" style="border-color: rgba(255,255,255,0.3); color: #ffffff; flex: 1;">
                {{ isInPalette(selectedColor.id) ? '✓ Saved in Palette' : '+ Add Current Shade' }}
              </button>
              <button @click="$emit('open-modal')" class="btn-primary" style="flex: 1;">Request Sample →</button>
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

defineEmits(['select-color', 'toggle-palette', 'copy-hex', 'open-modal'])
</script>

<style scoped>
.color-studio-section {
  background-color: var(--clr-dark-bg);
  color: #ffffff;
  padding: 120px 0;
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
  gap: 50px;
  align-items: start;
  margin-top: 50px;
}

.studio-controls-panel {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.control-group-title {
  font-size: 0.75rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--clr-text-light);
  opacity: 0.8;
  margin-bottom: 12px;
}

.options-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip-btn {
  padding: 8px 18px;
  border-radius: 30px;
  font-size: 0.85rem;
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
  padding: 20px;
}

.palette-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.palette-count {
  font-size: 0.8rem;
  color: var(--clr-accent-gold);
}

.palette-swatches-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  min-height: 48px;
  align-items: center;
}

.mini-swatch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.2);
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.mini-swatch:hover {
  transform: scale(1.15);
}

@media (max-width: 1024px) {
  .studio-grid {
    grid-template-columns: 1fr;
  }
}
</style>
