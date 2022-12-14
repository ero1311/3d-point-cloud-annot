import {
    createSlice,
    createEntityAdapter,
} from '@reduxjs/toolkit'

const timerAdapter = createEntityAdapter()

const initialState = timerAdapter.getInitialState()

const timerSlice = createSlice({
    name: 'timer',
    initialState,
    reducers: {
        timerToggle(state, action) {
            const timer = state.entities[0]
            timer.running = !timer.running
        },
        timerInit(state, action) {
            timerAdapter.addOne({
                running: true,
                time: 0
            })
        },
        timerSaveTime(state, action) {
            const time = action.payload
            const timer = state.entities[0]
            timer.time = time
        }
    }
})
export const {
    timerToggle,
    timerInit,
    timerSaveTime
} = timerSlice.actions

export default timerSlice.reducer

export const {
    selectAll: selectTimers,
    selectById: selectTimerById
} = timerAdapter.getSelectors((state) => state.timer)
