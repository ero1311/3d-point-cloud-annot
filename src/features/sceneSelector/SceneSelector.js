import { config } from '../../config';
import { TextField, MenuItem, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { sceneSelector, setScene } from './sceneSelectorSlice';
import { fetchPoints } from '../scannetScene/scannetSceneSlice';

const SceneSelector = () => {
    const selectedScene = useSelector((state) => sceneSelector(state))
    const dispatch = useDispatch()

    const handleSceneSelect = (event) => {
        dispatch(setScene(event.target.value))
        dispatch(fetchPoints(event.target.value))
    }

    return (
        <>
            <TextField select defaultValue="" label="Scene" onChange={(event) => handleSceneSelect(event)} color="primary" sx={{ marginTop: "5px" }}>
                <MenuItem value=""><em>None</em></MenuItem>
                {config.scenes.map((item, index) => (
                    <MenuItem key={index} value={item}><Typography color="text.primary">{item}</Typography></MenuItem>
                ))}
            </TextField>
        </>
    )
}

export default SceneSelector;