'use server'

import { getPayloadClient } from '@/lib/payload'
import { generalQuoteFormSchema } from '@/lib/schemas/general-quote-schema'
import { buildGeneralQuoteBuyerConfirmationEmail } from '@/lib/email/general-quote-confirmation'
import { buildGeneralQuoteAdminNotificationEmail } from '@/lib/email/general-quote-notification'

export type GeneralQuoteActionState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  referenceNumber?: string
}

export async function submitGeneralQuote(
  prevState: GeneralQuoteActionState,
  formData: FormData,
): Promise<GeneralQuoteActionState> {
  const raw = {
    contactName: formData.get('contactName'),
    contactEmail: formData.get('contactEmail'),
    contactPhone: formData.get('contactPhone'),
    company: formData.get('company'),
    interestCategory: formData.get('interestCategory'),
    quantity: formData.get('quantity') || undefined,
    deliveryState: formData.get('deliveryState'),
    deliveryLocation: formData.get('deliveryLocation'),
    projectTimeline: formData.get('projectTimeline') || undefined,
    isEstateInquiry: formData.get('isEstateInquiry'),
    numberOfUnits: formData.get('numberOfUnits') || undefined,
    siteAddress: formData.get('siteAddress'),
    modelMix: formData.get('modelMix'),
    additionalNotes: formData.get('additionalNotes'),
  }

  const parsed = generalQuoteFormSchema.safeParse(raw)
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
        source: 'general',
        status: 'new',
        interestCategory: data.interestCategory,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || undefined,
        company: data.company || undefined,
        quantity: data.quantity ?? 1,
        deliveryState: data.deliveryState,
        deliveryLocation: data.deliveryLocation || undefined,
        projectTimeline: data.projectTimeline || undefined,
        isEstateInquiry: data.isEstateInquiry || false,
        numberOfUnits: data.numberOfUnits ?? undefined,
        siteAddress: data.siteAddress || undefined,
        modelMix: data.modelMix ? { raw: data.modelMix } : undefined,
        additionalNotes: data.additionalNotes || undefined,
      },
    })

    try {
      const buyerEmail = buildGeneralQuoteBuyerConfirmationEmail({
        contactName: data.contactName,
        referenceNumber,
        interestCategory: data.interestCategory,
      })
      await payload.sendEmail({
        to: data.contactEmail,
        subject: buyerEmail.subject,
        html: buyerEmail.html,
      })
    } catch (emailError) {
      console.error('Failed to send general quote confirmation email:', emailError)
    }

    try {
      const adminEmail = buildGeneralQuoteAdminNotificationEmail({
        referenceNumber,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || undefined,
        company: data.company || undefined,
        interestCategory: data.interestCategory,
        quantity: data.quantity,
        deliveryState: data.deliveryState,
        projectTimeline: data.projectTimeline || undefined,
      })
      await payload.sendEmail({
        to: process.env.ADMIN_QUOTE_EMAIL || 'quotes@kwikbuilthomes.com.au',
        subject: adminEmail.subject,
        html: adminEmail.html,
      })
    } catch (emailError) {
      console.error('Failed to send general quote admin notification:', emailError)
    }

    return {
      success: true,
      message: 'Quote request submitted successfully!',
      referenceNumber,
    }
  } catch (error) {
    console.error('General quote submission error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}
