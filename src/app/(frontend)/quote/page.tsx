import type { Metadata } from 'next'
import { GeneralQuoteForm } from './general-quote-form'

export const metadata: Metadata = {
  title: 'Request a Quote | KwikBuilt Homes',
  description: 'Request a quote for modular homes, kit homes, container homes, and more from KwikBuilt Homes.',
}

export default function QuotePage() {
  return (
    <div>
      <section className="bg-[#2D2D2D] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Request a Quote</h1>
          <p className="mt-4 text-lg text-accent font-medium">Tell us about your project and we'll get back to you within 2 business days</p>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <GeneralQuoteForm />
      </div>
    </div>
  )
}
