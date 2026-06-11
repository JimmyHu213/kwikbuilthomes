import { describe, it, expect } from 'vitest'
import { Media } from '../Media'
import type { Field } from 'payload'

describe('Media collection', () => {
  it('has correct slug', () => {
    expect(Media.slug).toBe('media')
  })

  it('has upload config with correct mimeTypes', () => {
    expect(Media.upload).toBeDefined()
    const upload = Media.upload as Record<string, unknown>
    expect(upload.mimeTypes).toEqual(['image/*', 'video/mp4'])
  })

  it('has three image sizes configured', () => {
    const upload = Media.upload as Record<string, unknown>
    const imageSizes = upload.imageSizes as Array<{ name: string }>
    expect(imageSizes).toHaveLength(3)

    const sizeNames = imageSizes.map((s) => s.name)
    expect(sizeNames).toContain('thumbnail')
    expect(sizeNames).toContain('card')
    expect(sizeNames).toContain('hero')
  })

  it('has thumbnail at 400x300', () => {
    const upload = Media.upload as Record<string, unknown>
    const imageSizes = upload.imageSizes as Array<{
      name: string
      width: number
      height: number
    }>
    const thumbnail = imageSizes.find((s) => s.name === 'thumbnail')
    expect(thumbnail).toBeDefined()
    expect(thumbnail!.width).toBe(400)
    expect(thumbnail!.height).toBe(300)
  })

  it('has card at 768x512', () => {
    const upload = Media.upload as Record<string, unknown>
    const imageSizes = upload.imageSizes as Array<{
      name: string
      width: number
      height: number
    }>
    const card = imageSizes.find((s) => s.name === 'card')
    expect(card).toBeDefined()
    expect(card!.width).toBe(768)
    expect(card!.height).toBe(512)
  })

  it('has hero at 1920 width', () => {
    const upload = Media.upload as Record<string, unknown>
    const imageSizes = upload.imageSizes as Array<{
      name: string
      width: number
      height?: number
    }>
    const hero = imageSizes.find((s) => s.name === 'hero')
    expect(hero).toBeDefined()
    expect(hero!.width).toBe(1920)
  })

  it('allows public read access for anonymous visitors', () => {
    const access = Media.access!
    type AccessFn = (...args: unknown[]) => unknown
    expect((access.read as unknown as AccessFn)({ req: { user: null } })).toBe(true)
    // create/update/delete stay default (authenticated only)
    expect(access.create).toBeUndefined()
    expect(access.update).toBeUndefined()
    expect(access.delete).toBeUndefined()
  })

  it('has alt text field that is required', () => {
    const altField = Media.fields.find(
      (f): f is Field & { name: string } => 'name' in f && f.name === 'alt',
    )
    expect(altField).toBeDefined()
    expect(altField).toMatchObject({
      type: 'text',
      required: true,
    })
  })
})
