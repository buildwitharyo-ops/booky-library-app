import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'
import type { User } from '@/types/models'
import { authStorage } from './authStorage'

type AuthState = {
  token: string | null
  user: User | null
}

const initialState: AuthState = {
  token: authStorage.getToken(),
  user: authStorage.getUser(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>,
    ) => {
      state.token = action.payload.token
      state.user = action.payload.user
      authStorage.save(action.payload.token, action.payload.user)
    },
    logout: (state) => {
      state.token = null
      state.user = null
      authStorage.clear()
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer

export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.token)
export const selectIsAdmin = (state: RootState) => state.auth.user?.role === 'ADMIN'
