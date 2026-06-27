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

export type ReviewStats = { rating: number; reviewCount: number }

export type CreateReviewInput = {
  bookId: number
  star: number
  comment?: string
}

export function createReview(input: CreateReviewInput) {
  return http.post<{ review: Review; bookStats: ReviewStats }>('/reviews', input)
}

export function deleteReview(reviewId: number) {
  return http.delete<{ bookStats: ReviewStats }>(`/reviews/${reviewId}`)
}

export type MyReviewsResponse = {
  reviews: Review[]
  pagination: Pagination
}

export function getMyReviews(params: { q?: string; page?: number; limit?: number }) {
  return http.get<MyReviewsResponse>('/me/reviews', { params })
}
