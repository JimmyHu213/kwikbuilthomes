'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { submitGeneralQuote, type GeneralQuoteActionState } from '@/lib/actions/submit-general-quote'
import { australianStates, timelineOptions, interestCategories, interestCategoryLabels } from '@/lib/schemas/general-quote-schema'

const initialState: GeneralQuoteActionState = { success: false, message: '' }
const timelineLabels: Record<string, string> = {
  immediate: 'Immediate (0-3 months)', short: 'Short term (3-6 months)', medium: 'Medium term (6-12 months)', long: 'Long term (12+ months)', exploring: 'Just exploring',
}
const inputClassName = 'w-full rounded-md border border-border px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none'
const labelClassName = 'block text-sm font-medium text-foreground/80'
const errorClassName = 'text-sm text-red-600 mt-1'

export function GeneralQuoteForm() {
  const [state, formAction, pending] = useActionState(submitGeneralQuote, initialState)
  const [isEstateInquiry, setIsEstateInquiry] = useState(false)

  if (state.success) {
    return (
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-2xl font-semibold text-foreground">Quote Request Submitted!</h2>
        {state.referenceNumber && (<p className="mt-2 text-sm text-muted-foreground">Reference number: <strong className="text-foreground">{state.referenceNumber}</strong></p>)}
        <p className="mt-3 text-muted-foreground">Our team will review your requirements and respond within 2 business days.</p>
        <Link href="/" className={cn(buttonVariants({ variant: 'outline' }), 'mt-6')}>Back to home</Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-8">
      {state.message && !state.success && (<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.message}</div>)}

      <fieldset>
        <legend className="text-lg font-semibold text-foreground mb-4">Contact Information</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contactName" className={labelClassName}>Full Name <span className="text-red-500">*</span></label>
            <input id="contactName" name="contactName" type="text" required className={inputClassName} placeholder="Your full name" />
            {state.errors?.contactName && <p className={errorClassName}>{state.errors.contactName[0]}</p>}
          </div>
          <div>
            <label htmlFor="contactEmail" className={labelClassName}>Email Address <span className="text-red-500">*</span></label>
            <input id="contactEmail" name="contactEmail" type="email" required className={inputClassName} placeholder="you@company.com" />
            {state.errors?.contactEmail && <p className={errorClassName}>{state.errors.contactEmail[0]}</p>}
          </div>
          <div>
            <label htmlFor="contactPhone" className={labelClassName}>Phone Number</label>
            <input id="contactPhone" name="contactPhone" type="tel" className={inputClassName} placeholder="04XX XXX XXX" />
          </div>
          <div>
            <label htmlFor="company" className={labelClassName}>Company</label>
            <input id="company" name="company" type="text" className={inputClassName} placeholder="Your company name" />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-semibold text-foreground mb-4">Project Details</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="interestCategory" className={labelClassName}>I&apos;m interested in <span className="text-red-500">*</span></label>
            <select id="interestCategory" name="interestCategory" required className={inputClassName} defaultValue="">
              <option value="" disabled>Select a category</option>
              {interestCategories.map((cat) => (<option key={cat} value={cat}>{interestCategoryLabels[cat]}</option>))}
            </select>
            {state.errors?.interestCategory && <p className={errorClassName}>{state.errors.interestCategory[0]}</p>}
          </div>
          <div>
            <label htmlFor="quantity" className={labelClassName}>Quantity</label>
            <input id="quantity" name="quantity" type="number" min={1} defaultValue={1} className={inputClassName} />
          </div>
          <div>
            <label htmlFor="deliveryState" className={labelClassName}>Delivery State <span className="text-red-500">*</span></label>
            <select id="deliveryState" name="deliveryState" required className={inputClassName} defaultValue="">
              <option value="" disabled>Select a state</option>
              {australianStates.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
            {state.errors?.deliveryState && <p className={errorClassName}>{state.errors.deliveryState[0]}</p>}
          </div>
          <div>
            <label htmlFor="deliveryLocation" className={labelClassName}>Delivery Location</label>
            <input id="deliveryLocation" name="deliveryLocation" type="text" className={inputClassName} placeholder="City or region" />
          </div>
          <div>
            <label htmlFor="projectTimeline" className={labelClassName}>Project Timeline</label>
            <select id="projectTimeline" name="projectTimeline" className={inputClassName} defaultValue="">
              <option value="">Select a timeline</option>
              {timelineOptions.map((t) => (<option key={t} value={t}>{timelineLabels[t] ?? t}</option>))}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-semibold text-foreground mb-4">Estate Inquiry</legend>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="isEstateInquiry" value="true" checked={isEstateInquiry} onChange={(e) => setIsEstateInquiry(e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
            <span className="text-sm text-foreground/80">This is a multi-unit estate inquiry</span>
          </label>
          {isEstateInquiry && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pl-7">
              <div>
                <label htmlFor="numberOfUnits" className={labelClassName}>Number of Units</label>
                <input id="numberOfUnits" name="numberOfUnits" type="number" min={2} className={inputClassName} placeholder="Minimum 2" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="siteAddress" className={labelClassName}>Site Address</label>
                <textarea id="siteAddress" name="siteAddress" rows={2} className={inputClassName} placeholder="Site or development address" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="modelMix" className={labelClassName}>Model Mix</label>
                <textarea id="modelMix" name="modelMix" rows={2} className={inputClassName} placeholder="e.g., 4x Studio 35, 2x Family 60" />
              </div>
            </div>
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-semibold text-foreground mb-4">Additional Notes</legend>
        <textarea id="additionalNotes" name="additionalNotes" rows={4} className={inputClassName} placeholder="Any other requirements, questions, or details..." />
      </fieldset>

      <button type="submit" disabled={pending} className={cn(buttonVariants({ size: 'lg' }), 'w-full text-center', pending && 'opacity-70 cursor-not-allowed')}>
        {pending ? 'Submitting...' : 'Submit Quote Request'}
      </button>
    </form>
  )
}
