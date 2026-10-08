/**
 * composables/useInfiniteList.ts — State infinity scroll S2b (1 composable, 2 pages).
 *
 * APA: start (page-1, SSR-friendly) + loadMore (append dedupe) + reset (ganti filter),
 * state items/total/hasMore/pending/loadingMore/error.
 * KENAPA 1 composable: mall/index.vue + mall/[slug].vue pola SAMA (sentinel → fetch
 * limit/offset → append) → bukan duplikat state per page. Pure-Vue (tanpa Nuxt),
 * jadi bisa di-unit-test pakai fetch mock. Math paging (parse/dedupe/hasMore)
 * tetap di utils/quiz-logic (tested di infinite-scroll.test.ts).
 * Spec S2b: 10/page, skeleton 2 row pas loadingMore, sticky count "10/40",
 * API backward-compat (array legacy tanpa ?limit → hasMore false, tidak crash).
 * Contoh: const { items, hasMore, start, loadMore } = useInfiniteList({ fetchPage }).
 */
import { ref, computed } from 'vue'
import type { InfiniteFetchPage } from '../types'
import { mergePageItems } from '../utils/quiz-logic'

export interface InfiniteListOptions<T> {
  pageSize?: number
  keyOf?: (item: T) => string | number
  fetchPage: (limit: number, offset: number) => Promise<InfiniteFetchPage<T>>
}

export function useInfiniteList<T>(options: InfiniteListOptions<T>) {
  const pageSize = options.pageSize ?? 10
  const keyOf = options.keyOf ?? ((item: T) => JSON.stringify(item))
  const items = ref<T[]>([])
  const total = ref(0)
  const pending = ref(false)
  const loadingMore = ref(false)
  const error = ref<unknown>(null)
  const serverHasMore = ref(false)
  const hasMore = computed(() => serverHasMore.value)

  function applyPage(res: InfiniteFetchPage<T>, append: boolean) {
    if (Array.isArray(res)) {
      items.value = append ? mergePageItems(items.value, res, keyOf) : [...res]
      total.value = items.value.length
      serverHasMore.value = false
      return
    }
    items.value = append ? mergePageItems(items.value, res.items, keyOf) : [...res.items]
    total.value = res.total
    serverHasMore.value = res.hasMore
  }

  async function start() {
    pending.value = true
    error.value = null
    try {
      const res = await options.fetchPage(pageSize, 0)
      applyPage(res, false)
    } catch (e) {
      error.value = e
    } finally {
      pending.value = false
    }
  }

  async function loadMore() {
    if (!serverHasMore.value || pending.value || loadingMore.value) return
    loadingMore.value = true
    error.value = null
    try {
      const res = await options.fetchPage(pageSize, items.value.length)
      applyPage(res, true)
    } catch (e) {
      error.value = e
    } finally {
      loadingMore.value = false
    }
  }

  async function reset() {
    items.value = []
    total.value = 0
    serverHasMore.value = false
    await start()
  }

  return { items, total, hasMore, pending, loadingMore, error, start, loadMore, reset }
}
