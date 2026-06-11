import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
    group: 'Uploads',
  },
  access: {
    // Public read: compliance PDFs, specs, and brochures must be downloadable
    // by anonymous visitors. Create/update/delete stay default (authenticated only).
    read: () => true,
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
