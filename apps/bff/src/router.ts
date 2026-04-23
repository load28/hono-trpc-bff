import { authRouter } from './features/auth/router'
import { memoRouter } from './features/memo/router'
import { screenRouter } from './features/memo/screen-router'
import { router } from './trpc'

export const appRouter = router({
  auth: authRouter,
  screen: screenRouter,
  memo: memoRouter,
})

export type AppRouter = typeof appRouter
