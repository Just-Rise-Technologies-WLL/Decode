<template>
  <section class="finishes-section">
    <div class="container">
      <div class="section-header">
        <span class="section-subtitle">ARCHITECTURAL PAINTS</span>
        <h2 class="section-title">Interior & exterior finishes, engineered to last</h2>
        <p class="section-desc">Discover premium interior and exterior paints engineered for superior performance, lasting beauty, and flawless finishes.</p>
      </div>

      <div class="finishes-grid">
        <div class="finish-card">
          <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" alt="Interior Emulsions">
          <div class="finish-overlay">
            <span class="finish-category">INTERIOR EMULSIONS</span>
            <h3 class="finish-name">Interior Emulsions</h3>
            <p class="finish-info">Elegant colours and smooth velvet finishes for beautiful, long-lasting interiors.</p>
          </div>
        </div>

        <div class="finish-card">
          <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" alt="Exterior Emulsions">
          <div class="finish-overlay">
            <span class="finish-category">EXTERIOR EMULSIONS</span>
            <h3 class="finish-name">Exterior Emulsions</h3>
            <p class="finish-info">Weather-resistant coatings that protect and enhance every exterior facade.</p>
          </div>
        </div>

        <div class="finish-card">
          <img src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80" alt="Enamel Paints">
          <div class="finish-overlay">
            <span class="finish-category">ENAMEL PAINTS</span>
            <h3 class="finish-name">Enamel Paints</h3>
            <p class="finish-info">Smooth, durable sheen with rich color retention and heavy protection.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Split Banner Highlight -->
  <section class="feature-split-section">
    <div class="feature-split-content">
      <span class="section-subtitle" style="color: var(--clr-accent-gold);">INSPIRED INTERIOR SHADES</span>
      <h2 class="feature-split-title">Find your perfect shade. Create your perfect space.</h2>
      <p style="font-size: 1.1rem; opacity: 0.9; margin-bottom: 30px;">Our bespoke color matching engine enables architects, interior designers, and homeowners to achieve exact tonal harmony.</p>
      <div>
        <button @click="$emit('open-modal')" class="btn-primary" style="background-color: #ffffff; color: var(--clr-primary);">Consult Color Expert</button>
      </div>
    </div>

    <div class="feature-split-images">
      <div class="feature-img-box">
        <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80" alt="Living Room Aesthetics">
      </div>
      <div class="feature-img-box">
        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80" alt="Architectural Archway">
      </div>
    </div>
  </section>
</template>

<script setup>
defineEmits(['open-modal'])
</script>

<style scoped>
.finishes-section {
  padding: 80px 0 120px;
}

.finishes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.finish-card {
  position: relative;
  height: 440px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
}

.finish-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.finish-card:hover img {
  transform: scale(1.06);
}

.finish-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.1) 40%, rgba(36, 34, 32, 0.85) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 32px;
  color: #ffffff;
}

.finish-category {
  font-size: 0.75rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--clr-accent-gold);
  margin-bottom: 6px;
  font-weight: 600;
}

.finish-name {
  font-size: 1.8rem;
  margin-bottom: 8px;
}

.finish-info {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 300;
}

/* Feature Split Section */
.feature-split-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: var(--clr-primary);
  color: #ffffff;
  overflow: hidden;
}

.feature-split-content {
  padding: 100px 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.feature-split-title {
  font-size: 3.2rem;
  line-height: 1.12;
  margin-bottom: 24px;
}

.feature-split-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 20px;
}

.feature-img-box {
  height: 100%;
  min-height: 320px;
  border-radius: 16px;
  overflow: hidden;
}

.feature-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 1024px) {
  .feature-split-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .finishes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
