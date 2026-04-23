import { Anchor, Button, Card, Container, Group, Stack, Text, Title } from '@mantine/core'
import { modals } from '@mantine/modals'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { requireAuth } from '~/features/auth/guard'
import { useDeleteMemo } from '~/features/memo/mutations'
import { memoDetailQueryOptions } from '~/features/memo/queries'
import type { DetailData } from '~/features/memo/types'
import { NeighborNav } from '~/features/memo/ui/NeighborNav'
import { RelatedList } from '~/features/memo/ui/RelatedList'

export const Route = createFileRoute('/memos/$id')({
  beforeLoad: requireAuth,
  loader: ({ context, params }) =>
    context.queryClient.fetchQuery(memoDetailQueryOptions(params.id)),
  component: MemoDetail,
})

const formatDateTime = (iso: string): string => new Date(iso).toLocaleString()

function MemoDetail() {
  const data = Route.useLoaderData()
  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Group gap="sm" align="baseline">
          <Anchor component={Link} to="/memos" size="sm">
            ← 타임라인
          </Anchor>
          <Anchor component={Link} to="/" size="sm">
            홈
          </Anchor>
        </Group>

        <MemoArticle memo={data.memo} />
        <NeighborNav prev={data.neighbors.prev} next={data.neighbors.next} />
        <RelatedList items={data.related} />
      </Stack>
    </Container>
  )
}

function MemoArticle({ memo }: { memo: DetailData['memo'] }) {
  const router = useRouter()
  const deleteMemo = useDeleteMemo()
  const wasUpdated = memo.updatedAt !== memo.createdAt

  const onDelete = () => {
    modals.openConfirmModal({
      title: '이 메모를 삭제할까요?',
      labels: { confirm: '삭제', cancel: '취소' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        await deleteMemo.mutateAsync(memo.id)
        router.navigate({ to: '/memos' })
      },
    })
  }

  return (
    <Card withBorder padding="lg" radius="md">
      <Stack gap="md">
        <Stack gap={4}>
          <Title order={1}>{memo.title}</Title>
          <Text size="xs" c="dimmed">
            작성 {formatDateTime(memo.createdAt)}
            {wasUpdated && ` · 수정 ${formatDateTime(memo.updatedAt)}`}
          </Text>
        </Stack>
        {memo.body && (
          <Text style={{ whiteSpace: 'pre-wrap' }} lh={1.6}>
            {memo.body}
          </Text>
        )}
        <Group>
          <Button color="red" variant="subtle" loading={deleteMemo.isPending} onClick={onDelete}>
            삭제
          </Button>
        </Group>
      </Stack>
    </Card>
  )
}
