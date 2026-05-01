'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'

type AnimateOnScrollProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimateOnScroll({ children, className = '', delay = 0 }: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const shouldHide = mounted && !isVisible

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shouldHide ? 0 : 1,
        transform: shouldHide ? 'translateY(24px)' : 'translateY(0)',
        transition: mounted ? `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms` : 'none',
      }}
    >
      {children}
    </div>
  )
}
