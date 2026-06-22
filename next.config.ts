import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Prefer modern formats; Next.js negotiates per the browser's Accept header.
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images at the edge for 30 days — source images are
    // immutable Blob uploads, so a long TTL avoids re-optimization on every hit.
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
}

export default withPayload(nextConfig)
