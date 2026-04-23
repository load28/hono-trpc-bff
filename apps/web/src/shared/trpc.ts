import type { AppRouter } from '@memo/bff/router'
import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { createTRPCClient, httpBatchLink, httpLink, splitLink } from '@trpc/client'
import { BFF_URL } from './config'

const TRPC_ENDPOINT = `${BFF_URL}/trpc`
const BATCH_MAX_URL_LENGTH = 2083

const getForwardCookie = createIsomorphicFn()
  .server(() => getRequestHeader('cookie') ?? '')
  .client(() => '')

const fetchWithCookie: typeof fetch = (url, opts) => {
  const cookie = getForwardCookie()
  const headers = new Headers(opts?.headers)
  if (cookie) headers.set('cookie', cookie)
  return fetch(url as string, { ...opts, credentials: 'include', headers })
}

const shouldSkipBatch = (op: { type: string; context: Record<string, unknown> }): boolean =>
  op.type === 'mutation' || op.context.skipBatch === true

export const trpc = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: shouldSkipBatch,
      true: httpLink({ url: TRPC_ENDPOINT, fetch: fetchWithCookie }),
      false: httpBatchLink({
        url: TRPC_ENDPOINT,
        fetch: fetchWithCookie,
        maxURLLength: BATCH_MAX_URL_LENGTH,
      }),
    }),
  ],
})
