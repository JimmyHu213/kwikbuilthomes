import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

// On-demand revalidation: when CMS content is saved, clear the matching Next.js
// caches so the change appears within seconds instead of waiting for the 5-minute
// ISR window. `next/cache` is imported lazily so these modules stay safe to load
// outside the Next.js runtime (e.g. the `payload migrate` CLI), and the call is
// wrapped in try/catch so it no-ops when there's no request context (seed scripts).
async function revalidate(tags: string[]): Promise<void> {
  try {
    const { revalidateTag, revalidatePath } = await import('next/cache')
    for (const tag of tags) revalidateTag(tag)
    // Footer/header and several pages read CMS data through the root layout —
    // revalidate everything beneath it so edits propagate everywhere.
    revalidatePath('/', 'layout')
  } catch {
    // Not in a request context (CLI/seed) — nothing to revalidate.
  }
}

export const revalidateGlobal =
  (tags: string[]): GlobalAfterChangeHook =>
  ({ doc }) => {
    void revalidate(tags)
    return doc
  }

export const revalidateOnChange =
  (tags: string[]): CollectionAfterChangeHook =>
  ({ doc }) => {
    void revalidate(tags)
    return doc
  }

export const revalidateOnDelete =
  (tags: string[]): CollectionAfterDeleteHook =>
  ({ doc }) => {
    void revalidate(tags)
    return doc
  }
