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

  // --- Categories ---

  const modularHomes = await payload.create({
    collection: 'categories',
    data: {
      title: 'Modular Homes',
      slug: 'modular-homes',
      description:
        'Pre-fabricated modular homes for residential developments, granny flats, and small lot housing.',
      displayOrder: 1,
    },
  })
  payload.logger.info(`Created category: ${modularHomes.title} (id: ${modularHomes.id})`)

  const kitHomes = await payload.create({
    collection: 'categories',
    data: {
      title: 'Kit Homes',
      slug: 'kit-homes',
      description:
        'Flat-pack kit homes designed for owner-builders. Delivered as pre-cut components with detailed assembly instructions.',
      displayOrder: 2,
    },
  })
  payload.logger.info(`Created category: ${kitHomes.title} (id: ${kitHomes.id})`)

  const containerHomes = await payload.create({
    collection: 'categories',
    data: {
      title: 'Container Homes',
      slug: 'container-homes',
      description:
        'Converted shipping container dwellings. Robust, transportable, and ideal for remote or temporary sites.',
      displayOrder: 3,
    },
  })
  payload.logger.info(`Created category: ${containerHomes.title} (id: ${containerHomes.id})`)

  const tinyHomes = await payload.create({
    collection: 'categories',
    data: {
      title: 'Tiny Homes',
      slug: 'tiny-homes',
      description:
        'Compact tiny homes under 50sqm. Perfect for granny flats, holiday lets, and affordable housing projects.',
      displayOrder: 4,
    },
  })
  payload.logger.info(`Created category: ${tinyHomes.title} (id: ${tinyHomes.id})`)

  const sheds = await payload.create({
    collection: 'categories',
    data: {
      title: 'Sheds',
      slug: 'sheds',
      description:
        'Steel sheds, workshops, and garages. Available in standard and custom sizes for commercial and residential use.',
      displayOrder: 5,
    },
  })
  payload.logger.info(`Created category: ${sheds.title} (id: ${sheds.id})`)

  const accessories = await payload.create({
    collection: 'categories',
    data: {
      title: 'Accessories',
      slug: 'accessories',
      description:
        'Decks, carports, verandahs, and add-on modules to complement your primary dwelling.',
      displayOrder: 6,
    },
  })
  payload.logger.info(`Created category: ${accessories.title} (id: ${accessories.id})`)

  // --- Products ---

  // == Modular Homes (3 products) ==

  await payload.create({
    collection: 'products',
    data: {
      title: 'KwikPod 60',
      slug: 'kwikpod-60',
      category: modularHomes.id,
      excerpt:
        'Compact 60sqm modular home, 2 bedrooms, ideal for granny flats and small lot developments.',
      description:
        'The KwikPod 60 is our entry-level modular home, delivering a complete 2-bedroom dwelling in a single transportable module. Factory-built to NCC Class 1a standards with light gauge steel framing, it arrives site-ready with full internal fit-out including kitchen, bathroom, and laundry. Ideal for granny flat developments, small lot housing, and rural properties.',
      priceRange: {
        from: 89000,
        label: 'from $89,000 + GST',
      },
      status: 'active',
      nccClassification: '1a',
      windRegion: 'B',
      balRating: 'BAL-12.5',
      applicableStates: ['NSW', 'VIC', 'QLD', 'SA'],
      dimensions: { length: 12000, width: 5000, height: 3200 },
      bedrooms: 2,
      bathrooms: 1,
      floorArea: 60,
      weight: 12000,
      structuralSystem: 'Light gauge steel frame',
      optionCategories: [
        {
          categoryName: 'Cladding Material',
          selectionType: 'single',
          options: [
            {
              name: 'Colorbond Steel',
              description: 'Standard Colorbond steel cladding in a range of colours. Durable and low-maintenance.',
              priceModifier: 0,
            },
            {
              name: 'Weatherboard',
              description: 'Fibre cement weatherboard cladding for a traditional Australian look.',
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
  payload.logger.info('Created product: KwikPod 60')

  await payload.create({
    collection: 'products',
    data: {
      title: 'KwikPod 90',
      slug: 'kwikpod-90',
      category: modularHomes.id,
      excerpt:
        'Spacious 90sqm modular home with 3 bedrooms and open-plan living. Dual-module design for family living.',
      description:
        'The KwikPod 90 is a 3-bedroom family home delivered in two transportable modules that join on-site. Features an open-plan kitchen/living area, master bedroom with ensuite, and a full family bathroom. Engineered for Wind Region B and BAL-19 bushfire zones.',
      priceRange: {
        from: 145000,
        label: 'from $145,000 + GST',
      },
      status: 'active',
      nccClassification: '1a',
      windRegion: 'B',
      balRating: 'BAL-19',
      applicableStates: ['NSW', 'VIC', 'QLD', 'SA', 'WA'],
      dimensions: { length: 15000, width: 6000, height: 3200 },
      bedrooms: 3,
      bathrooms: 2,
      floorArea: 90,
      weight: 18000,
      structuralSystem: 'Light gauge steel frame',
      optionCategories: [
        {
          categoryName: 'Kitchen Package',
          selectionType: 'single',
          options: [
            {
              name: 'Standard Kitchen',
              description: 'Laminate benchtops, stainless steel appliances, soft-close cabinetry.',
              priceModifier: 0,
            },
            {
              name: 'Premium Kitchen',
              description: 'Stone benchtops, premium appliance package, island bench with waterfall edge.',
              priceModifier: 8500,
            },
          ],
        },
      ],
      _status: 'published',
    },
  })
  payload.logger.info('Created product: KwikPod 90')

  await payload.create({
    collection: 'products',
    data: {
      title: 'KwikPod 120',
      slug: 'kwikpod-120',
      category: modularHomes.id,
      excerpt:
        'Premium 120sqm 4-bedroom modular home. Three-module design with double garage option.',
      description:
        'Our flagship modular home, the KwikPod 120 delivers generous 4-bedroom accommodation in three transportable modules. Features include a separate lounge and family room, walk-in pantry, master suite with walk-in robe and ensuite, and optional attached double garage module.',
      priceRange: {
        from: 215000,
        label: 'from $215,000 + GST',
      },
      status: 'active',
      nccClassification: '1a',
      windRegion: 'B',
      balRating: 'BAL-19',
      applicableStates: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS'],
      dimensions: { length: 18000, width: 7200, height: 3200 },
      bedrooms: 4,
      bathrooms: 2,
      floorArea: 120,
      weight: 26000,
      structuralSystem: 'Light gauge steel frame',
      _status: 'published',
    },
  })
  payload.logger.info('Created product: KwikPod 120')

  // == Kit Homes (2 products) ==

  await payload.create({
    collection: 'products',
    data: {
      title: 'KwikKit 80',
      slug: 'kwikkit-80',
      category: kitHomes.id,
      excerpt:
        'Affordable 80sqm kit home for owner-builders. Pre-cut steel frame with comprehensive assembly guide.',
      description:
        'The KwikKit 80 is a 3-bedroom kit home delivered as pre-cut light gauge steel framing with all fixings, cladding, roofing, windows, and doors. Designed for competent owner-builders or local trades. Includes detailed step-by-step assembly manual and engineering certification.',
      priceRange: {
        from: 62000,
        label: 'from $62,000 + GST',
      },
      status: 'active',
      nccClassification: '1a',
      windRegion: 'B',
      balRating: 'BAL-12.5',
      applicableStates: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS'],
      dimensions: { length: 13000, width: 6200, height: 3000 },
      bedrooms: 3,
      bathrooms: 1,
      floorArea: 80,
      weight: 8500,
      structuralSystem: 'Light gauge steel frame (flat-pack)',
      optionCategories: [
        {
          categoryName: 'Roofing',
          selectionType: 'single',
          options: [
            {
              name: 'Colorbond Corrugated',
              description: 'Standard Colorbond corrugated roofing in a range of colours.',
              priceModifier: 0,
            },
            {
              name: 'Colorbond Standing Seam',
              description: 'Premium standing seam roofing for a modern architectural look.',
              priceModifier: 3200,
            },
          ],
        },
      ],
      _status: 'published',
    },
  })
  payload.logger.info('Created product: KwikKit 80')

  await payload.create({
    collection: 'products',
    data: {
      title: 'KwikKit 110',
      slug: 'kwikkit-110',
      category: kitHomes.id,
      excerpt:
        'Family-sized 110sqm kit home with 4 bedrooms. Includes verandah framing and optional carport.',
      description:
        'The KwikKit 110 is our largest kit home, providing 4-bedroom family accommodation with an integrated verandah. Delivered flat-pack with pre-cut steel framing, this kit is designed for professional builders or experienced owner-builders working with local trades.',
      priceRange: {
        from: 88000,
        label: 'from $88,000 + GST',
      },
      status: 'active',
      nccClassification: '1a',
      windRegion: 'B',
      balRating: 'BAL-12.5',
      applicableStates: ['NSW', 'VIC', 'QLD', 'SA'],
      dimensions: { length: 16000, width: 7000, height: 3000 },
      bedrooms: 4,
      bathrooms: 2,
      floorArea: 110,
      weight: 11000,
      structuralSystem: 'Light gauge steel frame (flat-pack)',
      _status: 'published',
    },
  })
  payload.logger.info('Created product: KwikKit 110')

  // == Container Homes (2 products) ==

  await payload.create({
    collection: 'products',
    data: {
      title: 'Container Studio 20',
      slug: 'container-studio-20',
      category: containerHomes.id,
      excerpt:
        'Self-contained 20ft container studio with kitchenette and bathroom. Ideal for site offices and holiday lets.',
      description:
        'The Container Studio 20 converts a standard 20ft shipping container into a fully self-contained studio dwelling. Includes kitchenette, bathroom with shower, living/sleeping area, split-system air conditioning, and full electrical fit-out. Transportable by standard tilt-tray truck.',
      priceRange: {
        from: 45000,
        label: 'from $45,000 + GST',
      },
      status: 'active',
      nccClassification: '1a',
      windRegion: 'B',
      balRating: 'BAL-LOW',
      applicableStates: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'NT'],
      dimensions: { length: 6058, width: 2438, height: 2896 },
      bedrooms: 0,
      bathrooms: 1,
      floorArea: 15,
      weight: 3800,
      structuralSystem: 'Corten steel container',
      _status: 'published',
    },
  })
  payload.logger.info('Created product: Container Studio 20')

  await payload.create({
    collection: 'products',
    data: {
      title: 'Container Duo 40',
      slug: 'container-duo-40',
      category: containerHomes.id,
      excerpt:
        'Two joined 20ft containers creating a 1-bedroom home with open-plan living. Expandable design.',
      description:
        'The Container Duo 40 joins two 20ft containers side-by-side with a structural opening between them, creating a spacious 1-bedroom home with separate living area, full kitchen, and bathroom. The modular design allows future expansion with additional container modules.',
      priceRange: {
        from: 78000,
        label: 'from $78,000 + GST',
      },
      status: 'active',
      nccClassification: '1a',
      windRegion: 'B',
      balRating: 'BAL-LOW',
      applicableStates: ['NSW', 'VIC', 'QLD', 'SA', 'WA'],
      dimensions: { length: 6058, width: 4876, height: 2896 },
      bedrooms: 1,
      bathrooms: 1,
      floorArea: 30,
      weight: 7200,
      structuralSystem: 'Corten steel container (dual module)',
      optionCategories: [
        {
          categoryName: 'Exterior Finish',
          selectionType: 'single',
          options: [
            {
              name: 'Industrial (painted container)',
              description: 'Factory-painted container exterior in your choice of colour.',
              priceModifier: 0,
            },
            {
              name: 'Timber-look Cladding',
              description: 'Composite timber-look cladding over container shell for a residential appearance.',
              priceModifier: 6500,
            },
          ],
        },
      ],
      _status: 'published',
    },
  })
  payload.logger.info('Created product: Container Duo 40')

  // == Tiny Homes (3 products) ==

  await payload.create({
    collection: 'products',
    data: {
      title: 'TinyPod 25',
      slug: 'tinypod-25',
      category: tinyHomes.id,
      excerpt:
        'Ultra-compact 25sqm tiny home on wheels. Towable, self-contained, and ready to live in.',
      description:
        'The TinyPod 25 is a fully self-contained tiny home built on a heavy-duty trailer chassis, making it towable and exempt from some building permit requirements. Features a sleeping loft, compact kitchen, wet bathroom, and living area. Ideal for holiday parks, farm stays, and minimalist living.',
      priceRange: {
        from: 68000,
        label: 'from $68,000 + GST',
      },
      status: 'active',
      nccClassification: '1a',
      windRegion: 'B',
      balRating: 'BAL-LOW',
      applicableStates: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS'],
      dimensions: { length: 7200, width: 3500, height: 4200 },
      bedrooms: 1,
      bathrooms: 1,
      floorArea: 25,
      weight: 4500,
      structuralSystem: 'Steel frame on trailer chassis',
      _status: 'published',
    },
  })
  payload.logger.info('Created product: TinyPod 25')

  await payload.create({
    collection: 'products',
    data: {
      title: 'TinyPod 35',
      slug: 'tinypod-35',
      category: tinyHomes.id,
      excerpt:
        'Comfortable 35sqm tiny home with separate bedroom. Fixed foundation, NCC Class 1a compliant.',
      description:
        'The TinyPod 35 is a fixed-foundation tiny home with a separate bedroom, open-plan kitchen/living, and full bathroom. Designed for permanent installation as a secondary dwelling or granny flat. Meets NCC Class 1a requirements for all mainland states.',
      priceRange: {
        from: 82000,
        label: 'from $82,000 + GST',
      },
      status: 'active',
      nccClassification: '1a',
      windRegion: 'B',
      balRating: 'BAL-12.5',
      applicableStates: ['NSW', 'VIC', 'QLD', 'SA', 'WA'],
      dimensions: { length: 8500, width: 4200, height: 3200 },
      bedrooms: 1,
      bathrooms: 1,
      floorArea: 35,
      weight: 6500,
      structuralSystem: 'Light gauge steel frame',
      _status: 'published',
    },
  })
  payload.logger.info('Created product: TinyPod 35')

  await payload.create({
    collection: 'products',
    data: {
      title: 'TinyPod 45',
      slug: 'tinypod-45',
      category: tinyHomes.id,
      excerpt:
        'Spacious 45sqm tiny home with 2 bedrooms. Maximum living in minimal footprint.',
      description:
        'The TinyPod 45 pushes the tiny home concept to its practical limits with 2 bedrooms, a full kitchen, bathroom, and combined living/dining area in just 45 square metres. Smart storage solutions and multi-functional furniture maximise usable space.',
      priceRange: {
        from: 98000,
        label: 'from $98,000 + GST',
      },
      status: 'active',
      nccClassification: '1a',
      windRegion: 'B',
      balRating: 'BAL-12.5',
      applicableStates: ['NSW', 'VIC', 'QLD', 'SA'],
      dimensions: { length: 10000, width: 4500, height: 3200 },
      bedrooms: 2,
      bathrooms: 1,
      floorArea: 45,
      weight: 8200,
      structuralSystem: 'Light gauge steel frame',
      _status: 'published',
    },
  })
  payload.logger.info('Created product: TinyPod 45')

  // == Sheds (2 products) ==

  await payload.create({
    collection: 'products',
    data: {
      title: 'KwikShed 50',
      slug: 'kwikshed-50',
      category: sheds.id,
      excerpt:
        'Versatile 50sqm steel workshop shed. Ideal for home workshops, storage, and small commercial use.',
      description:
        'The KwikShed 50 is a general-purpose steel shed suitable for workshops, vehicle storage, and light commercial use. Features include a roller door, personal access door, and optional mezzanine floor. Delivered as a flat-pack kit with all steel framing, roofing, and cladding.',
      priceRange: {
        from: 18000,
        label: 'from $18,000 + GST',
      },
      status: 'active',
      nccClassification: '10a',
      windRegion: 'B',
      balRating: 'BAL-LOW',
      applicableStates: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
      dimensions: { length: 10000, width: 5000, height: 3500 },
      floorArea: 50,
      weight: 2800,
      structuralSystem: 'Portal frame steel',
      optionCategories: [
        {
          categoryName: 'Door Configuration',
          selectionType: 'single',
          options: [
            {
              name: 'Single Roller Door (3m)',
              description: 'One 3m wide roller door on the front wall.',
              priceModifier: 0,
            },
            {
              name: 'Double Roller Door (3m + 3m)',
              description: 'Two 3m wide roller doors for drive-through access.',
              priceModifier: 2200,
            },
          ],
        },
      ],
      _status: 'published',
    },
  })
  payload.logger.info('Created product: KwikShed 50')

  await payload.create({
    collection: 'products',
    data: {
      title: 'KwikShed 100',
      slug: 'kwikshed-100',
      category: sheds.id,
      excerpt:
        'Large 100sqm commercial-grade shed with 4.5m clearance. Suitable for machinery and large vehicle storage.',
      description:
        'The KwikShed 100 is a commercial-grade steel shed with high internal clearance, designed for machinery storage, large vehicles, and light industrial use. Features include heavy-duty portal frame construction, 4.5m roller door, and optional insulation package.',
      priceRange: {
        from: 32000,
        label: 'from $32,000 + GST',
      },
      status: 'active',
      nccClassification: '10a',
      windRegion: 'C',
      balRating: 'BAL-LOW',
      applicableStates: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
      dimensions: { length: 14000, width: 7200, height: 4500 },
      floorArea: 100,
      weight: 5200,
      structuralSystem: 'Portal frame steel (heavy duty)',
      _status: 'published',
    },
  })
  payload.logger.info('Created product: KwikShed 100')

  // == Accessories (2 products) ==

  await payload.create({
    collection: 'products',
    data: {
      title: 'KwikDeck 20',
      slug: 'kwikdeck-20',
      category: accessories.id,
      excerpt:
        'Modular 20sqm composite deck. Bolt-on accessory for any KwikPod or TinyPod dwelling.',
      description:
        'The KwikDeck 20 is a pre-fabricated composite timber deck designed to bolt directly onto any KwikPod or TinyPod dwelling. Features adjustable steel sub-frame, composite decking boards (no painting or oiling required), and integrated handrail system.',
      priceRange: {
        from: 8500,
        label: 'from $8,500 + GST',
      },
      status: 'active',
      nccClassification: '10a',
      windRegion: 'B',
      balRating: 'BAL-12.5',
      applicableStates: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
      dimensions: { length: 5000, width: 4000, height: 600 },
      floorArea: 20,
      weight: 450,
      structuralSystem: 'Steel sub-frame with composite decking',
      _status: 'published',
    },
  })
  payload.logger.info('Created product: KwikDeck 20')

  await payload.create({
    collection: 'products',
    data: {
      title: 'KwikPort 30',
      slug: 'kwikport-30',
      category: accessories.id,
      excerpt:
        'Free-standing 30sqm carport with Colorbond roof. Protects 2 vehicles or provides covered outdoor area.',
      description:
        'The KwikPort 30 is a free-standing steel carport with Colorbond roofing, suitable for two vehicles or as a covered outdoor entertainment area. Delivered as a flat-pack kit with all steel framing, roofing, and concrete anchor bolts. Can be positioned adjacent to any dwelling or as a standalone structure.',
      priceRange: {
        from: 6500,
        label: 'from $6,500 + GST',
      },
      status: 'active',
      nccClassification: '10a',
      windRegion: 'B',
      balRating: 'BAL-LOW',
      applicableStates: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
      dimensions: { length: 6000, width: 5000, height: 3000 },
      floorArea: 30,
      weight: 380,
      structuralSystem: 'Steel post and beam',
      _status: 'published',
    },
  })
  payload.logger.info('Created product: KwikPort 30')

  payload.logger.info('Seed complete. Created 6 categories and 16 products.')
}
