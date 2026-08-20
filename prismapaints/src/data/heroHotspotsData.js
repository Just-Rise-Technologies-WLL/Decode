/**
 * Dynamic Architectural Hotspot Data for Hero Walkthrough Sequence (240 Frames)
 * Calibrated for:
 * 1. Frame 130 - Living Room Green Accent Wall (x: 24%, y: 44%)
 * 2. Frame 150 - Dining & Kitchen Blue Feature Wall (x: 18%, y: 46%)
 * 3. Frame 218 - Master Suite Bedroom Headboard Wall (x: 45%, y: 46%)
 */

export const HERO_HOTSPOTS = [
  {
    id: 'living-room-green',
    title: 'Living Room Architectural Feature Wall',
    room: 'Living Area',
    focusFrame: 130,
    startFrame: 120,
    endFrame: 138,
    // Screen percentage coordinates on green wall panel
    x: 24,
    y: 44,
    color: {
      name: 'Emerald Oasis',
      code: 'PR-802',
      hex: '#2D4A3E',
      rgb: '45, 74, 62'
    },
    product: {
      name: 'Prisma Luxury Velvet Matt',
      type: 'Interior Wall Topcoat',
      sheen: 'Dead Flat Velvet (3% Sheen)',
      image: '/products/green.png',
      coverage: '12-14 m²/Litre',
      durability: 'Class 1 Scrub Resistant'
    },
    description: 'Rich, organic architectural green delivering serene luxury and depth to open-concept living spaces.'
  },
  {
    id: 'dining-kitchen-blue',
    title: 'Dining & Kitchen Architectural Wall',
    room: 'Dining Gallery',
    focusFrame: 150,
    startFrame: 142,
    endFrame: 158,
    // Screen percentage coordinates on left blue wall
    x: 18,
    y: 46,
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
    description: 'Deep oceanic blue creating a bold, sophisticated transition between culinary and dining zones.'
  },
  {
    id: 'master-bedroom-wall',
    title: 'Master Suite Feature Wall',
    room: 'Master Suite',
    focusFrame: 218,
    startFrame: 208,
    endFrame: 226,
    // Screen percentage coordinates above bed headboard
    x: 45,
    y: 46,
    color: {
      name: 'Rosewood Mauve',
      code: 'PR-304',
      hex: '#9A7B7C',
      rgb: '154, 123, 124'
    },
    product: {
      name: 'Prisma High-Lux Acrylic Enamel',
      type: 'Luxury Wall Finish',
      sheen: 'Soft Eggshell (8% Sheen)',
      image: '/products/red.png',
      coverage: '12-14 m²/Litre',
      durability: 'UV-Resistant & Non-Fading'
    },
    description: 'Subtle warm mauve and dusty rose tone crafted for restful sanctuaries and boutique master suites.'
  }
]
