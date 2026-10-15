import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Dual-Tier Progressive Wall Layering Canvas Engine:
 * Tier 1 (Low-Res Proxy): Preloads 240 lightweight WebP frames from /sequence_wall_low/ (~1.4 MB).
 * Tier 2 (HD WebP Upgrade): Background streams crisp 1080p WebP frames from /sequence_wall/.
 */
export function useWallCanvas(canvasRef, containerRef) {
  const scrollProgress = ref(0)
  const isLoaded = ref(false)

  const TOTAL_FRAMES = 240
  const loadedLowImages = new Array(TOTAL_FRAMES)
  const loadedHdImages = new Array(TOTAL_FRAMES)

  let currentFrameIndex = 0
  let targetFrameIndex = 0
  let animationFrameId = null
  let bgStreamTimer = null

  // Preload all 240 lightweight low-res proxy frames (~1.4 MB)
  const preloadLowFrames = () => {
    let loadedCount = 0
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      const frameNum = String(i).padStart(4, '0')
      img.src = `/sequence_wall_low/frame_${frameNum}.webp`

      img.onload = () => {
        loadedLowImages[i - 1] = img
        loadedCount++
        if (loadedCount === 1) {
          renderFrame(0)
        }
        if (loadedCount === TOTAL_FRAMES) {
          isLoaded.value = true
          renderFrame(0)
          startHdUpgradeStream()
        }
      }
      img.onerror = () => {
        loadedCount++
        if (loadedCount === TOTAL_FRAMES) isLoaded.value = true
      }
    }
  }

  // Background stream full HD WebP frames in small batches
  const startHdUpgradeStream = () => {
    let hdIdx = 0
    const BATCH_SIZE = 6

    const loadNextHdBatch = () => {
      if (hdIdx >= TOTAL_FRAMES) return
      const end = Math.min(hdIdx + BATCH_SIZE, TOTAL_FRAMES)
      for (let k = hdIdx; k < end; k++) {
        const frameNum = String(k + 1).padStart(4, '0')
        const img = new Image()
        img.src = `/sequence_wall/frame_${frameNum}.webp`
        img.onload = () => {
          loadedHdImages[k] = img
        }
      }
      hdIdx = end
      if (hdIdx < TOTAL_FRAMES) {
        bgStreamTimer = setTimeout(loadNextHdBatch, 25)
      }
    }

    setTimeout(loadNextHdBatch, 100)
  }

  // Draw current frame to canvas maintaining aspect ratio with dual-tier fallback
  const renderFrame = (index) => {
    if (!canvasRef.value) return
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Prefer HD, fallback to Low-Res Proxy
    const img = loadedHdImages[index] || loadedLowImages[index]
    if (!img || !img.complete) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = canvas.getBoundingClientRect()
    
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Aspect contain scaling
    const imgRatio = img.width / img.height
    const canvasRatio = rect.width / rect.height
    let drawW, drawH, drawX, drawY

    if (canvasRatio > imgRatio) {
      drawH = rect.height
      drawW = rect.height * imgRatio
      drawX = (rect.width - drawW) / 2
      drawY = 0
    } else {
      drawW = rect.width
      drawH = rect.width / imgRatio
      drawX = 0
      drawY = (rect.height - drawH) / 2
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH)
    ctx.restore()
  }

  // Butter-Smooth LERP Animation Loop
  const animate = () => {
    const delta = (targetFrameIndex - currentFrameIndex) * 0.14
    if (Math.abs(delta) > 0.01) {
      currentFrameIndex += delta
      const roundedIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameIndex)))
      renderFrame(roundedIndex)
    }
    animationFrameId = requestAnimationFrame(animate)
  }

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
    preloadLowFrames()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    animationFrameId = requestAnimationFrame(animate)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    if (bgStreamTimer) clearTimeout(bgStreamTimer)
  })

  return {
    scrollProgress,
    isLoaded
  }
}
