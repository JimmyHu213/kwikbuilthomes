/* tslint:disable */
/* eslint-disable */
/**
 * This file was manually created based on the Payload collection schemas.
 * Re-generate with: npx tsx node_modules/payload/dist/bin/index.js generate:types
 * when connected to the database.
 */

export interface Config {
  auth: {
    users: UserAuthOperations
  }
  collections: {
    users: User
    products: Product
    categories: Category
    media: Media
    documents: Document
    quotes: Quote
  }
  collectionsJoins: {}
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>
    products: ProductsSelect<false> | ProductsSelect<true>
    categories: CategoriesSelect<false> | CategoriesSelect<true>
    media: MediaSelect<false> | MediaSelect<true>
    documents: DocumentsSelect<false> | DocumentsSelect<true>
    quotes: QuotesSelect<false> | QuotesSelect<true>
  }
  db: {
    defaultIDType: number
  }
  globals: {
    'site-content': SiteContent
  }
  globalsSelect: {
    'site-content': SiteContentSelect<false> | SiteContentSelect<true>
  }
  locale: null
  user: User & {
    collection: 'users'
  }
}

export interface UserAuthOperations {
  forgotPassword: {
    email: string
    password: string
  }
  login: {
    email: string
    password: string
  }
  registerFirstUser: {
    email: string
    password: string
  }
  unlock: {
    email: string
    password: string
  }
}

/**
 * Users collection
 */
export interface User {
  id: number
  name?: string | null
  role?: ('admin' | 'editor') | null
  updatedAt: string
  createdAt: string
  email: string
  resetPasswordToken?: string | null
  resetPasswordExpiration?: string | null
  salt?: string | null
  hash?: string | null
  loginAttempts?: number | null
  lockUntil?: string | null
  password?: string | null
}

/**
 * Products collection
 */
export interface Product {
  id: number
  title: string
  slug: string
  category: number | Category
  excerpt?: string | null
  description?: string | null
  priceRange?: {
    from?: number | null
    to?: number | null
    label?: string | null
  }
  status?: ('draft' | 'active' | 'discontinued') | null
  heroImage?: (number | null) | Media
  gallery?: {
    image: number | Media
    caption?: string | null
    category?: ('exterior' | 'interior' | 'detail' | 'lifestyle') | null
    id?: string | null
  }[]
  floorPlans?: {
    image: number | Media
    label?: string | null
    id?: string | null
  }[]
  dimensions?: {
    length?: number | null
    width?: number | null
    height?: number | null
  }
  bedrooms?: number | null
  bathrooms?: number | null
  floorArea?: number | null
  weight?: number | null
  structuralSystem?: string | null
  insulationRating?: string | null
  nccClassification?: ('1a' | '1b' | '2' | '3' | '10a') | null
  windRegion?: ('A' | 'B' | 'C' | 'D') | null
  balRating?: ('BAL-LOW' | 'BAL-12.5' | 'BAL-19' | 'BAL-29' | 'BAL-40' | 'BAL-FZ') | null
  applicableStates?: ('NSW' | 'VIC' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'NT' | 'ACT')[] | null
  certifications?: {
    name: string
    type?: ('structural' | 'electrical' | 'plumbing' | 'fire-safety' | 'energy-efficiency' | 'other') | null
    document?: (number | null) | Document
    issueDate?: string | null
    expiryDate?: string | null
    id?: string | null
  }[]
  optionCategories?: {
    categoryName: string
    selectionType?: ('single' | 'multiple') | null
    options?: {
      name: string
      description?: string | null
      image?: (number | null) | Media
      priceModifier?: number | null
      id?: string | null
    }[]
    id?: string | null
  }[]
  updatedAt: string
  createdAt: string
  _status?: ('draft' | 'published') | null
}

/**
 * Categories collection
 */
export interface Category {
  id: number
  title: string
  slug: string
  description?: string | null
  displayOrder?: number | null
  updatedAt: string
  createdAt: string
}

/**
 * Media collection
 */
export interface Media {
  id: number
  alt: string
  updatedAt: string
  createdAt: string
  url?: string | null
  thumbnailURL?: string | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
  focalX?: number | null
  focalY?: number | null
  sizes?: {
    thumbnail?: {
      url?: string | null
      width?: number | null
      height?: number | null
      mimeType?: string | null
      filesize?: number | null
      filename?: string | null
    }
    card?: {
      url?: string | null
      width?: number | null
      height?: number | null
      mimeType?: string | null
      filesize?: number | null
      filename?: string | null
    }
    hero?: {
      url?: string | null
      width?: number | null
      height?: number | null
      mimeType?: string | null
      filesize?: number | null
      filename?: string | null
    }
  }
}

/**
 * Documents collection
 */
