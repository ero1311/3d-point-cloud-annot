import { config } from '../../config';
import { List, ListItemButton, ListItemText, Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { classIndexSelector, setClass, saveNewInstance, annotCurrIdSelector } from './annotBarSlice';
import { setTimerRunning } from '../timer/timerSlice';
import { timeSelector } from '../timer/timerSlice';
import { sceneSelector } from '../sceneSelector/sceneSelectorSlice';

const AnnotBarSelector = ({ instPositiveClicks, instNegativeClicks, currAnnotInstance, currSetAnnotInstance }) => {
    const selectedClassIndex = useSelector((state) => classIndexSelector(state))
    const currId = useSelector((state) => annotCurrIdSelector(state))
    const currentTime = useSelector((state) => timeSelector(state))
    const currentScene = useSelector((state) => sceneSelector(state))
    const dispatch = useDispatch()

    const handleClassClick = (classItemIndex) => {
        if (selectedClassIndex === null) {
            dispatch(setTimerRunning(true))
        } else {
            dispatch(saveNewInstance({
                currId: currId,
                classIndex: selectedClassIndex,
                points: [...currAnnotInstance],
                posClicks: [...Object.keys(instPositiveClicks)],
                negClicks: [...Object.keys(instNegativeClicks)],
                time: currentTime,
                sceneName: currentScene
            }))
            currSetAnnotInstance(prevInst => [])
        }
        dispatch(setClass(classItemIndex));

    }

    return (
        <>
            <List>
                {config.labels.map((item, index) => (
                    <ListItemButton selected={selectedClassIndex === index} key={item.id} onClick={() => handleClassClick(index)} sx={{ marginLeft: "5px", padding: "0px", "&:hover": { backgroundColor: "rgb(" + item.color[0] + "," + item.color[1] + "," + item.color[2] + ")" }, "&&.Mui-selected": { backgroundColor: "rgb(" + item.color[0] + "," + item.color[1] + "," + item.color[2] + ")" } }}>
                        <Box sx={{ width: "15px", height: "15px", backgroundColor: "rgb(" + item.color[0] + "," + item.color[1] + "," + item.color[2] + ")" }}></Box>
                        <ListItemText disableTypography primary={<Typography color="text.primary">{item.label}</Typography>} sx={{ marginLeft: "5px" }}></ListItemText>
                    </ListItemButton>
                ))}
            </List>
        </>
    )
}

export default AnnotBarSelector;
