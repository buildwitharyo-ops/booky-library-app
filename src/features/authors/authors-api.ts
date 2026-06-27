import { http } from '@/lib/api'
import type { Author, Book } from '@/types/models'
import type { Pagination } from '@/types/api'

export type PopularAuthor = Author & {
  bookCount: number
  accumulatedScore: number
}

export function getPopularAuthors(limit = 8) {
  return http.get<{ authors: PopularAuthor[] }>('/authors/popular', {
    params: { limit },
  })
}

export type AuthorBooksResponse = {
  author: Author
  bookCount: number
  books: Book[]
  pagination: Pagination
}

export function getAuthorBooks(id: number, page = 1, limit = 12) {
  return http.get<AuthorBooksResponse>(`/authors/${id}/books`, {
    params: { page, limit },
  })
}
