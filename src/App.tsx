import React from 'react';
import Sketch from "./components/Sketch/sketch";
import NavBar from "./components/NavBar";

import './App.css';

export default function App() {
  return (
    <div>
      <NavBar></NavBar>

      <div className="App">
        <Sketch />
      </div>
    </div>
  );
}