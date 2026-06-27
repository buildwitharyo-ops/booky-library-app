import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { Book } from '@/types/models'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { FilterChips, type ChipOption } from '@/components/common/filter-chips'
import { SearchInput } from '@/components/common/search-input'
import { LoadMore } from '@/components/common/load-more'
import { EmptyState, ErrorState } from '@/components/common/page-state'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminBookCard } from './admin-book-card'
import { useAdminBooks, useDeleteBook } from './use-admin'
import type { AdminBookStatus } from './admin-api'

const STATUS_OPTIONS: ChipOption<AdminBookStatus>[] = [
  { label: 'All', value: 'all' },
  { label: 'Available', value: 'available' },
  { label: 'Borrowed', value: 'borrowed' },
  { label: 'Returned', value: 'returned' },
]

export function AdminBooksPage() {
  const [status, setStatus] = useState<AdminBookStatus>('all')
  const [search, setSearch] = useState('')
  const q = useDebouncedValue(search.trim(), 400)
  const [toDelete, setToDelete] = useState<Book | null>(null)

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAdminBooks({ status, q: q || undefined })

  const deleteBook = useDeleteBook()
  const books = data?.pages.flatMap((page) => page.books) ?? []

  function confirmDelete() {
    if (!toDelete) return
    deleteBook.mutate(toDelete.id, {
      onSuccess: () => {
        toast.success('Book deleted')
        setToDelete(null)
      },
      onError: (error) =>
        toast.error(error instanceof Error ? error.message : 'Could not delete book'),
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Book List</h1>
        <Button asChild>
          <Link to="/admin/books/new">
            <Plus />
            Add Book
          </Link>
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search book"
      />
      <FilterChips options={STATUS_OPTIONS} value={status} onChange={setStatus} />

      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : books.length === 0 ? (
        <EmptyState title="No books found" />
      ) : (
        <div className="space-y-6">
          <div className="space-y-3">
            {books.map((book) => (
              <AdminBookCard key={book.id} book={book} onDelete={setToDelete} />
            ))}
          </div>
          <LoadMore
            hasMore={Boolean(hasNextPage)}
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          />
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null)
        }}
        title="Delete Data"
        description="Once deleted, you won't be able to recover this data."
        confirmLabel="Confirm"
        destructive
        isLoading={deleteBook.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
