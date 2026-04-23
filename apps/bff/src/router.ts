import { createMemoInput, memoIdInput, updateMemoInput } from '@memo/shared'
import { TRPCError } from '@trpc/server'
import { memoStore } from './store'
import { protectedProcedure, publicProcedure, router } from './trpc'

const dashboardRouter = router({
  // Screen: Home/Dashboard
  // 한 번에 내려주는 것: user + stats(3개) + 최근 메모 5개.
  // 가이드 섹션 9의 "데이터 가공(Aggregation)" 예시를 그대로 따름.
  home: protectedProcedure.query(({ ctx }) => {
    const { stats, recentMemos } = memoStore.getDashboard(ctx.user.id)
    return { user: ctx.user, stats, recentMemos }
  }),
})

const memoRouter = router({
  // ===== Screen-centric reads =====

  // Screen: Timeline (/memos)
  // 날짜별로 그룹핑된 상태로 내려줌. 클라는 바로 렌더.
  timeline: protectedProcedure.query(({ ctx }) => memoStore.getTimeline(ctx.user.id)),

  // Screen: Detail (/memos/:id)
  // memo 본문 + 네비게이션용 prev/next(최소 필드) + 같은 날 관련 메모.
  // 가이드 "응답 형태 최적화"의 실제 예.
  detail: protectedProcedure.input(memoIdInput).query(({ ctx, input }) => {
    const result = memoStore.getDetail(input.id, ctx.user.id)
    if (!result) throw new TRPCError({ code: 'NOT_FOUND' })
    return result
  }),

  // ===== Resource-centric mutations =====
  create: protectedProcedure
    .input(createMemoInput)
    .mutation(({ ctx, input }) => memoStore.create(input, ctx.user.id)),

  update: protectedProcedure.input(updateMemoInput).mutation(({ ctx, input }) => {
    const updated = memoStore.update(input, ctx.user.id)
    if (!updated) throw new TRPCError({ code: 'NOT_FOUND' })
    return updated
  }),

  delete: protectedProcedure.input(memoIdInput).mutation(({ ctx, input }) => {
    const ok = memoStore.delete(input.id, ctx.user.id)
    if (!ok) throw new TRPCError({ code: 'NOT_FOUND' })
    return { id: input.id }
  }),
})

const authRouter = router({
  me: publicProcedure.query(({ ctx }) => ctx.user),
})

export const appRouter = router({
  auth: authRouter,
  dashboard: dashboardRouter,
  memo: memoRouter,
})

export type AppRouter = typeof appRouter
