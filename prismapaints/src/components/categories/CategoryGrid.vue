<template>
  <section id="architectural" class="categories-section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header">
        <span class="section-tag">SPECIALIZED COATING CATEGORIES</span>
        <h2 class="section-title">Tailored Paint & Coating Solutions</h2>
        <p class="section-subtitle">
          From luxury architectural finishes to heavy-duty industrial and road marking systems engineered in Kingdom of Bahrain.
        </p>
      </div>

      <div class="categories-grid">
        <CategoryCard 
          tag="ARCHITECTURAL" 
          title="Architectural Finishes" 
          desc="Transform your spaces with vibrant colours and premium finishes from Prisma. Engineered for longevity and understated luxury."
          image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" 
        />
        <CategoryCard 
          id="industrial"
          tag="INDUSTRIAL" 
          title="Industrial Coatings" 
          desc="Protect and enhance your structures with high-performance primers, topcoats, epoxies, and polyurethane solutions."
          image="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80" 
        />
        <CategoryCard 
          tag="THINNERS" 
          title="Thinners & Solvents" 
          desc="Formulated to achieve optimal viscosity, fast drying, smooth spraying, and flawless finish consistency."
          image="https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80" 
        />
        <CategoryCard 
          tag="TRACK & ROAD" 
          title="Track & Road Markings" 
          desc="Acrylic water-based coatings designed for kerbs, racing circuits, and high-abrasion outdoor surfaces."
          image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80" 
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import CategoryCard from './CategoryCard.vue'
</script>

<style scoped>
.categories-section {
  padding: 120px 0 80px;
  background-color: var(--clr-bg-light);
}

.container {
  width: 90%;
  max-width: 1240px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 60px;
}

.section-tag {
  font-size: 0.82rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--clr-primary);
  font-weight: 700;
  margin-bottom: 12px;
  display: block;
}

.section-title {
  font-size: 2.8rem;
  color: var(--clr-text-main);
  margin-bottom: 14px;
  line-height: 1.15;
}

.section-subtitle {
  font-size: 1.05rem;
  color: var(--clr-text-muted);
  line-height: 1.6;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}

@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
