import { Trash2 } from 'lucide-react'
import type { Review } from '@/types/models'
import { formatDateTime } from '@/lib/format'
import { BookCover } from '@/components/book/book-cover'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/book/star-rating'

export function MyReviewCard({
  review,
  onDelete,
  isDeleting,
}: {
  review: Review
  onDelete: (reviewId: number) => void
  isDeleting?: boolean
}) {
  return (
    <div className="space-y-3 rounded-2xl border p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {formatDateTime(review.createdAt)}
        </p>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Delete review"
          onClick={() => onDelete(review.id)}
          disabled={isDeleting}
        >
          <Trash2 className="text-danger" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <BookCover
          src={review.book?.coverImage}
          alt={review.book?.title ?? 'Book cover'}
          className="h-16 w-12 shrink-0"
        />
        <div className="min-w-0">
          {review.book?.category && (
            <Badge variant="secondary" className="mb-1">
              {review.book.category.name}
            </Badge>
          )}
          <p className="truncate font-semibold">{review.book?.title}</p>
          <p className="truncate text-sm text-muted-foreground">
            {review.book?.author?.name}
          </p>
        </div>
      </div>

      <StarRating value={review.star} size={16} />
      {review.comment && (
        <p className="text-sm text-muted-foreground">{review.comment}</p>
      )}
    </div>
  )
}
