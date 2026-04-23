import { Card, Group, Stack, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import type { RelatedItem } from '../types'

const formatTime = (iso: string): string => new Date(iso).toLocaleTimeString()

type Props = { items: RelatedItem[] }

export function RelatedList({ items }: Props) {
  if (items.length === 0) return null
  return (
    <Stack gap="xs">
      <Text size="sm" c="dimmed">
        같은 날 메모
      </Text>
      <Stack gap={6}>
        {items.map((item) => (
          <Card
            key={item.id}
            withBorder
            padding="xs"
            radius="sm"
            renderRoot={(props) => <Link to="/memos/$id" params={{ id: item.id }} {...props} />}
          >
            <Group justify="space-between">
              <Text size="sm">{item.title}</Text>
              <Text size="xs" c="dimmed">
                {formatTime(item.createdAt)}
              </Text>
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}
