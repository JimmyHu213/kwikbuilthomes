import Link from 'next/link'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'About | KwikBuilt Homes',
  description: 'Learn about KwikBuilt — Australian-engineered modular homes for developers, builders, and sub-distributors.',
}

type AboutContent = {
  companyStory?: string
  dealershipModel?: string
  leadership?: { name: string; role: string; description?: string }[]
  whyModular?: string
}

const defaults: Required<AboutContent> = {
  companyStory: 'KwikBuilt Pty Ltd is an Australian modular home distributor. Our factory-built modules are engineered to Australian standards, manufactured through international partnerships, and delivered site-ready across Australia.',
  dealershipModel: 'KwikBuilt supplies to land developers, builders, and sub-distributors. Our dealership partners handle installation and final fitout, ensuring local expertise at every stage.',
  leadership: [
    { name: 'Di Hu', role: 'Chairperson', description: 'Supply chain expertise and international manufacturing partnerships.' },
    { name: 'Geoffrey Shannon', role: 'Managing Director', description: 'Australian market development and dealership network.' },
  ],
  whyModular: 'Modular construction delivers faster build times, consistent factory quality control, predictable pricing, and the scalability to support housing estates and developments of any size.',
}

export default async function AboutPage() {
  let content: AboutContent = {}
  try {
    const payload = await getPayloadClient()
    const siteContent = await payload.findGlobal({ slug: 'site-content' })
    content = {
      companyStory: siteContent.companyStory as string | undefined,
      dealershipModel: siteContent.dealershipModel as string | undefined,
      leadership: siteContent.leadership as AboutContent['leadership'],
      whyModular: siteContent.whyModular as string | undefined,
    }
  } catch { /* Use defaults */ }

  const companyStory = content.companyStory || defaults.companyStory
  const dealershipModel = content.dealershipModel || defaults.dealershipModel
  const leadership = content.leadership?.length ? content.leadership : defaults.leadership
  const whyModular = content.whyModular || defaults.whyModular

  return (
    <div>
      <section className="bg-[#2D2D2D] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">About KwikBuilt</h1>
          <p className="mt-4 text-lg text-accent font-medium">Australian-engineered modular homes for the building industry</p>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        <section>
          <div className="w-12 h-1 bg-primary mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-4">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{companyStory}</p>
        </section>
        <section>
          <div className="w-12 h-1 bg-primary mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-4">Dealership Model</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{dealershipModel}</p>
        </section>
        <section>
          <div className="w-12 h-1 bg-primary mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-4">Leadership</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {leadership.map((person) => (
              <div key={person.name} className="rounded-lg border border-border bg-secondary p-6">
                <h3 className="text-lg font-semibold text-foreground">{person.name}</h3>
                <p className="text-sm text-primary font-medium mt-1">{person.role}</p>
                {person.description && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{person.description}</p>}
              </div>
            ))}
          </div>
        </section>
        <section>
          <div className="w-12 h-1 bg-primary mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-4">Why Modular</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{whyModular}</p>
        </section>
        <section className="text-center pt-8">
          <Link href="/quote" className="inline-flex items-center rounded-full bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Request a Quote</Link>
        </section>
      </div>
    </div>
  )
}
