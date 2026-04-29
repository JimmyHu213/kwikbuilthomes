import { escapeHtml } from './utils'

export function buildGeneralQuoteAdminNotificationEmail(data: {
  referenceNumber: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  company?: string
  interestCategory: string
  quantity?: number
  deliveryState: string
  projectTimeline?: string
}): { subject: string; html: string } {
  return {
    subject: `New General Quote: ${data.referenceNumber} - ${data.interestCategory}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">New General Quote Request</h1>
        <p style="color: #333; font-size: 16px;">
          A new general quote request has been submitted with reference <strong>${escapeHtml(data.referenceNumber)}</strong>.
        </p>

        <h3 style="color: #1a1a1a; font-size: 16px; margin-top: 24px;">Contact Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e5e5; font-weight: bold; color: #333;">Name</td>
            <td style="padding: 8px; border: 1px solid #e5e5e5; color: #333;">${escapeHtml(data.contactName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e5e5; font-weight: bold; color: #333;">Email</td>
            <td style="padding: 8px; border: 1px solid #e5e5e5; color: #333;">${escapeHtml(data.contactEmail)}</td>
          </tr>
          ${data.contactPhone ? `
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e5e5; font-weight: bold; color: #333;">Phone</td>
            <td style="padding: 8px; border: 1px solid #e5e5e5; color: #333;">${escapeHtml(data.contactPhone)}</td>
          </tr>` : ''}
          ${data.company ? `
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e5e5; font-weight: bold; color: #333;">Company</td>
            <td style="padding: 8px; border: 1px solid #e5e5e5; color: #333;">${escapeHtml(data.company)}</td>
          </tr>` : ''}
        </table>

        <h3 style="color: #1a1a1a; font-size: 16px; margin-top: 24px;">Project Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e5e5; font-weight: bold; color: #333;">Interest</td>
            <td style="padding: 8px; border: 1px solid #e5e5e5; color: #333;">${escapeHtml(data.interestCategory)}</td>
          </tr>
          ${data.quantity ? `
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e5e5; font-weight: bold; color: #333;">Quantity</td>
            <td style="padding: 8px; border: 1px solid #e5e5e5; color: #333;">${data.quantity}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e5e5; font-weight: bold; color: #333;">Delivery State</td>
            <td style="padding: 8px; border: 1px solid #e5e5e5; color: #333;">${escapeHtml(data.deliveryState)}</td>
          </tr>
          ${data.projectTimeline ? `
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e5e5; font-weight: bold; color: #333;">Timeline</td>
            <td style="padding: 8px; border: 1px solid #e5e5e5; color: #333;">${escapeHtml(data.projectTimeline)}</td>
          </tr>` : ''}
        </table>

        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
        <p style="color: #666; font-size: 14px;">Kwik Built Homes - Admin Notification</p>
      </div>
    `,
  }
}
