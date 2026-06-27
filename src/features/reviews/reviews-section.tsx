import { Star } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { LoadMore } from '@/components/common/load-more'
import { EmptyState, ErrorState } from '@/components/common/page-state'
import { useBookReviews } from './use-reviews'
import { BookReviewCard } from './book-review-card'

export function ReviewsSection({
  bookId,
  rating,
  reviewCount,
}: {
  bookId: number
  rating: number
  reviewCount: number
}) {
  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBookReviews(bookId)

  const reviews = data?.pages.flatMap((page) => page.reviews) ?? []

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold">Review</h2>
        {reviewCount > 0 && (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="size-4 fill-star text-star" />
            {rating.toFixed(1)} ({reviewCount} reviews)
          </span>
        )}
      </div>

      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Reviews appear here once readers return the book."
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {reviews.map((review) => (
              <BookReviewCard key={review.id} review={review} />
            ))}
          </div>
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
