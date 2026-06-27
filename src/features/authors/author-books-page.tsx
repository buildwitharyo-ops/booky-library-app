import { useParams } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { BookCard, BookCardSkeleton } from '@/components/book/book-card'
import { BookGrid } from '@/components/book/book-grid'
import { LoadMore } from '@/components/common/load-more'
import { EmptyState, ErrorState } from '@/components/common/page-state'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { getInitials } from '@/lib/utils'
import { useAuthorBooks } from './use-authors'

export function AuthorBooksPage() {
  const { id } = useParams()
  const authorId = Number(id)

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAuthorBooks(authorId)

  const author = data?.pages[0]?.author
  const bookCount = data?.pages[0]?.bookCount ?? 0
  const books = data?.pages.flatMap((page) => page.books) ?? []

  return (
    <Container className="space-y-6 py-8">
      {isPending ? (
        <div className="space-y-6">
          <Skeleton className="h-24 rounded-2xl" />
          <BookGrid>
            {Array.from({ length: 8 }).map((_, index) => (
              <BookCardSkeleton key={index} />
            ))}
          </BookGrid>
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <>
          <div className="flex items-center gap-4 rounded-2xl border p-5">
            <Avatar className="size-14">
              <AvatarFallback>{getInitials(author?.name ?? '?')}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold">{author?.name}</p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <BookOpen className="size-4" />
                {bookCount} books
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold">Book List</h2>

          {books.length === 0 ? (
            <EmptyState title="No books from this author yet" />
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
        </>
      )}
    </Container>
  )
}
