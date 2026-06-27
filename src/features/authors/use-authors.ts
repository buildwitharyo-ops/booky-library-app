import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getAuthorBooks, getPopularAuthors } from './authors-api'

export function usePopularAuthors(limit = 8) {
  return useQuery({
    queryKey: queryKeys.authors.popular(limit),
    queryFn: () => getPopularAuthors(limit),
    select: (data) => data.authors,
  })
}

export function useAuthorBooks(id: number) {
  return useInfiniteQuery({
    queryKey: queryKeys.authors.books(id),
    queryFn: ({ pageParam }) => getAuthorBooks(id, pageParam, 12),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
    enabled: Number.isFinite(id),
  })
}
