<template>
  <footer id="contact" class="footer">
    <div class="container">
      <div class="footer-grid">
        
        <div class="footer-brand">
          <a href="#" class="brand-logo" aria-label="Prisma Paints Home" style="display: inline-block; margin-bottom: 16px;">
            <img src="/images/prisma_logo.png" alt="Prisma Paints Logo" style="height: 80px; width: auto; object-fit: contain; border-radius: 6px;" />
          </a>
          <p>Prisma Modern Decorative Paints is a paint manufacturing company located at Sitra Industrial Area, Kingdom of Bahrain.</p>
        </div>

        <div>
          <h4 class="footer-heading">Quick Links</h4>
          <ul class="footer-links">
            <li><a href="#architectural">About Us</a></li>
            <li><a href="#architectural">Products</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#studio">Color Studio</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-heading">Products</h4>
          <ul class="footer-links">
            <li><a href="#architectural">Architectural</a></li>
            <li><a href="#industrial">Industrial</a></li>
            <li><a href="#architectural">Thinners</a></li>
            <li><a href="#architectural">Track & Road</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-heading">Prisma Paints</h4>
          <p style="font-size: 0.85rem; color: rgba(255,255,255,0.7); line-height: 1.6;">
            Sitra Industrial Area<br>
            P.O. Box 20392<br>
            Manama, Kingdom of Bahrain<br><br>
            Email: sales@prismapaints.com<br>
            Phone: +973 17732373<br>
            Fax: +973 17731028
          </p>
        </div>

      </div>

      <div class="footer-bottom">
        <p>Prisma Modern Decorative Paints © 2026. Prisma Paints. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #171110;
  color: var(--clr-text-light);
  padding: 80px 0 40px;
  border-top: 1px solid var(--clr-border-dark);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 40px;
  margin-bottom: 60px;
}

.footer-brand p {
  color: var(--clr-text-muted);
  font-size: 0.9rem;
  margin-top: 16px;
  max-width: 320px;
}

.footer-heading {
  font-size: 0.85rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--clr-accent-gold);
  margin-bottom: 20px;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.footer-links a:hover {
  color: #ffffff;
}

.footer-bottom {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.8rem;
  color: var(--clr-text-muted);
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
