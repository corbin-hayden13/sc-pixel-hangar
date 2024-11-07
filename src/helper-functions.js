const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
  

const getImageDimensions = (filePath) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = filePath;

        img.onload = () => {
            resolve({width: img.naturalWidth, height: img.naturalHeight});
        };

        img.onerror = () => {
            reject(new Error(`Failed to load image at file path ${filePath}`));
        };
    });
};

export { generateUUID, getImageDimensions };