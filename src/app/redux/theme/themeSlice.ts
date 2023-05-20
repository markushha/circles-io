import { createSlice } from '@reduxjs/toolkit'

export const themeToggle = createSlice({
  name: 'theme',
  initialState: {
    value: "light",
  },
  reducers: {
    toggleTheme: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { toggleTheme } = themeToggle.actions