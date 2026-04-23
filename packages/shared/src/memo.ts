import { z } from 'zod'

export const memoIdSchema = z.string().min(1)

export const memoSchema = z.object({
  id: memoIdSchema,
  title: z.string().min(1).max(200),
  body: z.string().max(10_000),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const createMemoInput = z.object({
  title: z.string().min(1).max(200),
  body: z.string().max(10_000),
})

export const updateMemoInput = z.object({
  id: memoIdSchema,
  title: z.string().min(1).max(200).optional(),
  body: z.string().max(10_000).optional(),
})

export const memoIdInput = z.object({ id: memoIdSchema })

export type Memo = z.infer<typeof memoSchema>
export type CreateMemoInput = z.infer<typeof createMemoInput>
export type UpdateMemoInput = z.infer<typeof updateMemoInput>
