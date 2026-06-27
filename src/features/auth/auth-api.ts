import { http } from '@/lib/api'
import type { User } from '@/types/models'
import type { LoginInput, RegisterInput } from './auth-schemas'

type LoginResponse = { token: string; user: User }

export function login(input: LoginInput) {
  return http.post<LoginResponse>('/auth/login', input)
}

export function register(input: RegisterInput) {
  const { phone, ...rest } = input
  const payload = phone ? { ...rest, phone } : rest
  return http.post<User>('/auth/register', payload)
}
