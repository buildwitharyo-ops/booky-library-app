import { http } from '@/lib/api'
import type { Category } from '@/types/models'

export function getCategories() {
  return http.get<{ categories: Category[] }>('/categories')
}
