import type { PublicUser } from '@memo/shared'
import { redirect } from '@tanstack/react-router'

type GuardContext = { context: { user: PublicUser | null | undefined } }

export const requireAuth = ({ context }: GuardContext): void => {
  if (!context.user) throw redirect({ to: '/login' })
}

export const requireGuest = ({ context }: GuardContext): void => {
  if (context.user) throw redirect({ to: '/' })
}
