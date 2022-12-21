import {
    createSlice,
    createAsyncThunk
} from '@reduxjs/toolkit'
import axios from 'axios'
import { config } from '../../config'

const initialState = {
    status: "idle",
    coords: null,
    colors: null,
    count: null,
}

export const fetchPoints = createAsyncThunk('scannetScene/fetchPoints', async (filename) => {
    const response = await axios.get('http://' + config.host + ':' + config.inter_port + '/loadscene/' + filename)
    return response.data
})

const scannetSceneSlice = createSlice({
    name: 'scannetScene',
    initialState,
    reducers: {
        setCoords: (state, action) => { state.coords = action.payload },
        setColors: (state, action) => { state.colors = action.payload },
        setCount: (state, action) => { state.count = action.payload }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPoints.pending, (state, action) => {
                state.status = "loading"
            })
            .addCase(fetchPoints.fulfilled, (state, action) => {
                state.coords = action.payload.data.coords
                state.colors = action.payload.data.colors
                state.count = action.payload.data.count
                state.status = "loaded"
            })
    }
})
export const {
    setColors,
    setCoords,
    setCount
} = scannetSceneSlice.actions

export default scannetSceneSlice.reducer

export const coordsSelector = (state) => state.scannetScene.coords;
export const colorsSelector = (state) => state.scannetScene.colors;
export const statusSelector = (state) => state.scannetScene.status;
export const countSelector = (state) => state.scannetScene.count;