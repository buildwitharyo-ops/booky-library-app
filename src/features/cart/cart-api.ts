import { http } from '@/lib/api'
import type { Cart, CartItem } from '@/types/models'

export function getCart() {
  return http.get<Cart>('/cart')
}

export function addCartItem(bookId: number) {
  return http.post<{ item: CartItem }>('/cart/items', { bookId })
}
