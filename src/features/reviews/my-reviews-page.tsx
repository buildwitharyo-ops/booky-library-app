import { useState } from 'react'
import { toast } from 'sonner'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchInput } from '@/components/common/search-input'
import { LoadMore } from '@/components/common/load-more'
import { EmptyState, ErrorState } from '@/components/common/page-state'
import { MyReviewCard } from './my-review-card'
import { useDeleteReview, useMyReviews } from './use-reviews'

export function MyReviewsPage() {
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
  } = useMyReviews({ q: q || undefined })

  const deleteReview = useDeleteReview()
  const reviews = data?.pages.flatMap((page) => page.reviews) ?? []

  function handleDelete(reviewId: number) {
    deleteReview.mutate(reviewId, {
      onSuccess: () => toast.success('Review deleted'),
      onError: (error) =>
        toast.error(error instanceof Error ? error.message : 'Could not delete review'),
    })
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Reviews</h1>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search reviews"
      />

      {isPending ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Reviews you write will show up here."
        />
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {reviews.map((review) => (
              <MyReviewCard
                key={review.id}
                review={review}
                onDelete={handleDelete}
                isDeleting={
                  deleteReview.isPending && deleteReview.variables === review.id
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
    </div>
  )
}
