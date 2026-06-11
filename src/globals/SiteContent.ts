import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '@/lib/revalidate'

export const SiteContent: GlobalConfig = {
  slug: 'site-content',
  label: 'Site Content',
  admin: {
    group: 'Site',
  },
  hooks: {
    afterChange: [revalidateGlobal(['site-content'])],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Homepage',
          fields: [
            {
              name: 'hero',
              type: 'group',
              label: 'Hero Section',
              fields: [
                {
                  name: 'headline',
                  type: 'text',
                  defaultValue: 'Australian-Engineered Modular Homes',
                },
                {
                  name: 'tagline',
                  type: 'text',
                  defaultValue: 'Factory-built. Site-ready. NCC-compliant.',
                },
                {
                  name: 'primaryCta',
                  type: 'text',
                  label: 'Primary CTA Text',
                  defaultValue: 'Browse Our Range',
                },
                {
                  name: 'secondaryCta',
                  type: 'text',
                  label: 'Secondary CTA Text',
                  defaultValue: 'Request a Quote',
                },
              ],
            },
            {
              name: 'heroVideo',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Video (MP4)',
              admin: {
                description: 'Optional background video for the homepage hero. MP4 format recommended. Falls back to poster image or gradient.',
              },
            },
            {
              name: 'heroPoster',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Poster Image',
              admin: {
                description: 'Poster image shown while video loads, on mobile, or when no video is set.',
              },
            },
            {
              name: 'stats',
              type: 'array',
              label: 'Stats Counter',
              admin: {
                description: 'Animated statistics displayed on the homepage (e.g. "50+ Designs")',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: { description: 'Label shown below the number (e.g. "Designs")' },
                },
                {
                  name: 'value',
                  type: 'number',
                  required: true,
                  min: 0,
                  admin: { description: 'The number to count up to (e.g. 50)' },
                },
                {
                  name: 'suffix',
                  type: 'text',
                  admin: { description: 'Optional suffix like "+" or "%" or "m²"' },
                },
              ],
            },
            {
              name: 'valueProps',
              type: 'array',
              label: 'Value Propositions',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'icon',
                  type: 'select',
                  options: [
                    { label: 'Factory', value: 'factory' },
                    { label: 'Shield Check', value: 'shield-check' },
                    { label: 'Piggy Bank', value: 'piggy-bank' },
                    { label: 'Building', value: 'building-2' },
                    { label: 'Clock', value: 'clock' },
                    { label: 'Truck', value: 'truck' },
                  ],
                },
              ],
            },
            {
              name: 'aboutSummary',
              type: 'textarea',
              label: 'About Preview',
              admin: {
                description: 'Short paragraph shown on the homepage about section',
              },
              defaultValue:
                'KwikBuilt is an Australian modular home distributor delivering factory-built, site-ready buildings through international manufacturing partnerships. We supply land developers, builders, and sub-distributors across Australia.',
            },
            {
              name: 'ctaBanner',
              type: 'group',
              label: 'CTA Banner',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Ready to start your project?',
                },
                {
                  name: 'buttonText',
                  type: 'text',
                  defaultValue: 'Request a Quote',
                },
              ],
            },
          ],
        },
        {
          label: 'About',
          fields: [
            {
              name: 'companyStory',
              type: 'textarea',
              label: 'Company Story',
              defaultValue:
                'KwikBuilt Pty Ltd is an Australian modular home distributor. Our factory-built modules are engineered to Australian standards, manufactured through international partnerships, and delivered site-ready across Australia.',
            },
            {
              name: 'dealershipModel',
              type: 'textarea',
              label: 'Dealership Model',
              defaultValue:
                'KwikBuilt supplies to land developers, builders, and sub-distributors. Our dealership partners handle installation and final fitout, ensuring local expertise at every stage.',
            },
            {
              name: 'leadership',
              type: 'array',
              label: 'Leadership Team',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'role',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
              ],
            },
            {
              name: 'whyModular',
              type: 'textarea',
              label: 'Why Modular',
              defaultValue:
                'Modular construction delivers faster build times, consistent factory quality control, predictable pricing, and the scalability to support housing estates and developments of any size.',
            },
          ],
        },
        {
          label: 'How It Works',
          fields: [
            {
              name: 'steps',
              type: 'array',
              label: 'Process Steps',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                },
                {
                  name: 'icon',
                  type: 'select',
                  options: [
                    { label: 'Message', value: 'message-square' },
                    { label: 'Pencil Ruler', value: 'pencil-ruler' },
                    { label: 'Factory', value: 'factory' },
                    { label: 'Truck', value: 'truck' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
