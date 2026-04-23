import { Card, Stack, Text } from '@mantine/core'

type Props = { label: string; value: number }

export function StatCard({ label, value }: Props) {
  return (
    <Card withBorder padding="md" radius="md">
      <Stack gap="xs" align="center">
        <Text size="xs" c="dimmed">
          {label}
        </Text>
        <Text size="xl" fw={600}>
          {value}
        </Text>
      </Stack>
    </Card>
  )
}
