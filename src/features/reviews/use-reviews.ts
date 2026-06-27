import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import type { BookDetail } from '@/types/models'
import {
  createReview,
  deleteReview,
  getBookReviews,
  getMyReviews,
  type MyReviewsResponse,
} from './reviews-api'

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

export function useMyReviews(params: { q?: string }) {
  return useInfiniteQuery({
    queryKey: queryKeys.me.reviews(params),
    queryFn: ({ pageParam }) =>
      getMyReviews({ ...params, page: pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
  })
}

export function useDeleteReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onMutate: async (reviewId) => {
      await queryClient.cancelQueries({ queryKey: ['me', 'reviews'] })
      const snapshots = queryClient.getQueriesData<
        InfiniteData<MyReviewsResponse>
      >({ queryKey: ['me', 'reviews'] })

      // Remember which book this review belonged to so we can refresh its
      // aggregate rating once the server confirms the delete.
      let bookId: number | undefined
      for (const [, data] of snapshots) {
        const match = data?.pages
          .flatMap((page) => page.reviews)
          .find((review) => review.id === reviewId)
        if (match) {
          bookId = match.book?.id ?? match.bookId
          break
        }
      }

      queryClient.setQueriesData<InfiniteData<MyReviewsResponse>>(
        { queryKey: ['me', 'reviews'] },
        (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              reviews: page.reviews.filter((review) => review.id !== reviewId),
            })),
          }
        },
      )

      return { snapshots, bookId }
    },
    onSuccess: (data, _reviewId, context) => {
      const bookId = context?.bookId
      if (bookId == null) return
      queryClient.setQueryData<BookDetail>(
        queryKeys.books.detail(bookId),
        (old) =>
          old
            ? {
                ...old,
                rating: data.bookStats.rating,
                reviewCount: data.bookStats.reviewCount,
              }
            : old,
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byBook(bookId) })
    },
    onError: (_error, _reviewId, context) => {
      context?.snapshots.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['me', 'reviews'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.me.profile })
    },
  })
}
