import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { predictInstance, classIndexSelector, setAnnotStatus } from '../annotBar/annotBarSlice';
import { timeSelector } from '../timer/timerSlice';
import { sceneSelector } from '../sceneSelector/sceneSelectorSlice';


const InteractivePredict = ({
    instPositiveClicks,
    instNegativeClicks,
    instSetPositiveClicks,
    instSetNegativeClicks
}) => {
    const currentTime = useSelector((state) => timeSelector(state))
    const currentClassIndex = useSelector((state) => classIndexSelector(state))
    const currentScene = useSelector((state) => sceneSelector(state))

    const dispatch = useDispatch()

    const handlePrediction = (e) => {
        let instance = {
            classIndex: currentClassIndex,
            time: currentTime,
            sceneName: currentScene,
            posClicks: Object.keys(instPositiveClicks),
            negClicks: Object.keys(instNegativeClicks)
        }
        dispatch(predictInstance(instance))
    }

    const handleFinishInstance = (e) => {
        instSetPositiveClicks({})
        instSetNegativeClicks({})
        dispatch(setAnnotStatus('loaded'))
    }

    return (
        <>
            <Button variant='contained' onClick={(e) => handlePrediction(e)}>Predict</Button>
            <Button variant='contained' onClick={(e) => handleFinishInstance(e)} sx={{ marginLeft: "5px" }}>Finish Instance</Button>
        </>
    )
}

export default InteractivePredict;