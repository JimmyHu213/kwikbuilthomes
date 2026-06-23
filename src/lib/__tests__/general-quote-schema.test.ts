import { describe, it, expect } from 'vitest'
import { generalQuoteFormSchema } from '@/lib/schemas/general-quote-schema'

describe('generalQuoteFormSchema', () => {
  const validSubmission = {
    contactName: 'Jane Builder',
    contactEmail: 'jane@example.com',
    contactPhone: '0412345678',
    company: 'Builder Co',
    interestCategory: 'modular-homes',
    quantity: '1',
    deliveryState: 'QLD',
    deliveryLocation: 'Brisbane',
    projectTimeline: 'short',
    isEstateInquiry: 'false',
    additionalNotes: 'Test note',
  }

  it('accepts a valid submission', () => {
    expect(generalQuoteFormSchema.safeParse(validSubmission).success).toBe(true)
  })

  it('requires a valid email', () => {
    const bad = { ...validSubmission, contactEmail: 'not-an-email' }
    expect(generalQuoteFormSchema.safeParse(bad).success).toBe(false)
  })

  it('accepts null for absent optional fields (FormData.get returns null)', () => {
    // siteAddress/modelMix inputs only render when the estate section is open.
    // When collapsed, the action's formData.get() yields null -- not undefined --
    // so the schema must accept null for these optional fields.
    const nonEstateSubmission = {
      ...validSubmission,
      isEstateInquiry: null,
      siteAddress: null,
      modelMix: null,
    }
    expect(generalQuoteFormSchema.safeParse(nonEstateSubmission).success).toBe(true)
  })
})
