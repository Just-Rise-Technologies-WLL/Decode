<template>
  <section id="projects" class="projects-section">
    <div class="container">
      <div class="section-header">
        <span class="section-subtitle">PROJECTS</span>
        <h2 class="section-title">Trusted on landmark builds across the region</h2>
        <p class="section-desc">From iconic skyscrapers to luxury hospitality resorts, Prisma provides unmatched quality and lasting durability.</p>
      </div>

      <div class="projects-grid">
        <div v-for="p in PROJECTS" :key="p.id" class="project-card">
          <img :src="p.image" :alt="p.name">
          <div class="project-info-overlay">
            <span class="project-tag">{{ p.location }}</span>
            <h3 class="project-name">{{ p.name }}</h3>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { PROJECTS } from '../../data/projectsData.js'
</script>

<style scoped>
.projects-section {
  padding: 120px 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 50px;
}

.project-card {
  position: relative;
  height: 380px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
}

.project-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.project-card:hover img {
  transform: scale(1.08);
}

.project-info-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(36, 34, 32, 0.9) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px;
  color: #ffffff;
}

.project-tag {
  font-size: 0.7rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--clr-accent-gold);
  margin-bottom: 4px;
}

.project-name {
  font-size: 1.4rem;
}

@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
