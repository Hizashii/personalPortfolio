/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const RouterContext = createContext({ path: '/', navigate: () => {} })

export const useRouter = () => useContext(RouterContext)

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Scrolls to the hash once the new page has painted, and records it in the URL.
function scrollToHash(target, hash) {
  requestAnimationFrame(() => {
    if (!hash) return
    document.getElementById(hash)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' })
    if (target === window.location.pathname && !window.location.hash.endsWith(hash)) {
      window.history.replaceState({}, '', `${target}#${hash}`)
    }
  })
}

function go(to, setPath) {
  const [pathname, hash] = to.split('#')
  const target = pathname || window.location.pathname
  const changes = target !== window.location.pathname
  const apply = () => {
    if (!changes) return
    window.history.pushState({}, '', target + (hash ? `#${hash}` : ''))
    setPath(target)
    window.scrollTo(0, 0)
  }
  if (changes && document.startViewTransition && !reduced()) document.startViewTransition(apply)
  else apply()
  scrollToHash(target, hash)
}

export function RouterProvider({ children }) {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to) => go(to, setPath), [])

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>
}

export function Link({ to, children, className, onClick, ...rest }) {
  const { navigate } = useRouter()
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        onClick?.(e)
        navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
