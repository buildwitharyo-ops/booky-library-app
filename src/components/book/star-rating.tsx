import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Five-star rating. Pass `onChange` to make it interactive (e.g. review form). */
export function StarRating({
  value,
  onChange,
  size = 18,
  className,
}: {
  value: number
  onChange?: (value: number) => void
  size?: number
  className?: string
}) {
  const interactive = Boolean(onChange)

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role={interactive ? 'radiogroup' : undefined}
    >
      {[1, 2, 3, 4, 5].map((index) => {
        const filled = index <= Math.round(value)
        const star = (
          <Star
            style={{ width: size, height: size }}
            className={cn(
              filled ? 'fill-star text-star' : 'fill-transparent text-border',
            )}
          />
        )

        if (!interactive) return <span key={index}>{star}</span>

        return (
          <button
            key={index}
            type="button"
            aria-label={`${index} star${index > 1 ? 's' : ''}`}
            onClick={() => onChange?.(index)}
            className="transition hover:scale-110"
          >
            {star}
          </button>
        )
      })}
    </div>
  )
}

/** Compact "★ 4.5" badge used on book cards. */
export function RatingBadge({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm', className)}>
      <Star className="size-4 fill-star text-star" />
      <span className="font-medium text-foreground">{value.toFixed(1)}</span>
    </span>
  )
}
