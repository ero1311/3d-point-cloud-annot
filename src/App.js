import { useSelector, useDispatch } from "react-redux"
import tum_logo from './lab_logo.svg'
import './App.css'
import { Grid, Avatar, Box, Paper, Switch, CircularProgress } from '@mui/material'
import Timer from './features/timer/Timer'
import AnnotBarSelector from "./features/annotBar/AnnotBarSelector"
import SceneSelector from "./features/sceneSelector/SceneSelector"
import AnnotCanvas from "./features/annotCanvas/AnnotCanvas"
import TimerTheme from './features/timer/TimerTheme'
import { ThemeProvider } from '@mui/material/styles'
import {
  timerRunningSelector,
  toggleTimer,

} from './features/timer/timerSlice'
import { statusSelector } from './features/scannetScene/scannetSceneSlice'
import { useCallback } from "react"

function App() {
  const running = useSelector((state) => timerRunningSelector(state))
  const sceneLoadingStatus = useSelector((state) => statusSelector(state))
  const dispatch = useDispatch();

  const handlePlayPause = useCallback(() => {
    dispatch(toggleTimer());
  }, [dispatch]);

  return (
    <ThemeProvider theme={TimerTheme}>
      <div className="App">
        <Box sx={{
          width: 1,
          height: 1,
          backgroundColor: 'background.default'
        }}>
          <Grid container>
            <Grid item xs={5}>
              <Avatar alt="TUM logo" src={tum_logo} variant="square" sx={{ marginTop: "5px", width: 300, height: 56 }}></Avatar>
            </Grid>
            <Grid item xs={5}>
              <SceneSelector />
            </Grid>
            <Grid item xs={2}>
              <Timer />
            </Grid>
            <Grid item xs={10} alignItems="center">
              {sceneLoadingStatus === "loaded" ? <AnnotCanvas /> : <CircularProgress sx={{ marginTop: "25%" }} />}
            </Grid>
            <Grid item xs={2}>
              <AnnotBarSelector />
            </Grid>
            <Grid item xs={10}>
              <Paper />
            </Grid>
            <Grid item xs={2}>
              <Switch checked={running} onChange={handlePlayPause}></Switch>
            </Grid>
          </Grid>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;