import { createMemoInput, memoIdInput, updateMemoInput } from '@memo/shared'
import { TRPCError } from '@trpc/server'
import { protectedProcedure, router } from '../../trpc'
import { memoStore } from './store'

export const memoRouter = router({
  create: protectedProcedure
    .input(createMemoInput)
    .mutation(({ ctx, input }) => memoStore.insert(input, ctx.user.id)),

  update: protectedProcedure.input(updateMemoInput).mutation(({ ctx, input }) => {
    const updated = memoStore.patch(input, ctx.user.id)
    if (!updated) throw new TRPCError({ code: 'NOT_FOUND' })
    return updated
  }),

  delete: protectedProcedure.input(memoIdInput).mutation(({ ctx, input }) => {
    const ok = memoStore.remove(input.id, ctx.user.id)
    if (!ok) throw new TRPCError({ code: 'NOT_FOUND' })
    return { id: input.id }
  }),
})
