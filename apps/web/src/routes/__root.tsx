import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { authMeQueryOptions } from '~/lib/queries'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Memo' },
    ],
  }),
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(authMeQueryOptions)
    return { user }
  },
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <html lang="ko">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <main
      style={{
        fontFamily: 'system-ui, sans-serif',
        padding: '4rem 1rem',
        textAlign: 'center',
      }}
    >
      <h1>Not Found</h1>
      <p>
        <a href="/" style={{ color: '#06c' }}>
          ← 홈
        </a>
      </p>
    </main>
  )
}
