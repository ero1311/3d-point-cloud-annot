import { useSelector } from "react-redux"
import tum_logo from './lab_logo.svg'
import './App.css'
import { Grid, Avatar, Box, Paper, CircularProgress } from '@mui/material'
import Timer from './features/timer/Timer'
import AnnotBarSelector from "./features/annotBar/AnnotBarSelector"
import SceneSelector from "./features/sceneSelector/SceneSelector"
import AnnotCanvas from "./features/annotCanvas/AnnotCanvas"
import InteractivePredict from "./features/interactivePredict/InteractivePredict"
import TimerTheme from './features/timer/TimerTheme'
import { ThemeProvider } from '@mui/material/styles'
import { statusSelector } from './features/scannetScene/scannetSceneSlice'
import { useState } from "react"


function App() {
  const [positiveClicks, setPositiveClicks] = useState({})
  const [negativeClicks, setNegativeClicks] = useState({})
  const sceneLoadingStatus = useSelector((state) => statusSelector(state))

  return (
    <ThemeProvider theme={TimerTheme}>
      <div className="App">
        <Box sx={{
          width: 1,
          height: 1,
          backgroundColor: 'background.default'
        }}>
          <Grid container>
            <Grid item xs={3}>
              <Avatar alt="TUM logo" src={tum_logo} variant="square" sx={{ marginTop: "5px", width: 300, height: 56 }}></Avatar>
            </Grid>
            <Grid item xs={4} sx={{ marginTop: "10px" }}>
              <InteractivePredict
                instPositiveClicks={positiveClicks}
                instNegativeClicks={negativeClicks}
                instSetPositiveClicks={setPositiveClicks}
                instSetNegativeClicks={setNegativeClicks}
              />
            </Grid>
            <Grid item xs={3}>
              <SceneSelector />
            </Grid>
            <Grid item xs={2}>
              <Timer />
            </Grid>
            <Grid item xs={10} alignItems="center">
              {sceneLoadingStatus === "loaded"
                ? <AnnotCanvas
                  instPositiveClicks={positiveClicks}
                  instNegativeClicks={negativeClicks}
                  instSetPositiveClicks={setPositiveClicks}
                  instSetNegativeClicks={setNegativeClicks}
                />
                : <CircularProgress sx={{ marginTop: "25%" }} />}
            </Grid>
            <Grid item xs={2}>
              <AnnotBarSelector />
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
    </ThemeProvider>
  );
}

export default App;