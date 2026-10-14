import { ref, computed } from 'vue'
import { FIVE_SIGNATURE_SHADES } from '../data/colorCatalog.js'

export function useColorStudio() {
  const selectedColor = ref(FIVE_SIGNATURE_SHADES[0]) // Default Warm Terracotta
  const myPalette = ref([])
  const toastMessage = ref('')
  const isModalOpen = ref(false)

  const filteredColors = computed(() => FIVE_SIGNATURE_SHADES)

  const selectColor = (color) => {
    selectedColor.value = color
  }

  const togglePalette = (color) => {
    const idx = myPalette.value.findIndex(c => c.id === color.id)
    if (idx > -1) {
      myPalette.value.splice(idx, 1)
      showToast(`Removed "${color.name}" from palette.`)
    } else {
      if (myPalette.value.length >= 5) {
        showToast('Palette shortlist full (Max 5 colors).')
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
