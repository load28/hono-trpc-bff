import { z } from 'zod'

export const emailSchema = z.email().max(320)
export const passwordSchema = z.string().min(8).max(200)

export const loginInput = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const registerInput = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const userSchema = z.object({
  id: z.string(),
  email: emailSchema,
})

export type LoginInput = z.infer<typeof loginInput>
export type RegisterInput = z.infer<typeof registerInput>
export type PublicUser = z.infer<typeof userSchema>
