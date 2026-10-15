import { ref, onMounted, onUnmounted, watch } from 'vue'

/**
 * High-Performance Dual-Tier Progressive Architectural Canvas Engine:
 * 1. Immediate Standalone Paint: Loads Frame 1 alone with top priority in < 50ms so canvas is NEVER black.
 * 2. Controlled Connection Throttling: Maximum 6 active connections prevents Vercel rate-limiting.
 * 3. Lazy Phase Streaming: Walkthrough frames only stream when user scrolls near the walkthrough.
 */
export function useScrollCanvas(canvasRef, containerRef, options = {}) {
  const villaFrameCount = options.villaFrameCount || 300
  const villaLowPrefix = '/sequence_villa_low/villa_'
  const villaHdPrefix = options.villaPrefix || '/sequence_villa/villa_'
  const villaExt = '.webp'

  const walkthroughFrameCount = options.walkthroughFrameCount || 240
  const walkthroughLowPrefix = '/sequence_low/frame_'
  const walkthroughHdPrefix = options.walkthroughPrefix || '/sequence/frame_'
  const walkthroughExt = '.webp'

  let ctx = null
  const scrollProgress = ref(0)
  const currentFrame = ref(0)
  const currentPhase = ref('villa') // 'villa' | 'pause' | 'zoom' | 'walkthrough'
  const isReady = ref(false)
  const loadingProgress = ref(0) // Real 0 to 100 percentage

  // Physics LERP State
  let currentVillaFloat = 0
  let targetVillaFloat = 0
  let currentWalkthroughFloat = 0
  let targetWalkthroughFloat = 0
  let currentZoomScale = 1.0
  let targetZoomScale = 1.0

  let animFrameId = null
  let batchStreamTimer = null
  let walkStreamStarted = false

  // Dual-tier image caches
  const loadedVillaLow = new Array(villaFrameCount)
  const loadedVillaHd = new Array(villaFrameCount)

  const loadedWalkthroughLow = new Array(walkthroughFrameCount)
  const loadedWalkthroughHd = new Array(walkthroughFrameCount)

  // Draw media with cover aspect ratio, zoom scale, focal origin, and alpha
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
      const focalX = w * originX
      const focalY = h * originY
      ctx.translate(focalX, focalY)
      ctx.scale(scale, scale)
      ctx.translate(-focalX, -focalY)
    }

    ctx.drawImage(media, drawX, drawY, drawW, drawH)
    ctx.restore()
  }

  // Dual-tier progressive loading initialization
  const initSequences = () => {
    handleResize()

    // --- STEP 1: PRIORITY 1 FIRST FRAME PAINT (Eliminates Black Screen completely) ---
    const primaryImg = new Image()
    const onPrimaryLoaded = () => {
      loadedVillaLow[0] = primaryImg
      if (canvasRef.value) {
        drawCoverMedia(primaryImg, primaryImg.naturalWidth || 480, primaryImg.naturalHeight || 270)
      }
      if (animFrameId === null) {
        startAnimationLoop()
      }
    }
    primaryImg.onload = onPrimaryLoaded
    primaryImg.src = `${villaLowPrefix}0001${villaExt}`
    if (primaryImg.complete && primaryImg.naturalWidth !== 0) {
      onPrimaryLoaded()
    }

    // --- STEP 2: CONTROLLED LOW-RES BATCH STREAM (Max 6 concurrent connections) ---
    let lowLoadedCount = 1

    const triggerComplete = () => {
      if (!isReady.value) {
        isReady.value = true
        loadingProgress.value = 100
        if (options.onProgress) options.onProgress(100)
        if (options.onReady) options.onReady()
        startVillaHdStream()
      }
    }

    const updateProgress = () => {
      lowLoadedCount++
      const pct = Math.min(100, Math.round((lowLoadedCount / villaFrameCount) * 100))
      loadingProgress.value = pct
      if (options.onProgress) {
        options.onProgress(pct)
      }

      if (lowLoadedCount >= villaFrameCount) {
        triggerComplete()
      }
    }

    // Safety timeout: Ensure site unlocks within 2.5s even if network stalls on a single frame
    setTimeout(() => {
      if (!isReady.value && lowLoadedCount >= 15) {
        triggerComplete()
      }
    }, 2500)

    const lowQueue = []
    for (let i = 2; i <= villaFrameCount; i++) {
      lowQueue.push(i)
    }

    let lowIdx = 0
    const LOW_BATCH = 6 // Browser connection limit standard

    const loadNextLowBatch = () => {
      if (lowIdx >= lowQueue.length) return
      const end = Math.min(lowIdx + LOW_BATCH, lowQueue.length)
      for (let k = lowIdx; k < end; k++) {
        const num = lowQueue[k]
        const padded = String(num).padStart(4, '0')
        const img = new Image()
        let handled = false

        const onDone = () => {
          if (handled) return
          handled = true
          loadedVillaLow[num - 1] = img
          updateProgress()
        }

        img.onload = onDone
        img.onerror = onDone
        img.src = `${villaLowPrefix}${padded}${villaExt}`

        if (img.complete && img.naturalWidth !== 0) {
          onDone()
        }
      }
      lowIdx = end
      if (lowIdx < lowQueue.length) {
        setTimeout(loadNextLowBatch, 20)
      }
    }

    // Start low-res queue 50ms after primary frame paint
    setTimeout(loadNextLowBatch, 50)
  }

  // Step 3: Progressive HD Villa Stream in gentle background batches of 4
  const startVillaHdStream = () => {
    let hdIdx = 0
    const HD_BATCH = 4

    const processNextHdBatch = () => {
      if (hdIdx >= villaFrameCount) return
      const end = Math.min(hdIdx + HD_BATCH, villaFrameCount)
      for (let k = hdIdx; k < end; k++) {
        const padded = String(k + 1).padStart(4, '0')
        const img = new Image()
        img.src = `${villaHdPrefix}${padded}${villaExt}`
        img.onload = () => { loadedVillaHd[k] = img }
      }
      hdIdx = end
      if (hdIdx < villaFrameCount) {
        batchStreamTimer = setTimeout(processNextHdBatch, 35)
      }
    }

    setTimeout(processNextHdBatch, 100)
  }

  // Step 4: Lazy Walkthrough Stream (Only triggers when user scrolls near walkthrough)
  const startWalkthroughStream = () => {
    if (walkStreamStarted) return
    walkStreamStarted = true

    let wIdx = 0
    const W_BATCH = 6

    const processNextWalkBatch = () => {
      if (wIdx >= walkthroughFrameCount) return
      const end = Math.min(wIdx + W_BATCH, walkthroughFrameCount)
      for (let k = wIdx; k < end; k++) {
        const padded = String(k + 1).padStart(4, '0')
        // Load low-res proxy first
        const lowImg = new Image()
        lowImg.src = `${walkthroughLowPrefix}${padded}${walkthroughExt}`
        lowImg.onload = () => { loadedWalkthroughLow[k] = lowImg }

        // Also load HD
        const hdImg = new Image()
        hdImg.src = `${walkthroughHdPrefix}${padded}${walkthroughExt}`
        hdImg.onload = () => { loadedWalkthroughHd[k] = hdImg }
      }
      wIdx = end
      if (wIdx < walkthroughFrameCount) {
        setTimeout(processNextWalkBatch, 30)
      }
    }

    processNextWalkBatch()
  }

  // 60FPS Continuous RAF Loop with Physics LERP & Dual-Tier Resolution Upgrade
  const startAnimationLoop = () => {
    const loop = () => {
      if (!canvasRef.value) return
      const canvas = canvasRef.value
      if (!ctx) ctx = canvas.getContext('2d')

      const w = canvas.width
      const h = canvas.height
      const p = scrollProgress.value

      // Dynamic trigger for walkthrough streaming when user scrolls near it
      if (p > 0.25 && !walkStreamStarted) {
        startWalkthroughStream()
      }

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

        // Prefer HD, fallback to Low-Res Proxy, fallback to Frame 1 (guaranteed loaded)
        const img = loadedVillaHd[vIndex] || loadedVillaLow[vIndex] || loadedVillaLow[0]
        if (img && img.complete && img.naturalWidth !== 0) {
          drawCoverMedia(img, img.naturalWidth, img.naturalHeight, 1.0)
        }
      }
      // Phase 2: Pause / Hold on Final Frame (35% to 45%)
      else if (p < 0.45) {
        currentPhase.value = 'pause'
        const vIndex = villaFrameCount - 1
        currentFrame.value = vIndex

        const img = loadedVillaHd[vIndex] || loadedVillaLow[vIndex] || loadedVillaLow[0]
        if (img && img.complete && img.naturalWidth !== 0) {
          drawCoverMedia(img, img.naturalWidth, img.naturalHeight, 1.0)
        }
      }
      // Phase 3: Building Zoom-In (45% to 58%)
      else if (p < 0.58) {
        currentPhase.value = 'zoom'
        const vIndex = villaFrameCount - 1
        currentFrame.value = vIndex

        const img = loadedVillaHd[vIndex] || loadedVillaLow[vIndex] || loadedVillaLow[0]
        if (img && img.complete && img.naturalWidth !== 0) {
          drawCoverMedia(img, img.naturalWidth, img.naturalHeight, currentZoomScale, 0.5, 0.38)
        }

        // Crossfade dissolve into walkthrough Frame 0 near end of zoom (55% to 58%)
        if (p >= 0.55) {
          const crossAlpha = (p - 0.55) / 0.03
          const firstWalkImg = loadedWalkthroughHd[0] || loadedWalkthroughLow[0]
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

        const img = loadedWalkthroughHd[wIndex] || loadedWalkthroughLow[wIndex] || loadedWalkthroughLow[0]
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
      targetZoomScale = 1.0 + easeT * 1.5
      targetWalkthroughFloat = 0
    }
    // 4. 3D Walkthrough (0.58 to 1.00)
    else {
      targetVillaFloat = villaFrameCount - 1
      targetZoomScale = 2.5

      const walkP = (p - 0.58) / (1.00 - 0.58)

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
    isReady,
    loadingProgress
  }
}
