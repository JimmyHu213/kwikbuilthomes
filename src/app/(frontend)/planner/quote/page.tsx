import type { Metadata } from 'next'
import { PlannerQuoteForm } from '../../components/planner/planner-quote-form'

export const metadata: Metadata = {
  title: 'Request Quote - Site Planner | Kwik Built Homes',
  description: 'Submit a quote request for your modular housing layout.',
}

export default function PlannerQuotePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Request a Quote</h1>
      <p className="text-muted-foreground mb-8">Review your site layout and submit a quote request.</p>
      <PlannerQuoteForm />
    </main>
  )
}
