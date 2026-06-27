import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getAuthorBooks, getPopularAuthors, searchAuthors } from './authors-api'

export function useAuthorSearch(q: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.authors.search(q),
    queryFn: () => searchAuthors(q),
    enabled,
    select: (data) => data.authors,
  })
}

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
