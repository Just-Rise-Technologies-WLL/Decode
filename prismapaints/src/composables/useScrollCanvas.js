import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Dual-Mode Interactive Hero Canvas Engine with Smart Batch Streaming:
 * 1. Immediate Load & Paint: Loads resting mid-frame (hover_0060.webp) in < 50ms to guarantee zero blank/black screen.
 * 2. Background Staggered Queue: Streams remaining lightweight WebP frames smoothly in small batches (no network flooding).
 * 3. 60FPS LERP Inertial Scrubbing: Ultra-fluid 3D mouse rotation & architectural scroll walkthrough.
 */
export function useScrollCanvas(canvasRef, containerRef, options = {}) {
  const hoverFrameCount = options.hoverFrameCount || 120
  const hoverPrefix = options.hoverPrefix || '/sequence_hover/hover_'
  const hoverExt = options.hoverExt || '.webp'

  const scrollFrameCount = options.scrollFrameCount || 240
  const scrollPrefix = options.scrollPrefix || '/sequence/frame_'
  const scrollExt = options.scrollExt || '.webp'

  let ctx = null
  const scrollProgress = ref(0)
  const currentFrame = ref(0)
  const isHoverMode = ref(true)
  const isReady = ref(false)

  // Mid-frame resting index (e.g. Frame 60 for 120-frame hover)
  const midFrameIndex = Math.floor(hoverFrameCount / 2)

  // Physics LERP State
  let currentHoverFloat = midFrameIndex
  let targetHoverFloat = midFrameIndex
  let currentScrollFloat = 0
  let targetScrollFloat = 0
  let animFrameId = null
  let batchStreamTimer = null

  // Image caches
  const loadedHoverImages = new Array(hoverFrameCount)
  const loadedScrollImages = new Array(scrollFrameCount)

  // Mouse normalized coordinates (0.0 to 1.0, 0.5 center)
  let normMouseX = 0.5
  let normMouseY = 0.5

  // Draw image with aspect ratio 'cover'
  const drawCoverMedia = (media, naturalWidth, naturalHeight) => {
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

    ctx.drawImage(media, drawX, drawY, drawW, drawH)
  }

  // 1. Preload Priority Resting Frame First, then background stream the rest in batches
  const initSequences = () => {
    handleResize()

    // --- STEP 1: PRIORITY LOAD RESTING MID-FRAME (< 30KB WebP) ---
    const midNum = String(midFrameIndex + 1).padStart(4, '0')
    const primaryHoverImg = new Image()
    primaryHoverImg.src = `${hoverPrefix}${midNum}${hoverExt}`

    const onPrimaryReady = () => {
      loadedHoverImages[midFrameIndex] = primaryHoverImg
      if (canvasRef.value) {
        drawCoverMedia(primaryHoverImg, primaryHoverImg.naturalWidth || 1920, primaryHoverImg.naturalHeight || 1080)
      }
      if (!isReady.value) {
        isReady.value = true
        if (options.onReady) options.onReady()
      }
      if (animFrameId === null) {
        startAnimationLoop()
      }
    }

    primaryHoverImg.onload = onPrimaryReady
    if (primaryHoverImg.complete && primaryHoverImg.naturalWidth !== 0) {
      onPrimaryReady()
    }

    // Also priority load Frame 1 of Walkthrough
    const firstScrollImg = new Image()
    firstScrollImg.src = `${scrollPrefix}0001${scrollExt}`
    firstScrollImg.onload = () => {
      loadedScrollImages[0] = firstScrollImg
    }

    // --- STEP 2: STAGGERED BATCH STREAMING (Prevents Vercel network congestion) ---
    const hoverQueue = []
    for (let i = 1; i <= hoverFrameCount; i++) {
      const idx = i - 1
      if (idx === midFrameIndex) continue
      hoverQueue.push({ type: 'hover', idx, num: i })
    }

    const scrollQueue = []
    for (let i = 1; i <= scrollFrameCount; i++) {
      const idx = i - 1
      if (idx === 0) continue
      scrollQueue.push({ type: 'scroll', idx, num: i })
    }

    const combinedQueue = [...hoverQueue, ...scrollQueue]
    let queueIdx = 0
    const BATCH_SIZE = 6 // Standard browser HTTP connection limit

    const processNextBatch = () => {
      if (queueIdx >= combinedQueue.length) return

      const end = Math.min(queueIdx + BATCH_SIZE, combinedQueue.length)
      for (let k = queueIdx; k < end; k++) {
        const item = combinedQueue[k]
        const paddedNum = String(item.num).padStart(4, '0')
        const img = new Image()

        if (item.type === 'hover') {
          img.src = `${hoverPrefix}${paddedNum}${hoverExt}`
          img.onload = () => { loadedHoverImages[item.idx] = img }
        } else {
          img.src = `${scrollPrefix}${paddedNum}${scrollExt}`
          img.onload = () => { loadedScrollImages[item.idx] = img }
        }
      }

      queueIdx = end
      if (queueIdx < combinedQueue.length) {
        batchStreamTimer = setTimeout(processNextBatch, 30) // Gentle 30ms throttle
      }
    }

    // Start background stream 100ms after initial frame is painted
    setTimeout(processNextBatch, 100)
  }

  // Butter-Smooth Continuous RAF Loop with Dual-State LERP Interpolation
  const startAnimationLoop = () => {
    const loop = () => {
      if (!canvasRef.value) return
      const canvas = canvasRef.value
      if (!ctx) ctx = canvas.getContext('2d')

      const w = canvas.width
      const h = canvas.height

      const inHover = scrollProgress.value < 0.015
      isHoverMode.value = inHover

      ctx.fillStyle = '#161412'
      ctx.fillRect(0, 0, w, h)

      // --- STATE 1: MOUSE HOVER 3D ROTATION ---
      if (inHover) {
        currentHoverFloat += (targetHoverFloat - currentHoverFloat) * 0.12
        const hoverIndex = Math.min(hoverFrameCount - 1, Math.max(0, Math.round(currentHoverFloat)))
        
        currentFrame.value = hoverIndex

        const hoverImg = loadedHoverImages[hoverIndex] || loadedHoverImages[midFrameIndex]
        if (hoverImg && hoverImg.complete && hoverImg.naturalWidth !== 0) {
          drawCoverMedia(hoverImg, hoverImg.naturalWidth, hoverImg.naturalHeight)
        }
      } 
      // --- STATE 2: SCROLL-DRIVEN ARCHITECTURAL WALKTHROUGH ---
      else {
        currentScrollFloat += (targetScrollFloat - currentScrollFloat) * 0.14
        const scrollIndex = Math.min(scrollFrameCount - 1, Math.max(0, Math.round(currentScrollFloat)))

        currentFrame.value = scrollIndex

        const scrollImg = loadedScrollImages[scrollIndex] || loadedScrollImages[0]
        if (scrollImg && scrollImg.complete && scrollImg.naturalWidth !== 0) {
          drawCoverMedia(scrollImg, scrollImg.naturalWidth, scrollImg.naturalHeight)
        } else {
          const fallback = loadedHoverImages[midFrameIndex]
          if (fallback && fallback.complete && fallback.naturalWidth !== 0) {
            drawCoverMedia(fallback, fallback.naturalWidth, fallback.naturalHeight)
          }
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

  /**
   * Magnetic Scroll Curve with Reduced Hold Times (~6-7% per keyframe):
   * Keyframe 1: Frame 130 (Green Living Room Accent Wall)
   * Keyframe 2: Frame 150 (Blue Dining/Kitchen Wall)
   * Keyframe 3: Frame 218 (Master Suite Bedroom Wall)
   */
  const mapScrollToTargetFrame = (progress, maxFrames) => {
    const p = Math.max(0, Math.min(1, progress))

    const SEGMENTS = [
      { startP: 0.00, endP: 0.15, startF: 0, endF: 130 },
      { startP: 0.15, endP: 0.22, startF: 130, endF: 130 },  // HOLD 1: Frame 130 (Green Wall) [7% hold]
      { startP: 0.22, endP: 0.44, startF: 130, endF: 150 },  // Travel to Blue Wall
      { startP: 0.44, endP: 0.51, startF: 150, endF: 150 },  // HOLD 2: Frame 150 (Blue Wall) [7% hold]
      { startP: 0.51, endP: 0.76, startF: 150, endF: 218 },  // Travel to Master Bedroom
      { startP: 0.76, endP: 0.83, startF: 218, endF: 218 },  // HOLD 3: Frame 218 (Master Bedroom) [7% hold]
      { startP: 0.83, endP: 1.00, startF: 218, endF: maxFrames } // Transition to end
    ]

    for (const seg of SEGMENTS) {
      if (p >= seg.startP && p <= seg.endP) {
        if (seg.startF === seg.endF) {
          return seg.startF
        }
        const t = (p - seg.startP) / (seg.endP - seg.startP)
        const easeT = t * t * (3 - 2 * t)
        return seg.startF + easeT * (seg.endF - seg.startF)
      }
    }

    return p * maxFrames
  }

  const handleScroll = () => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    const totalHeight = containerRef.value.offsetHeight - window.innerHeight
    const scrolled = Math.max(0, -rect.top)
    scrollProgress.value = Math.min(1, Math.max(0, scrolled / Math.max(1, totalHeight)))

    targetScrollFloat = mapScrollToTargetFrame(scrollProgress.value, scrollFrameCount - 1)
  }

  const handleMouseMove = (e) => {
    normMouseX = Math.max(0, Math.min(1, e.clientX / window.innerWidth))
    normMouseY = Math.max(0, Math.min(1, e.clientY / window.innerHeight))

    if (scrollProgress.value < 0.02) {
      targetHoverFloat = normMouseX * (hoverFrameCount - 1)
    }
  }

  const handleMouseLeave = () => {
    if (scrollProgress.value < 0.02) {
      targetHoverFloat = midFrameIndex
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
    isHoverMode,
    isReady
  }
}
