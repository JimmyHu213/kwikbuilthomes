import { z } from 'zod'

export const australianStates = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'] as const

export const timelineOptions = ['immediate', 'short', 'medium', 'long', 'exploring'] as const

/**
 * Parse opt_ prefixed URL search params into a Record of string arrays.
 *
 * Reverses the serialization format from buildQuoteUrl in configuration.ts:
 *   { opt_cladding: 'timber', opt_extras: 'deck,carport' }
 *   => { cladding: ['timber'], extras: ['deck', 'carport'] }
 */
export function parseQuoteParams(
  searchParams: Record<string, string | string[] | undefined>,
): Record<string, string[]> {
  const selections: Record<string, string[]> = {}

  for (const [key, value] of Object.entries(searchParams)) {
    if (!key.startsWith('opt_')) continue
    if (value === undefined) continue

    const categoryId = key.slice(4)
    // Next.js delivers repeated query params (?opt_x=a&opt_x=b) as a string[],
    // single params as a string. Normalize both to a comma-split list.
    selections[categoryId] = Array.isArray(value)
      ? value.flatMap((v) => v.split(','))
      : value.split(',')
  }

  return selections
}

export const quoteFormSchema = z.object({
  // Product context (from hidden fields / URL params)
  productId: z.coerce.number(),
  productSlug: z.string().min(1),
  productTitle: z.string().min(1),
  selectedOptions: z.string().transform((val) => {
    try {
      return JSON.parse(val)
    } catch {
      return {}
    }
  }),

  // Contact info
  contactName: z.string().min(1, 'Name is required').max(200),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z.string().optional(),
  company: z.string().optional(),

  // Project details
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  deliveryState: z.enum(australianStates, {
    error: 'Please select a delivery state',
  }),
  deliveryLocation: z.string().optional(),
  projectTimeline: z.enum(timelineOptions).optional(),
  siteConditions: z.string().optional(),

  // Estate inquiry
  // siteAddress/modelMix inputs only render when the estate section is open, so
  // the action's formData.get() yields null (not undefined) when collapsed.
  // Use nullish() so that null passes validation as "not provided".
  isEstateInquiry: z.coerce.boolean().default(false),
  numberOfUnits: z.coerce.number().int().min(2).optional(),
  siteAddress: z.string().nullish(),
  modelMix: z.string().nullish(),

  // Notes
  additionalNotes: z.string().optional(),
})

export type QuoteFormData = z.infer<typeof quoteFormSchema>
