import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, RouterProvider, useRouter } from './router'
import { NAV, SOCIALS } from './data'
import Home from './pages/Home'
import About from './pages/About'
import Experience from './pages/Experience'
import Work from './pages/Work'
import Lab from './pages/Lab'
import CaseApplyer from './pages/CaseApplyer'
import CaseSpisnem from './pages/CaseSpisnem'
import CaseSpectre from './pages/CaseSpectre'
import { Arrow } from './components/ui'

function NavLinks({ isActive, className }) {
  return NAV.map((s) => (
    <Link
      key={s.to}
      to={s.to}
      className={className(isActive(s.to))}
      aria-current={isActive(s.to) ? 'page' : undefined}
    >
      {s.label}
    </Link>
  ))
}

function Header() {
  const { path } = useRouter()
  // The menu remembers the page it was opened on, so any navigation (including Back) closes it.
  const [openOn, setOpenOn] = useState(null)
  const open = openOn === path
  const close = () => setOpenOn(null)
  const navRef = useRef(null)
  const indRef = useRef(null)
  const buttonRef = useRef(null)
  const isActive = (to) => (to === '/' ? path === '/' : path === to)

  // One cut slides under the current page.
  // Re-measured when the web font arrives and when the nav resizes, since both move the links.
  useLayoutEffect(() => {
    const nav = navRef.current
    const ind = indRef.current
    if (!nav || !ind) return
    const place = () => {
      const link = nav.querySelector('[aria-current="page"]')
      ind.style.opacity = link ? '1' : '0'
      if (!link) return
      // Only slide between pages; the first placement is instant.
      const first = !ind.dataset.placed
      if (first) ind.style.transition = 'none'
      ind.style.width = `${link.offsetWidth}px`
      ind.style.transform = `translateX(${link.offsetLeft}px)`
      if (first) {
        void ind.offsetWidth
        ind.style.transition = ''
        ind.dataset.placed = '1'
      }
    }
    place()
    document.fonts?.ready.then(place)
    const ro = new ResizeObserver(place)
    ro.observe(nav)
    return () => ro.disconnect()
  }, [path])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      close()
      buttonRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-ai/15 bg-gofun">
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Link to="/" className="group flex items-center gap-3 font-semibold tracking-tight" aria-label="Lachezar Dimchov, home">
          <span className="cut bg-ai px-2.5 py-1 text-sm text-gofun transition-colors group-hover:bg-fuji group-hover:text-ai" aria-hidden="true">
            LD
          </span>
          <span>Lachezar Dimchov</span>
        </Link>

        <nav className="relative hidden h-full items-center gap-1 lg:flex" aria-label="Main" ref={navRef}>
          <span
            ref={indRef}
            aria-hidden="true"
            className="cut absolute bottom-0 left-0 h-1.5 bg-fuji opacity-0 transition-[transform,width] duration-300 ease-cut"
          />
          <NavLinks
            isActive={isActive}
            className={(on) =>
              `px-3 py-2 text-[0.9375rem] font-medium transition-colors ${on ? 'text-ai' : 'text-ai-muted hover:text-ai'}`
            }
          />
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a className="link text-[0.9375rem]" href={SOCIALS.cv} target="_blank" rel="noopener noreferrer">
            CV <Arrow dir="down" />
          </a>
          <Link className="btn btn-primary min-h-10 px-4 py-2" to="/#contact">
            Say hello <Arrow />
          </Link>
        </div>

        <button
          ref={buttonRef}
          type="button"
          className="-mr-2 flex min-h-11 items-center gap-3 px-2 font-semibold lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpenOn(open ? null : path)}
        >
          {open ? 'Close' : 'Menu'}
          <span className="relative block h-3 w-6" aria-hidden="true">
            <span className={`absolute left-0 h-0.5 w-6 bg-ai transition-transform duration-200 ${open ? 'top-[5px] rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 h-0.5 bg-ai transition-all duration-200 ${open ? 'top-[5px] w-6 -rotate-45' : 'top-2.5 w-4'}`} />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="surface-dark absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-fuji/40 lg:hidden"
      >
        <nav className="wrap flex flex-col py-6" aria-label="Main">
          {NAV.map((s, i) => (
            <Link
              key={s.to}
              to={s.to}
              aria-current={isActive(s.to) ? 'page' : undefined}
              onClick={close}
              className="group flex min-h-14 items-center gap-4 border-b border-gofun/15 text-h3 font-medium motion-safe:animate-[menu-in_240ms_var(--ease-cut)_both]"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <span className={`cut w-10 py-0.5 text-center text-meta font-semibold tabular-nums ${isActive(s.to) ? 'bg-fuji text-ai' : 'text-gofun/75'}`}>
                0{i + 1}
              </span>
              {s.label}
            </Link>
          ))}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link className="btn btn-primary" to="/#contact" onClick={close}>
              Say hello <Arrow />
            </Link>
            <a className="link" href={SOCIALS.cv} target="_blank" rel="noopener noreferrer">
              Download CV <Arrow dir="down" />
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="surface-dark mt-section">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1fr_auto] md:items-end md:py-20">
        <div>
          <p className="text-h2 font-semibold">Lachezar Dimchov</p>
          <p className="mt-3 text-gofun/75">Software engineer in Esbjerg. Thanks for reading.</p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          <li>
            <a className="link" href={`mailto:${SOCIALS.email}`}>
              Email
            </a>
          </li>
          <li>
            <a className="link" href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a className="link" href={SOCIALS.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a className="link" href={SOCIALS.cv} target="_blank" rel="noopener noreferrer">
              CV
            </a>
          </li>
        </ul>
      </div>
      <div className="wrap border-t border-gofun/15 py-5 text-meta text-gofun/75">L. Dimchov · Esbjerg · 2026</div>
    </footer>
  )
}

function Routes() {
  const { path } = useRouter()
  const view = useMemo(() => {
    if (path === '/applyer') return <CaseApplyer />
    if (path === '/spisnem') return <CaseSpisnem />
    if (path === '/spectre') return <CaseSpectre />
    if (path === '/work') return <Work />
    if (path === '/experience') return <Experience />
    if (path === '/lab') return <Lab />
    if (path === '/about') return <About />
    return <Home />
  }, [path])

  // Land on a section when the page is opened with a hash.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }))
  }, [])

  return (
    <>
      <a className="sr-only z-50 bg-ai px-4 py-3 text-gofun focus:not-sr-only focus:fixed focus:top-2 focus:left-2" href="#main">
        Skip to content
      </a>
      <Header />
      <div id="main">{view}</div>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <RouterProvider>
      <Routes />
    </RouterProvider>
  )
}
