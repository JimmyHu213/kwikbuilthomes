import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { MapPin, Calendar, Building2, User, Quote } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { getMediaUrl, getMediaAlt } from '@/lib/media'
import { ImageCarousel } from '../../components/image-carousel'
import type { GallerySlide } from '@/lib/gallery'
import type { Media, Product } from '@/payload-types'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'project-gallery',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const project = result.docs[0]
    if (!project) return { title: 'Project Not Found' }

    return {
      title: `${project.title} | KwikBuilt Homes`,
      description:
        project.description ||
        `${project.title} — a completed KwikBuilt modular housing project${project.location ? ` in ${project.location}` : ''}.`,
    }
  } catch {
    return { title: 'Project | KwikBuilt Homes' }
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params

  let project
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'project-gallery',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    project = result.docs[0]
  } catch {
    return (
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="border border-amber-200 bg-amber-50 p-6 text-amber-800">
          <h2 className="font-semibold">Database not connected</h2>
          <p className="mt-1 text-sm">
            Add <code className="font-mono bg-amber-100 px-1">DATABASE_URL</code> and{' '}
            <code className="font-mono bg-amber-100 px-1">PAYLOAD_SECRET</code> to your{' '}
            <code className="font-mono bg-amber-100 px-1">.env.local</code> file, then restart
            the dev server.
          </p>
        </div>
      </main>
    )
  }

  if (!project) notFound()

  // --- Data extraction ---
  const heroSrc =
    getMediaUrl(project.heroImage as Media | number | null | undefined, 'hero') ??
    getMediaUrl(project.heroImage as Media | number | null | undefined)
  const heroAlt = getMediaAlt(project.heroImage as Media | number | null | undefined)
  const heroMedia = project.heroImage as Media | null | undefined

  const productObj =
    project.product && typeof project.product === 'object'
      ? (project.product as Product)
      : null

  const completionFormatted = project.completionDate
    ? new Date(project.completionDate).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'long',
      })
    : null

  // Build gallery slides from gallery array
  const galleryItems = (project.gallery ?? []) as Array<{
    image: Media | number | null
    caption?: string | null
    id?: string | null
  }>
  const gallerySlides: GallerySlide[] = galleryItems
    .filter((item) => item.image && typeof item.image === 'object' && (item.image as Media).url)
    .map((item) => {
      const img = item.image as Media
      return {
        src: img.url!,
        alt: img.alt ?? project.title,
        width: img.width ?? 1200,
        height: img.height ?? 800,
        caption: item.caption ?? undefined,
      }
    })

  // Prepend hero to slides for carousel
  const allSlides: GallerySlide[] = []
  if (heroSrc && heroMedia && typeof heroMedia === 'object') {
    allSlides.push({
      src: heroSrc,
      alt: heroAlt,
      width: heroMedia.width ?? 1200,
      height: heroMedia.height ?? 800,
    })
  }
  allSlides.push(...gallerySlides)

  const descriptionParagraphs = project.description
    ? project.description.split('\n\n').filter((p: string) => p.trim().length > 0)
    : []

  return (
    <div>
      {/* Full-width Hero Image */}
      {heroSrc ? (
        <section className="relative w-full">
          <div className="relative aspect-[21/9] max-md:aspect-[16/9] w-full overflow-hidden">
            <Image
              src={heroSrc}
              alt={heroAlt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Bottom gradient overlay with title */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-24 pb-8 px-6">
              <div className="max-w-7xl mx-auto">
                <nav className="text-sm text-white/50 mb-3">
                  <Link
                    href="/projects"
                    className="hover:text-white transition-colors"
                  >
                    Projects
                  </Link>
                  <span className="mx-2">/</span>
                  <span className="text-white/80">{project.title}</span>
                </nav>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                  {project.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  {project.location && (
                    <span className="flex items-center gap-1.5 text-white/70 text-sm">
                      <MapPin className="w-4 h-4" />
                      {project.location}
                    </span>
                  )}
                  {completionFormatted && (
                    <span className="flex items-center gap-1.5 text-white/70 text-sm">
                      <Calendar className="w-4 h-4" />
                      {completionFormatted}
                    </span>
                  )}
                  {project.numberOfUnits != null && (
                    <span className="bg-primary px-3 py-1 text-sm font-semibold font-mono text-white">
                      {project.numberOfUnits}{' '}
                      {project.numberOfUnits === 1 ? 'UNIT' : 'UNITS'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-[#2D2D2D] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="text-sm text-[#F5F3F0]/50 mb-3">
              <Link
                href="/projects"
                className="hover:text-white transition-colors"
              >
                Projects
              </Link>
              <span className="mx-2">/</span>
              <span className="text-[#F5F3F0]/80">{project.title}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              {project.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              {project.location && (
                <span className="flex items-center gap-1.5 text-[#F5F3F0]/70 text-sm">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </span>
              )}
              {completionFormatted && (
                <span className="flex items-center gap-1.5 text-[#F5F3F0]/70 text-sm">
                  <Calendar className="w-4 h-4" />
                  {completionFormatted}
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Description */}
        {descriptionParagraphs.length > 0 && (
          <section className="mb-12">
            <div className="w-12 h-0.5 bg-primary mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
              About This Project
            </h2>
            <div className="space-y-4">
              {descriptionParagraphs.map((paragraph: string, i: number) => (
                <p key={i} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Project Details */}
        {(productObj || project.developer || project.numberOfUnits != null || completionFormatted) && (
          <section className="mb-12">
            <div className="w-12 h-0.5 bg-primary mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
              Project Details
            </h2>
            <div className="border border-border divide-y divide-border">
              {productObj && (
                <div className="flex">
                  <div className="w-1/3 px-4 py-3 text-sm font-medium text-muted-foreground bg-secondary border-r border-border flex items-center gap-2">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    Product
                  </div>
                  <div className="w-2/3 px-4 py-3 text-sm text-foreground">
                    <Link
                      href={`/products/${productObj.slug}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {productObj.title}
                    </Link>
                  </div>
                </div>
              )}
              {project.developer && (
                <div className="flex">
                  <div className="w-1/3 px-4 py-3 text-sm font-medium text-muted-foreground bg-secondary border-r border-border flex items-center gap-2">
                    <User className="w-4 h-4 flex-shrink-0" />
                    Developer
                  </div>
                  <div className="w-2/3 px-4 py-3 text-sm text-foreground">
                    {project.developer}
                  </div>
                </div>
              )}
              {project.numberOfUnits != null && (
                <div className="flex">
                  <div className="w-1/3 px-4 py-3 text-sm font-medium text-muted-foreground bg-secondary border-r border-border">
                    Units
                  </div>
                  <div className="w-2/3 px-4 py-3 text-sm text-foreground font-mono">
                    {project.numberOfUnits}
                  </div>
                </div>
              )}
              {completionFormatted && (
                <div className="flex">
                  <div className="w-1/3 px-4 py-3 text-sm font-medium text-muted-foreground bg-secondary border-r border-border flex items-center gap-2">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    Completed
                  </div>
                  <div className="w-2/3 px-4 py-3 text-sm text-foreground">
                    {completionFormatted}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Photo Gallery — Carousel */}
        {allSlides.length > 0 && (
          <section className="mb-12">
            <div className="w-12 h-0.5 bg-primary mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
              Gallery
            </h2>
            <ImageCarousel slides={allSlides} />
          </section>
        )}

        {/* Testimonial */}
        {project.testimonial && (
          <section className="mb-12">
            <div className="w-12 h-0.5 bg-primary mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
              Testimonial
            </h2>
            <div className="border-l-4 border-primary bg-secondary p-6">
              <Quote className="w-8 h-8 text-primary/30 mb-3" />
              <blockquote className="text-lg text-foreground leading-relaxed italic">
                &ldquo;{project.testimonial}&rdquo;
              </blockquote>
              {project.developer && (
                <p className="mt-4 text-sm font-medium text-muted-foreground">
                  &mdash; {project.developer}
                </p>
              )}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center pt-4 pb-8">
          <p className="text-muted-foreground mb-6">
            Interested in building with KwikBuilt modular homes?
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Request a Quote
          </Link>
        </section>
      </main>
    </div>
  )
}
