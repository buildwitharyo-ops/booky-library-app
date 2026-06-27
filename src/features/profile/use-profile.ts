import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectIsAuthenticated, updateUser } from '@/features/auth/authSlice'
import { queryKeys } from '@/lib/queryKeys'
import { getMe, updateProfile } from './profile-api'

export function useMe() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  return useQuery({
    queryKey: queryKeys.me.profile,
    queryFn: getMe,
    enabled: isAuthenticated,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // Keep the navbar avatar/name in sync with the saved profile.
      dispatch(updateUser(data.profile))
      queryClient.invalidateQueries({ queryKey: queryKeys.me.profile })
    },
  })
}
