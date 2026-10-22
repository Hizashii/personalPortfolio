import { useEffect, useMemo } from 'react'
import { RouterProvider, useRouter } from './router'
import Home from './pages/Home'
import About from './pages/About'
import Experience from './pages/Experience'
import Work from './pages/Work'
import Lab from './pages/Lab'
import CaseApplyer from './pages/CaseApplyer'
import CaseSpisnem from './pages/CaseSpisnem'
import CaseMinWin from './pages/CaseMinWin'
import { CursorLabel, SiteFrame } from './components/Shell'

const ROUTES = {
  '/': Home,
  '/about': About,
  '/experience': Experience,
  '/work': Work,
  '/lab': Lab,
  '/applyer': CaseApplyer,
  '/spisnem': CaseSpisnem,
  '/minwin': CaseMinWin,
}

function Routes() {
  const { path } = useRouter()
  const Page = useMemo(() => ROUTES[path] || Home, [path])

  useEffect(() => {
    document.documentElement.toggleAttribute('data-dark', path === '/minwin')
    const hash = window.location.hash.slice(1)
    if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: 'start' }))
  }, [path])

  return <SiteFrame><Page /></SiteFrame>
}

export default function App() {
  return <RouterProvider><CursorLabel /><Routes /></RouterProvider>
}
