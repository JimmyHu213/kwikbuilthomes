import { escapeHtml } from './utils'

export function buildGeneralQuoteBuyerConfirmationEmail(data: {
  contactName: string
  referenceNumber: string
  interestCategory: string
}): { subject: string; html: string } {
  return {
    subject: `Quote Request Received - ${data.referenceNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">Quote Request Received</h1>
        <p style="color: #333; font-size: 16px;">Hi ${escapeHtml(data.contactName)},</p>
        <p style="color: #333; font-size: 16px;">
          We've received your quote request for <strong>${escapeHtml(data.interestCategory)}</strong>.
        </p>
        <p style="color: #333; font-size: 16px;">
          Your reference number is: <strong>${escapeHtml(data.referenceNumber)}</strong>
        </p>
        <p style="color: #333; font-size: 16px;">
          Our team will review your requirements and get back to you within 2 business days.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
        <p style="color: #666; font-size: 14px;">Kwik Built Homes</p>
      </div>
    `,
  }
}
