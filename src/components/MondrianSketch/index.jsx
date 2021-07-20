import React, { useRef, useEffect } from 'react';
import { P5Wrapper } from 'react-p5-wrapper';

import { Mediator } from './mediator';
import { Controller } from './controller';

export default function MondrianSketch(p) {
    let filePaths = {
        floorplan: "",
        video: "",
    }

    p.preload = () => {
        // p.font_Lato = p.loadFont("data/fonts/Lato-Light.ttf");
    }

    p.setup = () => {
        p.mediator = new Mediator(p);
        p.controller = new Controller(p.mediator);

        p.canvas = p.createCanvas(window.innerWidth, window.innerHeight);

        p.floorPlanContainer = {
            width: p.width / 2,
            height: p.height,
            xPos: p.width / 2,
            yPos: 0
        };
        p.videoContainer = {
            width: p.width / 2,
            height: p.height,
            xPos: 0,
            yPos: 0
        };
    }

    p.myCustomRedrawAccordingToNewPropsHandler = props => {
        console.log("Updated");
        if (p.mediator) {
            if (!p.mediator.floorPlanLoaded() || !p.mediator.videoLoaded()) {
                console.log(`Props ${props.filePaths.floorplan}`)
                if (props.filePaths.video) {
                    p.mediator.loadVideo(URL.createObjectURL(props.videoFilePath));
                    console.log("Loaded file video");
                }

                if (props.filePaths.floorplan) {
                    p.mediator.loadFloorPlan(URL.createObjectURL(props.pictureFilePath));
                    console.log("Loaded file floorplan")
                }
            }
        }
    };

    /**
     * Program loop organizes two drawing modes based on whether data is loaded
     */
    p.draw = () => {
        if (p.mediator.allDataLoaded()) {
            p.background(255, 204, 0)
            p.circle(p.width / 2, p.height / 2, 50)
        } else {
            p.background('red')
            p.circle(p.width / 2, p.height / 2, 0)
        }
        // if (p.mediator.allDataLoaded()) {
        //     if (p.mediator.getIsRecording()) p.mediator.updateRecording(); // records data and updates visualization if in record mode
        //     else p.mediator.updateCurPathBug();
        //     // If info screen showing, redraw current screen first, then drawKeys
        //     if (p.mediator.getIsInfoShowing()) {
        //         p.mediator.updateAllData();
        //         p.drawIntroScreen();
        //     }
        // } else {
        //     console.log(props.video);
        //     p.drawLoadDataGUI();
        //     if (p.mediator.floorPlanLoaded()) p.mediator.updateFloorPlan();
        //     else if (p.mediator.videoLoaded()) p.mediator.updateVideoFrame();
        //     if (p.mediator.getIsInfoShowing()) p.drawIntroScreen();
        // }
    }

    /**
     * Draws circle for last index in current path being recorded
     * @param  {Float/Number} xPos
     * @param  {Float/Number} yPos
     */
    p.drawCurPathBug = function (xPos, yPos) {
        const rewindBugSize = 25;
        p.noStroke();
        p.fill(255, 0, 0);
        p.circle(p.scaleXposToDisplay(xPos), p.scaleYposToDisplay(yPos), rewindBugSize);
    }

    p.drawLineSegment = function (curPath) {
        // Constrain mouse to floor plan display
        const xPos = p.constrain(p.mouseX, p.floorPlanContainer.xPos, p.floorPlanContainer.xPos + p.floorPlanContainer.width);
        const yPos = p.constrain(p.mouseY, p.floorPlanContainer.yPos, p.floorPlanContainer.yPos + p.floorPlanContainer.height);
        const pXPos = p.constrain(p.pmouseX, p.floorPlanContainer.xPos, p.floorPlanContainer.xPos + p.floorPlanContainer.width);
        const pYPos = p.constrain(p.pmouseY, p.floorPlanContainer.yPos, p.floorPlanContainer.yPos + p.floorPlanContainer.height);
        p.strokeWeight(curPath.weight);
        p.stroke(curPath.pColor);
        p.line(xPos, yPos, pXPos, pYPos);
    }

    p.drawAllPaths = function (pathsList, curPath) {
        for (const path of pathsList) p.drawPath(path);
        p.drawPath(curPath); // draw current path last
    }

    p.drawPath = () => {
        p.stroke(p.pColor);
        p.strokeWeight(p.weight);
        for (let i = 1; i < p.xPos.length; i++) {
            p.line(p.scaleXposToDisplay(p.xPos[i]), p.scaleYposToDisplay(p.yPos[i]), p.scaleXposToDisplay(p.xPos[i - 1]), p.scaleYposToDisplay(p.yPos[i - 1]));
        }
    }

    p.scaleXposToDisplay = function (xPos) {
        return p.floorPlanContainer.xPos + (xPos / (p.mediator.getFloorPlanWidth() / p.floorPlanContainer.width));
    }

    p.scaleYposToDisplay = function (yPos) {
        return p.floorPlanContainer.yPos + (yPos / (p.mediator.getFloorPlanHeight() / p.floorPlanContainer.height));
    }

    /**
     * Draw current movie frame image and white background to GUI in video display
     */
    p.drawVideoFrame = function (vp) {
        p.fill(255);
        p.stroke(255);
        p.rect(p.videoContainer.xPos, p.videoContainer.yPos, p.videoContainer.width, p.videoContainer.height);
        p.image(vp.movieDiv, p.videoContainer.xPos, p.videoContainer.yPos, vp.reScaledMovieWidth, vp.reScaledMovieHeight);
    }

    p.drawVideoTimeLabel = function (curMovieTime) {
        p.fill(0);
        p.noStroke();
        const labelSpacing = 30;
        const minutes = Math.floor(curMovieTime / 60);
        const seconds = Math.floor(curMovieTime - minutes * 60);
        const label = minutes + " minutes  " + seconds + " seconds";
        p.text(label, p.videoContainer.xPos + labelSpacing / 2, p.videoContainer.yPos + labelSpacing);
    }

    p.drawFloorPlan = function (floorPlan) {
        p.fill(255); // draw white screen in case floor plan image has any transparency
        p.stroke(255);
        p.rect(p.floorPlanContainer.xPos, p.floorPlanContainer.yPos, p.floorPlanContainer.width, p.floorPlanContainer.height);
        p.image(floorPlan, p.floorPlanContainer.xPos, p.floorPlanContainer.yPos, p.floorPlanContainer.width, p.floorPlanContainer.height);
    }

    /**
     * Draws floor plan, video, and key windows
     */
    p.drawLoadDataGUI = function () {
        p.noStroke();
        p.fill(225);
        p.rect(p.floorPlanContainer.xPos, p.floorPlanContainer.yPos, p.floorPlanContainer.width, p.floorPlanContainer.height);
        p.fill(200);
        p.rect(p.videoContainer.xPos, p.videoContainer.yPos, p.videoContainer.width, p.videoContainer.height);
    }

    p.drawIntroScreen = function () {
        const introKeySpacing = 50; // Integer, general spacing variable
        const introTextSize = p.width / 75;
        p.rectMode(p.CENTER);
        p.stroke(0);
        p.strokeWeight(1);
        p.fill(255, 180);
        p.rect(p.width / 2, p.height / 2, p.width / 2 + introKeySpacing, p.height / 2 + introKeySpacing);
        p.fill(0);
        p.textFont(p.font_Lato, introTextSize);
        p.rectMode(p.CORNER);
    }

    /**
     * Returns scaled mouse x/y position to input floorPlan image file
     */
    p.getScaledMousePos = function (floorPlan) {
        // Constrain mouse to floor plan display and subtract floorPlan display x/y positions to set data to 0, 0 origin/coordinate system
        const x = (p.constrain(p.mouseX, p.floorPlanContainer.xPos, p.floorPlanContainer.xPos + p.floorPlanContainer.width)) - p.floorPlanContainer.xPos;
        const y = (p.constrain(p.mouseY, p.floorPlanContainer.yPos, p.floorPlanContainer.yPos + p.floorPlanContainer.height)) - p.floorPlanContainer.yPos;
        // Scale x,y positions to input floor plan width/height
        const xPos = +(x * (floorPlan.width / p.floorPlanContainer.width)).toFixed(2);
        const yPos = +(y * (floorPlan.height / p.floorPlanContainer.height)).toFixed(2);
        return [xPos, yPos];
    }

    /**
     * While wrapped in a P5 instance, p P5 method operates globally on the window (there can't be two of these methods)
     */
    p.keyPressed = () => {
        if (p.mediator.allDataLoaded()) {
            if (p.key === 'r' || p.key === 'R') p.mediator.rewind();
            else if (p.key === 'f' || p.key === 'F') p.mediator.fastForward();
        }
    }

    p.mousePressed = () => {
        if (p.mediator.allDataLoaded() && p.overRect(p.floorPlanContainer.xPos, p.floorPlanContainer.yPos, p.floorPlanContainer.width, p.floorPlanContainer.height)) {
            p.mediator.playPauseRecording();
        }
    }

    p.overRect = (x, y, boxWidth, boxHeight) => {
        return p.mouseX >= x && p.mouseX <= x + boxWidth && p.mouseY >= y && p.mouseY <= y + boxHeight;
    };
}