import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })

    const product = result.docs[0]
    if (!product || !product.sceneTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json({ sceneTemplate: product.sceneTemplate })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
