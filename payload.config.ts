import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'

import { Users } from '@/collections/Users'
import { Products } from '@/collections/Products'
import { Categories } from '@/collections/Categories'
import { Media } from '@/collections/Media'
import { Documents } from '@/collections/Documents'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Products, Categories, Media, Documents],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  editor: lexicalEditor(),
  plugins: [
    vercelBlobStorage({
      enabled: true,
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      collections: {
        media: true,
        documents: true,
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
})
