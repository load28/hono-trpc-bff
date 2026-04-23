import type { PublicUser } from '@memo/shared'
import { queryOptions } from '@tanstack/react-query'
import { trpc } from '~/shared/trpc'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

const ME_STALE_TIME_MS = 60 * 1000

export const authMeQueryOptions = queryOptions<PublicUser | null>({
  queryKey: authKeys.me(),
  queryFn: () => trpc.auth.me.query(undefined, { context: { skipBatch: true } }),
  staleTime: ME_STALE_TIME_MS,
})
