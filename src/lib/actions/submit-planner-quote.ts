'use server'

import { getPayloadClient } from '@/lib/payload'
import { plannerQuoteFormSchema } from '@/lib/schemas/planner-quote-schema'
import { buildPlannerBuyerConfirmationEmail } from '@/lib/email/planner-quote-confirmation'
import { buildPlannerAdminNotificationEmail } from '@/lib/email/planner-quote-notification'
import { rateLimitRequest, isHoneypotTripped, isTooFast } from '@/lib/rate-limit'

export type PlannerQuoteActionState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  referenceNumber?: string
}

export async function submitPlannerQuote(
  prevState: PlannerQuoteActionState,
  formData: FormData,
): Promise<PlannerQuoteActionState> {
  // Spam/abuse protection: rate-limit -> honeypot -> time-trap.
  const { allowed } = await rateLimitRequest()
  if (!allowed) {
    return { success: false, message: 'Too many requests, please try again shortly.' }
  }
  if (isHoneypotTripped(formData) || isTooFast(formData)) {
    return { success: true, message: 'Quote request submitted successfully!' }
  }

  const raw = {
    layoutData: formData.get('layoutData'),
    totalFloorArea: formData.get('totalFloorArea'),
    estimatedPrice: formData.get('estimatedPrice') || undefined,
    contactName: formData.get('contactName'),
    contactEmail: formData.get('contactEmail'),
    contactPhone: formData.get('contactPhone'),
    company: formData.get('company'),
    deliveryState: formData.get('deliveryState'),
    deliveryLocation: formData.get('deliveryLocation'),
    projectTimeline: formData.get('projectTimeline') || undefined,
    additionalNotes: formData.get('additionalNotes'),
  }

  const parsed = plannerQuoteFormSchema.safeParse(raw)
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

    let screenshotId: number | undefined
    const screenshotData = formData.get('screenshot')
    if (screenshotData && typeof screenshotData === 'string' && screenshotData.startsWith('data:')) {
      try {
        const base64 = screenshotData.split(',')[1]
        const buffer = Buffer.from(base64, 'base64')
        const uploadResult = await payload.create({
          collection: 'media',
          data: { alt: `Layout screenshot - ${referenceNumber}` },
          file: { data: buffer, mimetype: 'image/jpeg', name: `layout-${referenceNumber}.jpg`, size: buffer.length },
        })
        screenshotId = uploadResult.id
      } catch (uploadError) {
        console.error('Failed to upload layout screenshot:', uploadError)
      }
    }

    await payload.create({
      collection: 'quotes',
      data: {
        referenceNumber,
        source: 'planner',
        status: 'new',
        layoutData: data.layoutData,
        layoutScreenshot: screenshotId,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || undefined,
        company: data.company || undefined,
        deliveryState: data.deliveryState,
        deliveryLocation: data.deliveryLocation || undefined,
        projectTimeline: data.projectTimeline || undefined,
        additionalNotes: data.additionalNotes || undefined,
        quantity: data.layoutData.reduce((sum, item) => sum + item.quantity, 0),
      },
    })

    try {
      const totalModules = data.layoutData.reduce((sum, item) => sum + item.quantity, 0)
      const buyerEmail = buildPlannerBuyerConfirmationEmail({ contactName: data.contactName, referenceNumber, totalModules, totalFloorArea: data.totalFloorArea })
      await payload.sendEmail({ to: data.contactEmail, subject: buyerEmail.subject, html: buyerEmail.html })
    } catch (emailError) {
      console.error('Failed to send buyer confirmation email:', emailError)
    }

    try {
      const adminEmail = buildPlannerAdminNotificationEmail({
        referenceNumber, contactName: data.contactName, contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || undefined, company: data.company || undefined,
        deliveryState: data.deliveryState, projectTimeline: data.projectTimeline || undefined,
        layoutData: data.layoutData, totalFloorArea: data.totalFloorArea, estimatedPrice: data.estimatedPrice ?? null,
      })
      await payload.sendEmail({ to: process.env.ADMIN_QUOTE_EMAIL || 'quotes@kwikbuilthomes.com.au', subject: adminEmail.subject, html: adminEmail.html })
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError)
    }

    return { success: true, message: 'Quote request submitted successfully!', referenceNumber }
  } catch (error) {
    console.error('Planner quote submission error:', error)
    return { success: false, message: 'An unexpected error occurred. Please try again.' }
  }
}
