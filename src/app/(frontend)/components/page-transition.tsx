'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    // On route change, fade in new content
    setIsVisible(false)
    const timeout = setTimeout(() => {
      setDisplayChildren(children)
      setIsVisible(true)
    }, 150)
    return () => clearTimeout(timeout)
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.15s ease-in-out',
      }}
    >
      {displayChildren}
    </div>
  )
}
