<template>
  <div id="about" ref="containerRef" class="about-products-container">
    <!-- PART 1: ABOUT US SECTION -->
    <section class="about-section">
      <div class="container">
        <div class="about-grid">
          <!-- Left Column: Text Content -->
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

          <!-- Right Column: Origin Slot for Animated Red Can -->
          <div class="about-image-col">
            <div ref="originSlotRef" class="image-wrapper-slot">
              <div class="image-bg-glow"></div>
              <!-- Placeholder boundary box for origin positioning -->
              <div class="slot-placeholder"></div>
              <div class="image-badge">
                <span class="badge-number">100%</span>
                <span class="badge-label">Bahrain Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PART 2: SIGNATURE PRODUCTS SECTION -->
    <section id="products-showcase" class="products-showcase-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">SIGNATURE COLLECTION</span>
          <h2 class="section-title">Our Premium Color Palette Series</h2>
          <p class="section-subtitle">Engineered for timeless elegance, vibrant saturation, and extreme durability.</p>
        </div>

        <!-- 3-Product Grid -->
        <div class="products-grid">
          <!-- Product 1: Green Can (Left) -->
          <div class="product-card">
            <div class="product-img-box">
              <img src="/products/green.png" alt="Prisma Emerald Green Finish Can" class="product-img" />
            </div>
            <div class="product-info">
              <span class="product-category">ARCHITECTURAL VELVET</span>
              <h3 class="product-name">Prisma Emerald Green</h3>
              <p class="product-desc">Deep, soothing forest tone providing a natural, grounding atmosphere in modern living spaces.</p>
              <button @click="$emit('open-modal')" class="btn-product-sample">Request Sample</button>
            </div>
          </div>

          <!-- Product 2: Center Empty Slot (Target for Red Can) -->
          <div class="product-card target-product-card" :class="{ 'red-landed': scrollProgress >= 0.85 }">
            <div ref="targetSlotRef" class="product-img-box target-img-box">
              <div class="target-slot-glow"></div>
              <!-- Target boundary placeholder -->
              <div class="target-placeholder"></div>
            </div>
            <div class="product-info target-info">
              <span class="product-category">LUXURY ACCENT SHADE</span>
              <h3 class="product-name">Prisma Imperial Red</h3>
              <p class="product-desc">Bold, radiant ruby hue crafted with high-chroma pigments to make an unforgettable architectural statement.</p>
              <button @click="$emit('open-modal')" class="btn-product-sample">Request Sample</button>
            </div>
          </div>

          <!-- Product 3: Blue Can (Right) -->
          <div class="product-card">
            <div class="product-img-box">
              <img src="/products/ blue.png" alt="Prisma Royal Blue Finish Can" class="product-img" />
            </div>
            <div class="product-info">
              <span class="product-category">HIGH-GLOSS MARINE & DECORATIVE</span>
              <h3 class="product-name">Prisma Royal Blue</h3>
              <p class="product-desc">Vibrant Mediterranean navy shade offering superior UV protection and luxurious satin gloss reflection.</p>
              <button @click="$emit('open-modal')" class="btn-product-sample">Request Sample</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PHOTO-REAL FLOATING RED CAN (MATCHES GREEN & BLUE CAN QUALITY 100%) -->
    <div 
      class="animated-red-can-wrapper"
      :style="canTransformStyle"
    >
      <img 
        src="/products/red.png" 
        alt="Prisma Paints Luxury Red Finish Can" 
        class="animated-red-img" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineEmits(['open-modal'])

const containerRef = ref(null)
const originSlotRef = ref(null)
const targetSlotRef = ref(null)

const scrollProgress = ref(0)
const originCoords = ref({ x: 0, y: 0, width: 340, height: 420 })
const targetCoords = ref({ x: 0, y: 0, width: 300, height: 360 })

// Calculate exact coordinates of origin and target relative to the parent container
const measureCoords = () => {
  if (!containerRef.value) return
  const containerRect = containerRef.value.getBoundingClientRect()

  if (originSlotRef.value) {
    const r = originSlotRef.value.getBoundingClientRect()
    originCoords.value = {
      x: r.left - containerRect.left + (r.width / 2),
      y: r.top - containerRect.top + (r.height / 2),
      width: r.width,
      height: r.height
    }
  }

  if (targetSlotRef.value) {
    const r = targetSlotRef.value.getBoundingClientRect()
    targetCoords.value = {
      x: r.left - containerRect.left + (r.width / 2),
      y: r.top - containerRect.top + (r.height / 2),
      width: r.width,
      height: r.height
    }
  }
}

// Compute scroll progress (0.0 to 1.0) as user scrolls between About section and Target Product grid
const updateScrollAnimation = () => {
  if (!containerRef.value || !originSlotRef.value || !targetSlotRef.value) return
  measureCoords()

  const windowH = window.innerHeight
  const originRect = originSlotRef.value.getBoundingClientRect()
  const targetRect = targetSlotRef.value.getBoundingClientRect()

  // Start animation only after user scrolls down and origin moves above 18% of viewport
  const startThreshold = windowH * 0.18
  // Complete animation when target reaches 45% of viewport
  const endThreshold = windowH * 0.45

  // Calculate p: 0 when resting in About section, 1 when arrived in Products section
  const totalTravel = (startThreshold - endThreshold) + (targetRect.top - originRect.top)
  const currentTravel = startThreshold - originRect.top

  let p = currentTravel / totalTravel
  if (isNaN(p)) p = 0
  p = Math.max(0, Math.min(1, p))

  scrollProgress.value = p
}

let animFrameId = null
const handleScroll = () => {
  if (animFrameId) cancelAnimationFrame(animFrameId)
  animFrameId = requestAnimationFrame(updateScrollAnimation)
}

