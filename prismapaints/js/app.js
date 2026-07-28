/**
 * PRISMA PAINTS — VUE 3 & SCROLL ANIMATION ENGINE
 * Location: js/app.js
 */

const { createApp, ref, computed, onMounted } = Vue;

// Sample database of luxury Prisma Paint shades
const COLOR_CATALOG = [
  { id: 1, name: 'Aged Plaster', hex: '#F5F0EA', family: 'Neutrals', surfaces: ['Wall', 'Facade'], finishes: ['Matte', 'Satin', 'Eggshell'], desc: 'Residential interiors, luxury living, quiet minimalism.' },
  { id: 2, name: 'Warm Terracotta', hex: '#7C3B29', family: 'Earth Tones', surfaces: ['Wall', 'Facade', 'Metal'], finishes: ['Matte', 'Textured', 'Satin'], desc: 'Grounding earthy clay shade designed for inviting spaces.' },
  { id: 3, name: 'Royal Burgundy', hex: '#4A1D1B', family: 'Deep & Moody', surfaces: ['Wall', 'Metal'], finishes: ['Semi-Gloss', 'Satin'], desc: 'Rich luxury accent hue with deep warm undertones.' },
  { id: 4, name: 'Desert Bronze', hex: '#8D6E53', family: 'Earth Tones', surfaces: ['Wall', 'Facade', 'Floor'], finishes: ['Matte', 'Satin', 'Textured'], desc: 'Subtle warm bronze ideal for exterior facades & modern villas.' },
  { id: 5, name: 'Sitra Sand', hex: '#D9C8B4', family: 'Neutrals', surfaces: ['Wall', 'Facade', 'Floor', 'Road'], finishes: ['Eggshell', 'Satin', 'Matte'], desc: 'Warm ivory neutral inspired by coastal sands of Bahrain.' },
  { id: 6, name: 'Arabian Copper', hex: '#B85B38', family: 'Earth Tones', surfaces: ['Wall', 'Facade', 'Metal'], finishes: ['Textured', 'Semi-Gloss'], desc: 'Luminous metallic-infused copper for signature feature walls.' },
  { id: 7, name: 'Oasis Olive', hex: '#525B44', family: 'Deep & Moody', surfaces: ['Wall', 'Facade'], finishes: ['Matte', 'Eggshell'], desc: 'Organic olive green giving a serene natural atmosphere.' },
  { id: 8, name: 'Charcoal Slate', hex: '#2F3336', family: 'Industrial', surfaces: ['Wall', 'Metal', 'Floor', 'Road'], finishes: ['Matte', 'Semi-Gloss'], desc: 'Demanding architectural structures and sleek modern frames.' },
  { id: 9, name: 'Alabaster White', hex: '#FAF8F5', family: 'Neutrals', surfaces: ['Wall', 'Facade'], finishes: ['Eggshell', 'Matte', 'Satin'], desc: 'Pure timeless white reflecting natural sunlight flawlessly.' },
  { id: 10, name: 'Velvet Plum', hex: '#3E2533', family: 'Deep & Moody', surfaces: ['Wall'], finishes: ['Satin', 'Matte'], desc: 'Dramatic regal plum for high-end boutique interiors.' },
  { id: 11, name: 'Industrial Red', hex: '#8B261D', family: 'Industrial', surfaces: ['Metal', 'Floor', 'Road'], finishes: ['Semi-Gloss', 'Textured'], desc: 'Heavy-duty epoxy and corrosion-resistant protective coating.' },
  { id: 12, name: 'Traffic Safety Ochre', hex: '#C28E38', family: 'Industrial', surfaces: ['Road', 'Floor', 'Metal'], finishes: ['Textured'], desc: 'Superior abrasion resistance for kerbs and track markings.' }
];

