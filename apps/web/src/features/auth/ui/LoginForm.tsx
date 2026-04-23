import { Anchor, Button, Group, Stack, TextInput, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { useLoginMutation, useRegisterMutation } from '../mutations'

type Mode = 'login' | 'register'

const headingByMode: Record<Mode, string> = { login: '로그인', register: '회원가입' }
const submitLabelByMode: Record<Mode, string> = { login: '로그인', register: '가입하기' }
const switchPromptByMode: Record<Mode, string> = {
  login: '계정이 없나요?',
  register: '이미 가입됨?',
}
const oppositeMode: Record<Mode, Mode> = { login: 'register', register: 'login' }

export function LoginForm() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('test@test.com')
  const [password, setPassword] = useState('password123')

  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()
  const activeMutation = mode === 'login' ? loginMutation : registerMutation
  const busy = activeMutation.isPending

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    const result = await activeMutation.mutateAsync({ email, password })
    if (!result.ok) {
      notifications.show({
        title: `${headingByMode[mode]} 실패`,
        message: result.error,
        color: 'red',
      })
    }
  }

  return (
    <Stack gap="md">
      <Title order={2}>{headingByMode[mode]}</Title>

      <form onSubmit={onSubmit}>
        <Stack gap="sm">
          <TextInput
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            autoComplete="email"
            required
          />
          <TextInput
            label="비밀번호 (8자 이상)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
            minLength={8}
          />
          <Button type="submit" loading={busy}>
            {submitLabelByMode[mode]}
          </Button>
        </Stack>
      </form>

      <Group gap="xs">
        <Anchor
          component="button"
          type="button"
          size="sm"
          onClick={() => setMode(oppositeMode[mode])}
        >
          {switchPromptByMode[mode]} {submitLabelByMode[oppositeMode[mode]]}
        </Anchor>
      </Group>
    </Stack>
  )
}
