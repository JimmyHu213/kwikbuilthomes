import type { CollectionConfig } from 'payload'

export const Quotes: CollectionConfig = {
  slug: 'quotes',
  admin: {
    useAsTitle: 'referenceNumber',
    defaultColumns: ['referenceNumber', 'productTitle', 'contactName', 'status', 'createdAt'],
    group: 'Quotes',
  },
  access: {
    // Quotes are created via server actions (src/lib/actions/*) through the
    // Payload Local API, which bypasses access control. Block the public REST API
    // so submissions can't skip Zod validation.
    create: () => false,
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
              name: 'source',
              type: 'select',
              defaultValue: 'product-page',
              options: [
                { label: 'Product Page', value: 'product-page' },
                { label: 'Site Planner', value: 'planner' },
                { label: 'Contact Form', value: 'contact' },
                { label: 'General Quote', value: 'general' },
              ],
              admin: { description: 'Where this quote originated' },
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
              admin: { condition: (data) => !data.source || data.source === 'product-page' },
            },
            {
              name: 'productTitle',
              type: 'text',
              admin: {
                description: 'Snapshot of product title at time of quote',
                condition: (data) => !data.source || data.source === 'product-page',
              },
            },
            {
              name: 'productSlug',
              type: 'text',
              admin: { condition: (data) => !data.source || data.source === 'product-page' },
            },
            {
              name: 'selectedOptions',
              type: 'json',
              admin: {
                description: 'JSON snapshot of selected configuration options',
                condition: (data) => !data.source || data.source === 'product-page',
              },
            },
            {
              name: 'layoutData',
              type: 'json',
              admin: {
                description: 'BOM array: { productId, productTitle, quantity, dimensions, floorArea }[]',
                condition: (data) => data.source === 'planner',
              },
            },
            {
              name: 'layoutScreenshot',
              type: 'upload',
              relationTo: 'media',
              label: 'Layout Screenshot',
              admin: {
                description: '3D layout screenshot from Site Planner',
                condition: (data) => data.source === 'planner',
              },
            },
            {
              name: 'interestCategory',
              type: 'select',
              label: 'Interest Category',
              options: [
                { label: 'Modular Homes', value: 'modular-homes' },
                { label: 'Kit Homes', value: 'kit-homes' },
                { label: 'Container Homes', value: 'container-homes' },
                { label: 'Tiny Homes', value: 'tiny-homes' },
                { label: 'Sheds', value: 'sheds' },
                { label: 'Other', value: 'other' },
              ],
              admin: { condition: (data) => data.source === 'general' },
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
              min: 1,
              defaultValue: 1,
            },
            {
              name: 'deliveryState',
              type: 'select',
              options: ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
              admin: {
                condition: (data) => data.source !== 'contact',
              },
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
