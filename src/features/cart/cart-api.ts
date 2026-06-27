import { http } from '@/lib/api'
import type { Cart, CartItem } from '@/types/models'

export function getCart() {
  return http.get<Cart>('/cart')
}

export function addCartItem(bookId: number) {
  return http.post<{ item: CartItem }>('/cart/items', { bookId })
}

export function removeCartItem(itemId: number) {
  return http.delete<unknown>(`/cart/items/${itemId}`)
}

export function clearCart() {
  return http.delete<unknown>('/cart')
}

export type CheckoutPayload = {
  user: { name: string; email: string; nomorHandphone: string }
  items: CartItem[]
}

export function getCheckout() {
  return http.get<CheckoutPayload>('/cart/checkout')
}

export type FromCartLoan = {
  id: number
  bookId: number
  status: string
  borrowedAt: string
  dueAt: string
  returnByMessage?: string
}

export type FromCartFailure = {
  bookId?: number
  title?: string
  reason?: string
}

export type FromCartResult = {
  loans: FromCartLoan[]
  failed: FromCartFailure[]
  removedFromCart: number
  message: string
}

export type FromCartInput = {
  itemIds: number[]
  days: number
  borrowDate?: string
}

export function borrowFromCart(input: FromCartInput) {
  return http.post<FromCartResult>('/loans/from-cart', input)
}
