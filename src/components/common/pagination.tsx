import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Pagination as PaginationMeta } from '@/types/api'
import { cn } from '@/lib/utils'

function buildPages(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | 'ellipsis')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) pages.push('ellipsis')
  for (let page = start; page <= end; page++) pages.push(page)
  if (end < total - 1) pages.push('ellipsis')
  pages.push(total)

  return pages
}

const edgeButton =
  'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground disabled:pointer-events-none disabled:opacity-40'

export function Pagination({
  pagination,
  onPageChange,
  className,
}: {
  pagination: PaginationMeta
  onPageChange: (page: number) => void
  className?: string
}) {
  const { page, totalPages, total, limit } = pagination
  if (totalPages <= 1) return null

  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)
  const pages = buildPages(page, totalPages)

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-4 sm:flex-row',
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">
        Showing {from} to {to} of {total} entries
      </p>
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={edgeButton}
        >
          <ChevronLeft className="size-4" />
          Previous
        </button>

        {pages.map((entry, index) =>
          entry === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => onPageChange(entry)}
              aria-current={entry === page ? 'page' : undefined}
              className={cn(
                'inline-flex size-9 items-center justify-center rounded-md text-sm transition',
                entry === page
                  ? 'border border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {entry}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={edgeButton}
        >
          Next
          <ChevronRight className="size-4" />
        </button>
      </nav>
    </div>
  )
}
