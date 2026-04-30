'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import 'yet-another-react-lightbox/styles.css'
import type { GallerySlide } from '@/lib/gallery'

const Lightbox = dynamic(() => import('yet-another-react-lightbox'), {
  ssr: false,
})

type PhotoGalleryProps = {
  slides: GallerySlide[]
}

export function PhotoGallery({ slides }: PhotoGalleryProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  if (slides.length === 0) return null

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            className="overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => {
              setIndex(i)
              setOpen(true)
            }}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
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
