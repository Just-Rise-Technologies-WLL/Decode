<template>
  <div class="three-can-container" :style="containerStyle">
    <canvas ref="canvasRef" class="three-can-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  scrollProgress: { type: Number, default: 0 },
  originCoords: { type: Object, required: true },
  targetCoords: { type: Object, required: true }
})

const canvasRef = ref(null)

let renderer = null
let scene = null
let camera = null
let canMesh = null

const initThree = () => {
  if (!canvasRef.value) return

  const width = 360
  const height = 440

  // 1. Scene & Renderer
  scene = new THREE.Scene()
  
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping

  // 2. Camera
  camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
  camera.position.set(0, 0, 7.2)

  // 3. Studio Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.6)
  scene.add(ambientLight)

  const mainLight = new THREE.DirectionalLight(0xffffff, 2.5)
  mainLight.position.set(5, 8, 7)
  scene.add(mainLight)

  const rimLight = new THREE.DirectionalLight(0xd4af37, 1.5)
  rimLight.position.set(-6, 4, -4)
  scene.add(rimLight)

  // 4. Real 3D Cylinder Mesh Geometry
  const radius = 1.15
  const cylinderHeight = 2.45
  const geometry = new THREE.CylinderGeometry(radius, radius, cylinderHeight, 64)

  // Load High-Res Official 360° Texture Map (texture 2.png)
  const textureLoader = new THREE.TextureLoader()
  const labelTexture = textureLoader.load('/products/texture 2.png', () => {
    renderScene()
  })
  labelTexture.colorSpace = THREE.SRGBColorSpace

  // Cylinder Materials
  const sideMat = new THREE.MeshStandardMaterial({
    map: labelTexture,
    roughness: 0.2,
    metalness: 0.15
  })

  const lidMat = new THREE.MeshStandardMaterial({
    color: 0xc8c8c8, // Silver metallic lid & base matching texture rim
    roughness: 0.2,
    metalness: 0.85
  })

  // Material array: [side, top, bottom]
  canMesh = new THREE.Mesh(geometry, [sideMat, lidMat, lidMat])
  scene.add(canMesh)

  renderScene()
}

const renderScene = () => {
  if (!canMesh || !renderer || !scene || !camera) return

  const p = props.scrollProgress

  // Real 3D WebGL Cylinder Rotations:
  // Offset Y rotation so the main "prisma SLICK" logo faces front at resting state (p = 0)
  canMesh.rotation.y = (p * Math.PI * 2) + Math.PI
  // rotateX: 3D tilt mid-flight
  canMesh.rotation.x = Math.sin(p * Math.PI) * 0.20
  // rotateZ: Z-axis roll
  canMesh.rotation.z = Math.sin(p * Math.PI) * 0.15

  renderer.render(scene, camera)
}

watch(() => props.scrollProgress, renderScene)

onMounted(() => {
  initThree()
})

onUnmounted(() => {
  if (renderer) renderer.dispose()
})

const containerStyle = computed(() => {
  const p = props.scrollProgress
  const orig = props.originCoords
  const targ = props.targetCoords

  const currentX = orig.x + (targ.x - orig.x) * p
  const arcYOffset = Math.sin(p * Math.PI) * -25
  const currentY = orig.y + (targ.y - orig.y) * p + arcYOffset

  const scalePulse = 1 + Math.sin(p * Math.PI) * 0.12

  return {
    transform: `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${scalePulse})`,
    width: '360px',
    height: '440px'
  }
})
</script>

<style scoped>
.three-can-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  pointer-events: none;
  will-change: transform;
  display: flex;
  justify-content: center;
  align-items: center;
}

.three-can-canvas {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 25px 35px rgba(0, 0, 0, 0.25));
}
</style>
