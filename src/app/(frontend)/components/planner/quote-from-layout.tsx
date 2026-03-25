'use client'

export function QuoteFromLayout() {
  return (
    <button
      type="button"
      disabled
      className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
    >
      Request Quote
    </button>
  )
}
