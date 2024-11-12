import React, { useState, useEffect, useRef } from "react";
import { addMetadataFromBase64DataURI, getMetadata } from "meta-png";
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

  const metadataKey = "imageObjects";

  const nameStatePairs = {
    "bennies": benniesHenge,
    "cargo": cargo,
    "people": people,
  };

  const nameSetStatePairs = {
    "bennies": setBenniesHenge,
    "cargo": setCargo,
    "people": setPeople,
  };

  const keyImageNamePairs = {
    "Bennies Henge": "bennies",
    "People": "people",
    "Cargo": "cargo",
  };

  const makeDefaultHangar = () => {
    console.log("Making default hangar...");
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
      const metadata = JSON.stringify(imageObjects);

      try {
        // Add metadata to the base64 data URL
        const pngWithMetadata = addMetadataFromBase64DataURI(dataURL, metadataKey, metadata);
        
        // Strip off the data URI prefix to get only the base64-encoded string
        const base64Data = pngWithMetadata.replace(/^data:image\/png;base64,/, '');
        
        // Decode base64 string to binary data
        const binaryString = window.atob(base64Data);
        const binaryLength = binaryString.length;
        const bytes = new Uint8Array(binaryLength);
        
        for (let i = 0; i < binaryLength; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
      
        // Create a Blob from the binary data
        const blob = new Blob([bytes], { type: 'image/png' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'image_canvas.png';
        link.click();
      } catch (e) {
        console.error(`App.js: Error adding metadata to PNG ${e}`);
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageObjectsMetadata = getMetadata(new Uint8Array(await file.arrayBuffer()), metadataKey);
      const metadataObj = JSON.parse(imageObjectsMetadata);
      if (metadataObj) {
        makeDefaultHangar();
        metadataObj.forEach((imgObj) => {
          if (Object.keys(nameSetStatePairs).includes(imgObj.name)) {
            nameSetStatePairs[imgObj.name](imgObj.isActive);
          }
        });
        setImageObjects(metadataObj);

        e.target.value = null;
      }
      else console.error(`Error parsing metadata: ${imageObjectsMetadata}`);
    }
    else console.error("No file found for image upload...");
  }

  const topBarArgs = {
    onToggleOverlay, handleImageSave, handleImageUpload,
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
