import React, { useState } from 'react';
import { AppBar, Toolbar, Button, makeStyles, useTheme, Theme, createStyles} from '@material-ui/core';

import InfoDialog from './InfoDialog';

interface NavBarProps {
  video: string,
}

const NavBar = ({ video }: NavBarProps) => {

  // const [video, setVideo] = useState([]);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    console.log(file);
  }

  return (
  <div style={{
    maxHeight: '60px'
  }}>
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
            variant='contained'
            component='label'
        >
            LOAD VIDEO (MP4)
            <input
                id='videoFile'
                type='file'
                accept='.mp4'
                hidden

                value={video}
                onChange={handleFileChange}
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

export default NavBar;