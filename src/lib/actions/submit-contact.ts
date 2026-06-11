'use server'

import { getPayloadClient } from '@/lib/payload'
import { contactFormSchema } from '@/lib/schemas/contact-schema'
import { buildContactBuyerConfirmationEmail } from '@/lib/email/contact-confirmation'
import { buildContactAdminNotificationEmail } from '@/lib/email/contact-notification'
import { rateLimitRequest, isHoneypotTripped, isTooFast } from '@/lib/rate-limit'

export type ContactActionState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  referenceNumber?: string
}

export async function submitContact(
  prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  // Spam/abuse protection: rate-limit -> honeypot -> time-trap.
  const { allowed } = await rateLimitRequest()
  if (!allowed) {
    return { success: false, message: 'Too many requests, please try again shortly.' }
  }
  // Silent success (matches the real success shape) so bots get no signal.
  if (isHoneypotTripped(formData) || isTooFast(formData)) {
    return { success: true, message: 'Your inquiry has been submitted.' }
  }

  const raw = {
    contactName: formData.get('contactName'),
    contactEmail: formData.get('contactEmail'),
    contactPhone: formData.get('contactPhone'),
    message: formData.get('message'),
  }

  const parsed = contactFormSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors below.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const data = parsed.data

  try {
    const payload = await getPayloadClient()
    const referenceNumber = `KBH-${String(Date.now()).slice(-8)}`

    await payload.create({
      collection: 'quotes',
      data: {
        referenceNumber,
        source: 'contact',
        status: 'new',
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || undefined,
        additionalNotes: data.message,
        quantity: 1,
      },
    })

    try {
      const buyerEmail = buildContactBuyerConfirmationEmail({
        contactName: data.contactName,
        referenceNumber,
      })
      await payload.sendEmail({
        to: data.contactEmail,
        subject: buyerEmail.subject,
        html: buyerEmail.html,
      })
    } catch (emailError) {
      console.error('Failed to send contact confirmation email:', emailError)
    }

    try {
      const adminEmail = buildContactAdminNotificationEmail({
        referenceNumber,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || undefined,
        message: data.message,
      })
      await payload.sendEmail({
        to: process.env.ADMIN_QUOTE_EMAIL || 'quotes@kwikbuilthomes.com.au',
        subject: adminEmail.subject,
        html: adminEmail.html,
      })
    } catch (emailError) {
      console.error('Failed to send contact admin notification:', emailError)
    }

    return {
      success: true,
      message: 'Your inquiry has been submitted.',
      referenceNumber,
    }
  } catch (error) {
    console.error('Contact submission error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}
