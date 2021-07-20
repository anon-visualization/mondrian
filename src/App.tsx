import React, { useState, useEffect } from 'react';
import MondrianSketch from './components/MondrianSketch';
import NavBar from './components/NavBar';
import FileHandler from './utils/FileHandler';

import './App.css';

export default function App() {
  const [videoFile, setVideoFile] = useState('');

  const onChange = (data: any) => {
    setVideoFile(data);
    console.log(`DATA!!!!! ${data.name}`);
  }

  return (
    <div>
      <NavBar onChange={ onChange } data={videoFile} />

      <div className='App'>
        <MondrianSketch { ... videoFile}/>
      </div>
    </div>
  );
}