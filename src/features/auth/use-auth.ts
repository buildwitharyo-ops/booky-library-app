import { useMutation } from '@tanstack/react-query'
import { useAppDispatch } from '@/app/hooks'
import { setCredentials } from './authSlice'
import { login, register } from './auth-api'

export function useLogin() {
  const dispatch = useAppDispatch()
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      dispatch(setCredentials({ token: data.token, user: data.user }))
    },
  })
}

export function useRegister() {
  return useMutation({ mutationFn: register })
}
