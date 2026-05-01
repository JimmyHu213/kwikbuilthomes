'use client'

import { useRef, useEffect, useState } from 'react'

type Stat = {
  label: string
  value: number
  suffix?: string
}

type StatCounterProps = {
  stats: Stat[]
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setDisplay(value)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, started])

  useEffect(() => {
    if (!started) return

    const duration = 1500
    const startTime = performance.now()
    let frameId: number

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [started, value])

  return (
    <span ref={ref} className="font-mono text-4xl md:text-5xl font-bold text-foreground tabular-nums">
      {display}{suffix}
    </span>
  )
}

export function StatCounter({ stats }: StatCounterProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center divide-y md:divide-y-0 md:divide-x divide-border">
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col items-center gap-2 px-8 md:px-12 py-6 md:py-0">
          <AnimatedNumber value={stat.value} suffix={stat.suffix ?? ''} />
          <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  )
}
