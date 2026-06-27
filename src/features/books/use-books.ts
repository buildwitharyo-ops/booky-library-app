import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import {
  getBooks,
  getRecommendedBooks,
  type BookListParams,
} from './books-api'

export function useBooks(params: BookListParams) {
  return useQuery({
    queryKey: queryKeys.books.list(params),
    queryFn: () => getBooks(params),
  })
}

export function useRecommendedBooks({
  by = 'rating',
  limit = 10,
}: {
  by?: 'rating' | 'popular'
  limit?: number
} = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.books.recommend({ by, limit }),
    queryFn: ({ pageParam }) => getRecommendedBooks({ by, limit, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
  })
}
