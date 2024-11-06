
import ImageCanvas from "./ImageCanvas.js";
import "../css/EditableArea.css";

function EditableArea({ images, setImageObjects }) {
    return (
        <div className="EditableArea">
            <ImageCanvas images={images} setImageObjects={setImageObjects}/>
        </div>
    );
}

export default EditableArea;