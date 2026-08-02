<template>
  <div class="finishes-side-scroll-container" ref="trackContainerRef">
    <!-- Pinned Horizontal Wrapper -->
    <div class="finishes-pinned-wrapper">
      
      <!-- Section Header with Nav Arrow Controls -->
      <div class="container header-flex">
        <div>
          <span class="section-subtitle">ARCHITECTURAL & INDUSTRIAL FINISHES</span>
          <h2 class="section-title">Interior & exterior finishes, engineered to last</h2>
          <p class="section-desc">Discover our expanded range of high-performance architectural and protective coatings.</p>
        </div>

        <div class="nav-arrows">
          <button @click="slideLeft" class="arrow-btn" aria-label="Previous finish">←</button>
          <button @click="slideRight" class="arrow-btn" aria-label="Next finish">→</button>
        </div>
      </div>

      <!-- Horizontal Sliding Card Track -->
      <div class="track-outer">
        <div 
          class="track-inner" 
          :style="{ transform: `translateX(-${translateXPercentage}%)` }"
          ref="trackInnerRef">
          
          <div 
            v-for="item in finishItems" 
            :key="item.id" 
            class="finish-card">
            <img :src="item.image" :alt="item.title">
            <div class="finish-overlay">
              <span class="finish-category">{{ item.category }}</span>
              <h3 class="finish-name">{{ item.title }}</h3>
              <p class="finish-info">{{ item.desc }}</p>
              <button @click="$emit('open-modal')" class="card-btn">Explore Range →</button>
            </div>
          </div>

        <!-- End track spacer for comfortable 100% full view landing -->
        <div class="track-end-spacer"></div>
      </div>
    </div>

  </div>
</div>

<!-- Split Feature Highlight Banner with Before/After Slider -->
  <section class="feature-split-section">
    <div class="feature-split-content">
      <span class="section-subtitle" style="color: var(--clr-accent-gold);">INSPIRED INTERIOR SHADES</span>
      <h2 class="feature-split-title">Find your perfect shade. Create your perfect space.</h2>
      <p style="font-size: 1.1rem; opacity: 0.9; margin-bottom: 30px;">Our bespoke color matching engine enables architects, interior designers, and homeowners to achieve exact tonal harmony.</p>
      <div>
        <button @click="$emit('open-modal')" class="btn-primary" style="background-color: #ffffff; color: var(--clr-primary);">Consult Color Expert</button>
      </div>
    </div>

    <div class="feature-split-slider-box">
      <BeforeAfterSlider 
        before-img="/images/room_before.png"
        after-img="/images/room_after.png"
        before-tag="Before (Unpainted Raw Wall)"
        after-tag="After (Prisma Terracotta Paint)"
        height="460px"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import BeforeAfterSlider from '../common/BeforeAfterSlider.vue'

defineEmits(['open-modal'])

const trackContainerRef = ref(null)
const trackInnerRef = ref(null)
const translateXPercentage = ref(0)
const maxTranslatePercentage = ref(78)

const finishItems = [
  {
    id: 1,
    category: 'INTERIOR EMULSIONS',
    title: 'Interior Emulsions',
    desc: 'Elegant colours and smooth velvet finishes for beautiful, long-lasting luxury interiors.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    category: 'EXTERIOR EMULSIONS',
    title: 'Exterior Emulsions',
    desc: 'Weather-resistant architectural coatings that protect and enhance every building facade.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    category: 'ENAMEL PAINTS',
    title: 'Enamel Paints',
    desc: 'Smooth, durable sheen with rich color retention and heavy impact protection.',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    category: 'INDUSTRIAL COATINGS',
    title: 'Epoxy & Polyurethane',
    desc: 'Heavy-duty industrial primers, topcoats, and corrosion-resistant protective coatings.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    category: 'SURFACE PREPARATION',
    title: 'Primers & Undercoats',
    desc: 'High-adhesion sealers and surface preparators ensuring maximum topcoat longevity.',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    category: 'TEXTURED FINISHES',
    title: 'Architectural Textures',
    desc: 'Tactile sand, stone, and plaster effects bringing rich depth to signature feature walls.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 7,
    category: 'WOOD FINISHES',
    title: 'Wood & Timber Stains',
    desc: 'Polyurethane lacquers, protective varnishes, and rich teak stains for natural timber.',
    image: 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 8,
    category: 'FLOOR COATINGS',
    title: 'Epoxy Floor Systems',
    desc: 'Seamless, high-friction epoxy floor systems for commercial showrooms & garages.',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 9,
    category: 'PROTECTIVE COATINGS',
    title: 'Waterproofing & Thermal',
    desc: 'Elastomeric waterproofing membranes and heat-reflective roof barrier coatings.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
  }
]

