/** Centralized React Query keys so caches invalidate consistently. */
export const queryKeys = {
  books: {
    list: (params: Record<string, unknown>) => ['books', 'list', params] as const,
    detail: (id: number) => ['books', 'detail', id] as const,
    recommend: (params: Record<string, unknown>) =>
      ['books', 'recommend', params] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  authors: {
    search: (q: string) => ['authors', 'search', q] as const,
    popular: (limit: number) => ['authors', 'popular', limit] as const,
    books: (id: number, page: number) => ['authors', id, 'books', page] as const,
  },
  reviews: {
    byBook: (bookId: number, page: number) =>
      ['reviews', 'book', bookId, page] as const,
  },
  loans: {
    my: (params: Record<string, unknown>) => ['loans', 'my', params] as const,
  },
  cart: {
    current: ['cart'] as const,
    checkout: ['cart', 'checkout'] as const,
  },
  me: {
    profile: ['me'] as const,
    loans: (params: Record<string, unknown>) => ['me', 'loans', params] as const,
    reviews: (params: Record<string, unknown>) => ['me', 'reviews', params] as const,
  },
  admin: {
    overview: ['admin', 'overview'] as const,
    books: (params: Record<string, unknown>) => ['admin', 'books', params] as const,
    loans: (params: Record<string, unknown>) => ['admin', 'loans', params] as const,
    users: (params: Record<string, unknown>) => ['admin', 'users', params] as const,
  },
} as const
