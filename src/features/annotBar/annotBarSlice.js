import {
    createSlice,
    createAsyncThunk
} from '@reduxjs/toolkit'
import axios from 'axios'
import { config } from '../../config'

const initialState = {
    classIndexSelected: null,
    annotations: {
        loadStatus: 'idle',
        idx: [],
        instances: {}
    }
}

export const saveNewInstance = createAsyncThunk(
    'annot/saveInstance',
    async (instance) => {
        const response = await axios.post('http://' + config.host + ':' + config.inter_port + '/save', {
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                instance: instance
            }
        })
        return response.data
    }
)

export const loadAnnotations = createAsyncThunk(
    'annot/loadAnnots',
    async (sceneName) => {
        const response = await axios.get('http://' + config.host + ':' + config.inter_port + '/load/' + sceneName)
        console.log(response.data)
        return response.data
    }
)

const annotBarSlice = createSlice({
    name: 'annotBar',
    initialState,
    reducers: {
        setClass: (state, action) => { state.classIndexSelected = action.payload },
        setAnnotStatus: (state, action) => {state.annotations.loadStatus = action.payload},
        removeInstance: (state, action) => {
            let id = action.payload
            let idIndex = state.annotations.idx.findIndex((element) => element === id)
            state.annotations.idx.splice(idIndex, 1)
            delete state.annotations.instances[id]
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveNewInstance.fulfilled, (state, action) => {
                state.annotations.idx.push(action.payload.data.id)
                state.annotations.instances[action.payload.data.id] = action.payload.data.instance
            })
            .addCase(loadAnnotations.fulfilled, (state, action) => {
                state.annotations.loadStatus = 'loaded'
                state.annotations.idx = [...action.payload.data.idx]
                state.annotations.instances = action.payload.data.instances
            })
    }
})
export const {
    setClass,
    setAnnotStatus,
    removeInstance
} = annotBarSlice.actions

export default annotBarSlice.reducer

export const classIndexSelector = (state) => state.annotBar.classIndexSelected;
export const annotLoadSelector = (state) => state.annotBar.annotations.loadStatus;
export const annotInstanceSelector = (state) => state.annotBar.annotations.instances;