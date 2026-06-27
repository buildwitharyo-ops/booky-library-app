import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import type { BookDetail } from '@/types/models'
import {
  borrowBook,
  getMyLoans,
  returnLoan,
  type MyLoansParams,
  type MyLoansResponse,
} from './loans-api'

export function useMyLoans(params: { status: MyLoansParams['status']; q?: string }) {
  return useInfiniteQuery({
    queryKey: queryKeys.loans.my(params),
    queryFn: ({ pageParam }) =>
      getMyLoans({ ...params, page: pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
  })
}

export function useBorrowBook(bookId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (days: number) => borrowBook(bookId, days),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.books.detail(bookId) })
      const previous = queryClient.getQueryData<BookDetail>(
        queryKeys.books.detail(bookId),
      )
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

export function useReturnLoan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (loanId: number) => returnLoan(loanId),
    onMutate: async (loanId) => {
      await queryClient.cancelQueries({ queryKey: ['loans', 'my'] })
      const snapshots = queryClient.getQueriesData<InfiniteData<MyLoansResponse>>({
        queryKey: ['loans', 'my'],
      })

      queryClient.setQueriesData<InfiniteData<MyLoansResponse>>(
        { queryKey: ['loans', 'my'] },
        (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              loans: page.loans.map((loan) =>
                loan.id === loanId
                  ? {
                      ...loan,
                      status: 'RETURNED' as const,
                      displayStatus: 'Returned' as const,
                      returnedAt: new Date().toISOString(),
                    }
                  : loan,
              ),
            })),
          }
        },
      )

      return { snapshots }
    },
    onError: (_error, _loanId, context) => {
      context?.snapshots.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['loans', 'my'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.me.profile })
      queryClient.invalidateQueries({ queryKey: ['books', 'detail'] })
    },
  })
}
