import { escapeHtml } from './utils'

export function buildPlannerBuyerConfirmationEmail(data: {
  contactName: string
  referenceNumber: string
  totalModules: number
  totalFloorArea: number
}): { subject: string; html: string } {
  return {
    subject: `Quote Request Received: ${data.referenceNumber} - Kwik Built Homes`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">Thank You, ${escapeHtml(data.contactName)}!</h1>
        <p style="color: #333; font-size: 16px;">We&rsquo;ve received your Site Planner quote request with reference <strong>${escapeHtml(data.referenceNumber)}</strong>.</p>
        <p style="color: #333; font-size: 16px;">Your layout includes <strong>${data.totalModules} module${data.totalModules !== 1 ? 's' : ''}</strong> with a total floor area of <strong>${data.totalFloorArea} m&sup2;</strong>.</p>
        <p style="color: #333; font-size: 16px;">Our team will review your layout and respond within 2 business days.</p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
        <p style="color: #666; font-size: 14px;">Kwik Built Homes</p>
      </div>
    `,
  }
}
