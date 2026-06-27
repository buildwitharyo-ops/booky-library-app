import { useState } from 'react'
import { toast } from 'sonner'
import type { Book, Loan } from '@/types/models'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Skeleton } from '@/components/ui/skeleton'
import { FilterChips, type ChipOption } from '@/components/common/filter-chips'
import { SearchInput } from '@/components/common/search-input'
import { LoadMore } from '@/components/common/load-more'
import { EmptyState, ErrorState } from '@/components/common/page-state'
import { GiveReviewDialog } from '@/features/reviews/give-review-dialog'
import { LoanCard } from './loan-card'
import { useMyLoans, useReturnLoan } from './use-loans'
import type { MyLoanStatus } from './loans-api'

const STATUS_OPTIONS: ChipOption<MyLoanStatus>[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Returned', value: 'returned' },
  { label: 'Overdue', value: 'overdue' },
]

export function BorrowedListPage() {
  const [status, setStatus] = useState<MyLoanStatus>('all')
  const [search, setSearch] = useState('')
  const q = useDebouncedValue(search.trim(), 400)
  const [reviewBook, setReviewBook] = useState<Book | null>(null)

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyLoans({ status, q: q || undefined })

  const returnLoan = useReturnLoan()
  const loans = data?.pages.flatMap((page) => page.loans) ?? []

  function handleReturn(loan: Loan) {
    returnLoan.mutate(loan.id, {
      onSuccess: () => toast.success('Book returned. You can leave a review now.'),
      onError: (error) =>
        toast.error(error instanceof Error ? error.message : 'Could not return book'),
    })
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Borrowed List</h1>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search book or author"
      />

      <FilterChips options={STATUS_OPTIONS} value={status} onChange={setStatus} />

      {isPending ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : loans.length === 0 ? (
        <EmptyState
          title="No borrowed books"
          description="Books you borrow will show up here."
        />
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {loans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onReview={(target) => setReviewBook(target.book)}
                onReturn={handleReturn}
                isReturning={
                  returnLoan.isPending && returnLoan.variables === loan.id
                }
              />
            ))}
          </div>
          <LoadMore
            hasMore={Boolean(hasNextPage)}
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          />
        </div>
      )}

      {reviewBook && (
        <GiveReviewDialog
          book={reviewBook}
          open={reviewBook !== null}
          onOpenChange={(open) => {
            if (!open) setReviewBook(null)
          }}
        />
      )}
    </div>
  )
}
