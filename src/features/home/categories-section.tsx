import { useCategories } from '@/features/categories/use-categories'
import { CategoryTile } from '@/components/book/category-tile'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/page-state'

export function CategoriesSection() {
  const { data: categories, isPending, isError, refetch } = useCategories()

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Categories</h2>

      {isPending ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !categories || categories.length === 0 ? null : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {categories.slice(0, 12).map((category) => (
            <CategoryTile key={category.id} category={category} />
          ))}
        </div>
      )}
    </section>
  )
}
