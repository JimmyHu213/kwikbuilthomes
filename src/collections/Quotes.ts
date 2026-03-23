import type { CollectionConfig } from 'payload'

export const Quotes: CollectionConfig = {
  slug: 'quotes',
  admin: {
    useAsTitle: 'referenceNumber',
    defaultColumns: ['referenceNumber', 'productTitle', 'contactName', 'status', 'createdAt'],
    group: 'Quotes',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Quote Details',
          fields: [
            {
              name: 'referenceNumber',
              type: 'text',
              required: true,
              unique: true,
              admin: { readOnly: true },
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'new',
              options: [
                { label: 'New', value: 'new' },
                { label: 'Pending', value: 'pending' },
                { label: 'Responded', value: 'responded' },
                { label: 'Won', value: 'won' },
                { label: 'Lost', value: 'lost' },
              ],
            },
          ],
        },
        {
          label: 'Product',
          fields: [
            {
              name: 'product',
              type: 'relationship',
              relationTo: 'products',
            },
            {
              name: 'productTitle',
              type: 'text',
              required: true,
              admin: { description: 'Snapshot of product title at time of quote' },
            },
            {
              name: 'productSlug',
              type: 'text',
              required: true,
            },
            {
              name: 'selectedOptions',
              type: 'json',
              admin: { description: 'JSON snapshot of selected configuration options' },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'contactName',
              type: 'text',
              required: true,
            },
            {
              name: 'contactEmail',
              type: 'email',
              required: true,
            },
            {
              name: 'contactPhone',
              type: 'text',
            },
            {
              name: 'company',
              type: 'text',
            },
          ],
        },
        {
          label: 'Project Details',
          fields: [
            {
              name: 'quantity',
              type: 'number',
              required: true,
              min: 1,
              defaultValue: 1,
            },
            {
              name: 'deliveryState',
              type: 'select',
              required: true,
              options: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
            },
            {
              name: 'deliveryLocation',
              type: 'text',
              admin: { description: 'City/region for delivery' },
            },
            {
              name: 'projectTimeline',
              type: 'select',
              options: [
                { label: 'Immediate (0-3 months)', value: 'immediate' },
                { label: 'Short term (3-6 months)', value: 'short' },
                { label: 'Medium term (6-12 months)', value: 'medium' },
                { label: 'Long term (12+ months)', value: 'long' },
                { label: 'Just exploring', value: 'exploring' },
              ],
            },
            {
              name: 'siteConditions',
              type: 'textarea',
              admin: { description: 'Site access, terrain, services availability, etc.' },
            },
          ],
        },
        {
          label: 'Estate Inquiry',
          fields: [
            {
              name: 'isEstateInquiry',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'numberOfUnits',
              type: 'number',
              min: 2,
              admin: { condition: (data) => data.isEstateInquiry },
            },
            {
              name: 'siteAddress',
              type: 'textarea',
              admin: { condition: (data) => data.isEstateInquiry },
            },
            {
              name: 'modelMix',
              type: 'json',
              admin: {
                condition: (data) => data.isEstateInquiry,
                description: 'Array of {model, quantity} pairs',
              },
            },
          ],
        },
        {
          label: 'Notes',
          fields: [
            {
              name: 'additionalNotes',
              type: 'textarea',
            },
          ],
        },
      ],
    },
  ],
}
