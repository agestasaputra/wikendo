import { describe, it, expect, vi } from 'vitest'
import {
  parsePaginationParams,
  hasMorePages,
  mergePageItems,
  INFINITE_DEFAULT_LIMIT,
  INFINITE_MAX_LIMIT
} from '../utils/quiz-logic'
import { useInfiniteList } from '../composables/useInfiniteList'

/**
 * infinite-scroll.test.ts — TDD infinity scroll S2b (list mall + detail mall).
 * KENAPA file ini ada: paging limit/offset + append-dedupe + hasMore dipakai
 * 2 pages (mall/index, mall/[slug]) + 2 API (malls, tenants) → logic pure di
 * quiz-logic (tested) + composable useInfiniteList (tested pakai fetch mock).
 * Spec S2b: 10/page, skeleton 2 row, sticky count, SSR page-1, API backward-compat
 * (tanpa ?limit = array 40 seperti sekarang).
 */
describe('parsePaginationParams (?limit & ?offset → angka aman)', () => {
  it('tanpa param → default 10/0', () => {
    expect(parsePaginationParams({})).toEqual({ limit: 10, offset: 0 })
    expect(INFINITE_DEFAULT_LIMIT).toBe(10)
  })

  it('string valid → angka', () => {
    expect(parsePaginationParams({ limit: '10', offset: '20' })).toEqual({ limit: 10, offset: 20 })
  })

  it('ngaco/negatif/nol → default/0 (tidak crash, tidak minus)', () => {
    expect(parsePaginationParams({ limit: 'abc', offset: '-5' })).toEqual({ limit: 10, offset: 0 })
    expect(parsePaginationParams({ limit: '0', offset: '-1' })).toEqual({ limit: 10, offset: 0 })
  })

  it('limit > max 50 → dijepit (anti-abuse full dump)', () => {
    expect(parsePaginationParams({ limit: '9999' })).toEqual({ limit: 50, offset: 0 })
    expect(INFINITE_MAX_LIMIT).toBe(50)
  })

  it('custom default dipakai saat limit absen', () => {
    expect(parsePaginationParams({}, 5)).toEqual({ limit: 5, offset: 0 })
  })
})

describe('hasMorePages (loaded vs total)', () => {
  it('belum semua → true; pas/lebih → false', () => {
    expect(hasMorePages(10, 40)).toBe(true)
    expect(hasMorePages(40, 40)).toBe(false)
    expect(hasMorePages(45, 40)).toBe(false)
  })
})

describe('mergePageItems (append + dedupe by key)', () => {
  const key = (t: { slug: string }) => t.slug

  it('page-1 + page-2 → gabung urut', () => {
    const p1 = [{ slug: 'a' }, { slug: 'b' }]
    const p2 = [{ slug: 'c' }]
    expect(mergePageItems(p1, p2, key)).toEqual([{ slug: 'a' }, { slug: 'b' }, { slug: 'c' }])
  })

  it('duplikat key (overlap refetch) → tidak ganda', () => {
    const p1 = [{ slug: 'a' }, { slug: 'b' }]
    const p2 = [{ slug: 'b' }, { slug: 'c' }]
    expect(mergePageItems(p1, p2, key)).toEqual([{ slug: 'a' }, { slug: 'b' }, { slug: 'c' }])
  })
})

describe('useInfiniteList (composable, fetch mock)', () => {
  it('start() isi page-1 + hasMore true (40 tenant, 10/page)', async () => {
    const fetchPage = vi.fn(async (limit: number, offset: number) => ({
      items: Array.from({ length: limit }, (_, i) => ({ slug: `m${offset + i}` })),
      total: 40,
      hasMore: offset + limit < 40
    }))
    const list = useInfiniteList({ pageSize: 10, keyOf: (m: { slug: string }) => m.slug, fetchPage })
    await list.start()
    expect(list.items.value).toHaveLength(10)
    expect(list.total.value).toBe(40)
    expect(list.hasMore.value).toBe(true)
  })

  it('loadMore() append 10 → 20/40; respons array legacy → hasMore false', async () => {
    const fetchPage = vi.fn(async (limit: number, offset: number) => ({
      items: Array.from({ length: 10 }, (_, i) => ({ slug: `m${offset + i}` })),
      total: 40,
      hasMore: offset + limit < 40
    }))
    const list = useInfiniteList({ pageSize: 10, keyOf: (m: { slug: string }) => m.slug, fetchPage })
    await list.start()
    await list.loadMore()
    expect(list.items.value).toHaveLength(20)
    // Array legacy (API tanpa ?limit) → dibungkus, hasMore false, tidak crash.
    const legacy = useInfiniteList({ fetchPage: async () => [{ slug: 'x' }] as { slug: string }[] })
    await legacy.start()
    expect(legacy.items.value).toHaveLength(1)
    expect(legacy.hasMore.value).toBe(false)
  })

  it('reset() buang page lama + muat ulang dari 0 (ganti filter)', async () => {
    let mode = 'a'
    const fetchPage = vi.fn(async () => ({
      items: [{ slug: mode }],
      total: 1,
      hasMore: false
    }))
    const list = useInfiniteList({ fetchPage })
    await list.start()
    expect(list.items.value).toEqual([{ slug: 'a' }])
    mode = 'b'
    await list.reset()
    expect(list.items.value).toEqual([{ slug: 'b' }])
  })
})
