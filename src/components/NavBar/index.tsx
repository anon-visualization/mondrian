import React, { useState } from 'react';
import { AppBar, Toolbar, Button, makeStyles, useTheme, Theme, createStyles} from '@material-ui/core';

import InfoDialog from './InfoDialog';

const NavBar = (props: any) => {
  const onChange = (e: any) => {
    props.onChange(e);
  }

  return (
    <div>
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
            value={props.floorplan}
            type="file"
            accept=".png,.jpg"
            onChange={onChange}
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
            value={props.video}
            type='file'
            accept='.mp4'
            onChange={onChange}
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
    </div>
  );
}

export default NavBar;