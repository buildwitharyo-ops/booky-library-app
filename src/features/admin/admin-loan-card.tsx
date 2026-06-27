import type { Loan } from '@/types/models'
import { formatDate } from '@/lib/format'
import { loanDisplayStatus } from '@/lib/loan'
import { BookCover } from '@/components/book/book-cover'
import { Badge } from '@/components/ui/badge'
import { DueDatePill, StatusBadge } from '@/components/common/status-badge'

export function AdminLoanCard({ loan }: { loan: Loan }) {
  const status = loanDisplayStatus(loan)
  const isReturned = status === 'Returned'

  return (
    <div className="space-y-4 rounded-2xl border p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Status</span>
          <StatusBadge status={status} />
        </div>
        {!isReturned && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Due Date</span>
            <DueDatePill dueAt={loan.dueAt} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <BookCover
            src={loan.book.coverImage}
            alt={loan.book.title}
            className="h-20 w-14 shrink-0"
          />
          <div className="min-w-0">
            {loan.book.category && (
              <Badge variant="secondary" className="mb-1">
                {loan.book.category.name}
              </Badge>
            )}
            <p className="truncate font-semibold">{loan.book.title}</p>
            <p className="truncate text-sm text-muted-foreground">
              {loan.book.author?.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDate(loan.borrowedAt)}
              {loan.durationDays ? ` · Duration ${loan.durationDays} Days` : ''}
            </p>
          </div>
        </div>

        {loan.borrower && (
          <div className="shrink-0 text-sm sm:text-right">
            <p className="text-xs text-muted-foreground">Borrower</p>
            <p className="font-semibold">{loan.borrower.name}</p>
            <p className="text-xs text-muted-foreground">{loan.borrower.email}</p>
          </div>
        )}
      </div>
    </div>
  )
}
