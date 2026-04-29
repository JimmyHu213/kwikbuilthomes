import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { MessageSquare, PencilRuler, Factory, Truck } from 'lucide-react'
import type { ComponentType } from 'react'

export const metadata: Metadata = {
  title: 'How It Works | KwikBuilt Homes',
  description: 'From enquiry to delivery — learn how KwikBuilt modular homes are built and delivered.',
}

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  'message-square': MessageSquare,
  'pencil-ruler': PencilRuler,
  factory: Factory,
  truck: Truck,
}

const defaultSteps = [
  { title: 'Enquire', description: 'Tell us about your project via the quote form or contact us directly. Whether you need a single unit or an entire housing estate, our team responds within 2 business days with initial guidance on product selection, compliance requirements, and indicative pricing.', icon: 'message-square' },
  { title: 'Design', description: 'We work with you on specifications, compliance requirements — NCC classification, wind region ratings, BAL ratings — and site conditions to finalise your order. Our engineering team ensures every module meets Australian standards for your specific location.', icon: 'pencil-ruler' },
  { title: 'Manufacture', description: 'Factory-built modules with quality control at every stage. Our international manufacturing partnerships deliver faster turnaround than traditional construction with consistent quality. Every module is inspected before shipping.', icon: 'factory' },
  { title: 'Deliver', description: 'Completed modules are transported to your site. As our dealership partners, retailers handle installation and final fitout, ensuring local expertise and accountability at every stage of the build.', icon: 'truck' },
]

type Step = { title: string; description: string; icon?: string }

export default async function HowItWorksPage() {
  let steps: Step[] = []
  try {
    const payload = await getPayloadClient()
    const siteContent = await payload.findGlobal({ slug: 'site-content' })
    const cmsSteps = siteContent.steps as Step[] | undefined
    if (cmsSteps?.length) steps = cmsSteps
  } catch { /* Use defaults */ }
  if (!steps.length) steps = defaultSteps

  return (
    <div>
      <section className="bg-[#2D2D2D] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">How It Works</h1>
          <p className="mt-4 text-lg text-accent font-medium">From enquiry to delivery — a straightforward process</p>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-0">
          {steps.map((step, i) => {
            const Icon = iconMap[step.icon || 'message-square'] || MessageSquare
            const isEven = i % 2 === 1
            return (
              <div key={step.title} className={`py-12 ${i > 0 ? 'border-t border-border' : ''} ${isEven ? 'bg-secondary -mx-6 px-6 rounded-lg' : ''}`}>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground text-xl font-bold">{i + 1}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-semibold text-foreground">{step.title}</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground mb-6">Ready to get started?</p>
          <Link href="/quote" className="inline-flex items-center rounded-full bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Request a Quote</Link>
        </div>
      </div>
    </div>
  )
}
