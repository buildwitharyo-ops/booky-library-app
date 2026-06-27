import { http } from '@/lib/api'
import type { Review } from '@/types/models'
import type { Pagination } from '@/types/api'

export type BookReviewsResponse = {
  bookId: number
  reviews: Review[]
  pagination: Pagination
}

export function getBookReviews(bookId: number, page = 1, limit = 6) {
  return http.get<BookReviewsResponse>(`/reviews/book/${bookId}`, {
    params: { page, limit },
  })
}
