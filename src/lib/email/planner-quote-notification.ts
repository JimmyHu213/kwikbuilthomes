import { escapeHtml } from './utils'

type PlannerNotificationData = {
  referenceNumber: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  company?: string
  deliveryState: string
  projectTimeline?: string
  layoutData: Array<{
    productId: number
    productTitle: string
    quantity: number
    dimensions: string
    floorArea: number | null
  }>
  totalFloorArea: number
  estimatedPrice: number | null
}

export function buildPlannerAdminNotificationEmail(data: PlannerNotificationData): {
  subject: string
  html: string
} {
  const bomRows = data.layoutData
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #e5e5e5; color: #333;">${escapeHtml(item.productTitle)}</td>
        <td style="padding: 8px; border: 1px solid #e5e5e5; color: #333; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #e5e5e5; color: #333;">${escapeHtml(item.dimensions)}</td>
        <td style="padding: 8px; border: 1px solid #e5e5e5; color: #333; text-align: right;">${item.floorArea != null ? `${item.floorArea * item.quantity} m\u00B2` : 'N/A'}</td>
      </tr>`,
    )
    .join('')

  const safeRef = data.referenceNumber.replace(/[\r\n]+/g, ' ').trim()

  return {
    subject: `Site Planner Quote: ${safeRef} (${data.layoutData.length} product types)`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">Site Planner Quote Request</h1>
        <p style="color: #333; font-size: 16px;">Reference <strong>${escapeHtml(data.referenceNumber)}</strong> — submitted from Site Planner.</p>
        <h3 style="color: #1a1a1a; font-size: 16px; margin-top: 24px;">Contact Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr><td style="padding: 8px; border: 1px solid #e5e5e5; font-weight: bold; color: #333;">Name</td><td style="padding: 8px; border: 1px solid #e5e5e5; color: #333;">${escapeHtml(data.contactName)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #e5e5e5; font-weight: bold; color: #333;">Email</td><td style="padding: 8px; border: 1px solid #e5e5e5; color: #333;">${escapeHtml(data.contactEmail)}</td></tr>
          ${data.contactPhone ? `<tr><td style="padding: 8px; border: 1px solid #e5e5e5; font-weight: bold; color: #333;">Phone</td><td style="padding: 8px; border: 1px solid #e5e5e5; color: #333;">${escapeHtml(data.contactPhone)}</td></tr>` : ''}
          ${data.company ? `<tr><td style="padding: 8px; border: 1px solid #e5e5e5; font-weight: bold; color: #333;">Company</td><td style="padding: 8px; border: 1px solid #e5e5e5; color: #333;">${escapeHtml(data.company)}</td></tr>` : ''}
          <tr><td style="padding: 8px; border: 1px solid #e5e5e5; font-weight: bold; color: #333;">Delivery State</td><td style="padding: 8px; border: 1px solid #e5e5e5; color: #333;">${escapeHtml(data.deliveryState)}</td></tr>
        </table>
        <h3 style="color: #1a1a1a; font-size: 16px; margin-top: 24px;">Layout — Bill of Materials</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <thead><tr style="background: #f5f5f5;"><th style="padding: 8px; border: 1px solid #e5e5e5; text-align: left; color: #333;">Product</th><th style="padding: 8px; border: 1px solid #e5e5e5; text-align: center; color: #333;">Qty</th><th style="padding: 8px; border: 1px solid #e5e5e5; text-align: left; color: #333;">Dimensions</th><th style="padding: 8px; border: 1px solid #e5e5e5; text-align: right; color: #333;">Area</th></tr></thead>
          <tbody>${bomRows}<tr style="background: #f5f5f5; font-weight: bold;"><td style="padding: 8px; border: 1px solid #e5e5e5; color: #333;" colspan="3">Total</td><td style="padding: 8px; border: 1px solid #e5e5e5; color: #333; text-align: right;">${data.totalFloorArea} m\u00B2</td></tr></tbody>
        </table>
        ${data.estimatedPrice != null ? `<p style="color: #333; font-size: 16px;">Estimated from: <strong>$${data.estimatedPrice.toLocaleString()} + GST</strong></p>` : ''}
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
        <p style="color: #666; font-size: 14px;">Kwik Built Homes - Site Planner Quote</p>
      </div>
    `,
  }
}
