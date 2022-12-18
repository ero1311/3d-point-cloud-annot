import {
    createSlice,
} from '@reduxjs/toolkit'

const initialState = {
    classSelected: null
}
const annotBarSlice = createSlice({
    name: 'annotBar',
    initialState,
    reducers: {
        setClass: (state, action) => { state.classSelected = action.payload }
    }
})
export const {
    setClass,
} = annotBarSlice.actions

export default annotBarSlice.reducer

export const classSelector = (state) => state.annotBar.classSelected;