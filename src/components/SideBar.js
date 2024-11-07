import React from 'react';
import "../css/SideBar.css"; // Styles for the sidebar and scroll container

const SideBar = ({ images }) => {
  const handleDragStart = (e, image) => {
    e.dataTransfer.setData("imageObject", JSON.stringify(image));
  };

  return (
    <div className="SideBar">
      <div className="scroll-container">
        {images.filter((imageObj) => imageObj.inSideBar).map((image, index) => (
          <div
            key={index}
            className="draggable-image"
            draggable
            onDragStart={(e) => handleDragStart(e, image)}
            style={{background: "#999"}}
          >
            <img src={image.filePath} alt={image.name} className="sidebar-image" />
            <p style={{margin: "5px 0 0", textAlign: "center"}}><b>{image.name.replace("_", " ").toUpperCase()}</b></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
