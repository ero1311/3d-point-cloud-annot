import { config } from '../../config';
import { List, ListItemButton, ListItemText, Box, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { classSelector, setClass } from './annotBarSlice';

const AnnotBarSelector = () => {
    const selectedClass = useSelector((state) => classSelector(state))
    const dispatch = useDispatch()

    const handleClassClick = (className) => {
        dispatch(setClass(className));
    }

    return (
        <>
            <List>
                {config.labels.map((item) => (
                    <ListItemButton selected={selectedClass === item.label} key={item.id} onClick={() => handleClassClick(item.label)} sx={{ marginLeft: "5px", padding: "0px", "&:hover": { backgroundColor: "rgb(" + item.color[0] + "," + item.color[1] + "," + item.color[2] + ")" }, "&&.Mui-selected": { backgroundColor: "rgb(" + item.color[0] + "," + item.color[1] + "," + item.color[2] + ")" } }}>
                        <Box sx={{ width: "15px", height: "15px", backgroundColor: "rgb(" + item.color[0] + "," + item.color[1] + "," + item.color[2] + ")" }}></Box>
                        <ListItemText disableTypography primary={<Typography color="text.primary">{item.label}</Typography>} sx={{ marginLeft: "5px" }}></ListItemText>
                    </ListItemButton>
                ))}
            </List>
        </>
    )
}

export default AnnotBarSelector;
