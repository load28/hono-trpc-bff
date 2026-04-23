import { Box, Card, Group, Stack, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import type { Neighbor } from '../types'

type Direction = 'prev' | 'next'

const labelByDirection: Record<Direction, string> = {
  prev: '← 이전',
  next: '다음 →',
}

const alignByDirection: Record<Direction, 'flex-start' | 'flex-end'> = {
  prev: 'flex-start',
  next: 'flex-end',
}

type DirectionLinkProps = { direction: Direction; neighbor: Neighbor }

function DirectionLink({ direction, neighbor }: DirectionLinkProps) {
  if (!neighbor) return <Box flex={1} />
  return (
    <Card
      withBorder
      padding="sm"
      radius="md"
      flex={1}
      renderRoot={(props) => <Link to="/memos/$id" params={{ id: neighbor.id }} {...props} />}
    >
      <Stack gap={4} align={alignByDirection[direction]}>
        <Text size="xs" c="dimmed">
          {labelByDirection[direction]}
        </Text>
        <Text size="sm">{neighbor.title}</Text>
      </Stack>
    </Card>
  )
}

type Props = { prev: Neighbor; next: Neighbor }

export function NeighborNav({ prev, next }: Props) {
  return (
    <Group gap="sm" align="stretch">
      <DirectionLink direction="prev" neighbor={prev} />
      <DirectionLink direction="next" neighbor={next} />
    </Group>
  )
}
