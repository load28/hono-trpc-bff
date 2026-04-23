import type { PublicUser } from '@memo/shared'

type UserRecord = PublicUser & { passwordHash: string }

const users = new Map<string, UserRecord>()
const emailIndex = new Map<string, string>()

const toPublicUser = (record: UserRecord): PublicUser => ({
  id: record.id,
  email: record.email,
})

const insertUser = (record: UserRecord): void => {
  users.set(record.id, record)
  emailIndex.set(record.email, record.id)
}

const SEED_EMAIL = 'test@test.com'
const SEED_PASSWORD = 'password123'

export async function initializeUserStore(): Promise<void> {
  if (emailIndex.size > 0) return
  insertUser({
    id: crypto.randomUUID(),
    email: SEED_EMAIL,
    passwordHash: await Bun.password.hash(SEED_PASSWORD),
  })
}

export const userStore = {
  async register(email: string, password: string): Promise<PublicUser> {
    if (emailIndex.has(email)) {
      throw new Error('이미 가입된 이메일입니다.')
    }
    const record: UserRecord = {
      id: crypto.randomUUID(),
      email,
      passwordHash: await Bun.password.hash(password),
    }
    insertUser(record)
    return toPublicUser(record)
  },

  async verify(email: string, password: string): Promise<PublicUser | null> {
    const id = emailIndex.get(email)
    if (!id) return null
    const record = users.get(id)
    if (!record) return null
    const ok = await Bun.password.verify(password, record.passwordHash)
    return ok ? toPublicUser(record) : null
  },

  getById(id: string): PublicUser | null {
    const record = users.get(id)
    return record ? toPublicUser(record) : null
  },
}
