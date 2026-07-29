import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Universal Scroll Canvas Engine
 * Auto-detects in order:
 * 1. Image Sequence (/sequence/frame_0001.jpg .. frame_0090.jpg)
 * 2. MP4 Video File (/video/Paint_bucket_color_splash_reveal_202607290340.mp4)
 * 3. Luxury Interior Photo Scroll Reveal (Fallback)
 */
export function useScrollCanvas(canvasRef, containerRef, options = {}) {
  const frameCount = options.frameCount || 90
  const imagePrefix = options.imagePrefix || '/sequence/frame_'
  const imageExt = options.imageExt || '.jpg'

  let ctx = null
  let currentFrameIndex = 0
  const scrollProgress = ref(0)

  // Modes
  let mode = 'sequence'
  const loadedImages = []
  let videoElement = null

  // Fallback high-res luxury interior image
  const fallbackImage = new Image()
  fallbackImage.src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80'

  // 1. Preload Image Sequence
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
      img.onerror = () => {
        if (loadedCount < 5 && mode !== 'video') {
          initVideo()
        }
      }
      loadedImages.push(img)
    }
  }

  // 2. Try Video Detection Fallback
  const initVideo = () => {
    const video = document.createElement('video')
    video.src = '/video/Paint_bucket_color_splash_reveal_202607290340.mp4'
    video.preload = 'auto'
    video.muted = true
    video.playsInline = true
    video.oncanplaythrough = () => {
      videoElement = video
      mode = 'video'
      render()
    }
    video.onerror = () => {
      mode = 'photo'
      render()
    }
  }

  // Draw image or video with aspect ratio 'cover'
  const drawCoverMedia = (media, naturalWidth, naturalHeight, zoom = 1) => {
    if (!canvasRef.value) return
    const canvas = canvasRef.value
    const w = canvas.width
    const h = canvas.height

    const mediaRatio = naturalWidth / naturalHeight
    const canvasRatio = w / h
    let drawW, drawH, drawX, drawY

    if (canvasRatio > mediaRatio) {
      drawW = w * zoom
      drawH = (w / mediaRatio) * zoom
    } else {
      drawH = h * zoom
      drawW = (h * mediaRatio) * zoom
    }

    drawX = (w - drawW) / 2
    drawY = (h - drawH) / 2

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

    // Mode 1: Image Sequence Scrubbing (90 Frames extracted from Paint bucket color splash video)
    if (mode === 'sequence' && loadedImages[currentFrameIndex] && loadedImages[currentFrameIndex].complete && loadedImages[currentFrameIndex].naturalWidth !== 0) {
      const img = loadedImages[currentFrameIndex]
      drawCoverMedia(img, img.naturalWidth, img.naturalHeight)
      return
    }

    // Mode 2: Video File Scrubbing
    if (mode === 'video' && videoElement && videoElement.duration) {
      videoElement.currentTime = scrollProgress.value * videoElement.duration
      drawCoverMedia(videoElement, videoElement.videoWidth || w, videoElement.videoHeight || h)
      return
    }

    // Mode 3: Luxury Interior Photo Scroll Reveal (Fallback)
    if (fallbackImage.complete && fallbackImage.naturalWidth !== 0) {
      const zoom = 1 + scrollProgress.value * 0.15
      drawCoverMedia(fallbackImage, fallbackImage.naturalWidth, fallbackImage.naturalHeight, zoom)

      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, 'rgba(36, 24, 22, 0.45)')
      grad.addColorStop(0.5, 'rgba(36, 24, 22, 0.25)')
      grad.addColorStop(1, 'rgba(36, 24, 22, 0.65)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
    } else {
      ctx.fillStyle = '#2b1816'
      ctx.fillRect(0, 0, w, h)
    }
  }

  fallbackImage.onload = () => {
    render()
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
    scrollProgress.value = Math.min(1, Math.max(0, scrolled / totalHeight))
    currentFrameIndex = Math.min(frameCount - 1, Math.floor(scrollProgress.value * frameCount))

    requestAnimationFrame(render)
  }

  onMounted(() => {
    handleResize()
    initSequence()
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    scrollProgress,
    render
  }
}
