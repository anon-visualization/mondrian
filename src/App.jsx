import React, { useState, useEffect } from 'react';

import MondrianSketch from './components/MondrianSketch';
import P5Wrapper from "react-p5-wrapper";

import NavBar from './components/NavBar';
import FileHandler from './utils/FileHandler';

import './App.css';

const initialFilePaths = {
  floorplan: "",
  video: "",
};

export default function App() {
  const [filePaths, setFilePaths] = useState(initialFilePaths);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFilePaths({
      ... filePaths,
      [name]: value,
    });
  };

  return (
    <div>
      <NavBar onChange={onChange} filePaths={filePaths} />
      <P5Wrapper
        sketch={MondrianSketch}
        filePaths={filePaths}
      />
    </div>
  );
}