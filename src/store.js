import { configureStore } from '@reduxjs/toolkit'

import timerReducer from './features/timer/timerSlice'

const store = configureStore({
  reducer: {
    timer: timerReducer,
  },
})

export default store