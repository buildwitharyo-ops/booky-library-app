import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import type { BookDetail } from '@/types/models'
import { createReview, getBookReviews } from './reviews-api'

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

export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createReview,
    onSuccess: (data, variables) => {
      // Reflect the new aggregate rating on the book detail right away.
      queryClient.setQueryData<BookDetail>(
        queryKeys.books.detail(variables.bookId),
        (old) =>
          old
            ? {
                ...old,
                rating: data.bookStats.rating,
                reviewCount: data.bookStats.reviewCount,
              }
            : old,
      )
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byBook(variables.bookId),
      })
      queryClient.invalidateQueries({ queryKey: ['me', 'reviews'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.me.profile })
    },
  })
}
