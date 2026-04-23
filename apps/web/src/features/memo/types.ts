import type { AppRouter } from '@memo/bff/router'
import type { inferRouterOutputs } from '@trpc/server'

type ScreenOutput = inferRouterOutputs<AppRouter>['screen']

export type DashboardData = ScreenOutput['dashboard']
export type TimelineData = ScreenOutput['memoTimeline']
export type TimelineGroupData = TimelineData['groups'][number]
export type DetailData = ScreenOutput['memoDetail']
export type Neighbor = DetailData['neighbors']['prev']
export type RelatedItem = DetailData['related'][number]
