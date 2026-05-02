import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { getMediaUrl } from '@/lib/media'
import { SitePlanner } from '../components/planner/site-planner'
import type { ProductForPlanner } from '@/lib/planner/types'
import type { Media } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Designer',
  description: 'Design your modular housing layout with our interactive 3D designer.',
}

type Props = {
  searchParams: Promise<{ product?: string }>
}

export default async function DesignerPage({ searchParams }: Props) {
  const { product: preselectedSlug } = await searchParams
  let products: ProductForPlanner[] = []

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: {
        sceneTemplate: { exists: true },
        status: { equals: 'active' },
      },
      limit: 100,
      depth: 1,
    })

    products = result.docs.map((product) => ({
      id: product.id,
      title: product.title,
      slug: product.slug,
      dimensions: product.dimensions ?? null,
      floorArea: product.floorArea ?? null,
      priceRange: product.priceRange ?? null,
      templateThumbnailUrl: product.templateThumbnail
        ? getMediaUrl(product.templateThumbnail as Media, 'thumbnail') ?? getMediaUrl(product.templateThumbnail as Media)
        : null,
      hasSceneTemplate: true,
    }))
  } catch {
    // Database not connected — render with empty products
  }

  return <SitePlanner products={products} preselectedSlug={preselectedSlug} />
}
