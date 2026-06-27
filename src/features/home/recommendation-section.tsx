import { useRecommendedBooks } from '@/features/books/use-books'
import { BookCard, BookCardSkeleton } from '@/components/book/book-card'
import { BookGrid } from '@/components/book/book-grid'
import { LoadMore } from '@/components/common/load-more'
import { EmptyState, ErrorState } from '@/components/common/page-state'

export function RecommendationSection() {
  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRecommendedBooks({ limit: 10 })

  const books = data?.pages.flatMap((page) => page.books) ?? []

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Recommendation</h2>

      {isPending ? (
        <BookGrid className="xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </BookGrid>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : books.length === 0 ? (
        <EmptyState title="No recommendations yet" />
      ) : (
        <div className="space-y-6">
          <BookGrid className="xl:grid-cols-5">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </BookGrid>
          <LoadMore
            hasMore={Boolean(hasNextPage)}
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          />
        </div>
      )}
    </section>
  )
}
