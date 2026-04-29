import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { CategoryCard } from './components/category-card'
import {
  Factory,
  ShieldCheck,
  PiggyBank,
  Building2,
  Clock,
  Truck,
} from 'lucide-react'
import type { ComponentType } from 'react'

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  factory: Factory,
  'shield-check': ShieldCheck,
  'piggy-bank': PiggyBank,
  'building-2': Building2,
  clock: Clock,
  truck: Truck,
}

const defaultValueProps = [
  {
    title: 'Factory Speed',
    description: 'Modules built in weeks, not months. Predictable timelines from order to delivery.',
    icon: 'factory',
  },
  {
    title: 'NCC Compliant',
    description: 'Engineered to meet Australian building codes. Certified for your peace of mind.',
    icon: 'shield-check',
  },
  {
    title: 'Cost Efficiency',
    description: 'Predictable pricing with factory quality control. No weather delays, no surprises.',
    icon: 'piggy-bank',
  },
  {
    title: 'Estate Scale',
    description: 'From single units to full housing developments. Built to scale with your project.',
    icon: 'building-2',
  },
]

const defaultSteps = [
  { title: 'Enquire', description: 'Tell us about your project' },
  { title: 'Design', description: 'Finalise specifications and compliance' },
  { title: 'Manufacture', description: 'Factory-built with quality control' },
  { title: 'Deliver', description: 'Transported to your site, ready for install' },
]

type SiteContentHomepage = {
  hero?: { headline?: string; tagline?: string; primaryCta?: string; secondaryCta?: string }
  valueProps?: { title: string; description: string; icon?: string }[]
  aboutSummary?: string
  ctaBanner?: { heading?: string; buttonText?: string }
}

type SiteContentHowItWorks = {
  steps?: { title: string; description: string }[]
}

export default async function HomePage() {
  let categories: {
    id: number
    title: string
    slug: string
    description?: string | null
    productCount: number
  }[] = []
  let content: SiteContentHomepage = {}
  let howItWorksContent: SiteContentHowItWorks = {}
  let hasError = false

  try {
    const payload = await getPayloadClient()

    // Fetch site content
    try {
      const siteContent = await payload.findGlobal({ slug: 'site-content' })
      content = {
        hero: siteContent.hero as SiteContentHomepage['hero'],
        valueProps: siteContent.valueProps as SiteContentHomepage['valueProps'],
        aboutSummary: siteContent.aboutSummary as string | undefined,
        ctaBanner: siteContent.ctaBanner as SiteContentHomepage['ctaBanner'],
      }
      howItWorksContent = {
        steps: siteContent.steps as SiteContentHowItWorks['steps'],
      }
    } catch {
      // Use defaults if Global not populated yet
    }

    // Fetch categories with product counts
    const categoryResult = await payload.find({
      collection: 'categories',
      sort: 'displayOrder',
      limit: 20,
      depth: 0,
    })

    categories = await Promise.all(
      categoryResult.docs.map(async (cat) => {
        const products = await payload.find({
          collection: 'products',
          where: { category: { equals: cat.id } },
          limit: 0,
          depth: 0,
        })
        return {
          id: cat.id as number,
          title: cat.title as string,
          slug: cat.slug as string,
          description: cat.description as string | null | undefined,
          productCount: products.totalDocs,
        }
      }),
    )
  } catch (err) {
    console.error('Homepage Payload error:', err)
    hasError = true
  }

  const hero = content.hero ?? {}
  const valueProps = content.valueProps?.length ? content.valueProps : defaultValueProps
  const aboutSummary =
    content.aboutSummary ||
    'KwikBuilt is an Australian modular home distributor delivering factory-built, site-ready buildings through international manufacturing partnerships. We supply land developers, builders, and sub-distributors across Australia.'
  const ctaBanner = content.ctaBanner ?? {}
  const steps = howItWorksContent.steps?.length ? howItWorksContent.steps : defaultSteps

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#2D2D2D] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            {hero.headline || 'Australian-Engineered Modular Homes'}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-accent font-medium">
            {hero.tagline || 'Factory-built. Site-ready. NCC-compliant.'}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center rounded-full bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {hero.primaryCta || 'Browse Our Range'}
            </Link>
            <Link
              href="/quote"
              className="inline-flex items-center rounded-full border-2 border-white px-8 py-3 text-base font-medium text-white hover:bg-white/10 transition-colors"
            >
              {hero.secondaryCta || 'Request a Quote'}
            </Link>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="bg-secondary py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="w-12 h-1 bg-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground">Why KwikBuilt</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((prop) => {
              const Icon = iconMap[prop.icon || 'factory'] || Factory
              return (
                <div
                  key={prop.title}
                  className="bg-background rounded-lg border border-border p-8 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-1 bg-primary mb-6" />
                  <Icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{prop.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{prop.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {hasError && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
              <h2 className="font-semibold">Content temporarily unavailable</h2>
              {process.env.NODE_ENV === 'development' && (
                <p className="mt-1 text-sm">
                  Add <code className="font-mono bg-amber-100 px-1 rounded">DATABASE_URL</code> and{' '}
                  <code className="font-mono bg-amber-100 px-1 rounded">PAYLOAD_SECRET</code> to your{' '}
                  <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code> file, then
                  restart the dev server.
                </p>
              )}
            </div>
          )}

          {!hasError && categories.length > 0 && (
            <>
              <div className="w-12 h-1 bg-primary mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-8">Browse by Category</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    productCount={cat.productCount}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="bg-secondary py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="w-12 h-1 bg-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-lg font-bold mb-4">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Learn more about our process &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-12 h-1 bg-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-foreground mb-6">About KwikBuilt</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{aboutSummary}</p>
          <div className="mt-8">
            <Link
              href="/about"
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Learn more about us &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            {ctaBanner.heading || 'Ready to start your project?'}
          </h2>
          <Link
            href="/quote"
            className="inline-flex items-center rounded-full border-2 border-white px-8 py-3 text-base font-medium text-white hover:bg-white/10 transition-colors"
          >
            {ctaBanner.buttonText || 'Request a Quote'}
          </Link>
        </div>
      </section>
    </div>
  )
}
