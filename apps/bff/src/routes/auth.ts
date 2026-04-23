import { loginInput, registerInput } from '@memo/shared'
import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { SESSION_COOKIE, SESSION_COOKIE_MAX_AGE_SECONDS } from '../constants'
import { sessionStore } from '../sessions'
import { userStore } from '../users'

export const authApp = new Hono()

authApp.post('/register', async (c) => {
  const parsed = registerInput.safeParse(await c.req.json())
  if (!parsed.success) {
    return c.json({ error: 'invalid input' }, 400)
  }

  try {
    const user = await userStore.register(parsed.data.email, parsed.data.password)
    const sid = sessionStore.create(user)
    writeSessionCookie(c, sid)
    return c.json({ user })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'register failed'
    return c.json({ error: message }, 409)
  }
})

authApp.post('/login', async (c) => {
  const parsed = loginInput.safeParse(await c.req.json())
  if (!parsed.success) {
    return c.json({ error: 'invalid input' }, 400)
  }

  const user = await userStore.verify(parsed.data.email, parsed.data.password)
  if (!user) {
    return c.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, 401)
  }

  const sid = sessionStore.create(user)
  writeSessionCookie(c, sid)
  return c.json({ user })
})

authApp.post('/logout', (c) => {
  const sid = getCookie(c, SESSION_COOKIE)
  if (sid) sessionStore.delete(sid)
  deleteCookie(c, SESSION_COOKIE, { path: '/' })
  return c.json({ ok: true })
})

authApp.get('/me', (c) => {
  const sid = getCookie(c, SESSION_COOKIE)
  if (!sid) return c.json({ user: null })
  const s = sessionStore.get(sid)
  return c.json({ user: s?.user ?? null })
})

function writeSessionCookie(c: Parameters<typeof setCookie>[0], sid: string) {
  setCookie(c, SESSION_COOKIE, sid, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
    path: '/',
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  })
}
