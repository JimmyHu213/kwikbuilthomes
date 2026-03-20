export function formatPrice(from?: number | null, label?: string | null): string {
  if (label) return label
  if (from) return `from $${from.toLocaleString()} + GST`
  return 'Contact for pricing'
}
