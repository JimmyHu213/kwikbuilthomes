import type { CollectionConfig } from 'payload'

export const ProjectGallery: CollectionConfig = {
  slug: 'project-gallery',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'product', 'completionDate'],
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'e.g. "Melbourne, VIC"',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'completionDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Image',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Additional Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      label: 'Product Used',
    },
    {
      name: 'developer',
      type: 'text',
      label: 'Developer / Builder',
    },
    {
      name: 'numberOfUnits',
      type: 'number',
      label: 'Number of Units',
    },
    {
      name: 'testimonial',
      type: 'textarea',
      label: 'Testimonial',
      admin: {
        description: 'Builder or developer quote about the project',
      },
    },
  ],
}
