import type { Loan, LoanDisplayStatus } from '@/types/models'

/** Prefer the backend's `displayStatus`, falling back to the raw status. */
export function loanDisplayStatus(loan: Loan): LoanDisplayStatus {
  if (loan.displayStatus) return loan.displayStatus
  if (loan.status === 'RETURNED') return 'Returned'
  if (loan.status === 'LATE') return 'Overdue'
  return 'Active'
}
