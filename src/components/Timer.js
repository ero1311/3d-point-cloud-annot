import { Component } from 'react'
import {
    Grid,
    Box,
    Typography
} from "@mui/material";

export class TimeEntryInput extends Component {
    static defaultProps = {
        isFetching: false,
        removedSuccess: false
    }

    constructor(props) {
        super(props)

        const startTime = props.startTime ? props.startTime : null

        this.state = {
            startTime: startTime,
            currentTime: null,
            timerId: null,
        }

    }

    componentWillMount() {
        this.startTicking()
    }

    componentWillUnmount() {
        this.stopTicking()
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.startTime) {
            const startTime = new Date(nextProps.startTime)
            let nextState = {
                startTime: startTime
            }
            this.setState(nextState, function () {
                this.stopTicking()
                this.startTicking()
            })
        } else {
            this.stopTicking()
            this.setState({
                startTime: null
            })
        }
    }

    stopTicking = () => {
        //clear previous timer if any
        if (this.state.timerId) {
            clearInterval(this.state.timerId)
            this.setState({ timerId: null })
        }
    }

    startTicking = () => {
        console.log(this.state.startTime);
        if (this.state.startTime) {
            const updateDuration = () => {
                if (this.state.currentTime === null) {
                    this.setState({
                        currentTime: this.state.startTime
                    })
                }
                else {
                    this.setState({
                        currentTime: this.state.currentTime + 1000
                    })
                }
            }

            updateDuration()
            //setup new timer to show duration
            let timerId = setInterval(() => {
                updateDuration()
            }, 1000)

            this.setState({
                timerId: timerId
            })
        }
    }

    formatTime = () => {
        const sec = `${Math.floor(this.state.currentTime / 1000) % 60}`.padStart(2, "0");
        const min = `${Math.floor(this.state.currentTime / 60000) % 60}`.padStart(2, "0");
        const hour = `${Math.floor(this.state.currentTime / 3600000)}`.padStart(2, "0");
        return (
            <>
                <Typography variant="h5">{[hour, min, sec].join(":")}</Typography>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around"
                }}>
                    {["hr", "min", "sec"].map((unit) => (
                        <Typography key={unit} vairant="overline">
                            {unit}
                        </Typography>
                    ))}
                </Box>
            </>
        );
    };

    render() {
        return (
            <>
                <Grid m={2} sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <Grid item>
                        <Typography variant="h5">{[`${Math.floor(this.state.currentTime / 3600000)}`.padStart(2, "0"),
                        `${Math.floor(this.state.currentTime / 60000) % 60}`.padStart(2, "0"),
                        `${Math.floor(this.state.currentTime / 1000) % 60}`.padStart(2, "0")].join(":")}</Typography>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around"
                        }}>
                            {["hr", "min", "sec"].map((unit) => (
                                <Typography key={unit} vairant="overline">
                                    {unit}
                                </Typography>
                            ))}
                        </Box>
                    </Grid>
                    <Grid item>
                    </Grid>
                    <Grid item></Grid>
                </Grid>
            </>
        )
    }
}

export default TimeEntryInput