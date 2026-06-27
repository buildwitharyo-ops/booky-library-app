import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LoadMore({
  hasMore,
  isLoading,
  onClick,
}: {
  hasMore: boolean
  isLoading?: boolean
  onClick: () => void
}) {
  if (!hasMore) return null

  return (
    <div className="flex justify-center">
      <Button
        variant="outline"
        onClick={onClick}
        disabled={isLoading}
        className="min-w-40"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            Loading
          </>
        ) : (
          'Load More'
        )}
      </Button>
    </div>
  )
}
