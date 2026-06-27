import type { Review } from '@/types/models'
import { getInitials } from '@/lib/utils'
import { formatDateTime } from '@/lib/format'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StarRating } from '@/components/book/star-rating'

export function BookReviewCard({ review }: { review: Review }) {
  return (
    <div className="space-y-3 rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarFallback>{getInitials(review.user?.name ?? '?')}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {review.user?.name ?? 'Anonymous'}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(review.createdAt)}
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
