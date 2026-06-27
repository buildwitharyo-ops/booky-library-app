import { http } from '@/lib/api'
import type { Loan } from '@/types/models'
import type { Pagination } from '@/types/api'

export function borrowBook(bookId: number, days: number) {
  return http.post<{ loan: Loan }>('/loans', { bookId, days })
}

export type MyLoanStatus = 'all' | 'active' | 'returned' | 'overdue'

export type MyLoansResponse = {
  loans: Loan[]
  pagination: Pagination
}

export type MyLoansParams = {
  status?: MyLoanStatus
  q?: string
  page?: number
  limit?: number
}

export function getMyLoans(params: MyLoansParams) {
  return http.get<MyLoansResponse>('/loans/my', { params })
}

export function returnLoan(loanId: number) {
  return http.patch<{ loan: Loan }>(`/loans/${loanId}/return`, {})
}
