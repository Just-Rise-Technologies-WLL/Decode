import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Universal Scroll Canvas Engine with Butter-Smooth Inertial LERP Physics
 * Renders 300 HD Extracted Frames (/sequence/frame_0001.jpg .. frame_0300.jpg)
 * from 0:18 to 1:18 segment of 3D Private Residence Architectural Walkthrough Video.
 */
export function useScrollCanvas(canvasRef, containerRef, options = {}) {
  const frameCount = options.frameCount || 300
  const imagePrefix = options.imagePrefix || '/sequence/frame_'
  const imageExt = options.imageExt || '.jpg'

  let ctx = null
  const scrollProgress = ref(0)

  // Physics LERP State
  let currentFrameFloat = 0
  let targetFrameFloat = 0
  let animFrameId = null

  // Modes: 'sequence' | 'video'
  let mode = 'sequence'
  const loadedImages = []
  let videoElement = null

  // 1. Preload Image Sequence (300 HD Frames)
  const initSequence = () => {
    let loadedCount = 0
    for (let i = 1; i <= frameCount; i++) {
      const paddedNum = String(i).padStart(4, '0')
      const img = new Image()
      img.src = `${imagePrefix}${paddedNum}${imageExt}`
      img.onload = () => {
        loadedCount++
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

      ctx.fillStyle = '#242220'
      ctx.fillRect(0, 0, w, h)

      // Mode 1: 300 HD Image Sequence Scrubbing with LERP
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

  const handleScroll = () => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    const totalHeight = containerRef.value.offsetHeight - window.innerHeight
    const scrolled = Math.max(0, -rect.top)
    scrollProgress.value = Math.min(1, Math.max(0, scrolled / totalHeight))

    // Set high-precision target frame float for LERP engine
    targetFrameFloat = scrollProgress.value * (frameCount - 1)
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
    scrollProgress
  }
}
