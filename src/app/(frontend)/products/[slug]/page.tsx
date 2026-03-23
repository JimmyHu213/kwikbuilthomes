import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { FileDown } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { getMediaUrl, getMediaAlt } from '@/lib/media'
import { formatPrice } from '@/lib/format'
import { PhotoGallery } from '../../components/photo-gallery'
import { extractGallerySlides } from '@/lib/gallery'
import type { GallerySlide } from '@/lib/gallery'
import type { Category, Media, Document as PayloadDocument } from '@/payload-types'

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
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
          <h2 className="font-semibold">Database not connected</h2>
          <p className="mt-1 text-sm">
            Add <code className="font-mono bg-amber-100 px-1 rounded">DATABASE_URL</code> and{' '}
            <code className="font-mono bg-amber-100 px-1 rounded">PAYLOAD_SECRET</code> to your{' '}
            <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code> file, then
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

  const floorPlans = (product.floorPlans ?? [])
    .filter((fp) => fp.image && typeof fp.image === 'object' && (fp.image as Media).url)
    .map((fp) => {
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
    (cert) => cert.document && typeof cert.document === 'object' && (cert.document as PayloadDocument).url,
  )

  const optionCategories = product.optionCategories ?? []

  const descriptionParagraphs = product.description
    ? product.description.split('\n\n').filter((p) => p.trim().length > 0)
    : []

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      {product.category && typeof product.category === 'object' ? (
        <Link
          href={`/categories/${(product.category as Category).slug}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to {(product.category as Category).title}
        </Link>
      ) : (
        <Link
          href="/products"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to products
        </Link>
      )}

      {/* Hero Image */}
      {heroSrc && (
        <section className="mt-6">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
            <Image
              src={heroSrc}
              alt={getMediaAlt(product.heroImage)}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        </section>
      )}

      {/* Title + Price Header */}
      <header className="mt-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.title}</h1>
        {product.excerpt && <p className="mt-3 text-lg text-gray-600">{product.excerpt}</p>}
        <p className="mt-4">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-lg font-semibold text-primary">
            {formatPrice(product.priceRange?.from, product.priceRange?.label)}
          </span>
        </p>
      </header>

      {/* Description */}
      {descriptionParagraphs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
          <div className="space-y-4">
            {descriptionParagraphs.map((paragraph, i) => (
              <p key={i} className="text-gray-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Photo Gallery */}
      {gallerySlides.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Photo Gallery</h2>
          <PhotoGallery slides={gallerySlides} />
        </section>
      )}

      {/* Floor Plans */}
      {floorPlans.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Floor Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {floorPlans.map((plan, i) => (
              <div key={i} className="rounded-lg border border-gray-200 overflow-hidden">
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
                  <p className="text-sm font-medium text-center py-2 bg-gray-50">
                    {plan.label}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Specifications */}
      {hasSpecs && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Specifications</h2>
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {specs.bedrooms != null && (
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 w-1/3">
                      Bedrooms
                    </td>
                    <td className="px-4 py-3 text-gray-900">{specs.bedrooms}</td>
                  </tr>
                )}
                {specs.bathrooms != null && (
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 w-1/3">
                      Bathrooms
                    </td>
                    <td className="px-4 py-3 text-gray-900">{specs.bathrooms}</td>
                  </tr>
                )}
                {specs.floorArea != null && (
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 w-1/3">
                      Floor Area
                    </td>
                    <td className="px-4 py-3 text-gray-900">{specs.floorArea} m&sup2;</td>
                  </tr>
                )}
                {specs.dimensions?.length != null &&
                  specs.dimensions?.width != null && (
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 w-1/3">
                        Dimensions (L x W x H)
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {(specs.dimensions.length / 1000).toFixed(1)}m x{' '}
                        {(specs.dimensions.width / 1000).toFixed(1)}m
                        {specs.dimensions.height != null &&
                          ` x ${(specs.dimensions.height / 1000).toFixed(1)}m`}
                      </td>
                    </tr>
                  )}
                {specs.weight != null && (
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 w-1/3">
                      Transport Weight
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {specs.weight.toLocaleString()} kg
                    </td>
                  </tr>
                )}
                {specs.structuralSystem && (
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 w-1/3">
                      Structural System
                    </td>
                    <td className="px-4 py-3 text-gray-900">{specs.structuralSystem}</td>
                  </tr>
                )}
                {specs.insulationRating && (
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-600 bg-gray-50 w-1/3">
                      Insulation Rating
                    </td>
                    <td className="px-4 py-3 text-gray-900">{specs.insulationRating}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Compliance & Certification */}
      {(hasCompliance || downloadableCerts.length > 0) && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Compliance &amp; Certification
          </h2>
          <div className="space-y-4">
            {hasCompliance && (
              <div className="flex flex-wrap gap-3">
                {compliance.nccClassification && (
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-200">
                    NCC Class {compliance.nccClassification}
                  </span>
                )}
                {compliance.windRegion && (
                  <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-green-200">
                    Wind Region {compliance.windRegion}
                  </span>
                )}
                {compliance.balRating && (
                  <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700 ring-1 ring-orange-200">
                    {compliance.balRating}
                  </span>
                )}
              </div>
            )}
            {compliance.applicableStates && compliance.applicableStates.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Approved states</p>
                <div className="flex flex-wrap gap-2">
                  {compliance.applicableStates.map((state: string) => (
                    <span
                      key={state}
                      className="inline-flex items-center rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                    >
                      {state}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certification Documents */}
            {downloadableCerts.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-700 mb-3">
                  Certification Documents
                </h3>
                <div className="space-y-2">
                  {downloadableCerts.map((cert) => {
                    const doc = cert.document as PayloadDocument
                    return (
                      <a
                        key={cert.id ?? cert.name}
                        href={doc.url!}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <FileDown className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                        <div>
                          <span className="text-sm font-medium text-gray-900">{cert.name}</span>
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
      )}

      {/* Options & Variants */}
      {optionCategories.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Options &amp; Variants</h2>
          <div className="space-y-6">
            {optionCategories.map(
              (cat: {
                id?: string | null
                categoryName: string
                selectionType?: string | null
                options?:
                  | {
                      id?: string | null
                      name: string
                      description?: string | null
                      priceModifier?: number | null
                    }[]
                  | null
              }) => (
                <div key={cat.id ?? cat.categoryName}>
                  <h3 className="text-base font-semibold text-gray-700">
                    {cat.categoryName}
                    {cat.selectionType && (
                      <span className="ml-2 text-xs font-normal text-gray-400">
                        ({cat.selectionType === 'single' ? 'choose one' : 'choose multiple'})
                      </span>
                    )}
                  </h3>
                  {cat.options && cat.options.length > 0 && (
                    <ul className="mt-2 space-y-2">
                      {cat.options.map((opt) => (
                        <li
                          key={opt.id ?? opt.name}
                          className="rounded border border-gray-200 px-4 py-3"
                        >
                          <div className="flex items-baseline justify-between">
                            <span className="font-medium text-gray-900">{opt.name}</span>
                            {opt.priceModifier != null && opt.priceModifier !== 0 && (
                              <span className="text-sm text-gray-500">
                                {opt.priceModifier > 0 ? '+' : ''}$
                                {opt.priceModifier.toLocaleString()}
                              </span>
                            )}
                            {opt.priceModifier === 0 && (
                              <span className="text-sm text-green-600">Included</span>
                            )}
                          </div>
                          {opt.description && (
                            <p className="mt-1 text-sm text-gray-500">{opt.description}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ),
            )}
          </div>
        </section>
      )}
    </main>
  )
}
