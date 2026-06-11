import type { CollectionConfig } from 'payload'
import { revalidateOnChange, revalidateOnDelete } from '@/lib/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  hooks: {
    afterChange: [revalidateOnChange(['catalog'])],
    afterDelete: [revalidateOnDelete(['catalog'])],
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
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first',
      },
    },
  ],
}
