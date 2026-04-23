import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { createContext } from './context'
import { authApp } from './features/auth/http'
import { initializeUserStore } from './features/auth/user-store'
import { appRouter } from './router'

await initializeUserStore()

const app = new Hono()

app.use('*', logger())

app.use(
  '*',
  cors({
    origin: ['http://localhost:4000'],
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  }),
)

app.get('/health', (c) => c.json({ ok: true }))

app.route('/auth', authApp)

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    endpoint: '/trpc',
    createContext: (_opts, c) => createContext(c),
  }),
)

const port = Number(process.env.PORT ?? 4001)

console.log(`BFF listening on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}
