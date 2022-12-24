import { config } from '../../config';
import { TextField, MenuItem, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setScene } from './sceneSelectorSlice';
import { fetchPoints } from '../scannetScene/scannetSceneSlice';
import { resetAnnot, setClass } from '../annotBar/annotBarSlice';
import { setTime, setTimerRunning } from '../timer/timerSlice';

const SceneSelector = () => {
    const dispatch = useDispatch()

    const handleSceneSelect = (event) => {
        dispatch(resetAnnot())
        dispatch(setClass(null))
        dispatch(setTime(0))
        dispatch(setTimerRunning(false))
        dispatch(setScene(event.target.value))
        dispatch(fetchPoints(event.target.value))
    }

    return (
        <>
            <TextField select defaultValue="None" label="Scene" onChange={(event) => handleSceneSelect(event)} color="primary" sx={{ marginTop: "5px" }}>
                <MenuItem value="None"><em>None</em></MenuItem>
                {config.scenes.map((item, index) => (
                    <MenuItem key={index} value={item}><Typography color="text.primary">{item}</Typography></MenuItem>
                ))}
            </TextField>
        </>
    )
}

export default SceneSelector;