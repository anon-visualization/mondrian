/*
Mediator class coordinates calls to 4 other classes including P5 sk
Contains methods for procedural updates, testing data, getters/setters, and loading data (called from Controller)
*/
class Mediator {

    constructor(sketch) {
        this.sk = sketch;
        this.path = new Path();
        this.videoPlayer = null;
        this.floorPlan = null;
        this.isRecording = false; // Boolean to indicate recording
        this.isInfoShowing = true; // Boolean to show/hide intro message
        this.jumpInSeconds = 5; // Integer value in seconds to ff or rewind
    }

    handleKeyPressed(keyValue) {
        if (this.allDataLoaded()) {
            if (keyValue === 'r' || keyValue === 'R') this.rewind();
            else if (keyValue === 'f' || keyValue === 'F') this.fastForward();
        }
    }

    handleMousePressed() {
        if (this.allDataLoaded()) {
            this.playPauseRecording();
            if (this.isInfoShowing) this.updateIntro(); // prevent info screen from showing while recording for smooth user interaction
        }
    }

    // ** ** ** ** UPDATE METHODS ** ** ** **

    updateDrawLoop() {
        if (this.allDataLoaded()) {
            if (this.isRecording) this.updateRecording();
            if (this.isInfoShowing) this.updateIntroScreen();
        } else {
            this.sk.drawLoadDataBackground();
            if (this.isInfoShowing) this.updateLoadDataScreen();
        }
    }

    updateLoadDataScreen() {
        if (this.floorPlanLoaded()) this.sk.drawFloorPlan(this.floorPlan);
        else if (this.videoLoaded()) this.updateVideoFrame();
        if (this.isInfoShowing) this.sk.drawIntroScreen();
    }

    updateIntroScreen() {
        this.updateAllData(); // redraw all data first, then the info screen
        this.sk.drawIntroScreen();
    }

    /**
     * Coordinates video and line segment drawing in display. Decides whether to record data point based on sampling rate method
     */
    updateRecording() {
        this.updateVideoFrame();
        this.sk.drawLineSegment(this.path.curPath); // Don't call this within testSampleRate block
        if (this.testSampleRate()) this.updateCurPath();
    }

    /**
     * Method to sample data in 2 ways
     * (1) if mouse moves sample at rate of 2 decimal points
     * (2) if stopped sample at rate of 0 decimal points, approximately every 1 second in movie
     */
    testSampleRate() {
        if (this.path.curPath.pointArray.length === 0) return true; // always return true if first data point
        else if (this.sk.mouseX !== this.sk.pmouseX || this.sk.mouseY !== this.sk.pmouseY) return this.sampleAtRate(2);
        else return this.sampleAtRate(0);
    }

    sampleAtRate(rate) {
        return +(this.path.curPathEndPoint.tPos.toFixed(rate)) < +(this.videoPlayer.movieDiv.time().toFixed(rate));
    }

    /**
     * Add correctly scaled positioning data to current path
     */
    updateCurPath() {
        const [mouseXPos, mouseYPos, pointXPos, pointYPos] = this.sk.getPositioningData(this.floorPlan);
        const time = +this.videoPlayer.movieDiv.time().toFixed(2);
        this.path.addPointToCurPath(mouseXPos, mouseYPos, pointXPos, pointYPos, time);
    }

    updateIntro() {
        if (this.isInfoShowing && this.allDataLoaded()) this.updateAllData();
        if (this.isInfoShowing) this.isInfoShowing = false;
        else this.isInfoShowing = true;
    }

    updateAllData() {
        this.sk.drawFloorPlan(this.floorPlan);
        this.updateVideoFrame();
        for (const path of this.path.paths) this.sk.drawPath(path); // update all recorded paths
        this.sk.drawPath(this.path.curPath); // update current path last
    }

    updateVideoFrame() {
        this.sk.drawVideoFrame(this.videoPlayer);
        this.sk.drawVideoTimeLabel(this.videoPlayer.movieDiv.time());
    }

    resetCurRecording() {
        if (this.allDataLoaded()) {
            this.stopRecording();
            this.path.clearCurPath();
            this.updateAllData();
        }
    }

