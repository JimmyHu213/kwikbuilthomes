import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
// Rich text editor removed temporarily — Lexical has compatibility issues with current setup
// import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { en } from '@payloadcms/translations/languages/en'
import { zh } from '@payloadcms/translations/languages/zh'
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

// --- Email transport guard ---------------------------------------------------
// Without transportOptions, @payloadcms/email-nodemailer silently falls back to
// an ethereal.email TEST account: every email "succeeds" but never reaches a
// real recipient. Quote confirmations/notifications are the core of this
// product, so in production we fail hard instead of losing email silently.
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
// Parse the host so detection works with or without credentials in the URL
// (e.g. postgres://localhost/db as well as postgres://user:pass@localhost/db).
const isLocalDatabase = (() => {
  try {
    const host = new URL(databaseUrl).hostname
    return host === 'localhost' || host === '127.0.0.1'
  } catch {
    return false
  }
})()

const smtpHost = process.env.SMTP_HOST

// On Vercel, NODE_ENV is 'production' for preview builds too — gate on VERCEL_ENV
// so PR previews can build without SMTP (emails captured by Ethereal), while real
// production deploys fail hard until SMTP is configured.
const isRealProduction = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === 'production'
  : process.env.NODE_ENV === 'production'

if (!smtpHost) {
  if (isRealProduction) {
    throw new Error(
      'SMTP_HOST is not set in a production environment. Refusing to start: ' +
        'without SMTP transport options, @payloadcms/email-nodemailer silently routes ' +
        'all email (quote confirmations and notifications) to an ethereal.email test ' +
        'account while reporting success. Set SMTP_HOST, SMTP_PORT, SMTP_USER and ' +
        'SMTP_PASS in the environment, then redeploy.',
    )
  }
  // eslint-disable-next-line no-console
  console.warn(
    '⚠️  [payload.config] SMTP_HOST is not set — emails will be captured by an ' +
      'ethereal.email TEST account and will NOT be delivered to real recipients. ' +
      'Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS to send real email in development.',
  )
}

export default buildConfig({
  // Admin UI language: each admin user can switch between English and 简体中文
  // from their account settings. Defaults to English.
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en, zh },
  },
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
    // `push` only applies in dev mode. Production schema changes are managed
    // exclusively via migrations in ./migrations — see docs/MIGRATIONS.md.
    push: true,
    migrationDir: path.resolve(dirname, 'migrations'),
    pool: {
      connectionString: databaseUrl,
      // Local Postgres (dev) doesn't speak SSL; managed providers (Supabase) require it.
      // Disable SSL for localhost connections, keep it for everything else.
      ssl: isLocalDatabase ? false : { rejectUnauthorized: false },
    },
  }),
  // editor: lexicalEditor(), // Disabled — will re-enable when Lexical compatibility is resolved
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            enabled: true,
            token: process.env.BLOB_READ_WRITE_TOKEN,
            // Server-side uploads only. Client-side direct uploads require a
            // generated importMap entry (VercelBlobClientUploadHandler) that broke
            // the admin when missing; uploads here are well under Vercel's body
            // limit, so the server path is fine and avoids that fragility.
            clientUploads: false,
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
    ...(smtpHost
      ? {
          transportOptions: {
            host: smtpHost,
            port: Number(process.env.SMTP_PORT) || 587,
            // Only include auth when credentials are actually provided —
            // passing { user: undefined, pass: undefined } breaks transports
            // that allow unauthenticated relay.
            ...(process.env.SMTP_USER && process.env.SMTP_PASS
              ? {
                  auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                  },
                }
              : {}),
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
