import type { PublicUser } from '@memo/shared'

type Session = {
  user: PublicUser
  expiresAt: number
}

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

const sessions = new Map<string, Session>()

export const sessionStore = {
  create(user: PublicUser): string {
    const id = crypto.randomUUID()
    sessions.set(id, { user, expiresAt: Date.now() + SESSION_TTL_MS })
    return id
  },

  get(id: string): Session | null {
    const s = sessions.get(id)
    if (!s) return null
    if (s.expiresAt < Date.now()) {
      sessions.delete(id)
      return null
    }
    return s
  },

  delete(id: string): boolean {
    return sessions.delete(id)
  },
}
