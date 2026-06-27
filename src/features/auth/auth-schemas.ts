import { z } from 'zod'

const emailField = z
  .string()
  .min(1, 'Email is required')
  .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Enter a valid email')

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: emailField,
  phone: z.string().trim().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type RegisterInput = z.infer<typeof registerSchema>
