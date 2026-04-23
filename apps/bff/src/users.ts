import type { PublicUser } from '@memo/shared'

type UserRecord = PublicUser & { passwordHash: string }

const users = new Map<string, UserRecord>()
const emailIndex = new Map<string, string>()

async function seed() {
  if (emailIndex.size > 0) return
  const email = 'test@test.com'
  const passwordHash = await Bun.password.hash('password123')
  const user: UserRecord = { id: crypto.randomUUID(), email, passwordHash }
  users.set(user.id, user)
  emailIndex.set(email, user.id)
}

await seed()

export const userStore = {
  async register(email: string, password: string): Promise<PublicUser> {
    if (emailIndex.has(email)) {
      throw new Error('이미 가입된 이메일입니다.')
    }
    const passwordHash = await Bun.password.hash(password)
    const user: UserRecord = { id: crypto.randomUUID(), email, passwordHash }
    users.set(user.id, user)
    emailIndex.set(email, user.id)
    return { id: user.id, email: user.email }
  },

  async verify(email: string, password: string): Promise<PublicUser | null> {
    const id = emailIndex.get(email)
    if (!id) return null
    const user = users.get(id)
    if (!user) return null
    const ok = await Bun.password.verify(password, user.passwordHash)
    if (!ok) return null
    return { id: user.id, email: user.email }
  },

  getById(id: string): PublicUser | null {
    const u = users.get(id)
    return u ? { id: u.id, email: u.email } : null
  },
}
