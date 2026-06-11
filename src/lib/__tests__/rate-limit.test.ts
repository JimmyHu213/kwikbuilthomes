import { describe, it, expect, vi } from 'vitest'

// rate-limit.ts imports 'next/headers' at module top level.
// Stub it so the pure logic can be imported in the node test environment.
vi.mock('next/headers', () => ({ headers: async () => new Map() }))

import {
  checkRateLimit,
  isHoneypotTripped,
  isTooFast,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  MIN_FORM_FILL_MS,
} from '@/lib/rate-limit'

function makeFormData(entries: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(entries)) fd.set(k, v)
  return fd
}

describe('checkRateLimit', () => {
  it('allows submissions up to the max within the window', () => {
    const store = new Map<string, number[]>()
    const now = 1_000_000
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      const result = checkRateLimit('1.2.3.4', now + i, store)
      expect(result.allowed).toBe(true)
    }
    expect(store.get('1.2.3.4')).toHaveLength(RATE_LIMIT_MAX)
  })

  it('blocks the submission that exceeds the max', () => {
    const store = new Map<string, number[]>()
    const now = 1_000_000
    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      checkRateLimit('5.6.7.8', now + i, store)
    }
    const blocked = checkRateLimit('5.6.7.8', now + RATE_LIMIT_MAX, store)
    expect(blocked.allowed).toBe(false)
    expect(blocked.remaining).toBe(0)
  })

  it('counts each IP independently', () => {
    const store = new Map<string, number[]>()
    const now = 1_000_000
    for (let i = 0; i < RATE_LIMIT_MAX; i++) checkRateLimit('a', now + i, store)
    // A different IP still gets a fresh allowance.
    expect(checkRateLimit('b', now, store).allowed).toBe(true)
  })

  it('slides the window: old hits outside the window are pruned', () => {
    const store = new Map<string, number[]>()
    const now = 1_000_000
    for (let i = 0; i < RATE_LIMIT_MAX; i++) checkRateLimit('9.9.9.9', now + i, store)
    expect(checkRateLimit('9.9.9.9', now + RATE_LIMIT_MAX, store).allowed).toBe(false)
    // Jump past the window relative to the LAST hit; all prior hits expire.
    const later = now + RATE_LIMIT_MAX + RATE_LIMIT_WINDOW_MS + 1
    const result = checkRateLimit('9.9.9.9', later, store)
    expect(result.allowed).toBe(true)
    expect(store.get('9.9.9.9')).toHaveLength(1)
  })

  it('reports remaining allowance', () => {
    const store = new Map<string, number[]>()
    const first = checkRateLimit('r', 1000, store)
    expect(first.remaining).toBe(RATE_LIMIT_MAX - 1)
  })
})

describe('isHoneypotTripped', () => {
  it('returns false when the honeypot is empty or absent', () => {
    expect(isHoneypotTripped(makeFormData({}))).toBe(false)
    expect(isHoneypotTripped(makeFormData({ website: '' }))).toBe(false)
    expect(isHoneypotTripped(makeFormData({ website: '   ' }))).toBe(false)
  })

  it('returns true when the honeypot is filled', () => {
    expect(isHoneypotTripped(makeFormData({ website: 'http://spam.example' }))).toBe(true)
    expect(isHoneypotTripped(makeFormData({ company_url: 'spam' }))).toBe(true)
  })
})

describe('isTooFast', () => {
  const now = 2_000_000

  it('treats a missing or invalid timestamp as suspicious', () => {
    expect(isTooFast(makeFormData({}), now)).toBe(true)
    expect(isTooFast(makeFormData({ formRenderedAt: 'not-a-number' }), now)).toBe(true)
    expect(isTooFast(makeFormData({ formRenderedAt: '0' }), now)).toBe(true)
  })

  it('rejects submissions faster than the minimum fill time', () => {
    const rendered = now - (MIN_FORM_FILL_MS - 1)
    expect(isTooFast(makeFormData({ formRenderedAt: String(rendered) }), now)).toBe(true)
  })

  it('allows submissions after the minimum fill time', () => {
    const rendered = now - (MIN_FORM_FILL_MS + 1000)
    expect(isTooFast(makeFormData({ formRenderedAt: String(rendered) }), now)).toBe(false)
  })

  it('does not flag future timestamps (clock skew) as too fast', () => {
    expect(isTooFast(makeFormData({ formRenderedAt: String(now + 5000) }), now)).toBe(false)
  })
})
