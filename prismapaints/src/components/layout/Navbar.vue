<template>
  <header class="navbar-wrapper">
    <nav class="navbar-floating-pill">
      <!-- Brand Logo -->
      <a href="#" class="brand-logo" aria-label="Prisma Paints Home">
        <img src="/images/prisma_logo.png" alt="Prisma Paints Logo" class="logo-img" />
      </a>

      <!-- Desktop Navigation Links -->
      <div class="nav-links-desktop">
        <a href="#about" class="nav-link">ABOUT US</a>
        <a href="#architectural" class="nav-link">ARCHITECTURAL</a>
        <a href="#industrial" class="nav-link">INDUSTRIAL</a>
        <a href="#studio" class="nav-link">COLOR STUDIO</a>
        <a href="#shop" class="nav-link">SHOP</a>
        <a href="#projects" class="nav-link">PROJECTS</a>
        <a href="#contact" class="nav-link">CONTACT</a>
      </div>

      <!-- Header CTA Button -->
      <div>
        <button @click="$emit('open-modal')" class="btn-primary nav-cta-btn">GET IN TOUCH</button>
      </div>
    </nav>
  </header>
</template>

<script setup>
defineEmits(['open-modal'])
</script>

<style scoped>
.navbar-wrapper {
  position: fixed;
  top: 16px;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.navbar-floating-pill {
  width: 90%;
  max-width: 1240px;
  height: 64px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.48) 0%, rgba(255, 255, 255, 0.22) 100%);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 50px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.8), 0 15px 35px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: 2px;
  color: #1a1816;
}

.logo-img {
  height: 80px;
  width: auto;
  object-fit: contain;
  border-radius: 6px;
}

.nav-links-desktop {
  display: flex;
  gap: 28px;
  align-items: center;
}

.nav-link {
  font-size: 0.8rem;
  letter-spacing: 1.5px;
  font-weight: 700;
  color: #1a1816;
  text-transform: uppercase;
  transition: var(--transition-smooth);
  position: relative;
}

.nav-link:hover {
  color: #7C3B29;
}

.nav-cta-btn {
  padding: 10px 22px;
  font-size: 0.78rem;
  letter-spacing: 1.5px;
  border-radius: 30px;
}

@media (max-width: 900px) {
  .nav-links-desktop {
    display: none;
  }
}
</style>
