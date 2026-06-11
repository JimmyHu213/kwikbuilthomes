'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { submitContact, type ContactActionState } from '@/lib/actions/submit-contact'

const initialState: ContactActionState = { success: false, message: '' }
const inputClassName = 'w-full rounded-md border border-border px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none'
const labelClassName = 'block text-sm font-medium text-foreground/80'
const errorClassName = 'text-sm text-red-600 mt-1'

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState)
  // Time-trap: capture render time once so the action can reject instant bot submits.
  const [formRenderedAt] = useState(() => Date.now())

  if (state.success) {
    return (
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-2xl font-semibold text-foreground">Inquiry Submitted</h2>
        {state.referenceNumber && (
          <p className="mt-2 text-sm text-muted-foreground">Reference number: <strong className="text-foreground">{state.referenceNumber}</strong></p>
        )}
        <p className="mt-3 text-muted-foreground">Our team will review your message and respond within 2 business days.</p>
        <Link href="/" className={cn(buttonVariants({ variant: 'outline' }), 'mt-6')}>Back to home</Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.message && !state.success && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.message}</div>
      )}
      {/* Honeypot: visually hidden, off-screen, not type=hidden. Real users never fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="formRenderedAt" value={formRenderedAt} />
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
        {state.errors?.contactPhone && <p className={errorClassName}>{state.errors.contactPhone[0]}</p>}
      </div>
      <div>
        <label htmlFor="message" className={labelClassName}>Message <span className="text-red-500">*</span></label>
        <textarea id="message" name="message" rows={5} required className={inputClassName} placeholder="How can we help?" />
        {state.errors?.message && <p className={errorClassName}>{state.errors.message[0]}</p>}
      </div>
      <button type="submit" disabled={pending} className={cn(buttonVariants({ size: 'lg' }), 'w-full text-center', pending && 'opacity-70 cursor-not-allowed')}>
        {pending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
