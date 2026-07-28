<template>
  <div class="category-card">
    <div class="category-thumb-wrapper">
      <img :src="image" :alt="title">
    </div>
    <div class="category-body">
      <span class="category-tag">{{ tag }}</span>
      <h3 class="category-title">{{ title }}</h3>
      <p class="category-desc">{{ desc }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tag: String,
  title: String,
  desc: String,
  image: String
})
</script>

<style scoped>
.category-card {
  background: var(--clr-bg-card);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition: var(--transition-smooth);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--clr-border);
}

.category-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-hover);
}

.category-thumb-wrapper {
  height: 320px;
  overflow: hidden;
  border-radius: 140px 140px 0 0;
  margin: 16px 16px 0 16px;
  position: relative;
}

.category-thumb-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.category-card:hover .category-thumb-wrapper img {
  transform: scale(1.08);
}

.category-body {
  padding: 24px 20px 30px;
}

.category-tag {
  font-size: 0.75rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--clr-primary);
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
}

.category-title {
  font-size: 1.5rem;
  margin-bottom: 12px;
  color: var(--clr-text-main);
}

.category-desc {
  font-size: 0.9rem;
  color: var(--clr-text-muted);
  line-height: 1.55;
}
</style>
