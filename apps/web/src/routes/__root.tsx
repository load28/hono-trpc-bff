import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { Anchor, Container, MantineProvider, Text, Title } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { authMeQueryOptions } from '~/features/auth/queries'

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
        <MantineProvider>
          <ModalsProvider>
            <Notifications position="top-right" />
            <Outlet />
          </ModalsProvider>
        </MantineProvider>
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <Container size="sm" py="xl" ta="center">
      <Title order={1}>Not Found</Title>
      <Text mt="sm">
        <Anchor href="/">← 홈</Anchor>
      </Text>
    </Container>
  )
}
