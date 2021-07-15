import React from 'react';
import Button from '@material-ui/core/Button';

export default function InfoDialog() {
    const [video, setVideo] = React.useState(true);

    return (
        <div>
            <Button
                variant="contained"
                component="label"
            >
                LOAD VIDEO (MP4)
                <input
                onChange={() => setVideo(video)}
                type="file"
                accept=".mp4"
                hidden
                />
            </Button>
        </div>
    );
}