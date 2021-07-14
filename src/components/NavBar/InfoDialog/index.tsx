import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';

export default function InfoDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="inherit" onClick={handleClickOpen}>
        HOW TO USE
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Mondrian Transciption Software</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="caption">
                by Ben Rydal Shapiro & contributors
                built with p5.js & React
            </Typography>
          </DialogContentText>
          <DialogContentText>
            <Typography variant="body1">
                Hi there!<br/>
                This tool allows you to transcribe fine-grained movement data from video.<br/>
                To get started, use the top buttons to:<br/>
                1. Upload a floor plan image (PNG/JPG)<br/>
                2. Upload a video (MP4)<br/>
                3. Click anywhere on the floor plan to start recording movement data synchronized to the video<br/>
                <br/>
                As you use your cursor to draw on the floor plan, positioning data is recorded organized by time in seconds<br/>
                and x/y pixel positions scaled to the pixel size of your floor plan image.<br/>
                Play/pause your recording by clicking on the floor plan. Press `F` to fast forward and `R` to rewind the video<br/>
                along with the data recording at 5 second intervals.<br/>
                Use the top buttons to clear your recording or save your recordings as a CSV file.<br/>
                <br/>
                For more information, please visit https://www.benrydal.com/software/mondrian-transcription<br/>
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}