import {
    createSlice,
} from '@reduxjs/toolkit'

// const timerAdapter = createEntityAdapter()

// const initialState = timerAdapter.getInitialState()

const initialState = {
    time: 0,
    running: false
}
const timerSlice = createSlice({
    name: 'timer',
    initialState,
    reducers: {
        setTimerRunning: (state, action) => { state.running = action.payload },
        setTime: (state, action) => { state.time = action.payload }
    }
})
export const {
    setTimerRunning,
    setTime,
} = timerSlice.actions

export default timerSlice.reducer

export const timeSelector = (state) => state.timer.time;
export const timerRunningSelector = (state) => state.timer.running;

// export const {
//     selectAll: selectTimers,
//     selectById: selectTimerById
// } = timerAdapter.getSelectors((state) => state.timer)