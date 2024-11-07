import React, { useState, useEffect } from "react";
import EditableArea from "./components/EditableArea.js";
import ImageObject from "./components/ImageObject.js";
import imageData from "./data/image_objects.json";
import SideBar from "./components/SideBar.js";
import TopBar from "./components/TopBar.js";
import './App.css';

function App() {
  const [imageObjects, setImageObjects] = useState([]);
  const [benniesHenge, setBenniesHenge] = useState(false);
  const [cargo, setCargo] = useState(false);
  const [people, setPeople] = useState(false);

  const nameStatePairs = {
    "bennies": benniesHenge,
    "cargo": cargo,
    "people": people,
  };

  useEffect(() => {
    const images = imageData.map(
      img => new ImageObject(img.name, img.filePath, img.rank, {isActive: img.isActive, inSideBar: img.inSideBar, opacity: img.opacity, position: img.position, scale: img.scale, rotation: img.rotation, selectable: false})
    );
    setImageObjects(images);
  }, []);

  const onToggleOverlay = (key, newState) => {
    const keyImageNamePairs = {
      "Bennies Henge": "bennies",
      "People": "people",
      "Cargo": "cargo",
    };

    setImageObjects((prevImageObjects) => {
      return prevImageObjects.map((imgObj) => imgObj.name === keyImageNamePairs[key] ? {...imgObj, isActive: newState} : (nameStatePairs[imgObj.name]) ? {...imgObj, isActive: nameStatePairs[imgObj.name]} : imgObj);
    });
  };

  const topBarArgs = {
    onToggleOverlay,
    benniesHenge, setBenniesHenge,
    cargo, setCargo,
    people, setPeople,
  };

  const canvasObj = (
    <div className="App">
      <TopBar {...topBarArgs}/>
      <div className="main-content">
        <SideBar images={imageObjects} />
        <EditableArea images={imageObjects} setImageObjects={setImageObjects}/>
      </div>
    </div>
  );

  return canvasObj;
}

export default App;
