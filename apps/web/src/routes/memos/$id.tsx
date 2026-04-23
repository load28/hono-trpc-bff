import { useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { memoDetailQueryOptions, screenKeys } from '~/lib/queries'
import { trpc } from '~/lib/trpc'

export const Route = createFileRoute('/memos/$id')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' })
  },
  loader: ({ context, params }) =>
    context.queryClient.fetchQuery(memoDetailQueryOptions(params.id)),
  component: MemoDetail,
})

function MemoDetail() {
  const { memo, neighbors, related } = Route.useLoaderData()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [busy, setBusy] = useState(false)

  async function onDelete() {
    if (busy) return
    if (!confirm('이 메모를 삭제할까요?')) return
    setBusy(true)
    try {
      await trpc.memo.delete.mutate({ id: memo.id })
      queryClient.invalidateQueries({ queryKey: screenKeys.allMemoScreens })
      router.navigate({ to: '/memos' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <main
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: 720,
        margin: '2rem auto',
        padding: '0 1rem',
      }}
    >
      <header style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginBottom: 24 }}>
        <Link to="/memos" style={{ color: '#06c', fontSize: 14 }}>
          ← 타임라인
        </Link>
        <Link to="/" style={{ color: '#06c', fontSize: 14 }}>
          홈
        </Link>
      </header>

      <article style={{ border: '1px solid #ddd', borderRadius: 6, padding: 16, marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>{memo.title}</h1>
        <small style={{ color: '#888' }}>
          작성 {new Date(memo.createdAt).toLocaleString()}
          {memo.updatedAt !== memo.createdAt &&
            ` · 수정 ${new Date(memo.updatedAt).toLocaleString()}`}
        </small>
        {memo.body && (
          <p style={{ whiteSpace: 'pre-wrap', margin: '16px 0 0', lineHeight: 1.6 }}>{memo.body}</p>
        )}
        <div style={{ marginTop: 16 }}>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            style={{ padding: '6px 12px', color: '#c00' }}
          >
            삭제
          </button>
        </div>
      </article>

      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 24,
          fontSize: 14,
        }}
      >
        {neighbors.prev ? (
          <Link
            to="/memos/$id"
            params={{ id: neighbors.prev.id }}
            style={{
              flex: 1,
              textAlign: 'left',
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 6,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div style={{ color: '#888', fontSize: 12 }}>← 이전</div>
            <div style={{ marginTop: 4 }}>{neighbors.prev.title}</div>
          </Link>
        ) : (
          <div style={{ flex: 1 }} />
        )}
        {neighbors.next ? (
          <Link
            to="/memos/$id"
            params={{ id: neighbors.next.id }}
            style={{
              flex: 1,
              textAlign: 'right',
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 6,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div style={{ color: '#888', fontSize: 12 }}>다음 →</div>
            <div style={{ marginTop: 4 }}>{neighbors.next.title}</div>
          </Link>
        ) : (
          <div style={{ flex: 1 }} />
        )}
      </nav>

      {related.length > 0 && (
        <section>
          <h2 style={{ fontSize: 14, color: '#555', margin: '0 0 8px' }}>같은 날 메모</h2>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 6 }}>
            {related.map((r) => (
              <li key={r.id}>
                <Link
                  to="/memos/$id"
                  params={{ id: r.id }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 8,
                    border: '1px solid #eee',
                    borderRadius: 4,
                    textDecoration: 'none',
                    color: 'inherit',
                    fontSize: 14,
                  }}
                >
                  <span>{r.title}</span>
                  <small style={{ color: '#888' }}>
                    {new Date(r.createdAt).toLocaleTimeString()}
                  </small>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
