import React, { useState } from 'react';
import Sketch from "./components/MondrianSketch"
import './App.css';


import MondrianSketch from './components/MondrianSketch';
import ReactP5Wrapper from "react-p5-wrapper";

import NavBar from './components/NavBar';
import { AppBar, Toolbar, Button, makeStyles, useTheme, Theme, createStyles} from '@material-ui/core';

import InfoDialog from './components/NavBar/InfoDialog';
import './App.css';
import { useEffect } from 'react';

function App() {
  const [state, setState] = useState({ floorplanPath: "", videoPath: ""})

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <InfoDialog/>
          <Button
            variant="contained"
            component="label"
            >
            LOAD FLOOR PLAN (PNG/JPG)
            <input
              name='floorplan'
              value={state.floorplanPath}
              type="file"
              accept=".png,.jpg"
              onChange={e =>
                setState({ ...state, floorplanPath: e.target.value})
              }
              hidden
            />
          </Button>
          <Button
            variant='contained'
            component='label'
          >
            LOAD VIDEO (MP4)
            <input
              name='video'
              value={state.videoPath}
              type='file'
              accept='.mp4'
              onChange={e =>
                setState({ ...state, videoPath: e.target.value})
              }
              hidden
            />
          </Button>
          <Button
            variant="contained"
            component="label"
          >
            SAVE MOVEMENT PATH
          </Button>
          <Button
            variant="contained"
            component="label"
          >
            CLEAR RECORDING
          </Button>
        </Toolbar>
      </AppBar>

      <Sketch props={state.floorplanPath}/>
    </div>
  );
}

export default App;