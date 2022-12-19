import { useSelector, useDispatch } from "react-redux"
import tum_logo from './lab_logo.svg'
import './App.css'
import { Grid, Avatar, Box, Paper, Switch, CircularProgress } from '@mui/material'
import Timer from './features/timer/Timer'
import AnnotBarSelector from "./features/annotBar/AnnotBarSelector"
import SceneSelector from "./features/sceneSelector/SceneSelector"
import ScannetScene from "./features/scannetScene/ScannetScene"
import SpherePointer from "./features/spherePointer/SpherePointer"
import TimerTheme from './features/timer/TimerTheme'
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { ThemeProvider } from '@mui/material/styles'
import {
  timerRunningSelector,
  toggleTimer,

} from './features/timer/timerSlice'
import { statusSelector } from './features/scannetScene/scannetSceneSlice'
import { useCallback } from "react"

const SCREEN_WIDTH = 0.84 * window.innerWidth
const SCREEN_HEIGHT = 0.83 * window.innerHeight
const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT

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
              {sceneLoadingStatus === "loaded" ? <Canvas camera={{
                fov: 75,
                aspect: ASPECT,
                near: 0.1,
                far: 50,
                position: [2, 2, 2],
                up: [0, 0, 1]
              }}
                dpr={window.devicePixelRatio}
                gl={{ antialias: false }}>
                <color attach="background" args={['#202020']} />
                <ambientLight color="#888888" />
                <pointLight color="#888888" position={[0, 0, 3]} castShadow={true} />
                <ScannetScene />
                <SpherePointer />
                <OrbitControls
                  enableDamping={false}
                  dampingFactor={0.05}
                  screenSpacePanning={false}
                  minDistance={1}
                  maxDistance={10}
                  maxPolarAngle={Math.PI / 2}
                />
              </Canvas> : <CircularProgress sx={{ marginTop: "25%" }} />}
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