<template>
  <section id="about" class="about-section">
    <div class="container">
      <div class="about-grid">
        <!-- 1st Column: Text Content -->
        <div class="about-text-col">
          <span class="section-tag">ABOUT PRISMA PAINTS</span>
          <h2 class="about-title">Crafting Luxury & Architectural Precision</h2>
          
          <p class="about-lead">
            Manufactured with pride in Sitra Industrial Area, Kingdom of Bahrain, Prisma Paints represents the pinnacle of premium decorative, architectural, and industrial coatings.
          </p>
          
          <p class="about-desc">
            Formulated using state-of-the-art European resin technologies and micro-pigment refining techniques, our paints deliver unmatched color depth, durability, and smooth velvet finishes. Whether for luxury private residences or heavy-duty industrial structures, Prisma Paints brings spaces to life with vibrant longevity.
          </p>

          <div class="about-features">
            <div class="feature-item">
              <div class="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div>
                <h4 class="feature-title">25+ Years Excellence</h4>
                <p class="feature-text">Trusted across commercial & residential landmarks in Bahrain.</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div>
                <h4 class="feature-title">Eco-Friendly & Low VOC</h4>
                <p class="feature-text">Safe, non-toxic formulations for clean indoor air quality.</p>
              </div>
            </div>
          </div>

          <div class="about-actions">
            <a href="#studio" class="btn-primary">Discover Color Studio</a>
            <a href="#contact" class="btn-outline">Contact Our Team</a>
          </div>
        </div>

        <!-- 2nd Column: Product Image (red.png) -->
        <div class="about-image-col">
          <div class="image-wrapper">
            <div class="image-bg-glow"></div>
            <img 
              src="/products/red.png" 
              alt="Prisma Paints Luxury Red Finish Can" 
              class="about-img" 
            />
            <div class="image-badge">
              <span class="badge-number">100%</span>
              <span class="badge-label">Bahrain Crafted Quality</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.about-section {
  padding: 120px 0;
  background-color: var(--clr-bg-light);
  position: relative;
  overflow: hidden;
}

.container {
  width: 90%;
  max-width: 1240px;
  margin: 0 auto;
}

.about-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 64px;
  align-items: center;
}

/* 1st Column: Text */
.about-text-col {
  display: flex;
  flex-direction: column;
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

.about-title {
  font-size: 3rem;
  color: var(--clr-text-main);
  margin-bottom: 24px;
  line-height: 1.12;
}

.about-lead {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--clr-primary-dark);
  margin-bottom: 18px;
  line-height: 1.6;
}

.about-desc {
  font-size: 1rem;
  color: var(--clr-text-muted);
  margin-bottom: 36px;
  line-height: 1.7;
}

.about-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 40px;
}

.feature-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(124, 59, 41, 0.08);
  color: var(--clr-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-title {
  font-size: 1.05rem;
  color: var(--clr-text-main);
  margin-bottom: 4px;
  font-weight: 600;
  font-family: var(--font-sans);
}

.feature-text {
  font-size: 0.85rem;
  color: var(--clr-text-muted);
  line-height: 1.4;
}

.about-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  border-radius: 40px;
  font-size: 0.85rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 600;
  border: 1px solid var(--clr-primary);
  color: var(--clr-primary);
  text-decoration: none;
  transition: var(--transition-smooth);
}

.btn-outline:hover {
  background-color: var(--clr-primary);
  color: #ffffff;
}

/* 2nd Column: Image */
.about-image-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-wrapper {
  position: relative;
  width: 100%;
  max-width: 480px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.image-bg-glow {
  position: absolute;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(196, 154, 108, 0.25) 0%, rgba(124, 59, 41, 0) 70%);
  border-radius: 50%;
  z-index: 1;
  filter: blur(20px);
}

.about-img {
  width: 100%;
  height: auto;
  max-height: 520px;
  object-fit: contain;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 25px 35px rgba(0, 0, 0, 0.18));
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.about-img:hover {
  transform: translateY(-8px) scale(1.02);
}

.image-badge {
  position: absolute;
  bottom: 20px;
  right: 10px;
  z-index: 3;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--clr-border);
  padding: 16px 24px;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.badge-number {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--clr-primary);
  line-height: 1;
}

.badge-label {
  font-size: 0.72rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--clr-text-muted);
  font-weight: 600;
  margin-top: 4px;
}

/* Responsive */
@media (max-width: 1024px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .about-title {
    font-size: 2.4rem;
  }
}

@media (max-width: 640px) {
  .about-section {
    padding: 80px 0;
  }

  .about-features {
    grid-template-columns: 1fr;
  }

  .about-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-outline {
    text-align: center;
  }
}
</style>
