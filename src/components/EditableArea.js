
import ImageCanvas from "./ImageCanvas.js";
import "../css/EditableArea.css";

function EditableArea({ images, setImageObjects, canvasRef, fabricCanvas }) {
    return (
        <div className="EditableArea">
            <ImageCanvas images={images} setImageObjects={setImageObjects} canvasRef={canvasRef} fabricCanvas={fabricCanvas}/>
        </div>
    );
}

export default EditableArea;