import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getPopularAuthors } from './authors-api'

export function usePopularAuthors(limit = 8) {
  return useQuery({
    queryKey: queryKeys.authors.popular(limit),
    queryFn: () => getPopularAuthors(limit),
    select: (data) => data.authors,
  })
}
