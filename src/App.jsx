import React, { useState } from 'react';

import MondrianSketch from './components/MondrianSketch';
import ReactP5Wrapper from "react-p5-wrapper";

import NavBar from './components/NavBar';

import './App.css';

export default function App() {
  const [floorplan, setFloorplan] = useState("");
  const [video, setVideo] = useState("");

  const handleInput = (e) => {
    const fileUrl = e.target.value;
    console.log(fileUrl);

    if (fileUrl.includes("mp4")) {
      setVideo(e.target.value);
    } else {
      setFloorplan(e.target.value);
    }
  }

  return (
    <div>
      <NavBar
        handleInput={handleInput}
        floorplan={floorplan}
        video={video}
      />
      <ReactP5Wrapper
        sketch={MondrianSketch}
        video={video}
        floorplan={floorplan}
      />
    </div>
  );
}