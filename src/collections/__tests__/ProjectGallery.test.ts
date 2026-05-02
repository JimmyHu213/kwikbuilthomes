import { describe, it, expect } from 'vitest'
import { ProjectGallery } from '../ProjectGallery'
import type { Field } from 'payload'

// Helper to find a field by name
function findField(fields: Field[], name: string): Field {
  const field = fields.find(
    (f): f is Field & { name: string } => 'name' in f && f.name === name,
  )
  if (!field) throw new Error(`Field "${name}" not found`)
  return field
}

describe('ProjectGallery collection', () => {
  it('has correct slug', () => {
    expect(ProjectGallery.slug).toBe('project-gallery')
  })

  it('has required fields (title, slug)', () => {
    const title = findField(ProjectGallery.fields, 'title')
    expect(title).toMatchObject({
      type: 'text',
      required: true,
    })

    const slug = findField(ProjectGallery.fields, 'slug')
    expect(slug).toMatchObject({
      type: 'text',
      required: true,
      unique: true,
    })
  })

  it('has gallery array field', () => {
    const gallery = findField(ProjectGallery.fields, 'gallery')
    expect(gallery).toMatchObject({
      type: 'array',
    })

    // Check gallery has image sub-field
    const galleryField = gallery as Field & { fields: Field[] }
    const imageField = galleryField.fields.find(
      (f): f is Field & { name: string } => 'name' in f && f.name === 'image',
    )
    expect(imageField).toBeDefined()
    expect(imageField).toMatchObject({
      type: 'upload',
      relationTo: 'media',
      required: true,
    })
  })

  it('has product relationship field', () => {
    const product = findField(ProjectGallery.fields, 'product')
    expect(product).toMatchObject({
      type: 'relationship',
      relationTo: 'products',
    })
  })
})
