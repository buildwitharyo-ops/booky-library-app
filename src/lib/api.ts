import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import type { ApiEnvelope } from '@/types/api'
import { authStorage } from '@/features/auth/authStorage'

/** Error carrying the backend's human-readable `message` and HTTP status. */
export class ApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
})

api.interceptors.request.use((config) => {
  const token = authStorage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiEnvelope<unknown>>) => {
    // A token that's missing or expired: drop the session and bounce to login.
    if (error.response?.status === 401) {
      authStorage.clear()
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
    }

    const message =
      error.response?.data?.message ?? error.message ?? 'Something went wrong'
    return Promise.reject(new ApiError(message, error.response?.status))
  },
)

/** Thin wrapper that unwraps the `{ success, message, data }` envelope. */
export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    api.get<ApiEnvelope<T>>(url, config).then((r) => r.data.data),
  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    api.post<ApiEnvelope<T>>(url, body, config).then((r) => r.data.data),
  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    api.put<ApiEnvelope<T>>(url, body, config).then((r) => r.data.data),
  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    api.patch<ApiEnvelope<T>>(url, body, config).then((r) => r.data.data),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    api.delete<ApiEnvelope<T>>(url, config).then((r) => r.data.data),
}

export { api }
