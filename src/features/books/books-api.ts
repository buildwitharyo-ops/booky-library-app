import { http } from '@/lib/api'
import type { Book } from '@/types/models'
import type { Pagination } from '@/types/api'

export type BooksResponse = {
  books: Book[]
  pagination: Pagination
}

export type BookListParams = {
  q?: string
  categoryId?: number
  authorId?: number
  minRating?: number
  page?: number
  limit?: number
}

export function getBooks(params: BookListParams) {
  return http.get<BooksResponse>('/books', { params })
}

export type RecommendParams = {
  by?: 'rating' | 'popular'
  categoryId?: number
  page?: number
  limit?: number
}

export function getRecommendedBooks(params: RecommendParams) {
  return http.get<BooksResponse & { mode: string }>('/books/recommend', {
    params,
  })
}
