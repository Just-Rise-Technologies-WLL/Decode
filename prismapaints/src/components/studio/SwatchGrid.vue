<template>
  <div class="swatch-grid">
    <div 
      v-for="color in colors" 
      :key="color.id"
      :class="['swatch-item', { active: selectedId === color.id }]"
      :style="{ backgroundColor: color.hex }"
      :title="color.name + ' (' + color.hex + ')'"
      @click="$emit('select-color', color)">
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
.swatch-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.swatch-item {
  height: 60px;
  border-radius: 12px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: var(--transition-smooth);
  position: relative;
}

.swatch-item:hover,
.swatch-item.active {
  transform: scale(1.1);
  border-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  z-index: 2;
}

@media (max-width: 640px) {
  .swatch-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
