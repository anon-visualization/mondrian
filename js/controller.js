class Controller {

    constructor(mediator) {
        this.mediator = mediator;
    }

    handleIntroButton() {
        this.mediator.updateIntro();
    }

    handleSaveButton() {
        this.mediator.writeFile();
    }

    /**
     * Handles asynchronous loading and error handling of floor plan image file
     * @param  {PNG/JPG File} input
     */
    handleFloorPlanButton(input) {
        this.mediator.loadFloorPlan(URL.createObjectURL(input.files[0]));
        input.value = ''; // reset input value so you can load same file again in browser
    }

    /**
     * Handles async loading of video file and creates movie object
     * @param  {.MP4 File} input
     */
    handleVideoButton(input) {
        this.mediator.loadVideo(URL.createObjectURL(input.files[0]));
        input.value = ''; // reset input value so you can load same file again in browser
    }

    handleResetButton() {
        this.mediator.resetCurRecording();
    }
}