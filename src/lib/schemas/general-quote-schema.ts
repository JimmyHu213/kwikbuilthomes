import { z } from 'zod'

export const australianStates = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'] as const

export const timelineOptions = ['immediate', 'short', 'medium', 'long', 'exploring'] as const

export const interestCategories = [
  'modular-homes',
  'kit-homes',
  'container-homes',
  'tiny-homes',
  'sheds',
  'other',
] as const

export const interestCategoryLabels: Record<string, string> = {
  'modular-homes': 'Modular Homes',
  'kit-homes': 'Kit Homes',
  'container-homes': 'Container Homes',
  'tiny-homes': 'Tiny Homes',
  'sheds': 'Sheds',
  'other': 'Other',
}

export const generalQuoteFormSchema = z.object({
  contactName: z.string().min(1, 'Name is required').max(200),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z.string().optional(),
  company: z.string().optional(),
  interestCategory: z.enum(interestCategories, {
    error: 'Please select a category',
  }),
  quantity: z.coerce.number().int().min(1).optional(),
  deliveryState: z.enum(australianStates, {
    error: 'Please select a delivery state',
  }),
  deliveryLocation: z.string().optional(),
  projectTimeline: z.enum(timelineOptions).optional(),
  isEstateInquiry: z.coerce.boolean().default(false),
  numberOfUnits: z.coerce.number().int().min(2).optional(),
  siteAddress: z.string().optional(),
  modelMix: z.string().optional(),
  additionalNotes: z.string().optional(),
})

export type GeneralQuoteFormData = z.infer<typeof generalQuoteFormSchema>
