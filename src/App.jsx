import { useEffect, useLayoutEffect, useRef, useState } from 'react'
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

const ROUTES = {
  '/applyer': CaseApplyer,
  '/spisnem': CaseSpisnem,
  '/spectre': CaseSpectre,
  '/work': Work,
  '/experience': Experience,
  '/lab': Lab,
  '/about': About,
}

const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' }

const FOOTER_LINKS = [
  { label: 'Email', href: `mailto:${SOCIALS.email}` },
  { label: 'LinkedIn', href: SOCIALS.linkedin, external: true },
  { label: 'GitHub', href: SOCIALS.github, external: true },
  { label: 'CV', href: SOCIALS.cv, external: true },
]

// Moves the indicator under the current link. Only page changes slide; the first placement is instant.
function placeIndicator(nav, indicator) {
  const link = nav.querySelector('[aria-current="page"]')
  indicator.style.opacity = link ? '1' : '0'
  if (!link) return
  const first = !indicator.dataset.placed
  if (first) indicator.style.transition = 'none'
  indicator.style.width = `${link.offsetWidth}px`
  indicator.style.transform = `translateX(${link.offsetLeft}px)`
  if (first) {
    void indicator.offsetWidth
    indicator.style.transition = ''
    indicator.dataset.placed = 'true'
  }
}

// Re-measured when the web font arrives and when the nav resizes, since both move the links.
function useNavIndicator(path) {
  const navRef = useRef(null)
  const indicatorRef = useRef(null)
  useLayoutEffect(() => {
    const nav = navRef.current
    const indicator = indicatorRef.current
    if (!nav || !indicator) return
    const place = () => placeIndicator(nav, indicator)
    place()
    document.fonts?.ready.then(place)
    const observer = new ResizeObserver(place)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [path])
  return { navRef, indicatorRef }
}

// The menu remembers the page it was opened on, so any navigation (including Back) closes it.
function useMobileMenu(path) {
  const [openOn, setOpenOn] = useState(null)
  const buttonRef = useRef(null)
  const open = openOn === path
  const close = () => setOpenOn(null)
  const toggle = () => setOpenOn(open ? null : path)

  useEffect(() => {
    if (!open) return
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      setOpenOn(null)
      buttonRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return { open, close, toggle, buttonRef }
}

function DesktopNav({ isActive, path }) {
  const { navRef, indicatorRef } = useNavIndicator(path)
  return (
    <nav className="relative hidden h-full items-center gap-1 lg:flex" aria-label="Main" ref={navRef}>
      <span
        ref={indicatorRef}
        aria-hidden="true"
        className="cut absolute bottom-0 left-0 h-1.5 bg-fuji opacity-0 transition-[transform,width] duration-300 ease-cut"
      />
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          aria-current={isActive(item.to) ? 'page' : undefined}
          className={`px-3 py-2 text-small font-medium transition-colors ${isActive(item.to) ? 'text-ai' : 'text-ai-muted hover:text-ai'}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

function MenuButton({ open, onClick, buttonRef }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className="-mr-2 flex min-h-11 items-center gap-3 px-2 font-semibold lg:hidden"
      aria-expanded={open}
      aria-controls="mobile-menu"
      onClick={onClick}
    >
      {open ? 'Close' : 'Menu'}
      <span className="relative block h-3 w-6" aria-hidden="true">
        <span className={`absolute left-0 h-0.5 w-6 bg-ai transition-transform duration-200 ${open ? 'top-1.25 rotate-45' : 'top-0'}`} />
        <span className={`absolute left-0 h-0.5 bg-ai transition-all duration-200 ${open ? 'top-1.25 w-6 -rotate-45' : 'top-2.5 w-4'}`} />
      </span>
    </button>
  )
}

function MobileMenu({ open, isActive, onNavigate }) {
  return (
    <div
      id="mobile-menu"
      hidden={!open}
      className="surface-dark absolute inset-x-0 top-full max-h-[calc(100dvh-var(--spacing-header))] overflow-y-auto border-t border-fuji/40 lg:hidden"
    >
      <nav className="wrap flex flex-col py-6" aria-label="Main">
        {NAV.map((item, i) => (
          <Link
            key={item.to}
            to={item.to}
            aria-current={isActive(item.to) ? 'page' : undefined}
            onClick={onNavigate}
            className="flex min-h-14 items-center gap-4 border-b border-gofun/15 text-h3 font-medium motion-safe:animate-menu-in"
            style={{ animationDelay: `${i * 35}ms` }}
          >
            <span className={`cut w-10 py-0.5 text-center text-meta font-semibold tabular-nums ${isActive(item.to) ? 'bg-fuji text-ai' : 'text-gofun/75'}`}>
              {String(i + 1).padStart(2, '0')}
            </span>
            {item.label}
          </Link>
        ))}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link className="btn btn-primary" to="/#contact" onClick={onNavigate}>
            Say hello <Arrow />
          </Link>
          <a className="link" href={SOCIALS.cv} {...EXTERNAL}>
            Download CV <Arrow dir="down" />
          </a>
        </div>
      </nav>
    </div>
  )
}

function Header() {
  const { path } = useRouter()
  const menu = useMobileMenu(path)
  const isActive = (to) => path === to

  return (
    <header className="sticky top-0 z-40 border-b border-ai/15 bg-gofun">
      <div className="wrap flex h-header items-center justify-between gap-6">
        <Link to="/" className="group flex items-center gap-3 font-semibold tracking-tight" aria-label="Lachezar Dimchov, home">
          <span className="cut bg-ai px-2.5 py-1 text-sm text-gofun transition-colors group-hover:bg-fuji group-hover:text-ai" aria-hidden="true">
            LD
          </span>
          <span className="hidden whitespace-nowrap xs:inline">Lachezar Dimchov</span>
        </Link>
        <DesktopNav isActive={isActive} path={path} />
        <div className="hidden items-center gap-5 lg:flex">
          <a className="link text-small" href={SOCIALS.cv} {...EXTERNAL}>
            CV <Arrow dir="down" />
          </a>
          <Link className="btn btn-primary min-h-10 px-4 py-2" to="/#contact">
            Say hello <Arrow />
          </Link>
        </div>
        <MenuButton open={menu.open} onClick={menu.toggle} buttonRef={menu.buttonRef} />
      </div>
      <MobileMenu open={menu.open} isActive={isActive} onNavigate={menu.close} />
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
          {FOOTER_LINKS.map(({ label, href, external }) => (
            <li key={label}>
              <a className="link" href={href} {...(external ? EXTERNAL : {})}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="wrap border-t border-gofun/15 py-5 text-meta text-gofun/75">L. Dimchov · Esbjerg · 2026</div>
    </footer>
  )
}

function Routes() {
  const { path } = useRouter()
  const Page = ROUTES[path] ?? Home

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
      <div id="main">
        <Page />
      </div>
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
