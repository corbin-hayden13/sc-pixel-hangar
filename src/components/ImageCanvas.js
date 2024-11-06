import React, { useEffect, useRef } from "react";
import { Canvas, FabricImage } from "fabric";

const ImageCanvas = ({ images }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = new Canvas(canvasRef.current, { width: 1600, height: 900 });

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
                if (isActive) canvas.add(fabricImage);
            });
            canvas.renderAll();
        });

        return () => {
            canvas.dispose();
        };
    }, [images]);

    return (
        <div className="ImageCanvas">
            <canvas className="canvas" ref={canvasRef} style={{ border: "1px solid black" }} />
        </div>
    );
}

export default ImageCanvas;