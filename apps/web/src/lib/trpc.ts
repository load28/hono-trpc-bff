import type { AppRouter } from '@memo/bff/router'
import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { createTRPCClient, httpBatchLink } from '@trpc/client'

const BFF_URL = import.meta.env.VITE_BFF_URL ?? 'http://localhost:4001'

const getForwardCookie = createIsomorphicFn()
  .server(() => getRequestHeader('cookie') ?? '')
  .client(() => '')

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${BFF_URL}/trpc`,
      fetch: (url, opts) => {
        const cookie = getForwardCookie()
        const headers = new Headers(opts?.headers)
        if (cookie) headers.set('cookie', cookie)
        return fetch(url as string, {
          ...opts,
          credentials: 'include',
          headers,
        })
      },
    }),
  ],
})

export { BFF_URL }
