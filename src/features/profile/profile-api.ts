import { http } from '@/lib/api'
import type { MeProfile, User } from '@/types/models'

export function getMe() {
  return http.get<MeProfile>('/me')
}

export type UpdateProfileInput = {
  name?: string
  phone?: string
  photo?: File | null
}

export function updateProfile(input: UpdateProfileInput) {
  // Multipart when a photo is attached, plain JSON otherwise.
  if (input.photo) {
    const form = new FormData()
    if (input.name !== undefined) form.append('name', input.name)
    if (input.phone !== undefined) form.append('phone', input.phone)
    form.append('profilePhoto', input.photo)
    return http.patch<{ profile: User }>('/me', form)
  }

  const body: Record<string, string> = {}
  if (input.name !== undefined) body.name = input.name
  if (input.phone !== undefined) body.phone = input.phone
  return http.patch<{ profile: User }>('/me', body)
}
