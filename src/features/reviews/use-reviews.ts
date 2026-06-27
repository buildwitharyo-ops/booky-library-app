import { useInfiniteQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getBookReviews } from './reviews-api'

export function useBookReviews(bookId: number) {
  return useInfiniteQuery({
    queryKey: queryKeys.reviews.byBook(bookId),
    queryFn: ({ pageParam }) => getBookReviews(bookId, pageParam, 6),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
    enabled: Number.isFinite(bookId),
  })
}
