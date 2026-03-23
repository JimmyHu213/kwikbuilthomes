'use server'

import { getPayloadClient } from '@/lib/payload'
import { quoteFormSchema } from '@/lib/schemas/quote-schema'
import { buildBuyerConfirmationEmail } from '@/lib/email/quote-confirmation'
import { buildAdminNotificationEmail } from '@/lib/email/quote-notification'

export type QuoteActionState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  referenceNumber?: string
}

export async function submitQuote(
  prevState: QuoteActionState,
  formData: FormData,
): Promise<QuoteActionState> {
  // 1. Extract fields from FormData
  const raw = {
    productId: formData.get('productId'),
    productSlug: formData.get('productSlug'),
    productTitle: formData.get('productTitle'),
    selectedOptions: formData.get('selectedOptions'),
    contactName: formData.get('contactName'),
    contactEmail: formData.get('contactEmail'),
    contactPhone: formData.get('contactPhone'),
    company: formData.get('company'),
    quantity: formData.get('quantity'),
    deliveryState: formData.get('deliveryState'),
    deliveryLocation: formData.get('deliveryLocation'),
    projectTimeline: formData.get('projectTimeline') || undefined,
    siteConditions: formData.get('siteConditions'),
    isEstateInquiry: formData.get('isEstateInquiry'),
    numberOfUnits: formData.get('numberOfUnits') || undefined,
    siteAddress: formData.get('siteAddress'),
    modelMix: formData.get('modelMix'),
    additionalNotes: formData.get('additionalNotes'),
  }

  // 2. Validate with Zod
  const parsed = quoteFormSchema.safeParse(raw)
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

    // 3. Fetch product by slug to validate it exists and get the product ID
    const productResult = await payload.find({
      collection: 'products',
      where: { slug: { equals: data.productSlug } },
      limit: 1,
    })
    const product = productResult.docs[0]

    // 4. Generate reference number (timestamp-based)
    const referenceNumber = `KBH-${String(Date.now()).slice(-8)}`

    // 5. Create quote document
    await payload.create({
      collection: 'quotes',
      data: {
        referenceNumber,
        status: 'new',
        product: product?.id ?? undefined,
        productTitle: data.productTitle,
        productSlug: data.productSlug,
        selectedOptions: data.selectedOptions,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || undefined,
        company: data.company || undefined,
        quantity: data.quantity,
        deliveryState: data.deliveryState,
        deliveryLocation: data.deliveryLocation || undefined,
        projectTimeline: data.projectTimeline || undefined,
        siteConditions: data.siteConditions || undefined,
        isEstateInquiry: data.isEstateInquiry || false,
        numberOfUnits: data.numberOfUnits ?? undefined,
        siteAddress: data.siteAddress || undefined,
        modelMix: data.modelMix ? { raw: data.modelMix } : undefined,
        additionalNotes: data.additionalNotes || undefined,
      },
    })

    // 6. Send buyer confirmation email
    try {
      const buyerEmail = buildBuyerConfirmationEmail({
        contactName: data.contactName,
        referenceNumber,
        productTitle: data.productTitle,
        quantity: data.quantity,
      })
      await payload.sendEmail({
        to: data.contactEmail,
        subject: buyerEmail.subject,
        html: buyerEmail.html,
      })
    } catch (emailError) {
      console.error('Failed to send buyer confirmation email:', emailError)
      // Do NOT fail the submission if email fails
    }

    // 7. Send admin notification email
    try {
      const adminEmail = buildAdminNotificationEmail({
        referenceNumber,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || undefined,
        company: data.company || undefined,
        productTitle: data.productTitle,
        quantity: data.quantity,
        deliveryState: data.deliveryState,
        projectTimeline: data.projectTimeline || undefined,
        selectedOptions: data.selectedOptions,
      })
      await payload.sendEmail({
        to: process.env.ADMIN_QUOTE_EMAIL || 'quotes@kwikbuilthomes.com.au',
        subject: adminEmail.subject,
        html: adminEmail.html,
      })
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError)
      // Do NOT fail the submission if email fails
    }

    // 8. Return success
    return {
      success: true,
      message: 'Quote request submitted successfully!',
      referenceNumber,
    }
  } catch (error) {
    console.error('Quote submission error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}
