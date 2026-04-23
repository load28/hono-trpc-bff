import { createMemoInput, memoIdInput, updateMemoInput } from '@memo/shared'
import { TRPCError } from '@trpc/server'
import { memoStore } from './store'
import { protectedProcedure, publicProcedure, router } from './trpc'

// ===== Screen-centric router =====
// 화면 단위로 필요한 데이터를 한 번에 집계해서 내려주는 BFF 엔드포인트.
// 가이드 섹션 9 "데이터 가공(Aggregation)"과 "응답 형태 최적화"를 담당.
const screenRouter = router({
  // Screen: Home/Dashboard
  // user + stats(3개) + 최근 메모 5개를 한 번에 내려줌.
  dashboard: protectedProcedure.query(({ ctx }) => {
    const { stats, recentMemos } = memoStore.getDashboard(ctx.user.id)
    return { user: ctx.user, stats, recentMemos }
  }),

  // Screen: Timeline (/memos)
  // 날짜별로 그룹핑된 상태로 내려줌. 클라는 바로 렌더.
  memoTimeline: protectedProcedure.query(({ ctx }) => memoStore.getTimeline(ctx.user.id)),

  // Screen: Detail (/memos/:id)
  // memo 본문 + 네비게이션용 prev/next(최소 필드) + 같은 날 관련 메모.
  memoDetail: protectedProcedure.input(memoIdInput).query(({ ctx, input }) => {
    const result = memoStore.getDetail(input.id, ctx.user.id)
    if (!result) throw new TRPCError({ code: 'NOT_FOUND' })
    return result
  }),
})

// ===== Primitive resource router =====
// 리소스 단위의 CRUD. 화면 구조와 무관한 원시 연산.
const memoRouter = router({
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
  screen: screenRouter,
  memo: memoRouter,
})

export type AppRouter = typeof appRouter
