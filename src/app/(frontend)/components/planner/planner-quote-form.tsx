'use client'

import { useActionState, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { submitPlannerQuote, type PlannerQuoteActionState } from '@/lib/actions/submit-planner-quote'
import { australianStates, timelineOptions } from '@/lib/schemas/planner-quote-schema'
import type { LayoutBom } from '@/lib/planner/types'

const initialState: PlannerQuoteActionState = { success: false, message: '' }

const timelineLabels: Record<string, string> = {
  immediate: 'Immediate (0-3 months)',
  short: 'Short term (3-6 months)',
  medium: 'Medium term (6-12 months)',
  long: 'Long term (12+ months)',
  exploring: 'Just exploring',
}

const inputClassName = 'w-full rounded-md border border-border px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none'
const labelClassName = 'block text-sm font-medium text-foreground/80'
const errorClassName = 'text-sm text-red-600 mt-1'

export function PlannerQuoteForm() {
  const [state, formAction, pending] = useActionState(submitPlannerQuote, initialState)
  const [bom, setBom] = useState<LayoutBom | null>(null)
  const [screenshot, setScreenshot] = useState<string | null>(null)

  useEffect(() => {
    const bomData = sessionStorage.getItem('plannerBom')
    const screenshotData = sessionStorage.getItem('plannerScreenshot')
    if (bomData) setBom(JSON.parse(bomData))
    if (screenshotData) setScreenshot(screenshotData)
  }, [])

  useEffect(() => {
    if (state.success) {
      sessionStorage.removeItem('plannerBom')
      sessionStorage.removeItem('plannerScreenshot')
    }
  }, [state.success])

  if (state.success) {
    return (
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-2xl font-semibold text-foreground">Quote Request Submitted!</h2>
        {state.referenceNumber && (
          <p className="mt-2 text-sm text-muted-foreground">Reference: <strong className="text-foreground">{state.referenceNumber}</strong></p>
        )}
        <p className="mt-3 text-muted-foreground">Our team will review your layout and respond within 2 business days.</p>
        <Link href="/designer" className={cn(buttonVariants({ variant: 'outline' }), 'mt-6')}>Back to Site Planner</Link>
      </div>
    )
  }

  if (!bom) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No layout data found. Please design a layout first.</p>
        <Link href="/designer" className={cn(buttonVariants(), 'mt-4')}>Open Site Planner</Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-8">
      {state.message && !state.success && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.message}</div>
      )}

      <input type="hidden" name="layoutData" value={JSON.stringify(bom.lineItems)} />
      <input type="hidden" name="totalFloorArea" value={bom.totalFloorArea} />
      {bom.estimatedPriceFrom != null && <input type="hidden" name="estimatedPrice" value={bom.estimatedPriceFrom} />}
      {screenshot && <input type="hidden" name="screenshot" value={screenshot} />}

      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">Your Layout</h2>
        {screenshot && (
          <div className="relative aspect-[3/2] w-full max-w-lg mb-4 rounded-lg overflow-hidden border border-border">
            <Image src={screenshot} alt="Layout preview" fill className="object-contain bg-muted" />
          </div>
        )}
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary">
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-2 text-center font-medium text-muted-foreground">Qty</th>
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Dimensions</th>
                <th className="px-4 py-2 text-right font-medium text-muted-foreground">Area</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bom.lineItems.map((item) => (
                <tr key={item.productId}>
                  <td className="px-4 py-2 text-foreground">{item.productTitle}</td>
                  <td className="px-4 py-2 text-center text-foreground">{item.quantity}</td>
                  <td className="px-4 py-2 text-foreground">{item.unitDimensions}</td>
                  <td className="px-4 py-2 text-right text-foreground">{item.totalFloorArea != null ? `${item.totalFloorArea} m\u00B2` : 'N/A'}</td>
                </tr>
              ))}
              <tr className="bg-secondary font-medium">
                <td className="px-4 py-2 text-foreground" colSpan={3}>Total</td>
                <td className="px-4 py-2 text-right text-foreground">{bom.totalFloorArea} m²</td>
              </tr>
            </tbody>
          </table>
        </div>
        {bom.estimatedPriceFrom != null && (
          <p className="mt-2 text-sm text-muted-foreground">Estimated from: <span className="font-medium text-primary">${bom.estimatedPriceFrom.toLocaleString()} + GST</span></p>
        )}
      </section>

      <fieldset>
        <legend className="text-lg font-semibold text-foreground mb-4">Contact Information</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contactName" className={labelClassName}>Full Name <span className="text-red-500">*</span></label>
            <input id="contactName" name="contactName" type="text" required className={inputClassName} />
            {state.errors?.contactName && <p className={errorClassName}>{state.errors.contactName[0]}</p>}
          </div>
          <div>
            <label htmlFor="contactEmail" className={labelClassName}>Email <span className="text-red-500">*</span></label>
            <input id="contactEmail" name="contactEmail" type="email" required className={inputClassName} />
            {state.errors?.contactEmail && <p className={errorClassName}>{state.errors.contactEmail[0]}</p>}
          </div>
          <div>
            <label htmlFor="contactPhone" className={labelClassName}>Phone</label>
            <input id="contactPhone" name="contactPhone" type="tel" className={inputClassName} />
          </div>
          <div>
            <label htmlFor="company" className={labelClassName}>Company</label>
            <input id="company" name="company" type="text" className={inputClassName} />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-semibold text-foreground mb-4">Project Details</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="deliveryState" className={labelClassName}>Delivery State <span className="text-red-500">*</span></label>
            <select id="deliveryState" name="deliveryState" required className={inputClassName} defaultValue="">
              <option value="" disabled>Select a state</option>
              {australianStates.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {state.errors?.deliveryState && <p className={errorClassName}>{state.errors.deliveryState[0]}</p>}
          </div>
          <div>
            <label htmlFor="deliveryLocation" className={labelClassName}>Location</label>
            <input id="deliveryLocation" name="deliveryLocation" type="text" className={inputClassName} placeholder="City or region" />
          </div>
          <div>
            <label htmlFor="projectTimeline" className={labelClassName}>Timeline</label>
            <select id="projectTimeline" name="projectTimeline" className={inputClassName} defaultValue="">
              <option value="">Select a timeline</option>
              {timelineOptions.map((t) => <option key={t} value={t}>{timelineLabels[t] ?? t}</option>)}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-semibold text-foreground mb-4">Additional Notes</legend>
        <textarea id="additionalNotes" name="additionalNotes" rows={4} className={inputClassName} />
      </fieldset>

      <button type="submit" disabled={pending} className={cn(buttonVariants({ size: 'lg' }), 'w-full text-center', pending && 'opacity-70 cursor-not-allowed')}>
        {pending ? 'Submitting...' : 'Submit Quote Request'}
      </button>
    </form>
  )
}
