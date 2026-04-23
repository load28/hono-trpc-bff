import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { memoTimelineQueryOptions } from '~/lib/queries'

export const Route = createFileRoute('/memos/')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' })
  },
  loader: ({ context }) => context.queryClient.fetchQuery(memoTimelineQueryOptions),
  component: Timeline,
})

function Timeline() {
  const { totalCount, groups } = Route.useLoaderData()

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
        <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
          <Link to="/" style={{ color: '#06c', fontSize: 14 }}>
            ← 홈
          </Link>
          <h1 style={{ margin: 0 }}>타임라인</h1>
        </div>
        <span style={{ color: '#888', fontSize: 14 }}>총 {totalCount}개</span>
      </header>

      {groups.length === 0 ? (
        <p style={{ color: '#888' }}>메모가 없습니다.</p>
      ) : (
        <div style={{ display: 'grid', gap: 24 }}>
          {groups.map((g) => (
            <section key={g.date}>
              <h2
                style={{
                  fontSize: 14,
                  color: '#555',
                  margin: '0 0 8px',
                  borderBottom: '1px solid #eee',
                  paddingBottom: 4,
                }}
              >
                {g.dayLabel}{' '}
                <small style={{ color: '#aaa', fontWeight: 400 }}>({g.memos.length})</small>
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
                {g.memos.map((m) => (
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
                        {new Date(m.createdAt).toLocaleTimeString()}
                      </small>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}
