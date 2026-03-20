import type { Field } from 'payload'

export const specificationFields: Field[] = [
  {
    name: 'dimensions',
    type: 'group',
    label: 'Dimensions',
    fields: [
      {
        name: 'length',
        type: 'number',
        label: 'Length (mm)',
        admin: {
          description: 'Overall length in millimetres',
        },
      },
      {
        name: 'width',
        type: 'number',
        label: 'Width (mm)',
        admin: {
          description: 'Overall width in millimetres',
        },
      },
      {
        name: 'height',
        type: 'number',
        label: 'Height (mm)',
        admin: {
          description: 'Overall height in millimetres',
        },
      },
    ],
  },
  {
    name: 'bedrooms',
    type: 'number',
    label: 'Bedrooms',
  },
  {
    name: 'bathrooms',
    type: 'number',
    label: 'Bathrooms',
  },
  {
    name: 'floorArea',
    type: 'number',
    label: 'Floor Area',
    admin: {
      description: 'Total floor area in square metres',
    },
  },
  {
    name: 'weight',
    type: 'number',
    label: 'Weight',
    admin: {
      description: 'Transport weight in kg',
    },
  },
  {
    name: 'structuralSystem',
    type: 'text',
    label: 'Structural System',
    admin: {
      description: 'e.g., Light gauge steel frame',
    },
  },
  {
    name: 'insulationRating',
    type: 'text',
    label: 'Insulation Rating',
  },
]
