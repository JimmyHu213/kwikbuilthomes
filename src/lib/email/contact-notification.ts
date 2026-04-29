import { escapeHtml } from './utils'

export function buildContactAdminNotificationEmail(data: {
  referenceNumber: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  message: string
}): { subject: string; html: string } {
  const safeRef = data.referenceNumber.replace(/[\r\n]+/g, ' ').trim()
  return {
    subject: `New Contact Inquiry: ${safeRef}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">New Contact Inquiry</h1>
        <p style="color: #333; font-size: 16px;">
          A new contact inquiry has been submitted with reference <strong>${escapeHtml(data.referenceNumber)}</strong>.
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
        </table>

        <h3 style="color: #1a1a1a; font-size: 16px; margin-top: 24px;">Message</h3>
        <div style="padding: 16px; background: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 4px; color: #333; font-size: 14px; white-space: pre-wrap;">${escapeHtml(data.message)}</div>

        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
        <p style="color: #666; font-size: 14px;">Kwik Built Homes - Admin Notification</p>
      </div>
    `,
  }
}
