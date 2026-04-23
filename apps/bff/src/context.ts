import type { PublicUser } from '@memo/shared'
import type { Context as HonoContext } from 'hono'
import { readSessionId } from './features/auth/cookies'
import { sessionStore } from './features/session/store'

export type Ctx = {
  user: PublicUser | null
  hono: HonoContext
}

export function createContext(c: HonoContext): Ctx {
  const sid = readSessionId(c)
  if (!sid) return { user: null, hono: c }

  const session = sessionStore.get(sid)
  return { user: session?.user ?? null, hono: c }
}
