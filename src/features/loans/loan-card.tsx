import { Loader2 } from 'lucide-react'
import type { Loan, LoanDisplayStatus } from '@/types/models'
import { formatDate, dueLabel } from '@/lib/format'
import { BookCover } from '@/components/book/book-cover'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DueDatePill, StatusBadge } from '@/components/common/status-badge'

function statusOf(loan: Loan): LoanDisplayStatus {
  if (loan.displayStatus) return loan.displayStatus
  if (loan.status === 'RETURNED') return 'Returned'
  if (loan.status === 'LATE') return 'Overdue'
  return 'Active'
}

export function LoanCard({
  loan,
  onReview,
  onReturn,
  isReturning,
}: {
  loan: Loan
  onReview: (loan: Loan) => void
  onReturn: (loan: Loan) => void
  isReturning?: boolean
}) {
  const status = statusOf(loan)
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <BookCover
            src={loan.book.coverImage}
            alt={loan.book.title}
            className="h-24 w-16 shrink-0"
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
              {!isReturned ? ` · ${dueLabel(loan.dueAt)}` : ''}
            </p>
          </div>
        </div>

        <div className="shrink-0 sm:self-center">
          {isReturned ? (
            <Button className="w-full sm:w-auto" onClick={() => onReview(loan)}>
              Give Review
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onReturn(loan)}
              disabled={isReturning}
            >
              {isReturning ? (
                <>
                  <Loader2 className="animate-spin" />
                  Returning…
                </>
              ) : (
                'Return'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
