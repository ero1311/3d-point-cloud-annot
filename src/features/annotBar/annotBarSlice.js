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
        currId: null,
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
        return response.data
    }
)

export const preAnnotate = createAsyncThunk(
    'annot/preAnnotate',
    async (sceneName) => {
        const response = await axios.get('http://' + config.host + ':' + config.inter_port + '/annotate/' + sceneName)
        return response.data
    }
)


const annotBarSlice = createSlice({
    name: 'annotBar',
    initialState,
    reducers: {
        setClass: (state, action) => { state.classIndexSelected = action.payload },
        setAnnotStatus: (state, action) => { state.annotations.loadStatus = action.payload },
        removeInstance: (state, action) => {
            let id = action.payload
            let idIndex = state.annotations.idx.findIndex((element) => element === id)
            state.annotations.idx.splice(idIndex, 1)
            delete state.annotations.instances[id]
        },
        resetAnnot: (state, action) => {
            state.annotations = {
                loadStatus: 'idle',
                idx: [],
                instances: {}
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveNewInstance.fulfilled, (state, action) => {
                state.annotations.loadStatus = 'loaded'
                state.annotations.currId = action.payload.data.currId
                state.annotations.instances[String(action.payload.data.currId - 1)] = action.payload.data.instance
            })
            .addCase(loadAnnotations.fulfilled, (state, action) => {
                state.annotations.loadStatus = 'loaded'
                state.annotations.currId = action.payload.data.currId
                state.annotations.instances = action.payload.data.instances
            })
            .addCase(preAnnotate.fulfilled, (state, action) => {
                state.annotations.loadStatus = 'loaded'
                state.annotations.currId = action.payload.data.currId
                state.annotations.instances = action.payload.data.instances
            })
    }
})
export const {
    setClass,
    setAnnotStatus,
    removeInstance,
    resetAnnot
} = annotBarSlice.actions

export default annotBarSlice.reducer

export const classIndexSelector = (state) => state.annotBar.classIndexSelected;
export const annotLoadSelector = (state) => state.annotBar.annotations.loadStatus;
export const annotInstanceSelector = (state) => state.annotBar.annotations.instances;
export const annotCurrIdSelector = (state) => state.annotBar.annotations.currId;