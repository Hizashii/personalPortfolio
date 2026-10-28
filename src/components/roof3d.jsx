import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Textured "japan Roof" by ugly kid, CC BY 4.0. The model loads only for the hero.

const MODEL_URL = '/roof/japan_roof.glb'

export default function Roof3D({ still = false }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    } catch {
      return undefined
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-5, 5, 3, -3, 0.1, 500)

    // Light it like an overcast afternoon against a plaster wall: one key from
    // the front-left, a warm bounce from below, and a soft fill.
    scene.add(new THREE.HemisphereLight(0xfdf8f0, 0x6b5a46, 1.05))
    const key = new THREE.DirectionalLight(0xfff6e8, 1.5)
    key.position.set(-3.2, 4.6, 5.4)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xffd9b0, 0.5)
    rim.position.set(4.2, 1.4, -3)
    scene.add(rim)

    const root = new THREE.Group()
    scene.add(root)

    let raf = 0
    let visible = true
    let loaded = false
    let disposed = false
    let modelBounds
    let w = 0
    let h = 0

    function resize() {
      const rect = mount.getBoundingClientRect()
      const nw = Math.max(1, Math.round(rect.width))
      const nh = Math.max(1, Math.round(rect.height))
      if (nw === w && nh === h) return false
      w = nw
      h = nh
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      fit()
      return true
    }

    // Frame the model so its full width is visible and its eave sits on the
    // bottom edge of the canvas, which is the line the curtains hang from.
    function fit() {
      if (!loaded || !w || !h) return
      const size = modelBounds.getSize(new THREE.Vector3())
      const halfWidth = Math.max(size.x * 0.53, size.y * (w / h) * 0.53)
      const height = halfWidth * 2 * h / w
      camera.left = -halfWidth
      camera.right = halfWidth
      camera.bottom = 0
      camera.top = height
      // Look slightly down onto the tiles while keeping the front gable dominant.
      camera.position.set(0, size.y * 1.3, 30)
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
    }

    function render() {
      renderer.render(scene, camera)
    }

    function frame() {
      resize()
      render()
      raf = requestAnimationFrame(frame)
    }

    function start() {
      if (still) {
        resize()
        render()
        return
      }
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame)
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const loader = new GLTFLoader()
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return
        // The gable faces along the asset's X axis; this is its decorated front.
        gltf.scene.rotation.y = -Math.PI / 2
        root.add(gltf.scene)
        const bounds = new THREE.Box3().setFromObject(root)
        const centre = bounds.getCenter(new THREE.Vector3())
        gltf.scene.position.set(-centre.x, -bounds.min.y, -centre.z)
        modelBounds = new THREE.Box3().setFromObject(root)
        loaded = true
        resize()
        fit()
        start()
      },
      undefined,
      () => {
        // A missing or broken model leaves the plain beam in place rather
        // than an empty hole in the hero.
        mount.classList.add('jp-roof--failed')
      },
    )

    const io =
      'IntersectionObserver' in window && !still
        ? new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting
              if (visible) start()
              else stop()
            },
            { threshold: 0.01 },
          )
        : null
    io?.observe(mount)

    const onVis = () => (document.hidden ? stop() : start())
    if (!still) document.addEventListener('visibilitychange', onVis)

    const observer = new ResizeObserver(() => { resize(); if (still) render() })
    observer.observe(mount)
    resize()

    return () => {
      disposed = true
      stop()
      observer.disconnect()
      io?.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      scene.traverse((o) => {
        if (o.isMesh) {
          o.geometry?.dispose?.()
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose?.())
          else o.material?.dispose?.()
        }
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [still])

  return <div className="jp-roof" ref={mountRef} aria-hidden="true" />
}
