'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'

type VideoHeroProps = {
  videoUrl?: string | null
  posterUrl?: string | null
  children: ReactNode
  className?: string
}

export function VideoHero({ videoUrl, posterUrl, children, className = '' }: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  const showVideo = videoUrl && !isMobile

  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Video or poster background */}
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={posterUrl ?? undefined}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : posterUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
      ) : (
        /* Fallback: dark gradient when no media */
        <div className="absolute inset-0 bg-[#2D2D2D]" />
      )}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  )
}
