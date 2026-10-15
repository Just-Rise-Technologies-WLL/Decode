import { ref, onMounted, onUnmounted } from 'vue'

/**
 * High-Performance Dual-Tier Progressive Architectural Canvas Engine:
 * Tier 1 (Fast Low-Res Proxy): Preloads 300 lightweight WebP frames (~2.4 MB)
 *        driving the 100% real dynamic progress bar (0% -> 100%).
 * Tier 2 (HD Progressive Upgrade): Streams 1080p HD frames in the background,
 *        smoothly swapping them into canvas memory without blocking user scroll.
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

    let lowLoadedCount = 0

    const updateProgress = () => {
      lowLoadedCount++
      const pct = Math.min(100, Math.round((lowLoadedCount / villaFrameCount) * 100))
      loadingProgress.value = pct
      if (options.onProgress) {
        options.onProgress(pct)
      }

      // Initial first paint as soon as frame 1 arrives
      if (lowLoadedCount === 1 && loadedVillaLow[0] && canvasRef.value) {
        drawCoverMedia(loadedVillaLow[0], loadedVillaLow[0].naturalWidth || 480, loadedVillaLow[0].naturalHeight || 270)
        if (animFrameId === null) startAnimationLoop()
      }

      // When all 300 low-res frames are in memory, dismiss preloader
      if (lowLoadedCount === villaFrameCount && !isReady.value) {
        isReady.value = true
        if (options.onReady) options.onReady()
        // Immediately start HD background upgrade stream
        startBackgroundHdStream()
      }
    }

    // Step 1: Preload all 300 lightweight low-res proxy frames (~2.4 MB total)
    // Batch in groups of 12 for high concurrency download
    const lowQueue = []
    for (let i = 1; i <= villaFrameCount; i++) {
      lowQueue.push(i)
    }

    let lowIdx = 0
    const LOW_BATCH = 12

    const loadNextLowBatch = () => {
      if (lowIdx >= lowQueue.length) return
      const end = Math.min(lowIdx + LOW_BATCH, lowQueue.length)
      for (let k = lowIdx; k < end; k++) {
        const num = lowQueue[k]
        const padded = String(num).padStart(4, '0')
        const img = new Image()
        img.src = `${villaLowPrefix}${padded}${villaExt}`
        img.onload = () => {
          loadedVillaLow[num - 1] = img
          updateProgress()
        }
        img.onerror = () => {
          updateProgress()
        }
      }
      lowIdx = end
      if (lowIdx < lowQueue.length) {
        setTimeout(loadNextLowBatch, 15)
      }
    }

    loadNextLowBatch()
  }

  // Step 2: Background HD Upgrade Stream (Walkthrough Low + Villa HD + Walkthrough HD)
  const startBackgroundHdStream = () => {
    // 1. Walkthrough low-res proxy frames (240 frames, ~2.6 MB)
    const walkLowQueue = []
    for (let i = 1; i <= walkthroughFrameCount; i++) {
      walkLowQueue.push({ type: 'walkLow', num: i })
    }

    // 2. Villa 1080p HD frames
    const villaHdQueue = []
    for (let i = 1; i <= villaFrameCount; i++) {
      villaHdQueue.push({ type: 'villaHd', num: i })
    }

    // 3. Walkthrough 1080p HD frames
    const walkHdQueue = []
    for (let i = 1; i <= walkthroughFrameCount; i++) {
      walkHdQueue.push({ type: 'walkHd', num: i })
    }

    const bgQueue = [...walkLowQueue, ...villaHdQueue, ...walkHdQueue]
    let bgIdx = 0
    const BG_BATCH = 6

    const processNextBgBatch = () => {
      if (bgIdx >= bgQueue.length) return
      const end = Math.min(bgIdx + BG_BATCH, bgQueue.length)
      for (let k = bgIdx; k < end; k++) {
        const item = bgQueue[k]
        const padded = String(item.num).padStart(4, '0')
        const img = new Image()

        if (item.type === 'walkLow') {
          img.src = `${walkthroughLowPrefix}${padded}${walkthroughExt}`
          img.onload = () => { loadedWalkthroughLow[item.num - 1] = img }
        } else if (item.type === 'villaHd') {
          img.src = `${villaHdPrefix}${padded}${villaExt}`
          img.onload = () => { loadedVillaHd[item.num - 1] = img }
        } else if (item.type === 'walkHd') {
          img.src = `${walkthroughHdPrefix}${padded}${walkthroughExt}`
          img.onload = () => { loadedWalkthroughHd[item.num - 1] = img }
        }
      }

      bgIdx = end
      if (bgIdx < bgQueue.length) {
        batchStreamTimer = setTimeout(processNextBgBatch, 25)
      }
    }

    setTimeout(processNextBgBatch, 100)
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

        // Prefer HD, fallback to Low-Res Proxy (instant 60fps)
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