    /**
     * Coordinates rewinding of video and erasing of curPath data and updating display
     */
    rewind() {
        const rewindToTime = this.path.curPathEndPoint.tPos - this.jumpInSeconds; // set time to rewind to based on last value in list
        this.path.rewind(rewindToTime);
        this.videoPlayer.rewind(rewindToTime, this.jumpInSeconds);
        if (this.isRecording) this.playPauseRecording(); // pause recording and video if currently recording
        this.updateAllData();
        if (this.path.curPath.pointArray.length > 0) this.sk.drawCurPathBug(this.path.curPathEndPoint);
    }

    /**
     * Coordinates fast forwarding of movie and path data, if movie not right at start or near end
     */
    fastForward() {
        if (this.testVideoTimeForFastForward()) {
            this.videoPlayer.fastForward(this.jumpInSeconds);
            this.path.fastForward(this.jumpInSeconds);
        }
    }

    stopRecording() {
        this.videoPlayer.stop();
        this.isRecording = false;
    }

    playPauseRecording() {
        if (this.isRecording) {
            this.videoPlayer.pause();
            this.isRecording = false;
            if (this.path.curPath.pointArray.length > 0) this.sk.drawCurPathBug(this.path.curPathEndPoint);
        } else if (this.testVideoTimeForRecording()) {
            this.updateAllData(); // update all data to erase curPathBug
            this.videoPlayer.play();
            this.isRecording = true;
        }
    }

    // ** ** ** ** LOAD DATA METHODS ** ** ** **

    loadVideo(fileLocation) {
        if (this.videoLoaded()) this.videoPlayer.destroy(); // if a video exists, destroy it
        this.videoPlayer = new VideoPlayer(fileLocation, this.sk); // create new videoPlayer
    }
    /**
     * Tests if new video has a duration (additional formatting test) and updates all data/views if so or destroys video and alerts user if not
     */
    newVideoLoaded() {
        console.log("New Video Loaded");
        this.path.clearAllPaths();
        this.stopRecording(); // necessary to be able to draw starting frame before playing the video
        this.updateVideoFrame(); // after video loaded, draw first frame to display it
        if (this.floorPlanLoaded()) this.sk.drawFloorPlan(this.floorPlan);
    }

    loadFloorPlan(fileLocation) {
        this.sk.loadImage(fileLocation, (img) => {
            this.newFloorPlanLoaded(img);
            URL.revokeObjectURL(fileLocation);
        }, e => {
            alert("Error loading floor plan image file. Please make sure it is correctly formatted as a PNG or JPG image file.")
            console.log(e);
        });
    }

    newFloorPlanLoaded(img) {
        console.log("New Floor Plan Loaded");
        this.floorPlan = img;
        this.path.clearAllPaths();
        this.sk.drawFloorPlan(this.floorPlan);
        if (this.videoLoaded()) {
            this.stopRecording();
            this.updateVideoFrame();
        }
    }

    writeFile() {
        if (this.allDataLoaded() && this.path.curPath.pointArray.length > 0) {
            this.sk.saveTable(this.path.writeTable(), "Path_" + this.path.curFileToOutput, "csv");
            this.path.curFileToOutput++;
            this.path.addPath();
            this.path.clearCurPath();
            this.stopRecording();
            this.updateAllData();
        }
    }

    /**
     * @param  {Any Type} data
     */
    dataIsLoaded(data) {
        return data != null; // in javascript this tests for both undefined and null values
    }

    floorPlanLoaded() {
        return this.dataIsLoaded(this.floorPlan);
    }

    videoLoaded() {
        return this.dataIsLoaded(this.videoPlayer);
    }

    allDataLoaded() {
        return this.dataIsLoaded(this.floorPlan) && this.dataIsLoaded(this.videoPlayer);
    }

    testVideoTimeForRecording() {
        return this.videoPlayer.movieDiv.time() < this.videoPlayer.movieDiv.duration();
    }

    testVideoTimeForFastForward() {
        return this.videoPlayer.movieDiv.time() > 0 && (this.videoPlayer.movieDiv.time() < this.videoPlayer.movieDiv.duration() - this.jumpInSeconds);
    }
}