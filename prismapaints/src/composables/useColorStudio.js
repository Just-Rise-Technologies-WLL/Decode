import { ref, computed } from 'vue'
import { COLOR_CATALOG, SURFACES, FINISHES, COLOR_FAMILIES } from '../data/colorCatalog.js'

export function useColorStudio() {
  const activeSurface = ref('Wall')
  const activeFinish = ref('Matte')
  const activeFamily = ref('All')
  const selectedColor = ref(COLOR_CATALOG[1]) // Default Warm Terracotta
  const myPalette = ref([])
  const toastMessage = ref('')
  const isModalOpen = ref(false)

  const filteredColors = computed(() => {
    return COLOR_CATALOG.filter(c => {
      const matchesFamily = activeFamily.value === 'All' || c.family === activeFamily.value
      const matchesSurface = c.surfaces.includes(activeSurface.value)
      return matchesFamily && matchesSurface
    })
  })

  const selectColor = (color) => {
    selectedColor.value = color
  }

  const togglePalette = (color) => {
    const idx = myPalette.value.findIndex(c => c.id === color.id)
    if (idx > -1) {
      myPalette.value.splice(idx, 1)
      showToast(`Removed "${color.name}" from palette.`)
    } else {
      if (myPalette.value.length >= 8) {
        showToast('Palette shortlist full (Max 8 colors).')
        return
      }
      myPalette.value.push(color)
      showToast(`Added "${color.name}" to palette shortlist.`)
    }
  }

  const isInPalette = (colorId) => {
    return myPalette.value.some(c => c.id === colorId)
  }

  const copyHex = (hex) => {
    navigator.clipboard.writeText(hex).then(() => {
      showToast(`Hex code ${hex} copied to clipboard!`)
    })
  }

  const showToast = (msg) => {
    toastMessage.value = msg
    setTimeout(() => {
      if (toastMessage.value === msg) toastMessage.value = ''
    }, 3500)
  }

  const openModal = () => {
    isModalOpen.value = true
  }

  const closeModal = () => {
    isModalOpen.value = false
  }

  return {
    surfaces: SURFACES,
    finishes: FINISHES,
    families: COLOR_FAMILIES,
    activeSurface,
    activeFinish,
    activeFamily,
    selectedColor,
    myPalette,
    toastMessage,
    isModalOpen,
    filteredColors,
    selectColor,
    togglePalette,
    isInPalette,
    copyHex,
    openModal,
    closeModal
  }
}
