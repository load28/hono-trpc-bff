import { Button, Group, Text } from '@mantine/core'
import { useLogoutMutation } from '../mutations'

type Props = { email: string }

export function UserMenu({ email }: Props) {
  const logout = useLogoutMutation()
  return (
    <Group gap="sm">
      <Text size="sm" c="dimmed">
        {email}
      </Text>
      <Button
        size="xs"
        variant="default"
        loading={logout.isPending}
        onClick={() => logout.mutate()}
      >
        로그아웃
      </Button>
    </Group>
  )
}
