import { Anchor, Code, Container, Stack, Text } from '@mantine/core'
import { createFileRoute, Link } from '@tanstack/react-router'
import { requireGuest } from '~/features/auth/guard'
import { LoginForm } from '~/features/auth/ui/LoginForm'

export const Route = createFileRoute('/login')({
  beforeLoad: requireGuest,
  component: LoginPage,
})

function LoginPage() {
  return (
    <Container size="xs" py="xl">
      <Stack gap="lg">
        <LoginForm />
        <Text size="xs" c="dimmed">
          시드 계정: <Code>test@test.com</Code> / <Code>password123</Code>
        </Text>
        <Anchor component={Link} to="/" size="sm">
          ← 홈
        </Anchor>
      </Stack>
    </Container>
  )
}
