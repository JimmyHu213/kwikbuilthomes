import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Site',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          fields: [
            {
              name: 'phone',
              type: 'text',
              defaultValue: '1300 KWIKBUILT',
            },
            {
              name: 'email',
              type: 'email',
              defaultValue: 'info@kwikbuilthomes.com.au',
            },
            {
              name: 'location',
              type: 'text',
              defaultValue: 'Port Macquarie, NSW, Australia',
            },
          ],
        },
        {
          label: 'Business',
          fields: [
            {
              name: 'companyName',
              type: 'text',
              defaultValue: 'KwikBuilt Pty Ltd',
            },
            {
              name: 'tagline',
              type: 'text',
              defaultValue: 'Australian-engineered modular homes',
            },
            {
              name: 'abn',
              type: 'text',
              label: 'ABN',
              admin: { description: 'Australian Business Number (optional)' },
            },
          ],
        },
        {
          label: 'Links',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Social Links',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
