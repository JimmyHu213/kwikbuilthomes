import { headers } from 'next/headers'

/**
 * Spam / abuse protection for public form submissions.
 *
 * Three pragmatic, infrastructure-free layers:
 *   1. Best-effort in-memory sliding-window rate limit (this module).
 *   2. Honeypot field — a visually hidden input bots tend to fill.
 *   3. Time-trap — reject submissions that arrive implausibly fast.
 *
 * IMPORTANT (durability caveat): the rate limiter below is BEST-EFFORT ONLY.
 * It uses a module-level Map that lives in a single serverless instance's
 * memory. On Vercel Fluid Compute instances are reused (so it works across
 * many requests), but there is NO single shared store — concurrent instances
 * each keep their own counters, and counters reset on cold starts/redeploys.
 * For hard guarantees, move this to a durable store (Upstash Redis / Vercel KV).
 * Honeypot + time-trap + this limiter is the pragmatic v1.
 */

// ---------------------------------------------------------------------------
// Tunable values
// ---------------------------------------------------------------------------

/** Max submissions allowed per IP within the window. */
export const RATE_LIMIT_MAX = 5
/** Sliding window length in milliseconds (10 minutes). */
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
/** Minimum time a real human takes to fill a form, in milliseconds. */
export const MIN_FORM_FILL_MS = 2000

// ---------------------------------------------------------------------------
// Pure sliding-window limiter logic (unit-testable, no Next.js dependency)
// ---------------------------------------------------------------------------

/** Module-level store: IP key -> array of submission timestamps (ms epoch). */
const hits = new Map<string, number[]>()

export type RateLimitResult = {
  allowed: boolean
  /** Remaining submissions in the current window after this one. */
  remaining: number
}

/**
 * Pure sliding-window check. Records the hit at `now` if allowed.
 * Exported for unit testing. Pass an explicit `store` to isolate state in tests.
 */
export function checkRateLimit(
  key: string,
  now: number = Date.now(),
  store: Map<string, number[]> = hits,
  max: number = RATE_LIMIT_MAX,
  windowMs: number = RATE_LIMIT_WINDOW_MS,
): RateLimitResult {
  const windowStart = now - windowMs

  // Prune timestamps outside the window for this key.
  const recent = (store.get(key) ?? []).filter((ts) => ts > windowStart)

  if (recent.length >= max) {
    store.set(key, recent)
    return { allowed: false, remaining: 0 }
  }

  recent.push(now)
  store.set(key, recent)

  // Opportunistically prune fully-expired keys to bound memory growth.
  if (store.size > 10_000) {
    for (const [k, v] of store) {
      const live = v.filter((ts) => ts > windowStart)
      if (live.length === 0) store.delete(k)
      else store.set(k, live)
    }
  }

  return { allowed: true, remaining: max - recent.length }
}

// ---------------------------------------------------------------------------
// Request-scoped helpers (used by server actions)
// ---------------------------------------------------------------------------

/** Best-effort client IP from x-forwarded-for. Falls back to 'unknown'. */
export async function getClientIp(): Promise<string> {
  const h = await headers()
  const xff = h.get('x-forwarded-for')
  if (xff) {
    // First entry is the originating client; trim whitespace.
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  return h.get('x-real-ip')?.trim() || 'unknown'
}

/**
 * Apply the rate limit for the current request's client IP.
 * Returns { allowed } so the caller can return a user-facing error.
 */
export async function rateLimitRequest(): Promise<RateLimitResult> {
  const ip = await getClientIp()
  return checkRateLimit(ip)
}

/**
 * Honeypot check. Real users never fill the hidden field, so any non-empty
 * value is a bot. Returns true when the submission looks like spam.
 */
export function isHoneypotTripped(formData: FormData): boolean {
  const value = formData.get('website') ?? formData.get('company_url')
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Time-trap check. `formRenderedAt` is a hidden field holding the ms-epoch
 * timestamp at which the form was rendered. Submissions that arrive faster
 * than MIN_FORM_FILL_MS look like bots. Returns true when it looks like spam.
 * A missing/invalid timestamp is treated as suspicious.
 */
export function isTooFast(formData: FormData, now: number = Date.now()): boolean {
  const raw = formData.get('formRenderedAt')
  const renderedAt = typeof raw === 'string' ? Number(raw) : NaN
  if (!Number.isFinite(renderedAt) || renderedAt <= 0) return true
  // Guard against clock skew / future timestamps: treat as fine, not too fast.
  if (renderedAt > now) return false
  return now - renderedAt < MIN_FORM_FILL_MS
}
