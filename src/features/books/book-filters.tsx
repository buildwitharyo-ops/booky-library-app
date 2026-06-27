import { SlidersHorizontal } from 'lucide-react'
import { useCategories } from '@/features/categories/use-categories'
import { StarRating } from '@/components/book/star-rating'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type Props = {
  categoryId?: number
  minRating?: number
  onCategoryChange: (id?: number) => void
  onRatingChange: (rating?: number) => void
}

export function BookFilters({
  categoryId,
  minRating,
  onCategoryChange,
  onRatingChange,
}: Props) {
  const { data: categories, isPending } = useCategories()
  const hasFilters = categoryId !== undefined || minRating !== undefined

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4" />
          <h3 className="font-bold">FILTER</h3>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              onCategoryChange(undefined)
              onRatingChange(undefined)
            }}
            className="text-xs font-medium text-primary hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold">Category</p>
        {isPending ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-5 w-full" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2.5">
            {(categories ?? []).slice(0, 12).map((category) => {
              const checked = categoryId === category.id
              return (
                <li key={category.id}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) =>
                        onCategoryChange(value === true ? category.id : undefined)
                      }
                    />
                    <span
                      className={cn(
                        checked
                          ? 'font-medium text-foreground'
                          : 'text-muted-foreground',
                      )}
                    >
                      {category.name}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold">Rating</p>
        <ul className="space-y-1">
          {[5, 4, 3, 2, 1].map((rating) => {
            const active = minRating === rating
            return (
              <li key={rating}>
                <button
                  type="button"
                  onClick={() => onRatingChange(active ? undefined : rating)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition',
                    active ? 'bg-accent' : 'hover:bg-muted',
                  )}
                >
                  <StarRating value={rating} size={16} />
                  {rating < 5 && (
                    <span className="text-xs text-muted-foreground">&amp; up</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
