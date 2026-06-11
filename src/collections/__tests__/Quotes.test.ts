import { describe, it, expect } from 'vitest'
import { Quotes } from '../Quotes'
import type { CollectionConfig, Field, TabsField, Tab, SelectField } from 'payload'

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

describe('Quotes collection', () => {
  it('has correct slug', () => {
    expect(Quotes.slug).toBe('quotes')
  })

  it('has correct fields for all data categories', () => {
    const tabsField = getTabsField(Quotes)
    expect(tabsField).toBeDefined()

    // Quote Details tab
    const detailsTab = getTab(Quotes, 'Quote Details')
    const referenceNumber = findField(detailsTab.fields, 'referenceNumber')
    expect(referenceNumber).toMatchObject({ type: 'text', required: true, unique: true })

    const status = findField(detailsTab.fields, 'status') as SelectField
    expect(status.type).toBe('select')
    const statusValues = status.options.map((o) =>
      typeof o === 'string' ? o : o.value,
    )
    expect(statusValues).toEqual(
      expect.arrayContaining(['new', 'pending', 'responded', 'won', 'lost']),
    )

    // Product tab
    const productTab = getTab(Quotes, 'Product')
    const product = findField(productTab.fields, 'product')
    expect(product).toMatchObject({ type: 'relationship', relationTo: 'products' })
    const productTitle = findField(productTab.fields, 'productTitle')
    expect(productTitle).toMatchObject({ type: 'text' })
    const productSlug = findField(productTab.fields, 'productSlug')
    expect(productSlug).toMatchObject({ type: 'text' })
    const selectedOptions = findField(productTab.fields, 'selectedOptions')
    expect(selectedOptions).toMatchObject({ type: 'json' })
  })

  it('has contact fields', () => {
    const contactTab = getTab(Quotes, 'Contact')
    const contactName = findField(contactTab.fields, 'contactName')
    expect(contactName).toMatchObject({ type: 'text', required: true })
    const contactEmail = findField(contactTab.fields, 'contactEmail')
    expect(contactEmail).toMatchObject({ type: 'email', required: true })
    const contactPhone = findField(contactTab.fields, 'contactPhone')
    expect(contactPhone).toMatchObject({ type: 'text' })
    const company = findField(contactTab.fields, 'company')
    expect(company).toMatchObject({ type: 'text' })
  })

  it('has project detail fields', () => {
    const projectTab = getTab(Quotes, 'Project Details')
    const quantity = findField(projectTab.fields, 'quantity')
    expect(quantity).toMatchObject({ type: 'number' })
    const deliveryState = findField(projectTab.fields, 'deliveryState') as SelectField
    expect(deliveryState.type).toBe('select')
    const stateValues = deliveryState.options.map((o) =>
      typeof o === 'string' ? o : o.value,
    )
    expect(stateValues).toEqual(
      expect.arrayContaining(['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT']),
    )
    const deliveryLocation = findField(projectTab.fields, 'deliveryLocation')
    expect(deliveryLocation).toMatchObject({ type: 'text' })
    const projectTimeline = findField(projectTab.fields, 'projectTimeline') as SelectField
    expect(projectTimeline.type).toBe('select')
    const siteConditions = findField(projectTab.fields, 'siteConditions')
    expect(siteConditions).toMatchObject({ type: 'textarea' })
  })

  it('has estate inquiry fields', () => {
    const estateTab = getTab(Quotes, 'Estate Inquiry')
    const isEstateInquiry = findField(estateTab.fields, 'isEstateInquiry')
    expect(isEstateInquiry).toMatchObject({ type: 'checkbox' })
    const numberOfUnits = findField(estateTab.fields, 'numberOfUnits')
    expect(numberOfUnits).toMatchObject({ type: 'number' })
    const siteAddress = findField(estateTab.fields, 'siteAddress')
    expect(siteAddress).toMatchObject({ type: 'textarea' })
    const modelMix = findField(estateTab.fields, 'modelMix')
    expect(modelMix).toMatchObject({ type: 'json' })
  })

  it('has correct access control: create is blocked via API, read/update/delete require user', () => {
    const access = Quotes.access!
    type AccessFn = (...args: unknown[]) => unknown
    // create returns false — quotes are created via server actions through the
    // Local API (which bypasses access control), never the public REST API
    expect((access.create as unknown as AccessFn)({ req: {} })).toBe(false)
    expect((access.create as unknown as AccessFn)({ req: { user: { id: 1 } } })).toBe(false)
    // read/update/delete require user
    expect((access.read as unknown as AccessFn)({ req: { user: null } })).toBeFalsy()
    expect((access.read as unknown as AccessFn)({ req: { user: { id: 1 } } })).toBeTruthy()
    expect((access.update as unknown as AccessFn)({ req: { user: null } })).toBeFalsy()
    expect((access.update as unknown as AccessFn)({ req: { user: { id: 1 } } })).toBeTruthy()
    expect((access.delete as unknown as AccessFn)({ req: { user: null } })).toBeFalsy()
    expect((access.delete as unknown as AccessFn)({ req: { user: { id: 1 } } })).toBeTruthy()
  })

  it('has correct admin config', () => {
    expect(Quotes.admin?.useAsTitle).toBe('referenceNumber')
    expect(Quotes.admin?.group).toBe('Quotes')
  })
})
