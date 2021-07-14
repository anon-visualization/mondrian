import React from 'react';
import { AppBar, Toolbar, Button } from '@material-ui/core';
import InfoDialog from './InfoDialog';

export default function NavBar() {
  return (
  <div>
    <React.Fragment>
    <AppBar position="static">
      <Toolbar>
        <InfoDialog/>
        <Button
          variant="contained"
          component="label"
        >
          LOAD FLOOR PLAN (PNG/JPG)
          <input
            type="file"
            accept=".png,.jpg"
            hidden
          />
        </Button>
        <Button
          variant="contained"
          component="label"
        >
          LOAD VIDEO (MP4)
          <input
            type="file"
            accept=".mp4"
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
    </React.Fragment>
  </div>
  );
}