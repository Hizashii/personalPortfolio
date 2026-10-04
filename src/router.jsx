/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const RouterContext = createContext({ path: '/', navigate: () => {} })

export const useRouter = () => useContext(RouterContext)

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function RouterProvider({ children }) {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to) => {
    const [pathname, hash] = to.split('#')
    const target = pathname || window.location.pathname
    const apply = () => {
      if (target !== window.location.pathname) {
        window.history.pushState({}, '', target + (hash ? `#${hash}` : ''))
        setPath(target)
        window.scrollTo(0, 0)
      }
    }
    const afterPaint = () => {
      requestAnimationFrame(() => {
        if (hash) {
          document
            .getElementById(hash)
            ?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' })
          if (target === window.location.pathname && !window.location.hash.endsWith(hash)) {
            window.history.replaceState({}, '', `${target}#${hash}`)
          }
        }
      })
    }
    if (target !== window.location.pathname && document.startViewTransition && !reduced()) {
      document.startViewTransition(() => {
        apply()
      })
      afterPaint()
    } else {
      apply()
      afterPaint()
    }
  }, [])

  return (
    <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>
  )
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
