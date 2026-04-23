import { Divider, Group, Stack, Text } from '@mantine/core'
import type { TimelineGroupData } from '../types'
import { MemoListItem } from './MemoListItem'

type Props = { group: TimelineGroupData }

export function TimelineGroup({ group }: Props) {
  return (
    <Stack gap="xs">
      <Group gap="xs" align="baseline">
        <Text size="sm" c="dimmed">
          {group.dayLabel}
        </Text>
        <Text size="xs" c="dimmed">
          ({group.memos.length})
        </Text>
      </Group>
      <Divider />
      <Stack gap="sm">
        {group.memos.map((memo) => (
          <MemoListItem key={memo.id} memo={memo} timestampFormat="time" />
        ))}
      </Stack>
    </Stack>
  )
}
