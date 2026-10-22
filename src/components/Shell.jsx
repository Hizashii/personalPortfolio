import { useEffect, useLayoutEffect, useRef } from 'react'
import { Link, useRouter } from '../router'
import { NAV, SOCIALS } from '../data'
import { Arrow } from './ui'
import { usePageReveal } from '../hooks'

export function CursorLabel() {
  const ref = useRef(null)
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = ref.current
    if (!fine || calm || !el) return undefined
    const move = (event) => {
      const hit = event.target.closest?.('[data-cursor]')
      if (hit) {
        el.textContent = hit.dataset.cursor
        el.style.transform = `translate3d(${event.clientX + 16}px, ${event.clientY + 16}px, 0)`
      }
      el.classList.toggle('is-on', Boolean(hit))
    }
    const leave = () => el.classList.remove('is-on')
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [])
  return <div ref={ref} className="cursor-label" aria-hidden="true" />
}

export function SiteHeader() {
  const { path } = useRouter()
  const navRef = useRef(null)
  const indicatorRef = useRef(null)
  const active = (to) => (to === '/' ? path === '/' : path === to)

  useLayoutEffect(() => {
    const link = navRef.current?.querySelector('.is-active')
    const indicator = indicatorRef.current
    if (!link || !indicator) return
    indicator.style.opacity = '1'
    indicator.style.width = `${link.offsetWidth}px`
    indicator.style.transform = `translateX(${link.offsetLeft}px)`
  }, [path])

  return (
    <header className="ibar">
      <div className="ibar-inner wrap">
        <Link to="/" className="ibar-brand" aria-label="Lachezar Dimchov, home">
          <span className="ibar-mark" aria-hidden="true">LD</span>
          <span className="ibar-name">Lachezar Dimchov</span>
        </Link>
        <nav className="ibar-nav" aria-label="Main navigation" ref={navRef}>
          <span className="ibar-ind" ref={indicatorRef} aria-hidden="true" />
          {NAV.map(({ to, label }) => (
            <Link key={to} to={to} className={`ibar-link ${active(to) ? 'is-active' : ''}`} aria-current={active(to) ? 'page' : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="ibar-actions">
          <a className="ibar-cv" href={SOCIALS.cv} target="_blank" rel="noopener noreferrer">CV <Arrow dir="down" /></a>
          <Link className="btn btn--solid btn--sm" to="/#contact">Say hello <Arrow /></Link>
        </div>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return <footer className="foot wrap"><span className="mono">L. Dimchov · Esbjerg · 2026</span><span>Thanks for reading.</span></footer>
}

export function SiteFrame({ children }) {
  const { path } = useRouter()
  usePageReveal(path)

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <div id="main">{children}</div>
      <SiteFooter />
    </>
  )
}
