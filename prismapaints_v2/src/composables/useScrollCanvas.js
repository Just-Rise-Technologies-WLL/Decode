import { ref, onMounted, onUnmounted } from 'vue'

/**
 * High-Performance Unified Architectural Journey Canvas Engine:
 * Phase 1: Real Bahrain Villa Exterior sequence (0% to 35% scroll) - 300 WebP frames.
 * Phase 2: Pause / Hold on last frame (Prisma IMAJ can + Villa) (35% to 45% scroll).
 * Phase 3: Building Zoom-In into villa facade (45% to 58% scroll).
 * Phase 4: 3D Interior Walkthrough (58% to 100% scroll) - 240 WebP frames with room stops.
 */
export function useScrollCanvas(canvasRef, containerRef, options = {}) {
  const villaFrameCount = options.villaFrameCount || 300
  const villaPrefix = options.villaPrefix || '/sequence_villa/villa_'
  const villaExt = options.villaExt || '.webp'

  const walkthroughFrameCount = options.walkthroughFrameCount || 240
  const walkthroughPrefix = options.walkthroughPrefix || '/sequence/frame_'
  const walkthroughExt = options.walkthroughExt || '.webp'

  let ctx = null
  const scrollProgress = ref(0)
  const currentFrame = ref(0)
  const currentPhase = ref('villa') // 'villa' | 'pause' | 'zoom' | 'walkthrough'
  const isReady = ref(false)

  // Physics LERP State
  let currentVillaFloat = 0
  let targetVillaFloat = 0
  let currentWalkthroughFloat = 0
  let targetWalkthroughFloat = 0
  let currentZoomScale = 1.0
  let targetZoomScale = 1.0

  let animFrameId = null
  let batchStreamTimer = null

  // Image caches
  const loadedVillaImages = new Array(villaFrameCount)
  const loadedWalkthroughImages = new Array(walkthroughFrameCount)

  // Draw image with cover aspect ratio, zoom scale, focal origin, and alpha
  const drawCoverMedia = (media, naturalWidth, naturalHeight, scale = 1.0, originX = 0.5, originY = 0.5, alpha = 1.0) => {
    if (!canvasRef.value) return
    const canvas = canvasRef.value
    if (!ctx) ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    if (w === 0 || h === 0) return

    const mediaRatio = naturalWidth / naturalHeight
    const canvasRatio = w / h
    let drawW, drawH, drawX, drawY

    if (canvasRatio > mediaRatio) {
      drawW = w
      drawH = w / mediaRatio
    } else {
      drawH = h
      drawW = h * mediaRatio
    }

    drawX = (w - drawW) / 2
    drawY = (h - drawH) / 2

    ctx.save()
    if (alpha < 1.0) {
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
    }

    if (scale !== 1.0) {
      // Zoom centered on specified origin
      const focalX = w * originX
      const focalY = h * originY
      ctx.translate(focalX, focalY)
      ctx.scale(scale, scale)
      ctx.translate(-focalX, -focalY)
    }

    ctx.drawImage(media, drawX, drawY, drawW, drawH)
    ctx.restore()
  }

  // Preload priority first frame, then background stream remaining in staggered batches
  const initSequences = () => {
    handleResize()

    // --- STEP 1: PRIORITY LOAD FRAME 1 OF VILLA SEQUENCE (< 50ms) ---
    const primaryVillaImg = new Image()
    primaryVillaImg.src = `${villaPrefix}0001${villaExt}`

    const onPrimaryReady = () => {
      loadedVillaImages[0] = primaryVillaImg
      if (canvasRef.value) {
        drawCoverMedia(primaryVillaImg, primaryVillaImg.naturalWidth || 1920, primaryVillaImg.naturalHeight || 1080)
      }
      if (!isReady.value) {
        isReady.value = true
        if (options.onReady) options.onReady()
      }
      if (animFrameId === null) {
        startAnimationLoop()
      }
    }

    primaryVillaImg.onload = onPrimaryReady
    if (primaryVillaImg.complete && primaryVillaImg.naturalWidth !== 0) {
      onPrimaryReady()
    }

    // Also priority load last frame of Villa (for pause & zoom) and Frame 1 of Walkthrough
    const lastVillaImg = new Image()
    const lastNum = String(villaFrameCount).padStart(4, '0')
    lastVillaImg.src = `${villaPrefix}${lastNum}${villaExt}`
    lastVillaImg.onload = () => {
      loadedVillaImages[villaFrameCount - 1] = lastVillaImg
    }

    const firstWalkthroughImg = new Image()
    firstWalkthroughImg.src = `${walkthroughPrefix}0001${walkthroughExt}`
    firstWalkthroughImg.onload = () => {
      loadedWalkthroughImages[0] = firstWalkthroughImg
    }

    // --- STEP 2: STAGGERED BATCH STREAMING (Prevents network congestion) ---
    const villaQueue = []
    for (let i = 2; i <= villaFrameCount - 1; i++) {
      villaQueue.push({ type: 'villa', idx: i - 1, num: i })
    }

    const walkthroughQueue = []
    for (let i = 2; i <= walkthroughFrameCount; i++) {
      walkthroughQueue.push({ type: 'walkthrough', idx: i - 1, num: i })
    }

    const combinedQueue = [...villaQueue, ...walkthroughQueue]
    let queueIdx = 0
    const BATCH_SIZE = 6

    const processNextBatch = () => {
      if (queueIdx >= combinedQueue.length) return

      const end = Math.min(queueIdx + BATCH_SIZE, combinedQueue.length)
      for (let k = queueIdx; k < end; k++) {
        const item = combinedQueue[k]
        const paddedNum = String(item.num).padStart(4, '0')
        const img = new Image()

        if (item.type === 'villa') {
          img.src = `${villaPrefix}${paddedNum}${villaExt}`
          img.onload = () => { loadedVillaImages[item.idx] = img }
        } else {
          img.src = `${walkthroughPrefix}${paddedNum}${walkthroughExt}`
          img.onload = () => { loadedWalkthroughImages[item.idx] = img }
        }
      }

      queueIdx = end
      if (queueIdx < combinedQueue.length) {
        batchStreamTimer = setTimeout(processNextBatch, 25)
      }
    }

    setTimeout(processNextBatch, 80)
  }

  // 60FPS Continuous RAF Loop with Physics LERP Interpolation
  const startAnimationLoop = () => {
    const loop = () => {
      if (!canvasRef.value) return
      const canvas = canvasRef.value
      if (!ctx) ctx = canvas.getContext('2d')

      const w = canvas.width
      const h = canvas.height
      const p = scrollProgress.value

      ctx.fillStyle = '#161412'
      ctx.fillRect(0, 0, w, h)

      // Smooth physics LERP
      currentVillaFloat += (targetVillaFloat - currentVillaFloat) * 0.16
      currentWalkthroughFloat += (targetWalkthroughFloat - currentWalkthroughFloat) * 0.16
      currentZoomScale += (targetZoomScale - currentZoomScale) * 0.16

      // Phase 1: Real Villa Video Sequence Scrubbing (0% to 35%)
      if (p < 0.35) {
        currentPhase.value = 'villa'
        const vIndex = Math.min(villaFrameCount - 1, Math.max(0, Math.round(currentVillaFloat)))
        currentFrame.value = vIndex

        const img = loadedVillaImages[vIndex] || loadedVillaImages[0]
        if (img && img.complete && img.naturalWidth !== 0) {
          drawCoverMedia(img, img.naturalWidth, img.naturalHeight, 1.0)
        }
      }
      // Phase 2: Pause / Hold on Final Frame (35% to 45%)
      else if (p < 0.45) {
        currentPhase.value = 'pause'
        const vIndex = villaFrameCount - 1
        currentFrame.value = vIndex

        const img = loadedVillaImages[vIndex] || loadedVillaImages[0]
        if (img && img.complete && img.naturalWidth !== 0) {
          drawCoverMedia(img, img.naturalWidth, img.naturalHeight, 1.0)
        }
      }
      // Phase 3: Building Zoom-In (45% to 58%)
      else if (p < 0.58) {
        currentPhase.value = 'zoom'
        const vIndex = villaFrameCount - 1
        currentFrame.value = vIndex

        const img = loadedVillaImages[vIndex] || loadedVillaImages[0]
        // Focal origin: center 50%, top 38% (aiming right at the villa entrance arch)
        if (img && img.complete && img.naturalWidth !== 0) {
          drawCoverMedia(img, img.naturalWidth, img.naturalHeight, currentZoomScale, 0.5, 0.38)
        }

        // Crossfade dissolve into walkthrough Frame 0 near the end of zoom (56% to 58%)
        if (p >= 0.55) {
          const crossAlpha = (p - 0.55) / 0.03
          const firstWalkImg = loadedWalkthroughImages[0]
          if (firstWalkImg && firstWalkImg.complete && firstWalkImg.naturalWidth !== 0) {
            drawCoverMedia(firstWalkImg, firstWalkImg.naturalWidth, firstWalkImg.naturalHeight, 1.0, 0.5, 0.5, crossAlpha)
          }
        }
      }
      // Phase 4: 3D Interior Walkthrough with Hotspots & Room Dock (58% to 100%)
      else {
        currentPhase.value = 'walkthrough'
        const wIndex = Math.min(walkthroughFrameCount - 1, Math.max(0, Math.round(currentWalkthroughFloat)))
        currentFrame.value = wIndex

        const img = loadedWalkthroughImages[wIndex] || loadedWalkthroughImages[0]
        if (img && img.complete && img.naturalWidth !== 0) {
          drawCoverMedia(img, img.naturalWidth, img.naturalHeight, 1.0)
        }
      }

      animFrameId = requestAnimationFrame(loop)
    }

    animFrameId = requestAnimationFrame(loop)
  }

  const handleResize = () => {
    if (!canvasRef.value) return
    canvasRef.value.width = window.innerWidth
    canvasRef.value.height = window.innerHeight
    if (ctx) {
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
    }
  }

  // Map progress to target frames across all 4 phases
  const handleScroll = () => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    const totalHeight = containerRef.value.offsetHeight - window.innerHeight
    const scrolled = Math.max(0, -rect.top)
    const p = Math.min(1, Math.max(0, scrolled / Math.max(1, totalHeight)))
    scrollProgress.value = p

    // 1. Villa Sequence (0.00 to 0.35)
    if (p < 0.35) {
      const t = p / 0.35
      targetVillaFloat = t * (villaFrameCount - 1)
      targetZoomScale = 1.0
      targetWalkthroughFloat = 0
    }
    // 2. Pause on Last Frame (0.35 to 0.45)
    else if (p < 0.45) {
      targetVillaFloat = villaFrameCount - 1
      targetZoomScale = 1.0
      targetWalkthroughFloat = 0
    }
    // 3. Zoom-in (0.45 to 0.58)
    else if (p < 0.58) {
      targetVillaFloat = villaFrameCount - 1
      const t = (p - 0.45) / (0.58 - 0.45)
      const easeT = t * t * (3 - 2 * t)
      targetZoomScale = 1.0 + easeT * 1.5 // Zoom from 1.0x to 2.5x
      targetWalkthroughFloat = 0
    }
    // 4. 3D Walkthrough (0.58 to 1.00)
    else {
      targetVillaFloat = villaFrameCount - 1
      targetZoomScale = 2.5

      const walkP = (p - 0.58) / (1.00 - 0.58) // 0.0 to 1.0

      // Magnetic plateaus for 3 hotspot rooms
      const SEGMENTS = [
        { startP: 0.00, endP: 0.22, startF: 0, endF: 130 },
        { startP: 0.22, endP: 0.34, startF: 130, endF: 130 }, // HOLD 1: Frame 130 (Green Wall)
        { startP: 0.34, endP: 0.52, startF: 130, endF: 150 }, // Travel to Blue Wall
        { startP: 0.52, endP: 0.64, startF: 150, endF: 150 }, // HOLD 2: Frame 150 (Blue Wall)
        { startP: 0.64, endP: 0.82, startF: 150, endF: 218 }, // Travel to Master Bedroom
        { startP: 0.82, endP: 0.94, startF: 218, endF: 218 }, // HOLD 3: Frame 218 (Master Bedroom)
        { startP: 0.94, endP: 1.00, startF: 218, endF: walkthroughFrameCount - 1 }
      ]

      let mappedFrame = walkP * (walkthroughFrameCount - 1)
      for (const seg of SEGMENTS) {
        if (walkP >= seg.startP && walkP <= seg.endP) {
          if (seg.startF === seg.endF) {
            mappedFrame = seg.startF
          } else {
            const st = (walkP - seg.startP) / (seg.endP - seg.startP)
            const easeSt = st * st * (3 - 2 * st)
            mappedFrame = seg.startF + easeSt * (seg.endF - seg.startF)
          }
          break
        }
      }

      targetWalkthroughFloat = mappedFrame
    }
  }

  onMounted(() => {
    handleResize()
    initSequences()
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    if (animFrameId !== null) cancelAnimationFrame(animFrameId)
    if (batchStreamTimer !== null) clearTimeout(batchStreamTimer)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    scrollProgress,
    currentFrame,
    currentPhase,
    isReady
  }
}
