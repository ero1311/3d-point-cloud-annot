import React, { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import {
    Box,
    Typography,
    Grid,
} from "@mui/material"
import { useClasses } from "./TimerTheme"
import { setTime, timerRunningSelector, timeSelector } from "./timerSlice"


const styles = theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    labelTime: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around"
    },
    playButton: {
        color: theme.status.play,
        fontSize: "48px"
    },
    pauseButton: {
        color: theme.status.pause,
        fontSize: "48px"
    },
    flagButton: {
        color: "",
        fontSize: "48px"
    },
    restoreButton: {
        color: "",
        fontSize: "48px"
    },
    tableContainer: {
        maxHeight: "70vh"
    },
    table: {
        minWidth: 600
    },
    tableBody: {
        alignItems: "space-around",
        overflowY: "auto"
    },
    lapCell: {
        display: "flex",
        flexDirection: "row"
    },
    lapCellTypo: {
        marginRight: 20
    }
})

const Timer = () => {
    // const timer = useSelector((state) => selectTimerById(state, 0))
    const timer = useSelector((state) => timeSelector(state))
    const running = useSelector((state) => timerRunningSelector(state))
    const dispatch = useDispatch();

    const formatTime = () => {
        const sec = `${Math.floor(timer) % 60}`.padStart(2, "0");
        const min = `${Math.floor(timer / 60) % 60}`.padStart(2, "0");
        const hour = `${Math.floor(timer / 3600)}`.padStart(2, "0");
        return (
            <>
                <Typography variant="h4" color="text.primary">{[hour, min, sec].join(":")}</Typography>
                <Box className={classes.labelTime}>
                    {["hr", "min", "sec"].map((unit) => (
                        <Typography key={unit} vairant="overline" color="text.primary">
                            {unit}
                        </Typography>
                    ))}
                </Box>
            </>
        );
    };

    useEffect(() => {
        if (running) {
            const id = setInterval(() => dispatch(setTime(timer + 1)), 1000);
            return () => {
                clearInterval(id);
            };
        }

    }, [timer, dispatch, running]);


    // useEffect(() => {
    //     if (timer.running) {
    //         intervalRef.current = setTimeout(() => dispatch(timerSaveTime(timer.time + 0.1)), 100)
    //         return () => clearTimeout(intervalRef.current);
    //     }
    // }, [timer.time, timer.running]);

    const classes = useClasses(styles);
    return (
        <>
            <Grid m={2} className={classes.root}>
                <Grid item></Grid>
                <Grid item></Grid>
                <Grid item>{formatTime()}</Grid>
            </Grid>
        </>
    );
};

export default Timer;