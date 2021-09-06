import React from 'react'
import { Mediator } from './mediator';
import { Controller } from './controller';

import p5 from 'p5'

class Sketch extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        console.log("hey");
        this.myRef = React.createRef();
    }

    // This uses p5's instance mode for petch creation and namespacing
    Sketch = (p) => {
        p.preload = () => {
            p.font_Lato = p.loadFont("../../assets/fonts/Lato-Light.ttf");
        }

        p.setup = () => {
            p.canvas = p.createCanvas(window.innerWidth, window.innerHeight);
            p.mediator = new Mediator(p);
            p.controller = new Controller(p.mediator);

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

        p.draw = () => {
            console.log("stuff");
            p.mediator.updateDrawLoop();
        }

        p.drawCurPathEndPoint = (point) => {
            p.noStroke();
            p.fill(255, 0, 0);
            p.circle(point.mouseXPos, point.mouseYPos, 25);
        }

        p.drawLineSegment = (curPath) => {
            // Constrain mouse to floor plan display
            const xPos = p.constrain(p.mouseX, p.floorPlanContainer.xPos, p.floorPlanContainer.xPos + p.floorPlanContainer.width);
            const yPos = p.constrain(p.mouseY, p.floorPlanContainer.yPos, p.floorPlanContainer.yPos + p.floorPlanContainer.height);
            const pXPos = p.constrain(p.pmouseX, p.floorPlanContainer.xPos, p.floorPlanContainer.xPos + p.floorPlanContainer.width);
            const pYPos = p.constrain(p.pmouseY, p.floorPlanContainer.yPos, p.floorPlanContainer.yPos + p.floorPlanContainer.height);
            p.strokeWeight(curPath.weight);
            p.stroke(curPath.pColor);
            p.line(xPos, yPos, pXPos, pYPos);
        }

        p.drawPath = (path) => {
            p.stroke(path.pColor);
            p.strokeWeight(path.weight);
            for (let i = 1; i < path.pointArray.length; i++) {
                p.line(path.pointArray[i].mouseXPos, path.pointArray[i].mouseYPos, path.pointArray[i - 1].mouseXPos, path.pointArray[i - 1].mouseYPos);
            }
        }

        /**
         * Draw current movie frame image and white background to GUI in video display
         */
        p.drawVideoFrame = (vp, curVideoTime) => {
            p.drawVideoImage(vp);
            p.drawVideoTimeLabel(curVideoTime);
        }

        p.drawVideoImage = (vp) => {
            p.fill(255);
            p.stroke(255);
            p.rect(p.videoContainer.xPos, p.videoContainer.yPos, p.videoContainer.width, p.videoContainer.height);
            p.image(vp.movieDiv, p.videoContainer.xPos, p.videoContainer.yPos, vp.scaledWidth, vp.scaledHeight);
        }

        p.drawVideoTimeLabel = (curVideoTime) => {
            p.fill(0);
            p.noStroke();
            const labelSpacing = 30;
            const minutes = Math.floor(curVideoTime / 60);
            const seconds = Math.floor(curVideoTime - minutes * 60);
            const label = minutes + " minutes  " + seconds + " seconds";
            p.text(label, p.videoContainer.xPos + labelSpacing / 2, p.videoContainer.yPos + labelSpacing);
        }

        p.drawFloorPlan = (floorPlan) => {
            p.fill(255); // draw white screen in case floor plan image has any transparency
            p.stroke(255);
            p.rect(p.floorPlanContainer.xPos, p.floorPlanContainer.yPos, p.floorPlanContainer.width, p.floorPlanContainer.height);
            p.image(floorPlan, p.floorPlanContainer.xPos, p.floorPlanContainer.yPos, p.floorPlanContainer.width, p.floorPlanContainer.height);
        }

        p.drawLoadDataBackground = () => {
            p.noStroke();
            p.fill(225);
            p.rect(p.floorPlanContainer.xPos, p.floorPlanContainer.yPos, p.floorPlanContainer.width, p.floorPlanContainer.height);
            p.fill(200);
            p.rect(p.videoContainer.xPos, p.videoContainer.yPos, p.videoContainer.width, p.videoContainer.height);
        }

        p.drawIntroScreen = () => {
            const introKeySpacing = 50; // Integer, general spacing variable
            const introTextSize = p.width / 75;
            p.rectMode(p.CENTER);
            p.stroke(0);
            p.strokeWeight(1);
            p.fill(255, 180);
            p.rect(p.width / 2, p.height / 2, p.width / 2 + introKeySpacing, p.height / 2 + introKeySpacing);
            p.fill(0);
            p.textFont(p.font_Lato, introTextSize);
            p.text(p.infoMsg, p.width / 2, p.height / 2, p.width / 2, p.height / 2);
            p.rectMode(p.CORNER);
        }

        /**
         * NOTE: First, constrain mouse x/y pos to floor plan display container
         * then, subtract floorPlan container from constrained mouse x/y pos to set to 0,0 origin and scale x/y positions to input floor plan width / height
         */
        p.getPositioningData = (floorPlan) => {
            const mouseXPos = (p.constrain(p.mouseX, p.floorPlanContainer.xPos, p.floorPlanContainer.xPos + p.floorPlanContainer.width));
            const mouseYPos = (p.constrain(p.mouseY, p.floorPlanContainer.yPos, p.floorPlanContainer.yPos + p.floorPlanContainer.height));
            const pointXPos = (mouseXPos - p.floorPlanContainer.xPos) * (floorPlan.width / p.floorPlanContainer.width);
            const pointYPos = (mouseYPos - p.floorPlanContainer.yPos) * (floorPlan.height / p.floorPlanContainer.height);
            return [mouseXPos, mouseYPos, pointXPos, pointYPos];
        }

        /**
         * While wrapped in a P5 instance, keyPressed and mousePressed P5 methods operate globally on the window (there can't be two of these methods)
         */
        p.keyPressed = () => {
            p.mediator.handleKeyPressed(p.key);
        }

        // p.mousePressed = () => {
        //     if (p.overFloorPlan()) p.mediator.handleMousePressed();
        // }

        p.overRect = (x, y, boxWidth, boxHeight) => {
            return p.mouseX >= x && p.mouseX <= x + boxWidth && p.mouseY >= y && p.mouseY <= y + boxHeight;
        }

        p.overFloorPlan = () => {
            return p.overRect(p.floorPlanContainer.xPos, p.floorPlanContainer.yPos, p.floorPlanContainer.width, p.floorPlanContainer.height);
        }

        p.writeTable = (pointArray) => {
            const headers = ["time", "x", "y"]; // Column headers for outputted .CSV movement files
            let table = new p5.Table();
            table.addColumn(headers[0]);
            table.addColumn(headers[1]);
            table.addColumn(headers[2]);
            for (const point of pointArray) {
                let newRow = table.addRow();
                newRow.setNum(headers[0], point.tPos);
                newRow.setNum(headers[1], point.fpXPos);
                newRow.setNum(headers[2], point.fpYPos);
            }
            return table;
        }
    }

    componentDidMount() {
        //We create a new p5 object on component mount, feed it
        this.myP5 = new p5(this.Sketch, this.myRef.current)
    }

    render() {
        return (
            //This div will contain our p5 petch
            <div ref={this.myRef}></div>
        )
    }
}

export default Sketch