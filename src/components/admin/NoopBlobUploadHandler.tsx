'use client'

import { Fragment, type ReactNode } from 'react'

/**
 * No-op stand-in for @payloadcms/storage-vercel-blob's VercelBlobClientUploadHandler.
 *
 * The real handler (createClientUploadHandler) calls `useUploadHandlers()`
 * unconditionally — even when `enabled` is false — which throws
 * "useUploadHandlers must be used within UploadHandlersProvider" on admin pages
 * that don't mount that provider (e.g. /admin/login). With the Blob plugin enabled
 * in production this blanks the entire admin (Payload 3.79.1).
 *
 * We use server-side uploads only (`clientUploads: false` on the plugin), so the
 * client upload handler is never functionally needed. This stub simply renders its
 * children and registers nothing — wired in via importMap.js for the
 * "@payloadcms/storage-vercel-blob/client#VercelBlobClientUploadHandler" key.
 */
export const NoopBlobUploadHandler = ({ children }: { children?: ReactNode }) => {
  return <Fragment>{children}</Fragment>
}
