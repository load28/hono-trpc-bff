import { loginInput, registerInput } from '@memo/shared'
import { Hono } from 'hono'
import { sessionStore } from '../session/store'
import { clearSessionCookie, readSessionId, writeSessionCookie } from './cookies'
import { userStore } from './user-store'

export const authApp = new Hono()

authApp.post('/register', async (c) => {
  const parsed = registerInput.safeParse(await c.req.json())
  if (!parsed.success) {
    return c.json({ error: 'invalid input' }, 400)
  }

  try {
    const user = await userStore.register(parsed.data.email, parsed.data.password)
    writeSessionCookie(c, sessionStore.create(user))
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

  writeSessionCookie(c, sessionStore.create(user))
  return c.json({ user })
})

authApp.post('/logout', (c) => {
  const sid = readSessionId(c)
  if (sid) sessionStore.delete(sid)
  clearSessionCookie(c)
  return c.json({ ok: true })
})

authApp.get('/me', (c) => {
  const sid = readSessionId(c)
  if (!sid) return c.json({ user: null })
  const session = sessionStore.get(sid)
  return c.json({ user: session?.user ?? null })
})
