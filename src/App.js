import React, { useState, useEffect, useRef } from "react";
import EditableArea from "./components/EditableArea.js";
import ImageObject from "./components/ImageObject.js";
import imageData from "./data/image_objects.json";
import SideBar from "./components/SideBar.js";
import TopBar from "./components/TopBar.js";
import './App.css';

function App() {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);

  const appInitialized = useRef(false);

  const [imageObjects, setImageObjects] = useState([]);
  const [benniesHenge, setBenniesHenge] = useState(false);
  const [cargo, setCargo] = useState(false);
  const [people, setPeople] = useState(false);

  const nameStatePairs = {
    "bennies": benniesHenge,
    "cargo": cargo,
    "people": people,
  };

  const keyImageNamePairs = {
    "Bennies Henge": "bennies",
    "People": "people",
    "Cargo": "cargo",
  };

  const makeDefaultHangar = () => {
    fabricCanvas.current.getObjects().forEach((imgObj) => fabricCanvas.current.remove(imgObj));
    const images = imageData.map(
      img => new ImageObject(img.name, img.filePath, img.rank, {isActive: img.isActive, inSideBar: img.inSideBar, opacity: img.opacity, position: img.position, scale: img.scale, rotation: img.rotation, selectable: false})
    ).filter((imgObj) => !imgObj.inSideBar);
    setBenniesHenge(false);
    setCargo(false);
    setPeople(false);
    setImageObjects(images);
  }

  useEffect(() => {
    if (appInitialized.current) return;

    const savedHangarState = JSON.parse(localStorage.getItem("hangarState"));
    console.log(`Previous Hangar State = ${localStorage.getItem("hangarState")}`);
    if (savedHangarState && savedHangarState.length > 0) {
      setImageObjects(savedHangarState);
    }
    else makeDefaultHangar();

    appInitialized.current = true;
  }, []);

  useEffect(() => {
    localStorage.setItem("hangarState", JSON.stringify(imageObjects));
  }, [imageObjects]);

  const onToggleOverlay = (key, newState) => {
    setImageObjects((prevImageObjects) => {
      return prevImageObjects.map((imgObj) => imgObj.name === keyImageNamePairs[key] ? {...imgObj, isActive: newState} : (nameStatePairs[imgObj.name]) ? {...imgObj, isActive: nameStatePairs[imgObj.name]} : imgObj);
    });
  };

  const handleImageSave = () => {
    if (fabricCanvas.current) {
      const dataURL = fabricCanvas.current.toDataURL({
        format: 'png',
        quality: 1.0,
      });

      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'image_canvas.png';
      link.click();
    }
  };

  const topBarArgs = {
    onToggleOverlay, handleImageSave,
    benniesHenge, setBenniesHenge,
    cargo, setCargo,
    people, setPeople,
    clearHangar: makeDefaultHangar
  };

  const editableAreaArgs = {
    setImageObjects,
    images: imageObjects,
    canvasRef, fabricCanvas
  }

  const canvasObj = (
    <div className="App">
      <TopBar {...topBarArgs}/>
      <div className="main-content">
        <SideBar images={
          imageData.map(
            img => new ImageObject(img.name, img.filePath, img.rank, {isActive: img.isActive, inSideBar: img.inSideBar, opacity: img.opacity, position: img.position, scale: img.scale, rotation: img.rotation, selectable: false})
          ).filter((imgObj) => imgObj.inSideBar)
        } />
        <EditableArea {...editableAreaArgs}/>
      </div>
    </div>
  );

  return canvasObj;
}

export default App;
