import { z } from 'zod'

export const australianStates = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'] as const
export const timelineOptions = ['immediate', 'short', 'medium', 'long', 'exploring'] as const

export const plannerQuoteFormSchema = z.object({
  layoutData: z.string().transform((val) => {
    try {
      return JSON.parse(val) as Array<{
        productId: number
        productTitle: string
        quantity: number
        dimensions: string
        floorArea: number | null
      }>
    } catch {
      return []
    }
  }),
  totalFloorArea: z.coerce.number(),
  estimatedPrice: z.coerce.number().optional(),
  contactName: z.string().min(1, 'Name is required').max(200),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z.string().optional(),
  company: z.string().optional(),
  deliveryState: z.enum(australianStates, {
    errorMap: () => ({ message: 'Please select a delivery state' }),
  }),
  deliveryLocation: z.string().optional(),
  projectTimeline: z.enum(timelineOptions).optional(),
  additionalNotes: z.string().optional(),
})

export type PlannerQuoteFormData = z.infer<typeof plannerQuoteFormSchema>
