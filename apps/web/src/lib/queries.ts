import type { PublicUser } from '@memo/shared'
import { queryOptions } from '@tanstack/react-query'
import { trpc } from './trpc'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

export const authMeQueryOptions = queryOptions<PublicUser | null>({
  queryKey: authKeys.me(),
  queryFn: () => trpc.auth.me.query(),
  staleTime: 60 * 1000,
})

// ===== Screen-centric query options =====

export const screenKeys = {
  dashboard: ['screen', 'dashboard'] as const,
  timeline: ['screen', 'timeline'] as const,
  detail: (id: string) => ['screen', 'detail', id] as const,
  allMemoScreens: ['screen'] as const,
}

export const dashboardHomeQueryOptions = queryOptions({
  queryKey: screenKeys.dashboard,
  queryFn: () => trpc.dashboard.home.query(),
  staleTime: 10 * 1000,
})

export const memoTimelineQueryOptions = queryOptions({
  queryKey: screenKeys.timeline,
  queryFn: () => trpc.memo.timeline.query(),
  staleTime: 10 * 1000,
})

export function memoDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: screenKeys.detail(id),
    queryFn: () => trpc.memo.detail.query({ id }),
    staleTime: 10 * 1000,
  })
}
