import { useState } from 'react'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { FilterChips, type ChipOption } from '@/components/common/filter-chips'
import { SearchInput } from '@/components/common/search-input'
import { LoadMore } from '@/components/common/load-more'
import { EmptyState, ErrorState } from '@/components/common/page-state'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminLoanCard } from './admin-loan-card'
import { useAdminLoans } from './use-admin'
import type { AdminLoanStatus } from './admin-api'

const STATUS_OPTIONS: ChipOption<AdminLoanStatus>[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Returned', value: 'returned' },
  { label: 'Overdue', value: 'overdue' },
]

export function AdminLoansPage() {
  const [status, setStatus] = useState<AdminLoanStatus>('all')
  const [search, setSearch] = useState('')
  const q = useDebouncedValue(search.trim(), 400)

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAdminLoans({ status, q: q || undefined })

  const loans = data?.pages.flatMap((page) => page.loans) ?? []

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Borrowed List</h1>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search book, author, or borrower"
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
        <EmptyState title="No loans found" />
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {loans.map((loan) => (
              <AdminLoanCard key={loan.id} loan={loan} />
            ))}
          </div>
          <LoadMore
            hasMore={Boolean(hasNextPage)}
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          />
        </div>
      )}
    </div>
  )
}
