import React from 'react';
import "../css/SideBar.css"; // Styles for the sidebar and scroll container

const SideBar = ({ images, onDragStart }) => {
  return (
    <div className="SideBar">
      <div className="scroll-container">
        {images.map((image, index) => (
          <div
            key={index}
            className="draggable-image"
            draggable
            onDragStart={(e) => onDragStart(e, image)}
          >
            <img src={image.filePath} alt={image.name} className="sidebar-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
