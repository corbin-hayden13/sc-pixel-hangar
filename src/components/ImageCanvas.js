import React, { useEffect, useRef } from "react";
import { Canvas, FabricImage } from "fabric";
import { getImageDimensions } from "../helper-functions.js";
import ImageObject from "./ImageObject.js";

const ImageCanvas = ({ images, setImageObjects }) => {
    const canvasRef = useRef(null);
    const fabricCanvas = useRef(null);

    useEffect(() => {
        fabricCanvas.current = new Canvas(canvasRef.current, { width: 1600, height: 900 });
        console.log(`${images.map((img) => img.isActive)}`);

        Promise.all(
            images.map((imageObj) => {
                return FabricImage.fromURL(imageObj.filePath).then((fabricImage) => {
                    fabricImage.set({
                        left: imageObj.position.x, // left: imageObj.position.x,
                        top: imageObj.position.y,  // top: imageObj.position.y,
                        selectable: imageObj.selectable,
                        opacity: imageObj.opacity,
                        scaleX: imageObj.scale,
                        scaleY: imageObj.scale,
                        angle: imageObj.angle,
                    });
                    fabricImage.uuid = imageObj.uuid;

                    return { fabricImage, rank: imageObj.rank, isActive: imageObj.isActive }
                });
            })
        ).then((loadedImages) => {
            loadedImages.sort((a, b) => a.rank - b.rank).forEach(({ fabricImage, isActive }) => {
                if (isActive) fabricCanvas.current.add(fabricImage);
            });
            fabricCanvas.current.renderAll();
        });

        const handleKeyDown = (e) => {
            if (e.key === "Delete" || e.key === "Backspace") {
                const activeObject = fabricCanvas.current.getActiveObject();
                if (activeObject) {
                    fabricCanvas.current.remove(activeObject);
                    fabricCanvas.current.renderAll();

                    setImageObjects(images.filter(img => img.uuid !== activeObject.uuid));
                }
                else {
                    console.log("No active object found");
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            fabricCanvas.current.dispose();
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [images]);

    const handleImageDrop = async (e) => {
        e.preventDefault();
        const imageObject = ImageObject.copy(JSON.parse(e.dataTransfer.getData("imageObject")));
        console.log(`handleImageDrop: imageObject=${imageObject.filePath}`);

        try {
            const { width, height } = await getImageDimensions(imageObject.filePath);
            const newX = e.nativeEvent.offsetX - (width / 2)
            const newY = e.nativeEvent.offsetY - (height / 2)

            imageObject.isActive = true;
            imageObject.selectable = true;
            imageObject.position = {x: newX, y: newY};

            setImageObjects((prevImageObjects) => [...prevImageObjects, imageObject]);
            console.log(`Adding new image to canvas at position (${newX}, ${newY})`);
        } catch (error) {
            console.log(error);
            return;
        }
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