onMounted(() => {
  updateScrollAnimation()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll, { passive: true })
  setTimeout(updateScrollAnimation, 200)
  setTimeout(updateScrollAnimation, 600)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
  if (animFrameId) cancelAnimationFrame(animFrameId)
})

// Dynamic CSS transform binding for the flying Red Can (Option 1: 3D Depth Parabolic Arc)
const canTransformStyle = computed(() => {
  const p = scrollProgress.value
  const orig = originCoords.value
  const targ = targetCoords.value

  // Linear X translation
  const currentX = orig.x + (targ.x - orig.x) * p

  // Parabolic curved Y trajectory (floats smoothly in an arc)
  const arcYOffset = Math.sin(p * Math.PI) * -30
  const currentY = orig.y + (targ.y - orig.y) * p + arcYOffset

  // Natural Z-axis tilt (0deg at rest -> up to 16deg mid-flight -> 0deg landed upright)
  const rotateZ = Math.sin(p * Math.PI) * 16

  // 3D Depth Scale Pulse (elevates closer to viewer during flight)
  const currentWidth = orig.width + (targ.width - orig.width) * p
  const scalePulse = 1 + Math.sin(p * Math.PI) * 0.16

  // Dynamic 3D elevation drop shadow
  const shadowBlur = 20 + Math.sin(p * Math.PI) * 30
  const shadowOffsetY = 20 + Math.sin(p * Math.PI) * 25
  const shadowOpacity = 0.2 + Math.sin(p * Math.PI) * 0.15

  return {
    transform: `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) rotate(${rotateZ}deg) scale(${scalePulse})`,
    width: `${currentWidth}px`,
    filter: `drop-shadow(0 ${shadowOffsetY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity}))`,
    opacity: 1
  }
})
</script>

<style scoped>
.about-products-container {
  position: relative;
  background-color: var(--clr-bg-light);
  overflow: hidden;
}

.container {
  width: 90%;
  max-width: 1240px;
  margin: 0 auto;
}

/* ================= PART 1: ABOUT SECTION ================= */
.about-section {
  padding: 120px 0 80px;
  position: relative;
}

.about-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 64px;
  align-items: center;
}

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

.about-image-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-wrapper-slot {
  position: relative;
  width: 100%;
  max-width: 420px;
  height: 480px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-bg-glow {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(196, 154, 108, 0.25) 0%, rgba(124, 59, 41, 0) 70%);
  border-radius: 50%;
  z-index: 1;
  filter: blur(20px);
}

.slot-placeholder {
  width: 100%;
  height: 100%;
}

.image-badge {
  position: absolute;
  bottom: 10px;
  right: 0;
  z-index: 5;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--clr-border);
  padding: 14px 22px;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.badge-number {
  font-family: var(--font-serif);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--clr-primary);
  line-height: 1;
}

.badge-label {
  font-size: 0.7rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--clr-text-muted);
  font-weight: 600;
  margin-top: 4px;
}

/* ================= PART 2: PRODUCTS SHOWCASE SECTION ================= */
.products-showcase-section {
  padding: 80px 0 120px;
  position: relative;
  background: linear-gradient(180deg, var(--clr-bg-light) 0%, #f2ece4 100%);
}

.section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 60px;
}

.section-title {
  font-size: 2.8rem;
  color: var(--clr-text-main);
  margin-top: 8px;
  margin-bottom: 14px;
}

.section-subtitle {
  font-size: 1.05rem;
  color: var(--clr-text-muted);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  align-items: stretch;
}

.product-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 36px 28px 32px;
  border: 1px solid var(--clr-border);
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.product-img-box {
  width: 100%;
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
}

.product-img {
  max-width: 100%;
  max-height: 320px;
  object-fit: contain;
  filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.15));
  transition: transform 0.4s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.target-product-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border: 2px dashed rgba(124, 59, 41, 0.3);
  transition: border-color 0.4s ease, background-color 0.4s ease;
}

.target-product-card.red-landed {
  border-style: solid;
  border-color: rgba(124, 59, 41, 0.2);
  background: #ffffff;
}

.target-img-box {
  height: 340px;
  position: relative;
}

.target-placeholder {
  width: 100%;
  height: 100%;
}

.target-slot-glow {
  position: absolute;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(164, 80, 57, 0.18) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
}

.product-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

.product-category {
  font-size: 0.72rem;
  letter-spacing: 2px;
  font-weight: 700;
  color: var(--clr-primary);
  margin-bottom: 8px;
  text-transform: uppercase;
}

.product-name {
  font-size: 1.5rem;
  color: var(--clr-text-main);
  margin-bottom: 12px;
  font-family: var(--font-serif);
}

.product-desc {
  font-size: 0.9rem;
  color: var(--clr-text-muted);
  line-height: 1.5;
  margin-bottom: 24px;
  flex-grow: 1;
}

.btn-product-sample {
  background: transparent;
  border: 1px solid var(--clr-primary);
  color: var(--clr-primary);
  padding: 10px 22px;
  border-radius: 30px;
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.btn-product-sample:hover {
  background-color: var(--clr-primary);
  color: #ffffff;
}

/* ================= FLOATING ANIMATED CAN ================= */
.animated-red-can-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  pointer-events: none;
  will-change: transform;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1200px;
  transform-style: preserve-3d;
}

.animated-red-img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

/* Responsive */
@media (max-width: 1024px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .animated-red-can-wrapper {
    display: none; /* Hide floating animation on small screens for optimal performance */
  }

  /* Show direct static image on mobile fallback */
  .target-placeholder {
    background: url('/products/red.png') center/contain no-repeat;
  }
}
</style>
