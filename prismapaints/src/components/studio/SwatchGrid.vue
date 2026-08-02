<template>
  <div class="swatch-grid-5">
    <div 
      v-for="color in colors" 
      :key="color.id"
      :class="['swatch-card-item', { active: selectedId === color.id }]"
      @click="$emit('select-color', color)">
      
      <!-- Color Swatch Circle / Box -->
      <div 
        class="swatch-color-pill" 
        :style="{ backgroundColor: color.hex }">
        <span v-if="selectedId === color.id" class="active-check">✓</span>
      </div>

      <!-- Color Name & Hex Label -->
      <div class="swatch-info">
        <span class="swatch-name">{{ color.name }}</span>
        <span class="swatch-hex">{{ color.hex }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  colors: Array,
  selectedId: Number
})

defineEmits(['select-color'])
</script>

<style scoped>
.swatch-grid-5 {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}

.swatch-card-item {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.swatch-card-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-4px);
}

.swatch-card-item.active {
  background: rgba(212, 175, 55, 0.12);
  border-color: var(--clr-accent-gold);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  transform: translateY(-4px);
}

.swatch-color-pill {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.swatch-card-item.active .swatch-color-pill {
  border-color: var(--clr-accent-gold);
  transform: scale(1.08);
}

.active-check {
  color: #ffffff;
  font-weight: 800;
  font-size: 1.2rem;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7);
}

.swatch-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.swatch-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
}

.swatch-hex {
  font-size: 0.72rem;
  color: var(--clr-accent-gold);
  opacity: 0.85;
  font-family: monospace;
  margin-top: 2px;
}

@media (max-width: 900px) {
  .swatch-grid-5 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 540px) {
  .swatch-grid-5 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
