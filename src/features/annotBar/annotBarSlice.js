import {
    createSlice,
} from '@reduxjs/toolkit'

const initialState = {
    classIndexSelected: null,
    annotations: {
        idx: [],
        instances: {}
    }
}
const annotBarSlice = createSlice({
    name: 'annotBar',
    initialState,
    reducers: {
        setClass: (state, action) => { state.classIndexSelected = action.payload },
        addInstance: (state, action) => {
            let idArr = state.annotations.idx
            let id = "0";
            if (idArr.length !== 0) {
                id = String(parseInt(idArr[idArr.length - 1]) + 1)
            }
            state.annotations.idx.push(String(id))
            state.annotations.instances[String(id)] = action.payload
        },
        removeInstance: (state, action) => {
            let id = action.payload
            let idIndex = state.annotations.idx.findIndex((element) => element === id)
            state.annotations.idx.splice(idIndex, 1)
            delete state.annotations.instances[id]
        }
    }
})
export const {
    setClass,
    addInstance,
    removeInstance
} = annotBarSlice.actions

export default annotBarSlice.reducer

export const classIndexSelector = (state) => state.annotBar.classIndexSelected;
export const annotationsSelector = (state) => state.annotBar.annotations;