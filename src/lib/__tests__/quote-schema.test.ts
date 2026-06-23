import { describe, it, expect } from 'vitest'
import { quoteFormSchema, parseQuoteParams } from '@/lib/schemas/quote-schema'

describe('parseQuoteParams', () => {
  it('parses opt_ prefixed params into Record of string arrays', () => {
    const params = {
      opt_cladding: 'timber',
      opt_extras: 'deck,carport',
    }
    const result = parseQuoteParams(params)
    expect(result).toEqual({
      cladding: ['timber'],
      extras: ['deck', 'carport'],
    })
  })

  it('returns empty object when no opt_ params present', () => {
    const result = parseQuoteParams({})
    expect(result).toEqual({})
  })

  it('ignores non-opt_ params', () => {
    const params = {
      utm_source: 'google',
      opt_cladding: 'timber',
      page: '1',
    }
    const result = parseQuoteParams(params)
    expect(result).toEqual({
      cladding: ['timber'],
    })
  })

  it('handles single value (no comma)', () => {
    const params = {
      opt_cladding: 'steel',
    }
    const result = parseQuoteParams(params)
    expect(result).toEqual({
      cladding: ['steel'],
    })
  })

  it('handles repeated query params delivered as a string array', () => {
    // Next.js delivers ?opt_extras=deck&opt_extras=carport as a string[]
    const params: Record<string, string | string[] | undefined> = {
      opt_extras: ['deck', 'carport'],
    }
    const result = parseQuoteParams(params)
    expect(result).toEqual({
      extras: ['deck', 'carport'],
    })
  })

  it('flat-maps comma-joined values inside a repeated string array', () => {
    const params: Record<string, string | string[] | undefined> = {
      opt_extras: ['deck,carport', 'solar'],
    }
    const result = parseQuoteParams(params)
    expect(result).toEqual({
      extras: ['deck', 'carport', 'solar'],
    })
  })

  it('skips undefined param values', () => {
    const params: Record<string, string | string[] | undefined> = {
      opt_cladding: undefined,
      opt_extras: 'deck',
    }
    const result = parseQuoteParams(params)
    expect(result).toEqual({
      extras: ['deck'],
    })
  })
})

describe('quoteFormSchema', () => {
  const validSubmission = {
    productId: 1,
    productSlug: 'kwikbuilt-studio-35',
    productTitle: 'KwikBuilt Studio 35',
    selectedOptions: '{"cladding":["timber"]}',
    contactName: 'John Smith',
    contactEmail: 'john@example.com',
    contactPhone: '0412345678',
    company: 'Smith Homes',
    quantity: 2,
    deliveryState: 'NSW',
    deliveryLocation: 'Sydney',
    projectTimeline: 'short',
    siteConditions: 'Flat block with road access',
    isEstateInquiry: false,
    additionalNotes: 'Need ASAP',
  }

  it('valid complete submission passes validation', () => {
    const result = quoteFormSchema.safeParse(validSubmission)
    expect(result.success).toBe(true)
  })

  it('missing required fields fail validation', () => {
    // Missing contactName
    const noName = { ...validSubmission, contactName: '' }
    expect(quoteFormSchema.safeParse(noName).success).toBe(false)

    // Missing contactEmail
    const noEmail = { ...validSubmission, contactEmail: '' }
    expect(quoteFormSchema.safeParse(noEmail).success).toBe(false)

    // Missing productSlug
    const noSlug = { ...validSubmission, productSlug: '' }
    expect(quoteFormSchema.safeParse(noSlug).success).toBe(false)

    // Missing deliveryState
    const noState = { ...validSubmission, deliveryState: '' }
    expect(quoteFormSchema.safeParse(noState).success).toBe(false)
  })

  it('invalid email format fails validation', () => {
    const badEmail = { ...validSubmission, contactEmail: 'not-an-email' }
    expect(quoteFormSchema.safeParse(badEmail).success).toBe(false)
  })

  it('quantity less than 1 fails validation', () => {
    const zeroQty = { ...validSubmission, quantity: 0 }
    expect(quoteFormSchema.safeParse(zeroQty).success).toBe(false)

    const negativeQty = { ...validSubmission, quantity: -1 }
    expect(quoteFormSchema.safeParse(negativeQty).success).toBe(false)
  })

  it('invalid deliveryState value fails validation', () => {
    const badState = { ...validSubmission, deliveryState: 'XX' }
    expect(quoteFormSchema.safeParse(badState).success).toBe(false)
  })

  it('estate fields are optional when isEstateInquiry is false/absent', () => {
    const noEstate = {
      ...validSubmission,
      isEstateInquiry: false,
    }
    // No numberOfUnits, siteAddress, modelMix -- should still pass
    delete (noEstate as Record<string, unknown>).numberOfUnits
    delete (noEstate as Record<string, unknown>).siteAddress
    delete (noEstate as Record<string, unknown>).modelMix
    const result = quoteFormSchema.safeParse(noEstate)
    expect(result.success).toBe(true)
  })

  it('accepts null for absent optional fields (FormData.get returns null)', () => {
    // The action reads conditionally-rendered inputs via formData.get(), which
    // returns null -- not undefined -- when the input is absent from the DOM
    // (e.g. siteAddress/modelMix when the estate section is collapsed).
    const nonEstateSubmission = {
      ...validSubmission,
      isEstateInquiry: false,
      siteAddress: null,
      modelMix: null,
    }
    const result = quoteFormSchema.safeParse(nonEstateSubmission)
    expect(result.success).toBe(true)
  })

  it('selectedOptions string is parsed as JSON', () => {
    const result = quoteFormSchema.parse(validSubmission)
    expect(result.selectedOptions).toEqual({ cladding: ['timber'] })
  })
})
