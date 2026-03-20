import { describe, it, expect } from 'vitest'
import { Products } from '../Products'
import type { CollectionConfig, Field, TabsField, Tab, ArrayField, GroupField, SelectField } from 'payload'

// Helper to extract the top-level tabs field
function getTabsField(collection: CollectionConfig): TabsField {
  const tabsField = collection.fields.find(
    (f): f is TabsField => 'type' in f && f.type === 'tabs',
  )
  if (!tabsField) throw new Error('No tabs field found')
  return tabsField
}

// Helper to get a specific tab by label
function getTab(collection: CollectionConfig, label: string): Tab {
  const tabsField = getTabsField(collection)
  const tab = tabsField.tabs.find((t) => t.label === label)
  if (!tab) throw new Error(`Tab "${label}" not found`)
  return tab
}

// Helper to find a field by name in an array of fields
function findField(fields: Field[], name: string): Field {
  const field = fields.find((f) => 'name' in f && f.name === name)
  if (!field) throw new Error(`Field "${name}" not found`)
  return field
}

describe('Products collection', () => {
  it('has correct slug', () => {
    expect(Products.slug).toBe('products')
  })

  it('has tabs field type', () => {
    const tabsField = Products.fields.find(
      (f) => 'type' in f && f.type === 'tabs',
    )
    expect(tabsField).toBeDefined()
  })

  it('has exactly 5 tabs', () => {
    const tabsField = getTabsField(Products)
    expect(tabsField.tabs).toHaveLength(5)
  })

  it('has drafts enabled', () => {
    expect(Products.versions).toBeDefined()
    expect((Products.versions as { drafts: boolean }).drafts).toBe(true)
  })

  describe('Basic Information tab', () => {
    it('has all required fields', () => {
      const tab = getTab(Products, 'Basic Information')
      const fieldNames = tab.fields
        .filter((f): f is Field & { name: string } => 'name' in f)
        .map((f) => f.name)

      expect(fieldNames).toContain('title')
      expect(fieldNames).toContain('slug')
      expect(fieldNames).toContain('category')
      expect(fieldNames).toContain('excerpt')
      expect(fieldNames).toContain('description')
      expect(fieldNames).toContain('priceRange')
      expect(fieldNames).toContain('status')
    })

    it('has title as required text field', () => {
      const tab = getTab(Products, 'Basic Information')
      const title = findField(tab.fields, 'title')
      expect(title).toMatchObject({ type: 'text', required: true })
    })

    it('has category as relationship to categories', () => {
      const tab = getTab(Products, 'Basic Information')
      const category = findField(tab.fields, 'category')
      expect(category).toMatchObject({
        type: 'relationship',
        relationTo: 'categories',
        required: true,
      })
    })

    it('has priceRange as a group field', () => {
      const tab = getTab(Products, 'Basic Information')
      const priceRange = findField(tab.fields, 'priceRange') as GroupField
      expect(priceRange.type).toBe('group')
      const subFieldNames = priceRange.fields
        .filter((f): f is Field & { name: string } => 'name' in f)
        .map((f) => f.name)
      expect(subFieldNames).toContain('from')
      expect(subFieldNames).toContain('to')
      expect(subFieldNames).toContain('label')
    })

    it('has status as select with correct options', () => {
      const tab = getTab(Products, 'Basic Information')
      const status = findField(tab.fields, 'status') as SelectField
      expect(status.type).toBe('select')
      const optionValues = status.options.map((o) =>
        typeof o === 'string' ? o : o.value,
      )
      expect(optionValues).toContain('draft')
      expect(optionValues).toContain('active')
      expect(optionValues).toContain('discontinued')
    })
  })

  describe('Media tab', () => {
    it('has heroImage, gallery, and floorPlans fields', () => {
      const tab = getTab(Products, 'Media')
      const fieldNames = tab.fields
        .filter((f): f is Field & { name: string } => 'name' in f)
        .map((f) => f.name)

      expect(fieldNames).toContain('heroImage')
      expect(fieldNames).toContain('gallery')
      expect(fieldNames).toContain('floorPlans')
    })

    it('has heroImage as required upload to media', () => {
      const tab = getTab(Products, 'Media')
      const heroImage = findField(tab.fields, 'heroImage')
      expect(heroImage).toMatchObject({
        type: 'upload',
        relationTo: 'media',
        required: true,
      })
    })

    it('has gallery as array with image, caption, and category', () => {
      const tab = getTab(Products, 'Media')
      const gallery = findField(tab.fields, 'gallery') as ArrayField
      expect(gallery.type).toBe('array')
      const subFieldNames = gallery.fields
        .filter((f): f is Field & { name: string } => 'name' in f)
        .map((f) => f.name)
      expect(subFieldNames).toContain('image')
      expect(subFieldNames).toContain('caption')
      expect(subFieldNames).toContain('category')
    })

    it('has floorPlans as array with image and label', () => {
      const tab = getTab(Products, 'Media')
      const floorPlans = findField(tab.fields, 'floorPlans') as ArrayField
      expect(floorPlans.type).toBe('array')
      const subFieldNames = floorPlans.fields
        .filter((f): f is Field & { name: string } => 'name' in f)
        .map((f) => f.name)
      expect(subFieldNames).toContain('image')
      expect(subFieldNames).toContain('label')
    })
  })

  describe('Compliance & Certification tab', () => {
    it('has compliance fields with structured selects', () => {
      const tab = getTab(Products, 'Compliance & Certification')
      const allFields = tab.fields.flatMap((f) => {
        if ('type' in f && f.type === 'group' && 'fields' in f) {
          return f.fields.filter(
            (sf): sf is Field & { name: string } => 'name' in sf,
          )
        }
        if ('name' in f) return [f]
        return []
      })
      const fieldNames = allFields.map((f) => ('name' in f ? f.name : ''))

      expect(fieldNames).toContain('nccClassification')
      expect(fieldNames).toContain('windRegion')
      expect(fieldNames).toContain('balRating')
      expect(fieldNames).toContain('applicableStates')
      expect(fieldNames).toContain('certifications')
    })

    it('has nccClassification as select with NCC classes', () => {
      const tab = getTab(Products, 'Compliance & Certification')
      // Search in all nested fields (may be in a group)
      let nccField: SelectField | undefined
      for (const f of tab.fields) {
        if ('name' in f && f.name === 'nccClassification') {
          nccField = f as SelectField
          break
        }
        if ('type' in f && f.type === 'group' && 'fields' in f) {
          const found = f.fields.find(
            (sf) => 'name' in sf && sf.name === 'nccClassification',
          )
          if (found) {
            nccField = found as SelectField
            break
          }
        }
      }
      expect(nccField).toBeDefined()
      expect(nccField!.type).toBe('select')
      const values = nccField!.options.map((o) =>
        typeof o === 'string' ? o : o.value,
      )
      expect(values).toContain('1a')
      expect(values).toContain('1b')
      expect(values).toContain('2')
      expect(values).toContain('3')
      expect(values).toContain('10a')
    })

    it('has applicableStates as select with hasMany', () => {
      const tab = getTab(Products, 'Compliance & Certification')
      let statesField: SelectField | undefined
      for (const f of tab.fields) {
        if ('name' in f && f.name === 'applicableStates') {
          statesField = f as SelectField
          break
        }
        if ('type' in f && f.type === 'group' && 'fields' in f) {
          const found = f.fields.find(
            (sf) => 'name' in sf && sf.name === 'applicableStates',
          )
          if (found) {
            statesField = found as SelectField
            break
          }
        }
      }
      expect(statesField).toBeDefined()
      expect(statesField!.type).toBe('select')
      expect(statesField!.hasMany).toBe(true)
      const values = statesField!.options.map((o) =>
        typeof o === 'string' ? o : o.value,
      )
      expect(values).toEqual(
        expect.arrayContaining([
          'NSW',
          'VIC',
          'QLD',
          'SA',
          'WA',
          'TAS',
          'NT',
          'ACT',
        ]),
      )
    })
  })

  describe('Options & Variants tab', () => {
    it('has optionCategories as array field', () => {
      const tab = getTab(Products, 'Options & Variants')
      const optionCategories = findField(
        tab.fields,
        'optionCategories',
      ) as ArrayField
      expect(optionCategories.type).toBe('array')
    })

    it('has nested options array within optionCategories', () => {
      const tab = getTab(Products, 'Options & Variants')
      const optionCategories = findField(
        tab.fields,
        'optionCategories',
      ) as ArrayField
      const subFieldNames = optionCategories.fields
        .filter((f): f is Field & { name: string } => 'name' in f)
        .map((f) => f.name)

      expect(subFieldNames).toContain('categoryName')
      expect(subFieldNames).toContain('selectionType')
      expect(subFieldNames).toContain('options')

      const optionsField = findField(
        optionCategories.fields,
        'options',
      ) as ArrayField
      expect(optionsField.type).toBe('array')
      const optionSubFields = optionsField.fields
        .filter((f): f is Field & { name: string } => 'name' in f)
        .map((f) => f.name)
      expect(optionSubFields).toContain('name')
      expect(optionSubFields).toContain('description')
      expect(optionSubFields).toContain('image')
      expect(optionSubFields).toContain('priceModifier')
    })
  })
})
