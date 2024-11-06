import React, { useEffect, useRef } from "react";
import { Canvas, FabricImage } from "fabric";

const ImageCanvas = ({ images }) => {
    const canvasRef = useRef(null);
    const fabricCanvas = useRef(null);

    useEffect(() => {
        fabricCanvas.current = new Canvas(canvasRef.current, { width: 1600, height: 900 });

        Promise.all(
            images.map((imageObj) => {
                return FabricImage.fromURL(imageObj.filePath).then((fabricImage) => {
                    fabricImage.set({
                        left: 0, // left: imageObj.position.x,
                        top: 0,  // top: imageObj.position.y,
                        selectable: imageObj.selectable,
                        opacity: imageObj.opacity,
                        scaleX: imageObj.scale,
                        scaleY: imageObj.scale,
                        angle: imageObj.angle,
                    });

                    return { fabricImage, rank: imageObj.rank, isActive: imageObj.isActive }
                });
            })
        ).then((loadedImages) => {
            loadedImages.sort((a, b) => a.rank - b.rank).forEach(({ fabricImage, isActive }) => {
                if (isActive) fabricCanvas.current.add(fabricImage);
            });
            fabricCanvas.current.renderAll();
        });

        return () => {
            fabricCanvas.current.dispose();
        };
    }, [images]);

    const handleImageDrop = (e) => {
        e.preventDefault();
        const filePath = e.dataTransfer.getData("imageFilePath");

        FabricImage.fromURL(filePath).then((fabricImage) => {
            const img = new Image();
            img.src = filePath;
            img.onload = () => {
                const imgWidth = img.naturalWidth;
                const imgHeight = img.naturalHeight;

                fabricImage.set({
                    left: e.nativeEvent.offsetX - (imgWidth / 2), // left: imageObj.position.x,
                    top: e.nativeEvent.offsetY - (imgHeight / 2),  // top: imageObj.position.y,
                    selectable: true,
                    opacity: 1,
                    scaleX: 1,
                    scaleY: 1,
                    angle: 0,
                });
                fabricCanvas.current.add(fabricImage);
                fabricCanvas.current.renderAll();
            };
        });
    };

    const handleDragOver = (e) => e.preventDefault();

    return (
        <div
            className="ImageCanvas"
            onDrop={handleImageDrop}
            onDragOver={handleDragOver}
        >
            <canvas className="canvas" ref={canvasRef} style={{ border: "1px solid black" }} />
        </div>
    );
}

export default ImageCanvas;