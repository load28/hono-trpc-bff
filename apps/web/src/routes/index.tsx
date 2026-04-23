import { useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { authApi } from '~/lib/auth'
import { authKeys, dashboardHomeQueryOptions, screenKeys } from '~/lib/queries'
import { trpc } from '~/lib/trpc'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' })
  },
  loader: ({ context }) => context.queryClient.fetchQuery(dashboardHomeQueryOptions),
  component: Dashboard,
})

function Dashboard() {
  const data = Route.useLoaderData()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || busy) return
    setBusy(true)
    try {
      await trpc.memo.create.mutate({ title, body })
      setTitle('')
      setBody('')
      queryClient.invalidateQueries({ queryKey: screenKeys.allMemoScreens })
      await router.invalidate()
    } finally {
      setBusy(false)
    }
  }

  async function onLogout() {
    if (busy) return
    setBusy(true)
    try {
      await authApi.logout()
      queryClient.removeQueries({ queryKey: authKeys.all })
      queryClient.removeQueries({ queryKey: screenKeys.allMemoScreens })
      await router.invalidate()
    } finally {
      setBusy(false)
    }
  }

  const { user, stats, recentMemos } = data

  return (
    <main
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: 720,
        margin: '2rem auto',
        padding: '0 1rem',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: 0 }}>Memo</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 14 }}>
          <span style={{ color: '#555' }}>{user.email}</span>
          <button type="button" onClick={onLogout} disabled={busy} style={{ padding: '4px 10px' }}>
            로그아웃
          </button>
        </div>
      </header>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <StatCard label="전체" value={stats.total} />
        <StatCard label="오늘" value={stats.today} />
        <StatCard label="이번 주" value={stats.thisWeek} />
      </section>

      <form onSubmit={onCreate} style={{ display: 'grid', gap: 8, marginBottom: 32 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          style={{ padding: 8 }}
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="본문"
          rows={3}
          style={{ padding: 8, fontFamily: 'inherit' }}
        />
        <button type="submit" disabled={busy} style={{ padding: '8px 16px', width: 'fit-content' }}>
          추가
        </button>
      </form>

      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18 }}>최근 메모</h2>
          <Link to="/memos" style={{ color: '#06c', fontSize: 14 }}>
            전체 타임라인 →
          </Link>
        </div>

        {recentMemos.length === 0 ? (
          <p style={{ color: '#888' }}>메모가 없습니다.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
            {recentMemos.map((m) => (
              <li key={m.id}>
                <Link
                  to="/memos/$id"
                  params={{ id: m.id }}
                  style={{
                    display: 'block',
                    border: '1px solid #ddd',
                    padding: 12,
                    borderRadius: 6,
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <strong>{m.title}</strong>
                  {m.body && (
                    <p
                      style={{
                        whiteSpace: 'pre-wrap',
                        margin: '6px 0 0',
                        color: '#555',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {m.body}
                    </p>
                  )}
                  <small style={{ color: '#888' }}>
                    {new Date(m.createdAt).toLocaleString()}
                  </small>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 6,
        padding: 12,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 12, color: '#888' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>{value}</div>
    </div>
  )
}
