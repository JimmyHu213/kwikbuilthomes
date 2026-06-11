import { describe, it, expect } from 'vitest'
import { Documents } from '../Documents'
import type { Field, SelectField } from 'payload'

describe('Documents collection', () => {
  it('has correct slug', () => {
    expect(Documents.slug).toBe('documents')
  })

  it('has upload config restricted to PDFs', () => {
    expect(Documents.upload).toBeDefined()
    const upload = Documents.upload as Record<string, unknown>
    expect(upload.mimeTypes).toEqual(['application/pdf'])
  })

  it('allows public read access for anonymous visitors', () => {
    const access = Documents.access!
    type AccessFn = (...args: unknown[]) => unknown
    expect((access.read as unknown as AccessFn)({ req: { user: null } })).toBe(true)
    // create/update/delete stay default (authenticated only)
    expect(access.create).toBeUndefined()
    expect(access.update).toBeUndefined()
    expect(access.delete).toBeUndefined()
  })

  it('has title field that is required', () => {
    const titleField = Documents.fields.find(
      (f): f is Field & { name: string } => 'name' in f && f.name === 'title',
    )
    expect(titleField).toBeDefined()
    expect(titleField).toMatchObject({
      type: 'text',
      required: true,
    })
  })

  it('has documentType select with expected options', () => {
    const documentType = Documents.fields.find(
      (f): f is SelectField => 'name' in f && f.name === 'documentType',
    )
    expect(documentType).toBeDefined()
    expect(documentType!.type).toBe('select')
    const values = documentType!.options.map((o) => (typeof o === 'string' ? o : o.value))
    expect(values).toEqual(
      expect.arrayContaining(['compliance', 'specification', 'brochure', 'other']),
    )
  })

  it('has correct admin config', () => {
    expect(Documents.admin?.useAsTitle).toBe('title')
    expect(Documents.admin?.group).toBe('Uploads')
  })
})
