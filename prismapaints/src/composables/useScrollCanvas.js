import { ref, onMounted, onUnmounted } from 'vue'

/**
 * High-Performance Dual-Tier Canvas Engine for Option 1 (Prisma Paints):
 * Phase 1: Scroll-driven Hologram Building Rise (0% to 35% scroll) - 180 frames
 * Phase 2: 3D Mouse Hover Rotation (35% to 45% scroll) - 120 frames
 * Phase 3: 3D Interior Walkthrough with Hotspots & Room Dock (45% to 100% scroll) - 240 frames
 * 
 * Preloads 180 low-res proxy frames (~2.1 MB) driving 100% real dynamic progress bar (0% -> 100%).
 * In the background, transparently upgrades to 1080p HD frames without scroll drops.
 */
export function useScrollCanvas(canvasRef, containerRef, options = {}) {
  const hologramFrameCount = options.hologramFrameCount || 180
  const hologramLowPrefix = '/sequence_hologram_low/holo_'
  const hologramHdPrefix = '/sequence_hologram/holo_'
  const holoExt = '.webp'

  const hoverFrameCount = options.hoverFrameCount || 120
  const hoverPrefix = options.hoverPrefix || '/sequence_hover/hover_'
  const hoverExt = '.webp'

  const walkthroughFrameCount = options.walkthroughFrameCount || 240
  const walkthroughLowPrefix = '/sequence_low/frame_'
  const walkthroughHdPrefix = options.walkthroughPrefix || '/sequence/frame_'
  const walkthroughExt = '.webp'

  let ctx = null
  const scrollProgress = ref(0)
  const currentFrame = ref(0)
  const currentPhase = ref('hologram') // 'hologram' | 'hover' | 'walkthrough'
  const isHoverMode = ref(false)
  const isReady = ref(false)
  const loadingProgress = ref(0)

  // Mid-frame resting index for hover rotation
  const midHoverIndex = Math.floor(hoverFrameCount / 2)

  // Physics LERP State
  let currentHoloFloat = 0
  let targetHoloFloat = 0
  let currentHoverFloat = midHoverIndex
  let targetHoverFloat = midHoverIndex
  let currentWalkthroughFloat = 0
  let targetWalkthroughFloat = 0

  let animFrameId = null
  let batchStreamTimer = null

  // Image caches
  const loadedHoloLow = new Array(hologramFrameCount)
  const loadedHoloHd = new Array(hologramFrameCount)

  const loadedHoverImages = new Array(hoverFrameCount)

  const loadedWalkthroughLow = new Array(walkthroughFrameCount)
  const loadedWalkthroughHd = new Array(walkthroughFrameCount)

  // Mouse normalized coordinates (0.0 to 1.0, 0.5 center)
  let normMouseX = 0.5

  // Draw image with cover aspect ratio and alpha
  const drawCoverMedia = (media, naturalWidth, naturalHeight, alpha = 1.0) => {
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
    ctx.drawImage(media, drawX, drawY, drawW, drawH)
    ctx.restore()
  }

  // Walkthrough Stream (Triggered only when user starts scrolling p > 0.25 or idle)
  let isWalkthroughStreamStarted = false
  const startWalkthroughStream = () => {
    if (isWalkthroughStreamStarted) return
    isWalkthroughStreamStarted = true

    const walkQueue = []
    for (let i = 1; i <= walkthroughFrameCount; i++) {
      walkQueue.push({ type: 'walkLow', num: i })
    }
    for (let i = 1; i <= walkthroughFrameCount; i++) {
      walkQueue.push({ type: 'walkHd', num: i })
    }

    let wIdx = 0
    const WALK_BATCH = 6
    const processWalkBatch = () => {
      if (wIdx >= walkQueue.length) return
      const end = Math.min(wIdx + WALK_BATCH, walkQueue.length)
      for (let k = wIdx; k < end; k++) {
        const item = walkQueue[k]
        const padded = String(item.num).padStart(4, '0')
        const img = new Image()
        if (item.type === 'walkLow') {
          img.onload = () => { loadedWalkthroughLow[item.num - 1] = img }
          img.src = `${walkthroughLowPrefix}${padded}${walkthroughExt}`
        } else {
          img.onload = () => { loadedWalkthroughHd[item.num - 1] = img }
          img.src = `${walkthroughHdPrefix}${padded}${walkthroughExt}`
        }
      }
      wIdx = end
      if (wIdx < walkQueue.length) {
        setTimeout(processWalkBatch, 25)
      }
    }
    processWalkBatch()
  }

  // Dual-tier progressive loading initialization
  const initSequences = () => {
    handleResize()

    // Immediate Priority 1: First Paint (<50ms)
    const firstImg = new Image()
    firstImg.onload = () => {
      loadedHoloLow[0] = firstImg
      drawCoverMedia(firstImg, firstImg.naturalWidth || 480, firstImg.naturalHeight || 270)
      if (animFrameId === null) startAnimationLoop()
    }
    firstImg.src = `${hologramLowPrefix}0001${holoExt}`
    if (firstImg.complete && firstImg.naturalWidth !== 0) {
      loadedHoloLow[0] = firstImg
      drawCoverMedia(firstImg, firstImg.naturalWidth || 480, firstImg.naturalHeight || 270)
      if (animFrameId === null) startAnimationLoop()
    }

    let lowLoadedCount = 0

    const triggerComplete = () => {
      if (!isReady.value) {
        isReady.value = true
        loadingProgress.value = 100
        if (options.onProgress) options.onProgress(100)
        if (options.onReady) options.onReady()
        startBackgroundHdStream()
      }
    }

    const updateProgress = () => {
      lowLoadedCount++
      const pct = Math.min(100, Math.round((lowLoadedCount / hologramFrameCount) * 100))
      loadingProgress.value = pct
      if (options.onProgress) {
        options.onProgress(pct)
      }

      // Initial first paint as soon as frame 1 arrives
      if (lowLoadedCount === 1 && loadedHoloLow[0] && canvasRef.value) {
        drawCoverMedia(loadedHoloLow[0], loadedHoloLow[0].naturalWidth || 480, loadedHoloLow[0].naturalHeight || 270)
        if (animFrameId === null) startAnimationLoop()
      }

      // When all 180 low-res frames are in memory, dismiss preloader
      if (lowLoadedCount >= hologramFrameCount) {
        triggerComplete()
      }
    }

    // Safety timeout: Ensure site opens within 2.8s even if network stalls on a single frame
    setTimeout(() => {
      if (!isReady.value && lowLoadedCount >= 20) {
        triggerComplete()
      }
    }, 2800)

    // Step 1: Preload all 180 lightweight low-res proxy frames (~2.1 MB total) in batches of 6
    const lowQueue = []
    for (let i = 1; i <= hologramFrameCount; i++) {
      lowQueue.push(i)
    }

    let lowIdx = 0
    const LOW_BATCH = 6

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
          loadedHoloLow[num - 1] = img
          updateProgress()
        }

        // Attach listeners BEFORE assigning src to capture cached hits
        img.onload = onDone
        img.onerror = onDone
        img.src = `${hologramLowPrefix}${padded}${holoExt}`

        // Immediate check for synchronous cache hit
        if (img.complete && img.naturalWidth !== 0) {
          onDone()
        }
      }
      lowIdx = end
      if (lowIdx < lowQueue.length) {
        setTimeout(loadNextLowBatch, 15)
      }
    }

    loadNextLowBatch()
  }

  // Step 2: Background HD Upgrade Stream (Hologram HD + Hover)
  const startBackgroundHdStream = () => {
    // 1. Hologram 1080p HD frames
    const holoHdQueue = []
    for (let i = 1; i <= hologramFrameCount; i++) {
      holoHdQueue.push({ type: 'holoHd', num: i })
    }

    // 2. Hover frames (120 frames)
    const hoverQueue = []
    for (let i = 1; i <= hoverFrameCount; i++) {
      hoverQueue.push({ type: 'hover', num: i })
    }

    const bgQueue = [...holoHdQueue, ...hoverQueue]
    let bgIdx = 0
    const BG_BATCH = 6

    const processNextBgBatch = () => {
      if (bgIdx >= bgQueue.length) {
        // Idle trigger for walkthrough stream after hover & hologram HD finish
        setTimeout(() => {
          if (!isWalkthroughStreamStarted) startWalkthroughStream()
        }, 1500)
        return
      }
      const end = Math.min(bgIdx + BG_BATCH, bgQueue.length)
      for (let k = bgIdx; k < end; k++) {
        const item = bgQueue[k]
        const padded = String(item.num).padStart(4, '0')
        const img = new Image()

        if (item.type === 'holoHd') {
          img.onload = () => { loadedHoloHd[item.num - 1] = img }
          img.src = `${hologramHdPrefix}${padded}${holoExt}`
        } else if (item.type === 'hover') {
          img.onload = () => { loadedHoverImages[item.num - 1] = img }
          img.src = `${hoverPrefix}${padded}${hoverExt}`
        }
      }

      bgIdx = end
      if (bgIdx < bgQueue.length) {
        batchStreamTimer = setTimeout(processNextBgBatch, 25)
      }
    }

    setTimeout(processNextBgBatch, 80)
  }

  // 60FPS Continuous RAF Loop with Physics LERP & Dual-Tier Upgrade
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
      currentHoloFloat += (targetHoloFloat - currentHoloFloat) * 0.16
      currentHoverFloat += (targetHoverFloat - currentHoverFloat) * 0.14
      currentWalkthroughFloat += (targetWalkthroughFloat - currentWalkthroughFloat) * 0.16

      // Phase 1: Scroll-driven Holographic Building Rise (0% to 35%)
      if (p < 0.35) {
        currentPhase.value = 'hologram'
        isHoverMode.value = false
        const hIndex = Math.min(hologramFrameCount - 1, Math.max(0, Math.round(currentHoloFloat)))
        currentFrame.value = hIndex

        const img = loadedHoloHd[hIndex] || loadedHoloLow[hIndex] || loadedHoloLow[0]
        if (img && img.complete && img.naturalWidth !== 0) {
          drawCoverMedia(img, img.naturalWidth, img.naturalHeight)
        }
      }
      // Phase 2: 3D Mouse Hover Rotation (35% to 45%)
      else if (p < 0.45) {
        currentPhase.value = 'hover'
        isHoverMode.value = true
        const hoverIndex = Math.min(hoverFrameCount - 1, Math.max(0, Math.round(currentHoverFloat)))
        currentFrame.value = hoverIndex

        const img = loadedHoverImages[hoverIndex] || loadedHoverImages[midHoverIndex] || loadedHoloHd[hologramFrameCount - 1] || loadedHoloLow[hologramFrameCount - 1]
        if (img && img.complete && img.naturalWidth !== 0) {
          drawCoverMedia(img, img.naturalWidth, img.naturalHeight)
        }
      }
      // Phase 3: 3D Interior Walkthrough with Hotspots & Room Dock (45% to 100%)
      else {
        currentPhase.value = 'walkthrough'
        isHoverMode.value = false
        const wIndex = Math.min(walkthroughFrameCount - 1, Math.max(0, Math.round(currentWalkthroughFloat)))
        currentFrame.value = wIndex

        const img = loadedWalkthroughHd[wIndex] || loadedWalkthroughLow[wIndex] || loadedWalkthroughLow[0]
        if (img && img.complete && img.naturalWidth !== 0) {
          drawCoverMedia(img, img.naturalWidth, img.naturalHeight)
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

  // Map scroll progress to target frames
  const handleScroll = () => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    const totalHeight = containerRef.value.offsetHeight - window.innerHeight
    const scrolled = Math.max(0, -rect.top)
    const p = Math.min(1, Math.max(0, scrolled / Math.max(1, totalHeight)))
    scrollProgress.value = p

    // Lazy load walkthrough frames as soon as user begins scrolling down
    if (p > 0.20 && !isWalkthroughStreamStarted) {
      startWalkthroughStream()
    }

    // 1. Hologram Build (0.00 to 0.35)
    if (p < 0.35) {
      const t = p / 0.35
      targetHoloFloat = t * (hologramFrameCount - 1)
      targetWalkthroughFloat = 0
    }
    // 2. Hover Rotation (0.35 to 0.45)
    else if (p < 0.45) {
      targetHoloFloat = hologramFrameCount - 1
      targetWalkthroughFloat = 0
    }
    // 3. 3D Walkthrough (0.45 to 1.00)
    else {
      targetHoloFloat = hologramFrameCount - 1

      const walkP = (p - 0.45) / (1.00 - 0.45)

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

  const handleMouseMove = (e) => {
    normMouseX = Math.max(0, Math.min(1, e.clientX / window.innerWidth))

    // Interactive mouse rotation active during Phase 2 (35% to 45% scroll)
    if (scrollProgress.value >= 0.33 && scrollProgress.value <= 0.47) {
      targetHoverFloat = normMouseX * (hoverFrameCount - 1)
    }
  }

  const handleMouseLeave = () => {
    if (scrollProgress.value >= 0.33 && scrollProgress.value <= 0.47) {
      targetHoverFloat = midHoverIndex
    }
  }

  onMounted(() => {
    handleResize()
    initSequences()
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
  })

  onUnmounted(() => {
    if (animFrameId !== null) cancelAnimationFrame(animFrameId)
    if (batchStreamTimer !== null) clearTimeout(batchStreamTimer)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseleave', handleMouseLeave)
  })

  return {
    scrollProgress,
    currentFrame,
    currentPhase,
    isHoverMode,
    isReady,
    loadingProgress
  }
}
