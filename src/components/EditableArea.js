import ImageCanvas from "./ImageCanvas.js";
import "../css/EditableArea.css";

function EditableArea({ images }) {
    return (
        <div className="EditableArea">
            <ImageCanvas images={images} />
        </div>
    );
}

export default EditableArea;