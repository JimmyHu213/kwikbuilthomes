import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { MapPin, Building2 } from 'lucide-react'
import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { getMediaUrl, getMediaAlt } from '@/lib/media'
import type { Media, Product } from '@/payload-types'

// ISR: re-render at most every 5 minutes so CMS edits appear without a redeploy
export const revalidate = 300

export const metadata: Metadata = {
  title: 'Project Gallery | KwikBuilt Homes',
  description:
    'Explore completed KwikBuilt modular housing projects across Australia — developments, estates, and builds by our dealer network.',
}

const getCachedProjects = unstable_cache(
  async () => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'project-gallery',
        sort: '-completionDate',
        limit: 50,
        depth: 1,
      })
      return result.docs
    } catch {
      return []
    }
  },
  // Data-layer TTL aligned with the route-level `revalidate = 300` above, which is
  // what actually triggers the page re-render.
  ['project-gallery-listing'],
  { revalidate: 300, tags: ['projects'] },
)

export default async function ProjectsPage() {
  const projects = await getCachedProjects()

  return (
    <div>
      {/* Page Banner */}
      <section className="bg-gradient-to-br from-[#2D2D2D] to-[#3d3d3d] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-12 h-0.5 bg-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Project Gallery
          </h1>
          <p className="mt-3 text-lg text-accent font-medium">
            Completed builds by our dealer network across Australia
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {projects.length === 0 ? (
          <div className="border border-border bg-muted/50 p-6 text-muted-foreground">
            <h2 className="font-semibold">No projects available yet</h2>
            <p className="mt-1 text-sm">
              Create projects in the{' '}
              <Link href="/admin" className="text-foreground underline">
                admin panel
              </Link>{' '}
              to showcase completed builds.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const heroSrc = getMediaUrl(project.heroImage as Media | number | null | undefined, 'card') ?? getMediaUrl(project.heroImage as Media | number | null | undefined)
              const heroAlt = getMediaAlt(project.heroImage as Media | number | null | undefined)
              const productName =
                project.product && typeof project.product === 'object'
                  ? (project.product as Product).title
                  : null

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group border border-border hover:border-primary transition-colors overflow-hidden"
                >
                  {/* Card Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {heroSrc ? (
                      <Image
                        src={heroSrc}
                        alt={heroAlt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Building2 className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                    {/* Units badge */}
                    {project.numberOfUnits != null && (
                      <div className="absolute top-3 right-3 bg-primary px-3 py-1 text-xs font-semibold font-mono text-primary-foreground">
                        {project.numberOfUnits} {project.numberOfUnits === 1 ? 'UNIT' : 'UNITS'}
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="w-8 h-0.5 bg-primary mb-3" />
                    <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h2>
                    {project.location && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {project.location}
                      </p>
                    )}
                    {productName && (
                      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-primary">
                        {productName}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
