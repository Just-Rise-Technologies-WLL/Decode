import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Dual-Mode Interactive Hero Canvas Engine:
 * 1. Hover Mode (Scroll = 0): Mouse X-position drives 3D Rotation (120 HD Frames, Mid-frame at center).
 * 2. Scroll Mode (Scroll > 0): Page scroll drives Full Architectural Walkthrough (240 HD Frames) with 60FPS LERP physics and magnetic room holds.
 */
export function useScrollCanvas(canvasRef, containerRef, options = {}) {
  const hoverFrameCount = options.hoverFrameCount || 120
  const hoverPrefix = options.hoverPrefix || '/sequence_hover/hover_'
  const hoverExt = options.hoverExt || '.jpg'

  const scrollFrameCount = options.scrollFrameCount || 240
  const scrollPrefix = options.scrollPrefix || '/sequence/frame_'
  const scrollExt = options.scrollExt || '.jpg'

  let ctx = null
  const scrollProgress = ref(0)
  const currentFrame = ref(0)
  const isHoverMode = ref(true)
  const isReady = ref(false)

  // Physics LERP State
  let currentHoverFloat = (hoverFrameCount - 1) / 2 // Start at exact mid-frame
  let targetHoverFloat = (hoverFrameCount - 1) / 2
  let currentScrollFloat = 0
  let targetScrollFloat = 0
  let animFrameId = null

  // Image caches
  const loadedHoverImages = []
  const loadedScrollImages = []

  // Mouse normalized coordinates (0.0 to 1.0, 0.5 center)
  let normMouseX = 0.5
  let normMouseY = 0.5

  // 1. Preload Hover & Scroll Frame Sequences
  const initSequences = () => {
    let hoverLoadedCount = 0
    let scrollLoadedCount = 0

    // Preload Hover Sequence (120 frames)
    for (let i = 1; i <= hoverFrameCount; i++) {
      const paddedNum = String(i).padStart(4, '0')
      const img = new Image()
      img.src = `${hoverPrefix}${paddedNum}${hoverExt}`
      img.onload = () => {
        hoverLoadedCount++
        if (hoverLoadedCount >= 5 && !isReady.value) {
          isReady.value = true
          if (options.onReady) options.onReady()
        }
        if (hoverLoadedCount > 1 && animFrameId === null) {
          startAnimationLoop()
        }
      }
      loadedHoverImages.push(img)
    }

    // Preload Scroll Walkthrough Sequence (240 frames)
    for (let i = 1; i <= scrollFrameCount; i++) {
      const paddedNum = String(i).padStart(4, '0')
      const img = new Image()
      img.src = `${scrollPrefix}${paddedNum}${scrollExt}`
      img.onload = () => {
        scrollLoadedCount++
        if (scrollLoadedCount >= 5 && !isReady.value) {
          isReady.value = true
          if (options.onReady) options.onReady()
        }
      }
      loadedScrollImages.push(img)
    }
  }

  // Draw image with aspect ratio 'cover'
  const drawCoverMedia = (media, naturalWidth, naturalHeight) => {
    if (!canvasRef.value || !ctx) return
    const canvas = canvasRef.value
    const w = canvas.width
    const h = canvas.height

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

        const hoverImg = loadedHoverImages[hoverIndex]
        if (hoverImg && hoverImg.complete && hoverImg.naturalWidth !== 0) {
          drawCoverMedia(hoverImg, hoverImg.naturalWidth, hoverImg.naturalHeight)
        } else {
          const midIdx = Math.floor(hoverFrameCount / 2)
          const midImg = loadedHoverImages[midIdx] || loadedHoverImages[0]
          if (midImg && midImg.complete && midImg.naturalWidth !== 0) {
            drawCoverMedia(midImg, midImg.naturalWidth, midImg.naturalHeight)
          }
        }
      } 
      // --- STATE 2: SCROLL-DRIVEN ARCHITECTURAL WALKTHROUGH ---
      else {
        currentScrollFloat += (targetScrollFloat - currentScrollFloat) * 0.14
        const scrollIndex = Math.min(scrollFrameCount - 1, Math.max(0, Math.round(currentScrollFloat)))

        currentFrame.value = scrollIndex

        const scrollImg = loadedScrollImages[scrollIndex]
        if (scrollImg && scrollImg.complete && scrollImg.naturalWidth !== 0) {
          drawCoverMedia(scrollImg, scrollImg.naturalWidth, scrollImg.naturalHeight)
        } else if (loadedScrollImages[0] && loadedScrollImages[0].complete) {
          drawCoverMedia(loadedScrollImages[0], loadedScrollImages[0].naturalWidth, loadedScrollImages[0].naturalHeight)
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
      targetHoverFloat = (hoverFrameCount - 1) / 2
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
