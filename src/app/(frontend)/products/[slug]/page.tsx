import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { FileDown } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { getMediaUrl, getMediaAlt } from '@/lib/media'
import { formatPrice } from '@/lib/format'
import { ImageCarousel } from '../../components/image-carousel'
import { AnimateOnScroll } from '../../components/animate-on-scroll'
import { ProductPreviewModal } from '../../components/product-preview-modal'
import { ProductConfigurator } from '../../components/product-configurator'
import { extractGallerySlides } from '@/lib/gallery'
import { extractOptionData } from '@/lib/configuration'
import type { GallerySlide } from '@/lib/gallery'
import type { Category, Media, Product, Document as PayloadDocument } from '@/payload-types'

type FloorPlanItem = NonNullable<Product['floorPlans']>[number]
type CertificationItem = NonNullable<Product['certifications']>[number]

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const product = result.docs[0]
    if (!product) return { title: 'Product Not Found' }

    return {
      title: `${product.title} | Kwik Built Homes`,
      description: product.excerpt || `${product.title} modular home by Kwik Built Homes`,
    }
  } catch {
    return { title: 'Product | Kwik Built Homes' }
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  let product
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    product = result.docs[0]
  } catch {
    return (
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="border border-amber-200 bg-amber-50 p-6 text-amber-800">
          <h2 className="font-semibold">Database not connected</h2>
          <p className="mt-1 text-sm">
            Add <code className="font-mono bg-amber-100 px-1">DATABASE_URL</code> and{' '}
            <code className="font-mono bg-amber-100 px-1">PAYLOAD_SECRET</code> to your{' '}
            <code className="font-mono bg-amber-100 px-1">.env.local</code> file, then
            restart the dev server.
          </p>
        </div>
      </main>
    )
  }

  if (!product) notFound()

  // --- Data extraction ---
  const heroSrc = getMediaUrl(product.heroImage, 'hero') ?? getMediaUrl(product.heroImage)

  const gallerySlides: GallerySlide[] = extractGallerySlides(product.gallery)

  // Build full slides array: hero + gallery
  const allSlides: GallerySlide[] = []
  if (heroSrc) {
    const heroMedia = product.heroImage as Media
    allSlides.push({
      src: heroSrc,
      alt: getMediaAlt(product.heroImage),
      width: heroMedia?.width ?? 1200,
      height: heroMedia?.height ?? 800,
    })
  }
  allSlides.push(...gallerySlides)

  const floorPlans = (product.floorPlans ?? [])
    .filter((fp: FloorPlanItem) => fp.image && typeof fp.image === 'object' && (fp.image as Media).url)
    .map((fp: FloorPlanItem) => {
      const img = fp.image as Media
      return {
        url: img.url!,
        alt: img.alt ?? product.title,
        label: fp.label ?? undefined,
      }
    })

  const specs = {
    bedrooms: product.bedrooms,
    bathrooms: product.bathrooms,
    floorArea: product.floorArea,
    dimensions: product.dimensions,
    weight: product.weight,
    structuralSystem: product.structuralSystem,
    insulationRating: product.insulationRating,
  }

  const hasSpecs =
    specs.bedrooms != null ||
    specs.bathrooms != null ||
    specs.floorArea != null ||
    (specs.dimensions?.length != null && specs.dimensions?.width != null) ||
    specs.weight != null ||
    specs.structuralSystem ||
    specs.insulationRating

  const compliance = {
    nccClassification: product.nccClassification,
    windRegion: product.windRegion,
    balRating: product.balRating,
    applicableStates: product.applicableStates,
  }

  const hasCompliance =
    compliance.nccClassification ||
    compliance.windRegion ||
    compliance.balRating ||
    (compliance.applicableStates && compliance.applicableStates.length > 0)

  const downloadableCerts = (product.certifications ?? []).filter(
    (cert: CertificationItem) => cert.document && typeof cert.document === 'object' && (cert.document as PayloadDocument).url,
  )

  const configData = extractOptionData(product.optionCategories)

  const descriptionParagraphs = product.description
    ? product.description.split('\n\n').filter((p: string) => p.trim().length > 0)
    : []

  const specRows: { label: string; value: string }[] = []
  if (specs.bedrooms != null) specRows.push({ label: 'Bedrooms', value: String(specs.bedrooms) })
  if (specs.bathrooms != null) specRows.push({ label: 'Bathrooms', value: String(specs.bathrooms) })
  if (specs.floorArea != null) specRows.push({ label: 'Floor Area', value: `${specs.floorArea} m²` })
  if (specs.dimensions?.length != null && specs.dimensions?.width != null) {
    let dim = `${(specs.dimensions.length / 1000).toFixed(1)}m × ${(specs.dimensions.width / 1000).toFixed(1)}m`
    if (specs.dimensions.height != null) dim += ` × ${(specs.dimensions.height / 1000).toFixed(1)}m`
    specRows.push({ label: 'Dimensions (L×W×H)', value: dim })
  }
  if (specs.weight != null) specRows.push({ label: 'Transport Weight', value: `${specs.weight.toLocaleString()} kg` })
  if (specs.structuralSystem) specRows.push({ label: 'Structural System', value: specs.structuralSystem })
  if (specs.insulationRating) specRows.push({ label: 'Insulation Rating', value: specs.insulationRating })

  return (
    <div>
      {/* Full-width Hero Image */}
      {heroSrc && (
        <section className="relative w-full">
          <div className="relative aspect-[21/9] max-md:aspect-[16/9] w-full overflow-hidden">
            <Image
              src={heroSrc}
              alt={getMediaAlt(product.heroImage)}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Bottom gradient overlay with title */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-24 pb-8 px-6">
              <div className="max-w-7xl mx-auto">
                {product.category && typeof product.category === 'object' && (
                  <nav className="text-sm text-white/50 mb-3">
                    <Link href="/products" className="hover:text-white transition-colors">Products</Link>
                    <span className="mx-2">/</span>
                    <Link href={`/categories/${(product.category as Category).slug}`} className="hover:text-white transition-colors">
                      {(product.category as Category).title}
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-white/80">{product.title}</span>
                  </nav>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">{product.title}</h1>
                <div className="mt-3 flex items-center gap-4">
                  <span className="bg-primary px-4 py-1.5 text-lg font-semibold font-mono text-white">
                    {formatPrice(product.priceRange?.from, product.priceRange?.label)}
                  </span>
                  {specs.bedrooms != null && (
                    <span className="text-white/70 text-sm font-mono">{specs.bedrooms} BED</span>
                  )}
                  {specs.floorArea != null && (
                    <span className="text-white/70 text-sm font-mono">{specs.floorArea} m²</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Breadcrumb (when no hero image) */}
        {!heroSrc && (
          <>
            {product.category && typeof product.category === 'object' ? (
              <Link
                href={`/categories/${(product.category as Category).slug}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                &larr; Back to {(product.category as Category).title}
              </Link>
            ) : (
              <Link
                href="/products"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                &larr; Back to products
              </Link>
            )}
            <header className="mt-6 mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{product.title}</h1>
              {product.excerpt && <p className="mt-3 text-lg text-muted-foreground">{product.excerpt}</p>}
              <p className="mt-4">
                <span className="inline-block bg-primary px-4 py-1.5 text-lg font-semibold font-mono text-white">
                  {formatPrice(product.priceRange?.from, product.priceRange?.label)}
                </span>
              </p>
            </header>
          </>
        )}

        {/* Excerpt (when hero image exists, show below) */}
        {heroSrc && product.excerpt && (
          <p className="text-lg text-muted-foreground mb-8">{product.excerpt}</p>
        )}

        {/* 3D Preview */}
        {product.sceneTemplate && (
          <div className="mb-8">
            <ProductPreviewModal slug={slug} title={product.title} />
          </div>
        )}

        {/* Description */}
        {descriptionParagraphs.length > 0 && (
          <AnimateOnScroll>
            <section className="mb-12">
              <div className="w-12 h-0.5 bg-primary mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">Description</h2>
              <div className="space-y-4">
                {descriptionParagraphs.map((paragraph: string, i: number) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          </AnimateOnScroll>
        )}

        {/* Photo Gallery — Carousel */}
        {allSlides.length > 1 && (
          <AnimateOnScroll>
            <section className="mb-12">
              <div className="w-12 h-0.5 bg-primary mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">Gallery</h2>
              <ImageCarousel slides={allSlides} />
            </section>
          </AnimateOnScroll>
        )}

        {/* Floor Plans */}
        {floorPlans.length > 0 && (
          <AnimateOnScroll>
            <section className="mb-12">
              <div className="w-12 h-0.5 bg-primary mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">Floor Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {floorPlans.map((plan: { url: string; alt: string; label?: string }, i: number) => (
                  <div key={i} className="border border-border overflow-hidden">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={plan.url}
                        alt={plan.alt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    {plan.label && (
                      <p className="text-sm font-medium text-center py-2 bg-secondary border-t border-border">
                        {plan.label}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </AnimateOnScroll>
        )}

        {/* Specifications — Card rows */}
        {hasSpecs && (
          <AnimateOnScroll>
            <section className="mb-12">
              <div className="w-12 h-0.5 bg-primary mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">Specifications</h2>
              <div className="border border-border divide-y divide-border">
                {specRows.map((row) => (
                  <div key={row.label} className="flex">
                    <div className="w-1/3 px-4 py-3 text-sm font-medium text-muted-foreground bg-secondary border-r border-border">
                      {row.label}
                    </div>
                    <div className="w-2/3 px-4 py-3 text-sm text-foreground font-mono">
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </AnimateOnScroll>
        )}

        {/* Compliance & Certification */}
        {(hasCompliance || downloadableCerts.length > 0) && (
          <AnimateOnScroll>
            <section className="mb-12">
              <div className="w-12 h-0.5 bg-primary mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
                Compliance &amp; Certification
              </h2>
              <div className="space-y-4">
                {hasCompliance && (
                  <div className="flex flex-wrap gap-3">
                    {compliance.nccClassification && (
                      <span className="inline-flex items-center bg-blue-50 px-3 py-1 text-sm font-mono font-medium text-blue-700 border border-blue-200">
                        NCC Class {compliance.nccClassification}
                      </span>
                    )}
                    {compliance.windRegion && (
                      <span className="inline-flex items-center bg-green-50 px-3 py-1 text-sm font-mono font-medium text-green-700 border border-green-200">
                        Wind Region {compliance.windRegion}
                      </span>
                    )}
                    {compliance.balRating && (
                      <span className="inline-flex items-center bg-orange-50 px-3 py-1 text-sm font-mono font-medium text-orange-700 border border-orange-200">
                        {compliance.balRating}
                      </span>
                    )}
                  </div>
                )}
                {compliance.applicableStates && compliance.applicableStates.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Approved states</p>
                    <div className="flex flex-wrap gap-2">
                      {compliance.applicableStates.map((state: string) => (
                        <span
                          key={state}
                          className="inline-flex items-center bg-secondary px-2.5 py-0.5 text-xs font-mono font-medium text-foreground border border-border"
                        >
                          {state}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {downloadableCerts.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-3">
                      Certification Documents
                    </h3>
                    <div className="space-y-2">
                      {downloadableCerts.map((cert: CertificationItem) => {
                        const doc = cert.document as PayloadDocument
                        return (
                          <a
                            key={cert.id ?? cert.name}
                            href={doc.url!}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 border border-border p-3 hover:border-primary transition-colors"
                          >
                            <FileDown className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                            <div>
                              <span className="text-sm font-medium text-foreground">{cert.name}</span>
                              {cert.type && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {cert.type}
                                </span>
                              )}
                            </div>
                          </a>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </AnimateOnScroll>
        )}

        {/* Options & Variants */}
        {configData.length > 0 && (
          <AnimateOnScroll>
            <section className="mb-12">
              <div className="w-12 h-0.5 bg-primary mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">Options &amp; Variants</h2>
              <ProductConfigurator
                categories={configData}
                basePrice={product.priceRange?.from ?? null}
                productSlug={slug}
              />
            </section>
          </AnimateOnScroll>
        )}
      </main>
    </div>
  )
}
