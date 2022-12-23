import { config } from '../../config';
import { List, ListItemButton, ListItemText, Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { classIndexSelector, setClass } from './annotBarSlice';
import { setTimerRunning } from '../timer/timerSlice';


const AnnotBarSelector = () => {
    const selectedClassIndex = useSelector((state) => classIndexSelector(state))
    const dispatch = useDispatch()

    const handleClassClick = (classItemIndex) => {
        if (selectedClassIndex === null){
            dispatch(setTimerRunning(true))
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
