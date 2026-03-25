import { describe, it, expect } from 'vitest'
import { plannerQuoteFormSchema } from '../schemas/planner-quote-schema'

describe('plannerQuoteFormSchema', () => {
  const validData = {
    layoutData: JSON.stringify([{ productId: 1, productTitle: 'KBH-3B2B', quantity: 2, dimensions: '12.0m x 3.5m', floorArea: 42 }]),
    totalFloorArea: '84',
    estimatedPrice: '240000',
    contactName: 'John Doe',
    contactEmail: 'john@example.com',
    contactPhone: '0400000000',
    company: 'Test Corp',
    deliveryState: 'NSW',
    deliveryLocation: 'Sydney',
    projectTimeline: 'short',
    additionalNotes: 'Test note',
  }

  it('accepts valid planner quote data', () => {
    const result = plannerQuoteFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('requires contactName', () => {
    const result = plannerQuoteFormSchema.safeParse({ ...validData, contactName: '' })
    expect(result.success).toBe(false)
  })

  it('requires valid email', () => {
    const result = plannerQuoteFormSchema.safeParse({ ...validData, contactEmail: 'invalid' })
    expect(result.success).toBe(false)
  })

  it('requires deliveryState', () => {
    const result = plannerQuoteFormSchema.safeParse({ ...validData, deliveryState: '' })
    expect(result.success).toBe(false)
  })

  it('parses layoutData as JSON', () => {
    const result = plannerQuoteFormSchema.safeParse(validData)
    if (result.success) {
      expect(Array.isArray(result.data.layoutData)).toBe(true)
    }
  })
})
