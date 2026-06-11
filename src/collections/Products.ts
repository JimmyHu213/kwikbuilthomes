import type { CollectionConfig } from 'payload'
import { complianceFields } from '../fields/compliance'
import { specificationFields } from '../fields/specifications'
import { revalidateOnChange, revalidateOnDelete } from '@/lib/revalidate'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'updatedAt'],
    group: 'Content',
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidateOnChange(['catalog'])],
    afterDelete: [revalidateOnDelete(['catalog'])],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Information',
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
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              required: true,
            },
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Excerpt',
              admin: {
                description: 'Short summary for product listings',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
            },
            {
              name: 'priceRange',
              type: 'group',
              label: 'Price Range',
              fields: [
                {
                  name: 'from',
                  type: 'number',
                  label: 'From ($)',
                },
                {
                  name: 'to',
                  type: 'number',
                  label: 'To ($)',
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Display Label',
                  admin: {
                    description: 'e.g., "From $120,000" or "Contact for pricing"',
                  },
                },
              ],
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'draft',
              // Distinct enum name: without it the Postgres adapter maps this field
              // and the drafts-internal _status column to the same enum type
              enumName: 'enum_products_listing_status',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Active', value: 'active' },
                { label: 'Discontinued', value: 'discontinued' },
              ],
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Image',
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Image Gallery',
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
                {
                  name: 'category',
                  type: 'select',
                  options: [
                    { label: 'Exterior', value: 'exterior' },
                    { label: 'Interior', value: 'interior' },
                    { label: 'Detail', value: 'detail' },
                    { label: 'Lifestyle', value: 'lifestyle' },
                  ],
                },
              ],
            },
            {
              name: 'floorPlans',
              type: 'array',
              label: 'Floor Plans',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Floor Plan Label',
                  admin: {
                    description: 'e.g., "Ground Floor", "First Floor"',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Specifications',
          fields: [...specificationFields],
        },
        {
          label: 'Compliance & Certification',
          fields: [...complianceFields],
        },
        {
          label: 'Options & Variants',
          fields: [
            {
              name: 'optionCategories',
              type: 'array',
              label: 'Option Categories',
              admin: {
                description: 'Group options into categories (e.g., Exterior Finish, Flooring)',
              },
              fields: [
                {
                  name: 'categoryName',
                  type: 'text',
                  required: true,
                  label: 'Category Name',
                },
                {
                  name: 'selectionType',
                  type: 'select',
                  label: 'Selection Type',
                  defaultValue: 'single',
                  options: [
                    { label: 'Single Choice', value: 'single' },
                    { label: 'Multiple Choice', value: 'multiple' },
                  ],
                },
                {
                  name: 'options',
                  type: 'array',
                  label: 'Options',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                    },
                    {
                      name: 'priceModifier',
                      type: 'number',
                      label: 'Price Modifier ($)',
                      admin: {
                        description: 'Additional cost for this option (can be negative for downgrades)',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: '3D Template',
          fields: [
            {
              name: 'sceneTemplate',
              type: 'json',
              label: 'Scene Template',
              admin: {
                description:
                  'Exported scene graph from Pascal Editor. Upload the JSON file contents here.',
              },
            },
            {
              name: 'templateThumbnail',
              type: 'upload',
              relationTo: 'media',
              label: 'Template Thumbnail',
              admin: {
                description:
                  '2D preview image of the module for the Site Planner sidebar (400x300 recommended)',
              },
            },
          ],
        },
      ],
    },
  ],
}
