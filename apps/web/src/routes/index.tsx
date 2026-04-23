import { Anchor, Container, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'
import { requireAuth } from '~/features/auth/guard'
import { UserMenu } from '~/features/auth/ui/UserMenu'
import { dashboardHomeQueryOptions } from '~/features/memo/queries'
import type { DashboardData } from '~/features/memo/types'
import { MemoComposer } from '~/features/memo/ui/MemoComposer'
import { MemoListItem } from '~/features/memo/ui/MemoListItem'
import { StatCard } from '~/features/memo/ui/StatCard'

export const Route = createFileRoute('/')({
  beforeLoad: requireAuth,
  loader: ({ context }) => context.queryClient.fetchQuery(dashboardHomeQueryOptions),
  component: Dashboard,
})

function Dashboard() {
  const { user, stats, recentMemos } = Route.useLoaderData()
  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={1}>Memo</Title>
          <UserMenu email={user.email} />
        </Group>

        <StatGrid stats={stats} />
        <MemoComposer />
        <RecentMemos memos={recentMemos} />
      </Stack>
    </Container>
  )
}

function StatGrid({ stats }: { stats: DashboardData['stats'] }) {
  return (
    <SimpleGrid cols={3} spacing="sm">
      <StatCard label="전체" value={stats.total} />
      <StatCard label="오늘" value={stats.today} />
      <StatCard label="이번 주" value={stats.thisWeek} />
    </SimpleGrid>
  )
}

function RecentMemos({ memos }: { memos: DashboardData['recentMemos'] }) {
  return (
    <Stack gap="sm">
      <Group justify="space-between" align="baseline">
        <Title order={2} size="h4">
          최근 메모
        </Title>
        <Anchor component={Link} to="/memos" size="sm">
          전체 타임라인 →
        </Anchor>
      </Group>

      {memos.length === 0 ? (
        <Text c="dimmed">메모가 없습니다.</Text>
      ) : (
        <Stack gap="sm">
          {memos.map((memo) => (
            <MemoListItem key={memo.id} memo={memo} />
          ))}
        </Stack>
      )}
    </Stack>
  )
}
