import { z } from 'zod'

export const contactFormSchema = z.object({
  contactName: z.string().min(1, 'Name is required').max(200),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z.string().optional(),
  message: z.string().min(1, 'Message is required').max(5000),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
