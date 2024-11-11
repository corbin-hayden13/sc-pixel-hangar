import React, { useEffect } from "react";
import { Canvas, FabricImage } from "fabric";
import { getImageDimensions } from "../helper-functions.js";
import ImageObject from "./ImageObject.js";

const ImageCanvas = ({ images, setImageObjects, canvasRef, fabricCanvas }) => {
    useEffect(() => {
        if (!fabricCanvas.current) fabricCanvas.current = new Canvas(canvasRef.current, { width: 1600, height: 900 });
        fabricCanvas.current.on("object:modified", handleObjectMoved);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            fabricCanvas.current.off("object:modified", handleObjectMoved);
            fabricCanvas.current.clear();
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const canvas = fabricCanvas.current;
        if (!canvas) return;

        const existingObjects = canvas.getObjects().reduce((acc, obj) => {
            if (obj.uuid) acc[obj.uuid] = obj;
            return acc;
        }, {});

        console.log(canvas.getObjects().map((imgObj) => imgObj.name).join(", "));

        canvas.getObjects().forEach((canvasObj) => {
            const correspondingImage = images.find((img) => img.uuid === canvasObj.uuid);
            if (correspondingImage && !correspondingImage.isActive) {
                canvasObj.opacity = 0;
            }
            if (correspondingImage) {
                if (correspondingImage.isActive) {
                    correspondingImage.opacity = 1;
                    canvasObj.opacity = 1;
                }
                else {
                    correspondingImage.opactiy = 0;
                    canvasObj.opacity = 0;
                }
            }
        });

        // Create promises for images, loading only new ones
        const imagePromises = images.map((imageObj) => {
            const existingImage = existingObjects[imageObj.uuid];

            // If image already exists, update its position if needed
            if (existingImage) {
                if (
                    existingImage.left !== imageObj.position.x ||
                    existingImage.top !== imageObj.position.y
                ) {
                    existingImage.set({
                        left: imageObj.position.x,
                        top: imageObj.position.y,
                    });
                    existingImage.setCoords();
                }
                // Return a resolved promise for existing images to keep Promise.all consistent
                return Promise.resolve();
            } else {
                // For new images, load and add them to the canvas
                return FabricImage.fromURL(imageObj.filePath).then((fabricImage) => {
                    fabricImage.set({
                        left: imageObj.position.x,
                        top: imageObj.position.y,
                        selectable: imageObj.selectable,
                        opacity: imageObj.isActive ? 1 : 0,
                        scaleX: imageObj.scale,
                        scaleY: imageObj.scale,
                        angle: imageObj.angle,
                    });
                    fabricImage.uuid = imageObj.uuid;
                    fabricImage.name = imageObj.name;
                    return { fabricImage, rank: imageObj.rank };
                });
            }
        });

        // Wait for new images to load, then render them in sorted order by rank
        Promise.all(imagePromises).then((loadedImages) => {
            // Filter out undefined entries from existing images (from resolved promises)
            loadedImages
                .filter((item) => item) // Only keep newly loaded images
                .sort((a, b) => a.rank - b.rank)
                .forEach(({ fabricImage }) => { canvas.add(fabricImage); });

            canvas.renderAll();
        });
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

    const handleKeyDown = (e) => {
        if (e.key === "Delete" || e.key === "Backspace") {
            const activeObject = fabricCanvas.current.getActiveObject();
            if (activeObject) {
                const oldUUID = activeObject.uuid;
                fabricCanvas.current.remove(activeObject);

                setImageObjects((prevImageObjects) => prevImageObjects.filter(img => img.uuid !== oldUUID));
            }
            else {
                console.log("No active object found");
            }
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