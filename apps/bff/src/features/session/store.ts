import type { PublicUser } from '@memo/shared'
import { SESSION_TTL_MS } from '../../shared/constants'

type Session = {
  user: PublicUser
  expiresAt: number
}

const sessions = new Map<string, Session>()

const isExpired = (session: Session): boolean => session.expiresAt < Date.now()

export const sessionStore = {
  create(user: PublicUser): string {
    const id = crypto.randomUUID()
    sessions.set(id, { user, expiresAt: Date.now() + SESSION_TTL_MS })
    return id
  },

  get(id: string): Session | null {
    const session = sessions.get(id)
    if (!session) return null
    if (isExpired(session)) {
      sessions.delete(id)
      return null
    }
    return session
  },

  delete(id: string): boolean {
    return sessions.delete(id)
  },
}
