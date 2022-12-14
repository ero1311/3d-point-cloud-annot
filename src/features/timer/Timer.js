import React, { useState, useRef, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import {
    Box,
    Typography,
    Grid,
} from "@mui/material"
import { useClasses } from "./TimerTheme"
import {
    timerInit,
    timerToggle,
    timerSaveTime,
    selectTimerById
} from './timerSlice'

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
    const timer = useSelector((state) => selectTimerById(state, 0))
    const intervalRef = useRef(0);
    const dispatch = useDispatch();

    const formatTime = () => {
        const sec = `${Math.floor(timer.time) % 60}`.padStart(2, "0");
        const min = `${Math.floor(timer.time / 60) % 60}`.padStart(2, "0");
        const hour = `${Math.floor(timer.time / 3600)}`.padStart(2, "0");
        return (
            <>
                <Typography variant="h4">{[hour, min, sec].join(":")}</Typography>
                <Box className={classes.labelTime}>
                    {["hr", "min", "sec"].map((unit) => (
                        <Typography key={unit} vairant="overline">
                            {unit}
                        </Typography>
                    ))}
                </Box>
            </>
        );
    };

    useEffect(() => {
        if (timer.running) {
            intervalRef.current = setTimeout(() => dispatch(timerSaveTime(timer.time + 0.1)), 100)
            return () => clearTimeout(intervalRef.current);
        }
    }, [timer.time, timer.running]);

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