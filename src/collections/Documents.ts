import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
    group: 'Uploads',
  },
  upload: {
    mimeTypes: ['application/pdf'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'documentType',
      type: 'select',
      label: 'Document Type',
      options: [
        { label: 'Compliance', value: 'compliance' },
        { label: 'Specification', value: 'specification' },
        { label: 'Brochure', value: 'brochure' },
        { label: 'Other', value: 'other' },
      ],
    },
  ],
}
