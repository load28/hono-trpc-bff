import { Card, Stack, Text } from '@mantine/core'
import type { Memo } from '@memo/shared'
import { Link } from '@tanstack/react-router'

type TimestampFormat = 'datetime' | 'time'

const formatTimestamp = (iso: string, format: TimestampFormat): string => {
  const date = new Date(iso)
  return format === 'datetime' ? date.toLocaleString() : date.toLocaleTimeString()
}

type Props = {
  memo: Pick<Memo, 'id' | 'title' | 'body' | 'createdAt'>
  timestampFormat?: TimestampFormat
}

export function MemoListItem({ memo, timestampFormat = 'datetime' }: Props) {
  return (
    <Card
      withBorder
      padding="md"
      radius="md"
      renderRoot={(props) => <Link to="/memos/$id" params={{ id: memo.id }} {...props} />}
    >
      <Stack gap="xs">
        <Text fw={600}>{memo.title}</Text>
        {memo.body && (
          <Text size="sm" c="dimmed" lineClamp={2} style={{ whiteSpace: 'pre-wrap' }}>
            {memo.body}
          </Text>
        )}
        <Text size="xs" c="dimmed">
          {formatTimestamp(memo.createdAt, timestampFormat)}
        </Text>
      </Stack>
    </Card>
  )
}
