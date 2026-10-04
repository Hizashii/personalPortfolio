import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Link, RouterProvider, useRouter } from './router'
import { NAV, SOCIALS } from './data'
import Home from './pages/Home'
import About from './pages/About'
import Experience from './pages/Experience'
import Work from './pages/Work'
import Lab from './pages/Lab'
import CaseApplyer from './pages/CaseApplyer'
import CaseSpisnem from './pages/CaseSpisnem'
import CaseMinWin from './pages/CaseMinWin'
import { Arrow } from './components/ui'

// A small pill that follows the pointer and names what a click will do. Fine pointers only.
function CursorLabel() {
  const ref = useRef(null)
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = ref.current
    if (!fine || calm || !el) return
    const move = (e) => {
      const hit = e.target.closest?.('[data-cursor]')
      if (hit) {
        el.textContent = hit.dataset.cursor
        el.style.transform = `translate3d(${e.clientX + 16}px, ${e.clientY + 16}px, 0)`
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

function IndexBar() {
  const { path } = useRouter()
  const navRef = useRef(null)
  const indRef = useRef(null)
  const isActive = (to) => (to === '/' ? path === '/' : path === to)

  // One indicator that slides under the current page.
  useLayoutEffect(() => {
    const nav = navRef.current
    const ind = indRef.current
    if (!nav || !ind) return
    const link = nav.querySelector('.is-active')
    if (!link) {
      ind.style.opacity = '0'
      return
    }
    ind.style.opacity = '1'
    ind.style.width = `${link.offsetWidth}px`
    ind.style.transform = `translateX(${link.offsetLeft}px)`
  }, [path])

  return (
    <header className="ibar">
      <div className="ibar-inner wrap">
        <Link to="/" className="ibar-brand" aria-label="Lachezar Dimchov, home">
          <span className="ibar-mark" aria-hidden="true">
            LD
          </span>
          <span className="ibar-name">Lachezar Dimchov</span>
        </Link>
        <nav className="ibar-nav" aria-label="Main" ref={navRef}>
          <span className="ibar-ind" ref={indRef} aria-hidden="true" />
          {NAV.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className={`ibar-link ${isActive(s.to) ? 'is-active' : ''}`}
              aria-current={isActive(s.to) ? 'page' : undefined}
            >
              {s.label}
            </Link>
          ))}
        </nav>
        <div className="ibar-actions">
          <a className="ibar-cv" href={SOCIALS.cv} target="_blank" rel="noopener noreferrer">
            CV <Arrow dir="down" />
          </a>
          <Link className="btn btn--solid btn--sm" to="/#contact">
            Say hello <Arrow />
          </Link>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="foot wrap">
      <span className="mono">L. Dimchov · Esbjerg · 2026</span>
      <span>Thanks for reading.</span>
    </footer>
  )
}

function Routes() {
  const { path } = useRouter()
  const view = useMemo(() => {
    if (path === '/applyer') return <CaseApplyer />
    if (path === '/spisnem') return <CaseSpisnem />
    if (path === '/minwin') return <CaseMinWin />
    if (path === '/work') return <Work />
    if (path === '/experience') return <Experience />
    if (path === '/lab') return <Lab />
    if (path === '/about') return <About />
    return <Home />
  }, [path])

  // The homepage has its own warm palette; everything else keeps the current one for now.
  useEffect(() => {
    const el = document.documentElement
    const warm = ['/', '/lab', '/work', '/experience', '/about', '/applyer', '/spisnem', '/minwin']
    if (warm.includes(path)) el.setAttribute('data-home', '')
    else el.removeAttribute('data-home')
    if (path === '/minwin') el.setAttribute('data-dark', '')
    else el.removeAttribute('data-dark')
  }, [path])

  // Land on a section when the page is opened with a hash.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }))
  }, [])

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <IndexBar />
      <div id="main">{view}</div>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <RouterProvider>
      <CursorLabel />
      <Routes />
    </RouterProvider>
  )
}
