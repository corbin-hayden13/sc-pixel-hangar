import React, { useEffect, useRef } from "react";
import { Canvas, FabricImage } from "fabric";
import { getImageDimensions } from "../helper-functions.js";
import ImageObject from "./ImageObject.js";

const ImageCanvas = ({ images, setImageObjects, canvasRef, fabricCanvas }) => {
    console.log(`Len images = ${images.length}`);

    useEffect(() => {
        fabricCanvas.current = new Canvas(canvasRef.current, { width: 1600, height: 900 });

        fabricCanvas.current.on("object:modified", handleObjectMoved);

        Promise.all(
            images.map((imageObj) => {
                return FabricImage.fromURL(imageObj.filePath).then((fabricImage) => {
                    fabricImage.set({
                        left: imageObj.position.x,
                        top: imageObj.position.y,
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
            fabricCanvas.current.off("object:modified", handleObjectMoved);
            fabricCanvas.current.dispose();
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [images]);

    const handleImageDrop = async (e) => {
        e.preventDefault();
        const imageObject = ImageObject.copy(JSON.parse(e.dataTransfer.getData("imageObject")));

        try {
            const { width, height } = await getImageDimensions(imageObject.filePath);
            const newX = e.nativeEvent.offsetX - (width / 2)
            const newY = e.nativeEvent.offsetY - (height / 2)

            imageObject.isActive = true;
            imageObject.selectable = true;
            imageObject.moveable = true;
            imageObject.inSideBar = false;
            imageObject.position = {x: newX, y: newY};

            setImageObjects((prevImageObjects) => [...prevImageObjects, imageObject]);
        } catch (error) {
            console.log(error);
            return;
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleObjectMoved = (e) => {
        const movedObject = e.target;
        console.log(`movedObject=${movedObject}`);
    
        if (movedObject && movedObject.uuid) {
            const {uuid, top, left} = movedObject;
    
            setImageObjects((prevImageObjects) => {
                return prevImageObjects.map((imageObj) => {
                    if (imageObj.uuid === uuid) return {...imageObj, position: {x: left, y: top}};
                    else return imageObj;
                });
            });
        }
        else {
            console.log("No object was found for the object:moved event");
        }
    };

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