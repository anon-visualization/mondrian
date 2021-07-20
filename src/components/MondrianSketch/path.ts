import p5 from 'p5';

export class Path {
    private paths: Array<any>;
    private colorList: Array<string>;
    private currPath: any;
    private currFileToOutput: number;

    constructor() {
        this.paths = []; // List to hold all path objects created
        this.colorList = ['#6a3d9a', '#ff7f00', '#33a02c', '#1f78b4', '#e31a1c', '#ffff99', '#b15928', '#cab2d6', '#fdbf6f', '#b2df8a', '#a6cee3', '#fb9a99'];
        this.currPath = this.createPath([], [], [], 0, 7); // initialize Path with empty arrays, color black (0), path strokeWeight
        this.currFileToOutput = 0; // Integer counter to mark current file number to write to output
    }

    /**
     * Factory function that creates a Path object
     * Path object represents object being recorded such as a person or artifact as decimal / number lists of x / y pixel positions and time values in seconds / fractions of seconds with color and strokeWeight
     * @param  {Array} xPos
     * @param  {Array} yPos
     * @param  {Array} tPos
     */
    createPath(xPos: Array<number>, yPos: Array<number>, tPos: Array<number>, pColor: any, weight: number) {
        return {
            xPos,
            yPos,
            tPos,
            pColor, // color of path
            weight // strokeweight of path
        };
    }

    addPoint(point: any) {
        this.currPath.xPos.push(point.xPos);
        this.currPath.yPos.push(point.yPos);
        this.currPath.tPos.push(point.time);
    }

    addPath() {
        this.paths.push(this.createPath(this.currPath.xPos, this.currPath.yPos, this.currPath.tPos, this.colorList[this.paths.length % this.colorList.length], 5));
    }

    /**
     * Add 1 new data point to currPath lists for amountInSeconds fastForwarded
     * @param  {Integer/Number} amountInSeconds
     */
    fastForward(amountInSeconds: number) {
        // IMPORTANT: get last values from cur lists first before loop. Uses to set x/yPos and increment tPos
        const xPos = this.currPath.xPos[this.currPath.tPos.length - 1];
        const yPos = this.currPath.yPos[this.currPath.tPos.length - 1];
        const tPos = this.currPath.tPos[this.currPath.tPos.length - 1];
        // Add values for each second jumped by VideoJumpvalue, xPos and yPos are same but add i to tPos as time is increasing
        // Start at 1 to record tPos properly
        for (let i = 1; i <= amountInSeconds; i++) {
            this.currPath.xPos.push(xPos);
            this.currPath.yPos.push(yPos);
            this.currPath.tPos.push(+(tPos + i).toFixed(2));
        }
    }
    /**
     * Remove all points from currPath Lists greater than rewindToTime parameter
     * @param  {Float/Number} rewindToTime
     */
    rewind(rewindToTime: number) {
        // IMPORTANT: Start at end of x or y list (NOT t) and delete up to newEndTime
        for (let i = this.currPath.xPos.length - 1; i >= 0; i--) {
            if (this.currPath.tPos[i] > rewindToTime) {
                this.currPath.tPos.pop();
                this.currPath.xPos.pop();
                this.currPath.yPos.pop();
            } else break;
        }
    }

    clearCurPath() {
        this.currPath.xPos = [];
        this.currPath.yPos = [];
        this.currPath.tPos = [];
    }

    clearAllPaths() {
        this.clearCurPath();
        this.paths = [];
    }

    getTable() {
        const FILEHEADERS = ["time", "x", "y"]; // Column headers for outputted .CSV movement files
        let table = new p5.Table();
        table.addColumn(FILEHEADERS[0]);
        table.addColumn(FILEHEADERS[1]);
        table.addColumn(FILEHEADERS[2]);
        for (let i = 0; i < this.currPath.xPos.length; i++) {
            let newRow = table.addRow();
            newRow.setNum(FILEHEADERS[0], this.currPath.tPos[i]);
            newRow.setNum(FILEHEADERS[1], this.currPath.xPos[i]);
            newRow.setNum(FILEHEADERS[2], this.currPath.yPos[i]);
        }
        return table;
    }

    getCurrPath() {
        return this.currPath;
    }

    getCurrFileToOutput() {
        return this.currFileToOutput;
    }
    setCurrFileToOutput(i: number) {
        this.currFileToOutput = i;
    }

    getPaths() {
        return this.paths;
    }
}