export interface Document {
  id: number
  title: string
  documentType?: ('compliance' | 'specification' | 'brochure' | 'other') | null
  updatedAt: string
  createdAt: string
  url?: string | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
}

/**
 * Quotes collection
 */
export interface Quote {
  id: number
  referenceNumber: string
  status: 'new' | 'pending' | 'responded' | 'won' | 'lost'
  product?: number | Product | null
  productTitle: string
  productSlug: string
  selectedOptions?: Record<string, unknown> | null
  contactName: string
  contactEmail: string
  contactPhone?: string | null
  company?: string | null
  quantity: number
  deliveryState: 'NSW' | 'VIC' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'NT' | 'ACT'
  deliveryLocation?: string | null
  projectTimeline?: 'immediate' | 'short' | 'medium' | 'long' | 'exploring' | null
  siteConditions?: string | null
  isEstateInquiry?: boolean | null
  numberOfUnits?: number | null
  siteAddress?: string | null
  modelMix?: Record<string, unknown> | null
  additionalNotes?: string | null
  updatedAt: string
  createdAt: string
}

/**
 * SiteContent global
 */
export interface SiteContent {
  id: number
  hero?: {
    headline?: string | null
    tagline?: string | null
    primaryCta?: string | null
    secondaryCta?: string | null
  }
  heroVideo?: (number | null) | Media
  heroPoster?: (number | null) | Media
  stats?: {
    label: string
    value: number
    suffix?: string | null
    id?: string | null
  }[]
  valueProps?: {
    title: string
    description: string
    icon?: ('factory' | 'shield-check' | 'piggy-bank' | 'building-2' | 'clock' | 'truck') | null
    id?: string | null
  }[]
  aboutSummary?: string | null
  ctaBanner?: {
    heading?: string | null
    buttonText?: string | null
  }
  companyStory?: string | null
  dealershipModel?: string | null
  leadership?: {
    name: string
    role: string
    description?: string | null
    id?: string | null
  }[]
  whyModular?: string | null
  steps?: {
    title: string
    description: string
    icon?: ('message-square' | 'pencil-ruler' | 'factory' | 'truck') | null
    id?: string | null
  }[]
  updatedAt?: string | null
  createdAt?: string | null
}

/**
 * Select types for type-safe field selection
 */
export interface UsersSelect<T extends boolean = true> {
  name?: T
  role?: T
  updatedAt?: T
  createdAt?: T
  email?: T
}

export interface ProductsSelect<T extends boolean = true> {
  title?: T
  slug?: T
  category?: T
  excerpt?: T
  description?: T
  priceRange?: T
  status?: T
  heroImage?: T
  gallery?: T
  floorPlans?: T
  dimensions?: T
  bedrooms?: T
  bathrooms?: T
  floorArea?: T
  weight?: T
  structuralSystem?: T
  insulationRating?: T
  nccClassification?: T
  windRegion?: T
  balRating?: T
  applicableStates?: T
  certifications?: T
  optionCategories?: T
  updatedAt?: T
  createdAt?: T
  _status?: T
}

export interface CategoriesSelect<T extends boolean = true> {
  title?: T
  slug?: T
  description?: T
  displayOrder?: T
  updatedAt?: T
  createdAt?: T
}

export interface MediaSelect<T extends boolean = true> {
  alt?: T
  updatedAt?: T
  createdAt?: T
  url?: T
  thumbnailURL?: T
  filename?: T
  mimeType?: T
  filesize?: T
  width?: T
  height?: T
  focalX?: T
  focalY?: T
  sizes?: T
}

export interface DocumentsSelect<T extends boolean = true> {
  title?: T
  documentType?: T
  updatedAt?: T
  createdAt?: T
  url?: T
  filename?: T
  mimeType?: T
  filesize?: T
}

export interface QuotesSelect<T extends boolean = true> {
  referenceNumber?: T
  status?: T
  product?: T
  productTitle?: T
  productSlug?: T
  selectedOptions?: T
  contactName?: T
  contactEmail?: T
  contactPhone?: T
  company?: T
  quantity?: T
  deliveryState?: T
  deliveryLocation?: T
  projectTimeline?: T
  siteConditions?: T
  isEstateInquiry?: T
  numberOfUnits?: T
  siteAddress?: T
  modelMix?: T
  additionalNotes?: T
  updatedAt?: T
  createdAt?: T
}

export interface SiteContentSelect<T extends boolean = true> {
  hero?: T
  heroVideo?: T
  heroPoster?: T
  stats?: T
  valueProps?: T
  aboutSummary?: T
  ctaBanner?: T
  companyStory?: T
  dealershipModel?: T
  leadership?: T
  whyModular?: T
  steps?: T
  updatedAt?: T
  createdAt?: T
}
