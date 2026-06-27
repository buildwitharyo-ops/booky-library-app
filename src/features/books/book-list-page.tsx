import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { BookCard, BookCardSkeleton } from '@/components/book/book-card'
import { BookGrid } from '@/components/book/book-grid'
import { LoadMore } from '@/components/common/load-more'
import { EmptyState, ErrorState } from '@/components/common/page-state'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { BookFilters } from './book-filters'
import { useInfiniteBooks } from './use-books'

function numberParam(value: string | null) {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function BookListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const categoryId = numberParam(searchParams.get('categoryId'))
  const minRating = numberParam(searchParams.get('minRating'))

  function setParam(key: string, value?: number) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === undefined) next.delete(key)
        else next.set(key, String(value))
        return next
      },
      { replace: true },
    )
  }

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteBooks({
    q: q || undefined,
    categoryId,
    minRating,
  })

  const books = data?.pages.flatMap((page) => page.books) ?? []
  const total = data?.pages[0]?.pagination.total ?? 0

  const filters = (
    <BookFilters
      categoryId={categoryId}
      minRating={minRating}
      onCategoryChange={(id) => setParam('categoryId', id)}
      onRatingChange={(rating) => setParam('minRating', rating)}
    />
  )

  return (
    <Container className="py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Book List</h1>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <SlidersHorizontal />
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">{filters}</div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border p-5">{filters}</div>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          {q && (
            <p className="text-sm text-muted-foreground">
              Results for{' '}
              <span className="font-medium text-foreground">“{q}”</span>
              {!isPending && !isError && ` — ${total} found`}
            </p>
          )}

          {isPending ? (
            <BookGrid>
              {Array.from({ length: 8 }).map((_, index) => (
                <BookCardSkeleton key={index} />
              ))}
            </BookGrid>
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : books.length === 0 ? (
            <EmptyState
              title="No books found"
              description="Try adjusting your filters or search."
            />
          ) : (
            <>
              <BookGrid>
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </BookGrid>
              <LoadMore
                hasMore={Boolean(hasNextPage)}
                isLoading={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              />
            </>
          )}
        </div>
      </div>
    </Container>
  )
}
