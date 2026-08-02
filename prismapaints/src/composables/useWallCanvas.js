import { ref, onMounted, onUnmounted } from 'vue'

export function useWallCanvas(canvasRef, containerRef) {
  const scrollProgress = ref(0)
  const isLoaded = ref(false)

  const TOTAL_FRAMES = 240
  const images = []

  let currentFrameIndex = 0
  let targetFrameIndex = 0
  let animationFrameId = null

  // Preload all 240 HD sequence frames
  const preloadFrames = () => {
    let loadedCount = 0
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      const frameNum = String(i).padStart(4, '0')
      img.src = `/sequence_wall/frame_${frameNum}.jpg`

      img.onload = () => {
        loadedCount++
        if (loadedCount === TOTAL_FRAMES) {
          isLoaded.value = true
          renderFrame(0)
        }
      }
      images.push(img)
    }
  }

  // Draw current frame to canvas maintaining aspect ratio
  const renderFrame = (index) => {
    if (!canvasRef.value) return
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = images[index]
    if (!img || !img.complete) return

    // Auto resize canvas to container size
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = canvas.getBoundingClientRect()
    
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Cover aspect ratio draw
    const imgRatio = img.width / img.height
    const canvasRatio = rect.width / rect.height
    let drawW, drawH, drawX, drawY

    if (canvasRatio > imgRatio) {
      drawW = rect.width
      drawH = rect.width / imgRatio
      drawX = 0
      drawY = (rect.height - drawH) / 2
    } else {
      drawH = rect.height
      drawW = rect.height * imgRatio
      drawX = (rect.width - drawW) / 2
      drawY = 0
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH)
    ctx.restore()
  }

  // Butter-Smooth LERP Animation Loop
  const animate = () => {
    // LERP easing: smoothly interpolate current frame toward target frame
    const delta = (targetFrameIndex - currentFrameIndex) * 0.12
    if (Math.abs(delta) > 0.01) {
      currentFrameIndex += delta
      const roundedIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameIndex)))
      renderFrame(roundedIndex)
    }
    animationFrameId = requestAnimationFrame(animate)
  }

  // Update target frame index on scroll
  const handleScroll = () => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    const containerH = containerRef.value.offsetHeight
    const windowH = window.innerHeight
    const totalScrollable = containerH - windowH

    if (totalScrollable <= 0) return

    if (rect.top <= 0 && rect.bottom >= windowH) {
      const progress = Math.abs(rect.top) / totalScrollable
      scrollProgress.value = Math.min(1, Math.max(0, progress))
      targetFrameIndex = Math.round(scrollProgress.value * (TOTAL_FRAMES - 1))
    } else if (rect.top > 0) {
      scrollProgress.value = 0
      targetFrameIndex = 0
    } else if (rect.bottom < windowH) {
      scrollProgress.value = 1
      targetFrameIndex = TOTAL_FRAMES - 1
    }
  }

  onMounted(() => {
    preloadFrames()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    animationFrameId = requestAnimationFrame(animate)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  })

  return {
    scrollProgress,
    isLoaded
  }
}
