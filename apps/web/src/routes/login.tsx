import { useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { authApi } from '~/lib/auth'
import { authMeQueryOptions } from '~/lib/queries'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: '/' })
  },
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('test@test.com')
  const [password, setPassword] = useState('password123')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      const result =
        mode === 'login'
          ? await authApi.login({ email, password })
          : await authApi.register({ email, password })
      if (!result.ok) {
        setError(result.error)
        return
      }
      queryClient.setQueryData(authMeQueryOptions.queryKey, result.user)
      await router.invalidate()
    } finally {
      setBusy(false)
    }
  }

  return (
    <main
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: 360,
        margin: '4rem auto',
        padding: '0 1rem',
      }}
    >
      <h1>{mode === 'login' ? '로그인' : '회원가입'}</h1>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, marginTop: 16 }}>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>이메일</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            style={{ padding: 8 }}
          />
        </label>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>비밀번호 (8자 이상)</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
            minLength={8}
            style={{ padding: 8 }}
          />
        </label>
        {error && <p style={{ color: '#c00', margin: 0 }}>{error}</p>}
        <button type="submit" disabled={busy} style={{ padding: '8px 16px' }}>
          {busy ? '...' : mode === 'login' ? '로그인' : '가입하기'}
        </button>
      </form>

      <p style={{ marginTop: 16, fontSize: 14, color: '#555' }}>
        {mode === 'login' ? '계정이 없나요?' : '이미 가입됨?'}{' '}
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            color: '#06c',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {mode === 'login' ? '가입하기' : '로그인'}
        </button>
      </p>

      <p style={{ marginTop: 24, fontSize: 12, color: '#888' }}>
        시드 계정: <code>test@test.com</code> / <code>password123</code>
      </p>

      <p style={{ marginTop: 16 }}>
        <Link to="/" style={{ color: '#06c' }}>
          ← 홈
        </Link>
      </p>
    </main>
  )
}
