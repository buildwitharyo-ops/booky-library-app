import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getCategories } from './categories-api'

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: getCategories,
    staleTime: 5 * 60_000,
    select: (data) => data.categories,
  })
}
