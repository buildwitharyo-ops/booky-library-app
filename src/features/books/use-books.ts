import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import {
  getBook,
  getBooks,
  getRecommendedBooks,
  type BookListParams,
} from './books-api'

export function useBook(id: number) {
  return useQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: () => getBook(id),
    enabled: Number.isFinite(id),
  })
}

export function useBooks(params: BookListParams) {
  return useQuery({
    queryKey: queryKeys.books.list(params),
    queryFn: () => getBooks(params),
  })
}

export function useInfiniteBooks(params: Omit<BookListParams, 'page'>) {
  const limit = params.limit ?? 12
  return useInfiniteQuery({
    queryKey: queryKeys.books.list({ ...params, limit }),
    queryFn: ({ pageParam }) => getBooks({ ...params, limit, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
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
