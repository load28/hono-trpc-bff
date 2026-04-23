import { Anchor, Container, Group, Stack, Text, Title } from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'
import { requireAuth } from '~/features/auth/guard'
import { memoTimelineQueryOptions } from '~/features/memo/queries'
import { TimelineGroup } from '~/features/memo/ui/TimelineGroup'

export const Route = createFileRoute('/memos/')({
  beforeLoad: requireAuth,
  loader: ({ context }) => context.queryClient.fetchQuery(memoTimelineQueryOptions),
  component: Timeline,
})

function Timeline() {
  const { totalCount, groups } = Route.useLoaderData()
  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Group gap="sm" align="baseline">
            <Anchor component={Link} to="/" size="sm">
              ← 홈
            </Anchor>
            <Title order={1}>타임라인</Title>
          </Group>
          <Text size="sm" c="dimmed">
            총 {totalCount}개
          </Text>
        </Group>

        {groups.length === 0 ? (
          <Text c="dimmed">메모가 없습니다.</Text>
        ) : (
          <Stack gap="xl">
            {groups.map((group) => (
              <TimelineGroup key={group.date} group={group} />
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  )
}
