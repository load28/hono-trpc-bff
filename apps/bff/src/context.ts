import type { PublicUser } from '@memo/shared'
import type { Context as HonoContext } from 'hono'
import { getCookie } from 'hono/cookie'
import { SESSION_COOKIE } from './constants'
import { sessionStore } from './sessions'

export type Ctx = {
  user: PublicUser | null
  hono: HonoContext
}

export function createContext(c: HonoContext): Ctx {
  const sid = getCookie(c, SESSION_COOKIE)
  if (!sid) return { user: null, hono: c }

  const session = sessionStore.get(sid)
  if (!session) return { user: null, hono: c }

  return { user: session.user, hono: c }
}
