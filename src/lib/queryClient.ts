import { QueryClient } from '@tanstack/react-query'
import type { ApiError } from './api'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const status = (error as ApiError).status
        // Don't retry on client errors (auth, validation, not found).
        if (status && status >= 400 && status < 500) return false
        return failureCount < 2
      },
    },
  },
})
