import { describe, it, expect } from 'vitest'
import { Categories } from '../Categories'
import type { Field } from 'payload'

// Helper to find a field by name
function findField(fields: Field[], name: string): Field {
  const field = fields.find(
    (f): f is Field & { name: string } => 'name' in f && f.name === name,
  )
  if (!field) throw new Error(`Field "${name}" not found`)
  return field
}

describe('Categories collection', () => {
  it('has correct slug', () => {
    expect(Categories.slug).toBe('categories')
  })

  it('has all required fields', () => {
    const fieldNames = Categories.fields
      .filter((f): f is Field & { name: string } => 'name' in f)
      .map((f) => f.name)

    expect(fieldNames).toContain('title')
    expect(fieldNames).toContain('slug')
    expect(fieldNames).toContain('description')
    expect(fieldNames).toContain('displayOrder')
  })

  it('has slug field with unique constraint', () => {
    const slug = findField(Categories.fields, 'slug')
    expect(slug).toMatchObject({
      type: 'text',
      required: true,
      unique: true,
    })
  })

  it('has displayOrder with default value of 0', () => {
    const displayOrder = findField(Categories.fields, 'displayOrder')
    expect(displayOrder).toMatchObject({
      type: 'number',
      defaultValue: 0,
    })
  })
})