const updateMaxScroll = () => {
  if (!trackInnerRef.value) return
  const innerW = trackInnerRef.value.scrollWidth
  const windowW = window.innerWidth
  const maxPixels = Math.max(0, innerW - (windowW * 0.72))
  maxTranslatePercentage.value = (maxPixels / innerW) * 100
}

const handleScroll = () => {
  if (!trackContainerRef.value) return
  updateMaxScroll()
  const rect = trackContainerRef.value.getBoundingClientRect()
  const totalScrollableHeight = trackContainerRef.value.offsetHeight - window.innerHeight
  const maxPct = maxTranslatePercentage.value
  
  if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
    const progress = Math.abs(rect.top) / totalScrollableHeight
    translateXPercentage.value = Math.min(maxPct, Math.max(0, progress * maxPct))
  } else if (rect.top > 0) {
    translateXPercentage.value = 0
  } else if (rect.bottom < window.innerHeight) {
    translateXPercentage.value = maxPct
  }
}

const slideLeft = () => {
  translateXPercentage.value = Math.max(0, translateXPercentage.value - 15)
}

const slideRight = () => {
  translateXPercentage.value = Math.min(maxTranslatePercentage.value, translateXPercentage.value + 15)
}

onMounted(() => {
  updateMaxScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
})
</script>

<style scoped>
/* Outer container provides scroll height */
.finishes-side-scroll-container {
  height: 320vh;
  position: relative;
  background-color: var(--clr-bg-light);
}

/* Sticky pinned section */
.finishes-pinned-wrapper {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 0;
}

.header-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 36px;
}

.header-flex .section-title {
  font-size: 2.4rem;
  margin-bottom: 8px;
}

.nav-arrows {
  display: flex;
  gap: 12px;
}

.arrow-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--clr-border);
  background: var(--clr-bg-card);
  color: var(--clr-primary);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-smooth);
  box-shadow: var(--shadow-soft);
}

.arrow-btn:hover {
  background: var(--clr-primary);
  color: #ffffff;
  border-color: var(--clr-primary);
  transform: scale(1.08);
}

/* Outer & Inner Card Track */
.track-outer {
  width: 100%;
  padding: 0 5%;
  overflow: visible;
}

.track-inner {
  display: flex;
  gap: 28px;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.finish-card {
  flex: 0 0 380px;
  height: 460px;
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  border: 1px solid var(--clr-border);
  transition: var(--transition-smooth);
}

.finish-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-hover);
}

.track-end-spacer {
  flex: 0 0 120px;
  height: 100%;
}

.finish-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.finish-card:hover img {
  transform: scale(1.08);
}

.finish-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(36, 34, 32, 0.9) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 32px 28px;
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
  color: #ffffff;
}

.finish-info {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 300;
  margin-bottom: 16px;
  line-height: 1.5;
}

.card-btn {
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--clr-accent-gold);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: var(--transition-smooth);
}

.card-btn:hover {
  color: #ffffff;
  transform: translateX(4px);
}

/* Feature Split Section */
.feature-split-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: var(--clr-primary);
  color: #ffffff;
  overflow: hidden;
  align-items: center;
}

.feature-split-content {
  padding: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.feature-split-title {
  font-size: 3.2rem;
  line-height: 1.12;
  margin-bottom: 24px;
}

.feature-split-slider-box {
  padding: 40px 40px 40px 0;
}

@media (max-width: 1024px) {
  .feature-split-section {
    grid-template-columns: 1fr;
  }

  .feature-split-slider-box {
    padding: 0 40px 40px 40px;
  }

  .finish-card {
    flex: 0 0 320px;
    height: 400px;
  }
}

@media (max-width: 640px) {
  .header-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .feature-split-content {
    padding: 40px 24px;
  }

  .feature-split-slider-box {
    padding: 0 24px 30px 24px;
  }

  .finish-card {
    flex: 0 0 280px;
    height: 380px;
  }
}
</style>
