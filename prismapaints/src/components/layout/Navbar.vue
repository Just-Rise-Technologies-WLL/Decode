<template>
  <header :class="['navbar', { scrolled: isScrolled }]">
    <div class="nav-container">
      <a href="#" class="brand-logo">
        <svg viewBox="0 0 24 24">
          <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 14.5c-1.38 0-2.5-1.12-2.5-2.5s2.5-4.5 2.5-4.5 2.5 3.12 2.5 4.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        PRISMA PAINTS
      </a>

      <ul class="nav-menu">
        <li><a href="#architectural" class="nav-link">Architectural</a></li>
        <li><a href="#industrial" class="nav-link">Industrial</a></li>
        <li><a href="#studio" class="nav-link">Color Studio</a></li>
        <li><a href="#projects" class="nav-link">Projects</a></li>
        <li><a href="#contact" @click.prevent="$emit('open-modal')" class="nav-link">Contact</a></li>
      </ul>

      <button @click="$emit('open-modal')" class="btn-primary">GET IN TOUCH</button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineEmits(['open-modal'])

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 80
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 20px 0;
  transition: var(--transition-smooth);
}

.navbar.scrolled {
  background: rgba(249, 247, 244, 0.92);
  backdrop-filter: blur(16px);
  padding: 12px 0;
  box-shadow: var(--shadow-soft);
  border-bottom: 1px solid rgba(230, 224, 216, 0.5);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 1400px;
  margin: 0 auto;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-serif);
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--clr-primary);
  text-transform: uppercase;
}

.brand-logo svg {
  width: 32px;
  height: 32px;
  fill: var(--clr-primary);
}

.nav-menu {
  display: flex;
  gap: 36px;
  list-style: none;
  align-items: center;
}

.nav-link {
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--clr-text-main);
  position: relative;
  padding: 4px 0;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--clr-primary);
  transition: var(--transition-smooth);
}

.nav-link:hover::after {
  width: 100%;
}
</style>
