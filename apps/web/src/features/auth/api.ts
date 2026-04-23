import type { LoginInput, PublicUser, RegisterInput } from '@memo/shared'
import { BFF_URL } from '~/shared/config'

export type AuthResult = { ok: true; user: PublicUser } | { ok: false; error: string }

type AuthResponseBody = { user?: PublicUser; error?: string } | null

const parseAuthResponse = async (res: Response): Promise<AuthResult> => {
  const data = (await res.json().catch(() => null)) as AuthResponseBody
  if (!res.ok) {
    return { ok: false, error: data?.error ?? `HTTP ${res.status}` }
  }
  if (!data?.user) {
    return { ok: false, error: 'invalid response' }
  }
  return { ok: true, user: data.user }
}

const postAuth = async (path: string, body: unknown): Promise<AuthResult> => {
  const res = await fetch(`${BFF_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  return parseAuthResponse(res)
}

export const authApi = {
  login: (input: LoginInput) => postAuth('/auth/login', input),
  register: (input: RegisterInput) => postAuth('/auth/register', input),
  async logout(): Promise<void> {
    await fetch(`${BFF_URL}/auth/logout`, { method: 'POST', credentials: 'include' })
  },
}
