import p5 from 'p5';

export class Path {
    public paths: Array<any>;
    private colorList: Array<string>;
    public curFileToOutput: number;
    public curPath: any;

    constructor() {
        this.paths = []; // List to hold all path objects created
        this.colorList = ['#6a3d9a', '#ff7f00', '#33a02c', '#1f78b4', '#e31a1c', '#ffff99', '#b15928', '#cab2d6', '#fdbf6f', '#b2df8a', '#a6cee3', '#fb9a99'];
        this.curPath = this.createPath([], 0, 7); // initialize Path with empty arrays, color black (0), path strokeWeight
        this.curFileToOutput = 0; // Integer counter to mark current file number to write to output
    }

    /**
      * Path object represents object being recorded such as a person or artifact
      */
     createPath(pointArray: Array<any>, pColor: any, weight: any) {
        return {
            pointArray, // array of point objects
            pColor, // path color
            weight // path strokeWeight
        };
    }

    createPoint(mouseXPos: any, mouseYPos: any, fpXPos: any, fpYPos: any, tPos: any) {
        return {
            mouseXPos, // array of mouse positions to display paths in floor plan container, provides ability to draw paths while program runs
            mouseYPos,
            fpXPos,
            fpYPos,
            tPos,
        };
    }

    addCurPathToList() {
        this.paths.push(this.createPath(this.curPath.pointArray, this.colorList[this.paths.length % this.colorList.length], 5));
    }

    /**
      * NOTE: Make sure to round all values
      */
     addPointToCurPath(mouseXPos: any, mouseYPos: any, fpXPos: any, fpYPos: any, time: any) {
        this.curPath.pointArray.push(this.createPoint(this.round(mouseXPos), this.round(mouseYPos), this.round(fpXPos), this.round(fpYPos), this.round(time)));
    }

    /**
      * Add 1 new data point to curPath lists for amountInSeconds fastForwarded
      * @param  {Integer/Number} amountInSeconds
      */
    fastForward(amountInSeconds: any) {
        const point = this.curPathEndPoint; // IMPORTANT: get last value before loop
        for (let i = 1; i <= amountInSeconds; i++) { // only tPos is different with each added point
            this.curPath.pointArray.push(this.createPoint(point.mouseXPos, point.mouseYPos, point.fpXPos, point.fpYPos, this.round(point.tPos + i)));
        }
    }
    /**
     * Remove all points from curPath Lists greater than rewindToTime parameter
     * @param  {Float/Number} rewindToTime
     */
    rewind(rewindToTime: number) {
        // IMPORTANT: Start at end of x or y list (NOT t) and delete up to newEndTime
        for (let i = this.curPath.xPos.length - 1; i >= 0; i--) {
            if (this.curPath.tPos[i] > rewindToTime) {
                this.curPath.tPos.pop();
                this.curPath.xPos.pop();
                this.curPath.yPos.pop();
            } else break;
        }
    }

    clearCurPath() {
        this.curPath.xPos = [];
        this.curPath.yPos = [];
        this.curPath.tPos = [];
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
        for (let i = 0; i < this.curPath.xPos.length; i++) {
            let newRow = table.addRow();
            newRow.setNum(FILEHEADERS[0], this.curPath.tPos[i]);
            newRow.setNum(FILEHEADERS[1], this.curPath.xPos[i]);
            newRow.setNum(FILEHEADERS[2], this.curPath.yPos[i]);
        }
        return table;
    }

    getCurrPath() {
        return this.curPath;
    }

    getCurrFileToOutput() {
        return this.curFileToOutput;
    }
    setCurrFileToOutput(i: number) {
        this.curFileToOutput = i;
    }

    getPaths() {
        return this.paths;
    }

    /**
      * Used to round numbers when saving data and also to compare path/video time to sample data
      * @param  {Number/Float} value
      */
     round(value: any) {
        return +(value.toFixed(2));
    }

    get curPathEndPoint() {
        if (this.curPath.pointArray.length > 0) return this.curPath.pointArray[this.curPath.pointArray.length - 1];
        else return 0;
    }
}