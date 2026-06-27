import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import type { BookDetail } from '@/types/models'
import { borrowBook } from './loans-api'

export function useBorrowBook(bookId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (days: number) => borrowBook(bookId, days),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.books.detail(bookId) })
      const previous = queryClient.getQueryData<BookDetail>(
        queryKeys.books.detail(bookId),
      )

      // Optimistically drop one available copy.
      if (previous && previous.availableCopies > 0) {
        queryClient.setQueryData<BookDetail>(queryKeys.books.detail(bookId), {
          ...previous,
          availableCopies: previous.availableCopies - 1,
        })
      }

      return { previous }
    },
    onError: (_error, _days, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.books.detail(bookId), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(bookId) })
      queryClient.invalidateQueries({ queryKey: ['loans', 'my'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.me.profile })
    },
  })
}