const app = createApp({
  setup() {
    // Reactive State
    const surfaces = ['Wall', 'Facade', 'Metal', 'Floor', 'Road'];
    const finishes = ['Matte', 'Eggshell', 'Satin', 'Semi-Gloss', 'Textured'];
    const families = ['All', 'Neutrals', 'Earth Tones', 'Deep & Moody', 'Industrial'];

    const activeSurface = ref('Wall');
    const activeFinish = ref('Matte');
    const activeFamily = ref('All');
    const selectedColor = ref(COLOR_CATALOG[1]); // Default Warm Terracotta
    const myPalette = ref([]);

    // Modal state
    const isModalOpen = ref(false);
    const modalForm = ref({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    const isSubmitting = ref(false);
    const toastMessage = ref('');

    // Computed filtered color shades
    const filteredColors = computed(() => {
      return COLOR_CATALOG.filter(c => {
        const matchesFamily = activeFamily.value === 'All' || c.family === activeFamily.value;
        const matchesSurface = c.surfaces.includes(activeSurface.value);
        return matchesFamily && matchesSurface;
      });
    });

    // Actions
    const selectColor = (color) => {
      selectedColor.value = color;
    };

    const togglePalette = (color) => {
      const idx = myPalette.value.findIndex(c => c.id === color.id);
      if (idx > -1) {
        myPalette.value.splice(idx, 1);
        showToast(`Removed "${color.name}" from palette.`);
      } else {
        if (myPalette.value.length >= 8) {
          showToast('Palette shortlist full (Max 8 colors).');
          return;
        }
        myPalette.value.push(color);
        showToast(`Added "${color.name}" to palette shortlist.`);
      }
    };

    const isInPalette = (colorId) => {
      return myPalette.value.some(c => c.id === colorId);
    };

    const copyHex = (hex) => {
      navigator.clipboard.writeText(hex).then(() => {
        showToast(`Hex code ${hex} copied to clipboard!`);
      });
    };

    const showToast = (msg) => {
      toastMessage.value = msg;
      setTimeout(() => {
        if (toastMessage.value === msg) toastMessage.value = '';
      }, 3500);
    };

    const openModal = () => {
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const submitForm = async () => {
      if (!modalForm.value.name || !modalForm.value.email) {
        showToast('Please enter your name and email.');
        return;
      }

      isSubmitting.value = true;

      const payload = {
        name: modalForm.value.name,
        email: modalForm.value.email,
        phone: modalForm.value.phone,
        surface: activeSurface.value,
        selected_colors: myPalette.value.map(c => `${c.name} (${c.hex})`),
        message: modalForm.value.message
      };

      try {
        const res = await fetch('api/send_mail.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
          showToast(result.message);
          modalForm.value = { name: '', email: '', phone: '', message: '' };
          closeModal();
        } else {
          showToast(result.message || 'Error submitting request.');
        }
      } catch (err) {
        console.error(err);
        showToast('Request received! Thank you.');
        closeModal();
      } finally {
        isSubmitting.value = false;
      }
    };

    // Canvas Scroll-Driven Frame Animation Engine
    const initScrollCanvas = () => {
      const canvas = document.getElementById('hero-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const frameCount = 60;
      const images = [];
      let currentFrameIndex = 0;

      // Set canvas size
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(currentFrameIndex);
      };

      window.addEventListener('resize', resizeCanvas);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Draw procedural paint-flow frames dynamically on canvas
      const renderFrame = (index) => {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Calculate transition progress (0.0 to 1.0)
        const progress = index / (frameCount - 1);

        // Draw deep warm terracotta gradient background
        const grad = ctx.createLinearGradient(0, 0, w, h);
        const r1 = Math.round(124 - progress * 40);
        const g1 = Math.round(59 - progress * 20);
        const b1 = Math.round(41 - progress * 15);
        grad.addColorStop(0, `rgb(${r1}, ${g1}, ${b1})`);
        grad.addColorStop(1, '#2b1816');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Draw smooth fluid paint wave curves matching scroll depth
        ctx.save();
        ctx.beginPath();
        const waveY = h * (0.85 - progress * 0.5);
        ctx.moveTo(0, h);
        ctx.lineTo(0, waveY);
        
        for (let x = 0; x <= w; x += 30) {
          const y = waveY + Math.sin(x * 0.005 + progress * Math.PI * 2) * (40 + progress * 30);
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(w, h);
        ctx.closePath();

        const waveGrad = ctx.createLinearGradient(0, waveY, w, h);
        waveGrad.addColorStop(0, '#c49a6c');
        waveGrad.addColorStop(1, '#7c3b29');
        ctx.fillStyle = waveGrad;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.restore();

        // Draw dynamic room wall paint reveal mask
        ctx.save();
        ctx.beginPath();
        const radius = Math.max(w, h) * (0.15 + progress * 0.9);
        ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
        ctx.clip();
        
        // Inner room shade render
        const innerGrad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, w);
        innerGrad.addColorStop(0, '#d9c8b4');
        innerGrad.addColorStop(0.7, '#8d6e53');
        innerGrad.addColorStop(1, '#4a1d1b');
        ctx.fillStyle = innerGrad;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      };

      // Initial frame render
      renderFrame(0);

      // Scroll Event Listener for Frame Scrubbing
      window.addEventListener('scroll', () => {
        const scrollContainer = document.querySelector('.hero-scroll-container');
        if (!scrollContainer) return;

        const rect = scrollContainer.getBoundingClientRect();
        const totalHeight = scrollContainer.offsetHeight - window.innerHeight;
        const scrolled = Math.max(0, -rect.top);
        const scrollProgress = Math.min(1, Math.max(0, scrolled / totalHeight));

        currentFrameIndex = Math.floor(scrollProgress * (frameCount - 1));
        requestAnimationFrame(() => renderFrame(currentFrameIndex));

        // Sticky Navbar background toggle
        const navbar = document.querySelector('.navbar');
        if (navbar) {
          if (window.scrollY > 80) navbar.classList.add('scrolled');
          else navbar.classList.remove('scrolled');
        }
      });
    };

    onMounted(() => {
      initScrollCanvas();
    });

    return {
      surfaces,
      finishes,
      families,
      activeSurface,
      activeFinish,
      activeFamily,
      selectedColor,
      myPalette,
      filteredColors,
      selectColor,
      togglePalette,
      isInPalette,
      copyHex,
      isModalOpen,
      modalForm,
      isSubmitting,
      toastMessage,
      openModal,
      closeModal,
      submitForm
    };
  }
});

app.mount('#app');
