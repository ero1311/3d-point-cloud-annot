import { configureStore } from '@reduxjs/toolkit'

import timerReducer from './features/timer/timerSlice'
import annotBarReducer from './features/annotBar/annotBarSlice'
import sceneSelectorReducer from './features/sceneSelector/sceneSelectorSlice'
import scannetSceneReducer from './features/scannetScene/scannetSceneSlice'

const store = configureStore({
  reducer: {
    timer: timerReducer,
    annotBar: annotBarReducer,
    sceneSelector: sceneSelectorReducer,
    scannetScene: scannetSceneReducer
  },
})

export default store