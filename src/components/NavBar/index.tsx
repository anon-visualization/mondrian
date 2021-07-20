import React, { useState } from 'react';
import { AppBar, Toolbar, Button, makeStyles, useTheme, Theme, createStyles} from '@material-ui/core';

import InfoDialog from './InfoDialog';

const NavBar = (props: any) => {
  const handleChange = (e: any) => {
    props.onChange(e.target.files[0]);
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
          type="file"
          accept=".png,.jpg"
          hidden
          />
        </Button>
        <Button
          variant='contained'
          component='label'
        >
          LOAD VIDEO (MP4)
          <input
            name='video-input'
            type='file'
            accept='.mp4'
            onChange={handleChange}
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