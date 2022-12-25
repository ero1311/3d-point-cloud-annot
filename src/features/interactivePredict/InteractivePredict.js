import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setAnnotStatus } from '../annotBar/annotBarSlice';
import { sceneSelector } from '../sceneSelector/sceneSelectorSlice';
import { config } from '../../config';
import axios from 'axios';

const InteractivePredict = ({
    instPositiveClicks,
    instNegativeClicks,
    currSetAnnotInstance
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

    return (
        <>
            <Button variant='contained' onClick={(e) => handlePrediction(e)}>Predict</Button>
        </>
    )
}

export default InteractivePredict;