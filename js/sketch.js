/*
CREDITS/LICENSE INFORMATION: 
This software is written in JavaScript and p5.js and is licensed under the GNU General Public License Version 2.0. 
See the GNU General Public License included with this software for more details. 
Mondrian Transcription software was originally developed by Ben Rydal Shapiro at Vanderbilt University
as part of his dissertation titled Interaction Geography & the Learning Sciences. 
Copyright (C) 2018 Ben Rydal Shapiro, and contributors. 
To reference or read more about this work please see: 
https://etd.library.vanderbilt.edu/available/etd-03212018-140140/unrestricted/Shapiro_Dissertation.pdf
*/

const mondrian = new p5((sk) => {

    sk.preload = function () {
        sk.font_Lato = sk.loadFont("data/fonts/Lato-Light.ttf");
    }

    sk.setup = function () {
        sk.canvas = sk.createCanvas(window.innerWidth, window.innerHeight);
        sk.canvas.parent('sketch-holder');
        sk.textFont(sk.font_Lato, 20);
        sk.mediator = new Mediator(sk);
        sk.controller = new Controller(sk.mediator);
        sk.floorPlanContainer = sk.createFloorPlanContainer(sk.width / 2, sk.width / 2);
        sk.videoContainer = sk.createVideoContainer(sk.width / 2);
        sk.isSelected = false;
    }

    /**
     * Program loop organizes two drawing modes based on whether data is loaded
     */
    sk.draw = function () {
        sk.mediator.updateDrawLoop();
        if (sk.overSelector()) sk.cursor(sk.MOVE);
        else sk.cursor(sk.ARROW);
    }

    sk.overSelector = function () {
        const selectorSpacing = 3;
        return sk.overRect(sk.videoContainer.width - selectorSpacing, 0, selectorSpacing * 2, sk.videoContainer.height);
    }

    /**
     * Draws circle for last index in current path being recorded
     */
    sk.drawCurPathEndPoint = function (point) {
        this.noStroke();
        this.fill(255, 0, 0);
        const x1 = point.fpXPos * (this.floorPlanContainer.width / this.mediator.floorPlan.img.width);
        const y1 = point.fpYPos * (this.floorPlanContainer.height / this.mediator.floorPlan.img.height);
        this.circle(x1 + this.floorPlanContainer.xPos, y1 + this.floorPlanContainer.yPos, 25);
    }

    sk.drawLineSegment = function (curPath) {
        // Constrain mouse to floor plan display
        const xPos = this.constrain(this.mouseX, this.floorPlanContainer.xPos, this.floorPlanContainer.xPos + this.floorPlanContainer.width);
        const yPos = this.constrain(this.mouseY, this.floorPlanContainer.yPos, this.floorPlanContainer.yPos + this.floorPlanContainer.height);
        const pXPos = this.constrain(this.pmouseX, this.floorPlanContainer.xPos, this.floorPlanContainer.xPos + this.floorPlanContainer.width);
        const pYPos = this.constrain(this.pmouseY, this.floorPlanContainer.yPos, this.floorPlanContainer.yPos + this.floorPlanContainer.height);
        this.strokeWeight(curPath.weight);
        this.stroke(curPath.pColor);
        this.line(xPos, yPos, pXPos, pYPos);
    }

    sk.drawPath = function (path) {
        this.stroke(path.pColor);
        this.strokeWeight(path.weight);
        for (let i = 1; i < path.pointArray.length; i++) {
            const x1 = path.pointArray[i].fpXPos * (this.floorPlanContainer.width / this.mediator.floorPlan.img.width);
            const x2 = path.pointArray[i - 1].fpXPos * (this.floorPlanContainer.width / this.mediator.floorPlan.img.width);
            const y1 = path.pointArray[i].fpYPos * (this.floorPlanContainer.height / this.mediator.floorPlan.img.height);
            const y2 = path.pointArray[i - 1].fpYPos * (this.floorPlanContainer.height / this.mediator.floorPlan.img.height);
            this.line(x1 + this.floorPlanContainer.xPos, y1 + this.floorPlanContainer.yPos, x2 + this.floorPlanContainer.xPos, y2 + this.floorPlanContainer.yPos);
        }
    }

    /**
     * Draw current movie frame image and white background to GUI in video display
     */
    sk.drawVideoFrame = function (vp, curVideoTime) {
        sk.drawVideoImage(vp);
        sk.drawVideoTimeLabel(curVideoTime);
    }

    sk.drawVideoImage = function (vp) {
        this.fill(255);
        this.stroke(255);
        this.rect(this.videoContainer.xPos, this.videoContainer.yPos, this.videoContainer.width, this.videoContainer.height); // erases previous video frames from other loaded videos that can be different size than current frames
        this.image(vp.movieDiv, this.videoContainer.xPos, this.videoContainer.yPos, vp.scaledWidth, vp.scaledHeight);
    }

    sk.drawVideoTimeLabel = function (curVideoTime) {
        this.fill(0);
        this.noStroke();
        const labelSpacing = 30;
        const minutes = Math.floor(curVideoTime / 60);
        const seconds = Math.floor(curVideoTime - minutes * 60);
        const label = minutes + " minutes  " + seconds + " seconds";
        this.text(label, this.videoContainer.xPos + labelSpacing / 2, this.videoContainer.yPos + labelSpacing);
    }

    sk.drawFloorPlan = function (floorPlan) {
        this.fill(255); // draw white screen in case floor plan image has any transparency
        this.stroke(255);
        this.rect(this.floorPlanContainer.xPos, this.floorPlanContainer.yPos, this.floorPlanContainer.width, this.floorPlanContainer.height);
        this.image(floorPlan, this.floorPlanContainer.xPos, this.floorPlanContainer.yPos, this.floorPlanContainer.width, this.floorPlanContainer.height);
    }

    sk.drawCenterLine = function () {
        this.stroke(0);
        this.strokeWeight(2);
        this.line(this.videoContainer.width, 0, this.videoContainer.width, this.videoContainer.height);
    }

    /**
     * NOTE: First, constrain mouse x/y pos to floor plan display container
     * then, subtract floorPlan container from constrained mouse x/y pos to set to 0,0 origin and scale x/y positions to input floor plan width / height 
     */
    sk.getPositioningData = function (floorPlan) {
        const mouseXPos = (this.constrain(this.mouseX, this.floorPlanContainer.xPos, this.floorPlanContainer.xPos + this.floorPlanContainer.width));
        const mouseYPos = (this.constrain(this.mouseY, this.floorPlanContainer.yPos, this.floorPlanContainer.yPos + this.floorPlanContainer.height));
        const fpXPos = (mouseXPos - this.floorPlanContainer.xPos) * (floorPlan.width / this.floorPlanContainer.width);
        const fpYPos = (mouseYPos - this.floorPlanContainer.yPos) * (floorPlan.height / this.floorPlanContainer.height);
        return [fpXPos, fpYPos];
    }

    /**
     * While wrapped in a P5 instance, keyPressed and mousePressed P5 methods operate globally on the window (there can't be two of these methods)
     */
    sk.keyPressed = function () {
        sk.mediator.handleKeyPressed(sk.key);
    }

    sk.mousePressed = function () {
        if (!sk.overSelector() && sk.overFloorPlan()) sk.mediator.handleMousePressed();
        else if (sk.overSelector()) sk.isSelected = true;
    }

    sk.mouseDragged = function () {
        if (sk.isSelected) sk.resizeScreen(); // TODO: not recording? add else
    }

    sk.mouseReleased = function () {
        sk.isSelected = false;
    }

    sk.overRect = function (x, y, boxWidth, boxHeight) {
        return sk.mouseX >= x && sk.mouseX <= x + boxWidth && sk.mouseY >= y && sk.mouseY <= y + boxHeight;
    }

    sk.overFloorPlan = function () {
        return sk.overRect(this.floorPlanContainer.xPos, this.floorPlanContainer.yPos, this.floorPlanContainer.width, this.floorPlanContainer.height);
    }

    sk.windowResized = function () {
        this.videoContainer = sk.createVideoContainer(window.innerWidth * (sk.videoContainer.width / sk.width));
        sk.floorPlanContainer = sk.createFloorPlanContainer(window.innerWidth * (sk.floorPlanContainer.xPos / sk.width), window.innerWidth * (sk.floorPlanContainer.width / sk.width));
        sk.resizeCanvas(window.innerWidth, window.innerHeight);
        sk.mediator.updateForResize(sk.videoContainer);
    }

    sk.resizeScreen = function () {
        sk.floorPlanContainer = sk.createFloorPlanContainer(sk.mouseX, sk.width - sk.mouseX);
        this.videoContainer = sk.createVideoContainer(sk.mouseX);
        sk.mediator.updateForResize(sk.videoContainer);
    }

    sk.createFloorPlanContainer = function (xPos, width) {
        return {
            width: width,
            height: sk.height,
            xPos: xPos,
            yPos: 0
        }
    }

    sk.createVideoContainer = function (width) {
        return {
            width: width,
            height: sk.height,
            xPos: 0,
            yPos: 0
        }
    }
});