import { Mediator } from './mediator';

export class Controller {
    private mediator: Mediator;

    constructor(mediator: Mediator) {
        this.mediator = mediator;
    }

    handleSaveButton() {
        this.mediator.writeFile();
    }

    handleResetButton() {
        this.mediator.resetCurRecording();
    }
}