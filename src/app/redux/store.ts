import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'
import { themeToggle } from './theme/themeSlice'

const rootReducer = combineReducers({
  theme: themeToggle.reducer,
})

export default configureStore({
  reducer: rootReducer,
})