import React, { useState, useEffect } from 'react';
import MondrianSketch from './components/MondrianSketch';
import NavBar from './components/NavBar';
import FileHandler from './utils/FileHandler';
import ReactPlayer from "react-player";

import './App.css';

export default function App() {
  const [videoFileName, setVideoFileName] = useState('');
  const [videoFile, setVideoFile] = useState('')
  const [videoFilePath, setVideoFilePath] = useState(null);

  const onChange = (e) => {
    console.log(`=======================!!!!! ${e.name}`);
    setVideoFilePath(URL.createObjectURL(e));
  }

  return (
    <div>
      <NavBar onChange={onChange} videoFileName={videoFileName} />
      {/* <ReactPlayer url={videoFilePath} width="100%" height="100%" controls={true} /> */}
      <div className='App'>
        <MondrianSketch videoFileName={videoFileName} videoFile={videoFile}/>
      </div>
    </div>
  );
}