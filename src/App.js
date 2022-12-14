import { useSelector, useDispatch } from "react-redux"
import tum_logo from './lab_logo.svg'
import './App.css'
import { Grid, Avatar, Box, Paper, Switch } from '@mui/material'
import Timer from './features/timer/Timer'
import TimerTheme from './features/timer/TimerTheme'
import { ThemeProvider } from '@mui/material/styles'
import {
  timerRunningSelector,
  timeSelector,
  toggleTimer,

} from './features/timer/timerSlice'
import { useCallback } from "react"

function App() {
  const timer = useSelector((state) => timeSelector(state))
  const running = useSelector((state) => timerRunningSelector(state))
  const dispatch = useDispatch();

  const handlePlayPause = useCallback(() => {
    dispatch(toggleTimer());
  }, [dispatch]);

  return (
    <div className="App">
      <Box sx={{
        width: 1,
        height: 1,
        backgroundColor: 'primary.main'
      }}>
        <Grid container>
          <Grid item xs={10}>
            <Avatar alt="TUM logo" src={tum_logo} variant="square" sx={{ width: 200, height: 56 }}></Avatar>
          </Grid>
          <Grid item xs={2}>
            <ThemeProvider theme={TimerTheme}>
              <Timer />
            </ThemeProvider>
          </Grid>
          <Grid item xs={10}>
            <Switch checked={running} onChange={handlePlayPause}></Switch>
          </Grid>
          <Grid item xs={2}>
            <Paper />
          </Grid>
          <Grid item xs={10}>
            <Paper />
          </Grid>
          <Grid item xs={2}>
            <Paper />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default App;