/**
 * Dynamic Architectural Hotspot Data for Hero Walkthrough Sequence (350 Frames)
 * Features frame intervals, coordinate positioning, Prisma shade codes, finishes, and product can previews.
 */

export const HERO_HOTSPOTS = [
  {
    id: 'living-room-accent',
    title: 'Modern Living Room Feature Wall',
    room: 'Living Room Area',
    focusFrame: 30,
    startFrame: 15,
    endFrame: 45,
    // Screen percentage coordinates (left, top)
    x: 28,
    y: 42,
    color: {
      name: 'Alabaster Ivory',
      code: 'PR-101',
      hex: '#FAF8F5',
      rgb: '250, 248, 245'
    },
    product: {
      name: 'Prisma Luxury Velvet Matt',
      type: 'Interior Wall Topcoat',
      sheen: 'Dead Flat Velvet (3% Sheen)',
      image: '/products/texture.png',
      coverage: '12-14 m²/Litre',
      durability: 'Class 1 Scrub Resistant'
    },
    description: 'Timeless bright ivory white creating a clean, expansive architectural living space with subtle warm undertones.'
  },
  {
    id: 'master-bedroom-wall',
    title: 'Master Bedroom Architectural Wall',
    room: 'Master Suite',
    focusFrame: 115,
    startFrame: 95,
    endFrame: 135,
    x: 32,
    y: 38,
    color: {
      name: 'Mediterranean Blue',
      code: 'PR-5530',
      hex: '#1E3A5A',
      rgb: '30, 58, 90'
    },
    product: {
      name: 'Prisma Wonderwall Silk',
      type: 'Luxury Satin Emulsion',
      sheen: 'Silky Sheen (15% Sheen)',
      image: '/products/%20blue.png',
      coverage: '14-16 m²/Litre',
      durability: 'Ultra Washable & Anti-Bacterial'
    },
    description: 'Sophisticated deep oceanic blue that brings calm, restful luxury and optical depth to modern bedrooms.'
  },
  {
    id: 'dining-hallway-stucco',
    title: 'Dining & Gallery Feature Wall',
    room: 'Dining Gallery',
    focusFrame: 210,
    startFrame: 190,
    endFrame: 230,
    x: 66,
    y: 44,
    color: {
      name: 'Emerald Oasis',
      code: 'PR-802',
      hex: '#2D4A3E',
      rgb: '45, 74, 62'
    },
    product: {
      name: 'Prisma Stucco Antico',
      type: 'Decorative Italian Mineral Plaster',
      sheen: 'Polished Marble Effect',
      image: '/products/green.png',
      coverage: '2-3 m²/Kg (2 coats)',
      durability: 'High-Impact Artisan Plaster'
    },
    description: 'Artisanal mineral green finish with polished marble veining, delivering an opulent organic statement.'
  },
  {
    id: 'lounge-terrace-facade',
    title: 'Luxury Lounge & Niche Wall',
    room: 'Private Lounge',
    focusFrame: 305,
    startFrame: 285,
    endFrame: 325,
    x: 45,
    y: 40,
    color: {
      name: 'Imperial Ruby',
      code: 'PR-905',
      hex: '#A42C25',
      rgb: '164, 44, 37'
    },
    product: {
      name: 'Prisma High-Lux Acrylic Enamel',
      type: 'Architectural Premium Finish',
      sheen: 'Soft Eggshell (8% Sheen)',
      image: '/products/red.png',
      coverage: '12-14 m²/Litre',
      durability: 'UV-Resistant & Non-Fading'
    },
    description: 'Bold, radiant statement tone crafted for luxury focal niches, dining alcoves, and boutique hospitality spaces.'
  }
]
