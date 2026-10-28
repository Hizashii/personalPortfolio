import { useEffect, useState } from 'react'

export function useMedia(query) {
  const [match, setMatch] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
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

/* One orchestrated entrance per route: panels rise in reading order from an
   already-visible default, then the class is removed and never replayed. */
export function useEntrance(path) {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-rise]')
    if (!nodes.length) return undefined

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      nodes.forEach((n) => n.classList.add('rise', 'is-in'))
      return undefined
    }

    nodes.forEach((n) => n.classList.add('rise'))
    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((e, i) => {
            e.target.style.setProperty('--rise-delay', `${Math.min(i * 70, 280)}ms`)
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.04 },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [path])
}

/* True when the object should be drawn as the SVG twin rather than in WebGL:
   a coarse pointer, a narrow viewport, or a stated motion preference. Decided
   once on mount so the object and its caption can never disagree. */
export function useLiteObject() {
  const [lite] = useState(
    () =>
      typeof window !== 'undefined' &&
      (window.matchMedia('(hover: none)').matches ||
        window.matchMedia('(max-width: 820px)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches),
  )
  return lite
}
