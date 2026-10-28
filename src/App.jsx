import { useEffect, useMemo } from 'react'
import { RouterProvider, useRouter } from './router'
import { Page, SiteFooter, TopBar } from './components/Shell'
import { useEntrance } from './hooks'
import Home from './pages/Home'
import Work from './pages/Work'
import About from './pages/About'
import Cv from './pages/Cv'
import Lab from './pages/Lab'
import CaseApplyer from './pages/CaseApplyer'
import CaseSpisnem from './pages/CaseSpisnem'
import CaseMinWin from './pages/CaseMinWin'

const ROUTES = {
  '/': Home,
  '/work': Work,
  '/about': About,
  '/cv': Cv,
  '/experience': Cv,
  '/lab': Lab,
  '/applyer': CaseApplyer,
  '/spisnem': CaseSpisnem,
  '/minwin': CaseMinWin,
}

const TITLES = {
  '/': 'Lachezar Dimchov, full-stack developer',
  '/work': 'Work / Lachezar Dimchov',
  '/about': 'About / Lachezar Dimchov',
  '/cv': 'CV / Lachezar Dimchov',
  '/experience': 'CV / Lachezar Dimchov',
  '/lab': 'Lab / Lachezar Dimchov',
  '/applyer': 'Applyer / Lachezar Dimchov',
  '/spisnem': 'Spisnem / Lachezar Dimchov',
  '/minwin': 'MinWin / Lachezar Dimchov',
}

function Routes() {
  const { path } = useRouter()
  const View = useMemo(() => ROUTES[path] || Home, [path])
  useEntrance(path)

  useEffect(() => {
    document.title = TITLES[path] || TITLES['/']
    const hash = window.location.hash.slice(1)
    if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: 'start' }))
  }, [path])

  const bare = path === '/'

  return (
    <Page>
      <View />
      {bare ? null : <SiteFooter />}
    </Page>
  )
}

function Chrome() {
  const { path } = useRouter()
  return path === '/' ? null : <TopBar />
}

export default function App() {
  return (
    <RouterProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:top-3 focus:left-3 focus:btn">
        Skip to content
      </a>
      <Chrome />
      <Routes />
    </RouterProvider>
  )
}
