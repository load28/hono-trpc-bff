import { queryOptions } from '@tanstack/react-query'
import { trpc } from '~/shared/trpc'

export const screenKeys = {
  all: ['screen'] as const,
  dashboard: ['screen', 'dashboard'] as const,
  timeline: ['screen', 'timeline'] as const,
  detail: (id: string) => ['screen', 'detail', id] as const,
  allMemoScreens: ['screen'] as const,
}

const SCREEN_STALE_TIME_MS = 10 * 1000

export const dashboardHomeQueryOptions = queryOptions({
  queryKey: screenKeys.dashboard,
  queryFn: () => trpc.screen.dashboard.query(),
  staleTime: SCREEN_STALE_TIME_MS,
})

export const memoTimelineQueryOptions = queryOptions({
  queryKey: screenKeys.timeline,
  queryFn: () => trpc.screen.memoTimeline.query(),
  staleTime: SCREEN_STALE_TIME_MS,
})

export const memoDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: screenKeys.detail(id),
    queryFn: () => trpc.screen.memoDetail.query({ id }),
    staleTime: SCREEN_STALE_TIME_MS,
  })
