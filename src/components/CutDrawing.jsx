import { useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ElevationDrawing, SectionDrawing } from './drawings'
import { useMedia, useReducedMotion } from '../hooks'

const MIN = 6
const MAX = 94

export default function CutDrawing() {
  const narrow = useMedia('(max-width: 760px)')
  const reduced = useReducedMotion()
  const root = useRef(null)
  const handle = useRef(null)
  const pos = useRef(58)
  const tlRef = useRef(null)

  const stageRef = useRef(null)
  const box = useRef({ w: 0, h: 0, left: 0, top: 0 })
  const raf = useRef(0)
  const want = useRef(58)

  const apply = useCallback(
    (v) => {
      pos.current = v
      const el = root.current
      if (!el) return
      const { w, h } = box.current
      el.style.setProperty('--cut', `${v}%`)
      el.style.setProperty('--cutx', `${((narrow ? h : w) * v) / 100}px`)
      handle.current?.setAttribute('aria-valuenow', String(Math.round(v)))
    },
    [narrow],
  )

  // Measure the stage once and on resize, never while dragging.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const measure = () => {
      const r = stage.getBoundingClientRect()
      box.current = { w: r.width, h: r.height, left: r.left, top: r.top }
      apply(pos.current)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage)
    return () => ro.disconnect()
  }, [apply])

  // One authored moment: the plane sweeps once so the drawing reads as interactive.
  useEffect(() => {
    apply(58)
    let seen = false
    try {
      seen = sessionStorage.getItem('cut-demo') === '1'
    } catch {
      /* storage can be blocked */
    }
    if (reduced || seen) return
    const state = { v: 8 }
    const tl = gsap.timeline({ delay: 0.5 })
    tlRef.current = tl
    tl.set(state, { v: 8, onUpdate: () => apply(state.v) })
      .to(state, { v: 92, duration: 0.7, ease: 'power2.inOut', onUpdate: () => apply(state.v) })
      .to(state, { v: 58, duration: 0.7, ease: 'power2.inOut', onUpdate: () => apply(state.v) })
    try {
      sessionStorage.setItem('cut-demo', '1')
    } catch {
      /* ignore */
    }
    return () => tl.kill()
  }, [apply, reduced])

  // Coalesce pointer events into one update per frame. No layout reads in here.
  const fromEvent = (e) => {
    const b = box.current
    const raw = narrow ? ((e.clientY - b.top) / b.h) * 100 : ((e.clientX - b.left) / b.w) * 100
    want.current = Math.min(MAX, Math.max(MIN, raw))
    if (raf.current) return
    raf.current = requestAnimationFrame(() => {
      raf.current = 0
      apply(want.current)
    })
  }

  const onPointerDown = (e) => {
    tlRef.current?.kill()
    // Re-measure once at the start of a drag, since the page may have scrolled.
    const r = stageRef.current.getBoundingClientRect()
    box.current = { w: r.width, h: r.height, left: r.left, top: r.top }
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.dataset.drag = '1'
    fromEvent(e)
  }
  const onPointerMove = (e) => {
    if (e.currentTarget.dataset.drag === '1') fromEvent(e)
  }
  const onPointerUp = (e) => {
    e.currentTarget.dataset.drag = ''
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }
  const onKey = (e) => {
    tlRef.current?.kill()
    const back = narrow ? 'ArrowUp' : 'ArrowLeft'
    const fwd = narrow ? 'ArrowDown' : 'ArrowRight'
    if (e.key === back) apply(Math.max(MIN, pos.current - 4))
    else if (e.key === fwd) apply(Math.min(MAX, pos.current + 4))
    else if (e.key === 'Home') apply(MIN)
    else if (e.key === 'End') apply(MAX)
    else return
    e.preventDefault()
  }

  return (
    <figure className="cut" data-orient={narrow ? 'h' : 'v'} ref={root}>
      <div className="cut-stage" ref={stageRef}>
        <ElevationDrawing narrow={narrow} className="cut-layer cut-elev" />
        <SectionDrawing narrow={narrow} className="cut-layer cut-sect" />
        <div className="cut-line" aria-hidden="true" />
        <button
          ref={handle}
          type="button"
          className="cut-handle"
          data-cursor="Drag"
          role="slider"
          aria-label="Slider: product on one side, the system underneath on the other"
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={58}
          aria-orientation={narrow ? 'vertical' : 'horizontal'}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKey}
        >
          <span className="cut-grip" aria-hidden="true" />
        </button>
      </div>
      <figcaption className="cut-cap">
        <span>
          <strong>Product</strong> what the user sees
        </span>
        <span>
          <strong>System</strong> what makes it work
        </span>
      </figcaption>
      <p className="cut-hint">
        Drag the line, or use the arrow keys, to see what sits underneath Applyer.
      </p>
    </figure>
  )
}
