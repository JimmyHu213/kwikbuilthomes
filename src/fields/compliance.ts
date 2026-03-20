import type { Field } from 'payload'

export const complianceFields: Field[] = [
  {
    name: 'nccClassification',
    type: 'select',
    label: 'NCC Classification',
    options: [
      { label: 'Class 1a', value: '1a' },
      { label: 'Class 1b', value: '1b' },
      { label: 'Class 2', value: '2' },
      { label: 'Class 3', value: '3' },
      { label: 'Class 10a', value: '10a' },
    ],
    admin: {
      description: 'National Construction Code building classification',
    },
  },
  {
    name: 'windRegion',
    type: 'select',
    label: 'Wind Region',
    options: [
      { label: 'Region A', value: 'A' },
      { label: 'Region B', value: 'B' },
      { label: 'Region C', value: 'C' },
      { label: 'Region D', value: 'D' },
    ],
    admin: {
      description: 'AS/NZS 1170.2 wind region classification',
    },
  },
  {
    name: 'balRating',
    type: 'select',
    label: 'BAL Rating',
    options: [
      { label: 'BAL-LOW', value: 'BAL-LOW' },
      { label: 'BAL-12.5', value: 'BAL-12.5' },
      { label: 'BAL-19', value: 'BAL-19' },
      { label: 'BAL-29', value: 'BAL-29' },
      { label: 'BAL-40', value: 'BAL-40' },
      { label: 'BAL-FZ', value: 'BAL-FZ' },
    ],
    admin: {
      description: 'Bushfire Attack Level rating (AS 3959)',
    },
  },
  {
    name: 'applicableStates',
    type: 'select',
    label: 'Applicable States',
    hasMany: true,
    options: [
      { label: 'New South Wales', value: 'NSW' },
      { label: 'Victoria', value: 'VIC' },
      { label: 'Queensland', value: 'QLD' },
      { label: 'South Australia', value: 'SA' },
      { label: 'Western Australia', value: 'WA' },
      { label: 'Tasmania', value: 'TAS' },
      { label: 'Northern Territory', value: 'NT' },
      { label: 'Australian Capital Territory', value: 'ACT' },
    ],
    admin: {
      description: 'States and territories where this product is approved for installation',
    },
  },
  {
    name: 'certifications',
    type: 'array',
    label: 'Certifications',
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        label: 'Certification Name',
      },
      {
        name: 'type',
        type: 'select',
        label: 'Certification Type',
        options: [
          { label: 'Structural', value: 'structural' },
          { label: 'Electrical', value: 'electrical' },
          { label: 'Plumbing', value: 'plumbing' },
          { label: 'Fire Safety', value: 'fire-safety' },
          { label: 'Energy Efficiency', value: 'energy-efficiency' },
          { label: 'Other', value: 'other' },
        ],
      },
      {
        name: 'document',
        type: 'upload',
        relationTo: 'documents',
        label: 'Certificate Document',
      },
      {
        name: 'issueDate',
        type: 'date',
        label: 'Issue Date',
      },
      {
        name: 'expiryDate',
        type: 'date',
        label: 'Expiry Date',
      },
    ],
  },
]
