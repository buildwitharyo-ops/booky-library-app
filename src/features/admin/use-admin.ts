import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import {
  createBook,
  deleteBook,
  getAdminBooks,
  getAdminLoans,
  getAdminUsers,
  updateBook,
  type AdminBookStatus,
  type AdminLoanStatus,
  type BookInput,
} from './admin-api'

export function useAdminBooks(params: { status: AdminBookStatus; q?: string }) {
  return useInfiniteQuery({
    queryKey: queryKeys.admin.books(params),
    queryFn: ({ pageParam }) =>
      getAdminBooks({ ...params, page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
  })
}

export function useAdminLoans(params: { status: AdminLoanStatus; q?: string }) {
  return useInfiniteQuery({
    queryKey: queryKeys.admin.loans(params),
    queryFn: ({ pageParam }) =>
      getAdminLoans({ ...params, page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination
      return page < totalPages ? page + 1 : undefined
    },
  })
}

export function useAdminUsers(params: { q?: string; page: number }) {
  return useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: () => getAdminUsers({ ...params, limit: 10 }),
    placeholderData: keepPreviousData,
  })
}

function useInvalidateBooks() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'books'] })
    queryClient.invalidateQueries({ queryKey: ['books'] })
    // Author book lists and popular-author counts live under a separate prefix.
    queryClient.invalidateQueries({ queryKey: ['authors'] })
  }
}

export function useCreateBook() {
  const invalidate = useInvalidateBooks()
  return useMutation({
    mutationFn: createBook,
    onSuccess: invalidate,
  })
}

export function useUpdateBook() {
  const queryClient = useQueryClient()
  const invalidate = useInvalidateBooks()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: BookInput }) =>
      updateBook(id, input),
    onSuccess: (_data, { id }) => {
      invalidate()
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(id) })
    },
  })
}

export function useDeleteBook() {
  const invalidate = useInvalidateBooks()
  return useMutation({
    mutationFn: (id: number) => deleteBook(id),
    onSuccess: invalidate,
  })
}
