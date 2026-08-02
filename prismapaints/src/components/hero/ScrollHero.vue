<template>
  <section class="hero-video-container">
    <!-- Native Hardware-Accelerated 60FPS Video -->
    <video 
      autoplay 
      loop 
      muted 
      playsinline 
      class="hero-bg-video"
    >
      <source 
        :src="heroVideoUrl" 
        type="video/quicktime" 
      />
      <source 
        :src="heroVideoUrl" 
        type="video/mp4" 
      />
    </video>

    <!-- Subtle Vignette Dark Gradient -->
    <div class="hero-vignette"></div>

    <!-- Floating Glassmorphism Content Card -->
    <div class="hero-content">
      <div class="hero-card">
        <span class="hero-subtitle">INSPIRED INTERIOR SHADES</span>
        <h1 class="hero-title">Warmth and comfort combined</h1>
        <p class="hero-desc">
          Bring a natural, grounding energy to your home with our earth-toned luxury collection, designed to create inviting, welcoming spaces.
        </p>
        <div style="display: flex; gap: 16px;">
          <button @click="$emit('open-modal')" class="btn-primary">Explore Palette</button>
          <a href="#about" class="btn-outline" style="border-color: #ffffff; color: #ffffff;">About Prisma</a>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="scroll-indicator">
      <div class="scroll-mouse">
        <div class="scroll-wheel"></div>
      </div>
      <span>Scroll to Discover</span>
    </div>
  </section>
</template>

<script setup>
import heroVideoUrl from '/video/Herosection VIdeo.mov?url'

defineEmits(['open-modal'])
</script>

<style scoped>
.hero-video-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.hero-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 100%);
  z-index: 2;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 10;
  width: 90%;
  max-width: 1240px;
  margin: 0 auto;
  color: #ffffff;
}

.hero-card {
  background: rgba(36, 34, 32, 0.78);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 28px;
  padding: 60px 48px;
  max-width: 580px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.hero-subtitle {
  font-size: 0.85rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--clr-accent-gold);
  margin-bottom: 14px;
  font-weight: 600;
  display: block;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 20px;
  line-height: 1.08;
  color: #ffffff;
}

.hero-desc {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 30px;
  font-weight: 300;
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #ffffff;
  font-size: 0.75rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: opacity 0.3s ease;
}

.scroll-mouse {
  width: 24px;
  height: 38px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  position: relative;
}

.scroll-wheel {
  width: 4px;
  height: 8px;
  background-color: #ffffff;
  border-radius: 2px;
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  animation: scrollAnim 1.8s infinite;
}

@keyframes scrollAnim {
  0% { opacity: 1; top: 6px; }
  100% { opacity: 0; top: 22px; }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2.4rem;
  }
}
</style>
