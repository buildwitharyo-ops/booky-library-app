import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

type CartState = {
  /** Cart item ids the user picked to take to checkout. */
  selectedItemIds: number[]
}

const initialState: CartState = {
  selectedItemIds: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setSelectedItems: (state, action: PayloadAction<number[]>) => {
      state.selectedItemIds = action.payload
    },
    clearSelectedItems: (state) => {
      state.selectedItemIds = []
    },
  },
})

export const { setSelectedItems, clearSelectedItems } = cartSlice.actions
export default cartSlice.reducer

export const selectSelectedItemIds = (state: RootState) =>
  state.cart.selectedItemIds
