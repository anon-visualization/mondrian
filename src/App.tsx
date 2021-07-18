import React, { useState, useEffect } from 'react';
import Sketch from './components/Sketch';
import NavBar from './components/NavBar';

import './App.css';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [video, setVideo] = useState('');
  const [floorPlan, setFloorplan] = useState('');
  return (
    <div>
      <NavBar></NavBar>

      <div className='App'>
        <Sketch />
      </div>
    </div>
  );
}