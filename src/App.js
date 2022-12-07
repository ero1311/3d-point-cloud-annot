import logo from './logo.svg';
import tum_logo from './lab_logo.svg';
import './App.css';
import { Grid, Avatar, Box, Paper } from '@mui/material';
import Timer from './components/Timer';

function App() {
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
            <Timer startTime={1000} />
          </Grid>
          <Grid item xs={10}>
            <Paper />
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
