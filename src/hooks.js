import { useEffect, useRef, useState } from 'react'

export function useMedia(query) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches
  const [match, setMatch] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')

// Adds a small amount of entrance rhythm to every route without coupling pages to animation code.
export function usePageReveal(path) {
  useEffect(() => {
    const root = document.getElementById('main')
    if (!root) return undefined
    const nodes = root.querySelectorAll(
      'main > header, main > section, main > .wrap, main > .wrap > article, main > .wrap > section, main > .wrap > ol',
    )
    if (!nodes.length) return undefined

    nodes.forEach((node, index) => {
      node.classList.add('reveal-target')
      node.style.setProperty('--reveal-delay', `${Math.min(index * 55, 275)}ms`)
    })

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-revealed'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [path])
}

// Adds `is-drawn` once the element is 35% visible. Used by the line-draw drawings.
export function useDrawn() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-drawn')
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-drawn')
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

// Tracks which element id is nearest the top of the viewport.
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}
