import { onMounted, onUnmounted } from 'vue'

/**
 * Universal Scroll Canvas Engine
 * Auto-detects in order:
 * 1. MP4 Video File (/video/hero.mp4) - Double-buffered Canvas scrub
 * 2. Image Sequence (/sequence/frame_0001.webp .. frame_0120.webp)
 * 3. Procedural Luxury Paint Canvas Animation (Fallback)
 */
export function useScrollCanvas(canvasRef, containerRef, options = {}) {
  const frameCount = options.frameCount || 60
  const imagePrefix = options.imagePrefix || '/sequence/frame_'
  const imageExt = options.imageExt || '.webp'
  const videoSrc = options.videoSrc || '/video/hero.mp4'

  let ctx = null
  let currentFrameIndex = 0
  let scrollProgress = 0

  // Modes
  let mode = 'procedural' // 'video' | 'sequence' | 'procedural'
  const loadedImages = []
  let videoElement = null

  // 1. Try Video Detection
  const initVideo = () => {
    const video = document.createElement('video')
    video.src = videoSrc
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true
    video.oncanplaythrough = () => {
      videoElement = video
      mode = 'video'
      render()
    }
    video.onerror = () => {
      // If video not found, fallback to sequence
      initSequence()
    }
  }

  // 2. Try Sequence Detection
  const initSequence = () => {
    let loadedCount = 0
    for (let i = 1; i <= frameCount; i++) {
      const paddedNum = String(i).padStart(4, '0')
      const img = new Image()
      img.src = `${imagePrefix}${paddedNum}${imageExt}`
      img.onload = () => {
        loadedCount++
        if (loadedCount > 5) {
          mode = 'sequence'
          render()
        }
      }
      loadedImages.push(img)
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
      drawX = 0
      drawY = (h - drawH) / 2
    } else {
      drawH = h
      drawW = h * mediaRatio
      drawX = (w - drawW) / 2
      drawY = 0
    }

    ctx.drawImage(media, drawX, drawY, drawW, drawH)
  }

  // Render Engine
  const render = () => {
    if (!canvasRef.value) return
    const canvas = canvasRef.value
    if (!ctx) ctx = canvas.getContext('2d')

    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    // Mode 1: Video File Scrubbing
    if (mode === 'video' && videoElement && videoElement.duration) {
      videoElement.currentTime = scrollProgress * videoElement.duration
      drawCoverMedia(videoElement, videoElement.videoWidth || w, videoElement.videoHeight || h)
      return
    }

    // Mode 2: Image Sequence Scrubbing
    if (mode === 'sequence' && loadedImages[currentFrameIndex] && loadedImages[currentFrameIndex].complete && loadedImages[currentFrameIndex].naturalWidth !== 0) {
      const img = loadedImages[currentFrameIndex]
      drawCoverMedia(img, img.naturalWidth, img.naturalHeight)
      return
    }

    // Mode 3: Procedural Paint Canvas (Fallback)
    const progress = scrollProgress
    const grad = ctx.createLinearGradient(0, 0, w, h)
    const r1 = Math.round(124 - progress * 40)
    const g1 = Math.round(59 - progress * 20)
    const b1 = Math.round(41 - progress * 15)
    grad.addColorStop(0, `rgb(${r1}, ${g1}, ${b1})`)
    grad.addColorStop(1, '#2b1816')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // Fluid paint wave
    ctx.save()
    ctx.beginPath()
    const waveY = h * (0.85 - progress * 0.5)
    ctx.moveTo(0, h)
    ctx.lineTo(0, waveY)

    for (let x = 0; x <= w; x += 30) {
      const y = waveY + Math.sin(x * 0.005 + progress * Math.PI * 2) * (40 + progress * 30)
      ctx.lineTo(x, y)
    }

    ctx.lineTo(w, h)
    ctx.closePath()

    const waveGrad = ctx.createLinearGradient(0, waveY, w, h)
    waveGrad.addColorStop(0, '#c49a6c')
    waveGrad.addColorStop(1, '#7c3b29')
    ctx.fillStyle = waveGrad
    ctx.globalAlpha = 0.85
    ctx.fill()
    ctx.restore()

    // Room wall mask reveal
    ctx.save()
    ctx.beginPath()
    const radius = Math.max(w, h) * (0.15 + progress * 0.9)
    ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2)
    ctx.clip()

    const innerGrad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w)
    innerGrad.addColorStop(0, '#d9c8b4')
    innerGrad.addColorStop(0.7, '#8d6e53')
    innerGrad.addColorStop(1, '#4a1d1b')
    ctx.fillStyle = innerGrad
    ctx.fillRect(0, 0, w, h)
    ctx.restore()
  }

  const handleResize = () => {
    if (!canvasRef.value) return
    canvasRef.value.width = window.innerWidth
    canvasRef.value.height = window.innerHeight
    render()
  }

  const handleScroll = () => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    const totalHeight = containerRef.value.offsetHeight - window.innerHeight
    const scrolled = Math.max(0, -rect.top)
    scrollProgress = Math.min(1, Math.max(0, scrolled / totalHeight))
    currentFrameIndex = Math.floor(scrollProgress * (frameCount - 1))

    requestAnimationFrame(render)
  }

  onMounted(() => {
    handleResize()
    initVideo()
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    render
  }
}
