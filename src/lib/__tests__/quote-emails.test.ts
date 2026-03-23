import { describe, it, expect } from 'vitest'
import { buildBuyerConfirmationEmail } from '@/lib/email/quote-confirmation'
import { buildAdminNotificationEmail } from '@/lib/email/quote-notification'

describe('buildBuyerConfirmationEmail', () => {
  const data = {
    contactName: 'John Smith',
    referenceNumber: 'KBH-00042',
    productTitle: 'KwikBuilt Studio 35',
    quantity: 2,
  }

  it('returns subject containing reference number', () => {
    const result = buildBuyerConfirmationEmail(data)
    expect(result.subject).toContain('KBH-00042')
  })

  it('HTML contains contact name, product title, and reference number', () => {
    const result = buildBuyerConfirmationEmail(data)
    expect(result.html).toContain('John Smith')
    expect(result.html).toContain('KwikBuilt Studio 35')
    expect(result.html).toContain('KBH-00042')
  })

  it('HTML contains quantity', () => {
    const result = buildBuyerConfirmationEmail(data)
    expect(result.html).toContain('2')
  })
})

describe('buildAdminNotificationEmail', () => {
  const data = {
    referenceNumber: 'KBH-00042',
    contactName: 'John Smith',
    contactEmail: 'john@example.com',
    contactPhone: '0412345678',
    company: 'Smith Homes',
    productTitle: 'KwikBuilt Studio 35',
    quantity: 3,
    deliveryState: 'NSW',
    projectTimeline: 'short' as const,
    selectedOptions: { cladding: ['timber'], extras: ['deck', 'carport'] },
  }

  it('returns subject containing reference number and product title', () => {
    const result = buildAdminNotificationEmail(data)
    expect(result.subject).toContain('KBH-00042')
    expect(result.subject).toContain('KwikBuilt Studio 35')
  })

  it('HTML contains all contact details', () => {
    const result = buildAdminNotificationEmail(data)
    expect(result.html).toContain('John Smith')
    expect(result.html).toContain('john@example.com')
    expect(result.html).toContain('0412345678')
    expect(result.html).toContain('Smith Homes')
  })

  it('HTML contains project details', () => {
    const result = buildAdminNotificationEmail(data)
    expect(result.html).toContain('3')
    expect(result.html).toContain('NSW')
    expect(result.html).toContain('short')
  })

  it('HTML contains selected options summary when provided', () => {
    const result = buildAdminNotificationEmail(data)
    expect(result.html).toContain('cladding')
    expect(result.html).toContain('timber')
    expect(result.html).toContain('extras')
    expect(result.html).toContain('deck')
    expect(result.html).toContain('carport')
  })
})
