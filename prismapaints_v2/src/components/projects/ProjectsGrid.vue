<template>
  <section id="projects" class="projects-section">
    <div class="container">
      <div class="section-header">
        <span class="section-subtitle">PROJECTS</span>
        <h2 class="section-title">Trusted on landmark builds across the region</h2>
        <p class="section-desc">Drag the interactive before & after slider on any landmark below to reveal the Prisma paint transformation.</p>
      </div>

      <div class="projects-grid">
        <div v-for="p in PROJECTS" :key="p.id" class="project-card-wrapper">
          
          <div class="project-meta-header">
            <span class="project-tag">{{ p.location }}</span>
            <h3 class="project-name">{{ p.name }}</h3>
          </div>

          <BeforeAfterSlider 
            :before-img="p.beforeImage"
            :after-img="p.afterImage"
            before-tag="Construction"
            after-tag="Completed"
            height="380px"
          />

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import BeforeAfterSlider from '../common/BeforeAfterSlider.vue'
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

.project-card-wrapper {
  background: var(--clr-bg-card);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  border: 1px solid var(--clr-border);
  transition: var(--transition-smooth);
}

.project-card-wrapper:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-hover);
}

.project-meta-header {
  padding: 20px 20px 14px 20px;
  border-bottom: 1px solid var(--clr-border);
}

.project-tag {
  font-size: 0.7rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--clr-primary);
  font-weight: 600;
  margin-bottom: 2px;
  display: block;
}

.project-name {
  font-size: 1.3rem;
  color: var(--clr-text-main);
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
