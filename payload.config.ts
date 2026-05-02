import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
// Rich text editor removed temporarily — Lexical has compatibility issues with current setup
// import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'

import { Users } from './src/collections/Users'
import { Products } from './src/collections/Products'
import { Categories } from './src/collections/Categories'
import { Media } from './src/collections/Media'
import { Documents } from './src/collections/Documents'
import { Quotes } from './src/collections/Quotes'
import { ProjectGallery } from './src/collections/ProjectGallery'
import { SiteSettings } from './src/globals/SiteSettings'
import { SiteContent } from './src/globals/SiteContent'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | KwikBuilt Homes',
      icons: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          url: '/favicon.svg',
        },
      ],
    },
    components: {
      graphics: {
        Logo: '/src/components/admin/Logo',
        Icon: '/src/components/admin/Icon',
      },
    },
  },
  collections: [Users, Products, Categories, Media, Documents, Quotes, ProjectGallery],
  globals: [SiteSettings, SiteContent],
  db: postgresAdapter({
    push: true,
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
  // editor: lexicalEditor(), // Disabled — will re-enable when Lexical compatibility is resolved
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            enabled: true,
            token: process.env.BLOB_READ_WRITE_TOKEN,
            collections: {
              media: true,
              documents: true,
            },
          }),
        ]
      : []),
  ],
  email: nodemailerAdapter({
    defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@kwikbuilthomes.com.au',
    defaultFromName: 'Kwik Built Homes',
    ...(process.env.SMTP_HOST
      ? {
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          },
        }
      : {}),
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
})
