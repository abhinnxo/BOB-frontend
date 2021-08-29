import { configureStore } from '@reduxjs/toolkit'
import mainstore from './mainstore'
export default configureStore({
  reducer: {
    mainstore:mainstore,
  },
})