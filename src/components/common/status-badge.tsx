import type { LoanDisplayStatus } from '@/types/models'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format'

const STATUS_STYLES: Record<LoanDisplayStatus, string> = {
  Active: 'bg-success/10 text-success',
  Returned: 'bg-muted text-muted-foreground',
  Overdue: 'bg-danger/10 text-danger',
}

export function StatusBadge({
  status,
  className,
}: {
  status: LoanDisplayStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        STATUS_STYLES[status],
        className,
      )}
    >
      {status}
    </span>
  )
}

/** Light red pill used for a loan's due date. */
export function DueDatePill({
  dueAt,
  className,
}: {
  dueAt: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger',
        className,
      )}
    >
      {formatDate(dueAt)}
    </span>
  )
}
