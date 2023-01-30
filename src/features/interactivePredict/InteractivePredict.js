import { Button, Switch, Typography, Stack } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setAnnotStatus } from '../annotBar/annotBarSlice';
import { sceneSelector } from '../sceneSelector/sceneSelectorSlice';
import { preAnnotate } from '../annotBar/annotBarSlice';
import { config } from '../../config';
import axios from 'axios';
import { useCallback } from 'react';

const InteractivePredict = ({
    instPositiveClicks,
    instNegativeClicks,
    currSetAnnotInstance,
    appIsScribble,
    appSetIsScribble
}) => {
    const currentScene = useSelector((state) => sceneSelector(state))

    const dispatch = useDispatch()

    const handlePrediction = async (e) => {
        let instance = {
            sceneName: currentScene,
            posClicks: Object.keys(instPositiveClicks),
            negClicks: Object.keys(instNegativeClicks)
        }
        axios.post('http://' + config.host + ':' + config.inter_port + '/predict-instance', {
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                instance: instance
            }
        })
            .then((response) => {
                currSetAnnotInstance(prevInst => [...prevInst, ...response.data.data.points])
                dispatch(setAnnotStatus('updated'))
            })
    }
    const handleScribbleToggle = useCallback((e) => {
        appSetIsScribble(!appIsScribble)
    }, [appIsScribble, appSetIsScribble])

    return (
        <>
            <Stack direction="row" spacing={1} alignItems="center" sx={{marginLeft: "40%"}}>
                <Button variant='contained' onClick={(e) => handlePrediction(e)}>Predict</Button>
                <Button variant='contained' onClick={(e) => dispatch(preAnnotate(currentScene))} sx={{marginLeft: "5px"}}>Pre-Annotate</Button>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography color="text.primary">Point</Typography>
                    <Switch checked={appIsScribble === true} onChange={(e) => handleScribbleToggle(e)}/>
                    <Typography color="text.primary">Scribble</Typography>
                </Stack>
            </Stack>
        </>
    )
}

export default InteractivePredict;