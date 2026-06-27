import { BookCard, BookCardSkeleton } from '@/components/book/book-card'
import { BookGrid } from '@/components/book/book-grid'
import { useBooks } from './use-books'

export function RelatedBooks({
  categoryId,
  excludeId,
}: {
  categoryId: number
  excludeId: number
}) {
  const { data, isPending } = useBooks({ categoryId, limit: 12 })
  const books = (data?.books ?? [])
    .filter((book) => book.id !== excludeId)
    .slice(0, 5)

  if (!isPending && books.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Related Books</h2>
      <BookGrid className="xl:grid-cols-5">
        {isPending
          ? Array.from({ length: 5 }).map((_, index) => (
              <BookCardSkeleton key={index} />
            ))
          : books.map((book) => <BookCard key={book.id} book={book} />)}
      </BookGrid>
    </section>
  )
}
