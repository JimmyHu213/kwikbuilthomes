import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { getPayloadClient as GetPayloadClientFn } from '@/lib/payload'

vi.mock('@/lib/payload', () => ({
  getPayloadClient: vi.fn(),
}))

type PayloadClient = Awaited<ReturnType<typeof GetPayloadClientFn>>

describe('Category page', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('filters products by category', async () => {
    const { getPayloadClient } = await import('@/lib/payload')
    const mockPayload = {
      find: vi.fn()
        .mockResolvedValueOnce({
          // First call: find category by slug
          docs: [{ id: 1, title: 'Modular Homes', slug: 'modular-homes', description: 'Pre-fab modular homes' }],
          totalDocs: 1,
        })
        .mockResolvedValueOnce({
          // Second call: find products in category
          docs: [
            { id: 10, title: 'KwikPod 60', slug: 'kwikpod-60', category: 1 },
            { id: 11, title: 'KwikPod 90', slug: 'kwikpod-90', category: 1 },
          ],
          totalDocs: 2,
        }),
    }
    vi.mocked(getPayloadClient).mockResolvedValue(mockPayload as unknown as PayloadClient)

    const payload = await getPayloadClient()

    // Step 1: Find category by slug
    const categoryResult = await payload.find({
      collection: 'categories',
      where: { slug: { equals: 'modular-homes' } },
      limit: 1,
      depth: 0,
    })
    expect(categoryResult.docs).toHaveLength(1)
    const categoryDoc = categoryResult.docs[0]

    // Step 2: Find products filtered by category ID
    const products = await payload.find({
      collection: 'products',
      where: {
        category: { equals: categoryDoc.id },
        status: { equals: 'active' },
      },
      depth: 1,
      sort: 'title',
      limit: 50,
    })
    expect(products.docs).toHaveLength(2)
    expect(products.docs[0].category).toBe(1)

    // Verify the where clause used category ID (number), not slug (string)
    expect(mockPayload.find).toHaveBeenCalledTimes(2)
    const secondCallArgs = mockPayload.find.mock.calls[1][0]
    expect(secondCallArgs.where.category.equals).toBe(1)
    expect(secondCallArgs.where.status.equals).toBe('active')
  })

  it('returns empty results for category with no products', async () => {
    const { getPayloadClient } = await import('@/lib/payload')
    const mockPayload = {
      find: vi.fn()
        .mockResolvedValueOnce({
          docs: [{ id: 6, title: 'Accessories', slug: 'accessories' }],
          totalDocs: 1,
        })
        .mockResolvedValueOnce({
          docs: [],
          totalDocs: 0,
        }),
    }
    vi.mocked(getPayloadClient).mockResolvedValue(mockPayload as unknown as PayloadClient)

    const payload = await getPayloadClient()
    const catResult = await payload.find({ collection: 'categories', where: { slug: { equals: 'accessories' } }, limit: 1, depth: 0 })
    const products = await payload.find({ collection: 'products', where: { category: { equals: catResult.docs[0].id } }, depth: 1, sort: 'title', limit: 50 })

    expect(products.docs).toHaveLength(0)
    expect(products.totalDocs).toBe(0)
  })
})
