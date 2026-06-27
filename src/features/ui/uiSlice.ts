import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

export type BookFilters = {
  q: string
  categoryId: number | null
  minRating: number | null
}

type UiState = {
  /** Global navbar search box value. */
  search: string
  /** Catalog filters, mirrored from the URL for the navbar search. */
  bookFilters: BookFilters
}

const initialState: UiState = {
  search: '',
  bookFilters: { q: '', categoryId: null, minRating: null },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setBookFilters: (state, action: PayloadAction<Partial<BookFilters>>) => {
      state.bookFilters = { ...state.bookFilters, ...action.payload }
    },
    resetBookFilters: (state) => {
      state.bookFilters = initialState.bookFilters
    },
  },
})

export const { setSearch, setBookFilters, resetBookFilters } = uiSlice.actions
export default uiSlice.reducer

export const selectSearch = (state: RootState) => state.ui.search
export const selectBookFilters = (state: RootState) => state.ui.bookFilters
