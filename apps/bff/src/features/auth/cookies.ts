import type { Context as HonoContext } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { SESSION_COOKIE, SESSION_COOKIE_MAX_AGE_SECONDS } from '../../shared/constants'

export const readSessionId = (c: HonoContext): string | undefined => getCookie(c, SESSION_COOKIE)

export const writeSessionCookie = (c: HonoContext, sid: string): void => {
  setCookie(c, SESSION_COOKIE, sid, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
    path: '/',
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  })
}

export const clearSessionCookie = (c: HonoContext): void => {
  deleteCookie(c, SESSION_COOKIE, { path: '/' })
}
