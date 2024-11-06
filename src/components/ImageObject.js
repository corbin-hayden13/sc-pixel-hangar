import { generateUUID } from "../helper-functions.js";

class ImageObject {
    constructor(name, filePath, rank, { isActive=false, inSideBar=true, opacity = 1, position = { x: 0, y: 0 }, scale = 1, rotation = 0, selectable = false } = {}) {
        this.name = name;          // Name or ID of the image, e.g., 'background' or 'character'
        this.filePath = filePath;  // Path to the image in the assets folder, e.g., 'assets/images/background.png'
        this.rank = rank;          // Integer rank for layering, lower values are 'behind' higher values
        this.isActive = isActive;
        this.inSideBar = inSideBar;
        this.opacity = opacity;    // Opacity level (0 to 1) to manage transparency
        this.position = position;  // Object with x and y coordinates for positioning
        this.scale = scale;        // Scale factor for resizing
        this.rotation = rotation;  // Rotation in degrees
        this.selectable = selectable;
        this.uuid = generateUUID();
    }

    static copy(other) {
        return new ImageObject(
            other.name,
            other.filePath,
            other.rank,
            {
                isActive: other.isActive,
                inSideBar: other.inSideBar,
                opacity: other.opactiy,
                position: {...other.position},
                scale: other.scale,
                rotation: other.rotation,
                selectable: other.selectable,
            }
        );
    }

    // Method to update the position
    setPosition(x, y) {
        this.position = { x, y };
    }

    // Method to change the rank
    setRank(newRank) {
        this.rank = newRank;
    }

    toggleActive() {
        this.isActive = !this.isActive;
    }

    deactivate() {
        this.isActive = false;
    }

    activate() {
        this.isActive = true;
    }

    // Method to adjust opacity
    setOpacity(opacity) {
        this.opacity = Math.max(0, Math.min(1, opacity)); // Ensure opacity is within bounds
    }

    // Method to change scale
    setScale(scale) {
        this.scale = scale;
    }

    // Method to rotate the image
    setRotation(rotation) {
        this.rotation = rotation % 360; // Keep rotation within 0–359 degrees
    }
}

export default ImageObject;