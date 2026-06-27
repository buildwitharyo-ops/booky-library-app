import { http } from '@/lib/api'
import type { Book, Loan, User } from '@/types/models'
import type { Pagination } from '@/types/api'

/* ---------- Queries ---------- */

export type AdminBookStatus = 'all' | 'available' | 'borrowed' | 'returned'

export type AdminBooksParams = {
  status?: AdminBookStatus
  q?: string
  categoryId?: number
  authorId?: number
  page?: number
  limit?: number
}

export function getAdminBooks(params: AdminBooksParams) {
  return http.get<{ books: Book[]; pagination: Pagination }>('/admin/books', {
    params,
  })
}

export type AdminLoanStatus = 'all' | 'active' | 'returned' | 'overdue'

export type AdminLoansParams = {
  status?: AdminLoanStatus
  q?: string
  page?: number
  limit?: number
}

export function getAdminLoans(params: AdminLoansParams) {
  return http.get<{ loans: Loan[]; pagination: Pagination }>('/admin/loans', {
    params,
  })
}

export type AdminUsersParams = {
  q?: string
  page?: number
  limit?: number
}

export function getAdminUsers(params: AdminUsersParams) {
  return http.get<{ users: User[]; pagination: Pagination }>('/admin/users', {
    params,
  })
}

/* ---------- Book mutations ---------- */

export type BookInput = {
  title: string
  isbn: string
  categoryId: number
  authorId?: number
  authorName?: string
  description?: string
  publishedYear?: number
  totalCopies?: number
  availableCopies?: number
  cover?: File | null
  coverImage?: string
}

function buildBody(input: BookInput): FormData | Record<string, unknown> {
  const append = (
    target: FormData | Record<string, unknown>,
    key: string,
    value: string | number,
  ) => {
    if (target instanceof FormData) target.append(key, String(value))
    else target[key] = value
  }

  const target: FormData | Record<string, unknown> = input.cover
    ? new FormData()
    : {}

  append(target, 'title', input.title)
  append(target, 'isbn', input.isbn)
  append(target, 'categoryId', input.categoryId)
  if (input.authorId != null) append(target, 'authorId', input.authorId)
  else if (input.authorName) append(target, 'authorName', input.authorName)
  if (input.description != null) append(target, 'description', input.description)
  if (input.publishedYear != null) append(target, 'publishedYear', input.publishedYear)
  if (input.totalCopies != null) append(target, 'totalCopies', input.totalCopies)
  if (input.availableCopies != null) append(target, 'availableCopies', input.availableCopies)

  if (input.cover && target instanceof FormData) {
    target.append('coverImage', input.cover)
  } else if (!input.cover && input.coverImage) {
    append(target, 'coverImage', input.coverImage)
  }

  return target
}

export function createBook(input: BookInput) {
  return http.post<{ book: Book }>('/books', buildBody(input))
}

export function updateBook(id: number, input: BookInput) {
  return http.put<{ book: Book }>(`/books/${id}`, buildBody(input))
}

export function deleteBook(id: number) {
  return http.delete<unknown>(`/books/${id}`)
}
