'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import 'yet-another-react-lightbox/styles.css'
import type { Media, Product } from '@/payload-types'
import { getMediaUrl, getMediaAlt } from '@/lib/media'

const Lightbox = dynamic(() => import('yet-another-react-lightbox'), {
  ssr: false,
})

export type GallerySlide = {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
  category?: string
}

/**
 * Extract serializable slide data from a Payload Product gallery array.
 * Filters out unpopulated media references (number IDs) and items with no URL.
 */
export function extractGallerySlides(
  gallery: Product['gallery'] | null | undefined,
): GallerySlide[] {
  if (!gallery) return []

  return gallery
    .filter((item): item is typeof item & { image: Media } => {
      if (!item.image || typeof item.image === 'number') return false
      const url = getMediaUrl(item.image)
      return url !== null
    })
    .map((item) => ({
      src: getMediaUrl(item.image)!,
      alt: getMediaAlt(item.image),
      width: (item.image as Media).width ?? 1200,
      height: (item.image as Media).height ?? 800,
      caption: item.caption ?? undefined,
      category: item.category ?? undefined,
    }))
}

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
            className="overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={() => {
              setIndex(i)
              setOpen(true)
            }}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="aspect-[4/3] w-full object-cover transition-transform hover:scale-105"
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
