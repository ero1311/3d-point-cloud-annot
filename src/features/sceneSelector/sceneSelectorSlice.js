import {
    createSlice,
} from '@reduxjs/toolkit'

const initialState = {
    sceneSelected: ""
}
const sceneSelectorSlice = createSlice({
    name: 'sceneSelector',
    initialState,
    reducers: {
        setScene: (state, action) => { state.sceneSelected = action.payload }
    }
})
export const {
    setScene,
} = sceneSelectorSlice.actions

export default sceneSelectorSlice.reducer

export const sceneSelector = (state) => state.sceneSelector.sceneSelected;