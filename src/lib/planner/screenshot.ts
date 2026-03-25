/**
 * Capture a screenshot from the R3F canvas as a JPEG blob.
 * Capped at 1200x800 to stay within sessionStorage limits.
 *
 * IMPORTANT: The R3F Canvas (inside the Viewer) must have
 * preserveDrawingBuffer: true for toDataURL to work.
 */
export async function captureCanvasScreenshot(): Promise<string | null> {
  const canvas = document.querySelector('canvas')
  if (!canvas) return null

  try {
    const maxWidth = 1200
    const maxHeight = 800
    let { width, height } = canvas

    if (width > maxWidth || height > maxHeight) {
      const scale = Math.min(maxWidth / width, maxHeight / height)
      width = Math.round(width * scale)
      height = Math.round(height * scale)
    }

    const offscreen = document.createElement('canvas')
    offscreen.width = width
    offscreen.height = height
    const ctx = offscreen.getContext('2d')
    if (!ctx) return null

    ctx.drawImage(canvas, 0, 0, width, height)
    return offscreen.toDataURL('image/jpeg', 0.85)
  } catch {
    return null
  }
}
