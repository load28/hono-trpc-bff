import { memoIdInput } from '@memo/shared'
import { TRPCError } from '@trpc/server'
import { protectedProcedure, router } from '../../trpc'
import { getDashboard, getDetail, getTimeline } from './aggregations'

export const screenRouter = router({
  dashboard: protectedProcedure.query(({ ctx }) => {
    const { stats, recentMemos } = getDashboard(ctx.user.id)
    return { user: ctx.user, stats, recentMemos }
  }),

  memoTimeline: protectedProcedure.query(({ ctx }) => getTimeline(ctx.user.id)),

  memoDetail: protectedProcedure.input(memoIdInput).query(({ ctx, input }) => {
    const result = getDetail(input.id, ctx.user.id)
    if (!result) throw new TRPCError({ code: 'NOT_FOUND' })
    return result
  }),
})
