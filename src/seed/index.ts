import { getPayload } from 'payload'
import config from '@payload-config'

export async function seed() {
  const payload = await getPayload({ config })

  // Check if seed data already exists
  const existingCategories = await payload.find({
    collection: 'categories',
    where: { slug: { equals: 'modular-homes' } },
    limit: 1,
  })

  if (existingCategories.docs.length > 0) {
    payload.logger.info('Seed data already exists, skipping.')
    return
  }

  payload.logger.info('Seeding database...')

  // Create category
  const category = await payload.create({
    collection: 'categories',
    data: {
      title: 'Modular Homes',
      slug: 'modular-homes',
      description:
        'Pre-fabricated modular homes for residential developments, granny flats, and small lot housing.',
      displayOrder: 1,
    },
  })

  payload.logger.info(`Created category: ${category.title} (id: ${category.id})`)

  // Create product (without heroImage — requires file upload)
  const product = await payload.create({
    collection: 'products',
    data: {
      title: 'KwikPod 60',
      slug: 'kwikpod-60',
      category: category.id,
      excerpt:
        'Compact 60sqm modular home, 2 bedrooms, ideal for granny flats and small lot developments.',
      priceRange: {
        from: 89000,
        label: 'from $89,000 + GST',
      },
      status: 'active',
      // Compliance & Certification tab fields (spread directly into product)
      nccClassification: '1a',
      windRegion: 'B',
      balRating: 'BAL-12.5',
      applicableStates: ['NSW', 'VIC', 'QLD', 'SA'],
      // Specifications tab fields (spread directly into product)
      dimensions: {
        length: 12000,
        width: 5000,
        height: 3200,
      },
      bedrooms: 2,
      bathrooms: 1,
      floorArea: 60,
      weight: 12000,
      structuralSystem: 'Light gauge steel frame',
      // Options & Variants tab
      optionCategories: [
        {
          categoryName: 'Cladding Material',
          selectionType: 'single',
          options: [
            {
              name: 'Colorbond Steel',
              description:
                'Standard Colorbond steel cladding in a range of colours. Durable and low-maintenance.',
              priceModifier: 0,
            },
            {
              name: 'Weatherboard',
              description:
                'Fibre cement weatherboard cladding for a traditional Australian look.',
              priceModifier: 4500,
            },
          ],
        },
        {
          categoryName: 'Flooring',
          selectionType: 'single',
          options: [
            {
              name: 'Vinyl Plank',
              description: 'Durable waterproof vinyl plank flooring throughout.',
              priceModifier: 0,
            },
            {
              name: 'Hybrid Timber',
              description: 'Premium hybrid timber-look flooring with superior acoustic rating.',
              priceModifier: 2800,
            },
          ],
        },
      ],
      _status: 'published',
    },
  })

  payload.logger.info(`Created product: ${product.title} (id: ${product.id})`)
  payload.logger.info('Seed complete.')
}
