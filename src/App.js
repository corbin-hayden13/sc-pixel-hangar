import React, { useState, useEffect } from "react";
import EditableArea from "./components/EditableArea.js";
import ImageObject from "./components/ImageObject.js";
import imageData from "./data/image_objects.json";
import SideBar from "./components/SideBar.js";
import './App.css';

function App() {
  const [imageObjects, setImageObjects] = useState([]);

  const handleDragStart = (event, image) => {
    event.dataTransfer.setData('image', JSON.stringify(image));
  };

  useEffect(() => {
    const images = imageData.map(
      img => new ImageObject(img.name, img.filePath, img.rank, {isActive: img.isActive, opacity: img.opacity, position: img.position, scale: img.scale, rotation: img.rotation, selectable: false})
    );
    console.log(`Found ${images.length} images`);
    setImageObjects(images);
  }, []);

  const canvasObj = (
    <div className="App">
      <SideBar images={imageObjects} onDragStart={handleDragStart} />
      <EditableArea images={imageObjects} />
    </div>
  );

  return canvasObj;
}

export default App;
