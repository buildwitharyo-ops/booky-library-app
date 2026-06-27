import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppSelector } from '@/app/hooks'
import { selectIsAuthenticated } from '@/features/auth/authSlice'
import { queryKeys } from '@/lib/queryKeys'
import type { Book, Cart } from '@/types/models'
import {
  addCartItem,
  borrowFromCart,
  clearCart,
  getCart,
  getCheckout,
  removeCartItem,
} from './cart-api'

export function useCart() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  return useQuery({
    queryKey: queryKeys.cart.current,
    queryFn: getCart,
    enabled: isAuthenticated,
  })
}

export function useCartCount() {
  const { data } = useCart()
  return data?.items.length ?? 0
}

export function useCheckout() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  return useQuery({
    queryKey: queryKeys.cart.checkout,
    queryFn: getCheckout,
    enabled: isAuthenticated,
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (book: Book) => addCartItem(book.id),
    onMutate: async (book) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.current })
      const previous = queryClient.getQueryData<Cart>(queryKeys.cart.current)

      // Optimistically bump the navbar badge unless it's already there.
      if (previous && !previous.items.some((item) => item.bookId === book.id)) {
        queryClient.setQueryData<Cart>(queryKeys.cart.current, {
          ...previous,
          items: [{ id: -book.id, bookId: book.id, book }, ...previous.items],
        })
      }

      return { previous }
    },
    onError: (_error, _book, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.cart.current, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current })
    },
  })
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: number) => removeCartItem(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.current })
      const previous = queryClient.getQueryData<Cart>(queryKeys.cart.current)
      if (previous) {
        queryClient.setQueryData<Cart>(queryKeys.cart.current, {
          ...previous,
          items: previous.items.filter((item) => item.id !== itemId),
        })
      }
      return { previous }
    },
    onError: (_error, _itemId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.cart.current, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current })
    },
  })
}

export function useClearCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current })
    },
  })
}

export function useBorrowFromCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: borrowFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current })
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.checkout })
      queryClient.invalidateQueries({ queryKey: ['loans', 'my'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.me.profile })
    },
  })
}
