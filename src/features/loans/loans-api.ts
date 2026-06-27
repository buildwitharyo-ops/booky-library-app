import { http } from '@/lib/api'
import type { Loan } from '@/types/models'

export function borrowBook(bookId: number, days: number) {
  return http.post<{ loan: Loan }>('/loans', { bookId, days })
}
