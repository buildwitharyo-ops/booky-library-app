import { Link } from 'react-router-dom'
import type { Book } from '@/types/models'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { BookCover } from './book-cover'
import { RatingBadge } from './star-rating'

export function BookCard({
  book,
  className,
}: {
  book: Book
  className?: string
}) {
  return (
    <Link
      to={`/books/${book.id}`}
      className={cn('group flex flex-col gap-3', className)}
    >
      <BookCover
        src={book.coverImage}
        alt={book.title}
        className="aspect-[3/4] w-full transition group-hover:opacity-90"
      />
      <div className="space-y-1">
        <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-foreground">
          {book.title}
        </h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {book.author?.name ?? 'Unknown author'}
        </p>
        <RatingBadge value={book.rating} />
      </div>
    </Link>
  )
}

export function BookCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[3/4] w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}
