import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Universal Scroll Canvas Engine with Butter-Smooth Inertial LERP Physics
 * Renders 350 HD Extracted Frames (/sequence/frame_0001.jpg .. frame_0350.jpg)
 * from 0:18 to 1:18 segment of 3D Private Residence Architectural Walkthrough Video.
 */
export function useScrollCanvas(canvasRef, containerRef, options = {}) {
  const frameCount = options.frameCount || 350
  const imagePrefix = options.imagePrefix || '/sequence/frame_'
  const imageExt = options.imageExt || '.jpg'

  let ctx = null
  const scrollProgress = ref(0)
  const currentFrame = ref(0)
  const isReady = ref(false)

  // Physics LERP State
  let currentFrameFloat = 0
  let targetFrameFloat = 0
  let animFrameId = null

  // Modes: 'sequence' | 'video'
  let mode = 'sequence'
  const loadedImages = []
  let videoElement = null

  // 1. Preload Image Sequence (350 HD Frames)
  const initSequence = () => {
    let loadedCount = 0
    for (let i = 1; i <= frameCount; i++) {
      const paddedNum = String(i).padStart(4, '0')
      const img = new Image()
      img.src = `${imagePrefix}${paddedNum}${imageExt}`
      img.onload = () => {
        loadedCount++
        if (loadedCount >= 3 && !isReady.value) {
          isReady.value = true
          if (options.onReady) options.onReady()
        }
        if (loadedCount > 1 && animFrameId === null) {
          mode = 'sequence'
          startAnimationLoop()
        }
      }
      img.onerror = () => {
        if (loadedCount < 2 && mode !== 'video') {
          initVideo()
        }
      }
      loadedImages.push(img)
    }
  }

  // 2. Try Video Detection Fallback
  const initVideo = () => {
    const video = document.createElement('video')
    video.src = '/video/Vrender Company - Private Residence Exterior _ Interior 4K 3D Animation Walkthrough Video - Vrender Architectural Rendering and 3D Animation (1080p, h264).mp4'
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true
    video.oncanplaythrough = () => {
      videoElement = video
      mode = 'video'
      isReady.value = true
      if (options.onReady) options.onReady()
      if (animFrameId === null) startAnimationLoop()
    }
  }

  // Draw image or video with aspect ratio 'cover'
  const drawCoverMedia = (media, naturalWidth, naturalHeight) => {
    if (!canvasRef.value) return
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

  // Butter-Smooth Continuous RAF Loop with LERP Interpolation
  const startAnimationLoop = () => {
    const loop = () => {
      if (!canvasRef.value) return
      const canvas = canvasRef.value
      if (!ctx) ctx = canvas.getContext('2d')

      const w = canvas.width
      const h = canvas.height

      // Continuous LERP Physics Interpolation for 60FPS Butter-Smooth Scrubbing
      currentFrameFloat += (targetFrameFloat - currentFrameFloat) * 0.14
      const renderIndex = Math.min(frameCount - 1, Math.max(0, Math.round(currentFrameFloat)))
      
      // Keep reactive currentFrame updated for hotspot sync
      if (currentFrame.value !== renderIndex) {
        currentFrame.value = renderIndex
      }

      ctx.fillStyle = '#242220'
      ctx.fillRect(0, 0, w, h)

      // Mode 1: 350 HD Image Sequence Scrubbing with LERP
      if (mode === 'sequence' && loadedImages[renderIndex] && loadedImages[renderIndex].complete && loadedImages[renderIndex].naturalWidth !== 0) {
        const img = loadedImages[renderIndex]
        drawCoverMedia(img, img.naturalWidth, img.naturalHeight)
      } 
      // Mode 2: Video File Scrubbing Fallback
      else if (mode === 'video' && videoElement && videoElement.duration) {
        videoElement.currentTime = 18.0 + (currentFrameFloat / frameCount) * 60.0
        drawCoverMedia(videoElement, videoElement.videoWidth || w, videoElement.videoHeight || h)
      } 
      // Initial Frame 0 Base
      else if (loadedImages[0] && loadedImages[0].complete && loadedImages[0].naturalWidth !== 0) {
        const img = loadedImages[0]
        drawCoverMedia(img, img.naturalWidth, img.naturalHeight)
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
   * Magnetic Scroll Curve with Plateaus (Frame Holds):
   * Provides dedicated scroll travel windows where the camera pauses at the keyframe
   * so the wall surface and '+' pin remain 100% stationary and easy to click.
   */
  const mapScrollToTargetFrame = (progress, maxFrames) => {
    const p = Math.max(0, Math.min(1, progress))

    const SEGMENTS = [
      { startP: 0.00, endP: 0.05, startF: 0, endF: 30 },
      { startP: 0.05, endP: 0.22, startF: 30, endF: 30 },   // HOLD at Living Room (Frame 30)
      { startP: 0.22, endP: 0.30, startF: 30, endF: 115 },  // Travel to Master Suite
      { startP: 0.30, endP: 0.48, startF: 115, endF: 115 }, // HOLD at Master Suite (Frame 115)
      { startP: 0.48, endP: 0.56, startF: 115, endF: 210 }, // Travel to Dining Gallery
      { startP: 0.56, endP: 0.74, startF: 210, endF: 210 }, // HOLD at Dining Gallery (Frame 210)
      { startP: 0.74, endP: 0.82, startF: 210, endF: 305 }, // Travel to Private Lounge
      { startP: 0.82, endP: 0.96, startF: 305, endF: 305 }, // HOLD at Private Lounge (Frame 305)
      { startP: 0.96, endP: 1.00, startF: 305, endF: maxFrames } // Transition out
    ]

    for (const seg of SEGMENTS) {
      if (p >= seg.startP && p <= seg.endP) {
        if (seg.startF === seg.endF) {
          return seg.startF
        }
        const t = (p - seg.startP) / (seg.endP - seg.startP)
        // Smooth cubic ease between rooms
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

    // Set magnetic target frame float using non-linear plateaus
    targetFrameFloat = mapScrollToTargetFrame(scrollProgress.value, frameCount - 1)
  }

  onMounted(() => {
    handleResize()
    initSequence()
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    if (animFrameId !== null) cancelAnimationFrame(animFrameId)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    scrollProgress,
    currentFrame,
    isReady
  }
}

