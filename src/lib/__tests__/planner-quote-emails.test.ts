import { describe, it, expect } from 'vitest'
import { buildPlannerAdminNotificationEmail } from '../email/planner-quote-notification'
import { buildPlannerBuyerConfirmationEmail } from '../email/planner-quote-confirmation'

describe('buildPlannerAdminNotificationEmail', () => {
  it('includes BOM table in HTML', () => {
    const result = buildPlannerAdminNotificationEmail({
      referenceNumber: 'KBH-12345678',
      contactName: 'John',
      contactEmail: 'john@test.com',
      company: 'Test Corp',
      deliveryState: 'NSW',
      layoutData: [{ productId: 1, productTitle: 'KBH-3B2B', quantity: 2, dimensions: '12.0m x 3.5m', floorArea: 42 }],
      totalFloorArea: 84,
      estimatedPrice: 240000,
    })
    expect(result.subject).toContain('KBH-12345678')
    expect(result.subject).toContain('Site Planner')
    expect(result.html).toContain('KBH-3B2B')
    expect(result.html).toContain('84')
  })
})

describe('buildPlannerBuyerConfirmationEmail', () => {
  it('includes reference number and module count', () => {
    const result = buildPlannerBuyerConfirmationEmail({
      contactName: 'John',
      referenceNumber: 'KBH-12345678',
      totalModules: 3,
      totalFloorArea: 105,
    })
    expect(result.subject).toContain('KBH-12345678')
    expect(result.html).toContain('John')
    expect(result.html).toContain('3')
  })
})
