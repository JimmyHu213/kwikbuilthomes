'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import 'yet-another-react-lightbox/styles.css'
import type { GallerySlide } from '@/lib/gallery'

const Lightbox = dynamic(() => import('yet-another-react-lightbox'), {
  ssr: false,
})

type ImageCarouselProps = {
  slides: GallerySlide[]
}

export function ImageCarousel({ slides }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const thumbsRef = useRef<HTMLDivElement>(null)

  if (slides.length === 0) return null

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, slides.length - 1))
    setActiveIndex(clamped)
  }

  return (
    <div>
      {/* Main image */}
      <div className="relative group">
        <button
          type="button"
          onClick={() => {
            setLightboxOpen(true)
          }}
          className="block w-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <img
            src={slides[activeIndex].src}
            alt={slides[activeIndex].alt}
            className="w-full aspect-[16/9] object-cover transition-opacity duration-300"
          />
        </button>

        {/* Nav arrows */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === slides.length - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-mono px-2 py-1">
          {activeIndex + 1} / {slides.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      {slides.length > 1 && (
        <div
          ref={thumbsRef}
          className="flex gap-1 mt-1 overflow-x-auto scrollbar-none"
        >
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-20 h-14 overflow-hidden border-2 transition-colors ${
                i === activeIndex ? 'border-primary' : 'border-transparent hover:border-border'
              }`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={activeIndex}
        slides={slides.map((s) => ({
          src: s.src,
          alt: s.alt,
          width: s.width,
          height: s.height,
        }))}
      />
    </div>
  )
}
