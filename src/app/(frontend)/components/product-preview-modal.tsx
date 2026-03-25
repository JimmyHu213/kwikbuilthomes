'use client'

import { useState } from 'react'
import { X, Box } from 'lucide-react'

type ProductPreviewModalProps = {
  slug: string
  title: string
}

export function ProductPreviewModal({ slug, title }: ProductPreviewModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        <Box className="h-4 w-4" />
        Preview in 3D
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-4xl h-[70vh] bg-background rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">{title} — 3D Preview</h3>
              <div className="flex items-center gap-2">
                <a href={`/planner?product=${slug}`} className="text-xs text-primary hover:underline">Open in Site Planner</a>
                <button type="button" onClick={() => setOpen(false)} className="rounded-md p-1 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="h-[calc(100%-48px)] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">3D preview coming soon</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
